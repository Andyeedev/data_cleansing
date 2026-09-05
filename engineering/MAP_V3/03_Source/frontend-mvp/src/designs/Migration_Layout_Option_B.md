# Migration Layout — Option B: Two-Column (Execution + History)

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Migration                                                                          │
│  Execute and monitor migration runs                                                │
│  [Tenant Filter ▼]  [Refresh]                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Running: 2  |  Completed Today: 15  |  Failed: 1  |  Scheduled: 3  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Start Migration ▼]  [Stop All]  [View Schedules]         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  ┌─ Execution ───────────────────────┐  ┌─ History ──────────────────────┐  │
│  │                                        │  │                                    │  │
│  │  ┌─ Confirm Migration Modal ──────┐  │  │  [Search] [Status: All ▼]   │  │
│  │  │  Tenant: [Select ▼]                  │  │  │                                    │  │
│  │  │  Project: [Select ▼]                 │  │  │  ┌────────────────────────┐  │  │
│  │  │  Project ID: [____________]      │  │  │  │ Batch ID  │ Status │...│  │  │
│  │  │  Mode: (○) Full  (○) Quick      │  │  │  │ ──────────┼────────┼───│  │  │
│  │  │  [Cancel]  [Start Execution]     │  │  │  │ abc123... │ ✅     │...│  │  │
│  │  └───────────────────────────────────┘  │  │  │ def456... │ ❌     │...│  │  │
│  │                                        │  │  │  ghi789... │ 🔄     │...│  │  │
│  │  ┌─ Active Runs ──────────────────┐  │  │  │  ... (paginated)              │  │
│  │  │  Batch: ghi789...                 │  │  │  │  Showing 1-10 of 47 rows  │  │
│  │  │  ████████████████░░░░  67%      │  │  │  │  [Previous] [1] [2] [Next] │  │
│  │  │  Status: RUNNING  │ Risk: MEDIUM  │  │  │                                    │  │
│  │  │  32/50 controls  │ 0 failed       │  │  │  └────────────────────────┘  │  │
│  │  │  Est. remaining: ~3 min           │  │  │                                    │  │
│  │  └───────────────────────────────────┘  │  │                                    │  │
│  │                                        │  │  ┌─ Scheduled Runs ──────────────┐  │  │
│  │  ┌─ Scheduled Runs ────────────────┐  │  │  │  daily-migration | Aug 4    │  │  │
│  │  │  daily-migration | Next: Aug 4  │  │  │  │  weekly-report  | Aug 5      │  │  │
│  │  └───────────────────────────────────┘  │  │  └─────────────────────────────────┘  │
│  └──────────────────────────────────────────────┘  └──────────────────────────────────┘  │
│                                                                                       │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter + refresh (top-right)
- **KPI Cards:** 4 cards — Running, Completed Today, Failed Today, Scheduled Today
- **Action Bar:** Start Migration, Stop All, View Schedules
- **Main Content (left, 55%):** Execution area — confirmation modal + active runs + scheduled runs
- **Main Content (right, 45%):** History area — search/filter + execution history table with pagination

## Dimensions

- KPI cards: `grid grid-cols-4`, each card `min-height: 70px`
- Left column: `width: 55%`
- Right column: `width: 45%`
- Confirmation modal: Centered overlay, `width: 500px`
- Active runs section: `max-height: 250px`, `overflow-y: auto`
- Scheduled runs section: `max-height: 150px`, `overflow-y: auto`
- History table: `max-height: calc(100vh - 350px)`, `overflow-y: auto`
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to both columns
- No tabs — both execution and history visible simultaneously
- "Start Migration" opens confirmation modal
- Click a history row to see details
- "Stop All" stops all running migrations
- Scheduled runs show upcoming execution times
- "View Schedules" navigates to schedule management
- Refresh button reloads both columns

## Pros
- Execution and history visible at the same time
- No tab switching needed
- Active runs section shows current state
- Scheduled runs section shows future activity
- More context-aware than tabbed layout
- Quick comparison of current vs past runs
- Consistent layout pattern maintained

## Cons
- Two columns reduce width for each section
- More complex responsive behavior
- Active runs section may be empty most of the time
- Scheduled runs section is small
- Higher development effort for dual-panel layout
- Can feel cluttered with both panels visible

## Breakpoint Behavior
- Desktop: Two columns side by side
- Tablet: Columns stack, execution on top, history below
- Mobile: Single column, all sections stack