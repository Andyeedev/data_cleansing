# Phase 10.3 — Current State & Integration Assessment Report

**Date:** 2026-08-04
**Status:** Mandatory Gate — Assessment Complete
**Assessed by:** Automated codebase analysis

---

## Executive Summary

The platform has a **solid MAP CLI engine** (fully functional end-to-end), a **large but partially-connected frontend** (25+ routed pages, 5 new pages unrouted), and a **feature-rich backend** (23 registered route modules, 112+ endpoints). However, significant integration gaps exist between the new Phase 10 frontend pages and the backend APIs they expect, and there are multiple instances of dead code, duplicate implementations, and broken import chains.

### Overall Scorecard

| Area | Rating | Summary |
|------|--------|---------|
| **MAP CLI & Execution Engine** | ✅ | Fully functional end-to-end. 6-step pipeline, 10 rules, DAG scheduling, recovery, export. |
| **Backend (FastAPI)** | 🟡 | 23 route modules with real logic, but 3 dead/unregistered routes, broken imports, duplicate EncryptionManager, dual JWT libraries. |
| **Frontend (React)** | 🟡 | 25 routed pages working, 5 new pages implemented but UNROUTED (unreachable), 2 stub pages. Build passes. |
| **Database & Migrations** | 🔴 | No migration framework. Ad-hoc SQL files. Missing DDL for key tables. Overlapping schema files. |
| **Connection Manager** | 🟡 | ConnectionResolver functional. Connection Manager UI exists in frontend-mvp. Old adapter system removed. |
| **Adapters** | 🟡 | New adapter system (7 adapters) well-structured. Old adapter system removed. Pool supports postgres, sqlserver, mysql. |
| **Secrets/Credentials** | 🟡 | Single EncryptionManager (consolidated). No vault integration. Fernet-only with env var key. |
| **Discovery** | 🟡 | Backend real. DiscoveryPage connected. TreeTablePage calls 3 nonexistent endpoints. |
| **Mapping** | 🟡 | Backend routes REGISTERED and imports FIXED. MappingPage is 8-line stub. SpreadsheetPage calls 5 nonexistent endpoints. |
| **Validation** | 🟡 | Solid backend. 3 of 4 frontend pages connected. DashboardPage calls nonexistent endpoint. |
| **Onboarding** | ⚪ | Does not exist. |
| **Governance** | ✅ | Fully connected end-to-end. |

---

## Completed vs Planned

Every feature broken into: Was it planned? Is it built? Is it wired up? Is it production ready?

