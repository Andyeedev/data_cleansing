from typing import Any, Dict, List, Optional

from .base_adapter import ConnectionAdapter
from .models import TableInfo, ColumnInfo, ConnectionTestResult
from ..config import SnowflakeConfig
from ..adapters.registry import AdapterRegistry
from ..adapters.pool import ConnectionPoolManager


class SnowflakeAdapter(ConnectionAdapter):
    """Snowflake adapter implementing the ConnectionAdapter interface."""

    def __init__(self):
        self._pool_manager = ConnectionPoolManager()
        self._connected = False
        self._connection = None
        self._config = None

    def connect(self, config: SnowflakeConfig) -> None:
        """Establish connection to Snowflake database."""
        self._config = config
        self._connection = self._pool_manager.get_connection(
            system_id=config.account,
            config=config,
            db_type="snowflake"
        )
        self._connected = True

    def execute(self, query: str, params: tuple = None) -> Any:
        """Execute a query and return results."""
        if not self._connected:
            raise ConnectionError("Not connected to database")

        cursor = self._connection.cursor()
        try:
            cursor.execute(query, params or ())
            if cursor.description:
                result = cursor.fetchall()
            else:
                result = []
            self._connection.commit()
            return result
        finally:
            cursor.close()

    def fetch_all(self, query: str, params: tuple = None) -> List[Dict]:
        """Execute a query and return all rows as dictionaries."""
        if not self._connected:
            raise ConnectionError("Not connected to database")

        cursor = self._connection.cursor()
        try:
            cursor.execute(query, params or ())
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]
        finally:
            cursor.close()

    def list_tables(self, schema: str = None) -> List[TableInfo]:
        """List all tables in the database or schema."""
        if not self._connected:
            raise ConnectionError("Not connected to database")

        target_schema = schema or self._config.schema
        query = """
            SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = %s
        """
        rows = self.fetch_all(query, (target_schema,))

        tables = []
        for row in rows:
            tables.append(TableInfo(
                schema_name=row["TABLE_SCHEMA"],
                table_name=row["TABLE_NAME"],
                table_type=row["TABLE_TYPE"]
            ))
        return tables

    def list_columns(self, schema: str, table: str) -> List[ColumnInfo]:
        """List all columns in a table."""
        if not self._connected:
            raise ConnectionError("Not connected to database")

        query = """
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s
            ORDER BY ORDINAL_POSITION
        """
        rows = self.fetch_all(query, (schema, table))

        columns = []
        for row in rows:
            columns.append(ColumnInfo(
                column_name=row["COLUMN_NAME"],
                data_type=row["DATA_TYPE"],
                is_nullable=row["IS_NULLABLE"] == "YES",
                column_default=row["COLUMN_DEFAULT"]
            ))
        return columns

    def validate(self) -> bool:
        """Validate that the connection is alive and functional."""
        if not self._connected:
            return False

        try:
            result = self.execute("SELECT 1")
            return result is not None
        except Exception:
            return False

    def test_connection(self, config: SnowflakeConfig) -> ConnectionTestResult:
        """Test a connection and return detailed results."""
        import time

        start_time = time.time()
        try:
            self.connect(config)
            latency_ms = int((time.time() - start_time) * 1000)

            version_result = self.fetch_all("SELECT CURRENT_VERSION()")
            server_version = None
            if version_result:
                server_version = str(version_result[0].get("CURRENT_VERSION()", ""))

            capabilities = self._get_capabilities()

            return ConnectionTestResult(
                success=True,
                message="Connection successful",
                latency_ms=latency_ms,
                server_version=server_version,
                capabilities=capabilities
            )
        except Exception as e:
            latency_ms = int((time.time() - start_time) * 1000)
            return ConnectionTestResult(
                success=False,
                message=str(e),
                latency_ms=latency_ms
            )
        finally:
            if self._connected:
                self.close()

    def close(self) -> None:
        """Close the connection."""
        if self._connection:
            try:
                self._connection.close()
            except Exception:
                pass
            finally:
                self._connected = False
                self._connection = None

    def get_capabilities(self) -> List[str]:
        """Return list of supported capabilities."""
        return [
            "connection_pooling",
            "retry_logic",
            "ssl_tls",
            "list_tables",
            "list_columns",
            "schema_introspection",
            "bulk_load",
            "streaming"
        ]

    def _get_capabilities(self) -> List[str]:
        return self.get_capabilities()


AdapterRegistry.register("snowflake", SnowflakeAdapter)
