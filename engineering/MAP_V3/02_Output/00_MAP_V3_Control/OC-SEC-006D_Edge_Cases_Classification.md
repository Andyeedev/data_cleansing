# OC-SEC-006D — Edge Cases & Final Isolation Model Classification

**Date:** 2026-09-07
**Status:** IN PROGRESS
**Scope:** all_tenants bypass, leads tenant_id, query param impersonation, remaining get_current_user routes, final isolation model

---

## Edge Case 1: `all_tenants=true` Bypass

**Risk:** CRITICAL — Any authenticated user can pass `all_tenants=true` and query ALL tenants' data.

**Affected routes:**
- `mapping_routes.py` — 5 routes (summary, schema, columns, auto-map, columns/all)
- `discovery_routes.py` — 3 routes (summary, tree, tables)

**Current behavior:** `_resolve_tenant()` returns `None` when `all_tenants=True`, causing queries to return ALL tenants' data.

**Fix:** Restrict `all_tenants=True` to Super Admin role only. Non-admin users get 403 if they pass `all_tenants=True`.

---

## Edge Case 2: Query Param `tenant_id` Override (Impersonation)

**Risk:** HIGH — A user from Tenant A can pass `?tenant_id=Tenant-B-UUID` and query Tenant B's data.

**Affected routes:** 30+ routes across mapping, discovery, diagnostics, dashboard, operations, etc.

**Current behavior:** `_resolve_tenant()` uses `tenant_id or current_user.get("tenant_id")` — query param overrides JWT.

**Fix:** Validate that query param `tenant_id` matches JWT `tenant_id`. Super Admin may override.

---

## Edge Case 3: `leads` GET Without Tenant Auth

**Risk:** MEDIUM — `GET /leads` uses `get_current_user` (not `get_current_user_with_tenant`).

**Current behavior:** Admin check uses local role substring match, not tenant-scoped.

**Fix:** Update to `get_current_user_with_tenant`.

---

## Edge Case 4: Remaining `get_current_user` Routes

**Risk:** MEDIUM — 14+ route files still use `get_current_user` (no tenant enforcement).

**Files identified:**
- `validation_report_routes.py` — 5 routes
- `dashboard_routes.py` — uses local `_require_admin`
- `permissions_routes.py` — 5 routes
- `approval_routes.py`, `calendar_routes.py`, `workflow_routes.py`, `report_suite_routes.py`, `execution_routes.py`, `schedule_routes.py`, `notification_routes.py`, `task_routes.py`, `execution_history_routes.py`, `monitoring_routes.py`, `rule_registry_routes.py`, `settings_routes.py`, `migration_*_routes.py`, `control_dependencies_routes.py`, `rule_*.py`

**Fix (006D scope):** Update `validation_report_routes.py`, `dashboard_routes.py`, `permissions_routes.py`, `lead_routes.py` to `get_current_user_with_tenant`. Remaining files deferred (document in final isolation model).

---

## Implementation Plan

1. Update `_resolve_tenant` in mapping_routes.py and discovery_routes.py to restrict `all_tenants` to Super Admin
2. Add tenant_id validation helper: `_validate_tenant_override(query_tenant, jwt_tenant, current_user)`
3. Update lead_routes.py GET to `get_current_user_with_tenant`
4. Update permissions_routes.py to `get_current_user_with_tenant`
5. Update dashboard_routes.py to use `rbac.require_admin`
6. Update validation_report_routes.py remaining routes to `get_current_user_with_tenant`
7. Write tests, evidence report, final isolation model doc
