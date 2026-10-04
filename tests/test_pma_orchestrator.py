import re
import uuid
from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest

from app.adapters.models import ColumnInfo, ConnectionTestResult, TableInfo
from app.pma.errors import PmaAssessmentError, PmaHealthCheckError
from app.pma.orchestrator import PmaAssessmentOrchestrator, build_batch_name

SYSTEM = {
    "system_id": "sys-1",
    "system_name": "SourceDB",
    "system_role": "SOURCE",
    "database_type": "POSTGRES",
    "connection_config": {"host": "localhost", "port": 5432, "database": "migration_source"},
    "credential_id": "cred-1",
    "project_id": "proj-1",
}

TENANT = "tenant-1"
PROJECT = "proj-1"
SYSTEM_ID = "sys-1"
NOW = datetime(2026, 10, 3, 14, 30)  # noqa: DTZ001


def _columns_for(schema, table):
    if table == "accounts":
        return [
            ColumnInfo(column_name="id", data_type="integer", is_nullable=False,
                       is_primary_key=True),
            ColumnInfo(column_name="balance", data_type="numeric", is_nullable=True),
            ColumnInfo(column_name="name", data_type="text", is_nullable=True),
        ]
    return [ColumnInfo(column_name="event", data_type="text", is_nullable=True)]


def make_adapter():
    adapter = MagicMock()
    adapter.test_connection.return_value = ConnectionTestResult(
        success=True, message="ok", latency_ms=5, server_version="16.4"
    )
    adapter.list_tables.return_value = [
        TableInfo(schema_name="public", table_name="accounts", table_type="BASE TABLE"),
        TableInfo(schema_name="public", table_name="audit_log", table_type="VIEW"),
    ]
    adapter.list_columns.side_effect = _columns_for
    return adapter


def norm(sql):
    return " ".join(str(sql).split())


def all_sql(engine_db):
    statements = []
    for method in (engine_db.execute, engine_db.fetch_all):
        for call in method.call_args_list:
            if call.args:
                statements.append(norm(call.args[0]))
    return statements


@pytest.fixture
def env():
    engine_db = MagicMock()
    adapter = make_adapter()
    with patch("app.pma.orchestrator.SystemService") as system_service_cls, \
            patch("app.pma.orchestrator.CredentialService") as credential_service_cls, \
            patch("app.pma.orchestrator.AdapterRegistry") as adapter_registry:
        system_service = system_service_cls.return_value
        system_service.get_system.return_value = dict(SYSTEM)
        system_service._build_adapter_config.return_value = "adapter-config"
        credential_service_cls.return_value.get_decrypted_credentials.return_value = {
            "username": "user",
            "password": "secret",
        }
        adapter_registry.get.return_value = MagicMock(return_value=adapter)
        yield {
            "engine_db": engine_db,
            "adapter": adapter,
            "system_service": system_service,
            "adapter_registry": adapter_registry,
            "credential_service": credential_service_cls.return_value,
        }


def run_assessment(env, now=NOW):
    orchestrator = PmaAssessmentOrchestrator(env["engine_db"])
    return orchestrator.run(TENANT, PROJECT, SYSTEM_ID, now=now)


def batch_registry_statements(engine_db):
    return [
        call for call in engine_db.execute.call_args_list
        if "migration_batch_registry" in norm(call.args[0])
    ]


class TestAValidAssessment:

    def test_context_has_all_phase5a_fields(self, env):
        context = run_assessment(env)

        assert context.tenant_id == TENANT
        assert context.project_id == PROJECT
        assert context.system_id == SYSTEM_ID
        assert context.system_name == "SourceDB"
        assert context.assessment_type == "PMA"
        uuid.UUID(context.batch_id)
        assert context.started_at == NOW
        assert context.adapter is env["adapter"]
        assert context.health_check.success is True
        assert context.health_check.server_version == "16.4"
        assert context.working_set is not None
        assert context.working_set.system_id == SYSTEM_ID
        assert context.batch_name.startswith("PMA-SourceDB")
        assert context.applicable_controls == []
        assert context.evidence_policy is None

    def test_adapter_connection_closed_after_assessment(self, env):
        run_assessment(env)
        env["adapter"].connect.assert_called_once_with("adapter-config")
        env["adapter"].close.assert_called_once()


