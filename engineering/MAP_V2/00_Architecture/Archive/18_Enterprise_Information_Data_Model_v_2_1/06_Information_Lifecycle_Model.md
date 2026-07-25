# Information Lifecycle Model

**Document ID:** 18-06  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the information lifecycle for all major business objects in the MAP Nexus platform.

---

## 2. Lifecycle Stages

| Stage | Description |
|-------|-------------|
| 1. Creation | Initial creation of the object |
| 2. Discovery | Automated discovery of metadata |
| 3. Classification | Classification and categorisation |
| 4. Validation | Validation of data quality |
| 5. Usage | Active usage in business processes |
| 6. Governance | Governance oversight and control |
| 7. Retention | Data retention per policy |
| 8. Archiving | Archival for long-term storage |
| 9. Disposal | Secure disposal of expired data |

---

## 3. Lifecycle Definitions

### 3.1 Project Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | API-based creation | Automated templates | Migration Lead | Validation | Name uniqueness |
| Discovery | Manual configuration | Automated discovery | Migration Engineer | Discovery engine | Schema validation |
| Classification | Not implemented | Auto-classification | Data Steward | Classification rules | — |
| Validation | Configuration validation | AI-assisted validation | System | Validation engine | Config completeness |
| Usage | Active execution | Parallel execution | Migration Engineer | Execution engine | — |
| Governance | Manual approval | Automated workflows | Governance Officer | Approval engine | Compliance |
| Retention | 7 years | Automated retention | System | Retention policy | — |
| Archiving | Not implemented | Automated archival | System | Archive policy | — |
| Disposal | Not implemented | Secure disposal | System | Disposal policy | — |

### 3.2 Dataset Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | Discovery engine | Enhanced discovery | Discovery Engine | Discovery | — |
| Discovery | Information_schema queries | Automated profiling | Discovery Engine | Profiling | — |
| Classification | Manual | Auto-classification | Data Steward | Classification | — |
| Validation | Schema validation | AI-assisted validation | System | Validation | Data types |
| Usage | Mapping and validation | Enhanced usage | Migration Engineer | — | — |
| Governance | Manual approval | Automated governance | Governance Officer | Approval | — |
| Retention | 7 years | Automated retention | System | Retention | — |
| Archiving | Not implemented | Automated archival | System | Archive | — |
| Disposal | Not implemented | Secure disposal | System | Disposal | — |

### 3.3 Rule Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | Auto/manual creation | AI-assisted creation | Migration Engineer | Discovery | Naming convention |
| Discovery | Rule discovery | Enhanced discovery | Discovery Engine | Discovery | — |
| Classification | Manual classification | Auto-classification | Migration Lead | Classification | — |
| Validation | Syntax validation | AI-assisted validation | System | Validation | Syntax correctness |
| Usage | Batch execution | Enhanced execution | System | Execution engine | — |
| Governance | Manual approval | Automated approval | Governance Officer | Approval | — |
| Retention | 7 years | Automated retention | System | Retention | — |
| Archiving | Not implemented | Automated archival | System | Archive | — |
| Disposal | Not implemented | Secure disposal | System | Disposal | — |

### 3.4 Batch Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | Engine-created | Parallel creation | Validation Engine | Pipeline | — |
| Discovery | Not applicable | — | — | — | — |
| Classification | Not implemented | Auto-classification | System | Classification | — |
| Validation | 6-step pipeline | Enhanced pipeline | System | Execution engine | — |
| Usage | Result generation | Real-time streaming | System | Streaming | — |
| Governance | Governance decision | Automated governance | Governance Officer | Decision engine | Compliance |
| Retention | 7 years | Automated retention | System | Retention | — |
| Archiving | Not implemented | Automated archival | System | Archive | — |
| Disposal | Not implemented | Secure disposal | System | Disposal | — |

