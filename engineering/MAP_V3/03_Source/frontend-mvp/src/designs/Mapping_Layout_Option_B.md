# Mapping Layout — Option B: Canvas + Rules Panel

## Consistent Layout Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  Mapping Canvas                                                │
│  Visual mapping with transformation rules                    │
│  [Tenant Filter ▼]  [Auto Map]  [Save]  [Export]            │
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
│  ┌─ Source ──────┐  ┌─ Mapping Canvas ──────────────────┐┌─ Rules ──────┐│
│  │  📁 public       │  │                                    ││               ││
│  │  ├── users ──────│──│  ┌─────────┐    ┌─────────┐  │││  users.email:  ││
│  │  │   id ●────● id│  │  │  users  │───▶│  users  │  │││  [Lowercase]   ││
│  │  │   email ●──● email│ │  │ (PG)    │    │ (MySQL) │  │││  [Trim]        ││
│  │  │   created_at ●●│  │  └─────────┘    └─────────┘  │││  [Validate]    ││
│  │  │                  │  │                                    │││               ││
│  │  ├── orders ─────│──│  ┌─────────┐    ┌─────────┐  │││  orders.status:││
│  │  │   order_id ●●│  │  │ orders  │───▶│ orders  │  │││  [Map: pending→ ││
│  │  │   customer_id ●│ │  │  (PG)   │    │ (MySQL) │  │││    new, complete ││
│  │  │                  │  │  └─────────┘    └─────────┘  │││    → done]     ││
│  │  ├── products ⚠──│──│  │                                    │││               ││
│  │  │   (column diff)│  │  ┌─────────────┐                  │││  products.price││
│  │  ├── legacy_orders │  │  │ legacy_orders│───✗──→ (none)  │││  [Map: USD→EUR, ││
│  │  │  (no target)    │  │  └─────────────┘                  │││    × 1.08]     ││
│  │  │                  │  │                                    │││               ││
│  │  📁 reporting      │  │  ┌─────────────┐                  │││  products.desc ││
│  │  └── ...            │  │  │ archive_orders│───✗──→ (none)  │││  [Trim]        ││
│  │                      │  │  └─────────────┘                  │││               ││
│  └──────────────────────┘  └────────────────────────────────┘│└───────────────┘│
│                                                                     │
│  ┌─ Unmapped ─────────────────────────────────────────────┐ │
│  │  Source: legacy_orders, old_cust_id                     │ │
│  │  Target: archive_orders, import_timestamp               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Match Rate: 8/10 columns (80%)  [Validate]  [Save]  [Export]   │
└─────────────────────────────────────────────────────────────┘
```

## Spatial Breakdown

- **Header:** Page title + source/target selectors + tenant filter + action buttons (top-right)
- **KPI Cards:** 2 cards — Tables Mapped (%), Columns Mapped (%)
- **Action Bar:** Auto Map, Accept All, Save Mapping, Export
- **Main Content (top):** Three-column layout — Source tables (left), Mapping canvas (center), Transformation rules (right)
- **Detail Panel (bottom):** Unmapped tables list + match rate footer

## Dimensions

- KPI cards: `grid grid-cols-2`, each card `min-height: 70px`
- Source panel: `width: 20%`, scrollable
- Canvas: `flex: 1`, `min-height: 400px`, `overflow: auto`
- Rules panel: `width: 25%`, scrollable
- Unmapped section: Full width, auto height
- Action bar: Full width, `padding: var(--space-md)`

## Navigation

- Tenant filter applies to all data
- Source/target selectors switch mapping context
- "Auto Map" triggers automatic mapping and draws connections
- Click a connection line to see/edit transformation rules in the right panel
- Drag tables to rearrange positions on canvas
- Zoom in/out with mouse wheel or buttons
- "Accept All" accepts all auto-mapped relationships
- "Save Mapping" persists all mappings
- "Validate" runs validation on current mappings
- "Export" downloads mappings as CSV/JSON
- Match rate updates in real-time as mappings change

## Pros
- Highly visual, intuitive mapping overview
- Connection lines show relationships at a glance
- Transformation rules visible in context
- Drag-and-drop for table arrangement
- Zoom/pan for large schemas
- Engaging, modern UX
- Consistent layout pattern maintained

## Cons
- Most complex layout to implement
- Canvas rendering can be slow with many tables
- Drag-and-drop doesn't work well on touch devices
- Three-column layout may be cramped on medium screens
- Requires careful state management for connections
- Higher development effort

## Breakpoint Behavior
- Desktop: Three columns side by side
- Tablet: Canvas and rules stack below source panel
- Mobile: Single column, source, canvas, and rules all stack