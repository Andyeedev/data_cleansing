# Mapping Design — Option C: Spreadsheet-like Grid with Column Mapping

## Concept
A spreadsheet-like grid where each row represents a column mapping relationship. Source columns on the left, target columns on the right, with transformation rules in the middle. Similar to Excel but purpose-built for column mapping.

## Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Mapping Configuration                                                   │
│  Source: my-postgres-prod.public → Target: my-sql-staging.public       │
│  [Auto Map]  [Save]  [Export CSV]                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ Source Column ────┬─ Transform ──────────────┬─ Target Column ────┐│
│  │                     │  Type    │ Value/Rule   │                     ││
│  ├─────────────────────┼──────────┼──────────────┼─────────────────────┤│
│  │ id                  │ —        │ —            │ id                  ││
│  │ email               │ Lower    │ —            │ email               ││
│  │ created_at          │ —        │ —            │ created_at          ││
│  │ legacy_id           │ ✗ Skip   │ —            │ —                   ││
│  │ status              │ Map      │ pending→new  │ status              ││
│  │                     │          │ complete→done│                     ││
│  │ amount              │ Prefix   │ USD_         │ amount              ││
│  │ description         │ Trim     │ —            │ description         ││
│  └─────────────────────┴──────────┴──────────────┴─────────────────────┘│
│                                                                          │
│  ┌─ Unmapped Source Columns ──────────────────────────────────────────┐│
│  │  legacy_id, notes, internal_ref                                    ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌─ Unmapped Target Columns ──────────────────────────────────────────┐│
│  │  archive_flag, import_timestamp                                     ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Match Rate: 8 / 10 columns (80%)                                       ││
│  [Save Mapping]  [Validate]  [Export]                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Spreadsheet grid** — Each row is a column mapping relationship
- **Three columns** — Source column, Transform, Target column
- **Transform dropdown** — Per-column transformation type selector:
  - None (direct mapping)
  - Lowercase / Uppercase / Trim
  - Prefix / Suffix
  - Map (value transformation with rule editor)
  - Skip (exclude from mapping)
  - Validate (with rule configuration)
- **Rule editor** — Click transform cell to open inline rule editor
  - Map type: key-value pairs (e.g., `pending → new`, `complete → done`)
  - Prefix/Suffix: text input
  - Validate: regex or type selector
- **Auto-map** — One-click auto-map all matching columns
- **Match rate** — Progress indicator showing mapping completion percentage
- **Unmapped sections** — Lists of source and target columns with no mapping
- **Save** — Persists all mappings in a single save operation
- **Validate** — Runs validation on current mappings before saving
- **Export** — Export mapping as CSV

## Visual Design

- Grid: `table` with `border-collapse`, `border` on cells
- Header row: `bg-gray-100`, `font-semibold`, `text-xs uppercase`
- Data rows: alternating `bg-white` / `bg-gray-50`
- Transform cells: colored badge showing transform type
  - None: `bg-gray-100` text-gray-500
  - Lower/Uppercase/Trim: `bg-blue-100` text-blue-700
  - Map: `bg-yellow-100` text-yellow-700
  - Skip: `bg-red-100` text-red-700
  - Validate: `bg-green-100` text-green-700
- Match rate: progress bar at bottom of grid
- Unmapped sections: `bg-yellow-50` rounded card
- Uses existing `Button`, `StatusBadge`, `ProgressBar`, `Modal` components

## Props Interface

```tsx
interface MappingPageProps {
  sourceSystemId: string;
  targetSystemId: string;
  projectId: string;
  sourceSchema: string;
  targetSchema: string;
}
```

## New Components Needed

- `MappingGrid.tsx` — Main spreadsheet-like grid
- `MappingRow.tsx` — Individual row with source, transform, target cells
- `TransformCell.tsx` — Transform type selector and rule editor
- `UnmappedList.tsx` — Lists of unmapped source/target columns
- `MatchRateIndicator.tsx` — Progress bar showing mapping completion

## API Endpoints

```
GET  /api/v1/mapping/{project_id}/columns       — get source and target columns
GET  /api/v1/mapping/{project_id}/auto-map      — get auto-mapping suggestions
POST /api/v1/mapping/{project_id}/columns       — save all column mappings
PUT  /api/v1/mapping/{project_id}/columns/{id}  — update single column mapping
DELETE /api/v1/mapping/{project_id}/columns/{id} — remove column mapping
POST /api/v1/mapping/{project_id}/validate      — validate current mappings
GET  /api/v1/mapping/{project_id}/export        — export mappings as CSV
```

## Pros
- Familiar spreadsheet interaction pattern
- Granular control over each column mapping
- Transform rules visible inline
- Easy to scan and review all mappings at once
- Match rate gives clear progress indicator
- Unmapped columns clearly visible
- Works well for column-heavy mappings

## Cons
- Grid can become wide and hard to read
- Transform cell editing requires careful UI
- No visual relationship between tables
- Less intuitive for users unfamiliar with spreadsheets
- Doesn't show table-level matching (only column-level)
- Wide grids may not fit on small screens

## When to Use
- Column-heavy mappings with many transformations
- Users familiar with spreadsheet interfaces
- When granular transform control is essential
- When mapping completion rate needs to be tracked
- When unmapped columns need clear visibility