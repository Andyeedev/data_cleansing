# 03_Table_Catalogue.md

## core.tenants

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Multi-tenant organizations |
| **Primary Key** | `tenant_id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | `core.projects`, `platform.users`, `platform.roles`, `platform.tasks`, `platform.workflow_definitions`, `platform.workflow_instances`, `platform.approval_requests`, `platform.approval_templates`, `platform.calendar_events` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `tenant_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `tenant_name` | VARCHAR(200) | NOT NULL | — | |
| `status` | VARCHAR(50) | NOT NULL | `'ACTIVE'` | |
| `created_at` | TIMESTAMP | NOT NULL | `CURRENT_TIMESTAMP` | |

**Evidence:** `engine_backup.sql:746-751`

---

## core.projects

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Migration projects |
| **Primary Key** | `project_id` (UUID) |
| **Foreign Keys** | `tenant_id` → `core.tenants.tenant_id` |
| **Referenced By** | `core.system_registry`, `core.dataset_mappings`, `engine.control_registry`, `engine.migration_validation_batch`, `engine.migration_batch_summary`, `platform.tasks`, `platform.calendar_events` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `project_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `tenant_id` | UUID | NOT NULL | — | FK → `core.tenants` |
| `project_name` | VARCHAR(200) | NOT NULL | — | |
| `project_type` | VARCHAR(50) | NOT NULL | — | CHECK: 'MIGRATION', 'DATA_QUALITY' |
| `status` | VARCHAR(50) | NOT NULL | `'ACTIVE'` | |
| `created_at` | TIMESTAMP | NOT NULL | `CURRENT_TIMESTAMP` | |

**Evidence:** `engine_backup.sql:694-702`

---

## core.system_registry

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Database system connections (SOURCE/TARGET) |
| **Primary Key** | `system_id` (UUID) |
| **Foreign Keys** | `project_id` → `core.projects.project_id` |
| **Referenced By** | `core.datasets`, `core.dataset_mappings` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `system_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `project_id` | UUID | NOT NULL | — | FK → `core.projects` |
| `system_name` | VARCHAR(200) | NOT NULL | — | |
| `system_role` | VARCHAR(50) | NOT NULL | — | CHECK: 'SOURCE', 'TARGET', 'ANALYTICS' |
| `database_type` | VARCHAR(50) | NOT NULL | — | CHECK: 'POSTGRES', 'ORACLE', 'SQLSERVER', 'MYSQL', 'SNOWFLAKE', 'DATABRICKS' |
| `connection_config` | JSONB | NOT NULL | — | |
| `created_at` | TIMESTAMP | NOT NULL | `CURRENT_TIMESTAMP` | |
| `password` | TEXT | NULL | — | |

**Evidence:** `engine_backup.sql:726-737`

---

## core.datasets

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Discovered tables from systems |
| **Primary Key** | `dataset_id` (UUID) |
| **Foreign Keys** | `system_id` → `core.system_registry.system_id` |
| **Referenced By** | `core.dataset_columns` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `dataset_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `system_id` | UUID | NOT NULL | — | FK → `core.system_registry` |
| `schema_name` | VARCHAR(150) | NULL | — | |
| `table_name` | VARCHAR(150) | NOT NULL | — | |
| `created_at` | TIMESTAMP | NOT NULL | `CURRENT_TIMESTAMP` | |

**Evidence:** `engine_backup.sql:679-685`

---

## core.dataset_mappings

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Source-to-target table mappings |
| **Primary Key** | `mapping_id` (UUID) |
| **Foreign Keys** | `project_id` → `core.projects.project_id`, `source_system_id` → `core.system_registry.system_id`, `target_system_id` → `core.system_registry.system_id` |
| **Referenced By** | `core.dataset_columns`, `core.column_mappings`, `core.rule_dataset_mapping`, `engine.migration_control_execution` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `mapping_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `project_id` | UUID | NOT NULL | — | FK → `core.projects` |
| `source_system_id` | UUID | NOT NULL | — | FK → `core.system_registry` |
| `target_system_id` | UUID | NULL | — | FK → `core.system_registry` |
| `source_schema` | VARCHAR(150) | NULL | — | |
| `source_table` | VARCHAR(150) | NULL | — | |
| `source_columns` | TEXT[] | NULL | — | |
| `target_schema` | VARCHAR(150) | NULL | — | |
| `target_table` | VARCHAR(150) | NULL | — | |
| `target_columns` | TEXT[] | NULL | — | |
| `is_active` | BOOLEAN | NULL | `true` | |
| `created_at` | TIMESTAMP | NOT NULL | `CURRENT_TIMESTAMP` | |

**Evidence:** `engine_backup.sql:657-670`

---

