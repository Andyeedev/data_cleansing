# PHASE 08 IMPLEMENTATION PLAN
## Repository Reference Resolution & Governance Integration

**Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution

---

## Objective

Resolve all incorrect repository references, integrate governance layers, and restore full runtime functionality to Phase 07–07.10.1 endpoints.

---

## Scope

### In Scope

| Item | Description |
|------|-------------|
| Incorrect repository references | 5 resolved, 2 blocked for investigation |
| Governance integration | Two independent governance layers |
| KPI endpoint restoration | 3 endpoints with approved mappings |
| Silent exception handling | 6 service methods masking errors |
| `engine.tenants` duplication | Resolved — keep `core.tenants` |

### Out of Scope

| Item | Description |
|------|-------------|
| New features | No new functionality |
| Performance optimization | Not in Phase 08 |
| UI changes | Frontend unchanged |
| Database schema changes | Only if architectural decision requires |
| B-06, B-07 investigation | Pending further analysis |

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

### BLOCKED — Pending Investigation

| ID | Reference | Status | Issue |
|----|-----------|--------|-------|
| B-06 | `engine.migration_batch_lifecycle` | BLOCKED | Table does not exist, need more info on how it came about |
| B-07 | `engine.migration_risk_scores` | BLOCKED | Table does not exist, need more info on how it came about |

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
| `ExecutionControlRepository` | `engine.migration_batch_lifecycle` | **BLOCKED** — B-06 |
| `ValidationReportRepository` | `engine.migration_risk_scores` | **BLOCKED** — B-07 |

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

| Task | Owner | Status |
|------|-------|--------|
| Review all 8 incorrect references | Architect | **COMPLETE** |
| Decide on each table mapping | Architect | **COMPLETE** (6 resolved, 2 blocked) |
| Document decisions in Architecture Decision Record | Architect | **COMPLETE** |

### Phase 08.2 — Repository Fixes

| Task | Owner | Status |
|------|-------|--------|
| Verify each `DashboardRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | Developer | Ready |
| Verify each `GovernanceRepository` query can be reproduced against the approved replacement table. If not, produce an incompatibility report instead of modifying the repository. | Developer | Ready |
| Verify `ExecutionControlRepository` reference (1 reference) | Developer | **BLOCKED** — B-06 |
| Verify `ValidationReportRepository` reference (1 reference) | Developer | **BLOCKED** — B-07 |

### Phase 08.3 — Service Layer Fixes

| Task | Owner | Status |
|------|-------|--------|
| Remove silent exception handling in `DashboardService` | Developer | Ready |
| Remove silent exception handling in `GovernanceService` | Developer | Ready |
| Add proper error propagation | Developer | Ready |

### Phase 08.4 — Governance Integration

| Task | Owner | Status |
|------|-------|--------|
| Decide on governance layer unification | Architect | Ready |
| Integrate v1.9 governance with new API governance | Developer | Ready |
| Update `app/governance/` module if needed | Developer | Ready |

### Phase 08.5 — Validation

| Task | Owner | Status |
|------|-------|--------|
| Re-run backend tests | Developer | Pending |
| Re-run frontend tests | Developer | Pending |
| Re-run E2E verification | Developer | Pending |
| Re-run runtime lineage audit | Developer | Pending |
| Verify KPI endpoints | Developer | Pending |

---

## Dependencies

| Dependency | Phase | Status |
|------------|-------|--------|
| Architectural decisions on table mappings | 08.1 | **COMPLETE** (6/8 resolved) |
| Phase 07 approval and freeze | Pre-08 | **COMPLETE** |
| B-06 investigation | 08.2 | BLOCKED |
| B-07 investigation | 08.2 | BLOCKED |

---

## Risks

| Risk | Mitigation |
|------|------------|
| B-06/B-07 may require database changes | Investigate before deciding |
| Fixes may break existing functionality | Run full test suite after each change |
| Governance integration may be complex | Start with minimal integration |
| Silent exception handling removal may expose errors | Add proper error handling first |

---

## Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| 6 incorrect references resolved | No references to non-existent tables (except B-06, B-07) |
| KPI endpoints functional | `GET /dashboard/portfolio`, `/kpis`, `/activity` return data |
| Governance endpoints functional | `GET /governance/audit`, `/approvals`, `/exceptions` return data |
| All tests pass | 195 backend + 248 frontend |
| No silent exception handling | Service layer propagates errors |

---

**Document Generated:** 2026-07-24
**Status:** APPROVED — Ready for Execution