| Feature | Planned | Implemented | Integrated | Production Ready |
|---------|---------|-------------|------------|------------------|
| **Execution Engine** | ✅ | ✅ | ✅ | ✅ |
| **Rule Engine (C01-C010)** | ✅ | ✅ | ✅ | ✅ |
| **DAG Scheduler** | ✅ | ✅ | ✅ | ✅ |
| **Recovery / Checkpoint** | ✅ | ✅ | ✅ | ✅ |
| **Release Gate** | ✅ | ✅ | ✅ | ✅ |
| **Scoring Engine** | ✅ | ✅ | ✅ | ✅ |
| **Export Engine** | ✅ | ✅ | ✅ | 🟡 (stdout only) |
| **Audit Framework** | ✅ | ✅ | ✅ | ✅ |
| **Authentication / JWT** | ✅ | ✅ | ✅ | ✅ (single jose library) |
| **RBAC** | ✅ | ✅ | ✅ | ✅ |
| **Governance** | ✅ | ✅ | ✅ | ✅ |
| **Config Loader** | ✅ | ✅ | ✅ | ✅ |
| **CLI Entry (`python -m app`)** | ✅ | ✅ | ✅ | ✅ |
| **Backend CRUD Routes** | ✅ | ✅ | ✅ | ✅ |
| **Frontend Pages (25 routed)** | ✅ | ✅ | ✅ | ✅ |
| **Shared Components (15)** | ✅ | ✅ | ✅ | ✅ |
| **API Client** | ✅ | ✅ | ✅ | ✅ |
| **Design System / Dark Mode** | ✅ | ✅ | ✅ | ✅ |
| **Connection Resolver** | ✅ | ✅ | ✅ | ✅ (legacy removed) |
| **New Adapters (7)** | ✅ | ✅ | 🟡 | 🟡 (pool: 3/7 types) |
| **Credential Service** | ✅ | ✅ | ✅ | 🟡 (Fernet only) |
| **Discovery Backend** | ✅ | ✅ | ✅ | 🟡 (3 implementations) |
| **DiscoveryPage (Frontend)** | ✅ | ✅ | ✅ | ✅ |
| **Validation Backend** | ✅ | ✅ | ✅ | ✅ |
| **ValidationPage (Frontend)** | ✅ | ✅ | ✅ | ✅ |
| **ValidationResultsPage** | ✅ | ✅ | ✅ | 🟡 (limited backend) |
| **ExecutionHistoryPage** | ✅ | ✅ | ✅ | ✅ |
| **Connection Manager UI** | ✅ | ✅ | 🟡 | 🟡 (diagnostics unrouted) |
| **Calendar Routes** | ✅ | ✅ | ✅ (registered) | ✅ |
| **Approval Routes** | ✅ | ✅ | ✅ (registered) | ✅ |
| **Mapping Routes** | ✅ | ✅ | ✅ (registered, imports fixed) | 🟡 |
| **MappingPage (Frontend)** | ✅ | 🔴 (8-line stub) | ❌ | ❌ |
| **MappingSpreadsheetPage** | ✅ | ✅ (rich UI) | 🔴 (no backend APIs) | ❌ |
| **DiscoveryTreeTablePage** | ✅ | ✅ (rich UI) | 🔴 (no backend APIs) | ❌ |
| **ValidationDashboardPage** | ✅ | ✅ (rich UI) | 🔴 (no backend API) | ❌ |
| **MigrationTimelinePage** | ✅ | ✅ (rich UI) | 🔴 (not routed) | ❌ |
| **ConnectionDiagnosticsPage** | ✅ | ✅ (rich UI) | 🔴 (not routed) | ❌ |
| **Database Migrations** | ✅ | 🔴 (ad-hoc SQL) | ❌ | ❌ |
| **Vault / Secrets Provider** | ✅ | ⚪ (not started) | ❌ | ❌ |
| **Onboarding** | ✅ | ⚪ (not started) | ❌ | ❌ |
| **@tanstack/react-query** | ✅ | ⚪ (installed, unused) | ❌ | ❌ |

**Legend:**
- **Planned**: Was it designed/architected?
- **Implemented**: Is the code written?
- **Integrated**: Is it wired into the running system (routes registered, imports working, APIs connected)?
- **Production Ready**: Can a user use it end-to-end without errors?

---

## Do Not Touch — Frozen Components

These components are **working, tested, and in production use**. Do NOT rewrite, refactor, or modify them unless there is a critical bug. All other work should be treated as **integration work** around these frozen cores.

### DO NOT REWRITE

| Component | Status | Why It's Frozen |
|-----------|--------|-----------------|
| ✅ **Execution Engine** (`execution_engine.py`) | Working end-to-end | 6-step pipeline, DAG scheduling, retry, checkpointing — all functional. |
| ✅ **Rule Engine** (`rule_executor.py`, `rule_factory.py`, `rules/C01-C010`) | Working end-to-end | 10 rules with real SQL logic, entity resolution, parameter building. |
| ✅ **DAG Scheduler** (in `execution_engine.py`) | Working | Cycle detection, parallel execution, dependency validation. |
| ✅ **Recovery / Checkpoint** (in `execution_engine.py`) | Working | PostgreSQL-based checkpoint with ON CONFLICT upsert. |
| ✅ **Release Gate** (in `execution_engine.py`) | Working | Configurable enforcement (STRICT/RECORD_ONLY), minimum score threshold. |
| ✅ **Scoring Engine** (`scoring_engine.py`) | Working | Risk-weighted severity scoring. |
| ✅ **Audit Framework** (`app/utils/logger.py`, audit log level) | Working | Structured logging, compliance audit trail, log sanitizer. |
| ✅ **Authentication** (`jwt_handler.py`, `dependencies.py`) | Working | Token creation/decoding, user extraction from request. |
| ✅ **RBAC** (`rbac.py`) | Working | Permission-based access control via DB lookup. |
| ✅ **Config Loader** (`config_loader.py`) | Working | YAML parsing with `${VAR:-default}` env expansion. |
| ✅ **CLI Entry** (`__main__.py`) | Working | `run`, `discover`, `export` subcommands all wired. |
| ✅ **Backend CRUD Routes** (users, roles, tasks, workflows, notifications, settings) | Working | All registered, all with real service logic. |
| ✅ **Frontend App Shell** (`Shell.tsx`, `Layout.tsx`) | Working | Navigation, sidebar, breadcrumb, logout. |
| ✅ **Frontend Auth Flow** (`AuthContext`, `LoginPage`, `ProtectedRoute`) | Working | Login, token persistence, role-based routing. |
| ✅ **Frontend API Client** (`apiClient.ts`) | Working | Retry, auth injection, typed responses. |
| ✅ **Design System** (`tokens.ts`, CSS variables, dark mode) | Working | Consistent across all components. |
| ✅ **Governance System** (backend + frontend) | Working | Fully connected end-to-end. |

### DO NOT DELETE

| Component | Reason |
|-----------|--------|
| ⚪ Old adapter system (`app/db/adapters/`) | Dead code, but serves as reference for legacy behavior. Remove only after confirming no edge-case consumers. |
| ⚪ Legacy methods in `connection_resolver.py` | Three generations of `get_connections`/`_build_adapter`. Remove only after confirming current method covers all cases. |
| ⚪ Dead `_execute_control` in `execution_engine.py:520-536` | Overridden by second definition. Harmless but should be cleaned up in a dedicated cleanup pass. |

### Integration Work Only

Everything not in the frozen list above is **integration work**:

- Registering dead routes in `main.py`
- Adding routes in `AppRoutes.tsx` for new pages
- Creating backend endpoints for new page API calls
- Wiring up `MappingSpreadsheetPage`, `DiscoveryTreeTablePage`, `ValidationDashboardPage`
- Adding migration framework
- Consolidating `EncryptionManager`
- Removing old adapter system
- Fixing `ConnectionPool` for all 7 DB types

**None of this requires rewriting the execution engine, rule engine, or core platform.**

## 1. Backend (FastAPI) — 🟡 B+

### What's Implemented
- **FastAPI app** (`app/api/main.py`): CORS, rate limiting, audit middleware, request timing, global error handlers, health checks, custom OpenAPI with JWT auth. ✅
- **23 registered route modules** with 112+ endpoints covering auth, users, roles, credentials, systems, execution, workflows, tasks, notifications, settings, navigation, discovery, rule execution, validation reports, execution history, export, execution controls, monitoring, governance, dashboard, migration projects, migration datasets, schedules. ✅
- **Services layer**: Every route module has a corresponding service with real DB logic. ✅
- **Repository layer**: Clean data access for most domains. ✅
- **Models layer**: Pydantic models for request/response. ✅
- **Auth/JWT**: Token creation, decoding, RBAC permission checking. ✅

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| `calendar_routes.py` exists with real logic but NOT registered in `main.py`. Frontend depends on `/api/v1/calendar/events`. | 🔴 CRITICAL | `app/api/routes/calendar_routes.py`, `app/api/main.py` |
| `approval_routes.py` exists with real logic but NOT registered in `main.py`. Frontend depends on `/api/v1/approvals`. | 🔴 CRITICAL | `app/api/routes/approval_routes.py`, `app/api/main.py` |
| `mapping_routes.py` has BROKEN IMPORTS (`app.db.repositories.mapping_repository.MappingRepository` does not exist). Also NOT registered in `main.py`. | 🔴 CRITICAL | `app/api/routes/mapping_routes.py` |
| `tenant_middleware.py` imports from wrong path (`app.core.auth.jwt_handler` instead of `app.api.core.auth.jwt_handler`). Not registered. | 🔴 | `app/api/core/middleware/tenant_middleware.py` |
| Duplicate `EncryptionManager` classes with different key handling (`encryption_manager.py` calls `.encode()`, `security/encryption.py` does not). | 🔴 | `app/api/core/encryption_manager.py`, `app/api/core/security/encryption.py` |
| Dual JWT libraries: `jwt_handler.py` uses `import jwt` (PyJWT), `dependencies.py` uses `from jose import jwt`. | 🟡 | `app/api/core/auth/jwt_handler.py`, `app/api/core/auth/dependencies.py` |
| `readiness_check()` calls `db.conn.cursor()` but `PooledDBConnector` doesn't expose `.conn`. Should use `db.execute("SELECT 1")`. | 🟡 | `app/api/main.py:141` |
| `navigation_routes.py` returns 573 lines of hardcoded mock data. | 🟡 | `app/api/routes/navigation_routes.py` |
| `monitoring_routes.py` has 2 stub endpoints returning empty hardcoded results. | 🟡 | `app/api/routes/monitoring_routes.py` |

### Dead Code
- `calendar_routes.py` — real logic, unreachable (6 endpoints)
- `approval_routes.py` — real logic, unreachable (6 endpoints)
- `mapping_routes.py` — broken imports, unreachable (8 endpoints)

