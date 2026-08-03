# Phase 09.1 — Frozen vs MVP Component Source Analysis

> **Date:** 2026-07-30
> **Scope:** All frozen UI components in traceability matrix
> **Method:** Database source testing + data comparison
> **Constraint:** No code changes to frozen frontend or MVP
> **Frozen frontend:** `MAP_V2/03_Source/frontend/`
> **MVP frontend:** `MAP_V2/03_Source/frontend-mvp/`
> **Both frontends share the same backend APIs and database**

---

## Methodology

For each frozen UI component:
1. **Frozen source** = database table/view the traceability matrix says the frozen component reads from
2. **Frozen data** = actual data returned by that source (queried live from database)
3. **MVP source** = same backend API endpoint — MVP serves the same database, so the source is identical unless the backend has been modified
4. **MVP data** = same data (same DB, same queries)
5. **Relevance %** = how well the data from the frozen source matches what the frozen component actually needs to display
6. **Alternatives** = other views/tables that could serve as more relevant sources
7. **New view** = SQL definition for a new view if no existing alternative is sufficient

---

## Summary: All Components with Source Issues

Only 3 components in the traceability matrix have data source problems. The other 68 are already verified and RESTORE'd.

| # | Frozen Component | Category | Current Source | Issue | Relevance % | Alternative Source | Alt Relevance % | New View Required |
|---|-----------------|----------|---------------|-------|-------------|-------------------|----------------|-------------------|
| 1 | Migration Score tile | Dashboard | `engine.unified_scores` | All sub-scores NULL, flat final_score=81.9125 | **0%** | `engine.migration_score_summary` | **0%** (0 rows) | **YES — `v_migration_score_summary`** |
| 2 | Risk Score tab | Validation Report | `engine.unified_scores` | Same stale table, not a risk score at all | **0%** | `engine.v_migration_stability_score` | **40%** (stability ≠ risk) | **YES — `v_batch_risk_index`** |
| 3 | Activity Feed | Dashboard | `engine.migration_control_execution` | Data is available but trace points to deprecated `engine.audit_log` | **95%** | `engine.migration_control_execution` | **95%** | No |

---

## Detailed Analysis: Component 1 — Migration Score Tile

### Frozen Source: `engine.unified_scores`

**What the frozen component expects:**
- Migration Score for a batch — should be a composite score with sub-scores (matching, FK, profiling, graph)
- Displayed as a metric tile on the Dashboard

**What `engine.unified_scores` actually returns:**

| batch_id | matching_score | fk_score | profiling_score | graph_score | final_score | created_at |
|----------|---------------|----------|----------------|-------------|-------------|------------|
| 88742b02... | NULL | NULL | NULL | NULL | 81.9125 | 2026-04-11 |
| 2fb8b86e... | NULL | NULL | NULL | NULL | 81.9125 | 2026-04-12 |

- 58 rows, ALL with identical `final_score=81.9125`
- ALL sub-scores (`matching_score`, `fk_score`, `profiling_score`, `graph_score`) are NULL
- Last populated April 2026 — no writer has updated it since
- No MAP CLI INSERT trace
- This is a **stale placeholder table**, not a live data source

**Relevance %: 0%** — The table has no meaningful data. All sub-scores are NULL and final_score is flat across all rows.

### MVP Source: Same backend (same `engine.unified_scores`)

The MVP serves the same API endpoint (`GET /api/v1/dashboard/portfolio`) which reads from the same `engine.unified_scores`. Since `engine.unified_scores` is the same stale table, the MVP returns the identical 0%-quality data.

**MVP Relevance %: 0%** — Same problem as frozen source.

### Existing Alternatives

