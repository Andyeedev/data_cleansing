# Connection Layout — Option C: Full Diagnostic Page

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Connection Diagnostics                                        │
│  Full diagnostic view with health checks and connection profiling │
│  [Tenant Filter ▼]  [Export PDF]  [Schedule Recurring]     │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Systems: 7  |  Healthy: 6  |  Unhealthy: 1         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Run Full Diagnostic]  [Refresh]  [Export Report]     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Health Check Results ───────────────────────────────┐ │
│  │  System: my-postgres-prod                               │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│ │
│  │  │ Network  │ │ Auth     │ │ SSL      │ │ Version  ││ │
│  │  │ ✅ 12ms  │ │ ✅ OK    │ │ ✅ Valid │ │ ✅ PG 15.2││ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐              ││ │
│  │  │ Pool     │ │ Query    │ │ Uptime   │              ││ │
│  │  │ ✅ 3/10  │ │ ✅ 2ms   │ │ ✅ 99.97%│              ││ │
│  │  └──────────┘ └──────────┘ └──────────┘              ││ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Connection Profile ──────────────────────────────────┐ │
│  │  Max Connections: 100/100  │  Active: 3  │  Idle: 7  │ │
│  │  Avg Query Time: 42ms     │  Uptime: 99.97%          │ │
│  │  ────────────────────────────────────────────────────── │ │
│  │  ┌───────────────────────────────────────────────────┐ │ │
│  │  │  Last 10 Test Results                              │ │ │
│  │  │  Date         │ Status │ Latency │ Version        │ │ │
│  │  │  ──────────────┼────────┼─────────┼─────────────│ │ │
│  │  │  Aug 3 14:32  │  ✅    │ 42ms    │ PG 15.2      │ │ │
│  │  │  Aug 3 12:15  │  ❌    │ timeout │ —             │ │ │
│  │  │  Aug 2 09:00  │  ✅    │ 45ms    │ PG 15.2      │ │ │
│  │  │  ... (8 more rows)                                   │ │ │
│  │  └───────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter + action buttons (top-right)
- **KPI Cards:** 3 cards — Systems count, Healthy count, Unhealthy count
- **Action Bar:** Run Full Diagnostic, Refresh, Export Report
- **Main Content (top):** Health check results grid — 6 sub-checks in a 3×2 grid
- **Main Content (bottom):** Connection profile card with test history table
- **Detail Panel:** Test history table spans full width below the profile card

## Dimensions

- KPI cards: `grid grid-cols-3`, each card `min-height: 70px`
- Health check grid: `grid grid-cols-3`, 3×2 grid of check results
- Connection profile: Full width, `padding: var(--space-lg)`
- Test history table: Full width, `max-height: 300px`, `overflow-y: auto`
- Health check cards: Each `min-height: 60px`, with colored status icon

## Navigation

- Tenant filter applies to all data
- "Run Full Diagnostic" triggers all 6 health checks
- Each health check shows pass/fail with latency/result
- "Refresh" reloads all data
- "Export Report" generates PDF/JSON
- Test history table is sortable by column

## Pros
- Comprehensive diagnostic view
- All health checks visible in a grid
- Connection profile provides operational metrics
- Test history table provides full audit trail
- Consistent layout pattern with KPI cards at top, details below
- Exportable for compliance reporting

## Cons
- Most complex layout to implement
- Health check grid may feel dense
- Many API calls needed for full diagnostic
- Overkill for simple connection verification
- Higher development effort
- Full page may require significant scrolling

## Breakpoint Behavior
- Desktop: Full layout, all sections visible
- Tablet: Health check grid wraps, profile and table stack
- Mobile: Single column, all sections stack vertically