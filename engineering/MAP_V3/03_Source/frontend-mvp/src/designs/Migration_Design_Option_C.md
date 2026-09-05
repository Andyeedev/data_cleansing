# Migration Design — Option C: Timeline/Stream View

## Concept
A timeline/stream-based view showing migration executions as a chronological feed. Each execution appears as a card in a vertical timeline, with the most recent at the top. Focuses on the narrative of migration activity over time.

## Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Migration Timeline        [Tenant Filter ▼]  [Filter: All ▼]        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ Today ──────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─ Aug 3, 14:32 ──────────────────────────────────────────────┐ │ │
│  │  │  🔵 Running                                                  │ │ │
│  │  │  Batch: ghi789...  │ Project: X  │ Progress: 67%           │ │ │
│  │  │  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ │ │
│  │  │  Started: 14:32 UTC  │ Est. remaining: ~3 min              │ │ │
│  │  │  Controls: 32/50 completed  │ 0 failed                     │ │ │
│  │  └───────────────────────────────────────────────────────────────┘ │ │
│  │                                                                    │ │
│  │  ┌─ Aug 3, 13:15 ──────────────────────────────────────────────┐ │ │
│  │  │  ✅ Completed                                                │ │ │
│  │  │  Batch: def456...  │ Project: Y  │ Duration: 12s           │ │ │
│  │  │  Controls: 50/50 passed  │ 0 failed  │ Risk: LOW           │ │ │
│  │  │  [View Details]  [Rerun]                                    │ │ │
│  │  └───────────────────────────────────────────────────────────────┘ │ │
│  │                                                                    │ │
│  │  ┌─ Aug 3, 11:45 ──────────────────────────────────────────────┐ │ │
│  │  │  ❌ Failed                                                   │ │ │
│  │  │  Batch: abc123...  │ Project: Z  │ Duration: 8s            │ │ │
│  │  │  Controls: 32/50 passed  │ 18 failed  │ Risk: HIGH         │ │ │
│  │  │  Error: FK constraint violation on orders table              │ │ │
│  │  │  [View Details]  [Retry]  [View Logs]                       │ │ │
│  │  └───────────────────────────────────────────────────────────────┘ │ │
│  │                                                                    │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─ Aug 2 ──────────────────────────────────────────────────────────┐ │
│  │  ┌─ Aug 2, 22:00 ──────────────────────────────────────────────┐ │ │
│  │  │  ✅ Completed  │ Batch: xyz999...  │ Duration: 15s         │ │ │
│  │  │  ...                                                        │ │ │
│  │  └───────────────────────────────────────────────────────────────┘ │ │
│  │                                                                    │ │
│  │  ┌─ Aug 2, 18:30 ──────────────────────────────────────────────┐ │ │
│  │  │  ✅ Completed  │ Batch: uvw888...  │ Duration: 10s         │ │ │
│  │  │  ...                                                        │ │ │
│  │  └───────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Load More]                                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Chronological timeline** — Executions ordered newest-first, grouped by date
- **Date group headers** — "Today", "Aug 3", "Aug 2", etc.
- **Status icons** — 🔵 Running, ✅ Completed, ❌ Failed, ⏳ Scheduled
- **Progress bar** — For running executions, shows inline progress
- **Expandable details** — Click a card to expand full details (controls, errors, duration)
- **Action buttons** — View Details, Rerun, Retry, View Logs per card
- **Filter by status** — Dropdown: All, Running, Completed, Failed, Scheduled
- **Tenant filter** — TenantFilter at top right
- **Load more** — Infinite scroll or "Load More" button for older executions
- **Error inline** — Failed executions show error message inline (truncated, expandable)

## Visual Design

- Timeline: `border-l-2` left border with connecting dots for each entry
- Date headers: `font-semibold`, `bg-gray-100`, `rounded`, `px-3 py-1`
- Cards: `bg-white`, `border`, `border-radius`, `box-shadow`, `ml-4` (indented from timeline)
- Running cards: `border-left: 4px solid var(--color-info)` blue accent
- Completed cards: `border-left: 4px solid var(--color-success)` green accent
- Failed cards: `border-left: 4px solid var(--color-danger)` red accent
- Progress bars: `ProgressBar` component with percentage label
- Error messages: `bg-red-50`, `text-red-700`, `rounded`, `text-sm`
- Uses existing `StatusBadge`, `ProgressBar`, `Button`, `Modal` components
- Uses `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)`, `var(--color-info)` tokens

## Props Interface

```tsx
interface MigrationTimelineProps {
  // No props — uses hooks internally
}
```

## New Components Needed

- `MigrationTimeline.tsx` — Main timeline container with date grouping
- `TimelineGroup.tsx` — Date group header and cards
- `TimelineCard.tsx` — Individual execution card with status, progress, actions
- `TimelineDot.tsx` — Connecting dot on the timeline
- `ExpandableDetail.tsx` — Expandable detail section for each card

## API Endpoints

```
GET  /api/v1/execution/timeline?tenant_id={id}&status={s}&page={n} — paginated timeline
GET  /api/v1/execution/{batch_id}/details     — detailed execution info
GET  /api/v1/execution/{batch_id}/logs        — execution logs
POST /api/v1/execution/{batch_id}/retry       — retry failed batch
POST /api/v1/execution/{batch_id}/stop        — stop running batch
```

## Pros
- Chronological narrative is easy to follow
- Date grouping makes it clear when things happened
- Timeline visual metaphor is intuitive
- Failed executions show errors inline
- Action buttons are contextually available per card
- "Load more" pattern handles large histories well
- Clean, focused design without tab switching
- Good for auditing and reviewing migration history

## Cons
- No KPI cards for quick health overview
- No side-by-side comparison of multiple runs
- Timeline can become very long for active systems
- No dashboard-style summary at a glance
- Less suitable for monitoring current state
- Progress bars only for running executions
- Higher scrolling for large histories

## When to Use
- When audit trail and history review are primary needs
- Teams that prefer chronological narrative views
- When the "story" of migrations matters (e.g., compliance reviews)
- When users need to see what happened and when
- When detailed per-execution actions (retry, view logs) are important