# Discovery Design — Option C: Tree/Table View with Drill-Down

## Concept
A hierarchical tree/table view showing systems, schemas, tables, and columns in an expandable tree structure. Discovery results displayed as a sortable, filterable table with inline status indicators and drill-down capability.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Discovery                                      │
│  Schema discovery and matching results          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─ System Tree ─────────────────────────────┐ │
│  │  📁 my-postgres-prod (Source)             │ │
│  │    ├── public                              │ │
│  │    │   ├── users ✓ (matched)              │ │
│  │    │   ├── orders ✓ (matched)             │ │
│  │    │   └── products ⚠ (modified)          │ │
│  │    └── reporting                           │ │
│  │        └── legacy_orders ✗ (source-only)  │ │
│  │                                              │ │
│  │  📁 my-sql-staging (Target)                │ │
│  │    ├── public                              │ │
│  │    │   ├── users ✓ (matched)              │ │
│  │    │   ├── orders ✓ (matched)             │ │
│  │    │   └── products ⚠ (modified)          │ │
│  │    └── archive                             │ │
│  │        └── archive_orders ✗ (target-only) │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Discovery Results Table ─────────────────┐ │
│  │  Filter: [All ▼]  Search: [________]      │ │
│  │                                              │ │
│  │  Source Table  │ Target Table │ Status │    │ │
│  │  ──────────────┼──────────────┼─────────│  │ │
│  │  users         │ users        │ ✓ Match │  │ │
│  │  orders        │ orders       │ ✓ Match │  │ │
│  │  products_v2   │ products     │ ⚠ Diff  │  │ │
│  │  legacy_orders │ —            │ ✗ Only  │  │ │
│  │  —             │ archive_orders│ ✗ Only │  │ │
│  │                                              │ │
│  │  Showing 1-5 of 5 results                   │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Actions ─────────────────────────────────┐ │
│  │  [Start Discovery]  [Export Results]      │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Key Behaviors

- **Expandable tree** — Systems expand to show schemas, tables, and columns
- **Status icons** — ✓ matched, ⚠ modified, ✗ source-only, ✗ target-only
- **Sortable table** — Click column headers to sort by source table, target table, or status
- **Filter dropdown** — Filter by status: All, Matched, Modified, Source-Only, Target-Only
- **Search** — Filter table rows by table name
- **Drill-down** — Click a row to see column-level diff details
- **Export** — Export discovery results as CSV/JSON

## Visual Design

- Tree: indented with `border-l` lines, expand/collapse arrows
- Table: `border-collapse`, sticky header, `overflow-y-auto` for scrolling
- Status icons: inline `StatusBadge` component with custom variants
- Filter bar: `SearchBar` + `select` dropdown side by side
- Uses existing `DataTable`, `SearchBar`, `StatusBadge`, `EmptyState` components
- Uses `var(--color-border)`, `var(--color-bg-secondary)` tokens

## Props Interface

```tsx
interface DiscoveryPageProps {
  // No props — uses hooks internally
}
```

## New Components Needed

- `SystemTree.tsx` — Expandable tree of systems, schemas, tables, columns
- `TreeRow.tsx` — Individual tree row with expand/collapse and status icon
- `DiscoveryTable.tsx` — Sortable, filterable table of discovery results
- `ColumnDiffView.tsx` — Modal/drill-down showing column-level differences

## API Endpoints

```
GET  /api/v1/systems                              — list systems
GET  /api/v1/discovery/{batch_id}/results          — discovery results with hierarchy
GET  /api/v1/discovery/{batch_id}/table-diffs      — column-level diff for a table
POST /api/v1/discovery/run                         — start discovery execution
GET  /api/v1/execution/{batch_id}/status           — poll execution status
GET  /api/v1/discovery/export?format=csv|json      — export results
```

## Pros
- Hierarchical view shows full schema structure
- Table view is sortable and filterable for large result sets
- Drill-down to column level for detailed analysis
- Export capability for offline analysis
- Scales well for large schemas (100+ tables)
- Familiar table-based interaction pattern

## Cons
- Tree + table dual view may be confusing
- More complex navigation (expand/collapse + table)
- Column-level diff requires additional API calls
- Tree rendering can be slow for very large schemas
- Higher development effort for tree component

## When to Use
- Large schemas with many tables and columns
- Users who need to drill into column-level differences
- Teams that prefer table-based data exploration
- When export/audit of discovery results is required