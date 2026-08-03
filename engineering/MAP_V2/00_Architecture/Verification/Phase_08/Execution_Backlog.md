# EXECUTION BACKLOG
## Phase 08 — Repository Reference Resolution & Frontend MVP Implementation

**Generated:** 2026-07-24
**Last Updated:** 2026-07-31
**Status:** APPROVED — Phase 08A/B Complete, Phase 08C In Progress

---

## Backlog Items

### RESOLVED — Approved Architectural Decisions

| ID | Task | Priority | Status | Completed Date | Answer |
|----|------|----------|--------|----------------|--------|
| B-01 | Decide `engine.systems` → `core.system_registry` or `engine_v14.systems` | High | **RESOLVED** | 2026-07-31 | Use `core.system_registry` — already exists, currently maintained manually |
| B-02 | Decide `engine.controls` → `engine.control_registry` | High | **RESOLVED** | 2026-07-31 | Use `engine.control_registry` — already exists, no need to create |
| B-03 | Decide `engine.audit_log` → create or use existing | High | **RESOLVED** | 2026-07-31 | Use `audit.audit_events` — already created |
| B-04 | Decide `engine.approvals` → create or use existing | High | **RESOLVED** | 2026-07-31 | Use `platform.approval_requests` — already created |
| B-05 | Decide `engine.exceptions` → use `engine.migration_control_exceptions` | High | **RESOLVED** | 2026-07-31 | Use `engine.migration_control_exceptions` — already created |
| B-08 | Decide `engine.tenants` → remove or keep | Medium | **RESOLVED** | 2026-07-31 | Use `core.tenants` — active table, keep, currently maintained manually |

### BLOCKED — Pending Investigation

| ID | Task | Priority | Status | Completed Date | Issue |
|----|------|----------|--------|----------------|-------|
| B-06 | Decide `engine.migration_batch_lifecycle` → create or use existing | High | **RESOLVED** | 2026-07-31 | Use `engine.batch_execution_checkpoint` (partial match). See `09_Risk_Score_Decision.md` and `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab |
| B-07 | Decide `engine.migration_risk_scores` → execute DDL or remove | High | **RESOLVED** | 2026-07-31 | Create `engine.v_batch_risk_index` view instead of table. See `09_Risk_Score_Decision.md` and `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab |

### READY — Can Begin After Decisions

| ID | Task | Priority | Status | Completed Date | Depends On |
|----|------|----------|--------|----------------|------------|
| R-01 | Verify each `DashboardRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | High | **READY** | — | B-01, B-02, B-03 |
| R-02 | Verify each `GovernanceRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | High | **READY** | — | B-03, B-04, B-05 |
| R-03 | Verify `ExecutionControlRepository` reference (1 reference) | High | **READY** | — | B-06 resolved |
| R-04 | Verify `ValidationReportRepository` reference (1 reference) | High | **READY** | — | B-07 resolved |
| R-05 | Remove silent exception handling in `DashboardService` | High | **READY** | — | R-01 |
| R-06 | Remove silent exception handling in `GovernanceService` | High | **READY** | — | R-02 |
| R-07 | Integrate v1.9 governance with new API governance | Medium | **READY** | — | B-08 |
| R-08 | Remove `engine.tenants` DDL if decision is removal | Low | **NOT REQUIRED** | 2026-07-31 | B-08 resolved — keep `core.tenants` |

### Phase 08B — Frontend MVP Implementation (per 08AA)

