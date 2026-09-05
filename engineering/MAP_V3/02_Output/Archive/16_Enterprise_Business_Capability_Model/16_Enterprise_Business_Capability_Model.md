# MAP Nexus Enterprise Platform — Enterprise Business Capability Model

**Document ID:** 16  
**Version:** 1.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the **Enterprise Business Capability Model** for the MAP Nexus™ platform. It establishes what MAP does as a business, independent of implementation, technology, or current frontend menus.

This is the **master business architecture** for MAP. It becomes the authoritative blueprint for all future development.

---

## 2. Scope

| In Scope | Out of Scope |
|----------|-------------|
| All business capabilities of MAP | Implementation details |
| Capability hierarchy and domains | Technology selection |
| Capability dependencies | API design |
| Business events | Database schema |
| Platform service consumers | Frontend components |
| Enterprise navigation model | Code structure |

---

## 3. Business Capability Domains

MAP organises its capabilities into **6 logical domains**:

| # | Domain | Purpose | Capabilities |
|---|--------|---------|-------------|
| 1 | **Migration Management** | Define and manage migration projects | Projects, Connections, Discovery, Dataset Mapping, Column Mapping |
| 2 | **Validation Management** | Execute and monitor data validation | Rules, Controls, Execution, Checkpointing, Retry |
| 3 | **Governance & Compliance** | Ensure regulatory and quality compliance | Governance Decisions, Risk Scoring, Release Gates, Approvals |
| 4 | **Reporting & Analytics** | Transform data into business intelligence | Executive Reports, Operational Reports, Dashboards, Export |
| 5 | **Platform Services** | Provide foundational application capabilities | Workflow, Tasks, Notifications, Calendar, AI, Authentication |
| 6 | **Administration** | Manage platform configuration and users | Users, Roles, Tenants, Settings, Feature Flags, Security |

---

## 4. Complete Business Capability Inventory

### 4.1 Migration Management Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 1.1 | **Project Management** | Define and track migration projects | Migration Lead | Migration Engineers |
| 1.2 | **Connection Management** | Manage source/target database connections | Migration Lead | Migration Engineers |
| 1.3 | **Dataset Discovery** | Automatically discover schemas, tables, columns | Migration Lead | Migration Engineers |
| 1.4 | **Dataset Mapping** | Define source-to-target table mappings | Migration Lead | Migration Engineers |
| 1.5 | **Column Mapping** | Map individual columns between source/target | Migration Lead | Migration Engineers |

### 4.2 Validation Management Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 2.1 | **Rule Discovery** | Auto-infer validation rules from column roles | Migration Lead | Migration Engineers |
| 2.2 | **Control Discovery** | Fetch and configure validation controls | Migration Lead | Migration Engineers |
| 2.3 | **Validation Execution** | Execute the 6-step validation pipeline | Migration Lead | Migration Engineers |
| 2.4 | **Checkpointing** | Save execution state for resume | Migration Lead | Migration Engineers |
| 2.5 | **Retry Engine** | Automatically retry failed validations | Migration Lead | Migration Engineers |

### 4.3 Governance & Compliance Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 3.1 | **Governance Decisions** | Compute governance outcomes post-execution | Governance Officer | Compliance Officers |
| 3.2 | **Risk Scoring** | Calculate risk scores using weighted algorithms | Governance Officer | Compliance Officers |
| 3.3 | **Release Gates** | Approve/reject batch releases | Governance Officer | Programme Managers |
| 3.4 | **Approvals** | Manage approval workflows | Governance Officer | Compliance Officers |

### 4.4 Reporting & Analytics Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 4.1 | **Executive Reporting** | High-level programme health summaries | Programme Sponsor | Executives |
| 4.2 | **Operational Reporting** | Detailed migration progress reports | Programme Manager | Migration Leads |
| 4.3 | **Governance Reporting** | Compliance and audit trail reports | Governance Officer | Auditors |
| 4.4 | **Technical Reporting** | Validation details, exceptions, rule results | Migration Lead | Migration Engineers |
| 4.5 | **Dashboard Services** | Real-time KPI dashboards | Programme Sponsor | All Users |
| 4.6 | **Export Services** | PDF, Excel, CSV, PNG export | Programme Manager | All Users |

