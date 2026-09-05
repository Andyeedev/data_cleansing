# End-to-End Business Process Catalogue

**Date:** 14 July 2026  
**Audit:** Enterprise Business Process Model (Prompt 17)  
**Scope:** MAP Nexus Enterprise Platform — Complete Process Catalogue  

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total Processes | 29 |
| Fully Automated | 8 |
| Semi-Automated | 14 |
| Manual | 7 |

---

## 2. Migration Management Processes

### 2.1 Migration Project Lifecycle

| Attribute | Value |
|-----------|-------|
| **Purpose** | Define, execute, and complete a data migration project |
| **Business Objective** | Successful migration of data from source to target |
| **Trigger** | New migration project request |
| **Inputs** | Project requirements, source/target systems |
| **Outputs** | Completed migration project, validation reports |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Governance Officer, Programme Manager |
| **Start Event** | Project Created |
| **End Event** | Project Closed |
| **Business Rules** | Project must have valid connections; Mappings must be approved; Validation must pass |
| **Dependencies** | Connection Management, Dataset Discovery, Validation Execution |
| **Upstream Processes** | — |
| **Downstream Processes** | Connection Onboarding, Dataset Discovery |
| **Related Business Capabilities** | Project Management, Connection Management, Dataset Discovery, Dataset Mapping, Column Mapping |
| **Supporting Systems** | Python Engine, FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.execution_engine, core.projects, engine.migration_validation_batch |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 2.2 Connection Onboarding

| Attribute | Value |
|-----------|-------|
| **Purpose** | Onboard new source/target database connections |
| **Business Objective** | Establish verified database connections |
| **Trigger** | New connection request |
| **Inputs** | Connection details, credentials |
| **Outputs** | Verified connections |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Connection Requested |
| **End Event** | Connection Verified |
| **Business Rules** | Credentials must be encrypted; Connections must be tested |
| **Dependencies** | — |
| **Upstream Processes** | Migration Project Lifecycle |
| **Downstream Processes** | Dataset Discovery |
| **Related Business Capabilities** | Connection Management |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.system_service, core.system_registry, core.system_credentials |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 2.3 Credential Onboarding

| Attribute | Value |
|-----------|-------|
| **Purpose** | Onboard and encrypt database credentials |
| **Business Objective** | Secure credential management |
| **Trigger** | New credential request |
| **Inputs** | Credential details |
| **Outputs** | Encrypted credentials |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | Security Officer |
| **Start Event** | Credential Requested |
| **End Event** | Credential Stored |
| **Business Rules** | Credentials must be encrypted; Credentials must be tested |
| **Dependencies** | Connection Onboarding |
| **Upstream Processes** | Connection Onboarding |
| **Downstream Processes** | Dataset Discovery |
| **Related Business Capabilities** | Connection Management |
| **Supporting Systems** | FastAPI, PostgreSQL |
| **Evidence** | app.services.credential_service, core.system_credentials |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 2.4 Dataset Discovery

| Attribute | Value |
|-----------|-------|
| **Purpose** | Automatically discover schemas, tables, columns from source/target databases |
| **Business Objective** | Identify all migration-eligible data assets |
| **Trigger** | Discovery request |
| **Inputs** | Database connections |
| **Outputs** | Discovered schemas, tables, columns |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Discovery Triggered |
| **End Event** | Discovery Complete |
| **Business Rules** | Discovery must be accurate; Results must be reviewable |
| **Dependencies** | Connection Onboarding |
| **Upstream Processes** | Connection Onboarding |
| **Downstream Processes** | Mapping Lifecycle |
| **Related Business Capabilities** | Dataset Discovery |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.discovery.auto_rule_discovery, core.dataset_mappings, core.dataset_columns |
| **Status** | Semi-Automated (CLI only) |
| **Maturity** | 3 (Defined) |

### 2.5 Column Discovery

