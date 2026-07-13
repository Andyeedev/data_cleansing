# MAP Nexus™ Enterprise Platform

# Architecture Compliance Report

**Date:** 13 July 2026

**Version:** 1.0

**Classification:** Architecture Validation Report

**Status:** Complete

---

# 1. Database Compliance — 75% WARNING

## 1.1 Schema Separation

| Schema | Exists | Correct Ownership | Status |
|--------|--------|-------------------|--------|
| `core` | YES | Migration metadata (projects, connections, datasets, mappings, tenants) | PASS |
| `engine` | YES | Execution (batch, controls, rules, governance, scoring) | PASS |
| `reporting` | YES | Reporting (dimensions, dashboards, reports, templates) | PASS |
| `platform` | YES | Application (users, roles, workflows, tasks, notifications) | PASS |
| `audit` | YES | Immutable history (audit events, security events, login history) | PASS |

**Verdict:** Schema separation is correct per 05_Database_Architecture.md.

## 1.2 Foreign Key Relationships

| Relationship | Exists | Enforced | Status |
|-------------|--------|----------|--------|
| `platform.users.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.roles.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.tasks.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.tasks.project_id` → `core.projects.project_id` | YES | YES | PASS |
| `platform.workflow_definitions.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.workflow_instances.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.approval_requests.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.approval_templates.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.calendar_events.tenant_id` → `core.tenants.tenant_id` | YES | YES | PASS |
| `platform.calendar_events.project_id` → `core.projects.project_id` | YES | YES | PASS |
| `platform.tasks` → `engine.migration_batch_registry` | NO | NO | FAIL |
| `platform.workflow_instances` → `engine.migration_batch_registry` | NO | NO | FAIL |

**Verdict:** 10 cross-schema FKs established. 2 missing (tasks/workflows → batches).

## 1.3 Naming Standards

| Standard | Compliance | Detail |
|----------|-----------|--------|
| PK naming | PASS | All tables use `id UUID PRIMARY KEY` |
| FK naming | PASS | `fk_<table>_<ref>` convention used |
| Index naming | PASS | `idx_<table>_<column>` convention used |
| Timestamp columns | WARNING | `created_at`/`updated_at` present on most tables; `created_by`/`updated_by` missing from many |

## 1.4 Dead Tables

| Table | Schema | Status |
|-------|--------|--------|
| `tenants_OLD` | engine | DEAD — should be removed |
| `projects_OLD` | engine | DEAD — should be removed |
| `system_registry_OLD` | engine | DEAD — should be removed |
| `dataset_mappings_OLD` | engine | DEAD — should be removed |
| `migration_batch_intelligence_OLD` | engine | DEAD — should be removed |
| `governance_config_OLD` | engine | DEAD — should be removed |
| `migration_control_execution_OLD` | engine | DEAD — should be removed |

**Verdict:** 7+ legacy tables remain. Should be dropped in cleanup phase.

---

# 2. API Compliance — 80% WARNING

## 2.1 API Standards

| Standard | Status | Detail |
|----------|--------|--------|
| REST conventions | PASS | GET/POST/PUT/DELETE used correctly |
| Versioning | PASS | All routes prefixed `/api/v1/` |
| JSON responses | PASS | All endpoints return JSON |
| Authentication | PASS | JWT Bearer token required on protected routes |
| Consistent error format | WARNING | Some endpoints return `{detail}`, others `{message}` |
| Pagination | WARNING | Some endpoints support `page`/`page_size`, others don't |
| Rate limiting | FAIL | No rate limiting implemented |
| CORS | FAIL | No CORS middleware configured |

## 2.2 Route Registration

| Router | Prefix | Status |
|--------|--------|--------|
| auth_routes | `/api/v1/auth` | PASS |
| user_routes | `/api/v1/users` | PASS |
| role_routes | `/api/v1/roles` | PASS |
| task_routes | `/api/v1/tasks` | PASS |
| workflow_routes | `/api/v1/workflows` | PASS |
| notification_routes | `/api/v1/notifications` | PASS |
| calendar_routes | `/api/v1/calendar` | PASS |
| settings_routes | `/api/v1/settings` | PASS |
| credential_routes | `/api/v1/credentials` | PASS |
| system_routes | `/api/v1/systems` | PASS |
| execution_routes | `/api/v1/execution` | PASS |
| system_routes_20260424 | `/systems` | FAIL — duplicate, wrong prefix |

## 2.3 Dependency Injection

| Pattern | Status | Detail |
|---------|--------|--------|
| `get_current_user` dependency | PASS | Used on all protected routes |
| `get_db_connection` dependency | WARNING | Routes call directly instead of using FastAPI Depends |
| Role-based authorization | FAIL | No role checking in any route |
| Tenant scoping | FAIL | No tenant filtering in any route |

---

# 3. Frontend Compliance — 70% WARNING

