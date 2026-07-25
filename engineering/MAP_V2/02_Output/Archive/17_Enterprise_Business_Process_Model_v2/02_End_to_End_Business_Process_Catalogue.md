# End-to-End Business Process Catalogue

**Document ID:** 17-02  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides complete definitions for all 29 business processes in the MAP Nexus platform. Each process includes 17 mandatory fields as defined by the enterprise architecture standard.

---

## 2. Process Definitions

### 2.1 Migration Project Lifecycle

| Field | Value |
|-------|-------|
| **Purpose** | Define and track migration projects from initiation to completion |
| **Business Objective** | Ensure migration projects are properly scoped, executed, and delivered |
| **Trigger** | Migration Lead creates a new project |
| **Inputs** | Project configuration (YAML), source/target system details, team assignments |
| **Outputs** | Project registry, project status, project completion report |
| **Actors** | Migration Lead, Migration Engineers, Programme Manager |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Programme Manager (oversight), Governance Officer (compliance review) |
| **Start Event** | Project Created |
| **End Event** | Project Closed |
| **Business Rules** | Project must have source and target systems; Project must have assigned team; Project status must progress through defined states |
| **Dependencies** | Connection Management, Dataset Discovery, Validation Execution |
| **Upstream Processes** | — |
| **Downstream Processes** | Connection Onboarding, Dataset Discovery |
| **Related Business Capabilities** | Project Management (1.1) |
| **Supporting Systems** | app.execution_engine, core schema, platform schema |
| **Evidence** | app.execution_engine contains project configuration logic; core.dataset_mappings references project_id; engine.migration_validation_batch tracks project execution |

---

### 2.2 Connection Onboarding

| Field | Value |
|-------|-------|
| **Purpose** | Register and verify source/target database connections |
| **Business Objective** | Ensure reliable connectivity to all migration data sources |
| **Trigger** | Migration Engineer adds a new connection |
| **Inputs** | Connection details (host, port, database, credentials) |
| **Outputs** | Verified connection, connection status |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Security Officer (credential encryption) |
| **Start Event** | Connection Requested |
| **End Event** | Connection Verified |
| **Business Rules** | Credentials must be encrypted; Connection must be tested before use; Only one connection per system type per project |
| **Dependencies** | — |
| **Upstream Processes** | Migration Project Lifecycle |
| **Downstream Processes** | Dataset Discovery, Credential Onboarding |
| **Related Business Capabilities** | Connection Management (1.2) |
| **Supporting Systems** | app.db.connection_resolver, core.system_registry, core.system_credentials |
| **Evidence** | app/api/v1/core/connections.py provides full CRUD API; core.system_registry stores connection metadata; core.system_credentials stores encrypted credentials; encryption managed by security module |

---

### 2.3 Credential Onboarding

| Field | Value |
|-------|-------|
| **Purpose** | Securely store and manage database credentials |
| **Business Objective** | Protect sensitive credentials while enabling automated access |
| **Trigger** | Migration Engineer provides credentials for a connection |
| **Inputs** | Username, password, connection reference |
| **Outputs** | Encrypted credential record |
| **Actors** | Migration Engineer, Security Officer |
| **Primary Owner** | Security Officer |
| **Supporting Roles** | Migration Lead (oversight) |
| **Start Event** | Credentials Provided |
| **End Event** | Credentials Stored |
| **Business Rules** | Credentials must be encrypted at rest; Credentials must be rotated per security policy; Only authorised users may access credentials |
| **Dependencies** | Connection Onboarding |
| **Upstream Processes** | Connection Onboarding |
| **Downstream Processes** | Dataset Discovery |
| **Related Business Capabilities** | Connection Management (1.2) |
| **Supporting Systems** | core.system_credentials, app.security |
| **Evidence** | core.system_credentials stores encrypted credentials; Fernet encryption used; credential access logged in audit_events |

---

### 2.4 Dataset Discovery