## core.dataset_columns

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Column definitions for datasets |
| **Primary Key** | `column_id` (UUID) |
| **Foreign Keys** | `mapping_id` → `core.dataset_mappings.mapping_id` |
| **Referenced By** | `core.column_mappings` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `column_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `mapping_id` | UUID | NOT NULL | — | FK → `core.dataset_mappings` |
| `column_name` | VARCHAR(150) | NOT NULL | — | |
| `column_position` | INTEGER | NULL | — | |
| `data_type` | VARCHAR(100) | NULL | — | |
| `column_side` | VARCHAR(10) | NULL | — | CHECK: 'SOURCE', 'TARGET' |
| `created_at` | TIMESTAMP | NOT NULL | `CURRENT_TIMESTAMP` | |
| `is_nullable` | BOOLEAN | NULL | — | |
| `is_primary_key` | BOOLEAN | NULL | `false` | |
| `inferred_role` | VARCHAR(50) | NULL | — | |

**Evidence:** `engine_backup.sql:636-648`

---

## core.column_mappings

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Source-to-target column mappings |
| **Primary Key** | `column_mapping_id` (UUID) |
| **Foreign Keys** | `mapping_id` → `core.dataset_mappings.mapping_id`, `source_column_id` → `core.dataset_columns.column_id`, `target_column_id` → `core.dataset_columns.column_id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `column_mapping_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `mapping_id` | UUID | NOT NULL | — | FK → `core.dataset_mappings` |
| `source_column_id` | UUID | NOT NULL | — | FK → `core.dataset_columns` |
| `target_column_id` | UUID | NULL | — | FK → `core.dataset_columns` |
| `column_role` | VARCHAR(50) | NULL | — | |
| `is_active` | BOOLEAN | NULL | `true` | |
| `created_at` | TIMESTAMP | NOT NULL | `CURRENT_TIMESTAMP` | |

**Evidence:** `engine_backup.sql:619-627`

---

## core.rule_dataset_mapping

| Attribute | Value |
|-----------|-------|
| **Schema** | core |
| **Purpose** | Links validation rules to dataset mappings |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `mapping_id` → `core.dataset_mappings.mapping_id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `rule_id` | VARCHAR(50) | NOT NULL | — | |
| `mapping_id` | UUID | NOT NULL | — | FK → `core.dataset_mappings` |
| `is_active` | BOOLEAN | NULL | `true` | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |

**Evidence:** `engine_backup.sql:711-117`

---

## engine.control_registry

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Validation control definitions |
| **Primary Key** | `control_id` (VARCHAR) |
| **Foreign Keys** | `project_id` → `core.projects.project_id` |
| **Referenced By** | `engine.rule_registry`, `engine.migration_control_execution`, `engine.migration_control_summary`, `engine.migration_control_exceptions` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `control_id` | VARCHAR(10) | NOT NULL | — | PK |
| `control_name` | TEXT | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `severity_level` | VARCHAR(20) | NULL | — | |
| `enabled_flag` | BOOLEAN | NULL | `true` | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |
| `project_id` | UUID | NOT NULL | — | FK → `core.projects` |

**Evidence:** `engine_backup.sql:891-899`

---

## engine.rule_registry

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Validation rule definitions |
| **Primary Key** | `rule_id` (VARCHAR) |
| **Foreign Keys** | `control_id` → `engine.control_registry.control_id` |
| **Referenced By** | `engine.migration_control_execution`, `core.rule_dataset_mapping` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `rule_id` | VARCHAR(50) | NOT NULL | — | PK |
| `control_id` | VARCHAR(10) | NULL | — | FK → `engine.control_registry` |
| `rule_name` | TEXT | NOT NULL | — | |
| `sql_template_file` | TEXT | NOT NULL | — | |
| `severity_level` | VARCHAR(20) | NULL | — | |
| `enabled_flag` | BOOLEAN | NULL | `true` | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |
| `rule_type` | VARCHAR(50) | NULL | — | |
| `rule_scope` | VARCHAR(20) | NULL | `'TABLE'` | |

**Evidence:** `engine_backup.sql:1493-1503`

---

## engine.migration_validation_batch

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Batch execution records |
| **Primary Key** | `batch_id` (UUID) |
| **Foreign Keys** | `project_id` → `core.projects.project_id` |
| **Referenced By** | `engine.migration_batch_summary`, `engine.migration_control_execution`, `engine.migration_control_exceptions`, `engine.migration_release_decision`, `engine.migration_batch_intelligence`, `engine.batch_anomaly_analysis`, `engine.batch_intelligence`, `engine.batch_rule_scores` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `batch_id` | UUID | NOT NULL | — | PK |
| `execution_start` | TIMESTAMP | NULL | — | |
| `execution_end` | TIMESTAMP | NULL | — | |
| `overall_status` | VARCHAR(20) | NULL | — | |
| `overall_score` | NUMERIC(5,2) | NULL | — | |
| `project_id` | UUID | NULL | — | FK → `core.projects` |

