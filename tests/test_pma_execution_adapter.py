import json
import uuid
from contextlib import contextmanager
from datetime import datetime
from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest

from app.adapters.models import ColumnInfo, ConnectionTestResult, TableInfo
from app.pma.assessment_context import PmaAssessmentContext
from app.pma.control_selection import select_controls
from app.pma.errors import PmaAssessmentError
from app.pma.execution_adapter import PmaExecutionAdapter
from app.pma.execution_stage import execute_controls
from app.pma.working_set import build_working_set

TENANT = "tenant-1"
PROJECT = "proj-1"
SYSTEM_ID = "sys-1"
BATCH_ID = str(uuid.uuid4())
NOW = datetime(2026, 10, 5, 9, 0)  # noqa: DTZ001

SYSTEM = {
    "system_id": SYSTEM_ID,
    "system_name": "SourceDB",
    "system_role": "SOURCE",
    "database_type": "POSTGRES",
    "connection_config": {"host": "localhost", "port": 5432, "database": "migration_source"},
    "credential_id": "cred-1",
    "project_id": PROJECT,
}

RULE_ROWS = {
    "C01": [("C01_ROWCOUNT", "VALIDATION", "HIGH")],
    "C02": [("C02_BALANCE_RECON", "VALIDATION", "HIGH")],
    "C03": [("C03_REFERENTIAL", "VALIDATION", "CRITICAL")],
    "C04": [("C04_COLUMN_COUNT", "VALIDATION", "MEDIUM")],
    "C05": [("C05_NULL_CHECK", "VALIDATION", "HIGH")],
    "C06": [("C06_DATA_TYPE_MATCH", "VALIDATION", "HIGH")],
    "C07": [("C07_DUPLICATE_DETECTION", "VALIDATION", "CRITICAL")],
    "C08": [("C08_DATA_DRIFT", "VALIDATION", "CRITICAL")],
    "C09": [("C09_REFERENTIAL_COVERAGE", "VALIDATION", "HIGH")],
    "C010": [("C010_SCHEMA_DRIFT", "VALIDATION", "CRITICAL")],
}

FORBIDDEN_DETAIL_KEYS = {
    "source_value",
    "target_value",
    "source_system",
    "target_system",
    "delta",
    "source_count",
    "target_count",
    "query",
}

FORBIDDEN_ENGINE_TOKENS = (
    "dataset_mappings",
    "rule_dataset_mapping",
    "column_mappings",
    "discovered_datasets",
    "discovered_columns",
)


def make_engine_db(control_ids):
    engine_db = MagicMock()
    captures = {"execution": [], "summary": [], "exceptions": [], "statements": []}
    engine_db.captures = captures

    def execute(sql, params=None):
        norm = " ".join(str(sql).split())
        captures["statements"].append((norm, params))
        if "engine.control_registry" in norm:
            return [(c,) for c in control_ids]
        if "engine.rule_registry" in norm:
            control_id = params[0] if params else None
            return list(RULE_ROWS.get(control_id, []))
        if "INSERT INTO engine.migration_control_execution" in norm:
            captures["execution"].append(params)
            return []
        if "INSERT INTO engine.migration_control_summary" in norm:
            captures["summary"].append(params)
            return []
        if "INSERT INTO engine.migration_control_exceptions" in norm:
            captures["exceptions"].append(params)
            return []
        return []

    engine_db.execute.side_effect = execute
    engine_db.fetch_all.side_effect = lambda sql, params=None: []
    return engine_db


