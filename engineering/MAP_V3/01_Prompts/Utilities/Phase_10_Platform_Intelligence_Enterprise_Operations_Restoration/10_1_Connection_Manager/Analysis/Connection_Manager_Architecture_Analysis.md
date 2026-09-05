# Connection Manager Architecture Analysis

**Phase:** 10.1 — Connection Manager  
**Status:** Awaiting Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Source of Truth Documents

| Document | Location |
|----------|----------|
| MAP Development Rule Gates | `engineering/MAP_V2/00_Governance/MAP_Development_Rule_Gates.md` |
| Backend Architecture | `engineering/MAP_V2/00_Architecture/03_Backend_Architecture.md` |
| Database Architecture | `engineering/MAP_V2/00_Architecture/05_Database_Architecture.md` |
| Security Architecture | `engineering/MAP_V2/00_Architecture/08_Security_Architecture.md` |
| API Architecture | `engineering/MAP_V2/00_Architecture/04_API_Architecture.md` |
| Development Standards | `engineering/MAP_V2/00_Architecture/11_Development_Standards.md` |
| Platform Integration | `engineering/MAP_V2/00_Architecture/12_Platform_Integration_Architecture.md` |
| Deployment Architecture | `engineering/MAP_V2/00_Architecture/09_Deployment_Architecture.md` |
| Master Roadmap | `engineering/MAP_V2/00_Architecture/00_Master_Roadmap.md` |
| Existing Codebase | `app/db/adapters/`, `app/db/connection_factory.py`, `app/db/connection_resolver.py` |

---

## 1. Current-State Analysis

### 1.1 Backend Components

| Component | File | Lines | Status |
|-----------|------|-------|--------|
| BaseAdapter | `app/db/adapters/base_adapter.py` | ~120 | Complete — template with retry logic |
| PostgresAdapter | `app/db/adapters/postgres_adapter.py` | 264 | **Production-ready** — pooling, retry, slow query logging |
| SQLServerAdapter | `app/db/adapters/sqlserver_adapter.py` | 245 | **Production-ready** — pooling, retry, query transform |
| MySQLAdapter | `app/db/adapters/mysql_adapter.py` | 42 | **Stub** — no pooling, no retry, no list_tables |
| OracleAdapter | `app/db/adapters/oracle_adapter.py` | 31 | **Stub** — no pooling, no retry, no list_tables |
| SnowflakeAdapter | `app/db/adapters/snowflake_adapter.py` | 28 | **Stub** — no pooling, no retry, no list_tables |
| BigQueryAdapter | `app/db/adapters/bigquery_adapter.py` | 35 | **Broken** — creates psycopg2 connection (copy-paste error) |
| DatabricksAdapter | `app/db/adapters/odatabricks_adapter.py` | 25 | **Broken** — filename mismatch causes import failure |
| ConnectionFactory | `app/db/connection_factory.py` | ~80 | Works for Postgres/SQLServer only |
| ConnectionResolver | `app/db/connection_resolver.py` | ~180 | Works — reads from core.system_registry |
| ConnectionValidator | `app/db/connection_validator.py` | 8 | Minimal — SELECT 1 only |
| SystemService | `app/services/system_service.py` | 152 | Partial — list_tables() crashes (dead import) |
| CredentialService | `app/services/credential_service.py` | 170 | Complete — encrypt/decrypt, CRUD |
| SystemRepository | `app/db/repositories/system_repository.py` | ~80 | Partial — no delete, no search |
| CredentialRepository | `app/db/repositories/credential_repository.py` | ~80 | Partial — no get_by_id |

