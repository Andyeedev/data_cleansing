# Release Notes — v5.09 (PMA Assurance — Phase 5A)

## Highlights

- ✅ PMA Orchestrator — service-layer single-system assessment flow (`app/pma/orchestrator.py`)
- ✅ A1 in-process Assessment Context — no table, no column, not durable
- ✅ Single-system selection via existing Tenant → Project → System ownership rules
- ✅ Connection/health gate: probe → connect → SELECT 1; failure blocks discovery
- ✅ Single-system discovery via `list_tables()` → `list_columns()` (no source/target pair)
- ✅ B1 in-memory working set — identity `schema.table`, no persistence
- ✅ PMA batch identity — `PMA-{system_name} - {YYYY-MM-DD HH:MM}` + uuid4 `batch_id`
- ✅ PMA migration mappings created: **0**
- ✅ PMA column mappings created: **0**
- ✅ Schema changes: **0**
- ✅ `discovered_*` model revived: **NO**
- ✅ PMA controls executed: **0** (Phase 5B+ — NOT IMPLEMENTED)
- ✅ Migration Assurance behavior unchanged: **0 existing files modified**
- ✅ 21/21 Phase 5A tests passed (Tests A–J)
- ✅ Live PostgreSQL smoke: assessment completed, batch registered, mapping counts unchanged

---

## New Features

### PMA Orchestrator (Phase 5A Foundation)
- `PmaAssessmentOrchestrator(engine_db).run(tenant_id, project_id, system_id)`
- Accepts authenticated tenant/project context, exactly one registered system
- Resolves connection through existing credential/adapter infrastructure
- Health check before discovery; adapter always closed in `finally`
- Returns `PmaAssessmentContext` as input for Phase 5B (NOT IMPLEMENTED)

### Assessment Context (A1)
- In-process dataclass: tenant_id, project_id, system_id, system_name, `assessment_type="PMA"`, batch_id, batch_name, resolved adapter, health result, working set, `applicable_controls=[]` placeholder, `evidence_policy=None` placeholder, started_at
- Control/evidence placeholders only — no control selection or verdict logic exists yet

### Single-System Discovery + Working Set (B1)
- Direct adapter `list_tables()` → `list_columns()` — bypasses the mapping-first MA discovery path by design (single system, no TARGET required)
- Working set: schema, table, table_type, column, data_type, nullable, column_position, PK passthrough, derived numeric flag
- Identity: `schema.table` — distinguishes multiple tables in one system
- No FK metadata invented; no C09 heuristic; no persistent identity model

### PMA Batch Identity
- `build_batch_name()` → `PMA-{system_name} - {YYYY-MM-DD HH:MM}`
- Existing registry reused: `ExecutionEngine._register_batch(0, name)` + `_complete_batch("COMPLETED")`
- No new table, no schema change; governance/release gates not invoked (total_controls = 0)

---

## Verification & Test Evidence

### Phase 5A Test Results — 21/21 PASSED (executed 2026-10-03)

| Test | Requirement | Tests | Result |
|------|-------------|-------|--------|
| **A** | Valid system → assessment context created | 5 (3 context + 2 orchestrator) | ✅ 5/5 |
| **B** | Wrong-tenant system rejected | 1 | ✅ 1/1 |
| **C** | Connection failure prevents discovery | 4 (probe fail, connect fail, exception, SELECT-1 fail) | ✅ 4/4 |
| **D** | Single-system discovery → working set | 2 (populated + empty DB) | ✅ 2/2 |
| **E** | No `core.dataset_mappings` touched | 1 | ✅ 1/1 |
| **F** | No `core.column_mappings` touched | 1 | ✅ 1/1 |
| **G** | No source/target requirement — one system, no TARGET resolution | 1 | ✅ 1/1 |
| **H** | PMA batch identity format + uuid4 batch_id | 3 | ✅ 3/3 |
| **I** | MA discovery regression (SOURCE/TARGET still required) | 2 | ✅ 2/2 |
| **J** | No PMA control execution (C01–C10) | 1 | ✅ 1/1 |
| | **Total** | **21** | ✅ **21/21** |

Test files: `tests/test_pma_orchestrator.py` (18), `tests/test_pma_assessment_context.py` (3).

### Existing MA Regression

| Suite | Before Phase 5A | After Phase 5A | Delta |
|-------|-----------------|----------------|-------|
| Full test suite (`python -m pytest tests/ -q`) | 99 failed / 757 passed / 6 errors | 99 failed / **778 passed** / 6 errors | +21 passes = Phase 5A tests; **failed/error sets identical** |
| `tests/test_discovery_service.py` (MA discovery file) | 5/6 (1 pre-existing failure) | 5/6 (same 1 pre-existing failure) | Unchanged |
| Phase 5A Test I pins (MA requires SOURCE + TARGET) | n/a | 2/2 pass | New |

### Lint / Typecheck / Build (executed)

| Check | Command | Result |
|-------|---------|--------|
| Lint (Phase 5A files) | `python -m flake8 app/pma tests/test_pma_*` | ✅ 0 issues |
| Lint (Phase 5A files) | `python -m ruff check app/pma tests/test_pma_*` | ✅ All checks passed |
| Typecheck substitute | `python -m compileall app/pma tests/test_pma_*` | ✅ PASS (repo has no mypy/pyright configured) |
| Build | CI build job is a notification echo; local compileall of Phase 5A files | ✅ PASS |
| Repo-wide lint (pre-existing) | flake8 app/ = 1039 issues; ruff check app/ = 2077 | ⚠️ Pre-existing, unchanged by 5A |

