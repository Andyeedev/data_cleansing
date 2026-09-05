# Future Connection Manager Architecture

**Phase:** 10.2 — Future Connection Manager Architecture  
**Status:** Architecture Baseline v1.0 — Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)  
**Approved Sections:** 10.1 Sections 1 & 2 (Current State + Gap Analysis)  
**Architecture Review:** Completed — Refinements Incorporated

---

## Scope

Design the end-state Connection Manager architecture supporting:

1. Generic connection framework
2. Multiple source/target connection types
3. Automated onboarding
4. Discovery
5. Mapping
6. Validation
7. Metadata-driven architecture
8. Tenant isolation
9. Enterprise security
10. MAP CLI integration

**Constraint:** No assumptions (Azure, Vault, etc.) without approval. Technology choices presented as options.

---

## 1. Generic Connection Framework

### 1.1 Design Principle

The Connection Manager must be **database-agnostic**. The framework treats all connection types uniformly through a common interface, regardless of whether the target is PostgreSQL, Oracle, Snowflake, or any future system.

### 1.2 Architecture

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

### 1.3 Adapter Contract

Every adapter must implement the `ConnectionAdapter` interface:

```python
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum

# ── Adapter-Specific Configuration Classes ──────────────────────────────
# Each adapter defines its own config rather than using a single generic class.
# This prevents field bloat and enforces adapter-specific validation.

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

### 1.4 Adapter Registry

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

### 1.5 Connection Pool Manager

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

### 1.6 SecretsProvider Abstraction

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

## 2. Multiple Source/Target Connection Types

### 2.1 Supported Database Matrix

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

### 2.2 Adapter Capability Profiles

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
    connection_config_class: type = None  # Adapter-specific config class

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

### 2.3 Connection Configuration Schema

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

---

## 3. Automated Onboarding

### 3.1 Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Automated Onboarding Flow                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: Register Systems                                        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Create   │───▶│  Create   │───▶│  Create   │                   │
│  │  Project  │    │  Source   │    │  Target   │                   │
│  │           │    │  System   │    │  System   │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 2: Configure Connections                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Create   │───▶│  Create   │───▶│  Test     │                   │
│  │  Source   │    │  Target   │    │  Both     │                   │
│  │  Creds    │    │  Creds    │    │  Conns    │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 3: Discover                                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Discover │───▶│  Profile  │───▶│  Match    │                   │
│  │  Schema   │    │  Data     │    │  Tables   │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 4: Map                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Auto-    │───▶│  Review   │───▶│  Confirm  │                   │
│  │  Map      │    │  Mappings │    │  Mappings │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 5: Validate                                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Auto-    │───▶│  Review   │───▶│  Execute  │                   │
│  │  Rules    │    │  Rules    │    │  Validation│                  │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Onboarding Service

```python
class OnboardingService:
    """Orchestrates the automated onboarding process."""

    def __init__(self):
        self.connection_manager = ConnectionManager()
        self.discovery_service = DiscoveryService()
        self.mapping_service = MappingService()
        self.validation_service = ValidationService()

    async def onboard_project(self, project_id: str) -> OnboardingResult:
        """Complete automated onboarding for a project."""

        # Step 1: Validate all systems have connections
        systems = await self.get_project_systems(project_id)
        for system in systems:
            if not await self.has_credentials(system.system_id):
                return OnboardingResult(
                    success=False,
                    step="validate_connections",
                    message=f"System {system.system_name} has no credentials"
                )

        # Step 2: Test all connections
        for system in systems:
            test_result = await self.connection_manager.test_connection(system.system_id)
            if not test_result.success:
                return OnboardingResult(
                    success=False,
                    step="test_connections",
                    message=f"Connection failed for {system.system_name}: {test_result.message}"
                )

        # Step 3: Discover schema
        discovery_result = await self.discovery_service.discover(project_id)

        # Step 4: Auto-map tables
        mapping_result = await self.mapping_service.auto_map(project_id)

        # Step 5: Auto-configure validation rules
        validation_result = await self.validation_service.auto_configure(project_id)

        return OnboardingResult(
            success=True,
            step="complete",
            message="Onboarding complete",
            discovery=mapping_result,
            mappings=mapping_result,
            rules=validation_result
        )
```

### 3.3 Onboarding API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/onboarding/{project_id}/status` | GET | Get onboarding status |
| `/api/v1/onboarding/{project_id}/start` | POST | Start automated onboarding |
| `/api/v1/onboarding/{project_id}/validate` | POST | Validate connections |
| `/api/v1/onboarding/{project_id}/discover` | POST | Trigger discovery |
| `/api/v1/onboarding/{project_id}/map` | POST | Trigger auto-mapping |
| `/api/v1/onboarding/{project_id}/validate-rules` | POST | Auto-configure rules |
| `/api/v1/onboarding/{project_id}/complete` | POST | Complete onboarding |