### 1.2 API Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/v1/systems/` | GET | Works | Lists all systems |
| `/api/v1/systems/{id}` | GET | Works | Gets system detail |
| `/api/v1/systems/` | POST | Works | Creates system |
| `/api/v1/systems/{id}/test` | **BROKEN** | Hardcoded to psycopg2 | Only works for Postgres |
| `/api/v1/systems/{id}` | PUT | **MISSING** | No update endpoint |
| `/api/v1/systems/{id}` | DELETE | **MISSING** | No delete endpoint |
| `/api/v1/credentials/` | GET | Works | Lists credentials (no password) |
| `/api/v1/credentials/` | POST | Works | Creates credential |
| `/api/v1/credentials/{id}` | PUT | Works | Updates credential |
| `/api/v1/credentials/{id}` | DELETE | Works | Deletes credential |
| `/api/v1/credentials/{id}` | GET | **MISSING** | No single credential fetch |

### 1.3 Frontend Components

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| SystemsPage | `frontend-mvp/src/routes/SystemsPage.tsx` | Works | List, filter, test connection |
| SystemDetailPage | `frontend-mvp/src/routes/SystemDetailPage.tsx` | Works | View detail, test connection |
| Create System Form | — | **MISSING** | No create form |
| Edit System Form | — | **MISSING** | No edit form |
| Delete System | — | **MISSING** | No delete action |
| Create Credential Form | — | **MISSING** | No create form |
| Edit Credential Form | — | **MISSING** | No edit form |
| Delete Credential | — | **MISSING** | No delete action |

### 1.4 Database Schema

**`core.system_registry`:**
| Column | Type | Status |
|--------|------|--------|
| system_id | UUID PK | Exists |
| project_id | UUID FK | Exists |
| system_name | VARCHAR(200) | Exists |
| system_role | VARCHAR(50) CHECK | Exists |
| database_type | VARCHAR(50) CHECK | Exists |
| connection_config | JSONB | Exists |
| credential_id | UUID | **Added outside tracked DDL** |
| is_active | BOOLEAN | **Added outside tracked DDL** |
| schema_name | VARCHAR | **Added outside tracked DDL** |
| created_at | TIMESTAMP | Exists |

**`core.system_credentials`:**
| Column | Type | Status |
|--------|------|--------|
| credential_id | UUID PK | Exists |
| system_id | UUID FK | Exists |
| username | TEXT | Exists |
| password_encrypted | BYTEA | Exists |
| encryption_key_id | TEXT | Exists |

**Issue:** No `CREATE TABLE` DDL in any tracked SQL file for `core.system_credentials`. Table was created manually.

### 1.5 Encryption

| Implementation | File | Used By |
|----------------|------|---------|
| EncryptionManager | `app/api/core/encryption_manager.py` | ConnectionResolver |
| Fernet encryption | `app/api/core/security/encryption.py` | CredentialService |
| EncryptionUtils | `app/utils/encryption_utils.py` | reset_credentials.py |
| CryptoManager | `app/security/crypto.py` | Unused |

**Issue:** 4 duplicate encryption implementations. All use Fernet with same `FERNET_KEY` env var. Key is committed in `.env` files.

### 1.6 Critical Bugs

| Bug | Severity | Location | Impact |
|-----|----------|----------|--------|
| `adapter_factory` import doesn't exist | CRITICAL | `system_service.py:139` | `list_tables()` crashes |
| Databricks filename mismatch | CRITICAL | `connection_factory.py:40` | Databricks connections fail |
| Test connection hardcoded to Postgres | HIGH | `system_service.py:82-115` | Non-Postgres tests fail |
| BigQuery creates psycopg2 connection | HIGH | `bigquery_adapter.py` | BigQuery connections fail |
| FERNET_KEY in git | HIGH | `.env`, `.env_old` | Security vulnerability |

---

## 2. Gap Analysis

### 2.1 Functional Gaps

| Gap | Priority | Impact |
|-----|----------|--------|
| No system update/delete endpoints | HIGH | Can't manage systems after creation |
| No CRUD forms in frontend | HIGH | No way to create/edit/delete from UI |
| Test connection only works for Postgres | HIGH | 6 of 7 DB types can't be tested |
| `list_tables()` crashes | HIGH | Can't discover tables for any DB type |
| No connection health monitoring | MEDIUM | Dead connections not detected |
| No SSL/TLS configuration | MEDIUM | Can't connect to secured databases |
| No SSH tunnel support | MEDIUM | Can't connect through bastion hosts |
| No connection timeout configuration | MEDIUM | Hardcoded 5s timeout |
| No import/export connections | LOW | Can't bulk migrate connection configs |

