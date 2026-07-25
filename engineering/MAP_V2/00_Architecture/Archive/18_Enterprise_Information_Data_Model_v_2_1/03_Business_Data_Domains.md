# Business Data Domains

**Document ID:** 18-03  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document identifies all business data domains in the MAP Nexus platform. Each domain is assessed for purpose, ownership, contained objects, and maturity.

---

## 2. Data Domain Definitions

### 2.1 Migration Management Domain

| Field | Value |
|-------|-------|
| **Purpose** | Manage migration projects, connections, datasets, and mappings |
| **Business Owner** | Migration Lead |
| **Information Objects** | Tenant, Project, System, Connection, Credential, Dataset, Dataset Column, Dataset Mapping, Column Mapping |
| **Current Capability** | 7 tables in core schema; Full CRUD API for connections; Discovery engine for datasets |
| **Target Capability** | Automated schema change detection; AI-assisted mapping; Connection pooling |
| **Maturity Assessment** | Current: 3 Defined; Target: 4 Managed |
| **Evidence** | core schema (7 tables); app.api.v1.core/connections.py |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 7 | 7 |
| Views | 0 | 0 |
| APIs | 2 | 4 |
| Services | 3 | 5 |
| Maturity | 3 Defined | 4 Managed |

---

### 2.2 Validation Management Domain

| Field | Value |
|-------|-------|
| **Purpose** | Execute validation rules and controls against migration data |
| **Business Owner** | Migration Lead |
| **Information Objects** | Rule, Control, Validation Batch, Control Result, Exception, Execution Result |
| **Current Capability** | 22 tables in engine schema; 6-step execution pipeline; 10 rule types |
| **Target Capability** | AI-assisted rule generation; Parallel batch execution; Real-time streaming |
| **Maturity Assessment** | Current: 4 Managed; Target: 5 Optimised |
| **Evidence** | engine schema (22 tables); app.execution_engine |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 22 | 22 |
| Views | 5 | 7 |
| APIs | 1 | 3 |
| Services | 3 | 5 |
| Maturity | 4 Managed | 5 Optimised |

---

### 2.3 Governance & Compliance Domain

| Field | Value |
|-------|-------|
| **Purpose** | Make governance decisions and manage release approvals |
| **Business Owner** | Governance Officer |
| **Information Objects** | Governance Decision, Risk Assessment, Release Decision, Approval |
| **Current Capability** | Decision engine and risk scoring; Approval workflow with CRUD API |
| **Target Capability** | Automated governance workflows; Predictive risk analytics; Release gates |
| **Maturity Assessment** | Current: 3 Defined; Target: 4 Managed |
| **Evidence** | engine.migration_governance_status; platform.approval_requests |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 8 | 8 |
| Views | 1 | 2 |
| APIs | 1 | 2 |
| Services | 3 | 4 |
| Maturity | 3 Defined | 4 Managed |

---

### 2.4 Reporting & Analytics Domain

| Field | Value |
|-------|-------|
| **Purpose** | Generate reports and dashboards from validation data |
| **Business Owner** | Programme Manager |
| **Information Objects** | Report, Dashboard, KPI, Fact, Dimension |
| **Current Capability** | 3 dimension tables; 9 SQL views; CLI export only; Frontend displays mock data |
| **Target Capability** | Reporting API; Dashboard API; Real-time analytics; Frontend integration |
| **Maturity Assessment** | Current: 2 Repeatable; Target: 4 Managed |
| **Evidence** | reporting schema (3 tables, 9 views); app.scoring_engine |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 3 | 5 |
| Views | 9 | 12 |
| APIs | 0 | 4 |
| Services | 2 | 4 |
| Maturity | 2 Repeatable | 4 Managed |

---

### 2.5 Platform Services Domain

