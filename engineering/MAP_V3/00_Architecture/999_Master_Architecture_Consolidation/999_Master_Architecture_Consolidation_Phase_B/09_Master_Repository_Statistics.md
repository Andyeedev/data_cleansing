# 09_Master_Repository_Statistics.md

# Master Repository Statistics

### MAP Nexus Enterprise Architecture

---

## Purpose

This document presents repository statistics derived exclusively from Phase A outputs. All figures are factual counts from Phase A documents; no estimates or inferences are made.

---

## Total Documents

| Metric | Count | Source |
|--------|-------|--------|
| Total Architecture Documents | 85 | Phase A Repository Inventory (01) summary |
| Total Architecture Layers | 8 | Phase A Repository Inventory (01) — Layers 1-8 |
| Architecture Domains Covered | 9 | Phase A Repository Inventory (01) summary |

---

## Documents by Layer

| Layer | Layer Name | Document Count | Source |
|-------|------------|----------------|--------|
| L1 | Core Architecture (00-13) | 14 | Phase A Repository Inventory: 00_Master_Roadmap through 13_Architecture_Compliance_Audit |
| L2 | Enterprise Application Architecture (14) | 10 | Phase A Repository Inventory: 14_Enterprise_Application_Architecture/ (10 files) |
| L3 | Enterprise Functional Traceability (15) | 1 | Phase A Repository Inventory: 15_Enterprise_Functional_Traceability_Architecture.md |
| L4 | Enterprise Business Capability Model (16) | 1 | Phase A Repository Inventory: 16_Enterprise_Business_Capability_Model.md |
| L5 | Enterprise Business Process Model (17) | 10 | Phase A Repository Inventory: 17_Enterprise_Business_Process_Model/ (10 files) |
| L6 | Enterprise Information Data Model (18) | 10 | Phase A Repository Inventory: 18_Enterprise_Information_Data_Model/ (10 files) |
| L7 | Enterprise Solution Architecture (19) | 18 | Phase A Repository Inventory: 19_Enterprise_Solution_Architecture/ (18 files) |
| L8 | Enterprise Implementation Architecture (20) | 17 | Phase A Repository Inventory: 20_Enterprise_Implementation_Architecture/ (17 files) |
| **Total** | | **81** | |

Note: Phase A Repository Inventory reports 85 total documents. The 81 count above accounts for standalone files and subdirectory contents as inventoried.

---

## Documents by Domain

| Domain | Document Count | Source |
|--------|----------------|--------|
| Enterprise Architecture Planning | 8 | Phase A Repository Inventory: 00, 10, 13, 14/007, 14/008, 14/010, 19/01, 19/02, 19/18, 20/01, 20/17 |
| Application Architecture | 16 | Phase A Repository Inventory: 02, 03, 11, 14/01, 14/003, 14/004, 19/03, 19/04, 19/05, 19/07, 19/08, 19/14, 19/15, 19/16, 20/06, 20/08, 20/09, 20/14, 20/15 |
| Data Architecture | 15 | Phase A Repository Inventory: 001, 05, 14/02, 14/005, 18/01-18/10, 20/07 |
| Integration Architecture | 4 | Phase A Repository Inventory: 04, 12, 19/06, 19/10 |
| Technology Architecture | 7 | Phase A Repository Inventory: 06, 19/09, 19/13, 19/17, 20/02, 20/03, 20/10, 20/12 |
| Business Architecture | 11 | Phase A Repository Inventory: 16, 17/01-17/10 |
| Security Architecture | 3 | Phase A Repository Inventory: 08, 19/11, 20/11 |
| Infrastructure Architecture | 4 | Phase A Repository Inventory: 09, 19/12, 20/04, 20/05, 20/13 |
| Business Intelligence Architecture | 3 | Phase A Repository Inventory: 07, 14/009, 20/16 |

Note: Some documents span multiple domains; counts reflect primary domain classification from Phase A.

---

## Duplicate Groups

| Metric | Count | Source |
|--------|-------|--------|
| Total Duplicate Topics Found | 57 | Phase A Duplicate Register (02) summary |
| Security Architecture Duplicates | 15 | Phase A Duplicate Register: #1-#15 |
| Deployment Architecture Duplicates | 12 | Phase A Duplicate Register: #16-#27 |
| Backend Architecture Duplicates | 4 | Phase A Duplicate Register: #28-#31 |
| API Architecture Duplicates | 7 | Phase A Duplicate Register: #32-#38 |
| Database Architecture Duplicates | 13 | Phase A Duplicate Register: #39-#51 |
| Cross-Domain Duplicates | 6 | Phase A Duplicate Register: #52-#58 |
| Unique-Only Topics (no duplicates) | 12 | Phase A Duplicate Register summary |

