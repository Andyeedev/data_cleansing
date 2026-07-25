# RACI Matrices

**Document ID:** 17-06  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides RACI (Responsible, Accountable, Consulted, Informed) matrices for every business process, using only actual platform roles identified in the codebase.

---

## 2. RACI Definitions

| Letter | Definition | Description |
|--------|------------|-------------|
| R | Responsible | Does the work |
| A | Accountable | Owns the outcome |
| C | Consulted | Provides input |
| I | Informed | Receives updates |

---

## 3. Platform Roles

**Evidence:** platform.roles, platform.permissions (47 permissions), app.services.role_service

| # | Role | Description | Source |
|---|------|-------------|--------|
| 1 | Migration Lead | Leads migration projects | platform.roles (role assignment) |
| 2 | Migration Engineer | Executes migration tasks | platform.roles (role assignment) |
| 3 | Governance Officer | Manages governance and compliance | platform.roles (role assignment) |
| 4 | Compliance Officers | Reviews compliance | platform.roles (role assignment) |
| 5 | Programme Manager | Oversees programme | platform.roles (role assignment) |
| 6 | Programme Sponsor | Executive oversight | platform.roles (role assignment) |
| 7 | Administrator | Manages platform | platform.roles (role assignment) |
| 8 | Security Officer | Manages security | platform.roles (role assignment) |
| 9 | Auditors | Reviews audit trail | platform.roles (role assignment) |
| 10 | Security Analysts | Analyses security | platform.roles (role assignment) |
| 11 | DevOps | Manages infrastructure | platform.roles (role assignment) |
| 12 | BI Team | Manages reporting | platform.roles (role assignment) |
| 13 | AI Team | Manages AI features | platform.roles (role assignment) |

---

## 4. RACI Matrices

### 4.1 Migration Management Processes

**Evidence:** app.execution_engine, app/api/v1/core/connections.py, app.discovery, app.services.mapping_resolver

| Process | Migration Engineer | Migration Lead | Governance Officer | Programme Manager | Security Officer | Administrator |
|---------|-------------------|----------------|-------------------|-------------------|------------------|---------------|
| Migration Project Lifecycle | R | A | C | I | — | — |
| Connection Onboarding | R | A | — | — | C | — |
| Credential Onboarding | R | A | — | — | C | — |
| Dataset Discovery | R | A | — | — | — | — |
| Column Discovery | R | A | — | — | — | — |
| Mapping Lifecycle | R | A | — | — | — | — |

---

### 4.2 Validation Management Processes

**Evidence:** app.execution_engine, app.discovery.auto_rule_discovery, app.execution.control_executor

| Process | Migration Engineer | Migration Lead | Governance Officer | Programme Manager | Security Officer | Administrator |
|---------|-------------------|----------------|-------------------|-------------------|------------------|---------------|
| Rule Authoring | R | A | C | — | — | — |
| Rule Approval | R | A | C | — | — | — |
| Rule Execution | R | A | — | — | — | — |
| Control Lifecycle | R | A | — | — | — | — |
| Validation Execution | R | A | C | I | — | — |
| Exception Management | R | A | C | — | — | — |
| Issue Remediation | R | A | — | — | — | — |

---

### 4.3 Governance & Compliance Processes

**Evidence:** app.governance.decision_engine, app.governance.risk_scoring, app.services.approval_service

| Process | Migration Engineer | Migration Lead | Governance Officer | Programme Manager | Security Officer | Administrator |
|---------|-------------------|----------------|-------------------|-------------------|------------------|---------------|
| Governance | C | I | R/A | I | — | — |
| Release Approval | — | I | R | A | C | — |

---

### 4.4 Reporting & Analytics Processes

**Evidence:** reporting schema (SQL views), app.audit_export, app.scoring_engine

| Process | Migration Engineer | Migration Lead | Governance Officer | Programme Manager | Security Officer | Administrator |
|---------|-------------------|----------------|-------------------|-------------------|------------------|---------------|
| Reporting | C | C | C | R/A | — | — |
| Dashboard Production | — | — | C | R/A | — | — |

---

### 4.5 Platform Service Processes

**Evidence:** app.services.workflow_service, app.services.task_service, app.services.notification_service, app.services.calendar_service

| Process | Migration Engineer | Migration Lead | Governance Officer | Programme Manager | Security Officer | Administrator |
|---------|-------------------|----------------|-------------------|-------------------|------------------|---------------|
| Notifications | — | — | — | — | — | R/A |
| Scheduling | — | — | — | — | — | R/A |
| Workflow Management | R | I | — | C | — | A |
| Task Management | R | I | — | A | — | — |
| Customer Onboarding | — | — | — | — | C | R/A |
| Authentication | — | — | — | — | R/A | C |

---

### 4.6 Administration Processes

**Evidence:** app.services.user_service, app.services.role_service, core.tenants, app.services.settings_service, audit.audit_events

| Process | Migration Engineer | Migration Lead | Governance Officer | Programme Manager | Security Officer | Administrator |
|---------|-------------------|----------------|-------------------|-------------------|------------------|---------------|
| User Lifecycle | — | — | — | — | C | R/A |
| Role Administration | — | — | — | — | C | R/A |
| Tenant Management | — | — | — | — | C | R/A |
| Security Administration | — | — | C | — | R/A | C |
| Audit Lifecycle | — | — | C | — | R/A | C |
| Platform Administration | — | — | — | — | — | R/A |

---

## 5. Actor Summary

| Actor | Processes as R | Processes as A | Total R+A |
|-------|---------------|----------------|-----------|
| Migration Engineer | 12 | 0 | 12 |
| Migration Lead | 0 | 12 | 12 |
| Governance Officer | 1 | 1 | 2 |
| Programme Manager | 2 | 3 | 5 |
| Security Officer | 2 | 2 | 4 |
| Administrator | 4 | 9 | 13 |

---

## 6. RACI Statistics

| Metric | Count |
|--------|-------|
| Total Processes | 29 |
| Total Actors | 6 |
| R Assignments | 29 |
| A Assignments | 29 |
| C Assignments | 18 |
| I Assignments | 8 |

---

## 7. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This RACI matrix is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*