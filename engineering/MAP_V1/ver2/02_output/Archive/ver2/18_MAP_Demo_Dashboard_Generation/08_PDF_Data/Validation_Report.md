# MAP Nexus™ — Validation Report

**Migration:** Customer Core Banking Migration
**Scenario:** Scenario 3 — MIXTURE
**Date:** 3 July 2026
**Controls Executed:** 10

---

## Control Summary

| Status | Count |
|--------|-------|
| Passed | 3 |
| Attention Required | 2 |
| Critical Issue | 4 |
| Disabled | 1 |

---

## Control Results

### C01 — Record Count Reconciliation
**Status:** PASSED
Source and target record counts match within 5% threshold.

### C02 — Schema Compliance Check
**Status:** ATTENTION_REQUIRED
Column type mismatches detected in 3 tables.

### C03 — Primary Key Integrity
**Status:** PASSED
All primary keys unique and non-null in source and target.

### C04 — Balance Reconciliation
**Status:** CRITICAL_ISSUE
Balance mismatch: source £2,847,193,862.16 vs target £2,847,193,862.16 — variance 0.00% but 342 records have precision differences.

### C05 — Null Value Check
**Status:** PASSED
No unexpected null values in required fields.

### C06 — Duplicate Detection
**Status:** ATTENTION_REQUIRED
12 potential duplicate records detected in target CUSTOMER table.

### C07 — Format Validation
**Status:** CRITICAL_ISSUE
Date format mismatch: source DD/MM/YYYY vs target YYYY-MM-DD.

### C08 — Reference Integrity
**Status:** CRITICAL_ISSUE
892 orphaned records in ACCOUNT_BALANCE with no matching ACCOUNTS record.

### C09 — Data Completeness
**Status:** PASSED
All required fields populated across all datasets.

### C10 — Permission Requirements
**Status:** CRITICAL_ISSUE
Read/write permissions required for target Finacle database — not yet provisioned.

---

## Findings Summary

| ID | Type | Severity | Owner | Status |
|----|------|----------|-------|--------|
| FND-001 | Schema Drift | Critical | Data Engineering | Open |
| FND-002 | Schema Drift | High | Data Engineering | Open |
| FND-003 | Balance Mismatch | Critical | Finance Team | Open |
| FND-004 | Duplicate Records | Medium | Data Quality | Open |
| FND-005 | Orphaned Records | Medium | Data Engineering | Open |
