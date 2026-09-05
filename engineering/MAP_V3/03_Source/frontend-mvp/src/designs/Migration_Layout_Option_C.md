# Migration Layout — Option C: Full-Width Timeline

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Migration Timeline                                                │
│  Chronological view of all migration executions                │
│  [Tenant Filter ▼]  [Filter: All ▼]  [Refresh]               │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Running: 2  |  Completed Today: 15  |  Failed: 1  |  Scheduled: 3  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Refresh]  [Export CSV]  [Export PDF]                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Today ──────────────────────────────────────────────────────┐ │
│  │  ┌─ Aug 3, 14:32 ──────────────────────────────────────┐ │ │
│  │  │  🔵 Running                                                            │ │ │
│  │  │  Batch: ghi789...  │ Project: X  │ Progress: 67%              │ │ │
│  │  │  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ │ │
│  │  │  Started: 14:32 UTC  | Est. remaining: ~3 min                   │ │ │
│  │  │  Controls: 32/50 completed  | 0 failed                            │ │ │
│  │  │  [View Details]  [Stop]                                           │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                        │ │
│  │  ┌─ Aug 3, 13:15 ──────────────────────────────────────────┐ │ │
│  │  │  ✅ Completed                                                           │ │ │
│  │  │  Batch: def456...  | Project: Y  | Duration: 12s                  │ │ │
│  │  │  Controls: 50/50 passed  | 0 failed  | Risk: LOW                │ │ │
│  │  │  [View Details]  [Rerun]                                              │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                        │ │
│  │  ┌─ Aug 3, 11:45 ──────────────────────────────────────────┐ │ │
│  │  │  ❌ Failed                                                            │ │ │
│  │  │  Batch: abc123...  | Project: Z  | Duration: 8s           │ │ │
│  │  │  Controls: 32/50 passed  | 18 failed  | Risk: HIGH            │ │ │
│  │  │  Error: FK constraint violation on orders table              │ │ │
│  │  │  [View Details]  [Retry]  [View Logs]                       │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                        │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Aug 2 ──────────────────────────────────────────────────────┐ │
│  │  ┌─ Aug 2, 22:00 ──────────────────────────────────────┐ │ │
│  │  │  ✅ Completed  | Batch: xyz999...  | Duration: 15s         │ │ │
│  │  │  ...                                                                │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                        │ │
│  │  ┌─ Aug 2, 18:30 ──────────────────────────────────────┐ │ │
│  │  │  ✅ Completed  | Batch: uvw888...  | Duration: 10s         │ │ │
│  │  │  ...                                                                │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [Load More]                                                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter + status filter + refresh (top-right)
- **KPI Cards:** 4 cards — Running, Completed Today, Failed Today, Scheduled Today
- **Action Bar:** Refresh, Export CSV, Export PDF
- **Main Content:** Full-width vertical timeline — chronological stream of execution events
  - Date group headers ("Today", "Aug 3", "Aug 2")
  - Each event is a card with status icon, batch info, progress bar (for running), error message (for failed), and action buttons
- **Detail Panel:** Not applicable — timeline is self-contained

## Dimensions

- KPI cards: `grid grid-cols-4`, each card `min-height: 70px`
- Timeline: Full width, `max-width: 900px`, centered
- Event cards: Full width of timeline, `min-height: 100px`
- Date group headers: `font-semibold`, `bg-gray-100`, `rounded`, `px-3 py-1`
- Progress bars: `ProgressBar` component inside running event cards
- Action buttons: Small `Button` variants per event card
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all events
- Status filter (All, Running, Completed, Failed) filters visible events
- Click a card to expand full details in a modal
- "Retry" on failed cards re-runs the batch
- "View Logs" opens execution logs in a new tab/modal
- "Stop" on running cards stops the batch
- "Load More" loads older events
- "Export CSV" downloads timeline data
- "Export PDF" generates printable report

## Pros
- Chronological narrative is easy to follow
- Date grouping makes it clear when things happened
- Timeline visual metaphor is intuitive
- Failed executions show errors inline
- Action buttons are contextually available per card
- "Load more" pattern handles large histories well
- Clean, focused design without tab switching
- Good for auditing and reviewing migration history
- Consistent layout pattern maintained

## Cons
- No KPI cards for quick health overview (KPI cards are at top, but timeline dominates)
- No side-by-side comparison of multiple runs
- Timeline can become very long for active systems
- No dashboard-style summary at a glance
- Less suitable for monitoring current state
- Progress bars only for running executions
- Higher scrolling for large histories
- No tab-based organization

## Breakpoint Behavior
- Desktop: Full-width timeline, centered
- Tablet: Timeline full-width, cards may be wider
- Mobile: Single column, cards stack, action buttons may wrap