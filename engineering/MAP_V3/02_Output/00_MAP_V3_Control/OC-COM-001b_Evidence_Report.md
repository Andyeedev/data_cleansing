# OC-COM-001b — Evidence Report

**Date:** 2026-09-07
**Status:** COMPLETE
**Commit:** pending

---

## 1. What Was Done

### 1.1 Stripe Configuration

Created `app/config/stripe_config.py`:

- `STRIPE_SECRET_KEY` from env
- `STRIPE_PUBLISHABLE_KEY` from env
- `STRIPE_WEBHOOK_SECRET` from env
- `STRIPE_API_VERSION` pinned
- `STRIPE_PRICE_IDS` mapping (6 price IDs: monthly/annual × 3 tiers)
- `TIER_MAP` for price lookup by tier + cycle

### 1.2 Stripe Service

Created `app/services/stripe_service.py` — 7 methods:

| Method | Purpose |
|--------|---------|
| `create_customer` | Create Stripe customer, store ID on tenant |
| `create_checkout_session` | Stripe Checkout for new subscription |
| `create_portal_session` | Stripe Customer Portal for self-service |
| `handle_webhook` | Process 5 event types with signature validation |
| `cancel_subscription` | Stripe cancellation (period end) |
| `upgrade_subscription` | Stripe plan change with proration |
| `list_invoices` | Stripe invoice history |

**Webhook events handled:**
- `checkout.session.completed` — activate subscription
- `invoice.paid` — confirm payment
- `invoice.payment_failed` — suspend subscription
- `customer.subscription.updated` — sync status
- `customer.subscription.deleted` — cancel subscription

**Graceful degradation:** If `stripe` package not installed, service raises clear error. No import crash.

### 1.3 Billing Routes

Created `app/api/routes/billing_routes.py` — 6 endpoints:

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/billing/checkout` | get_current_user_with_tenant | Create Stripe Checkout |
| POST | `/api/v1/billing/portal` | get_current_user_with_tenant | Create Stripe Portal |
| POST | `/api/v1/billing/webhook` | NONE (signature only) | Stripe webhook receiver |
| GET | `/api/v1/billing/invoices` | get_current_user_with_tenant | List invoices |
| POST | `/api/v1/billing/upgrade` | get_current_user_with_tenant | Upgrade plan |
| POST | `/api/v1/billing/cancel` | get_current_user_with_tenant | Cancel subscription |

**Security:** Webhook endpoint has NO auth — signature validation only (Stripe requirement).

### 1.4 Entitlement Middleware

Created `app/middleware/entitlement_middleware.py`:

- `require_entitlement(feature_name)` — FastAPI dependency for route-level gating
- `check_entitlement(tenant_id, feature_name)` — programmatic check
- `get_tenant_entitlements(tenant_id)` — fetch from DB
- `DEFAULT_ENTITLEMENTS` — fallback mapping per tier

**Entitlement tiers:**
- Professional: discovery, mapping, validation, basic_reporting, single_project, email_support
- Enterprise: +governance, multi_project, advanced_reporting, api_access, audit_trail, priority_support
- Enterprise Plus: +ai_insights, custom_integrations, dedicated_support, multi_region, sla

### 1.5 SQL Migration

Created `migrations/OC-COM-001b_stripe_columns.sql`:

- `core.tenants.stripe_customer_id VARCHAR(255)`
- `core.tenants.stripe_subscription_id VARCHAR(255)`
- Index on `stripe_customer_id`

### 1.6 Dependencies

Added `stripe==12.1.0` to `requirements.txt`.

### 1.7 Routes Registered

Added `billing_routes` to `app/api/main.py` imports and router registration.

---

## 2. Files Changed

| File | Change |
|------|--------|
| `app/config/stripe_config.py` | NEW |
| `app/services/stripe_service.py` | NEW |
| `app/api/routes/billing_routes.py` | NEW |
| `app/middleware/entitlement_middleware.py` | NEW |
| `engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001b_stripe_columns.sql` | NEW |
| `app/api/main.py` | MODIFIED |
| `requirements.txt` | MODIFIED |
| `tests/test_billing_entitlements.py` | NEW |

---

## 3. Test Results

| Test Suite | Tests | Status |
|------------|-------|--------|
| test_billing_entitlements.py | 38 | ALL PASS |
| test_commercial_schema.py | 46 | ALL PASS |
| test_auth_hardening.py | 22 | ALL PASS |
| test_credential_isolation.py | 20 | ALL PASS |
| test_user_rbac_isolation.py | 19 | ALL PASS |
| test_operational_routes_isolation.py | 13 | ALL PASS |
| test_edge_cases_isolation.py | 11 | ALL PASS |
| **Total** | **169** | **ALL PASS** |

---

## 4. Setup Required Before Use

### 4.1 Install stripe package
```bash
pip install stripe==12.1.0
```

### 4.2 Set environment variables
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_ANNUAL=price_...
STRIPE_PRICE_ENTERPRISE_PLUS_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_PLUS_ANNUAL=price_...
```

### 4.3 Run SQL migration
```bash
psql -d <database> -f engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001b_stripe_columns.sql
```

### 4.4 Configure Stripe webhook
- Endpoint: `POST /api/v1/billing/webhook`
- Events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