**Evidence:** `engine_backup.sql:1338-1345`

---

## engine.migration_control_execution

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Individual control execution results |
| **Primary Key** | `id` (SERIAL) |
| **Foreign Keys** | `mapping_id` → `core.dataset_mappings.mapping_id` |
| **Referenced By** | `engine.migration_control_summary`, `engine.migration_control_exceptions` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | SERIAL | NOT NULL | `nextval(...)` | PK |
| `batch_id` | UUID | NOT NULL | — | FK → `engine.migration_validation_batch` |
| `control_id` | VARCHAR(20) | NULL | — | |
| `rule_id` | VARCHAR(50) | NULL | — | |
| `entity_name` | VARCHAR(100) | NULL | — | |
| `execution_status` | VARCHAR(20) | NULL | — | |
| `delta_value` | NUMERIC | NULL | — | |
| `execution_time_seconds` | NUMERIC | NULL | — | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |
| `severity_level` | VARCHAR(20) | NULL | — | |
| `mapping_id` | UUID | NULL | — | FK → `core.dataset_mappings` |

**Evidence:** `engine_backup.sql:1174-1186`

---

## engine.migration_control_summary

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Control-level rule summaries |
| **Primary Key** | `id` (SERIAL) |
| **Foreign Keys** | None (batch_id references batch table) |
| **Referenced By** | `reporting.v_fact_control` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | SERIAL | NOT NULL | `nextval(...)` | PK |
| `batch_id` | UUID | NOT NULL | — | |
| `control_id` | VARCHAR(20) | NULL | — | |
| `overall_status` | VARCHAR(20) | NULL | — | |
| `total_rules` | INTEGER | NULL | — | |
| `passed_rules` | INTEGER | NULL | — | |
| `failed_rules` | INTEGER | NULL | — | |
| `error_rules` | INTEGER | NULL | — | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |

**Evidence:** `engine_backup.sql:1234-1244`

---

## engine.migration_batch_summary

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Batch-level control summaries |
| **Primary Key** | `id` (SERIAL) |
| **Foreign Keys** | `project_id` → `core.projects.project_id` |
| **Referenced By** | `engine.v_migration_governance_report` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | SERIAL | NOT NULL | `nextval(...)` | PK |
| `batch_id` | UUID | NOT NULL | — | |
| `overall_status` | VARCHAR(20) | NULL | — | |
| `total_controls` | INTEGER | NULL | — | |
| `passed_controls` | INTEGER | NULL | — | |
| `failed_controls` | INTEGER | NULL | — | |
| `error_controls` | INTEGER | NULL | — | |
| `blocked_controls` | INTEGER | NULL | — | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |
| `project_id` | UUID | NULL | — | FK → `core.projects` |

**Evidence:** `engine_backup.sql:1089-1100`

---

## engine.migration_control_exceptions

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Detailed exception records |
| **Primary Key** | `id` (SERIAL) |
| **Foreign Keys** | None (batch_id references batch table) |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | SERIAL | NOT NULL | `nextval(...)` | PK |
| `batch_id` | UUID | NOT NULL | — | |
| `control_id` | VARCHAR(20) | NULL | — | |
| `rule_id` | VARCHAR(50) | NULL | — | |
| `entity_name` | VARCHAR(100) | NULL | — | |
| `source_value` | TEXT | NULL | — | |
| `target_value` | TEXT | NULL | — | |
| `delta_value` | NUMERIC | NULL | — | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |
| `cause` | TEXT | NULL | — | |
| `failure_scope` | VARCHAR(20) | NULL | — | |

**Evidence:** `engine_backup.sql:1131-1143`

---

## engine.migration_exception_register

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Exception register with primary key values |
| **Primary Key** | `exception_id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `exception_id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `batch_id` | UUID | NULL | — | |
| `control_id` | VARCHAR(10) | NULL | — | |
| `rule_id` | VARCHAR(20) | NULL | — | |
| `entity_name` | VARCHAR(100) | NULL | — | |
| `primary_key_value` | TEXT | NULL | — | |
| `source_value` | TEXT | NULL | — | |
| `target_value` | TEXT | NULL | — | |
| `variance_value` | NUMERIC | NULL | — | |
| `created_timestamp` | TIMESTAMP | NOT NULL | `now()` | |

**Evidence:** `engine_backup.sql:1275-1286`

---