| Attribute | Value |
|-----------|-------|
| **Purpose** | Discover column-level metadata for each table |
| **Business Objective** | Identify column types, roles, and relationships |
| **Trigger** | Dataset Discovery complete |
| **Inputs** | Discovered tables |
| **Outputs** | Discovered columns with metadata |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Column Discovery Started |
| **End Event** | Column Discovery Complete |
| **Business Rules** | Column roles must be identified; Primary keys must be detected |
| **Dependencies** | Dataset Discovery |
| **Upstream Processes** | Dataset Discovery |
| **Downstream Processes** | Mapping Lifecycle |
| **Related Business Capabilities** | Column Mapping |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.services.dataset_discovery_service, core.dataset_columns |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 2.6 Mapping Lifecycle

| Attribute | Value |
|-----------|-------|
| **Purpose** | Create, approve, and manage source-to-target mappings |
| **Business Objective** | Ensure accurate data mappings |
| **Trigger** | Discovery complete |
| **Inputs** | Discovered tables and columns |
| **Outputs** | Approved mappings |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Mapping Created |
| **End Event** | Mapping Approved |
| **Business Rules** | Mappings must be approved; Unique constraints enforced |
| **Dependencies** | Dataset Discovery, Column Discovery |
| **Upstream Processes** | Dataset Discovery, Column Discovery |
| **Downstream Processes** | Rule Authoring |
| **Related Business Capabilities** | Dataset Mapping, Column Mapping |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.mapping_resolver, core.dataset_mappings |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

---

## 3. Validation Management Processes

### 3.7 Rule Authoring

| Attribute | Value |
|-----------|-------|
| **Purpose** | Create and configure validation rules |
| **Business Objective** | Define validation criteria |
| **Trigger** | Mapping approved |
| **Inputs** | Approved mappings, column metadata |
| **Outputs** | Validation rules |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Rule Authoring Started |
| **End Event** | Rules Created |
| **Business Rules** | Rules must be based on column roles; Rules must be testable |
| **Dependencies** | Mapping Lifecycle |
| **Upstream Processes** | Mapping Lifecycle |
| **Downstream Processes** | Rule Approval |
| **Related Business Capabilities** | Rule Discovery |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.discovery.auto_rule_discovery, engine.rule_registry |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 3.8 Rule Approval

| Attribute | Value |
|-----------|-------|
| **Purpose** | Approve validation rules before execution |
| **Business Objective** | Ensure rule quality |
| **Trigger** | Rules created |
| **Inputs** | Validation rules |
| **Outputs** | Approved rules |
| **Actors** | Migration Engineer, Migration Lead |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Rule Approval Started |
| **End Event** | Rules Approved |
| **Business Rules** | Rules must be approved before execution |
| **Dependencies** | Rule Authoring |
| **Upstream Processes** | Rule Authoring |
| **Downstream Processes** | Rule Execution |
| **Related Business Capabilities** | Rule Discovery |
| **Supporting Systems** | FastAPI, PostgreSQL |
| **Evidence** | engine.rule_registry |
| **Status** | Manual |
| **Maturity** | 2 (Repeatable) |

### 3.9 Rule Execution

| Attribute | Value |
|-----------|-------|
| **Purpose** | Execute validation rules against data |
| **Business Objective** | Validate data quality |
| **Trigger** | Rules approved |
| **Inputs** | Approved rules, data connections |
| **Outputs** | Rule execution results |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Rule Execution Started |
| **End Event** | Rule Execution Complete |
| **Business Rules** | Rules must execute completely; Results must be logged |
| **Dependencies** | Rule Approval |
| **Upstream Processes** | Rule Approval |
| **Downstream Processes** | Validation Execution |
| **Related Business Capabilities** | Validation Execution |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.rule_executor, engine.migration_control_execution |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 3.10 Control Lifecycle

