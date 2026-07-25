# End-to-End Business Process Catalogue

**Date:** 14 July 2026  
**Audit:** Enterprise Business Process Model (Prompt 17)  
**Scope:** MAP Nexus Enterprise Platform — Complete Process Catalogue  

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total Processes | 11 |
| Automated | 5 |
| Semi-Automated | 4 |
| Manual | 2 |

---

## 2. Process Catalogue

### 2.1 Migration Project Lifecycle

| Attribute | Value |
|-----------|-------|
| **Process Name** | Migration Project Lifecycle |
| **Business Objective** | Define, execute, and complete a data migration project |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Trigger** | New migration project request |
| **Inputs** | Project requirements, source/target systems |
| **Outputs** | Completed migration project, validation reports |
| **Start Event** | Project Created |
| **End Event** | Project Closed |
| **Business Rules** | Project must have valid connections; Mappings must be approved; Validation must pass |
| **Systems Used** | Python Engine, FastAPI, PostgreSQL, React Frontend |
| **Business Capabilities Used** | Project Management, Connection Management, Dataset Discovery, Dataset Mapping, Column Mapping |
| **Related APIs** | POST /api/v1/execution/run, GET /api/v1/execution/status/{id} |
| **Related Database Tables** | core.projects, engine.migration_validation_batch, core.dataset_mappings |
| **Process Status** | Semi-Automated |
| **Process Maturity** | 3 (Defined) |

### 2.2 Connection Management

| Attribute | Value |
|-----------|-------|
| **Process Name** | Connection Management |
| **Business Objective** | Manage source/target database connections |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Trigger** | New connection request |
| **Inputs** | Connection details, credentials |
| **Outputs** | Verified connections |
| **Start Event** | Connection Requested |
| **End Event** | Connection Verified |
| **Business Rules** | Credentials must be encrypted; Connections must be tested |
| **Systems Used** | FastAPI, PostgreSQL, React Frontend |
| **Business Capabilities Used** | Connection Management |
| **Related APIs** | GET/POST /api/v1/systems/, GET/POST/PUT/DELETE /api/v1/credentials/ |
| **Related Database Tables** | core.system_registry, core.system_credentials |
| **Process Status** | Automated |
| **Process Maturity** | 4 (Managed) |

### 2.3 Dataset Discovery

| Attribute | Value |
|-----------|-------|
| **Process Name** | Dataset Discovery |
| **Business Objective** | Automatically discover schemas, tables, columns from source/target databases |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Trigger** | Discovery request |
| **Inputs** | Database connections |
| **Outputs** | Discovered schemas, tables, columns |
| **Start Event** | Discovery Triggered |
| **End Event** | Discovery Complete |
| **Business Rules** | Discovery must be accurate; Results must be reviewable |
| **Systems Used** | Python Engine, PostgreSQL |
| **Business Capabilities Used** | Dataset Discovery |
| **Related APIs** | (CLI only) |
| **Related Database Tables** | core.dataset_mappings, core.dataset_columns |
| **Process Status** | Semi-Automated |
| **Process Maturity** | 3 (Defined) |

### 2.4 Validation Execution

| Attribute | Value |
|-----------|-------|
| **Process Name** | Validation Execution |
| **Business Objective** | Execute the 6-step validation pipeline |
| **Business Owner** | Migration Lead |
| **Primary Users** | Migration Engineers |
| **Trigger** | Execution request |
| **Inputs** | Project config, connections, mappings, rules, controls |
| **Outputs** | Execution results, batch summary |
| **Start Event** | Execution Started |
| **End Event** | Execution Complete |
| **Business Rules** | Pipeline must complete all 6 steps; Checkpoints must be saved; Retries must be attempted |
| **Systems Used** | Python Engine, PostgreSQL, FastAPI |
| **Business Capabilities Used** | Validation Execution, Checkpointing, Retry Engine |
| **Related APIs** | POST /api/v1/execution/run, GET /api/v1/execution/status/{id} |
| **Related Database Tables** | engine.migration_validation_batch, engine.migration_batch_registry, engine.batch_execution_checkpoint |
| **Process Status** | Automated |
| **Process Maturity** | 4 (Managed) |

### 2.5 Governance Decision

| Attribute | Value |
|-----------|-------|
| **Process Name** | Governance Decision |
| **Business Objective** | Compute governance outcomes post-execution |
| **Business Owner** | Governance Officer |
| **Primary Users** | Compliance Officers |
| **Trigger** | Batch completed |
| **Inputs** | Execution results, risk scores |
| **Outputs** | Governance decisions |
| **Start Event** | Governance Evaluation Started |
| **End Event** | Governance Decision Made |
| **Business Rules** | Risk scores must be calculated; Release gates must be evaluated |
| **Systems Used** | Python Engine, PostgreSQL |
| **Business Capabilities Used** | Governance Decisions, Risk Scoring, Release Gates |
| **Related APIs** | (auto post-execution) |
| **Related Database Tables** | engine.migration_governance_status, engine.migration_risk_scores, engine.migration_release_decision |
| **Process Status** | Semi-Automated |
| **Process Maturity** | 3 (Defined) |

### 2.6 Approval Workflow

