# Mapping Design — Option A: Side-by-Side Table View

## Concept
A side-by-side table view showing source and target tables with column-level mapping. Auto-mapping suggestions are shown inline; users can accept, modify, or reject mappings with a single click.

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Mapping Configuration                                          │
│  Source: my-postgres-prod → Target: my-sql-staging             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Source Tables ────────────┐  ┌─ Target Tables ────────────┐│
│  │  public.users               │  │  public.users               ││
│  │  ┌────────────────────┐     │  │  ┌────────────────────┐     ││
│  │  │ ✓ id          (PK) │←───→│  │  │ ✓ id          (PK) │     ││
│  │  │ ✓ email              │←───→│  │  │ ✓ email              │     ││
│  │  │ ✓ created_at         │←───→│  │  │ ✓ created_at         │     ││
│  │  │ ✗ legacy_id     (✗) │     │  │  │                      │     ││
│  │  └────────────────────┘     │  │  └────────────────────┘     ││
│  │                              │  │                              ││
│  │  public.orders               │  │  public.orders               ││
│  │  ┌────────────────────┐     │  │  ┌────────────────────┐     ││
│  │  │ ✓ order_id     (PK)│←───→│  │  │ ✓ order_id     (PK)│     ││
│  │  │ ✓ customer_id      │←───→│  │  │ ✓ customer_id      │     ││
│  │  │ ✗ old_cust_id  (✗) │     │  │  │                      │     ││
│  │  └────────────────────┘     │  │  └────────────────────┘     ││
│  └─────────────────────────────┘  └─────────────────────────────┘│
│                                                                 │
│  ┌─ Unmapped Tables ────────────────────────────────────────┐ │
│  │  Source: legacy_orders (no target match)                  │ │
│  │  Target: archive_orders (no source match)                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Accept All Auto-Mapped]  [Save Mapping]  [Export]           │
└─────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Side-by-side tables** — Source on left, target on right, aligned by matched tables
- **Auto-mapping** — Exact match (table name) and fuzzy match (similar names) shown with ✓
- **Manual mapping** — Click a column to change its target; dropdown shows available columns
- **Reject mapping** — Click ✗ on a mapped column to unmap it
- **Unmapped section** — Tables with no match shown at the bottom
- **Accept all** — One-click accept all auto-mapped relationships
- **Save** — Persists mappings to backend
- **Export** — Export mapping as CSV/JSON

## Visual Design

- Two-column layout: `grid grid-cols-2 gap-4`
- Source tables: `border rounded-lg` card, left column
- Target tables: `border rounded-lg` card, right column
- Column rows: `flex justify-between items-center py-1`
- Match indicator: `StatusBadge` with variants: `success` (matched), `warning` (modified), `error` (unmapped)
- Unmapped section: `bg-yellow-50` border, `border rounded-lg`
- Uses existing `StatusBadge`, `Button`, `Modal` components
- Uses `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)` tokens

## Props Interface

```tsx
interface MappingPageProps {
  sourceSystemId: string;
  targetSystemId: string;
  projectId: string;
}
```

## New Components Needed

- `SourceTablePanel.tsx` — Left panel showing source tables and columns
- `TargetTablePanel.tsx` — Right panel showing target tables and columns
- `ColumnMapper.tsx` — Individual column mapping row with accept/reject/modify
- `UnmappedTableList.tsx` — List of tables with no match

## API Endpoints

```
GET  /api/v1/mapping/{project_id}/tables       — get source and target tables
GET  /api/v1/mapping/{project_id}/auto-map     — get auto-mapping suggestions
POST /api/v1/mapping/{project_id}/columns      — save column mapping
PUT  /api/v1/mapping/{project_id}/columns/{id} — update column mapping
DELETE /api/v1/mapping/{project_id}/columns/{id} — remove column mapping
POST /api/v1/mapping/{project_id}/accept-all  — accept all auto-mapped
GET  /api/v1/mapping/{project_id}/export       — export mappings
```

## Pros
- Intuitive side-by-side comparison
- Quick to understand and use
- Auto-mapping reduces manual work
- Inline editing is fast
- Familiar table-based layout

## Cons
- Two-column layout can be hard to read on narrow screens
- No visual flow or relationship lines
- Limited support for complex transformations
- Column-level diff not visible without clicking
- Doesn't scale well for schemas with 50+ tables

## When to Use
- Standard source-to-target mapping scenarios
- Simple 1:1 table mappings
- Quick mapping setup during onboarding
- Users who prefer table-based data views