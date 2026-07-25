# 04_Contradiction_Classification_Register.md

# Contradiction Classification Register

### MAP Nexus Enterprise Architecture — Consolidation Phase B

---

## Purpose

This register classifies every contradiction identified in the Phase A Contradiction Register. Each contradiction is assigned a classification category, the documents involved are listed with document IDs, and severity is recorded. No resolutions are proposed.

---

## Classification Definitions

| Classification | Definition |
|----------------|------------|
| Technology Version | Different versions of the same technology stated across documents |
| Inventory Count | Different numerical counts of the same entity (tables, views, endpoints, etc.) |
| Implementation Difference | Different implementation approaches or configurations for the same component |
| Terminology | Different names or labels used for the same concept |
| Architecture Decision | Conflicting architectural decisions or choices |
| Metric | Different metrics or measurements for the same attribute |
| Process | Different process descriptions for the same workflow |
| Configuration | Different configuration values for the same setting |
| Unknown | Contradiction does not fit any defined classification |

---

## Contradiction Register

| Contradiction ID | Classification | Documents Involved | Evidence | Severity |
|------------------|----------------|---------------------|----------|----------|
| CTR-001 | Technology Version | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-019-01 (19_Enterprise_Solution_Architecture/01_Executive_Summary.md) | Document A states "PostgreSQL 17.4" (line 9). Document B states "PostgreSQL 15" (line 57). | Critical |
| CTR-002 | Inventory Count | ARCH-020-16 (20_Enterprise_Implementation_Architecture/16_Implementation_Statistics.md), ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md) | Document A states "Total tables: 24" (line 113). Document B states "Tables: 62" (line 29). | Critical |
| CTR-003 | Inventory Count | ARCH-020-16 (20_Enterprise_Implementation_Architecture/16_Implementation_Statistics.md), ARCH-019-01 (19_Enterprise_Solution_Architecture/01_Executive_Summary.md) | Document A states "Total tables: 24" (line 113). Document B states "Database Tables: ~62" (line 104). | Critical |
| CTR-004 | Inventory Count | ARCH-020-16 (20_Enterprise_Implementation_Architecture/16_Implementation_Statistics.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "Total tables: 24" (line 113). Document B states "PostgreSQL Database (6 schemas, 69 tables)" (line 22). | Critical |
| CTR-005 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "Tables: 62" (line 29). Document B states "PostgreSQL Database (6 schemas, 69 tables)" (line 22). | High |
| CTR-006 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-020-16 (20_Enterprise_Implementation_Architecture/16_Implementation_Statistics.md) | Document A states "Views: 9" (line 30). Document B states "Total views: 5" (line 125). | High |
| CTR-007 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "Views: 9" (line 30). Document B states "5 views" (line 74). | High |
| CTR-008 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-019-01 (19_Enterprise_Solution_Architecture/01_Executive_Summary.md) | Document A states "Schemas: 6" (line 28). Document B states "Database Schemas: 5" (line 103). | Critical |
| CTR-009 | Inventory Count | ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md), ARCH-005-01 (05_Database_Architecture.md) | Document A states "6 schemas" (line 22). Document B states "5-schema model" (line 175). | Critical |
| CTR-010 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-005-01 (05_Database_Architecture.md) | Document A states "Schemas: 6" (line 28), lists engine_v14. Document B states "5-schema model" (line 175), only core/engine/reporting/platform/audit. | Critical |
| CTR-011 | Inventory Count | ARCH-019-01 (19_Enterprise_Solution_Architecture/01_Executive_Summary.md), ARCH-019-06 (19_Enterprise_Solution_Architecture/06_API_Architecture.md) | Document A states "API Endpoints: ~65" (line 107). Document B states "Total: 71 ... 74 total endpoints" (lines 256-258). | High |
| CTR-012 | Inventory Count | ARCH-019-06 (19_Enterprise_Solution_Architecture/06_API_Architecture.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "Total: 71 ... 74 total endpoints" (lines 256-258). Document B states "FastAPI Backend (72+ endpoints)" (line 24). | High |
| CTR-013 | Inventory Count | ARCH-019-01 (19_Enterprise_Solution_Architecture/01_Executive_Summary.md), ARCH-020-16 (20_Enterprise_Implementation_Architecture/16_Implementation_Statistics.md) | Document A states "15 backend services" (line 21). Document B states "Service modules: 17" (line 15). | High |
| CTR-014 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "core: 7" (line 43). Document B states "core: 8" (line 101). | Medium |
| CTR-015 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "engine: 15 active" (line 45). Document B states "engine: 22" (line 102). | High |
| CTR-016 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "platform: 20" (line 48). Document B states "platform: 22" (line 103). | Medium |
| CTR-017 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-005-01 (05_Database_Architecture.md) | Document A states "engine_v14: Legacy v1.4 schema" (line 19), listed as Implemented. Document B does not list engine_v14 in schema tree (line 177-184), only 5 schemas described. | High |
| CTR-018 | Inventory Count | ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "engine_v14: 7" (line 46). Document B states "engine_v14: 10" (line 106). | Medium |
| CTR-019 | Inventory Count | ARCH-019-01 (19_Enterprise_Solution_Architecture/01_Executive_Summary.md), ARCH-015-01 (15_Enterprise_Functional_Traceability_Architecture.md) | Document A states "Navigation Items: ~130" (line 113). Document B states "17 menus, 103+ submenus" (line 53), sum = 120+. | High |

---

## Summary

| Classification | Count | Contradiction IDs |
|----------------|-------|-------------------|
| Inventory Count | 18 | CTR-002 through CTR-019 |
| Technology Version | 1 | CTR-001 |
| Implementation Difference | 0 | — |
| Terminology | 0 | — |
| Architecture Decision | 0 | — |
| Metric | 0 | — |
| Process | 0 | — |
| Configuration | 0 | — |
| Unknown | 0 | — |
| **Total** | **19** | |

| Severity | Count | Contradiction IDs |
|----------|-------|-------------------|
| Critical | 8 | CTR-001, CTR-002, CTR-003, CTR-004, CTR-008, CTR-009, CTR-010 |
| High | 9 | CTR-005, CTR-006, CTR-007, CTR-011, CTR-012, CTR-013, CTR-015, CTR-017, CTR-019 |
| Medium | 3 | CTR-014, CTR-016, CTR-018 |
| Low | 0 | — |
| **Total** | **19** | |

---

**Version:** 1.0

**Status:** Phase B — Contradiction Classification
