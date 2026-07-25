# Business Capability Catalogue

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — 34 Business Capabilities  

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total Capabilities | 34 |
| Operational (Full API + Frontend) | 14 (41%) |
| Implemented (Backend only) | 16 (47%) |
| Proposed (No backend) | 4 (12%) |

---

## 2. Migration Management Domain

### 2.1 Project Management

| Attribute | Value |
|-----------|-------|
| **Description** | Groups a migration effort — source/target systems, mappings, controls |
| **Purpose** | Define and track migration projects |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Project configuration YAML |
| **Outputs** | Project registry |
| **Success Measures** | Project completion rate |
| **Consumers** | Connection Management, Dataset Discovery |
| **Suppliers** | — |
| **Business Events** | Project Created, Project Updated |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | — |
| **Python Module** | app.execution_engine |
| **Database Schema** | core, engine |
| **Tables** | engine.migration_validation_batch, core.dataset_mappings |
| **API Status** | Partial |
| **Frontend** | Migration > Projects (partial) |

### 2.2 Connection Management

| Attribute | Value |
|-----------|-------|
| **Description** | Manages source/target database connections and credentials |
| **Purpose** | Manage source/target database connections |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Connection details, credentials |
| **Outputs** | Verified connections |
| **Success Measures** | Connection success rate |
| **Consumers** | Dataset Discovery, Validation Execution |
| **Suppliers** | — |
| **Business Events** | Connection Tested |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | app.db.connection_resolver |
| **Database Schema** | core |
| **Tables** | core.system_registry, core.system_credentials |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Migration > Datasets, Security > Credentials |

### 2.3 Dataset Discovery

| Attribute | Value |
|-----------|-------|
| **Description** | Automatically discovers tables, columns, data types from source/target databases |
| **Purpose** | Automatically discover schemas, tables, columns |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Database connections |
| **Outputs** | Discovered schemas, tables, columns |
| **Success Measures** | Discovery accuracy |
| **Consumers** | Dataset Mapping, Column Mapping |
| **Suppliers** | Connection Management |
| **Business Events** | Dataset Discovered |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Connection Management |
| **Python Module** | app.discovery.auto_rule_discovery |
| **Database Schema** | core, engine |
| **Tables** | core.dataset_mappings, core.dataset_columns |
| **API Status** | No (CLI only) |
| **Frontend** | None |

### 2.4 Dataset Mapping

| Attribute | Value |
|-----------|-------|
| **Description** | Defines source-to-target table mappings for validation |
| **Purpose** | Define source-to-target table mappings |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Discovered datasets |
| **Outputs** | Table mappings |
| **Success Measures** | Mapping accuracy |
| **Consumers** | Column Mapping, Rule Discovery |
| **Suppliers** | Dataset Discovery |
| **Business Events** | Mapping Created |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Dataset Discovery |
| **Python Module** | app.services.mapping_resolver |
| **Database Schema** | core |
| **Tables** | core.dataset_mappings |
| **API Status** | No (auto-created) |
| **Frontend** | Migration > Mappings (partial) |

### 2.5 Column Mapping

| Attribute | Value |
|-----------|-------|
| **Description** | Maps individual source columns to target columns within a table mapping |
| **Purpose** | Map individual columns between source/target |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Table mappings |
| **Outputs** | Column-level mappings |
| **Success Measures** | Column mapping accuracy |
| **Consumers** | Rule Discovery, Validation Execution |
| **Suppliers** | Dataset Mapping |
| **Business Events** | Column Mapping Created |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Dataset Mapping |
| **Python Module** | app.services.dataset_discovery_service |
| **Database Schema** | core |
| **Tables** | core.dataset_columns, core.column_mappings |
| **API Status** | No |
| **Frontend** | None |

---

## 3. Validation Management Domain

### 3.1 Rule Discovery