| ID | Task | Priority | Status | Depends On | Evidence |
|----|------|----------|--------|------------|----------|
| FB-01 | Implement MigrationProjectsPage | P1 | **COMPLETE** | — | `src/routes/MigrationProjectsPage.tsx` |
| FB-02 | Implement MigrationDatasetsPage | P1 | **COMPLETE** | — | `src/routes/MigrationDatasetsPage.tsx` |
| FB-03 | Implement MigrationSchedulesPage | P1 | **COMPLETE** | — | `src/routes/MigrationSchedulesPage.tsx` |
| FB-04 | Implement MigrationOverviewPage | P1 | **COMPLETE** | — | `src/routes/MigrationOverviewPage.tsx` |
| FB-05 | Implement AccessDeniedPage | P1 | **COMPLETE** | — | `src/routes/AccessDeniedPage.tsx` — routed at `/access-denied` |
| FB-06 | Fix ProtectedRoute to redirect to `/access-denied` | P1 | **COMPLETE** | — | ProtectedRoute now redirects to `/access-denied` for role-based access denied |
| FB-10b | Implement server-side search on Migration History table | P1 | **COMPLETE** | 2026-08-02 | `?search=` query param, ILIKE search across batch_id/batch_status/project_id |
| FB-10c | Implement server-side sort on Migration History table | P1 | **COMPLETE** | 2026-08-02 | `?sort_by=` `&sort_dir=` query params, ORDER BY with NULLS LAST |
| FB-10d | Implement server-side search/sort on Governance Risk/Unscored/Orphaned tabs | P1 | **COMPLETE** | 2026-08-02 | Risk tab already had search; Unscored/Orphaned search+sort added |
| FB-10e | Add tenant filter to Dashboard page | P1 | **COMPLETE** | 2026-08-02 | TenantFilter dropdown centered next to Executive Overview title; portfolio/activity/score-summary all support tenant_id |
| FB-10f | Fix Dashboard migration-score-summary 500 error | P1 | **COMPLETE** | 2026-08-02 | Repository method signature mismatch fixed; tenant_id filtering added |
| FB-10g | Fix Dashboard slow loading performance | P1 | **COMPLETE** | 2026-08-02 | DB indexes added, JWT decode optimized (1→decode per request), status breakdown isolation |
| FB-10h | Fix Schedule Run "Failed to Run Schedule" error | P1 | **COMPLETE** | 2026-08-02 | Stale DB connection (per-request service), frontend error handling, PYTHONPATH fix |
| FB-10i | Implement DB connection pooling | P1 | **COMPLETE** | 2026-08-02 | `PooledDBConnector` with `ThreadedConnectionPool` (min=2, max=20); `get_db_connection()` returns pooled connections | |
| FB-07 | Implement `v_batch_risk_index` view | P1 | **COMPLETE** | 2026-08-01 | `engine.v_batch_risk_index` — 506 batches, FAIL=1/ERROR=2 methodology | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row |
| FB-08 | Implement `migration_risk_scores` table | P1 | **RESOLVED** — replaced by `engine.v_batch_risk_index` view, table no longer needed | — | `risk_scoring.py` INSERT target; view replaces table | `09_Risk_Score_Decision.md` → Decision 5 |
| FB-09 | Implement `v_migration_score_summary` view | P1 | **COMPLETE** | 2026-08-01 | `engine.v_migration_score_summary` — 506 batches, pass rate methodology | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_migration_score_summary` row |
| FB-09 | Add `FAIL` mapping to StatusBadge | P1 | **COMPLETE** | — | `src/components/shared/StatusBadge.tsx` |
| FB-10 | Replace hardcoded status badge colors with StatusBadge | P1 | **COMPLETE** | FB-09 | DashboardPage, MigrationOverviewPage |
| FB-11 | Theme consistency fixes (table padding, font-size, h1 fontWeight) | P1 | **COMPLETE** | — | DashboardPage, MigrationDatasetsPage |
| FB-12 | Enhance DashboardPage with ExecutiveRisk, ExecutiveInsights, ExecutiveNotifications | P2 | **DEFERRED** | — | Components don't exist |
| FB-13 | Add Governance sub-pages for Policies, Regulatory Reporting | P2 | **DEFERRED** | — | Not in MVP scope |
| FB-14 | Enhance OperationsPage with failure details view | P2 | **COMPLETE** | 2026-08-03 | New Failures tab with expandable failed batch details, control execution grid |
| FB-15 | Add EnvironmentBanner | P2 | **DEFERRED** | — | Not in MVP scope |
| FB-16 | Wire Breadcrumb into page layout | P2 | **COMPLETE** | — | Component wired in Shell.tsx:89; tests added |
| FB-17 | Fix navigation role filtering (backend) | P2 | **PENDING** | — | `navigation_routes.py` returns unfiltered |

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

### B-06: `engine.migration_batch_lifecycle` — RESOLVED

**Resolution:** Use `engine.batch_execution_checkpoint` (partial match).

**Rationale:** Phase 09 analysis confirmed `engine.migration_batch_lifecycle` never existed (no DDL, no Python INSERT). The `engine.batch_execution_checkpoint` table already exists with 436 rows, populated by `execution_engine.py:_save_checkpoint`. The lifecycle endpoint `GET /api/v1/execution/{batch_id}/lifecycle` already uses this table. Lifecycle events are partial per Phase 08 — only `batch_id` and `last_completed_control` are available.

**Cross-Reference:** `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row; `09_1_Implementation_Plan.md` → Lifecycle Events row

**Files to update:** None (existing `engine.batch_execution_checkpoint` is sufficient)

---

### B-07: `engine.migration_risk_scores` — RESOLVED

**Resolution:** Create `engine.v_batch_risk_index` view instead of the table. The `migration_risk_scores` table is no longer needed.

**Rationale:** Phase 09 analysis confirmed the `engine.migration_risk_scores` table DDL was never executed and the table does not exist. The `risk_scoring.py` MAP CLI writer targets this non-existent table. The correct alternative is `engine.v_batch_risk_index` — a proposed view using FAIL=1, ERROR=2 risk methodology grouped by `batch_id`, which matches the API parameter and provides 100% relevance for the Risk Score tab.

**Cross-Reference:** `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row; `09_Risk_Score_Decision.md` → Decision 4; `09_Component_Source_Analysis.md` → New View: `v_batch_risk_index`

**SQL Definition:** See `09_Component_Source_Analysis.md` lines 179–268 (identical SQL also in `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index (PROPOSED)` row → `Proposed SQL` column)

**Files to update:**
- Create `engine.v_batch_risk_index` view in database
- Update `risk_scoring.py` to read from `engine.v_batch_risk_index` instead of `engine.migration_risk_scores`

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
| RESOLVED (approved decisions) | 8 |
| BLOCKED (pending investigation) | 0 |
| READY (can begin) | 8 |
| BLOCKED (waiting on B-06/B-07) | 0 |
| PENDING (validation) | 6 |
| NOT REQUIRED | 1 |
| **Total** | **24** |

---

**Document Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution
