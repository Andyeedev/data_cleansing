# 06_Duplicate_Analysis.md

# Master Gap Analysis Phase C — Duplicate Analysis

### MAP Nexus Enterprise Architecture

---

## Purpose

This document consolidates all duplicate findings from Phase A and Phase B. It lists duplicate documents, duplicate sections, duplicate responsibilities, and duplicate architecture. No redesign, rewriting, merging, or new architecture invention.

---

## Duplicate Summary

| Metric | Count | Source |
|--------|-------|--------|
| Total Duplicate Groups | 58 | Phase A Duplicate Register (02) / Phase B Duplicate Group Register (03) |
| Documents Involved in Duplicates | 38 | Derived from 58 groups across 81 documents |
| Critical Duplicate Groups | 14 | Phase B Duplicate Group Register (03) |
| High Duplicate Groups | 18 | Phase B Duplicate Group Register (03) |
| Medium Duplicate Groups | 25 | Phase B Duplicate Group Register (03) |
| Low Duplicate Groups | 1 | Phase B Duplicate Group Register (03) |

---

## Duplicate Documents

The following documents are involved in the most duplicate overlaps:

| Document ID | Filename | Duplicate Groups | Category |
|-------------|----------|------------------|----------|
| ARCH-008-01 | 08_Security_Architecture.md | 7 (DG-001, DG-004, DG-007, DG-014, DG-022, DG-026, DG-034) | Security |
| ARCH-019-11 | 19_Enterprise_Solution_Architecture/11_Security_Architecture.md | 14 (DG-001 through DG-015) | Security |
| ARCH-020-11 | 20_Enterprise_Implementation_Architecture/11_Security_Implementation.md | 14 (DG-001 through DG-015) | Security |
| ARCH-005-01 | 05_Database_Architecture.md | 13 (DG-039 through DG-051) | Database |
| ARCH-018-01 | 18_Enterprise_Information_Data_Model/01_Executive_Summary.md | 10 (DG-039 through DG-048) | Database |
| ARCH-018-02 | 18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md | 8 (DG-039 through DG-046) | Database |
| ARCH-019-12 | 19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md | 9 (DG-016 through DG-024) | Deployment |
| ARCH-020-04 | 20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md | 8 (DG-016 through DG-023) | Deployment |
| ARCH-009-01 | 09_Deployment_Architecture.md | 5 (DG-020 through DG-026) | Deployment |
| ARCH-004-01 | 04_API_Architecture.md | 6 (DG-032 through DG-037) | API |
| ARCH-019-06 | 19_Enterprise_Solution_Architecture/06_API_Architecture.md | 4 (DG-032, DG-033, DG-037, DG-038) | API |

---

## Duplicate Sections

### Security Architecture — Duplicated Across 3 Documents

| Section | 08_Security (L1) | 19/11_Security (L7) | 20/11_Security (L8) |
|---------|-------------------|---------------------|---------------------|
| JWT Algorithm & Config | Yes | Yes | Yes |
| JWT Token Payload | No | Yes | Yes |
| JWT Dependencies | No | Yes | Yes |
| RBAC Format & Decorators | Yes | Yes | Yes |
| RBAC Database Tables | No | Yes | Yes |
| Fernet Encryption | No | Yes | Yes (4 implementations) |
| Audit Logging Middleware | Yes | Yes | Yes |
| Tenant Isolation | No | Yes | Yes |
| CORS Configuration | No | Yes | Yes |
| Rate Limiting | No | Yes | Yes |
| Password Hashing | No | Yes | Yes |
| Custom AUDIT Log Level | No | Yes | Yes |
| Governance Audit Events | No | Yes | Yes |
| Secrets Management (Env) | Yes | Yes | Yes |
| Secrets Management (.env) | No | Yes | Yes |

**Overlap:** 15 sections duplicated across 3 documents with no single authoritative source.

### Deployment Architecture — Duplicated Across 3 Documents

| Section | 09_Deployment (L1) | 19/12_Deployment (L7) | 20/04_Deployment (L8) |
|---------|---------------------|-----------------------|-----------------------|
| Dockerfile Multi-Stage Build | No | Yes | Yes |
| Docker Compose Services | No | Yes | Yes |
| Container Layout Table | No | Yes | Yes |
| Backend Environment Variables | No | Yes | Yes |
| CI/CD Pipeline | Yes | Yes | Yes |
| Azure Deployment Resources | Yes | Yes | No |
| Secrets — Azure Key Vault | Yes | No | No |
| Secrets — .env Files | No | Yes | Yes |
| Startup Process / Entry Point | No | Yes | Yes |
| Backup Strategy | Yes | No | No |
| Disaster Recovery | Yes | No | No |
| Scalability | Yes | No | No |

**Overlap:** 12 sections duplicated across 3 documents with no single authoritative source.

### Database Architecture — Duplicated Across 3+ Documents