| Attribute | Value |
|-----------|-------|
| **Process Name** | Approval Workflow |
| **Business Objective** | Manage approval workflows for releases |
| **Business Owner** | Governance Officer |
| **Primary Users** | Compliance Officers, Programme Managers |
| **Trigger** | Approval requested |
| **Inputs** | Approval request details |
| **Outputs** | Approval decision |
| **Start Event** | Approval Requested |
| **End Event** | Approval Decided |
| **Business Rules** | Approvals must follow RBAC; Multi-step approvals supported |
| **Systems Used** | FastAPI, PostgreSQL, React Frontend |
| **Business Capabilities Used** | Approvals |
| **Related APIs** | GET/POST /api/v1/approvals/, PUT /api/v1/approvals/{id}/approve, PUT /api/v1/approvals/{id}/reject |
| **Related Database Tables** | platform.approval_requests, platform.approval_step_instances |
| **Process Status** | Automated |
| **Process Maturity** | 4 (Managed) |

### 2.7 Report Generation

| Attribute | Value |
|-----------|-------|
| **Process Name** | Report Generation |
| **Business Objective** | Generate executive, operational, governance, and technical reports |
| **Business Owner** | Programme Manager |
| **Primary Users** | All Users |
| **Trigger** | Report request |
| **Inputs** | Batch results, governance decisions |
| **Outputs** | Reports (executive, operational, governance, technical) |
| **Start Event** | Report Requested |
| **End Event** | Report Generated |
| **Business Rules** | Reports must be accurate; Reports must be timely |
| **Systems Used** | Python Engine, PostgreSQL |
| **Business Capabilities Used** | Executive Reporting, Operational Reporting, Governance Reporting, Technical Reporting |
| **Related APIs** | (SQL views for BI tools) |
| **Related Database Tables** | engine.v_migration_executive_summary, engine.v_migration_control_summary, engine.v_migration_governance_report |
| **Process Status** | Semi-Automated |
| **Process Maturity** | 3 (Defined) |

### 2.8 Task Management

| Attribute | Value |
|-----------|-------|
| **Process Name** | Task Management |
| **Business Objective** | Track and assign migration tasks |
| **Business Owner** | Programme Manager |
| **Primary Users** | All Users |
| **Trigger** | Task created |
| **Inputs** | Task details |
| **Outputs** | Task assignments |
| **Start Event** | Task Created |
| **End Event** | Task Completed |
| **Business Rules** | Tasks must be assigned; Tasks must be tracked |
| **Systems Used** | FastAPI, PostgreSQL, React Frontend |
| **Business Capabilities Used** | Task Management |
| **Related APIs** | GET/POST/PUT/DELETE /api/v1/tasks/ |
| **Related Database Tables** | platform.tasks, platform.task_comments, platform.task_dependencies |
| **Process Status** | Automated |
| **Process Maturity** | 4 (Managed) |

### 2.9 Workflow Execution

| Attribute | Value |
|-----------|-------|
| **Process Name** | Workflow Execution |
| **Business Objective** | Define and execute business workflows |
| **Business Owner** | Administrator |
| **Primary Users** | All Users |
| **Trigger** | Workflow triggered |
| **Inputs** | Workflow definition |
| **Outputs** | Workflow instance |
| **Start Event** | Workflow Started |
| **End Event** | Workflow Completed |
| **Business Rules** | Workflows must follow defined steps; Workflows must be tracked |
| **Systems Used** | FastAPI, PostgreSQL, React Frontend |
| **Business Capabilities Used** | Workflow Management |
| **Related APIs** | GET/POST/PUT/DELETE /api/v1/workflows/ |
| **Related Database Tables** | platform.workflow_definitions, platform.workflow_instances, platform.workflow_step_instances |
| **Process Status** | Automated |
| **Process Maturity** | 4 (Managed) |

### 2.10 User Administration

| Attribute | Value |
|-----------|-------|
| **Process Name** | User Administration |
| **Business Objective** | Create, update, deactivate users |
| **Business Owner** | Administrator |
| **Primary Users** | Administrators |
| **Trigger** | User management request |
| **Inputs** | User details |
| **Outputs** | User accounts |
| **Start Event** | User Requested |
| **End Event** | User Managed |
| **Business Rules** | Users must have roles; Users must be authenticated |
| **Systems Used** | FastAPI, PostgreSQL, React Frontend |
| **Business Capabilities Used** | User Management, Role & Permission Management |
| **Related APIs** | GET/POST/PUT/DELETE /api/v1/users/, GET/POST/PUT/DELETE /api/v1/roles/ |
| **Related Database Tables** | platform.users, platform.user_roles, platform.roles, platform.permissions |
| **Process Status** | Semi-Automated |
| **Process Maturity** | 3 (Defined) |

### 2.11 Security Management

| Attribute | Value |
|-----------|-------|
| **Process Name** | Security Management |
| **Business Objective** | Manage encryption, keys, certificates, audit trail |
| **Business Owner** | Security Officer |
| **Primary Users** | Security Analysts, Auditors |
| **Trigger** | Security event |
| **Inputs** | Security events |
| **Outputs** | Audit trail, security reports |
| **Start Event** | Security Event |
| **End Event** | Security Logged |
| **Business Rules** | Audit trail must be immutable; Security events must be tracked |
| **Systems Used** | FastAPI, PostgreSQL |
| **Business Capabilities Used** | Security Management, Audit Trail |
| **Related APIs** | (middleware-based) |
| **Related Database Tables** | audit.audit_events, audit.security_events, audit.api_call_log |
| **Process Status** | Manual |
| **Process Maturity** | 2 (Repeatable) |

---

## 3. Process Statistics

| Metric | Count |
|--------|-------|
| Total Processes | 11 |
| Automated | 5 |
| Semi-Automated | 4 |
| Manual | 2 |
| Capabilities Covered | 34/34 (100%) |

---

*This catalogue is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*