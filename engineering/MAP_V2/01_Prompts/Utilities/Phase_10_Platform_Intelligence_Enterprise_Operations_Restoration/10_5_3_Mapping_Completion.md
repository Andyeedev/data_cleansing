# 10.5.3 — Mapping Completion

**Target Layout:** Option C – Spreadsheet Grid
**Route:** `/migration/mappings/spreadsheet`
**Current Status:** Partially implemented (spreadsheet-like table exists, missing key features)
**Est. Effort:** 13-18 days

---

## Current State

### What Exists
| Page | Route | Lines | Status |
|------|-------|-------|--------|
| MappingPage | `/migration/mappings` | 8 | **Stub** — heading + description only |
| MappingSpreadsheetPage | `/migration/mappings/spreadsheet` | 369 | Partial spreadsheet grid |

### What Works in MappingSpreadsheetPage
- PageHeader with title, description, actions
- TenantFilter integration
- KPI summary cards (tables mapped, columns mapped, match rate)
- Source schema display with table tags
- SearchBar + status filter dropdown
- Spreadsheet-like `<table>` with columns: Source, Transform, Value/Rule, Target, Status
- Transform type dropdown per row (9 options)
- Transform value text input per row
- Auto Map button (calls `POST /mapping/auto-map`)
- Save Mapping button (calls `POST /mapping/columns`)
- Export CSV (client-side)
- Match rate footer bar
- Loading/Error/Empty states

### What's Missing
- No target column editing (read-only display)
- No column resize / drag handles
- No row drag-and-drop reordering
- No keyboard navigation (arrow/tab between cells)
- No undo/redo state management
- No Unmapped Source/Target Columns sections
- No Validate button
- No Accept All button
- No alternating row colors
- No transform badge coloring
- No pagination for large datasets
- No progress bar for match rate (text only)

### Backend APIs — CRITICAL MISMATCHES

| Frontend Calls | Backend Has | Status |
|----------------|-------------|--------|
| `GET /mapping/summary` | ❌ | Missing |
| `GET /mapping/schema` | ❌ | Missing |
| `GET /mapping/columns` | ❌ | Missing (only `/{mapping_id}/columns`) |
| `POST /mapping/auto-map` | `POST /{project_id}/auto` | Path mismatch |
| `POST /mapping/columns` | ❌ | Missing bulk save |
| — | `GET /mappings/{project_id}` | Exists, not consumed |
| — | `POST /mappings/{project_id}/auto` | Exists, path differs |
| — | `GET /mappings/{mapping_id}/columns` | Exists, scoped |
| — | `POST /mappings/{mapping_id}/columns` | Exists, single |
| — | `POST /mappings/{mapping_id}/validate` | Exists, scoped |

---