| Field | Value |
|-------|-------|
| **Purpose** | Automatically discover schemas, tables, and columns from source/target databases |
| **Business Objective** | Provide comprehensive metadata for mapping and validation |
| **Trigger** | Migration Engineer triggers discovery for a project |
| **Inputs** | Database connections, discovery configuration |
| **Outputs** | Discovered schemas, tables, columns, data types |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Discovery Triggered |
| **End Event** | Discovery Complete |
| **Business Rules** | Discovery must query both source and target; Results must be stored for traceability; Discovery may be re-run to capture schema changes |
| **Dependencies** | Connection Onboarding |
| **Upstream Processes** | Connection Onboarding |
| **Downstream Processes** | Dataset Mapping, Column Discovery |
| **Related Business Capabilities** | Dataset Discovery (1.3) |
| **Supporting Systems** | app.discovery.auto_rule_discovery, core.dataset_mappings, core.dataset_columns |
| **Evidence** | app.discovery.auto_rule_discovery queries information_schema; core.dataset_mappings stores discovered tables; core.dataset_columns stores discovered columns; CLI-only, no API endpoints |

---

### 2.5 Column Discovery

| Field | Value |
|-------|-------|
| **Purpose** | Discover column-level metadata including data types and constraints |
| **Business Objective** | Provide detailed column information for rule generation |
| **Trigger** | Part of Dataset Discovery process |
| **Inputs** | Table metadata, database connections |
| **Outputs** | Column definitions, data types, constraints |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Table Discovery Complete |
| **End Event** | Column Discovery Complete |
| **Business Rules** | Must capture data type, nullability, and constraints; Must support source and target columns |
| **Dependencies** | Dataset Discovery |
| **Upstream Processes** | Dataset Discovery |
| **Downstream Processes** | Mapping Lifecycle |
| **Related Business Capabilities** | Column Mapping (1.5) |
| **Supporting Systems** | app.services.dataset_discovery_service, core.dataset_columns |
| **Evidence** | app.services.dataset_discovery_service queries column metadata; core.dataset_columns stores column definitions; semi-automated process |

---

### 2.6 Mapping Lifecycle

| Field | Value |
|-------|-------|
| **Purpose** | Create and maintain source-to-target table and column mappings |
| **Business Objective** | Define precise data transformations for validation |
| **Trigger** | Dataset Discovery completes |
| **Inputs** | Discovered datasets, column metadata |
| **Outputs** | Table mappings, column mappings |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Mapping Created |
| **End Event** | Mapping Approved |
| **Business Rules** | Mappings must be reviewed before execution; Column mappings must reference valid table mappings; Mappings may be versioned |
| **Dependencies** | Dataset Discovery, Column Discovery |
| **Upstream Processes** | Dataset Discovery, Column Discovery |
| **Downstream Processes** | Rule Authoring, Validation Execution |
| **Related Business Capabilities** | Dataset Mapping (1.4), Column Mapping (1.5) |
| **Supporting Systems** | app.services.mapping_resolver, core.dataset_mappings, core.column_mappings |
| **Evidence** | app.services.mapping_resolver resolves mappings at runtime; core.dataset_mappings stores table mappings; core.column_mappings stores column mappings; auto-created during discovery |

---

### 2.7 Rule Authoring

| Field | Value |
|-------|-------|
| **Purpose** | Define validation rules for data quality checks |
| **Business Objective** | Ensure comprehensive validation coverage |
| **Trigger** | Migration Engineer creates rules |
| **Inputs** | Column metadata, rule templates, custom rule definitions |
| **Outputs** | Validation rules (C01-C010 types) |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Governance Officer (compliance rules) |
| **Start Event** | Rule Requested |
| **End Event** | Rule Approved |
| **Business Rules** | Rules must follow naming convention; Rules must be approved before execution; Rule types must match column roles |
| **Dependencies** | Mapping Lifecycle |
| **Upstream Processes** | Mapping Lifecycle |
| **Downstream Processes** | Rule Approval, Validation Execution |
| **Related Business Capabilities** | Rule Discovery (2.1) |
| **Supporting Systems** | app.discovery.auto_rule_discovery, engine.rule_registry |
| **Evidence** | app.discovery.auto_rule_discovery auto-generates rules; engine.rule_registry stores rule definitions; 10 rule types (C01-C010) implemented |

---

### 2.8 Rule Approval

