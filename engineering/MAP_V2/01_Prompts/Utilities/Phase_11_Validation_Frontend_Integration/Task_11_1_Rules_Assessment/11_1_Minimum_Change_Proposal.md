# Phase 11 Task 11.1 — Minimum Change Proposal

## Backend Assessment (Rules)

**Task:** 11.1  
**Status:** Awaiting Approval  
**Date:** 2026-08-06  

---

## Proposed Changes

### 1. Files to CREATE (6 new files)

| # | File | Purpose | Pattern to Follow |
|---|------|---------|-------------------|
| 1 | `app/api/models/rules_models.py` | Pydantic request/response models | `app/api/models/rule_execution_models.py` |
| 2 | `app/repositories/rules_repository.py` | Repository for `engine.rule_registry` queries | `app/repositories/rule_execution_repository.py` |
| 3 | `app/services/rules_service.py` | Service layer for rule management | `app/services/rule_execution_service.py` |
| 4 | `app/api/routes/rules_routes.py` | 3 API endpoints (list, detail, toggle) | `app/api/routes/rule_execution_routes.py` |
| 5 | `tests/test_rules_routes.py` | Tests for new API endpoints | `tests/test_rule_execution_routes.py` |
| 6 | `tests/test_rules_service.py` | Tests for new service | `tests/test_rule_execution_service.py` |

### 2. Files to MODIFY (2 files, 2 lines total)

| # | File | Line | Change |
|---|------|------|--------|
| 1 | `app/api/routes/__init__.py` | After line 27 | Add: `from . import rules_routes   # noqa: F401` |
| 2 | `app/api/main.py` | After line 175 | Add: `app.include_router(rules_routes.router)` |

### 3. API Endpoints to Implement

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | `GET /api/v1/rules` | GET | List all rules from `engine.rule_registry` |
| 2 | `GET /api/v1/rules/{rule_id}` | GET | Get rule detail |
| 3 | `POST /api/v1/rules/{rule_id}/toggle` | POST | Enable/disable rule (`enabled_flag`) |

### 4. NOT in Scope

- ❌ CRUD endpoints (create/update/delete) — rules are static
- ❌ CLI commands — outside Phase 11 scope
- ❌ YAML config unification — separate concern
- ❌ Rule discovery API — separate task (11.7)

---

## Approval Checklist

- [ ] Minimum-change scope approved (3 API endpoints)
- [ ] New files approved (6 files)
- [ ] Modified files approved (2 files, 2 lines)
- [ ] No CLI changes approved
- [ ] No CRUD endpoints approved

---

**Status:** Awaiting Approval

**Next Action:** Upon approval, proceed to Task 11.4 implementation.

---

**End of Document**
