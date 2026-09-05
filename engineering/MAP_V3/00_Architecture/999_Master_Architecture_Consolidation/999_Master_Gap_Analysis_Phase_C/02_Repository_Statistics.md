# 02_Repository_Statistics.md

# Repository Statistics — Extended Validation

### MAP Nexus Enterprise Architecture — Phase C Gap Analysis

---

## Document Counts

| Metric | Status | Evidence |
|--------|--------|----------|
| Total Architecture Documents | CONTRADICTED | Phase A Repository Inventory (01): 85. Phase B Master Repository Statistics (09): 85 total, 81 in layer breakdown. |
| Total Architecture Layers | VERIFIED | Phase A Repository Inventory (01): 8. Phase B Master Repository Statistics (09): 8. |
| Architecture Domains | CONTRADICTED | Phase A Repository Inventory (01): 9. Phase A Coverage Register (05): 30 assessed. |

---

## Layer Distribution

| Layer | Layer Name | Status | Evidence |
|-------|------------|--------|----------|
| L1 | Core Architecture (00-13) | VERIFIED | Phase A Repository Inventory (01): 14 documents |
| L2 | Enterprise Application Architecture (14) | VERIFIED | Phase A Repository Inventory (01): 10 documents |
| L3 | Enterprise Functional Traceability (15) | VERIFIED | Phase A Repository Inventory (01): 1 document |
| L4 | Enterprise Business Capability Model (16) | VERIFIED | Phase A Repository Inventory (01): 1 document |
| L5 | Enterprise Business Process Model (17) | VERIFIED | Phase A Repository Inventory (01): 10 documents |
| L6 | Enterprise Information Data Model (18) | VERIFIED | Phase A Repository Inventory (01): 10 documents |
| L7 | Enterprise Solution Architecture (19) | VERIFIED | Phase A Repository Inventory (01): 18 documents |
| L8 | Enterprise Implementation Architecture (20) | VERIFIED | Phase A Repository Inventory (01): 17 documents |
| **Layer Total** | | CONTRADICTED | Phase A: 14+10+1+1+10+10+18+17 = 81. Phase A total: 85. Phase B: 85 total, 81 in layers. |

---

## Contradiction Statistics

| Metric | Status | Evidence |
|--------|--------|----------|
| Total Verified Contradictions | VERIFIED | Phase A Contradiction Register (03): 19 |
| Critical Severity | CONTRADICTED | Phase B Contradiction Classification Register (04): count = 8, but only 7 IDs listed (CTR-001, CTR-002, CTR-003, CTR-004, CTR-008, CTR-009, CTR-010) |
| High Severity | VERIFIED | Phase B Contradiction Classification Register (04): 9 IDs (CTR-005, CTR-006, CTR-007, CTR-011, CTR-012, CTR-013, CTR-015, CTR-017, CTR-019) |
| Medium Severity | VERIFIED | Phase B Contradiction Classification Register (04): 3 IDs (CTR-014, CTR-016, CTR-018) |
| Low Severity | VERIFIED | Phase B Contradiction Classification Register (04): 0 |
| Severity Total | CONTRADICTED | Phase B count: 8+9+3 = 20. Phase A total: 19. IDs: 7+9+3 = 19. |

---

## Duplicate Statistics

| Metric | Status | Evidence |
|--------|--------|----------|
| Total Duplicate Topics | VERIFIED | Phase A Duplicate Register (02): 57 |
| Security Architecture | VERIFIED | Phase A Duplicate Register (02): 15 (#1-#15) |
| Deployment Architecture | VERIFIED | Phase A Duplicate Register (02): 12 (#16-#27) |
| Backend Architecture | VERIFIED | Phase A Duplicate Register (02): 4 (#28-#31) |
| API Architecture | VERIFIED | Phase A Duplicate Register (02): 7 (#32-#38) |
| Database Architecture | VERIFIED | Phase A Duplicate Register (02): 13 (#39-#51) |
| Cross-Domain | VERIFIED | Phase A Duplicate Register (02): 6 (#52-#58) |
| Duplicate Total | VERIFIED | 15+12+4+7+13+6 = 57 |

---

## Evidence Statistics

| Metric | Status | Evidence |
|--------|--------|----------|
| Total Evidence Gaps | VERIFIED | Phase A Evidence Gaps Register (06): 25 |
| Critical Severity | VERIFIED | Phase B Gap Register (08): 5 IDs (EG-03, EG-04, EG-10, EG-22, EG-24) |
| High Severity | VERIFIED | Phase B Gap Register (08): 7 IDs (EG-01, EG-02, EG-12, EG-13, EG-15, EG-20, EG-21) |
| Medium Severity | CONTRADICTED | Phase B Gap Register (08): count = 9, but only 8 IDs listed (EG-05, EG-06, EG-07, EG-09, EG-14, EG-16, EG-18, EG-23) |
| Low Severity | VERIFIED | Phase B Gap Register (08): 5 IDs (EG-08, EG-11, EG-17, EG-19, EG-25) |
| Severity Total | CONTRADICTED | Phase B count: 5+7+9+5 = 26. Phase A total: 25. IDs: 5+7+8+5 = 25. |

---

## Terminology Statistics

| Metric | Status | Evidence |
|--------|--------|----------|
| Total Terminology Inconsistencies | VERIFIED | Phase A Terminology Register (04): 15 |

---

## Coverage Statistics

| Metric | Status | Evidence |
|--------|--------|----------|
| Total Domain Areas Assessed | VERIFIED | Phase A Coverage Register (05): 30 |
| Domains with Present Status | VERIFIED | Phase A Coverage Register (05): 28 |
| Domains with Partially Present Status | VERIFIED | Phase A Coverage Register (05): 2 (Governance, AI) |
| Domains with Absent Status | VERIFIED | Phase A Coverage Register (05): 0 |
| Coverage Gaps | VERIFIED | Phase B Gap Register (08): 2 (CG-01, CG-02) |
| Total Gaps | VERIFIED | Phase B Gap Register (08): 27 |

---

**Version:** 1.0

**Status:** Phase C Extended Validation — Evidence-first statistics