## 3.1 Architecture Compliance

| Rule | Status | Detail |
|------|--------|--------|
| React communicates only through APIs | PASS | All data fetching via `api/client.ts` |
| No business logic in React | PASS | Components are presentation-only |
| Widgets are reused | PASS | Shared component library in `components/` |
| Routing is consistent | PASS | Centralised route config in `config/routes.ts` |
| Portals are isolated | PASS | Each portal in its own directory |
| State management compliant | PASS | React Context, no Redux |
| Authentication centralised | PASS | `AuthProvider` context with JWT |

## 3.2 Frontend Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| Token storage key mismatch | FIXED | Was `map_nexus_token` vs `access_token` — now unified |
| sessionStorage vs localStorage | FIXED | Now always uses localStorage |
| API response unwrapping | FIXED | Hooks now handle `{success, data}` envelope |
| No error boundary on API calls | WARNING | Some pages show raw error messages |
| No loading states on all pages | WARNING | Some pages lack loading indicators |

---

# 4. Backend/Services Compliance — 50% FAIL

## 4.1 Layering Rules

| Rule | Status | Detail |
|------|--------|--------|
| Routes → Services → Repositories → DB | WARNING | Routes → Services → Raw SQL (6 of 8 services) |
| Services don't contain presentation logic | FAIL | 8 services return `{"success", "data"}` envelopes |
| No direct DB access from routes | PASS | All routes delegate to services |
| Repository pattern used | FAIL | Only 2 of 8 entities have repositories |

## 4.2 Service Inventory

| Service | Has Repository | Uses Raw SQL | Returns Envelope | Status |
|---------|---------------|-------------|------------------|--------|
| auth_service | N/A | N/A | NO | PASS |
| credential_service | YES | Partial | NO | WARNING |
| system_service | YES | Partial | NO | WARNING |
| workflow_service | NO | YES | YES | FAIL |
| task_service | NO | YES | YES | FAIL |
| user_service | NO | YES | YES | FAIL |
| role_service | NO | YES | YES | FAIL |
| notification_service | NO | YES | YES | FAIL |
| settings_service | NO | YES | YES | FAIL |
| calendar_service | NO | YES | YES | FAIL |
| execution_service | N/A | YES | NO | WARNING |

## 4.3 Duplicate Services

| Duplicate | Files | Recommendation |
|-----------|-------|----------------|
| Credential services | `credential_service.py` + `credential_admin_service.py` | Merge into one |
| System routes | `system_routes.py` + `system_routes_20260424.py` | Delete old version |
| System models | `system_models.py` + `system_models_with_validation_20260424.py` | Delete old version |
| Control executor | `app/execution/control_executor.py` + `app/orchestration/execution/control_executor.py` | Consolidate |
| EncryptionManager | 3 implementations | Consolidate to one |

---

# 5. Security Compliance — 45% FAIL

## 5.1 Authentication

| Control | Status | Detail |
|---------|--------|--------|
| JWT authentication | PASS | Login endpoint issues tokens |
| Password hashing | FAIL | No bcrypt — env-var comparison only |
| Token validation | PASS | `get_current_user` verifies JWT signature |
| Session management | WARNING | No refresh token rotation |
| MFA | FAIL | UI placeholder only — not functional |

## 5.2 Authorisation

| Control | Status | Detail |
|---------|--------|--------|
| Role-based access | FAIL | No role checking on any route |
| Permission-based access | FAIL | No permission checking |
| Tenant isolation | FAIL | No tenant filtering in queries |
| Resource-level access | FAIL | Any user can access any resource |

## 5.3 Secrets Management

| Control | Status | Detail |
|---------|--------|--------|
| No hardcoded secrets in code | PASS | Secrets in `.env` |
| Azure Key Vault | FAIL | Not implemented |
| JWT secret strength | FAIL | Trivial string: `my_super_secret_key_1234567890_very_secure` |
| Environment separation | WARNING | Same `.env` for all environments |

## 5.4 API Security

| Control | Status | Detail |
|---------|--------|--------|
| CORS configuration | FAIL | No CORS middleware |
| Rate limiting | FAIL | Not implemented |
| Input validation | WARNING | Pydantic models used but not comprehensive |
| SQL injection protection | WARNING | Parameterized queries used but raw SQL prevalent |

---

# 6. Integration/Layering Compliance — 60% WARNING

## 6.1 Expected Architecture

```
React → FastAPI → Application Services → Python Engine → PostgreSQL
```

## 6.2 Actual Architecture

```
React → FastAPI → Services → {Raw SQL} → PostgreSQL
                         → {Repository} → PostgreSQL (2 of 8)
                         → {ExecutionEngine} → PostgreSQL
```

## 6.3 Layer Violations