def make_adapter(null_counts=None, duplicates=None, row_counts=None):
    adapter = MagicMock()
    adapter.paramstyle = "%s"
    adapter.test_connection.return_value = ConnectionTestResult(
        success=True, message="ok", latency_ms=5, server_version="16.4"
    )
    adapter.list_tables.return_value = [
        TableInfo(schema_name="public", table_name="accounts", table_type="BASE TABLE"),
        TableInfo(schema_name="public", table_name="audit_log", table_type="VIEW"),
    ]

    def list_columns(schema, table):
        if table == "accounts":
            return [
                ColumnInfo(column_name="id", data_type="integer", is_nullable=False,
                           is_primary_key=True),
                ColumnInfo(column_name="balance", data_type="numeric", is_nullable=True),
                ColumnInfo(column_name="name", data_type="text", is_nullable=False),
            ]
        return [ColumnInfo(column_name="event", data_type="text", is_nullable=True)]

    adapter.list_columns.side_effect = list_columns

    null_counts = null_counts or {"id": 0, "balance": 2, "name": 0, "event": 1}
    duplicates = duplicates or {"accounts": 0}
    row_counts = row_counts or {"accounts": 100, "audit_log": 7}
    adapter.queries = []

    def respond(sql, params=None):
        norm = " ".join(str(sql).split())
        adapter.queries.append(norm)
        if norm == "SELECT 1":
            return [[1]]
        if "IS NULL" in norm and "COUNT(*)" in norm:
            for column, count in null_counts.items():
                if f"WHERE {column} IS NULL" in norm:
                    return [[count]]
            return [[0]]
        if "COALESCE(SUM" in norm:
            return [[Decimal("1250.50")]]
        if "HAVING COUNT(*) > 1" in norm:
            for table, count in duplicates.items():
                if f"FROM public.{table}" in norm:
                    return [[count]]
            return [[0]]
        if "AVG(" in norm:
            return [[Decimal("10.5"), Decimal(1), Decimal(20), Decimal("4.2")]]
        if "information_schema.columns" in norm:
            table = params[1] if params and len(params) > 1 else None
            if table == "accounts":
                return [[3]]
            if table == "audit_log":
                return [[1]]
            return [[0]]
        if "COUNT(*)" in norm:
            for table, count in row_counts.items():
                if f"FROM public.{table}" in norm:
                    return [[count]]
            return [[0]]
        return [[1]]

    adapter.execute.side_effect = respond
    return adapter


def make_context(adapter, batch_id=BATCH_ID):
    working_set = build_working_set(adapter, SYSTEM_ID)
    return PmaAssessmentContext(
        tenant_id=TENANT,
        project_id=PROJECT,
        system_id=SYSTEM_ID,
        system_name="SourceDB",
        batch_id=batch_id,
        started_at=NOW,
        working_set=working_set,
        adapter=adapter,
        batch_name="PMA-SourceDB - 2026-10-05 09:00",
    )


@contextmanager
def stage_env(control_ids, adapter=None, engine_db=None, get_system_side_effect=None):
    adapter = adapter or make_adapter()
    engine_db = engine_db or make_engine_db(control_ids)
    context = make_context(adapter)
    with patch("app.pma.execution_stage.SystemService") as system_service_cls, \
            patch("app.pma.execution_stage.AdapterRegistry") as adapter_registry, \
            patch("app.pma.orchestrator.CredentialService") as credential_service_cls:
        system_service = system_service_cls.return_value
        if get_system_side_effect is not None:
            system_service.get_system.side_effect = get_system_side_effect
        else:
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
            "context": context,
            "system_service": system_service,
            "adapter_registry": adapter_registry,
            "credential_service": credential_service_cls.return_value,
        }


def execution_rows(engine_db):
    return list(engine_db.captures["execution"])


def detail_of(params):
    return json.loads(params[12])


class TestContextReachesExecution:

    def test_execution_rows_carry_context_identity(self):
        with stage_env(["C01", "C04"]) as env:
            result = execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        assert rows
        for params in rows:
            assert params[0] == BATCH_ID
            assert params[1] in ("C01", "C04")
        for params in rows:
            detail = detail_of(params)
            assert detail["assessment_type"] == "PMA"
            assert detail["system_id"] == SYSTEM_ID
            assert detail["system"] == "SourceDB"

        assert result["batch_id"] == BATCH_ID
        assert result["system_id"] == SYSTEM_ID
        assert result["controls"] == ["C01", "C04"]
        assert result["controls_executed"] == ["C01", "C04"]
        assert env["context"].applicable_controls == ["C01", "C04"]
        assert {p[1] for p in env["engine_db"].captures["summary"]} == {"C01", "C04"}
        env["adapter"].close.assert_called_once()

    def test_stage_does_not_register_or_finalise_batches(self):
        with stage_env(["C01"]) as env:
            execute_controls(env["context"], env["engine_db"])

        statements = [sql for sql, _ in env["engine_db"].captures["statements"]]
        assert not any("migration_batch_registry" in s for s in statements)
        assert not any("migration_validation_batch" in s for s in statements)
        assert not any("migration_batch_summary" in s for s in statements)
        assert not any("migration_governance_status" in s for s in statements)
        assert not any("migration_release_decision" in s for s in statements)


class TestSingleConnectionNoTargetDependency:

    def test_adapter_constructed_as_single_connection(self):
        adapter = make_adapter()
        context = make_context(adapter)
        executor = PmaExecutionAdapter(
            make_engine_db(["C01"]), adapter, context, "C01"
        )
        assert executor.source_db is adapter
        assert executor.target_db is adapter
        assert executor.source_connections == {SYSTEM_ID: adapter}
        assert executor.target_connections == executor.source_connections
        assert executor.batch_id == BATCH_ID
        assert executor.project_id == PROJECT

    def test_no_pair_resolution_or_mapping_reads(self):
        with stage_env(["C01", "C05", "C08"]) as env:
            execute_controls(env["context"], env["engine_db"])

        statements = [sql for sql, _ in env["engine_db"].captures["statements"]]
        for token in FORBIDDEN_ENGINE_TOKENS:
            assert not any(token in s for s in statements), token
        # single adapter was health-gated once and used for all queries
        env["adapter"].execute.assert_any_call("SELECT 1")


class TestNoMigrationOrSelfMappings:

    def test_zero_core_writes_and_no_self_mappings(self):
        with stage_env(["C01", "C05", "C07", "C08", "C09", "C010"]) as env:
            execute_controls(env["context"], env["engine_db"])

        statements = [sql for sql, _ in env["engine_db"].captures["statements"]]
        for sql in statements:
            assert "INSERT INTO core" not in sql
            assert "UPDATE core" not in sql
            assert "DELETE FROM core" not in sql
        for token in FORBIDDEN_ENGINE_TOKENS:
            assert not any(token in s for s in statements), token
        # no SOURCE/TARGET pairing is ever asserted in engine SQL
        assert not any("system_role" in s for s in statements)


class TestWorkingSetEntitiesExecuted:

    def test_every_working_set_entity_executes_with_null_mapping(self):
        with stage_env(["C01"]) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        assert {p[3] for p in rows} == {"public.accounts", "public.audit_log"}
        assert all(p[8] is None for p in rows)  # mapping_id stays NULL
        assert all(p[4] == "PASS" for p in rows)

        by_entity = {p[3]: detail_of(p) for p in rows}
        assert by_entity["public.accounts"]["measured_value"] == 100
        assert by_entity["public.audit_log"]["measured_value"] == 7
        assert by_entity["public.accounts"]["measurement"] == "row_count"

        summary = env["engine_db"].captures["summary"][0]
        assert summary[0] == BATCH_ID
        assert summary[1] == "C01"
        assert summary[2] == "PASS"
        assert summary[3:] == (2, 2, 0, 0, 0)

    def test_c04_column_count_baseline(self):
        with stage_env(["C04"]) as env:
            execute_controls(env["context"], env["engine_db"])

        by_entity = {p[3]: detail_of(p) for p in execution_rows(env["engine_db"])}
        assert by_entity["public.accounts"]["measured_value"] == 3
        assert by_entity["public.audit_log"]["measured_value"] == 1
        assert by_entity["public.accounts"]["assessment"] == "BASELINE_RECORDED"


