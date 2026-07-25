# Executive Summary — Enterprise Information & Data Model

**Document ID:** 18  
**Version:** 2.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document summarises the **Enterprise Information & Data Model** for the MAP Nexus™ platform. It defines HOW the 34 business capabilities identified in Prompt 16 are supported by enterprise data assets, logical entities, master data, metadata, lineage, ownership, governance and information lifecycle.

This is an enterprise architecture deliverable, **not** a software design document.

---

## 2. Scope

| In Scope | Out of Scope |
|----------|-------------|
| Business Information Model | Physical ERD |
| Enterprise Data Domains | SQL implementation |
| Logical Data Model | ORM mapping |
| Master & Reference Data | API design |
| Metadata Architecture | Frontend components |
| Data Lineage | |
| Information Lifecycle | |
| Data Governance | |
| Ownership Model | |
| Enterprise Data Roadmap | |

---

## 3. Enterprise Information Statistics

| Metric | Value |
|--------|-------|
| PostgreSQL Schemas | 6 |
| Active Tables | 72 |
| SQL Views | 11 |
| Business Data Domains | 8 |
| Logical Entities | 32 |
| Master Data Entities | 12 |
| Reference Data Sets | 8 |
| Metadata Entities | 7 |
| Lineage Relationships | 4 |
| Information Owners | 6 |
| Data Stewards | 4 |

---

## 4. Current State Assessment

| Dimension | Level | Description |
|-----------|-------|-------------|
| Schema Design | 3 Defined | 6 schemas with clear separation of concerns |
| Master Data | 3 Defined | Core master entities exist (tenants, projects, users, roles) |
| Reference Data | 2 Repeatable | Some reference data (status, severity, rule types) |
| Metadata | 2 Repeatable | Limited technical metadata, no business metadata |
| Lineage | 1 Initial | No formal lineage tracking |
| Governance | 2 Repeatable | Basic audit trail, no formal governance |
| Quality | 2 Repeatable | Basic validation, no quality framework |
| Security | 3 Defined | RBAC, encryption, audit logging |

---

## 5. Target State Assessment

| Dimension | Target Level | Description |
|-----------|--------------|-------------|
| Schema Design | 4 Managed | Fully normalised, documented, versioned |
| Master Data | 4 Managed | MDM with quality rules, stewardship |
| Reference Data | 4 Managed | Centralised reference data management |
| Metadata | 3 Defined | Business + technical metadata catalogue |
| Lineage | 3 Defined | End-to-end lineage tracking |
| Governance | 3 Defined | Formal governance framework |
| Quality | 3 Defined | Data quality monitoring and reporting |
| Security | 4 Managed | Classification, sensitivity, compliance |

---

## 6. Key Findings

### 6.1 Top Information Risks

| # | Risk | Impact | Evidence |
|---|------|--------|----------|
| 1 | No formal data lineage | High | No lineage tables or tracking mechanisms |
| 2 | Limited metadata catalogue | High | Only technical metadata in information_schema |
| 3 | No data quality framework | Medium | No quality rules or monitoring |
| 4 | Schema fragmentation | Medium | engine_v14 parallel schema, OLD tables |

### 6.2 Top Governance Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| 1 | No data ownership model | High | No ownership tables or assignments |
| 2 | No data classification | Medium | No sensitivity labels |
| 3 | No retention policies | Medium | No retention configuration |
| 4 | No compliance framework | Medium | Basic audit only |

### 6.3 Top Metadata Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| 1 | No business metadata | High | No business glossary or definitions |
| 2 | No operational metadata | Medium | No SLA, quality, or usage metadata |
| 3 | No lineage metadata | High | No transformation or flow metadata |
| 4 | Limited technical metadata | Medium | Only information_schema queries |

### 6.4 Top Lineage Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| 1 | No source-to-target mapping | High | Manual mapping only |
| 2 | No transformation tracking | High | Views exist but lineage not captured |
| 3 | No impact analysis | Medium | No dependency tracking |
| 4 | No data flow documentation | Medium | No flow diagrams or metadata |

---

## 7. Roadmap Summary

| Phase | Duration | Focus | Effort |
|-------|----------|-------|--------|
| Phase 1 | 0-3 Months | Quick Wins | 20-30 person-days |
| Phase 2 | 3-6 Months | Metadata | 40-50 person-days |
| Phase 3 | 6-12 Months | Governance | 40-50 person-days |
| Phase 4 | 12-18 Months | Enterprise Data Platform | 40-50 person-days |

---

## 8. Supporting Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | Executive Summary | This document |
| 02 | Enterprise Information Model | Business information objects |
| 03 | Business Data Domains | Domain catalogue |
| 04 | Master Reference Data Model | Master and reference data |
| 05 | Logical Data Model | Logical entities and relationships |
| 06 | Information Lifecycle Model | Data lifecycle management |
| 07 | Data Lineage Model | Data flow and lineage |
| 08 | Metadata Model | Metadata architecture |
| 09 | Data Ownership Governance | Governance framework |
| 10 | Enterprise Data Roadmap | Improvement roadmap |

---

## 9. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This document is part of the MAP Nexus Enterprise Architecture framework. It establishes the information data model that all future MAP development must follow.*