---

## 2. Frontend (React/TypeScript) — 🟡 B

### What's Implemented
- **25 routed pages** all with real UI logic, API calls, search/filter/pagination. ✅
- **15 shared components** (DataTable, Modal, StatusBadge, MetricCard, SearchBar, Pagination, Toast, EmptyState, ErrorState, LoadingSkeleton, ProgressBar, TabBar, TenantFilter, ConnectionTestPanel, ConfirmDialog). ✅
- **19 custom hooks** covering all backend domains. ✅
- **API client** with retry, auth injection, typed responses. ✅
- **Auth context** with localStorage persistence. ✅
- **TypeScript build passes** (0 errors). ✅
- **51 test files** (36 unit + 15 integration). 🟡

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| **5 new pages fully implemented but NOT ROUTED** — clicking their nav links shows NotFoundPage. Navigation links exist in Shell.tsx but routes missing from AppRoutes.tsx. | 🔴 CRITICAL | `AppRoutes.tsx`, `Shell.tsx`, 5 page files |
| `MappingPage.tsx` is an 8-line stub (`<h1>Mapping</h1>`). | 🔴 | `src/routes/MappingPage.tsx` |
| `HomePage` is a placeholder. | 🟡 | `src/routes/HomePage.tsx` |
| `@tanstack/react-query` installed but unused in all hooks (raw useState/useEffect used instead). | 🟡 | All hooks |
| Test suite times out (>3min). GovernancePage tests fail (`tenants.map is not a function`). | 🟡 | Test files |
| `ConnectionTestPanel` not exported from barrel `shared/index.ts`. | 🟡 | `src/components/shared/index.ts` |

### 5 Unreachable New Pages (Phase 10)

| Page | Nav Path in Shell.tsx | AppRoutes.tsx | Status |
|------|----------------------|---------------|--------|
| ConnectionDiagnosticsPage | `/migration/connections/diagnostics` | NOT ROUTED | 🔴 Implemented, unreachable |
| DiscoveryTreeTablePage | `/migration/discovery/tree` | NOT ROUTED | 🔴 Implemented, unreachable |
| MappingSpreadsheetPage | `/migration/mappings/spreadsheet` | NOT ROUTED | 🔴 Implemented, unreachable |
| ValidationDashboardPage | `/validation/dashboard` | NOT ROUTED | 🔴 Implemented, unreachable |
| MigrationTimelinePage | `/migration/timeline` | NOT ROUTED | 🔴 Implemented, unreachable |

---

## 3. MAP CLI & Execution Engine — ✅ A

### What's Implemented
- **CLI entry** (`python -m app run/discover/export --config config.yaml`). ✅
- **6-step execution pipeline**: Connection Resolution → Dataset Mapping → Rule Discovery → Control Discovery → Control Execution → Governance Decision. ✅
- **10 validation rules** (C01-C010) all with real SQL logic. ✅
- **DAG-based dependency scheduling** with cycle detection and parallel execution (4 workers). ✅
- **Recovery mode** (`--recovery` flag) filters to failed controls. ✅
- **Checkpoint/resume** via PostgreSQL upsert. ✅
- **Release gate** with configurable enforcement (STRICT/RECORD_ONLY). ✅
- **Scoring engine** with risk-weighted severity scoring. ✅
- **Audit export** (governance, summary, control details, exceptions, CSV). ✅
- **Observability** (structured logging, audit trail, execution tracing, log sanitizer). ✅

### What's Broken / Dead Code

| Issue | Severity | Files |
|-------|----------|-------|
| Duplicate `_execute_control` method — first definition (lines 520-536) references undefined `start_time`, overridden by second definition. | 🟡 | `execution_engine.py:520-536` |
| `_finalise_batch()` exists but is never called from `run()`. | 🟡 | `execution_engine.py:643-730` |
| Duplicate `__init__` in `RuleExecutor` (`__init__legacy_1`). | 🟡 | `rule_executor.py:33-41` |
| Dead legacy methods in `rule_executor.py`, `auto_rule_discovery.py`, `mapping_resolver.py`, `scoring_engine.py`. | ⚪ | Multiple files |
| `main.py` imports FastAPI app unnecessarily (`from .api.main import app`). | ⚪ | `app/main.py:6` |
| Duplicate argparse in both `__main__.py` and `main.py`. | ⚪ | Both files |

---

## 4. Database & Migrations — 🔴 D

