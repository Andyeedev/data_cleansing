# Capability to Process Traceability

**Document ID:** 17-05  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides a complete matrix mapping every business capability from Prompt 16 to its corresponding business processes, ensuring no orphan capabilities.

---

## 2. Traceability Requirement

Every capability identified in Prompt 16 must map to one or more business processes. No orphan capabilities are permitted.

---

## 3. Traceability Matrix

### 3.1 Migration Management Domain

| # | Capability | Business Process | Sub-Process | Activity | Evidence |
|---|-----------|------------------|-------------|----------|----------|
| 1.1 | Project Management | Migration Project Lifecycle | Project Setup | Create Project | app.execution_engine (project config), core.dataset_mappings (project_id) |
| 1.2 | Connection Management | Connection Onboarding | Configure Connection | Store Connection | app/api/v1/core/connections.py (CRUD API), core.system_registry |
| 1.3 | Dataset Discovery | Dataset Discovery | Execute Discovery | Query Source Schema | app.discovery.auto_rule_discovery (information_schema), core.dataset_mappings |
| 1.4 | Dataset Mapping | Mapping Lifecycle | Create Table Mappings | Store Mapping | app.services.mapping_resolver (runtime), core.dataset_mappings |
| 1.5 | Column Mapping | Mapping Lifecycle | Create Column Mappings | Store Mapping | app.services.dataset_discovery_service, core.column_mappings |

### 3.2 Validation Management Domain

| # | Capability | Business Process | Sub-Process | Activity | Evidence |
|---|-----------|------------------|-------------|----------|----------|
| 2.1 | Rule Discovery | Rule Authoring | Define Rules | Store Rule | app.discovery.auto_rule_discovery (rule generation), engine.rule_registry |
| 2.2 | Control Discovery | Control Lifecycle | Discover Controls | Query Control Registry | app.execution.control_executor, engine.control_registry |
| 2.3 | Validation Execution | Validation Execution | Step 5: Control Execution | Execute Controls | app.execution_engine (6-step pipeline), engine.migration_validation_batch |
| 2.4 | Checkpointing | Validation Execution | Step 5: Control Execution | Checkpointing | engine.batch_execution_checkpoint, execution_engine |
| 2.5 | Retry Engine | Validation Execution | Step 5: Control Execution | Retry Failed Controls | app.orchestration.retry.rule_retry_manager |

### 3.3 Governance & Compliance Domain

| # | Capability | Business Process | Sub-Process | Activity | Evidence |
|---|-----------|------------------|-------------|----------|----------|
| 3.1 | Governance Decisions | Governance | Evaluate Governance | Make Governance Decision | app.governance.decision_engine, engine.migration_governance_status |
| 3.2 | Risk Scoring | Governance | Calculate Risk | Calculate Risk Scores | app.governance.risk_scoring, engine.migration_risk_scores |
| 3.3 | Release Gates | Governance | Make Decision | Evaluate Against Thresholds | app.execution_engine (auto post-execution), engine.migration_release_decision |
| 3.4 | Approvals | Release Approval | Review Approval | Make Decision | app.services.approval_service, platform.approval_requests |

### 3.4 Reporting & Analytics Domain

| # | Capability | Business Process | Sub-Process | Activity | Evidence |
|---|-----------|------------------|-------------|----------|----------|
| 4.1 | Executive Reporting | Reporting | Generate Report | Query Data | reporting.v_migration_executive_summary (SQL view), app.audit_export |
| 4.2 | Operational Reporting | Reporting | Generate Report | Query Data | reporting.v_migration_control_summary (SQL view), app.audit_export |
| 4.3 | Governance Reporting | Reporting | Generate Report | Query Data | reporting.v_migration_governance_report (SQL view), app.audit_export |
| 4.4 | Technical Reporting | Reporting | Generate Report | Query Data | reporting.v_migration_exception_detail (SQL view), app.audit_export |
| 4.5 | Dashboard Services | Dashboard Production | Generate Dashboard | Calculate KPIs | reporting.v_fact_batch (SQL view), app.scoring_engine |
| 4.6 | Export Services | Reporting | Distribute Report | Export Report | app.audit_export (CLI export) |

### 3.5 Platform Services Domain

| # | Capability | Business Process | Sub-Process | Activity | Evidence |
|---|-----------|------------------|-------------|----------|----------|
| 5.1 | Workflow Management | Workflow Management | Execute Workflow | Execute Steps | app.services.workflow_service (CRUD API), platform.workflow_instances |
| 5.2 | Task Management | Task Management | Execute Task | Update Status | app.services.task_service (CRUD API), platform.tasks |
| 5.3 | Notification Services | Notifications | Deliver Notification | Deliver Notification | app.services.notification_service (CRUD API), platform.notifications |
| 5.4 | Calendar Services | Scheduling | Send Reminders | Send Reminder | app.services.calendar_service (CRUD API), platform.calendar_event_reminders |
| 5.5 | AI / MAP Copilot | — | — | — | No backend API; frontend-local mock only |
| 5.6 | Authentication | Customer Onboarding | Authenticate User | Verify Credentials | app.services.auth_service, platform.users |

