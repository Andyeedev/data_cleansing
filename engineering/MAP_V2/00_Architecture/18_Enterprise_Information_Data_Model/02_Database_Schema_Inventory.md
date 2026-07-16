# 02_Database_Schema_Inventory.md

## Schema: core

### Purpose
Core business entity management: tenants, projects, systems, datasets, and mappings.

### Tables

| Table | Purpose | Primary Key |
|-------|---------|-------------|
| `tenants` | Multi-tenant organizations | `tenant_id` (UUID) |
| `projects` | Migration projects | `project_id` (UUID) |
| `system_registry` | Database system connections (SOURCE/TARGET) | `system_id` (UUID) |
| `datasets` | Discovered tables from systems | `dataset_id` (UUID) |
| `dataset_mappings` | Source-to-target table mappings | `mapping_id` (UUID) |
| `dataset_columns` | Column definitions for datasets | `column_id` (UUID) |
| `column_mappings` | Source-to-target column mappings | `column_mapping_id` (UUID) |
| `rule_dataset_mapping` | Links validation rules to mappings | `id` (UUID) |

### Views
None.

### Functions
None.

### Triggers
None.

### Sequences
None.

### Relationships
- `projects.tenant_id` → `tenants.tenant_id` (FK)
- `system_registry.project_id` → `projects.project_id` (FK)
- `datasets.system_id` → `system_registry.system_id` (FK)
- `dataset_mappings.project_id` → `projects.project_id` (FK)
- `dataset_mappings.source_system_id` → `system_registry.system_id` (FK)
- `dataset_mappings.target_system_id` → `system_registry.system_id` (FK)
- `dataset_columns.mapping_id` → `dataset_mappings.mapping_id` (FK)
- `column_mappings.mapping_id` → `dataset_mappings.mapping_id` (FK)
- `rule_dataset_mapping.mapping_id` → `dataset_mappings.mapping_id` (FK)

### Dependencies
- Referenced by: `engine`, `platform` schemas (via cross-schema FKs)

---

## Schema: engine

### Purpose
Validation execution engine: controls, rules, execution results, governance intelligence.

### Tables

| Table | Purpose | Primary Key |
|-------|---------|-------------|
| `control_registry` | Validation control definitions (C01-C03) | `control_id` (VARCHAR) |
| `rule_registry` | Validation rule definitions | `rule_id` (VARCHAR) |
| `rule_parameter_metadata_legacy` | Entity mapping for rules (legacy) | `id` (SERIAL) |
| `migration_validation_batch` | Batch execution records | `batch_id` (UUID) |
| `migration_batch_summary` | Batch-level control summaries | `id` (SERIAL) |
| `migration_control_execution` | Individual control execution results | `id` (SERIAL) |
| `migration_control_summary` | Control-level rule summaries | `id` (SERIAL) |
| `migration_control_exceptions` | Detailed exception records | `id` (SERIAL) |
| `migration_exception_register` | Exception register with PK values | `exception_id` (UUID) |
| `migration_release_decision` | Release gate decisions | `id` (SERIAL) |
| `migration_batch_intelligence` | Governance intelligence scores | `batch_id` (UUID) |
| `batch_anomaly_analysis` | Anomaly analysis results | `id` (SERIAL) |
| `batch_intelligence` | Batch intelligence metrics | `id` (SERIAL) |
| `batch_rule_scores` | Rule-level scores per batch | None (no PK) |
| `control_persistence_analysis` | Repeat failure analysis | `id` (SERIAL) |
| `governance_config` | Governance configuration parameters | `id` (SERIAL) |
| `rule_anomaly_history` | Historical anomaly records | `id` (SERIAL) |
| `rule_execution_statistics` | Rule execution performance | `id` (SERIAL) |
| `rule_weight_config` | Rule severity weights | `rule_id` (VARCHAR) |
| `rule_weights` | Legacy rule weights | `rule_id` (VARCHAR) |

**Legacy/Old Tables:** `dataset_mappings_OLD`, `governance_config_OLD`, `governance_config_OLD_1`, `migration_control_execution_OLD`, `migration_batch_intelligence_OLD`, `projects_OLD`, `system_registry_OLD`, `tenants_OLD`

### Views

| View | Purpose |
|------|---------|
| `v_migration_control_summary` | Control-level summary with pass/fail counts |
| `v_migration_executive_summary` | Executive dashboard with overall scores |
| `v_migration_exception_detail` | Exception drill-down with failure reasons |
| `v_migration_score_trend` | Rolling 5-batch average score trend |

### Functions

| Function | Purpose |
|----------|---------|
| `run_governance_intelligence(batch_id)` | Calculates anomaly scores and governance decisions |
| `run_governance_intelligence_OLD(batch_id)` | Legacy version of governance function |
| `run_governance_intelligence_OLD_2(batch_id)` | Second legacy version of governance function |

### Triggers
None defined in current DDL.

### Sequences
15 sequences for auto-incrementing SERIAL columns.

### Dependencies
- References: `core.projects`, `core.system_registry`
- Referenced by: `reporting` schema (views)

---

## Schema: engine_v14

