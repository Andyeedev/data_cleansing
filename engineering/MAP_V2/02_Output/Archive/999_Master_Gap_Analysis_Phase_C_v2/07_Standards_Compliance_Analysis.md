# 07_Standards_Compliance_Analysis.md

# Standards Compliance Analysis

### MAP Nexus Enterprise Architecture — Phase C Gap Analysis

---

## Naming Inconsistencies

| # | Inconsistency | Where Each Appears | Source |
|---|---------------|-------------------|--------|
| 1 | MAP Nexus Engine vs Migration Engine vs Validation Engine vs MAP Engine | 03_Backend, 15_Traceability, 13_Compliance, 20_Impl, 11_Development_Standards | Phase A Terminology Register #1 |
| 2 | MAP Nexus™ Enterprise Platform vs MAP Nexus Enterprise Platform vs MAP Nexus™ | 02_Portal, 15_Traceability, 16_Capability | Phase A Terminology Register #2 |
| 3 | Enterprise Portal vs React Frontend vs Portal vs Frontend | 00_Roadmap, 15_Traceability, 19_Solution | Phase A Terminology Register #3 |
| 4 | Report Centre vs Reporting Centre | 02_Portal, 15_Traceability | Phase A Terminology Register #4 |
| 5 | MAP Copilot vs AI Copilot vs AI / MAP Copilot | 00_Roadmap, 17_Process, 16_Capability | Phase A Terminology Register #5 |
| 6 | Backend Services vs Business Services | 19_Solution, 03_Backend | Phase A Terminology Register #6 |
| 7 | Validation vs Validation Execution vs Validation Pipeline | 03_Backend, 15_Traceability | Phase A Terminology Register #7 |
| 8 | Migration vs Migration Management vs Migration Centre | 16_Capability, 02_Portal | Phase A Terminology Register #8 |
| 9 | Governance vs Governance & Compliance vs Governance Centre | 16_Capability, 02_Portal | Phase A Terminology Register #9 |
| 10 | Reporting vs Reporting & Analytics vs Reporting Centre | 16_Capability, 02_Portal | Phase A Terminology Register #10 |
| 11 | Platform vs Platform Services vs Platform Domain | 16_Capability, 03_Backend | Phase A Terminology Register #11 |
| 12 | Administration vs Administration Domain vs Administration Service | 16_Capability, 03_Backend | Phase A Terminology Register #12 |
| 13 | Core Engine vs Python Migration Engine | 03_Backend, 15_Traceability | Phase A Terminology Register #13 |
| 14 | Database vs PostgreSQL vs Data Layer | 03_Backend, 15_Traceability | Phase A Terminology Register #14 |
| 15 | API vs REST API vs FastAPI | 04_API, 15_Traceability | Phase A Terminology Register #15 |

---

## Numbering Inconsistencies

| # | Inconsistency | Evidence | Source |
|---|---------------|----------|--------|
| 1 | Document numbering uses leading zeros in some layers (001, 002) but not others (01, 02) | 001_Load_Architecture vs 01_Product_Architecture | Phase A Repository Inventory |
| 2 | Subdirectory numbering inconsistent (02_Portal vs 14_Enterprise_Application_Architecture) | Layer 1 uses short names; Layers 2-8 use full names | Phase A Repository Inventory |

---

## Folder Inconsistencies

| # | Inconsistency | Evidence | Source |
|---|---------------|----------|--------|
| 1 | Layer 1 documents are standalone files; Layers 2-8 are subdirectories | 00_Architecture/02_Portal_Architecture.md vs 00_Architecture/14_Enterprise_Application_Architecture/ | Phase A Repository Inventory |
| 2 | Some subdirectories use underscores, others use hyphens | Inconsistent naming conventions across folders | Phase A Repository Inventory |

---

## Metadata Inconsistencies

| # | Inconsistency | Evidence | Source |
|---|---------------|----------|--------|
| 1 | Version numbers inconsistent across documents | Some documents have Version: 1.0, others have no version | Phase A Repository Inventory |
| 2 | Status labels inconsistent | Some documents have Status, others do not | Phase A Repository Inventory |
| 3 | Source citations inconsistent | Some documents cite sources, others do not | Phase A Evidence Gaps Register |

---

## Summary

| Category | Count | Source |
|----------|-------|--------|
| Naming Inconsistencies | 15 | Phase A Terminology Register |
| Numbering Inconsistencies | 2 | Phase A Repository Inventory observation |
| Folder Inconsistencies | 2 | Phase A Repository Inventory observation |
| Metadata Inconsistencies | 3 | Phase A Repository Inventory observation |
| **Total** | **22** | |

---

**Version:** 1.0

**Status:** Phase C — Standards compliance analysis
