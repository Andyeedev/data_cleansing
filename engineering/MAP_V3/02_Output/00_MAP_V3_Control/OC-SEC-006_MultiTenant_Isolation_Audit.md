# OC-SEC-006 — Multi-Tenant Isolation Deep Audit (Investigation Report)
**WORK PACKAGE:** OC-SEC-006 | **ID:** OC-SEC-006 | **DATE:** 2026-09-07 | **MAP VERSION:** MAP_V3
**OBJECTIVE:** Investigate multi-tenant isolation — object-level access control, cross-tenant API testing, tenant isolation edge cases, shared resource isolation.
**INVESTIGATION ONLY — No code changes.**

---

## EXECUTIVE SUMMARY

**Severity: CRITICAL.** The multi-tenant isolation model has significant gaps. The auth middleware (`get_current_user_with_tenant`) is correctly implemented in 5 route files, but 27+ route files use `get_current_user` with no tenant enforcement. Cross-tenant access to credentials, users, roles, permissions, governance, and execution data is possible. Immediate remediation required before any multi-tenant production deployment.

---

## 1. AUTH ARCHITECTURE

### `get_current_user` (dependencies.py:6)
* Decodes JWT, returns full payload. **No tenant enforcement.**
* Any authenticated user can call these routes regardless of tenant context.

### `get_current_user_with_tenant` (dependencies.py:27)
* Decodes JWT, **raises 403 if `tenant_id` is missing/None**.
* Returns payload (including `tenant_id`) for downstream use.

### `require_permissions(...)` (rbac.py:7)
* Built on `get_current_user` (not `get_current_user_with_tenant`).
* Checks `platform.user_roles` + `platform.role_permissions` + `platform.permissions` — **NO tenant scoping** on the RBAC query.
* Returns `current_user` dict; the calling route must use `current_user.get("tenant_id")` to scope data.

### `require_admin` (rbac.py:67)
* Built on `get_current_user`. Checks `roles` list from JWT for "Super Admin". **No tenant enforcement.**

---

## 2. ROUTE-LEVEL TENANT ENFORCEMENT

### Routes WITH Tenant Enforcement (5 files)

| Route File | Dep Used | Status |
|---|---|---|
| `system_routes.py` | `get_current_user_with_tenant` | ✅ GOOD — all CRUD ops extract `tenant_id` |
| `diagnostics_routes.py` | `get_current_user_with_tenant` | ✅ GOOD — `_resolve_tenant` helper |
| `discovery_routes.py` | `get_current_user_with_tenant` | ⚠️ PARTIAL — `all_tenants=True` bypass exists |
| `mapping_routes.py` (lines 1-230) | `get_current_user_with_tenant` | ⚠️ PARTIAL — async routes (231-308) have NO auth |
| `validation_report_routes.py` (dashboard only) | `get_current_user_with_tenant` | ⚠️ PARTIAL — other endpoints use `get_current_user` |

### Routes WITHOUT Tenant Enforcement (27+ files)

