# 02 — Connection Manager

**Phase:** 10.2 — Connection Manager  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Connection Manager Framework                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Connection   │    │  Connection   │    │  Connection   │       │
│  │  Registry     │    │  Factory      │    │  Pool Manager │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                    │                    │               │
│         ▼                    ▼                    ▼               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Adapter Interface (Contract)                  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  connect()  execute()  list_tables()  validate()  close() │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                    │                    │               │
│    ┌────┴────┐          ┌───┴───┐          ┌────┴────┐         │
│    │ Postgres │          │ MySQL │          │ Oracle  │  ...     │
│    │ Adapter  │          │Adapter│          │ Adapter │         │
│    └─────────┘          └───────┘          └─────────┘         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Adapter Contract

Every adapter must implement the `ConnectionAdapter` interface:

```python
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum

# ── Adapter-Specific Configuration Classes ──────────────────────────────

@dataclass
class BaseConnectionConfig:
    """Base config shared by all adapters."""
    username: Optional[str] = None
    password: Optional[str] = None
    timeout: int = 10
    extra: Dict[str, Any] = field(default_factory=dict)

@dataclass
class PostgresConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 5432
    database: str = ""
    schema: str = "public"
    ssl_mode: str = "prefer"
    ssl_cert: Optional[str] = None
    ssl_key: Optional[str] = None
    ssl_root_cert: Optional[str] = None
    application_name: str = "map_platform"
    command_timeout: int = 60

@dataclass
class SQLServerConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 1433
    database: str = ""
    schema: str = "dbo"
    encrypt: bool = True
    trust_server_certificate: bool = False
    connection_timeout: int = 10
    command_timeout: int = 60

@dataclass
class MySQLConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 3306
    database: str = ""
    charset: str = "utf8mb4"
    ssl_ca: Optional[str] = None
    ssl_cert: Optional[str] = None
    ssl_key: Optional[str] = None

@dataclass
class OracleConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 1521
    service_name: str = ""
    schema: str = ""
    ssl: bool = False

@dataclass
class SnowflakeConfig(BaseConnectionConfig):
    account: str = ""
    warehouse: str = ""
    database: str = ""
    schema: str = ""
    role: Optional[str] = None
    authenticator: str = "snowflake"

@dataclass
class BigQueryConfig(BaseConnectionConfig):
    project_id: str = ""
    dataset: str = ""
    location: str = "US"
    credentials_file: Optional[str] = None

@dataclass
class DatabricksConfig(BaseConnectionConfig):
    host: str = ""
    http_path: str = ""
    catalog: str = ""
    schema: str = ""

# Type alias for API layer (JSONB storage)
ConnectionConfig = Dict[str, Any]

@dataclass
class TableInfo:
    """Metadata about a database table."""
    schema_name: str
    table_name: str
    table_type: str  # 'BASE TABLE', 'VIEW', 'MATERIALIZED VIEW'
    row_count: Optional[int] = None
    column_count: Optional[int] = None

@dataclass
class ColumnInfo:
    """Metadata about a table column."""
    column_name: str
    data_type: str
    is_nullable: bool
    column_default: Optional[str] = None
    is_primary_key: bool = False

@dataclass
class ConnectionTestResult:
    """Result of a connection test."""
    success: bool
    message: str
    latency_ms: int
    server_version: Optional[str] = None
    capabilities: List[str] = None

class ConnectionAdapter(ABC):
    """Abstract base class for all database adapters."""

    @abstractmethod
    def connect(self, config: ConnectionConfig) -> None:
        """Establish connection to the database."""
        pass

    @abstractmethod
    def execute(self, query: str, params: tuple = None) -> Any:
        """Execute a query and return results."""
        pass

    @abstractmethod
    def fetch_all(self, query: str, params: tuple = None) -> List[Dict]:
        """Execute a query and return all rows as dictionaries."""
        pass

    @abstractmethod
    def list_tables(self, schema: str = None) -> List[TableInfo]:
        """List all tables in the database or schema."""
        pass

    @abstractmethod
    def list_columns(self, schema: str, table: str) -> List[ColumnInfo]:
        """List all columns in a table."""
        pass

    @abstractmethod
    def validate(self) -> bool:
        """Validate that the connection is alive and functional."""
        pass

    @abstractmethod
    def test_connection(self, config: ConnectionConfig) -> ConnectionTestResult:
        """Test a connection and return detailed results."""
        pass

    @abstractmethod
    def close(self) -> None:
        """Close the connection."""
        pass

    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return list of supported capabilities."""
        pass
```

