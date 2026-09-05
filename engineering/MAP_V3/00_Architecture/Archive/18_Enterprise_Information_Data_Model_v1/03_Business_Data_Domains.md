# Business Data Domains

**Document ID:** 18-03  
**Version:** 1.0  
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
| **Owner** | Migration Lead |
| **Contained Business Objects** | Project, Dataset, Dataset Mapping, Column Mapping, System, Credential |
| **Contained Tables** | core.projects, core.datasets, core.dataset_mappings, core.column_mappings, core.dataset_columns, core.system_registry, core.rule_dataset_mapping |
| **Contained APIs** | /api/v1/core/connections, /api/v1/engine/trigger |
| **Contained Services** | connection_resolver, mapping_resolver, dataset_discovery_service |
| **Contained Metadata** | Dataset metadata, mapping metadata, connection metadata |
| **Current Maturity** | 3 Defined |
| **Evidence** | core schema (7 tables); app.api.v1.core.connections; app.services.* |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 7 |
| Views | 0 |
| APIs | 2 |
| Services | 3 |
| Maturity | 3 Defined |

---

### 2.2 Validation Management Domain

| Field | Value |
|-------|-------|
| **Purpose** | Execute validation rules and controls against migration data |
| **Owner** | Migration Lead |
| **Contained Business Objects** | Rule, Control, Batch, Control Result, Exception, Rule Execution Statistics |
| **Contained Tables** | engine.rule_registry, engine.control_registry, engine.migration_validation_batch, engine.migration_control_summary, engine.migration_control_execution, engine.migration_control_exceptions, engine.migration_exception_register, engine.rule_execution_statistics, engine.rule_weights, engine.rule_weight_config |
| **Contained APIs** | /api/v1/engine/trigger |
| **Contained Services** | execution_engine, control_executor, rule_retry_manager |
| **Contained Metadata** | Rule metadata, control metadata, execution metadata |
| **Current Maturity** | 4 Managed |
| **Evidence** | engine schema (22 tables); app.execution_engine; app.execution.control_executor |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 22 |
| Views | 5 |
| APIs | 1 |
| Services | 3 |
| Maturity | 4 Managed |

---

### 2.3 Governance & Compliance Domain

| Field | Value |
|-------|-------|
| **Purpose** | Make governance decisions and manage release approvals |
| **Owner** | Governance Officer |
| **Contained Business Objects** | Governance Decision, Risk Score, Release Decision, Approval Request |
| **Contained Tables** | engine.migration_governance_status, engine.migration_risk_scores, engine.migration_release_decision, engine.governance_config, engine.migration_control_decisions, platform.approval_requests, platform.approval_step_instances, platform.approval_templates |
| **Contained APIs** | /api/v1/platform/approvals |
| **Contained Services** | decision_engine, risk_scoring, approval_service |
| **Contained Metadata** | Governance metadata, risk metadata, approval metadata |
| **Current Maturity** | 3 Defined |
| **Evidence** | engine.migration_governance_status; app.governance.*; platform.approval_requests |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 8 |
| Views | 1 |
| APIs | 1 |
| Services | 3 |
| Maturity | 3 Defined |

---

### 2.4 Reporting & Analytics Domain

| Field | Value |
|-------|-------|
| **Purpose** | Generate reports and dashboards from validation data |
| **Owner** | Programme Manager |
| **Contained Business Objects** | Report, Dashboard, KPI, Fact, Dimension |
| **Contained Tables** | reporting.dim_date, reporting.dim_severity, reporting.dim_status |
| **Contained Views** | reporting.v_fact_batch, reporting.v_fact_control, reporting.v_batch_governance_intelligence, engine.v_migration_executive_summary, engine.v_migration_control_summary, engine.v_migration_governance_report, engine.v_migration_exception_detail, engine.v_migration_score_trend, engine.v_migration_delta_anomalies |
| **Contained APIs** | None (planned) |
| **Contained Services** | scoring_engine, audit_export |
| **Contained Metadata** | Report metadata, dashboard metadata, KPI metadata |
| **Current Maturity** | 2 Repeatable |
| **Evidence** | reporting schema (3 tables, 4 views); engine views (5); app.scoring_engine; CLI-only export |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 3 |
| Views | 9 |
| APIs | 0 |
| Services | 2 |
| Maturity | 2 Repeatable |

---

### 2.5 Platform Services Domain

