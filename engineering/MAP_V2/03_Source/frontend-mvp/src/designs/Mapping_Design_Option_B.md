# Mapping Design — Option B: Visual Flow Diagram with Drag-and-Drop

## Concept
A visual canvas-based mapping interface where users drag source tables onto target tables to create mappings. Transformation rules are configured via a side panel. Auto-mapping suggestions shown as pre-drawn connections.

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Mapping Configuration                                          │
│  Source: my-postgres-prod → Target: my-sql-staging             │
│  [Auto Map]  [Clear All]  [Save]  [Export]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Source Tables ──────┐  ┌─ Mapping Canvas ──────────────┐ │
│  │  📁 public            │  │                                 │ │
│  │    ├── users ────────→│  │    ┌─────────┐    ┌─────────┐ │ │
│  │    │   id ●────● id   │  │    │  users  │───▶│  users  │ │ │
│  │    │   email ●──● email│  │    │  (PG)   │    │ (MySQL) │ │ │
│  │    │   created_at ●●● │  │    └─────────┘    └─────────┘ │ │
│  │    │                    │  │                                 │ │
│  │    ├── orders ──────→│  │    ┌─────────┐    ┌─────────┐ │ │
│  │    │   order_id ●──● id│  │    │ orders  │───▶│ orders  │ │ │
│  │    │   customer_id ●● │  │    │  (PG)   │    │ (MySQL) │ │ │
│  │    │                    │  │    └─────────┘    └─────────┘ │ │
│  │    ├── products ⚠───→│  │                                 │ │
│  │    │   (column diff)  │  │    ┌─────────────┐             │ │
│  │    │                    │  │    │ legacy_orders│───✗──→  │ │
│  │    ├── legacy_orders ✗│  │    │ (no target)  │             │ │
│  │    └── (unmapped)     │  │    └─────────────┘             │ │
│  │                        │  │                                 │ │
│  └────────────────────────┘  └─────────────────────────────────┘ │
│                                                                 │
│  ┌─ Transformation Rules ──────────────────────────────────┐ │
│  │  users.email:     [Lowercase]  [Trim]  [Validate Email]│ │
│  │  orders.order_id: [Prefix: ORD_]                        │ │
│  │  orders.status:   [Map: pending→new, complete→done]    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Drag-and-drop** — Drag source tables onto target tables to create mappings
- **Pre-drawn connections** — Auto-mapped tables shown as pre-connected lines
- **Connection lines** — Visual lines between mapped tables with status colors
  - Green: exact match
  - Yellow: fuzzy match (column diff)
  - Red: unmatched
- **Transformation rules panel** — Side panel showing and editing transformation rules per column
- **Rule types** — Lowercase, Trim, Validate, Prefix, Suffix, Map (value transformation)
- **Canvas zoom/pan** — Mouse wheel zoom, click-drag pan
- **Auto-map** — One-click auto-map all matching tables
- **Clear all** — Remove all mappings from canvas

## Visual Design

- Canvas: `position: relative`, `overflow: auto`, `background: var(--color-bg)`
- Source panel: `width: 250px`, fixed left, scrollable
- Mapping canvas: `flex: 1`, center area with SVG connection lines
- Rules panel: `width: 300px`, fixed right, scrollable
- Connection lines: SVG `<line>` elements with colored strokes
- Table nodes: `border rounded-lg` cards with `box-shadow`
- Uses `reactflow` or custom SVG for connection rendering
- Uses existing `StatusBadge`, `Button`, `Modal` components

## Props Interface

```tsx
interface MappingPageProps {
  sourceSystemId: string;
  targetSystemId: string;
  projectId: string;
}
```

## New Components Needed

- `MappingCanvas.tsx` — Main canvas with zoom/pan and connection rendering
- `SourcePanel.tsx` — Left panel with source tables
- `TargetPanel.tsx` — Right panel with target tables
- `ConnectionLine.tsx` — SVG line connecting mapped tables
- `TransformationPanel.tsx` — Side panel for editing transformation rules
- `AutoMapButton.tsx` — One-click auto-map trigger

## API Endpoints

```
GET  /api/v1/mapping/{project_id}/tables       — get source and target tables
GET  /api/v1/mapping/{project_id}/auto-map     — get auto-mapping suggestions
POST /api/v1/mapping/{project_id}/mappings     — save mapping with transformations
PUT  /api/v1/mapping/{project_id}/mappings/{id} — update mapping
DELETE /api/v1/mapping/{project_id}/mappings/{id} — remove mapping
POST /api/v1/mapping/{project_id}/auto-map     — trigger auto-map
GET  /api/v1/mapping/{project_id}/export       — export mappings
```

## Pros
- Highly visual and intuitive
- Shows relationships at a glance
- Drag-and-drop is natural and fast
- Transformation rules visible in context
- Auto-mapping with visual confirmation
- Engaging user experience

## Cons
- Most complex to implement
- Canvas rendering can be slow with many tables
- Drag-and-drop doesn't work well on touch devices
- Requires careful state management for connections
- Higher development effort
- May be overkill for simple mappings

## When to Use
- Complex mappings with many tables
- Users who benefit from visual relationship overview
- Transformations are a key part of the mapping workflow
- When auto-mapping accuracy needs visual verification
- Larger schemas where side-by-side tables become unwieldy