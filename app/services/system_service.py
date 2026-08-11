import time
import uuid
import json
import psycopg2

from app.db.repositories.system_repository import SystemRepository
from app.services.credential_service import CredentialService
from app.adapters.registry import AdapterRegistry

# Map system_registry.database_type → adapter registry key
DB_TYPE_MAP = {
    "POSTGRES": "postgres",
    "AZURE_POSTGRES": "postgres",
    "AWS_RDS_POSTGRES": "postgres",
    "SQLSERVER": "sqlserver",
    "AZURE_SQL": "sqlserver",
    "MYSQL": "mysql",
    "ORACLE": "oracle",
    "SNOWFLAKE": "snowflake",
    "BIGQUERY": "bigquery",
    "DATABRICKS": "databricks",
}


class SystemService:

    def __init__(self, conn):
        self.conn = conn
        self.repo = SystemRepository(conn)

    # =========================
    # CREATE
    # =========================
    def create_system(self, payload, tenant_id=None):

        system_id = str(uuid.uuid4())

        config_json = json.dumps(payload.connection_config.dict())

        self.repo.insert(
            system_id=system_id,
            project_id=payload.project_id or str(uuid.uuid4()),
            system_name=payload.system_name,
            system_role=payload.system_role,
            database_type=payload.database_type,
            connection_config=config_json,
            tenant_id=tenant_id
        )

        return {
            "message": "System created",
            "system_id": system_id
        }

    # =========================
    # UPDATE
    # =========================
    def update_system(self, system_id, payload, tenant_id=None):

        row = self.repo.get_by_id(system_id, tenant_id=tenant_id)
        if not row:
            raise Exception("System not found")

        config_json = json.dumps(payload.connection_config.dict()) if payload.connection_config else json.dumps(json.loads(row[4]) if isinstance(row[4], str) else row[4])

        self.repo.update(
            system_id=system_id,
            system_name=payload.system_name or row[1],
            system_role=payload.system_role or row[2],
            database_type=payload.database_type or row[3],
            connection_config=config_json
        )

        return {"message": "System updated", "system_id": system_id}

    # =========================
    # DELETE
    # =========================
    def delete_system(self, system_id, tenant_id=None):

        row = self.repo.get_by_id(system_id, tenant_id=tenant_id)
        if not row:
            raise Exception("System not found")

        self.repo.delete(system_id)

        return {"message": "System deleted", "system_id": system_id}

    # =========================
    # LIST
    # =========================
    def list_systems(self, tenant_id=None):

        rows = self.repo.get_all(tenant_id=tenant_id)

        return [
            {
                "system_id": r[0],
                "system_name": r[1],
                "system_role": r[2],
                "database_type": r[3],
                "credential_id": r[4]
            }
            for r in rows
        ]

    # =========================
    # GET ONE
    # =========================
    def get_system(self, system_id, tenant_id=None):

        row = self.repo.get_by_id(system_id, tenant_id=tenant_id)

        if not row:
            raise Exception("System not found")

        config = row[4]
        if isinstance(config, str):
            config = json.loads(config)

        return {
            "system_id": row[0],
            "system_name": row[1],
            "system_role": row[2],
            "database_type": row[3],
            "connection_config": config,
            "credential_id": row[5]
        }

    # =========================
    # TEST CONNECTION
    # =========================
    def test_connection(self, system_id, tenant_id=None):

        row = self.repo.get_by_id(system_id, tenant_id=tenant_id)

        if not row:
            raise Exception("System not found")

        _, name, _, db_type, config, _ = row

        if isinstance(config, str):
            config = json.loads(config)

        adapter_key = DB_TYPE_MAP.get(db_type.upper())
        if not adapter_key:
            raise Exception(f"Unsupported database type: {db_type}")

        cred_service = CredentialService(self.conn)
        creds = cred_service.get_decrypted_credentials(system_id)

        adapter_class = AdapterRegistry.get(adapter_key)
        adapter = adapter_class()

        # Build adapter-specific config from JSONB + credentials
        adapter_config = self._build_adapter_config(adapter_key, config, creds)
        result = adapter.test_connection(adapter_config)

        return {
            "status": "success" if result.success else "failed",
            "message": result.message,
            "latency_ms": result.latency_ms,
            "server_version": result.server_version
        }

    def _build_adapter_config(self, adapter_key, config, creds):
        """Build adapter-specific config dataclass from JSONB connection_config + credentials."""
        from app.config import (
            PostgresConfig, SQLServerConfig, MySQLConfig, OracleConfig,
            SnowflakeConfig, BigQueryConfig, DatabricksConfig
        )

        host = config.get("host", "")
        port = config.get("port")
        database = config.get("database", "")
        username = creds.get("username", "")
        password = creds.get("password", "")

        if adapter_key in ("postgres",):
            return PostgresConfig(
                host=host, port=port or 5432, database=database,
                username=username, password=password,
                ssl_mode=config.get("ssl_mode", "prefer")
            )
        elif adapter_key == "sqlserver":
            return SQLServerConfig(
                host=host, port=port or 1433, database=database,
                username=username, password=password,
                encrypt=config.get("encrypt", True),
                trust_server_certificate=config.get("trust_server_certificate", False)
            )
        elif adapter_key == "mysql":
            return MySQLConfig(
                host=host, port=port or 3306, database=database,
                username=username, password=password
            )
        elif adapter_key == "oracle":
            return OracleConfig(
                host=host, port=port or 1521, service_name=database,
                username=username, password=password
            )
        elif adapter_key == "snowflake":
            return SnowflakeConfig(
                account=host, database=database,
                username=username, password=password,
                warehouse=config.get("warehouse", ""),
                schema=config.get("schema", ""),
                role=config.get("role")
            )
        elif adapter_key == "bigquery":
            return BigQueryConfig(
                project_id=config.get("project_id", host),
                dataset=database,
                credentials_file=config.get("credentials_file")
            )
        elif adapter_key == "databricks":
            return DatabricksConfig(
                host=host,
                http_path=config.get("http_path", ""),
                catalog=config.get("catalog", ""),
                schema=config.get("schema", ""),
                username=username, password=password
            )
        else:
            raise Exception(f"No config builder for adapter: {adapter_key}")

    def list_tables(self, system_id, tenant_id=None):

        row = self.repo.get_by_id(system_id, tenant_id=tenant_id)

        if not row:
            raise Exception("System not found")

        _, name, db_type, connection_config, credential_id = row

        import json
        config = json.loads(connection_config)

        from app.services.credential_service import CredentialService
        creds = CredentialService(self.conn).get_decrypted_credentials(system_id)

        conn = psycopg2.connect(
            host=config["host"],
            port=config["port"],
            database=config["database"],
            user=creds["username"],
            password=creds["password"]
        )
        from app.adapters.registry import AdapterRegistry
        adapter_class = AdapterRegistry.get(db_type)
        adapter = adapter_class()
        adapter.connect(config)

        tables = adapter.list_tables()

        conn.close()

        return {
            "system": name,
            "tables": tables
        }