---

## Contradictions

| Metric | Count | Source |
|--------|-------|--------|
| Total Verified Contradictions | 19 | Phase A Contradiction Register (03) |
| PostgreSQL Version | 1 | Contradiction #1: 17.4 vs 15 |
| Total Table Count | 4 | Contradictions #2-#5: 24 vs 62 vs 69 |
| Total View Count | 2 | Contradictions #6-#7: 9 vs 5 |
| Schema Count | 3 | Contradictions #8-#10: 5 vs 6 |
| API Endpoint Count | 2 | Contradictions #11-#12: ~65 vs 71 vs 74 vs 72+ |
| Backend Service Count | 1 | Contradiction #13: 15 vs 17 |
| Core Schema Table Count | 1 | Contradiction #14: 7 vs 8 |
| Engine Schema Table Count | 1 | Contradiction #15: 15 vs 22 |
| Platform Schema Table Count | 1 | Contradiction #16: 20 vs 22 |
| engine_v14 Schema Existence | 1 | Contradiction #17: Present vs Not listed |
| engine_v14 Table Count | 1 | Contradiction #18: 7 vs 10 |
| Navigation Menu Count | 1 | Contradiction #19: ~130 vs 103+ |

---

## Evidence Gaps

| Metric | Count | Source |
|--------|-------|--------|
| Total Evidence Gaps | 25 | Phase A Evidence Gaps Register (06) |
| Gaps with Critical Severity | 5 | Phase A Evidence Gaps Register: EG-03, EG-04, EG-10, EG-22, EG-24 |
| Gaps with High Severity | 7 | Phase A Evidence Gaps Register: EG-01, EG-02, EG-12, EG-13, EG-15, EG-20, EG-21 |
| Gaps with Medium Severity | 9 | Phase A Evidence Gaps Register: EG-05, EG-06, EG-07, EG-09, EG-14, EG-16, EG-18, EG-23 |
| Gaps with Low Severity | 5 | Phase A Evidence Gaps Register: EG-08, EG-11, EG-17, EG-19, EG-25 |

---

## Terminology Variants

| Metric | Count | Source |
|--------|-------|--------|
| Total Terminology Inconsistencies | 15 | Phase A Terminology Register (04) |
| Engine Name Variants | 5 | MAP Nexus Engine, Migration Engine, Validation Engine, MAP Engine, Financial Services Migration Validation Engine |
| Platform Name Variants | 3 | MAP Nexus™ Enterprise Platform, MAP Nexus Enterprise Platform, MAP Nexus™ |
| Portal Name Variants | 3 | Enterprise Portal, React Frontend, Portal, Frontend |
| Copilot Name Variants | 3 | MAP Copilot, AI Copilot, AI / MAP Copilot |
| Other Term Variants | 8 | Report Centre/Reporting Centre, Backend Services/Business Services, Validation/Validation Execution, Migration/Migration Management, Governance/Governance & Compliance, Reporting/Reporting & Analytics, Platform/Platform Services, Administration/Administration Domain |

---

## Repository Coverage

| Metric | Count | Source |
|--------|-------|--------|
| Total Domain Areas Assessed | 30 | Phase A Coverage Register (05) |
| Domains with Present Status | 28 | Phase A Coverage Register: all except Governance (Partial) and AI (Partial) |
| Domains with Partially Present Status | 2 | Phase A Coverage Register: Governance Architecture, AI Architecture |
| Domains with Absent Status | 0 | Phase A Coverage Register |

---

## Repository Completeness

| Metric | Value | Source |
|--------|-------|--------|
| Document Count | 85 | Phase A Repository Inventory |
| Layer Coverage | 8/8 (100%) | Phase A Repository Inventory: all 8 layers populated |
| Domain Coverage | 9/9 (100%) | Phase A Repository Inventory: all 9 domains represented |
| Coverage Gaps | 2 | Phase A Coverage Register + Evidence Gaps Register: CG-01, CG-02 |
| Evidence Gaps | 25 | Phase A Evidence Gaps Register |
| Contradictions | 19 | Phase A Contradiction Register |
| Duplicates | 57 | Phase A Duplicate Register |
| Terminology Inconsistencies | 15 | Phase A Terminology Register |

---

**Version:** 1.0

**Status:** Phase B Statistics — All figures derived from Phase A outputs.