class TestBCrossTenantRejected:

    def test_foreign_system_rejected_before_any_discovery(self, env):
        env["system_service"].get_system.side_effect = Exception("System not found")

        with pytest.raises(PmaAssessmentError, match="System not found or access denied"):
            run_assessment(env)

        env["adapter_registry"].get.assert_not_called()
        env["adapter"].list_tables.assert_not_called()
        assert batch_registry_statements(env["engine_db"]) == []


class TestCHealthCheckBlocksDiscovery:

    def test_failed_connection_test_blocks_discovery(self, env):
        env["adapter"].test_connection.return_value = ConnectionTestResult(
            success=False, message="connection refused", latency_ms=0
        )

        with pytest.raises(PmaHealthCheckError, match="connection refused"):
            run_assessment(env)

        env["adapter"].connect.assert_not_called()
        env["adapter"].list_tables.assert_not_called()
        assert batch_registry_statements(env["engine_db"]) == []

    def test_connect_failure_blocks_discovery(self, env):
        env["adapter"].connect.side_effect = OSError("cannot connect")

        with pytest.raises(PmaHealthCheckError, match="cannot connect"):
            run_assessment(env)

        env["adapter"].list_tables.assert_not_called()
        assert batch_registry_statements(env["engine_db"]) == []

    def test_connection_test_exception_blocks_discovery(self, env):
        env["adapter"].test_connection.side_effect = OSError("network unreachable")

        with pytest.raises(PmaHealthCheckError, match="network unreachable"):
            run_assessment(env)

        env["adapter"].list_tables.assert_not_called()
        assert batch_registry_statements(env["engine_db"]) == []

    def test_failed_select_one_validation_blocks_discovery(self, env):
        env["adapter"].execute.side_effect = Exception("SELECT 1 failed")

        with pytest.raises(PmaHealthCheckError, match="Health check failed"):
            run_assessment(env)

        env["adapter"].list_tables.assert_not_called()
        assert batch_registry_statements(env["engine_db"]) == []


class TestDWorkingSet:

    def test_working_set_populated_from_single_adapter(self, env):
        context = run_assessment(env)
        working_set = context.working_set

        assert working_set.system_id == SYSTEM_ID
        assert working_set.table_count == 2
        assert working_set.column_count == 4
        assert [t.entity_name for t in working_set.tables] == [
            "public.accounts",
            "public.audit_log",
        ]

        accounts = working_set.tables[0]
        assert accounts.schema_name == "public"
        assert accounts.table_name == "accounts"
        assert accounts.table_type == "BASE TABLE"
        assert [c.column_name for c in accounts.columns] == ["id", "balance", "name"]
        assert [c.column_position for c in accounts.columns] == [1, 2, 3]

        identifier = accounts.columns[0]
        assert identifier.data_type == "integer"
        assert identifier.is_nullable is False
        assert identifier.is_primary_key is True
        assert identifier.is_numeric is True
        assert accounts.columns[1].is_numeric is True
        assert accounts.columns[2].is_numeric is False

        env["adapter"].list_columns.assert_any_call("public", "accounts")
        env["adapter"].list_columns.assert_any_call("public", "audit_log")

    def test_empty_database_yields_empty_working_set(self, env):
        env["adapter"].list_tables.return_value = []

        context = run_assessment(env)

        assert context.working_set.table_count == 0
        assert context.working_set.column_count == 0
        assert batch_registry_statements(env["engine_db"])


class TestEZeroDatasetMappingRows:

    def test_no_dataset_mappings_touched(self, env):
        run_assessment(env)

        statements = all_sql(env["engine_db"])
        for forbidden in ("dataset_mappings", "rule_dataset_mapping", "discovered_datasets"):
            assert not any(forbidden in s for s in statements), forbidden


