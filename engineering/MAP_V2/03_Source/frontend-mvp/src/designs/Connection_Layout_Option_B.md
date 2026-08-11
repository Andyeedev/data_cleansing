# Connection Layout — Option B: Chart + Detail Panel

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Connection Diagnostics                                        │
│  Monitor connection health across all registered systems     │
│  [Tenant Filter ▼]                                          │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Systems: 7  |  Connected: 6  |  Failed: 1           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Run Diagnostic]  [Refresh]  [Export Report]          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Health Chart ────────────────────┐  ┌─ System Detail ──────┐│
│  │  ┌─────────────────────────┐      │  │                        ││
│  │  │  Health Over Time       │      │  │  System: my-postgres   ││
│  │  │  ┌───────────────────┐  │      │  │  Type: PostgreSQL 15.2 ││
│  │  │  │ ▁▃▅▇▆▅▃▁         │  │      │  │  Host: db.example.com ││
│  │  │  │ 7 days            │  │      │  │  Status: ● Connected   ││
│  │  │  └───────────────────┘  │      │  │  Latency: 42ms         ││
│  │  │  Avg: 45ms  P95: 120ms │      │  │  Version: PG 15.2       ││
│  │  └─────────────────────────┘      │  │  Pool: 3/10 active      ││
│  │                                     │  │  SSL: ✅ Valid            ││
│  │  ┌─ Latency Distribution ──────┐  │  │  Uptime: 99.97%        ││
│  │  │  0-20ms: ████████████ 85%   │  │  │                        ││
│  │  │  20-50ms: ██ 10%            │  │  │  ── Last 5 Tests ──   ││
│  │  │  50-100ms: █ 3%             │  │  │  ✅ 38ms  ✅ 45ms      ││
│  │  │  100ms+: █ 2%               │  │  │  ❌ timeout  ✅ 42ms   ││
│  │  └─────────────────────────────┘  │  │  ✅ 45ms                  ││
│  └─────────────────────────────────────┘  └────────────────────────┘│
│                                                                 │
│  ┌─ Test History Table ──────────────────────────────────┐ │
│  │  Date         │ Status │ Latency │ Version │ Duration │ │
│  │  ──────────────┼────────┼─────────┼─────────┼──────────│ │
│  │  Aug 3 14:32  │  ✅    │ 42ms    │ PG 15.2 │ 1.2s     │ │
│  │  Aug 3 12:15  │  ❌    │ timeout │ —       │ 30s      │ │
│  │  Aug 2 09:00  │  ✅    │ 45ms    │ PG 15.2 │ 1.1s     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter (top-right)
- **KPI Cards:** 3 cards — Systems count, Connected count, Failed count
- **Action Bar:** Run Diagnostic, Refresh, Export Report
- **Main Content (top):** Two-column layout — Health chart (left) + System detail (right)
- **Main Content (bottom):** Test history table spanning full width
- **Detail Panel:** System detail panel with last 5 tests inline

## Dimensions

- KPI cards: `grid grid-cols-3`, each card `min-height: 70px`
- Chart panel: `width: 55%`, `height: 250px`
- Detail panel: `width: 45%`, `height: 250px`
- History table: Full width, `max-height: 250px`, `overflow-y: auto`
- Chart and detail panels: `display: grid`, `grid-template-columns: 55% 45%`

## Navigation

- Tenant filter applies to all data
- "Run Diagnostic" triggers a full diagnostic run
- Click a system in the chart to populate the detail panel
- "Refresh" reloads all data
- "Export Report" generates PDF/JSON
- History table is sortable by column

## Pros
- Visual health chart provides at-a-glance insight
- System detail panel shows comprehensive info
- Test history table provides full audit trail
- Two-column layout uses horizontal space efficiently
- Consistent layout pattern with charts at top, details below

## Cons
- More complex to implement (chart component needed)
- Two-column layout reduces space on narrow screens
- Chart and detail panels may not align perfectly
- Higher development effort
- Chart may be overkill for simple connection testing

## Breakpoint Behavior
- Desktop: Two-column chart + detail, full-width table below
- Tablet: Chart and detail stack vertically, table full-width
- Mobile: Single column, all sections stack