### What's Implemented
- **39 SQL files** across `sql/schema/`, `sql/views/`, `sql/controls/`, `sql/demo/`, `sql/truncates_resets_testing/`. 🟡
- **Core tables**: `control_registry`, `rule_registry`, `rule_parameter_metadata`, `migration_validation_batch`, `migration_control_execution`, `migration_exception_register`, `migration_control_summary`, `migration_schedules`, `schedule_execution_log`. ✅
- **Core tables**: `discovery_snapshots`, `dataset_mappings`, `column_mappings`. ✅
- **DBConnector** (direct) and **PooledDBConnector** (thread-safe pool) for PostgreSQL. ✅
- **`app/db/connection.py`** clean wrapper used by 40+ call sites. ✅

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| **No migration framework** (no Alembic, Flyway, etc.). Ad-hoc manual SQL. | 🔴 CRITICAL | `sql/` directory |
| **Missing DDL** for `core.system_registry` and `core.system_credentials` — heavily used in code but no CREATE TABLE in schema files. | 🔴 | `sql/schema/` |
| **Overlapping schema files**: `01_engine_schema.sql` and `01_engine_schema_20260217.sql` define same tables. | 🟡 | `sql/schema/` |
| `db/safe_sql.py` exists but is unused and silently swallows all exceptions. | ⚪ | `app/db/safe_sql.py` |

---

## 5. Connection Manager — 🟡 B

### What's Implemented
- **ConnectionResolver** (`app/db/connection_resolver.py`): Loads systems from `core.system_registry`, builds adapters via `connection_factory()`, supports multiple systems per role, decrypts credentials. ✅
- **connection_factory.py** (`app/db/connection_factory.py`): Recently rewritten. Creates new adapters, converts dict configs to typed dataclasses, connects and returns adapter. ✅
- **Frontend Connection Manager UI**: `SystemsPage.tsx` (list), `SystemDetailPage.tsx` (detail), `ConnectionDiagnosticsPage.tsx` (diagnostics), `ConnectionTestPanel.tsx` (test). 🟡

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| ConnectionResolver has 3 generations of dead legacy methods (`get_connections`, `get_connections_legacy`, `get_connections_legacy_2`, `_build_adapter_legacy`, `_build_adapter_legacy_2`). | 🟡 | `connection_resolver.py` |
| `ConnectionDiagnosticsPage` is implemented but NOT routed in AppRoutes.tsx. | 🔴 | `AppRoutes.tsx` |

---

## 6. Adapters — 🟡 B

### New Adapter System (`app/adapters/`) — 🟡

| Component | Status |
|-----------|--------|
| `ConnectionAdapter` ABC (8 abstract methods) | ✅ |
| `AdapterRegistry` (register/get/is_supported/list) | ✅ |
| `ConnectionPool` + `ConnectionPoolManager` | 🟡 |
| 7 adapters (postgres, mysql, sqlserver, snowflake, oracle, bigquery, databricks) | ✅ |
| `config` property for backward compatibility | ✅ |
| `models.py` (TableInfo, ColumnInfo, ConnectionTestResult) | ✅ |

**Issues:**
- `ConnectionPool._create_connection()` only supports postgres, sqlserver, mysql. Snowflake, BigQuery, Oracle, Databricks will raise `ValueError`. 🔴
- Each adapter creates its own `ConnectionPoolManager` instance — no shared pooling. 🟡

### Old Adapter System (`app/db/adapters/`) — ⚪ DEAD CODE

| Component | Status |
|-----------|--------|
| 7 adapters + `BaseAdapter` | ⚪ Dead code |
| No external consumers | ⚪ Dead code |
| `bigquery_adapter.py` imports psycopg2 but is for BigQuery | ⚪ Broken dead code |

**The old adapter system is entirely dead code.** No file outside `app/db/adapters/` imports from it.

---

## 7. Secrets/Credentials — 🔴 D

### What's Implemented
- **CredentialService**: Full CRUD + upsert + decrypt for `core.system_credentials`. ✅
- **Credential routes**: REST API at `/api/v1/credentials` with auth. ✅
- **EncryptionManager**: Fernet-based encryption for passwords at rest. 🟡

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| **Two duplicate `EncryptionManager` classes** with different key handling. Both actively used by different code paths. | 🔴 | `app/api/core/encryption_manager.py`, `app/api/core/security/encryption.py` |
| **No vault integration** (no HashiCorp Vault, AWS Secrets Manager, Azure Key Vault). Fernet-only with env var key. | 🔴 | N/A |
| "SecretsProvider" mentioned in `postgres.py` docstring but does not exist. | ⚪ | `app/adapters/postgres.py:4` |