| Field | Value |
|-------|-------|
| **Purpose** | Review and approve validation rules before execution |
| **Business Objective** | Ensure rules are appropriate and approved |
| **Trigger** | Rules submitted for approval |
| **Inputs** | Rule definitions, approval request |
| **Outputs** | Approval decision |
| **Actors** | Migration Lead, Governance Officer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Governance Officer (compliance review) |
| **Start Event** | Approval Requested |
| **End Event** | Approval Decision |
| **Business Rules** | Rules must be reviewed before execution; Approval must be documented; Rejected rules must be revised |
| **Dependencies** | Rule Authoring |
| **Upstream Processes** | Rule Authoring |
| **Downstream Processes** | Validation Execution |
| **Related Business Capabilities** | Rule Discovery (2.1), Approvals (3.4) |
| **Supporting Systems** | Manual process (no automation) |
| **Evidence** | No approval workflow implementation found in codebase; Rules are auto-generated during execution without explicit approval step |

---

### 2.9 Rule Execution

| Field | Value |
|-------|-------|
| **Purpose** | Execute validation rules against data |
| **Business Objective** | Validate data quality according to defined rules |
| **Trigger** | Validation Execution pipeline reaches rule execution step |
| **Inputs** | Validation rules, source/target data |
| **Outputs** | Rule results (pass/fail), exceptions |
| **Actors** | Migration Engineer (monitoring) |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Execution Started |
| **End Event** | Execution Complete |
| **Business Rules** | Rules must execute in defined order; Failed rules must be logged; Retry logic may be triggered |
| **Dependencies** | Validation Execution |
| **Upstream Processes** | Validation Execution |
| **Downstream Processes** | Governance |
| **Related Business Capabilities** | Validation Execution (2.3) |
| **Supporting Systems** | app.execution_engine, app.execution.control_executor |
| **Evidence** | app.execution_engine orchestrates 6-step pipeline; app.execution.control_executor dispatches to control classes; results stored in engine.migration_control_summary |

---

### 2.10 Control Lifecycle

| Field | Value |
|-------|-------|
| **Purpose** | Manage validation controls from definition to execution |
| **Business Objective** | Ensure consistent control application |
| **Trigger** | Control Discovery identifies controls |
| **Inputs** | Control registry, control configuration |
| **Outputs** | Active controls, control results |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Control Discovered |
| **End Event** | Control Executed |
| **Business Rules** | Controls must be registered before execution; Control results must be logged; Disabled controls must be skipped |
| **Dependencies** | Validation Execution |
| **Upstream Processes** | Validation Execution |
| **Downstream Processes** | Governance |
| **Related Business Capabilities** | Control Discovery (2.2) |
| **Supporting Systems** | app.execution.control_executor, engine.control_registry |
| **Evidence** | app.execution.control_executor fetches enabled controls from engine.control_registry; dispatches to control classes; results stored in engine.migration_control_summary |

---

### 2.11 Validation Execution

| Field | Value |
|-------|-------|
| **Purpose** | Orchestrate the complete 6-step validation pipeline |
| **Business Objective** | Execute end-to-end data validation |
| **Trigger** | Migration Engineer triggers execution |
| **Inputs** | Project config, connections, mappings, rules, controls |
| **Outputs** | Execution results, batch summary, governance decision |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Governance Officer (post-execution review) |
| **Start Event** | Execution Triggered |
| **End Event** | Execution Complete |
| **Business Rules** | Pipeline must execute all 6 steps; Checkpoints must be saved; Failed steps may be retried; Results must be stored |
| **Dependencies** | Connection Onboarding, Mapping Lifecycle, Rule Authoring, Control Lifecycle |
| **Upstream Processes** | Connection Onboarding, Mapping Lifecycle, Rule Authoring, Control Lifecycle |
| **Downstream Processes** | Governance, Reporting |
| **Related Business Capabilities** | Validation Execution (2.3), Checkpointing (2.4), Retry Engine (2.5) |
| **Supporting Systems** | app.execution_engine, engine.migration_validation_batch, engine.batch_execution_checkpoint |
| **Evidence** | app.execution_engine implements 6-step pipeline; parallel execution supported; checkpointing via engine.batch_execution_checkpoint; retry via app.orchestration.retry.rule_retry_manager; API at /api/v1/engine/trigger |

---

### 2.12 Exception Management

