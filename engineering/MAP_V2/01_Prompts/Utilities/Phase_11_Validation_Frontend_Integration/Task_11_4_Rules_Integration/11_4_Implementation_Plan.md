# Phase 11 Task 11.4 — Implementation Plan

## Rules Integration (Backend + Frontend)

**Task:** 11.4  
**Status:** Awaiting Approval  
**Date:** 2026-08-06  
**Authorized By:** Pending  

---

## 1. Scope

Implement Rules CRUD API endpoints and frontend components following the existing Migration → Mappings patterns.

**Authorized Changes:**
- Extend existing Rules functionality only where required
- Reuse Migration → Mappings patterns
- Implement only APIs/components identified as missing in Task 11.1
- No duplicate routes, services, hooks, components, or database objects

---

## 2. Implementation Checklist

### 2.1 Backend (API Layer)

| # | File | Status | Purpose |
|---|------|--------|---------|
| 1 | `app/api/models/rule_registry_models.py` | ⏳ Pending | Pydantic models |
| 2 | `app/repositories/rule_registry_repository.py` | ⏳ Pending | Repository layer |
| 3 | `app/services/rule_registry_service.py` | ⏳ Pending | Service layer |
| 4 | `app/api/routes/rule_registry_routes.py` | ⏳ Pending | API endpoints |
| 5 | `app/api/routes/__init__.py` | ⏳ Pending | Route registration |
| 6 | `app/api/main.py` | ⏳ Pending | Router inclusion |

### 2.2 Frontend (React Layer)

| # | File | Status | Purpose |
|---|------|--------|---------|
| 1 | `src/hooks/useRules.ts` | ⏳ Pending | API hooks |
| 2 | `src/types/rules.ts` | ⏳ Pending | TypeScript types |
| 3 | `src/routes/ValidationRulesPage.tsx` | ⏳ Pending | Rules page |
| 4 | `src/AppRoutes.tsx` | ⏳ Pending | Route registration |

### 2.3 Tests

| # | File | Status | Purpose |
|---|------|--------|---------|
| 1 | `tests/test_rule_registry_routes.py` | ⏳ Pending | API tests |
| 2 | `tests/test_rule_registry_service.py` | ⏳ Pending | Service tests |

---

## 3. API Endpoints

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | GET | `/api/v1/rules` | List all rules |
| 2 | GET | `/api/v1/rules/{rule_id}` | Get rule by ID |
| 3 | GET | `/api/v1/rules/control/{control_id}` | Get rules by control |
| 4 | POST | `/api/v1/rules` | Create rule |
| 5 | PUT | `/api/v1/rules/{rule_id}` | Update rule |
| 6 | DELETE | `/api/v1/rules/{rule_id}` | Delete rule |

---

## 4. Database Tables

| # | Table | Operation | Purpose |
|---|-------|-----------|---------|
| 1 | `engine.rule_registry` | READ | Get rules |
| 2 | `engine.rule_registry` | INSERT | Create rule |
| 3 | `engine.rule_registry` | UPDATE | Update rule |
| 4 | `engine.rule_registry` | DELETE | Delete rule |

---

## 5. Implementation Order

1. ⏳ Create Pydantic models (`rule_registry_models.py`)
2. ⏳ Create repository layer (`rule_registry_repository.py`)
3. ⏳ Create service layer (`rule_registry_service.py`)
4. ⏳ Create API routes (`rule_registry_routes.py`)
5. ⏳ Register routes in `__init__.py` and `main.py`
6. ⏳ Create frontend types (`rules.ts`)
7. ⏳ Create frontend hooks (`useRules.ts`)
8. ⏳ Create Rules page (`ValidationRulesPage.tsx`)
9. ⏳ Register frontend routes (`AppRoutes.tsx`)
10. ⏳ Create tests

---

## 6. Testing Strategy

- Unit tests for repository layer
- Unit tests for service layer
- Integration tests for API endpoints
- Tests for error handling
- Tests for authentication/authorization

---

## 7. Backward Compatibility

- All changes are additive (new files)
- No modifications to existing API contracts
- No database migrations required (existing tables sufficient)

---

**End of Document**