---

## 8. Discovery — 🟡 B-

### What's Implemented
- **Backend**: `AutoRuleDiscovery` (311 lines), `DatasetDiscoveryService` (351 lines), `DiscoveryServiceApi` (63 lines), `DiscoveryService` (199 lines), `DiscoveryRepository` (117 lines), 4 API endpoints. ✅
- **Frontend**: `DiscoveryPage.tsx` (187 lines) — lists systems, triggers execution, polls status. Connected to real APIs. ✅

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| `DiscoveryTreeTablePage.tsx` (396 lines, rich UI) calls 3 nonexistent endpoints: `/discovery/summary`, `/discovery/tree`, `/discovery/tables`. | 🔴 | `DiscoveryTreeTablePage.tsx` |
| `snapshot_manager.py` `_get_current_schema()` is a stub returning `{"tables": [], "columns": {}}`. | 🟡 | `app/services/discovery/snapshot_manager.py` |
| 3 different discovery implementations (legacy duplication). | 🟡 | Multiple files |

---

## 9. Mapping — 🔴 F

### What's Implemented
- **Backend**: `MappingResolver` (123 lines), `MappingValidator` (55 lines), `MappingService` (204 lines), `MappingRepository` (102 lines), 9 API endpoints in `mapping_routes.py`. 🟡

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| **`mapping_routes.py` NOT REGISTERED in `main.py`**. All 9 mapping endpoints are unreachable. | 🔴 CRITICAL | `app/api/routes/mapping_routes.py`, `app/api/main.py` |
| `mapping_routes.py` imports `MappingRepository` from non-existent path. | 🔴 | `app/api/routes/mapping_routes.py` |
| `MappingPage.tsx` is an 8-line stub. | 🔴 | `src/routes/MappingPage.tsx` |
| `MappingSpreadsheetPage.tsx` (369 lines, rich UI) calls 5 nonexistent endpoints: `/mapping/summary`, `/mapping/schema`, `/mapping/columns`, `/mapping/auto-map`, `/mapping/columns`. | 🔴 | `MappingSpreadsheetPage.tsx` |
| `MappingService._get_source_columns()` and `_get_target_columns()` return empty `[]` — column auto-mapping non-functional. | 🔴 | `app/services/mapping/mapping_service.py` |

---

## 10. Validation — 🟡 B

### What's Implemented
- **Backend**: `ScoringEngine`, `ValidationReportService`, `RuleExecutionService`, `ExecutionService`, 19 API endpoints across 4 route modules. All registered. ✅
- **Frontend**: `ValidationPage.tsx` (connected), `ValidationResultsPage.tsx` (connected, limited), `ExecutionHistoryPage.tsx` (connected). ✅

### What's Broken

| Issue | Severity | Files |
|-------|----------|-------|
| `ValidationDashboardPage.tsx` (292 lines, rich UI) calls nonexistent `/validation/dashboard`. | 🟡 | `ValidationDashboardPage.tsx` |
| `ValidationResultsPage.tsx` acknowledges incomplete backend for rule-level details. | 🟡 | `ValidationResultsPage.tsx` |

---

## 11. Onboarding — ⚪ NOT IMPLEMENTED

No backend services, routes, repositories, or frontend pages exist for onboarding.

---

## 12. Governance — ✅ A

### What's Implemented
- **Backend**: `GovernanceService` (74 lines), `GovernanceRepository`, 4 API endpoints (audit, approvals, exceptions, compliance). All require admin role. ✅
- **Frontend**: `GovernancePage.tsx` (697 lines) — 6-tab layout with real data tables, search, sort, pagination. ✅
- **API connectivity**: All 6 frontend API calls match existing backend endpoints. ✅

---

## What Has Been Completed

1. ✅ MAP CLI execution engine — fully functional end-to-end
2. ✅ 10 validation rules (C01-C010) with real SQL logic
3. ✅ DAG-based parallel execution with cycle detection
4. ✅ Recovery mode and checkpoint/resume
5. ✅ Release gate with configurable enforcement
6. ✅ Scoring engine with risk-weighted severity
7. ✅ Audit export (governance, summary, control details, exceptions, CSV)
8. ✅ FastAPI backend with 23 route modules, 112+ endpoints
9. ✅ Auth/JWT/RBAC system
10. ✅ Frontend with 25 routed pages, 15 shared components, 19 hooks
11. ✅ TypeScript build passes (0 errors)
12. ✅ 7 new database adapters (postgres, mysql, sqlserver, snowflake, oracle, bigquery, databricks)
13. ✅ Adapter registry with self-registration
14. ✅ Connection pool manager
15. ✅ Credential service with Fernet encryption
16. ✅ Governance system (fully connected)
17. ✅ Discovery system (DiscoveryPage connected)
18. ✅ Validation system (3 of 4 pages connected)
19. ✅ Design system with dark mode support