---

## Adapter Registry

Adapters are registered dynamically, not hardcoded:

```python
class AdapterRegistry:
    """Registry of available database adapters."""

    _adapters: Dict[str, type] = {}

    @classmethod
    def register(cls, db_type: str, adapter_class: type):
        """Register an adapter class for a database type."""
        cls._adapters[db_type] = adapter_class

    @classmethod
    def get(cls, db_type: str) -> type:
        """Get adapter class for a database type."""
        if db_type not in cls._adapters:
            raise ValueError(f"No adapter registered for {db_type}")
        return cls._adapters[db_type]

    @classmethod
    def supported_types(cls) -> List[str]:
        """Return list of supported database types."""
        return list(cls._adapters.keys())

# Registration happens at import time
AdapterRegistry.register("postgres", PostgresAdapter)
AdapterRegistry.register("mysql", MySQLAdapter)
AdapterRegistry.register("sqlserver", SQLServerAdapter)
AdapterRegistry.register("oracle", OracleAdapter)
AdapterRegistry.register("snowflake", SnowflakeAdapter)
AdapterRegistry.register("bigquery", BigQueryAdapter)
AdapterRegistry.register("databricks", DatabricksAdapter)
```

---

## Connection Pool Manager

```python
class ConnectionPoolManager:
    """Manages connection pools per database type and instance."""

    def __init__(self):
        self._pools: Dict[str, Any] = {}

    def get_connection(self, system_id: str, config: ConnectionConfig, db_type: str):
        """Get a connection from the pool or create a new one."""
        pool_key = f"{db_type}:{config.host}:{config.port}:{config.database}"

        if pool_key not in self._pools:
            adapter_class = AdapterRegistry.get(db_type)
            self._pools[pool_key] = ConnectionPool(
                adapter_class=adapter_class,
                config=config,
                min_connections=1,
                max_connections=20
            )

        return self._pools[pool_key].acquire()

    def release_connection(self, pool_key: str, connection):
        """Return a connection to the pool."""
        if pool_key in self._pools:
            self._pools[pool_key].release(connection)

    def health_check(self):
        """Check health of all pools."""
        results = {}
        for pool_key, pool in self._pools.items():
            results[pool_key] = pool.health_check()
        return results

    def close_all(self):
        """Close all connections in all pools."""
        for pool in self._pools.values():
            pool.close()
```

---

## SecretsProvider Abstraction

