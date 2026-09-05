# Database Ownership Report

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  
**Database:** migration_engine (PostgreSQL 17.4)  

---

## 1. Schema Overview

| # | Schema | Tables | Views | Owner System |
|---|--------|--------|-------|-------------|
| 1 | core | 8 | 0 | Shared (Migration Metadata) |
| 2 | engine | 22 active | 0 | Python Migration Engine |
| 3 | platform | 22 | 0 | MAP Nexus Platform |
| 4 | reporting | 3 | 5 | Reporting/BI |
| 5 | audit | 5 | 0 | Audit/Compliance |
| 6 | engine_v14 | 10 | 0 | Deprecated (Legacy Backup) |
| **Total** | | **70** | **5** | |

---

## 2. Schema 1: core (8 Tables) — Shared Foundational Metadata

**Owner:** Shared between Engine and Platform  
**Purpose:** Multi-tenant isolation, project registry, system connections, dataset mappings

### Table Inventory

| # | Table | PK | Purpose | FK Relationships |
|---|-------|-----|---------|-----------------|
| 1 | core.tenants | tenant_id (UUID) | Multi-tenant isolation | None (root) |
| 2 | core.projects | project_id (UUID) | Migration projects | FK → core.tenants(tenant_id) |
| 3 | core.system_registry | system_id (UUID) | Source/target database systems | FK → core.projects(project_id) |
| 4 | core.datasets | dataset_id (UUID) | Discovered tables per system | FK → core.system_registry(system_id) |
| 5 | core.dataset_mappings | mapping_id (UUID) | Source-target table mappings | FK → core.projects, core.system_registry (×2) |
| 6 | core.dataset_columns | column_id (UUID) | Column metadata per mapping | FK → core.dataset_mappings(mapping_id) |
| 7 | core.column_mappings | column_mapping_id (UUID) | Source-target column pairs | FK → core.dataset_mappings, core.dataset_columns (×2) |
| 8 | core.rule_dataset_mapping | id (UUID) | Rule-to-mapping binding | FK → core.dataset_mappings(mapping_id) |

### Foreign Key Chain
```
core.tenants
  └── core.projects
        └── core.system_registry
              └── core.datasets
        └── core.dataset_mappings
              ├── core.dataset_columns
              │     └── core.column_mappings
              └── core.rule_dataset_mapping
```

---

## 3. Schema 2: engine (22 Active Tables) — Validation Execution Engine

**Owner:** Python Migration Validation Engine  
**Purpose:** Execution tracking, control results, governance decisions, intelligence scoring

### Table Inventory

| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 1 | engine.control_registry | control_id (VARCHAR) | Validation controls (C01-C010) |
| 2 | engine.rule_registry | rule_id (VARCHAR) | Rule definitions with SQL templates |
| 3 | engine.rule_parameter_metadata_legacy | id (SERIAL) | Legacy rule parameters (deprecated) |
| 4 | engine.governance_config | id (SERIAL) | Governance thresholds & configuration |
| 5 | engine.migration_validation_batch | batch_id (UUID) | Master batch execution record |
| 6 | engine.migration_batch_summary | id (SERIAL) | Aggregated batch outcomes |
| 7 | engine.migration_control_execution | id (SERIAL) | Individual rule execution results |
| 8 | engine.migration_control_summary | id (SERIAL) | Per-control aggregation |
| 9 | engine.migration_control_exceptions | id (SERIAL) | Detailed exception records |
| 10 | engine.migration_exception_register | exception_id (UUID) | Row-level exception register |
| 11 | engine.migration_release_decision | id (SERIAL) | Release gate decisions |
| 12 | engine.migration_batch_intelligence | batch_id (UUID) | AI anomaly scores |
| 13 | engine.batch_anomaly_analysis | id (SERIAL) | Anomaly breakdown |
| 14 | engine.batch_intelligence | id (SERIAL) | Simpler intelligence record |
| 15 | engine.batch_rule_scores | (composite) | Per-rule scoring |
| 16 | engine.control_persistence_analysis | id (SERIAL) | Repeat failure tracking |
| 17 | engine.rule_anomaly_history | id (SERIAL) | Historical anomalies |
| 18 | engine.rule_execution_statistics | id (SERIAL) | Performance statistics |
| 19 | engine.rule_weight_config | rule_id (VARCHAR) | Configurable rule weights |
| 20 | engine.rule_weights | rule_id (VARCHAR) | Integer rule weights |
| 21 | engine.batch_execution_checkpoint | batch_id (UUID) | Checkpoint/resume state |
| 22 | engine.migration_governance_status | (batch_id) | Governance decision status |