## What Remains to Be Implemented

1. 🔴 **Register 3 dead routes** in `main.py` (calendar, approval, mapping)
2. 🔴 **Fix mapping_routes.py broken imports**
3. 🔴 **Add routes for 5 new frontend pages** in AppRoutes.tsx
4. 🔴 **Create backend endpoints** for new pages that call nonexistent APIs:
   - `/discovery/summary`, `/discovery/tree`, `/discovery/tables`
   - `/mapping/summary`, `/mapping/schema`, `/mapping/columns`, `/mapping/auto-map`
   - `/validation/dashboard`
5. 🔴 **Add migration framework** (Alembic or equivalent)
6. 🔴 **Add DDL** for `core.system_registry` and `core.system_credentials`
7. 🔴 **Consolidate EncryptionManager** into single implementation
8. 🟡 **Fix ConnectionPool** to support all 7 database types
9. 🟡 **Implement MappingPage** or remove the stub
10. 🟡 **Implement HomePage** or redirect to dashboard
11. 🟡 **Fix dual JWT library** usage
12. 🟡 **Fix readiness_check** DB health check
13. 🟡 **Implement onboarding system** (currently absent)
14. ⚪ **Migrate hooks to @tanstack/react-query** (already a dependency)

## What Should Be Removed

1. ⚪ **Old adapter system** (`app/db/adapters/` — 8 files, entirely dead code)
2. ⚪ **Legacy methods** in `connection_resolver.py` (3 dead generations of `get_connections` and `_build_adapter`)
3. ⚪ **Legacy methods** in `rule_executor.py`, `auto_rule_discovery.py`, `mapping_resolver.py`, `scoring_engine.py`
4. ⚪ **Duplicate `_execute_control`** method in `execution_engine.py:520-536`
5. ⚪ **`_finalise_batch`** method never called from `run()`
6. ⚪ **Duplicate argparse** in `main.py` (mirrors `__main__.py`)
7. ⚪ **Unnecessary FastAPI import** in `main.py:6`
8. ⚪ **`db/safe_sql.py`** — unused, silently swallows errors
9. ⚪ **Overlapping schema files** (`01_engine_schema.sql` vs `01_engine_schema_20260217.sql`)

## What Should Be Fixed

1. 🔴 Register `calendar_routes.py`, `approval_routes.py`, `mapping_routes.py` in `main.py`
2. 🔴 Fix `mapping_routes.py` broken import path
3. 🔴 Add 5 routes in `AppRoutes.tsx` for new pages
4. 🔴 Create backend endpoints for new page API calls
5. 🔴 Consolidate duplicate `EncryptionManager` classes
6. 🔴 Fix `ConnectionPool._create_connection()` for all 7 DB types
7. 🟡 Fix `readiness_check()` to use `db.execute("SELECT 1")`
8. 🟡 Fix dual JWT library (standardize on one)
9. 🟡 Fix GovernancePage test (`tenants.map is not a function`)
10. 🟡 Fix `snapshot_manager.py` stub `_get_current_schema()`

## Recommended Implementation Order

### Phase A — Critical Integration Fixes (1-2 days)
1. Register 3 dead routes in `main.py`
2. Fix `mapping_routes.py` broken import
3. Add 5 routes in `AppRoutes.tsx` for new pages
4. Create stub backend endpoints for new page API calls (at minimum return mock data so pages render)

### Phase B — Backend Integrity (2-3 days)
5. Consolidate `EncryptionManager` into single implementation
6. Fix dual JWT library
7. Fix `readiness_check()` DB health check
8. Remove old adapter system (`app/db/adapters/`)
9. Remove dead legacy methods across codebase
10. Fix `ConnectionPool` for all 7 DB types

### Phase C — Database & Schema (2-3 days)
11. Add Alembic migration framework
12. Add DDL for `core.system_registry` and `core.system_credentials`
13. Resolve overlapping schema files
14. Create initial migration from existing SQL files

### Phase D — Frontend Polish (1-2 days)
15. Implement `MappingPage` properly or remove stub
16. Implement `HomePage` or redirect to dashboard
17. Fix test suite timeouts and failures
18. Migrate hooks to `@tanstack/react-query`