class TestFZeroColumnMappingRows:

    def test_no_column_mappings_touched(self, env):
        run_assessment(env)

        statements = all_sql(env["engine_db"])
        for forbidden in ("column_mappings", "discovered_columns"):
            assert not any(forbidden in s for s in statements), forbidden


class TestGSingleSystemSelection:

    def test_one_system_one_adapter_no_target_resolution(self, env):
        run_assessment(env)

        env["system_service"].get_system.assert_called_once_with(
            SYSTEM_ID, tenant_id=TENANT, project_id=PROJECT
        )
        env["adapter_registry"].get.assert_called_once_with("postgres")

        statements = all_sql(env["engine_db"])
        assert not any("system_registry" in s for s in statements)
        assert not any("dataset_mappings" in s for s in statements)
        assert not any("SOURCE" in s and "TARGET" in s for s in statements)


class TestHBatchIdentity:

    def test_batch_name_format_and_correct_batch_id(self, env):
        context = run_assessment(env)

        assert context.batch_name == "PMA-SourceDB - 2026-10-03 14:30"
        assert re.match(r"^PMA-SourceDB - \d{4}-\d{2}-\d{2} \d{2}:\d{2}$", context.batch_name)
        batch_id = uuid.UUID(context.batch_id)
        assert str(batch_id) == context.batch_id

        inserts = [
            call for call in env["engine_db"].execute.call_args_list
            if "INSERT INTO engine.migration_batch_registry" in norm(call.args[0])
        ]
        assert len(inserts) == 1
        params = inserts[0].args[1]
        assert params[0] == context.batch_id
        assert params[1] == PROJECT
        assert params[2] == TENANT
        assert params[3] == context.batch_name
        assert params[4] == 0

        completions = [
            call for call in env["engine_db"].execute.call_args_list
            if "UPDATE engine.migration_batch_registry" in norm(call.args[0])
            and "batch_status" in norm(call.args[0])
        ]
        assert len(completions) == 1
        assert completions[0].args[1] == ("COMPLETED", context.batch_id)

    def test_build_batch_name_helper(self):
        when = datetime(2026, 1, 2, 3, 4)  # noqa: DTZ001
        assert build_batch_name("Sys", when) == "PMA-Sys - 2026-01-02 03:04"

    def test_default_clock_still_produces_pma_prefix(self):
        name = build_batch_name("Sys")
        assert re.match(r"^PMA-Sys - \d{4}-\d{2}-\d{2} \d{2}:\d{2}$", name)


class TestIMaDiscoveryRegression:

    def test_ma_discovery_still_requires_source_system(self):
        from app.services.dataset_discovery_service import DatasetDiscoveryService

        engine_db = MagicMock()
        engine_db.execute.return_value = []
        service = DatasetDiscoveryService(engine_db, "proj-1")

        with pytest.raises(Exception, match="No SOURCE system configured"):
            service.discover()

        assert engine_db.execute.call_count == 1
        statements = [norm(c.args[0]) for c in engine_db.execute.call_args_list if c.args]
        assert not any("dataset_mappings" in s for s in statements)

    def test_ma_discovery_still_requires_target_system(self):
        from app.services.dataset_discovery_service import DatasetDiscoveryService

        engine_db = MagicMock()
        engine_db.execute.side_effect = [
            [("sys-1", "SourceDB", '{"host": "localhost"}')],
            [],
        ]
        service = DatasetDiscoveryService(engine_db, "proj-1")

        with pytest.raises(Exception, match="No TARGET system configured"):
            service.discover()

        statements = [norm(c.args[0]) for c in engine_db.execute.call_args_list if c.args]
        assert not any("dataset_mappings" in s for s in statements)


class TestJNoControlExecution:

    def test_no_control_or_rule_execution_statements(self, env):
        context = run_assessment(env)

        statements = all_sql(env["engine_db"])
        forbidden = (
            "migration_control_execution",
            "migration_control_summary",
            "migration_control_exceptions",
            "control_registry",
            "rule_registry",
        )
        for token in forbidden:
            assert not any(token in s for s in statements), token

        assert context.applicable_controls == []
        assert context.evidence_policy is None
