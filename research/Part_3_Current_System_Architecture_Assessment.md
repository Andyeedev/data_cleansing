# Current System Architecture Assessment

**Project:** fs-migration-validation-engine  
**Version:** 1.9 (current)  
**Assessment Type:** Read-only architectural investigation  
**Date:** 2025-06-19

---

## Section 1 — Current Architecture

### 1.1 High-Level Architecture Overview

The current system is a **Python-based migration validation engine** with a layered architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                        FastAPI REST API                          │
│  (app/api/main.py) — JWT auth, background task execution       │
├─────────────────────────────────────────────────────────────────┤
│                    Execution Orchestration                       │
│  ExecutionEngine → DAG Scheduler → Control Executor → Retry    │
├─────────────────────────────────────────────────────────────────┤
│                        Services Layer                            │
│  ExecutionService | MappingResolver | AutoRuleDiscovery        │
│  MetadataIntelligenceService | SystemService                   │
├─────────────────────────────────────────────────────────────────┤
│                     Database Abstraction                         │
│  ConnectionFactory → BaseAdapter (7 vendors) → ConnectionPool  │
├─────────────────────────────────────────────────────────────────┤
│                     Persistence Layer                            │
│  SystemRepository | CredentialRepository | Engine DB (Postgres)│
├─────────────────────────────────────────────────────────────────┤
│                     Domain / Rules Layer                         │
│  C01–C010 Controls | RuleFactory | RuleExecutor | ScoringEngine│
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Backend Structure

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **API** | `app/api/` | FastAPI REST endpoints, JWT auth, OpenAPI docs |
| **Execution** | `app/execution_engine.py` | Main orchestrator — DAG-based parallel control execution |
| **Services** | `app/services/` | Business logic: execution, mapping, discovery, metadata |
| **Rules** | `app/rules/` | Validation control implementations (C01–C010) |
| **DB Adapters** | `app/db/adapters/` | Vendor-specific database connectivity |
| **Repositories** | `app/db/repositories/` | Data access for engine metadata |
| **Orchestration** | `app/orchestration/` | DAG validation, retry policies, observability |
| **Governance** | `app/governance/` | Risk scoring, release gate decisions |
| **Security** | `app/security/` | Encryption utilities |
| **Utils** | `app/utils/` | Logging, sanitization |

### 1.3 Services

| Service | File | Purpose |
|---------|------|---------|
| `ExecutionService` | `app/services/execution_service.py` | Wraps `ExecutionEngine` for API-triggered runs |
| `MappingResolver` | `app/services/mapping_resolver.py` | Resolves active source→target mapping pairs from DB |
| `AutoRuleDiscovery` | `app/discovery/auto_rule_discovery.py` | Infers which controls to run based on column metadata |
| `MetadataIntelligenceService` | `app/services/metadata_intelligence_service.py` | Basic column role inference (PK, numeric, date) |
| `SystemService` | `app/services/system_service.py` | CRUD for system registry |
| `CredentialService` | `app/services/credential_service.py` | Credential management with encryption |
| `AuditPackService` | `app/services/audit_pack_service.py` | Export packaging |

### 1.4 Repositories

| Repository | File | Tables Accessed |
|-------------|------|-----------------|
| `SystemRepository` | `app/db/repositories/system_repository.py` | `core.system_registry` |
| `CredentialRepository` | `app/db/repositories/credential_repository.py` | `core.system_credentials` |

> **Note:** The current system does **not** use a dedicated DiscoveryRepository. Discovery logic is embedded in `DatasetDiscoveryService` and `AutoRuleDiscovery` with inline SQL.

### 1.5 Database Access Layer

The database layer uses the **Adapter Pattern** with connection pooling:

- **`BaseAdapter`** (`app/db/adapters/base_adapter.py`): Abstract base defining `connect()`, `execute()`, `close()`, `list_tables()`
- **`connection_factory()`** (`app/db/connection_factory.py`): Factory function instantiating the correct adapter by `type`
- **`ConnectionResolver`** (`app/db/connection_resolver.py`): Loads systems from `engine.system_registry`, resolves credentials, builds adapters
- **`DBConnector`** (`app/db_connector.py`): Legacy wrapper (still used by some services)

**Supported Database Types (7):**

| Adapter | Driver | File |
|---------|--------|------|
| PostgreSQL | `psycopg2` + `psycopg2.pool` | `postgres_adapter.py` |
| SQL Server | `pyodbc` | `sqlserver_adapter.py` |
| MySQL | (adapter present) | `mysql_adapter.py` |
| Snowflake | (adapter present) | `snowflake_adapter.py` |
| BigQuery | (adapter present) | `bigquery_adapter.py` |
| Oracle | (adapter present) | `oracle_adapter.py` |
| Databricks | (adapter present) | `odatabricks_adapter.py` |

### 1.6 APIs

