# Automation Assessment

**Document ID:** 17-08  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document assesses the automation level of every business process, with evidence from the codebase.

---

## 2. Automation Levels

| Level | Level Name | Definition |
|-------|------------|------------|
| 0 | Manual | Fully manual, no automation |
| 1 | Assisted | Some tools, mostly manual |
| 2 | Semi-Automated | Significant automation, some manual intervention |
| 3 | Automated | Fully automated with minimal intervention |

---

## 3. Automation Assessment

### 3.1 Migration Management Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 1 | Migration Project Lifecycle | 2 Semi-Automated | Config-driven execution; semi-automated process; project configuration in YAML; manual team assignment | app.execution_engine (config-driven), core.dataset_mappings (project_id), manual team assignment |
| 2 | Connection Onboarding | 2 Semi-Automated | Full CRUD API; manual credential entry; automated connection testing; encrypted storage | app/api/v1/core/connections.py (CRUD API), core.system_credentials (encrypted), manual credential entry |
| 3 | Credential Onboarding | 2 Semi-Automated | Manual credential entry; automated encryption; automated storage | manual credential entry, Fernet encryption, core.system_credentials |
| 4 | Dataset Discovery | 2 Semi-Automated | Automated schema queries; manual trigger; CLI-only; no API | app.discovery.auto_rule_discovery (automated queries), manual trigger, CLI-only |
| 5 | Column Discovery | 2 Semi-Automated | Automated column queries; semi-automated classification; manual review | app.services.dataset_discovery_service (automated queries), semi-automated classification |
| 6 | Mapping Lifecycle | 2 Semi-Automated | Auto-created during discovery; manual review; runtime resolution | app.services.mapping_resolver (runtime), auto-created mappings, manual review |

---

### 3.2 Validation Management Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 7 | Rule Authoring | 2 Semi-Automated | Auto-generated rules; manual configuration; 10 rule types | app.discovery.auto_rule_discovery (auto-generation), manual configuration, engine.rule_registry |
| 8 | Rule Approval | 0 Manual | No approval workflow; fully manual process | No approval workflow in codebase |
| 9 | Rule Execution | 3 Automated | Fully automated execution within pipeline; parallel execution; minimal intervention | app.execution_engine (pipeline), parallel execution, minimal intervention |
| 10 | Control Lifecycle | 2 Semi-Automated | Automated control discovery; manual configuration; automated dispatch | app.execution.control_executor (automated), manual configuration |
| 11 | Validation Execution | 3 Automated | Fully automated 6-step pipeline; parallel execution; checkpointing; retry; minimal intervention | app.execution_engine (6-step pipeline), parallel, checkpointing, retry |
| 12 | Exception Management | 2 Semi-Automated | Automated exception logging; manual review; manual remediation | automated logging, manual review, manual remediation |
| 13 | Issue Remediation | 0 Manual | Fully manual process; no automation | No automation in codebase |

---

### 3.3 Governance & Compliance Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 14 | Governance | 2 Semi-Automated | Automated governance calculation; manual decision review; auto post-execution | app.governance.decision_engine (automated), manual review |
| 15 | Release Approval | 2 Semi-Automated | Full CRUD API; manual approval decisions; multi-step workflow | app.services.approval_service (CRUD API), manual decisions |

---

### 3.4 Reporting & Analytics Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 16 | Reporting | 1 Assisted | SQL views exist; manual report generation; CLI export; no API | reporting schema (SQL views), manual generation, app.audit_export (CLI) |
| 17 | Dashboard Production | 1 Assisted | SQL views exist; manual dashboard refresh; no API | reporting schema (SQL views), manual refresh, no API |

---

### 3.5 Platform Service Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 18 | Notifications | 3 Automated | Fully automated notification delivery; event-driven; preference-based; minimal intervention | app.services.notification_service (automated), event-driven, platform.notification_preferences |
| 19 | Scheduling | 3 Automated | Fully automated event scheduling; reminder delivery; minimal intervention | app.services.calendar_service (automated), platform.calendar_event_reminders |
| 20 | Workflow Management | 3 Automated | Fully automated workflow execution; step-by-step processing; minimal intervention | app.services.workflow_service (automated), platform.workflow_instances |
| 21 | Task Management | 3 Automated | Fully automated task assignment; status tracking; dependency management; minimal intervention | app.services.task_service (automated), platform.tasks, platform.task_dependencies |
| 28 | Customer Onboarding | 2 Semi-Automated | Automated authentication; manual credential entry; rate limiting | app.services.auth_service (automated), manual entry, rate limiting |
| 29 | Authentication | 3 Automated | Fully automated authentication; JWT issuance; token management; rate limiting | app.services.auth_service (automated), JWT, rate limiting |

---

### 3.6 Administration Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 22 | User Lifecycle | 2 Semi-Automated | Automated user creation; manual role assignment; no lifecycle automation | app.services.user_service (automated), manual role assignment |
| 23 | Role Administration | 2 Semi-Automated | Automated role creation; manual permission assignment; no automation | app.services.role_service (automated), manual permission assignment |
| 24 | Tenant Management | 0 Manual | Fully manual process; no API; frontend mock | No API, frontend mock |
| 25 | Security Administration | 0 Manual | Fully manual process; no API; frontend mock | No API, frontend mock |
| 26 | Audit Lifecycle | 1 Assisted | Middleware logging; manual review; no API; frontend mock | audit_middleware (logging), manual review, no API |
| 27 | Platform Administration | 2 Semi-Automated | Automated settings update; manual health monitoring; semi-automated | app.services.settings_service (automated), manual monitoring |

---

## 4. Automation Summary

| Level | Count | Percentage | Processes |
|-------|-------|------------|-----------|
| 3 Automated | 6 | 21% | Rule Execution, Validation Execution, Notifications, Scheduling, Workflow Management, Task Management, Authentication |
| 2 Semi-Automated | 14 | 48% | Migration Project Lifecycle, Connection Onboarding, Credential Onboarding, Dataset Discovery, Column Discovery, Mapping Lifecycle, Rule Authoring, Control Lifecycle, Exception Management, Governance, Release Approval, User Lifecycle, Role Administration, Platform Administration, Customer Onboarding |
| 1 Assisted | 2 | 7% | Reporting, Dashboard Production, Audit Lifecycle |
| 0 Manual | 7 | 24% | Rule Approval, Issue Remediation, Tenant Management, Security Administration |

---

## 5. Automation Statistics

| Metric | Value |
|--------|-------|
| Average Automation Level | 1.9 |
| Processes at Level 3 | 6 (21%) |
| Processes at Level 2 | 14 (48%) |
| Processes at Level 1 | 2 (7%) |
| Processes at Level 0 | 7 (24%) |

---

## 6. Automation by Domain

| Domain | Average Automation | Level 3 | Level 2 | Level 1 | Level 0 |
|--------|-------------------|---------|---------|---------|---------|
| Migration Management | 2.0 | 0 | 6 | 0 | 0 |
| Validation Management | 1.7 | 2 | 3 | 0 | 2 |
| Governance & Compliance | 2.0 | 0 | 2 | 0 | 0 |
| Reporting & Analytics | 1.0 | 0 | 0 | 2 | 0 |
| Platform Services | 2.8 | 4 | 2 | 0 | 0 |
| Administration | 1.0 | 0 | 3 | 1 | 3 |

---

## 7. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This automation assessment is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*