| Field | Value |
|-------|-------|
| **Purpose** | Provide enterprise platform services (workflow, tasks, notifications, calendar) |
| **Business Owner** | Administrator |
| **Information Objects** | Workflow, Task, Notification, Calendar Event, Feature Flag, Configuration |
| **Current Capability** | 23 tables in platform schema; Full CRUD APIs for all services |
| **Target Capability** | Visual workflow designer; Time tracking; Multi-channel notifications |
| **Maturity Assessment** | Current: 4 Managed; Target: 5 Optimised |
| **Evidence** | platform schema (23 tables); app.services.* |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 23 | 23 |
| Views | 0 | 0 |
| APIs | 5 | 5 |
| Services | 5 | 5 |
| Maturity | 4 Managed | 5 Optimised |

---

### 2.6 Administration Domain

| Field | Value |
|-------|-------|
| **Purpose** | Manage users, roles, permissions, tenants |
| **Business Owner** | Administrator |
| **Information Objects** | User, Role, Permission |
| **Current Capability** | Full CRUD APIs; 47 permissions; RBAC enforcement |
| **Target Capability** | SSO integration; Dynamic role composition; ABAC |
| **Maturity Assessment** | Current: 3 Defined; Target: 4 Managed |
| **Evidence** | platform.users, platform.roles, platform.permissions |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 8 | 8 |
| Views | 0 | 0 |
| APIs | 3 | 3 |
| Services | 3 | 3 |
| Maturity | 3 Defined | 4 Managed |

---

### 2.7 Security Domain

| Field | Value |
|-------|-------|
| **Purpose** | Manage platform security, encryption, and certificates |
| **Business Owner** | Security Officer |
| **Information Objects** | Security Event |
| **Current Capability** | Security events logged in audit.security_events |
| **Target Capability** | SIEM integration; Brute force detection; Automated incident response |
| **Maturity Assessment** | Current: 2 Repeatable; Target: 4 Managed |
| **Evidence** | audit.security_events; no dedicated security API |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 1 | 1 |
| Views | 0 | 0 |
| APIs | 0 | 1 |
| Services | 0 | 1 |
| Maturity | 2 Repeatable | 4 Managed |

---

### 2.8 Audit Domain

| Field | Value |
|-------|-------|
| **Purpose** | Log and track all platform activities for compliance |
| **Business Owner** | Security Officer |
| **Information Objects** | Audit Event, Login History |
| **Current Capability** | Audit middleware logs every API call; 5 tables in audit schema |
| **Target Capability** | Real-time audit analytics; Compliance dashboards; Automated retention |
| **Maturity Assessment** | Current: 2 Repeatable; Target: 4 Managed |
| **Evidence** | audit schema (5 tables); app.api.core.middleware.audit_middleware |

**Domain Summary:**

| Metric | Current | Target |
|--------|---------|--------|
| Tables | 5 | 5 |
| Views | 0 | 1 |
| APIs | 0 | 1 |
| Services | 1 | 2 |
| Maturity | 2 Repeatable | 4 Managed |

---

## 3. Domain Summary

| # | Domain | Tables | Views | APIs | Services | Current | Target |
|---|--------|--------|-------|------|----------|---------|--------|
| 1 | Migration Management | 7 | 0 | 2 | 3 | 3 Defined | 4 Managed |
| 2 | Validation Management | 22 | 5 | 1 | 3 | 4 Managed | 5 Optimised |
| 3 | Governance & Compliance | 8 | 1 | 1 | 3 | 3 Defined | 4 Managed |
| 4 | Reporting & Analytics | 3 | 9 | 0 | 2 | 2 Repeatable | 4 Managed |
| 5 | Platform Services | 23 | 0 | 5 | 5 | 4 Managed | 5 Optimised |
| 6 | Administration | 8 | 0 | 3 | 3 | 3 Defined | 4 Managed |
| 7 | Security | 1 | 0 | 0 | 0 | 2 Repeatable | 4 Managed |
| 8 | Audit | 5 | 0 | 0 | 1 | 2 Repeatable | 4 Managed |
| **Total** | | **77** | **15** | **12** | **20** | **3.0 Avg** | **4.4 Avg** |

---

## 4. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*These business data domains are part of the Enterprise Information & Data Model (Prompt 18 v2.1). All findings are based on source code analysis — no code was modified.*