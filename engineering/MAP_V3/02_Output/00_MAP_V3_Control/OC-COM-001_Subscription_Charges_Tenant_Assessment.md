# OC-COM-001 — Subscription, Charges & Tenant Assessment
**WORK PACKAGE:** OC-COM-001 | **ID:** OC-COM-001 | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**OBJECTIVE:** Assess commercial readiness — subscription model, pricing, charges, entitlements, tenant isolation, billing integration, and multi-tenancy posture — assessment only, no remediation yet.

**FILES / SYSTEMS / POLICIES INSPECTED:**
* `engineering/MAP_V1/2.4 - CG-03 Pricing & Revenue Model.md` (8711) — annual subscription £25k–£200k+, pilot £5k–£40k, SaaS future £1.5k–£10k+/mo
* `engineering/MAP_V1/2.1 - PC-04 - Product Canon – Book IV (Commercial).md` (8710) — product family: Foundation / Professional / Enterprise / Enterprise Plus / Government / MSP / OEM
* `engineering/MAP_V1/2.4 - CG-10 Commercial Readiness Assessment.md` (8944) — six-dimension maturity scorecard
* `engineering/MAP_V1/2.2 - BP-05 - Commercial Blueprint.md` (14281) — commercial architecture
* `engineering/MAP_V3/00_Architecture/05_Database_Architecture.md` (7448) — Platform schema lists `Plans` + `Subscriptions` as planned entities (lines 309-311), not implemented
* `MAP_V2/03_Source/database/create_platform_schema.sql` — `platform.users`, `platform.roles`, `platform.tasks`, `platform.workflows`, `platform.approvals`, `platform.calendar_events` all have `tenant_id UUID` FK to `core.tenants`
* `docs/setups/installer/install_governance_tables.sql` — `core.tenants` (`tenant_id VARCHAR(100)` PK, `tenant_name`, `created_timestamp`) + `engine.migration_control_decisions` + `engine.migration_risk_scores` with `tenant_id`
* `app/db/repositories/system_repository.py` — `get_all(tenant_id=None)` filters by tenant_id
* `engineering/MAP_V3/03_Source/frontend-mvp/src/hooks/useTenants.ts` — fetches `GET /rules/tenants` → `Tenant[]` (tenant_id, tenant_name)
* `app/services/lead_service.py` — `core.leads` capture (no subscription tier, no plan assignment, no tenant creation on registration)
* `app/api/routes/lead_routes.py` — `POST /api/v1/leads` captures form data but does not create tenant, user, or subscription
* `engineering/MAP_V3/00_Architecture/Verification/Phase_08/08AA_Frozen_Frontend_Gap_Analysis.md` — "SubscriptionManagement — Not in UI, Not implemented, Future"
* `engineering/MAP_V3/00_Architecture/Verification/25_Frontend_Architecture/01_Master_Frontend_Restoration_Specification.md` — "Subscriptions — Commercial feature, not MVP"

**EXISTING IMPLEMENTATION:**

* **Tenant Table (EXISTS — Minimal):** `core.tenants` (`tenant_id VARCHAR(100)` PK, `tenant_name VARCHAR(255)`, `created_timestamp`) — 3 columns only. No status, no subscription_id, no plan_id, no billing_email, no max_users, no max_projects, no entitlements JSON, no metadata. Seed example: `bank_a`, `bank_b`, `insurance_client`. No tenant provisioning API exists — tenants are created manually via SQL.
* **Tenant FK (EXISTS — Soft Enforced):** `platform.users`, `platform.roles`, `platform.tasks`, `platform.workflow_definitions`, `platform.workflow_instances`, `platform.approval_requests`, `platform.approval_templates`, `platform.calendar_events` all have `tenant_id UUID` columns with FK to `core.tenants(tenant_id)`. **However:** `core.tenants.tenant_id` is `VARCHAR(100)` while platform tables use `UUID` — type mismatch. FK constraints exist in DDL but may fail at runtime if actual tenant_id values don't match UUID format. `system_registry` also has `tenant_id` in `system_repository.py` but no FK constraint in DDL.
* **Tenant Isolation (NOT ENFORCED):** No row-level security (RLS) in PostgreSQL. No tenant middleware in FastAPI — `tenant_id` is passed as optional query param but not enforced. Any authenticated user can potentially access any tenant's data by omitting or changing `tenant_id`. `system_repository.get_all(tenant_id=None)` returns ALL systems across ALL tenants when tenant_id is None.
* **Subscription Table (NOT EXISTS):** No `platform.subscriptions` table in any SQL file. No Python model or repository for subscriptions. No subscription routes in `app/api/routes/`. No `useSubscriptions.ts` in frontend.
* **Plans Table (NOT EXISTS):** No `platform.plans` table. `05_Database_Architecture.md` lists "Plans" and "Subscriptions" as planned Platform schema entities but they were never created.
* **Billing/Charges (NOT EXISTS):** No Stripe integration anywhere. No payment routes. No invoice generation. No billing dashboard. No charge calculation logic.
* **Entitlements (NOT EXISTS):** No feature-flag-per-plan gating. `platform.feature_flags` exists but is global, not per-subscription. No "Professional gets X, Enterprise gets Y" logic.
* **Lead → Tenant Flow (NOT EXISTS):** `POST /api/v1/leads` captures `core.leads` but does NOT create a `core.tenants` row, does NOT create a `platform.users` row, does NOT assign a plan or subscription. Manual process only.
* **Commercial Pricing Docs (AUTHORED — Not Implemented):** `CG-03` defines three tiers:
  * Professional: £25,000–£50,000/year
  * Enterprise: £75,000–£150,000/year
  * Enterprise Plus: £200,000+/year
  * Pilot: £5,000–£40,000 (one-off)
  * SaaS Future: £1,500–£10,000+/month
  * Training: £1,000–£2,000/consultant/day
