# Validation Layout — Option A: Tab-Based Dashboard

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Validation & Governance                                        │
│  Compliance, risk scoring, release gates, and approvals  │
│  [Tenant Filter ▼]                                               │
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
│  [Overview] [Compliance] [Controls] [Exceptions] [Risk] [Audit] │
│                                                                     │
│  ── Tab Content ────────────────────────────────────────────── │
│                                                                     │
│  Overview:                                                                      │
│  ┌─ Compliance Gauge ──────┐  ┌─ Risk Distribution ──────────────┐  │
│  │  ╭────────────────╮     │  │  ████████████████████  HIGH: 3  │  │
│  │  │     87%        │     │  │  ████████████████████████ MEDIUM: 8│ │
│  │  ╰────────────────╯     │  │  ██████████████████████████████████ LOW: 135│
│  │  Pass Rate: 83.9%        │  │                                        │  │
│  └───────────────────────────┘  └────────────────────────────────────┘  │
│                                                                     │
│  ┌─ Recent Runs ────────────────────────────────────────────┐ │
│  │  Batch ID    │ Status │ Risk │ Completed │ Failed │ Started │ │
│  │  ────────────┼────────┼──────┼───────────┼────────┼──────────│ │
│  │  abc123...   │ ✅      │ LOW  │ 50/50     │ 0      │ Aug 3   │ │
│  │  def456...   │ ❌      │ HIGH │ 32/50     │ 18     │ Aug 3   │ │
│  │  ghi789...   │ 🔄      │ MED  │ 23/50     │ 0      │ Aug 3   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter (top-right)
- **KPI Cards:** 3 cards — Compliance Score, Passed Controls, Failed Controls
- **Action Bar:** Refresh, Export PDF, Export CSV
- **Tab Bar:** 6 tabs — Overview, Compliance, Controls, Exceptions, Risk, Audit
- **Main Content:** Tab-specific content (charts, tables, lists)
- **Detail Panel:** Not applicable for tab-based layout (each tab is self-contained)

## Dimensions

- KPI cards: `grid grid-cols-3`, each card `min-height: 70px`
- Tab bar: Fixed height (`48px`)
- Content area: `flex: 1`, scrollable
- Compliance gauge: `200px` diameter
- Risk distribution: Full width, `height: 150px`
- Recent runs table: Full width, `max-height: 300px`, `overflow-y: auto`

## Navigation

- Tenant filter applies to all tabs
- Tab clicks switch content without page reload
- Refresh button reloads current tab data
- "Export PDF" generates printable report
- "Export CSV" downloads current tab data
- Click a batch row to drill into details

## Pros
- Familiar tab-based navigation
- All validation data in one place
- Metric cards give quick health overview
- Compliance gauge provides visual feedback
- Risk distribution is visually clear
- Each tab focused on a specific concern
- Tenant filtering works across all tabs
- Pagination handles large datasets
- Consistent layout pattern maintained

## Cons
- Tab switching can feel disconnected
- No simultaneous view of multiple data points
- Each tab loads independently (multiple API calls)
- Can feel dense with many tabs
- No real-time updates without manual refresh
- Audit log search is basic

## Breakpoint Behavior
- Desktop: Full tab layout, all tabs visible
- Tablet: Tabs scroll horizontally, content stacks
- Mobile: Tabs collapse to dropdown, content full-width