## engine.migration_release_decision

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Release gate decisions |
| **Primary Key** | `id` (SERIAL) |
| **Foreign Keys** | None (batch_id references batch table) |
| **Referenced By** | `reporting.v_fact_batch` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | SERIAL | NOT NULL | `nextval(...)` | PK |
| `batch_id` | UUID | NOT NULL | — | |
| `environment` | VARCHAR(20) | NULL | — | |
| `client_name` | VARCHAR(100) | NULL | — | |
| `overall_status` | VARCHAR(20) | NULL | — | |
| `overall_score` | NUMERIC(5,2) | NULL | — | |
| `gate_result` | VARCHAR(20) | NULL | — | |
| `decision_reason` | TEXT | NULL | — | |
| `approved_by` | VARCHAR(100) | NULL | `'SYSTEM'` | |
| `approval_timestamp` | TIMESTAMP | NOT NULL | `now()` | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |

**Evidence:** `engine_backup.sql:1295-1307`

---

## engine.migration_batch_intelligence

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Governance intelligence scores |
| **Primary Key** | `batch_id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | `reporting.v_batch_governance_intelligence` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `batch_id` | UUID | NOT NULL | — | PK |
| `rolling_window_size` | INTEGER | NULL | — | |
| `avg_score_last_n` | NUMERIC | NULL | — | |
| `stability_score` | NUMERIC | NULL | — | |
| `risk_heat_index` | NUMERIC | NULL | — | |
| `repeat_failure_index` | NUMERIC | NULL | — | |
| `execution_time_zscore` | NUMERIC | NULL | — | |
| `anomaly_score` | NUMERIC | NULL | — | |
| `anomaly_flag` | BOOLEAN | NULL | — | |
| `auto_blocked` | BOOLEAN | NULL | — | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |

**Evidence:** `engine_backup.sql:1047-1059`

---

## engine.governance_config

| Attribute | Value |
|-----------|-------|
| **Schema** | engine |
| **Purpose** | Governance configuration parameters |
| **Primary Key** | `id` (SERIAL) |
| **Foreign Keys** | None |
| **Referenced By** | None (read by `run_governance_intelligence` function) |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | SERIAL | NOT NULL | `nextval(...)` | PK |
| `client_name` | VARCHAR(100) | NULL | `'GLOBAL'` | |
| `environment` | VARCHAR(20) | NULL | `'ALL'` | |
| `rolling_window_size` | INTEGER | NULL | `5` | |
| `anomaly_std_threshold` | NUMERIC(5,2) | NULL | `2.0` | |
| `repeat_failure_threshold` | INTEGER | NULL | `3` | |
| `anomaly_block_threshold` | NUMERIC(5,2) | NULL | `70` | |
| `volatility_multiplier` | NUMERIC(5,2) | NULL | `1.5` | |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | |

**Evidence:** `engine_backup.sql:927-937`

---

## platform.users

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | User accounts |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `tenant_id` → `core.tenants.id`, `created_by` → `platform.users.id` |
| **Referenced By** | `platform.refresh_tokens`, `platform.user_sessions`, `platform.user_roles`, `platform.tasks`, `platform.task_comments`, `platform.notifications`, `platform.notification_preferences`, `platform.calendar_events`, `platform.calendar_event_reminders`, `platform.workflow_instances`, `platform.workflow_step_instances`, `platform.workflow_history` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `email` | VARCHAR(255) | NOT NULL | — | UNIQUE |
| `email_verified` | BOOLEAN | NULL | `false` | |
| `password_hash` | VARCHAR(255) | NOT NULL | — | |
| `first_name` | VARCHAR(100) | NOT NULL | — | |
| `last_name` | VARCHAR(100) | NOT NULL | — | |
| `display_name` | VARCHAR(200) | NULL | — | |
| `avatar_url` | TEXT | NULL | — | |
| `phone` | VARCHAR(50) | NULL | — | |
| `status` | VARCHAR(50) | NOT NULL | `'pending'` | CHECK: 'active', 'inactive', 'suspended', 'pending', 'locked' |
| `tenant_id` | UUID | NULL | — | FK → `core.tenants.id` |
| `department` | VARCHAR(100) | NULL | — | |
| `last_login_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `last_login_ip` | INET | NULL | — | |
| `password_changed_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `failed_login_attempts` | INTEGER | NULL | `0` | |
| `locked_until` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `mfa_enabled` | BOOLEAN | NULL | `false` | |
| `mfa_secret` | VARCHAR(255) | NULL | — | |
| `metadata` | JSONB | NULL | `'{}'` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `created_by` | UUID | NULL | — | FK → `platform.users.id` |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |

**Evidence:** `create_platform_schema.sql:12-38`

---

## platform.roles

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | System and custom roles |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `tenant_id` → `core.tenants.id`, `created_by` → `platform.users.id` |
| **Referenced By** | `platform.role_permissions`, `platform.user_roles` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `name` | VARCHAR(100) | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `type` | VARCHAR(50) | NOT NULL | `'custom'` | CHECK: 'system', 'custom', 'template' |
| `parent_id` | UUID | NULL | — | Self-referencing FK |
| `level` | INTEGER | NULL | `0` | |
| `is_system` | BOOLEAN | NULL | `false` | |
| `is_default` | BOOLEAN | NULL | `false` | |
| `status` | VARCHAR(50) | NOT NULL | `'active'` | CHECK: 'active', 'inactive', 'deprecated' |
| `tenant_id` | UUID | NULL | — | FK → `core.tenants.id` |
| `metadata` | JSONB | NULL | `'{}'` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `created_by` | UUID | NULL | — | FK → `platform.users.id` |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |

**Evidence:** `create_platform_schema.sql:75-93`

---

## platform.permissions

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Permission definitions |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | `platform.role_permissions` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `name` | VARCHAR(150) | NOT NULL | — | UNIQUE |
| `description` | TEXT | NULL | — | |
| `resource` | VARCHAR(100) | NOT NULL | — | |
| `action` | VARCHAR(50) | NOT NULL | — | |
| `category` | VARCHAR(100) | NULL | — | |
| `is_system` | BOOLEAN | NULL | `false` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:99-108`