### 3.6 Administration Domain

| # | Capability | Business Process | Sub-Process | Activity | Evidence |
|---|-----------|------------------|-------------|----------|----------|
| 6.1 | User Management | User Lifecycle | Create User | Enter User Details | app.services.user_service (CRUD API), platform.users |
| 6.2 | Role & Permission Management | Role Administration | Create Role | Assign Permissions | app.services.role_service (CRUD API), platform.role_permissions |
| 6.3 | Tenant Management | Tenant Management | Create Tenant | Store Tenant | core.tenants (table exists), no API |
| 6.4 | System Settings | Platform Administration | Manage Configuration | Update Settings | app.services.settings_service (CRUD API), platform.system_settings |
| 6.5 | Feature Flags | Platform Administration | Manage Features | Toggle Feature Flags | app.services.settings_service (list API), platform.feature_flags |
| 6.6 | Security Management | Security Administration | Manage Security | Manage Encryption | audit.security_events (table exists), no API |
| 6.7 | Audit Trail | Audit Lifecycle | Capture Event | Store Event | app.api.core.middleware.audit_middleware, audit.audit_events |
| 6.8 | Maintenance & Health | Platform Administration | Monitor Health | Run Health Checks | app.health (health endpoints) |

---

## 4. Capability Coverage Summary

| Domain | Capabilities | Covered | Orphan | Coverage |
|--------|--------------|---------|--------|----------|
| Migration Management | 5 | 5 | 0 | 100% |
| Validation Management | 5 | 5 | 0 | 100% |
| Governance & Compliance | 4 | 4 | 0 | 100% |
| Reporting & Analytics | 6 | 6 | 0 | 100% |
| Platform Services | 6 | 5 | 1 | 83% |
| Administration | 8 | 8 | 0 | 100% |
| **Total** | **34** | **33** | **1** | **97%** |

---

## 5. Orphan Capability Analysis

| # | Capability | Status | Reason | Recommendation |
|---|-----------|--------|--------|----------------|
| 5.5 | AI / MAP Copilot | ORPHAN | Frontend-local mock only; no backend API; no Python module; no database tables | Define process when backend is implemented; currently proposed capability |

---

## 6. Process Coverage Analysis

| # | Process | Capabilities Covered | Evidence |
|---|---------|---------------------|----------|
| 1 | Migration Project Lifecycle | 1.1 | Project Management |
| 2 | Connection Onboarding | 1.2 | Connection Management |
| 3 | Credential Onboarding | 1.2 (part) | Credential storage |
| 4 | Dataset Discovery | 1.3 | Dataset Discovery |
| 5 | Column Discovery | 1.5 (part) | Column metadata |
| 6 | Mapping Lifecycle | 1.4, 1.5 | Dataset Mapping, Column Mapping |
| 7 | Rule Authoring | 2.1 | Rule Discovery |
| 8 | Rule Approval | 2.1 (part) | Rule approval workflow |
| 9 | Rule Execution | 2.3 (part) | Rule execution within pipeline |
| 10 | Control Lifecycle | 2.2 | Control Discovery |
| 11 | Validation Execution | 2.3, 2.4, 2.5 | Validation Execution, Checkpointing, Retry Engine |
| 12 | Exception Management | 2.3 (part) | Exception handling |
| 13 | Issue Remediation | — | No dedicated capability |
| 14 | Governance | 3.1, 3.2 | Governance Decisions, Risk Scoring |
| 15 | Release Approval | 3.3, 3.4 | Release Gates, Approvals |
| 16 | Reporting | 4.1, 4.2, 4.3, 4.4, 4.6 | All reporting capabilities |
| 17 | Dashboard Production | 4.5 | Dashboard Services |
| 18 | Notifications | 5.3 | Notification Services |
| 19 | Scheduling | 5.4 | Calendar Services |
| 20 | Workflow Management | 5.1 | Workflow Management |
| 21 | Task Management | 5.2 | Task Management |
| 22 | User Lifecycle | 6.1 | User Management |
| 23 | Role Administration | 6.2 | Role & Permission Management |
| 24 | Tenant Management | 6.3 | Tenant Management |
| 25 | Security Administration | 6.6 | Security Management |
| 26 | Audit Lifecycle | 6.7 | Audit Trail |
| 27 | Platform Administration | 6.4, 6.5, 6.8 | System Settings, Feature Flags, Maintenance & Health |
| 28 | Customer Onboarding | 5.6 | Authentication |
| 29 | Authentication | 5.6 | Authentication |

---

## 7. Traceability Statistics

| Metric | Count |
|--------|-------|
| Total Capabilities (Prompt 16) | 34 |
| Capabilities with Processes | 33 |
| Orphan Capabilities | 1 |
| Total Processes | 29 |
| Capabilities per Process (avg) | 1.1 |

---

## 8. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This traceability matrix is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*