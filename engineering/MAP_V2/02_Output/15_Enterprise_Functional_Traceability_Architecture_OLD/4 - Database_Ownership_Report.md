# Database Ownership Report

**Database:** `migration_engine`
**Schemas:** 6
**Tables:** 69 (64 active + 5 deprecated)
**Views:** 5
**Generated:** 2026-07-14

---

## Schema Overview

| Schema | Table Count | Owner | Status |
|---|---|---|---|
| core | 8 | Shared | Active |
| engine | 21 | Migration Engine | Active |
| platform | 22 | Platform | Active |
| reporting | 3 tables + 5 views | Reporting | Active |
| audit | 5 | Audit | Active |
| engine_v14 | 10 | Deprecated | Inactive |

**Total:** 69 tables, 5 views across 6 schemas.

---

## Table Inventory by Schema

### Schema 1: core (8 tables)

Shared data model providing multi-tenant isolation and migration project structure.

| Table | Owner | Purpose | FK Relationships |
|---|---|---|---|
| core.tenants | Shared | Multi-tenant isolation | None (root entity) |
| core.projects | Shared | Migration projects | FK → core.tenants |
| core.system_registry | Shared | Source/target systems | FK → core.projects |
| core.datasets | Shared | Discovered tables | FK → core.system_registry |
| core.dataset_mappings | Shared | Source-target mappings | FK → core.projects, core.system_registry |
| core.column_mappings | Shared | Column-level mappings | FK → core.dataset_mappings, core.dataset_columns |
| core.dataset_columns | Shared | Column metadata | FK → core.dataset_mappings |
| core.rule_dataset_mapping | Shared | Rule-to-mapping binding | FK → core.dataset_mappings |

### Schema 2: engine (21 active tables)

Migration validation engine execution and intelligence tables.

| Table | Owner | Purpose |
|---|---|---|
| engine.control_registry | Migration Engine | Validation controls (C01-C010) |
| engine.rule_registry | Migration Engine | Rule definitions |
| engine.rule_parameter_metadata_legacy | Migration Engine | Legacy rule parameters |
| engine.governance_config | Migration Engine | Governance thresholds |
| engine.migration_validation_batch | Migration Engine | Batch execution records |
| engine.migration_batch_summary | Migration Engine | Batch aggregation |
| engine.migration_control_execution | Migration Engine | Rule execution results |
| engine.migration_control_summary | Migration Engine | Control aggregation |
| engine.migration_control_exceptions | Migration Engine | Exception details |
| engine.migration_exception_register | Migration Engine | Row-level exceptions |
| engine.migration_release_decision | Migration Engine | Release gate decisions |
| engine.migration_batch_intelligence | Migration Engine | AI anomaly scores |
| engine.batch_anomaly_analysis | Migration Engine | Anomaly breakdown |
| engine.batch_intelligence | Migration Engine | Simpler intelligence view |
| engine.batch_rule_scores | Migration Engine | Per-rule scoring |
| engine.control_persistence_analysis | Migration Engine | Repeat failure tracking |
| engine.rule_anomaly_history | Migration Engine | Historical anomalies |
| engine.rule_execution_statistics | Migration Engine | Performance stats |
| engine.rule_weight_config | Migration Engine | Configurable weights |
| engine.rule_weights | Migration Engine | Integer weights |
| engine.batch_execution_checkpoint | Migration Engine | Checkpoint/resume state |

### Schema 3: platform (22 tables)

Application platform services: auth, workflows, approvals, tasks, notifications.

| Table | Owner | Purpose |
|---|---|---|
| platform.users | Platform | User identity |
| platform.refresh_tokens | Platform | JWT refresh tokens |
| platform.user_sessions | Platform | Session tracking |
| platform.roles | Platform | RBAC roles |
| platform.permissions | Platform | RBAC permissions |
| platform.role_permissions | Platform | Role-permission junction |
| platform.user_roles | Platform | User-role junction |
| platform.workflow_definitions | Platform | Workflow templates |
| platform.workflow_instances | Platform | Running workflows |
| platform.workflow_step_instances | Platform | Workflow step execution |
| platform.workflow_history | Platform | Workflow audit trail |
| platform.approval_templates | Platform | Approval templates |
| platform.approval_requests | Platform | Approval requests |
| platform.approval_step_instances | Platform | Approval step execution |
| platform.tasks | Platform | Task management |
| platform.task_comments | Platform | Task comments |
| platform.task_dependencies | Platform | Task dependency DAG |
| platform.notifications | Platform | User notifications |
| platform.notification_preferences | Platform | Notification settings |
| platform.calendar_events | Platform | Calendar events |
| platform.calendar_event_reminders | Platform | Event reminders |
| platform.system_settings | Platform | System configuration |
| platform.feature_flags | Platform | Feature toggles |

### Schema 4: reporting (3 tables + 5 views)

Data warehouse dimension and fact tables for governance reporting.