| Route File | Dep Used | Tenant Isolation | Impact |
|---|---|---|---|
| `approval_routes.py` | `require_permissions(...)` | Weak — tenant from JWT to service | Cross-tenant approvals possible |
| `calendar_routes.py` | `require_permissions(...)` | Weak — tenant from JWT to service | Cross-tenant calendar events |
| `notification_routes.py` | `require_permissions(...)` | None — user-scoped only | Cross-tenant notifications |
| `task_routes.py` | `require_permissions(...)` | Weak — tenant from JWT to service | Cross-tenant tasks |
| `workflow_routes.py` | `get_current_user` | Weak — tenant from JWT to service | Cross-tenant workflows |
| **`control_routes.py`** | `get_current_user` | **NONE** — tenant_id is optional query param | Cross-tenant controls |
| **`control_dependencies_routes.py`** | `get_current_user` | **NONE** | Cross-tenant dependencies |
| **`credential_routes.py`** | `get_current_user` | **NONE** — CRITICAL | Cross-tenant credentials |
| **`dashboard_routes.py`** | `_require_admin` | **NONE** — tenant_id optional | Cross-tenant dashboard |
| **`execution_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant executions |
| **`execution_control_routes.py`** | `get_current_user` | **NONE** | Cross-tenant batch control |
| **`execution_history_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant execution history |
| **`export_routes.py`** | `get_current_user` | **NONE** | Cross-tenant batch export |
| **`governance_routes.py`** | `_require_admin` | **NONE** | Cross-tenant governance |
| `lead_routes.py` | `get_current_user` (list only) | **NONE** — leads table has no tenant_id | All admins see all leads |
| **`migration_dataset_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant datasets |
| **`migration_project_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant projects |
| **`migration_timeline_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant timelines |
| **`monitoring_routes.py`** | `_require_admin` | **NONE** | Cross-tenant monitoring |
| **`operations_execution_routes.py`** | `get_current_user` | **NONE** — tenant_id from request body | Cross-tenant operations |
| **`permissions_routes.py`** | `get_current_user` | **NONE** — CRITICAL | Cross-tenant permissions |
| **`report_suite_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant reports |
| **`role_routes.py`** | `get_current_user` | **NONE** — CRITICAL | Cross-tenant roles |
| **`rule_discovery_routes.py`** | `get_current_user` | **NONE** | Cross-tenant rules |
| **`rule_execution_routes.py`** | `get_current_user` | **NONE** | Cross-tenant rule execution |
| **`rule_registry_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant rule registry |
| **`schedule_routes.py`** | `get_current_user` | **NONE** — tenant_id optional | Cross-tenant schedules |
| **`settings_routes.py`** | `get_current_user` | **NONE** | Cross-tenant settings |
| **`user_routes.py`** | `get_current_user` | **NONE** — CRITICAL | Cross-tenant user CRUD |
| `navigation_routes.py` | None | N/A — hardcoded mock data | No impact |

---

## 3. REPOSITORY-LEVEL TENANT FILTERING

### Repositories WITH Tenant Filtering

| Repository | Filtering | Notes |
|---|---|---|
| `system_repository.py` | `get_all` and `get_by_id` filter by tenant_id IF provided | `update`, `delete`, `insert` do NOT filter by tenant |
| `diagnostics_repository.py` | `get_all_systems_summary` and `get_health_counts` filter by tenant_id via JOIN | `get_latest_by_system`, `get_history_by_system` do NOT filter by tenant |
| `discovery_repository.py` | `get_summary`, `get_tree`, `get_tables` filter by tenant_id IF provided | `soft_delete_all_discovery` can delete across all tenants |

### Repositories WITHOUT Tenant Filtering

| Repository | Issue | Severity |
|---|---|---|
| **`credential_repository.py`** | **ZERO tenant filtering** on any operation — `get_by_system_id`, `insert`, `update`, `delete`, `get_all` | **CRITICAL** |

---

## 4. PLATFORM TABLES — TENANT SCOPING

| Table | Has `tenant_id`? | Enforced in Code? |
|---|---|---|
| `platform.users` | YES | FK exists but queries don't filter by it |
| `platform.roles` | YES | `role_routes.py` doesn't filter by it |
| `platform.permissions` | **NO** | Global — any user can see all permissions |
| `platform.role_permissions` | **NO** | Global — any user can see/modify all mappings |
| `platform.user_roles` | **NO** | Queried only by `user_id` |
| `platform.notifications` | **NO** | Filtered only by `user_id` |
| `platform.system_settings` | **NO** | Global — shared across all tenants |
| `platform.feature_flags` | **NO** | Global — shared across all tenants |
| `core.role_permissions` | **NO** | Global — shared across all tenants |
| `core.leads` | **NO** | Leads are inherently global |

---

## 5. CRITICAL FINDINGS

| # | Finding | Severity | Location | Impact |
|---|---|---|---|---|
| 1 | `CredentialRepository` — zero tenant filtering on credentials | **CRITICAL** | `credential_repository.py` | Any user can read/modify/delete any tenant's database credentials |
| 2 | `user_routes.py` — cross-tenant user CRUD | **CRITICAL** | `user_routes.py` | Any user can list/create/update/delete ANY user across ALL tenants |
| 3 | `role_routes.py` / `permissions_routes.py` — cross-tenant role/permission management | **CRITICAL** | `role_routes.py`, `permissions_routes.py` | Any user can grant themselves Super Admin |
| 4 | `operations_execution_routes.py` — tenant_id from user-supplied request body, not JWT | **HIGH** | `operations_execution_routes.py:19` | User from Tenant A can trigger operations for Tenant B |
| 5 | `mapping_routes.py` lines 231-308 — **NO auth at all** on 6 endpoints | **HIGH** | `mapping_routes.py` | Anyone can read/create/update/delete mappings |
| 6 | `control_routes.py` — no tenant filtering on controls | **HIGH** | `control_routes.py` | Any user can view/modify/create/delete controls for any project/tenant |
| 7 | `governance_routes.py` — admin-only but no tenant filtering | **HIGH** | `governance_routes.py` | Admin from Tenant A sees audit/approvals/exceptions for ALL tenants |
| 8 | `execution_control_routes.py` — no tenant filtering | **HIGH** | `execution_control_routes.py` | User from Tenant A can cancel/pause/resume Tenant B's batches |
| 9 | `export_routes.py` — cross-tenant batch export | **HIGH** | `export_routes.py` | User from Tenant A can export Tenant B's execution data |
| 10 | `all_tenants=true` bypass available to any user | **MEDIUM** | `discovery_routes.py`, `mapping_routes.py` | Any user can bypass tenant filtering |
| 11 | `core.leads` has no `tenant_id` — leads are inherently global | **MEDIUM** | `lead_routes.py` | All admins see all leads |
| 12 | `platform.permissions`, `core.role_permissions` — global (no tenant scoping) | **MEDIUM** | Schema | Permission changes affect all tenants |
| 13 | `tenant_id` query param not validated against JWT tenant — impersonation possible | **MEDIUM** | Multiple routes | User can supply different tenant_id to access other tenants' data |
| 14 | `system_registry` DDL missing `tenant_id` column | **LOW** | DDL vs code mismatch | Potential runtime SQL error |

---

## 6. EDGE CASES

### 6.1 JWT with no `tenant_id`
* `get_current_user_with_tenant`: **Returns 403** — correct
* `get_current_user`: **Returns payload with `tenant_id=None`** — no error raised
* Routes using `get_current_user` + optional query param: tenant_id defaults to `None`, service returns all data

### 6.2 `tenant_id` as user-supplied query param
* Many routes accept `tenant_id` as an **optional Query parameter**
* A user from Tenant A can pass `tenant_id=<Tenant_B_UUID>` and access Tenant B's data
* **Object-level access control vulnerability** — tenant_id from JWT is not cross-validated

### 6.3 `all_tenants` bypass
* `discovery_routes.py` and `mapping_routes.py` have `all_tenants: bool = Query(False)`
* If `all_tenants=True`, the `_resolve_tenant` returns `None`, bypassing tenant filtering
* **Any user** (not just admins) can pass `all_tenants=true`

### 6.4 `system_registry` DDL vs Code Mismatch
* DDL shows `core.system_registry` WITHOUT `tenant_id` column
* Code references `tenant_id` column
* Implies `tenant_id` was added via migration but not in the dump

---

## 7. REMEDIATION PROPOSAL

### P0 — Critical (must fix before any multi-tenant deployment)
1. Add `get_current_user_with_tenant` to `credential_routes.py` — all credential operations must be tenant-scoped
2. Add `get_current_user_with_tenant` to `user_routes.py` — user CRUD must be tenant-scoped
3. Add `get_current_user_with_tenant` to `role_routes.py` and `permissions_routes.py` — role/permission management must be tenant-scoped
4. Add `get_current_user_with_tenant` to `mapping_routes.py` lines 231-308 — add auth dependency to unprotected routes
5. Add tenant_id filtering to `CredentialRepository` — all queries must include `WHERE tenant_id = %s`

### P1 — High (should fix before production)
6. Add `get_current_user_with_tenant` to `control_routes.py` — controls must be tenant-scoped
7. Add `get_current_user_with_tenant` to `execution_control_routes.py` — batch operations must be tenant-scoped
8. Add `get_current_user_with_tenant` to `export_routes.py` — exports must be tenant-scoped
9. Add `get_current_user_with_tenant` to `governance_routes.py` — governance must be tenant-scoped (admin-only is not enough)
10. Validate `tenant_id` from request body/JWT against query params — prevent impersonation

### P2 — Medium (should fix before scale)
11. Remove `all_tenants=true` bypass or restrict to Super Admin only
12. Add `tenant_id` to `core.leads` — leads should be tenant-scoped
13. Consider adding `tenant_id` to `platform.permissions` and `core.role_permissions` for full isolation
14. Validate `tenant_id` in `operations_execution_routes.py` against JWT

### Future
15. Automated cross-tenant API test suite (CI pipeline)
16. Tenant isolation middleware that auto-injects tenant_id from JWT (eliminate manual extraction)

---

## 8. TEST PLAN (For Future Implementation)

1. Create two tenants (A, B) with two users
2. User A creates a system, batch, control
3. Attempt to access User A's resources as User B — expect 403
4. Attempt to access User A's credentials as User B — expect 403
5. Attempt to modify User A's roles as User B — expect 403
6. Attempt to use `all_tenants=true` as non-admin — expect 403
7. Attempt to pass `tenant_id=<Tenant_B>` as query param as User A — expect 403
8. Verify `GET /health` still works without auth

---

## 9. FILES INSPECTED

* `app/api/core/auth/dependencies.py` — `get_current_user`, `get_current_user_with_tenant`
* `app/api/core/auth/rbac.py` — `require_permissions`, `require_admin`
* `app/api/core/auth/tenant_middleware.py` — tenant middleware
* `app/api/routes/*` (34 files) — all route-level auth dependencies
* `app/db/repositories/system_repository.py` — tenant filtering
* `app/db/repositories/diagnostics_repository.py` — tenant filtering
* `app/db/repositories/discovery_repository.py` — tenant filtering
* `app/db/repositories/credential_repository.py` — **NO tenant filtering**
* `app/api/routes/credential_routes.py` — **NO tenant enforcement**
* `app/api/routes/user_routes.py` — **NO tenant enforcement**
* `app/api/routes/role_routes.py` — **NO tenant enforcement**
* `app/api/routes/permissions_routes.py` — **NO tenant enforcement**
* `app/api/routes/governance_routes.py` — admin-only, no tenant enforcement
* `app/api/routes/control_routes.py` — optional tenant_id
* `app/api/routes/execution_routes.py` — optional tenant_id
* `app/api/routes/execution_control_routes.py` — no tenant enforcement
* `app/api/routes/export_routes.py` — no tenant enforcement
* `app/api/routes/mapping_routes.py` — partial (unprotected async routes)
* `app/api/routes/operations_execution_routes.py` — tenant_id from request body
* `app/api/routes/discovery_routes.py` — all_tenants bypass
* `engineering/MAP_V3/02_output/00_MAP_V3_Control/OC-SEC-006_MultiTenant_Isolation_Audit.md` — scope doc

---

## 10. STATUS

**INVESTIGATION COMPLETE** — No code changes made. Findings and remediation proposal returned for CHATGPT review → approval before any implementation.