| Field | Value |
|-------|-------|
| **Purpose** | Handle and resolve validation exceptions |
| **Business Objective** | Ensure all exceptions are reviewed and resolved |
| **Trigger** | Validation failure occurs |
| **Inputs** | Exception details, failed control results |
| **Outputs** | Exception resolution, remediation actions |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Governance Officer (compliance review) |
| **Start Event** | Exception Detected |
| **End Event** | Exception Resolved |
| **Business Rules** | All exceptions must be reviewed; Exceptions must be categorised; Resolution must be documented |
| **Dependencies** | Validation Execution |
| **Upstream Processes** | Validation Execution |
| **Downstream Processes** | Governance, Issue Remediation |
| **Related Business Capabilities** | Validation Execution (2.3) |
| **Supporting Systems** | app.execution_engine, engine.migration_exception_detail |
| **Evidence** | engine.v_migration_exception_detail view provides exception data; no dedicated exception management API; exceptions logged during execution |

---

### 2.13 Issue Remediation

| Field | Value |
|-------|-------|
| **Purpose** | Remediate data quality issues identified during validation |
| **Business Objective** | Resolve all identified issues before release |
| **Trigger** | Exception resolved with remediation action |
| **Inputs** | Exception details, remediation plan |
| **Outputs** | Remediation actions, issue resolution |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Remediation Started |
| **End Event** | Remediation Complete |
| **Business Rules** | Remediation must be documented; Re-validation required after remediation; All issues must be resolved before release |
| **Dependencies** | Exception Management |
| **Upstream Processes** | Exception Management |
| **Downstream Processes** | Validation Execution (re-run) |
| **Related Business Capabilities** | — |
| **Supporting Systems** | Manual process (no automation) |
| **Evidence** | No automated remediation workflow found in codebase; issue tracking handled via Task Management platform |

---

### 2.14 Governance

| Field | Value |
|-------|-------|
| **Purpose** | Evaluate validation results and make governance decisions |
| **Business Objective** | Ensure compliance with regulatory and quality standards |
| **Trigger** | Validation execution completes |
| **Inputs** | Execution results, risk scores, compliance rules |
| **Outputs** | Governance decision (approve/reject/block) |
| **Actors** | Governance Officer, Compliance Officers |
| **Primary Owner** | Governance Officer |
| **Supporting Roles** | Migration Lead (input), Programme Manager (oversight) |
| **Start Event** | Governance Evaluation Started |
| **End Event** | Governance Decision Made |
| **Business Rules** | Governance must evaluate all controls; Risk scores must be calculated; Decision must be documented; Block decision requires remediation |
| **Dependencies** | Validation Execution |
| **Upstream Processes** | Validation Execution |
| **Downstream Processes** | Release Approval |
| **Related Business Capabilities** | Governance Decisions (3.1), Risk Scoring (3.2) |
| **Supporting Systems** | app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status |
| **Evidence** | app.governance.decision_engine computes governance decisions; app.governance.risk_scoring calculates weighted risk scores; results stored in engine.migration_governance_status and engine.migration_risk_scores; auto post-execution |

---

### 2.15 Release Approval

| Field | Value |
|-------|-------|
| **Purpose** | Approve or reject batch releases for production |
| **Business Objective** | Ensure only validated data is released |
| **Trigger** | Governance decision made |
| **Inputs** | Governance decision, risk scores, approval request |
| **Outputs** | Release decision (approved/rejected) |
| **Actors** | Programme Manager, Governance Officer |
| **Primary Owner** | Governance Officer |
| **Supporting Roles** | Programme Manager (approval authority) |
| **Start Event** | Release Requested |
| **End Event** | Release Decision |
| **Business Rules** | Release requires approval from authorised approver; Approval must be documented; Rejected release requires remediation |
| **Dependencies** | Governance |
| **Upstream Processes** | Governance |
| **Downstream Processes** | Reporting, Notifications |
| **Related Business Capabilities** | Release Gates (3.3), Approvals (3.4) |
| **Supporting Systems** | app.services.approval_service, platform.approval_requests, engine.migration_release_decision |
| **Evidence** | app.services.approval_service manages approval workflow; platform.approval_requests stores approval requests; platform.approval_step_instances tracks approval steps; full CRUD API at /api/v1/platform/approvals |

---

### 2.16 Reporting

