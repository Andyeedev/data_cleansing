# Technical Architecture — v5.09 (PMA Phase 5A)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                    │
│        Unchanged in Phase 5A — no PMA UI (FUTURE)            │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP (proxy /api/v1)   — no PMA routes (FUTURE)
┌──────────────┴──────────────────────────────────────────────┐
│                    Backend (FastAPI + Uvicorn)                │
│  Auth │ Execution │ Rules │ Governance │ Mapping │ Discovery  │
│                          │                                    │
│                    ┌─────┴──────┐                             │
│                    │ app/pma/   │  NEW (Phase 5A, service     │
│                    │ PMA layer  │  layer only — no routes)    │
│                    └─────┬──────┘                             │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────┴──────────────────────────────────────────────┐
│                    Database (PostgreSQL 17.4)                 │
│  core │ engine │ engine_v14 │ platform │ audit │ reporting   │
│  NO schema changes in Phase 5A — engine.migration_batch_     │
│  registry reused via existing INSERT/UPDATE only             │
└─────────────────────────────────────────────────────────────┘
```

---

## PMA Assessment Flow (As Implemented)

```
Tenant / Project / System  (authenticated context ids)
  ↓
PmaAssessmentOrchestrator.run(tenant_id, project_id, system_id)
  │   app/pma/orchestrator.py
  ↓
PmaAssessmentContext  (uuid4 batch_id, assessment_type="PMA")
  │   app/pma/assessment_context.py — in-process, NOT a table
  ↓
Single-System Selection
  │   SystemService.get_system(system_id, tenant_id, project_id)
  │   → existing project-join ownership predicate; cross-tenant → PmaAssessmentError
  ↓
Connection Resolution
  │   CredentialService.get_decrypted_credentials(system_id, tenant_id)
  │   + SystemService._build_adapter_config() + AdapterRegistry.get()
  ↓
Connection / Health Check  (gate — any failure blocks discovery)
  │   adapter.test_connection()  → probe result (success, message, latency, version)
  │   adapter.connect()          → session re-established (probe closes its own session)
  │   ConnectionAdapter.validate_connections() → SELECT 1
  │   failure → PmaHealthCheckError, no discovery, no batch row
  ↓
Single-System Discovery
  │   adapter.list_tables()  →  adapter.list_columns()   (one system only)
  │   NO source_system_id / target_system_id / MatchingEngine / mappings
  ↓
In-Memory Working Set
  │   app/pma/working_set.py — PmaWorkingSet / PmaTable / PmaColumn
  │   identity: schema.table — in-memory only, no persistence
  ↓
PMA Batch Identity
  │   build_batch_name() → "PMA-{system_name} - {YYYY-MM-DD HH:MM}"
  │   ExecutionEngine._register_batch(0, batch_name)  → INSERT registry row
  │   ExecutionEngine._complete_batch("COMPLETED")    → UPDATE status
  │   governance / release gates NOT invoked
  ↓
adapter.close()  (finally — always released)
  ↓
returns PmaAssessmentContext  →  input for Phase 5B (NOT IMPLEMENTED)
```

---

## New PMA Components (`app/pma/`)

| File | Purpose |
|------|---------|
| `orchestrator.py` | `PmaAssessmentOrchestrator` — Phase 5A end-to-end flow; `build_batch_name()` helper |
| `assessment_context.py` | `PmaAssessmentContext` dataclass — A1 in-process context; `PMA_ASSESSMENT_TYPE = "PMA"` |
| `working_set.py` | `PmaWorkingSet` / `PmaTable` / `PmaColumn`; `build_working_set(adapter, system_id)` |
| `errors.py` | `PmaAssessmentError`, `PmaHealthCheckError` |
| `__init__.py` | Public package exports |

---

## Existing Architecture Reuse (No Duplication)

| Existing Component | Reused For | Modified? |
|--------------------|-----------|-----------|
| `SystemService.get_system()` | Tenant → Project → System ownership gate | **No** |
| `SystemService._build_adapter_config()` | Adapter config construction | **No** |
| `CredentialService.get_decrypted_credentials()` | Tenant-scoped credential decryption | **No** |
| `AdapterRegistry` + `DB_TYPE_MAP` | Adapter instantiation | **No** |
| `ConnectionAdapter.validate_connections()` | SELECT 1 health gate | **No** |
| `ExecutionEngine._register_batch() / _complete_batch()` | Batch identity persistence | **No** |
| `engine.migration_batch_registry` | PMA batch row (existing table/columns) | **No** (schema) |
| `DatasetDiscoveryService` (MA) | Untouched — mapping-first discovery unchanged | **No** |

---

## Working Set Model (B1)

```
PmaWorkingSet
  ├─ system_id
  ├─ tables: [PmaTable]
  │    ├─ schema_name
  │    ├─ table_name
  │    ├─ table_type
  │    ├─ entity_name  = "schema.table"   ← logical identity (distinguishes tables)
  │    └─ columns: [PmaColumn]
  │         ├─ column_name
  │         ├─ data_type
  │         ├─ is_nullable
  │         ├─ column_position   (ordinal enumeration from list_columns ORDER BY)
  │         ├─ is_primary_key    (adapter passthrough — see Known Issues)
  │         └─ is_numeric        (derived from data_type — convenience only)
  ├─ table_count / column_count (properties)
```

- **FK metadata:** not available from existing adapters → left unavailable (not invented).
- **C09 heuristic:** not implemented in Phase 5A.
- **No persistence:** the working set exists only in process memory.

---

## Batch Identity Architecture

| Aspect | Implementation |
|--------|---------------|
| `batch_name` | `PMA-{system_name} - {YYYY-MM-DD HH:MM}` (naive-local clock — MA registry convention) |
| `batch_id` | `uuid4` — correctness-critical identifier |
| Persistence | Existing `engine.migration_batch_registry` via existing ExecutionEngine lifecycle |
| Distinguishability | `PMA-` prefix (`batch_name LIKE 'PMA-%'`) |
| New table / column | **None** |
| MA safety | Governance, release gates, `_get_controls()` never invoked; total_controls = 0 |

---

## Security Architecture

| Layer | Implementation |
|-------|---------------|
| Tenant Isolation | `get_system(system_id, tenant_id, project_id)` — repository joins `core.projects` on `tenant_id`; foreign tenant → "System not found" → `PmaAssessmentError` **before any adapter/discovery/batch work** |
| Credential Scoping | `get_decrypted_credentials(system_id, tenant_id)` — existing tenant-scoped path only |
| Cross-tenant testing | Test B — rejected before discovery; no batch row created |
| New security model | **None** — existing DEV-001 tenant-verification pattern reused |
| Health gate | Failed connection/health check raises `PmaHealthCheckError` — no partial discovery, no batch row |

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`

**Status:** PMA Phase 5A Complete — Service Layer Only