class TestColumnCapabilityControls:

    def test_c05_pass_records_null_evidence_without_threshold(self):
        with stage_env(["C05"]) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        assert {p[4] for p in rows} == {"PASS"}
        by_entity = {p[3]: detail_of(p) for p in rows}
        accounts = by_entity["public.accounts"]
        assert accounts["assessment"] == "NO_NOT_NULL_VIOLATIONS"
        checked = {c["column"]: c for c in accounts["evidence"]["checked"]}
        assert set(checked) == {"id", "balance", "name"}
        assert checked["balance"]["null_count"] == 2  # recorded, nullable -> no FAIL
        assert checked["id"]["declared_nullable"] is False

    def test_c05_fails_only_on_not_null_violation(self):
        adapter = make_adapter(null_counts={"id": 5, "balance": 2, "name": 0, "event": 1})
        with stage_env(["C05"], adapter=adapter) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        by_status = {p[3]: p for p in rows}
        accounts = by_status["public.accounts"]
        assert accounts[4] == "FAIL"
        assert accounts[5] == 5  # delta_value = violating rows
        detail = detail_of(accounts)
        assert detail["cause"] == "NOT_NULL_VIOLATION"
        assert detail["measured_value"] == 5
        assert by_status["public.audit_log"][4] == "PASS"

        exception_causes = [e[7] for e in env["engine_db"].captures["exceptions"]]
        assert "NOT_NULL_VIOLATION" in exception_causes

    def test_c05_and_c06_never_use_mapping_dependency_path(self):
        with stage_env(["C05", "C06"]) as env:
            execute_controls(env["context"], env["engine_db"])

        statements = [sql for sql, _ in env["engine_db"].captures["statements"]]
        for token in ("column_mappings", "dataset_columns", "mapping_id ="):
            assert not any(token in s for s in statements), token

    def test_c06_records_type_capability(self):
        with stage_env(["C06"]) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        assert {p[4] for p in rows} == {"PASS"}
        by_entity = {p[3]: detail_of(p) for p in rows}
        accounts = by_entity["public.accounts"]
        assert accounts["assessment"] == "TYPE_CAPABILITY_RECORDED"
        types = {t["column"]: t["data_type"] for t in accounts["evidence"]["types"]}
        assert types == {"id": "integer", "balance": "numeric", "name": "text"}


class TestC03NeverExecuted:

    def test_c03_excluded_from_selection_and_execution(self):
        with stage_env(["C01", "C03", "C09"]) as env:
            result = execute_controls(env["context"], env["engine_db"])

        assert "C03" not in result["controls"]
        assert select_controls(env["engine_db"], PROJECT) == ["C01", "C09"]
        rows = execution_rows(env["engine_db"])
        assert rows and all(p[1] != "C03" for p in rows)
        summaries = env["engine_db"].captures["summary"]
        assert all(p[1] != "C03" for p in summaries)


class TestC09HonestForeignKeySkip:

    def test_c09_skips_without_fabricated_fk_evidence(self):
        with stage_env(["C09"]) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        assert rows
        for params in rows:
            assert params[4] == "SKIPPED"
            detail = detail_of(params)
            assert detail["cause"] == "NO_FK_METADATA"
            assert detail["evidence"]["fk_metadata_source"] == "none"
            assert detail["evidence"]["fk_inference"] == "not_performed"
        assert not any("LEFT JOIN" in q for q in env["adapter"].queries)

        skip_scopes = {e[8] for e in env["engine_db"].captures["exceptions"]}
        assert "rule_skip" in skip_scopes