| Violation | Severity | Detail |
|-----------|----------|--------|
| Services return API response envelopes | HIGH | 8 services embed `{"success", "data"}` |
| Services bypass repositories | HIGH | 6 of 8 services use raw SQL |
| `execution_service.py` calls `get_db_connection()` directly | MEDIUM | Should use dependency injection |
| `credential_service.py._link_to_system()` bypasses repository | MEDIUM | Direct SQL in service |

## 6.4 Missing Integrations

| Integration | Architecture Expects | Current State |
|------------|---------------------|---------------|
| API Gateway | 04_API_Architecture.md | Not implemented |
| Azure Key Vault | 08_Security_Architecture.md | Not implemented |
| CI/CD Pipeline | 09_Deployment_Architecture.md | Not implemented |
| Containerization | 09_Deployment_Architecture.md | Docker files exist, unused |
| Reporting Service | 07_Reporting_Architecture.md | Only CSV export |
| AI Provider Framework | 06_AI_Architecture.md | Empty scaffold only |
| RBAC Middleware | 08_Security_Architecture.md | Not implemented |

---

# 7. AI Compliance — 20% FAIL

| Component | Status | Detail |
|-----------|--------|--------|
| AI Provider Framework | FAIL | `app/intelligence/` is empty scaffold |
| Prompt Library | FAIL | 3 basic prompts in `app/prompt/`, no governance |
| Conversation Architecture | FAIL | Not implemented |
| Provider Independence | FAIL | No provider abstraction layer |
| AI Security | FAIL | No prompt injection protection |
| Context Management | FAIL | Not implemented |

---

# 8. Reporting Compliance — 30% FAIL

| Component | Status | Detail |
|-----------|--------|--------|
| Reporting Schema Tables | FAIL | `reporting` schema exists but has 0 tables |
| Dashboard Views | WARNING | SQL views exist in `sql/views/` but not in reporting schema |
| Report Templates | FAIL | Not implemented |
| Scheduled Reports | FAIL | Not implemented |
| Export Engine | WARNING | `audit_export.py` provides CSV export only |
| HTML Rendering | FAIL | Not implemented |

---

# 9. Workflow Compliance — 55% WARNING

| Component | Status | Detail |
|-----------|--------|--------|
| Workflow Definitions | PASS | `platform.workflow_definitions` table + API |
| Workflow Instances | PASS | `platform.workflow_instances` table + API |
| Task Management | PASS | `platform.tasks` table + API + Frontend |
| Calendar | PASS | `platform.calendar_events` table + API + Frontend |
| Notifications | PASS | `platform.notifications` table + API + Frontend |
| Approvals | PASS | `platform.approval_requests` table + API + Frontend |
| Workflow Execution Engine | FAIL | API endpoint exists but no real execution logic |
| Workflow → Batch Link | FAIL | No FK to `engine.migration_batch_registry` |

---

# 10. Duplicate/Dead Code — 25% FAIL

## 10.1 Legacy Methods in ExecutionEngine

| Method | Lines | Status |
|--------|-------|--------|
| `_execute_control` | Current | ACTIVE |
| `_execute_control_legacy` | ~100 | DEAD |
| `_execute_control_legacy_20260501` | ~100 | DEAD |
| `_execute_control_legacy_20260501_1` | ~100 | DEAD |
| `_execute_control_legacy_20260501_2` | ~100 | DEAD |
| `_execute_control_legacy_20260504_1` | ~100 | DEAD |
| `_execute_control_legacy_20260504_1_v2` | ~100 | DEAD |
| `_execute_control_legacy_20260504_1_TO_BE_REMOV` | ~100 | DEAD |
| `_execute_control_legacy_20260504_3` | ~100 | DEAD |
| `_execute_control_legacy_20260505_4` | ~100 | DEAD |
| `_execute_control_legacy_202600_` | ~100 | DEAD |

**Total dead code:** ~1,100 lines in execution engine alone.

## 10.2 Duplicate Files

| File | Duplicate | Action |
|------|-----------|--------|
| `system_routes.py` | `system_routes_20260424.py` | Delete old |
| `system_models.py` | `system_models_with_validation_20260424.py` | Delete old |
| `credential_service.py` | `credential_admin_service.py` | Merge |
| `app/execution/control_executor.py` | `app/orchestration/execution/control_executor.py` | Consolidate |

## 10.3 Empty Scaffolds

| Directory | Status | Action |
|-----------|--------|--------|
| `MAP_V2/03_Source/backend/` | All empty | Delete |
| `MAP_V2/03_Source/shared/` | All empty | Delete |
| `app/intelligence/` | 6 empty subdirs | Keep for future |
| `app/mapping/` | Empty | Delete |
| `app/matching/` | Empty | Delete |
| `app/mapping_engine/` | Empty | Delete |
| `app/scoring/` | Empty | Delete |
| `app/diff/` | Empty | Delete |

---

*Generated by Architecture Compliance Audit Framework v1.0*
