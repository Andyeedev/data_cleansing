# Validation Layout — Option B: Real-Time Dashboard Grid

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Validation Dashboard     🔴 Live    [Tenant Filter ▼]  [Refresh] [Export] │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Compliance: 87%  |  Passed: 131  |  Failed: 5  |  High Risk: 3  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Refresh]  [Export PDF]  [Export CSV]                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Compliance Gauge ──────┐  ┌─ Risk Distribution ──────────────┐  │
│  │  ╭────────────────╮     │  │  ████████████████████  HIGH: 3  │  │
│  │  │     87%        │     │  │  ████████████████████████ MEDIUM: 8│ │
│  │  ╰────────────────╯     │  │  ██████████████████████████████████ LOW: 135│
│  │  Pass Rate: 83.9%        │  │                                        │  │
│  └───────────────────────────┘  └────────────────────────────────────┘  │
│                                                                     │
│  ┌─ Active Runs ──────────────────────────────────────────────┐ │
│  │  Batch ID    │ Status │ Progress │ Risk │ Controls │ Started │ │
│  │  ────────────┼────────┼──────────┼──────┼──────────┼──────────│ │
│  │  abc123...   │ 🔄      │ 67%      │ MED  │ 32/50    │ Aug 3   │ │
│  │  def456...   │ ✅      │ 100%     │ LOW  │ 50/50    │ Aug 3   │ │
│  │  ghi789...   │ ❌      │ 45%      │ HIGH │ 23/50    │ Aug 3   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Unscored Batches ──────────────────────────────────────┐ │
│  │  Batch ID    │ Status │ Project │ Actions                            │ │
│  │  ────────────┼────────┼─────────┼────────────────────────────────│ │
│  │  jkl012...   │ PENDING │ Proj X  │ [Score] [View]                     │ │
│  │  mno345...   │ PENDING │ Proj Y  │ [Score] [View]                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Recent Alerts ──────────────────────────────────────────┐ │
│  │  ⚠ Batch ghi789 exceeded failure threshold (12%)           │ │
│  │  🔄 Batch abc123 is taking longer than expected        │ │
│  │  ✅ Batch def456 completed successfully                       │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + live indicator + tenant filter + action buttons (top-right)
- **KPI Cards:** 4 cards — Compliance, Passed, Failed, High Risk
- **Action Bar:** Refresh, Export PDF, Export CSV
- **Main Content (top):** Two-panel row — Compliance gauge (left) + Risk distribution chart (right)
- **Main Content (middle):** Active runs table — full-width
- **Main Content (lower-middle):** Unscored batches table — full-width
- **Detail Panel (bottom):** Recent alerts feed — full-width

## Dimensions

- KPI cards: `grid grid-cols-4`, each card `min-height: 70px`
- Gauge panel: `width: 45%`, `height: 200px`
- Risk chart panel: `width: 55%`, `height: 200px`
- Active runs table: Full width, `max-height: 250px`, `overflow-y: auto`
- Unscored batches table: Full width, `max-height: 200px`, `overflow-y: auto`
- Alerts feed: Full width, `max-height: 120px`, `overflow-y: auto`
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all panels
- Refresh button reloads all panels
- Click a batch row to drill into details
- "Score" button on unscored batches opens scoring modal
- "View" button on active runs opens run details
- Alerts are auto-updating (WebSocket or polling)
- "Export PDF" generates printable report
- "Export CSV" downloads current panel data

## Pros
- All validation data visible at once
- No tab switching needed
- Dashboard feel is modern and professional
- Real-time updates keep users informed
- Multiple data points visible simultaneously
- Quick scanning of validation health
- Alerts provide immediate awareness
- Consistent layout pattern maintained

## Cons
- Dense interface can feel overwhelming
- Many panels compete for screen space
- Smaller text in some areas
- More complex to implement (multiple data sources)
- Higher development effort
- May not suit users who prefer focused, detailed views
- Responsive behavior is challenging

## Breakpoint Behavior
- Desktop: Full dashboard grid, all panels visible
- Tablet: KPI row wraps, panels stack vertically
- Mobile: Single column, all panels stack vertically