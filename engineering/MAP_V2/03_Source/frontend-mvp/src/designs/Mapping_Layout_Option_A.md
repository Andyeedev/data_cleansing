# Mapping Layout — Option A: Side-by-Side Grid

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Mapping Configuration                                            │
│  Source: my-postgres-prod.public → Target: my-sql-staging.public │
│  [Tenant Filter ▼]                                                 │
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
│  ┌─ Source Tables ────────────┐  ┌─ Target Tables ──────────┐│
│  │  public schema               │  │  public schema              ││
│  │  ┌────────────────────────┐  │  │  ┌─────────────────────┐  ││
│  │  │ users                      │←→│  │ users                      │  ││
│  │  │  id          (PK) ✓     │  │  │  id          (PK) ✓    │  ││
│  │  │  email        ✓          │  │  │  email        ✓          │  ││
│  │  │  created_at   ✓          │  │  │  created_at   ✓          │  ││
│  │  │  legacy_id    ✗ skip     │  │  │                             │  ││
│  │  └────────────────────────┘  │  │  └─────────────────────┘  ││
│  │                                │  │                                ││
│  │  ┌────────────────────────┐  │  │  ┌─────────────────────┐  ││
│  │  │ orders                     │←→│  │ orders                     │  ││
│  │  │  order_id    (PK) ✓    │  │  │  order_id    (PK) ✓   │  ││
│  │  │  customer_id  ✓         │  │  │  customer_id  ✓          │  ││
│  │  │  old_cust_id  ✗ skip   │  │  │                             │  ││
│  │  └────────────────────────┘  │  │  └─────────────────────┘  ││
│  │                                │  │                                ││
│  │  ┌────────────────────────┐  │  │  ┌─────────────────────┐  ││
│  │  │ products ⚠              │←→│  │ products ⚠                │  ││
│  │  │  id          (PK) ✓    │  │  │  id          (PK) ✓   │  ││
│  │  │  name        ✓         │  │  │  name        ✓          │  ││
│  │  │  price       ⚠ map     │→│  │  │ amount      ⚠ map  │←─┘  ││
│  │  │  desc        ✓         │  │  │  description ✓         │  ││
│  │  └────────────────────────┘  │  │  └─────────────────────┘  ││
│  └────────────────────────────────┘  └─────────────────────────────┘│
│                                                                     │
│  ┌─ Unmapped Tables ───────────────────────────────────────┐ │
│  │  Source: legacy_orders (no target match)                       │ │
│  │  Target: archive_orders (no source match)                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Match Rate: 8/10 columns (80%)  [Validate]  [Save]  [Export]   │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + source/target selector + tenant filter (top-right)
- **KPI Cards:** 2 cards — Tables Mapped (%), Columns Mapped (%)
- **Action Bar:** Auto Map, Accept All, Save Mapping, Export
- **Main Content (top):** Two-column layout — Source tables (left) and Target tables (right) with connecting lines
- **Detail Panel (bottom):** Unmapped tables list + match rate footer

## Dimensions

- KPI cards: `grid grid-cols-2`, each card `min-height: 70px`
- Source panel: `width: 45%`, scrollable
- Target panel: `width: 45%`, scrollable
- Unmapped section: Full width, auto height
- Action bar: Full width, `padding: var(--space-md)`
- Footer: Full width, match rate + action buttons

## Navigation

- Tenant filter applies to all data
- Source/target selectors switch mapping context
- "Auto Map" triggers automatic table and column matching
- "Accept All" accepts all auto-mapped relationships
- Click a column to change its mapping target
- "Save Mapping" persists all mappings
- "Validate" runs validation on current mappings
- "Export" downloads mappings as CSV/JSON
- Match rate updates in real-time as mappings change

## Pros
- Intuitive side-by-side comparison
- Visual connection lines show relationships
- Auto-mapping reduces manual work
- Unmapped tables clearly visible at bottom
- Match rate gives progress indicator
- Consistent layout pattern maintained

## Cons
- Two panels can be hard to read on narrow screens
- No visual flow or relationship diagram
- Limited support for complex transformations
- Column-level diff not visible without clicking
- Doesn't scale well for schemas with 50+ tables
- Connecting lines can get cluttered

## Breakpoint Behavior
- Desktop: Two panels side by side, unmapped section below
- Tablet: Panels stack vertically, each 50% height
- Mobile: Single column, source then target