| Alternative | Columns | Rows | Relevance % | Why |
|-------------|---------|------|-------------|-----|
| `engine.migration_score_summary` | `batch_id, project_id, rule_score, discovery_score, matching_score, relationship_score, profiling_score, overall_score` | **0** | **0% (empty)** | Has exactly the right schema (per-batch, per-score-type breakdown) but DDL was never populated — it's an empty shell |
| `engine.migration_score_details` | `batch_id, score_type, entity_name, score, confidence, metadata` | **0** | **0% (empty)** | Same issue — correct schema but no data |
| `engine.v_migration_score_trend` | `batch_id, execution_start, overall_status, overall_score, rolling_5_batch_avg` | 200+ | **70%** | Has per-batch `overall_score` and trend data, but misses sub-score breakdown (matching, FK, profiling, graph) |
| `engine.v_migration_health_dashboard` | `batch_id, project_id, batch_start_time, total_controls, completion_percent, migration_status` | 550 | **30%** | Has completion percentage and status but no score breakdown |
| `engine.v_migration_stability_score` | `batch_id, total_rules, passed_rules, stability_score` | 451 | **25%** | Has pass rate per batch but no risk/composite scoring |
| `engine.migration_validation_batch` | `batch_id, execution_start, execution_end, overall_status, overall_score, project_id` | 21 | **60%** | Has per-batch `overall_score` but only 21 rows (limited batch history) |

### Verdict for Migration Score

**No existing view is sufficient.** `migration_score_summary` has the exact schema needed but 0 rows. `v_migration_score_trend` has data but only `overall_score` — no sub-score breakdown. A new view is required.

### New View: `v_migration_score_summary`

```sql
CREATE OR REPLACE VIEW engine.v_migration_score_summary AS
SELECT
    msb.batch_id,
    msb.execution_start,
    msb.execution_end,
    msb.overall_status,
    msb.overall_score,
    msb.project_id,
    mce.total_rules,
    SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END) AS passed_rules,
    SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 ELSE 0 END) AS failed_rules,
    SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END) AS error_rules,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1
                  WHEN mce.execution_status = 'ERROR' THEN 2
                  ELSE 0 END))::numeric / NULLIF(count(*), 0), 2
    ) AS risk_index,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric
        / NULLIF(count(*), 0) * 100, 2
    ) AS pass_rate_percent
FROM engine.migration_validation_batch msb
LEFT JOIN engine.migration_control_execution mce
    ON msb.batch_id = mce.batch_id
WHERE msb.batch_id IS NOT NULL
GROUP BY msb.batch_id, msb.execution_start, msb.execution_end,
    msb.overall_status, msb.overall_score, msb.project_id, mce.total_rules
ORDER BY msb.execution_start DESC;
```

This view combines `migration_validation_batch` (has `overall_score`, `overall_status`, `project_id`) with `migration_control_execution` (has per-rule pass/fail/error status) to produce a comprehensive per-batch score summary including both the composite score and the sub-metrics.

---

## Detailed Analysis: Component 2 — Risk Score Tab

### Frozen Source: `engine.unified_scores`

**What the frozen component expects:**
- Risk Score per batch — should be a risk metric that reflects FAIL/ERROR counts
- Displayed in the Validation Report page → Risk Score tab
- API: `GET /api/v1/execution/{batch_id}/risk-score`

**What `engine.unified_scores` actually returns:**
- Same stale table as Migration Score — 58 rows, all NULL sub-scores, flat final_score=81.9125
- This is NOT a risk score — it's a migration score placeholder that has been incorrectly referenced

**Relevance %: 0%** — The table has no risk scoring methodology and no per-batch data.

### Current Repository Source (discovered via code trace)

**What the repository actually reads:** `engine.v_migration_stability_score`

| batch_id | total_rules | passed_rules | stability_score |
|----------|-------------|-------------|-----------------|
| fe4d7059... | 20 | 0 | 0.00 |
| fddb7eb0... | 19 | 17 | 89.47 |
| fcf285e0... | 7 | 7 | 100.00 |

- `stability_score` = `(passed_rules / total_rules) * 100` — a pass rate percentage
- This is a **stability metric**, not a **risk metric**
- High stability = LOW risk, but the UI label says "Risk Score" — the semantics are inverted
- Stability score does NOT use risk scoring methodology (FAIL=1, ERROR=2 weighting)
- It does NOT give per-entity breakdown (only per-batch)