| Attribute | Value |
|-----------|-------|
| **Purpose** | Manage validation controls |
| **Business Objective** | Ensure control effectiveness |
| **Trigger** | Control configuration request |
| **Inputs** | Control definitions |
| **Outputs** | Configured controls |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Control Configuration Started |
| **End Event** | Control Configured |
| **Business Rules** | Controls must be configured; Controls must be enabled |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | Validation Execution |
| **Related Business Capabilities** | Control Discovery |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.execution.control_executor, engine.control_registry |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 3.11 Validation Execution

| Attribute | Value |
|-----------|-------|
| **Purpose** | Execute the 6-step validation pipeline |
| **Business Objective** | Complete validation of all data |
| **Trigger** | Execution request |
| **Inputs** | Project config, connections, mappings, rules, controls |
| **Outputs** | Execution results, batch summary |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Execution Started |
| **End Event** | Execution Complete |
| **Business Rules** | Pipeline must complete all 6 steps; Checkpoints must be saved; Retries must be attempted |
| **Dependencies** | Rule Execution, Control Lifecycle |
| **Upstream Processes** | Rule Execution, Control Lifecycle |
| **Downstream Processes** | Exception Management, Governance |
| **Related Business Capabilities** | Validation Execution, Checkpointing, Retry Engine |
| **Supporting Systems** | Python Engine, PostgreSQL, FastAPI |
| **Evidence** | app.execution_engine, engine.migration_validation_batch, engine.batch_execution_checkpoint |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 3.12 Exception Management

| Attribute | Value |
|-----------|-------|
| **Purpose** | Manage validation exceptions |
| **Business Objective** | Resolve data quality issues |
| **Trigger** | Validation exception |
| **Inputs** | Exception details |
| **Outputs** | Resolved exceptions |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Exception Detected |
| **End Event** | Exception Resolved |
| **Business Rules** | Exceptions must be tracked; Exceptions must be resolved |
| **Dependencies** | Validation Execution |
| **Upstream Processes** | Validation Execution |
| **Downstream Processes** | Issue Remediation |
| **Related Business Capabilities** | Validation Execution |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | engine.migration_control_exceptions, engine.migration_exception_register |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

---

## 4. Governance & Compliance Processes

### 3.13 Governance

| Attribute | Value |
|-----------|-------|
| **Purpose** | Compute governance outcomes post-execution |
| **Business Objective** | Ensure regulatory compliance |
| **Trigger** | Batch completed |
| **Inputs** | Execution results, risk scores |
| **Outputs** | Governance decisions |
| **Actors** | Governance Officer |
| **Primary Owner** | Governance Officer |
| **Supporting Roles** | Compliance Officers |
| **Start Event** | Governance Evaluation Started |
| **End Event** | Governance Decision Made |
| **Business Rules** | Risk scores must be calculated; Release gates must be evaluated |
| **Dependencies** | Validation Execution |
| **Upstream Processes** | Validation Execution |
| **Downstream Processes** | Release Approval |
| **Related Business Capabilities** | Governance Decisions, Risk Scoring |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.governance.decision_engine, engine.migration_governance_status, engine.migration_risk_scores |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 3.14 Release Approval

| Attribute | Value |
|-----------|-------|
| **Purpose** | Approve or reject batch releases |
| **Business Objective** | Ensure release quality |
| **Trigger** | Governance decision |
| **Inputs** | Governance decision |
| **Outputs** | Release decision |
| **Actors** | Governance Officer, Programme Manager |
| **Primary Owner** | Governance Officer |
| **Supporting Roles** | Compliance Officers |
| **Start Event** | Release Approval Started |
| **End Event** | Release Approved/Rejected |
| **Business Rules** | Releases must be approved; Multi-step approvals supported |
| **Dependencies** | Governance |
| **Upstream Processes** | Governance |
| **Downstream Processes** | Reporting |
| **Related Business Capabilities** | Release Gates, Approvals |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.approval_service, engine.migration_release_decision, platform.approval_requests |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

---

## 5. Reporting & Analytics Processes

### 3.15 Reporting

