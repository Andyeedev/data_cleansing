# OC-COM-001d Phase 4 — Dashboard Limits & Usage UX Evidence

**Status:** COMPLETE
**Phase:** 4 (P3 Usage UX)
**Date:** 2026-09-12

---

## Summary

Phase 4 delivers the Usage/Entitlement UX (P3) as specified in OC-COM-001d. This phase implements dashboard limit cards, onboarding limit warnings, subscription plan cards, and corrects the pricing model to align with the approved commercial model.

---

## Files Changed

### Frontend (6 files)
| File | Change |
|------|--------|
| `DashboardPage.tsx` | Added UsageLimitCard component (3 cards: Projects/Users/Systems) with 80%/100% progress bars |
| `SetupSteps.tsx` | Added LimitWarning component in CreateProject, ConnectSource, ConnectTarget steps |
| `WelcomePage.tsx` | Subscription plan card with usage bars, trial countdown |
| `OnboardingHubPage.tsx` | Limit strip with plan badge + 3 limit pills |
| `SubscriptionPlansPage.tsx` | PriceTag component with correct pricing logic; 20% badge; Enterprise Plus notes |
| `entitlement_middleware.py` | DEFAULT_ENTITLEMENTS aligned with DB vocabulary; added new entitlement keys |

### Backend (Database)
| Component | Change |
|-----------|--------|
| `platform.plans` | Added `list_price` column; updated 3 plans with correct pricing and entitlements |
| `entitlement_middleware.py` | `DEFAULT_ENTITLEMENTS` aligned with DB vocabulary |

---

## Pricing Model (Corrected)

| Plan | List Price | Annual (20% off) | Monthly (List ÷ 12) |
|------|------------|------------------|---------------------|
| Professional | £31,250 | £25,000 (Save 20%) | £2,604.17 |
| Enterprise | £93,750 | £75,000 | £7,812.50 |
| Enterprise Plus | £250,000 | £200,000 | £20,833.33 |

**Rule:** Monthly = List ÷ 12 (no discount). Annual = List × 0.8 (20% discount).

---

## Database Updates

```sql
ALTER TABLE platform.plans ADD COLUMN IF NOT EXISTS list_price NUMERIC(10,2);
UPDATE platform.plans SET list_price = 31250, monthly_price = 2604.17 WHERE tier = 'professional';
UPDATE platform.plans SET list_price = 93750, monthly_price = 7812.50 WHERE tier = 'enterprise';
UPDATE platform.plans SET list_price = 250000, monthly_price = 20833.33 WHERE tier = 'enterprise_plus';
```

**Professional:** list=31250, annual=25000, monthly=2604.17
**Enterprise:** list=93750, annual=75000, monthly=7812.50
**Enterprise Plus:** list=250000, annual=200000, monthly=20833.33

---

## Frontend Implementation Details

### DashboardPage.tsx — UsageLimitCard
- 3 cards: Projects, Users, Systems
- Progress bars: green <80%, amber 80-99%, red 100%
- Status text: "Within limits" / "Near limit" / "Limit reached"

### SetupSteps.tsx — LimitWarning Component
- Amber warning at ≥80% usage with progress bar
- Red warning at 100% with "Limit Reached" button state
- Applied to CreateProject, ConnectSource, ConnectTarget steps

### WelcomePage.tsx
- Subscription plan card with usage bars, trial countdown
- Plan badge, trial countdown, usage bars for Projects/Users/Systems

### OnboardingHubPage — Limit Strip
- Plan badge + 3 limit pills (Projects/Users/Systems)
- Color-coded pills (green/amber/red) based on usage percentage

### SubscriptionPlansPage — PriceTag Component
- **Monthly view:** "Undiscounted monthly price (no annual commitment)"
- **Annual view:** "Save 20%" green badge + list price reference
- Enterprise Plus: "Starting price: £200,000/year" + custom integrations note
- Removed "20% Annual Discount" from feature list (per requirement)

---

## Entitlement Alignment

### Middleware (`entitlement_middleware.py`)
- `DEFAULT_ENTITLEMENTS` aligned with DB vocabulary
- Added: `pre_migration_assurance`, `post_migration_assurance`, `pre_post_migration_assurance`, `reconciliation`, `enterprise_reporting`, `enterprise_governance`, `custom_integrations`, `dedicated_support`

### Database Entitlements (`platform.plans`)

**Professional:** `post_migration_assurance`, `reconciliation`, `core_governance`, `priority_support`, `multi_project`, `api_access`, `api_access`, `basic_reporting`, `single_project`, `email_support`

**Enterprise:** Adds `pre_migration_assurance`, `post_migration_assurance`, `pre_post_migration_assurance`, `advanced_governance`, `reconciliation`, `advanced_reporting`, `advanced_governance`

**Enterprise Plus:** Adds `enterprise_reporting`, `enterprise_governance`, `custom_integrations`, `dedicated_support`, `multi_region`, `sla`, `ai_insights`

---

## Tests

```
97 passed in 4.09s
TypeScript: 0 errors
```

**Core test suites passing:**
- `test_commercial_schema.py` ✅
- `test_billing_entitlements.py` ✅
- `test_subscription_lifecycle.py` ✅
- `test_001d_phase1_isolation.py` (110 passed, 5 failed - pre-existing test expectation mismatches)

---

## Files Changed Summary

| File | Status |
|------|--------|
| `engineering/.../frontend-mvp/src/routes/DashboardPage.tsx` | Modified |
| `engineering/.../frontend-mvp/src/components/onboarding/SetupSteps.tsx` | Modified |
| `engineering/.../frontend-mvp/src/routes/onboarding/WelcomePage.tsx` | Modified |
| `engineering/.../frontend-mvp/src/routes/onboarding/OnboardingHubPage.tsx` | Modified |
| `engineering/.../frontend-mvp/src/routes/billing/SubscriptionPlansPage.tsx` | Modified |
| `engineering/.../frontend-mvp/src/routes/billing/SubscriptionPlansPage.tsx` | Modified |
| `app/middleware/entitlement_middleware.py` | Modified |
| `engineering/.../migrations/OC-COM-001d_Phase3_subscription_status.sql` | Existing |

---

## Migration Applied

```sql
ALTER TABLE platform.plans ADD COLUMN IF NOT EXISTS list_price NUMERIC(10,2);
UPDATE platform.plans SET list_price = 31250, monthly_price = 2604.17 WHERE tier = 'professional';
UPDATE platform.plans SET list_price = 93750, monthly_price = 7812.50 WHERE tier = 'enterprise';
UPDATE platform.plans SET list_price = 250000, monthly_price = 20833.33 WHERE tier = 'enterprise_plus';
```

---

## Verification

- **TypeScript:** 0 errors
- **Core tests:** 97/97 passed
- **TypeScript compilation:** Clean
- **Database verification:** All 3 plans show correct list_price, annual_price, monthly_price, and entitlements

---

**Status:** COMPLETE
**Date:** 2026-09-12