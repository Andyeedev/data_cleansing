# PHASE 08 IMPLEMENTATION PLAN
## Repository Reference Resolution & Frontend MVP Implementation

**Generated:** 2026-07-24
**Last Updated:** 2026-07-31
**Status:** APPROVED — Phase 08A/B Complete, Phase 08C In Progress

---

## Objective

Resolve all incorrect repository references, integrate governance layers, restore full runtime functionality to Phase 07–07.10.1 endpoints, and implement the frontend MVP with real backend data connectivity.

---

## Scope

### In Scope

| Item | Description |
|------|-------------|
| Incorrect repository references | 8 resolved, 0 blocked |
| Governance integration | Two independent governance layers |
| KPI endpoint restoration | 3 endpoints with approved mappings |
| Silent exception handling | 6 service methods masking errors |
| `engine.tenants` duplication | Resolved — keep `core.tenants` |
| Frontend MVP — Phase 08B | All P1/P2 pages, workflows, theme, login features, navigation items, UI elements per 08AA |
| Scheduler subsystem | Full CRUD, MAP CLI runner, terminal output, calendar events, role-based filtering |
| Theme consistency | StatusBadge standardization, hardcoded color removal, table padding/font-size alignment |
| AccessDeniedPage | Exists and routed, ProtectedRoute redirect pending |

### Out of Scope

| Item | Description |
|------|-------------|
| New features beyond 08AA | No new functionality outside gap analysis |
| Performance optimization | Not in Phase 08 |
| P3/P4 enterprise features | Deferred per 08AA recommendations |
| AI/ML integration | Not in MVP scope |
| Database schema changes | Only if architectural decision requires (all B-06/B-07 resolved via Phase 09; v_batch_risk_index view created 2026-08-01) |
| B-06/B-07 investigation | Resolved via Phase 09 |

---

## Architectural Decisions (APPROVED)

| ID | Reference | Target Table | Rationale |
|----|-----------|--------------|-----------|
| B-01 | `engine.systems` | `core.system_registry` | Already exists, currently maintained manually |
| B-02 | `engine.controls` | `engine.control_registry` | Already exists, no need to create |
| B-03 | `engine.audit_log` | `audit.audit_events` | Already created |
| B-04 | `engine.approvals` | `platform.approval_requests` | Already created |
| B-05 | `engine.exceptions` | `engine.migration_control_exceptions` | Already created |
| B-08 | `engine.tenants` | `core.tenants` | Active table, keep, currently maintained manually |

| B-06 | `engine.migration_batch_lifecycle` | RESOLVED | Replaced by `engine.batch_execution_checkpoint` (partial). See `09_Risk_Score_Decision.md` and `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab |
| B-07 | `engine.migration_risk_scores` | RESOLVED | Replaced by `engine.v_batch_risk_index` view. See `09_Risk_Score_Decision.md` and `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab |

---

## Phase 08 Tasks

### 1. Repository Fixes (RESOLVED)

| File | Reference | Verification Required |
|------|-----------|----------------------|
| `DashboardRepository` | `engine.systems` | Verify `core.system_registry` schema and semantic equivalence |
| `DashboardRepository` | `engine.controls` | Verify `engine.control_registry` schema and semantic equivalence |
| `DashboardRepository` | `engine.audit_log` | Verify `audit.audit_events` schema and semantic equivalence |
| `GovernanceRepository` | `engine.audit_log` | Verify `audit.audit_events` schema and semantic equivalence |
| `GovernanceRepository` | `engine.approvals` | Verify `platform.approval_requests` schema and semantic equivalence |
| `GovernanceRepository` | `engine.exceptions` | Verify `engine.migration_control_exceptions` schema and semantic equivalence |
| `ExecutionControlRepository` | `engine.migration_batch_lifecycle` | **RESOLVED** — use `engine.batch_execution_checkpoint` (partial) | B-06 |
| `ValidationReportRepository` | `engine.migration_risk_scores` | **RESOLVED** — use `engine.v_batch_risk_index` view instead | B-07 |

### 2. Service Layer Fixes

| Class | Method | Fix |
|-------|--------|-----|
| `DashboardService` | `get_portfolio_summary` | Remove silent exception handling |
| `DashboardService` | `get_kpis` | Remove silent exception handling |
| `DashboardService` | `get_activity` | Remove silent exception handling |
| `GovernanceService` | `get_audit_log` | Remove silent exception handling |
| `GovernanceService` | `get_approvals` | Remove silent exception handling |
| `GovernanceService` | `get_exceptions` | Remove silent exception handling |

---

## Execution Order

### Phase 08.1 — Architectural Decisions

| Task | Owner | Status | Completed Date |
|------|-------|--------|----------------|
| Review all 8 incorrect references | Architect | **COMPLETE** | 2026-07-31 |
| Decide on each table mapping | Architect | **COMPLETE** (8/8 resolved) | 2026-07-31 |
| Document decisions in Architecture Decision Record | Architect | **COMPLETE** | 2026-07-31 |

### Phase 08.2 — Repository Fixes

| Task | Owner | Status | Completed Date |
|------|-------|--------|----------------|
| Verify each `DashboardRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | Developer | Ready | — |
| Verify each `GovernanceRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | Developer | Ready | — |
| Verify `ExecutionControlRepository` reference (1 reference) | Developer | **BLOCKED** — B-06 | — |
| Verify `ValidationReportRepository` reference (1 reference) | Developer | **BLOCKED** — B-07 | — |

### Phase 08.3 — Service Layer Fixes

| Task | Owner | Status | Completed Date |
|------|-------|--------|----------------|
| Remove silent exception handling in `DashboardService` | Developer | Ready | — |
| Remove silent exception handling in `GovernanceService` | Developer | Ready | — |
| Add proper error propagation | Developer | Ready | — |

