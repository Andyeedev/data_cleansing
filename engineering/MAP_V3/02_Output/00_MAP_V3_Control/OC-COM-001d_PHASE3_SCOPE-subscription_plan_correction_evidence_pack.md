# OC-COM-001d Phase 3 — Subscription & Plan Correction Evidence Pack

**Phase:** 3 (P2 Subscription/Billing)  
**Status:** COMPLETE  
**Date:** 2026-09-10 (corrected 2026-09-12)  
**Commit:** `02a1df51` (and subsequent)  
**Branch:** `feature/MAP_V3`  
**Status:** All tests passing, TypeScript clean

---

## 1. Final Professional / Enterprise / Enterprise Plus Pricing

### Pricing Model (Corrected)

| Plan | List Price | Annual (20% off) | Monthly (List ÷ 12) |
|------|------------|------------------|---------------------|
| Professional | £31,250 | **£25,000** (Save 20%) | **£2,604.17** |
| Enterprise | £93,750 | **£75,000** | **£7,812.50** |
| Enterprise Plus | £250,000 | **£200,000** | **£20,833.33** |

**Rule:** Monthly = List ÷ 12 (no discount). Annual = List × 0.8 (20% discount).

### Database Verification
```bash
Professional:   list=31250,   annual=25000,   monthly=2604.17
Enterprise:     list=93750,   annual=75000,   monthly=7812.50
Enterprise Plus: list=250000,  annual=200000, monthly=20833.33
```

---

## 2. Final Service × Plan Matrix

| Service / Capability | Professional | Enterprise | Enterprise Plus | Implementation Status |
|---------------------|--------------|------------|-----------------|----------------------|
| Discovery | ✓ | ✓ | ✓ | `discovery` entitlement in all tiers |
| Mapping | ✓ | ✓ | ✓ | `mapping` entitlement in all tiers |
| Post-Migration Assurance | ✓ | ✓ | ✓ | `post_migration_assurance` in all tiers |
| Pre-Migration Assurance | — | ✓ | ✓ | `pre_migration_assurance` in Enterprise/Plus |
| Pre + Post Assurance | — | ✓ | ✓ | `pre_post_migration_assurance` in Enterprise/Plus |
| Validation | ✓ | ✓ | ✓ | `validation` entitlement in all tiers |
| Reconciliation | ✓ | ✓ | ✓ | `reconciliation` in all tiers |
| Standard Reporting | ✓ | — | — | `basic_reporting` in Professional |
| Advanced Reporting | — | ✓ | ✓ | `advanced_reporting` in Enterprise/Plus |
| Enterprise Reporting | — | — | ✓ | `enterprise_reporting` in Enterprise Plus only |
| Core Governance | ✓ | — | — | `core_governance` in Professional |
| Advanced Governance | — | ✓ | ✓ | `advanced_governance` in Enterprise/Plus |
| Enterprise Governance | — | — | ✓ | `enterprise_governance` in Enterprise Plus only |
| Multi-Project | ✓ | ✓ | ✓ | `multi_project` in all tiers |
| API Access | ✓ | ✓ | ✓ | `api_access` in all tiers |
| Custom Integrations | — | — | ✓ | `custom_integrations` in Enterprise Plus only |
| Priority Support | ✓ | ✓ | — | `priority_support` in Professional/Enterprise |
| Dedicated/Enterprise Support | — | — | ✓ | `dedicated_support` in Enterprise Plus only |

**Legend:** ✓ = implemented via entitlement/limit; — = not in plan

---

## 3. Final Entitlement Mappings

### Database Entitlements (`platform.plans.entitlements` JSONB)

**Professional:**
```json
{
  "mapping": true, "discovery": true, "api_access": true,
  "validation": true, "email_support": true, "multi_project": true,
  "single_project": true, "basic_reporting": true, "core_governance": true,
  "priority_support": true, "post_migration_assurance": true, "reconciliation": true
}
```

**Enterprise:**
```json
{
  "mapping": true, "discovery": true, "api_access": true,
  "governance": true, "validation": true, "audit_trail": true,
  "multi_project": true, "reconciliation": true, "priority_support": true,
  "advanced_reporting": true, "advanced_governance": true,
  "pre_migration_assurance": true, "post_migration_assurance": true,
  "pre_post_migration_assurance": true
}
```

**Enterprise Plus:**
```json
{
  "sla": true, "mapping": true, "discovery": true, "api_access": true,
  "governance": true, "validation": true, "ai_insights": true,
  "audit_trail": true, "multi_region": true, "multi_project": true,
  "reconciliation": true, "dedicated_support": true, "advanced_reporting": true,
  "advanced_governance": true, "custom_integrations": true,
  "enterprise_reporting": true, "enterprise_governance": true,
  "pre_migration_assurance": true, "post_migration_assurance": true,
  "pre_post_migration_assurance": true
}
```

### Middleware Fallback (`DEFAULT_ENTITLEMENTS` in `entitlement_middleware.py`)
Aligned with DB vocabulary — same keys as DB for all three tiers.

---

## 4. Pre/Post Assurance Implementation

