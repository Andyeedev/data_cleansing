# Phase 11 Task 11.1 — Closure Report

## Backend Assessment (Rules)

**Task:** 11.1  
**Status:** Assessment Complete — Awaiting Approval  
**Date:** 2026-08-06  
**Assessment Type:** Rules API + CLI — Read Only, No Code Changes

---

## 1. Existing Rules APIs (Web/API)

### 1.1 Rule Execution Routes (READ-ONLY)

| # | Endpoint | File | Lines | Status |
|---|----------|------|-------|--------|
| 1 | `GET /api/v1/execution/{batch_id}/rules` | `app/api/routes/rule_execution_routes.py` | 16-25 | ✅ Fully implemented |
| 2 | `GET /api/v1/execution/{batch_id}/rules/{rule_id}` | `app/api/routes/rule_execution_routes.py` | 28-42 | ✅ Fully implemented |
| 3 | `GET /api/v1/execution/{batch_id}/control/{control_id}/rules` | `app/api/routes/rule_execution_routes.py` | 45-55 | ✅ Fully implemented |
| 4 | `GET /api/v1/execution/{batch_id}/results` | `app/api/routes/rule_execution_routes.py` | 58-67 | ✅ Fully implemented |

**What these do:** Query `engine.migration_control_execution` and `engine.migration_control_summary` for past execution results. They do NOT interact with `engine.rule_registry`.

### 1.2 Supporting Service Layer

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/services/rule_execution_service.py` | 1-81 | ✅ Fully implemented (read-only) |
| 2 | `app/repositories/rule_execution_repository.py` | 1-96 | ✅ Fully implemented (read-only) |
| 3 | `app/api/models/rule_execution_models.py` | 1-39 | ✅ Fully implemented (read-only) |

### 1.3 Existing Tests

| # | File | Lines | Tests |
|---|------|-------|-------|
| 1 | `tests/test_rule_execution_routes.py` | 1-142 | 5 tests |
| 2 | `tests/test_rule_execution_repository.py` | 1-97 | 6 tests |
| 3 | `tests/test_rule_execution_service.py` | 1-101 | 5 tests |

---

## 2. Partial Implementations

### 2.1 AutoRuleDiscovery (Internal Engine Step — No API)

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/discovery/auto_rule_discovery.py` | 1-186 | ⚠️ Fully implemented internally, NO API endpoint |

**What it does:** Auto-discovers and registers rules for dataset mappings. Called during `ExecutionEngine.run()` STEP 03/06. Reads `engine.rule_registry` to check `enabled_flag`. Writes to `core.rule_dataset_mapping`.

**Partial because:** The logic exists but is only callable as part of the full execution pipeline. No standalone API endpoint to trigger rule discovery independently.

### 2.2 Rule Enable/Disable (Config File Only — No API)

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `config.yaml` | 44-55 | ⚠️ Manual text editing only |
| 2 | `app/execution_engine.py` | 821-822 | ⚠️ Reads YAML config, not DB `enabled_flag` |

**What it does:** YAML-based toggle (`rules: C01: enabled/disabled`). Used by `execution_engine.py:_is_rule_enabled()`.

**Partial because:** Two separate toggle mechanisms exist (YAML config + DB `enabled_flag`), but neither is exposed via API.

