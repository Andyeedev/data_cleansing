# OC-SEC-006B — Evidence Report

**Date:** 2026-09-07
**Status:** COMPLETE
**Tests:** 19/19 passing

---

## What Was Done

Replaced `get_current_user` with `get_current_user_with_tenant` across all User/RBAC routes and services, ensuring every query is scoped to the JWT's `tenant_id`.

## Files Modified

| File | Change |
|------|--------|
| `app/services/user_service.py` | Added `tenant_id` param to all 8 methods (list, get, create, update, delete, assign_role, remove_role, get_user_roles). Replaced `secrets.token_uuid()` with `str(uuid.uuid4())`. |
| `app/services/role_service.py` | Added `tenant_id` param to all 10 methods (list, get, create, update, delete, assign_permission, remove_permission, get_role_permissions, list_all_permissions). Replaced `secrets.token_uuid()` with `str(uuid.uuid4())`. |
| `app/api/routes/user_routes.py` | All 8 endpoints use `get_current_user_with_tenant`. Tenant_id extracted from JWT, passed to service. Removed `tenant_id` from `UserCreateRequest` body. |
| `app/api/routes/role_routes.py` | All 10 endpoints use `get_current_user_with_tenant`. Tenant_id extracted from JWT, passed to service. |
| `app/api/core/auth/rbac.py` | `require_permissions`, `require_role`, `require_admin` all scope SQL by `r.tenant_id = %s` from JWT. |
| `tests/test_user_rbac_isolation.py` | NEW — 19 tests covering route auth, service tenant filtering, cross-tenant denial, RBAC scoping. |

## Test Results

```
tests/test_user_rbac_isolation.py — 19 passed
tests/test_credential_isolation.py — 20 passed
Total: 39/39 passing
```

## Verification

- **Route auth:** All `user_routes.py` and `role_routes.py` endpoints use `get_current_user_with_tenant` (not `get_current_user`).
- **Service filtering:** Every SQL query in `UserService` and `RoleService` includes `WHERE ... AND tenant_id = %s` when tenant_id is provided.
- **Cross-tenant denial:** `get_user`, `get_role`, `delete_user`, `delete_role`, `update_role` return `{"success": false}` when tenant_id doesn't match.
- **RBAC scoping:** `rbac.py` permissions and role checks include `r.tenant_id = %s` from JWT, not request body.
- **No body tenant_id:** `UserCreateRequest` no longer accepts `tenant_id` — it comes from JWT only.

## What Was NOT Changed

- `core.leads` table (no tenant_id column — OC-SEC-006D scope)
- `platform.permissions` (GLOBAL catalogue — not tenant-scoped by design)
- Other service files (mapping, governance, export, etc.) — OC-SEC-006C scope