---

## 4. Discovery

### 4.1 Discovery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Discovery Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Source System                    Target System                   │
│  ┌──────────┐                    ┌──────────┐                   │
│  │ Adapter   │                    │ Adapter   │                   │
│  │ .list_    │                    │ .list_    │                   │
│  │ tables()  │                    │ tables()  │                   │
│  └────┬─────┘                    └────┬─────┘                   │
│       │                               │                          │
│       ▼                               ▼                          │
│  ┌──────────┐                    ┌──────────┐                   │
│  │ Source    │                    │ Target    │                   │
│  │ Schema    │                    │ Schema    │                   │
│  │ Metadata  │                    │ Metadata  │                   │
│  └────┬─────┘                    └────┬─────┘                   │
│       │                               │                          │
│       └───────────┬───────────────────┘                          │
│                   │                                              │
│                   ▼                                              │
│            ┌──────────┐                                         │
│            │  Schema   │                                         │
│            │  Matcher  │                                         │
│            └────┬─────┘                                         │
│                 │                                                │
│                 ▼                                                │
│            ┌──────────┐                                         │
│            │  Matched  │                                         │
│            │  Pairs    │                                         │
│            └──────────┘                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Discovery Service

```python
class DiscoveryService:
    """Discovers schema metadata from source and target systems."""

    def __init__(self):
        self.connection_manager = ConnectionManager()

    async def discover(self, project_id: str) -> DiscoveryResult:
        """Discover schema for all systems in a project."""

        systems = await self.get_project_systems(project_id)
        source_systems = [s for s in systems if s.system_role == "SOURCE"]
        target_systems = [s for s in systems if s.system_role == "TARGET"]

        discovered_datasets = []

        for source in source_systems:
            for target in target_systems:
                # Discover source schema
                source_schema = await self._discover_schema(source)

                # Discover target schema
                target_schema = await self._discover_schema(target)

                # Match tables
                matched_tables = self._match_tables(source_schema, target_schema)

                discovered_datasets.append(DiscoveredDataset(
                    source_system=source,
                    target_system=target,
                    source_tables=source_schema.tables,
                    target_tables=target_schema.tables,
                    matched_tables=matched_tables
                ))

        return DiscoveryResult(
            project_id=project_id,
            datasets=discovered_datasets,
            timestamp=datetime.utcnow()
        )

    async def _discover_schema(self, system) -> SchemaMetadata:
        """Discover schema for a single system."""
        adapter = self.connection_manager.get_adapter(system)

        tables = adapter.list_tables()
        columns = {}
        for table in tables:
            columns[f"{table.schema_name}.{table.table_name}"] = adapter.list_columns(
                table.schema_name, table.table_name
            )

        return SchemaMetadata(
            system=system,
            tables=tables,
            columns=columns
        )

    def _match_tables(self, source: SchemaMetadata, target: SchemaMetadata) -> List[TableMatch]:
        """Match source tables to target tables using naming conventions."""
        matches = []

        for source_table in source.tables:
            # Exact match
            for target_table in target.tables:
                if self._tables_match(source_table, target_table):
                    matches.append(TableMatch(
                        source=source_table,
                        target=target_table,
                        confidence=1.0,
                        match_type="exact"
                    ))

            # Fuzzy match (strip prefixes/suffixes)
            if not any(m.source == source_table for m in matches):
                best_match = self._fuzzy_match(source_table, target.tables)
                if best_match:
                    matches.append(TableMatch(
                        source=source_table,
                        target=best_match,
                        confidence=0.8,
                        match_type="fuzzy"
                    ))

        return matches
```

### 4.3 Discovery API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/discovery/{project_id}` | GET | Get discovery results |
| `/api/v1/discovery/{project_id}/start` | POST | Start discovery |
| `/api/v1/discovery/{project_id}/status` | GET | Get discovery status |
| `/api/v1/discovery/{project_id}/tables` | GET | Get discovered tables |
| `/api/v1/discovery/{project_id}/columns/{table}` | GET | Get discovered columns |
| `/api/v1/discovery/{project_id}/matches` | GET | Get table matches |

---

## 5. Mapping

