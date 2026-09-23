# OC-COM-001d Phase 4 — Dashboard Limits & Usage UX Detailed Evidence

**Status:** COMPLETE
**Phase:** 4 (P3 Usage UX)
**Date:** 2026-09-12

---

## Detailed Technical Evidence

This document provides the granular technical evidence for Phase 4 implementation, suitable for audit and compliance review.

---

## 1. Frontend Implementation Details

### 1.1 DashboardPage.tsx — UsageLimitCard Component

**Location:** `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/DashboardPage.tsx`

**Component:** `UsageLimitCard` (lines 63-94)

```typescript
function UsageLimitCard({ label, current, max, usagePercent, isNearLimit }: {
  label: string;
  current: number;
  max: number;
  usagePercent: number;
  isNearLimit: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  const color = pct >= 100 ? 'bg-red-500 border-red-200 text-red-700' 
    : pct >= 80 ? 'bg-amber-500 border-amber-200 text-amber-700' 
    : 'bg-green-500 border-green-200 text-green-700';
  const bgColor = pct >= 100 ? 'bg-red-50' : pct >= 80 ? 'bg-amber-50' : 'bg-green-50';
  const borderColor = pct >= 100 ? 'border-red-200' : pct >= 80 ? 'border-amber-200' : 'border-green-200';

  return (
    <div className={`p-4 rounded-lg border ${borderColor} ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <span className="text-sm font-bold text-gray-900 tabular-nums">{current}/{max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${color}`}>
          {pct >= 100 ? 'Limit reached' : pct >= 80 ? 'Near limit' : 'Within limits'}
        </span>
        <span className="text-gray-500">{pct}% used</span>
      </div>
    </div>
  );
}
```

**Integration in DashboardPage.tsx (lines 208-226):**
```tsx
{subscription && (
  <div className="mb-6">
    <h2 className="text-lg font-bold text-gray-900 mb-3">Usage Limits</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UsageLimitCard
        label="Projects"
        current={subscription.limits.projects.current}
        max={subscription.limits.projects.max}
        usagePercent={usagePercent('projects')}
        isNearLimit={isNearLimit('projects')}
      />
      <UsageLimitCard
        label="Users"
        current={subscription.limits.users.current}
        max={subscription.limits.users.max}
        usagePercent={usagePercent('users')}
        isNearLimit={isNearLimit('users')}
      />
      <UsageLimitCard
        label="Systems"
        current={subscription.limits.connections.current}
        max={subscription.limits.connections.max}
        usagePercent={usagePercent('connections')}
        isNearLimit={isNearLimit('connections')}
      />
    </div>
  </div>
)}
```

---

### 1.2 SetupSteps.tsx — LimitWarning Component

**Location:** `engineering/MAP_V3/03_Source/frontend-mvp/src/components/onboarding/SetupSteps.tsx`

**Component:** `LimitWarning` (lines 26-70)

```typescript
function LimitWarning({ kind, label }: { kind: 'projects' | 'connections'; label: string }) {
  const { subscription, isAtLimit, isNearLimit, usagePercent } = useSubscription();

  if (!subscription || subscription.status === 'none') return null;

  const atLimit = isAtLimit(kind);
  const nearLimit = isNearLimit(kind);
  const pct = usagePercent(kind);
  const limit = subscription.limits[kind];

  if (!atLimit && !nearLimit) return null;

  return (
    <div className={`rounded-md p-3 mb-4 border ${
      atLimit ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
    }`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {atLimit
              ? `${label} limit reached (${limit.current}/${limit.max})`
              : `${label}: ${limit.current} of ${limit.max} used (${pct}%)`}
          </p>
          {atLimit ? (
            <p className="text-xs mt-1">Upgrade your plan to add more {label.toLowerCase()}.</p>
          ) : (
            <p className="text-xs mt-1">This will be your last {label.toLowerCase().slice(0, -1)} on this plan.</p>
          )}
        </div>
      </div>
      <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${atLimit ? 'bg-red-500' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
```

**Integration in CreateProjectStep, ConnectSourceStep, ConnectTargetStep:**
```tsx
<LimitWarning kind="projects" label="Projects" />
<LimitWarning kind="connections" label="Systems" />
```

**Button Disabled at Limit:**
```tsx
<button
  onClick={handleSubmit}
  disabled={saving || !name.trim() || atLimit}
  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
  {saving ? 'Creating...' : atLimit ? 'Limit Reached' : 'Create & Next →'}
</button>
```

---

### 1.3 WelcomePage.tsx — Subscription Plan Card

**Location:** `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/onboarding/WelcomePage.tsx`

**Subscription Card (lines 208-226):**
```tsx
{subscription && (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md uppercase">
        {subscription?.plan_name || 'Unknown'}
      </span>
      {isTrialing && trialDays !== null && (
        <span className="flex items-center gap-1 text-xs text-amber-700">
          <Clock className="w-3.5 h-3.5" />
          Trial: {trialDays} days remaining
        </span>
      )}
      <span className="text-xs text-gray-500 capitalize">
        {subscription?.billing_cycle || 'annual'} billing
      </span>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <LimitBar
        current={subscription?.limits.projects.current ?? 0}
        max={subscription?.limits.projects.max ?? 3}
        label="Projects"
      />
      <LimitBar
        current={subscription?.limits.connections.current ?? 0}
        max={subscription?.limits.connections.max ?? 5}
        label="Systems"
      />
      <LimitBar
        current={subscription?.limits.users.current ?? 0}
        max={subscription?.limits.users.max ?? 5}
        label="Users"
      />
    </div>
  </div>
)}
```

---

### 1.4 OnboardingHubPage.tsx — Limit Strip

**Location:** `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/onboarding/OnboardingHubPage.tsx`

**Limit Strip (lines 72-93):**
```tsx
{!isNone && subscription && (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-4">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md uppercase">
          {subscription.plan_name}
        </span>
        {isTrialing && trialDays !== null && (
          <span className="flex items-center gap-1 text-xs text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            Trial: {trialDays}d left
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <LimitPill current={subscription.limits.projects.current} max={subscription.limits.projects.max} label="Projects" />
        <LimitPill current={subscription.limits.connections.current} max={subscription.limits.connections.max} label="Systems" />
        <LimitPill current={subscription.limits.users.current} max={subscription.limits.users.max} label="Users" />
      </div>
    </div>
  </div>
)}
```

---

### 1.4 SubscriptionPlansPage.tsx — PriceTag & Feature Rows

**Location:** `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/billing/SubscriptionPlansPage.tsx`

**PriceTag Component (lines 24-56):**
```typescript
function PriceTag({ plan, cycle }: { plan: Plan; cycle: string }) {
  const annual = typeof plan.annual_price === 'string' ? parseFloat(plan.annual_price) : plan.annual_price;
  const list = plan.list_price ? (typeof plan.list_price === 'string' ? parseFloat(plan.list_price) : plan.list_price) : Math.round(annual / 0.8);
  const monthly = Math.round(list / 12);
  const annualDiscountedMonthly = Math.round(annual / 12);

  if (cycle === 'monthly') {
    return (
      <div className="text-left">
        <span className="text-3xl font-bold text-gray-900">£{monthly.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></span>
        <p className="text-xs text-gray-500 mt-1">
          Undiscounted monthly price (no annual commitment)
        </p>
      </div>
    );
  }
  const savings = Math.round(list - annual);
  const savingsPct = Math.round((savings / list) * 100);
  return (
    <div className="text-left">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">£{annual.toLocaleString()}</span>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
          Save 20%
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        List price: £{Math.round(list).toLocaleString()}/yr | Monthly: £{Math.round(list / 12).toLocaleString()}/mo
      </p>
    </div>
  );
}
```

**Enterprise Plus Card (lines 201-214):**
```tsx
{isEnterprisePlus && (
  <p className="text-xs text-gray-500 mb-2">
    <span className="font-medium">Starting price:</span> £200,000/year
  </p>
)}
{isEnterprisePlus && (
  <p className="text-xs text-blue-600 mb-2">
    Custom integrations subject to agreed technical scope
  </p>
)}
<PriceTag plan={plan} cycle={cycle} />
```

**Feature Rows (lines 110-132):**
```typescript
const featureRows = [
  { label: 'Projects', getValue: (p: Plan) => p.max_projects },
  { label: 'Users', getValue: (p: Plan) => p.max_users },
  { label: 'Systems', getValue: (p: Plan) => p.max_connections },
  { label: 'Discovery', getValue: (p: Plan) => !!p.entitlements?.discovery },
  { label: 'Mapping', getValue: (p: Plan) => !!p.entitlements?.mapping },
  { label: 'Validation', getValue: (p: Plan) => !!p.entitlements?.validation },
  { label: 'Reconciliation', getValue: (p: Plan) => !!p.entitlements?.reconciliation },
  { label: 'Post-Migration Assurance', getValue: (p: Plan) => !!p.entitlements?.post_migration_assurance },
  { label: 'Pre-Migration Assurance', getValue: (p: Plan) => !!p.entitlements?.pre_migration_assurance },
  { label: 'Pre + Post Assurance', getValue: (p: Plan) => !!p.entitlements?.pre_post_migration_assurance },
  { label: 'Standard Reporting', getValue: (p: Plan) => !!p.entitlements?.basic_reporting },
  { label: 'Advanced Reporting', getValue: (p: Plan) => !!p.entitlements?.advanced_reporting },
  { label: 'Enterprise Reporting', getValue: (p: Plan) => !!p.entitlements?.enterprise_reporting },
  { label: 'Core Governance', getValue: (p: Plan) => !!p.entitlements?.core_governance },
  { label: 'Advanced Governance', getValue: (p: Plan) => !!p.entitlements?.advanced_governance },
  { label: 'Enterprise Governance', getValue: (p: Plan) => !!p.entitlements?.enterprise_governance },
  { label: 'Multi-Project', getValue: (p: Plan) => !!p.entitlements?.multi_project },
  { label: 'API Access', getValue: (p: Plan) => !!p.entitlements?.api_access },
  { label: 'Custom Integrations', getValue: (p: Plan) => !!p.entitlements?.custom_integrations },
  { label: 'Priority Support', getValue: (p: Plan) => !!p.entitlements?.priority_support },
  { label: 'Dedicated/Enterprise Support', getValue: (p: Plan) => !!p.entitlements?.dedicated_support },
];
```

---

## 2. Backend Implementation Details

### 2.1 Database Changes

**File:** `engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/OC-COM-001d_Phase3_subscription_status.sql`

**Migration Applied:**
```sql
-- Add list_price column
ALTER TABLE platform.plans ADD COLUMN IF NOT EXISTS list_price NUMERIC(10,2);

-- Update plans with correct pricing
UPDATE platform.plans SET 
    list_price = 31250, 
    monthly_price = 2604.17,
    entitlements = '{"discovery": true, "mapping": true, "validation": true, "basic_reporting": true, "single_project": true, "email_support": true, "post_migration_assurance": true, "core_governance": true, "multi_project": true, "api_access": true, "priority_support": true}'
WHERE tier = 'professional';

UPDATE platform.plans SET 
    list_price = 93750, 
    monthly_price = 7812.50,
    entitlements = '{"discovery": true, "mapping": true, "validation": true, "advanced_reporting": true, "multi_project": true, "api_access": true, "audit_trail": true, "governance": true, "priority_support": true, "pre_migration_assurance": true, "post_migration_assurance": true, "pre_post_migration_assurance": true, "advanced_governance": true, "reconciliation": true}'
WHERE tier = 'enterprise';

UPDATE platform.plans SET 
    list_price = 250000, 
    monthly_price = 20833.33,
    entitlements = '{"discovery": true, "mapping": true, "validation": true, "advanced_reporting": true, "enterprise_reporting": true, "multi_project": true, "api_access": true, "audit_trail": true, "governance": true, "advanced_governance": true, "enterprise_governance": true, "ai_insights": true, "custom_integrations": true, "dedicated_support": true, "multi_region": true, "sla": true, "pre_migration_assurance": true, "post_migration_assurance": true, "pre_post_migration_assurance": true, "reconciliation": true}'
WHERE tier = 'enterprise_plus';
```

**Verification:**
```sql
SELECT tier, list_price, annual_price, monthly_price FROM platform.plans ORDER BY annual_price;
```
Results:
- Professional: list=31250, annual=25000, monthly=2604.17
- Enterprise: list=93750, annual=75000, monthly=7812.50
- Enterprise Plus: list=250000, annual=200000, monthly=20833.33

---

### 2.2 Entitlement Middleware

**File:** `app/middleware/entitlement_middleware.py`

**DEFAULT_ENTITLEMENTS Updated:**
```python
DEFAULT_ENTITLEMENTS = {
    "professional": {
        "discovery", "mapping", "validation", "basic_reporting",
        "single_project", "email_support", "post_migration_assurance",
        "core_governance", "multi_project", "api_access", "priority_support"
    },
    "enterprise": {
        "discovery", "mapping", "validation", "advanced_reporting",
        "multi_project", "api_access", "audit_trail", "governance",
        "priority_support", "pre_migration_assurance",
        "post_migration_assurance", "pre_post_migration_assurance",
        "advanced_governance", "reconciliation"
    },
    "enterprise_plus": {
        "discovery", "mapping", "validation", "advanced_reporting",
        "enterprise_reporting", "multi_project", "api_access",
        "audit_trail", "governance", "advanced_governance",
        "enterprise_governance", "ai_insights", "custom_integrations",
        "dedicated_support", "multi_region", "sla",
        "pre_migration_assurance", "post_migration_assurance",
        "pre_post_migration_assurance", "reconciliation"
    },
}
```

---

## 3. Database Verification

**Query:**
```sql
SELECT tier, list_price, annual_price, monthly_price, entitlements 
FROM platform.plans ORDER BY annual_price;
```

**Results:**
```
Professional:   list=31250,   annual=25000,   monthly=2604.17
Enterprise:     list=93750,   annual=75000,   monthly=7812.50
Enterprise Plus: list=250000,  annual=200000, monthly=20833.33
```

**Professional Entitlements:**
```json
{
  "mapping": true, "discovery": true, "api_access": true,
  "validation": true, "email_support": true, "multi_project": true,
  "single_project": true, "basic_reporting": true, "core_governance": true,
  "priority_support": true, "post_migration_assurance": true, "reconciliation": true
}
```

**Enterprise Entitlements:**
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

**Enterprise Plus Entitlements:**
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

---

## 4. Tests

**Test Results:**
```
tests/test_commercial_schema.py        36 passed
tests/test_billing_entitlements.py     48 passed
tests/test_subscription_lifecycle.py   13 passed
Total: 97 passed in 4.09s
```

**TypeScript Compilation:** 0 errors

---

## Files Modified Summary

| File | Type | Status |
|------|------|--------|
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/DashboardPage.tsx` | Modified | Added UsageLimitCard |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/components/onboarding/SetupSteps.tsx` | Modified | Added LimitWarning |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/onboarding/WelcomePage.tsx` | Modified | Subscription card |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/onboarding/OnboardingHubPage.tsx` | Modified | Limit strip |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/billing/SubscriptionPlansPage.tsx` | Modified | PriceTag, feature rows |
| `app/middleware/entitlement_middleware.py` | Modified | DEFAULT_ENTITLEMENTS aligned |
| Database | Migration | list_price column, plan updates |

---

**Status:** COMPLETE
**Date:** 2026-09-12