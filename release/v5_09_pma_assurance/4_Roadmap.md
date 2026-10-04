# Development Roadmap — v5.09 (PMA Assurance)

---

## Completed Work

### Platform Workstreams (v5.05 → v5.08)
- **v5.05** — Architecture Compliance Audit, Enterprise Functional Traceability, Business Capability/Process/Data Models
- **v5.06** — Platform Baseline Documentation (Pre-Frontend Freeze)
- **v5.07 / v5.08** — Complete MAP Validation Pipeline (Schedule → Execute → Validate → Report), workstream-07 task management, MAP_V2 baseline

### PMA Assurance Workstream (workstream-08)
- **Phase 5** — PMA concept definition and component scoping
- **Phase 5b Scope Lock** — Locked scope boundaries (no execution, no routes)
- **V1 Architecture Pack** — Architecture decision pack; Founder decisions recorded
  - **C05/C06 Option B — APPROVED (fixed):** column-level null/type assessment via PMA-specific controls/capabilities, never by modifying shared MA C05/C06 rule implementations
- **Phase 5A — PMA Foundation ✅ Current (this release)**
  - PMA Orchestrator (service layer)
  - A1 in-process Assessment Context
  - Single-system selection (existing ownership rules)
  - Connection/health gate (probe → connect → SELECT 1)
  - Single-system discovery (`list_tables()` → `list_columns()`)
  - B1 in-memory working set (identity `schema.table`)
  - PMA batch identity (`PMA-… - …` + uuid4, existing registry)
  - Tests A–J: 21/21 passed; live PostgreSQL smoke completed
  - Zero mappings / zero schema changes / zero MA changes

---

## Current Platform Metrics (Unchanged by Phase 5A)

| Metric | v5.08 Baseline | v5.09 | Change |
|--------|----------------|-------|--------|
| Database tables | 115 | 115 | **+0** |
| Database views | 19 | 19 | +0 |
| API route files | 34 | 34 | +0 |
| Frontend route pages | 87 | 87 | +0 |
| New backend files (`app/pma/`) | — | 5 | +5 |
| New test files | — | 2 | +2 |
| Phase 5A tests passing | — | 21 | +21 |

---

## Next Steps — NOT IMPLEMENTED / FUTURE

> **Everything below is FUTURE work. None of it is implemented in v5.09.**

### Phase 5B — PMA Control Execution (NOT IMPLEMENTED)
- [ ] Explicit PMA control-set selection (replaces empty `applicable_controls = []` placeholder)
- [ ] PMA control execution engine pass (no MA `_get_controls()` coupling)
- [ ] Evidence/verdict policy (replaces `evidence_policy = None` placeholder)
- [ ] **Decision needed:** PK metadata — adapter enhancement to populate `is_primary_key`
- [ ] **Decision needed:** discovery schema scope (configured schema vs. all schemas)
- [ ] Data profiling foundation (per-table/per-column statistics)

### Phase 5C+ — PMA Capabilities (NOT IMPLEMENTED)
- [ ] PK assurance / FK inference
- [ ] C09 heuristic (deliberately excluded from 5A)
- [ ] C05/C06 PMA handling via approved Option B
- [ ] Readiness scoring

### Phase 5D/5E/5F — Surface Integration (NOT IMPLEMENTED)
- [ ] HTTP routes / API endpoints
- [ ] UI (Dashboard, Validation Centre)
- [ ] Report Studio / reporting integration (explicitly deferred from Phase 5A)
- [ ] E2E workflow

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`

**Status:** PMA Phase 5A Complete — Phase 5B+ NOT IMPLEMENTED
