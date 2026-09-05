# Phase 11 Task 11.7 — Gap Analysis

## Rule Discovery Integration (Backend + Frontend)

**Task:** 11.7  
**Status:** Analysis Complete  
**Date:** 2026-08-07

---

## 1. Scope Requirements (from 11_0_Scope_Document.md)

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Page renders at `/validation/rule-discovery` | ✅ Route exists |
| 2 | Rule discovery results display with inferred rules, mappings | ⚠️ Partial — page exists but wrong data source |
| 3 | Trigger discovery button functional | ❌ Missing |
| 4 | Reuse Migration → Discovery patterns | ❌ Not followed |
| 5 | Project context (project-specific results) | ❌ Missing |

---

## 2. Current State vs Required State

### Frontend

| Feature | Current | Required | Gap |
|---------|---------|----------|-----|
| Route | `/validation/rule-discovery` exists | Same | ✅ None |
| Component | `ValidationDiscoveryPage.tsx` | Same | ✅ None |
| Data source | `GET /api/v1/rules` (rule registry) | `GET /api/v1/rules/discovery/{project_id}` | ❌ Wrong API |
| Layout | SplitPane tree+table (registry view) | Two-tree SplitPane (discovery view) | ❌ Wrong layout |
| Project selector | None | Project ID input/dropdown | ❌ Missing |
| Trigger button | None | "Trigger Discovery" button | ❌ Missing |
| Status metrics | Total Rules, Controls, Enabled, Critical | Total Mappings, Rules Discovered, Last Discovery | ❌ Wrong metrics |
| Mappings view | None | Rule-to-Dataset Mappings table | ❌ Missing |

### Backend

| API | Status |
|-----|--------|
| `GET /api/v1/rules/discovery/{project_id}` | ✅ Created |
| `POST /api/v1/rules/discovery/{project_id}/trigger` | ✅ Created |
| `GET /api/v1/rules/discovery/{project_id}/status` | ✅ Created |
| `GET /api/v1/rules/discovery/{project_id}/mappings` | ✅ Created |

---

## 3. Reuse Analysis

| Reuse Source | Pattern | Applied |
|--------------|---------|---------|
| `DiscoveryPage.tsx` | Tree view, table layout | ✅ Adapted for two-tree |
| `useDiscovery.ts` | Data fetching hooks | ✅ Adapted as `useRuleDiscovery.ts` |
| `StatusBadge`, `MetricCard`, `SearchBar` | Shared components | ✅ Reused |
| `SplitPane` | Left-right panel layout | ✅ Reused |

---

## 4. Duplication Risk

**No duplication identified.** The new files extend existing patterns without duplicating code:
- `app/api/routes/rule_discovery_routes.py` — new, follows `discovery_routes.py` pattern
- `app/services/rule_discovery_service.py` — new, follows service pattern
- `app/repositories/rule_discovery_repository.py` — new, follows repository pattern
- `src/hooks/useRuleDiscovery.ts` — new, follows `useDiscovery.ts` pattern
- `src/types/rule_discovery.ts` — new, follows `discovery.ts` pattern

---

## 5. Files Requiring Modification

### New Files (6)
1. `app/api/routes/rule_discovery_routes.py`
2. `app/services/rule_discovery_service.py`
3. `app/repositories/rule_discovery_repository.py`
4. `app/api/models/rule_discovery_models.py`
5. `tests/test_rule_discovery_routes.py`
6. `tests/test_rule_discovery_service.py`

### Modified Files (4)
1. `app/api/routes/__init__.py` — Add import
2. `app/api/main.py` — Register router
3. `src/routes/ValidationDiscoveryPage.tsx` — Rewrite with discovery data
4. `src/components/Shell/Shell.tsx` — Add navigation link

---

**End of Document**