Separates credential retrieval from encryption and storage, enabling clean Vault integration later.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Secrets Architecture                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐                                            │
│  │  SecretsProvider  │  ← Credential retrieval                   │
│  └────────┬─────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌──────────────────┐                                            │
│  │ EncryptionProvider│  ← Encryption/decryption                  │
│  └────────┬─────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌──────────────────┐                                            │
│  │ CredentialManager│  ← Credential lifecycle CRUD               │
│  └──────────────────┘                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```python
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class SecretsProvider(ABC):
    """Abstract credential retrieval — the single source of truth for secrets."""

    @abstractmethod
    def get_secret(self, secret_id: str) -> Optional[str]:
        """Retrieve a secret by ID."""
        pass

    @abstractmethod
    def get_credential(self, system_id: str, credential_type: str) -> Dict[str, Any]:
        """Retrieve full credential payload for a system."""
        pass

    @abstractmethod
    def set_secret(self, secret_id: str, value: str) -> bool:
        """Store or update a secret."""
        pass

    @abstractmethod
    def delete_secret(self, secret_id: str) -> bool:
        """Delete a secret."""
        pass

    @abstractmethod
    def list_secrets(self, prefix: str = "") -> list:
        """List secrets by prefix."""
        pass


class DatabaseSecretsProvider(SecretsProvider):
    """Production default — reads from PostgreSQL encrypted storage."""

    def __init__(self, db, encryption_provider):
        self.db = db
        self.encryption = encryption_provider

    def get_secret(self, secret_id: str) -> Optional[str]:
        query = "SELECT encrypted_value FROM core.system_credentials WHERE credential_id = %s"
        rows = self.db.execute(query, (secret_id,))
        if rows:
            return self.encryption.decrypt(rows[0]["encrypted_value"])
        return None

    def get_credential(self, system_id: str, credential_type: str) -> Dict[str, Any]:
        query = """
            SELECT credential_id, credential_name, encrypted_value, credential_config
            FROM core.system_credentials
            WHERE system_id = %s AND credential_type = %s
        """
        rows = self.db.execute(query, (system_id, credential_type))
        if rows:
            row = rows[0]
            return {
                "credential_id": row["credential_id"],
                "credential_name": row["credential_name"],
                "password": self.encryption.decrypt(row["encrypted_value"]),
                "config": row["credential_config"],
            }
        return {}

    def set_secret(self, secret_id: str, value: str) -> bool:
        encrypted = self.encryption.encrypt(value)
        query = """
            UPDATE core.system_credentials
            SET encrypted_value = %s, updated_at = NOW()
            WHERE credential_id = %s
        """
        self.db.execute(query, (encrypted, secret_id))
        return True

    def delete_secret(self, secret_id: str) -> bool:
        query = "DELETE FROM core.system_credentials WHERE credential_id = %s"
        self.db.execute(query, (secret_id,))
        return True

    def list_secrets(self, prefix: str = "") -> list:
        if prefix:
            query = """
                SELECT credential_id, credential_name, system_id
                FROM core.system_credentials
                WHERE credential_name LIKE %s
            """
            return self.db.execute(query, (f"{prefix}%",))
        query = "SELECT credential_id, credential_name, system_id FROM core.system_credentials"
        return self.db.execute(query)


class EnvironmentSecretsProvider(SecretsProvider):
    """Development/testing — reads from environment variables."""

    def get_secret(self, secret_id: str) -> Optional[str]:
        return os.environ.get(secret_id)

    def get_credential(self, system_id: str, credential_type: str) -> Dict[str, Any]:
        key = f"{system_id}_{credential_type}".upper()
        return {"password": os.environ.get(key, "")}

    def set_secret(self, secret_id: str, value: str) -> bool:
        os.environ[secret_id] = value
        return True

    def delete_secret(self, secret_id: str) -> bool:
        os.environ.pop(secret_id, None)
        return True

    def list_secrets(self, prefix: str = "") -> list:
        return [k for k in os.environ if k.startswith(prefix)]


# Future: VaultSecretsProvider, AzureKeyVaultSecretsProvider
```

---

## Supported Database Matrix

| Database | Type Key | Adapter Class | Priority | Notes |
|----------|----------|---------------|----------|-------|
| PostgreSQL | `postgres` | PostgresAdapter | P1 | Primary engine DB + source/target |
| SQL Server | `sqlserver` | SQLServerAdapter | P1 | Common enterprise source/target |
| MySQL | `mysql` | MySQLAdapter | P1 | Common source/target |
| Oracle | `oracle` | OracleAdapter | P2 | Enterprise source/target |
| Snowflake | `snowflake` | SnowflakeAdapter | P2 | Cloud data warehouse |
| BigQuery | `bigquery` | BigQueryAdapter | P2 | Google cloud warehouse |
| Databricks | `databricks` | DatabricksAdapter | P2 | Lakehouse platform |
| SQLite | `sqlite` | SQLiteAdapter | P3 | Lightweight, dev/test |
| Flat File | `csv` | CSVAdapter | P3 | CSV/TSV file sources |
| REST API | `rest_api` | RestAPIAdapter | P3 | API-based data sources |

---

## Adapter Capability Profiles

Structured capability profiles replace string lists, enabling runtime feature detection:

