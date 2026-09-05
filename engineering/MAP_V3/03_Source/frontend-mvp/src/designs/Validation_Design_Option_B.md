# Validation Design — Option B: Real-Time Status Dashboard

## Concept
A real-time dashboard with live status indicators, visual charts, and streaming updates. Focuses on immediate visibility into validation health and risk.

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Validation Dashboard          🔴 Live    [Refresh] [Export]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Health Score ──────┐  ┌─ Compliance Gauge ──────────┐   │
│  │                      │  │                              │   │
│  │    87%               │  │    ╭─────────────────╮      │   │
│  │   ████████████░░     │  │    │   87%           │      │   │
│  │                      │  │    ╰─────────────────╯      │   │
│  │  Health Score        │  │  Compliance Score            │   │
│  └──────────────────────┘  └──────────────────────────────┘   │
│                                                                 │
│  ┌─ Validation Status ─────────────────────────────────────┐ │
│  │  ✅ Passed: 131    ⚠ Warnings: 10    ❌ Failed: 5     │ │
│  │  🔄 Running: 3     ⏸ Queued: 7     📋 Total: 156     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Risk Distribution ────────────────────────────────────┐ │
│  │  [Bar Chart]                                            │ │
│  │  ████████████████████  HIGH: 3                        │ │
│  │  ████████████████████████  MEDIUM: 8                  │ │
│  │  ████████████████████████████████████████████████  LOW: 135│
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Active Runs ──────────────────────────────────────────┐ │
│  │  Batch ID    │ Status    │ Progress │ Risk   │ Actions │ │
│  │  ────────────┼───────────┼──────────┼────────┼─────────│ │
│  │  abc123...   │ 🔄 Running│ 67%      │ MEDIUM │ [View]  │ │
│  │  def456...   │ ✅ Passed │ 100%     │ LOW    │ [View]  │ │
│  │  ghi789...   │ ❌ Failed │ 45%      │ HIGH   │ [View]  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Recent Alerts ────────────────────────────────────────┐ │
│  │  ⚠ Batch ghi789 exceeded failure threshold (12%)       │ │
│  │  🔄 Batch abc123 is taking longer than expected        │ │
│  │  ✅ Batch def456 completed successfully                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Real-time updates** — WebSocket or polling for live status changes
- **Health score** — Large circular gauge showing overall validation health
- **Compliance gauge** — Semi-circular gauge showing compliance percentage
- **Status summary** — Quick counts of passed, warned, failed, running, queued
- **Risk distribution** — Bar chart showing risk level distribution
- **Active runs table** — Live table of current validation runs with progress
- **Alerts feed** — Streaming alerts for validation events
- **Actions** — View button on each run row to drill into details
- **Export** — Export dashboard data as PDF/CSV

## Visual Design

- Dashboard layout: `grid grid-cols-2` for health score and compliance gauge
- Status summary: `flex` row with colored icons and counts
- Risk distribution: horizontal bar chart using `div` with width percentages
- Active runs: `DataTable` component with live-updating rows
- Alerts: `border-l-4` colored left border (yellow for warnings, red for errors, green for success)
- Uses `StatusBadge` with animated pulse for running status
- Uses `ProgressBar` for progress indicators
- Uses `MetricCard` for summary statistics
- Uses existing Tailwind tokens and color scheme

## Props Interface

```tsx
interface ValidationDashboardProps {
  // No props — uses hooks internally
}
```

## New Components Needed

- `HealthGauge.tsx` — Circular health score gauge
- `ComplianceGauge.tsx` — Semi-circular compliance gauge
- `RiskBarChart.tsx` — Horizontal bar chart for risk distribution
- `AlertFeed.tsx` — Streaming alerts list
- `ActiveRunsTable.tsx` — Live-updating table of active validation runs

## API Endpoints

```
WS   /ws/validation/updates           — WebSocket for real-time updates
GET  /api/v1/validation/health        — current health score
GET  /api/v1/validation/compliance    — compliance status
GET  /api/v1/validation/risk-distribution — risk level counts
GET  /api/v1/validation/active-runs   — currently running validations
GET  /api/v1/validation/alerts        — recent alerts
```

## Pros
- Real-time visibility into validation status
- Visual charts and gauges are immediately informative
- Alerts feed keeps users aware of issues
- Dashboard feel is modern and professional
- Quick scanning of validation health
- Active runs table shows current state at a glance

## Cons
- More complex to implement (WebSocket/polling)
- Real-time updates can be distracting
- Charts require additional library or custom SVG
- Dashboard can become cluttered with too much info
- Higher development effort
- May not suit users who prefer detailed tabular views

## When to Use
- Operations teams monitoring live validation runs
- When real-time awareness of validation health is critical
- Management dashboards for executive visibility
- When alerts and notifications are important
- Large-scale migrations with many concurrent runs