| Attribute | Value |
|-----------|-------|
| **Description** | Automatically infers validation rules based on column roles |
| **Purpose** | Auto-infer validation rules from column roles |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Column metadata, column roles |
| **Outputs** | Validation rules (C01-C010) |
| **Success Measures** | Rule accuracy |
| **Consumers** | Validation Execution |
| **Suppliers** | Column Mapping |
| **Business Events** | Rule Discovered |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Column Mapping |
| **Python Module** | app.discovery.auto_rule_discovery |
| **Database Schema** | engine, core |
| **Tables** | engine.rule_registry, core.rule_dataset_mapping |
| **API Status** | No (auto during execution) |
| **Frontend** | Validation > Rules (partial) |

### 3.2 Control Discovery

| Attribute | Value |
|-----------|-------|
| **Description** | Fetches enabled controls from DB and dispatches to control classes |
| **Purpose** | Fetch and configure validation controls |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Control registry |
| **Outputs** | Active controls |
| **Success Measures** | Control coverage |
| **Consumers** | Validation Execution |
| **Suppliers** | — |
| **Business Events** | Control Discovered |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | — |
| **Python Module** | app.execution.control_executor |
| **Database Schema** | engine |
| **Tables** | engine.control_registry |
| **API Status** | No |
| **Frontend** | None |

### 3.3 Validation Execution

| Attribute | Value |
|-----------|-------|
| **Description** | Orchestrates the full 6-step validation pipeline |
| **Purpose** | Execute the 6-step validation pipeline |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Project config, connections, mappings, rules, controls |
| **Outputs** | Execution results, batch summary |
| **Success Measures** | Execution success rate |
| **Consumers** | Governance Decisions, Reporting |
| **Suppliers** | Rule Discovery, Control Discovery |
| **Business Events** | Batch Started, Batch Completed, Batch Failed, Control Executed, Validation Failed |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | Rule Discovery, Control Discovery |
| **Python Module** | app.execution_engine |
| **Database Schema** | engine |
| **Tables** | engine.migration_validation_batch, engine.migration_batch_registry, engine.migration_control_summary |
| **API Status** | YES (Trigger + Status) |
| **Frontend** | Migration > Execution, Validation > Results |

### 3.4 Checkpointing

| Attribute | Value |
|-----------|-------|
| **Description** | Saves execution state for resume after failure |
| **Purpose** | Save execution state for resume |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Execution state |
| **Outputs** | Checkpoint records |
| **Success Measures** | Resume success rate |
| **Consumers** | Validation Execution |
| **Suppliers** | Validation Execution |
| **Business Events** | Checkpoint Created |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Validation Execution |
| **Python Module** | app.execution_engine |
| **Database Schema** | engine |
| **Tables** | engine.batch_execution_checkpoint |
| **API Status** | No (automatic) |
| **Frontend** | None |

### 3.5 Retry Engine

| Attribute | Value |
|-----------|-------|
| **Description** | Automatic retry of failed rules at multiple levels |
| **Purpose** | Automatically retry failed validations |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Failed validations |
| **Outputs** | Retry results |
| **Success Measures** | Retry success rate |
| **Consumers** | Validation Execution |
| **Suppliers** | Validation Execution |
| **Business Events** | Retry Triggered |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Validation Execution |
| **Python Module** | app.orchestration.retry.rule_retry_manager |
| **Database Schema** | — |
| **Tables** | — |
| **API Status** | No (automatic) |
| **Frontend** | None |

---

## 4. Governance & Compliance Domain

### 4.1 Governance Decisions

| Attribute | Value |
|-----------|-------|
| **Description** | Computes governance decisions post-execution |
| **Purpose** | Compute governance outcomes post-execution |
| **Business Owner** | Governance Officer |
| **Primary Users** | Compliance Officers |
| **Inputs** | Execution results |
| **Outputs** | Governance decisions |
| **Success Measures** | Decision accuracy |
| **Consumers** | Release Gates, Reporting |
| **Suppliers** | Validation Execution |
| **Business Events** | Governance Decision Made |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Validation Execution |
| **Python Module** | app.governance.decision_engine |
| **Database Schema** | engine |
| **Tables** | engine.migration_governance_status, engine.migration_control_decisions |
| **API Status** | No (auto post-execution) |
| **Frontend** | Governance (mock) |

### 4.2 Risk Scoring