```python
from dataclasses import dataclass, field
from enum import Flag, auto

class Capability(Flag):
    """Structured adapter capabilities."""
    CONNECTION_POOLING = auto()
    RETRY_LOGIC = auto()
    SSL_TLS = auto()
    LIST_TABLES = auto()
    LIST_COLUMNS = auto()
    SCHEMA_INTROSPECTION = auto()
    BULK_LOAD = auto()
    STREAMING = auto()
    TRANSACTIONS = auto()
    STORED_PROCEDURES = auto()
    MATERIALIZED_VIEWS = auto()
    PARTITIONING = auto()

@dataclass
class AdapterCapabilityProfile:
    """Structured capability profile for an adapter."""
    db_type: str
    capabilities: Capability
    max_identifier_length: int = 128
    supports_schemas: bool = True
    supports_sequences: bool = False
    supports_upsert: bool = False
    default_port: int = 0
    connection_config_class: type = None

# Example profiles
POSTGRES_PROFILE = AdapterCapabilityProfile(
    db_type="postgres",
    capabilities=(
        Capability.CONNECTION_POOLING | Capability.RETRY_LOGIC |
        Capability.SSL_TLS | Capability.LIST_TABLES | Capability.LIST_COLUMNS |
        Capability.SCHEMA_INTROSPECTION | Capability.BULK_LOAD |
        Capability.STREAMING | Capability.TRANSACTIONS |
        Capability.STORED_PROCEDURES | Capability.MATERIALIZED_VIEWS |
        Capability.PARTITIONING
    ),
    max_identifier_length=63,
    supports_sequences=True,
    supports_upsert=True,
    default_port=5432,
    connection_config_class=PostgresConfig,
)

BIGQUERY_PROFILE = AdapterCapabilityProfile(
    db_type="bigquery",
    capabilities=(
        Capability.RETRY_LOGIC | Capability.LIST_TABLES |
        Capability.LIST_COLUMNS | Capability.SCHEMA_INTROSPECTION |
        Capability.BULK_LOAD | Capability.STREAMING
    ),
    max_identifier_length=1024,
    supports_schemas=False,
    default_port=0,
    connection_config_class=BigQueryConfig,
)
```

| Capability | Postgres | SQL Server | MySQL | Oracle | Snowflake | BigQuery | Databricks |
|------------|----------|------------|-------|--------|-----------|----------|------------|
| Connection Pooling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Retry Logic | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SSL/TLS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| list_tables | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| list_columns | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schema Introspection | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bulk Load | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Streaming | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Transactions | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Stored Procedures | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Connection Configuration Schema

Each database type has its own configuration schema, stored as JSONB:

```json
{
  "postgres": {
    "host": "string",
    "port": 5432,
    "database": "string",
    "schema": "public",
    "ssl_mode": "prefer|require|verify-ca|verify-full",
    "ssl_cert": "string (path or PEM)",
    "ssl_key": "string (path or PEM)",
    "ssl_root_cert": "string (path or PEM)",
    "connection_timeout": 10,
    "command_timeout": 60,
    "application_name": "map_platform"
  },
  "sqlserver": {
    "host": "string",
    "port": 1433,
    "database": "string",
    "schema": "dbo",
    "trust_server_certificate": false,
    "encrypt": true,
    "connection_timeout": 10,
    "command_timeout": 60
  },
  "mysql": {
    "host": "string",
    "port": 3306,
    "database": "string",
    "charset": "utf8mb4",
    "ssl_ca": "string",
    "ssl_cert": "string",
    "ssl_key": "string",
    "connection_timeout": 10
  },
  "oracle": {
    "host": "string",
    "port": 1521,
    "service_name": "string",
    "schema": "string",
    "ssl": false,
    "connection_timeout": 10
  },
  "snowflake": {
    "account": "string",
    "warehouse": "string",
    "database": "string",
    "schema": "string",
    "role": "string",
    "authenticator": "snowflake|oauth|externalbrowser",
    "connection_timeout": 30
  },
  "bigquery": {
    "project_id": "string",
    "dataset": "string",
    "location": "US",
    "credentials_file": "string (path to service account JSON)",
    "connection_timeout": 30
  },
  "databricks": {
    "host": "string",
    "http_path": "string",
    "catalog": "string",
    "schema": "string",
    "connection_timeout": 30
  }
}
```