### Phase E — New Features (3-5 days)
19. Implement real backend endpoints for Discovery Tree/Table
20. Implement real backend endpoints for Mapping Spreadsheet
21. Implement real backend endpoints for Validation Dashboard
22. Implement onboarding system
23. Implement vault/secrets provider abstraction

---

## Phase 10.4 — Platform Stabilisation (Completed 2026-08-04)

### 10.4-1: Remove Dead Code ✅
- Deleted `app/db/adapters/` (8 files — old adapter system)
- Deleted `app/db/safe_sql.py` (unused)
- Removed legacy methods from:
  - `connection_resolver.py` — 5 legacy methods removed
  - `execution_engine.py` — dead `_execute_control` definition removed
  - `rule_executor.py` — `__init__legacy_1`, `_build_parameters_legacy_1`, `_log_rule_execution_legacy`, `_log_rule_execution_legacy_2` removed
  - `auto_rule_discovery.py` — `_infer_rules_legacy_not_working`, `_infer_rules_legacy_2`, `_register_rule_legacy`, `_detect_foreign_keys_legacy` removed
  - `mapping_resolver.py` — `resolve_legacy_20260501`, `resolve_legacy_20260504` removed
  - `scoring_engine.py` — `calculate_overall_legacy` removed

### 10.4-2: Register Missing Routes ✅
- Added `calendar_routes`, `approval_routes`, `mapping_routes` to `app/api/main.py` imports
- Registered all 3 routers with `app.include_router()`
- Backend now loads 33 routes (was 30)

### 10.4-3: Fix Broken Imports ✅
- `mapping_routes.py` — fixed import path from `app.db.repositories.mapping_repository` to `app.services.mapping.mapping_repository`
- `mapping_service.py` — fixed same import path
- `tenant_middleware.py` — fixed `from app.core.auth.jwt_handler` to `from app.api.core.auth.jwt_handler`

### 10.4-5: Remove Duplicates ✅
- Deleted `app/api/core/security/encryption.py` (duplicate EncryptionManager)
- Updated `credential_service.py` to import from canonical `app/api/core/encryption_manager.py`
- Removed duplicate argparse block from `app/main.py` (kept only `app/__main__.py`)
- Removed unnecessary `from .api.main import app` import from `app/main.py`

### 10.4-6: Consolidate EncryptionManager ✅
- Single `EncryptionManager` at `app/api/core/encryption_manager.py`
- Uses `get_env()` from config module
- Handles `memoryview` type for PostgreSQL BYTEA columns

### 10.4-7: Standardise JWT ✅
- Updated `jwt_handler.py` to use `from jose import jwt` (was `import jwt` from PyJWT)
- All JWT operations now use `python-jose` consistently

### 10.4-8: End-to-End Verification ✅
- MAP CLI runs end-to-end (6-step pipeline completes)
- Backend starts with 33 routes (health check passes)
- Frontend builds with 0 TypeScript errors
- SQL Server connections gracefully skipped when `pyodbc` not installed

### Files Modified
| File | Change |
|------|--------|
| `app/db/connection_resolver.py` | Removed 5 legacy methods, added ModuleNotFoundError handling |
| `app/db/connection_factory.py` | Fixed adapter creation + connection |
| `app/execution_engine.py` | Removed dead `_execute_control` definition |
| `app/rule_executor.py` | Removed 4 legacy methods |
| `app/discovery/auto_rule_discovery.py` | Removed 4 legacy methods |
| `app/services/mapping_resolver.py` | Removed 2 legacy methods |
| `app/scoring_engine.py` | Removed 1 legacy method |
| `app/api/main.py` | Added 3 route imports + registrations |
| `app/api/routes/mapping_routes.py` | Fixed broken import path |
| `app/services/mapping/mapping_service.py` | Fixed broken import path |
| `app/api/core/middleware/tenant_middleware.py` | Fixed broken import path |
| `app/api/core/auth/jwt_handler.py` | Changed from PyJWT to python-jose |
| `app/services/credential_service.py` | Fixed EncryptionManager import path |
| `app/main.py` | Removed duplicate argparse and unused FastAPI import |

### Files Deleted
| File | Reason |
|------|--------|
| `app/db/adapters/` (8 files) | Dead code — old adapter system |
| `app/db/safe_sql.py` | Unused |
| `app/api/core/security/encryption.py` | Duplicate EncryptionManager |
| `app/api/core/security/` (empty dir) | No files remaining |