| Field | Value |
|-------|-------|
| **Purpose** | Generate migration and validation reports |
| **Business Objective** | Provide visibility into migration progress and quality |
| **Trigger** | Report requested or scheduled |
| **Inputs** | Execution results, governance decisions, batch data |
| **Outputs** | Executive, operational, governance, technical reports |
| **Actors** | Programme Manager, Migration Lead, Governance Officer |
| **Primary Owner** | Programme Manager |
| **Supporting Roles** | Migration Lead (technical reports), Governance Officer (governance reports) |
| **Start Event** | Report Requested |
| **End Event** | Report Generated |
| **Business Rules** | Reports must be based on actual data; Reports must be exportable; Report access must be controlled |
| **Dependencies** | Validation Execution, Governance |
| **Upstream Processes** | Validation Execution, Governance |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Executive Reporting (4.1), Operational Reporting (4.2), Governance Reporting (4.3), Technical Reporting (4.4) |
| **Supporting Systems** | app.audit_export, reporting schema views (v_migration_executive_summary, v_migration_control_summary, etc.) |
| **Evidence** | reporting schema contains 5 SQL views; app.audit_export provides CLI export; no API endpoints for reports; frontend displays mock data |

---

### 2.17 Dashboard Production

| Field | Value |
|-------|-------|
| **Purpose** | Produce real-time KPI dashboards |
| **Business Objective** | Provide at-a-glance visibility into platform health |
| **Trigger** | Dashboard requested or auto-refresh |
| **Inputs** | Batch results, execution data |
| **Outputs** | Dashboard visualisations, KPI metrics |
| **Actors** | Programme Sponsor, All Users |
| **Primary Owner** | Programme Sponsor |
| **Supporting Roles** | Programme Manager (data validation) |
| **Start Event** | Dashboard Requested |
| **End Event** | Dashboard Updated |
| **Business Rules** | Dashboard must reflect current data; KPIs must be accurate; Dashboard must be accessible to authorised users |
| **Dependencies** | Validation Execution, Governance |
| **Upstream Processes** | Validation Execution, Governance |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Dashboard Services (4.5) |
| **Supporting Systems** | app.scoring_engine, reporting schema (v_fact_batch, v_fact_control) |
| **Evidence** | reporting schema contains fact views; app.scoring_engine calculates KPIs; no API endpoints; frontend displays mock data |

---

### 2.18 Notifications

| Field | Value |
|-------|-------|
| **Purpose** | Alert users of events and required actions |
| **Business Objective** | Ensure timely response to platform events |
| **Trigger** | Platform event occurs |
| **Inputs** | Event details, user preferences |
| **Outputs** | User notifications |
| **Actors** | All Users |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | Event Occurred |
| **End Event** | Notification Delivered |
| **Business Rules** | Notifications must respect user preferences; Critical notifications must be delivered immediately; Notifications must be logged |
| **Dependencies** | All capabilities (consumes events) |
| **Upstream Processes** | All capabilities |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Notification Services (5.3) |
| **Supporting Systems** | app.services.notification_service, platform.notifications, platform.notification_preferences |
| **Evidence** | app.services.notification_service provides full CRUD API; platform.notifications stores notification records; platform.notification_preferences stores user preferences; subscribed to 19 event types |

---

### 2.19 Scheduling

| Field | Value |
|-------|-------|
| **Purpose** | Schedule and manage recurring events and reminders |
| **Business Objective** | Ensure timely execution of scheduled activities |
| **Trigger** | Schedule created or event reminder triggered |
| **Inputs** | Schedule definitions, event details |
| **Outputs** | Calendar events, reminders |
| **Actors** | All Users |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | Schedule Created |
| **End Event** | Event Reminder Delivered |
| **Business Rules** | Schedules must be configurable; Reminders must be sent before events; Recurring schedules must be supported |
| **Dependencies** | Task Management, Notifications |
| **Upstream Processes** | Task Management, Notifications |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Calendar Services (5.4) |
| **Supporting Systems** | app.services.calendar_service, platform.calendar_events, platform.calendar_event_reminders |
| **Evidence** | app.services.calendar_service provides full CRUD API; platform.calendar_events stores events; platform.calendar_event_reminders manages reminders; subscribed to Batch Started and Task Created events |

---

### 2.20 Workflow Management

