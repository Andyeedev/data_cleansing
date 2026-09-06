# OC-COM-001b — Stripe, Billing & Entitlements (Commercial Layer)
**WORK PACKAGE:** OC-COM-001b | **ID:** OC-COM-001b | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**PARENT:** OC-COM-001 (split from Subscription, Charges & Tenant Assessment)
**DEPENDS ON:** OC-COM-001a (tenant model + subscription + plans + middleware must be implemented first)
**OBJECTIVE:** Add Stripe payment integration, billing lifecycle, entitlement gating, and subscription management UI — commercial layer on top of 001a infrastructure.

**FILES / SYSTEMS / POLICIES INSPECTED:**
* `OC-COM-001_Subscription_Charges_Tenant_Assessment.md` — parent report, 9 gaps
* `OC-COM-001a_Tenant_Model_Subscription_Plans_Middleware.md` — dependency, creates `platform.plans` + `platform.subscriptions`
* `engineering/MAP_V1/2.4 - CG-03 Pricing & Revenue Model.md` — three tiers, pilot pricing, SaaS future
* `engineering/MAP_V1/2.1 - PC-04 - Product Canon – Book IV (Commercial).md` — 7 product editions
* `engineering/MAP_V1/2.4 - CG-10 Commercial Readiness Assessment.md` — commercial maturity scorecard
* `engineering/MAP_V3/00_Architecture/08_Security_Architecture.md` — will need Stripe webhook signature validation
* `engineering/MAP_V3/03_Source/frontend-mvp/src/hooks/` — pattern for new `useSubscription.ts`
* `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/` — pattern for new subscription pages

**EXISTING IMPLEMENTATION (after 001a):**
* `platform.plans` — 3 tiers seeded (Professional £25k, Enterprise £75k, Enterprise Plus £200k+)
* `platform.subscriptions` — tenant_id → plan_id linkage, status lifecycle
* `core.tenants` — extended with plan_id, status, billing fields
* Tenant middleware — validates tenant exists, returns TenantContext with plan_id
* No Stripe integration
* No invoice generation
* No payment collection
* No entitlement middleware (feature gating per plan)
* No subscription management UI
* No billing portal
* No webhook handling

**PROPOSED CHANGES:**

### 1. Stripe Configuration
* `app/config/stripe_config.py` (new):
  * `STRIPE_SECRET_KEY` from environment
  * `STRIPE_PUBLISHABLE_KEY` from environment
  * `STRIPE_WEBHOOK_SECRET` from environment
  * `STRIPE_API_VERSION` pinned
  * Price IDs mapping: `PROFESSIONAL_MONTHLY`, `PROFESSIONAL_ANNUAL`, `ENTERPRISE_MONTHLY`, `ENTERPRISE_ANNUAL`, `ENTERPRISE_PLUS_MONTHLY`, `ENTERPRISE_PLUS_ANNUAL`

