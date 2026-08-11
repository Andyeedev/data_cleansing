# Discovery Layout — Option A: List + Progress

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Discovery                                                        │
│  Discover source and target system metadata                   │
│  [Tenant Filter ▼]                                               │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Systems: 3  |  Tables Discovered: 20  |  Matched: 15  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Start Discovery]  [Refresh]  [Export Results]            │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Systems List ─────────────────────────────────────────┐ │
│  │  [Source]  my-postgres-prod    PostgreSQL  │ 12 tables │ │
│  │  [Target]  my-sql-staging     MySQL 8.0   │ 8 tables  │ │
│  │  [Source]  my-oracle-prod     Oracle 19c  │ 25 tables │ │
│  │                                                       │ │
│  │  No systems registered. Add source and target first. │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Discovery Progress ─────────────────────────────────┐ │
│  │  ████████████████████░░░░░░░░  67%                  │ │
│  │  Status: RUNNING  |  Completed: 67 / 100  |  Failed: 0  │ │
│  │  Polling for updates...                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Results Detail ─────────────────────────────────────┐ │
│  │  No results yet. Run discovery to see results.       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter (top-right)
- **KPI Cards:** 3 cards — Systems count, Tables Discovered, Matched count
- **Action Bar:** Start Discovery button, Refresh, Export Results
- **Main Content (top):** Systems list — scrollable card list with role badges and table counts
- **Main Content (middle):** Discovery progress bar with status
- **Detail Panel (bottom):** Results detail section — appears after discovery completes

## Dimensions

- KPI cards: `grid grid-cols-3`, each card `min-height: 70px`
- Systems list: `max-height: 250px`, `overflow-y: auto`
- Progress section: Fixed height card
- Results detail: Auto height, appears conditionally
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all data
- "Start Discovery" triggers execution
- Progress section shows live polling status
- Results detail populates after discovery completes
- Click a system card to see its schema details
- "Export Results" downloads discovery data as CSV/JSON

## Pros
- Consistent layout pattern — KPI cards at top, details below
- Simple, linear flow
- Clear visual hierarchy
- Progress bar gives immediate feedback
- Results detail appears contextually
- Easy to implement

## Cons
- No side-by-side comparison of systems
- List-based layout doesn't scale well for many systems
- No visual schema representation
- Limited filtering/sorting capabilities
- Progress bar is the only visual indicator

## Breakpoint Behavior
- Desktop: All sections visible, KPI cards in a row
- Tablet: KPI cards stack, systems list and progress stack
- Mobile: Single column, all sections stack vertically