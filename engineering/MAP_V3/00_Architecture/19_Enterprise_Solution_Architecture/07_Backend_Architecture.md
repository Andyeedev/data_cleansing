# 07_Backend_Architecture.md

# Backend Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document describes the Python backend architecture, module organization, execution flow, dependency graph, and startup process.

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Python | 3.11 |
| Web Framework | FastAPI | Latest |
| ASGI Server | Uvicorn | Latest |
| Database Driver | psycopg2 | Latest |
| JWT | python-jose | Latest |
| Password Hashing | passlib (bcrypt) | Latest |
| Rate Limiting | slowapi | Latest |
| Environment | python-dotenv | Latest |

---

## Module Organization

### Package Structure (`app/`)

| Package | Purpose | Files |
|---------|---------|-------|
| `app/api/` | FastAPI application, routes, middleware | 20+ files |
| `app/api/core/` | Auth, config, security, middleware | 10+ files |
| `app/api/routes/` | API route handlers | 12 routers |
| `app/db/` | Database adapters, connection management | 15+ files |
| `app/db/adapters/` | Database-specific adapters | 8 adapters |
| `app/db/repositories/` | Data access repositories | 2+ files |
| `app/execution/` | Control execution framework | 4 files |
| `app/controls/` | Control implementations | 2 files |
| `app/governance/` | Governance engine | 2 files |
| `app/services/` | Business logic services | 17 files |
| `app/rules/` | Validation rule implementations | 12 files |
| `app/discovery/` | Auto rule discovery | 1 file |
| `app/orchestration/` | Retry, isolation managers | 2+ files |
| `app/schemas/` | Pydantic schemas | 1+ files |
| `app/security/` | Encryption utilities | 1 file |
| `app/utils/` | Logger, sanitizer, encryption | 3 files |
| `app/scripts/` | CLI scripts | 7 files |

### Core Modules

| Module | File | Purpose |
|--------|------|---------|
| Main entry | `app/main.py` | CLI entry point |
| Config loader | `app/config_loader.py` | YAML config loading |
| Execution engine | `app/execution_engine.py` | 6-step pipeline |
| Rule executor | `app/rule_executor.py` | Rule execution logic |
| Rule factory | `app/rule_factory.py` | Rule instantiation |
| Scoring engine | `app/scoring_engine.py` | Risk-weighted scoring |
| DB connector | `app/db_connector.py` | Legacy DB connector |
| Audit export | `app/audit_export.py` | Audit pack generation |
| Parameter injector | `app/parameter_injector.py` | Parameter injection |

---

## Execution Flow (6-Step Pipeline)

### Step 1: Connection Resolution
- **File**: `app/execution_engine.py:81`
- **Component**: `ConnectionResolver`
- **Action**: Load systems from `core.system_registry`, build adapters via `connection_factory()`

### Step 2: Dataset Mapping
- **File**: `app/execution_engine.py:115`
- **Component**: `MappingResolver`
- **Action**: Resolve source-target mapping pairs from `core.dataset_mappings`

### Step 3: Rule Discovery
- **File**: `app/execution_engine.py:190`
- **Component**: `AutoRuleDiscovery`
- **Action**: Generate validation rules based on discovered datasets

### Step 4: Control Discovery
- **File**: `app/execution_engine.py:210`
- **Component**: `ExecutionEngine._get_controls()`
- **Action**: Load enabled controls from `engine.control_registry`, validate DAG dependencies

### Step 5: Control Execution
- **File**: `app/execution_engine.py:354`
- **Component**: `ControlExecutor` with `ThreadPoolExecutor`
- **Action**: Execute controls in parallel (4 workers), respecting DAG order

### Step 6: Governance Decision
- **File**: `app/execution_engine.py:459`
- **Component**: `ScoringEngine`, governance evaluation
- **Action**: Calculate scores, enforce release gate, record governance status

---

## Dependency Graph

```
app/main.py
├── app/config_loader.py
├── app/execution_engine.py
│   ├── app/db/connection_factory.py
│   │   └── app/db/adapters/*.py (7 adapters)
│   ├── app/db/connection_resolver.py
│   │   └── app/api/core/encryption_manager.py
│   ├── app/services/mapping_resolver.py
│   ├── app/discovery/auto_rule_discovery.py
│   ├── app/execution/control_executor.py
│   │   ├── app/execution/execution_context.py
│   │   ├── app/execution/execution_result.py
│   │   ├── app/execution/control_registry.py
│   │   └── app/controls/rule_adapter_control.py
│   │       └── app/rule_executor.py
│   │           ├── app/rule_factory.py
│   │           │   └── app/rules/*.py (10 rules)
│   │           └── app/parameter_injector.py
│   └── app/scoring_engine.py
├── app/audit_export.py
│   └── app/services/audit_pack_service.py
├── app/services/dataset_discovery_service.py
│   └── app/services/metadata_intelligence_service.py
└── app/api/main.py (FastAPI app)
    ├── app/api/routes/*.py (12 routers)
    ├── app/api/core/auth/*.py (JWT, RBAC)
    └── app/api/core/middleware/*.py (audit, tenant)
```