| Field | Value |
|-------|-------|
| **Purpose** | Define and execute business workflows |
| **Business Objective** | Automate multi-step business processes |
| **Trigger** | Workflow triggered by event or user |
| **Inputs** | Workflow definition, step configuration |
| **Outputs** | Workflow instance, step results |
| **Actors** | All Users |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | Workflow Triggered |
| **End Event** | Workflow Completed |
| **Business Rules** | Workflows must follow defined sequence; Step results must be logged; Failed workflows must be handled |
| **Dependencies** | Task Management, Notifications |
| **Upstream Processes** | Task Management, Notifications |
| **Downstream Processes** | Tasks, Notifications |
| **Related Business Capabilities** | Workflow Management (5.1) |
| **Supporting Systems** | app.services.workflow_service, platform.workflow_definitions, platform.workflow_instances |
| **Evidence** | app.services.workflow_service provides full CRUD API; platform.workflow_definitions stores definitions; platform.workflow_instances tracks execution; subscribed to Task Completed and Approval Decided events |

---

### 2.21 Task Management

| Field | Value |
|-------|-------|
| **Purpose** | Track and assign migration tasks |
| **Business Objective** | Ensure all tasks are assigned and completed |
| **Trigger** | Task created manually or by system |
| **Inputs** | Task definition, assignment, dependencies |
| **Outputs** | Task assignment, task status, task completion |
| **Actors** | All Users |
| **Primary Owner** | Programme Manager |
| **Supporting Roles** | Migration Lead (migration tasks) |
| **Start Event** | Task Created |
| **End Event** | Task Completed |
| **Business Rules** | Tasks must be assigned to authorised users; Task status must be updated; Dependencies must be respected |
| **Dependencies** | Notifications, Calendar |
| **Upstream Processes** | All capabilities |
| **Downstream Processes** | Notifications, Calendar, Workflow |
| **Related Business Capabilities** | Task Management (5.2) |
| **Supporting Systems** | app.services.task_service, platform.tasks, platform.task_comments, platform.task_dependencies |
| **Evidence** | app.services.task_service provides full CRUD API; platform.tasks stores task records; platform.task_comments tracks comments; platform.task_dependencies manages dependencies; produces Task Created and Task Completed events |

---

### 2.22 User Lifecycle

| Field | Value |
|-------|-------|
| **Purpose** | Manage user accounts from creation to deactivation |
| **Business Objective** | Ensure proper user access management |
| **Trigger** | User creation requested |
| **Inputs** | User details, role assignment |
| **Outputs** | User account, role assignment |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | Security Officer (access review) |
| **Start Event** | User Requested |
| **End Event** | User Deactivated |
| **Business Rules** | Users must be assigned roles; User access must be reviewed periodically; Deactivated users must lose access immediately |
| **Dependencies** | Authentication, Role Administration |
| **Upstream Processes** | — |
| **Downstream Processes** | Authentication, Role Administration |
| **Related Business Capabilities** | User Management (6.1) |
| **Supporting Systems** | app.services.user_service, platform.users, platform.user_roles |
| **Evidence** | app.services.user_service provides full CRUD API; platform.users stores user records; platform.user_roles manages role assignments; produces User Created event |

---

### 2.23 Role Administration

| Field | Value |
|-------|-------|
| **Purpose** | Define and manage RBAC roles and permissions |
| **Business Objective** | Ensure proper access control |
| **Trigger** | Role creation or modification requested |
| **Inputs** | Role definitions, permission assignments |
| **Outputs** | Role definitions, permission mappings |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | Security Officer (security review) |
| **Start Event** | Role Requested |
| **End Event** | Role Updated |
| **Business Rules** | Roles must follow naming convention; Permissions must be assigned to roles; Role changes must be audited |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | User Lifecycle |
| **Related Business Capabilities** | Role & Permission Management (6.2) |
| **Supporting Systems** | app.services.role_service, platform.roles, platform.permissions, platform.role_permissions |
| **Evidence** | app.services.role_service provides full CRUD API; platform.roles stores role definitions; platform.permissions stores 47 permissions; platform.role_permissions manages assignments; produces Role Assigned event |

---

### 2.24 Tenant Management

