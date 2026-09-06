# OC-COM-001a — Tenant Model, Subscription, Plans & Middleware (Backend Infrastructure)
**WORK PACKAGE:** OC-COM-001a | **ID:** OC-COM-001a | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**PARENT:** OC-COM-001 (split from Subscription, Charges & Tenant Assessment)
**OBJECTIVE:** Fix tenant model, create subscription and plans tables, add tenant middleware — backend infrastructure only, no billing/Stripe.

**FILES / SYSTEMS / POLICIES INSPECTED:**
* `OC-COM-001_Subscription_Charges_Tenant_Assessment.md` — parent report, 9 gaps identified
* `docs/setups/installer/install_governance_tables.sql` — `core.tenants` (`tenant_id VARCHAR(100)` PK, `tenant_name`, `created_timestamp`)
* `MAP_V2/03_Source/database/create_platform_schema.sql` — `platform.users/roles/tasks/workflows/approvals/calendar` all `tenant_id UUID` FK to `core.tenants`
* `app/db/repositories/system_repository.py` — `get_all(tenant_id=None)` returns all when None
* `app/api/main.py` — route registration pattern
* `app/middleware/tenant_middleware.py` — does NOT exist yet
* `engineering/MAP_V1/2.4 - CG-03 Pricing & Revenue Model.md` — three tiers: Professional £25k-£50k, Enterprise £75k-£150k, Enterprise Plus £200k+

**EXISTING IMPLEMENTATION:**
* `core.tenants` exists — 3 columns, `tenant_id VARCHAR(100)` PK — no status, no plan, no billing fields
* Platform tables all have `tenant_id UUID` with FK to `core.tenants` — **type mismatch** (VARCHAR vs UUID)
* `system_repository.get_all(tenant_id=None)` — returns all data, no enforcement
* No `platform.plans` table
* No `platform.subscriptions` table
* No tenant middleware
* No tenant provisioning API
* `useTenants.ts` fetches `GET /rules/tenants` — works but no subscription context

**PROPOSED CHANGES:**

### 1. Align Tenant ID Type
* `sql/schema/14_tenant_id_alignment.sql` (new):
  * Add `core.tenants.id UUID DEFAULT gen_random_uuid()` column
  * Backfill from existing `tenant_id` where possible (generate UUID for string values)
  * Drop old `VARCHAR(100)` column, rename `id` → `tenant_id`
  * Update all FK references

### 2. Create Plans Table
* `sql/schema/15_commercial_schema.sql` (new):
  * `platform.plans` (plan_id UUID PK, name VARCHAR(100), tier VARCHAR(50) CHECK (tier IN ('professional','enterprise','enterprise_plus','government','msp','oem','foundation')), monthly_price NUMERIC(10,2), annual_price NUMERIC(10,2), entitlements JSONB DEFAULT '{}', max_users INTEGER, max_projects INTEGER, max_connections INTEGER, status VARCHAR(50) DEFAULT 'active', description TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
  * Seed 3 default plans: Professional (£25k/yr), Enterprise (£75k/yr), Enterprise Plus (£200k/yr)

### 3. Create Subscriptions Table
* Same file `15_commercial_schema.sql`:
  * `platform.subscriptions` (subscription_id UUID PK, tenant_id UUID FK REFERENCES core.tenants(id), plan_id UUID FK REFERENCES platform.plans(plan_id), status VARCHAR(50) CHECK (status IN ('active','trialing','suspended','cancelled','expired','pending')), start_date DATE, end_date DATE, billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly','annual','one_off')), trial_end_date DATE, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ, created_by UUID)
  * `platform.subscriptions` index on `tenant_id` and `status`

### 4. Extend core.tenants
* Same file `15_commercial_schema.sql`:
  * ALTER `core.tenants` ADD: `status VARCHAR(50) DEFAULT 'active'`, `plan_id UUID REFERENCES platform.plans(plan_id)`, `billing_email VARCHAR(255)`, `max_users INTEGER DEFAULT 5`, `max_projects INTEGER DEFAULT 3`, `max_connections INTEGER DEFAULT 5`, `metadata JSONB DEFAULT '{}'`, `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ`

### 5. Create Tenant Middleware
* `app/middleware/tenant_middleware.py` (new):
  * FastAPI dependency that extracts `tenant_id` from query param, header (`X-Tenant-ID`), or JWT claim
  * Validates tenant exists and is active
  * Returns `TenantContext` object with `tenant_id`, `plan_id`, `status`
  * Blocks request if tenant is suspended/cancelled
  * Logs cross-tenant access attempts

### 6. Create Tenant Routes
* `app/api/routes/tenant_routes.py` (new):
  * `POST /tenants` — create tenant + admin user + trial subscription
  * `GET /tenants` — list tenants (admin only)
  * `GET /tenants/{tenant_id}` — get tenant details + current subscription
  * `PUT /tenants/{tenant_id}` — update tenant
  * `GET /tenants/{tenant_id}/subscription` — get current subscription + plan details
  * `POST /tenants/{tenant_id}/subscription` — create/change subscription

### 7. Create Tenant Service + Repository
* `app/services/tenant_service.py` (new) — provisioning logic (create tenant → create admin → assign plan → create subscription)
* `app/db/repositories/tenant_repository.py` (new) — tenant + subscription queries

### 8. Enforce Tenant on Existing Repositories
* `app/db/repositories/system_repository.py` — change `get_all(tenant_id=None)` to `get_all(tenant_id)` (required, not optional)
* All other repositories with `tenant_id` parameter — make required

**FILES EXPECTED TO CHANGE:**
* `sql/schema/14_tenant_id_alignment.sql` (new)
* `sql/schema/15_commercial_schema.sql` (new)
* `MAP_V2/03_Source/database/create_platform_schema.sql` — add FK updates
* `app/middleware/tenant_middleware.py` (new)
* `app/api/routes/tenant_routes.py` (new)
* `app/api/main.py` — register tenant_routes
* `app/services/tenant_service.py` (new)
* `app/db/repositories/tenant_repository.py` (new)
* `app/db/repositories/system_repository.py` — enforce tenant_id required
* `seed_platform_data.sql` — add 3 default plans

**DATABASE CHANGES:**
* ALTER: `core.tenants` — VARCHAR→UUID migration, add 8 new columns
* NEW: `platform.plans` — 14 columns, 3 seed rows
* NEW: `platform.subscriptions` — 12 columns, indexes on tenant_id + status

**SECURITY IMPACT:**
* MEDIUM: Tenant middleware adds enforcement but must not break existing routes
* LOW: Trial subscription creation must validate plan exists

**BACKWARD COMPATIBILITY:**
* Tenant middleware must be optional on existing routes initially (grace period)
* `core.tenants` VARCHAR→UUID migration must be non-destructive
* Lead capture flow (`POST /api/v1/leads`) must remain unchanged

**TEST PLAN:**
* Verify `platform.plans` seeds 3 tiers with correct prices
* Verify `platform.subscriptions` links tenant to plan
* Verify tenant middleware blocks cross-tenant access
* Verify `system_repository.get_all(tenant_id)` requires tenant_id
* Verify tenant provisioning creates tenant + admin + trial subscription
* Verify existing routes still work without tenant_id during grace period
* Verify `useTenants.ts` still returns tenant list

**QUESTIONS:**
* Should the grace period for tenant_id enforcement be 7 days, 14 days, or 30 days?
* Should trial subscriptions be 14 days or 30 days?
* Should `POST /tenants` require admin authentication, or is this the initial setup endpoint (no auth)?

**STATUS:** REPORT — ready for CHATGPT REVIEW → APPROVAL before IMPLEMENTATION