### Phase 08.4 — Governance Integration

| Task | Owner | Status | Completed Date |
|------|-------|--------|----------------|
| Decide on governance layer unification | Architect | Ready | — |
| Integrate v1.9 governance with new API governance | Developer | Ready | — |
| Update `app/governance/` module if needed | Developer | Ready | — |

### Phase 08.5 — Validation

| Task | Owner | Status | Completed Date |
|------|-------|--------|----------------|
| Re-run backend tests | Developer | Pending | — |
| Re-run frontend tests | Developer | Pending | — |
| Re-run E2E verification | Developer | Pending | — |
| Re-run runtime lineage audit | Developer | Pending | — |
| Verify KPI endpoints | Developer | Pending | — |

### Phase 08B — Frontend MVP Implementation (per 08AA Gap Analysis)

| Task | Owner | Status | Completed Date | Evidence |
|------|-------|--------|----------------|----------|
| Implement MigrationProjectsPage | Developer | **COMPLETE** | 2026-07-31 | `src/routes/MigrationProjectsPage.tsx` — real API, tenant filter, StatusBadge |
| Implement MigrationDatasetsPage | Developer | **COMPLETE** | 2026-07-31 | `src/routes/MigrationDatasetsPage.tsx` — real API, tenant filter, StatusBadge |
| Implement MigrationSchedulesPage | Developer | **COMPLETE** | 2026-07-31 | `src/routes/MigrationSchedulesPage.tsx` — full CRUD, MAP CLI runner, terminal output, calendar events |
| Implement MigrationOverviewPage | Developer | **COMPLETE** | 2026-07-31 | `src/routes/MigrationOverviewPage.tsx` — real API, tenant filter, StatusBadge |
| Implement AccessDeniedPage | Developer | **COMPLETE** | 2026-07-31 | `src/routes/AccessDeniedPage.tsx` — routed at `/access-denied` |
| Fix ProtectedRoute redirect to `/access-denied` | Developer | **PENDING** | — | Currently shows inline message instead of redirecting |
| Implement `v_batch_risk_index` view | Developer | **COMPLETE** | 2026-08-01 | `engine.v_batch_risk_index` — 506 batches, FAIL=1/ERROR=2 methodology | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row |
| Implement `v_migration_score_summary` view | Developer | **COMPLETE** | 2026-08-01 | `engine.v_migration_score_summary` — 506 batches, pass rate methodology | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_migration_score_summary` row |
| Implement `migration_risk_scores` table | Developer | **RESOLVED** — replaced by `engine.v_batch_risk_index` view, table no longer needed | 2026-08-01 | `risk_scoring.py` INSERT target; view replaces table | `09_Risk_Score_Decision.md` → Decision 5 |
| Enhance DashboardPage with ExecutiveRisk, ExecutiveInsights, ExecutiveNotifications | Developer | **DEFERRED** — P2 | — | Components don't exist yet |
| Add Governance sub-pages for Policies, Regulatory Reporting | Developer | **DEFERRED** — P2 | — | Not in MVP scope |
| Enhance OperationsPage with failure details view | Developer | **DEFERRED** — P2 | — | Not in MVP scope |
| Add EnvironmentBanner | Developer | **DEFERRED** — P2 | — | Not in MVP scope |
| Wire Breadcrumb into page layout | Developer | **DEFERRED** — P2 | — | Component exists but not wired |
| Fix navigation role filtering (backend) | Developer | **PENDING** | — | `navigation_routes.py` returns unfiltered MOCK_NAV_ITEMS |
| Theme consistency fixes | Developer | **COMPLETE** | 2026-07-31 | StatusBadge standardization, hardcoded color removal, table padding/font-size alignment |
| Add `FAIL` mapping to StatusBadge | Developer | **COMPLETE** | 2026-07-31 | `src/components/shared/StatusBadge.tsx` |

---

## Dependencies

| Dependency | Phase | Status | Completed Date |
|------------|-------|--------|----------------|
| Architectural decisions on table mappings | 08.1 | **COMPLETE** (8/8 resolved) | 2026-07-31 |
| Phase 07 approval and freeze | Pre-08 | **COMPLETE** | 2026-07-31 |
| B-06 investigation | 08.2 | **RESOLVED** — use `engine.batch_execution_checkpoint` (partial) | 2026-07-31 |
| B-07 investigation | 08.2 | **RESOLVED** — create `engine.v_batch_risk_index` view | 2026-07-31 |
| Phase 08B frontend implementation | 08B | **IN PROGRESS** — 14/17 tasks complete | — |
| `v_batch_risk_index` view creation | 08B | **COMPLETE** | 2026-08-01 |
| `v_migration_score_summary` view creation | 08B | **COMPLETE** | 2026-08-01 |
| `migration_risk_scores` table creation | 08B | **RESOLVED** — replaced by `v_batch_risk_index` view, table no longer needed | 2026-08-01 |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Fixes may break existing functionality | Run full test suite after each change |
| Governance integration may be complex | Start with minimal integration |
| Silent exception handling removal may expose errors | Add proper error handling first |

---

## Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| 6 incorrect references resolved | No references to non-existent tables (B-06 resolved via batch_execution_checkpoint, B-07 resolved via v_batch_risk_index view) |
| KPI endpoints functional | `GET /dashboard/portfolio`, `/kpis`, `/activity` return data |
| Governance endpoints functional | `GET /governance/audit`, `/approvals`, `/exceptions` return data |
| All tests pass | 195 backend + 248 frontend |
| No silent exception handling | Service layer propagates errors |

---

**Document Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution
