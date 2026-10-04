# Architecture Baseline — v5.09 (PMA Phase 5A)

## PMA Phase 5A Technical Baseline

This document provides the technical snapshot of the **PMA Assurance workstream at Phase 5A** — every new file, every reused component, every executed test, every persistence guarantee. The platform-wide baseline (database, API routes, frontend) is unchanged from v5.08 and is not repeated here.

---

## 1. PMA Foundation — New Files (7)

### Backend (`app/pma/` — 5 files)

| File | Contents |
|------|----------|
| `app/pma/__init__.py` | Public exports: `PmaAssessmentContext`, `PmaAssessmentError`, `PmaHealthCheckError`, `PmaAssessmentOrchestrator`, `build_batch_name`, `PmaWorkingSet`, `build_working_set`, `PmaTable`, `PmaColumn`, `PMA_ASSESSMENT_TYPE` |
| `app/pma/errors.py` | `PmaAssessmentError(Exception)`, `PmaHealthCheckError(PmaAssessmentError)` |
| `app/pma/assessment_context.py` | `PMA_ASSESSMENT_TYPE = "PMA"`; `PmaAssessmentContext` dataclass — tenant_id, project_id, system_id, system_name, batch_id, batch_name, started_at, assessment_type, adapter, health_check, working_set, `applicable_controls=[]`, `evidence_policy=None` |
| `app/pma/working_set.py` | `PmaColumn` (column_name, data_type, is_nullable, column_position, is_primary_key, is_numeric), `PmaTable` (schema_name, table_name, table_type, entity_name=`schema.table`, columns), `PmaWorkingSet` (system_id, tables, counts), `build_working_set(adapter, system_id)` |
| `app/pma/orchestrator.py` | `build_batch_name(system_name, when)` → `PMA-{name} - {YYYY-MM-DD HH:MM}`; `PmaAssessmentOrchestrator(engine_db).run(tenant_id, project_id, system_id, now=None)` — full flow, adapter closed in `finally` |

### Tests (2 files — 21 tests)

| File | Tests |
|------|-------|
| `tests/test_pma_orchestrator.py` | 18 tests — TestA(2), TestB(1), TestC(4), TestD(2), TestE(1), TestF(1), TestG(1), TestH(3), TestI(2), TestJ(1) |
| `tests/test_pma_assessment_context.py` | 3 tests — assessment_type, identity fields, empty placeholders |

**Existing files modified by Phase 5A: 0.**

---

## 2. PMA Assessment Flow (Implemented)

```
Tenant / Project / System (authenticated ids)
  → PmaAssessmentOrchestrator.run()
  → PmaAssessmentContext (uuid4 batch_id, assessment_type="PMA")
  → SystemService.get_system()            [ownership gate — cross-tenant rejected]
  → Credentials + AdapterConfig + AdapterRegistry
  → Health gate: test_connection → connect → SELECT 1
  → list_tables() → list_columns()        [single system, no TARGET]
  → build_working_set()                   [in-memory, identity schema.table]
  → build_batch_name() → _register_batch() → _complete_batch("COMPLETED")
  → adapter.close() (finally)
  → return context                        [Phase 5B input — NOT IMPLEMENTED]
```

---

## 3. Dependencies Baseline (Reused — None Modified)

| Existing Component | Used For |
|--------------------|----------|
| `SystemService.get_system(system_id, tenant_id, project_id)` | Ownership: joins `core.projects` on `tenant_id` |
| `SystemService._build_adapter_config()` | Adapter configuration |
| `CredentialService.get_decrypted_credentials(system_id, tenant_id)` | Tenant-scoped credential decryption |
| `AdapterRegistry` / `DB_TYPE_MAP` | Adapter instantiation |
| `ConnectionAdapter.validate_connections()` | SELECT 1 gate (label `PMA_ASSESSMENT`) |
| `ExecutionEngine._register_batch/_complete_batch` | Batch registry INSERT/UPDATE |
| `TableInfo` / `ColumnInfo` (adapters) | Discovery metadata source |
| `DatasetDiscoveryService` (MA) | Untouched |

Test infrastructure: standard-library `unittest.mock` (repo convention), `pytest` 9.1.0 via `.venv` Python 3.12.7.

---

## 4. Test Baseline (Executed 2026-10-03)