**Relevance % for Risk Score: 40%** — Pass rate is the inverse of risk but uses wrong methodology.

### MVP Source: Same backend (same `v_migration_stability_score`)

The MVP serves the same API endpoint which now correctly reads from `v_migration_stability_score`. But since this is a stability score (not a risk score), the MVP data display is also semantically wrong.

**MVP Relevance %: 40%** — Same as frozen source (both read from the same view).

### Existing Alternatives

| Alternative | Columns | Rows | Relevance % | Why |
|-------------|---------|------|-------------|-----|
| `engine.v_dataset_risk_index` | `entity_name, total_rules, risk_points, risk_index` | 3 | **80%** | Uses correct risk scoring (FAIL=1, ERROR=2), has `risk_index` column, but groups by entity not batch |
| `engine.v_dataset_risk_heatmap` | `dataset_name, total_rules_executed, failed_rules, failure_rate_percent` | 3 | **60%** | Has per-entity failure rate, but lacks risk scoring methodology |
| `engine.v_batch_governance_summary` | `batch_id, total_rules, passed, failed, errors` | 451 | **75%** | Has per-batch fail/error counts but doesn't compute a risk index |
| `engine.v_migration_score_trend` | `batch_id, overall_score, rolling_5_batch_avg` | 200+ | **55%** | Has per-batch score but not a risk score |
| `engine.migration_score_summary` | 0 rows | **0%** | Empty — no data |
| `engine.migration_risk_scores` (table) | `batch_id, batch_id, risk_score, risk_level` | **0** (DDL never executed) | **0%** (table doesn't exist) | Has correct schema but never populated |
| `engine.migration_control_execution` (raw) | `batch_id, rule_id, entity_name, execution_status` | 7400 | **85%** | Raw data — has everything needed to compute risk score but no pre-computed risk metric |

### Verdict for Risk Score

**The best alternative is `v_dataset_risk_index` (80% relevant)** — it uses the correct risk scoring methodology (FAIL=1, ERROR=2) and produces a `risk_index` on a 0–1 scale. However, it's per-entity not per-batch.

**A new view is required** for per-batch risk scoring, since the API takes a `batch_id` parameter.

### New View: `v_batch_risk_index`

```sql
CREATE OR REPLACE VIEW engine.v_batch_risk_index AS
SELECT
    batch_id,
    count(*) AS total_rules,
    sum(CASE WHEN execution_status = 'PASS' THEN 0
             WHEN execution_status = 'FAIL' THEN 1
             WHEN execution_status = 'ERROR' THEN 2
             ELSE NULL::integer END) AS risk_points,
    round(
        (sum(CASE WHEN execution_status = 'PASS' THEN 0
                  WHEN execution_status = 'FAIL' THEN 1
                  WHEN execution_status = 'ERROR' THEN 2
                  ELSE NULL::integer END))::numeric / count(*), 2
    ) AS risk_index,
    round(
        (sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric
        / count(*) * 100, 2
    ) AS failure_rate_percent,
    round(
        (sum(CASE WHEN execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric
        / NULLIF(count(*), 0) * 100, 2
    ) AS pass_rate_percent
FROM engine.migration_control_execution
WHERE batch_id IS NOT NULL
GROUP BY batch_id
ORDER BY risk_index DESC;
```

This view computes per-batch risk metrics including:
- `risk_index` (0.0–2.0 scale: PASS=0, FAIL=1, ERROR=2) — matches existing `v_dataset_risk_index` methodology
- `risk_points` (raw weighted sum)
- `failure_rate_percent` (alternate risk metric: % of FAIL+ERROR)
- `pass_rate_percent` (complementary stability metric)

This replaces the incorrect `engine.unified_scores` reference and provides the correct data structure for the Risk Score tab.

---

## Detailed Analysis: Component 3 — Activity Feed

### Frozen Source: `engine.audit_log` / `audit.audit_events` (DEPRECATED)

**What the frozen component expects:**
- Recent execution activity — PASS/FAIL/ERROR events
- Displayed as a table in the Dashboard

**Problem:** Both `engine.audit_log` and `audit.audit_events` are deprecated per Rule 19. They are not populated by MAP CLI.

### Correct Source: `engine.migration_control_execution`

**What it actually returns:**
- 7400 rows of per-rule execution status (PASS, FAIL, ERROR) per entity
- Columns include: `batch_id, rule_id, entity_name, execution_status, execution_time_seconds, created_at`

**Relevance %: 95%** — The data contains exactly what an activity feed needs (recent execution events with status). The only issue is the traceability matrix still references the deprecated table names.

### MVP Source: Same — `engine.migration_control_execution`

The MVP already reads from `engine.migration_control_execution` for the activity feed. This is correct.

**MVP Relevance %: 95%** — Same as frozen source (already correct in the MVP).

### No new view required — the existing `migration_control_execution` table is the correct source.

---

## Cross-Reference

| Item | Authoritative Source | Related Docs |
|------|---------------------|--------------|
| `engine.v_batch_risk_index` (proposed new view) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index (PROPOSED)` row → `Proposed SQL` column | `09_Risk_Score_Decision.md` → Decision 4; `Phase_08_Implementation_Plan.md` → Phase 08B tasks; `Execution_Backlog.md` → FB-07 |
| `engine.migration_risk_scores` (BLOCKED, replaced by view) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab | `09_Risk_Score_Decision.md` → Decision 5; `Phase_08_Implementation_Plan.md` → B-07; `Execution_Backlog.md` → FB-08 |
| `engine.migration_batch_lifecycle` (BLOCKED, replaced by checkpoint) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab | `09_Risk_Score_Decision.md`; `Phase_08_Implementation_Plan.md` → B-06; `Execution_Backlog.md` → B-06 |
| `engine.batch_execution_checkpoint` (partial alternative) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab | `09_1_Implementation_Plan.md` → Lifecycle Events row |
| `engine.unified_scores` (DEPRECATED) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab | `09_Risk_Score_Decision.md` → Decision 1; `09_1_Implementation_Plan.md` |

---

## New Views Summary (Analysis Only — No Code Changes)

### View 1: `engine.v_batch_risk_index`

**Purpose:** Per-batch risk scoring replacing the incorrect `engine.unified_scores` reference for the Risk Score tab.

**SQL:**
```sql
CREATE OR REPLACE VIEW engine.v_batch_risk_index AS
SELECT
    batch_id,
    count(*) AS total_rules,
    sum(CASE WHEN execution_status = 'PASS' THEN 0
             WHEN execution_status = 'FAIL' THEN 1
             WHEN execution_status = 'ERROR' THEN 2
             ELSE NULL::integer END) AS risk_points,
    round(
        (sum(CASE WHEN execution_status = 'PASS' THEN 0
                  WHEN execution_status = 'FAIL' THEN 1
                  WHEN execution_status = 'ERROR' THEN 2
                  ELSE NULL::integer END))::numeric / count(*), 2
    ) AS risk_index,
    round(
        (sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric
        / count(*) * 100, 2
    ) AS failure_rate_percent,
    round(
        (sum(CASE WHEN execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric
        / NULLIF(count(*), 0) * 100, 2
    ) AS pass_rate_percent
FROM engine.migration_control_execution
WHERE batch_id IS NOT NULL
GROUP BY batch_id
ORDER BY risk_index DESC;
```

**Relevance for Risk Score: 100%** when used as the replacement for `engine.unified_scores`. This view is the correct source for per-batch risk scoring.

**Relevance for Migration Score: 40%** — It has risk metrics but no sub-score breakdown (matching, FK, profiling, graph) that the Migration Score tile needs.

### View 2: `engine.v_migration_score_summary`

**Purpose:** Comprehensive per-batch score summary for the Migration Score tile, combining validation batch data with control execution data.

**SQL:**
```sql
CREATE OR REPLACE VIEW engine.v_migration_score_summary AS
SELECT
    msb.batch_id,
    msb.execution_start,
    msb.execution_end,
    msb.overall_status,
    msb.overall_score,
    msb.project_id,
    COUNT(mce.rule_id) AS total_rules,
    SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END) AS passed_rules,
    SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 ELSE 0 END) AS failed_rules,
    SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END) AS error_rules,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1
                  WHEN mce.execution_status = 'ERROR' THEN 2
                  ELSE 0 END))::numeric / NULLIF(COUNT(*), 0), 2
    ) AS risk_index,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric
        / NULLIF(COUNT(*), 0) * 100, 2
    ) AS pass_rate_percent,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END))::numeric
        / NULLIF(COUNT(*), 0) * 100, 2
    ) AS error_rate_percent
