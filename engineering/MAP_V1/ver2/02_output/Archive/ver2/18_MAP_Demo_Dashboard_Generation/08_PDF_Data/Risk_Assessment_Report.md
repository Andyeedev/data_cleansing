# MAP Nexus™ — Risk Assessment Report

**Migration:** Customer Core Banking Migration
**Scenario:** Scenario 3 — MIXTURE
**Date:** 3 July 2026
**Overall Risk:** HIGH (58.3/100)

---

## Go / No-Go Decision

# NO-GO

Migration is currently blocked. Critical and high priority findings must be resolved before proceeding to pilot. 6 critical findings require immediate attention.

---

## Risk Score Breakdown

| Category | Score | Weight |
|----------|-------|--------|
| Schema Drift | 95/100 | 25% |
| Balance Reconciliation | 88/100 | 20% |
| Permission Provisioning | 82/100 | 20% |
| Data Completeness | 45/100 | 15% |
| Reference Integrity | 78/100 | 10% |
| Duplicate Detection | 35/100 | 10% |
| **Weighted Total** | **58.3/100** | |

---

## Top Risks

### R001 — Schema Drift
**Severity:** Critical
**Impact:** Data loss or corruption during migration
**Mitigation:** Implement comprehensive schema mapping and validation

### R002 — Balance Reconciliation Discrepancies
**Severity:** Critical
**Impact:** Financial data integrity compromised
**Mitigation:** Run balance reconciliation with precision handling

### R003 — Permission Provisioning Delays
**Severity:** Critical
**Impact:** Migration blocked — cannot access target system
**Mitigation:** Escalate permission request to infrastructure team

### R004 — Date Format Inconsistency
**Severity:** High
**Impact:** Downstream system failures
**Mitigation:** Standardise date format during ETL transformation

### R005 — Orphaned Foreign Key References
**Severity:** High
**Impact:** Referential integrity violated in target
**Mitigation:** Cleanse orphaned records before migration

### R006 — Duplicate Customer Records
**Severity:** Medium
**Impact:** Duplicate accounts in target system
**Mitigation:** Implement deduplication logic in ETL pipeline

---

## Risk Matrix

| Likelihood \ Impact | Negligible | Minor | Moderate | Major | Catastrophic |
|---------------------|------------|-------|----------|-------|--------------|
| Almost Certain | - | - | - | - | - |
| Likely | - | - | - | - | 6 |
| Possible | - | - | - | 10 | - |
| Unlikely | - | - | 4 | - | - |
| Rare | - | 3 | - | - | - |