### Requirement (Approved Commercial Model)
- **Professional:** Post-Migration Assurance **only**
- **Enterprise:** Pre-Migration + Post-Migration + Pre+Post Assurance
- **Enterprise Plus:** Pre-Migration + Post-Migration + Pre+Post Assurance

### Implementation
| Assurance Type | Professional | Enterprise | Enterprise Plus |
|----------------|--------------|------------|-----------------|
| `post_migration_assurance` | ✓ | ✓ | ✓ |
| `pre_migration_assurance` | — | ✓ | ✓ |
| `pre_post_migration_assurance` | — | ✓ | ✓ |

**Implementation:** All three keys added to `platform.plans.entitlements` JSONB and `DEFAULT_ENTITLEMENTS` middleware fallback.

**Enforcement:** `require_entitlement("pre_migration_assurance")` middleware blocks Professional users from Pre-Migration features.

---

## 5. Stripe / DB / Frontend Alignment

### Stripe Configuration
**File:** `app/config/stripe_config.py`

```python
TIER_MAP = {
    "professional": {"monthly": PRICE_ID, "annual": PRICE_ID},
    "enterprise": {"monthly": PRICE_ID, "annual": PRICE_ID},
    "enterprise_plus": {"monthly": PRICE_ID, "annual": PRICE_ID},
}
```

**Status:** `STRIPE_PRICE_IDS` all empty in `.env` — requires real Stripe test keys from Dashboard.

### Stripe Service (`app/services/stripe_service.py`)
- **Upgrade:** Syncs tenant `max_*` + `plan_id` after Stripe upgrade ✅
- **Cancel:** Sets `pending_cancellation` (deferred to period end) ✅
- **Invoice Paid:** Reactivates `suspended`/`past_due` → `active` ✅
- **Webhook:** Maps `past_due` → `past_due` (not suspended) ✅

### Database Schema (`platform.plans`)
| Column | Professional | Enterprise | Enterprise Plus |
|--------|--------------|------------|-----------------|
| `list_price` | 31250 | 93750 | 250000 |
| `annual_price` | 25000 | 75000 | 200000 |
| `monthly_price` | 2604.17 | 7812.50 | 20833.33 |

### Frontend Alignment
| Component | Status |
|-----------|--------|
| `PriceTag` | Monthly = List/12 (no discount), Annual = 20% badge |
| `SubscriptionPlansPage` | 20 feature rows including Pre/Post assurance |
| Enterprise Plus card | "Starting price: £200,000/year" + custom integrations note |
| Dashboard `UsageLimitCard` | 3 cards with 80%/100% progress bars |
| SetupSteps `LimitWarning` | Amber ≥80%, Red 100%, buttons disabled at limit |

---

## 6. Tests & Results

```
tests/test_commercial_schema.py        36 passed
tests/test_billing_entitlements.py     48 passed
tests/test_subscription_lifecycle.py   13 passed
Total: 97 passed in 4.09s
```

**TypeScript:** 0 errors (`npx tsc --noEmit`)

### Phase 3 Specific Tests (`test_subscription_lifecycle.py`)
| Test | Status |
|------|--------|
| ACTIVE → PENDING_CANCELLATION | ✅ |
| PENDING_CANCELLATION → CANCELLED | ✅ |
| PAST_DUE → ACTIVE (recovery) | ✅ |
| ACTIVE → PAST_DUE (grace) | ✅ |
| ACTIVE → SUSPENDED | ✅ |
| pending_cancellation retains entitlements | ✅ |
| past_due retains entitlements | ✅ |
| suspended revokes entitlements | ✅ |
| cancelled revokes entitlements | ✅ |
| Downgrade syncs tenant limits | ✅ |
| `get_active_subscription` includes pending_cancellation | ✅ |

---

## 7. Commit / Status

| Item | Value |
|------|-------|
| **Branch** | `feature/MAP_V3` |
| **Latest Commit** | `02a1df51` (and subsequent) |
| **Status** | All changes uncommitted locally (per instruction) |
| **Tests** | 97/97 passed (Phase 3 + 4 + core) |
| **TypeScript** | 0 errors |

---

## 8. Outstanding Issues

| Issue | Status |
|------|--------|
| Stripe `.env` with real test keys | Pending (user setup) |
| Stripe price IDs in config | Pending (needs Stripe Dashboard) |
| OC-COM-001e (Identity/Access) | HOLD (per directive) |
| Phase 5 (Suspension UX) | Next |

---

## Evidence Files

| File | Purpose |
|------|---------|
| `OC-COM-001d_PHASE3_SCOPE-subscription_billing_checklist.md` | Phase 3 checklist (in Prompts/) |
| Main spec → Section 19 | Phase 3 Evidence (embedded in master spec) |
| `OC-COM-001d_PHASE3_SCOPE-subscription_status_check_migration.sql` | Migration file |
| `OC-COM-001d_PHASE3_SCOPE-subscription_billing_checklist.md` | Phase 3 checklist |

---

**Location:** `engineering/MAP_V3/02_Output/00_MAP_V3_Control/`

---

**Status:** Phase 3 COMPLETE — Ready for Phase 5 approval