| Field | Value |
|-------|-------|
| **Purpose** | Manage multi-tenant configuration |
| **Business Objective** | Support multi-tenant deployment |
| **Trigger** | New tenant onboarded |
| **Inputs** | Tenant details, configuration |
| **Outputs** | Tenant configuration |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | Security Officer (isolation review) |
| **Start Event** | Tenant Requested |
| **End Event** | Tenant Configured |
| **Business Rules** | Tenants must be isolated; Tenant configuration must be validated; Tenant access must be controlled |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | User Lifecycle |
| **Related Business Capabilities** | Tenant Management (6.3) |
| **Supporting Systems** | core.tenants |
| **Evidence** | core.tenants table exists; no API endpoints; frontend displays mock data; tenant_id referenced in JWT tokens |

---

### 2.25 Security Administration

| Field | Value |
|-------|-------|
| **Purpose** | Manage platform security including encryption and certificates |
| **Business Objective** | Ensure platform security compliance |
| **Trigger** | Security event or configuration change |
| **Inputs** | Security policies, certificates |
| **Outputs** | Security configurations, security status |
| **Actors** | Security Officer |
| **Primary Owner** | Security Officer |
| **Supporting Roles** | Administrator (platform access) |
| **Start Event** | Security Event |
| **End Event** | Security Action Complete |
| **Business Rules** | Security policies must be enforced; Certificates must be valid; Security events must be logged |
| **Dependencies** | Audit Trail |
| **Upstream Processes** | — |
| **Downstream Processes** | Audit Trail |
| **Related Business Capabilities** | Security Management (6.6) |
| **Supporting Systems** | audit.security_events |
| **Evidence** | audit.security_events stores security events; no dedicated security management API; frontend displays mock data |

---

### 2.26 Audit Lifecycle

| Field | Value |
|-------|-------|
| **Purpose** | Log and track all platform activities for compliance |
| **Business Objective** | Maintain complete audit trail |
| **Trigger** | Any API call or security event |
| **Inputs** | API call details, user info, timestamps |
| **Outputs** | Audit events, audit reports |
| **Actors** | Security Officer, Auditors |
| **Primary Owner** | Security Officer |
| **Supporting Roles** | Administrator (platform access) |
| **Start Event** | Audit Event Logged |
| **End Event** | Audit Event Reviewed |
| **Business Rules** | All API calls must be logged; Audit events must be immutable; Audit events must be retained per policy |
| **Dependencies** | All capabilities (logs all activities) |
| **Upstream Processes** | All capabilities |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Audit Trail (6.7) |
| **Supporting Systems** | app.api.core.middleware.audit_middleware, audit.audit_events, audit.api_call_log |
| **Evidence** | app.api.core.middleware.audit_middleware logs every API call; audit.audit_events stores audit records; audit.api_call_log stores API call details; no dedicated audit API; frontend displays mock data |

---

### 2.27 Platform Administration

| Field | Value |
|-------|-------|
| **Purpose** | Manage platform configuration and health |
| **Business Objective** | Ensure platform availability and performance |
| **Trigger** | Configuration change or health check |
| **Inputs** | Configuration changes, health checks |
| **Outputs** | Updated configuration, health status |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | DevOps (infrastructure) |
| **Start Event** | Administration Action |
| **End Event** | Action Complete |
| **Business Rules** | Configuration changes must be audited; Health checks must run regularly; Platform must be available |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | — |
| **Related Business Capabilities** | System Settings (6.4), Feature Flags (6.5), Maintenance & Health (6.8) |
| **Supporting Systems** | app.services.settings_service, app.health, platform.system_settings, platform.feature_flags |
| **Evidence** | app.services.settings_service provides full CRUD API; app.health provides health check endpoints; platform.system_settings stores configuration; platform.feature_flags stores feature toggles; produces Settings Changed event |

---

### 2.28 Customer Onboarding