### 5.1 Mapping Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Mapping Architecture                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Mapping Levels                          │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Level 1: Project Mapping                                 │   │
│  │  - Source System ──▶ Target System                         │   │
│  │                                                             │   │
│  │  Level 2: Dataset Mapping                                  │   │
│  │  - Source Table ──▶ Target Table                           │   │
│  │                                                             │   │
│  │  Level 3: Column Mapping                                   │   │
│  │  - Source Column ──▶ Target Column                         │   │
│  │  - Transformation Rules                                    │   │
│  │  - Validation Rules                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Mapping Rules                           │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  - Name Transform: strip_prefix, strip_suffix, camel_case │   │
│  │  - Type Mapping: int→bigint, varchar→text, etc.           │   │
│  │  - Nullable Mapping: source NOT NULL → target NOT NULL    │   │
│  │  - Default Mapping: source DEFAULT → target DEFAULT       │   │
│  │  - Custom Transform: SQL expressions, UDFs                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Mapping Service

```python
class MappingService:
    """Manages source-to-target mappings at all levels."""

    async def auto_map(self, project_id: str) -> MappingResult:
        """Automatically create mappings based on discovery results."""

        discovery = await self.discovery_service.get_results(project_id)
        mappings = []

        for dataset in discovery.datasets:
            for match in dataset.matched_tables:
                # Create dataset mapping
                dataset_mapping = await self.create_dataset_mapping(
                    project_id=project_id,
                    source_system=dataset.source_system,
                    target_system=dataset.target_system,
                    source_table=match.source,
                    target_table=match.target
                )

                # Auto-map columns
                column_mappings = await self.auto_map_columns(
                    dataset_mapping.mapping_id,
                    match.source,
                    match.target
                )

                mappings.append(DatasetMappingWithColumns(
                    dataset_mapping=dataset_mapping,
                    column_mappings=column_mappings
                ))

        return MappingResult(
            project_id=project_id,
            mappings=mappings,
            total_mappings=len(mappings)
        )

    async def auto_map_columns(self, mapping_id: str, source_table: TableInfo, target_table: TableInfo) -> List[ColumnMapping]:
        """Automatically map columns based on name and type similarity."""

        source_columns = await self.get_source_columns(mapping_id)
        target_columns = await self.get_target_columns(mapping_id)

        column_mappings = []

        for source_col in source_columns:
            # Exact name match
            exact_match = next((t for t in target_columns if t.column_name == source_col.column_name), None)
            if exact_match:
                column_mappings.append(ColumnMapping(
                    source_column=source_col.column_name,
                    target_column=exact_match.column_name,
                    confidence=1.0,
                    match_type="exact"
                ))
                continue

            # Fuzzy name match
            fuzzy_match = self._fuzzy_match_column(source_col, target_columns)
            if fuzzy_match:
                column_mappings.append(ColumnMapping(
                    source_column=source_col.column_name,
                    target_column=fuzzy_match.column_name,
                    confidence=0.7,
                    match_type="fuzzy",
                    transformation=self._suggest_transformation(source_col, fuzzy_match)
                ))

        return column_mappings
```

### 5.3 Mapping API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/mappings/{project_id}` | GET | Get all mappings for project |
| `/api/v1/mappings/{project_id}/auto` | POST | Auto-generate mappings |
| `/api/v1/mappings/{mapping_id}` | GET | Get dataset mapping detail |
| `/api/v1/mappings/{mapping_id}` | PUT | Update dataset mapping |
| `/api/v1/mappings/{mapping_id}/columns` | GET | Get column mappings |
| `/api/v1/mappings/{mapping_id}/columns` | POST | Create column mapping |
| `/api/v1/mappings/{mapping_id}/columns/{id}` | PUT | Update column mapping |
| `/api/v1/mappings/{mapping_id}/columns/{id}` | DELETE | Delete column mapping |
| `/api/v1/mappings/{mapping_id}/validate` | POST | Validate mapping |

---

## 6. Validation

### 6.1 Validation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Validation Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Validation Levels                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Level 1: Connection Validation                            │   │
│  │  - Can we connect?                                         │   │
│  │  - Are credentials valid?                                  │   │
│  │  - Do we have required permissions?                        │   │
│  │                                                             │   │
│  │  Level 2: Schema Validation                                │   │
│  │  - Do source/target tables exist?                          │   │
│  │  - Do mapped columns exist?                                │   │
│  │  - Are data types compatible?                              │   │
│  │                                                             │   │
│  │  Level 3: Data Validation                                  │   │
│  │  - Row count comparison                                    │   │
│  │  - Checksum/hash comparison                                │   │
│  │  - Statistical profiling                                   │   │
│  │  - Business rule validation                                │   │
│  │                                                             │   │
│  │  Level 4: Governance Validation                            │   │
│  │  - Compliance checks                                       │   │
│  │  - Risk scoring                                            │   │
│  │  - Release gate decisions                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Validation Service