| Attribute | Value |
|-----------|-------|
| **Description** | Calculate risk scores using weighted algorithms |
| **Purpose** | Calculate risk scores using weighted algorithms |
| **Business Owner** | Governance Officer |
| **Primary Users** | Compliance Officers |
| **Inputs** | Execution results |
| **Outputs** | Risk scores |
| **Success Measures** | Risk prediction accuracy |
| **Consumers** | Governance Decisions, Reporting |
| **Suppliers** | Validation Execution |
| **Business Events** | Risk Calculated, Anomaly Detected |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Validation Execution |
| **Python Module** | app.governance.risk_scoring |
| **Database Schema** | engine |
| **Tables** | engine.migration_risk_scores |
| **API Status** | No (auto post-execution) |
| **Frontend** | Risk (mock) |

### 4.3 Release Gates

| Attribute | Value |
|-----------|-------|
| **Description** | Approve/reject batch releases |
| **Purpose** | Approve/reject batch releases |
| **Business Owner** | Governance Officer |
| **Primary Users** | Programme Managers |
| **Inputs** | Governance decisions, risk scores |
| **Outputs** | Release decisions |
| **Success Measures** | Gate enforcement rate |
| **Consumers** | Notifications, Tasks |
| **Suppliers** | Governance Decisions |
| **Business Events** | Release Approved, Release Rejected |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | Governance Decisions |
| **Python Module** | app.execution_engine |
| **Database Schema** | engine |
| **Tables** | engine.migration_release_decision |
| **API Status** | No (auto post-execution) |
| **Frontend** | Governance (mock) |

### 4.4 Approvals

| Attribute | Value |
|-----------|-------|
| **Description** | Manage approval workflows |
| **Purpose** | Manage approval workflows |
| **Business Owner** | Governance Officer |
| **Primary Users** | Compliance Officers |
| **Inputs** | Approval requests |
| **Outputs** | Approval decisions |
| **Success Measures** | Approval cycle time |
| **Consumers** | Tasks, Notifications, Workflow |
| **Suppliers** | Release Gates |
| **Business Events** | Approval Requested, Approval Decided |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | Release Gates |
| **Python Module** | app.services.approval_service |
| **Database Schema** | platform |
| **Tables** | platform.approval_requests, platform.approval_step_instances |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Task Management > Approvals |

---

## 5. Reporting & Analytics Domain

### 5.1 Executive Reporting

| Attribute | Value |
|-----------|-------|
| **Description** | High-level programme health summaries |
| **Purpose** | High-level programme health summaries |
| **Business Owner** | Programme Sponsor |
| **Primary Users** | Executives |
| **Inputs** | Batch results |
| **Outputs** | Executive summaries |
| **Success Measures** | Report accuracy |
| **Consumers** | — |
| **Suppliers** | Validation Execution, Governance |
| **Business Events** | Report Generated |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | Validation Execution, Governance |
| **Python Module** | app.audit_export |
| **Database Schema** | engine, reporting |
| **Tables** | engine.v_migration_executive_summary |
| **API Status** | No (SQL views only) |
| **Frontend** | Reports (mock) |

### 5.2 Operational Reporting

| Attribute | Value |
|-----------|-------|
| **Description** | Detailed migration progress reports |
| **Purpose** | Detailed migration progress reports |
| **Business Owner** | Programme Manager |
| **Primary Users** | Migration Leads |
| **Inputs** | Execution details |
| **Outputs** | Operational reports |
| **Success Measures** | Report timeliness |
| **Consumers** | — |
| **Suppliers** | Validation Execution |
| **Business Events** | Report Generated |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | Validation Execution |
| **Python Module** | app.audit_export |
| **Database Schema** | engine |
| **Tables** | engine.v_migration_control_summary |
| **API Status** | No (SQL views only) |
| **Frontend** | Reports (mock) |

### 5.3 Governance Reporting

| Attribute | Value |
|-----------|-------|
| **Description** | Compliance and audit trail reports |
| **Purpose** | Compliance and audit trail reports |
| **Business Owner** | Governance Officer |
| **Primary Users** | Auditors |
| **Inputs** | Governance decisions |
| **Outputs** | Compliance reports |
| **Success Measures** | Audit pass rate |
| **Consumers** | — |
| **Suppliers** | Governance Decisions |
| **Business Events** | Report Generated |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | Governance Decisions |
| **Python Module** | app.audit_export |
| **Database Schema** | engine |
| **Tables** | engine.v_migration_governance_report |
| **API Status** | No (SQL views only) |
| **Frontend** | Reports (mock) |