### 4.5 Platform Services Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 5.1 | **Workflow Management** | Define and execute business workflows | Administrator | All Users |
| 5.2 | **Task Management** | Track and assign migration tasks | Programme Manager | All Users |
| 5.3 | **Notification Services** | Alert users of events and actions | Administrator | All Users |
| 5.4 | **Calendar Services** | Schedule and track events | Administrator | All Users |
| 5.5 | **AI / MAP Copilot** | Natural language assistance and insights | Administrator | All Users |
| 5.6 | **Authentication** | Identity management and SSO | Security Officer | All Users |

### 4.6 Administration Domain

| # | Capability | Purpose | Business Owner | Primary Users |
|---|-----------|---------|---------------|--------------|
| 6.1 | **User Management** | Create, update, deactivate users | Administrator | Administrators |
| 6.2 | **Role & Permission Management** | Define RBAC roles and permissions | Administrator | Administrators |
| 6.3 | **Tenant Management** | Multi-tenant configuration | Administrator | Administrators |
| 6.4 | **System Settings** | Platform configuration | Administrator | Administrators |
| 6.5 | **Feature Flags** | Toggle features by tenant/user | Administrator | Administrators |
| 6.6 | **Security Management** | Encryption, keys, certificates | Security Officer | Security Analysts |
| 6.7 | **Audit Trail** | Immutable audit log | Security Officer | Auditors |
| 6.8 | **Maintenance & Health** | System health monitoring | Administrator | Administrators |

---

## 5. Capability Hierarchy

```text
MAP Nexus Enterprise Platform
├── Migration Management
│   ├── Project Management
│   ├── Connection Management
│   ├── Dataset Discovery
│   ├── Dataset Mapping
│   └── Column Mapping
├── Validation Management
│   ├── Rule Discovery
│   ├── Control Discovery
│   ├── Validation Execution
│   ├── Checkpointing
│   └── Retry Engine
├── Governance & Compliance
│   ├── Governance Decisions
│   ├── Risk Scoring
│   ├── Release Gates
│   └── Approvals
├── Reporting & Analytics
│   ├── Executive Reporting
│   ├── Operational Reporting
│   ├── Governance Reporting
│   ├── Technical Reporting
│   ├── Dashboard Services
│   └── Export Services
├── Platform Services
│   ├── Workflow Management
│   ├── Task Management
│   ├── Notification Services
│   ├── Calendar Services
│   ├── AI / MAP Copilot
│   └── Authentication
└── Administration
    ├── User Management
    ├── Role & Permission Management
    ├── Tenant Management
    ├── System Settings
    ├── Feature Flags
    ├── Security Management
    ├── Audit Trail
    └── Maintenance & Health
```

---

## 6. Capability Dependencies

### 6.1 Core Dependency Chain (Validation Pipeline)

```text
Project Management
    ↓
Connection Management
    ↓
Dataset Discovery
    ↓
Dataset Mapping
    ↓
Column Mapping
    ↓
Rule Discovery
    ↓
Control Discovery
    ↓
Validation Execution
    ↓
Governance Decisions
    ↓
Reporting & Analytics
```

### 6.2 Platform Dependency Chain

```text
Authentication
    ↓
User Management
    ↓
Role & Permission Management
    ↓
Task Management
    ↓
Workflow Management
    ↓
Notification Services
```

### 6.3 Governance Dependency Chain

```text
Validation Execution
    ↓
Risk Scoring
    ↓
Governance Decisions
    ↓
Release Gates
    ↓
Approvals
    ↓
Audit Trail
```

---

## 7. Business Events

### 7.1 Engine Business Events

| # | Event | Producer | Consumers |
|---|-------|----------|-----------|
| 1 | Batch Started | Validation Execution | Notifications, Tasks, Calendar |
| 2 | Batch Completed | Validation Execution | Governance, Reporting, Notifications |
| 3 | Batch Failed | Validation Execution | Governance, Notifications, Tasks |
| 4 | Control Executed | Validation Execution | Reporting, Governance |
| 5 | Validation Failed | Validation Execution | Tasks, Notifications, Governance |
| 6 | Governance Blocked | Governance Decisions | Tasks, Notifications, Approvals |
| 7 | Release Approved | Release Gates | Notifications, Tasks |
| 8 | Release Rejected | Release Gates | Tasks, Notifications |
| 9 | Checkpoint Created | Checkpointing | Validation Execution |
| 10 | Retry Triggered | Retry Engine | Notifications, Tasks |
| 11 | Dataset Discovered | Dataset Discovery | Notifications |
| 12 | Rule Discovered | Rule Discovery | Notifications |
| 13 | Connection Tested | Connection Management | Notifications |
| 14 | Anomaly Detected | Risk Scoring | Governance, Notifications |

