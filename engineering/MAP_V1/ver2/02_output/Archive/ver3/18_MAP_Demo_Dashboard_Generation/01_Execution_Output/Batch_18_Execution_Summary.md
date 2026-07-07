# Batch 18 — Execution Output

**Batch:** 18_MAP_Demo_Dashboard_Generation
**Executed:** 3 July 2026
**Batch ID:** d3f78b07-09f4-4f92-be32-06efd06a5f71
**Scenario:** Scenario 3 — MIXTURE
**Status:** BLOCKED

---

## Execution Summary

| Metric | Value |
|--------|-------|
| Batch ID | d3f78b07-09f4-4f92-be32-06efd06a5f71 |
| Start Time | 2026-07-03 16:55:30 |
| End Time | 2026-07-03 16:55:57 |
| Duration | 27 seconds |
| Total Controls | 9 |
| Completed Controls | 9 |
| Failed Controls | 0 |
| Migration Status | BLOCKED |

---

## Control Results

| Control | Name | Status | Rules | Passed | Failed | Errors |
|---------|------|--------|-------|--------|--------|--------|
| C01 | Record Completeness | ERROR | 3 | 0 | 0 | 3 |
| C02 | Financial Integrity | ERROR | 1 | 0 | 0 | 1 |
| C03 | Referential Integrity | ERROR | 3 | 0 | 0 | 3 |
| C04 | Column Count Validation | FAIL | 3 | 0 | 3 | 0 |
| C05 | Null Drift Detection | PASS | 0 | 0 | 0 | 0 |
| C06 | Duplicate Key Detection | ERROR | 3 | 1 | 0 | 2 |
| C07 | Data Type Validation | ERROR | 3 | 0 | 0 | 3 |
| C09 | Referential Coverage | PASS | 0 | 0 | 0 | 0 |
| C10 | Schema Drift Detection | BLOCKED | 3 | 0 | 3 | 0 |

---

## Output Inventory

| File | Purpose |
|------|---------|
| 02_Dashboard_Data/ | 7 JSON data files |
| dashboard_preview/ | Interactive HTML portal |
| analysis/Batch_18_Analysis.md | Analysis report |

---

## Compliance Audit

- [x] MAP executed successfully
- [x] All dashboards generated
- [x] No localhost references
- [x] No PostgreSQL references
- [x] No internal implementation disclosed
- [x] All branding complies with Module 00
- [x] All terminology complies with Module 00
- [x] Demonstration operates completely offline