### 5.4 Technical Reporting

| Attribute | Value |
|-----------|-------|
| **Description** | Validation details, exceptions, rule results |
| **Purpose** | Validation details, exceptions, rule results |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Inputs** | Execution details |
| **Outputs** | Technical reports |
| **Success Measures** | Report detail level |
| **Consumers** | — |
| **Suppliers** | Validation Execution |
| **Business Events** | Report Generated |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | Validation Execution |
| **Python Module** | app.audit_export |
| **Database Schema** | engine |
| **Tables** | engine.v_migration_exception_detail |
| **API Status** | No (SQL views only) |
| **Frontend** | Reports (mock) |

### 5.5 Dashboard Services

| Attribute | Value |
|-----------|-------|
| **Description** | Real-time KPI dashboards |
| **Purpose** | Real-time KPI dashboards |
| **Business Owner** | Programme Sponsor |
| **Primary Users** | All Users |
| **Inputs** | Batch results |
| **Outputs** | Dashboard visualisations |
| **Success Measures** | Dashboard accuracy |
| **Consumers** | — |
| **Suppliers** | Validation Execution, Governance |
| **Business Events** | — |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | Validation Execution, Governance |
| **Python Module** | app.scoring_engine |
| **Database Schema** | reporting |
| **Tables** | reporting.v_fact_batch, reporting.v_fact_control |
| **API Status** | No (SQL views only) |
| **Frontend** | Executive Dashboard |

### 5.6 Export Services

| Attribute | Value |
|-----------|-------|
| **Description** | PDF, Excel, CSV, PNG export |
| **Purpose** | PDF, Excel, CSV, PNG export |
| **Business Owner** | Programme Manager |
| **Primary Users** | All Users |
| **Inputs** | Report data |
| **Outputs** | Exported files |
| **Success Measures** | Export success rate |
| **Consumers** | — |
| **Suppliers** | Reporting capabilities |
| **Business Events** | — |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | Reporting capabilities |
| **Python Module** | app.audit_export |
| **Database Schema** | — |
| **Tables** | — |
| **API Status** | No (CLI only) |
| **Frontend** | None |

---

## 6. Platform Services Domain

### 6.1 Workflow Management

| Attribute | Value |
|-----------|-------|
| **Description** | Define and execute business workflows |
| **Purpose** | Define and execute business workflows |
| **Business Owner** | Administrator |
| **Primary Users** | All Users |
| **Inputs** | Workflow definitions |
| **Outputs** | Workflow instances |
| **Success Measures** | Workflow completion rate |
| **Consumers** | Tasks, Notifications |
| **Suppliers** | — |
| **Business Events** | Workflow Completed |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | app.services.workflow_service |
| **Database Schema** | platform |
| **Tables** | platform.workflow_definitions, platform.workflow_instances |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Task Management > Workflows |

### 6.2 Task Management

| Attribute | Value |
|-----------|-------|
| **Description** | Track and assign migration tasks |
| **Purpose** | Track and assign migration tasks |
| **Business Owner** | Programme Manager |
| **Primary Users** | All Users |
| **Inputs** | Task definitions |
| **Outputs** | Task assignments |
| **Success Measures** | Task completion rate |
| **Consumers** | Notifications, Calendar |
| **Suppliers** | — |
| **Business Events** | Task Created, Task Completed |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | app.services.task_service |
| **Database Schema** | platform |
| **Tables** | platform.tasks, platform.task_comments, platform.task_dependencies |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Task Management > Dashboard, My Tasks, All Tasks |

### 6.3 Notification Services

| Attribute | Value |
|-----------|-------|
| **Description** | Alert users of events and actions |
| **Purpose** | Alert users of events and actions |
| **Business Owner** | Administrator |
| **Primary Users** | All Users |
| **Inputs** | Event notifications |
| **Outputs** | User notifications |
| **Success Measures** | Notification delivery rate |
| **Consumers** | — |
| **Suppliers** | All capabilities |
| **Business Events** | Notification Sent |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | All capabilities |
| **Python Module** | app.services.notification_service |
| **Database Schema** | platform |
| **Tables** | platform.notifications, platform.notification_preferences |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Task Management > Notifications |