### 7.2 Platform Business Events

| # | Event | Producer | Consumers |
|---|-------|----------|-----------|
| 15 | User Created | User Management | Notifications |
| 16 | Role Assigned | Role Management | Notifications |
| 17 | Task Created | Task Management | Notifications, Calendar |
| 18 | Task Completed | Task Management | Notifications, Workflow |
| 19 | Workflow Completed | Workflow Management | Tasks, Notifications |
| 20 | Approval Requested | Approvals | Tasks, Notifications |
| 21 | Approval Decided | Approvals | Tasks, Notifications, Workflow |
| 22 | Login Successful | Authentication | Audit Trail |
| 23 | Login Failed | Authentication | Audit Trail, Security Events |
| 24 | Settings Changed | System Settings | Audit Trail |

---

## 8. Enterprise Capability Map

### 8.1 Migration Management Domain

| Capability | Application Service | Python Module | Database Schema | Tables | API Endpoints | Frontend Pages |
|-----------|-------------------|---------------|----------------|--------|---------------|----------------|
| Project Management | ExecutionService | app.execution_engine | core, engine | projects, migration_validation_batch | POST /api/v1/execution/run | Migration > Projects |
| Connection Management | SystemService, CredentialService | app.db.connection_resolver | core | system_registry, system_credentials | GET/POST /api/v1/systems/, GET/POST/PUT/DELETE /api/v1/credentials/ | Migration > Datasets, Security > Credentials |
| Dataset Discovery | DatasetDiscoveryService | app.discovery.auto_rule_discovery | core, engine | dataset_mappings, dataset_columns | (CLI only) | None |
| Dataset Mapping | MappingResolver | app.services.mapping_resolver | core | dataset_mappings | (auto-created) | Migration > Mappings |
| Column Mapping | DatasetDiscoveryService | app.services.dataset_discovery_service | core | dataset_columns, column_mappings | (auto-created) | None |

### 8.2 Validation Management Domain

| Capability | Application Service | Python Module | Database Schema | Tables | API Endpoints | Frontend Pages |
|-----------|-------------------|---------------|----------------|--------|---------------|----------------|
| Rule Discovery | AutoRuleDiscovery | app.discovery.auto_rule_discovery | engine, core | rule_registry, rule_dataset_mapping | (auto during execution) | Validation > Rules |
| Control Discovery | ControlExecutor | app.execution.control_executor | engine | control_registry | (auto during execution) | None |
| Validation Execution | ExecutionService | app.execution_engine | engine | migration_batch_registry, migration_control_execution, migration_control_summary, migration_control_exceptions | POST /api/v1/execution/run, GET /api/v1/execution/status/{id} | Migration > Execution, Validation > Results |
| Checkpointing | ExecutionEngine | app.execution_engine | engine | batch_execution_checkpoint | (automatic) | None |
| Retry Engine | RuleRetryManager | app.orchestration.retry.rule_retry_manager | N/A | N/A | (automatic) | None |

### 8.3 Governance & Compliance Domain

| Capability | Application Service | Python Module | Database Schema | Tables | API Endpoints | Frontend Pages |
|-----------|-------------------|---------------|----------------|--------|---------------|----------------|
| Governance Decisions | DecisionEngine | app.governance.decision_engine | engine | migration_governance_status, migration_control_decisions | (auto post-execution) | Governance (mock) |
| Risk Scoring | RiskScoring | app.governance.risk_scoring | engine | migration_risk_scores | (auto post-execution) | Risk (mock) |
| Release Gates | ExecutionEngine | app.execution_engine | engine | migration_release_decision | (auto post-execution) | Governance (mock) |
| Approvals | ApprovalService | app.services.approval_service | platform | approval_requests | GET/POST /api/v1/approvals/ | Task Management > Approvals |

### 8.4 Reporting & Analytics Domain

| Capability | Application Service | Python Module | Database Schema | Tables/Views | API Endpoints | Frontend Pages |
|-----------|-------------------|---------------|----------------|-------------|---------------|----------------|
| Executive Reporting | AuditExporter | app.audit_export | engine, reporting | v_migration_executive_summary | (SQL views) | Reports (mock) |
| Operational Reporting | AuditExporter | app.audit_export | engine | v_migration_control_summary | (SQL views) | Reports (mock) |
| Governance Reporting | AuditExporter | app.audit_export | engine | v_governance_decisions | (SQL views) | Reports (mock) |
| Technical Reporting | AuditExporter | app.audit_export | engine | v_exception_detail | (SQL views) | Reports (mock) |
| Dashboard Services | ScoringEngine | app.scoring_engine | reporting | v_fact_batch, v_fact_control | (SQL views) | Executive Dashboard |
| Export Services | AuditExporter | app.audit_export | N/A | N/A | (CLI only) | None |