```python
class ValidationService:
    """Orchestrates validation at all levels."""

    async def validate_project(self, project_id: str) -> ValidationResult:
        """Run all validation levels for a project."""

        results = []

        # Level 1: Connection Validation
        connection_results = await self.validate_connections(project_id)
        results.append(connection_results)

        # Level 2: Schema Validation
        schema_results = await self.validate_schema(project_id)
        results.append(schema_results)

        # Level 3: Data Validation
        data_results = await self.validate_data(project_id)
        results.append(data_results)

        # Level 4: Governance Validation
        governance_results = await self.validate_governance(project_id)
        results.append(governance_results)

        return ValidationResult(
            project_id=project_id,
            levels=results,
            overall_status=self._calculate_overall_status(results),
            timestamp=datetime.utcnow()
        )

    async def validate_connections(self, project_id: str) -> LevelResult:
        """Validate all connections for a project."""
        systems = await self.get_project_systems(project_id)
        results = []

        for system in systems:
            test_result = await self.connection_manager.test_connection(system.system_id)
            results.append(ConnectionValidation(
                system=system,
                success=test_result.success,
                message=test_result.message,
                latency_ms=test_result.latency_ms
            ))

        return LevelResult(
            level=1,
            name="Connection Validation",
            passed=all(r.success for r in results),
            results=results
        )
```

### 6.3 Validation API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/validation/{project_id}` | GET | Get validation results |
| `/api/v1/validation/{project_id}/run` | POST | Run all validations |
| `/api/v1/validation/{project_id}/connections` | POST | Validate connections |
| `/api/v1/validation/{project_id}/schema` | POST | Validate schema |
| `/api/v1/validation/{project_id}/data` | POST | Validate data |
| `/api/v1/validation/{project_id}/governance` | POST | Validate governance |

---

## 7. Metadata-Driven Architecture

### 7.1 Metadata Schema

All connection, discovery, mapping, and validation metadata is stored in PostgreSQL:

```
core schema:
├── projects
├── tenants
├── system_registry          -- Connection definitions
├── system_credentials       -- Encrypted credentials
├── system_connection_log    -- Connection test/audit events
├── dataset_mappings         -- Source-to-target table mappings
├── dataset_columns          -- Column metadata
├── column_mappings          -- Source-to-target column mappings
├── onboarding_status        -- Project onboarding progress
├── discovery_results        -- Latest discovery execution results
└── discovery_snapshots      -- Historical discovery snapshots (NEW)

engine schema:
├── migration_validation_batch
├── migration_batch_registry
├── schedule_execution_log
├── migration_control_execution
├── migration_control_summary
└── migration_control_decisions
```

### 7.2 Discovery Snapshots

Historical snapshots enable schema drift detection, change detection, onboarding comparisons, and audit history.

```sql
CREATE TABLE core.discovery_snapshots (
    snapshot_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id         UUID NOT NULL REFERENCES core.projects(project_id),
    source_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    target_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    snapshot_type      VARCHAR(20) NOT NULL DEFAULT 'FULL',
    -- FULL: complete schema snapshot
    -- INCREMENTAL: only changes since last snapshot
    -- DRIFT: detected drift from previous snapshot

    source_schema      JSONB NOT NULL,
    target_schema      JSONB NOT NULL,
    matched_tables     JSONB NOT NULL,
    matched_columns    JSONB NOT NULL,
    drift_summary      JSONB,
    -- { "added_tables": [...], "removed_tables": [...],
    --   "added_columns": [...], "removed_columns": [...],
    --   "type_changes": [...] }

    snapshot_status    VARCHAR(20) NOT NULL DEFAULT 'COMPLETE',
    -- COMPLETE, PARTIAL, FAILED

    triggered_by       VARCHAR(30) NOT NULL,
    -- onboarding, manual, scheduled, drift_detection

    created_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by         VARCHAR(100)
);

CREATE INDEX idx_discovery_snapshots_project ON core.discovery_snapshots(project_id);
CREATE INDEX idx_discovery_snapshots_systems ON core.discovery_snapshots(source_system_id, target_system_id);
CREATE INDEX idx_discovery_snapshots_created ON core.discovery_snapshots(created_at DESC);
```

**Purpose:**
- **Schema drift:** Compare current discovery against previous snapshot to detect structural changes
- **Change detection:** Track when tables/columns are added, removed, or modified
- **Onboarding comparisons:** Verify onboarding progress by diffing before/after snapshots
- **Audit history:** Complete record of all schema states over time

