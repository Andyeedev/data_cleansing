# OC-COM-001a — Evidence Report

**Date:** 2026-09-07
**Status:** COMPLETE
**Commit:** pending

---

## 1. What Was Done

### 1.1 SQL Migration

Created `migrations/OC-COM-001a_commercial_schema.sql`:

| Table | Action | Columns |
|-------|--------|---------|
| `platform.plans` | NEW | plan_id, name, tier, monthly_price, annual_price, entitlements, max_users, max_projects, max_connections, status, description, timestamps |
| `platform.subscriptions` | NEW | subscription_id, tenant_id (FK), plan_id (FK), status, start_date, end_date, billing_cycle, trial_end_date, timestamps, created_by |
| `core.tenants` | ALTER | Added plan_id, billing_email, max_users, max_projects, max_connections, metadata, updated_at |

**Seed data:** 3 plans inserted (Professional £25k/yr, Enterprise £75k/yr, Enterprise Plus £200k/yr)

**Note:** `core.tenants.tenant_id` was already UUID (not VARCHAR(100) as original assessment stated). No type migration needed.

### 1.2 Tenant Repository

Created `app/db/repositories/tenant_repository.py` — 12 methods:

| Method | Purpose |
|--------|---------|
| `create_tenant` | Insert tenant with UUID |
| `get_tenant` | Get tenant by ID |
| `list_tenants` | Paginated tenant list |
| `update_tenant` | Update tenant fields |
| `get_plan` | Get plan by ID |
| `get_plan_by_tier` | Get active plan by tier name |
| `list_plans` | List all plans |
| `create_subscription` | Create active subscription |
| `create_trial_subscription` | Create 30-day trial |
| `get_active_subscription` | Get current subscription + plan details |
| `list_subscriptions` | List all subscriptions for tenant |
| `cancel_subscription` | Cancel active/trialing subscription |

### 1.3 Tenant Service

Created `app/services/tenant_service.py` — 7 methods:

| Method | Purpose |
|--------|---------|
| `create_tenant` | Provision tenant + admin user + trial subscription |
| `get_tenant` | Get tenant with subscription details |
| `list_tenants` | Paginated tenant list |
| `update_tenant` | Update tenant fields |
| `get_subscription` | Get current subscription |
| `change_subscription` | Cancel old + create new + update tenant limits |
| `list_plans` | List active plans |
| `get_tenant_context` | Get tenant context for middleware |

### 1.4 Tenant Routes

Created `app/api/routes/tenant_routes.py` — 7 endpoints:

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/tenants` | require_admin | Create tenant + admin + trial |
| GET | `/api/v1/tenants` | require_admin | List tenants |
| GET | `/api/v1/tenants/plans` | get_current_user | List plans |
| GET | `/api/v1/tenants/{id}` | get_current_user_with_tenant | Get tenant |
| PUT | `/api/v1/tenants/{id}` | require_admin | Update tenant |
| GET | `/api/v1/tenants/{id}/subscription` | get_current_user_with_tenant | Get subscription |
| POST | `/api/v1/tenants/{id}/subscription` | require_admin | Change subscription |

**Security:** All endpoints enforce tenant_id from JWT. Cross-tenant access blocked.

### 1.5 Tenant Middleware Enhanced

Updated `app/api/core/middleware/tenant_middleware.py`:

- Validates tenant exists in database
- Blocks suspended/cancelled tenants (403)
- Returns 404 for non-existent tenants
- Supports `X-Tenant-ID` header fallback
- Supports `tenant_id` query param fallback
- Skips validation for health check paths

### 1.6 System Repository Enforced

Updated `app/db/repositories/system_repository.py`:

- `get_all(tenant_id)` — now required, raises `ValueError` if None
- `get_by_id(system_id, tenant_id)` — now required, raises `ValueError` if None
- All existing callers already pass tenant_id — no breakage

### 1.7 Routes Registered

Added `tenant_routes` to `app/api/main.py` imports and router registration.

---

## 2. Files Changed

| File | Change |
|------|--------|
| `engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql` | NEW |
| `app/db/repositories/tenant_repository.py` | NEW |
| `app/services/tenant_service.py` | NEW |
| `app/api/routes/tenant_routes.py` | NEW |
| `app/api/core/middleware/tenant_middleware.py` | MODIFIED |
| `app/db/repositories/system_repository.py` | MODIFIED |
| `app/api/main.py` | MODIFIED |
| `tests/test_commercial_schema.py` | NEW |

---

## 3. Test Results

| Test Suite | Tests | Status |
|------------|-------|--------|
| test_commercial_schema.py | 46 | ALL PASS |
| test_auth_hardening.py | 22 | ALL PASS |
| test_credential_isolation.py | 20 | ALL PASS |
| test_user_rbac_isolation.py | 19 | ALL PASS |
| test_operational_routes_isolation.py | 13 | ALL PASS |
| test_edge_cases_isolation.py | 11 | ALL PASS |
| **Total** | **131** | **ALL PASS** |

---

## 4. Database Changes

**Requires manual execution of migration SQL against target database.**

```bash
psql -d <database> -f engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001a_commercial_schema.sql
```

---

## 5. Open Questions (Deferred)

| Question | Default | Notes |
|----------|---------|-------|
| Grace period for tenant_id enforcement | 30 days | Middleware enforces immediately on new routes |
| Trial subscription duration | 30 days | Configurable per tenant |
| POST /tenants auth | require_admin | Initial setup requires existing admin |