---

## platform.role_permissions

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Role-permission mappings |
| **Primary Key** | `(role_id, permission_id)` |
| **Foreign Keys** | `role_id` → `platform.roles.id`, `permission_id` → `platform.permissions.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `role_id` | UUID | NOT NULL | — | PK, FK → `platform.roles` |
| `permission_id` | UUID | NOT NULL | — | PK, FK → `platform.permissions` |
| `granted` | BOOLEAN | NULL | `true` | |
| `conditions` | JSONB | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:113-120`

---

## platform.user_roles

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | User-role assignments |
| **Primary Key** | `(user_id, role_id)` |
| **Foreign Keys** | `user_id` → `platform.users.id`, `role_id` → `platform.roles.id`, `assigned_by` → `platform.users.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `user_id` | UUID | NOT NULL | — | PK, FK → `platform.users` |
| `role_id` | UUID | NOT NULL | — | PK, FK → `platform.roles` |
| `assigned_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `assigned_by` | UUID | NULL | — | FK → `platform.users` |
| `expires_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `is_temporary` | BOOLEAN | NULL | `false` | |

**Evidence:** `create_platform_schema.sql:122-130`

---

## platform.workflow_definitions

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Workflow templates |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `tenant_id` → `core.tenants.id`, `created_by` → `platform.users.id` |
| **Referenced By** | `platform.workflow_instances`, `platform.workflow_history` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `name` | VARCHAR(200) | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `type` | VARCHAR(50) | NOT NULL | — | CHECK: 'approval', 'notification', 'task', 'migration', 'governance', 'custom' |
| `status` | VARCHAR(50) | NOT NULL | `'draft'` | CHECK: 'active', 'inactive', 'draft', 'archived' |
| `version` | INTEGER | NULL | `1` | |
| `steps` | JSONB | NOT NULL | `'[]'` | |
| `triggers` | JSONB | NULL | `'[]'` | |
| `variables` | JSONB | NULL | `'{}'` | |
| `tenant_id` | UUID | NULL | — | FK → `core.tenants.id` |
| `is_system` | BOOLEAN | NULL | `false` | |
| `metadata` | JSONB | NULL | `'{}'` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `created_by` | UUID | NULL | — | FK → `platform.users.id` |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |

**Evidence:** `create_platform_schema.sql:139-158`

---

## platform.workflow_instances

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Running workflow instances |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `workflow_definition_id` → `platform.workflow_definitions.id`, `initiated_by` → `platform.users.id` (implied), `assigned_to` → `platform.users.id` (implied) |
| **Referenced By** | `platform.workflow_step_instances`, `platform.workflow_history` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `workflow_definition_id` | UUID | NOT NULL | — | FK → `platform.workflow_definitions` |
| `name` | VARCHAR(200) | NULL | — | |
| `status` | VARCHAR(50) | NOT NULL | `'pending'` | CHECK: 'pending', 'running', 'paused', 'completed', 'failed', 'cancelled' |
| `priority` | VARCHAR(20) | NULL | `'medium'` | |
| `context` | JSONB | NULL | `'{}'` | |
| `variables` | JSONB | NULL | `'{}'` | |
| `started_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `error_message` | TEXT | NULL | — | |
| `tenant_id` | UUID | NULL | — | |
| `initiated_by` | UUID | NOT NULL | — | |
| `assigned_to` | UUID | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:164-181`

---

## platform.workflow_step_instances

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Individual workflow steps |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `workflow_instance_id` → `platform.workflow_instances.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `workflow_instance_id` | UUID | NOT NULL | — | FK → `platform.workflow_instances` |
| `step_index` | INTEGER | NOT NULL | — | |
| `name` | VARCHAR(200) | NOT NULL | — | |
| `status` | VARCHAR(50) | NOT NULL | `'pending'` | |
| `input` | JSONB | NULL | `'{}'` | |
| `output` | JSONB | NULL | `'{}'` | |
| `started_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `assigned_to` | UUID | NULL | — | |
| `approved_by` | UUID | NULL | — | |
| `error_message` | TEXT | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:186-200`

