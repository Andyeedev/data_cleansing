# Process Maturity Assessment

**Document ID:** 17-07  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document assesses every business process using CMMI-style maturity levels, with evidence-based justification for each score.

---

## 2. Maturity Levels

| Level | Level Name | Definition |
|-------|------------|------------|
| 1 | Initial | Ad-hoc, no process |
| 2 | Repeatable | Some processes exist, not standardised |
| 3 | Defined | Standard processes documented |
| 4 | Managed | Measured and controlled |
| 5 | Optimised | Continuous improvement |

---

## 3. Maturity Assessment

### 3.1 Migration Management Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 1 | Migration Project Lifecycle | 3 Defined | Project configuration exists in app.execution_engine; core.dataset_mappings references project_id; semi-automated process with config-driven execution | app.execution_engine (project config), core.dataset_mappings (project_id), engine.migration_validation_batch (project tracking) |
| 2 | Connection Onboarding | 4 Managed | Full CRUD API at /api/v1/core/connections; encrypted credentials in core.system_credentials; connection testing implemented; API response standardised | app/api/v1/core/connections.py (CRUD API), core.system_registry, core.system_credentials (encrypted), Fernet encryption |
| 3 | Credential Onboarding | 4 Managed | Fernet encryption for credentials; encrypted storage in core.system_credentials; credential access logged in audit_events | core.system_credentials (encrypted), Fernet encryption, audit_events (credential access) |
| 4 | Dataset Discovery | 3 Defined | Working in app.discovery.auto_rule_discovery; queries information_schema; CLI-only, no API; no frontend | app.discovery.auto_rule_discovery (information_schema), core.dataset_mappings, core.dataset_columns |
| 5 | Column Discovery | 3 Defined | Working in app.services.dataset_discovery_service; queries column metadata; semi-automated process | app.services.dataset_discovery_service (column queries), core.dataset_columns |
| 6 | Mapping Lifecycle | 3 Defined | Working in app.services.mapping_resolver; runtime resolution; auto-created during discovery; no manual API | app.services.mapping_resolver (runtime), core.dataset_mappings, core.column_mappings |

---

### 3.2 Validation Management Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 7 | Rule Authoring | 3 Defined | 10 rule types (C01-C010) implemented; auto-generated during execution; engine.rule_registry stores rules | app.discovery.auto_rule_discovery (rule generation), engine.rule_registry (10 rule types) |
| 8 | Rule Approval | 2 Repeatable | No approval workflow implementation found; rules auto-generated during execution without explicit approval step | No approval workflow in codebase; rules auto-generated |
| 9 | Rule Execution | 4 Managed | Automated execution within 6-step pipeline; results stored in engine.migration_control_summary; parallel execution supported | app.execution_engine (pipeline), app.execution.control_executor, engine.migration_control_summary |
| 10 | Control Lifecycle | 3 Defined | Working in app.execution.control_executor; fetches enabled controls from engine.control_registry; dispatches to control classes | app.execution.control_executor (dispatch), engine.control_registry (storage) |
| 11 | Validation Execution | 4 Managed | 6-step pipeline implemented; parallel execution; checkpointing via engine.batch_execution_checkpoint; retry via rule_retry_manager; API at /api/v1/engine/trigger | app.execution_engine (6-step pipeline), engine.batch_execution_checkpoint, rule_retry_manager |
| 12 | Exception Management | 3 Defined | engine.v_migration_exception_detail view provides exception data; no dedicated exception management API; exceptions logged during execution | engine.v_migration_exception_detail (view), execution logging |
| 13 | Issue Remediation | 2 Repeatable | Manual process; no automation found in codebase; issue tracking via Task Management platform | No automation in codebase; Task Management platform |

---

### 3.3 Governance & Compliance Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 14 | Governance | 3 Defined | Working in app.governance.decision_engine; auto post-execution; no dedicated API; frontend displays mock data | app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status |
| 15 | Release Approval | 4 Managed | Full CRUD API at /api/v1/platform/approvals; multi-step approval workflow; RBAC enforcement; approval decisions tracked | app.services.approval_service (CRUD API), platform.approval_requests, platform.approval_step_instances |

---

### 3.4 Reporting & Analytics Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 16 | Reporting | 2 Repeatable | SQL views exist in reporting schema (5 views); app.audit_export provides CLI export; no API endpoints; frontend displays mock data | reporting schema (5 SQL views), app.audit_export (CLI), no API |
| 17 | Dashboard Production | 2 Repeatable | SQL views exist in reporting schema (fact views); app.scoring_engine calculates KPIs; no API endpoints; frontend displays mock data | reporting.v_fact_batch (SQL view), app.scoring_engine, no API |

---

### 3.5 Platform Service Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 18 | Notifications | 4 Managed | Full CRUD API at /api/v1/platform/notifications; platform.notifications stores records; platform.notification_preferences stores preferences; subscribed to 19 event types | app.services.notification_service (CRUD API), platform.notifications, platform.notification_preferences |
| 19 | Scheduling | 4 Managed | Full CRUD API at /api/v1/platform/calendar; platform.calendar_events stores events; platform.calendar_event_reminders manages reminders | app.services.calendar_service (CRUD API), platform.calendar_events, platform.calendar_event_reminders |
| 20 | Workflow Management | 4 Managed | Full CRUD API at /api/v1/platform/workflows; platform.workflow_definitions stores definitions; platform.workflow_instances tracks execution | app.services.workflow_service (CRUD API), platform.workflow_definitions, platform.workflow_instances |
| 21 | Task Management | 4 Managed | Full CRUD API at /api/v1/platform/tasks; platform.tasks stores records; platform.task_comments tracks comments; platform.task_dependencies manages dependencies | app.services.task_service (CRUD API), platform.tasks, platform.task_comments, platform.task_dependencies |
| 28 | Customer Onboarding | 3 Defined | Authentication implemented; JWT tokens issued; rate limiting on login endpoint (5/minute); no dedicated onboarding workflow | app.services.auth_service, JWT tokens, rate limiting (5/minute) |
| 29 | Authentication | 4 Managed | bcrypt password hashing via passlib; JWT tokens with configurable expiry; refresh tokens managed; rate limiting enforced | app.services.auth_service (passlib bcrypt), platform.refresh_tokens, rate limiting |

---

### 3.6 Administration Processes

| # | Process | Current Level | Justification | Evidence |
|---|---------|---------------|---------------|----------|
| 22 | User Lifecycle | 3 Defined | Full CRUD API at /api/v1/platform/users; platform.users stores records; platform.user_roles manages assignments; no dedicated lifecycle workflow | app.services.user_service (CRUD API), platform.users, platform.user_roles |
| 23 | Role Administration | 3 Defined | Full CRUD API at /api/v1/platform/roles; platform.roles stores definitions; platform.permissions stores 47 permissions; platform.role_permissions manages assignments | app.services.role_service (CRUD API), platform.roles, platform.permissions (47), platform.role_permissions |
| 24 | Tenant Management | 2 Repeatable | core.tenants table exists; no API endpoints; frontend displays mock data; tenant_id referenced in JWT tokens | core.tenants (table exists), no API, frontend mock |
| 25 | Security Administration | 2 Repeatable | audit.security_events stores events; no dedicated security management API; frontend displays mock data | audit.security_events, no API, frontend mock |
| 26 | Audit Lifecycle | 2 Repeatable | app.api.core.middleware.audit_middleware logs every API call; audit.audit_events stores records; no dedicated audit API; frontend displays mock data | audit_middleware, audit.audit_events, audit.api_call_log, no API |
| 27 | Platform Administration | 3 Defined | app.services.settings_service provides CRUD API; app.health provides health endpoints; platform.system_settings stores configuration; platform.feature_flags stores toggles | app.services.settings_service (CRUD API), app.health, platform.system_settings, platform.feature_flags |

---

## 4. Maturity Summary

| Level | Count | Percentage | Processes |
|-------|-------|------------|-----------|
| 5 Optimised | 0 | 0% | — |
| 4 Managed | 8 | 28% | Connection Onboarding, Credential Onboarding, Rule Execution, Validation Execution, Release Approval, Notifications, Scheduling, Workflow Management, Task Management, Authentication |
| 3 Defined | 12 | 41% | Migration Project Lifecycle, Dataset Discovery, Column Discovery, Mapping Lifecycle, Rule Authoring, Control Lifecycle, Exception Management, Governance, User Lifecycle, Role Administration, Platform Administration, Customer Onboarding |
| 2 Repeatable | 9 | 31% | Rule Approval, Issue Remediation, Reporting, Dashboard Production, Tenant Management, Security Administration, Audit Lifecycle |
| 1 Initial | 0 | 0% | — |

---

## 5. Maturity Statistics

| Metric | Value |
|--------|-------|
| Average Current Maturity | 3.2 |
| Processes at Level 4+ | 8 (28%) |
| Processes at Level 3 | 12 (41%) |
| Processes below Level 3 | 9 (31%) |
| Highest Maturity | 4 (Managed) |
| Lowest Maturity | 2 (Repeatable) |

---

## 6. Maturity by Domain

| Domain | Average Maturity | Level 4+ | Level 3 | Below Level 3 |
|--------|------------------|----------|---------|---------------|
| Migration Management | 3.5 | 2 | 4 | 0 |
| Validation Management | 3.0 | 2 | 3 | 2 |
| Governance & Compliance | 3.5 | 1 | 1 | 0 |
| Reporting & Analytics | 2.0 | 0 | 0 | 2 |
| Platform Services | 3.8 | 4 | 2 | 0 |
| Administration | 2.5 | 0 | 3 | 4 |

---

## 7. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This maturity assessment is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*