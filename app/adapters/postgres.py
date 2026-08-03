"""
PostgresAdapter - PostgreSQL implementation of ConnectionAdapter

This adapter implements the ConnectionAdapter interface for PostgreSQL databases.
It uses the metadata-driven architecture with SecretsProvider for credential management.
"""

from typing import Any, Dict, List, Optional

from .base_adapter import ConnectionAdapter
from .models import TableInfo, ColumnInfo, ConnectionTestResult
from ..config import PostgresConfig
from ..adapters.registry import AdapterRegistry
from ..adapters.pool import ConnectionPoolManager


class PostgresAdapter(ConnectionAdapter):
    """PostgreSQL adapter implementing the ConnectionAdapter interface."""

    def __init__(self):
        self._pool_manager = ConnectionPoolManager()
        self._connected = False
        self._connection = None
        self._config = None

    def connect(self, config: PostgresConfig) -> None:
        """Establish connection to PostgreSQL database."""
        self._config = config
        self._connection = self._pool_manager.get_connection(
            system_id=config.host,
            config=config,
            db_type="postgres"
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

        query = """
            SELECT table_schema, table_name, table_type
            FROM information_schema.tables
            WHERE table_schema = %s OR %s IS NULL
        """
        rows = self.fetch_all(query, (schema or self._config.schema, schema))

        tables = []
        for row in rows:
            tables.append(TableInfo(
                schema_name=row["table_schema"],
                table_name=row["table_name"],
                table_type=row["table_type"]
            ))
        return tables

    def list_columns(self, schema: str, table: str) -> List[ColumnInfo]:
        """List all columns in a table."""
        if not self._connected:
            raise ConnectionError("Not connected to database")

        query = """
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = %s AND table_name = %s
            ORDER BY ordinal_position
        """
        rows = self.fetch_all(query, (schema, table))

        columns = []
        for row in rows:
            columns.append(ColumnInfo(
                column_name=row["column_name"],
                data_type=row["data_type"],
                is_nullable=row["is_nullable"] == "YES",
                column_default=row["column_default"]
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

    def test_connection(self, config: PostgresConfig) -> ConnectionTestResult:
        """Test a connection and return detailed results."""
        import time

        start_time = time.time()
        try:
            self.connect(config)
            latency_ms = int((time.time() - start_time) * 1000)

            # Get server version
            version_result = self.fetch_all("SELECT version()")
            server_version = version_result[0]["version"] if version_result else None

            # Get capabilities
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
            "streaming",
            "transactions",
            "stored_procedures",
            "materialized_views",
            "partitioning"
        ]

    def _get_capabilities(self) -> List[str]:
        """Get structured capabilities for this adapter."""
        return self.get_capabilities()


# Register adapter at import time
AdapterRegistry.register("postgres", PostgresAdapter)