### 3.5 User Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | Admin-created | SSO integration | Administrator | Validation | Username uniqueness |
| Discovery | Not applicable | — | — | — | — |
| Classification | Role-based | ABAC classification | Administrator | Classification | — |
| Validation | Credential validation | Enhanced validation | System | Auth service | — |
| Usage | Session management | Enhanced sessions | User | Session mgmt | — |
| Governance | Access review | Automated governance | Security Officer | Review | — |
| Retention | Active + 3 years | Automated retention | System | Retention | — |
| Archiving | Not implemented | Automated archival | System | Archive | — |
| Disposal | Not implemented | Secure disposal | System | Disposal | — |

### 3.6 Task Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | System/user-created | Automated creation | Programme Manager | Validation | — |
| Discovery | Not applicable | — | — | — | — |
| Classification | Manual classification | Auto-classification | Programme Manager | Classification | — |
| Validation | Dependency validation | Enhanced validation | System | Validation | — |
| Usage | Assignment and execution | Time tracking | Assignee | Task mgmt | — |
| Governance | Manual oversight | Automated governance | Programme Manager | Oversight | — |
| Retention | 3 years | Automated retention | System | Retention | — |
| Archiving | Not implemented | Automated archival | System | Archive | — |
| Disposal | Not implemented | Secure disposal | System | Disposal | — |

### 3.7 Workflow Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | Admin-created | Visual designer | Administrator | Validation | — |
| Discovery | Not applicable | — | — | — | — |
| Classification | Manual classification | Auto-classification | Administrator | Classification | — |
| Validation | Logic validation | Enhanced validation | System | Validation | — |
| Usage | Instance execution | Enhanced execution | System | Workflow engine | — |
| Governance | Manual approval | Automated approval | Administrator | Approval | — |
| Retention | 3 years | Automated retention | System | Retention | — |
| Archiving | Not implemented | Automated archival | System | Archive | — |
| Disposal | Not implemented | Secure disposal | System | Disposal | — |

### 3.8 Audit Event Lifecycle

| Stage | Current State | Target State | Owner | Controls | Quality Requirements |
|-------|---------------|--------------|-------|----------|---------------------|
| Creation | Middleware-captured | Enhanced capture | System | Middleware | — |
| Discovery | Not applicable | — | — | — | — |
| Classification | Event type classification | Enhanced classification | System | Classification | — |
| Validation | Immutability | Enhanced validation | System | Immutability | — |
| Usage | SQL queries | Real-time analytics | Auditor | Query engine | — |
| Governance | Manual review | Automated governance | Security Officer | Review | — |
| Retention | 3 years | Automated retention | System | Retention | — |
| Archiving | Not implemented | Automated archival | System | Archive | — |
| Disposal | Not implemented | Secure disposal | System | Disposal | — |

---

## 4. Lifecycle Summary

| Object | Create | Discover | Classify | Validate | Use | Govern | Retain | Archive | Dispose |
|--------|--------|----------|----------|----------|-----|--------|--------|---------|---------|
| Project | API | Manual | — | System | Engine | Manual | 7yr | Not impl | Not impl |
| Dataset | Discovery | Auto | — | System | Engine | Manual | 7yr | Not impl | Not impl |
| Rule | Auto/Manual | Auto | — | System | Engine | Manual | 7yr | Not impl | Not impl |
| Batch | Engine | — | — | System | Engine | Governance | 7yr | Not impl | Not impl |
| User | Admin | — | Role | Auth | Session | Manual | 3yr | Not impl | Not impl |
| Task | System | — | Manual | System | User | Manual | 3yr | Not impl | Not impl |
| Workflow | Admin | — | Manual | System | System | Manual | 3yr | Not impl | Not impl |
| Audit | Middleware | — | Event | System | Queries | Manual | 3yr | Not impl | Not impl |

---

## 5. Lifecycle Gaps

| # | Gap | Object | Impact | Current State | Target State |
|---|-----|--------|--------|---------------|--------------|
| 1 | No archival process | All | High | Not implemented | Automated archival |
| 2 | No disposal process | All | Medium | Not implemented | Secure disposal |
| 3 | No retention automation | All | Medium | Manual | Automated retention |
| 4 | No classification automation | All | Medium | Manual | Auto-classification |

---

## 6. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This information lifecycle model is part of the Enterprise Information & Data Model (Prompt 18 v2.1). All findings are based on source code analysis — no code was modified.*