### 2.2 Security Gaps

| Gap | Priority | Impact |
|-----|----------|--------|
| FERNET_KEY committed in git | HIGH | Key compromise risk |
| 4 duplicate encryption implementations | MEDIUM | Code quality, maintenance burden |
| No credential access control at API level | MEDIUM | Any authenticated user can read credentials |
| No audit logging on CRUD operations | MEDIUM | No trail of who changed what |
| No password complexity validation | LOW | Weak passwords accepted |
| No key rotation mechanism | MEDIUM | Can't rotate encryption keys |

### 2.3 Multi-Tenancy Gaps

| Gap | Priority | Impact |
|-----|----------|--------|
| No tenant isolation on credentials | HIGH | Cross-tenant credential access possible |
| `system_credentials` has no tenant FK | MEDIUM | Can't scope credentials by tenant |
| No project-level credential scoping | MEDIUM | All projects see all credentials |

### 2.4 Quality Gaps

| Gap | Priority | Impact |
|-----|----------|--------|
| Zero backend unit tests | HIGH | No regression safety |
| Schema DDL not tracked in repo | MEDIUM | Can't reproduce schema |
| Inconsistent error handling | MEDIUM | Some routes crash, others return clean errors |
| Dead code in system_service.py | LOW | Confusion, maintenance burden |

---

## 3. Three Architecture Recommendations

### Option A: Fix-and-Extend (Minimal)

**Approach:** Fix all bugs, add missing CRUD endpoints and forms, keep existing adapter pattern.

**Changes:**
- Fix all 5 critical/high bugs
- Add `PUT`/`DELETE` system endpoints
- Add system/credential CRUD forms in frontend
- Fix test connection to use adapter pattern
- Add `list_tables()` to all adapters
- Add backend unit tests
- Track schema DDL in repo

**Pros:**
- Lowest risk — minimal architectural change
- Fastest to implement (estimated 3-5 days)
- Preserves existing investment
- No migration needed

**Cons:**
- Adapters remain inconsistent (2 mature, 5 minimal)
- No connection pooling for 5 of 7 DB types
- No SSL/TLS, no SSH tunnels
- No health monitoring
- No credential rotation
- Technical debt remains

**Estimated Effort:** 3-5 days  
**Risk Level:** Low

---

### Option B: Standardise Adapters (Recommended)

**Approach:** Fix bugs, standardise all adapters to PostgresAdapter quality, add connection management features.

**Changes:**
- Everything in Option A
- Refactor all adapters to match PostgresAdapter quality (pooling, retry, logging)
- Add `BaseAdapter` contract enforcement (all adapters must implement `list_tables()`)
- Add SSL/TLS configuration support
- Add connection health monitoring (background thread)
- Add credential access control at API level
- Add audit logging on all CRUD operations
- Consolidate encryption to single implementation
- Add connection timeout configuration
- Add schema DDL tracking

**Pros:**
- Consistent adapter quality across all 7 DB types
- Production-ready connection management
- Security improvements (access control, audit, SSL)
- Health monitoring prevents silent failures
- Moderate effort

**Cons:**
- More work than Option A (estimated 8-12 days)
- Doesn't add SSH tunnels or advanced features
- Credential rotation still manual
- No Azure Key Vault integration yet

**Estimated Effort:** 8-12 days  
**Risk Level:** Medium

---

### Option C: Enterprise Connection Manager

**Approach:** Full enterprise-grade connection management with Azure Key Vault, advanced features.

**Changes:**
- Everything in Option B
- Azure Key Vault integration for credential storage
- SSH tunnel / bastion host support
- Credential rotation (scheduled + on-demand)
- Connection pooling with configurable limits
- Connection usage tracking and metrics
- Duplicate connection detection
- Import/export connections (JSON/YAML)
- Connection test scheduling (periodic health checks)
- Error categorization (auth vs network vs timeout vs DNS)
- Multi-tenant credential isolation with row-level security