---

## platform.workflow_history

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Workflow audit trail |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `workflow_definition_id` → `platform.workflow_definitions.id`, `workflow_instance_id` → `platform.workflow_instances.id`, `performed_by` → `platform.users.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `workflow_definition_id` | UUID | NOT NULL | — | FK → `platform.workflow_definitions` |
| `workflow_instance_id` | UUID | NULL | — | FK → `platform.workflow_instances` |
| `action` | VARCHAR(50) | NOT NULL | — | |
| `performed_by` | UUID | NULL | — | FK → `platform.users` |
| `details` | JSONB | NULL | `'{}'` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `workstream_05_compliance_fixes.sql:9-17`

---

## platform.approval_templates

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Approval workflow templates |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `tenant_id` → `core.tenants.id` (implied) |
| **Referenced By** | `platform.approval_requests` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `name` | VARCHAR(200) | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `type` | VARCHAR(50) | NOT NULL | — | |
| `status` | VARCHAR(50) | NOT NULL | `'active'` | |
| `steps` | JSONB | NOT NULL | `'[]'` | |
| `tenant_id` | UUID | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:222-232`

---

## platform.approval_requests

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Approval request instances |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `template_id` → `platform.approval_templates.id`, `requester_id` → `platform.users.id`, `tenant_id` → `core.tenants.id` |
| **Referenced By** | `platform.approval_step_instances` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `template_id` | UUID | NOT NULL | — | FK → `platform.approval_templates` |
| `name` | VARCHAR(200) | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `status` | VARCHAR(50) | NOT NULL | `'pending'` | CHECK: 'pending', 'in_progress', 'approved', 'rejected', 'cancelled' |
| `priority` | VARCHAR(20) | NULL | `'medium'` | |
| `data` | JSONB | NULL | `'{}'` | |
| `requester_id` | UUID | NOT NULL | — | FK → `platform.users` |
| `current_step` | INTEGER | NULL | `0` | |
| `total_steps` | INTEGER | NULL | `1` | |
| `due_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `tenant_id` | UUID | NULL | — | FK → `core.tenants` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:234-251`

---

## platform.approval_step_instances

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Individual approval steps |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `request_id` → `platform.approval_requests.id`, `approver_id` → `platform.users.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `request_id` | UUID | NOT NULL | — | FK → `platform.approval_requests` |
| `step_index` | INTEGER | NOT NULL | — | |
| `name` | VARCHAR(200) | NOT NULL | — | |
| `approver_id` | UUID | NOT NULL | — | FK → `platform.users` |
| `status` | VARCHAR(50) | NOT NULL | `'pending'` | |
| `comments` | TEXT | NULL | — | |
| `decided_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:256-266`

---

## platform.tasks

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Task management |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `assigned_to` → `platform.users.id`, `assigned_by` → `platform.users.id`, `project_id` → `core.projects.project_id`, `parent_task_id` → `platform.tasks.id`, `tenant_id` → `core.tenants.id` |
| **Referenced By** | `platform.task_comments`, `platform.task_dependencies` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `title` | VARCHAR(200) | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `status` | VARCHAR(50) | NOT NULL | `'todo'` | CHECK: 'todo', 'in_progress', 'review', 'done', 'blocked', 'cancelled' |
| `priority` | VARCHAR(20) | NOT NULL | `'medium'` | CHECK: 'critical', 'high', 'medium', 'low' |
| `type` | VARCHAR(50) | NOT NULL | `'task'` | |
| `assigned_to` | UUID | NULL | — | FK → `platform.users` |
| `assigned_by` | UUID | NULL | — | FK → `platform.users` |
| `project_id` | UUID | NULL | — | FK → `core.projects` |
| `parent_task_id` | UUID | NULL | — | FK → `platform.tasks` (self-ref) |
| `due_date` | DATE | NULL | — | |
| `estimated_hours` | NUMERIC(6,2) | NULL | — | |
| `actual_hours` | NUMERIC(6,2) | NULL | — | |
| `completion_percentage` | INTEGER | NULL | `0` | CHECK: 0-100 |
| `tags` | JSONB | NULL | `'[]'` | |
| `tenant_id` | UUID | NULL | — | FK → `core.tenants` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |

**Evidence:** `create_platform_schema.sql:274-298`

---

## platform.task_comments

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Task comments |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `task_id` → `platform.tasks.id`, `user_id` → `platform.users.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `task_id` | UUID | NOT NULL | — | FK → `platform.tasks` |
| `user_id` | UUID | NOT NULL | — | FK → `platform.users` |
| `content` | TEXT | NOT NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |

**Evidence:** `create_platform_schema.sql:305-313`

---