FROM engine.migration_validation_batch msb
LEFT JOIN engine.migration_control_execution mce
    ON msb.batch_id = mce.batch_id
WHERE msb.batch_id IS NOT NULL
GROUP BY msb.batch_id, msb.execution_start, msb.execution_end,
    msb.overall_status, msb.overall_score, msb.project_id
ORDER BY msb.execution_start DESC;
```

**Relevance for Migration Score: 95%** — Combines `overall_score` from validation batch with per-rule pass/fail/error counts for comprehensive score display.

**Relevance for Risk Score: 60%** — Has `risk_index` but is per-validation-batch, not per-execution-batch. Limited to 21 rows vs 451 in the main execution table.

---

## Full Traceability Matrix: All Components (Frozen → MVP Source Comparison)

| # | Frozen Component | Category | Current DB Source | Relevance % | MVP Source | MVP Relevance % | Status |
|---|-----------------|----------|-------------------|-------------|-----------|----------------|--------|
| 1 | Portfolio Summary (system count) | Dashboard | `core.system_registry` (3 rows) | 100% | Same source | 100% | RESTORE |
| 2 | Portfolio Summary (control count) | Dashboard | `engine.control_registry` (10 rows) | 100% | Same source | 100% | RESTORE |
| 3 | Portfolio Summary (batch count) | Dashboard | `engine.migration_batch_registry` (543 rows) | 100% | Same source | 100% | RESTORE |
| 4 | **Migration Score tile** | Dashboard | **`engine.unified_scores` (58 rows, ALL NULL sub-scores)** | **0%** | **Same source** | **0%** | **BLOCKED — needs v_migration_score_summary** |
| 5 | Pass Rate KPI | Dashboard | `engine.migration_control_execution` (7400 rows) | 100% | Same source | 100% | RESTORE |
| 6 | Exception Count KPI | Dashboard | `engine.migration_control_exceptions` (2503 rows) | 100% | Same source | 100% | RESTORE |
| 7 | Activity feed | Dashboard | `engine.migration_control_execution` | 95% | Same source | 95% | RESTORE |
| 8 | Audit log | Governance | `engine.migration_control_execution` | 100% | Same source | 100% | RESTORE |
| 9 | Pending approvals | Governance | `engine.migration_release_decision` (13 rows) | 100% | Same source | 100% | RESTORE |
| 10 | Exception requests | Governance | `engine.migration_control_exceptions` (2503 rows) | 100% | Same source | 100% | RESTORE |
| 11 | Compliance status | Governance | `engine.migration_control_summary` (3688 rows) | 100% | Same source | 100% | RESTORE |
| 12 | **Risk Score tab** | Validation Report | **`engine.unified_scores` (stale, wrong)** | **0%** | **`v_migration_stability_score` (stability, not risk)** | **40%** | **BLOCKED — needs v_batch_risk_index** |
| 13 | Validation report display | Validation Report | `engine.migration_validation_batch` (21 rows) | 100% | Same source | 100% | RESTORE |
| 14 | Health monitor | Monitoring | N/A (runtime check) | N/A | N/A | N/A | RESTORE |
| 15 | Performance metrics | Monitoring | N/A (runtime) | N/A | N/A | N/A | RESTORE |
| 16 | Queue status | Monitoring | N/A (runtime) | N/A | N/A | N/A | RESTORE |
| 17 | Alerts | Monitoring | N/A (runtime) | N/A | N/A | N/A | RESTORE |
| 18 | Operational logs | Monitoring | N/A (runtime) | N/A | N/A | N/A | RESTORE |
| 19 | Discovery datasets | Discovery | `core.dataset_mappings` (3 rows) | 100% | Same source | 100% | RESTORE |
| 20 | Login form | Auth | N/A (JWT) | N/A | N/A | N/A | RESTORE |
| 21 | Role switcher | Auth | `platform.user_roles` (0) + `platform.roles` (6) | 100% | Same source | 100% | RESTORE |
| 22 | All shared components | Shared | N/A (presentation only) | N/A | N/A | N/A | RESTORE |

---

## Relevance Score Summary

| Source | Frozen Relevance % | MVP Relevance % | Notes |
|--------|-------------------|----------------|-------|
| `engine.unified_scores` | 0% | 0% | Stale, NULL sub-scores, flat final_score |
| `engine.v_migration_stability_score` | 40% | 40% | Stability (pass rate), not risk score |
| `engine.v_dataset_risk_index` | 80% | 80% | Correct risk methodology but per-entity, not per-batch |
| `engine.migration_control_execution` | 95% | 95% | Raw data, correct for activity feed |
| `engine.migration_batch_registry` | 100% | 100% | Correct for batch counts |
| `engine.migration_control_exceptions` | 100% | 100% | Correct for exception count |
| `engine.migration_release_decision` | 100% | 100% | Correct for approvals |
| `engine.migration_control_summary` | 100% | 100% | Correct for compliance |
| `core.system_registry` | 100% | 100% | Correct for system count |
| `engine.migration_score_summary` (existing table) | 0% (0 rows) | 0% (0 rows) | Correct schema but empty |
| `engine.migration_validation_batch` | 100% | 100% | Correct for validation report |
| **`v_batch_risk_index` (proposed new view)** | **100%** | **100%** | **Correct per-batch risk scoring** |
| **`v_migration_score_summary` (proposed new view)** | **95%** | **95%** | **Correct per-batch migration scoring** |

---

## Recommendations

1. **Create `engine.v_batch_risk_index`** — this is the single most impactful new view. It replaces the incorrect `engine.unified_scores` for the Risk Score tab and uses the correct risk scoring methodology (FAIL=1, ERROR=2). This should be the source traced in the backend traceability chain for DL-001.

2. **Create `engine.v_migration_score_summary`** — this provides a comprehensive per-batch score summary combining `migration_validation_batch` with `migration_control_execution`. It replaces the incorrect `engine.unified_scores` for the Migration Score tile. This should be the source traced for DL-002.

3. **Update `engine.migration_score_summary` and `engine.migration_score_details` DDL** — these tables have correct schemas but 0 rows. The DDL was executed but never populated. Either populate them from existing data or rely on the new views instead.

4. **Deprecate `engine.unified_scores` officially** — add to Rule 19's prohibited table list as a formal deprecation. This table has no writer, no MAP CLI trace, and all sub-scores are NULL.

5. **Update Phase 09 documents** — all 11 documents that reference `engine.unified_scores` as a risk/migration score source must be updated to reference the new views, each with their Evidence ID (DL-001 for risk score, DL-002 for migration score).

6. **No code changes to frozen frontend or MVP** — per constraint. All findings are analysis-only. The new views are database objects (CREATE VIEW) and can be deployed independently of any frontend code.

---

*This analysis contains no code modifications. All SQL is presented for review only. No files in MAP_V2/03_Source/frontend/ or MAP_V2/03_Source/frontend-mvp/ were modified.*
