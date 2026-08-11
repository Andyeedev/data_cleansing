# Phase 11 Task 11.7 — Minimum Change Proposal

## Rule Discovery Integration (Backend + Frontend)

**Task:** 11.7  
**Status:** Proposal Ready  
**Date:** 2026-08-07

---

## Summary

**Core Logic:** Existing `AutoRuleDiscovery` class is fully functional. Frontend needs rewrite to use discovery API endpoints and two-tree layout.

**Implementation Pattern:** Follows existing Migration → Discovery patterns.

---

## 1. Files to CREATE (6 New Files)

| # | File | Purpose | Pattern |
|---|------|---------|---------|
| 1 | `app/api/routes/rule_discovery_routes.py` | 4 API endpoints | `discovery_routes.py` |
| 2 | `app/services/rule_discovery_service.py` | Service layer | `discovery_service_api.py` |
| 3 | `app/repositories/rule_discovery_repository.py` | Repository layer | `discovery_repository.py` |
| 4 | `app/api/models/rule_discovery_models.py` | Pydantic models | `discovery_models.py` |
| 5 | `src/hooks/useRuleDiscovery.ts` | Data fetching hook | `useDiscovery.ts` |
| 6 | `src/types/rule_discovery.ts` | TypeScript types | `discovery.ts` |

## 2. Test Files to CREATE (2 New Files)

| # | File | Purpose |
|---|------|---------|
| 1 | `tests/test_rule_discovery_routes.py` | API endpoint tests |
| 2 | `tests/test_rule_discovery_service.py` | Service layer tests |

## 3. Files to MODIFY (4 Existing Files)

| # | File | Change |
|---|------|--------|
| 1 | `app/api/routes/__init__.py` | Add `rule_discovery_routes` import |
| 2 | `app/api/main.py` | Register `rule_discovery_routes.router` |
| 3 | `src/routes/ValidationDiscoveryPage.tsx` | Rewrite with two-tree discovery layout |
| 4 | `src/components/Shell/Shell.tsx` | Add "Rule Discovery" nav link |

---

## 4. Implementation Order

1. Create types (`rule_discovery.ts`)
2. Create backend repository + service + routes
3. Register routes in `__init__.py` and `main.py`
4. Create `useRuleDiscovery.ts` hook
5. Rewrite `ValidationDiscoveryPage.tsx` with two-tree layout
6. Add navigation link in `Shell.tsx`
7. Create tests

---

## 5. Testing Strategy

- Unit tests for repository layer
- Unit tests for service layer
- Integration tests for API endpoints
- Authentication/authorization tests

---

## 6. Backward Compatibility

- All changes are additive (new files only)
- No modifications to existing API contracts
- No database migrations required
- Existing `ValidationDiscoveryPage` route unchanged

---

## 7. Estimated Effort

| Area | Effort |
|------|--------|
| Backend API | 2-3 hours |
| Frontend hook + types | 1-2 hours |
| Frontend page rewrite | 3-4 hours |
| Tests | 2-3 hours |
| **Total** | **8-12 hours** |

---

**End of Document**
