# OC-SEC-006C — Evidence Report

**Date:** 2026-09-07
**Status:** COMPLETE
**Tests:** 13/13 passing (52/52 combined with 006A+006B)

---

## What Was Done

Replaced `get_current_user` with `get_current_user_with_tenant` across 6 operational route files (33 routes total). Fixed 9 completely unauthenticated legacy mapping routes. Replaced local `_require_admin` with `rbac.require_admin` in governance. Enforced tenant_id match on operations run creation.

## Files Modified

| File | Routes | Change |
|------|--------|--------|
| `app/api/routes/mapping_routes.py` | 9 legacy | Added `get_current_user_with_tenant` to all 9 unauthenticated legacy async routes (lines 231-308) |
| `app/api/routes/control_routes.py` | 6 | Replaced `get_current_user` → `get_current_user_with_tenant` |
| `app/api/routes/execution_control_routes.py` | 6 | Replaced `get_current_user` → `get_current_user_with_tenant` |
| `app/api/routes/governance_routes.py` | 4 | Replaced local `_require_admin` → `rbac.require_admin` |
| `app/api/routes/export_routes.py` | 2 | Replaced `get_current_user` → `get_current_user_with_tenant` |
| `app/api/routes/operations_execution_routes.py` | 6 | Replaced `get_current_user` → `get_current_user_with_tenant` + enforce body.tenant_id == JWT + default tenant_id from JWT |
| `tests/test_operational_routes_isolation.py` | — | NEW — 13 tests |

## Test Results

```
tests/test_operational_routes_isolation.py — 13 passed
tests/test_user_rbac_isolation.py — 19 passed
tests/test_credential_isolation.py — 20 passed
Total: 52/52 passing
```

## Verification

- **All 6 route files** import and use `get_current_user_with_tenant` (no bare `get_current_user` remains)
- **mapping_routes.py:** 9 legacy routes that previously had zero authentication now require JWT + tenant
- **governance_routes.py:** Local `_require_admin` removed, replaced with `rbac.require_admin` (tenant-scoped)
- **operations_execution_routes.py:** `start_run` enforces `body.tenant_id == current_user.tenant_id`, `get_run_history` and `status-breakdown` default tenant_id from JWT

## What Was NOT Changed

- Service-layer batch-to-tenant validation (006D scope)
- `all_tenants` query param bypass (006D scope)
- `control_service.py` / `control_repository.py` — controls are GLOBAL-PLATFORM, no tenant filtering needed
- `governance_service.py` — governance data is cross-tenant
- `export_service.py` — export queries by batch_id, tenant validation is 006D
