# Data Quality Analysis

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 01_Source_Validation / 2_Data_Quality_Analysis

---

## Purpose

Assess source data quality across five dimensions to establish a baseline before migration.

## Quality Dimensions

| Dimension | Measures | Threshold |
|-----------|----------|-----------|
| **Completeness** | Null percentage per column, missing required fields | < 5% nulls for required columns |
| **Accuracy** | Value range checks, format validation, pattern conformance | ≥ 95% conforming values |
| **Consistency** | Cross-column and cross-table logical consistency | 0 contradictions for critical rules |
| **Timeliness** | Staleness of last-updated timestamps | Within business-defined freshness SLA |
| **Uniqueness** | Duplicate detection for key columns | 0 duplicates on primary keys |

## Rule Execution

- Quality rules are registered in the Rule Registry (04_Shared_Rule_Engine).
- Rules declare their `validation_mode = source`.
- Execution produces per-column quality scores that feed the Migration Certification (03_Migration_Validation).

## Integration

- Consumes `ColumnRegistry` from Doc 23 for column-level profiling targets.
- Consumes rule definitions from 04_Shared_Rule_Engine.
- Results recorded in the audit trail (Doc 21).
