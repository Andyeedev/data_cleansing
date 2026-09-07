# OC-SEC-006D — Evidence Report

**Date:** 2026-09-07
**Status:** COMPLETE
**Tests:** 11/11 passing (63/63 combined with 006A+006B+006C)

---

## What Was Done

Fixed 4 edge cases: `all_tenants` bypass restricted to Super Admin, query param `tenant_id` impersonation blocked, leads/permissions/dashboard/validation_report routes updated to tenant-scoped auth. Produced final multi-tenant isolation model.

## Files Modified

| File | Change |
|------|--------|
| `app/api/routes/mapping_routes.py` | `_resolve_tenant` now requires Super Admin for `all_tenants=True`, validates query tenant_id matches JWT |
| `app/api/routes/discovery_routes.py` | Same `_resolve_tenant` fix as mapping |
| `app/api/routes/lead_routes.py` | GET now uses `get_current_user_with_tenant` |
| `app/api/routes/permissions_routes.py` | All 5 routes now use `get_current_user_with_tenant` |
| `app/api/routes/dashboard_routes.py` | Replaced local `_require_admin` with `rbac.require_admin` |
| `app/api/routes/validation_report_routes.py` | 5 routes updated to `get_current_user_with_tenant` |
| `tests/test_edge_cases_isolation.py` | NEW — 11 tests |

## Test Results

```
tests/test_edge_cases_isolation.py — 11 passed
tests/test_operational_routes_isolation.py — 13 passed
tests/test_user_rbac_isolation.py — 19 passed
tests/test_credential_isolation.py — 20 passed
Total: 63/63 passing
```

## Verification

- **all_tenants bypass:** Both `_resolve_tenant` helpers raise 403 if `all_tenants=True` and user is not Super Admin
- **Query param impersonation:** Both `_resolve_tenant` helpers raise 403 if query tenant_id != JWT tenant_id (unless Super Admin)
- **leads GET:** Uses `get_current_user_with_tenant`
- **permissions_routes:** All 5 routes use `get_current_user_with_tenant`
- **dashboard_routes:** Uses `rbac.require_admin` (tenant-scoped), no local `_require_admin`
- **validation_report_routes:** All routes use `get_current_user_with_tenant`

## What 006D Does NOT Change

- Remaining 14+ route files still using `get_current_user` (documented in final isolation model as deferred)
- Service-layer batch-to-tenant JOIN validation (requires DB schema changes)
- `core.leads` table (no tenant_id column — public website leads by design)