### Key Relationships
```
engine.migration_validation_batch (master)
  ├── engine.migration_batch_summary
  ├── engine.migration_control_execution → core.dataset_mappings
  ├── engine.migration_control_summary
  ├── engine.migration_control_exceptions
  ├── engine.migration_release_decision
  ├── engine.migration_batch_intelligence
  └── engine.batch_execution_checkpoint

engine.control_registry
  └── engine.rule_registry
```

---

## 4. Schema 3: platform (22 Tables) — MAP Nexus Enterprise Platform

**Owner:** Platform (MAP Nexus)  
**Purpose:** Users, roles, workflows, tasks, approvals, notifications, calendar, settings

### Table Inventory

#### User Management (4 tables)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 1 | platform.users | id (UUID) | User identity |
| 2 | platform.refresh_tokens | id (UUID) | JWT refresh tokens |
| 3 | platform.user_sessions | id (UUID) | Active session tracking |
| 4 | platform.user_roles | (composite) | User-role junction |

#### Role Management (3 tables)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 5 | platform.roles | id (UUID) | RBAC roles |
| 6 | platform.permissions | id (UUID) | Granular permissions (47 seeded) |
| 7 | platform.role_permissions | (composite) | Role-permission junction |

#### Workflow Management (4 tables)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 8 | platform.workflow_definitions | id (UUID) | Workflow templates |
| 9 | platform.workflow_instances | id (UUID) | Running workflow instances |
| 10 | platform.workflow_step_instances | id (UUID) | Step execution within instances |
| 11 | platform.workflow_history | id (UUID) | Workflow audit trail |

#### Approval Management (3 tables)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 12 | platform.approval_templates | id (UUID) | Approval workflow templates |
| 13 | platform.approval_requests | id (UUID) | Pending approval requests |
| 14 | platform.approval_step_instances | id (UUID) | Step execution within approvals |

#### Task Management (3 tables)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 15 | platform.tasks | id (UUID) | Task management |
| 16 | platform.task_comments | id (UUID) | Task comments |
| 17 | platform.task_dependencies | id (UUID) | Task dependency DAG |

#### Notification Management (2 tables)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 18 | platform.notifications | id (UUID) | User notifications |
| 19 | platform.notification_preferences | id (UUID) | Notification channel settings |

#### Calendar Management (2 tables)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 20 | platform.calendar_events | id (UUID) | Calendar events |
| 21 | platform.calendar_event_reminders | id (UUID) | Event reminders |

#### System Settings (1 table)
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 22 | platform.system_settings | id (UUID) | System configuration |
| 23 | platform.feature_flags | id (UUID) | Feature toggles |

### Foreign Key Relationships
```
platform.users
  ├── platform.refresh_tokens
  ├── platform.user_sessions
  ├── platform.user_roles → platform.roles
  ├── platform.tasks (assigned_to, assigned_by)
  ├── platform.task_comments
  ├── platform.notifications
  ├── platform.notification_preferences
  ├── platform.calendar_events (organizer_id)
  └── platform.calendar_event_reminders

platform.roles
  ├── platform.role_permissions → platform.permissions
  └── platform.user_roles → platform.users

platform.workflow_definitions
  ├── platform.workflow_instances
  └── platform.workflow_history

platform.workflow_instances
  └── platform.workflow_step_instances

platform.approval_templates
  └── platform.approval_requests

platform.approval_requests
  └── platform.approval_step_instances

platform.tasks
  ├── platform.task_comments
  ├── platform.task_dependencies (self-referential)
  └── platform.calendar_events (project_id → core.projects)

platform.calendar_events
  └── platform.calendar_event_reminders

Cross-schema:
  platform.users.tenant_id → core.tenants(tenant_id)
  platform.tasks.project_id → core.projects(project_id)
  platform.roles.tenant_id → core.tenants(tenant_id)
  platform.workflow_definitions.tenant_id → core.tenants(tenant_id)
  platform.tasks.tenant_id → core.tenants(tenant_id)
  platform.calendar_events.tenant_id → core.tenants(tenant_id)
```

