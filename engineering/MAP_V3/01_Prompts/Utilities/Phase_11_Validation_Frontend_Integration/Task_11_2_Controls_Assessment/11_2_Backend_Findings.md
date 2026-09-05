# Phase 11 Task 11.2 — Backend Findings

## Backend Assessment (Controls)

**Task:** 11.2  
**Status:** Assessment Complete  
**Date:** 2026-08-06  

---

## 1. Existing Controls APIs (Web/API)

### 1.1 Execution Control Routes (Batch Lifecycle — NOT Registry Management)

| # | Endpoint | File | Lines | Status |
|---|----------|------|-------|--------|
| 1 | `POST /api/v1/execution/{batch_id}/cancel` | `app/api/routes/execution_control_routes.py` | 15-31 | ✅ Fully implemented |
| 2 | `POST /api/v1/execution/{batch_id}/pause` | `app/api/routes/execution_control_routes.py` | 33-49 | ✅ Fully implemented |
| 3 | `POST /api/v1/execution/{batch_id}/resume` | `app/api/routes/execution_control_routes.py` | 51-67 | ✅ Fully implemented |
| 4 | `POST /api/v1/execution/{batch_id}/retry` | `app/api/routes/execution_control_routes.py` | 69-85 | ✅ Fully implemented |
| 5 | `GET /api/v1/execution/{batch_id}/lifecycle` | `app/api/routes/execution_control_routes.py` | 87-97 | ✅ Fully implemented |
| 6 | `GET /api/v1/execution/{batch_id}/progress` | `app/api/routes/execution_control_routes.py` | 99-115 | ✅ Fully implemented |

**What these do:** Query `engine.migration_batch_registry` and `engine.batch_execution_checkpoint` for batch execution lifecycle. They do NOT interact with `engine.control_registry`.

### 1.2 Supporting Service Layer

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/services/execution_control_service.py` | 1-100+ | ✅ Fully implemented (batch lifecycle) |
| 2 | `app/repositories/execution_control_repository.py` | 1-50+ | ✅ Fully implemented (batch lifecycle) |
| 3 | `app/api/models/execution_control_models.py` | 1-30+ | ✅ Fully implemented (batch lifecycle) |

### 1.3 Existing Tests

| # | File | Status |
|---|------|--------|
| 1 | `tests/test_execution_control_routes.py` | ✅ Exists |
| 2 | `tests/test_execution_control_service.py` | ✅ Exists |
| 3 | `tests/test_execution_control_repository.py` | ✅ Exists |

---

## 2. Partial Implementations

### 2.1 Control Registry Reads (Internal Engine Only — No API)

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/execution_engine.py` | 506-514 | ⚠️ Reads `control_registry` for enabled controls |
| 2 | `app/execution_engine.py` | 795-819 | ⚠️ Reads `control_registry` for all enabled controls |
| 3 | `app/repositories/dashboard_repository.py` | 46 | ⚠️ Reads `control_registry` for total count |

**What they do:** Read from `engine.control_registry` to get enabled controls during execution. No API endpoint exposes this.