---

## Startup Process

### 1. Environment Loading
- **File**: `app/main.py:3`
- **Action**: `load_dotenv()` loads `.env` file

### 2. Configuration Loading
- **File**: `app/main.py:5`
- **Action**: `load_config(config_path)` loads YAML configuration

### 3. FastAPI Application
- **File**: `app/api/main.py:33`
- **Action**: Create FastAPI instance with middleware

### 4. Middleware Registration
- **File**: `app/api/main.py:41-66`
- **Action**: Register CORS, Audit, Timing middleware

### 5. Route Registration
- **File**: `app/api/main.py:146-158`
- **Action**: Include 12 routers

### 6. Server Start
- **Command**: `uvicorn app.api.main:app --reload`
- **Port**: 8000 (default)

---

## Database Adapters

| Adapter | File | Database |
|---------|------|----------|
| PostgresAdapter | `app/db/adapters/postgres_adapter.py` | PostgreSQL |
| MySQLAdapter | `app/db/adapters/mysql_adapter.py` | MySQL |
| SQLServerAdapter | `app/db/adapters/sqlserver_adapter.py` | SQL Server |
| SnowflakeAdapter | `app/db/adapters/snowflake_adapter.py` | Snowflake |
| BigQueryAdapter | `app/db/adapters/bigquery_adapter.py` | Google BigQuery |
| OracleAdapter | `app/db/adapters/oracle_adapter.py` | Oracle |
| DatabricksAdapter | `app/db/adapters/odatabricks_adapter.py` | Databricks |

### Factory Pattern
- **File**: `app/db/connection_factory.py:6`
- **Pattern**: `connection_factory(config)` → adapter instance
- **Routing**: Based on `config["type"]` field

---

## Validation Rules

| Rule | File | Purpose |
|------|------|---------|
| C01 | `app/rules/C01_row_count_rule.py` | Row count comparison |
| C02 | `app/rules/C02_sum_compare_rule.py` | Sum comparison |
| C03 | `app/rules/C03_referential_rule.py` | Referential integrity |
| C04 | `app/rules/C04_column_count_rule.py` | Column count comparison |
| C05 | `app/rules/C05_column_null_compare_rule.py` | Null count comparison |
| C06 | `app/rules/C06_data_type_match_rule.py` | Data type matching |
| C07 | `app/rules/C07_duplicate_detection_rule.py` | Duplicate detection |
| C08 | `app/rules/C08_data_drift_detection_rule.py` | Data drift detection |
| C09 | `app/rules/C09_referential_coverage_rule.py` | Referential coverage |
| C010 | `app/rules/C010_schema_drift_rule.py` | Schema drift detection |

---

## CLI Commands

| Command | Description | File |
|---------|-------------|------|
| `run` | Execute validation pipeline | `app/main.py:42` |
| `discover` | Run dataset discovery | `app/main.py:49` |
| `export` | Export audit pack | `app/main.py:53` |

---

## Key Design Patterns

| Pattern | Usage | Evidence |
|---------|-------|----------|
| Factory | Database adapters | `app/db/connection_factory.py:6` |
| Registry | Control classes | `app/execution/control_registry.py:4` |
| Strategy | Rule implementations | `app/rules/base_rule.py:9` |
| DAG | Control execution | `app/execution_engine.py:306` |
| Retry | Rule execution | `app/rule_executor.py:461` |
| Context | Execution state | `app/execution/execution_context.py:1` |

---

## Evidence

| Component | File Path |
|-----------|-----------|
| Main entry | `app/main.py:1` |
| Config loader | `app/config_loader.py` |
| Execution engine | `app/execution_engine.py:24` |
| Rule executor | `app/rule_executor.py:14` |
| Rule factory | `app/rule_factory.py:1` |
| Scoring engine | `app/scoring_engine.py:1` |
| Connection factory | `app/db/connection_factory.py:6` |
| Base adapter | `app/db/adapters/base_adapter.py` |
| Base rule | `app/rules/base_rule.py:9` |
| Base control | `app/controls/base_control.py:9` |
| Control executor | `app/execution/control_executor.py:11` |
| FastAPI app | `app/api/main.py:33` |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 30+*
