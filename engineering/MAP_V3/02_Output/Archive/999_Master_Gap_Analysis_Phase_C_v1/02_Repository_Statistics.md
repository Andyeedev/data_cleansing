# 02_Repository_Statistics.md

# Master Gap Analysis Phase C — Repository Statistics

### MAP Nexus Enterprise Architecture

---

## Purpose

This document presents repository statistics for gap identification. All figures are derived from Phase A outputs and Phase B consolidations. No estimates or inferences are made beyond the source data.

---

## Repository Counts

| Metric | Count | Source |
|--------|-------|--------|
| Total Architecture Documents | 85 | Phase A Repository Inventory |
| Documents Analysed (Active) | 81 | Phase B Document Register (02) |
| Architecture Layers | 8 | Phase B Document Register (02) — L1 through L8 |
| Architecture Domains | 9 | Phase B Document Register (02) — D01 through D09 |
| Cross References | 85 | Phase B Repository Index (10) — Layer-to-Layer mappings |
| Broken References | 0 | Phase B Repository Index (10) — no unresolvable references found |
| Duplicate Areas | 58 | Phase A Duplicate Register (02) / Phase B Duplicate Group Register (03) |
| Missing Areas | 27 | Phase A Coverage Register (05) + Phase A Evidence Gaps Register (06) |
| Coverage Percentage | 93% | 28 of 30 domain areas assessed as Present; 2 Partial |
| Estimated Maturity | 6/10 | Derived from gap analysis across 6 dimensions |

---

## Documents by Layer

| Layer | Layer Name | Documents | Percentage | Gap Assessment |
|-------|------------|-----------|------------|----------------|
| L1 | Core Architecture (00-13) | 14 | 16.7% | Moderate — 11 active + 3 planning |
| L2 | Enterprise Application Architecture (14) | 10 | 11.9% | Low — process-driven, complete for its scope |
| L3 | Enterprise Functional Traceability (15) | 1 | 1.2% | High — single document insufficient for traceability mandate |
| L4 | Enterprise Business Capability Model (16) | 1 | 1.2% | High — single document insufficient for capability decomposition |
| L5 | Enterprise Business Process Model (17) | 10 | 11.9% | Low — comprehensive process documentation |
| L6 | Enterprise Information Data Model (18) | 10 | 11.9% | Low — comprehensive data model documentation |
| L7 | Enterprise Solution Architecture (19) | 18 | 21.4% | Low — most documented layer; duplicate overlap with L1 |
| L8 | Enterprise Implementation Architecture (20) | 17 | 20.2% | Low — comprehensive; contradicts L6 and L7 on counts |
| **Total** | | **81** | **100%** | |

---

## Documents by Domain

| Domain | Document Count | Percentage | Gap Assessment |
|--------|----------------|------------|----------------|
| Enterprise Architecture Planning | 12 | 14.8% | Low — well-represented |
| Application Architecture | 22 | 27.2% | Low — most represented domain |
| Data Architecture | 14 | 17.3% | Medium — contradictory counts across documents |
| Integration Architecture | 4 | 4.9% | Medium — only 4 documents for integration concerns |
| Technology Architecture | 9 | 11.1% | Low — adequate coverage |
| Business Architecture | 11 | 13.6% | Low — comprehensive business documentation |
| Security Architecture | 3 | 3.7% | High — 3 documents with 15 duplicate groups |
| Infrastructure Architecture | 4 | 4.9% | Medium — limited documentation scope |
| Business Intelligence Architecture | 2 | 2.5% | Medium — minimal BI documentation |
| **Total** | **81** | **100%** | |

---

## Duplicate Statistics

| Category | Groups | Critical | High | Medium | Low |
|----------|--------|----------|------|--------|-----|
| Security Architecture | 15 | 3 | 7 | 5 | 0 |
| Deployment Architecture | 12 | 1 | 4 | 7 | 0 |
| Backend Architecture | 4 | 0 | 0 | 3 | 1 |
| API Architecture | 7 | 0 | 1 | 6 | 0 |
| Database Architecture | 13 | 6 | 4 | 3 | 0 |
| Cross-Domain | 7 | 4 | 2 | 1 | 0 |
| **Total** | **58** | **14** | **18** | **25** | **1** |

---

## Contradiction Statistics

| Severity | Count | Percentage | Primary Classification |
|----------|-------|------------|----------------------|
| Critical | 8 | 42.1% | Inventory Count (7), Technology Version (1) |
| High | 9 | 47.4% | Inventory Count (9) |
| Medium | 3 | 15.8% | Inventory Count (3) |
| Low | 0 | 0.0% | — |
| **Total** | **19** | **100%** | |

---

## Evidence Gap Statistics

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 4 | 16.0% |
| High | 6 | 24.0% |
| Medium | 9 | 36.0% |
| Low | 5 | 20.0% |
| **Total** | **25** | **100%** |

---

## Terminology Variant Statistics

| Domain | Terms | Variants |
|--------|-------|----------|
| Application Architecture | 9 | 26 |
| Business Architecture | 3 | 6 |
| Enterprise Architecture Planning | 1 | 3 |
| Data Architecture | 1 | 2 |
| Integration Architecture | 1 | 2 |
| **Total** | **15** | **39** |

---

## Coverage Assessment

| Assessment Area | Domains Assessed | Present | Partial | Absent | Coverage |
|-----------------|------------------|---------|---------|--------|----------|
| Phase A Coverage Register | 30 | 28 | 2 | 0 | 93% |
| Phase A Evidence Gaps | 25 | — | — | — | — |
| Phase A Contradictions | 19 | — | — | — | — |
| Phase A Duplicate Topics | 57 | — | — | — | — |
| Phase A Terminology Variants | 15 | — | — | — | — |

---

## Maturity Indicators

| Indicator | Status | Evidence |
|-----------|--------|----------|
| Document Versioning | Absent | No version history in any document |
| Change Log | Absent | No change tracking mechanism |
| Approval Workflow | Absent | No approval records documented |
| Automated Validation | Absent | No tooling for consistency checking |
| Governance Process | Absent | No Architecture Review Board documented |
| Naming Standard | Absent | 15 terms with 39 variant instances |
| Cross-Reference Validation | Partial | Index exists but not validated |
| Dependency Validation | Partial | 15 documents with dependency claims; not verified |

---

**Version:** 1.0

**Status:** Phase C Gap Analysis — Repository Statistics