### 6.4 Calendar Services

| Attribute | Value |
|-----------|-------|
| **Description** | Schedule and track events |
| **Purpose** | Schedule and track events |
| **Business Owner** | Administrator |
| **Primary Users** | All Users |
| **Inputs** | Event definitions |
| **Outputs** | Calendar events |
| **Success Measures** | Event scheduling accuracy |
| **Consumers** | — |
| **Suppliers** | Tasks, Notifications |
| **Business Events** | — |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | Tasks, Notifications |
| **Python Module** | app.services.calendar_service |
| **Database Schema** | platform |
| **Tables** | platform.calendar_events, platform.calendar_event_reminders |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Task Management > Calendar |

### 6.5 AI / MAP Copilot

| Attribute | Value |
|-----------|-------|
| **Description** | Natural language assistance and insights |
| **Purpose** | Natural language assistance and insights |
| **Business Owner** | Administrator |
| **Primary Users** | All Users |
| **Inputs** | User queries |
| **Outputs** | AI responses |
| **Success Measures** | Response accuracy |
| **Consumers** | — |
| **Suppliers** | All capabilities |
| **Business Events** | — |
| **Lifecycle Stage** | Proposed |
| **Maturity Score** | 1 (Initial) |
| **Dependencies** | All capabilities |
| **Python Module** | app.ai.framework |
| **Database Schema** | — |
| **Tables** | — |
| **API Status** | No (frontend-local) |
| **Frontend** | AI (mock) |

### 6.6 Authentication

| Attribute | Value |
|-----------|-------|
| **Description** | Identity management and SSO |
| **Purpose** | Identity management and SSO |
| **Business Owner** | Security Officer |
| **Primary Users** | All Users |
| **Inputs** | User credentials |
| **Outputs** | JWT tokens |
| **Success Measures** | Authentication success rate |
| **Consumers** | All capabilities |
| **Suppliers** | — |
| **Business Events** | Login Successful, Login Failed |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | app.services.auth_service |
| **Database Schema** | platform |
| **Tables** | platform.users, platform.refresh_tokens, platform.user_sessions |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Login |

---

## 7. Administration Domain

### 7.1 User Management

| Attribute | Value |
|-----------|-------|
| **Description** | Create, update, deactivate users |
| **Purpose** | Create, update, deactivate users |
| **Business Owner** | Administrator |
| **Primary Users** | Administrators |
| **Inputs** | User details |
| **Outputs** | User accounts |
| **Success Measures** | User management efficiency |
| **Consumers** | All capabilities |
| **Suppliers** | — |
| **Business Events** | User Created |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | app.services.user_service |
| **Database Schema** | platform |
| **Tables** | platform.users, platform.user_roles |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Administration > Users |

### 7.2 Role & Permission Management

| Attribute | Value |
|-----------|-------|
| **Description** | Define RBAC roles and permissions |
| **Purpose** | Define RBAC roles and permissions |
| **Business Owner** | Administrator |
| **Primary Users** | Administrators |
| **Inputs** | Role definitions |
| **Outputs** | Role assignments |
| **Success Measures** | Permission accuracy |
| **Consumers** | All capabilities |
| **Suppliers** | — |
| **Business Events** | Role Assigned |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | app.services.role_service |
| **Database Schema** | platform |
| **Tables** | platform.roles, platform.permissions, platform.role_permissions |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Administration > Roles |

### 7.3 Tenant Management

| Attribute | Value |
|-----------|-------|
| **Description** | Multi-tenant configuration |
| **Purpose** | Multi-tenant configuration |
| **Business Owner** | Administrator |
| **Primary Users** | Administrators |
| **Inputs** | Tenant details |
| **Outputs** | Tenant configurations |
| **Success Measures** | Tenant isolation |
| **Consumers** | All capabilities |
| **Suppliers** | — |
| **Business Events** | — |
| **Lifecycle Stage** | Proposed |
| **Maturity Score** | 1 (Initial) |
| **Dependencies** | — |
| **Python Module** | — |
| **Database Schema** | core |
| **Tables** | core.tenants |
| **API Status** | No |
| **Frontend** | Administration > Tenants (mock) |