---

## 5. Schema 4: reporting (3 Tables + 5 Views) — BI/Analytics Layer

**Owner:** Reporting/BI  
**Purpose:** Dimension tables and analytical views for business intelligence

### Tables
| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 1 | reporting.dim_date | date_value (DATE) | Date dimension for time-series |
| 2 | reporting.dim_severity | severity_key (SERIAL) | Severity dimension (CRITICAL/HIGH/MEDIUM/LOW) |
| 3 | reporting.dim_status | status_key (SERIAL) | Status dimension (PASS/FAIL/ERROR/BLOCKED) |

### Views
| # | View | Purpose |
|---|------|---------|
| 1 | reporting.v_batch_governance_intelligence | Governance decisions + certification tiers |
| 2 | reporting.v_fact_batch | Batch fact table (status, score, gate result) |
| 3 | reporting.v_fact_control | Control fact table |
| 4 | reporting.v_migration_executive_summary | Executive summary view |
| 5 | reporting.v_migration_control_summary | Control summary view |

---

## 6. Schema 5: audit (5 Tables) — Append-Only Audit Trail

**Owner:** Audit/Compliance  
**Purpose:** Immutable audit log for compliance and security

| # | Table | PK | Purpose |
|---|-------|-----|---------|
| 1 | audit.audit_events | id (UUID) | API call audit trail |
| 2 | audit.security_events | id (UUID) | Security-related events |
| 3 | audit.api_call_log | id (UUID) | API request/response logging |
| 4 | audit.data_access_log | id (UUID) | Data access tracking |
| 5 | audit.system_events | id (UUID) | System lifecycle events |

---

## 7. Schema 6: engine_v14 (10 Tables) — Deprecated Legacy Backup

**Owner:** None (deprecated)  
**Purpose:** Backup copy of engine tables from v1.4  

| # | Table | Status |
|---|-------|--------|
| 1 | engine_v14.tenants | Deprecated |
| 2 | engine_v14.projects | Deprecated |
| 3 | engine_v14.systems | Deprecated |
| 4 | engine_v14.datasets | Deprecated |
| 5 | engine_v14.dataset_columns | Deprecated |
| 6 | engine_v14.dataset_mappings | Deprecated |
| 7 | engine_v14.column_mappings | Deprecated |
| 8 | engine_v14.batch_runs | Deprecated |
| 9 | engine_v14.batch_intelligence | Deprecated |
| 10 | engine_v14.control_executions | Deprecated |

---

## 8. Cross-Schema Dependencies

| From Schema | From Table | To Schema | To Table | FK Column |
|-------------|-----------|-----------|----------|-----------|
| platform | users | core | tenants | tenant_id |
| platform | tasks | core | projects | project_id |
| platform | roles | core | tenants | tenant_id |
| platform | workflow_definitions | core | tenants | tenant_id |
| platform | calendar_events | core | projects | project_id |
| platform | tasks | core | tenants | tenant_id |
| engine | migration_control_execution | core | dataset_mappings | mapping_id |
| engine | migration_batch_summary | core | projects | project_id |
| engine | control_registry | core | projects | project_id |

---

## 9. Ownership Classification

| System | Schemas | Tables | Responsibility |
|--------|---------|--------|---------------|
| Python Migration Engine | engine | 22 | Execution, governance, intelligence |
| MAP Nexus Platform | platform | 22 | Users, roles, workflows, tasks, approvals |
| Shared | core | 8 | Multi-tenancy, projects, connections, mappings |
| Reporting/BI | reporting | 3 + 5 views | Analytics dimensions and fact views |
| Audit/Compliance | audit | 5 | Immutable audit trail |
| Deprecated | engine_v14 | 10 | Legacy backup (not used) |

---

*This report is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*