### 2. Stripe Service
* `app/services/stripe_service.py` (new):
  * `create_customer(tenant)` — create Stripe customer, store `stripe_customer_id` on `core.tenants`
  * `create_checkout_session(tenant, plan, cycle)` — Stripe Checkout for new subscription
  * `create_portal_session(tenant)` — Stripe Customer Portal for self-service billing
  * `handle_webhook(event)` — process `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
  * `cancel_subscription(subscription_id)` — Stripe cancellation
  * `update_subscription(subscription_id, new_plan)` — Stripe plan change
  * `list_invoices(tenant)` — Stripe invoice history

### 3. Billing Routes
* `app/api/routes/billing_routes.py` (new):
  * `POST /billing/checkout` — create Stripe Checkout session (returns URL)
  * `POST /billing/portal` — create Stripe Customer Portal session (returns URL)
  * `POST /billing/webhook` — Stripe webhook receiver (raw body, signature validation)
  * `GET /billing/invoices` — list tenant invoices from Stripe
  * `POST /billing/upgrade` — upgrade plan (Stripe plan change)
  * `POST /billing/cancel` — cancel subscription

### 4. Entitlement Middleware
* `app/middleware/entitlement_middleware.py` (new):
  * FastAPI dependency that checks `TenantContext.plan_id` against required entitlement
  * `require_entitlement(feature_name)` — decorator/dependency for routes
  * Entitlement mapping: `platform.plans.entitlements` JSONB defines per-plan feature access
  * Default entitlements:
    * Professional: `discovery`, `mapping`, `validation`, `basic_reporting`, `single_project`
    * Enterprise: `+governance`, `multi_project`, `advanced_reporting`, `api_access`, `audit_trail`
    * Enterprise Plus: `+ai_insights`, `custom Integrations`, `priority_support`, `multi_region`

### 5. Subscription Management Frontend
* `engineering/MAP_V3/03_Source/frontend-mvp/src/hooks/useSubscription.ts` (new):
  * `GET /tenants/{tenant_id}/subscription` — current plan + status + renewal date
  * `POST /billing/checkout` — redirect to Stripe Checkout
  * `POST /billing/portal` — redirect to Stripe Portal
* `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/SubscriptionPage.tsx` (new):
  * Current plan display (name, price, status, renewal date)
  * Upgrade/downgrade buttons (redirect to Stripe Checkout)
  * Billing portal link (redirect to Stripe Portal)
  * Invoice history table
  * Trial countdown (if trialing)

### 6. Tenant Admin Billing UI
* `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/BillingPage.tsx` (new):
  * Invoice list with download links
  * Payment method display (via Stripe Portal)
  * Billing history
  * Subscription lifecycle actions (cancel, reactivate)

### 7. Extend core.tenants for Stripe
* `sql/schema/16_stripe_columns.sql` (new):
  * ALTER `core.tenants` ADD: `stripe_customer_id VARCHAR(255)`, `stripe_subscription_id VARCHAR(255)`

### 8. Extend platform.subscriptions for Stripe
* Add `stripe_subscription_id VARCHAR(255)` column (already in 001a schema but will be populated by Stripe webhook)

**FILES EXPECTED TO CHANGE:**
* `app/config/stripe_config.py` (new)
* `app/services/stripe_service.py` (new)
* `app/api/routes/billing_routes.py` (new)
* `app/middleware/entitlement_middleware.py` (new)
* `app/api/main.py` — register billing_routes
* `sql/schema/16_stripe_columns.sql` (new)
* `engineering/MAP_V3/03_Source/frontend-mvp/src/hooks/useSubscription.ts` (new)
* `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/SubscriptionPage.tsx` (new)
* `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/BillingPage.tsx` (new)

**DATABASE CHANGES:**
* ALTER: `core.tenants` — add `stripe_customer_id`, `stripe_subscription_id`
* ALTER: `platform.subscriptions` — populate `stripe_subscription_id` from webhooks

**SECURITY IMPACT:**
* HIGH: Stripe webhook signature validation is critical — must verify `stripe-signature` header
* MEDIUM: Entitlement middleware must not leak feature access to wrong tiers
* LOW: Stripe keys must never be committed (env vars only)

**BACKWARD COMPATIBILITY:**
* Billing routes are entirely new — no existing routes affected
* Entitlement middleware is additive — applied only to routes that need it
* Stripe webhook endpoint must be publicly accessible (no auth required, signature-only)

**TEST PLAN:**
* Verify Stripe Checkout session creation (test mode)
* Verify Stripe webhook handling for all 5 event types
* Verify entitlement middleware blocks Professional users from Enterprise features
* Verify upgrade flow: Professional → Enterprise changes plan_id + Stripe subscription
* Verify cancellation flow: sets status to 'cancelled', Stripe subscription cancelled
* Verify invoice list returns from Stripe API
* Verify SubscriptionPage renders current plan + upgrade options
* Verify BillingPage renders invoice history

**QUESTIONS:**
* Stripe account must be created before implementation — is this done?
* Should we use Stripe Test Mode for development, or a separate test account?
* Should the webhook endpoint be `/billing/webhook` or `/api/v1/billing/webhook`?
* Should Enterprise Plus pricing be fixed at £200k+ or configurable per tenant?

**STATUS:** REPORT — ready for CHATGPT REVIEW → APPROVAL before IMPLEMENTATION (blocked on OC-COM-001a)
