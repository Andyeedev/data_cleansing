# MAP Nexus Enterprise Platform (v5.09) — PMA Assurance

## Overview

The **MAP Nexus Enterprise Platform** is a comprehensive data migration and validation platform designed for regulated Financial Services industries. This release documents the **PMA Assurance workstream — Phase 5A (PMA Foundation)**: the backend service-layer foundation for **Pre-Migration Assurance (PMA)** — a single-system assessment capability that runs *before* Migration Assurance.

Phase 5A establishes the PMA Orchestrator, in-process Assessment Context, single-system discovery, in-memory working set, and PMA batch identity. **It executes no PMA controls** (Phase 5B+ — NOT IMPLEMENTED).

---

## Scope of Work

### What Was Built (Phase 5A Only)

| Area | Description |
|------|-------------|
| **PMA Orchestrator** | Service-layer `PmaAssessmentOrchestrator.run(tenant_id, project_id, system_id)` — end-to-end assessment flow, no routes/UI |
| **Assessment Context** | A1 in-process `PmaAssessmentContext` dataclass — no table, no column, not durable |
| **Single-System Selection** | Existing Tenant → Project → System ownership rules only; cross-tenant selection rejected |
| **Connection / Health Check** | Existing credential + adapter infrastructure; probe → connect → SELECT 1 gate blocks discovery on failure |
| **Single-System Discovery** | Direct `list_tables()` → `list_columns()` on the resolved adapter — no source/target pair, no MatchingEngine, no mappings |
| **Working Set (B1)** | In-memory `PmaWorkingSet` — schema, table, column, data_type, nullable, column_position, PK passthrough; identity `schema.table` |
| **PMA Batch Identity** | `PMA-{system_name} - {YYYY-MM-DD HH:MM}` + uuid4 `batch_id`, written via existing `engine.migration_batch_registry` |

### Explicitly NOT Implemented (Future Phases)

| Area | Status |
|------|--------|
| PMA control selection / execution (C01–C10 or PMA controls) | **NOT IMPLEMENTED — FUTURE (Phase 5B+)** |
| Data profiling, PK assurance, readiness scoring | **NOT IMPLEMENTED — FUTURE** |
| Evidence / verdict policy (context placeholder only) | **NOT IMPLEMENTED — FUTURE** |
| HTTP routes, UI, Report Studio, reporting | **NOT IMPLEMENTED — FUTURE** |
| Phase 5B and all later PMA capabilities | **NOT IMPLEMENTED — FUTURE** |

---

## Key Deliverables

### 1. PMA Foundation Package (`app/pma/`)
- `orchestrator.py` — assessment flow + `build_batch_name()` helper
- `assessment_context.py` — A1 context dataclass (`assessment_type="PMA"`)
- `working_set.py` — B1 working-set types + `build_working_set()`
- `errors.py` — `PmaAssessmentError`, `PmaHealthCheckError`
- `__init__.py` — package exports

### 2. Tests A–J (21 tests, all executed)
- `tests/test_pma_orchestrator.py` — 18 tests (A–J)
- `tests/test_pma_assessment_context.py` — 3 tests (context fields)

### 3. Critical Invariants Enforced
- PMA migration mappings created: **0**
- PMA column mappings created: **0**
- Schema changes: **0**
- `core.discovered_datasets` / `core.discovered_columns` revived: **NO**
- PMA controls registered/executed: **0**
- Existing Migration Assurance behavior changed: **0 files modified**

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Database** | PostgreSQL 17.4 (engine + live source smoke), SQL Server (pyodbc) |
| **Backend** | Python 3.12 (local venv), FastAPI, SQLAlchemy |
| **Frontend** | React 19, TypeScript, Vite 8 (unchanged in Phase 5A) |
| **Authentication** | JWT, bcrypt (unchanged) |
| **Validation** | MAP CLI (data-driven DAG) — Migration Assurance (unchanged) |

---

## Database Schemas

**No schema changes in Phase 5A.** Platform schemas remain as per v5.08 baseline:

| Schema | Purpose | Tables |
|--------|---------|--------|
| `core` | Tenant, project, system, mapping management | 27 |
| `engine` | Validation execution, governance, control dependencies | 47 |
| `engine_v14` | Legacy v1.4 schema | 10 |
| `reporting` | Dimension tables, views | 3 |
| `platform` | User management, RBAC, workflows | 23 |
| `audit` | Audit trail, security events | 5 |

**Total:** 115 tables, 19 views, 91 foreign keys, 220 indexes (per v5.08 baseline — unchanged)

Phase 5A writes only to the existing `engine.migration_batch_registry` (INSERT/UPDATE, existing columns) when registering a PMA batch.

---

## Platform Metrics

| Metric | Count | Change in 5A |
|--------|-------|--------------|
| Database tables | 115 | **+0** |
| API route files | 34 | **+0** |
| Frontend route pages | 87 | **+0** |
| Backend Python files (new) | 5 (`app/pma/`) | **+5** |
| Test files (new) | 2 | **+2** |
| Phase 5A tests | 21 | **+21 (all pass)** |

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`

**Tag:** `v5.09-pma_assurance_5a`

**Status:** PMA Phase 5A Complete — Documentation Checkpoint — NOT COMMITTED
