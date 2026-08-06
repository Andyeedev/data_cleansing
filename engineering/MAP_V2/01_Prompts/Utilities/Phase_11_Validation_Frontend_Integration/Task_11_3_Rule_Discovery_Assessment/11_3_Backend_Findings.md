# Phase 11 Task 11.3 — Backend Findings

## Backend Assessment (Rule Discovery)

**Task:** 11.3  
**Status:** Assessment Complete  
**Date:** 2026-08-06  

---

## 1. Existing Rule Discovery APIs (Web/API)

### 1.1 Discovery Routes (Dataset Discovery — NOT Rule Discovery)

| # | Endpoint | File | Lines | Status |
|---|----------|------|-------|--------|
| 1 | `GET /api/v1/discovery/summary` | `app/api/routes/discovery_routes.py` | 23-36 | ✅ Fully implemented |
| 2 | `GET /api/v1/discovery/tree` | `app/api/routes/discovery_routes.py` | 42-55 | ✅ Fully implemented |
| 3 | `GET /api/v1/discovery/tables` | `app/api/routes/discovery_routes.py` | 61-74 | ✅ Fully implemented |
| 4 | `GET /api/v1/discovery/{batch_id}/datasets` | `app/api/routes/discovery_routes.py` | 77-86 | ✅ Fully implemented |
| 5 | `GET /api/v1/discovery/{batch_id}/datasets/{dataset_id}` | `app/api/routes/discovery_routes.py` | 89-103 | ✅ Fully implemented |
| 6 | `POST /api/v1/discovery/current` | `app/api/routes/discovery_routes.py` | 106-115 | ✅ Fully implemented |
| 7 | `GET /api/v1/discovery/{batch_id}/status` | `app/api/routes/discovery_routes.py` | 118-131 | ✅ Fully implemented |

**What these do:** Dataset discovery (schema introspection, table matching, mapping creation). They do NOT trigger rule discovery directly.

### 1.2 Supporting Service Layer

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/services/discovery_service_api.py` | 1-63 | ✅ Fully implemented (API-level) |
| 2 | `app/services/discovery/discovery_service.py` | 1-199 | ✅ Fully implemented (async) |
| 3 | `app/services/dataset_discovery_service.py` | 1-351 | ✅ Fully implemented |
| 4 | `app/repositories/discovery_repository.py` | 1-117 | ✅ Fully implemented (app-level) |
| 5 | `app/db/repositories/discovery_repository.py` | 1-451 | ✅ Fully implemented (DB-level) |

### 1.3 Existing Tests

| # | File | Status |
|---|------|--------|
| 1 | `tests/test_discovery_routes.py` | ✅ Exists |
| 2 | `tests/test_discovery_service.py` | ✅ Exists |
| 3 | `tests/test_discovery_repository.py` | ✅ Exists |

---

## 2. Partial Implementations

### 2.1 AutoRuleDiscovery (Internal Engine Step — No API)

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/discovery/auto_rule_discovery.py` | 1-186 | ⚠️ Fully implemented internally, NO API endpoint |

**What it does:** Auto-discovers and registers rules for dataset mappings. Called during `ExecutionEngine.run()` STEP 03/06. Reads `engine.rule_registry` to check `enabled_flag`. Writes to `core.rule_dataset_mapping`.

**Partial because:** The logic exists but is only callable as part of the full execution pipeline. No standalone API endpoint to trigger rule discovery independently.

### 2.2 DatasetDiscoveryService._bind_default_rules()

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/services/dataset_discovery_service.py` | 333-351 | ⚠️ Internal only, no API |

**What it does:** Fetches all enabled rules from `rule_registry` and binds them to a dataset mapping. Called during dataset discovery.

### 2.3 MappingService._get_source_columns() / _get_target_columns()

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/services/mapping/mapping_service.py` | 122-132 | ⚠️ Stubs returning empty lists |

**What they do:** Supposed to fetch source/target columns for auto-mapping. Currently return `[]`.

---

## 3. Missing APIs

| # | Missing Endpoint | Purpose | Priority |
|---|-----------------|---------|----------|
| 1 | `GET /api/v1/rules/discovery/{project_id}` | Get auto-discovered rules for a project | High |
| 2 | `POST /api/v1/rules/discovery/{project_id}/trigger` | Trigger rule discovery standalone | Medium |
| 3 | `GET /api/v1/rules/discovery/{project_id}/status` | Check rule discovery status | Medium |
| 4 | `GET /api/v1/rules/discovery/{project_id}/mappings` | View rule-to-dataset mappings | Medium |

**Note:** The primary use case for the frontend Rule Discovery page is to VIEW which rules were auto-discovered and their mappings. Triggering discovery can remain part of the execution pipeline.

---

## 4. CLI Assessment

### 4.1 Existing CLI Commands