### 2.3 DatasetDiscoveryService._bind_default_rules()

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/services/dataset_discovery_service.py` | 333-351 | ⚠️ Internal only, no API |

**What it does:** Fetches all enabled rules from `rule_registry` and binds them to a dataset mapping. Called during dataset discovery.

---

## 3. Missing APIs

| # | Missing Endpoint | Purpose | Priority |
|---|-----------------|---------|----------|
| 1 | `GET /api/v1/rules` | List all rules from `engine.rule_registry` | High |
| 2 | `GET /api/v1/rules/{rule_id}` | Get rule detail from `engine.rule_registry` | High |
| 3 | `POST /api/v1/rules/{rule_id}/toggle` | Enable/disable rule (`enabled_flag`) | High |
| 4 | `POST /api/v1/rules` | Create new rule | Low |
| 5 | `PUT /api/v1/rules/{rule_id}` | Update rule | Low |
| 6 | `DELETE /api/v1/rules/{rule_id}` | Delete rule | Low |
| 7 | `GET /api/v1/rules/discovery/{project_id}` | Get auto-discovered rules | Medium |
| 8 | `POST /api/v1/rules/discovery/{project_id}/trigger` | Trigger rule discovery standalone | Medium |
| 9 | `GET /api/v1/rules/{rule_id}/preview` | Preview rule SQL template | Low |

**Note:** Endpoints 4-6 (CRUD) are low priority because rules are currently managed via SQL seed scripts and the `rule_registry` is relatively static. The frontend Rules page can be built as a read-only view with toggle capability using only endpoints 1-3.

---

## 4. CLI Assessment

### 4.1 Existing CLI Commands

| # | Command | File | Lines | Rule Management? |
|---|---------|------|-------|-----------------|
| 1 | `python -m app run --config config.yaml` | `app/__main__.py` | 15-18 | ❌ No (runs full pipeline) |
| 2 | `python -m app discover --config config.yaml` | `app/__main__.py` | 20-21 | ❌ No (dataset discovery only) |
| 3 | `python -m app export --config config.yaml --batch-id <id>` | `app/__main__.py` | 23-25 | ❌ No (audit export only) |

### 4.2 CLI Rule Management Gaps

| # | Missing CLI Command | Purpose | Priority |
|---|--------------------|---------|----------|
| 1 | `python -m app rules list` | List all rules from `rule_registry` | Low |
| 2 | `python -m app rules show <rule_id>` | Show rule detail | Low |
| 3 | `python -m app rules toggle <rule_id>` | Enable/disable rule | Low |
| 4 | `python -m app rules discover <project_id>` | Trigger rule discovery | Low |

**Assessment:** The CLI has no rule management commands. However, CLI rule management is low priority because:
- Rules are relatively static (managed via SQL seed scripts)
- The primary user interface for rule management will be the web frontend
- Adding CLI commands would be a separate enhancement outside Phase 11 scope

### 4.3 CLI-to-Web Reuse Opportunities

| CLI Component | Can Reuse for Web? | Notes |
|---------------|-------------------|-------|
| `AutoRuleDiscovery` class | ✅ Yes | Expose via API endpoint |
| `RuleFactory.RULE_REGISTRY` dict | ✅ Yes | Reference for rule metadata |
| `config.yaml` rules section | ⚠️ Partial | Consider unifying with DB `enabled_flag` |
| `rule_executor.py:_get_rules()` | ✅ Yes | SQL query pattern reusable |

---

## 5. Database Tables

### 5.1 `engine.rule_registry` (Target Table)

| # | Column | Type | Notes |
|---|--------|------|-------|
| 1 | `rule_id` | VARCHAR(50) PK | e.g., `C01_ROWCOUNT` |
| 2 | `control_id` | VARCHAR(10) FK | References `control_registry` |
| 3 | `rule_name` | TEXT NOT NULL | Display name |
| 4 | `sql_template_file` | TEXT NOT NULL | Path to SQL template |
| 5 | `severity_level` | VARCHAR(20) | CRITICAL, HIGH, MEDIUM, LOW |
| 6 | `enabled_flag` | BOOLEAN DEFAULT TRUE | Enable/disable toggle |
| 7 | `created_at` | TIMESTAMP DEFAULT NOW() | Creation timestamp |

**Extended columns (from `engine_backup.sql`):**
- `rule_type VARCHAR(50)`
- `rule_scope VARCHAR(20) DEFAULT 'TABLE'`

### 5.2 Seed Data (11 rules)

| # | rule_id | control_id | rule_name | enabled_flag |
|---|---------|------------|-----------|--------------|
| 1 | C01_ROWCOUNT | C01 | Row Count Validation | TRUE |
| 2 | C02_BALANCE_RECON | C02 | Balance Reconciliation | TRUE |
| 3 | C03_REFERENTIAL | C03 | Referential Integrity | TRUE |
| 4 | C04_COLUMN_COUNT | C04 | Column Count Validation | TRUE |
| 5 | C05_NULL_CHECK | C05 | Null Comparison | TRUE |
| 6 | C06_DATA_TYPE_MATCH | C06 | Data Type Matching | TRUE |
| 7 | C07_DUPLICATE_DETECTION | C07 | Duplicate Detection | TRUE |
| 8 | C08_DATA_DRIFT | C08 | Data Drift Detection | FALSE |
| 9 | C09_REFERENTIAL_COVERAGE | C09 | Referential Coverage | TRUE |
| 10 | C010_SCHEMA_DRIFT | C010 | Schema Drift Detection | TRUE |

---

## 6. Exact Files Requiring Modification

### 6.1 Files to MODIFY (Extend Existing)

| # | File | Current State | Modification Required |
|---|------|---------------|----------------------|
| 1 | `app/api/routes/__init__.py` | Imports existing route modules | Add import for new `rules_routes` |
| 2 | `app/api/main.py` | Registers existing routers | Add `app.include_router(rules_routes.router)` |

### 6.2 Files to CREATE (New)

| # | File | Purpose | Pattern to Follow |
|---|------|---------|-------------------|
| 1 | `app/api/routes/rules_routes.py` | New API endpoints for rule management | `app/api/routes/rule_execution_routes.py` |
| 2 | `app/services/rules_service.py` | Service layer for rule registry CRUD | `app/services/rule_execution_service.py` |
| 3 | `app/repositories/rules_repository.py` | Repository for `engine.rule_registry` queries | `app/repositories/rule_execution_repository.py` |
| 4 | `app/api/models/rules_models.py` | Pydantic models for rule request/response | `app/api/models/rule_execution_models.py` |
| 5 | `tests/test_rules_routes.py` | Tests for new API endpoints | `tests/test_rule_execution_routes.py` |
| 6 | `tests/test_rules_service.py` | Tests for new service | `tests/test_rule_execution_service.py` |
| 7 | `tests/test_rules_repository.py` | Tests for new repository | `tests/test_rule_execution_repository.py` |

### 6.3 Files NOT Requiring Modification

| # | File | Reason |
|---|------|--------|
| 1 | `app/rule_factory.py` | In-memory registry, not exposed via API |
| 2 | `app/rule_executor.py` | Execution logic, not management |
| 3 | `app/execution_engine.py` | Pipeline logic, not management |
| 4 | `app/discovery/auto_rule_discovery.py` | Internal engine step, can be wrapped |
| 5 | `config.yaml` | Consider unifying with DB later, not in Phase 11 |

---

## 7. Minimum-Change Proposal

### 7.1 Phase 11.4 Scope (Rules Integration)

**Required for frontend Rules page:**

| # | Component | Change Type | Effort |
|---|-----------|-------------|--------|
| 1 | `app/api/routes/rules_routes.py` | Create | Low |
| 2 | `app/services/rules_service.py` | Create | Low |
| 3 | `app/repositories/rules_repository.py` | Create | Low |
| 4 | `app/api/models/rules_models.py` | Create | Low |
| 5 | `app/api/routes/__init__.py` | Modify (1 line) | Minimal |
| 6 | `app/api/main.py` | Modify (1 line) | Minimal |
| 7 | `tests/test_rules_routes.py` | Create | Low |
| 8 | `tests/test_rules_service.py` | Create | Low |
| 9 | `tests/test_rules_repository.py` | Create | Low |

**Total:** 6 new files, 2 modified files (2 lines total)

### 7.2 API Endpoints to Implement

| # | Endpoint | Method | Purpose | Priority |
|---|----------|--------|---------|----------|
| 1 | `GET /api/v1/rules` | GET | List all rules from `rule_registry` | High |
| 2 | `GET /api/v1/rules/{rule_id}` | GET | Get rule detail | High |
| 3 | `POST /api/v1/rules/{rule_id}/toggle` | POST | Enable/disable rule | High |

**Minimum viable scope:** 3 endpoints (list, detail, toggle). This is sufficient for the frontend Rules page.

**Not in Phase 11 scope:** Create (POST /rules), Update (PUT /rules/{id}), Delete (DELETE /rules/{id}). Rules are static and managed via SQL seed scripts.

---

## 8. Reuse Opportunities

| # | Existing Component | Reuse Pattern | Notes |
|---|-------------------|---------------|-------|
| 1 | `rule_execution_routes.py` | Router structure, auth, error handling | Copy pattern for `rules_routes.py` |
| 2 | `rule_execution_service.py` | Service class structure | Copy pattern for `rules_service.py` |
| 3 | `rule_execution_repository.py` | Repository class structure | Copy pattern for `rules_repository.py` |
| 4 | `rule_execution_models.py` | Pydantic model structure | Reference for `rules_models.py` |
| 5 | `AutoRuleDiscovery` class | Can be wrapped in API endpoint | For future rule discovery API |
| 6 | `RuleFactory.RULE_REGISTRY` | Reference for rule metadata | Static data source |
| 7 | `engine.rule_registry` schema | Target table for CRUD | Already defined |
| 8 | Existing tests | Test patterns and fixtures | Copy for new tests |

---

## 9. Recommendation

### 9.1 Proceed to Task 11.4

The assessment confirms:
- **Existing APIs:** 4 read-only execution query endpoints (fully implemented)
- **Partial implementations:** AutoRuleDiscovery (no API), config-based toggle (no API)
- **Missing APIs:** 3 endpoints needed for Rules page (list, detail, toggle)
- **CLI:** No rule management commands (low priority, not in Phase 11 scope)
- **Reuse:** Strong patterns available from existing execution routes/services/repos

**Recommendation:** Proceed to Task 11.4 (Rules Integration) with minimum-change scope of 3 API endpoints.

### 9.2 Implementation Approach

1. Create `rules_repository.py` — Query `engine.rule_registry` (list, detail, toggle)
2. Create `rules_service.py` — Business logic layer
3. Create `rules_routes.py` — 3 API endpoints
4. Create `rules_models.py` — Pydantic request/response models
5. Modify `__init__.py` and `main.py` — Register new router
6. Create tests — Follow existing test patterns

### 9.3 What NOT to Do

- ❌ Do NOT create CRUD endpoints (create/update/delete) — rules are static
- ❌ Do NOT unify YAML config with DB `enabled_flag` — separate concern
- ❌ Do NOT add CLI commands — outside Phase 11 scope
- ❌ Do NOT duplicate existing execution query logic — those endpoints remain separate

---

## 10. Approval Required

Before proceeding to Task 11.4, approval is required for:

- [ ] Minimum-change scope (3 API endpoints)
- [ ] New files to create (6 files)
- [ ] Modified files (2 files, 2 lines total)
- [ ] No CLI changes in this phase
- [ ] No CRUD endpoints (read-only + toggle only)

---

**End of Report**
