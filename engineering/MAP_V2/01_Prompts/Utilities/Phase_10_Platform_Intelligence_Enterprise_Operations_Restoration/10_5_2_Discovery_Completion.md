# 10.5.2 — Discovery Completion

**Target Layout:** Option C – Tree + Table (Split Pane)
**Route:** `/migration/discovery/tree`
**Current Status:** TreeTablePage exists but calls nonexistent APIs, no resizable split pane
**Est. Effort:** 7-10 days

---

## Current State

### What Exists
| Page | Route | Lines | Status |
|------|-------|-------|--------|
| DiscoveryPage | `/migration/discovery` | 187 | Execution trigger (misnamed — runs validation, not discovery) |
| DiscoveryTreeTablePage | `/migration/discovery/tree` | 396 | Tree + table UI, calls 3 nonexistent APIs |

### What Works in DiscoveryTreeTablePage
- Summary metric cards (systems, schemas, tables, matched, match rate)
- Tree view of systems/schemas/table/columns (30% fixed width, no resize)
- Data table with source/target/status columns
- SearchBar for table name filtering
- Status filter dropdown
- Column sorting
- Client-side pagination (10 rows/page)
- Row click shows column diff detail
- TenantFilter integration

### What's Broken
- **3 backend endpoints missing** — page will show error state:
  - `GET /api/v1/discovery/summary` ❌
  - `GET /api/v1/discovery/tree` ❌
  - `GET /api/v1/discovery/tables` ❌
- Tree panel is fixed width (30%) — no resizable split pane
- No tree-table selection sync (click tree → filter table, click table → highlight tree)
- No keyboard navigation for tree nodes
- Uses hand-rolled table instead of shared `DataTable` component
- Types defined inline, not in shared types file

### Backend APIs

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /discovery/{batch_id}/datasets` | ✅ Exists | Batch-scoped dataset list |
| `GET /discovery/{batch_id}/datasets/{id}` | ✅ Exists | Single dataset detail |
| `POST /discovery/current` | ✅ Exists | Trigger discovery |
| `GET /discovery/{batch_id}/status` | ✅ Exists | Discovery status |
| `GET /discovery/summary` | ❌ Missing | Needed by TreeTablePage |
| `GET /discovery/tree` | ❌ Missing | Needed by TreeTablePage |
| `GET /discovery/tables` | ❌ Missing | Needed by TreeTablePage |

---

## Target State (Design Option C)

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│ PageHeader: Discovery Results              [Tenant] [Refresh]│
├──────────────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │Systems│ │Schemas│ │Tables│ │Matched│ │Rate%│  ← MetricCards│
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘               │
├──────────────────────────────────────────────────────────────┤
│ [Search tables...]           [Status: All ▾]                 │
├─────────────────┐ ┃ ├────────────────────────────────────────┤
│ Tree (30%)      │ ┃ │ Table (70%)                            │
│ ┌─────────────┐ │ ┃ │ ┌──────────────────────────────────┐  │
│ │▸ Source DB  │ │ ┃ │ │Source Table │Target Table │Status │  │
│ │  ▸ public  │ │ ┃ │ ├─────────────┼─────────────┼───────┤  │
│ │    ▸ users │←───────│accounts_src │accounts_tgt │ ✅    │  │
│ │    ▸ orders│ │ ┃ │ │balances_src │balances_tgt │ ✅    │  │
│ │  ▸ audit  │ │ ┃ │ │users_src    │             │ ❌    │  │
│ │▸ Target DB│ │ ┃ │ └──────────────────────────────────┘  │
│ └─────────────┘ │ ┃ │                                        │
│  [Expand All]   │ ┃ │ ┌ Column Diff Detail ──────────────┐  │
│  [Collapse All] │ ┃ │ │col_name │source_type│target_type│  │
│                 │ ┃ │ │id       │int4       │int8       │  │
│                 │ ┃ │ │name     │varchar(50)│varchar(100)│ │
│                 │ ┃ │ └──────────────────────────────────┘  │
└─────────────────┘ ┃ └────────────────────────────────────────┘
                     ┃ ← Draggable splitter
```

### Features Required
1. **Resizable split pane** — drag divider to resize tree vs table
2. **Hierarchical tree** — systems → schemas → tables → columns
3. **Data table** — source table, target table, status, with sort/filter/pagination
4. **Tree-table sync** — click tree node filters table; click table row highlights tree
5. **Column diff detail** — expandable row showing source vs target columns
6. **Expand all / Collapse all** controls
7. **Keyboard navigation** — arrow keys for tree, tab for table
8. **URL state persistence** — selected node, filters in query params

