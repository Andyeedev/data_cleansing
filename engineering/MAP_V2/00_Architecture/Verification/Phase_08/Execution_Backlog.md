# EXECUTION BACKLOG
## Phase 08 — Repository Reference Resolution & Governance Integration

**Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution

---

## Backlog Items

### RESOLVED — Approved Architectural Decisions

| ID | Task | Priority | Status | Answer |
|----|------|----------|--------|--------|
| B-01 | Decide `engine.systems` → `core.system_registry` or `engine_v14.systems` | High | **RESOLVED** | Use `core.system_registry` — already exists, currently maintained manually |
| B-02 | Decide `engine.controls` → `engine.control_registry` | High | **RESOLVED** | Use `engine.control_registry` — already exists, no need to create |
| B-03 | Decide `engine.audit_log` → create or use existing | High | **RESOLVED** | Use `audit.audit_events` — already created |
| B-04 | Decide `engine.approvals` → create or use existing | High | **RESOLVED** | Use `platform.approval_requests` — already created |
| B-05 | Decide `engine.exceptions` → use `engine.migration_control_exceptions` | High | **RESOLVED** | Use `engine.migration_control_exceptions` — already created |
| B-08 | Decide `engine.tenants` → remove or keep | Medium | **RESOLVED** | Use `core.tenants` — active table, keep, currently maintained manually |

### BLOCKED — Pending Investigation

| ID | Task | Priority | Status | Issue |
|----|------|----------|--------|-------|
| B-06 | Decide `engine.migration_batch_lifecycle` → create or use existing | High | **BLOCKED** | Table does not exist, need more info on how it came about |
| B-07 | Decide `engine.migration_risk_scores` → execute DDL or remove | High | **BLOCKED** | Table does not exist, need more info on how it came about |

### READY — Can Begin After Decisions

| ID | Task | Priority | Status | Depends On |
|----|------|----------|--------|------------|
| R-01 | Verify each `DashboardRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | High | **READY** | B-01, B-02, B-03 |
| R-02 | Verify each `GovernanceRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | High | **READY** | B-03, B-04, B-05 |
| R-03 | Verify `ExecutionControlRepository` reference (1 reference) | High | **BLOCKED** | B-06 |
| R-04 | Verify `ValidationReportRepository` reference (1 reference) | High | **BLOCKED** | B-07 |
| R-05 | Remove silent exception handling in `DashboardService` | High | **READY** | R-01 |
| R-06 | Remove silent exception handling in `GovernanceService` | High | **READY** | R-02 |
| R-07 | Integrate v1.9 governance with new API governance | Medium | **READY** | B-08 |
| R-08 | Remove `engine.tenants` DDL if decision is removal | Low | **NOT REQUIRED** | B-08 resolved — keep `core.tenants` |

### VALIDATION — After Implementation

| ID | Task | Priority | Status | Depends On |
|----|------|----------|--------|------------|
| V-01 | Re-run backend tests (195 tests) | High | PENDING | R-01, R-02 |
| V-02 | Re-run frontend tests (248 tests) | High | PENDING | R-01, R-02 |
| V-03 | Re-run E2E verification (7 endpoints) | High | PENDING | R-05, R-06 |
| V-04 | Re-run runtime lineage audit | High | PENDING | R-01, R-02 |
| V-05 | Verify KPI endpoints return data | High | PENDING | R-01, R-05 |
| V-06 | Verify governance endpoints return data | High | PENDING | R-02, R-06 |

---

## Task Details

### B-01: `engine.systems` → `core.system_registry` ✓

**Decision:** Use `core.system_registry`

**Rationale:** Already exists, currently maintained manually. No need to create new table.

**Files to update:**
- `app/repositories/dashboard_repository.py` — `DashboardRepository` class

---

### B-02: `engine.controls` → `engine.control_registry` ✓

**Decision:** Use `engine.control_registry`

**Rationale:** Already exists, no need to create.

**Files to update:**
- `app/repositories/dashboard_repository.py` — `DashboardRepository` class

---

### B-03: `engine.audit_log` → `audit.audit_events` ✓

**Decision:** Use `audit.audit_events`

**Rationale:** Already created.

**Files to update:**
- `app/repositories/dashboard_repository.py` — `DashboardRepository` class
- `app/repositories/governance_repository.py` — `GovernanceRepository` class

---

### B-04: `engine.approvals` → `platform.approval_requests` ✓

**Decision:** Use `platform.approval_requests`

**Rationale:** Already created.

**Files to update:**
- `app/repositories/governance_repository.py` — `GovernanceRepository` class

---

### B-05: `engine.exceptions` → `engine.migration_control_exceptions` ✓

**Decision:** Use `engine.migration_control_exceptions`

**Rationale:** Already created.

**Files to update:**
- `app/repositories/governance_repository.py` — `GovernanceRepository` class

---

### B-06: `engine.migration_batch_lifecycle` — BLOCKED

**Status:** BLOCKED — Pending Investigation

**Issue:** Table does not exist. Need more info on how it came about.

**Action:** **DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.**

---

### B-07: `engine.migration_risk_scores` — BLOCKED

**Status:** BLOCKED — Pending Investigation

**Issue:** Table does not exist. Need more info on how it came about.

**Action:** **DO NOT invent replacement tables. DO NOT create these tables. Stop work and report findings if these references are encountered.**

---

### B-08: `engine.tenants` → `core.tenants` ✓

**Decision:** Use `core.tenants`

**Rationale:** Active table, keep, currently maintained manually.

**Files to update:**
- `app/installer/install_governance_tables.sql` — Consider removing duplicate DDL

---

## Summary

| Category | Count |
|----------|-------|
| RESOLVED (approved decisions) | 6 |
| BLOCKED (pending investigation) | 2 |
| READY (can begin) | 6 |
| BLOCKED (waiting on B-06/B-07) | 2 |
| PENDING (validation) | 6 |
| NOT REQUIRED | 1 |
| **Total** | **23** |

---

**Document Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution
