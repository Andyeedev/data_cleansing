# Migration Design — Option A: Current Execution + History Tabs

## Concept
The current MigrationPage design with two tabs: Execution (run migrations, view KPI cards, see recent runs) and History (full execution history with search, filter, and pagination). This is the existing working design.

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Migration                                                        │
│  Execute migration runs, monitor progress, review past runs    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Execution] [History]          [Tenant Filter ▼]              │
│                                                                 │
│  ── Execution Tab ─────────────────────────────────────────── │
│                                                                 │
│  ┌─ KPI Cards ──────────────────────────────────────────────┐ │
│  │  Running: 2  │  Completed Today: 15  │  Failed: 1      │ │
│  │  Scheduled Today: 3                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Start Migration ▼]  [Stop All]                               │
│                                                                 │
│  ┌─ Confirm Migration Modal ──────────────────────────────┐ │
│  │  Tenant: [Select ▼]                                     │ │
│  │  Project: [Select ▼]                                    │ │
│  │  Project ID (manual): [____________]                    │ │
│  │  Mode: (○) Full Validation  (○) Quick Health Check     │ │
│  │  Status: 2 Running | 15 Completed | 1 Failed          │ │
│  │  Est. time: ~5 minutes                                  │ │
│  │  [Cancel]  [Start Execution]                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ── History Tab ──────────────────────────────────────────── │
│                                                                 │
│  [Search] [Status: All ▼] [Rows: 10 ▼]                       │
│                                                                 │
│  Batch ID    │ Status    │ Controls │ Completed │ Failed │ Started │
│  ────────────┼───────────┼──────────┼───────────┼────────┼─────────│
│  abc123...   │ ✅ COMPLETED│ 50      │ 50        │ 0      │ Aug 3   │
│  def456...   │ ❌ FAILED  │ 50      │ 32        │ 18     │ Aug 3   │
│  ghi789...   │ 🔄 RUNNING │ 50      │ 23        │ 0      │ Aug 3   │
│                                                                 │
│  Showing 1-10 of 47 rows  [Previous] [1] [2] [3] [Next]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Two tabs** — Execution and History, toggled via TabBar
- **Tenant filter** — TenantFilter component at top right of tab bar
- **KPI cards** — 4 cards: Running, Completed Today, Failed Today, Scheduled Today
- **Start Migration button** — Opens confirmation modal
- **Confirmation modal** — Tenant select, project select, manual project ID, execution mode (full/quick), status summary, estimated time
- **Modal error handling** — Stays open on error, shows validation errors, clears on input change
- **Stop All button** — Stops all running migrations (disabled when nothing running)
- **History table** — Sortable columns, search, status filter, pagination
- **Status filter** — All, COMPLETED, RUNNING, FAILED
- **Page size** — 10, 50, 100 rows

## Visual Design

- Follows existing MigrationPage.tsx patterns exactly
- Uses `TabBar`, `StatusBadge`, `ProgressBar`, `EmptyState`, `ErrorState`, `LoadingSkeleton`
- Uses `SearchBar`, `TenantFilter`, `Modal`, `Toast`
- Uses `useMigrationTenants`, `useMigrationProjects` hooks
- Uses inline `style` props consistent with existing codebase
- Uses `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)`, `var(--color-info)` tokens
- Uses `var(--space-lg)`, `var(--color-border)`, `var(--radius-md)` tokens

## Props Interface

```tsx
interface MigrationPageProps {
  // No props — uses hooks internally
}
```

## API Endpoints

```
GET  /migration/schedules?project_id={id}&limit=1    — get schedule for project
POST /migration/schedules/{schedule_id}/run          — trigger migration run
GET  /execution/history/status-breakdown?tenant_id={id} — KPI card data
GET  /execution/history?page={n}&tenant_id={id}&status={s}&search={q}&sort={f}&dir={d} — history list
GET  /migration/projects/tenants                     — tenant list
GET  /migration/projects?tenant_id={id}              — project list for tenant
```

## Pros
- Familiar to users — matches current working implementation
- Comprehensive execution workflow with confirmation modal
- KPI cards provide quick health overview
- History table is sortable, searchable, and filterable
- Tenant filtering for multi-tenant environments
- Modal error handling keeps users informed
- Execution mode selection (full vs quick) adds flexibility

## Cons
- Two-tab layout can feel separated
- No real-time progress during execution
- History table is text-heavy
- No visual charts or graphs
- Stop All button is a destructive action with no confirmation
- KPI cards only show today's data

## When to Use
- When the current working design meets user needs
- Quick implementation with minimal changes
- Teams familiar with the existing interface
- When execution + history in one view is sufficient