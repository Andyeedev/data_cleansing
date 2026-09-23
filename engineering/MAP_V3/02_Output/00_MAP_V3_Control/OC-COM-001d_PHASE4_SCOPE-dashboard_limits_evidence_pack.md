# OC-COM-001d Phase 4 — Dashboard Limits & Usage UX: Completion Evidence Pack

**Phase:** 4 (P3 Usage UX)  
**Status:** COMPLETE  
**Date:** 2026-09-12  
**Commit:** `02a1df51` (and subsequent)  
**Branch:** `feature/MAP_V3`  
**Status:** All tests passing, TypeScript clean, ready for Phase 5

---

## 1. What Was Implemented

### 1.1 Dashboard Usage Limit Cards
**File:** `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/DashboardPage.tsx`

- **UsageLimitCard component** (lines 63-94): Reusable card showing current/max, progress bar, status
- **Integration** (lines 208-226): 3 cards — Projects, Users, Systems
- **Progress bar colors:** Green (<80%), Amber (80-99%), Red (100%)
- **Status text:** "Within limits" / "Near limit" / "Limit reached"

### 1.2 Onboarding SetupSteps Limit Warnings
**File:** `engineering/MAP_V3/03_Source/frontend-mvp/src/components/onboarding/SetupSteps.tsx`

- **LimitWarning component** (lines 26-70): Reusable warning with progress bar
- **Applied to 3 steps:** CreateProject, ConnectSource, ConnectTarget
- **Amber warning at ≥80%:** Shows usage, progress bar, upgrade prompt
- **Red warning at 100%:** "Limit Reached", button disabled with "Limit Reached" label
- **Button state:** Disabled at 100% with appropriate label

### 1.3 WelcomePage Subscription Card
**File:** `.../routes/onboarding/WelcomePage.tsx`

- Plan badge, trial countdown, billing cycle
- Usage bars for Projects, Users, Systems (LimitBar component)

### 1.4 OnboardingHubPage Limit Strip
**File:** `.../routes/onboarding/OnboardingHubPage.tsx`

- Plan badge with trial countdown
- 3 limit pills (Projects/Users/Systems) with color coding

### 1.5 SubscriptionPlansPage Pricing Display
**File:** `.../routes/billing/SubscriptionPlansPage.tsx`

- **PriceTag component:** Annual shows "Save 20%" badge; Monthly shows undiscounted price
- **Monthly view:** "Undiscounted monthly price (no annual commitment)"
- **Annual view:** "Save 20%" badge + list price reference
- **Enterprise Plus:** "Starting price: £200,000/year" + custom integrations note
- **20% Annual Discount** removed from feature list (per requirement)

### 1.6 Pricing Model Correction
| Plan | List Price | Annual (20% off) | Monthly (List ÷ 12) |
|------|------------|------------------|---------------------|
| Professional | £31,250 | £25,000 | £2,604.17 |
| Enterprise | £93,750 | £75,000 | £7,812.50 |
| Enterprise Plus | £250,000 | £200,000 | £20,833.33 |

**Rule:** Monthly = List ÷ 12 (no discount). Annual = List × 0.8 (20% discount).

### 1.7 Database Changes
```sql
ALTER TABLE platform.plans ADD COLUMN IF NOT EXISTS list_price NUMERIC(10,2);
UPDATE platform.plans SET list_price = 31250, monthly_price = 2604.17 WHERE tier = 'professional';
UPDATE platform.plans SET list_price = 93750, monthly_price = 7812.50 WHERE tier = 'enterprise';
UPDATE platform.plans SET list_price = 250000, monthly_price = 20833.33 WHERE tier = 'enterprise_plus';
```

### 1.8 Entitlement Alignment
- Middleware `DEFAULT_ENTITLEMENTS` aligned with DB vocabulary
- Added: `pre_migration_assurance`, `post_migration_assurance`, `pre_post_migration_assurance`, `reconciliation`, `enterprise_reporting`, `enterprise_governance`, `custom_integrations`, `dedicated_support`
- Professional: `post_migration_assurance` only (no pre-migration)
- Enterprise/Plus: Pre + Post + Pre+Post assurance

---

## 2. Tests & Results

```
tests/test_commercial_schema.py        36 passed
tests/test_billing_entitlements.py     48 passed
tests/test_subscription_lifecycle.py   13 passed
Total: 97 passed in 4.09s
```

**TypeScript:** 0 errors (`npx tsc --noEmit`)

---

## 3. Files Changed

| File | Type |
|------|------|
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/DashboardPage.tsx` | Modified (UsageLimitCard) |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/components/onboarding/SetupSteps.tsx` | Modified (LimitWarning) |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/onboarding/WelcomePage.tsx` | Modified (subscription card) |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/onboarding/OnboardingHubPage.tsx` | Modified (limit strip) |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/billing/SubscriptionPlansPage.tsx` | Modified (PriceTag, feature rows) |
| `app/middleware/entitlement_middleware.py` | Modified (DEFAULT_ENTITLEMENTS) |
| Database migration | Applied (`list_price` column, plan updates) |

---

## 5. Commit / Status

| Item | Value |
|------|-------|
| **Branch** | `feature/MAP_V3` |
| **Latest Commit** | `02a1df51` (and subsequent) |
| **Status** | All changes uncommitted locally (per instruction) |
| **Tests** | 97/97 passed |
| **TypeScript** | 0 errors |

---

## 6. Outstanding Issues

| Issue | Status |
|-------|--------|
| Stripe `.env` with real test keys | Pending (user setup) |
| Stripe price IDs in config | Pending (needs Stripe Dashboard) |
| OC-COM-001e (Identity/Access) | HOLD (per directive) |
| Phase 5 (Suspension UX) | Next |

---

## Evidence Files Created

| File | Purpose |
|------|---------|
| `OC-COM-001d_PHASE4_SCOPE-dashboard_limits_checklist.md` | Checklist |
| `OC-COM-001d_PHASE4_SCOPE-dashboard_limits_evidence.md` | Evidence summary |
| `OC-COM-001d_PHASE4_SCOPE-dashboard_limits_evidence_detailed.md` | Detailed evidence |
| `OC-COM-001d_PHASE4_SCOPE-dashboard_limits_complete.md` | Completion marker |

---

**Location:** `engineering/MAP_V3/02_Output/00_MAP_V3_Control/`

---

**Status:** Phase 4 COMPLETE — Ready for Phase 5 approval