* **Product Family (DEFINED — Not Implemented):** `PC-04` defines 7 editions: Foundation, Professional, Enterprise, Enterprise Plus, Government, MSP, OEM. None are implemented as separate entitlement bundles.

**FINDINGS:**
* **Positive:** Tenant model exists at schema level (core.tenants + FK columns). Commercial pricing strategy is documented (CG-03). Product family defined (PC-04). `useTenants.ts` works. `source_form` in leads distinguishes `get_started` vs `request_demo`.
* **Issues:**
  1. **Type Mismatch (HIGH):** `core.tenants.tenant_id` is `VARCHAR(100)` but all platform FK columns are `UUID`. FK constraints will fail if tenant_ids don't match UUID format. Platform tables were designed for UUID tenants, governance table was designed for string tenants — two incompatible models.
  2. **No Subscription Table (HIGH):** `platform.subscriptions` listed in architecture as planned entity but never created. No way to track which tenant is on which plan, when subscription starts/expires, what's included.
  3. **No Plan Table (HIGH):** `platform.plans` listed in architecture but never created. No way to define plan features, limits, pricing. Three tiers (£25k/£75k/£200k+) exist only in a markdown doc.
  4. **No Entitlement Gating (MEDIUM):** No logic to restrict Professional tenants from Enterprise features. Feature flags are global, not per-plan.
  5. **No Tenant Isolation (HIGH):** No RLS, no tenant middleware enforcement. `get_all(tenant_id=None)` returns all data. Any authenticated user can access cross-tenant data by omitting tenant_id.
  6. **No Lead → Tenant Provisioning (MEDIUM):** Form submissions go to `core.leads` but don't create a tenant, user, or trial subscription. Manual SQL only.
  7. **No Billing Integration (LOW for MVP, HIGH for Commercial):** No Stripe, no invoice generation, no payment collection. Currently 100% on-prem/license.
  8. **No Subscription Lifecycle (MEDIUM):** No activation, renewal, suspension, cancellation, upgrade, downgrade logic.
  9. **No Tenant Admin Self-Service (LOW):** No UI for tenant admins to manage their subscription, view invoices, or change plans.

**RISKS:**
* Tenant FK type mismatch may cause silent failures or prevent FK enforcement entirely.
* Cross-tenant data leakage is possible without RLS or enforced tenant middleware.
* Commercial launch blocked — no way to sell, track, or enforce subscriptions.
* `core.leads` grows with no automated path to conversion.

**GAPS:**
* `platform.subscriptions` table (tenant_id, plan_id, status, start_date, end_date, billing_cycle, stripe_subscription_id)
* `platform.plans` table (plan_id, name, tier, monthly_price, annual_price, entitlements JSON, max_users, max_projects)
* Tenant provisioning API (POST /tenants → create tenant + admin user + trial subscription)
* Tenant middleware enforcement (require tenant_id on all platform routes)
* Entitlement middleware (check plan features before allowing access)
* Stripe integration (checkout, webhooks, invoice generation)
* Subscription lifecycle (activate, renew, suspend, cancel, upgrade, downgrade)
* `core.tenants.tenant_id` type alignment (VARCHAR vs UUID — pick one)
* Frontend: SubscriptionManagement page, PlanManagement page, TenantProvisioning flow

**DEPENDENCIES:**
* OC-SEC-001/002 implementation (rate limiting, CSP) — independent
* OC-PROD-001 (Pre/Post Migration Product) — depends on subscription model to define what each tier gets
* OC-GOV-001 (Governance) — depends on tenant isolation for multi-tenant governance
* Stripe account setup (external) — required for billing integration
* Azure subscription (external) — required for SaaS deployment model