class TestNoFabricatedComparison:

    def test_detail_json_has_no_pair_semantics_for_any_control(self):
        controls = ["C01", "C02", "C04", "C05", "C06", "C07", "C08", "C09", "C010"]
        with stage_env(controls) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        assert len(rows) >= len(controls)  # multiple entities per control
        for params in rows:
            assert params[8] is None  # mapping_id NULL
            detail = detail_of(params)
            leaked = FORBIDDEN_DETAIL_KEYS & set(detail)
            assert not leaked, f"{params[1]}/{params[3]} leaked {leaked}"
            assert detail["assessment_type"] == "PMA"
            assert detail["system_id"] == SYSTEM_ID

        for params in rows:
            detail = detail_of(params)
            if (
                params[4] == "PASS"
                and detail.get("measurement") in ("row_count", "sum", "column_count")
            ):
                assert "measured_value" in detail

        # exception rows are pair-neutral (source side never fabricated)
        exceptions = env["engine_db"].captures["exceptions"]
        for params in exceptions:
            assert params[4] == "N/A"

    def test_c02_sum_baseline_measurement(self):
        with stage_env(["C02"]) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = {p[3]: p for p in execution_rows(env["engine_db"])}
        accounts = rows["public.accounts"]
        assert accounts[4] == "PASS"
        detail = detail_of(accounts)
        assert detail["assessment"] == "BASELINE_RECORDED"
        assert detail["measurement"] == "sum"
        assert detail["measured_value"] == 1250.5

        audit_log = rows["public.audit_log"]
        assert audit_log[4] == "SKIPPED"
        audit_detail = detail_of(audit_log)
        assert audit_detail["cause"] == "NO_NUMERIC_COLUMN"
        assert "core.dataset_columns" not in audit_detail["message"]

    def test_c07_duplicate_issue_semantics_and_critical_block(self):
        adapter = make_adapter(duplicates={"accounts": 3})
        with stage_env(["C07"], adapter=adapter) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = execution_rows(env["engine_db"])
        by_entity = {p[3]: p for p in rows}
        accounts = by_entity["public.accounts"]
        assert accounts[4] == "FAIL"
        assert accounts[5] == 3
        detail = detail_of(accounts)
        assert detail["cause"] == "DUPLICATE_KEY_GROUPS"
        assert detail["measured_value"] == 3

        audit_log = by_entity["public.audit_log"]
        assert audit_log[4] == "SKIPPED"
        audit_detail = detail_of(audit_log)
        assert audit_detail["cause"] == "NO_PRIMARY_KEY"
        assert "core.dataset_columns" not in audit_detail["message"]

        summary = env["engine_db"].captures["summary"][0]
        assert summary[2] == "BLOCKED"  # CRITICAL severity FAIL
        assert summary[3:] == (2, 0, 1, 0, 1)

    def test_c08_profiling_evidence_without_drift_verdict(self):
        with stage_env(["C08"]) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = {p[3]: p for p in execution_rows(env["engine_db"])}
        accounts = rows["public.accounts"]
        assert accounts[4] == "PASS"
        detail = detail_of(accounts)
        assert detail["assessment"] == "PROFILE_RECORDED"
        profile = detail["evidence"]["profile"]
        assert set(profile) == {"balance"}
        assert set(profile["balance"]) == {"avg", "min", "max", "stddev"}
        assert profile["balance"]["avg"] == "10.5"

        audit_log = rows["public.audit_log"]
        assert audit_log[4] == "SKIPPED"
        assert detail_of(audit_log)["cause"] == "NO_NUMERIC_COLUMNS"

    def test_c010_informational_inventory(self):
        with stage_env(["C010"]) as env:
            execute_controls(env["context"], env["engine_db"])

        rows = {p[3]: p for p in execution_rows(env["engine_db"])}
        accounts = rows["public.accounts"]
        assert accounts[4] == "PASS"
        detail = detail_of(accounts)
        assert detail["assessment"] == "INFORMATIONAL"
        columns = [c["column"] for c in detail["evidence"]["columns"]]
        assert columns == ["id", "balance", "name"]


class TestTenantProjectIsolation:

    def test_system_and_credentials_scoped_to_tenant_project(self):
        with stage_env(["C01"]) as env:
            execute_controls(env["context"], env["engine_db"])

        env["system_service"].get_system.assert_called_once_with(
            SYSTEM_ID, tenant_id=TENANT, project_id=PROJECT
        )
        env["credential_service"].get_decrypted_credentials.assert_called_once_with(
            SYSTEM_ID, tenant_id=TENANT
        )
        env["adapter_registry"].get.assert_called_once_with("postgres")

        selection_calls = [
            (sql, params) for sql, params in env["engine_db"].captures["statements"]
            if "engine.control_registry" in sql
        ]
        assert selection_calls
        assert selection_calls[0][1] == (PROJECT,)

    def test_foreign_tenant_rejected_before_any_execution(self):
        with stage_env(
            ["C01"], get_system_side_effect=Exception("System not found")
        ) as env, pytest.raises(
            PmaAssessmentError, match="System not found or access denied"
        ):
            execute_controls(env["context"], env["engine_db"])

        assert execution_rows(env["engine_db"]) == []
        assert env["engine_db"].captures["summary"] == []
        env["adapter_registry"].get.assert_not_called()
        env["credential_service"].get_decrypted_credentials.assert_not_called()


class TestControlSelectionContract:

    def test_selection_is_project_scoped_and_classified(self):
        engine_db = make_engine_db(["C01", "C02", "C03", "C05", "C09", "C99"])
        assert select_controls(engine_db, PROJECT) == ["C01", "C02", "C05", "C09"]
        sql, params = engine_db.captures["statements"][0]
        assert "engine.control_registry" in sql
        assert "project_id = %s" in sql
        assert params == (PROJECT,)

    def test_control_without_pma_semantics_is_excluded(self):
        engine_db = make_engine_db(["C99"])
        assert select_controls(engine_db, PROJECT) == []