| Field | Value |
|-------|-------|
| **Purpose** | Authenticate users and manage their sessions |
| **Business Objective** | Ensure secure user authentication |
| **Trigger** | User attempts to login |
| **Inputs** | User credentials |
| **Outputs** | JWT token, session |
| **Actors** | All Users |
| **Primary Owner** | Security Officer |
| **Supporting Roles** | Administrator (user management) |
| **Start Event** | Login Attempted |
| **End Event** | Login Complete |
| **Business Rules** | Credentials must be validated; JWT tokens must be issued; Failed logins must be logged; Sessions must be managed |
| **Dependencies** | User Lifecycle |
| **Upstream Processes** | User Lifecycle |
| **Downstream Processes** | All capabilities |
| **Related Business Capabilities** | Authentication (5.6) |
| **Supporting Systems** | app.services.auth_service, platform.users, platform.refresh_tokens, platform.user_sessions |
| **Evidence** | app.services.auth_service validates credentials against platform.users; JWT tokens issued with bcrypt verification; refresh tokens managed; rate limiting on login endpoint (5/minute); produces Login Successful and Login Failed events |

---

### 2.29 Authentication

| Field | Value |
|-------|-------|
| **Purpose** | Verify user identity and issue tokens |
| **Business Objective** | Provide secure authentication mechanism |
| **Trigger** | Login request received |
| **Inputs** | Username, password |
| **Outputs** | JWT access token, refresh token |
| **Actors** | All Users |
| **Primary Owner** | Security Officer |
| **Supporting Roles** | — |
| **Start Event** | Authentication Requested |
| **End Event** | Token Issued |
| **Business Rules** | Passwords must be verified against hash; Tokens must have expiry; Refresh tokens must be managed; Failed attempts must be logged |
| **Dependencies** | User Lifecycle |
| **Upstream Processes** | User Lifecycle |
| **Downstream Processes** | All capabilities |
| **Related Business Capabilities** | Authentication (5.6) |
| **Supporting Systems** | app.services.auth_service, platform.users, platform.refresh_tokens |
| **Evidence** | app.services.auth_service uses passlib for password verification; JWT tokens with configurable expiry; refresh tokens stored in platform.refresh_tokens; rate limiting enforced |

---

## 3. Process Summary

| # | Process | Domain | Maturity | Automation |
|---|---------|--------|----------|------------|
| 1 | Migration Project Lifecycle | Migration Management | 3 Defined | Semi-Automated |
| 2 | Connection Onboarding | Migration Management | 4 Managed | Semi-Automated |
| 3 | Credential Onboarding | Migration Management | 4 Managed | Semi-Automated |
| 4 | Dataset Discovery | Migration Management | 3 Defined | Semi-Automated |
| 5 | Column Discovery | Migration Management | 3 Defined | Semi-Automated |
| 6 | Mapping Lifecycle | Migration Management | 3 Defined | Semi-Automated |
| 7 | Rule Authoring | Validation Management | 3 Defined | Semi-Automated |
| 8 | Rule Approval | Validation Management | 2 Repeatable | Manual |
| 9 | Rule Execution | Validation Management | 4 Managed | Automated |
| 10 | Control Lifecycle | Validation Management | 3 Defined | Semi-Automated |
| 11 | Validation Execution | Validation Management | 4 Managed | Automated |
| 12 | Exception Management | Validation Management | 3 Defined | Semi-Automated |
| 13 | Issue Remediation | Validation Management | 2 Repeatable | Manual |
| 14 | Governance | Governance & Compliance | 3 Defined | Semi-Automated |
| 15 | Release Approval | Governance & Compliance | 4 Managed | Semi-Automated |
| 16 | Reporting | Reporting & Analytics | 2 Repeatable | Assisted |
| 17 | Dashboard Production | Reporting & Analytics | 2 Repeatable | Assisted |
| 18 | Notifications | Platform Services | 4 Managed | Automated |
| 19 | Scheduling | Platform Services | 4 Managed | Automated |
| 20 | Workflow Management | Platform Services | 4 Managed | Automated |
| 21 | Task Management | Platform Services | 4 Managed | Automated |
| 22 | User Lifecycle | Administration | 3 Defined | Semi-Automated |
| 23 | Role Administration | Administration | 3 Defined | Semi-Automated |
| 24 | Tenant Management | Administration | 2 Repeatable | Manual |
| 25 | Security Administration | Administration | 2 Repeatable | Manual |
| 26 | Audit Lifecycle | Administration | 2 Repeatable | Manual |
| 27 | Platform Administration | Administration | 3 Defined | Semi-Automated |
| 28 | Customer Onboarding | Platform Services | 3 Defined | Semi-Automated |
| 29 | Authentication | Platform Services | 4 Managed | Semi-Automated |

---

## 4. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This catalogue is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*