### 2.2 In-Memory Control Registry (Empty Stub)

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/execution/control_registry.py` | 1-5 | ⚠️ Empty dict `{}` |

**What it does:** Maps `control_id` to specialized Python control classes. Currently empty — all controls use `RuleAdapterControl` fallback.

### 2.3 Control Execution Framework

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `app/controls/base_control.py` | 1-80+ | ✅ Abstract base class |
| 2 | `app/controls/rule_adapter_control.py` | 1-20+ | ✅ Bridge to rule execution |
| 3 | `app/execution/control_executor.py` | 1-40+ | ✅ Executes controls |

**What they do:** Execute controls during validation runs. Read-only from `control_registry` perspective.

---

## 3. Missing APIs

| # | Missing Endpoint | Purpose | Priority |
|---|-----------------|---------|----------|
| 1 | `GET /api/v1/controls` | List all controls from `engine.control_registry` | High |
| 2 | `GET /api/v1/controls/{control_id}` | Get control detail | High |
| 3 | `POST /api/v1/controls/{control_id}/toggle` | Enable/disable control (`enabled_flag`) | High |
| 4 | `POST /api/v1/controls` | Create new control | Low |
| 5 | `PUT /api/v1/controls/{control_id}` | Update control | Low |
| 6 | `DELETE /api/v1/controls/{control_id}` | Delete control | Low |

**Note:** Endpoints 4-6 (CRUD) are low priority because controls are relatively static (managed via SQL seed scripts). The frontend Controls page can be built as a read-only view with toggle capability using only endpoints 1-3.

---

## 4. CLI Assessment

### 4.1 Existing CLI Commands

| # | Command | File | Lines | Control Management? |
|---|---------|------|-------|---------------------|
| 1 | `python -m app run --config config.yaml` | `app/__main__.py` | 15-18 | ❌ No (runs full pipeline) |
| 2 | `python -m app discover --config config.yaml` | `app/__main__.py` | 20-21 | ❌ No (dataset discovery only) |
| 3 | `python -m app export --config config.yaml --batch-id <id>` | `app/__main__.py` | 23-25 | ❌ No (audit export only) |

### 4.2 CLI Control Management Gaps

| # | Missing CLI Command | Purpose | Priority |
|---|--------------------|---------|----------|
| 1 | `python -m app controls list` | List all controls from `control_registry` | Low |
| 2 | `python -m app controls show <control_id>` | Show control detail | Low |
| 3 | `python -m app controls toggle <control_id>` | Enable/disable control | Low |

**Assessment:** The CLI has no control management commands. However, CLI control management is low priority because:
- Controls are relatively static (managed via SQL seed scripts)
- The primary user interface for control management will be the web frontend
- Adding CLI commands would be a separate enhancement outside Phase 11 scope

---

## 5. Database Tables

### 5.1 `engine.control_registry` (Target Table)

| # | Column | Type | Notes |
|---|--------|------|-------|
| 1 | `control_id` | VARCHAR(10) PK | e.g., `C01`, `C02` |
| 2 | `control_name` | TEXT NOT NULL | Display name |
| 3 | `description` | TEXT | Description |
| 4 | `severity_level` | VARCHAR(20) | CRITICAL, HIGH, MEDIUM, LOW |
| 5 | `enabled_flag` | BOOLEAN DEFAULT TRUE | Enable/disable toggle |
| 6 | `created_at` | TIMESTAMP DEFAULT NOW() | Creation timestamp |

### 5.2 Seed Data (3 controls)

| # | control_id | control_name | severity_level | enabled_flag |
|---|------------|--------------|----------------|--------------|
| 1 | C01 | Source-to-Target Record Completeness | HIGH | TRUE |
| 2 | C02 | Financial Value Integrity & Reconciliation | CRITICAL | TRUE |
| 3 | C03 | Referential Integrity & Relationship Preservation | HIGH | TRUE |

---

## 6. Exact Files Requiring Modification

### 6.1 Files to MODIFY (Extend Existing)

| # | File | Current State | Modification Required |
|---|------|---------------|----------------------|
| 1 | `app/api/routes/__init__.py` | Imports existing route modules | Add import for new `controls_routes` |
| 2 | `app/api/main.py` | Registers existing routers | Add `app.include_router(controls_routes.router)` |

### 6.2 Files to CREATE (New)

| # | File | Purpose | Pattern to Follow |
|---|------|---------|-------------------|
| 1 | `app/api/routes/controls_routes.py` | New API endpoints for control management | `app/api/routes/rules_routes.py` (when created) |
| 2 | `app/services/controls_service.py` | Service layer for control registry CRUD | `app/services/rules_service.py` (when created) |
| 3 | `app/repositories/controls_repository.py` | Repository for `engine.control_registry` queries | `app/repositories/rules_repository.py` (when created) |
| 4 | `app/api/models/controls_models.py` | Pydantic models for control request/response | `app/api/models/rules_models.py` (when created) |
| 5 | `tests/test_controls_routes.py` | Tests for new API endpoints | `tests/test_rules_routes.py` (when created) |
| 6 | `tests/test_controls_service.py` | Tests for new service | `tests/test_rules_service.py` (when created) |

### 6.3 Files NOT Requiring Modification

| # | File | Reason |
|---|------|--------|
| 1 | `app/execution/control_registry.py` | In-memory registry, not exposed via API |
| 2 | `app/execution/control_executor.py` | Execution logic, not management |
| 3 | `app/execution_engine.py` | Pipeline logic, not management |
| 4 | `app/controls/base_control.py` | Abstract base class |
| 5 | `app/controls/rule_adapter_control.py` | Bridge to rule execution |

---

## 7. Reuse Opportunities

| # | Existing Component | Reuse Pattern | Notes |
|---|-------------------|---------------|-------|
| 1 | `execution_control_routes.py` | Router structure, auth, error handling | Reference for `controls_routes.py` |
| 2 | `execution_control_service.py` | Service class structure | Reference for `controls_service.py` |
| 3 | `execution_control_repository.py` | Repository class structure | Reference for `controls_repository.py` |
| 4 | `execution_control_models.py` | Pydantic model structure | Reference for `controls_models.py` |
| 5 | `engine.control_registry` schema | Target table for CRUD | Already defined |
| 6 | `execution_engine.py` SQL queries | Reference for control queries | Lines 506, 795 |
| 7 | Existing execution control tests | Test patterns and fixtures | Reference for new tests |

---

## 8. Relationship to Task 11.1 (Rules)

The Controls assessment is independent of Rules but has a dependency:

```
Rules → Controls → Discovery
```

The Rules page may need to reference Controls (each rule belongs to a control). The Controls page may need to reference Discovery (controls may be linked to dataset mappings).

**Recommendation:** Complete all three assessments (11.1, 11.2, 11.3) before starting any implementation.

---

**End of Document**