**RECOMMENDATION:**
* **Split into two work packages:**
  * `OC-COM-001a` — Tenant Model Fix + Subscription Table + Plans Table + Tenant Middleware (backend infrastructure, no billing)
  * `OC-COM-001b` — Stripe Integration + Billing + Entitlement Gating + Subscription Lifecycle (commercial layer)
* **Recommended order:** `OC-COM-001a` first (unblocks OC-PROD-001), then `OC-COM-001b` (unblocks commercial launch)
* **MVP scope for 001a:** Align tenant_id type, create `platform.plans` + `platform.subscriptions` tables, add tenant middleware, create tenant provisioning API, seed 3 plan tiers (Professional/Enterprise/Enterprise Plus)

**PROPOSED CHANGES:**
* `sql/schema/14_commercial_schema.sql` (new) — `platform.plans`, `platform.subscriptions`, `platform.tenant_subscriptions` tables
* `sql/schema/15_tenant_id_alignment.sql` (new) — migrate `core.tenants.tenant_id` from VARCHAR(100) to UUID, update FK constraints
* `app/middleware/tenant_middleware.py` (new) — enforce tenant_id on all platform routes
* `app/api/routes/tenant_routes.py` (new) — CRUD for tenants + subscription management
* `app/services/tenant_service.py` (new) — tenant provisioning logic
* `app/db/repositories/tenant_repository.py` (new) — tenant + subscription queries
* `seed_platform_data.sql` (update) — add 3 default plans

**FILES EXPECTED TO CHANGE:**
* `MAP_V2/03_Source/database/create_platform_schema.sql` — add subscription + plan tables, fix tenant_id type
* `app/api/main.py` — register tenant_routes
* `app/db/repositories/system_repository.py` — enforce tenant_id (not optional)
* `app/services/lead_service.py` — add optional tenant provisioning on lead conversion

**DATABASE CHANGES:**
* NEW: `platform.plans` (plan_id UUID PK, name, tier, monthly_price, annual_price, entitlements JSONB, max_users, max_projects, status, created_at)
* NEW: `platform.subscriptions` (subscription_id UUID PK, tenant_id UUID FK, plan_id UUID FK, status, start_date, end_date, billing_cycle, stripe_subscription_id, created_at)
* ALTER: `core.tenants.tenant_id` — VARCHAR(100) → UUID (migration required)
* ALTER: `core.tenants` — add columns: status, plan_id, billing_email, max_users, max_projects, metadata JSONB

**SECURITY IMPACT:**
* HIGH: Cross-tenant data leakage without enforcement — `get_all(tenant_id=None)` returns all data
* MEDIUM: No entitlement enforcement — any tenant can access any feature tier
* LOW: No billing fraud risk currently (no billing), but will be HIGH once Stripe is integrated without webhook validation

**BACKWARD COMPATIBILITY:**
* Tenant middleware must be additive — existing routes without tenant_id must not break
* `core.tenants` VARCHAR→UUID migration must be non-destructive (add UUID column, backfill, drop old)
* Lead capture flow must remain unchanged

**TEST PLAN:**
* Verify `platform.plans` seeds 3 tiers with correct prices
* Verify `platform.subscriptions` links tenant to plan
* Verify tenant middleware blocks cross-tenant access
* Verify `system_repository.get_all()` with and without tenant_id
* Verify tenant provisioning creates tenant + admin + trial subscription
* Verify existing `POST /api/v1/leads` still works unchanged

**EVIDENCE:**
* All file paths listed in FILES INSPECTED section above
* `CG-03 Pricing & Revenue Model` — pricing bands documented
* `PC-04 Book IV Commercial` — product family defined
* `05_Database_Architecture.md` lines 309-311 — "Plans" + "Subscriptions" listed as planned entities
* `create_platform_schema.sql` lines 451-458 — FK constraints to `core.tenants`
* `install_governance_tables.sql` — `core.tenants` DDL with VARCHAR(100)
* `useTenants.ts` — frontend hook fetching tenants

**QUESTIONS:**
* Is the VARCHAR→UUID migration for `core.tenants.tenant_id` acceptable, or should platform tables be changed to VARCHAR instead?
* Should `OC-COM-001a` include tenant provisioning UI (frontend) or backend-only?
* Should trial subscriptions be auto-created on lead conversion, or manual?
* Is Stripe the agreed payment provider, or should we evaluate alternatives (Paddle, Chargebee)?

**STATUS:** REPORT — ready for CHATGPT REVIEW → APPROVAL before IMPLEMENTATION