### 7.4 System Settings

| Attribute | Value |
|-----------|-------|
| **Description** | Platform configuration |
| **Purpose** | Platform configuration |
| **Business Owner** | Administrator |
| **Primary Users** | Administrators |
| **Inputs** | Setting values |
| **Outputs** | Updated settings |
| **Success Measures** | Setting accuracy |
| **Consumers** | All capabilities |
| **Suppliers** | — |
| **Business Events** | Settings Changed |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | app.services.settings_service |
| **Database Schema** | platform |
| **Tables** | platform.system_settings |
| **API Status** | YES (Full CRUD) |
| **Frontend** | Settings |

### 7.5 Feature Flags

| Attribute | Value |
|-----------|-------|
| **Description** | Toggle features by tenant/user |
| **Purpose** | Toggle features by tenant/user |
| **Business Owner** | Administrator |
| **Primary Users** | Administrators |
| **Inputs** | Flag definitions |
| **Outputs** | Feature toggles |
| **Success Measures** | Flag accuracy |
| **Consumers** | All capabilities |
| **Suppliers** | — |
| **Business Events** | — |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 3 (Defined) |
| **Dependencies** | — |
| **Python Module** | app.services.settings_service |
| **Database Schema** | platform |
| **Tables** | platform.feature_flags |
| **API Status** | YES (list) |
| **Frontend** | Administration > Feature Flags (mock) |

### 7.6 Security Management

| Attribute | Value |
|-----------|-------|
| **Description** | Encryption, keys, certificates |
| **Purpose** | Encryption, keys, certificates |
| **Business Owner** | Security Officer |
| **Primary Users** | Security Analysts |
| **Inputs** | Security policies |
| **Outputs** | Security configurations |
| **Success Measures** | Security compliance |
| **Consumers** | All capabilities |
| **Suppliers** | — |
| **Business Events** | — |
| **Lifecycle Stage** | Proposed |
| **Maturity Score** | 1 (Initial) |
| **Dependencies** | — |
| **Python Module** | — |
| **Database Schema** | audit |
| **Tables** | audit.security_events |
| **API Status** | No |
| **Frontend** | Security (mock) |

### 7.7 Audit Trail

| Attribute | Value |
|-----------|-------|
| **Description** | Immutable audit log |
| **Purpose** | Immutable audit log |
| **Business Owner** | Security Officer |
| **Primary Users** | Auditors |
| **Inputs** | API calls |
| **Outputs** | Audit events |
| **Success Measures** | Audit completeness |
| **Consumers** | — |
| **Suppliers** | All capabilities |
| **Business Events** | — |
| **Lifecycle Stage** | Implemented |
| **Maturity Score** | 2 (Repeatable) |
| **Dependencies** | All capabilities |
| **Python Module** | app.api.core.middleware.audit_middleware |
| **Database Schema** | audit |
| **Tables** | audit.audit_events, audit.api_call_log |
| **API Status** | No (middleware) |
| **Frontend** | Security > Audit Logs (mock) |

### 7.8 Maintenance & Health

| Attribute | Value |
|-----------|-------|
| **Description** | System health monitoring |
| **Purpose** | System health monitoring |
| **Business Owner** | Administrator |
| **Primary Users** | Administrators |
| **Inputs** | Health checks |
| **Outputs** | Health status |
| **Success Measures** | System uptime |
| **Consumers** | — |
| **Suppliers** | — |
| **Business Events** | — |
| **Lifecycle Stage** | Operational |
| **Maturity Score** | 4 (Managed) |
| **Dependencies** | — |
| **Python Module** | — |
| **Database Schema** | — |
| **Tables** | — |
| **API Status** | YES (health checks) |
| **Frontend** | Operations > Health (mock) |

---

*This catalogue is part of the Enterprise Business Capability Model (Prompt 16). All findings are based on source code analysis — no code was modified.*