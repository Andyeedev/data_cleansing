# Mapping Layout — Option C: Spreadsheet Grid

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Mapping Configuration                                            │
│  Source: my-postgres-prod.public → Target: my-sql-staging.public │
│  [Tenant Filter ▼]  [Auto Map]  [Save]  [Export CSV]       │
├─────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ KPI Cards ──────────────────────────────────────────┐ │
│  │  Tables Mapped: 3/5 (60%)  |  Columns Mapped: 8/10 (80%) │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Action Bar ──────────────────────────────────────────┐ │
│  │  [Auto Map]  [Accept All]  [Save Mapping]  [Export]    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Source Schema ──────────────────────────────────────────┐ │
│  │  public.users: id, email, created_at, legacy_id           │ │
│  │  public.orders: order_id, customer_id, old_cust_id       │ │
│  │  public.products: id, name, price, description            │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Column Mapping Grid ─────────────────────────────────────────┐ │
│  │  Source Column  │ Transform │ Value/Rule      │ Target Column │ │
│  │  ────────────────┼───────────┼─────────────────┼─────────────────│ │
│  │  users.id         │ —          │ —                  │ users.id       │ │
│  │  users.email      │ Lower     │ —                  │ users.email    │ │
│  │  users.created_at │ —          │ —                  │ users.created_at│ │
│  │  users.legacy_id  │ ✗ Skip    │ —                  │ —                │ │
│  │  orders.order_id  │ —          │ —                  │ orders.order_id │ │
│  │  orders.customer_id│ —        │ —                  │ orders.customer_id│ │
│  │  orders.old_cust_id│ ✗ Skip  │ —                  │ —                │ │
│  │  products.id       │ —        │ —                  │ products.id      │ │
│  │  products.name     │ —        │ —                  │ products.name    │ │
│  │  products.price    │ Map      │ USD→EUR, ×1.08  │ products.amount │ │
│  │  products.desc     │ Trim     │ —                  │ products.desc   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Unmapped ────────────────────────────────────────────────┐ │
│  │  Source: legacy_id (users), old_cust_id (orders)            │ │
│  │  Target: archive_flag, import_timestamp                        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Match Rate: 8/10 columns (80%)  [Validate]  [Save]  [Export]   │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + source/target selectors + tenant filter + action buttons (top-right)
- **KPI Cards:** 2 cards — Tables Mapped (%), Columns Mapped (%)
- **Action Bar:** Auto Map, Accept All, Save Mapping, Export
- **Main Content (top):** Source schema compact list
- **Main Content (middle):** Spreadsheet grid — Source Column, Transform, Value/Rule, Target Column
- **Detail Panel (bottom):** Unmapped tables list + match rate footer

## Dimensions

- KPI cards: `grid grid-cols-2`, each card `min-height: 70px`
- Source schema: Full width, compact height
- Mapping grid: Full width, `max-height: 400px`, `overflow-y: auto`
- Unmapped section: Full width, auto height
- Action bar: Full width, `padding: var(--space-md)`
- Footer: Full width, match rate + action buttons

## Navigation

- Tenant filter applies to all data
- Source/target selectors switch mapping context
- "Auto Map" triggers automatic column matching and populates the grid
- Click a grid row to edit transform type or rule
- Transform cell shows colored badge (None, Lowercase, Map, Skip, etc.)
- "Accept All" accepts all auto-mapped relationships
- "Save Mapping" persists all mappings
- "Validate" runs validation on current mappings
- "Export CSV" downloads mappings as CSV
- Match rate updates in real-time as mappings change

## Pros
- Spreadsheet-like interaction familiar to many users
- Granular control over each column mapping
- Transform rules visible inline
- Easy to scan and review all mappings at once
- Match rate gives clear progress indicator
- Unmapped columns clearly visible
- Consistent layout pattern maintained
- Simple, clean layout

## Cons
- Grid can become wide and hard to read
- Transform cell editing requires careful UI
- No visual relationship between tables
- Less intuitive for users unfamiliar with spreadsheets
- Doesn't show table-level matching (only column-level)
- Wide grids may not fit on small screens

## Breakpoint Behavior
- Desktop: Full grid layout, all columns visible
- Tablet: Grid scrolls horizontally, transform column collapses
- Mobile: Grid rows become cards stacked vertically