## platform.task_dependencies

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Task dependency relationships |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `task_id` → `platform.tasks.id`, `depends_on_id` → `platform.tasks.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `task_id` | UUID | NOT NULL | — | FK → `platform.tasks` |
| `depends_on_id` | UUID | NOT NULL | — | FK → `platform.tasks` |
| `dependency_type` | VARCHAR(20) | NULL | `'finish_to_start'` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Unique:** `(task_id, depends_on_id)`

**Evidence:** `create_platform_schema.sql:317-324`

---

## platform.notifications

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | User notifications |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `user_id` → `platform.users.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `user_id` | UUID | NOT NULL | — | FK → `platform.users` |
| `type` | VARCHAR(50) | NOT NULL | — | |
| `title` | VARCHAR(200) | NOT NULL | — | |
| `message` | TEXT | NOT NULL | — | |
| `severity` | VARCHAR(20) | NULL | `'info'` | CHECK: 'info', 'success', 'warning', 'error' |
| `data` | JSONB | NULL | `'{}'` | |
| `is_read` | BOOLEAN | NULL | `false` | |
| `read_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `link` | VARCHAR(500) | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:330-343`

---

## platform.notification_preferences

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Notification channel preferences |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `user_id` → `platform.users.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `user_id` | UUID | NOT NULL | — | FK → `platform.users` |
| `type` | VARCHAR(50) | NOT NULL | — | |
| `channel` | VARCHAR(50) | NOT NULL | — | CHECK: 'email', 'in_app', 'push' |
| `enabled` | BOOLEAN | NULL | `true` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Unique:** `(user_id, type, channel)`

**Evidence:** `create_platform_schema.sql:349-359`

---

## platform.calendar_events

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Calendar events |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `organizer_id` → `platform.users.id`, `project_id` → `core.projects.project_id`, `tenant_id` → `core.tenants.id` |
| **Referenced By** | `platform.calendar_event_reminders` |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `title` | VARCHAR(200) | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `type` | VARCHAR(50) | NOT NULL | — | CHECK: 'meeting', 'deadline', 'milestone', 'task', 'reminder', 'governance', 'custom' |
| `status` | VARCHAR(50) | NOT NULL | `'scheduled'` | |
| `start_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | — | |
| `end_time` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `all_day` | BOOLEAN | NULL | `false` | |
| `timezone` | VARCHAR(50) | NULL | `'UTC'` | |
| `recurrence` | JSONB | NULL | — | |
| `attendees` | JSONB | NULL | `'[]'` | |
| `organizer_id` | UUID | NULL | — | FK → `platform.users` |
| `project_id` | UUID | NULL | — | FK → `core.projects` |
| `location` | VARCHAR(500) | NULL | — | |
| `meeting_url` | VARCHAR(500) | NULL | — | |
| `metadata` | JSONB | NULL | `'{}'` | |
| `tenant_id` | UUID | NULL | — | FK → `core.tenants` |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `created_by` | UUID | NULL | — | |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |

**Evidence:** `create_platform_schema.sql:365-388`

---

## platform.calendar_event_reminders

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Event reminders |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `event_id` → `platform.calendar_events.id`, `user_id` → `platform.users.id` |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `event_id` | UUID | NOT NULL | — | FK → `platform.calendar_events` |
| `user_id` | UUID | NOT NULL | — | FK → `platform.users` |
| `reminder_type` | VARCHAR(50) | NOT NULL | `'email'` | |
| `minutes_before` | INTEGER | NOT NULL | — | |
| `is_sent` | BOOLEAN | NULL | `false` | |
| `sent_at` | TIMESTAMP WITH TIME ZONE | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_platform_schema.sql:395-404`

---

## platform.system_settings

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Platform configuration key-value pairs |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `updated_by` → `platform.users.id` (implied) |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `category` | VARCHAR(100) | NOT NULL | — | |
| `key` | VARCHAR(200) | NOT NULL | — | |
| `value` | JSONB | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `data_type` | VARCHAR(50) | NOT NULL | — | |
| `is_required` | BOOLEAN | NULL | `false` | |
| `is_readonly` | BOOLEAN | NULL | `false` | |
| `default_value` | JSONB | NULL | — | |
| `tenant_scoped` | BOOLEAN | NULL | `false` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_by` | UUID | NULL | — | |

**Unique:** `(category, key)`

**Evidence:** `create_platform_schema.sql:412-427`

---

## platform.feature_flags

| Attribute | Value |
|-----------|-------|
| **Schema** | platform |
| **Purpose** | Feature toggle definitions |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | `created_by` → `platform.users.id` (implied) |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `name` | VARCHAR(100) | NOT NULL | — | |
| `description` | TEXT | NULL | — | |
| `key` | VARCHAR(100) | NOT NULL | — | UNIQUE |
| `enabled` | BOOLEAN | NULL | `false` | |
| `rollout_percentage` | NUMERIC(5,2) | NULL | `0` | |
| `status` | VARCHAR(50) | NULL | `'active'` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `created_by` | UUID | NULL | — | |

