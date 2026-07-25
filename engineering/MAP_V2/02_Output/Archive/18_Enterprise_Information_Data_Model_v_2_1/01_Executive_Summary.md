# Executive Summary — Enterprise Information & Data Model

**Document ID:** 18  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document summarises the **Enterprise Information & Data Model** for the MAP Nexus™ platform. It defines how business capabilities identified in Prompt 16 are supported by enterprise information assets.

This is an Enterprise Architecture artefact aligned with TOGAF Information Architecture principles.

---

## 2. Scope

| In Scope | Out of Scope |
|----------|-------------|
| Business Information Model | Physical ERD |
| Enterprise Data Domains | SQL implementation |
| Logical Information Entities | ORM mapping |
| Master Data Model | API design |
| Reference Data Model | Frontend designs |
| Metadata Architecture | Implementation code |
| Data Lineage Model | |
| Information Lifecycle Model | |
| Data Ownership & Governance | |
| Enterprise Data Roadmap | |

---

## 3. Enterprise Information Assessment

| Area | Current Maturity | Target Maturity | Evidence |
|------|------------------|-----------------|----------|
| Data Architecture | 3 Defined | 4 Managed | 6 schemas, 72 tables, clear domain separation |
| Metadata | 2 Repeatable | 3 Defined | Only technical metadata via information_schema |
| Lineage | 1 Initial | 3 Defined | No formal lineage tracking |
| Governance | 2 Repeatable | 3 Defined | Basic audit trail, no formal governance |
| Quality | 2 Repeatable | 3 Defined | Basic validation, no quality framework |
| Security | 3 Defined | 4 Managed | RBAC, encryption, audit logging |

---

## 4. Key Findings

### 4.1 Information Risks

| # | Risk | Impact | Evidence |
|---|------|--------|----------|
| 1 | No formal data lineage | High | No lineage tables or tracking mechanisms |
| 2 | Limited metadata catalogue | High | Only technical metadata in information_schema |
| 3 | No data quality framework | Medium | No quality rules or monitoring |
| 4 | Schema fragmentation | Medium | engine_v14 parallel schema, OLD tables |

### 4.2 Governance Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| 1 | No data ownership model | High | No ownership tables or assignments |
| 2 | No data classification | Medium | No sensitivity labels |
| 3 | No retention policies | Medium | No retention configuration |
| 4 | No compliance framework | Medium | Basic audit only |

### 4.3 Metadata Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| 1 | No business metadata | High | No business glossary or definitions |
| 2 | No operational metadata | Medium | No SLA, quality, or usage metadata |
| 3 | No lineage metadata | High | No transformation or flow metadata |
| 4 | Limited technical metadata | Medium | Only information_schema queries |

### 4.4 Lineage Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| 1 | No source-to-target mapping | High | Manual mapping only |
| 2 | No transformation tracking | High | Views exist but lineage not captured |
| 3 | No impact analysis | Medium | No dependency tracking |
| 4 | No data flow documentation | Medium | No flow diagrams or metadata |

---

## 5. Roadmap

| Phase | Duration | Focus | Effort |
|-------|----------|-------|--------|
| Phase 1 | 0-3 Months | Foundation | 20-30 person-days |
| Phase 2 | 3-12 Months | Metadata & Lineage | 60-80 person-days |
| Phase 3 | 12-24 Months | Governance & Enterprise Data Platform | 80-100 person-days |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This document is part of the MAP Nexus Enterprise Architecture framework. It establishes the information data model that all future MAP development must follow.*