**Pros:**
- Full enterprise compliance (ISO 27001, SOC 2)
- Azure-native integration
- Complete security model
- Advanced operational features
- Future-proof architecture

**Cons:**
- Highest effort (estimated 20-25 days)
- Requires Azure Key Vault infrastructure
- More complex implementation
- Higher testing burden

**Estimated Effort:** 20-25 days  
**Risk Level:** High (due to Azure dependencies)

---

## 4. Target Production Architecture

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│  SystemsPage │ SystemDetailPage │ CreateSystemForm │ ...     │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────────────┐
│                    FastAPI Layer                              │
│  system_routes.py │ credential_routes.py                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Business Services                            │
│  SystemService │ CredentialService │ ConnectionHealthService  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Repository Layer                             │
│  SystemRepository │ CredentialRepository                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Connection Management Layer                      │
│  ConnectionFactory → Adapter (Postgres/MySQL/SQLServer/...)  │
│  ConnectionResolver ← core.system_registry                   │
│  EncryptionManager ← core.system_credentials                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    PostgreSQL                                 │
│  core.system_registry │ core.system_credentials               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Adapter Standard (Target)

All adapters must implement:

```python
class BaseAdapter:
    def _connect(self) -> Connection       # Create connection
    def execute(self, query, params)        # Execute query
    def fetch_all(self, query, params)      # Fetch results
    def list_tables(self, schema=None)      # List tables
    def validate(self) -> bool              # Validate connection
    def close(self)                         # Close connection
    def test_connection(self) -> dict       # Test with diagnostics
```

**Required features for all adapters:**
- Connection pooling (configurable min/max)
- Retry logic (configurable retries + delay)
- SSL/TLS support (optional)
- Connection timeout (configurable)
- Slow query logging
- Structured error reporting

### 4.3 Database Schema (Target)

```sql
-- core.system_registry (existing, enhanced)
ALTER TABLE core.system_registry ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE core.system_registry ADD COLUMN IF NOT EXISTS schema_name VARCHAR(100);
ALTER TABLE core.system_registry ADD COLUMN IF NOT EXISTS last_tested_at TIMESTAMP;
ALTER TABLE core.system_registry ADD COLUMN IF NOT EXISTS last_test_status VARCHAR(20);
ALTER TABLE core.system_registry ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES core.tenants(tenant_id);

-- core.system_credentials (existing, enhanced)
ALTER TABLE core.system_credentials ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES core.tenants(tenant_id);
ALTER TABLE core.system_credentials ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE core.system_credentials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE core.system_credentials ADD COLUMN IF NOT EXISTS created_by VARCHAR(100);
ALTER TABLE core.system_credentials ADD COLUMN IF NOT EXISTS updated_by VARCHAR(100);

-- core.system_connection_log (NEW)
CREATE TABLE IF NOT EXISTS core.system_connection_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id UUID NOT NULL REFERENCES core.system_registry(system_id),
    action VARCHAR(50) NOT NULL, -- 'test', 'connect', 'disconnect', 'error'
    status VARCHAR(20) NOT NULL, -- 'success', 'failed'
    message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
```

---

## 5. Security Recommendations

### 5.1 Credential Storage

| Recommendation | Priority | Implementation |
|----------------|----------|----------------|
| Remove FERNET_KEY from git | CRITICAL | Rotate key, add to .gitignore, use env vars only |
| Consolidate encryption implementations | HIGH | Single `EncryptionManager` class, delete duplicates |
| Azure Key Vault integration | MEDIUM | Store FERNET_KEY in Key Vault, retrieve at startup |
| Key rotation mechanism | MEDIUM | Support key versioning, decrypt with old key, re-encrypt with new |

### 5.2 Access Control

