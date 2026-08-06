# Phase 11 Task 11.2 — Minimum Change Proposal

## Backend Assessment (Controls)

**Task:** 11.2  
**Status:** Awaiting Approval  
**Date:** 2026-08-06  

---

## Proposed Changes

### 1. Files to CREATE (6 new files)

| # | File | Purpose | Pattern to Follow |
|---|------|---------|-------------------|
| 1 | `app/api/models/controls_models.py` | Pydantic request/response models | `app/api/models/execution_control_models.py` |
| 2 | `app/repositories/controls_repository.py` | Repository for `engine.control_registry` queries | `app/repositories/execution_control_repository.py` |
| 3 | `app/services/controls_service.py` | Service layer for control management | `app/services/execution_control_service.py` |
| 4 | `app/api/routes/controls_routes.py` | 3 API endpoints (list, detail, toggle) | `app/api/routes/execution_control_routes.py` |
| 5 | `tests/test_controls_routes.py` | Tests for new API endpoints | `tests/test_execution_control_routes.py` |
| 6 | `tests/test_controls_service.py` | Tests for new service | `tests/test_execution_control_service.py` |

### 2. Files to MODIFY (2 files, 2 lines total)

| # | File | Line | Change |
|---|------|------|--------|
| 1 | `app/api/routes/__init__.py` | After line 18 (or wherever `execution_control_routes` is imported) | Add: `from . import controls_routes   # noqa: F401` |
| 2 | `app/api/main.py` | After line 179 (or wherever `execution_control_routes.router` is registered) | Add: `app.include_router(controls_routes.router)` |

### 3. API Endpoints to Implement

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | `GET /api/v1/controls` | GET | List all controls from `engine.control_registry` |
| 2 | `GET /api/v1/controls/{control_id}` | GET | Get control detail |
| 3 | `POST /api/v1/controls/{control_id}/toggle` | POST | Enable/disable control (`enabled_flag`) |

### 4. NOT in Scope

- ❌ CRUD endpoints (create/update/delete) — controls are static
- ❌ CLI commands — outside Phase 11 scope
- ❌ Control execution logic — separate concern
- ❌ In-memory CONTROL_REGISTRY management — separate concern

---

## Approval Checklist

- [ ] Minimum-change scope approved (3 API endpoints)
- [ ] New files approved (6 files)
- [ ] Modified files approved (2 files, 2 lines)
- [ ] No CLI changes approved
- [ ] No CRUD endpoints approved

---

**Status:** Awaiting Approval

**Next Action:** Upon approval of Task 11.2 minimum-change proposal, continue to Task 11.3 (Rule Discovery Assessment).

Task 11.6 implementation remains blocked until:
- Task 11.1 approval is complete
- Task 11.3 assessment is complete
- All required implementation approvals are granted

---

**End of Document**