| Section | 05_Database (L1) | 18/01_Data (L6) | 18/02_Data (L6) | 18/03_Data (L6) |
|---------|-------------------|-----------------|-----------------|-----------------|
| Schema Organisation | Yes | Yes | Yes | No |
| Core Schema Entities | Yes | No | Yes | Yes |
| Engine Schema Entities | Yes | No | Yes | Yes |
| Reporting Schema Entities | Yes | No | Yes | No |
| Platform Schema Entities | Yes | No | Yes | Yes |
| Audit Schema Entities | Yes | No | Yes | Yes |
| Database Security | Yes | No | No | No |
| Multi-Tenant Strategy | Yes | Yes | No | No |
| Data Retention | Yes | No | No | No |
| Data Integrity / Constraints | Yes | No | No | No |
| Performance Strategy | Yes | No | No | No |
| Data Lifecycle | Yes | No | No | No |
| Lookup/Reference Data | Yes | No | No | Yes |

**Overlap:** 13 sections duplicated across 3+ documents with contradictory counts.

---

## Duplicate Responsibilities

| Responsibility | Owner 1 | Owner 2 | Owner 3 | Conflict |
|----------------|---------|---------|---------|----------|
| JWT Configuration | 08_Security | 19/11_Security | 20/11_Security | 3 documents describe JWT; no single authority |
| RBAC Configuration | 08_Security | 19/11_Security | 20/11_Security | 3 documents describe RBAC; no single authority |
| Audit Logging | 08_Security | 19/11_Security | 20/11_Security | 3 documents describe audit; no single authority |
| Secrets Management | 08_Security, 09_Deploy | 19/11_Security, 19/12_Deploy | 20/11_Security, 20/04_Deploy | 6 documents describe secrets; no single authority |
| Docker Configuration | 09_Deploy | 19/12_Deploy | 20/04_Deploy | 3 documents describe Docker; no single authority |
| CI/CD Pipeline | 09_Deploy | 19/12_Deploy | 20/04_Deploy | 3 documents describe CI/CD; no single authority |
| Schema Design | 05_Database | 18/01-18/10_Data | — | Contradictory counts (5 vs 6 schemas) |
| Table Inventory | 05_Database | 18/02_Data, 18/03_Data | 15_Traceability | Contradictory counts (24 vs 62 vs 69 tables) |
| API Endpoint Inventory | 04_API | 19/06_API | 15_Traceability | Contradictory counts (~65 vs 74 vs 72+ endpoints) |
| Service Inventory | 19/01_Solution | 20/16_Impl | — | Contradictory counts (15 vs 17 services) |

---

## Duplicate Architecture

### Security Architecture — Three Overlapping Implementations

| Aspect | 08_Security (L1) | 19/11_Security (L7) | 20/11_Security (L8) |
|--------|-------------------|---------------------|---------------------|
| Layer Purpose | Core Blueprint | Solution Design | Implementation Detail |
| Scope | Conceptual Security | Detailed Security Design | Implementation Code |
| Audience | Architects | Designers | Developers |
| Contradictions | None internal | None internal | None internal |
| Inter-document Contradictions | JWT version unclear | JWT version stated | JWT version stated |
| Single Source of Truth | **No** | **No** | **No** |

### Deployment Architecture — Three Overlapping Implementations

| Aspect | 09_Deployment (L1) | 19/12_Deployment (L7) | 20/04_Deployment (L8) |
|--------|---------------------|-----------------------|-----------------------|
| Layer Purpose | Core Blueprint | Solution Design | Implementation Detail |
| Scope | Conceptual Deployment | Detailed Deployment Design | Implementation Code |
| Audience | Architects | Designers | Developers |
| Contradictions | None internal | None internal | None internal |
| Inter-document Contradictions | Backup/DR present | Backup/DR absent | Backup/DR absent |
| Single Source of Truth | **No** | **No** | **No** |

### Database Architecture — Overlapping Between Core and Data Model

| Aspect | 05_Database (L1) | 18_Data_Model (L6) | 15_Traceability (L3) |
|--------|-------------------|---------------------|----------------------|
| Schema Count | 5 | 6 | 6 |
| Table Count | 24 (inferred) | 62 | 69 |
| View Count | Not stated | 9 | 5 |
| Single Source of Truth | **No** | **No** | **No** |

---

## Duplicate Root Causes

| Root Cause | Duplicate Groups Affected | Evidence |
|------------|---------------------------|----------|
| Two-tier architecture pattern (Blueprint + Current State) | All 58 groups | Core Architecture (L1) overlaps with Solution (L7) and Implementation (L8) |
| No single source of truth designation | All 58 groups | No document is designated as canonical |
| No naming convention enforcement | 15 terminology variants | 39 variant instances across 5 domains |
| No version tracking | All documents | No version history or change log |
| No governance review process | All documents | No Architecture Review Board |
| Generated documents without deduplication | 58 groups | Documents generated from prompts without checking existing content |

---

## Duplicate Impact Assessment

| Impact Area | Duplicate Count | Risk |
|-------------|-----------------|------|
| Configuration Conflicts | 18 (Design + Configuration type) | High — Different configurations may be applied |
| Inventory Discrepancies | 20 (Inventory type) | Critical — Fundamental facts are disputed |
| Responsibility Gaps | 10 (Summary type) | Medium — No single owner for overlapping topics |
| Reference Inconsistencies | 3 (Reference type) | Low — Cross-references may point to wrong document |
| Implementation Divergence | 4 (Implementation type) | High — Code may diverge from design |

---

## Duplicate Analysis Summary

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

**Version:** 1.0

**Status:** Phase C Gap Analysis — Duplicate Analysis