### 8.5 Platform Services Domain

| Capability | Application Service | Python Module | Database Schema | Tables | API Endpoints | Frontend Pages |
|-----------|-------------------|---------------|----------------|--------|---------------|----------------|
| Workflow Management | WorkflowService | app.services.workflow_service | platform | workflow_definitions, workflow_instances, workflow_step_instances, workflow_history | GET/POST/PUT/DELETE /api/v1/workflows/ | Task Management > Workflows |
| Task Management | TaskService | app.services.task_service | platform | tasks, task_comments, task_dependencies | GET/POST/PUT/DELETE /api/v1/tasks/ | Task Management > Dashboard, My Tasks, All Tasks |
| Notification Services | NotificationService | app.services.notification_service | platform | notifications, notification_preferences | GET/PUT/DELETE /api/v1/notifications/ | Task Management > Notifications |
| Calendar Services | CalendarService | app.services.calendar_service | platform | calendar_events, calendar_event_reminders | GET/POST/PUT/DELETE /api/v1/calendar/events | Task Management > Calendar |
| AI / MAP Copilot | AIService | app.ai.framework | N/A | N/A | (frontend-local) | AI (mock) |
| Authentication | AuthService | app.services.auth_service | platform | users, user_sessions, refresh_tokens | POST /api/v1/auth/login | Login |

### 8.6 Administration Domain

| Capability | Application Service | Python Module | Database Schema | Tables | API Endpoints | Frontend Pages |
|-----------|-------------------|---------------|----------------|--------|---------------|----------------|
| User Management | UserService | app.services.user_service | platform | users, user_roles | GET/POST/PUT/DELETE /api/v1/users/ | Administration > Users |
| Role & Permission Management | RoleService | app.services.role_service | platform | roles, permissions, role_permissions | GET/POST/PUT/DELETE /api/v1/roles/ | Administration > Roles |
| Tenant Management | — | — | core | tenants | (no API) | Administration > Tenants (mock) |
| System Settings | SettingsService | app.services.settings_service | platform | system_settings | GET/PUT /api/v1/settings/ | Settings |
| Feature Flags | SettingsService | app.services.settings_service | platform | feature_flags | GET /api/v1/settings/flags/list | Administration > Feature Flags (mock) |
| Security Management | — | — | audit | audit_events, security_events | (no API) | Security (mock) |
| Audit Trail | AuditMiddleware | app.api.core.middleware.audit_middleware | audit | audit_events, api_call_log | (middleware-based) | Security > Audit Logs (mock) |
| Maintenance & Health | — | — | N/A | N/A | GET /api/v1/ready | Operations > Health (mock) |

---

## 9. Recommended Enterprise Navigation

### 9.1 Navigation Model

```text
MAP Nexus
├── Home
│   └── Dashboard
├── Migration
│   ├── Projects
│   ├── Discovery
│   ├── Mappings
│   ├── Column Mappings
│   ├── Execution
│   ├── History
│   ├── Reports
│   └── Workspace
├── Validation
│   ├── Rules
│   ├── Rule Discovery
│   ├── Results
│   ├── Queue
│   └── Controls
├── Governance
│   ├── Overview
│   ├── Compliance
│   ├── Controls
│   ├── Exceptions
│   ├── Risk
│   ├── Audit
│   └── Approvals
├── Reports
│   ├── Executive
│   ├── Operational
│   ├── Migration
│   ├── Validation
│   ├── Governance
│   ├── Audit
│   ├── Templates
│   └── Distribution
├── Operations
│   ├── Monitoring
│   ├── Alerts
│   ├── Schedules
│   ├── Retry
│   └── Health
├── Administration
│   ├── Users
│   ├── Roles
│   ├── Tenants
│   ├── Settings
│   ├── Feature Flags
│   ├── Security
│   ├── Notifications
│   └── Maintenance
└── Tasks
    ├── Dashboard
    ├── My Tasks
    ├── Workflows
    ├── Calendar
    └── Notifications
```

### 9.2 Navigation Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Top-Level Menus | 17 | 8 |
| Submenus | 103+ | ~60 |
| Pages | 134 | ~70 |
| Max Depth | 3 levels | 2 levels |

