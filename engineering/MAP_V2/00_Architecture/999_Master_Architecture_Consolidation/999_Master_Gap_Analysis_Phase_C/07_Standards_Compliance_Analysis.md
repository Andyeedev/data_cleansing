# 07_Standards_Compliance_Analysis.md

# Standards Compliance Analysis — Extended Validation

### MAP Nexus Enterprise Architecture — Phase C Gap Analysis

---

## Naming Inconsistencies

| # | Status | Evidence |
|---|--------|----------|
| 1 | VERIFIED | MAP Nexus Engine vs Migration Engine vs Validation Engine vs MAP Engine vs Financial Services Migration Validation Engine (Phase A Terminology Register (04) #1) |
| 2 | VERIFIED | MAP Nexus™ Enterprise Platform vs MAP Nexus Enterprise Platform vs MAP Nexus™ (Phase A Terminology Register (04) #2) |
| 3 | VERIFIED | Enterprise Portal vs React Frontend vs Portal vs Frontend (Phase A Terminology Register (04) #3) |
| 4 | VERIFIED | Report Centre vs Reporting Centre (Phase A Terminology Register (04) #4) |
| 5 | VERIFIED | MAP Copilot vs AI Copilot vs AI / MAP Copilot (Phase A Terminology Register (04) #5) |
| 6 | VERIFIED | Backend Services vs Business Services (Phase A Terminology Register (04) #6) |
| 7 | VERIFIED | Validation vs Validation Execution vs Validation Pipeline (Phase A Terminology Register (04) #7) |
| 8 | VERIFIED | Migration vs Migration Management vs Migration Centre (Phase A Terminology Register (04) #8) |
| 9 | VERIFIED | Governance vs Governance & Compliance vs Governance Centre (Phase A Terminology Register (04) #9) |
| 10 | VERIFIED | Reporting vs Reporting & Analytics vs Reporting Centre (Phase A Terminology Register (04) #10) |
| 11 | VERIFIED | Platform vs Platform Services vs Platform Domain (Phase A Terminology Register (04) #11) |
| 12 | VERIFIED | Administration vs Administration Domain vs Administration Service (Phase A Terminology Register (04) #12) |
| 13 | VERIFIED | Core Engine vs Python Migration Engine (Phase A Terminology Register (04) #13) |
| 14 | VERIFIED | Database vs PostgreSQL vs Data Layer (Phase A Terminology Register (04) #14) |
| 15 | VERIFIED | API vs REST API vs FastAPI (Phase A Terminology Register (04) #15) |

---

## Numbering Inconsistencies

| # | Status | Evidence |
|---|--------|----------|
| 1 | VERIFIED | Document numbering uses leading zeros in some layers (001, 002) but not others (01, 02) (Phase A Repository Inventory (01)) |
| 2 | VERIFIED | Subdirectory numbering inconsistent (02_Portal vs 14_Enterprise_Application_Architecture) (Phase A Repository Inventory (01)) |

---

## Folder Inconsistencies

| # | Status | Evidence |
|---|--------|----------|
| 1 | VERIFIED | Layer 1 documents are standalone files; Layers 2-8 are subdirectories (Phase A Repository Inventory (01)) |
| 2 | VERIFIED | Some subdirectories use underscores, others use hyphens (Phase A Repository Inventory (01)) |

---

## Metadata Inconsistencies

| # | Status | Evidence |
|---|--------|----------|
| 1 | VERIFIED | Version numbers inconsistent across documents (Phase A Repository Inventory (01)) |
| 2 | VERIFIED | Status labels inconsistent (Phase A Repository Inventory (01)) |
| 3 | VERIFIED | Source citations inconsistent (Phase A Evidence Gaps Register (06)) |

---

## Versioning Inconsistencies

| # | Status | Evidence |
|---|--------|----------|
| 1 | CONTRADICTED | PostgreSQL version: 17.4 (18_Data_Model/01) vs 15 (19_Solution/01) vs 16 (CI/CD) |
| 2 | UNVERIFIABLE | Python version: 3.11 (19_Solution/13) vs 3.12 (CI/CD) |
| 3 | UNVERIFIABLE | Docker Compose version: v3.9 (20_Impl/04) but unverified |

---

## Documentation Standards

| # | Status | Evidence |
|---|--------|----------|
| 1 | VERIFIED | 25 evidence gaps exist (Phase A Evidence Gaps Register (06)) |
| 2 | VERIFIED | 19 contradictions exist (Phase A Contradiction Register (03)) |

---

**Version:** 1.0

**Status:** Phase C Extended Validation — Evidence-first standards analysis
