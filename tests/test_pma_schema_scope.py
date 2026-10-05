from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from app.adapters.models import ColumnInfo, ConnectionTestResult, TableInfo
from app.pma.orchestrator import PmaAssessmentOrchestrator
from app.pma.working_set import build_working_set, resolve_schema_scope

SYSTEM = {
    "system_id": "sys-1",
    "system_name": "SourceDB",
    "system_role": "SOURCE",
    "database_type": "POSTGRES",
    "connection_config": {"host": "localhost", "port": 5432, "database": "migration_source"},
    "credential_id": "cred-1",
    "project_id": "proj-1",
}


class TestResolveSchemaScope:

    def test_explicit_connection_config_schema_wins(self):
        scope = resolve_schema_scope(
            system={
                "connection_config": {"schema": "CERT_SCHEMA"},
                "schema_name": "ignored",
            },
            adapter_config=SimpleNamespace(schema="public"),
        )
        assert scope == "CERT_SCHEMA"

    def test_registry_schema_name_used_next(self):
        scope = resolve_schema_scope(
            system={"schema_name": "analytics"},
            adapter_config=SimpleNamespace(schema="public"),
        )
        assert scope == "analytics"

    def test_adapter_config_class_default_used_next(self):
        scope = resolve_schema_scope(
            system={"connection_config": {}},
            adapter_config=SimpleNamespace(schema="public"),
        )
        assert scope == "public"

    def test_dataset_attribute_fallback(self):
        scope = resolve_schema_scope(
            system={},
            adapter_config=SimpleNamespace(dataset="dset"),
        )
        assert scope == "dset"

    def test_none_when_nothing_resolves(self):
        # Phase 5A mocked adapter_config is the string "adapter-config".
        assert resolve_schema_scope(system={}, adapter_config="adapter-config") is None
        assert resolve_schema_scope() is None

    def test_schema_in_connection_config_without_system_dict(self):
        scope = resolve_schema_scope(connection_config={"schema": "sales"})
        assert scope == "sales"


class TestBuildWorkingSetSchemaScope:

    def _adapter(self, tables):
        adapter = MagicMock()
        adapter.list_tables.return_value = tables
        adapter.list_columns.side_effect = lambda schema, table: [
            ColumnInfo(column_name="id", data_type="integer", is_nullable=False)
        ]
        return adapter

    def test_scope_passed_to_list_tables_and_defensively_filtered(self):
        adapter = self._adapter([
            TableInfo(schema_name="sales", table_name="orders", table_type="BASE TABLE"),
            TableInfo(schema_name="public", table_name="secrets", table_type="BASE TABLE"),
            TableInfo(schema_name="SALES", table_name="archived", table_type="BASE TABLE"),
        ])

        working_set = build_working_set(adapter, "sys-1", schema_scope="sales")

        adapter.list_tables.assert_called_once_with("sales")
        assert {t.entity_name for t in working_set.tables} == {
            "sales.orders",
            "SALES.archived",
        }
        adapter.list_columns.assert_any_call("sales", "orders")

    def test_without_scope_discovery_is_unfiltered(self):
        adapter = self._adapter([
            TableInfo(schema_name="public", table_name="accounts", table_type="BASE TABLE"),
            TableInfo(schema_name="information_schema", table_name="tables",
                      table_type="VIEW"),
        ])

        working_set = build_working_set(adapter, "sys-1")

        adapter.list_tables.assert_called_once_with()
        assert working_set.table_count == 2


class TestOrchestratorScopeWiring:

    def _run(self, system, adapter):
        engine_db = MagicMock()
        with patch("app.pma.orchestrator.SystemService") as system_service_cls, \
                patch("app.pma.orchestrator.CredentialService") as credential_cls, \
                patch("app.pma.orchestrator.AdapterRegistry") as adapter_registry:
            system_service = system_service_cls.return_value
            system_service.get_system.return_value = system
            system_service._build_adapter_config.return_value = "adapter-config"
            credential_cls.return_value.get_decrypted_credentials.return_value = {
                "username": "user",
                "password": "secret",
            }
            adapter_registry.get.return_value = MagicMock(return_value=adapter)
            orchestrator = PmaAssessmentOrchestrator(engine_db)
            context = orchestrator.run("tenant-1", "proj-1", "sys-1")
        return context, adapter

    @staticmethod
    def _adapter(tables):
        adapter = MagicMock()
        adapter.test_connection.return_value = ConnectionTestResult(
            success=True, message="ok", latency_ms=5, server_version="16.4"
        )
        adapter.list_tables.return_value = tables
        adapter.list_columns.side_effect = lambda schema, table: [
            ColumnInfo(column_name="id", data_type="integer", is_nullable=False)
        ]
        return adapter

    def test_explicit_connection_schema_scopes_discovery(self):
        system = dict(SYSTEM)
        system["connection_config"] = dict(SYSTEM["connection_config"], schema="sales")
        adapter = self._adapter([
            TableInfo(schema_name="sales", table_name="orders", table_type="BASE TABLE"),
            TableInfo(schema_name="public", table_name="secrets", table_type="BASE TABLE"),
        ])

        context, _ = self._run(system, adapter)

        adapter.list_tables.assert_called_once_with("sales")
        assert [t.entity_name for t in context.working_set.tables] == ["sales.orders"]

    def test_phase5a_default_env_keeps_unfiltered_discovery(self):
        adapter = self._adapter([
            TableInfo(schema_name="public", table_name="accounts", table_type="BASE TABLE"),
        ])

        context, _ = self._run(dict(SYSTEM), adapter)

        adapter.list_tables.assert_called_once_with()
        assert [t.entity_name for t in context.working_set.tables] == ["public.accounts"]
