# OC-SEC-006 — Multi-Tenant Isolation Deep Audit
**WORK PACKAGE:** OC-SEC-006 | **ID:** OC-SEC-006 | **DATE:** 2026-09-07 | **MAP VERSION:** MAP_V3
**OBJECTIVE:** Comprehensive audit of multi-tenant isolation — object-level access control, cross-tenant API testing, tenant isolation edge cases, shared resource isolation.
**CREATED FROM:** OC-SEC-002 revised assessment (finding 8).

---

## SCOPE

### Object-Level Access Control
* Test all 34 API routes for tenant-level authorization
* Verify no cross-tenant data leakage via API
* Test batch/governance routes for tenant isolation
* Test system credentials isolation

### Cross-Tenant API Testing
* User A (tenant X) accessing User B (tenant Y) resources
* Shared batch IDs, control IDs, mapping IDs across tenants
* Governance decisions scoped correctly per tenant

### Tenant Isolation Edge Cases
* `core.leads` (no `tenant_id`) — public data isolation
* `platform.*` tables — cross-tenant admin access
* Shared system connections (if any)
* `discovery_repository` FK relationships across tenants

### Shared Resource Isolation
* Database connection pool isolation (if any)
* File system / temp file isolation
* Cache isolation (if any)
* Rate limit isolation (per-tenant vs per-IP)

---

## FILES TO INSPECT
* `app/api/routes/*` (34 files) — all `Depends(get_current_user_with_tenant)` usage
* `app/db/repositories/*` (5 files) — `WHERE tenant_id = %s` usage
* `app/api/routes/system_routes.py` — system CRUD tenant isolation
* `app/api/routes/batch_routes.py` — batch operations tenant isolation
* `app/api/routes/governance_routes.py` — governance decisions tenant isolation
* `app/api/routes/diagnostics_routes.py` — diagnostics tenant isolation
* `app/services/discovery_service.py` — discovery tenant isolation

---

## PROPOSED CHANGES (P1)
1. Create automated cross-tenant test suite
2. Add `tenant_id` enforcement middleware for all routes
3. Test all repository queries for tenant filtering
4. Verify `platform.*` tables (roles, permissions) are global but `core.*` is tenant-scoped
5. Document tenant isolation model

---

## DEPENDENCIES
* OC-SEC-005 (auth architecture) should be reviewed first (auth context feeds tenant)

---

## STATUS:** NOT STARTED — Awaiting approval.
