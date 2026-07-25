# 03_Gap_Analysis_by_Architecture_Layer.md

# Gap Analysis by Architecture Layer — Extended Validation

### MAP Nexus Enterprise Architecture — Phase C Gap Analysis

---

## Layer 1: Core Architecture (00-13)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 14 documents covering Roadmap, Portal, Backend, API, Database, AI, Reporting, Security, Deployment, Standards, Integration, Compliance | Phase A Repository Inventory (01) |
| Contradictions | 05_Database states 5-schema model; contradicts 18_Data_Model/01 (6 schemas) | Phase A Contradiction Register (03): CTR-009, CTR-010 |
| Missing Evidence | None identified | — |
| Unknown Items | — | — |
| Confidence | High | All 14 documents verified |

---

## Layer 2: Enterprise Application Architecture (14)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 10 documents covering Product Architecture, Load Source Code, Analyse Backend/Frontend/Database/AI, Generate/Validate/Promote | Phase A Repository Inventory (01) |
| Contradictions | None identified | Phase A Contradiction Register (03) |
| Missing Evidence | None identified | — |
| Unknown Items | — | — |
| Confidence | High | All 10 documents verified; no contradictions |

---

## Layer 3: Enterprise Functional Traceability (15)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 1 document covering functional traceability | Phase A Repository Inventory (01) |
| Contradictions | 15_Traceability: 69 tables vs 18_Data_Model/01: 62 tables vs 20_Impl/16: 24 tables | Phase A Contradiction Register (03): CTR-004 |
| Contradictions | 15_Traceability: 6 schemas vs 05_Database: 5 schemas | Phase A Contradiction Register (03): CTR-009 |
| Contradictions | 15_Traceability: 72+ endpoints vs 19_Solution/06: 74 endpoints | Phase A Contradiction Register (03): CTR-012 |
| Contradictions | 15_Traceability: 103+ submenus vs 19_Solution/01: ~130 navigation items | Phase A Contradiction Register (03): CTR-019 |
| Missing Evidence | None identified | — |
| Unknown Items | — | — |
| Confidence | Low | Single document with 4 contradictions |

---

## Layer 4: Enterprise Business Capability Model (16)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 1 document covering 34 business capabilities | Phase A Repository Inventory (01) |
| Contradictions | None identified | Phase A Contradiction Register (03) |
| Missing Evidence | Capabilities listed but some lack evidence of implementation | Phase A Evidence Gaps Register (06): EG-05 |
| Unknown Items | — | — |
| Confidence | Medium | Verified asset; evidence gap exists |

---

## Layer 5: Enterprise Business Process Model (17)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 10 documents covering Executive Summary, End-to-End Catalogue, Decomposition, BPM Flows, Capability Traceability, RACI, Maturity, Automation, Gap Analysis, Roadmap | Phase A Repository Inventory (01) |
| Contradictions | None identified | Phase A Contradiction Register (03) |
| Missing Evidence | None identified | — |
| Unknown Items | — | — |
| Confidence | High | All 10 documents verified; no contradictions |

---

## Layer 6: Enterprise Information Data Model (18)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 10 documents covering Executive Summary, Schema Inventory, Table Catalogue, Logical Model, Master/Reference Data, Relationships, Data Flow, Audit/History, Configuration, Statistics | Phase A Repository Inventory (01) |
| Contradictions | 18_Data_Model/01: 62 tables vs 20_Impl/16: 24 tables vs 15_Traceability: 69 tables | Phase A Contradiction Register (03): CTR-002, CTR-005 |
| Contradictions | 18_Data_Model/01: 6 schemas vs 05_Database: 5 schemas vs 19_Solution/01: 5 schemas | Phase A Contradiction Register (03): CTR-008, CTR-010 |
| Contradictions | 18_Data_Model/01: PostgreSQL 17.4 vs 19_Solution/01: PostgreSQL 15 | Phase A Contradiction Register (03): CTR-001 |
| Contradictions | 18_Data_Model/01: 9 views vs 20_Impl/16: 5 views vs 15_Traceability: 5 views | Phase A Contradiction Register (03): CTR-006, CTR-007 |
| Contradictions | 18_Data_Model/01 lists engine_v14; 05_Database does not | Phase A Contradiction Register (03): CTR-017 |
| Missing Evidence | None identified | — |
| Unknown Items | — | — |
| Confidence | Low | 5 contradictions; critical counts disagree |

---

## Layer 7: Enterprise Solution Architecture (19)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 18 documents covering Executive Summary, Overview, Application, Component, Service, API, Backend, Frontend, Runtime, Integration, Security, Deployment, Technology, Directory, Dependencies, Configuration, Logging, Decision Summary | Phase A Repository Inventory (01) |
| Contradictions | 19_Solution/01: ~65 endpoints vs 19_Solution/06: 74 endpoints | Phase A Contradiction Register (03): CTR-011 |
| Contradictions | 19_Solution/01: 15 backend services vs 20_Impl/16: 17 service modules | Phase A Contradiction Register (03): CTR-013 |
| Contradictions | 19_Solution/01: ~130 navigation items vs 15_Traceability: 103+ submenus | Phase A Contradiction Register (03): CTR-019 |
| Missing Evidence | None identified | — |
| Unknown Items | — | — |
| Confidence | Medium | 3 contradictions; most documents verified |

---

## Layer 8: Enterprise Implementation Architecture (20)

| Dimension | Status | Evidence |
|-----------|--------|----------|
| Verified Assets | 17 documents covering Executive Summary, Runtime, Build, Deployment, Infrastructure, Configuration, Database, Backend, Frontend, Execution, Security, Logging, CI/CD, Directory, Dependencies, Statistics, Decision Record | Phase A Repository Inventory (01) |
| Contradictions | 20_Impl/16: 24 tables vs 18_Data_Model/01: 62 tables vs 15_Traceability: 69 tables | Phase A Contradiction Register (03): CTR-002, CTR-003, CTR-004 |
| Contradictions | 20_Impl/16: 5 views vs 18_Data_Model/01: 9 views | Phase A Contradiction Register (03): CTR-006 |
| Contradictions | 20_Impl/16: 17 service modules vs 19_Solution/01: 15 backend services | Phase A Contradiction Register (03): CTR-013 |
| Missing Evidence | None identified | — |
| Unknown Items | — | — |
| Confidence | Medium | 3 contradictions; most documents verified |

---

**Version:** 1.0

**Status:** Phase C Extended Validation — Evidence-first layer analysis