| Field | Value |
|-------|-------|
| **Purpose** | Provide enterprise platform services (workflow, tasks, notifications, calendar) |
| **Owner** | Administrator |
| **Contained Business Objects** | Workflow, Task, Notification, Calendar Event, Setting, Feature Flag |
| **Contained Tables** | platform.workflow_definitions, platform.workflow_instances, platform.workflow_step_instances, platform.workflow_history, platform.tasks, platform.task_comments, platform.task_dependencies, platform.notifications, platform.notification_preferences, platform.calendar_events, platform.calendar_event_reminders, platform.system_settings, platform.feature_flags |
| **Contained APIs** | /api/v1/platform/workflows, /api/v1/platform/tasks, /api/v1/platform/notifications, /api/v1/platform/calendar, /api/v1/platform/settings |
| **Contained Services** | workflow_service, task_service, notification_service, calendar_service, settings_service |
| **Contained Metadata** | Workflow metadata, task metadata, notification metadata |
| **Current Maturity** | 4 Managed |
| **Evidence** | platform schema (23 tables); app.services.*; full CRUD APIs |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 23 |
| Views | 0 |
| APIs | 5 |
| Services | 5 |
| Maturity | 4 Managed |

---

### 2.6 Administration Domain

| Field | Value |
|-------|-------|
| **Purpose** | Manage users, roles, permissions, tenants, and security |
| **Owner** | Administrator |
| **Contained Business Objects** | User, Role, Permission, Tenant, Session, Refresh Token |
| **Contained Tables** | platform.users, platform.roles, platform.permissions, platform.role_permissions, platform.user_roles, platform.refresh_tokens, platform.user_sessions, core.tenants |
| **Contained APIs** | /api/v1/platform/users, /api/v1/platform/roles, /api/v1/auth/login |
| **Contained Services** | user_service, role_service, auth_service |
| **Contained Metadata** | User metadata, role metadata, tenant metadata |
| **Current Maturity** | 3 Defined |
| **Evidence** | platform.users, platform.roles, platform.permissions; app.services.user_service; core.tenants |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 8 |
| Views | 0 |
| APIs | 3 |
| Services | 3 |
| Maturity | 3 Defined |

---

### 2.7 Security Domain

| Field | Value |
|-------|-------|
| **Purpose** | Manage platform security, encryption, and certificates |
| **Owner** | Security Officer |
| **Contained Business Objects** | Security Event, Encryption Key, Certificate |
| **Contained Tables** | audit.security_events |
| **Contained APIs** | None |
| **Contained Services** | None (manual) |
| **Contained Metadata** | Security metadata |
| **Current Maturity** | 2 Repeatable |
| **Evidence** | audit.security_events; no dedicated security API |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 1 |
| Views | 0 |
| APIs | 0 |
| Services | 0 |
| Maturity | 2 Repeatable |

---

### 2.8 Audit Domain

| Field | Value |
|-------|-------|
| **Purpose** | Log and track all platform activities for compliance |
| **Owner** | Security Officer |
| **Contained Business Objects** | Audit Event, API Log, Login History, Configuration History |
| **Contained Tables** | audit.audit_events, audit.api_logs, audit.login_history, audit.configuration_history |
| **Contained APIs** | None |
| **Contained Services** | audit_middleware |
| **Contained Metadata** | Audit metadata |
| **Current Maturity** | 2 Repeatable |
| **Evidence** | audit schema (5 tables); app.api.core.middleware.audit_middleware |

**Domain Summary:**

| Metric | Value |
|--------|-------|
| Tables | 5 |
| Views | 0 |
| APIs | 0 |
| Services | 1 |
| Maturity | 2 Repeatable |

---

## 3. Domain Summary

| # | Domain | Tables | Views | APIs | Services | Maturity |
|---|--------|--------|-------|------|----------|----------|
| 1 | Migration Management | 7 | 0 | 2 | 3 | 3 Defined |
| 2 | Validation Management | 22 | 5 | 1 | 3 | 4 Managed |
| 3 | Governance & Compliance | 8 | 1 | 1 | 3 | 3 Defined |
| 4 | Reporting & Analytics | 3 | 9 | 0 | 2 | 2 Repeatable |
| 5 | Platform Services | 23 | 0 | 5 | 5 | 4 Managed |
| 6 | Administration | 8 | 0 | 3 | 3 | 3 Defined |
| 7 | Security | 1 | 0 | 0 | 0 | 2 Repeatable |
| 8 | Audit | 5 | 0 | 0 | 1 | 2 Repeatable |
| **Total** | | **77** | **15** | **12** | **20** | **3.0 Avg** |

---

## 4. Domain Maturity Assessment

| Level | Domains | Percentage |
|-------|---------|------------|
| 4 Managed | 2 (Validation, Platform) | 25% |
| 3 Defined | 4 (Migration, Governance, Administration, ?) | 50% |
| 2 Repeatable | 3 (Reporting, Security, Audit) | 25% |
| 1 Initial | 0 | 0% |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*These business data domains are part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*