### Purpose
Legacy v1.4 schema preserving historical table structures.

### Tables

| Table | Purpose | Primary Key |
|-------|---------|-------------|
| `tenants` | Legacy tenant records | `tenant_id` (UUID) |
| `projects` | Legacy project records | `project_id` (UUID) |
| `systems` | Legacy system records | `system_id` (UUID) |
| `datasets` | Legacy dataset records | `dataset_id` (UUID) |
| `dataset_mappings` | Legacy mapping records | `mapping_id` (UUID) |
| `dataset_columns` | Legacy column records | `column_id` (UUID) |
| `column_mappings` | Legacy column mapping records | `column_mapping_id` (UUID) |
| `batch_runs` | Legacy batch execution records | `batch_id` (UUID) |
| `control_executions` | Legacy control execution records | `execution_id` (BIGINT) |
| `batch_intelligence` | Legacy batch intelligence | `batch_id` (UUID) |

### Views
None.

### Functions
None.

### Triggers
None.

### Sequences
1 sequence (`control_executions_execution_id_seq`).

### Dependencies
- Standalone schema (no cross-schema FKs)

---

## Schema: reporting

### Purpose
Dimension tables and reporting views for analytics.

### Tables

| Table | Purpose | Primary Key |
|-------|---------|-------------|
| `dim_date` | Date dimension for time-based reporting | None |
| `dim_severity` | Severity level reference | `severity_key` (SERIAL) |
| `dim_status` | Status category reference | `status_key` (SERIAL) |

### Views

| View | Purpose |
|------|---------|
| `v_batch_governance_intelligence` | Combines batch data with governance intelligence |
| `v_batch_governance_intelligence_OLD` | Legacy governance intelligence view |
| `v_fact_batch` | Batch fact table with release decisions |
| `v_fact_control` | Control fact table with execution summaries |

### Functions
None.

### Triggers
None.

### Sequences
2 sequences (`dim_severity_severity_key_seq`, `dim_status_status_key_seq`).

### Dependencies
- References: `engine.migration_validation_batch`, `engine.migration_control_summary`, `engine.migration_release_decision`, `engine.migration_batch_intelligence_OLD`

---

## Schema: platform

### Purpose
Enterprise platform features: user management, RBAC, workflows, approvals, tasks, notifications, calendar, settings.

### Tables

| Table | Purpose | Primary Key |
|-------|---------|-------------|
| `users` | User accounts | `id` (UUID) |
| `refresh_tokens` | JWT refresh tokens | `id` (UUID) |
| `user_sessions` | Active user sessions | `id` (UUID) |
| `roles` | System and custom roles | `id` (UUID) |
| `permissions` | Permission definitions | `id` (UUID) |
| `role_permissions` | Role-permission mappings | `(role_id, permission_id)` |
| `user_roles` | User-role assignments | `(user_id, role_id)` |
| `workflow_definitions` | Workflow templates | `id` (UUID) |
| `workflow_instances` | Running workflow instances | `id` (UUID) |
| `workflow_step_instances` | Individual workflow steps | `id` (UUID) |
| `workflow_history` | Workflow audit trail | `id` (UUID) |
| `approval_templates` | Approval workflow templates | `id` (UUID) |
| `approval_requests` | Approval request instances | `id` (UUID) |
| `approval_step_instances` | Individual approval steps | `id` (UUID) |
| `tasks` | Task management | `id` (UUID) |
| `task_comments` | Task comments | `id` (UUID) |
| `task_dependencies` | Task dependency relationships | `id` (UUID) |
| `notifications` | User notifications | `id` (UUID) |
| `notification_preferences` | Notification channel preferences | `id` (UUID) |
| `calendar_events` | Calendar events | `id` (UUID) |
| `calendar_event_reminders` | Event reminders | `id` (UUID) |
| `system_settings` | Platform configuration | `id` (UUID) |
| `feature_flags` | Feature toggle definitions | `id` (UUID) |

### Views
None.

### Functions

| Function | Purpose |
|----------|---------|
| `update_updated_at_column()` | Trigger function to update `updated_at` timestamps |

### Triggers
8 triggers on tables: `users`, `roles`, `workflow_definitions`, `workflow_instances`, `tasks`, `calendar_events`, `system_settings`, `feature_flags`.

### Sequences
None (UUID primary keys).

### Dependencies
- References: `core.tenants` (via cross-schema FKs), `core.projects` (via cross-schema FKs)

---

## Schema: audit

### Purpose
Immutable audit trail for all system activities.

### Tables

| Table | Purpose | Primary Key |
|-------|---------|-------------|
| `audit_events` | General audit events | `id` (UUID) |
| `security_events` | Security-related events | `id` (UUID) |
| `login_history` | User login attempts | `id` (UUID) |
| `api_logs` | API request/response logs | `id` (UUID) |
| `configuration_history` | Configuration change history | `id` (UUID) |

### Views
None.

### Functions
None.

### Triggers
None.

### Sequences
None (UUID primary keys).

### Dependencies
- Standalone schema (no FKs to other schemas)

---

**Version:** 2.1

**Status:** Current State Documentation
