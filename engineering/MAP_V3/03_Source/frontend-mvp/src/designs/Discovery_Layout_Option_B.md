# Discovery Layout — Option B: Card Grid + Schema Diff

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Discovery                                                        │
│  Schema discovery and matching results                        │
│  [Tenant Filter ▼]                                               │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Systems: 3  |  Tables: 45  |  Matched: 30 (67%)  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Start Discovery]  [Auto Map]  [Export Results]           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ System Cards ───────────────────────────────────────┐ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│ │
│  │  │ PostgreSQL   │  │ MySQL       │  │ Oracle      ││ │
│  │  │ my-postgres  │  │ my-sql      │  │ my-oracle   ││ │
│  │  │ Source       │  │ Target      │  │ Source      ││ │
│  │  │ 12 tables    │  │ 8 tables    │  │ 25 tables   ││ │
│  │  │ 340 columns  │  │ 210 columns │  │ 890 columns ││ │
│  │  │ 340 matched  │  │ 210 matched │  │ 890 matched ││ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘│ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Schema Diff Detail ─────────────────────────────────┐ │
│  │  Source Tables    │  Target Tables                      │ │
│  │  ───────────────  │  ──────────────────                │ │
│  │  ✓ users          │  ✓ users                             │ │
│  │  ✓ orders         │  ✓ orders                            │ │
│  │  ✗ legacy_orders  │                                      │ │
│  │                    │  ✗ archive_orders                   │ │
│  │  ⚠ products_v2    │  ⚠ products (column diff)           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + description + tenant filter (top-right)
- **KPI Cards:** 3 cards — Systems count, Total Tables, Matched percentage
- **Action Bar:** Start Discovery, Auto Map, Export Results
- **Main Content (top):** System cards grid — 3 cards showing source/target with stats
- **Detail Panel (bottom):** Schema diff view — side-by-side table comparison

## Dimensions

- KPI cards: `grid grid-cols-3`, each card `min-height: 70px`
- System cards: `grid grid-cols-3`, each card `min-height: 120px`
- Schema diff: Full width, two-column layout
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all data
- "Start Discovery" triggers execution
- System cards show at-a-glance stats
- Schema diff populates after discovery completes
- Click a system card to highlight its tables in the diff
- "Auto Map" triggers automatic table matching
- "Export Results" downloads discovery data as CSV/JSON

## Pros
- Card grid is visually engaging
- Schema diff shows exactly what needs mapping
- KPI cards give quick health check
- Consistent layout pattern maintained
- Auto-map reduces manual work
- Match percentage gives clear progress indicator

## Cons
- Card grid may feel cluttered with many systems
- Schema diff requires backend computation
- Two-column diff may be hard to read on narrow screens
- Higher development effort
- More API calls needed for schema details

## Breakpoint Behavior
- Desktop: 3-column card grid, two-column schema diff
- Tablet: 2-column card grid, schema diff stacks
- Mobile: Single column, cards stack, diff stacks