**Evidence:** `create_platform_schema.sql:431-442`

---

## audit.audit_events

| Attribute | Value |
|-----------|-------|
| **Schema** | audit |
| **Purpose** | General audit events |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `user_id` | UUID | NULL | — | |
| `user_email` | VARCHAR(255) | NULL | — | |
| `user_name` | VARCHAR(200) | NULL | — | |
| `session_id` | VARCHAR(255) | NULL | — | |
| `action` | VARCHAR(100) | NOT NULL | — | |
| `resource_type` | VARCHAR(100) | NOT NULL | — | |
| `resource_id` | UUID | NULL | — | |
| `resource_name` | VARCHAR(200) | NULL | — | |
| `old_value` | JSONB | NULL | — | |
| `new_value` | JSONB | NULL | — | |
| `ip_address` | INET | NULL | — | |
| `user_agent` | TEXT | NULL | — | |
| `request_id` | VARCHAR(255) | NULL | — | |
| `status` | VARCHAR(20) | NULL | `'success'` | CHECK: 'success', 'failure', 'error' |
| `error_message` | TEXT | NULL | — | |
| `metadata` | JSONB | NULL | `'{}'` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_audit_schema.sql:13-34`

---

## audit.security_events

| Attribute | Value |
|-----------|-------|
| **Schema** | audit |
| **Purpose** | Security-related events |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `event_type` | VARCHAR(100) | NOT NULL | — | CHECK: 28 event types |
| `user_id` | UUID | NULL | — | |
| `user_email` | VARCHAR(255) | NULL | — | |
| `severity` | VARCHAR(20) | NULL | `'info'` | CHECK: 'info', 'warning', 'critical' |
| `ip_address` | INET | NULL | — | |
| `user_agent` | TEXT | NULL | — | |
| `request_id` | VARCHAR(255) | NULL | — | |
| `details` | JSONB | NULL | `'{}'` | |
| `risk_score` | NUMERIC(5,2) | NULL | — | |
| `blocked` | BOOLEAN | NULL | `false` | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_audit_schema.sql:47-74`

---

## audit.login_history

| Attribute | Value |
|-----------|-------|
| **Schema** | audit |
| **Purpose** | User login attempts |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `user_id` | UUID | NOT NULL | — | |
| `user_email` | VARCHAR(255) | NOT NULL | — | |
| `status` | VARCHAR(20) | NOT NULL | — | CHECK: 'success', 'failure', 'locked', 'blocked' |
| `ip_address` | INET | NOT NULL | — | |
| `user_agent` | TEXT | NULL | — | |
| `geo_location` | JSONB | NULL | — | |
| `failure_reason` | TEXT | NULL | — | |
| `login_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `session_duration_minutes` | INTEGER | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_audit_schema.sql:85-98`

---

## audit.api_logs

| Attribute | Value |
|-----------|-------|
| **Schema** | audit |
| **Purpose** | API request/response logs |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `request_id` | VARCHAR(255) | NULL | — | |
| `method` | VARCHAR(10) | NOT NULL | — | |
| `path` | VARCHAR(500) | NOT NULL | — | |
| `query_params` | JSONB | NULL | — | |
| `request_headers` | JSONB | NULL | — | |
| `request_body` | JSONB | NULL | — | |
| `response_status` | INTEGER | NULL | — | |
| `response_body` | JSONB | NULL | — | |
| `response_time_ms` | INTEGER | NULL | — | |
| `user_id` | UUID | NULL | — | |
| `user_email` | VARCHAR(255) | NULL | — | |
| `ip_address` | INET | NULL | — | |
| `user_agent` | TEXT | NULL | — | |
| `content_length` | INTEGER | NULL | — | |
| `error_message` | TEXT | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_audit_schema.sql:108-127`

---

## audit.configuration_history

| Attribute | Value |
|-----------|-------|
| **Schema** | audit |
| **Purpose** | Configuration change history |
| **Primary Key** | `id` (UUID) |
| **Foreign Keys** | None |
| **Referenced By** | None |

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |
| `user_id` | UUID | NULL | — | |
| `user_email` | VARCHAR(255) | NULL | — | |
| `setting_category` | VARCHAR(100) | NOT NULL | — | |
| `setting_key` | VARCHAR(200) | NOT NULL | — | |
| `old_value` | JSONB | NULL | — | |
| `new_value` | JSONB | NULL | — | |
| `change_reason` | TEXT | NULL | — | |
| `ip_address` | INET | NULL | — | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `NOW()` | |

**Evidence:** `create_audit_schema.sql:139-151`

---

**Version:** 2.1

**Status:** Current State Documentation
