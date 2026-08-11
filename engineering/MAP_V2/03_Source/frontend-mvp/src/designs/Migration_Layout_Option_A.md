# Migration Layout — Option A: Top KPI + Execution + History Tabs

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Migration                                                                        │
│  Execute migration runs, monitor progress, review past runs            │
│  [Tenant Filter ▼]                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Running: 2  |  Completed Today: 15  |  Failed: 1  |  Scheduled: 3  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Start Migration ▼]  [Stop All]  [View Schedules]      │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [Execution] [History]                                             │
│                                                                     │
│  ── Execution Tab ────────────────────────────────────────── │
│                                                                     │
│  ┌─ Confirm Migration Modal ──────────────────────────────┐ │
│  │  Tenant: [Select ▼]                                              │ │
│  │  Project: [Select ▼]                                             │ │
│  │  Project ID (manual): [____________]                          │ │
│  │  Mode: (○) Full Validation  (○) Quick Health Check       │ │
│  │  Status: 2 Running | 15 Completed | 1 Failed                      │ │
│  │  Est. time: ~5 minutes                                           │ │
│  │  [Cancel]  [Start Execution]                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Recent Runs ───────────────────────────────────────────┐ │
│  │  Batch ID    │ Status    │ Controls │ Completed │ Failed │ Started │ │
│  │  ────────────┼───────────┼──────────┼───────────┼────────┼──────────│ │
│  │  abc123...   │ ✅ COMPLETED│ 50      │ 50        │ 0      │ Aug 3   │ │
│  │  def456...   │ ❌ FAILED  │ 50      │ 32        │ 18     │ Aug 3   │ │
│  │  ghi789...   │ 🔄 RUNNING │ 50      │ 23        │ 0      │ Aug 3   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ── History Tab ──────────────────────────────────────────── │
│                                                                     │
│  [Search] [Status: All ▼] [Rows: 10 ▼]                        │
│                                                                     │
│  ┌─ Execution History Table ─────────────────────────────────┐ │
│  │  Batch ID    │ Status    │ Controls │ Completed │ Failed │ Started │ │
│  │  ────────────┼───────────┼──────────┼───────────┼────────┼──────────│ │
│  │  abc123...   │ ✅        │ 50      │ 50        │ 0      │ Aug 3 14:32 │ │
│  │  def456...   │ ❌        │ 50      │ 32        │ 18     │ Aug 3 13:15 │ │
│  │  ghi789...   │ 🔄        │ 50      │ 23        │ 0      │ Aug 3 11:45 │ │
│  │  ... (paginated)                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│  Showing 1-10 of 47 rows  [Previous] [1] [2] [3] [Next]                  │
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter (top-right)
- **KPI Cards:** 4 cards — Running, Completed Today, Failed Today, Scheduled Today
- **Action Bar:** Start Migration button, Stop All button, View Schedules
- **Tab Bar:** Execution | History
- **Main Content (Execution tab):** Confirmation modal + recent runs table
- **Main Content (History tab):** Search/filter bar + full execution history table with pagination
- **Detail Panel:** Not applicable — each tab is self-contained

## Dimensions

- KPI cards: `grid grid-cols-4`, each card `min-height: 70px`
- Tab bar: Fixed height (`48px`)
- Confirmation modal: Centered overlay, `width: 500px`
- Recent runs table: Full width, `max-height: 300px`
- History table: Full width, `max-height: 500px`, `overflow-y: auto`
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to both tabs
- Tab clicks switch between Execution and History views
- "Start Migration" opens confirmation modal
- Modal has tenant/project selectors, execution mode, status summary
- "Stop All" stops all running migrations
- History table has sortable columns, search, status filter, pagination
- "View Schedules" navigates to schedule management

## Pros
- Consistent layout pattern maintained
- Familiar to users — matches current working design
- Comprehensive execution workflow with confirmation modal
- KPI cards provide quick health overview
- History table is sortable, searchable, and filterable
- Tenant filtering for multi-tenant environments
- Modal error handling keeps users informed
- Execution mode selection (full vs quick) adds flexibility

## Cons
- Two-tab layout can feel separated
- No real-time progress during execution
- History table is text-heavy
- No visual charts or graphs
- Stop All button is a destructive action with no confirmation
- KPI cards only show today's data
- Execution and history are in separate tabs

## Breakpoint Behavior
- Desktop: Full layout, all sections visible
- Tablet: KPI cards wrap, tables scroll horizontally
- Mobile: Single column, sections stack, tabs collapse