### Requirement Coverage — 21/21 PASSED

| Test | Requirement | Passed |
|------|-------------|--------|
| A | Valid system → context created (+ adapter closed, context fields/placeholders) | 5/5 |
| B | Wrong-tenant system rejected before any discovery/batch work | 1/1 |
| C | Connection failure prevents discovery (probe fail / connect fail / exception / SELECT-1 fail) | 4/4 |
| D | Single-system discovery → working set (populated + empty DB) | 2/2 |
| E | No `core.dataset_mappings` touched | 1/1 |
| F | No `core.column_mappings` touched | 1/1 |
| G | One system, one adapter, no TARGET resolution, single `get_system` call | 1/1 |
| H | Batch name format, uuid4 batch_id, INSERT/UPDATE parameters | 3/3 |
| I | MA discovery regression — still requires SOURCE and TARGET, no mapping SQL | 2/2 |
| J | No control/rule execution statements; placeholders empty | 1/1 |

### Full Suite Regression

| Run | Failed | Passed | Errors |
|-----|--------|--------|--------|
| Baseline (before Phase 5A) | 99 | 757 | 6 |
| After Phase 5A | 99 | **778** | 6 |

Failed and error sets identical; +21 passes = exactly the Phase 5A tests. MA discovery file (`tests/test_discovery_service.py`): 5/6 both runs (1 pre-existing failure).

### Quality Gates

| Gate | Command | Result |
|------|---------|--------|
| Lint | `flake8` (repo `.flake8`, max-line 100) on Phase 5A files | 0 issues |
| Lint | `ruff check` on Phase 5A files | All checks passed |
| Typecheck | `compileall` on Phase 5A files (no mypy/pyright in repo) | PASS |
| Build | CI build step = notification echo; local compileall | PASS |

---

## 5. Live Smoke Baseline (PostgreSQL, 2026-10-03)

| Item | Value |
|------|-------|
| System | SourceDB `99987703-20bf-4c48-a3c0-04e3f5be2d7d` (Postgres) |
| Project / Tenant | `ae40b96c-20da-4972-bb29-bff3c2451ae0` / `aaf73536-2fd0-461e-87be-aa980cc1a8f1` |
| Health | `Connection successful` — PostgreSQL 17.4 |
| Working set | 194 tables / 1922 columns (includes system schemas — see Known Issues) |
| Batch row | `85c96a46-831e-4c97-b584-50fb8db8f06a` · `PMA-SourceDB - 2026-10-03 12:18` · `COMPLETED` · total_controls 0 |
| Mapping counts | 6 tables measured before/after — all deltas 0 (33/106/320/312/8/16) |

---

## 6. Persistence Baseline (Phase 5A)

| Guarantee | Value |
|-----------|-------|
| PMA migration mappings created | **0** |
| PMA column mappings created | **0** |
| Schema changes (DDL) | **0** |
| `core.discovered_datasets` revived | **NO** |
| `core.discovered_columns` revived | **NO** |
| New tables / columns / indexes / FKs | **0** |
| Writes by PMA | `engine.migration_batch_registry` INSERT + UPDATE only |
| PMA controls registered/executed | **0** (placeholders only) |

---

## 7. Platform Baseline (Unchanged — Reference: v5_08 Baseline)

Per `release/v5_08_task_management_MAP_V2_baseline/8_Architecture_Baseline.md`, unchanged by Phase 5A:

- Database: 115 tables, 19 views, 91 FKs, 220 indexes across 6 schemas
- API: 34 route files (no PMA routes added)
- Frontend: 87 route pages, 46 components (no PMA UI added)
- Validation rules: C01–C010 MA rules untouched
- Backend Python files: 191 + 5 new `app/pma/` files

---

## 8. NOT IMPLEMENTED / FUTURE at This Baseline

- Phase 5B+: PMA control selection & execution, profiling, PK assurance, readiness scoring, evidence/verdict policy
- PK metadata adapter enhancement (currently `is_primary_key` always False passthrough)
- Discovery schema-scope decision (configured schema vs. all schemas)
- HTTP routes, UI, Report Studio, E2E
- C05/C06 via approved Option B (approved, not built)

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`

**Tag:** `v5.09-pma_assurance_5a`

**Status:** PMA Phase 5A Baseline Captured — NOT COMMITTED
