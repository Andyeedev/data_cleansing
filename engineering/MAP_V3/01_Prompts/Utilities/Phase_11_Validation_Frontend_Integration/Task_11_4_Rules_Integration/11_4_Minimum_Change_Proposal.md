# Phase 11 Task 11.4 — Minimum Change Proposal

## Rules Integration (Backend + Frontend)

**Task:** 11.4  
**Status:** Proposal Ready  
**Date:** 2026-08-06  
**Authorized By:** Pending  

---

## 1. Summary

**Core Logic:** Extend existing Rules functionality with CRUD API endpoints and frontend components.

**Implementation Pattern:** Follows existing Migration → Mappings patterns.

---

## 2. Files to CREATE (8 New Files)

### 2.1 Backend (API Layer)

| # | File | Purpose | Pattern |
|---|------|---------|---------|
| 1 | `app/api/models/rule_registry_models.py` | Pydantic models | `app/api/models/discovery_models.py` |
| 2 | `app/repositories/rule_registry_repository.py` | Repository layer | `app/repositories/discovery_repository.py` |
| 3 | `app/services/rule_registry_service.py` | Service layer | `app/services/discovery_service_api.py` |
| 4 | `app/api/routes/rule_registry_routes.py` | API endpoints | `app/api/routes/discovery_routes.py` |

### 2.2 Frontend (React Layer)

| # | File | Purpose | Pattern |
|---|------|---------|---------|
| 1 | `src/hooks/useRules.ts` | API hooks | `src/hooks/useValidation.ts` |
| 2 | `src/types/rules.ts` | TypeScript types | `src/types/validation.ts` |
| 3 | `src/routes/ValidationRulesPage.tsx` | Rules page | `src/routes/ValidationDashboardPage.tsx` |

### 2.3 Tests

| # | File | Purpose | Pattern |
|---|------|---------|---------|
| 1 | `tests/test_rule_registry_routes.py` | API tests | `tests/test_discovery_routes.py` |

## 3. Files to MODIFY (2 Existing Files)

| # | File | Lines | Change |
|---|------|-------|--------|
| 1 | `app/api/routes/__init__.py` | Current | Add import for `rule_registry_routes` |
| 2 | `app/api/main.py` | Current | Add `app.include_router(rule_registry_routes.router)` |

## 4. New API Endpoints

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | GET | `/api/v1/rules` | List all rules |
| 2 | GET | `/api/v1/rules/{rule_id}` | Get rule by ID |
| 3 | GET | `/api/v1/rules/control/{control_id}` | Get rules by control |
| 4 | POST | `/api/v1/rules` | Create rule |
| 5 | PUT | `/api/v1/rules/{rule_id}` | Update rule |
| 6 | DELETE | `/api/v1/rules/{rule_id}` | Delete rule |

## 5. Database Tables

| # | Table | Operation | Purpose |
|---|-------|-----------|---------|
| 1 | `engine.rule_registry` | READ | Get rules |
| 2 | `engine.rule_registry` | INSERT | Create rule |
| 3 | `engine.rule_registry` | UPDATE | Update rule |
| 4 | `engine.rule_registry` | DELETE | Delete rule |

## 6. Implementation Order

1. Create Pydantic models (`rule_registry_models.py`)
2. Create repository layer (`rule_registry_repository.py`)
3. Create service layer (`rule_registry_service.py`)
4. Create API routes (`rule_registry_routes.py`)
5. Register routes in `__init__.py` and `main.py`
6. Create frontend types (`rules.ts`)
7. Create frontend hooks (`useRules.ts`)
8. Create Rules page (`ValidationRulesPage.tsx`)
9. Register frontend routes (`AppRoutes.tsx`)
10. Create tests

## 7. Testing Strategy

- Unit tests for repository layer
- Unit tests for service layer
- Integration tests for API endpoints
- Tests for error handling
- Tests for authentication/authorization

## 8. Backward Compatibility

- All changes are additive (new files)
- No modifications to existing API contracts
- No database migrations required (existing tables sufficient)

## 9. Estimated Effort

- **Repository:** 1-2 hours
- **Service:** 1-2 hours
- **API Endpoints:** 1-2 hours
- **Models:** 30 minutes
- **Frontend Types/Hooks:** 1-2 hours
- **Frontend Page:** 2-3 hours
- **Tests:** 2-3 hours
- **Total:** 8-14 hours

---

**End of Document**