### 7.2 Metadata-Driven Execution

The entire migration pipeline is driven by metadata:

```
┌─────────────────────────────────────────────────────────────────┐
│                  Metadata-Driven Execution                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐                                               │
│  │   Metadata    │                                               │
│  │   (Postgres)  │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Connection   │───▶│  Discovery   │───▶│  Mapping     │       │
│  │  Resolver     │    │  Engine      │    │  Engine      │       │
│  └──────────────┘    └──────────────┘    └──────┬───────┘       │
│                                                  │               │
│         ┌────────────────────────────────────────┘               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Validation   │───▶│  Execution   │───▶│  Governance  │       │
│  │  Engine       │    │  Engine      │    │  Engine      │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Metadata Access Pattern

```python
class MetadataDrivenPipeline:
    """Executes migration pipeline driven entirely by metadata."""

    def __init__(self, project_id: str):
        self.project_id = project_id
        self.metadata = MetadataRepository(project_id)

    async def execute(self) -> PipelineResult:
        """Execute the full pipeline based on metadata."""

        # Step 1: Resolve connections from metadata
        connections = await self.metadata.get_connections()

        # Step 2: Get mappings from metadata
        mappings = await self.metadata.get_mappings()

        # Step 3: Get validation rules from metadata
        rules = await self.metadata.get_rules()

        # Step 4: Execute pipeline
        for mapping in mappings:
            source_conn = connections[mapping.source_system_id]
            target_conn = connections[mapping.target_system_id]

            # Execute validation
            validation_result = await self.validate(
                source_conn, target_conn, mapping, rules
            )

            # Store results
            await self.metadata.store_result(mapping, validation_result)

        return PipelineResult(
            project_id=self.project_id,
            status="complete",
            timestamp=datetime.utcnow()
        )
```

---

## 8. Tenant Isolation

### 8.1 Isolation Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      Tenant Isolation Model                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Tenant A                                                        │
│  ├── Projects                                                    │
│  │   ├── Project A1                                              │
│  │   │   ├── Systems (SOURCE, TARGET)                            │
│  │   │   ├── Credentials (encrypted, tenant-scoped)              │
│  │   │   ├── Mappings                                            │
│  │   │   └── Validation Results                                  │
│  │   └── Project A2                                              │
│  │       └── ...                                                 │
│  └── Users                                                       │
│                                                                   │
│  Tenant B                                                        │
│  ├── Projects                                                    │
│  │   ├── Project B1                                              │
│  │   │   └── ...                                                 │
│  │   └── Project B2                                              │
│  │       └── ...                                                 │
│  └── Users                                                       │
│                                                                   │
│  Isolation: Tenant A cannot see Tenant B's data                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Isolation Implementation

```python
class TenantScopedRepository:
    """Base repository with tenant isolation."""

    def __init__(self, tenant_id: str):
        self.tenant_id = tenant_id

    def get_tenant_filter(self) -> str:
        """Return SQL WHERE clause for tenant isolation."""
        return "tenant_id = %s"

    def get_tenant_params(self) -> tuple:
        """Return parameters for tenant filter."""
        return (self.tenant_id,)

class SystemRepository(TenantScopedRepository):
    """System repository with tenant isolation."""

    def get_all(self) -> List[Dict]:
        query = f"""
            SELECT s.* FROM core.system_registry s
            JOIN core.projects p ON s.project_id = p.project_id
            WHERE p.tenant_id = %s
            ORDER BY s.system_name
        """
        return self.db.execute(query, (self.tenant_id,))

    def get_by_id(self, system_id: str) -> Optional[Dict]:
        query = f"""
            SELECT s.* FROM core.system_registry s
            JOIN core.projects p ON s.project_id = p.project_id
            WHERE s.system_id = %s AND p.tenant_id = %s
        """
        rows = self.db.execute(query, (system_id, self.tenant_id))
        return rows[0] if rows else None

class CredentialRepository(TenantScopedRepository):
    """Credential repository with tenant isolation."""

    def get_by_system_id(self, system_id: str) -> Optional[Dict]:
        query = f"""
            SELECT c.* FROM core.system_credentials c
            JOIN core.system_registry s ON c.system_id = s.system_id
            JOIN core.projects p ON s.project_id = p.project_id
            WHERE c.system_id = %s AND p.tenant_id = %s
        """
        rows = self.db.execute(query, (system_id, self.tenant_id))
        return rows[0] if rows else None
