# Validation Design — Option A: Tab-Based Dashboard (Current Governance Style)

## Concept
A tab-based governance dashboard with metric cards, compliance status, risk scoring, and audit logs. Follows the existing GovernancePage pattern closely.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Validation & Governance                          │
│  Compliance, risk scoring, release gates         │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Overview] [Compliance] [Controls] [Exceptions]│
│  [Risk]     [Audit]                             │
│                                                 │
│  ── Tab Content ────────────────────────────── │
│                                                 │
│  Overview:                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Compliance│ │ Total    │ │ Passed   │       │
│  │ Score     │ │ Controls │ │ Controls │       │
│  │ 87%       │ │ 150      │ │ 131      │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Failed   │ │ High Risk│ │ Medium   │       │
│  │ Controls │ │ Batches  │ │ Risk     │       │
│  │ 5        │ │ 3        │ │ 8        │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  Compliance tab: Score breakdown, pass/fail    │
│  Controls tab: Active rule list                │
│  Exceptions tab: Exception requests            │
│  Risk tab: Risk scores table + unscored batches│
│  Audit tab: Audit log with search/filter      │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Key Behaviors

- **Tab navigation** — 6 tabs: Overview, Compliance, Controls, Exceptions, Risk, Audit
- **Metric cards** — KPI cards at top of Overview tab
- **Compliance breakdown** — Score, total controls, passed, failed
- **Risk scoring** — Sortable table with batch ID, risk index, risk level, failure rate, pass rate
- **Unscored batches** — Expandable section for batches without risk scores
- **Orphaned records** — Expandable section for orphaned batch records
- **Audit log** — Searchable, filterable audit trail
- **Tenant filter** — TenantFilter component at top right of tab bar
- **Pagination** — Page size options (10, 50, 100) for tables

## Visual Design

- Follows existing GovernancePage.tsx patterns exactly
- Uses `TabBar`, `MetricCard`, `StatusBadge`, `SearchBar`, `TenantFilter`
- Uses `Pagination` component for table navigation
- Uses `LoadingSkeleton` for loading states
- Uses `EmptyState` for empty data states
- Uses `ErrorState` for error states
- Uses `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)` tokens
- Uses inline `style` props consistent with existing codebase

## Props Interface

```tsx
interface ValidationPageProps {
  // No props — uses hooks internally
}
```

## Hooks Used

- `useAuth()` — for role-based access control
- `useLocation`, `useNavigate` — for tab routing
- `apiGet` — for fetching governance data

## API Endpoints

```
GET  /governance/compliance              — compliance status
GET  /governance/controls                — active controls list
GET  /governance/exceptions              — exception requests
GET  /execution/risk-scores              — risk scores with pagination
GET  /execution/unscored-batches         — batches without scores
GET  /execution/orphaned-batches         — orphaned records
GET  /governance/audit?limit=50          — audit log entries
```

## Pros
- Familiar to users — matches existing GovernancePage
- Comprehensive coverage of validation and governance
- Tab-based navigation keeps interface organized
- Metric cards give quick health overview
- Pagination handles large datasets
- Tenant filtering for multi-tenant environments

## Cons
- Dense interface with many tabs
- Can feel overwhelming for new users
- No visual charting or graphs
- Risk table is text-heavy
- No real-time updates (requires manual refresh)
- Audit log search is basic

## When to Use
- When governance and compliance are primary concerns
- Teams that need detailed audit trails
- Multi-tenant environments with tenant filtering
- When risk scoring is a key requirement
- Existing governance workflows that need frontend continuation