## Target State (Design Option C)

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│ PageHeader: Mapping Configuration       [Tenant] [Auto] [Save] [Export] │
├──────────────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐                                  │
│ │Tables│ │Cols  │ │Rate%│  ← MetricCards                    │
│ └──────┘ └──────┘ └──────┘                                  │
├──────────────────────────────────────────────────────────────┤
│ Source Schema: [accounts_source] [balances_source] [...]      │
├──────────────────────────────────────────────────────────────┤
│ [Search...]  [Status: All ▾]                                 │
├──────────────────────────────────────────────────────────────┤
│ ┌───────────┬──────────┬───────────┬───────────┬──────────┐  │
│ │Source Col │Transform │Value/Rule │Target Col │Status    │  │ ← Sticky header
│ ├───────────┼──────────┼───────────┼───────────┼──────────┤  │
│ │ account_id│ None     │           │ account_id│ ✅ Match │  │ ← Alternating rows
│ │ name      │ lowercase│           │ name      │ ✅ Match │  │
│ │ balance   │ map      │ amount    │ amount    │ 🔄 Mod  │  │
│ │ email     │          │           │           │ ❌ Unmap │  │
│ └───────────┴──────────┴───────────┴───────────┴──────────┘  │
│ [─────────────────────── Match Rate: 75% ──────────────────] │ ← Progress bar
├──────────────────────────────────────────────────────────────┤
│ Unmapped Source: [email, phone]     Unmapped Target: [addr]  │
├──────────────────────────────────────────────────────────────┤
│ [Validate] [Accept All] [Save Mapping] [Export CSV]          │
└──────────────────────────────────────────────────────────────┘
```

### Features Required
1. **Target column dropdown** — editable, select from target schema columns
2. **Alternating row colors** — zebra striping
3. **Transform badge coloring** — colored pills per transform type
4. **Unmapped sections** — lists of unmapped source and target columns
5. **Validate button** — runs validation, shows issues
6. **Accept All button** — auto-accept all matched mappings
7. **Progress bar** — visual match rate indicator
8. **Column resize** — drag column borders to resize
9. **Pagination** — for large datasets (100+ rows)
10. **Bulk operations** — select multiple rows, change transform in bulk

---

## Implementation Plan

### Phase 1: Backend Fixes (3-4 days)

| Task | Effort | Details |
|------|--------|---------|
| Add `get_dataset_mappings(project_id)` to repository | 0.5d | Currently missing, referenced by routes |
| Add `update_dataset_mapping(mapping_id, updates)` to repository | 0.5d | Currently missing |
| Create `GET /mapping/summary` endpoint | 1d | Aggregate stats: tables mapped, columns mapped, match rate |
| Create `GET /mapping/schema` endpoint | 0.5d | Source schema info from discovery results |
| Create `GET /mapping/columns` (flat list) | 0.5d | All column mappings across all dataset mappings |
| Create `POST /mapping/columns` (bulk save) | 0.5d | Accept array of column mapping updates |
| Create `POST /mapping/validate` (flat) | 0.5d | Validate all mappings for tenant |
| Fix `_get_source_columns` / `_get_target_columns` stubs | 0.5d | Currently return empty arrays |

### Phase 2: Frontend Types & Hooks (1 day)

| Task | Effort | Details |
|------|--------|---------|
| Create `src/types/mapping.ts` | 0.5d | Extract `MappingRow`, `MappingSummary`, `TransformType` from inline |
| Create `src/hooks/useMapping.ts` | 0.5d | `useMappingSummary()`, `useMappingColumns()`, `useAutoMap()`, `useSaveMappings()`, `useValidateMapping()` |

### Phase 3: MappingSpreadsheetPage Completion (4-5 days)

| Task | Effort | Details |
|------|--------|---------|
| Add target column dropdown/editing | 1d | Select from target schema columns per row |
| Add alternating row colors | 0.25d | Zebra striping via CSS |
| Add transform badge coloring | 0.25d | Colored pills: green=matched, yellow=modified, red=unmapped |
| Add Unmapped Source/Target sections | 0.5d | Lists below main grid |
| Add Validate button + endpoint integration | 0.5d | Call validate, show issues |
| Add Accept All button | 0.25d | Auto-accept all matched |
| Add progress bar for match rate | 0.25d | Replace text with ProgressBar component |
| Add pagination | 0.5d | For datasets with 100+ columns |
| Wire to real backend endpoints | 0.5d | Fix API path mismatches |

### Phase 4: Advanced Spreadsheet Features (4-5 days)

| Task | Effort | Details |
|------|--------|---------|
| Column resize (drag handles) | 1.5d | Draggable column borders, persist widths |
| Keyboard navigation | 1.5d | Arrow keys between cells, Tab to next row, Enter to edit |
| Row drag-and-drop reordering | 1d | Optional: reorder rows via drag |
| Undo/redo state management | 1d | Stack-based undo for all cell changes |

### Phase 5: MappingPage + Polish (2-3 days)

| Task | Effort | Details |
|------|--------|---------|
| Build MappingPage (table-level overview) | 1d | Dataset-level mapping view, links to spreadsheet |
| Responsive layout | 0.5d | Horizontal scroll on mobile |
| Tests | 0.5d | Unit + integration |
| Accessibility | 0.5d | ARIA roles, keyboard nav |

---

## Files to Create/Modify

### Backend
| File | Action |
|------|--------|
| `app/api/routes/mapping_routes.py` | MODIFY — add summary/schema/columns/validate endpoints |
| `app/services/mapping/mapping_repository.py` | MODIFY — add missing methods |
| `app/services/mapping/mapping_service.py` | MODIFY — implement column stubs |

### Frontend
| File | Action |
|------|--------|
| `src/types/mapping.ts` | CREATE |
| `src/hooks/useMapping.ts` | CREATE |
| `src/routes/MappingSpreadsheetPage.tsx` | REWRITE |
| `src/routes/MappingPage.tsx` | REBUILD from stub |

---

## Acceptance Criteria

- [ ] Backend serves all mapping endpoints without errors
- [ ] Target column is editable (dropdown per row)
- [ ] Alternating row colors visible
- [ ] Transform types show colored badges
- [ ] Unmapped source/target columns listed below grid
- [ ] Validate button triggers validation and shows results
- [ ] Accept All auto-accepts matched mappings
- [ ] Match rate shown as progress bar
- [ ] Column resize works via drag handles
- [ ] Keyboard navigation works (arrow keys between cells)
- [ ] Pagination handles 100+ rows
- [ ] Save persists all changes to backend
- [ ] Export CSV includes all data
- [ ] All states handled: loading, error, empty
- [ ] Dark mode works
- [ ] Responsive on mobile (horizontal scroll)
