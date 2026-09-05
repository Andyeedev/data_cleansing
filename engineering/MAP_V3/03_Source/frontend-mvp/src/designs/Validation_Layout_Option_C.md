# Validation Layout — Option C: Split View (Chart + Table)

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Validation Overview     [Tenant Filter ▼]  [Refresh] [Export PDF] │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Compliance: 87%  |  Passed: 131  |  Failed: 5  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Refresh]  [Export PDF]  [Export CSV]                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Health Overview ──────┐  ┌─ Detailed Data ──────────────────┐│
│  │                            │  │                                      ││
│  │  ┌─ Compliance Gauge ──┐ │  │  Control Results by Category  │ │
│  │  │  ╭────────────────╮ │ │  │  ┌──────────┬──────┬───────┬─────┐│ │
│  │  │  │     87%        │ │ │  │  │ Category │ Pass │ Fail  │ Rate│ │
│  │  │  ╰────────────────╯ │ │  │  ├──────────┼──────┼───────┼─────┤│ │
│  │  │                        │ │  │  │ Data Int │ 45   │ 0     │100%│ │
│  │  │  Health Score: 87%    │ │  │  │ Schema   │ 32   │ 1     │96.9%│ │
│  │  │  Pass Rate: 83.9%      │ │  │  │ Referent │ 28   │ 2     │93.3%│ │
│  │  │  Total Controls: 156     │ │  │  │ Data Type│ 18   │ 0     │100%│ │
│  │  │  Passed: 131              │ │  │  │ Business │ 8    │ 2     │80.0%│ │
│  │  │  Failed: 5                │ │  │  └──────────┴──────┴───────┴─────┘│ │
│  │  │  Risk Level: MEDIUM       │ │  │                                      ││
│  │  │                            │  │  ┌─ Failed Controls Detail ──────┐│ │
│  │  │  ┌─ Risk Distribution ─┐ │ │  │  ┌──────────┬──────────────┬─────┐│ │
│  │  │  │ HIGH   ████  3      │ │ │  │  │ Control  │ Description  │ Error│ │
│  │  │  │ MEDIUM ████████  8  │ │ │  │  ├──────────┼──────────────┼─────┤│ │
│  │  │  │ LOW    ████████████████████████████████████████████████ 135│ │
│  │  │  │                        │ │ │  │  │ RC-042   │ FK constraint│ 3 or │ │
│  │  │  │  [Bar Chart]          │ │ │  │  │ RC-043   │ NOT NULL viol│ 2    │ │
│  │  │  │                        │ │ │  │  │ BR-011   │ Business rule│ stat │ │
│  │  │  └────────────────────────┘ │ │  │  │ BR-012   │ Business rule│ amt  │ │
│  │  │                            │ │ │  │  │ SC-007   │ Schema mismatch│ type│ │
│  │  └──────────────────────────────┘ │ │  │  └──────────┴──────────────┴─────┘│ │
│  │                                    │ │  │                                      ││
│  │  [View Full Report]  [Export CSV]  │ │  │  [View Full Report]  [Export CSV]   │ │
│  └────────────────────────────────────┘ └──────────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + tenant filter + action buttons (top-right)
- **KPI Cards:** 3 cards — Compliance, Passed, Failed
- **Action Bar:** Refresh, Export PDF, Export CSV
- **Main Content (left):** Health overview — compliance gauge + risk distribution chart
- **Main Content (right):** Detailed data — control results table + failed controls detail
- **Footer:** View Full Report and Export CSV buttons

## Dimensions

- KPI cards: `grid grid-cols-3`, each card `min-height: 70px`
- Left panel: `width: 45%`, `min-width: 350px`
- Right panel: `flex: 1`, `min-width: 400px`
- Gauge: `200px` diameter
- Risk chart: Full width of left panel, `height: 150px`
- Control results table: Full width of right panel
- Failed controls detail: Full width of right panel, `max-height: 200px`, `overflow-y: auto`
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all panels
- Refresh button reloads all panels
- Click a category row to filter the gauge
- Click a failed control row to see full error details
- "View Full Report" opens a printable report (Validation Design Option C)
- "Export CSV" downloads the control results

## Pros
- Split view shows overview and detail simultaneously
- No tab switching needed
- Chart + table combination is informative
- Failed controls are immediately visible
- Export options for sharing
- Professional, balanced layout
- Consistent layout pattern maintained

## Cons
- Two-panel layout can feel rigid
- Left panel may be too narrow for charts on small screens
- Right panel can be long with many failed controls
- No real-time updates without manual refresh
- Less flexible than tab-based layout
- Higher development effort for chart components

## Breakpoint Behavior
- Desktop: Two panels side by side
- Tablet: Panels stack vertically, left panel on top
- Mobile: Single column, all content stacks