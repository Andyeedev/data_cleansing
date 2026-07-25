# Source-Target Reconciliation

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 03_Migration_Validation / 1_Source_Target_Reconciliation

---

## Purpose

Compare source and target data after migration to confirm fidelity.

## Reconciliation Methods

| Method | Scope | Precision |
|--------|-------|-----------|
| **Row count** | Per table | Exact |
| **Column checksum** | Per column (hash-based) | Exact |
| **Aggregate comparison** | SUM, MIN, MAX, COUNT per numeric/date column | Exact |
| **Sample verification** | Random row sample with full-column comparison | Statistical (≥ 99.9% confidence) |
| **Distribution comparison** | Value frequency histograms per column | Statistical (χ² / KS test) |
| **Referential integrity** | FK relationships validated on target | Exact |

## Tolerance

- Exact methods: zero tolerance for differences.
- Statistical methods: configurable tolerance (default 0.01% variance).

## Integration

- Consumes source profiles from `01_Source_Validation/3_Data_Profiling.md`.
- Consumes target schema from Doc 23 (if target discovered).
- Results feed Certification (03_Migration_Validation/3_Certification.md).
- All reconciliation events logged to the audit trail (Doc 21).
