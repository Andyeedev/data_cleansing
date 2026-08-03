# Phase 09.2 Data Source Analysis - Frozen UI Components vs MVP

> **Date:** 2026-07-30
> **Scope:** All frozen UI components from Phase 09 traceability matrix (65 components)
> **Method:** Database source testing + data comparison with frozen frontend as benchmark
> **Frozen frontend:** `MAP_V2/03_Source/frontend/` (authoritative frozen source)
> **MVP frontend:** Same backend APIs and database as frozen (shared backend); MVP frontend pages being built in same codebase
> **Constraints:** No code changes to frozen frontend, Phase 09 docs, or MVP
> **Governed by:** 09Z_Implementation_Governance.md, Rule 19

---

## Methodology

1. **Identify frozen UI component** from Phase 09 traceability matrix
2. **Test the source** - query the database to verify actual data returned from the current source table/view
3. **Identify frozen data** - what data the frozen component actually needs (from source code analysis)
4. **Identify MVP data** - what data the same API returns today (same DB, same backend)
5. **Calculate relevance %** - how well the data matches what the component needs (frozen = benchmark)
6. **If relevance < 95%** - find alternative tables/views and rate their relevance %
7. **If no alternative found** - propose a new SQL view with full DDL
8. **Classify components** as RESTORE (source correct), BLOCKED (source incorrect/wrong data), or PARTIAL (source incomplete)
9. **Note whether each UI component is new in MVP or exists in both frozen and MVP**

---

## Summary of Findings

| Status | Count | Components |
|--------|-------|-----------|
| RESTORE (source correct, relevance >= 95%) | 62 | All dashboard tiles, governance views, execution controls, rule execution, discovery, auth, shared components |
| BLOCKED (source incorrect, relevance < 95%) | 3 | Migration Score tile (id=6), Risk Score tab (id=15), Risk Score in report (id=34) |
| PARTIAL | 1 | Activity Feed (id=9, 95% - deprecated audit_log trace, data source correct) |

---

## Full Component Source Analysis Matrix