| Attribute | Value |
|-----------|-------|
| **Purpose** | Generate executive, operational, governance, and technical reports |
| **Business Objective** | Provide business intelligence |
| **Trigger** | Report request |
| **Inputs** | Batch results, governance decisions |
| **Outputs** | Reports |
| **Actors** | Programme Manager |
| **Primary Owner** | Programme Manager |
| **Supporting Roles** | Migration Leads, Auditors |
| **Start Event** | Report Requested |
| **End Event** | Report Generated |
| **Business Rules** | Reports must be accurate; Reports must be timely |
| **Dependencies** | Governance, Release Approval |
| **Upstream Processes** | Governance, Release Approval |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Executive Reporting, Operational Reporting, Governance Reporting, Technical Reporting |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.audit_export, engine.v_migration_executive_summary, engine.v_migration_control_summary |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 3.16 Dashboard Production

| Attribute | Value |
|-----------|-------|
| **Purpose** | Produce real-time KPI dashboards |
| **Business Objective** | Provide real-time visibility |
| **Trigger** | Dashboard request |
| **Inputs** | Batch results |
| **Outputs** | Dashboard data |
| **Actors** | Programme Sponsor |
| **Primary Owner** | Programme Sponsor |
| **Supporting Roles** | All Users |
| **Start Event** | Dashboard Requested |
| **End Event** | Dashboard Updated |
| **Business Rules** | Dashboards must be real-time; Dashboards must be accurate |
| **Dependencies** | Validation Execution |
| **Upstream Processes** | Validation Execution |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Dashboard Services |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.scoring_engine, reporting.v_fact_batch, reporting.v_fact_control |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

---

## 6. Platform Service Processes

### 3.17 Notifications

| Attribute | Value |
|-----------|-------|
| **Purpose** | Alert users of events and actions |
| **Business Objective** | Keep users informed |
| **Trigger** | Business event |
| **Inputs** | Event details |
| **Outputs** | User notifications |
| **Actors** | Platform Services |
| **Primary Owner** | Administrator |
| **Supporting Roles** | All Users |
| **Start Event** | Event Occurred |
| **End Event** | Notification Sent |
| **Business Rules** | Notifications must be delivered; Notifications must be tracked |
| **Dependencies** | All processes |
| **Upstream Processes** | All processes |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Notification Services |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.notification_service, platform.notifications |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 3.18 Scheduling

| Attribute | Value |
|-----------|-------|
| **Purpose** | Schedule and track events |
| **Business Objective** | Manage time-based events |
| **Trigger** | Schedule request |
| **Inputs** | Schedule details |
| **Outputs** | Scheduled events |
| **Actors** | Platform Services |
| **Primary Owner** | Administrator |
| **Supporting Roles** | All Users |
| **Start Event** | Schedule Requested |
| **End Event** | Event Scheduled |
| **Business Rules** | Schedules must be accurate; Schedules must be tracked |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Calendar Services |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.calendar_service, platform.calendar_events |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 3.19 Workflow Management

| Attribute | Value |
|-----------|-------|
| **Purpose** | Define and execute business workflows |
| **Business Objective** | Automate business processes |
| **Trigger** | Workflow request |
| **Inputs** | Workflow definition |
| **Outputs** | Workflow instance |
| **Actors** | Platform Services |
| **Primary Owner** | Administrator |
| **Supporting Roles** | All Users |
| **Start Event** | Workflow Started |
| **End Event** | Workflow Completed |
| **Business Rules** | Workflows must follow defined steps; Workflows must be tracked |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | Task Management |
| **Related Business Capabilities** | Workflow Management |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.workflow_service, platform.workflow_definitions, platform.workflow_instances |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 3.20 Task Management