| Recommendation | Priority | Implementation |
|----------------|----------|----------------|
| Admin-only API enforcement | HIGH | Check `userRoles` at API level, not just frontend |
| Tenant-scoped credential queries | HIGH | Filter by `tenant_id` in all credential queries |
| Audit logging on CRUD | HIGH | Log all create/update/delete operations to `audit.audit_events` |
| Password complexity validation | LOW | Minimum 8 chars, uppercase, lowercase, digit, special char |

### 5.3 Connection Security

| Recommendation | Priority | Implementation |
|----------------|----------|----------------|
| SSL/TLS support | MEDIUM | Add `sslmode`, `sslcert`, `sslkey` to connection configs |
| Encrypted connections mandatory | MEDIUM | Warn/block connections without SSL in production |
| Connection timeout configuration | MEDIUM | Per-system configurable timeout (default 10s) |

---

## 6. Multi-Tenancy Recommendations

### 6.1 Current Model

- `Tenant_ID` exists in `core.projects` and `core.tenants`
- `system_registry` has `project_id` FK (inherits tenant via project)
- `system_credentials` has NO tenant isolation

### 6.2 Recommended Model

**Option: Tenant via Project (Selected)**

```
Tenant → Projects → Systems → Credentials
```

- Credentials are scoped to the system they belong to
- Systems are scoped to the project
- Projects are scoped to the tenant
- All queries filter by tenant_id through the project FK chain

**Implementation:**
1. Add `tenant_id` to `system_credentials` for direct filtering
2. All credential queries include `WHERE tenant_id = %s`
3. Connection resolver filters by tenant
4. API endpoints validate tenant ownership before operations

---

## 7. Supported Database/Platform Matrix

| Database | Adapter | Pooling | Retry | SSL | list_tables | Status |
|----------|---------|---------|-------|-----|-------------|--------|
| PostgreSQL | PostgresAdapter | ✅ | ✅ | ✅ | ✅ | Production-ready |
| SQL Server | SQLServerAdapter | ✅ | ✅ | ✅ | ✅ | Production-ready |
| MySQL | MySQLAdapter | ❌→✅ | ❌→✅ | ❌→✅ | ❌→✅ | Needs upgrade |
| Oracle | OracleAdapter | ❌→✅ | ❌→✅ | ❌→✅ | ❌→✅ | Needs upgrade |
| Snowflake | SnowflakeAdapter | ❌→✅ | ❌→✅ | ✅ | ❌→✅ | Needs upgrade |
| BigQuery | BigQueryAdapter | ❌→✅ | ❌→✅ | ✅ | ❌→✅ | Needs fix + upgrade |
| Databricks | DatabricksAdapter | ❌→✅ | ❌→✅ | ✅ | ❌→✅ | Needs fix + upgrade |

**Target:** All 7 adapters at production-ready quality.

---

## 8. CRUD/UI Recommendations

### 8.1 Systems Management

| Page | Features |
|------|----------|
| **SystemsPage** (existing) | List, filter by role/DB type, test connection, link to detail |
| **SystemDetailPage** (existing) | View detail, test connection, show credentials |
| **CreateSystemPage** (NEW) | Form: name, role (SOURCE/TARGET), DB type, host, port, database, schema, credential selection/create |
| **EditSystemPage** (NEW) | Same form as create, pre-populated, with save/cancel |
| **DeleteSystemDialog** (NEW) | Confirmation dialog, cascade warning |

### 8.2 Credentials Management

| Page | Features |
|------|----------|
| **CreateCredentialModal** (NEW) | Modal: username, password, confirm password |
| **EditCredentialModal** (NEW) | Modal: username, password (optional change) |
| **DeleteCredentialDialog** (NEW) | Confirmation dialog |

### 8.3 UI Components

| Component | Purpose |
|-----------|---------|
| `SystemForm` | Reusable form for create/edit |
| `CredentialForm` | Reusable form for create/edit |
| `TestConnectionButton` | Button with loading state and result display |
| `ConnectionStatusBadge` | Badge showing connection status (green/red/gray) |
| `DatabaseTypeIcon` | Icon for each DB type |

