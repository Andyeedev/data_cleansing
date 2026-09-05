# Phase 11 Task 11.3 — Minimum Change Proposal

## Backend Assessment (Rule Discovery)

**Task:** 11.3  
**Status:** Proposal Ready  
**Date:** 2026-08-06  

---

## Summary

**Core Logic:** Existing `AutoRuleDiscovery` class is fully functional. New API endpoints needed for frontend access.

**Implementation Pattern:** Follows existing Discovery routes pattern (7 endpoints, service layer, repository layer).

---

## 1. Files to CREATE (6 New Files)

| # | File | Purpose | Pattern |
|---|------|---------|---------|
| 1 | `app/api/routes/rule_discovery_routes.py` | New API endpoints | `app/api/routes/discovery_routes.py` |
| 2 | `app/services/rule_discovery_service.py` | Service layer | `app/services/discovery_service_api.py` |
| 3 | `app/repositories/rule_discovery_repository.py` | Repository layer | `app/repositories/discovery_repository.py` |
| 4 | `app/api/models/rule_discovery_models.py` | Pydantic models | `app/api/models/discovery_models.py` |
| 5 | `tests/test_rule_discovery_routes.py` | Tests | `tests/test_discovery_routes.py` |
| 6 | `tests/test_rule_discovery_service.py` | Tests | `tests/test_discovery_service.py` |

## 2. Files to MODIFY (2 Existing Files)

| # | File | Lines | Change |
|---|------|-------|--------|
| 1 | `app/api/routes/__init__.py` | Current | Add import for `rule_discovery_routes` |
| 2 | `app/api/main.py` | Current | Add `app.include_router(rule_discovery_routes.router)` |

## 3. Files NOT Requiring Modification

| # | File | Reason |
|---|------|--------|
| 1 | `app/discovery/auto_rule_discovery.py` | Internal engine step, can be wrapped |
| 2 | `app/execution_engine.py` | Pipeline logic, not management |
| 3 | `app/services/dataset_discovery_service.py` | Dataset discovery, separate concern |
| 4 | `engine.rule_registry` | Schema already correct |
| 5 | `engine.control_registry` | Schema already correct |
| 6 | `core.rule_dataset_mapping` | Schema already correct |

## 4. New API Endpoints

### 4.1 Get Auto-Discovered Rules for Project

```python
GET /api/v1/rules/discovery/{project_id}
```

**Response:**
```json
{
  "project_id": "PRJ-001",
  "rules": [
    {
      "mapping_id": "uuid-1",
      "rule_id": "R01",
      "rule_name": "Unique ID",
      "enabled_flag": true,
      "dataset_name": "employee_mapping"
    }
  ],
  "count": 1
}
```

### 4.2 Trigger Rule Discovery Standalone

```python
POST /api/v1/rules/discovery/{project_id}/trigger
```

**Response:**
```json
{
  "status": "started",
  "message": "Rule discovery triggered for project PRJ-001"
}
```

### 4.3 Check Rule Discovery Status

```python
GET /api/v1/rules/discovery/{project_id}/status
```

**Response:**
```json
{
  "project_id": "PRJ-001",
  "total_mappings": 10,
  "rules_discovered": 8,
  "last_discovery_at": "2026-08-06T12:00:00Z"
}
```

### 4.4 View Rule-to-Dataset Mappings

```python
GET /api/v1/rules/discovery/{project_id}/mappings
```

**Response:**
```json
{
  "project_id": "PRJ-001",
  "mappings": [
    {
      "mapping_id": "uuid-1",
      "dataset_name": "employee_mapping",
      "rule_id": "R01",
      "rule_name": "Unique ID",
      "sql_template": "unique_id_check.sql"
    }
  ]
}
```

## 5. Implementation Order

1. Create Pydantic models (`rule_discovery_models.py`)
2. Create repository layer (`rule_discovery_repository.py`)
3. Create service layer (`rule_discovery_service.py`)
4. Create API endpoints (`rule_discovery_routes.py`)
5. Register routes in `__init__.py` and `main.py`
6. Create tests

## 6. Testing Strategy

- Unit tests for repository layer
- Unit tests for service layer
- Integration tests for API endpoints
- Tests for error handling
- Tests for authentication/authorization

## 7. Backward Compatibility

- All changes are additive (new files)
- No modifications to existing API contracts
- No database migrations required (existing tables sufficient)

## 8. Estimated Effort

- **Repository:** 1-2 hours
- **Service:** 1-2 hours
- **API Endpoints:** 1-2 hours
- **Models:** 30 minutes
- **Tests:** 2-3 hours
- **Total:** 5-9 hours

---

**End of Document**