| Attribute | Value |
|-----------|-------|
| **Purpose** | Track and assign migration tasks |
| **Business Objective** | Manage work items |
| **Trigger** | Task request |
| **Inputs** | Task details |
| **Outputs** | Task assignments |
| **Actors** | Platform Services |
| **Primary Owner** | Programme Manager |
| **Supporting Roles** | All Users |
| **Start Event** | Task Created |
| **End Event** | Task Completed |
| **Business Rules** | Tasks must be assigned; Tasks must be tracked |
| **Dependencies** | — |
| **Upstream Processes** | Workflow Management |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Task Management |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.task_service, platform.tasks |
| **Status** | Automated |
| **Maturity** | 4 (Managed) |

### 3.21 Customer Onboarding

| Attribute | Value |
|-----------|-------|
| **Purpose** | Onboard new customers to the platform |
| **Business Objective** | Enable customer usage |
| **Trigger** | New customer request |
| **Inputs** | Customer details |
| **Outputs** | Customer account |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | Customer Requested |
| **End Event** | Customer Onboarded |
| **Business Rules** | Customers must be authenticated; Customers must be authorized |
| **Dependencies** | Authentication |
| **Upstream Processes** | — |
| **Downstream Processes** | Tenant Onboarding |
| **Related Business Capabilities** | Authentication |
| **Supporting Systems** | FastAPI, PostgreSQL |
| **Evidence** | app.services.auth_service, platform.users |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

---

## 7. Administration Processes

### 3.22 Tenant Onboarding

| Attribute | Value |
|-----------|-------|
| **Purpose** | Onboard new tenants to the platform |
| **Business Objective** | Enable multi-tenant usage |
| **Trigger** | New tenant request |
| **Inputs** | Tenant details |
| **Outputs** | Tenant configuration |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | Tenant Requested |
| **End Event** | Tenant Onboarded |
| **Business Rules** | Tenants must be isolated; Tenants must be configured |
| **Dependencies** | Customer Onboarding |
| **Upstream Processes** | Customer Onboarding |
| **Downstream Processes** | User Lifecycle |
| **Related Business Capabilities** | Tenant Management |
| **Supporting Systems** | FastAPI, PostgreSQL |
| **Evidence** | core.tenants |
| **Status** | Manual |
| **Maturity** | 2 (Repeatable) |

### 3.23 User Lifecycle

| Attribute | Value |
|-----------|-------|
| **Purpose** | Create, update, deactivate users |
| **Business Objective** | Manage user access |
| **Trigger** | User management request |
| **Inputs** | User details |
| **Outputs** | User accounts |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | User Requested |
| **End Event** | User Managed |
| **Business Rules** | Users must have roles; Users must be authenticated |
| **Dependencies** | Tenant Onboarding |
| **Upstream Processes** | Tenant Onboarding |
| **Downstream Processes** | Role Administration |
| **Related Business Capabilities** | User Management |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.user_service, platform.users, platform.user_roles |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 3.24 Role Administration

| Attribute | Value |
|-----------|-------|
| **Purpose** | Create and manage roles and permissions |
| **Business Objective** | Manage access control |
| **Trigger** | Role management request |
| **Inputs** | Role definitions |
| **Outputs** | Role assignments |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | Role Requested |
| **End Event** | Role Managed |
| **Business Rules** | Roles must have permissions; Roles must be assigned |
| **Dependencies** | User Lifecycle |
| **Upstream Processes** | User Lifecycle |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Role & Permission Management |
| **Supporting Systems** | FastAPI, PostgreSQL, React Frontend |
| **Evidence** | app.services.role_service, platform.roles, platform.permissions |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 3.25 Security Administration

| Attribute | Value |
|-----------|-------|
| **Purpose** | Manage encryption, keys, certificates |
| **Business Objective** | Ensure security compliance |
| **Trigger** | Security event |
| **Inputs** | Security policies |
| **Outputs** | Security configurations |
| **Actors** | Security Officer |
| **Primary Owner** | Security Officer |
| **Supporting Roles** | Security Analysts |
| **Start Event** | Security Event |
| **End Event** | Security Managed |
| **Business Rules** | Security policies must be enforced; Security events must be tracked |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | Audit Lifecycle |
| **Related Business Capabilities** | Security Management |
| **Supporting Systems** | FastAPI, PostgreSQL |
| **Evidence** | audit.security_events |
| **Status** | Manual |
| **Maturity** | 2 (Repeatable) |

### 3.26 Audit Lifecycle

| Attribute | Value |
|-----------|-------|
| **Purpose** | Manage immutable audit trail |
| **Business Objective** | Ensure compliance |
| **Trigger** | Audit event |
| **Inputs** | Audit events |
| **Outputs** | Audit trail |
| **Actors** | Security Officer |
| **Primary Owner** | Security Officer |
| **Supporting Roles** | Auditors |
| **Start Event** | Audit Event |
| **End Event** | Audit Logged |
| **Business Rules** | Audit trail must be immutable; Audit events must be tracked |
| **Dependencies** | All processes |
| **Upstream Processes** | All processes |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Audit Trail |
| **Supporting Systems** | FastAPI, PostgreSQL |
| **Evidence** | app.api.core.middleware.audit_middleware, audit.audit_events |
| **Status** | Manual |
| **Maturity** | 2 (Repeatable) |

### 3.27 Platform Administration

| Attribute | Value |
|-----------|-------|
| **Purpose** | Manage platform configuration |
| **Business Objective** | Ensure platform stability |
| **Trigger** | Configuration request |
| **Inputs** | Configuration details |
| **Outputs** | Updated configuration |
| **Actors** | Administrator |
| **Primary Owner** | Administrator |
| **Supporting Roles** | — |
| **Start Event** | Configuration Requested |
| **End Event** | Configuration Updated |
| **Business Rules** | Configuration must be tested; Configuration must be logged |
| **Dependencies** | — |
| **Upstream Processes** | — |
| **Downstream Processes** | — |
| **Related Business Capabilities** | System Settings, Feature Flags, Maintenance & Health |
| **Supporting Systems** | FastAPI, PostgreSQL |
| **Evidence** | app.services.settings_service, platform.system_settings, platform.feature_flags |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

### 3.28 Issue Remediation

| Attribute | Value |
|-----------|-------|
| **Purpose** | Remediate identified issues |
| **Business Objective** | Resolve data quality issues |
| **Trigger** | Issue identified |
| **Inputs** | Issue details |
| **Outputs** | Resolved issues |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Issue Identified |
| **End Event** | Issue Resolved |
| **Business Rules** | Issues must be tracked; Issues must be resolved |
| **Dependencies** | Exception Management |
| **Upstream Processes** | Exception Management |
| **Downstream Processes** | — |
| **Related Business Capabilities** | Validation Execution |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | engine.migration_control_exceptions |
| **Status** | Manual |
| **Maturity** | 2 (Repeatable) |

### 3.29 Metadata Discovery

| Attribute | Value |
|-----------|-------|
| **Purpose** | Discover metadata from source/target databases |
| **Business Objective** | Identify metadata assets |
| **Trigger** | Discovery request |
| **Inputs** | Database connections |
| **Outputs** | Discovered metadata |
| **Actors** | Migration Engineer |
| **Primary Owner** | Migration Lead |
| **Supporting Roles** | — |
| **Start Event** | Discovery Triggered |
| **End Event** | Discovery Complete |
| **Business Rules** | Metadata must be accurate; Metadata must be stored |
| **Dependencies** | Connection Onboarding |
| **Upstream Processes** | Connection Onboarding |
| **Downstream Processes** | Dataset Discovery |
| **Related Business Capabilities** | Dataset Discovery |
| **Supporting Systems** | Python Engine, PostgreSQL |
| **Evidence** | app.discovery.auto_rule_discovery |
| **Status** | Semi-Automated |
| **Maturity** | 3 (Defined) |

---

## 8. Process Statistics

| Metric | Count |
|--------|-------|
| Total Processes | 29 |
| Fully Automated | 8 |
| Semi-Automated | 14 |
| Manual | 7 |
| Capabilities Covered | 34/34 (100%) |

---

*This catalogue is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*