---

## 10. Gap Analysis Summary

### 10.1 Capabilities Without APIs

| # | Capability | Current Status | Required Action |
|---|-----------|---------------|----------------|
| 1 | Dataset Discovery | CLI only | Create /api/v1/discovery endpoints |
| 2 | Column Mapping | Auto-created | Create /api/v1/column-mappings endpoints |
| 3 | Control Discovery | Auto during execution | Create /api/v1/controls endpoints |
| 4 | Governance Decisions | Auto post-execution | Create /api/v1/governance endpoints |
| 5 | Risk Scoring | Auto post-execution | Create /api/v1/risk endpoints |
| 6 | Release Gates | Auto post-execution | Create /api/v1/release endpoints |
| 7 | Reporting (SQL Views) | BI tools only | Create /api/v1/reports endpoints |
| 8 | Audit Trail | File-based | Create /api/v1/audit endpoints |

### 10.2 Capabilities Without Frontend

| # | Capability | Current Status | Required Action |
|---|-----------|---------------|----------------|
| 1 | Dataset Discovery | None | Create Migration > Discovery page |
| 2 | Column Mapping | None | Create Migration > Column Mappings page |
| 3 | Control Discovery | None | Create Governance > Controls page |
| 4 | Checkpointing | None | Expose via Operations > Monitoring |
| 5 | Retry Engine | None | Expose via Operations > Retry |

### 10.3 Platform Capabilities Without Engine Link

| # | Capability | Current Status | Required Action |
|---|-----------|---------------|----------------|
| 1 | Task Management | Platform-only | Link to engine events |
| 2 | Workflow Management | Platform-only | Link to engine events |
| 3 | Notifications | Platform-only | Subscribe to engine events |
| 4 | Calendar | Platform-only | Link to engine milestones |
| 5 | AI / MAP Copilot | Frontend-local | Connect to engine APIs |

---

## 11. Supporting Documentation

The following reports provide detailed analysis supporting this capability model:

| # | Report | Location |
|---|--------|----------|
| 01 | Executive Summary | 02_Output/16_Enterprise_Business_Capability_Model/01_Executive_Summary.md |
| 02 | Business Capability Catalogue | 02_Output/16_Enterprise_Business_Capability_Model/02_Business_Capability_Catalogue.md |
| 03 | Business Capability Hierarchy | 02_Output/16_Enterprise_Business_Capability_Model/03_Business_Capability_Hierarchy.md |
| 04 | Business Capability Dependencies | 02_Output/16_Enterprise_Business_Capability_Model/04_Business_Capability_Dependencies.md |
| 05 | Business Event Model | 02_Output/16_Enterprise_Business_Capability_Model/05_Business_Event_Model.md |
| 06 | Capability to API Mapping | 02_Output/16_Enterprise_Business_Capability_Model/06_Capability_to_API_Mapping.md |
| 07 | Capability to Database Mapping | 02_Output/16_Enterprise_Business_Capability_Model/07_Capability_to_Database_Mapping.md |
| 08 | Capability to Python Mapping | 02_Output/16_Enterprise_Business_Capability_Model/08_Capability_to_Python_Mapping.md |
| 09 | Capability to Frontend Mapping | 02_Output/16_Enterprise_Business_Capability_Model/09_Capability_to_Frontend_Mapping.md |
| 10 | Recommended Enterprise Navigation | 02_Output/16_Enterprise_Business_Capability_Model/10_Recommended_Enterprise_Navigation.md |
| 11 | Business Capability Gap Report | 02_Output/16_Enterprise_Business_Capability_Model/11_Business_Capability_Gap_Report.md |
| 12 | Generation Report | 02_Output/16_Enterprise_Business_Capability_Model/12_Generation_Report.md |
| 13 | Generation Change Log | 02_Output/16_Enterprise_Business_Capability_Model/13_Generation_Change_Log.md |

---

## 12. Governance

### 12.1 Promotion Rules
- This document is promoted to `00_Architecture/` after engineering review and explicit user approval
- Supporting reports remain in `02_Output/` as engineering documentation
- Only one approved architecture document shall exist for each architectural subject

### 12.2 Amendment Process
- Changes to this document require engineering review
- Amendments must preserve traceability to supporting reports
- Version number increments on each approved change

---

## 13. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This document is part of the MAP Nexus Enterprise Architecture framework. It establishes the business capability model that all future MAP development must follow.*
