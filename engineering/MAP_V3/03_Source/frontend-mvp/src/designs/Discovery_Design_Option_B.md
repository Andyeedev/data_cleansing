# Discovery Design — Option B: Card-Based with Schema Diff

## Concept
A card-based layout showing systems as visual cards with schema previews. Discovery results display as a side-by-side schema diff between source and target, highlighting matched/unmatched tables and columns.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Discovery                                      │
│  Schema discovery and matching results          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─ Systems ─────────────────────────────────┐ │
│  │  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │ PostgreSQL   │  │ MySQL       │        │ │
│  │  │ my-postgres  │  │ my-sql      │        │ │
│  │  │ Source       │  │ Target      │        │ │
│  │  │ 12 tables    │  │ 8 tables    │        │ │
│  │  │ 340 columns  │  │ 210 columns │        │ │
│  │  └─────────────┘  └─────────────┘        │ │
│  │                                            │ │
│  │  [Run Discovery]  [View Details →]        │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Schema Diff ────────────────────────────┐ │
│  │  Source Tables    │  Target Tables       │ │
│  │  ───────────────  │  ────────────────    │ │
│  │  ✓ users          │  ✓ users             │ │
│  │  ✓ orders         │  ✓ orders            │ │
│  │  ✗ legacy_orders  │                      │ │
│  │                    │  ✗ archive_orders   │ │
│  │  ⚠ products_v2    │  ⚠ products         │ │
│  │    (column diff)      (column diff)      │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Match Summary ──────────────────────────┐ │
│  │  Matched:    8 / 12  (67%)               │ │
│  │  Unmatched:  2 source-only, 1 target-only│ │
│  │  Modified:   1 (column diff)             │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Key Behaviors

- **System cards** — Each system shown as a card with icon, name, type, table/column counts
- **Schema diff view** — Side-by-side comparison of source and target tables
- **Match indicators** — ✓ matched, ✗ unmatched, ⚠ modified (column differences)
- **Match summary** — Aggregate stats: matched count, unmatched count, modified count
- **Drill-down** — Click a card to expand schema details for that system
- **Run discovery** — Same run button as Option A, but results populate the diff view
- **Filter by status** — Toggle between All, Matched, Unmatched, Modified

## Visual Design

- Cards: `border rounded-lg p-4` with `hover:shadow-md` transition
- Schema diff: two-column layout with `border-left` dividers
- Match indicators: colored icons (green ✓, red ✗, yellow ⚠)
- Match summary: `grid grid-cols-3` metric cards
- Uses existing `StatusBadge`, `MetricCard`, `EmptyState`, `ErrorState` components
- Uses `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)` tokens

## Props Interface

```tsx
interface DiscoveryPageProps {
  // No props — uses hooks internally
}
```

## New Components Needed

- `SystemCard.tsx` — Card displaying system info and schema stats
- `SchemaDiffView.tsx` — Side-by-side table comparison
- `MatchIndicator.tsx` — Colored icon for match status
- `MatchSummary.tsx` — Aggregate match statistics

## API Endpoints

```
GET  /api/v1/systems                              — list systems with schema stats
GET  /api/v1/discovery/{batch_id}/results          — discovery results with diff data
POST /api/v1/discovery/run                         — start discovery execution
GET  /api/v1/execution/{batch_id}/status           — poll execution status
```

## Pros
- Visual schema comparison is immediately actionable
- Card layout scales better than list for many systems
- Schema diff highlights exactly what needs mapping
- Match summary gives quick health check
- More engaging and informative than list view

## Cons
- More complex UI components to build
- Requires backend to compute schema diff
- Two-column layout may be hard to read on small screens
- More API calls needed for schema details
- Higher development effort

## When to Use
- When schema comparison is a primary user need
- Medium-to-large number of systems
- Teams that need to understand differences before mapping
- When visual feedback improves user confidence