# Connection Layout — Option A: Compact Card

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Connection Test                                                │
│  Verify connectivity to source and target systems            │
│  [Tenant Filter ▼]                                          │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Tests Run: 24  |  Pass Rate: 96%  |  Avg Latency: 42ms │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Test Connection]  [View History]  [Export Results]  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ System Config ──────────────────────────────────────┐ │
│  │  System: my-postgres-prod                              │ │
│  │  DB Type: PostgreSQL 15.2  |  Host: db.example.com │ │
│  │  Status: ● Connected  |  Latency: 42ms              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Test Result Detail ─────────────────────────────────┐ │
│  │  Version: PostgreSQL 15.2                             │ │
│  │  Capabilities: transactions, savepoints, ssl         │ │
│  │  Last 3 Tests:  ✅ 38ms  ✅ 45ms  ❌ timeout          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter (top-right)
- **KPI Cards:** 3 cards — Tests Run, Pass Rate, Avg Latency
- **Action Bar:** Test Connection button + View History + Export
- **Main Content:** System configuration card with current connection status
- **Detail Panel:** Test result detail with last 3 test history inline

## Dimensions

- KPI cards: `grid grid-cols-3`, each card `min-height: 70px`
- System config card: Full width, `padding: var(--space-lg)`
- Detail panel: Full width, `border-top` separator
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all data
- "Test Connection" triggers a test run
- "View History" expands the detail panel or opens a modal
- "Export Results" downloads test history as CSV/JSON
- Click a system card to select it for testing

## Pros
- Compact, efficient use of space
- All key info visible without scrolling
- Test history inline — no separate page
- Consistent with the recommended layout pattern
- Fast to implement

## Cons
- Limited space for detailed diagnostics
- No visual chart or graph
- Test history is truncated (last 3 only)
- Less suitable for admin debugging workflows

## Breakpoint Behavior
- Desktop: All sections visible, KPI cards in a row
- Tablet: KPI cards stack, system config and detail stack
- Mobile: Single column, all sections stack vertically