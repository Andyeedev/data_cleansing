# Migration Design — Option B: Kanban Board with Drag-and-Drop

## Concept
A Kanban-style board showing migration batches as cards organized by status column (Running, Completed, Failed, Scheduled). Drag-and-drop to reorder or change status. Real-time updates via WebSocket.

## Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Migration Board          🔴 Live    [Tenant Filter ▼]  [Refresh]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ RUNNING ──────┐  ┌─ COMPLETED ────┐  ┌─ FAILED ──────┐ ┌─SCHEDULED─┐│
│  │                  │  │                  │  │                  │ │            ││
│  │ ┌──────────────┐│  │ ┌──────────────┐│  │ ┌──────────────┐│ │ ┌──────────┐││
│  │ │ abc123...    ││  │ │ def456...    ││  │ │ ghi789...    ││ │ │ jkl012...│││
│  │ │ ████████░░ 67%││  │ │ 50/50 ✅    ││  │ │ 50/50 ❌    ││ │ │ 0/50 ⏳ │││
│  │ │ MEDIUM risk  ││  │ │ 12s duration ││  │ │ 18 failed   ││ │ │ Auto-trig│││
│  │ │ [View] [Stop]││  │ │ [View]       ││  │ │ [View] [Retry]│ │ │ [View]   │││
│  │ └──────────────┘│  │ └──────────────┘│  │ └──────────────┘│ │ └──────────┘││
│  │                  │  │                  │  │                  │ │            ││
│  │ ┌──────────────┐│  │ ┌──────────────┐│  │                  │ │            ││
│  │ │ mno345...    ││  │ │ pqr678...    ││  │                  │ │            ││
│  │ │ █████░░░ 45% ││  │ │ 50/50 ✅    ││  │                  │ │            ││
│  │ │ HIGH risk    ││  │ │ 8s duration  ││  │                  │ │            ││
│  │ │ [View] [Stop]││  │ │ [View]       ││  │                  │ │            ││
│  │ └──────────────┘│  │ └──────────────┘│  │                  │ │            ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ └────────────┘│
│                                                                          │
│  ┌─ Scheduled Runs ──────────────────────────────────────────────────┐ │
│  │  Schedule: daily-migration | Next: Aug 4 02:00 UTC | Project: X │ │
│  │  Schedule: weekly-report  | Next: Aug 5 08:00 UTC | Project: Y │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Kanban columns** — 4 columns: Running, Completed, Failed, Scheduled
- **Drag-and-drop** — Drag cards between columns to change status (e.g., retry a failed batch)
- **Card content** — Batch ID (truncated), progress bar, risk level, action buttons
- **Action buttons** — View (drill into details), Stop (for running), Retry (for failed)
- **Scheduled runs section** — Shows upcoming scheduled migrations at the bottom
- **Real-time updates** — WebSocket or polling for live card updates
- **Tenant filter** — TenantFilter at top right
- **Live indicator** — Red dot showing real-time connection status
- **Refresh button** — Manual refresh option

## Visual Design

- Board: `display: grid`, 4 columns with `gap: var(--space-md)`
- Columns: `bg-gray-50` background, `border-radius: var(--radius-md)`, `min-height: 300px`
- Cards: `bg-white` with `border`, `border-radius`, `box-shadow`, `cursor: grab`
- Progress bars: `ProgressBar` component inside each card
- Risk badges: `StatusBadge` with `HIGH` (red), `MEDIUM` (yellow), `LOW` (green)
- Action buttons: small `Button` variants (primary, danger, warning)
- Scheduled section: `border-top` separator, `bg-blue-50` background
- Uses existing `TenantFilter`, `StatusBadge`, `ProgressBar`, `Modal` components
- Uses `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)` tokens

## Props Interface

```tsx
interface MigrationBoardProps {
  // No props — uses hooks internally
}
```

## New Components Needed

- `MigrationBoard.tsx` — Main Kanban board layout
- `BoardColumn.tsx` — Individual column with drop zone
- `MigrationCard.tsx` — Card showing batch status, progress, actions
- `ScheduledRunsSection.tsx` — Upcoming scheduled migrations
- `DragHandle.tsx` — Drag handle for card reordering

## API Endpoints

```
WS   /ws/migration/updates           — WebSocket for real-time board updates
GET  /api/v1/execution/board         — get batches grouped by status
POST /api/v1/execution/{batch_id}/stop    — stop a running batch
POST /api/v1/execution/{batch_id}/retry   — retry a failed batch
GET  /api/v1/migration/schedules/upcoming   — upcoming scheduled runs
```

## Pros
- Visual, at-a-glance view of all migration status
- Drag-and-drop is intuitive for status changes
- Real-time updates keep users informed
- Scheduled runs section separates future from past
- Cards show rich information (progress, risk, actions)
- Engaging and modern UX
- Easy to see bottlenecks (many cards in one column)

## Cons
- Kanban metaphor may be unfamiliar to some users
- Drag-and-drop doesn't work well on touch devices
- More complex state management for drag-and-drop
- Cards can become cluttered with too much info
- Requires WebSocket or frequent polling
- Higher development effort
- Not ideal for historical analysis (better for active monitoring)

## When to Use
- Operations teams monitoring live migrations
- When visual status overview is more important than detailed history
- Teams that prefer Kanban-style workflows
- Real-time monitoring dashboards
- When drag-and-drop status changes are useful (e.g., retry failed batches)