### Live PostgreSQL Smoke Evidence (executed 2026-10-03)

| Item | Evidence |
|------|----------|
| System | SourceDB (`99987703-20bf-4c48-a3c0-04e3f5be2d7d`), project `ae40b96c-…`, tenant `aaf73536-…` — matching triple |
| Health check | `Connection successful` — PostgreSQL 17.4 on x86_64-windows |
| Working set | **194 tables / 1922 columns** discovered from one system (schema-scope note in Known Issues) |
| Batch registered | `batch_id = 85c96a46-831e-4c97-b584-50fb8db8f06a`, name `PMA-SourceDB - 2026-10-03 12:18`, status `COMPLETED`, total_controls `0`, end_time set, correct tenant/project |
| PMA batch discoverable | `batch_name LIKE 'PMA-%'` returns the row |
| Zero-mapping proof (before → after) | dataset_mappings 33→33, column_mappings 106→106, rule_dataset_mapping 320→320, dataset_columns 312→312, discovered_datasets 8→8, discovered_columns 16→16 — **all deltas 0** |
| Context controls/evidence | `applicable_controls = []`, `evidence_policy = None` (placeholders — no controls executed) |

---

## Change Summary

### Files Created (7) — no pre-existing file modified

| File | Purpose |
|------|---------|
| `app/pma/__init__.py` | PMA package exports |
| `app/pma/errors.py` | `PmaAssessmentError`, `PmaHealthCheckError` |
| `app/pma/assessment_context.py` | A1 in-process assessment context |
| `app/pma/working_set.py` | B1 working-set types + builder |
| `app/pma/orchestrator.py` | PMA orchestrator + batch-name helper |
| `tests/test_pma_orchestrator.py` | Tests A–J (18 tests) |
| `tests/test_pma_assessment_context.py` | Context tests (3 tests) |

### Not Changed

| Area | Change Count |
|------|-------------|
| Existing application files modified | **0** |
| Database schema (DDL) | **0** |
| API routes / endpoints | **0** |
| Frontend files | **0** |
| MA control/rule/governance code | **0** |
| Migration mappings written by PMA | **0** |

---

## Known Issues / Open Items

1. **PK metadata limitation (known)** — No adapter populates `is_primary_key`: the postgres `list_columns()` query selects only `column_name, data_type, is_nullable, column_default`, so `ColumnInfo.is_primary_key` defaults to `False` and passes through as `False`. Phase 5A records the passthrough honestly and infers nothing. **Open:** adapter-enhancement decision required before PK assurance (Phase 5B+ — founder call).
2. **Schema scope for Phase 5B (open)** — `list_tables()` with no argument passes `schema=None` as the second query parameter, so `WHERE table_schema = %s OR %s IS NULL` bypasses the configured-schema filter (`app/adapters/postgres.py:75-77`); the working set therefore includes system schemas (live: 194 tables including `pg_catalog`). MA discovery calls it identically (`app/services/dataset_discovery_service.py:38-39`), so Phase 5A kept parity and invented no scope rule. **Open:** pass configured schema explicitly vs. accept all-schemas — decision needed before Phase 5B profiling.
3. **Fixed during Phase 5A (recorded)** — `PostgresAdapter.test_connection()` closes its session in `finally` (`postgres.py:152-154`); discovered by the live smoke run. Orchestrator now re-establishes the session via `connect()` before the SELECT-1 gate; regression-tested (Test C connect-failure case; Test A asserts `connect` is called).
4. **Pre-existing repository issues (not caused by Phase 5A, untouched)** —
   - `app/services/auth_service_fixed.py` IndentationError (breaks app-wide compileall and produces flake8 E999; last touched 2026-09-10)
   - `tests/test_discovery_repository.py` collection error (imports non-existent `app.repositories.discovery_repository`)
   - `tests/test_discovery_service.py::test_trigger_discovery_calls_service` failure (plain `Mock()` lacks the context-manager protocol) — present in the 99-failure baseline
   - Suite baseline: 99 failed / 6 errors; app-wide lint: flake8 1039, ruff 2077
5. **Live dev-DB artifact (accepted)** — One PMA batch row (`85c96a46-…`) exists in the dev `engine.migration_batch_registry`. This is the intended feature artifact; MA batch lists will display it (accepted additive effect).

---

## NOT IMPLEMENTED / FUTURE

Phase 5B and all later PMA capabilities are **NOT IMPLEMENTED** in this release:

- PMA control selection and execution (explicit PMA control set — placeholder only: `applicable_controls = []`)
- Data profiling (source/target statistics, freshness)
- PK assurance / FK inference / C09 heuristic
- Readiness scoring and verdict computation (`evidence_policy = None` placeholder only)
- C05/C06 PMA-specific handling via approved Option B (approved decision, not yet built)
- HTTP routes / API endpoints for PMA
- UI, Dashboard, Validation Centre integration
- Report Studio / reporting integration
- E2E workflow

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`

**Tag:** `v5.09-pma_assurance_5a`

**Status:** PMA Phase 5A Complete — Documentation Checkpoint — NOT COMMITTED
