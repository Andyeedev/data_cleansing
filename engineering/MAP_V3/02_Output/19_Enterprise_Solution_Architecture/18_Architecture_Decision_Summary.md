# 18. Architecture Decision Summary

## Overview

Major architectural decisions visible in the MAP Nexus repository, with supporting evidence.

---

## 1. Three-System Architecture

**Decision**: The platform operates as three distinct systems: API (FastAPI), Engine (Execution), Database (PostgreSQL).

### Evidence
| Component | File | Evidence |
|-----------|------|----------|
| API System | `app/api/main.py:33` | `app = FastAPI(title="Migration Validation SaaS")` |
| Engine System | `app/execution_engine.py:24` | `class ExecutionEngine` — orchestrates control execution |
| Database System | `app/db_connector.py:4` | `psycopg2.connect()` — direct PostgreSQL connection |

### Separation
- **API**: HTTP endpoints, authentication, middleware (`app/api/`)
- **Engine**: DAG execution, control orchestration, governance (`app/execution_engine.py`, `app/execution/`, `app/orchestration/`)
- **Database**: Adapters, repositories, connection management (`app/db/`)

---

## 2. Modular Backend (Routes → Services → Repositories)

**Decision**: Backend follows a three-layer architecture: Routes handle HTTP, Services contain business logic, Repositories handle data access.

### Evidence
| Layer | File | Evidence |
|-------|------|----------|
| Routes | `app/api/routes/auth_routes.py:16-22` | Route handlers call service methods |
| Services | `app/services/auth_service.py:11-53` | Business logic (login, password hashing) |
| Repositories | `app/db/repositories/credential_repository.py:1-63` | Data access (CRUD operations) |

### Route Registration
**File**: `app/api/main.py:146-158`
```python
app.include_router(auth_routes.router)
app.include_router(credential_routes.router)
app.include_router(system_routes.router)
# ... 9 more routers
```

### Service-Repository Pattern
**File**: `app/services/credential_service.py` → `app/db/repositories/credential_repository.py`

---

## 3. Multi-Database Adapter Pattern

**Decision**: Support multiple database types through a common adapter interface with factory instantiation.

### Evidence
| Component | File | Evidence |
|-----------|------|----------|
| Base Adapter | `app/db/adapters/base_adapter.py:9-81` | `class BaseAdapter` — abstract interface |
| Factory | `app/db/connection_factory.py:6-44` | `connection_factory(config)` — instantiates by type |
| Postgres | `app/db/adapters/postgres_adapter.py` | `class PostgresAdapter(BaseAdapter)` |
| MySQL | `app/db/adapters/mysql_adapter.py` | `class MySQLAdapter(BaseAdapter)` |
| SQL Server | `app/db/adapters/sqlserver_adapter.py` | `class SQLServerAdapter(BaseAdapter)` |
| Snowflake | `app/db/adapters/snowflake_adapter.py` | `class SnowflakeAdapter(BaseAdapter)` |
| BigQuery | `app/db/adapters/bigquery_adapter.py` | `class BigQueryAdapter(BaseAdapter)` |
| Oracle | `app/db/adapters/oracle_adapter.py` | `class OracleAdapter(BaseAdapter)` |
| Databricks | `app/db/adapters/odatabricks_adapter.py` | `class DatabricksAdapter(BaseAdapter)` |

### Factory Selection
**File**: `app/db/connection_factory.py:15-43`
```python
if db_type == "postgres":
    return PostgresAdapter(config)
elif db_type == "mysql":
    return MySQLAdapter(config)
# ... 5 more types
```

---

## 4. DAG-Based Control Execution

**Decision**: Controls execute in dependency order using a Directed Acyclic Graph (DAG) with parallel execution.

### Evidence
| Component | File | Evidence |
|-----------|------|----------|
| DAG Validation | `app/execution_engine.py:992-1007` | `_validate_dependencies()` — checks invalid refs |
| Cycle Detection | `app/execution_engine.py:1009-1035` | `_detect_cycles()` — DFS-based cycle detection |
| Ready Queue | `app/execution_engine.py:343-345` | `ready_queue = deque([cid for cid, count in dependency_count.items() if count == 0])` |
| Parallel Execution | `app/execution_engine.py:368` | `ThreadPoolExecutor(max_workers=4)` |
| Dependency Config | `config.yaml:84-91` | `control_dependencies: C02: [C01], C09: [C03]` |

### DAG Execution Flow
**File**: `app/execution_engine.py:372-446`
```
while ready_queue or futures:
    # Schedule ready controls
    while ready_queue:
        cid = ready_queue.popleft()
        future = executor_pool.submit(self._execute_control_with_retry, cid)
    # Wait for completion, release dependents
    for future in as_completed(futures):
        # Decrement dependency count for children
        # Add to ready_queue if count == 0
```

---

## 5. Portal-Based Frontend

**Decision**: Frontend is a React SPA with portal-based architecture, built with Vite and TypeScript.

### Evidence
| Component | File | Evidence |
|-----------|------|----------|
| React | `MAP_V2/03_Source/frontend/package.json:18` | `"react": "^19.2.7"` |
| TypeScript | `MAP_V2/03_Source/frontend/package.json:34` | `"typescript": "~6.0.2"` |
| Vite | `MAP_V2/03_Source/frontend/package.json:35` | `"vite": "^8.1.1"` |
| Portal Structure | `MAP_V2/03_Source/frontend/src/portal/` | Portal directory exists |
| Dashboard | `MAP_V2/03_Source/frontend/src/dashboard/` | Dashboard directory exists |
| Navigation | `MAP_V2/03_Source/frontend/src/navigation/` | Navigation directory exists |
| Routing | `MAP_V2/03_Source/frontend/src/pages/` | Pages directory exists |

