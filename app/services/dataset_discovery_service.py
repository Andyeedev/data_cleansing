from app.adapters.sqlserver import SQLServerAdapter
from app.config import SQLServerConfig
from app.services.credential_service import CredentialService
from app.services.matching_engine import MatchingEngine
from app.types.matching import DEFAULT_MATCHING_CONFIG
import json


class DatasetDiscoveryService:

    def __init__(self, engine_db, project_id):
        self.engine_db = engine_db
        self.project_id = project_id
        self.matching_engine = MatchingEngine(DEFAULT_MATCHING_CONFIG)

    def discover(self):

        source_system = self._get_system("SOURCE")
        target_system = self._get_system("TARGET")

        source_config = self._build_sqlserver_config(source_system)
        target_config = self._build_sqlserver_config(target_system)

        source_adapter = SQLServerAdapter()
        source_adapter.connect(source_config)

        target_adapter = SQLServerAdapter()
        target_adapter.connect(target_config)

        from app.adapters.base_adapter import ConnectionAdapter
        ConnectionAdapter.validate_connections(
            {"SOURCE": source_adapter, "TARGET": target_adapter},
            label="DATASET_DISCOVERY"
        )

        source_tables = source_adapter.list_tables()
        target_tables = target_adapter.list_tables()

        print("Discovered source tables:", source_tables)
        print("Discovered target tables:", target_tables)

        source_columns = self._fetch_all_columns(source_adapter, source_tables)
        target_columns = self._fetch_all_columns(target_adapter, target_tables)

        candidates = self.matching_engine.find_candidates(
            [self._table_to_dict(t) for t in source_tables],
            [self._table_to_dict(t) for t in target_tables],
            source_columns,
            target_columns,
        )

        for candidate in candidates:
            table = {
                "source_schema": candidate.source_schema,
                "source_table": candidate.source_table,
                "target_schema": candidate.target_schema,
                "target_table": candidate.target_table,
            }
            self._create_mapping(
                source_system["system_id"],
                target_system["system_id"],
                table,
                source_adapter,
                target_adapter,
            )

        print(f"Dataset discovery completed. {len(candidates)} candidates found.")

    def _table_to_dict(self, table):
        return {
            "table_name": table.table_name,
            "schema_name": table.schema_name,
        }

    def _fetch_all_columns(self, adapter, tables):
        columns = {}
        for table in tables:
            if not table.table_name:
                continue
            key = f"{table.schema_name}.{table.table_name}"
            cols = adapter.list_columns(table.schema_name, table.table_name)
            columns[key] = [
                {
                    "column_name": c.column_name,
                    "data_type": c.data_type,
                    "is_primary_key": getattr(c, "is_primary_key", False),
                    "is_foreign_key": getattr(c, "is_foreign_key", False),
                }
                for c in (cols or [])
            ]
        return columns

    def _build_sqlserver_config(self, system):
        config = system["connection_config"]
        if isinstance(config, str):
            config = json.loads(config)

        cred_service = CredentialService(self.engine_db)
        creds = cred_service.get_decrypted_credentials(system["system_id"])

        return SQLServerConfig(
            host=config.get("host", ""),
            port=config.get("port", 1433),
            database=config.get("database", ""),
            username=creds.get("username", ""),
            password=creds.get("password", ""),
            encrypt=True,
        )

    def _create_mapping(self, source_system_id, target_system_id, table, source_adapter, target_adapter):

        source_columns = source_adapter.list_columns(table["source_schema"], table["source_table"])
        target_columns = target_adapter.list_columns(table["target_schema"], table["target_table"])

        source_column_names = [c.column_name for c in source_columns] if source_columns else []
        target_column_names = [c.column_name for c in target_columns] if target_columns else []

        insert_query = """
        INSERT INTO core.dataset_mappings (
            project_id, source_system_id, target_system_id,
            source_schema, source_table, source_columns,
            target_schema, target_table, target_columns, created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
        ON CONFLICT (project_id, source_schema, source_table, target_schema, target_table)
        DO NOTHING
        RETURNING mapping_id
        """

        result = self.engine_db.execute(insert_query, (
            self.project_id,
            source_system_id,
            target_system_id,
            table["source_schema"],
            table["source_table"],
            source_column_names,
            table["target_schema"],
            table["target_table"],
            target_column_names,
        ))

        mapping_id = result[0][0] if result else None
        print(f"Created mapping: {table['source_table']} -> {table['target_table']}")

        if mapping_id:
            self._save_columns(mapping_id, source_columns, target_columns)
            self._bind_default_rules(mapping_id)

        return mapping_id

    def _save_columns(self, mapping_id, source_columns, target_columns):
        """Save column details to dataset_columns table."""
        col_insert = """
        INSERT INTO core.dataset_columns (mapping_id, column_name, column_position, data_type, column_side, is_nullable, is_primary_key)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
        """
        if source_columns:
            for idx, col in enumerate(source_columns, 1):
                self.engine_db.execute(col_insert, (
                    mapping_id,
                    col.column_name,
                    idx,
                    col.data_type,
                    'SOURCE',
                    getattr(col, 'is_nullable', True),
                    getattr(col, 'is_primary_key', False),
                ))
        if target_columns:
            for idx, col in enumerate(target_columns, 1):
                self.engine_db.execute(col_insert, (
                    mapping_id,
                    col.column_name,
                    idx,
                    col.data_type,
                    'TARGET',
                    getattr(col, 'is_nullable', True),
                    getattr(col, 'is_primary_key', False),
                ))

    def _get_system(self, role):
        query = """
        SELECT system_id, system_name, connection_config
        FROM core.system_registry
        WHERE project_id = %s
        AND system_role = %s
        """

        result = self.engine_db.execute(query, (self.project_id, role))

        if not result:
            raise Exception(f"No {role} system configured for project")

        row = result[0]

        return {
            "system_id": row[0],
            "system_name": row[1],
            "connection_config": row[2],
        }

    def _bind_default_rules(self, mapping_id):

        fetch_rules_query = """
        SELECT rule_id
        FROM engine.rule_registry
        WHERE enabled_flag = TRUE
        """

        rules = self.engine_db.execute(fetch_rules_query)

        insert_query = """
        INSERT INTO core.rule_dataset_mapping (rule_id, mapping_id)
        VALUES (%s, %s)
        ON CONFLICT DO NOTHING
        """

        for row in rules:
            self.engine_db.execute(insert_query, (row[0], mapping_id))