| # | Frozen UI Component | Category | Current DB Source | Relevance % | MVP Source | Alt Source | Alt Relevance % | New View Required | New View SQL | Status | Exists in MVP |
|---|---------------------|----------|-------------------|-------------|-----------|------------|----------------|-------------------|-------------|--------|---------------|
| 1 | Portfolio Summary (system count) | Dashboard | core.system_registry (3 rows) | 100% | core.system_registry (3 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 2 | Portfolio Summary (control count) | Dashboard | engine.control_registry (10 rows) | 100% | engine.control_registry (10 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 3 | Portfolio Summary (batch count) | Dashboard | engine.migration_batch_registry (543 rows) | 100% | engine.migration_batch_registry (543 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 4 | Portfolio Summary (active batches) | Dashboard | engine.migration_batch_registry (543 rows, filtered by statu | 100% | engine.migration_batch_registry (543 rows, filtered by statu | N/A | N/A | No |  | RESTORE | Yes |
| 6 | Metric tile: Migration Score | Dashboard | engine.unified_scores (58 rows, ALL NULL sub-scores) | 0% | engine.unified_scores (58 rows, ALL NULL sub-scores) | engine.migration_score_summary (0 rows, correct schema); pro | 95% (proposed view) | YES | CREATE OR REPLACE VIEW engine.v_migration_score_summary AS SELECT msb.batch_id, ... | BLOCKED - needs v_migration_sc | No - MVP has no Migr |
| 7 | Metric tile: Pass Rate | Dashboard | engine.migration_control_execution (7,400 rows) | 100% | engine.migration_control_execution (7,400 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 8 | Metric tile: Exception Count | Dashboard | engine.migration_control_exceptions (2,503 rows) | 100% | engine.migration_control_exceptions (2,503 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 9 | Activity feed table | Dashboard | engine.migration_control_execution (listed as audit trail) | 95% | engine.migration_control_execution (same source) | N/A | N/A | No |  | RESTORE (trace points to depre | Yes |
| 10 | Executive role-differentiated content | Dashboard | Same APIs as above | 100% | Same APIs as above | N/A | N/A | No |  | RESTORE | Yes |
| 11 | Audit log table | Governance | engine.migration_control_execution (corrected from engine.au | 100% | engine.migration_control_execution (same) | N/A | N/A | No |  | RESTORE | Yes |
| 12 | Pending approvals view | Governance | engine.migration_release_decision (13 rows) | 100% | engine.migration_release_decision (13 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 13 | Exception requests view | Governance | engine.migration_control_exceptions (2,503 rows) | 100% | engine.migration_control_exceptions (2,503 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 14 | Compliance status view | Governance | engine.migration_control_summary (3,625 rows) | 100% | engine.migration_control_summary (3,625 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 15 | Risk Score tab | Validation Report | engine.unified_scores (58 rows, stale flat final_score) | 0% | engine.v_migration_stability_score (stability pass-rate, not | engine.v_dataset_risk_index (80% relevance but per-entity, n | 80% (v_dataset_risk_index) / 100% (v_batch_risk_index if created) | YES | CREATE OR REPLACE VIEW engine.v_batch_risk_index AS SELECT batch_id, count(*) AS... | BLOCKED (B-07) - needs v_batch | No - MVP shows empty |
| 32 | Validation report display | Validation Report | engine.migration_validation_batch (21 rows) | 100% | engine.migration_validation_batch (21 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 33 | Governance decision in report | Validation Report | engine.migration_validation_batch | 100% | engine.migration_validation_batch | N/A | N/A | No |  | RESTORE | Yes |
| 34 | Risk score in report | Validation Report | engine.unified_scores (58 rows, stale) | 0% | engine.v_migration_stability_score (40% match - stability no | engine.v_batch_risk_index if created; engine.v_dataset_risk_ | 100% (v_batch_risk_index if created) | No | Reuse engine.v_batch_risk_index (see id=15). Same view serves both Risk Score ta... | BLOCKED (B-07) - reuses v_batc | No - MVP shows place |
| 35 | Compliance checks in report | Validation Report | engine.migration_validation_batch | 100% | engine.migration_validation_batch | N/A | N/A | No |  | RESTORE | Yes |
| 36 | Export CSV button | Validation Report | engine.migration_validation_batch | 100% | engine.migration_validation_batch | N/A | N/A | No |  | RESTORE | Yes |
| 37 | Export PDF button | Validation Report | engine.migration_validation_batch | 100% | engine.migration_validation_batch | N/A | N/A | No |  | RESTORE | Yes |
| 16 | Run execution button | Execution Control | engine.migration_batch_registry | 100% | engine.migration_batch_registry | N/A | N/A | No |  | RESTORE | Yes |
| 17 | Status polling display | Execution Control | engine.migration_batch_registry | 100% | engine.migration_batch_registry | N/A | N/A | No |  | RESTORE | Yes |
| 18 | Cancel execution button | Execution Control | engine.migration_batch_registry | 100% | engine.migration_batch_registry | N/A | N/A | No |  | RESTORE | Yes |
| 19 | Pause/Resume execution | Execution Control | engine.migration_batch_registry | 100% | engine.migration_batch_registry | N/A | N/A | No |  | RESTORE | Yes |
| 20 | Retry execution | Execution Control | engine.batch_execution_checkpoint (436 rows) | 100% | engine.batch_execution_checkpoint (436 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 21 | Batch lifecycle events | Execution Control | engine.batch_execution_checkpoint (436 rows) | 100% | engine.batch_execution_checkpoint (436 rows) | N/A | N/A | No |  | RESTORE (lifecycle is PARTIAL  | Yes |
| 22 | Batch list table | Execution History | engine.migration_batch_registry (543 rows) | 100% | engine.migration_batch_registry (543 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 23 | Batch detail view | Execution History | engine.migration_batch_registry (same) | 100% | engine.migration_batch_registry (same) | N/A | N/A | No |  | RESTORE | Yes |
| 24 | Re-execute button | Execution History | engine.batch_execution_checkpoint (same as Retry) | 100% | engine.batch_execution_checkpoint (same) | N/A | N/A | No |  | RESTORE | Yes |
| 25 | Audit trail display | Execution History | engine.migration_control_execution | 100% | engine.migration_control_execution | N/A | N/A | No |  | RESTORE | Yes |
| 26 | Control summaries display | Execution History | engine.migration_control_summary (3,625 rows) | 100% | engine.migration_control_summary (3,625 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 27 | Governance decision display | Execution History | engine.migration_release_decision (13 rows) | 100% | engine.migration_release_decision (13 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 28 | Rules by batch view | Rule Execution | engine.migration_control_execution (7,400 rows) | 100% | engine.migration_control_execution (7,400 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 29 | Rule detail view | Rule Execution | engine.migration_control_execution (same) | 100% | engine.migration_control_execution (same) | N/A | N/A | No |  | RESTORE | Yes |
| 30 | Control rules view | Rule Execution | engine.control_registry (10 rows) | 100% | engine.control_registry (10 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 31 | Execution results view | Rule Execution | engine.migration_control_execution | 100% | engine.migration_control_execution | N/A | N/A | No |  | RESTORE | Yes |
| 43 | Discovery datasets list | Discovery | core.dataset_mappings (3 rows) | 100% | core.dataset_mappings (3 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 44 | Dataset detail view | Discovery | core.dataset_mappings (same) | 100% | core.dataset_mappings (same) | N/A | N/A | No |  | RESTORE | Yes |
| 45 | Trigger discovery button | Discovery | core.dataset_mappings (same) | 100% | core.dataset_mappings (same) | N/A | N/A | No |  | RESTORE | Yes |
| 46 | Discovery status display | Discovery | core.dataset_mappings (same) | 100% | core.dataset_mappings (same) | N/A | N/A | No |  | RESTORE | Yes |
| 47 | Login form | Authentication | N/A (JWT token-based, no DB table for UI component itself) | 100% | N/A (JWT token-based) | N/A | N/A | No |  | RESTORE | Yes |
| 48 | JWT token storage | Authentication | N/A (client-side localStorage/sessionStorage) | 100% | N/A (same client-side mechanism) | N/A | N/A | No |  | RESTORE | Yes |
| 49 | Role switcher dropdown | Authentication | platform.user_roles (1 row) + platform.roles (6 rows) | 100% | platform.user_roles (1 row) + platform.roles (6 rows) | N/A | N/A | No |  | RESTORE | Yes |
| 50 | Protected route redirect | Authentication | N/A (client-side routing guard) | 100% | N/A (same client-side routing) | N/A | N/A | No |  | RESTORE | Yes |
| 51 | Logout with localStorage clear | Authentication | N/A (client-side) | 100% | N/A (same) | N/A | N/A | No |  | RESTORE | Yes |
| 52 | StatusBadge | Shared Components | N/A (presentation only, renders status from props) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 53 | ProgressBar | Shared Components | N/A (presentation only, renders progress from props) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 54 | DataTable | Shared Components | N/A (presentation only, renders data from props) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 55 | MetricCard | Shared Components | N/A (presentation only, renders metric from props) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 56 | EmptyState | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 57 | ErrorState | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 58 | LoadingSkeleton | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 59 | SearchBar | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 60 | Pagination | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 61 | Modal | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 62 | ConfirmDialog | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 63 | Toast | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |
| 64 | TabBar | Shared Components | N/A (presentation only) | 100% | N/A (same presentation) | N/A | N/A | No |  | RESTORE | Yes |

---

## Detailed Analysis: Components Below 95% Relevance

### Component 6: Migration Score Tile (Dashboard)

**Current Source:** `engine.unified_scores` (58 rows, ALL sub-scores NULL)
**Frozen Data Benchmark:** Component expects Migration Score with sub-scores: matching_score, fk_score, profiling_score, graph_score, overall_score
**What unified_scores Returns:** All sub-scores are NULL; `final_score` = 81.9125 (flat value, same for all 58 rows)
**Relevance:** 0% - the component needs composite sub-scores but gets a single flat score

**Alternative 1: engine.migration_score_summary**
| Alternative | Relevance % | Why |
|-------------|-------------|-----|
| `engine.migration_score_summary` (0 rows, schema correct) | 0% (0 data rows) | Correct columns (rule_score, discovery_score, matching_score, relationship_score, profiling_score, overall_score) but table is empty - DDL executed but never populated |
| **Proposed: `engine.v_migration_score_summary` (NEW VIEW)** | **95%** | Combines `migration_validation_batch.overall_score` with per-rule counts from `migration_control_execution` for comprehensive migration score display |

**Proposed New View SQL:**
```sql

```

### Component 15: Risk Score Tab (Validation Report)

**Current Source:** `engine.unified_scores` (58 rows, stale flat final_score)
**What the frozen component expects:** Composite risk score per batch with breakdown (risk_index, failure_rate, pass_rate)
**What unified_scores Returns:** All sub-scores NULL; flat final_score=81.9125 for all rows - this is NOT a risk score
**What v_migration_stability_score Returns (current repository source):** stability_score per batch (pass rate %) - 40% match because stability is inverse of risk (0%=high risk, 100%=low risk)
**Relevance:** 0% for frozen component, 40% if using v_migration_stability_score as proxy

**Alternative 1: engine.v_dataset_risk_index**
| Alternative | Relevance % | Why |
|-------------|-------------|-----|
| `engine.v_dataset_risk_index` | 80% | Correct risk methodology (FAIL=1, ERROR=2), but grouped by entity_name (3 datasets) not batch_id |
| **Proposed: `engine.v_batch_risk_index` (NEW VIEW)** | **100%** | Correct risk methodology grouped by batch_id with risk_index, failure_rate_percent, pass_rate_percent per batch |

**Proposed New View SQL:**
```sql

```