### Frontend Source Structure
**File**: `MAP_V2/03_Source/frontend/src/`
```
src/
├── ai/           # AI integration
├── api/          # API client
├── authentication/ # Auth logic
├── components/   # Shared components
├── config/       # Frontend config
├── context/      # React context
├── dashboard/    # Dashboard views
├── hooks/        # Custom hooks
├── layout/       # Layout components
├── navigation/   # Navigation
├── pages/        # Page components
├── portal/       # Portal views
├── reporting/    # Reporting views
├── services/     # Frontend services
├── styles/       # CSS styles
├── theme/        # Theme config
├── types/        # TypeScript types
└── utils/        # Utilities
```

---

## 6. Widget-Based Dashboards

**Decision**: Dashboards use widget-based composition with AG Grid for data display and Recharts for visualization.

### Evidence
| Component | File | Evidence |
|-----------|------|----------|
| AG Grid | `MAP_V2/03_Source/frontend/package.json:14-15` | `"ag-grid-community": "^36.0.0"`, `"ag-grid-react": "^36.0.0"` |
| Recharts | `MAP_V2/03_Source/frontend/package.json:23` | `"recharts": "^3.9.2"` |
| Dashboard Directory | `MAP_V2/03_Source/frontend/src/dashboard/` | Dashboard source directory |
| SQL Dashboard Queries | `dashboard/Execution Dashboard Query/` | 4 SQL dashboard queries |

### Dashboard SQL Queries
**File**: `dashboard/Execution Dashboard Query/`
- `A_Batch Summary Dashboard.sql`
- `B_Slow Controls Dashboard.sql`
- `C_Worst Performing Entities.sql`
- `D._Failure Heatmap (what's breaking).sql`

---

## 7. JWT + RBAC Security

**Decision**: Authentication uses JWT tokens with role-based access control (RBAC) backed by database tables.

### Evidence
| Component | File | Evidence |
|-----------|------|----------|
| JWT Config | `app/api/core/auth/jwt_config.py:15-16` | `SECRET_KEY = get_secret("JWT_SECRET_KEY")`, `ALGORITHM = "HS256"` |
| JWT Handler | `app/api/core/auth/jwt_handler.py:6-10` | `create_token(data, expires_minutes=60)` |
| JWT Validation | `app/api/core/auth/dependencies.py:6-20` | `get_current_user(authorization)` |
| RBAC Permissions | `app/api/core/auth/rbac.py:7-38` | `require_permissions(*required)` — checks `platform.permissions` |
| RBAC Roles | `app/api/core/auth/rbac.py:41-64` | `require_role(*role_names)` — checks `platform.roles` |
| Login Endpoint | `app/api/routes/auth_routes.py:16-22` | `POST /api/v1/auth/login` |
| Password Hashing | `app/services/auth_service.py:8` | `CryptContext(schemes=["bcrypt"])` |

### RBAC Database Tables
**File**: `app/api/core/auth/rbac.py:16-24`
```sql
SELECT p.resource, p.action
FROM platform.user_roles ur
JOIN platform.roles r ON ur.role_id = r.id
JOIN platform.role_permissions rp ON r.id = rp.role_id
JOIN platform.permissions p ON rp.permission_id = p.id
WHERE ur.user_id = %s
```

---

## 8. Fernet Encryption

**Decision**: Credential encryption uses Fernet symmetric encryption with four independent implementations.

### Evidence
| Implementation | File | Key Source |
|----------------|------|------------|
| `CryptoManager` | `app/security/crypto.py:5-33` | Constructor parameter |
| `EncryptionUtils` | `app/utils/encryption_utils.py:4-21` | Static method parameter |
| `EncryptionManager` (security) | `app/api/core/security/encryption.py:5-24` | `FERNET_KEY` env var |
| `EncryptionManager` (core) | `app/api/core/encryption_manager.py:7-20` | `get_env("FERNET_KEY")` |

### Encryption Usage
**File**: `app/db/connection_resolver.py:288-289`
```python
encryption_manager = EncryptionManager()
decrypted_password = encryption_manager.decrypt(encrypted_password)
```

### Credential Storage
**File**: `app/db/repositories/credential_repository.py:16-35`
```python
def insert(self, credential_id, system_id, username, password_encrypted):
    # Stores encrypted password with encryption_key_id = "env-key-1"
```

---

## Decision Matrix Summary

| # | Decision | Key Files | Pattern |
|---|----------|-----------|---------|
| 1 | Three-system architecture | `app/api/main.py`, `app/execution_engine.py`, `app/db/` | Separation of concerns |
| 2 | Modular backend (R→S→R) | `app/api/routes/`, `app/services/`, `app/db/repositories/` | Layered architecture |
| 3 | Multi-database adapters | `app/db/adapters/`, `app/db/connection_factory.py` | Adapter + Factory pattern |
| 4 | DAG-based execution | `app/execution_engine.py:312-446`, `config.yaml:84-91` | DAG + parallel execution |
| 5 | Portal-based frontend | `MAP_V2/03_Source/frontend/src/portal/` | SPA with portal views |
| 6 | Widget-based dashboards | `MAP_V2/03_Source/frontend/src/dashboard/`, AG Grid, Recharts | Composite dashboard |
| 7 | JWT + RBAC security | `app/api/core/auth/`, `platform.*` tables | Token + permission-based auth |
| 8 | Fernet encryption | 4 implementations in `app/security/`, `app/utils/`, `app/api/core/` | Symmetric encryption |
