# Phase 09 — Cross-Reference Index

> **Purpose:** Single index for all blocked items, their resolutions, and the authoritative source for each piece of information.
> **Generated:** 2026-07-31
> **Governed by:** Rule 19 (No old schema)

---

## Blocked Items

### B-06: `engine.migration_batch_lifecycle`

| Property | Value |
|----------|-------|
| Block ID | B-06 |
| Affected Table | `engine.migration_batch_lifecycle` |
| Current Status | RESOLVED |
| Resolution | Use `engine.batch_execution_checkpoint` (partial match) |
| Authoritative Source | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row |
| Supporting Docs | `09_Risk_Score_Decision.md` → Decision 4; `09_1_Implementation_Plan.md` → Prohibited Table Names; `Phase_08_Implementation_Plan.md` → B-06; `Execution_Backlog.md` → B-06 |
| Frontend Impact | `LifecycleEvents` panel in `GovernancePage.tsx` — lifecycle events are partial (only `batch_id` + `last_completed_control` from `batch_execution_checkpoint`) |
| API Endpoint | `GET /api/v1/execution/{batch_id}/lifecycle` |
| Evidence ID | DL-005 (PARTIAL) |

### B-07: `engine.migration_risk_scores`

| Property | Value |
|----------|-------|
| Block ID | B-07 |
| Affected Table | `engine.migration_risk_scores` |
| Current Status | RESOLVED — replaced by `engine.v_batch_risk_index` view |
| Resolution | Create `engine.v_batch_risk_index` view instead of the table. The `migration_risk_scores` table is no longer needed. |
| Authoritative Source | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index (PROPOSED)` row → `Proposed SQL` column; `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Unified Gap Analysis` tab → `RiskGovernance` row |
| SQL Definition | `09_Component_Source_Analysis.md` → New View: `v_batch_risk_index` (lines 179–268) |
| Supporting Docs | `09_Risk_Score_Decision.md` → Decision 4 and Decision 5; `09_1_Implementation_Plan.md` → Prohibited Table Names; `Phase_08_Implementation_Plan.md` → B-07; `Execution_Backlog.md` → FB-07, FB-08 |
| Frontend Impact | `RiskGovernance.tsx` (Risk tab in `GovernancePage.tsx`); `RiskScoreReport` component in `ReportsPage.tsx` — both currently show "No risk data" |
| API Endpoint | `GET /api/v1/execution/{batch_id}/risk-score` (pending implementation) |
| Evidence ID | DL-001 (pending assignment after runtime verification) |

### Deprecated: `engine.unified_scores`

| Property | Value |
|----------|-------|
| Status | DEPRECATED |
| Reason | 58 stale rows, no Python INSERT, no MAP CLI writer, flat 81.9125 final_score for all rows |
| Replacement for Risk Scoring | `engine.v_batch_risk_index` (100% relevance) |
| Replacement for Entity-Level Risk | `engine.v_dataset_risk_index` (80% relevance) |
| Authoritative Source | `09_Risk_Score_Decision.md` → Decision 1; `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab |
| Supporting Docs | `09_1_Implementation_Plan.md`; `Phase_08_Table_Inventory.md` |

---

## Cross-Reference Map

### By Document

| Document | References This Index | Key Entries |
|----------|----------------------|-------------|
| `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab | Source of truth for view/table gap status and SQL definitions | `v_batch_risk_index` row, `v_migration_stability_score` row, `v_dataset_risk_index` row |
| `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Unified Gap Analysis` tab | Source of truth for component-level gap status | `RiskGovernance` row, `RiskScoreReport` row |
| `08AA_Frozen_Frontend_Gap_Analysis.md` | Cross-references this index in the Blocked Items Resolution section | B-06, B-07, `engine.unified_scores` |
| `Phase_08_Implementation_Plan.md` | Cross-references this index for B-06, B-07, FB-07, FB-08 | B-06, B-07, FB-07, FB-08 entries |
| `Execution_Backlog.md` | Cross-references this index for B-06, B-07, FB-07, FB-08 | B-06, B-07, FB-07, FB-08 entries |
| `09_Risk_Score_Decision.md` | Cross-references this index for all 5 decisions | Decisions 1–5 |
| `09_Component_Source_Analysis.md` | Cross-references this index for `v_batch_risk_index` SQL | New View: `v_batch_risk_index` |
| `09_1_Implementation_Plan.md` | Cross-references this index for Prohibited Table Names, Lifecycle Events, Deprecated Features | Prohibited Table Names table, Lifecycle Events row, Deprecated Features table |
| `09Z_Implementation_Governance.md` | Cross-references this index for table replacement decisions | Table replacement table |

### By Block ID

| Block ID | Item | Resolution Doc | Excel Source | Status |
|----------|------|---------------|--------------|--------|
| B-06 | `engine.migration_batch_lifecycle` | `09_Risk_Score_Decision.md` | `SQL Views & Relevance` tab | RESOLVED |
| B-07 | `engine.migration_risk_scores` | `09_Risk_Score_Decision.md` | `SQL Views & Relevance` tab + `Unified Gap Analysis` tab | RESOLVED |
| FB-07 | Implement `v_batch_risk_index` view | `09_Component_Source_Analysis.md` | `SQL Views & Relevance` tab | RESOLVED |
| FB-08 | Implement `migration_risk_scores` table | `09_Risk_Score_Decision.md` | `SQL Views & Relevance` tab | RESOLVED (replaced by view) |

### By Frontend Component

| Component | File | Blocked By | Resolution |
|-----------|------|-----------|------------|
| `RiskGovernance` | `portal/governance/RiskGovernance.tsx` | B-07 (`migration_risk_scores` missing) | Use `engine.v_batch_risk_index` view |
| `RiskScoreReport` | `portal/reporting/RiskScoreReport.tsx` | B-07 (`migration_risk_scores` missing) | Use `engine.v_batch_risk_index` view |
| `LifecycleEvents` | (GovernancePage lifecycle panel) | B-06 (`migration_batch_lifecycle` missing) | Use `engine.batch_execution_checkpoint` |

---

## How to Use This Index

1. **Find a blocked item** by Block ID (B-06, B-07, FB-07, FB-08) or table/view name
2. **Check the Authoritative Source** column to find the Excel file and tab
3. **Check the Supporting Docs** column to find the Phase 09 research files with detailed analysis
4. **Check the Frontend Impact** column to understand which UI components are affected
5. **Check the Resolution** column for the action required

---

*This index is the single cross-reference point for all blocked items in Phase 08/09. All other documents reference back to the authoritative Excel source (`08AA_Frozen_Frontend_Gap_Analysis.xlsx`) for gap status.*