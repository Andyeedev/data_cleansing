# Phase 08A — Risk Score Decision

> **Date:** 2026-07-30
> **Status:** INVESTIGATED — Awaiting Evidence — Do Not Implement
> **Governed by:** Rule 19 (No old schema), 09Z_Implementation_Governance.md

---

## Cross-Reference

| Item | Authoritative Source | Related Docs |
|------|---------------------|--------------|
| `engine.migration_risk_scores` (BLOCKED) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row | `Phase_08_Implementation_Plan.md` → B-07; `Execution_Backlog.md` → FB-07, FB-08; `08AA_Frozen_Frontend_Gap_Analysis.md` → Blocked Items Resolution |
| `engine.v_batch_risk_index` (PROPOSED replacement) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index (PROPOSED)` row; `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Unified Gap Analysis` tab → `RiskGovernance` row | `09_Component_Source_Analysis.md` → New View: `v_batch_risk_index`; `Phase_08_Implementation_Plan.md` → Phase 08B tasks |
| `engine.migration_batch_lifecycle` (BLOCKED) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row | `Phase_08_Implementation_Plan.md` → B-06; `Execution_Backlog.md` → B-06; `09_1_Implementation_Plan.md` → Lifecycle Events row |
| `engine.batch_execution_checkpoint` (partial alternative) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab | `09_1_Implementation_Plan.md` → Lifecycle Events row |
| `engine.unified_scores` (DEPRECATED) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab | `09_1_Implementation_Plan.md`; `Phase_08_Table_Inventory.md` |

---

## Decision

The engine.unified_scores table is **DEPRECATED and INVALID** as a risk score source.
Implementation of the Risk Score feature is **BLOCKED** until evidence is collected for the correct data source.

---

## Evidence Collected

### 1. engine.unified_scores (DEPRECATED � Rejected)

| Property | Value |
|----------|-------|
| Type | BASE TABLE |
| Rows | 58 (stagnant, last updated April 2026) |
| Sub-scores | ALL NULL (matching_score, fk_score, profiling_score, graph_score) |
| final_score | Flat 81.9125 for ALL 58 rows |
| MAP CLI Writer | NONE (no Python INSERT traceable) |
| Rule 19 Status | VIOLATED � listed in prohibited tables |
| Relevance for Risk Score | **0%** � NOT a risk scoring methodology |

**Verdict:** Rejected. This table is a stale placeholder with no data, no writer, no MAP CLI trace.

### 2. engine.v_migration_stability_score (Current Repository Source � Partial)

| Property | Value |
|----------|-------|
| Type | VIEW |
| Rows | 451 (active) |
| Metrics | batch_id, total_rules, passed_rules, stability_score (pass rate %) |
| Scoring Methodology | Pass rate: (passed / total) * 100 |
| Risk Methodology | NO � stability is INVERSE of risk (high stability = low risk) |
| Per-entity breakdown | NO � per-batch only |
| MAP CLI Writer | Indirect � reads from migration_control_execution |
| Relevance for Risk Score | **40%** � stability % has correct per-batch granularity but wrong methodology |

**Verdict:** Partial � correct granularity but uses stability scoring (inverse of risk), not the risk scoring methodology (FAIL=1, ERROR=2 weighting) that the Risk Score tab needs.

### 3. engine.v_dataset_risk_index (Alternative � Partial Match)

| Property | Value |
|----------|-------|
| Type | VIEW |
| Rows | 3 (per dataset) |
| Metrics | entity_name, total_rules, risk_points, risk_index |
| Scoring Methodology | FAIL=1, ERROR=2 (correct risk methodology) |
| Per-batch granularity | NO � per-entity (3 datasets only) |
| API Parameter Match | NO � API takes batch_id, not entity_name |
| Relevance for Risk Score | **80%** � correct methodology but wrong grouping dimension |

**Verdict:** Good methodology but wrong granularity.

### 4. engine.v_batch_risk_index (PROPOSED New View)

| Property | Value |
|----------|-------|
| Type | PROPOSED VIEW (not yet created in DB) |
| Metrics | batch_id, total_rules, risk_points, risk_index, failure_rate_percent, pass_rate_percent |
| Scoring Methodology | FAIL=1, ERROR=2 (correct risk methodology) |
| Per-batch granularity | YES � grouped by batch_id |
| API Parameter Match | YES � matches batch_id parameter |
| Relevance for Risk Score | **100%** � correct per-batch risk scoring |

**Verdict:** Best candidate. Proposed SQL definition in 09_Component_Source_Analysis.md.

### 5. engine.migration_risk_scores (Target Table � Does Not Exist)

| Property | Value |
|----------|-------|
| Type | TABLE (DDL never executed) |
| Rows | N/A � table does not exist |
| MAP CLI Writer | risk_scoring.py line 29 (INSERT into this table) |
| Rule 19 Status | BLOCKED � Phase 08 B-06 |
| Relevance for Risk Score | **0%** � table does not exist |

**Verdict:** Blocked by Phase 08 B-06. Cannot populate data until DDL is executed.

---

## Summary

| Source | Relevance | Status |
|--------|-----------|--------|
| engine.unified_scores | 0% | REJECTED � deprecated, stale, no writer |
| v_migration_stability_score | 40% | PARTIAL � stability % not risk score |
| v_dataset_risk_index | 80% | PARTIAL � correct methodology, wrong grouping |
| v_batch_risk_index (proposed) | 100% | **CREATED** — 506 batches, FAIL=1/ERROR=2 methodology |
| migration_risk_scores (table) | 0% | RESOLVED — replaced by v_batch_risk_index view, table no longer needed |

---

## Decision: Risk Score Implementation Unblocked

**Rationale:**
1. The current code reads from v_migration_stability_score (stability %, not risk score) — semantically wrong
2. engine.unified_scores is deprecated with no data — rejected
3. No existing view provides correct risk scoring at the batch_id granularity needed
4. **`engine.v_batch_risk_index` view has been created in the DB** — 506 batches, FAIL=1/ERROR=2 methodology
5. The MAP CLI writer (risk_scoring.py) should read from `engine.v_batch_risk_index` instead of `engine.migration_risk_scores`

**Action Required:**
1. ✅ `engine.v_batch_risk_index` view created in DB (2026-08-01)
2. Wire Risk Score tab in ReportsPage and GovernancePage to `engine.v_batch_risk_index`
3. Update `risk_scoring.py` to read from `engine.v_batch_risk_index` instead of `engine.migration_risk_scores`
4. Assign Evidence ID DL-001 after runtime verification

**Evidence ID:** DL-001 (pending assignment after runtime verification)

---

*This document is analysis only. No code changes were made. No frontend implementation of Risk Score should proceed until evidence is collected.*