---

## 9. API Recommendations

### 9.1 Systems API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/systems/` | GET | List systems (with tenant filter) |
| `/api/v1/systems/{id}` | GET | Get system detail |
| `/api/v1/systems/` | POST | Create system |
| `/api/v1/systems/{id}` | PUT | Update system |
| `/api/v1/systems/{id}` | DELETE | Delete system (soft delete) |
| `/api/v1/systems/{id}/test` | GET | Test connection (uses adapter) |
| `/api/v1/systems/{id}/tables` | GET | List tables (uses adapter) |
| `/api/v1/systems/{id}/health` | GET | Connection health check |

### 9.2 Credentials API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/credentials/` | GET | List credentials (tenant-scoped) |
| `/api/v1/credentials/{id}` | GET | Get single credential |
| `/api/v1/credentials/` | POST | Create credential |
| `/api/v1/credentials/{id}` | PUT | Update credential |
| `/api/v1/credentials/{id}` | DELETE | Delete credential |
| `/api/v1/credentials/by-system/{system_id}` | GET | Get credential for system |

### 9.3 Response Format

```json
{
  "success": true,
  "message": "System created successfully",
  "data": {
    "system_id": "uuid",
    "system_name": "Production DB",
    ...
  },
  "metadata": {},
  "errors": []
}
```

---

## 10. Migration Strategy

### 10.1 Phase 1: Bug Fixes (Days 1-2)

1. Fix `adapter_factory` import in `system_service.py`
2. Fix Databricks filename mismatch in `connection_factory.py`
3. Fix test connection to use adapter pattern
4. Fix BigQuery adapter to use correct connection library
5. Remove FERNET_KEY from git, rotate key

### 10.2 Phase 2: Core CRUD (Days 3-5)

1. Add `PUT`/`DELETE` system endpoints
2. Add `GET /credentials/{id}` endpoint
3. Add `GET /credentials/by-system/{system_id}` endpoint
4. Create `SystemForm` component
5. Create `CreateSystemPage` and `EditSystemPage`
6. Create credential modals
7. Add backend unit tests

### 10.3 Phase 3: Adapter Standardisation (Days 6-9)

1. Upgrade MySQLAdapter (pooling, retry, list_tables)
2. Upgrade OracleAdapter (pooling, retry, list_tables)
3. Upgrade SnowflakeAdapter (pooling, retry, list_tables)
4. Fix and upgrade BigQueryAdapter
5. Fix and upgrade DatabricksAdapter
6. Add SSL/TLS support to all adapters
7. Add connection timeout configuration

### 10.4 Phase 4: Security & Multi-Tenancy (Days 10-12)

1. Add tenant_id to system_credentials
2. Add admin-only enforcement at API level
3. Add audit logging on CRUD operations
4. Consolidate encryption implementations
5. Add connection logging table
6. Track schema DDL in repo

---

## 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Adapter standardisation breaks existing functionality | Medium | High | Run full test suite after each adapter change |
| Schema changes cause data migration issues | Low | High | Use ALTER TABLE ADD COLUMN IF NOT EXISTS |
| Key rotation causes service disruption | Medium | High | Implement key versioning, decrypt with old key |
| Azure Key Vault dependency blocks dev environment | Medium | Medium | Support env vars as fallback |
| Multi-tenant credential isolation introduces query performance issues | Low | Medium | Add indexes on tenant_id columns |
| Frontend CRUD forms introduce UI regressions | Medium | Medium | Integration tests for all forms |
| Databricks/BigQuery adapters require different Python libraries | High | Low | Make library imports optional (try/except) |

---

## 12. Recommended Option

### **Option B: Standardise Adapters**

**Rationale:**

1. **Risk-reward balance:** Option A leaves too much technical debt. Option C is over-scoped for current needs. Option B delivers production-ready quality without Azure dependencies.

2. **Alignment with architecture docs:** The Backend Architecture doc states "Each service owns its business capability while remaining loosely coupled." Standardising adapters ensures consistent quality while maintaining the existing factory pattern.

