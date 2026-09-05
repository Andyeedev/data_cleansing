# Document 17: Implementation Decision Record

## Overview

Each architectural decision is documented with the decision made, the implementation found in the repository, and the file-level evidence.

---

## Decision 1: Factory Pattern — Database Connections

| Field | Value |
|---|---|
| **Decision** | Use a factory function to instantiate database adapters based on a `type` string |
| **Implementation** | `connection_factory(config)` function that maps DB type strings to adapter classes |
| **File** | `app/db/connection_factory.py:6-44` |

```python
def connection_factory(config):
    db_type = config.get("type") or config.get("database_type")
    if db_type == "postgres":
        from app.db.adapters.postgres_adapter import PostgresAdapter
        return PostgresAdapter(config)
    elif db_type == "mysql":
        from app.db.adapters.mysql_adapter import MySQLAdapter
        return MySQLAdapter(config)
    # ... sqlserver, snowflake, bigquery, oracle, databricks
```

**Evidence**: Supports 7 database types via lazy imports. Each adapter extends `BaseAdapter` (`app/db/adapters/base_adapter.py`).

---

## Decision 2: Factory Pattern — Rule Instantiation

| Field | Value |
|---|---|
| **Decision** | Use a static factory with explicit registry to create rule instances from rule_id strings |
| **Implementation** | `RuleFactory.create(rule_id, source_db, target_db, parameters)` with `RULE_REGISTRY` dict |
| **File** | `app/rule_factory.py:13-41` |

```python
class RuleFactory:
    RULE_REGISTRY = {
        "C01_ROWCOUNT": RowCountRule,
        "C02_BALANCE_RECON": SumCompareRule,
        # ... 10 rules total
    }

    @staticmethod
    def create(rule_id, source_db, target_db, parameters):
        rule_class = RuleFactory.RULE_REGISTRY.get(rule_id)
        return rule_class(source_db, target_db, parameters)
```

**Evidence**: 10 rule classes registered in `RULE_REGISTRY`. Unknown rule_ids raise `ValueError`.

---

## Decision 3: Registry Pattern — Rule Self-Registration

| Field | Value |
|---|---|
| **Decision** | Rule subclasses self-register via `__init_subclass__` hook using a `REGISTRY` dict on `BaseRule` |
| **Implementation** | `BaseRule.REGISTRY` populated automatically when subclasses define `RULE_ID` |
| **File** | `app/rules/base_rule.py:30-34` |

```python
class BaseRule:
    REGISTRY = {}
    RULE_ID = None

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if cls.RULE_ID:
            BaseRule.REGISTRY[cls.RULE_ID] = cls
```

**Evidence**: Alternative registration mechanism alongside `RuleFactory.RULE_REGISTRY`. Not all rules use both — `RuleFactory` is the primary entry point.

---

## Decision 4: Registry Pattern — Widget Registry (Frontend)

| Field | Value |
|---|---|
| **Decision** | Frontend uses a widget registry pattern for component discovery |
| **Implementation** | `WidgetRegistry` class with registration and lookup |
| **File** | `MAP_V2/03_Source/frontend/src/components/widgets/registry/WidgetRegistry.ts` |

**Evidence**: Widget components discovered via registry at `src/components/widgets/engine/WidgetFactory.ts`.

---

## Decision 5: Registry Pattern — Portal Registry (Frontend)

| Field | Value |
|---|---|
| **Decision** | Portal definitions are managed through a registry pattern |
| **Implementation** | Portal types and definitions in `src/portal/types/` |
| **Files** | `src/portal/types/PortalDefinition.ts`, `PortalContext.ts`, `PortalProps.ts` |

**Evidence**: Portal system defined with typed interfaces for portal definitions and context.

---

## Decision 6: Registry Pattern — Control Registry (Backend)

| Field | Value |
|---|---|
| **Decision** | Control implementations registered in a dict; missing entries fall back to `RuleAdapterControl` |
| **Implementation** | `CONTROL_REGISTRY = {}` (currently empty) |
| **File** | `app/execution/control_registry.py:4-5` |

```python
CONTROL_REGISTRY = {
}
```

**Evidence**: Empty registry means all controls use the default `RuleAdapterControl` adapter (`app/controls/rule_adapter_control.py`).

---

## Decision 7: Adapter Pattern — 7 Database Adapters

| Field | Value |
|---|---|
| **Decision** | Abstract base adapter with database-specific implementations for 7 database engines |
| **Implementation** | `BaseAdapter` ABC with concrete adapters |
| **Base** | `app/db/adapters/base_adapter.py` |

| Adapter | File | Database |
|---|---|---|
| `PostgresAdapter` | `app/db/adapters/postgres_adapter.py` | PostgreSQL |
| `MySQLAdapter` | `app/db/adapters/mysql_adapter.py` | MySQL |
| `SQLServerAdapter` | `app/db/adapters/sqlserver_adapter.py` | SQL Server |
| `SnowflakeAdapter` | `app/db/adapters/snowflake_adapter.py` | Snowflake |
| `BigQueryAdapter` | `app/db/adapters/bigquery_adapter.py` | Google BigQuery |
| `OracleAdapter` | `app/db/adapters/oracle_adapter.py` | Oracle |
| `DatabricksAdapter` | `app/db/adapters/odatabricks_adapter.py` | Databricks |

