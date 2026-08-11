# Discovery Layout — Option C: Tree + Table

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Discovery                                                        │
│  Hierarchical schema view with drill-down capability          │
│  [Tenant Filter ▼]  [Filter: All ▼]  [Search: ___]            │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Systems: 3  |  Schemas: 5  |  Tables: 45  |  Matched: 30  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Start Discovery]  [Refresh]  [Export CSV]  [Export JSON]  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ System Tree ────────────┐  ┌─ Discovery Table ─────────────┐│
│  │  📁 my-postgres (Source)  │  │  Source Table  │ Target Table││
│  │    ├── public               │  │  ──────────────┼─────────────││
│  │  │   ├── users ✓           │  │  │ users          │ users      ││
│  │  │   ├── orders ✓          │  │  │ orders         │ orders     ││
│  │  │   └── products ⚠       │  │  │ products_v2    │ products   ││
│  │  │                          │  │  │ legacy_orders  │ —          ││
│  │  📁 my-sql (Target)        │  │  │ —              │ archive_   ││
│  │    ├── public               │  │  │                  │ orders     ││
│  │  │   ├── users ✓           │  │  │  Showing 1-5 of 5  │      ││
│  │  │   ├── orders ✓          │  │  │  [Previous] [1] [Next] │  ││
│  │  │   └── products ⚠       │  │  └─────────────────────────────────┘│
│  │    └── archive              │  │                                     │
│  │                              │  │  ┌─ Column Diff Detail ──────────┐│
│  │  📁 my-oracle (Source)      │  │  │  products_v2.price → products.││
│  │    └── ...                  │  │  │  amount (decimal → decimal)   ││
│  │                              │  │  │  products_v2.desc → products.││
│  │                              │  │  │  description (varchar → text) ││
│  └──────────────────────────────┘  │  └─────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter + filter dropdown + search (top-right)
- **KPI Cards:** 4 cards — Systems count, Schemas count, Tables count, Matched percentage
- **Action Bar:** Start Discovery, Refresh, Export CSV, Export JSON
- **Main Content (left):** System tree — expandable hierarchy of systems, schemas, tables
- **Main Content (right):** Discovery table — sortable, filterable, paginated
- **Detail Panel (bottom):** Column diff detail — shows column-level differences for selected row

## Dimensions

- KPI cards: `grid grid-cols-4`, each card `min-height: 70px`
- System tree: `width: 30%`, `max-height: 400px`, `overflow-y: auto`
- Discovery table: `flex: 1`, `max-height: 400px`, `overflow-y: auto`
- Column diff detail: Full width, `max-height: 150px`, `overflow-y: auto`
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all data
- Click a system in the tree to highlight its tables in the discovery table
- Click a table row to see column-level diff in the detail panel
- Filter dropdown filters by match status (All, Matched, Modified, Unmatched)
- Search filters table rows by table name
- "Start Discovery" triggers execution
- "Refresh" reloads all data
- Export buttons download data in selected format

## Pros
- Hierarchical view shows full schema structure
- Table view is sortable and filterable for large result sets
- Column-level diff visible in detail panel
- Export capability for offline analysis
- Consistent layout pattern maintained
- Scales well for large schemas (100+ tables)

## Cons
- Tree + table dual view may be confusing
- More complex navigation (expand/collapse + table)
- Column-level diff requires additional API calls
- Tree rendering can be slow for very large schemas
- Higher development effort for tree component
- Three-panel layout may feel cramped on medium screens

## Breakpoint Behavior
- Desktop: Tree + table side by side, detail panel below
- Tablet: Tree collapses to top, table and detail stack
- Mobile: Single column, tree, table, and detail all stack