3. **Security compliance:** Option B addresses all critical security gaps (access control, audit, SSL) without requiring Azure Key Vault infrastructure.

4. **Multi-tenancy:** Option B adds tenant isolation through the project FK chain, which is the established pattern in the codebase.

5. **Effort estimate:** 8-12 days is achievable within a single sprint and delivers measurable value.

6. **Future extensibility:** Option B provides a solid foundation for Option C features (Azure Key Vault, SSH tunnels) to be added later without architectural changes.

---

## Appendix A: Affected Components

### Backend Files
| File | Change Type |
|------|-------------|
| `app/db/adapters/mysql_adapter.py` | Upgrade |
| `app/db/adapters/oracle_adapter.py` | Upgrade |
| `app/db/adapters/snowflake_adapter.py` | Upgrade |
| `app/db/adapters/bigquery_adapter.py` | Fix + Upgrade |
| `app/db/adapters/odatabricks_adapter.py` | Rename + Upgrade |
| `app/db/adapters/base_adapter.py` | Enhance |
| `app/db/connection_factory.py` | Fix import |
| `app/services/system_service.py` | Fix bugs, add methods |
| `app/services/credential_service.py` | Add access control |
| `app/api/routes/system_routes.py` | Add PUT/DELETE |
| `app/api/routes/credential_routes.py` | Add GET/{id} |
| `app/db/repositories/system_repository.py` | Add delete, search |
| `app/db/repositories/credential_repository.py` | Add get_by_id |
| `app/api/core/encryption_manager.py` | Consolidate as single impl |

### New Backend Files
| File | Purpose |
|------|---------|
| `app/db/repositories/connection_log_repository.py` | Connection audit logging |
| `app/services/connection_health_service.py` | Background health checks |

### Frontend Files
| File | Change Type |
|------|-------------|
| `frontend-mvp/src/routes/SystemsPage.tsx` | Add create/delete buttons |
| `frontend-mvp/src/routes/SystemDetailPage.tsx` | Add edit/delete buttons |

### New Frontend Files
| File | Purpose |
|------|---------|
| `frontend-mvp/src/routes/CreateSystemPage.tsx` | Create system form |
| `frontend-mvp/src/routes/EditSystemPage.tsx` | Edit system form |
| `frontend-mvp/src/components/Systems/SystemForm.tsx` | Reusable form |
| `frontend-mvp/src/components/Systems/CredentialModal.tsx` | Credential create/edit modal |
| `frontend-mvp/src/components/Systems/TestConnectionButton.tsx` | Test connection component |

### Database Changes
| Object | Change Type |
|--------|-------------|
| `core.system_registry` | ALTER TABLE (add columns) |
| `core.system_credentials` | ALTER TABLE (add columns) |
| `core.system_connection_log` | CREATE TABLE |

---

## Appendix B: Assumptions

1. PostgreSQL is the primary database — all other databases are source/target systems being migrated
2. The existing `core.system_registry` and `core.system_credentials` tables are the correct location for connection metadata
3. Fernet encryption is sufficient for credential storage (AES-128-CBC with HMAC-SHA256)
4. The factory pattern for adapters is the correct architectural approach
5. Azure Key Vault integration is a future enhancement, not required for initial production deployment
6. SSH tunnel support is a future enhancement
7. The frontend uses the existing shared components (Modal, StatusBadge, etc.)

---

## Appendix C: Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| psycopg2 | Python lib | Required for PostgreSQL adapter |
| pymssql | Python lib | Required for SQL Server adapter |
| pymysql | Python lib | Required for MySQL adapter |
| oracledb | Python lib | Required for Oracle adapter |
| snowflake-connector-python | Python lib | Required for Snowflake adapter |
| google-cloud-bigquery | Python lib | Required for BigQuery adapter |
| databricks-sql-connector | Python lib | Required for Databricks adapter |
| cryptography | Python lib | Required for Fernet encryption |

---

**Awaiting approval before implementation.**