**Evidence**: Each adapter extends `BaseAdapter` and implements `_connect()` and `execute()`. `BaseAdapter` provides retry logic (3 attempts, 2s delay) and connection validation.

---

## Decision 8: Layered Architecture

| Field | Value |
|---|---|
| **Decision** | Strict layered architecture: Routes → Services → Repositories → Adapters |
| **Implementation** | Each layer depends only on the layer below |
| **Files** | `app/api/routes/` → `app/services/` → `app/db/repositories/` → `app/db/adapters/` |

```
API Routes (auth_routes, execution_routes, ...)
    ↓
Services (auth_service, execution_service, credential_service, ...)
    ↓
Repositories (credential_repository, system_repository)
    ↓
Adapters (postgres_adapter, mysql_adapter, ...)
```

**Evidence**:
- `app/api/routes/execution_routes.py` → `ExecutionService` (line 3)
- `app/services/credential_service.py` → `CredentialRepository` (line 4)
- `app/db/repositories/credential_repository.py` → raw SQL via `self.conn.cursor()` (line 13)
- `app/db/connection_resolver.py` → `connection_factory()` → adapter classes (line 211)

---

## Decision 9: DAG Execution — Control Dependencies

| Field | Value |
|---|---|
| **Decision** | Controls execute as a directed acyclic graph with explicit dependency declarations |
| **Implementation** | `control_dependencies` in `config.yaml`; topological execution via `ready_queue` + `dependency_count` |
| **File** | `app/execution_engine.py:309-446` and `config.yaml:84-90` |

```yaml
control_dependencies:
  C02:
    - C01
  C09:
    - C03
```

**Evidence**:
- Dependency graph built at `execution_engine.py:325-338`
- `ready_queue` initialized with zero-dependency controls (line 343)
- After each control completes, dependent controls are released (lines 439-444)
- Cycle detection via DFS at `_detect_cycles()` (line 1009)
- Deadlock detection when `ready_queue` is empty but futures remain (line 390)
- Parallel execution via `ThreadPoolExecutor(max_workers=4)` (line 368)

---

## Decision 10: Multi-Tenant Design

| Field | Value |
|---|---|
| **Decision** | Tenant isolation via `tenant_id` embedded in JWT and extracted by middleware |
| **Implementation** | `tenant_id` in JWT payload; extracted by `tenant_middleware.py` and `get_current_user_with_tenant()` |
| **Files** | `app/services/auth_service.py:44`, `app/api/core/middleware/tenant_middleware.py`, `app/api/core/auth/dependencies.py:23-41` |

**JWT Payload** (from `auth_service.py:44`):
```python
payload = {
    "sub": str(user_id),
    "user": email,
    "tenant_id": str(tenant_id) if tenant_id else None,
    "exp": datetime.utcnow() + timedelta(hours=2)
}
```

**Tenant Middleware** (`tenant_middleware.py:5-16`):
```python
async def tenant_middleware(request: Request, call_next):
    auth = request.headers.get("Authorization")
    if auth:
        token = auth.replace("Bearer ", "")
        payload = decode_token(token)
        request.state.tenant_id = payload.get("tenant_id")
```

**Tenant-Scoped Dependency** (`dependencies.py:23-41`):
```python
def get_current_user_with_tenant(authorization: str = Header(None)):
    # ... validates JWT
    if not payload.get("tenant_id"):
        raise HTTPException(status_code=403, detail="No tenant context")
    return payload
```

**Evidence**: Governance queries use `tenant_id` for data isolation (`risk_scoring.py:12`, `decision_engine.py:15`).

---

## Decision Summary

| # | Pattern | Scope | Primary File |
|---|---|---|---|
| 1 | Factory | Database connections | `app/db/connection_factory.py` |
| 2 | Factory | Rule instantiation | `app/rule_factory.py` |
| 3 | Registry | Rule self-registration | `app/rules/base_rule.py` |
| 4 | Registry | Widget registration (FE) | `MAP_V2/.../WidgetRegistry.ts` |
| 5 | Registry | Portal definitions (FE) | `MAP_V2/.../PortalDefinition.ts` |
| 6 | Registry | Control implementations | `app/execution/control_registry.py` |
| 7 | Adapter | 7 database engines | `app/db/adapters/base_adapter.py` |
| 8 | Layered Arch | Route→Service→Repo→Adapter | `app/api/routes/` → `app/services/` → `app/db/repositories/` → `app/db/adapters/` |
| 9 | DAG | Control execution ordering | `app/execution_engine.py` + `config.yaml` |
| 10 | Multi-Tenant | tenant_id in JWT | `app/services/auth_service.py` + `tenant_middleware.py` |