---

## Implementation Plan

### Phase 1: Backend (2-3 days)

| Task | Effort | Details |
|------|--------|---------|
| Create `GET /discovery/summary` endpoint | 0.5d | Aggregate counts from system_registry + discovery results |
| Create `GET /discovery/tree` endpoint | 1d | Build hierarchical response: system → schema → table → column with status |
| Create `GET /discovery/tables` endpoint | 0.5d | Flat table list with source/target mapping and status |
| Column diff data | 0.5d | Source vs target column type comparison |
| Repository/service layer | 0.5d | `DiscoveryRepository` methods for tree/tables queries |

### Phase 2: Frontend Types & Hooks (0.5 day)

| Task | Effort | Details |
|------|--------|---------|
| Create `src/types/discovery.ts` | 0.25d | Extract `SchemaNode`, `ColumnDiff`, `DiscoveryTableRow`, `DiscoverySummary` from inline |
| Create `src/hooks/useDiscovery.ts` | 0.25d | `useDiscoverySummary()`, `useDiscoveryTree()`, `useDiscoveryTables()` |

### Phase 3: Resizable Split Pane (1-1.5 days)

| Task | Effort | Details |
|------|--------|---------|
| Add `react-resizable` or build CSS-based splitter | 0.25d | Package install or custom implementation |
| Build `SplitPane` component | 0.5d | Left/right panels, draggable divider, min/max widths |
| Persist split position to localStorage | 0.25d | Remember user preference |
| Integrate into DiscoveryTreeTablePage | 0.5d | Replace fixed `width: 30%` with split pane |

### Phase 4: Tree-Table Improvements (2-3 days)

| Task | Effort | Details |
|------|--------|---------|
| Replace hand-rolled table with `DataTable` | 0.5d | Use shared component with column config |
| Tree-table selection sync | 0.5d | Bidirectional: tree → table filter, table → tree highlight |
| Expand all / Collapse all controls | 0.25d | Toolbar above tree |
| Keyboard navigation for tree | 0.5d | Arrow keys, Enter/Space, `role="treeitem"`, `aria-expanded` |
| Column diff detail panel | 0.5d | Move from inline to side panel or modal |
| URL state persistence | 0.25d | Sync filter, selected node, page to query params |

### Phase 5: Polish & Tests (1-1.5 days)

| Task | Effort | Details |
|------|--------|---------|
| Unit tests | 0.5d | Tree rendering, table sorting/filtering, pagination |
| Integration tests | 0.5d | Mock discovery APIs, test full flow |
| Responsive layout | 0.25d | Stack tree above table on mobile |
| Accessibility audit | 0.25d | `aria-sort`, `aria-expanded`, focus management |

---

## Files to Create/Modify

### Backend
| File | Action |
|------|--------|
| `app/api/routes/discovery_routes.py` | MODIFY — add 3 endpoints |
| `app/services/discovery/discovery_service.py` | MODIFY — add tree/tables methods |
| `app/db/repositories/discovery_repository.py` | CREATE or MODIFY |

### Frontend
| File | Action |
|------|--------|
| `src/types/discovery.ts` | CREATE |
| `src/hooks/useDiscovery.ts` | CREATE |
| `src/components/shared/SplitPane.tsx` | CREATE |
| `src/routes/DiscoveryTreeTablePage.tsx` | REWRITE |
| `src/routes/DiscoveryPage.tsx` | MODIFY — clarify as "Run Discovery" page |

---

## Acceptance Criteria

- [ ] Backend serves `/discovery/summary`, `/discovery/tree`, `/discovery/tables`
- [ ] Split pane is resizable by dragging divider
- [ ] Tree shows systems → schemas → tables hierarchy
- [ ] Table shows source/target mapping with status
- [ ] Click tree node → table filters to that scope
- [ ] Click table row → tree highlights source node
- [ ] Expand all / Collapse all works
- [ ] Arrow keys navigate tree
- [ ] Column diff detail shows on row click
- [ ] URL reflects current state (selected node, filters)
- [ ] All states handled: loading, error, empty
- [ ] Dark mode works
- [ ] Responsive on mobile (stacked layout)