| Table/View | Owner | Purpose |
|---|---|---|
| reporting.dim_date | Reporting | Date dimension |
| reporting.dim_severity | Reporting | Severity dimension |
| reporting.dim_status | Reporting | Status dimension |
| reporting.v_batch_governance_intelligence | Reporting | Governance decisions view |
| reporting.v_fact_batch | Reporting | Batch fact table |
| reporting.v_fact_control | Reporting | Control fact table |

### Schema 5: audit (5 tables)

Audit trail and security event logging.

| Table | Owner | Purpose |
|---|---|---|
| audit.audit_events | Audit | API audit trail |
| audit.security_events | Audit | Security events |
| audit.api_call_log | Audit | API call logging |
| audit.data_access_log | Audit | Data access tracking |
| audit.system_events | Audit | System events |

### Schema 6: engine_v14 (10 tables — deprecated)

Legacy copies from v1.4. Not used by current application. Retained for reference only.

---

## Cross-Schema Dependencies

### Foreign Key Relationships Across Schemas

| Source Schema.Table | Target Schema.Table | Dependency Type |
|---|---|---|
| platform.* (multiple tables) | core.tenants | FK (tenant isolation) |
| platform.tasks | core.projects | FK (project context) |
| platform.calendar_events | core.projects | FK (project context) |
| engine.migration_control_execution | core.dataset_mappings | FK (mapping reference) |
| engine.migration_batch_summary | core.projects | FK (project context) |
| engine.control_registry | core.projects | FK (project context) |

### Dependency Flow Diagram

```
core.tenants (root)
├── core.projects
│   ├── core.system_registry
│   │   └── core.datasets
│   ├── core.dataset_mappings
│   │   ├── core.column_mappings
│   │   ├── core.dataset_columns
│   │   └── core.rule_dataset_mapping
│   ├── engine.control_registry
│   ├── engine.migration_batch_summary
│   ├── platform.tasks
│   └── platform.calendar_events
├── platform.* (all platform tables)
├── engine.migration_control_execution → core.dataset_mappings
└── reporting.* (views reference engine tables)
```

### Critical Dependency: core Schema

The `core` schema is the **root dependency** for the entire system. All other schemas depend on `core.tenants` for multi-tenant isolation. Disruption to `core` tables will cascade across all schemas.

---

## Ownership Classification

### Ownership Matrix

| Owner | Schemas | Tables | Responsibility |
|---|---|---|---|
| **Shared** | core | 8 | Multi-tenant data model, project structure |
| **Migration Engine** | engine | 21 | Validation execution, rule processing, intelligence |
| **Platform** | platform | 22 | Authentication, workflows, approvals, tasks |
| **Reporting** | reporting | 3 + 5 views | Governance dashboards, fact/dimension tables |
| **Audit** | audit | 5 | Compliance logging, security events |
| **Deprecated** | engine_v14 | 10 | Legacy — no active ownership |

### Ownership by Responsibility

| Concern | Primary Owner | Supporting Owner |
|---|---|---|
| Tenant Isolation | Shared (core) | — |
| Migration Validation | Migration Engine (engine) | Shared (core) |
| User Authentication | Platform | — |
| Workflow Orchestration | Platform | — |
| Approval Gates | Platform | Migration Engine |
| Release Decisions | Migration Engine | Platform |
| Governance Reporting | Reporting | Migration Engine |
| Compliance Logging | Audit | Platform |
| Anomaly Detection | Migration Engine | — |

---

## Recommendations

### 1. Consolidate engine_v14 Deprecation

**Priority:** Medium

The `engine_v14` schema contains 10 unused tables. These should be:
- Documented in a deprecation log with removal date
- Dropped in the next major version release
- Verified no external reports or queries reference them

### 2. Formalize Cross-Schema FK Constraints

**Priority:** High

Six cross-schema foreign key relationships exist but are not enforced at the database level. Consider:
- Adding FK constraints for `platform.tasks → core.projects` and `platform.calendar_events → core.projects`
- Adding FK constraints for `engine.migration_control_execution → core.dataset_mappings`
- Documenting intentional missing constraints (e.g., `engine.migration_batch_summary → core.projects`)

### 3. Schema-Level Access Control

**Priority:** High

Implement row-level security or schema-based access control:
- `audit` schema: read-only for application, write-only for audit service
- `platform` schema: restricted to platform service accounts
- `engine` schema: restricted to migration engine service accounts
- `reporting` schema: read-only for reporting dashboards

### 4. ownership.md Maintenance

**Priority:** Low

Maintain a `OWNERSHIP.md` file at the database root mapping:
- Schema → Team/Service ownership
- Table → Data steward
- Last reviewed date

### 5. reporting Schema Enrichment

**Priority:** Medium

The reporting schema currently has 3 dimension tables and 3 views. Consider adding:
- `dim_tenant` for tenant-level reporting
- `dim_rule` for rule-level drill-down
- Materialized views for performance-critical governance dashboards

### 6. audit Schema Retention Policy

**Priority:** High

Implement automated data retention:
- `audit.audit_events`: 90-day retention
- `audit.security_events`: 365-day retention
- `audit.api_call_log`: 30-day retention
- `audit.data_access_log`: 180-day retention
- `audit.system_events`: 90-day retention
