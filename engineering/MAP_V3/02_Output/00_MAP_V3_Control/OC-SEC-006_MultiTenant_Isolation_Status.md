# OC-SEC-006 — Multi-Tenant Isolation Deep Audit (Status)
**WORK PACKAGE:** OC-SEC-006 | **DATE:** 2026-09-07 | **MAP VERSION:** MAP_V3

---

## Overall Status

| Stage | Scope | Status | Commit | Tests |
|---|---|---|---|---|
| **OC-SEC-006A** | Credential cross-tenant isolation | ✅ APPROVED / COMPLETE | `5040e0a8` | 20/20 pass |
| **OC-SEC-006B** | User/RBAC cross-tenant isolation | ✅ COMPLETE | — | 19/19 pass |
| **OC-SEC-006C** | Operational routes (mapping, control, execution, governance, export) | ❌ NOT STARTED | — | — |
| **OC-SEC-006D** | Tenant edge cases (all_tenants, leads, query param validation) | ❌ NOT STARTED | — | — |

---

## OC-SEC-006A — COMPLETE

**Scope:** `credential_routes.py`, `credential_repository.py`, `credential_service.py`

**Outcome:**
- All credential queries now enforce tenant boundary via JOIN to `system_registry`
- `INSERT` uses `EXISTS` subquery to validate system belongs to tenant
- `UPDATE/DELETE` use subquery to validate credential belongs to tenant's systems
- Route auth changed from `get_current_user` → `get_current_user_with_tenant`
- No database schema changes
- 20 cross-tenant isolation tests pass

**Evidence:** `OC-SEC-006A_Evidence_Report.md`, `OC-SEC-006A_Credential_Isolation_Classification.md`

---

## OC-SEC-006B — COMPLETE

**Scope:** `user_routes.py`, `role_routes.py`, `rbac.py`, `user_service.py`, `role_service.py`

**Outcome:**
- All user and role queries enforce tenant boundary via `WHERE tenant_id = %s` in SQL
- Route auth changed from `get_current_user` → `get_current_user_with_tenant` on all user/role endpoints
- `rbac.py` (`require_permissions`, `require_role`, `require_admin`) scope by tenant from JWT
- `UserCreateRequest` no longer accepts `tenant_id` in body — JWT only
- `platform.permissions` classified as GLOBAL-PLATFORM (read-only catalogue, not tenant-scoped)
- Replaced `secrets.token_uuid()` with `str(uuid.uuid4())` for Python 3.13 compat
- 19 cross-tenant isolation tests pass

---

## OC-SEC-006C — NOT STARTED

**Scope:** `mapping_routes.py` (unprotected async), `control_routes.py`, `execution_control_routes.py`, `governance_routes.py`, `export_routes.py`, `operations_execution_routes.py`

---

## OC-SEC-006D — NOT STARTED

**Scope:** `all_tenants=true` bypass (restrict to Super Admin), `core.leads.tenant_id` investigation, query/body tenant_id validation, shared resources, final isolation model documentation