| # | Command | File | Lines | Rule Discovery? |
|---|---------|------|-------|-----------------|
| 1 | `python -m app run --config config.yaml` | `app/__main__.py` | 15-18 | ⚠️ Indirect (STEP 03/06) |
| 2 | `python -m app discover --config config.yaml` | `app/__main__.py` | 20-21 | ❌ No (dataset discovery only) |
| 3 | `python -m app export --config config.yaml --batch-id <id>` | `app/__main__.py` | 23-25 | ❌ No (audit export only) |

### 4.2 CLI Rule Discovery Gaps

| # | Missing CLI Command | Purpose | Priority |
|---|--------------------|---------|----------|
| 1 | `python -m app rules discover <project_id>` | Trigger rule discovery standalone | Low |

**Assessment:** The CLI has no standalone rule discovery command. Rule discovery happens automatically during `python -m app run`. This is acceptable because:
- Rule discovery is tightly coupled to dataset mappings
- Triggering it standalone requires dataset mappings to exist first
- The primary user interface will be the web frontend

---

## 5. Database Tables

### 5.1 `core.rule_dataset_mapping` (Target Table)

| # | Column | Type | Notes |
|---|--------|------|-------|
| 1 | `mapping_id` | UUID PK | Links to `core.dataset_mappings` |
| 2 | `rule_id` | VARCHAR(50) FK | References `engine.rule_registry` |
| 3 | `enabled_flag` | BOOLEAN DEFAULT TRUE | Enable/disable |
| 4 | `created_at` | TIMESTAMP DEFAULT NOW() | Creation timestamp |

### 5.2 Related Tables

| # | Table | Purpose |
|---|-------|---------|
| 1 | `engine.rule_registry` | Rule definitions (C01-C010) |
| 2 | `core.dataset_mappings` | Dataset mappings (source -> target) |
| 3 | `core.dataset_columns` | Column metadata with inferred roles |

---

## 6. Exact Files Requiring Modification

### 6.1 Files to MODIFY (Extend Existing)

| # | File | Current State | Modification Required |
|---|------|---------------|----------------------|
| 1 | `app/api/routes/__init__.py` | Imports existing route modules | Add import for new `rule_discovery_routes` |
| 2 | `app/api/main.py` | Registers existing routers | Add `app.include_router(rule_discovery_routes.router)` |

### 6.2 Files to CREATE (New)

| # | File | Purpose | Pattern to Follow |
|---|------|---------|-------------------|
| 1 | `app/api/routes/rule_discovery_routes.py` | New API endpoints for rule discovery | `app/api/routes/discovery_routes.py` |
| 2 | `app/services/rule_discovery_service.py` | Service layer for rule discovery | `app/services/discovery_service_api.py` |
| 3 | `app/repositories/rule_discovery_repository.py` | Repository for rule discovery queries | `app/repositories/discovery_repository.py` |
| 4 | `app/api/models/rule_discovery_models.py` | Pydantic models | `app/api/models/discovery_models.py` |
| 5 | `tests/test_rule_discovery_routes.py` | Tests for new API endpoints | `tests/test_discovery_routes.py` |
| 6 | `tests/test_rule_discovery_service.py` | Tests for new service | `tests/test_discovery_service.py` |

### 6.3 Files NOT Requiring Modification

| # | File | Reason |
|---|------|--------|
| 1 | `app/discovery/auto_rule_discovery.py` | Internal engine step, can be wrapped |
| 2 | `app/execution_engine.py` | Pipeline logic, not management |
| 3 | `app/services/dataset_discovery_service.py` | Dataset discovery, separate concern |

---

## 7. Reuse Opportunities

| # | Existing Component | Reuse Pattern | Notes |
|---|-------------------|---------------|-------|
| 1 | `discovery_routes.py` | Router structure, auth, error handling | Reference for `rule_discovery_routes.py` |
| 2 | `discovery_service_api.py` | Service class structure | Reference for `rule_discovery_service.py` |
| 3 | `discovery_repository.py` | Repository class structure | Reference for `rule_discovery_repository.py` |
| 4 | `discovery_models.py` | Pydantic model structure | Reference for `rule_discovery_models.py` |
| 5 | `AutoRuleDiscovery` class | Can be wrapped in API endpoint | For trigger endpoint |
| 6 | `core.rule_dataset_mapping` schema | Target table for queries | Already defined |
| 7 | Existing discovery tests | Test patterns and fixtures | Reference for new tests |

---

## 8. Relationship to Tasks 11.1 and 11.2

The Rule Discovery assessment is independent of Rules and Controls but has a dependency:

```
Discovery → Rules → Controls
```

The Rule Discovery page may need to reference Rules (which rules were discovered) and Dataset Mappings (which datasets the rules apply to).

**Recommendation:** Complete all three assessments (11.1, 11.2, 11.3) before starting any implementation.

---

**End of Document**