The system exposes a **FastAPI** REST API (`app/api/main.py`):

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/*` | Various | JWT authentication |
| `/credentials/*` | Various | Credential CRUD |
| `/systems/` | GET | List systems |
| `/systems/` | POST | Create system |
| `/systems/{id}` | GET | Get system |
| `/systems/{id}/test` | GET | Test connection |
| `/execution/run` | POST | Trigger migration validation (background) |
| `/execution/status/{batch_id}` | GET | Get execution status |
| `/health` | GET | Health check |

**Authentication:** JWT Bearer tokens via `get_current_user` dependency.  
**Background Execution:** Uses FastAPI `BackgroundTasks` for async execution.

### 1.7 Frontend

A single-page dashboard exists at `dashboard/migration_dashboard.html`. It is a **static HTML/JS dashboard** (not a modern SPA framework). It queries the engine database directly for reporting.

### 1.8 Shared Libraries

| Component | Location | Purpose |
|-----------|----------|---------|
| `app.utils.logger` | `app/utils/logger.py` | Structured logging with audit logger, indentation context |
| `app.utils.encryption_utils` | `app/utils/encryption_utils.py` | Fernet-based encryption for credentials |
| `app.utils.sanitizer` | `app/utils/sanitizer.py` | SQL sanitization |
| `app.security.crypto` | `app/security/crypto.py` | Cryptographic utilities |
| `app.parameter_injector` | `app/parameter_injector.py` | SQL template parameter injection |
| `app.rule_factory` | `app/rule_factory.py` | Factory for creating rule executors |

### 1.9 Domain Models

The system does **not** use Pydantic models for core domain entities. Data flows as:
- **Tuples/lists** from database queries (e.g., `(mapping_id, source_schema, source_table, ...)`)
- **Dictionaries** for configuration and mapping contracts
- **Pydantic models** only for API request/response (`app/api/models/`)

Key domain concepts:
- **System**: A registered database (source or target) with connection config and credentials
- **Project**: A migration project containing systems and mappings
- **Dataset Mapping**: A source→target table pair
- **Column Mapping**: Source→target column pairs within a dataset mapping
- **Control**: A validation rule (C01–C010)
- **Batch**: An execution run of controls
- **Rule Dataset Mapping**: Binding of controls to dataset mappings

### 1.10 Dependency Injection

The system uses **manual dependency injection** (no DI framework):

- `ExecutionEngine` receives `config` dict and instantiates its own dependencies
- `ConnectionResolver` receives `engine_db` and resolves adapters at runtime
- `RuleExecutor` receives all dependencies via constructor
- Services are instantiated directly in route handlers and engine methods

### 1.11 Configuration

Configuration is managed via:

1. **`config.yaml`**: Primary configuration file with environment variable substitution (`${VAR:-default}`)
2. **`.env`**: Sensitive credentials (referenced via `python-dotenv`)
3. **Database-stored config**: `engine.system_registry` stores connection configs and `engine.rule_registry` stores control definitions

Key config sections:
- `project_id`: UUID linking all records
- `database` / `engine_db` / `source_db` / `target_db`: Connection strings
- `execution`: Environment, client name, control filter
- `release_gate`: Blocking thresholds and minimum scores
- `rules`: Enable/disable flags for C01–C010
- `control_dependencies`: DAG edges (e.g., C02 depends on C01)
- `encryption_keys`: Fernet keys for credential encryption

### 1.12 Background Services / Jobs

- **FastAPI BackgroundTasks**: Used in `/execution/run` to trigger `ExecutionService().run()` asynchronously
- **ThreadPoolExecutor**: `ExecutionEngine.run()` uses `ThreadPoolExecutor(max_workers=4)` for parallel control execution
- **No message queue**: No Celery, Prefect, or similar task queue — execution is in-process
- **Checkpointing**: `ExecutionEngine` persists checkpoints to `engine.migration_control_execution` for resume capability

---

## Section 2 — Legacy v2.1 Comparison

| v2.1 Component | Current Equivalent | Status | Notes |
|----------------|-------------------|--------|-------|
| **Discovery Service** | `DatasetDiscoveryService` (`app/services/dataset_discovery_service.py`) | ⚠️ Partial | Exists but simplified — uses suffix-based matching (`_source` → `_target`) instead of fuzzy/heuristic matching. No `ConstraintLoader` equivalent. |
| **Mapping Engine** | `MappingResolver` (`app/services/mapping_resolver.py`) | ⚠️ Partial | Exists but only resolves **manual** mappings from DB. No automated table/column matching. The `app/mapping_engine/` directory is **empty**. |
| **Schema Reader** | Embedded in adapters (`list_tables()`, `execute()`) | ✅ Exists | Each adapter implements `list_tables()` using `information_schema` or vendor equivalents. No unified `SchemaReader` class. |
| **Validation** | `ExecutionEngine` + `RuleExecutor` + `rules/C01–C010` | ✅ Exists | Fully implemented with DAG execution, retry, checkpointing, and governance scoring. |
| **Metadata Discovery** | `AutoRuleDiscovery` + `MetadataIntelligenceService` | ⚠️ Partial | `AutoRuleDiscovery` discovers rules from existing column metadata. `MetadataIntelligenceService` does basic role inference. No comprehensive schema/constraint discovery pipeline. |
| **Relationship Discovery** | `AutoRuleDiscovery._detect_foreign_keys()` | ⚠️ Partial | FK detection exists only for FK→C03/C09 rule binding. No relationship graph or full FK catalog. |
| **Database Models** | Inline SQL + tuples | ⚠️ Partial | No ORM or Pydantic domain models. Data flows as raw tuples from queries. |
| **Migration Engine** | `ExecutionEngine` | ✅ Exists | Renamed and significantly evolved. Now DAG-based with parallel execution, governance, and observability. |

### Key Architectural Differences

1. **Adapter Pattern Maturity**: The current system has a more mature adapter pattern with 7 supported vendors, connection pooling (Postgres, SQL Server), and a factory function. The legacy system had adapters but with more duplication.

2. **Execution Model**: The legacy system had a simpler sequential execution model. The current system uses a **DAG-based parallel executor** with dependency resolution, checkpointing, retry policies, and deadlock detection.

3. **Mapping Approach**: The legacy system had a sophisticated `MappingEngine` with fuzzy matching (`difflib.SequenceMatcher`), Jaccard similarity, and weighted scoring. The current system has **no automated mapping** — mappings are created manually or via the simplified `DatasetDiscoveryService` suffix matching.

4. **Metadata Intelligence**: The legacy system had `ConstraintLoader` for PK/FK discovery and `ScoringEngine` for mapping confidence. The current system has `MetadataIntelligenceService` (basic role inference) and `ScoringEngine` (risk-weighted batch scoring), but no constraint loader.

5. **API Layer**: The current system has a full FastAPI REST API with JWT auth. The legacy system was CLI-only (`app/main.py`).

6. **Credential Security**: The current system encrypts credentials at rest using Fernet encryption. The legacy system stored plaintext passwords in `connection_config`.

7. **Observability**: The current system has structured logging, audit logging, execution tracing, and slow query detection. The legacy system had basic logging.

---

## Section 3 — Database Comparison

### 3.1 Engine Database Schema (Current)

The engine database uses a **multi-schema design**:

| Schema | Purpose |
|--------|---------|
| `core` | Projects, systems, datasets, mappings, columns, credentials |
| `engine` | Control registry, rule registry, batches, execution logs, governance |

### 3.2 Key Tables

| Table | Schema | Purpose |
|-------|--------|---------|
| `core.system_registry` | core | Registered source/target databases |
| `core.system_credentials` | core | Encrypted credentials |
| `core.dataset_mappings` | core | Source→target table mappings |
| `core.dataset_columns` | core | Column metadata with inferred roles |
| `core.rule_dataset_mapping` | core | Control-to-mapping bindings |
| `engine.rule_registry` | engine | Control definitions (C01–C010) |
| `engine.migration_validation_batch` | engine | Execution batch records |
| `engine.migration_control_execution` | engine | Per-control execution results |
| `engine.governance_decision` | engine | Release gate decisions |

### 3.3 Legacy vs. Current Database Changes

| Aspect | Legacy v2.1 | Current v1.9 | Change |
|--------|-------------|--------------|--------|
| **Schema structure** | `core`, `engine`, `public` | `core`, `engine` | `public` removed or unused |
| **system_registry** | `system_id, system_name, system_role, database_type, connection_config` | `system_id, project_id, system_name, system_role, database_type, connection_config, credential_id, is_active, schema_name` | Added `project_id`, `credential_id`, `is_active`, `schema_name` |
| **Credentials** | Plaintext in `connection_config` | Separate `system_credentials` table with encrypted passwords | **Security improvement** |
| **dataset_mappings** | `mapping_id, project_id, source_system_id, target_system_id, source_schema, source_table, source_columns, target_schema, target_table, target_columns` | Same + `is_active` flag | Added `is_active` for soft delete |
| **dataset_columns** | `column_id, mapping_id, column_name, data_type, is_nullable, is_primary_key, is_foreign_key, references` | `column_id, mapping_id, column_side, column_name, data_type, inferred_role` | Restructured — `column_side` (SOURCE/TARGET), `inferred_role` replaces boolean flags |
| **rule_dataset_mapping** | `rule_id, mapping_id` | `rule_id, mapping_id, is_active` | Added `is_active` |
| **New tables** | — | `engine.migration_validation_batch`, `engine.migration_control_execution`, `engine.governance_decision` | Execution tracking and governance |
| **Removed tables** | — | None identified | — |

### 3.4 Database Provider Assumptions

- **Engine DB is PostgreSQL**: All engine metadata queries use `%s` parameter style (Postgres). The `system_registry` table is queried with f-string schema references (`{self.schema}.system_registry`).
- **Source/Target DBs are provider-agnostic**: Via adapters, but discovery queries in `DatasetDiscoveryService` use `information_schema` with `%s` placeholders, which works for Postgres/MySQL but not SQL Server (uses `?`).
- **SQL Server query transformation**: `SQLServerAdapter._transform_query()` replaces `%s` with `?` and `public.` with the configured schema, but this is adapter-level only — services that bypass adapters (like `DatasetDiscoveryService`) will break on SQL Server.

---

## Section 4 — Data Discovery Assessment

| Capability | Status | Implementation |
|------------|--------|----------------|
| **Schema discovery** | ⚠️ Partial | `PostgresAdapter.list_tables()` queries `information_schema.tables`. SQL Server uses `INFORMATION_SCHEMA.TABLES`. Other adapters have `list_tables()` stubs. No unified schema discovery service. |
| **Table discovery** | ⚠️ Partial | `DatasetDiscoveryService._fetch_tables()` queries `information_schema.tables` directly (bypasses adapters). Only excludes `pg_catalog` and `information_schema`. |
| **Column discovery** | ⚠️ Partial | `DatasetDiscoveryService._fetch_columns()` queries `information_schema.columns`. Returns only column names (no types, nullability, defaults). |
| **Primary key discovery** | ❌ Missing | No PK discovery in current discovery pipeline. `MetadataIntelligenceService` infers PK by column name heuristics (`id`, `account_id`, `customer_id`). |
| **Foreign key discovery** | ⚠️ Partial | `AutoRuleDiscovery._detect_foreign_keys()` queries `information_schema` for FK columns, but only for rule inference (C03, C09). Not persisted to `dataset_columns`. |
| **Relationship discovery** | ❌ Missing | No relationship graph or full FK catalog. FK detection is limited to column-level inference. |
| **Constraint discovery** | ❌ Missing | No constraint discovery beyond FK detection in `AutoRuleDiscovery`. No unique constraints, check constraints, or indexes. |
| **Index discovery** | ❌ Missing | Not implemented. |
| **Data type discovery** | ⚠️ Partial | Column data types are fetched in `_fetch_columns()` but not fully utilized. `MetadataIntelligenceService` checks for `numeric`, `decimal`, `double precision`. |

### Reusable Components for Discovery

| Component | Reusability | Notes |
|-----------|-------------|-------|
| `BaseAdapter.list_tables()` | Medium | Exists for Postgres and SQL Server; stubs for others |
| `AutoRuleDiscovery._detect_foreign_keys()` | Medium | Works for Postgres and SQL Server; needs extension for other vendors |
| `MetadataIntelligenceService.infer_column_roles()` | Low | Very basic name-based heuristics; needs significant enhancement |
| `DatasetDiscoveryService._fetch_tables/columns()` | Low | Hardcoded `information_schema` queries; bypasses adapters; Postgres-centric |

---

## Section 5 — Database Provider Independence

### 5.1 Current Support Assessment

| Database | Adapter | Connection Pooling | Discovery Queries | Status |
|----------|---------|-------------------|-------------------|--------|
| PostgreSQL | ✅ Full | ✅ `psycopg2.pool` | ✅ `information_schema` | Production-ready |
| SQL Server | ✅ Full | ✅ Custom list pool | ✅ `INFORMATION_SCHEMA` + `sys.*` (partial) | Production-ready |
| MySQL | ⚠️ Present | ❌ Unknown | ⚠️ Stub only | Needs verification |
| Snowflake | ⚠️ Present | ❌ Unknown | ⚠️ Stub only | Needs verification |
| BigQuery | ⚠️ Present | ❌ Unknown | ⚠️ Stub only | Needs verification |
| Oracle | ⚠️ Present | ❌ Unknown | ⚠️ Stub only | Needs verification |
| Databricks | ⚠️ Present | ❌ Unknown | ⚠️ Stub only | Needs verification |

### 5.2 SQL Server-Specific Dependencies

| Dependency | Location | Impact |
|------------|----------|--------|
| **Query parameter style** | `SQLServerAdapter._transform_query()` | Replaces `%s` with `?`. Services bypassing adapters (e.g., `DatasetDiscoveryService`) will fail. |
| **Schema replacement** | `SQLServerAdapter._transform_query()` | Replaces `public.` with configured schema (default `dbo`). |
| **FK detection query** | `AutoRuleDiscovery._detect_foreign_keys()` | Has SQL Server-specific branch using `INFORMATION_SCHEMA` with `?` placeholders. |
| **Connection string format** | `SQLServerAdapter._create_connection()` | ODBC connection string with `TrustServerCertificate=yes`. |
| **Pool implementation** | `SQLServerAdapter._init_pool()` | Custom list-based pool (not `psycopg2.pool`). |

### 5.3 INFORMATION_SCHEMA Assumptions

The following `information_schema` queries are used **directly in services** (bypassing adapters):

```python
# DatasetDiscoveryService._fetch_tables()
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog','information_schema')

# DatasetDiscoveryService._fetch_columns()
SELECT column_name
FROM information_schema.columns
WHERE table_schema = %s AND table_name = %s

# AutoRuleDiscovery._detect_foreign_keys()
SELECT kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = %s AND tc.table_name = %s
```

These queries work for PostgreSQL, MySQL, and SQL Server (with `?` params), but **not** for Oracle (`user_tables`, `user_tab_columns`), Snowflake (`SHOW TABLES`), BigQuery (`INFORMATION_SCHEMA` with different column names), or Databricks (`SHOW TABLES`, `DESCRIBE`).

### 5.4 sys.* Catalog Usage

- **SQL Server**: `SQLServerAdapter.list_tables()` uses `INFORMATION_SCHEMA.TABLES` only. The legacy documentation mentions `sys.foreign_key_columns` but this is **not implemented** in the current codebase.

### 5.5 Provider-Specific Repository Logic

- `SystemRepository` and `CredentialRepository` use `%s` parameter style (Postgres-only).
- All engine DB queries use `%s` — the engine database is **hardcoded as PostgreSQL**.

### 5.6 Hardcoded Connection Handling

| Issue | Location | Effort to Fix |
|-------|----------|---------------|
| Engine DB always Postgres | `config.yaml`, `ExecutionEngine.__init__()` | Low — already supports `type` field |
| `DatasetDiscoveryService` uses `information_schema` directly | `app/services/dataset_discovery_service.py` | Medium — needs adapter delegation |
| `AutoRuleDiscovery._detect_foreign_keys()` has inline SQL | `app/discovery/auto_rule_discovery.py` | Medium — needs adapter method |
| `SystemRepository` uses `%s` | `app/db/repositories/system_repository.py` | Low — engine DB is Postgres by design |

### 5.7 Estimated Effort for Provider Independence

| Dependency | Estimated Effort | Priority |
|------------|-----------------|----------|
| Move discovery queries into adapters | 2–3 days | High |
| Standardize parameter style in repositories | 1 day | Medium |
| Add `schema_name` support to all adapters | 1 day | Medium |
| Implement missing adapter discovery methods | 3–5 days | High |
| Abstract engine DB to support non-Postgres | 5–7 days | Low (engine DB is internal) |

---

## Section 6 — Automated Mapping Readiness

### 6.1 Current State Assessment

| Capability | Status | Implementation |
|------------|--------|----------------|
| **Automated schema discovery** | ⚠️ Partial | Adapters have `list_tables()`. No unified schema scanner. |
| **Automated relationship discovery** | ❌ Missing | No FK catalog, no relationship graph. |
| **Metadata extraction** | ⚠️ Partial | Basic column names and types. No constraints, indexes, or extended properties. |
| **Rule generation** | ⚠️ Partial | `AutoRuleDiscovery` infers rules from column roles (name-based heuristics). |
| **Mapping generation** | ❌ Missing | No automated table/column matching. `app/mapping_engine/` is empty. |
| **Validation** | ✅ Exists | Full control-based validation (C01–C010). |
| **AI-assisted mapping** | ❌ Missing | No AI/ML components. No LLM integration. |

### 6.2 Existing Implementation Details

**What exists:**
- `DatasetDiscoveryService`: Simple suffix-based table matching (`_source` → `_target`)
- `AutoRuleDiscovery`: Rule inference from column metadata (PK → C01, C03, C07; numeric → C02, C08; FK → C09; date → C05)
- `MetadataIntelligenceService`: Column role inference by xname (`id` → PK, `numeric` → NUMERIC_METRIC, `date` in name → AUDIT_COLUMN)
- `MappingResolver`: Resolves manual mappings from DB with contract standardization

**What is reusable:**
- Adapter pattern for cross-DB metadata extraction
- `AutoRuleDiscovery._infer_rules()` logic (can be extended)
- `MetadataIntelligenceService` pattern (needs enhancement)
- `MappingResolver._build_mapping_contract()` for structured mapping contracts

### 6.3 Gaps

| Gap | Description | Impact |
|-----|-------------|--------|
| **No fuzzy matching** | Legacy `matching_strategies.py` (`table_score`, `column_score` using `difflib.SequenceMatcher`) is **not present** in current codebase. | Cannot suggest mappings for tables with different names. |
| **No scoring engine for mappings** | Legacy `ScoringEngine` for mapping confidence is gone. Current `ScoringEngine` is for batch risk scoring only. | Cannot rank or filter mapping suggestions. |
| **No column matching** | No automated column-to-column mapping. | Manual column mapping required. |
| **No metadata caching** | No Redis or document store for discovered schemas. | Re-discovery required for each run. |
| **No inference engine** | Legacy had inference for DBs without FK metadata (e.g., BigQuery). Not present. | Cannot discover relationships in schema-less warehouses. |
| **No standardized metadata models** | No Pydantic models for `TableMetadata`, `ColumnMetadata`. | Type safety gaps across discovery → mapping → validation pipeline. |

### 6.4 Technical Debt

| Debt | Location | Description |
|------|----------|-------------|
| **Legacy method proliferation** | `execution_engine.py`, `connection_resolver.py`, `dataset_discovery_service.py` | Multiple `_legacy`, `_legacy_2`, `_legacy_20260501` etc. methods clutter the codebase. |
| **Empty directories** | `app/mapping_engine/`, `app/mapping/`, `app/intelligence/matching/` | Placeholder directories with no implementation. |
| **Inline SQL in services** | `dataset_discovery_service.py`, `auto_rule_discovery.py` | Discovery SQL hardcoded in services instead of adapters. |
| **Hardcoded schema names** | `postgres_adapter.py` (`'public'`), `sqlserver_adapter.py` (`'dbo'`) | Schema should be configurable per system. |
| **No type safety** | Throughout | Domain data flows as tuples/dicts; no Pydantic models. |
| **pipelines_TO_BE_DELETED** | `app/pipelines_TO_BE_DELETED/` | Obsolete directory still present. |

---

## Section 7 — Recommended Future Architecture

### 7.1 Target Architecture: Cloud-Ready, Database-Agnostic Migration Platform

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway / SaaS Layer                     │
│              FastAPI + JWT + Multi-tenant Project Isolation          │
├─────────────────────────────────────────────────────────────────────┤
│                      Intelligence Layer (NEW)                        │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────────┐  │
│  │ Schema Discovery│  │ Relationship  │  │ AI Mapping Engine       │  │
│  │ Engine          │  │ Discovery     │  │ (LLM + Heuristic)       │  │
│  └───────────────┘  └───────────────┘  └─────────────────────────┘  │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────────┐  │
│  │ Metadata       │  │ Inference     │  │ Mapping Validation      │  │
│  │ Extractor      │  │ Engine        │  │ & Scoring               │  │
│  └───────────────┘  └───────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                      Execution Layer (EVOLVED)                       │
│  DAG Orchestrator → Control Executor → Rule Engine → Scoring       │
│  + Async Workers + Event-Driven + Distributed Tracing               │
├─────────────────────────────────────────────────────────────────────┤
│                      Adapter Layer (EVOLVED)                         │
│  BaseAdapter + 7 Vendors + Unified Discovery Interface              │
│  + Schema-Aware Queries + Connection Pooling (all vendors)         │
├─────────────────────────────────────────────────────────────────────┤
│                      Persistence Layer (EVOLVED)                     │
│  PostgreSQL (Engine) + Redis (Cache) + S3 (Exports)                │
│  + Metadata Versioning + Audit Logs                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 How Existing Components Evolve

| Current Component | Evolution Path |
|-------------------|----------------|
| **Adapter Pattern** | Expand `BaseAdapter` with unified discovery interface: `discover_schema()`, `discover_columns()`, `discover_constraints()`, `discover_indexes()`. Add connection pooling to all adapters. |
| **ConnectionResolver** | Evolve to `ConnectionOrchestrator` — handles multi-tenant credential resolution, schema-aware adapter configuration, and connection lifecycle. |
| **ExecutionEngine** | Refactor to use async execution (asyncio + asyncpg/aioodbc). Replace `ThreadPoolExecutor` with distributed task queue (Celery/Prefect). Add event-driven hooks. |
| **AutoRuleDiscovery** | Evolve to `RuleInferenceEngine` — combine column metadata, FK detection, and data profiling to suggest controls. Integrate with AI mapping for semantic rule suggestions. |
| **MetadataIntelligenceService** | Replace with `MetadataProfiler` — comprehensive data profiling (null rates, distinct counts, min/max, patterns). Use profiling to inform AI mapping. |
| **MappingResolver** | Evolve to `MappingOrchestrator` — combines manual mappings, AI-suggested mappings, and heuristic mappings into a unified mapping contract with confidence scores. |
| **ScoringEngine** | Extend to support mapping confidence scoring, data quality scoring, and migration risk scoring in a unified framework. |
| **DatasetDiscoveryService** | Replace with `SchemaDiscoveryService` — vendor-agnostic schema scanning using adapter discovery methods, with metadata caching and versioning. |

### 7.3 New Components Required

| Component | Purpose |
|-----------|---------|
| **SchemaDiscoveryService** | Unified schema/table/column/constraint/index discovery across all vendors |
| **RelationshipDiscoveryEngine** | FK graph construction, relationship inference for schema-less warehouses |
| **MappingEngine** (new) | Automated table and column matching using fuzzy logic + AI |
| **AIMappingService** | LLM-based semantic mapping suggestions with human-in-the-loop review |
| **MetadataCache** | Redis-based cache for discovered metadata with TTL and invalidation |
| **MetadataVersioning** | Snapshot-based schema change tracking |
| **StandardizedMetadataModels** | Pydantic models: `TableMetadata`, `ColumnMetadata`, `ConstraintMetadata`, `MappingSuggestion` |
| **InferenceEngine** | Statistical inference for missing metadata (e.g., inferring FKs from data patterns) |
| **ExportService** | S3-based export with Parquet/CSV formats |
| **NotificationService** | Webhook/email notifications for batch completion |

---

## Section 8 — Phased Implementation Roadmap

### Phase 1: Database Provider Abstraction

**Objective:** Make all discovery and metadata operations vendor-agnostic by moving SQL from services into adapters.

**Reusable Components:**
- `BaseAdapter` interface (extend with discovery methods)
- `PostgresAdapter` and `SQLServerAdapter` (reference implementations)
- `connection_factory()` pattern

**Files Likely Affected:**
- `app/db/adapters/base_adapter.py` — Add `discover_tables()`, `discover_columns()`, `discover_foreign_keys()`, `discover_indexes()`
- `app/db/adapters/postgres_adapter.py` — Implement new discovery methods
- `app/db/adapters/sqlserver_adapter.py` — Implement new discovery methods
- `app/db/adapters/mysql_adapter.py` — Implement new discovery methods
- `app/db/adapters/snowflake_adapter.py` — Implement new discovery methods
- `app/db/adapters/bigquery_adapter.py` — Implement new discovery methods
- `app/db/adapters/oracle_adapter.py` — Implement new discovery methods
- `app/db/adapters/odatabricks_adapter.py` — Implement new discovery methods
- `app/services/dataset_discovery_service.py` — Refactor to use adapter methods
- `app/discovery/auto_rule_discovery.py` — Refactor to use adapter methods

**Dependencies:**
- None (foundation phase)

**Risks:**
- Breaking changes to existing discovery flow
- SQL Server `?` parameter style requires careful handling in new adapter methods
- BigQuery and Databricks have non-SQL discovery commands (`SHOW TABLES`, `DESCRIBE`)

**Estimated Effort:** 5–7 days  
**Recommended Order:** 1 (must be done before all other phases)

---

### Phase 2: Schema Discovery

**Objective:** Build a comprehensive, cached schema discovery pipeline that works across all supported databases.

**Reusable Components:**
- Adapter discovery methods (from Phase 1)
- `ConnectionResolver` for multi-system resolution
- `SystemRepository` for system registry access

**New Components:**
- `SchemaDiscoveryService`: Orchestrates discovery across source/target systems
- `SchemaCache` (Redis): Caches discovered metadata with TTL
- `MetadataModels` (Pydantic): `TableMetadata`, `ColumnMetadata`, `SchemaSnapshot`

**Files Likely Affected:**
- `app/services/` — New `schema_discovery_service.py`
- `app/discovery/` — Refactor `auto_rule_discovery.py` to use new service
- `app/services/metadata_intelligence_service.py` — Integrate with new discovery
- `app/db/repositories/` — New `discovery_repository.py` for persisting metadata

**Dependencies:**
- Phase 1 (Database Provider Abstraction)

**Risks:**
- Large schemas (1000+ tables) may cause timeouts — need async/pagination
- Metadata versioning adds complexity to existing tables
- Cache invalidation strategy needed

**Estimated Effort:** 7–10 days  
**Recommended Order:** 2

---

### Phase 3: Relationship Discovery

**Objective:** Discover and model foreign key relationships, including inference for databases without native FK support.

**Reusable Components:**
- Adapter `discover_foreign_keys()` methods
- `AutoRuleDiscovery._detect_foreign_keys()` logic (extend)
- `app/intelligence/` directory structure

**New Components:**
- `RelationshipDiscoveryEngine`: FK graph construction
- `RelationshipInferenceEngine`: Statistical FK inference (value overlap, naming patterns)
- `RelationshipGraph`: NetworkX-based graph for relationship traversal

**Files Likely Affected:**
- `app/intelligence/constraints/` — Implement constraint discovery
- `app/intelligence/graph/` — Implement relationship graph
- `app/intelligence/inference/` — Implement inference engine
- `app/services/` — Integrate relationship discovery into discovery pipeline

**Dependencies:**
- Phase 2 (Schema Discovery)

**Risks:**
- Inference may produce false positives — needs confidence scoring
- Circular FK relationships need careful graph handling
- Performance on wide tables (500+ columns)

**Estimated Effort:** 10–14 days  
**Recommended Order:** 3

---

### Phase 4: Metadata Extraction

**Objective:** Comprehensive metadata extraction including indexes, constraints, data profiling, and extended properties.

**Reusable Components:**
- Adapter discovery methods
- `MetadataIntelligenceService` pattern (enhance)
- `ScoringEngine` pattern

**New Components:**
- `DataProfiler`: Null rates, distinct counts, min/max, sample values
- `IndexDiscovery`: Index and statistics extraction
- `ConstraintDiscovery`: Unique constraints, check constraints, defaults
- `MetadataEnrichmentService`: Combines all metadata sources

**Files Likely Affected:**
- `app/db/adapters/` — Add `discover_indexes()`, `discover_constraints()`, `profile_data()`
- `app/intelligence/profiling/` — Implement data profiling
- `app/services/` — New `metadata_enrichment_service.py`

**Dependencies:**
- Phase 2 (Schema Discovery)
- Phase 3 (Relationship Discovery)

**Risks:**
- Data profiling on large tables is expensive — needs sampling
- Some vendors (BigQuery) charge per query — need cost controls
- Extended properties vary significantly by vendor

**Estimated Effort:** 10–14 days  
**Recommended Order:** 4

---

### Phase 5: Automated Mapping Engine

**Objective:** Build an automated mapping engine that suggests table and column mappings using heuristic and statistical methods.

**Reusable Components:**
- Legacy `matching_strategies.py` logic (reimplement: `table_score`, `column_score`, `similarity`)
- `MappingResolver._build_mapping_contract()` pattern
- `ScoringEngine` pattern (adapt for mapping confidence)

**New Components:**
- `TableMatchingEngine`: Name similarity, column overlap, schema similarity
- `ColumnMatchingEngine`: Name similarity, type compatibility, position matching
- `MappingScoringEngine`: Confidence calculation for suggested mappings
- `MappingReviewService`: Human-in-the-loop review interface

**Files Likely Affected:**
- `app/mapping_engine/` — Implement `mapping_engine.py`, `matching_strategies.py`
- `app/services/` — New `mapping_service.py`
- `app/api/routes/` — New mapping endpoints

**Dependencies:**
- Phase 2 (Schema Discovery)
- Phase 4 (Metadata Extraction)

**Risks:**
- Fuzzy matching performance on large schemas (1000+ tables)
- False positive mappings need review workflow
- Column matching without PK/FK context is unreliable

**Estimated Effort:** 14–21 days  
**Recommended Order:** 5

---

### Phase 6: AI-Assisted Mapping

**Objective:** Integrate LLM-based semantic mapping suggestions with the heuristic engine for higher accuracy.

**Reusable Components:**
- `MappingEngine` from Phase 5
- `MappingScoringEngine`
- `MetadataEnrichmentService` from Phase 4

**New Components:**
- `AIMappingService`: LLM integration for semantic mapping
- `MappingContextBuilder`: Prepares metadata context for LLM prompts
- `MappingValidator`: Validates AI suggestions against schema constraints
- `FeedbackLoop`: Learns from human accept/reject decisions

**Files Likely Affected:**
- `app/intelligence/` — New `ai_mapping/` subdirectory
- `app/prompt/` — Existing prompt templates can be extended
- `app/services/` — Integrate AI mapping into `mapping_service.py`

**Dependencies:**
- Phase 5 (Automated Mapping Engine)
- Phase 4 (Metadata Extraction)

**Risks:**
- LLM API costs for large schemas
- Prompt engineering complexity for accurate suggestions
- Data privacy — schema metadata may contain sensitive information
- LLM hallucination — needs strict validation layer

**Estimated Effort:** 21–30 days  
**Recommended Order:** 6 (final phase)

---

## Appendix A: Evidence References

### Key Files Examined

| File | Lines | Purpose |
|------|-------|---------|
| `app/db/adapters/base_adapter.py` | 81 | Base adapter interface |
| `app/db/adapters/postgres_adapter.py` | 264 | Postgres adapter with connection pooling |
| `app/db/adapters/sqlserver_adapter.py` | 245 | SQL Server adapter with query transformation |
| `app/db/connection_factory.py` | 44 | Factory pattern for 7 database types |
| `app/db/connection_resolver.py` | 386 | System registry → adapter resolution |
| `app/db/repositories/system_repository.py` | 153 | System CRUD operations |
| `app/services/dataset_discovery_service.py` | 351 | Legacy-style discovery with suffix matching |
| `app/services/mapping_resolver.py` | 123 | Manual mapping resolution with contract |
| `app/discovery/auto_rule_discovery.py` | 311 | Rule inference from column metadata |
| `app/services/metadata_intelligence_service.py` | 36 | Basic column role inference |
| `app/execution_engine.py` | 1946 | DAG-based parallel control execution |
| `app/scoring_engine.py` | 106 | Risk-weighted batch scoring |
| `app/api/main.py` | 61 | FastAPI application entry |
| `app/api/routes/execution_routes.py` | 34 | Execution API endpoints |
| `app/api/routes/system_routes.py` | 96 | System management API |
| `config.yaml` | 102 | Primary configuration |

### Legacy Reference Documents

| Document | Lines | Purpose |
|----------|-------|---------|
| `research/Legacy_AutoMapping_Architecture_Analysis_Part_1.md` | 286 | Legacy v2.1 architecture analysis |
| `research/Legacy_Metadata_Discovery_Deep_Dive_Part_2.md` | 144 | Legacy metadata discovery deep dive |

---

## Appendix B: Technical Debt Inventory

| Category | Item | Location | Severity |
|----------|------|----------|----------|
| **Dead Code** | `pipelines_TO_BE_DELETED/` directory | `app/pipelines_TO_BE_DELETED/` | High |
| **Dead Code** | Multiple `_legacy` methods | `execution_engine.py`, `connection_resolver.py`, `dataset_discovery_service.py` | High |
| **Dead Code** | `DBConnector` class | `app/db_connector.py` | Medium (partially used) |
| **Hardcoding** | `'public'` schema in Postgres adapter | `postgres_adapter.py:261` | Medium |
| **Hardcoding** | `'dbo'` schema in SQL Server adapter | `sqlserver_adapter.py:237` | Medium |
| **Hardcoding** | `information_schema` queries in services | `dataset_discovery_service.py`, `auto_rule_discovery.py` | High |
| **Missing Models** | No Pydantic domain models | Throughout | Medium |
| **Empty Directories** | `app/mapping_engine/`, `app/mapping/`, `app/intelligence/matching/` | Various | Medium |
| **Duplication** | Multiple `_execute_control_*` methods | `execution_engine.py` | High |
| **Duplication** | Multiple `_build_adapter_*` methods | `connection_resolver.py` | High |
| **Duplication** | Multiple `_infer_rules_*` methods | `auto_rule_discovery.py` | Medium |
| **Security** | Credentials in `connection_config` JSONB | `system_registry` table | Low (separate credentials table exists) |

---

*End of Report*