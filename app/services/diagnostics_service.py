import time
import json

from app.db.repositories.diagnostics_repository import DiagnosticsRepository
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


class DiagnosticsService:

    CHECK_NAMES = ["network", "authentication", "ssl", "version", "pool", "query"]

    def __init__(self, conn):
        self.conn = conn
        self.repo = DiagnosticsRepository(conn)
        self.system_repo = SystemRepository(conn)

    def _get_system_config(self, system_id, tenant_id=None):
        row = self.system_repo.get_by_id(system_id, tenant_id=tenant_id)
        if not row:
            raise Exception("System not found")
        _, name, role, db_type, config, _ = row
        if isinstance(config, str):
            config = json.loads(config)
        return name, role, db_type, config

    def _get_credentials(self, system_id):
        cred_service = CredentialService(self.conn)
        return cred_service.get_decrypted_credentials(system_id)

    def _build_adapter_config(self, adapter_key, config, creds):
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
            auth = config.get("authenticator", "snowflake")
            private_key = None
            pwd = password
            if auth and auth.upper() in ("SNOWFLAKE_JWT", "JWT") and password and "BEGIN" in password:
                private_key = password
                pwd = None
            return SnowflakeConfig(
                account=host, database=database,
                username=username, password=pwd,
                warehouse=config.get("warehouse", ""),
                schema=config.get("schema", ""),
                role=config.get("role"),
                authenticator=auth,
                private_key=private_key,
                private_key_path=config.get("private_key_path"),
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

    def _run_check(self, system_id, check_name, fn):
        start = time.time()
        try:
            result = fn()
            latency = round((time.time() - start) * 1000, 2)
            self.repo.insert_check(
                system_id=system_id,
                check_name=check_name,
                status="pass",
                message=result.get("message", "OK"),
                latency_ms=latency,
                server_version=result.get("server_version")
            )
            return {"name": check_name, "status": "pass", "message": result.get("message", "OK"), "latency_ms": latency, "server_version": result.get("server_version")}
        except Exception as e:
            latency = round((time.time() - start) * 1000, 2)
            self.repo.insert_check(
                system_id=system_id,
                check_name=check_name,
                status="fail",
                message=str(e),
                latency_ms=latency
            )
            return {"name": check_name, "status": "fail", "message": str(e), "latency_ms": latency}

    def _check_network(self, adapter_key, adapter_config):
        adapter_class = AdapterRegistry.get(adapter_key)
        adapter = adapter_class()
        try:
            adapter.connect(adapter_config)
            return {"message": f"Network reachable"}
        finally:
            adapter.close()

    def _check_authentication(self, adapter_key, adapter_config):
        adapter_class = AdapterRegistry.get(adapter_key)
        adapter = adapter_class()
        try:
            adapter.connect(adapter_config)
            if adapter.validate():
                return {"message": "Authentication successful"}
            raise Exception("Authentication failed")
        finally:
            adapter.close()

    def _check_ssl(self, adapter_key, adapter_config):
        if adapter_key == "sqlserver":
            return {"message": "SSL check via encrypt setting"}
        if adapter_key in ("snowflake", "bigquery", "databricks"):
            return {"message": "SSL enforced by cloud provider"}
        if adapter_key == "oracle":
            return {"message": "SSL check not applicable for basic Oracle config"}
        adapter_class = AdapterRegistry.get(adapter_key)
        adapter = adapter_class()
        try:
            adapter.connect(adapter_config)
            result = adapter.fetch_all("SELECT ssl_is_used()")
            if result and result[0].get("ssl_is_used"):
                return {"message": "SSL connection active"}
            raise Exception("SSL not enabled on connection")
        finally:
            adapter.close()

    def _check_version(self, adapter_key, adapter_config):
        adapter_class = AdapterRegistry.get(adapter_key)
        adapter = adapter_class()
        try:
            adapter.connect(adapter_config)
            if adapter_key == "sqlserver":
                result = adapter.fetch_all("SELECT @@VERSION")
                version = result[0]["@@VERSION"] if result else "unknown"
            elif adapter_key == "snowflake":
                result = adapter.fetch_all("SELECT CURRENT_VERSION()")
                version = result[0]["CURRENT_VERSION()"] if result else "unknown"
            elif adapter_key == "bigquery":
                result = adapter.fetch_all("SELECT @@version")
                version = result[0]["@@version"] if result else "unknown"
            else:
                result = adapter.fetch_all("SELECT version()")
                version = result[0]["version"] if result else "unknown"
            return {"message": version, "server_version": version}
        finally:
            adapter.close()

    def _check_pool(self, adapter_key, adapter_config):
        adapter_class = AdapterRegistry.get(adapter_key)
        adapter = adapter_class()
        try:
            adapter.connect(adapter_config)
            if adapter_key == "postgres":
                result = adapter.fetch_all("""
                    SELECT setting::int AS max_conn,
                    (SELECT count(*) FROM pg_stat_activity) AS active
                    FROM pg_settings WHERE name = 'max_connections'
                """)
                max_conn = result[0]["max_conn"]
                active = result[0]["active"]
                return {"message": f"Active: {active}/{max_conn} connections"}
            elif adapter_key == "sqlserver":
                result = adapter.fetch_all("SELECT @@MAX_CONNECTIONS AS max_conn, (SELECT COUNT(*) FROM sys.dm_exec_sessions) AS active")
                max_conn = result[0]["max_conn"]
                active = result[0]["active"]
                return {"message": f"Active: {active}/{max_conn} connections"}
            else:
                return {"message": "Pool stats not available for this DB type"}
        finally:
            adapter.close()

    def _check_query(self, adapter_key, adapter_config):
        adapter_class = AdapterRegistry.get(adapter_key)
        adapter = adapter_class()
        try:
            adapter.connect(adapter_config)
            start = time.time()
            adapter.execute("SELECT 1")
            latency = round((time.time() - start) * 1000, 2)
            return {"message": f"Query execution: {latency}ms"}
        finally:
            adapter.close()

    def run_full_diagnostics(self, system_id, tenant_id=None):
        name, role, db_type, config = self._get_system_config(system_id, tenant_id=tenant_id)
        creds = self._get_credentials(system_id)

        adapter_key = DB_TYPE_MAP.get(db_type.upper())
        if not adapter_key:
            raise Exception(f"Unsupported database type: {db_type}")

        adapter_config = self._build_adapter_config(adapter_key, config, creds)

        checks = []
        checks.append(self._run_check(system_id, "network", lambda: self._check_network(adapter_key, adapter_config)))
        checks.append(self._run_check(system_id, "authentication", lambda: self._check_authentication(adapter_key, adapter_config)))
        checks.append(self._run_check(system_id, "ssl", lambda: self._check_ssl(adapter_key, adapter_config)))
        checks.append(self._run_check(system_id, "version", lambda: self._check_version(adapter_key, adapter_config)))
        checks.append(self._run_check(system_id, "pool", lambda: self._check_pool(adapter_key, adapter_config)))
        checks.append(self._run_check(system_id, "query", lambda: self._check_query(adapter_key, adapter_config)))

        overall = "healthy" if all(c["status"] == "pass" for c in checks) else "unhealthy"

        return {
            "system_id": system_id,
            "system_name": name,
            "database_type": db_type,
            "system_role": role,
            "health_checks": checks,
            "overall_status": overall
        }

    def get_cached_result(self, system_id, tenant_id=None):
        rows = self.repo.get_latest_by_system(system_id)
        if not rows:
            return self.run_full_diagnostics(system_id, tenant_id=tenant_id)

        checks = []
        for r in rows:
            checks.append({
                "name": r[1],
                "status": r[2],
                "message": r[3],
                "latency_ms": float(r[4]) if r[4] else None,
                "server_version": r[5]
            })

        name, role, db_type, _ = self._get_system_config(system_id, tenant_id=tenant_id)
        overall = "healthy" if all(c["status"] == "pass" for c in checks) else "unhealthy"

        return {
            "system_id": system_id,
            "system_name": name,
            "database_type": db_type,
            "system_role": role,
            "health_checks": checks,
            "overall_status": overall
        }

    def get_summary(self, tenant_id=None):
        counts = self.repo.get_health_counts(tenant_id=tenant_id)
        total = counts[0] or 0
        healthy = counts[1] or 0
        unhealthy = counts[2] or 0
        return {
            "total_systems": total,
            "healthy_systems": healthy,
            "unhealthy_systems": unhealthy,
            "overall_health_percent": round((healthy / total * 100), 1) if total > 0 else 0
        }

    def get_all_diagnostics(self, tenant_id=None):
        rows = self.repo.get_all_systems_summary(tenant_id=tenant_id)
        systems = {}
        for r in rows:
            sys_id = str(r[0])
            if sys_id not in systems:
                systems[sys_id] = {
                    "system_id": sys_id,
                    "system_name": r[1],
                    "database_type": r[2],
                    "system_role": r[3],
                    "health_checks": [],
                    "overall_status": "unknown"
                }
            if r[4]:
                systems[sys_id]["health_checks"].append({
                    "name": r[4],
                    "status": r[5],
                    "message": r[6],
                    "latency_ms": float(r[7]) if r[7] else None,
                    "server_version": r[8]
                })

        for sys_data in systems.values():
            if sys_data["health_checks"]:
                sys_data["overall_status"] = (
                    "healthy" if all(c["status"] == "pass" for c in sys_data["health_checks"])
                    else "unhealthy"
                )

        return list(systems.values())

    def get_test_history(self, system_id):
        rows = self.repo.get_history_by_system(system_id)
        return [
            {
                "diagnostic_id": str(r[0]),
                "check_name": r[1],
                "status": r[2],
                "message": r[3],
                "latency_ms": float(r[4]) if r[4] else None,
                "server_version": r[5],
                "checked_at": r[6].isoformat() if r[6] else None
            }
            for r in rows
        ]