```

### 8.3 API-Level Enforcement

```python
# In route handlers
@router.get("/systems/")
async def list_systems(current_user = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    repo = SystemRepository(tenant_id)
    return repo.get_all()

@router.get("/systems/{system_id}")
async def get_system(system_id: str, current_user = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    repo = SystemRepository(tenant_id)
    system = repo.get_by_id(system_id)
    if not system:
        raise HTTPException(status_code=404, detail="System not found")
    return system
```

---

## 9. Enterprise Security

### 9.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Architecture                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 1: Authentication                 │   │
│  │  - JWT Token Validation                                   │   │
│  │  - Token Expiry                                           │   │
│  │  - Refresh Token Rotation                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 2: Authorization                  │   │
│  │  - Role-Based Access Control (RBAC)                       │   │
│  │  - Tenant Isolation                                       │   │
│  │  - Resource-Level Permissions                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 3: Data Security                  │   │
│  │  - Encryption at Rest (Fernet/AES)                        │   │
│  │  - Encryption in Transit (TLS)                            │   │
│  │  - Key Management                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 4: Audit                          │   │
│  │  - All CRUD Operations Logged                             │   │
│  │  - Connection Test Logging                                │   │
│  │  - Security Event Tracking                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Security Layer Architecture

Three separate responsibilities replace the single `EncryptionManager`:

```
SecretsProvider     → Credential retrieval (database, Vault, env vars)
EncryptionProvider  → Encryption/decryption operations (Fernet, AES)
CredentialManager   → Credential lifecycle (CRUD, validation, rotation)
```

```python
# ── EncryptionProvider ────────────────────────────────────────────────
# Pure encryption/decryption — knows nothing about storage

class EncryptionProvider:
    """Single source of truth for encryption operations."""

    def __init__(self, key_source: KeySource):
        self.key_source = key_source
        self._fernet = None

    def _get_fernet(self):
        if self._fernet is None:
            key = self.key_source.get_key()
            self._fernet = Fernet(key)
        return self._fernet

    def encrypt(self, plaintext: str) -> bytes:
        """Encrypt plaintext string."""
        return self._get_fernet().encrypt(plaintext.encode())

    def decrypt(self, ciphertext: bytes) -> str:
        """Decrypt ciphertext to plaintext string."""
        return self._get_fernet().decrypt(ciphertext).decode()

class KeySource(ABC):
    """Abstract key source for encryption key management."""

    @abstractmethod
    def get_key(self) -> bytes:
        pass

class EnvironmentKeySource(KeySource):
    """Key from environment variable (development)."""

    def __init__(self, env_var: str = "FERNET_KEY"):
        self.env_var = env_var

    def get_key(self) -> bytes:
        key = os.environ.get(self.env_var)
        if not key:
            raise ValueError(f"Environment variable {self.env_var} not set")
        return key.encode()

class FileKeySource(KeySource):
    """Key from file (testing)."""

    def __init__(self, key_path: str):
        self.key_path = key_path

    def get_key(self) -> bytes:
        with open(self.key_path, 'r') as f:
            return f.read().strip().encode()

# Future: VaultKeySource, AzureKeyVaultKeySource
```

```python
# ── CredentialManager ─────────────────────────────────────────────────
# Credential lifecycle — CRUD, validation, rotation

class CredentialManager:
    """Manages credential lifecycle using SecretsProvider and EncryptionProvider."""

    def __init__(self, secrets_provider: SecretsProvider, encryption_provider: EncryptionProvider):
        self.secrets = secrets_provider
        self.encryption = encryption_provider

    async def create_credential(self, system_id: str, credential_type: str,
                                 credential_data: Dict[str, Any]) -> CredentialResult:
        """Create or update a credential for a system."""
        credential_id = str(uuid4())
        encrypted_value = self.encryption.encrypt(credential_data.get("password", ""))

        # Store via SecretsProvider
        self.secrets.set_secret(credential_id, credential_data.get("password", ""))

        # Persist metadata to database
        await self._save_metadata(credential_id, system_id, credential_type, encrypted_value)

        return CredentialResult(success=True, credential_id=credential_id)

    async def get_credential(self, system_id: str, credential_type: str) -> Optional[Dict[str, Any]]:
        """Retrieve decrypted credential for a system."""
        return self.secrets.get_credential(system_id, credential_type)

    async def rotate_credential(self, credential_id: str, new_value: str) -> bool:
        """Rotate a credential value."""
        return self.secrets.set_secret(credential_id, new_value)

    async def delete_credential(self, credential_id: str) -> bool:
        """Delete a credential."""
        return self.secrets.delete_secret(credential_id)

    async def validate_credential(self, system_id: str, credential_type: str) -> bool:
        """Validate that a credential exists and is accessible."""
        cred = self.secrets.get_credential(system_id, credential_type)
        return bool(cred and cred.get("password"))
```

### 9.3 Audit Logging

```python
class AuditLogger:
    """Logs all security-relevant operations."""

    def __init__(self, db):
        self.db = db

    def log_connection_event(self, event: ConnectionEvent):
        """Log a connection event."""
        query = """
            INSERT INTO core.system_connection_log
            (system_id, action, status, message, duration_ms, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.db.execute(query, (
            event.system_id,
            event.action,
            event.status,
            event.message,
            event.duration_ms,
            event.created_by
        ))

    def log_credential_event(self, event: CredentialEvent):
        """Log a credential event."""
        query = """
            INSERT INTO audit.audit_events
            (action, resource_type, resource_id, user_id, status, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """
        self.db.execute(query, (
            event.action,
            'credential',
            event.credential_id,
            event.user_id,
            event.status
        ))
```

---

## 10. MAP CLI Integration

### 10.1 CLI Commands

```bash
# Connection Management
map connection test --system-id <uuid>
map connection list --project-id <uuid>
map connection validate --project-id <uuid>

# Discovery
map discover --project-id <uuid>
map discover status --project-id <uuid>

# Mapping
map mapping auto --project-id <uuid>
map mapping list --project-id <uuid>
map mapping validate --mapping-id <uuid>

# Validation
map validate --project-id <uuid>
map validate connections --project-id <uuid>
map validate schema --project-id <uuid>
map validate data --project-id <uuid>

# Full Pipeline
map onboard --project-id <uuid>
map run --project-id <uuid>
map run --project-id <uuid> --resume-batch <uuid>
map run --project-id <uuid> --recovery

# Platform Diagnostics
map doctor
```

### 10.2 map doctor — Platform Diagnostics

```bash
$ map doctor

✓ Adapters
  postgres ........... registered
  sqlserver .......... registered
  mysql .............. registered
  oracle ............. registered
  snowflake .......... registered
  bigquery ........... registered
  databricks ......... registered

✓ Connection Pools
  active pools ....... 3
  total connections ... 12
  health ............. OK

✓ Metadata
  projects ........... 5
  systems ............ 12
  credentials ........ 12
  mappings ........... 8

✓ Credentials
  valid .............. 10
  expired ............ 1
  missing ............ 1

✓ Discovery
  last run ........... 2026-08-03 14:32 UTC
  snapshots .......... 23
  drift detected ..... 2

✓ Validation
  rules active ....... 45
  last run ........... 2026-08-03 14:30 UTC
  failures ........... 0

✓ Encryption
  key source ......... EnvironmentKeySource
  status ............. OK

Audit: 2026-08-03T14:35:00Z | 7 checks passed | 0 warnings | 0 errors
```

**Purpose:** Production support — one command to verify platform health.

### 10.2 CLI Integration Points

```python
# app/main.py additions

@app.command()
def connection_test(system_id: str):
    """Test connection to a system."""
    manager = ConnectionManager()
    result = manager.test_connection(system_id)
    if result.success:
        print(f"Connection successful ({result.latency_ms}ms)")
    else:
        print(f"Connection failed: {result.message}")
        sys.exit(1)

@app.command()
def discover(project_id: str):
    """Discover schema for a project."""
    service = DiscoveryService()
    result = service.discover(project_id)
    print(f"Discovered {len(result.datasets)} dataset pairs")
    for dataset in result.datasets:
        print(f"  {dataset.source_tables} → {dataset.target_tables}")

@app.command()
def onboard(project_id: str):
    """Run automated onboarding for a project."""
    service = OnboardingService()
    result = service.onboard_project(project_id)
    if result.success:
        print("Onboarding complete")
    else:
        print(f"Onboarding failed at {result.step}: {result.message}")
        sys.exit(1)
```

---

## 14. Technology Decisions (Awaiting Final Approval)

### 14.1 Key Management

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Environment Variables** | FERNET_KEY in env vars | Simple, no dependencies | Key in process memory |
| **B: File-Based** | Key stored in secure file | File permissions control access | File management overhead |
| **C: Azure Key Vault** | Azure-native key management | Enterprise-grade, audited | Azure dependency |
| **D: HashiCorp Vault** | HashiCorp Vault | Multi-cloud, enterprise | Additional infrastructure |

**Recommended:** Option A (Development) → Option D or C (Production, depending on customer environment).

The `KeySource` abstraction means either can be plugged in later with zero code changes.

### 14.2 Connection Pooling Library

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: psycopg2.pool** | Built-in pooling for Postgres | Already in use, simple | Postgres only |
| **B: SQLAlchemy pool** | Database-agnostic pooling | Multi-DB, mature | Heavier dependency |
| **C: Custom pool** | Custom implementation | Full control | Maintenance burden |

**Recommended:** **Option B — SQLAlchemy Pool.**

Reason: Multi-database platform. psycopg2.pool ties you to PostgreSQL. Connection pooling should be infrastructure outside the adapters, using adapter-specific configuration classes for per-database tuning.

### 14.3 SSL/TLS Certificate Storage

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Filesystem** | Certs stored on disk | Simple | File management |
| **B: Database** | Certs stored in PostgreSQL | Centralized | Larger DB storage |
| **C: Environment** | Certs in env vars | No file management | Size limits |
| **D: Secrets Provider** | Retrieved via SecretsProvider | Unified, Vault-ready | Depends on provider |

**Recommended:** Option A (Development) → Option D (Production).

Avoid storing certificates in PostgreSQL unless there's a strong operational reason.

---

## 13. Frontend Components

### 13.1 Reusable ConnectionTestPanel

A single reusable component embedded in Create System, Edit System, Credential Modal, and Onboarding Wizard — eliminates duplicated connection testing UI.

```tsx
// ConnectionTestPanel.tsx
interface ConnectionTestPanelProps {
  systemId?: string;
  connectionConfig: Record<string, any>;
  dbType: string;
  onTestComplete?: (result: ConnectionTestResult) => void;
  showHistory?: boolean;
}

export function ConnectionTestPanel({
  systemId,
  connectionConfig,
  dbType,
  onTestComplete,
  showHistory = false
}: ConnectionTestPanelProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [history, setHistory] = useState<ConnectionEvent[]>([]);

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await apiPost('/api/v1/systems/test-connection', {
        system_id: systemId,
        db_type: dbType,
        config: connectionConfig,
      });
      setResult(res);
      onTestComplete?.(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Connection Test</h4>
        <Button onClick={handleTest} disabled={testing}>
          {testing ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>

      {result && (
        <div className={result.success ? 'bg-green-50' : 'bg-red-50'}>
          <p>{result.message}</p>
          <p className="text-sm text-gray-500">Latency: {result.latency_ms}ms</p>
          {result.server_version && <p>Version: {result.server_version}</p>}
        </div>
      )}

      {showHistory && history.length > 0 && (
        <ConnectionEventLog events={history} />
      )}
    </div>
  );
}
```

**Embedding locations:**
- `CreateSystemPage` — test before save
- `EditSystemPage` — re-test after config change
- `CredentialModal` — test with new credentials
- `OnboardingWizard` — validate all connections in sequence

---

## 15. Implementation Phases

### Phase 1: Foundation (Week 1)
- Adapter contract (`ConnectionAdapter` interface)
- Adapter-specific config classes (PostgresConfig, MySQLConfig, etc.)
- `AdapterRegistry` with dynamic registration
- `ConnectionPoolManager` (infrastructure layer)
- `SecretsProvider` / `EncryptionProvider` / `CredentialManager` consolidation
- Fix critical bugs (adapter_factory import, Databricks filename, BigQuery psycopg2)

### Phase 2: Adapters (Week 2)
- Upgrade all adapters to production quality
- Add SSL/TLS support to all adapters
- Add `list_columns()` to all adapters
- Add connection timeout configuration
- Implement structured capability profiles

### Phase 3: Discovery Engine (Week 2-3)
- Discovery service implementation
- Schema introspection via adapters
- Table matching (exact + fuzzy)
- `core.discovery_snapshots` for historical tracking
- Drift detection

### Phase 4: Mapping Engine (Week 3-4)
- Auto-mapping service (depends on Discovery)
- Column-level mapping
- Transformation rule suggestions
- Mapping validation

### Phase 5: CRUD / API / UI (Week 4-5)
- System CRUD endpoints (add PUT/DELETE)
- Credential CRUD endpoints
- Tenant isolation on all queries
- Audit logging (connection + credential events)
- Create/Edit system forms
- Credential modals
- `ConnectionTestPanel` (reusable)
- Onboarding wizard UI

### Phase 6: CLI & Testing (Week 5-6)
- CLI commands for connection management
- CLI commands for discovery/mapping
- `map doctor` platform diagnostics
- Backend unit tests
- Integration tests
- E2E tests

### Phase 7: Documentation (Week 6-7)
- Architecture documentation
- API reference
- Adapter development guide (how to write new adapters)
- Operational runbook
- Deployment guide

---

**Architecture Baseline v1.0 — Pending Final Approval before implementation.**
