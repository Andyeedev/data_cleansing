# 10_Database_Statistics.md

## Overview

This document provides actual counts of all database objects in the MAP Nexus platform, based on evidence from SQL DDL files.

---

## Object Counts

### Schemas

| Schema | Status | Tables | Views | Functions | Triggers |
|--------|--------|--------|-------|-----------|----------|
| `core` | Active | 7 | 0 | 0 | 0 |
| `engine` | Active | 15 | 4 | 3 | 0 |
| `engine_v14` | Active | 10 | 0 | 0 | 0 |
| `reporting` | Active | 3 | 5 | 0 | 0 |
| `platform` | Active | 22 | 0 | 1 | 8 |
| `audit` | Active | 5 | 0 | 0 | 0 |
| **Total** | — | **62** | **9** | **4** | **8** |

---

## Tables by Schema

### core (7 tables)

| Table | Purpose |
|-------|---------|
| `tenants` | Multi-tenant organizations |
| `projects` | Migration projects |
| `system_registry` | Database system connections |
| `datasets` | Discovered tables |
| `dataset_mappings` | Source-to-target table mappings |
| `dataset_columns` | Column definitions |
| `column_mappings` | Column mappings |
| `rule_dataset_mapping` | Rule-to-mapping links |

**Evidence:** `engine_backup.sql:619-751`

### engine (15 active tables + 6 legacy)

| Table | Purpose |
|-------|---------|
| `control_registry` | Validation control definitions |
| `rule_registry` | Validation rule definitions |
| `rule_parameter_metadata_legacy` | Entity mapping (legacy) |
| `migration_validation_batch` | Batch execution records |
| `migration_batch_summary` | Batch-level summaries |
| `migration_control_execution` | Control execution results |
| `migration_control_summary` | Control-level summaries |
| `migration_control_exceptions` | Exception records |
| `migration_exception_register` | Exception register |
| `migration_release_decision` | Release decisions |
| `migration_batch_intelligence` | Governance intelligence |
| `batch_anomaly_analysis` | Anomaly analysis |
| `batch_intelligence` | Batch intelligence |
| `batch_rule_scores` | Rule scores |
| `control_persistence_analysis` | Repeat failure analysis |
| `governance_config` | Governance parameters |
| `rule_anomaly_history` | Anomaly history |
| `rule_execution_statistics` | Execution statistics |
| `rule_weight_config` | Rule weights |
| `rule_weights` | Legacy weights |

**Legacy Tables:** `dataset_mappings_OLD`, `governance_config_OLD`, `governance_config_OLD_1`, `migration_control_execution_OLD`, `migration_batch_intelligence_OLD`, `projects_OLD`, `system_registry_OLD`, `tenants_OLD`

**Evidence:** `engine_backup.sql:760-1558`

### engine_v14 (10 tables)

| Table | Purpose |
|-------|---------|
| `tenants` | Legacy tenants |
| `projects` | Legacy projects |
| `systems` | Legacy systems |
| `datasets` | Legacy datasets |
| `dataset_mappings` | Legacy mappings |
| `dataset_columns` | Legacy columns |
| `column_mappings` | Legacy column mappings |
| `batch_runs` | Legacy batch runs |
| `control_executions` | Legacy control executions |
| `batch_intelligence` | Legacy intelligence |

**Evidence:** `engine_backup.sql:1584-1763`

### reporting (3 tables)

| Table | Purpose |
|-------|---------|
| `dim_date` | Date dimension |
| `dim_severity` | Severity reference |
| `dim_status` | Status reference |

**Evidence:** `engine_backup.sql:1769-1825`

### platform (22 tables)

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `refresh_tokens` | JWT refresh tokens |
| `user_sessions` | User sessions |
| `roles` | System and custom roles |
| `permissions` | Permission definitions |
| `role_permissions` | Role-permission mappings |
| `user_roles` | User-role assignments |
| `workflow_definitions` | Workflow templates |
| `workflow_instances` | Running workflows |
| `workflow_step_instances` | Workflow steps |
| `workflow_history` | Workflow audit trail |
| `approval_templates` | Approval templates |
| `approval_requests` | Approval instances |
| `approval_step_instances` | Approval steps |
| `tasks` | Task management |
| `task_comments` | Task comments |
| `task_dependencies` | Task dependencies |
| `notifications` | User notifications |
| `notification_preferences` | Notification preferences |
| `calendar_events` | Calendar events |
| `calendar_event_reminders` | Event reminders |
| `system_settings` | Platform configuration |
| `feature_flags` | Feature toggles |

**Evidence:** `create_platform_schema.sql:12-442`

### audit (5 tables)

| Table | Purpose |
|-------|---------|
| `audit_events` | General audit events |
| `security_events` | Security events |
| `login_history` | Login attempts |
| `api_logs` | API request/response logs |
| `configuration_history` | Config changes |

**Evidence:** `create_audit_schema.sql:13-151`

---

## Views

| Schema | View | Purpose |
|--------|------|---------|
| `engine` | `v_migration_control_summary` | Control-level summary |
| `engine` | `v_migration_executive_summary` | Executive dashboard |
| `engine` | `v_migration_exception_detail` | Exception drill-down |
| `engine` | `v_migration_score_trend` | Score trend analysis |
| `reporting` | `v_batch_governance_intelligence` | Governance intelligence |
| `reporting` | `v_batch_governance_intelligence_OLD` | Legacy governance |
| `reporting` | `v_fact_batch` | Batch facts |
| `reporting` | `v_fact_control` | Control facts |

**Evidence:** `engine_backup.sql:1567-1961`

---

## Functions

| Schema | Function | Purpose |
|--------|----------|---------|
| `engine` | `run_governance_intelligence(uuid)` | Calculate anomaly scores |
| `engine` | `run_governance_intelligence_OLD(uuid)` | Legacy version |
| `engine` | `run_governance_intelligence_OLD_2(uuid)` | Legacy version |
| `platform` | `update_updated_at_column()` | Trigger function |

**Evidence:** `engine_backup.sql:60-406`, `seed_platform_data.sql:139-145`

---

## Triggers

| Schema | Table | Trigger | Purpose |
|--------|-------|---------|---------|
| `platform` | `users` | `update_users_updated_at` | Auto-update timestamp |
| `platform` | `roles` | `update_roles_updated_at` | Auto-update timestamp |
| `platform` | `workflow_definitions` | `update_workflow_definitions_updated_at` | Auto-update timestamp |
| `platform` | `workflow_instances` | `update_workflow_instances_updated_at` | Auto-update timestamp |
| `platform` | `tasks` | `update_tasks_updated_at` | Auto-update timestamp |
| `platform` | `calendar_events` | `update_calendar_events_updated_at` | Auto-update timestamp |
| `platform` | `system_settings` | `update_system_settings_updated_at` | Auto-update timestamp |
| `platform` | `feature_flags` | `update_feature_flags_updated_at` | Auto-update timestamp |

**Evidence:** `seed_platform_data.sql:148-163`

---

## Sequences

| Schema | Sequence | Table |
|--------|----------|-------|
| `engine` | `batch_anomaly_analysis_id_seq` | `batch_anomaly_analysis` |
| `engine` | `batch_intelligence_id_seq` | `batch_intelligence` |
| `engine` | `control_persistence_analysis_id_seq` | `control_persistence_analysis` |
| `engine` | `governance_config_id_seq` | `governance_config_OLD` |
| `engine` | `governance_config_id_seq1` | `governance_config_OLD_1` |
| `engine` | `governance_config_id_seq2` | `governance_config` |
| `engine` | `migration_batch_summary_id_seq` | `migration_batch_summary` |
| `engine` | `migration_control_exceptions_id_seq` | `migration_control_exceptions` |
| `engine` | `migration_control_execution_id_seq` | `migration_control_execution` |
| `engine` | `migration_control_summary_id_seq` | `migration_control_summary` |
| `engine` | `migration_release_decision_id_seq` | `migration_release_decision` |
| `engine` | `rule_anomaly_history_id_seq` | `rule_anomaly_history` |
| `engine` | `rule_execution_statistics_id_seq` | `rule_execution_statistics` |
| `engine` | `rule_parameter_metadata_id_seq` | `rule_parameter_metadata_legacy` |
| `engine_v14` | `control_executions_execution_id_seq` | `control_executions` |
| `reporting` | `dim_severity_severity_key_seq` | `dim_severity` |
| `reporting` | `dim_status_status_key_seq` | `dim_status` |

**Total:** 17 sequences

**Evidence:** `engine_backup.sql:779-2080`

---

## Indexes

### Core Schema Indexes

| Table | Index | Columns |
|-------|-------|---------|
| `tenants` | `tenants_pkey` | `tenant_id` |
| `projects` | `projects_pkey` | `project_id` |
| `projects` | `projects_tenant_id_fkey` | `tenant_id` |
| `system_registry` | `system_registry_pkey` | `system_id` |
| `system_registry` | `system_registry_project_id_fkey` | `project_id` |
| `datasets` | `datasets_pkey` | `dataset_id` |
| `datasets` | `datasets_system_id_fkey` | `system_id` |
| `dataset_mappings` | `dataset_mappings_pkey` | `mapping_id` |
| `dataset_mappings` | `dataset_mappings_project_id_fkey` | `project_id` |
| `dataset_mappings` | `dataset_mappings_source_system_id_fkey` | `source_system_id` |
| `dataset_mappings` | `dataset_mappings_target_system_id_fkey` | `target_system_id` |
| `dataset_columns` | `dataset_columns_pkey` | `column_id` |
| `dataset_columns` | `dataset_columns_mapping_id_fkey` | `mapping_id` |
| `column_mappings` | `column_mappings_pkey` | `column_mapping_id` |
| `column_mappings` | `column_mappings_mapping_id_fkey` | `mapping_id` |
| `column_mappings` | `column_mappings_source_column_id_fkey` | `source_column_id` |
| `column_mappings` | `column_mappings_target_column_id_fkey` | `target_column_id` |
| `rule_dataset_mapping` | `rule_dataset_mapping_pkey` | `id` |

**Evidence:** `engine_backup.sql:5406-5470`

### Platform Schema Indexes

| Table | Index | Columns |
|-------|-------|---------|
| `users` | `idx_platform_users_email` | `email` |
| `users` | `idx_platform_users_status` | `status` |
| `users` | `idx_platform_users_tenant_id` | `tenant_id` |
| `refresh_tokens` | `idx_platform_refresh_tokens_user_id` | `user_id` |
| `user_sessions` | `idx_platform_user_sessions_user_id` | `user_id` |
| `roles` | `idx_platform_roles_tenant_id` | `tenant_id` |
| `roles` | `idx_platform_roles_type` | `type` |
| `roles` | `idx_platform_roles_status` | `status` |
| `permissions` | `idx_platform_permissions_resource` | `resource` |
| `permissions` | `idx_platform_permissions_action` | `action` |
| `user_roles` | `idx_platform_user_roles_user_id` | `user_id` |
| `user_roles` | `idx_platform_user_roles_role_id` | `role_id` |
| `workflow_definitions` | `idx_platform_workflow_definitions_tenant_id` | `tenant_id` |
| `workflow_definitions` | `idx_platform_workflow_definitions_type` | `type` |
| `workflow_definitions` | `idx_platform_workflow_definitions_status` | `status` |
| `workflow_instances` | `idx_platform_workflow_instances_status` | `status` |
| `workflow_instances` | `idx_platform_workflow_instances_tenant_id` | `tenant_id` |
| `workflow_step_instances` | `idx_platform_workflow_step_instances_instance_id` | `workflow_instance_id` |
| `workflow_history` | `idx_platform_workflow_history_instance_id` | `workflow_instance_id` |
| `approval_requests` | `idx_platform_approval_requests_status` | `status` |
| `approval_requests` | `idx_platform_approval_requests_requester_id` | `requester_id` |
| `approval_step_instances` | `idx_platform_approval_step_instances_request_id` | `request_id` |
| `tasks` | `idx_platform_tasks_assigned_to` | `assigned_to` |
| `tasks` | `idx_platform_tasks_status` | `status` |
| `tasks` | `idx_platform_tasks_priority` | `priority` |
| `tasks` | `idx_platform_tasks_tenant_id` | `tenant_id` |
| `task_comments` | `idx_platform_task_comments_task_id` | `task_id` |
| `notifications` | `idx_platform_notifications_user_id` | `user_id` |
| `notifications` | `idx_platform_notifications_is_read` | `is_read` |
| `notifications` | `idx_platform_notifications_created_at` | `created_at DESC` |
| `calendar_events` | `idx_platform_calendar_events_start_time` | `start_time` |
| `calendar_events` | `idx_platform_calendar_events_organizer_id` | `organizer_id` |
| `calendar_events` | `idx_platform_calendar_events_type` | `type` |
| `calendar_events` | `idx_platform_calendar_events_tenant_id` | `tenant_id` |
| `calendar_event_reminders` | `idx_platform_calendar_reminders_event_id` | `event_id` |
| `system_settings` | `idx_platform_system_settings_category` | `category` |
| `feature_flags` | `idx_platform_feature_flags_key` | `key` |

**Evidence:** `create_platform_schema.sql:40-444`

### Audit Schema Indexes

| Table | Index | Columns |
|-------|-------|---------|
| `audit_events` | `idx_audit_events_timestamp` | `timestamp DESC` |
| `audit_events` | `idx_audit_events_user_id` | `user_id` |
| `audit_events` | `idx_audit_events_action` | `action` |
| `audit_events` | `idx_audit_events_resource_type` | `resource_type` |
| `audit_events` | `idx_audit_events_resource_id` | `resource_id` |
| `security_events` | `idx_audit_security_events_timestamp` | `timestamp DESC` |
| `security_events` | `idx_audit_security_events_user_id` | `user_id` |
| `security_events` | `idx_audit_security_events_event_type` | `event_type` |
| `security_events` | `idx_audit_security_events_severity` | `severity` |
| `login_history` | `idx_audit_login_history_user_id` | `user_id` |
| `login_history` | `idx_audit_login_history_login_at` | `login_at DESC` |
| `login_history` | `idx_audit_login_history_status` | `status` |
| `api_logs` | `idx_audit_api_logs_timestamp` | `timestamp DESC` |
| `api_logs` | `idx_audit_api_logs_user_id` | `user_id` |
| `api_logs` | `idx_audit_api_logs_method` | `method` |
| `api_logs` | `idx_audit_api_logs_path` | `path` |
| `api_logs` | `idx_audit_api_logs_response_status` | `response_status` |
| `configuration_history` | `idx_audit_config_history_timestamp` | `timestamp DESC` |
| `configuration_history` | `idx_audit_config_history_user_id` | `user_id` |
| `configuration_history` | `idx_audit_config_history_setting_key` | `setting_key` |

**Evidence:** `create_audit_schema.sql:37-155`

**Total:** 71 indexes

---

## Constraints

### Foreign Keys

| Schema | Table | Constraint | References |
|--------|-------|------------|------------|
| `core` | `projects` | `projects_tenant_id_fkey` | `tenants.tenant_id` |
| `core` | `system_registry` | `system_registry_project_id_fkey` | `projects.project_id` |
| `core` | `datasets` | `datasets_system_id_fkey` | `system_registry.system_id` |
| `core` | `dataset_mappings` | `dataset_mappings_project_id_fkey` | `projects.project_id` |
| `core` | `dataset_mappings` | `dataset_mappings_source_system_id_fkey` | `system_registry.system_id` |
| `core` | `dataset_mappings` | `dataset_mappings_target_system_id_fkey` | `system_registry.system_id` |
| `core` | `dataset_columns` | `dataset_columns_mapping_id_fkey` | `dataset_mappings.mapping_id` |
| `core` | `column_mappings` | `column_mappings_mapping_id_fkey` | `dataset_mappings.mapping_id` |
| `core` | `column_mappings` | `column_mappings_source_column_id_fkey` | `dataset_columns.column_id` |
| `core` | `column_mappings` | `column_mappings_target_column_id_fkey` | `dataset_columns.column_id` |
| `engine` | `control_registry` | `control_registry_project_id_fkey` | `projects.project_id` |
| `engine` | `rule_dataset_mapping` | `rule_dataset_mapping_mapping_id_fkey` | `dataset_mappings.mapping_id` |
| `platform` | `users` | `fk_users_tenant_id` | `core.tenants.id` |
| `platform` | `users` | `fk_users_created_by` | `platform.users.id` |
| `platform` | `roles` | `fk_roles_tenant_id` | `core.tenants.id` |
| `platform` | `roles` | `fk_roles_created_by` | `platform.users.id` |
| `platform` | `tasks` | `fk_tasks_tenant_id` | `core.tenants.id` |
| `platform` | `tasks` | `fk_tasks_project` | `core.projects.project_id` |
| `platform` | `workflow_definitions` | `fk_workflow_definitions_tenant_id` | `core.tenants.id` |
| `platform` | `workflow_definitions` | `fk_workflow_definitions_created_by` | `platform.users.id` |
| `platform` | `workflow_instances` | `workflow_instances_workflow_definition_id_fkey` | `workflow_definitions.id` |
| `platform` | `workflow_step_instances` | `workflow_step_instances_workflow_instance_id_fkey` | `workflow_instances.id` |
| `platform` | `workflow_history` | `workflow_history_workflow_definition_id_fkey` | `workflow_definitions.id` |
| `platform` | `workflow_history` | `workflow_history_workflow_instance_id_fkey` | `workflow_instances.id` |
| `platform` | `workflow_history` | `workflow_history_performed_by_fkey` | `platform.users.id` |
| `platform` | `approval_requests` | `approval_requests_template_id_fkey` | `approval_templates.id` |
| `platform` | `approval_requests` | `fk_approval_requests_tenant_id` | `core.tenants.id` |
| `platform` | `approval_requests` | `fk_approval_requests_requested_by` | `platform.users.id` |
| `platform` | `approval_step_instances` | `approval_step_instances_request_id_fkey` | `approval_requests.id` |
| `platform` | `approval_step_instances` | `approval_step_instances_approver_id_fkey` | `platform.users.id` |
| `platform` | `tasks` | `tasks_assigned_to_fkey` | `platform.users.id` |
| `platform` | `tasks` | `tasks_assigned_by_fkey` | `platform.users.id` |
| `platform` | `tasks` | `tasks_parent_task_id_fkey` | `platform.tasks.id` |
| `platform` | `task_comments` | `task_comments_task_id_fkey` | `platform.tasks.id` |
| `platform` | `task_comments` | `task_comments_user_id_fkey` | `platform.users.id` |
| `platform` | `task_dependencies` | `task_dependencies_task_id_fkey` | `platform.tasks.id` |
| `platform` | `task_dependencies` | `task_dependencies_depends_on_id_fkey` | `platform.tasks.id` |
| `platform` | `notifications` | `notifications_user_id_fkey` | `platform.users.id` |
| `platform` | `notification_preferences` | `notification_preferences_user_id_fkey` | `platform.users.id` |
| `platform` | `calendar_events` | `calendar_events_organizer_id_fkey` | `platform.users.id` |
| `platform` | `calendar_events` | `fk_calendar_events_tenant_id` | `core.tenants.id` |
| `platform` | `calendar_events` | `fk_calendar_events_project` | `core.projects.project_id` |
| `platform` | `calendar_event_reminders` | `calendar_event_reminders_event_id_fkey` | `platform.calendar_events.id` |
| `platform` | `calendar_event_reminders` | `calendar_event_reminders_user_id_fkey` | `platform.users.id` |

**Total:** 44 foreign keys

### Check Constraints

| Schema | Table | Constraint | Values |
|--------|-------|------------|--------|
| `core` | `projects` | `projects_project_type_check` | 'MIGRATION', 'DATA_QUALITY' |
| `core` | `system_registry` | `system_registry_database_type_check` | 'POSTGRES', 'ORACLE', 'SQLSERVER', 'MYSQL', 'SNOWFLAKE', 'DATABRICKS' |
| `core` | `system_registry` | `system_registry_system_role_check` | 'SOURCE', 'TARGET', 'ANALYTICS' |
| `core` | `dataset_columns` | `dataset_columns_column_side_check` | 'SOURCE', 'TARGET' |
| `platform` | `users` | `users_status_check` | 'active', 'inactive', 'suspended', 'pending', 'locked' |
| `platform` | `roles` | `roles_type_check` | 'system', 'custom', 'template' |
| `platform` | `roles` | `roles_status_check` | 'active', 'inactive', 'deprecated' |
| `platform` | `tasks` | `tasks_status_check` | 'todo', 'in_progress', 'review', 'done', 'blocked', 'cancelled' |
| `platform` | `tasks` | `tasks_priority_check` | 'critical', 'high', 'medium', 'low' |
| `platform` | `tasks` | `tasks_completion_percentage_check` | 0-100 |
| `platform` | `workflow_definitions` | `workflow_definitions_type_check` | 'approval', 'notification', 'task', 'migration', 'governance', 'custom' |
| `platform` | `workflow_definitions` | `workflow_definitions_status_check` | 'active', 'inactive', 'draft', 'archived' |
| `platform` | `workflow_instances` | `workflow_instances_status_check` | 'pending', 'running', 'paused', 'completed', 'failed', 'cancelled' |
| `platform` | `approval_requests` | `approval_requests_status_check` | 'pending', 'in_progress', 'approved', 'rejected', 'cancelled' |
| `platform` | `notifications` | `notifications_severity_check` | 'info', 'success', 'warning', 'error' |
| `platform` | `notification_preferences` | `notification_preferences_channel_check` | 'email', 'in_app', 'push' |
| `platform` | `calendar_events` | `calendar_events_type_check` | 'meeting', 'deadline', 'milestone', 'task', 'reminder', 'governance', 'custom' |
| `audit` | `audit_events` | `audit_events_status_check` | 'success', 'failure', 'error' |
| `audit` | `security_events` | `security_events_event_type_check` | 28 event types |
| `audit` | `security_events` | `security_events_severity_check` | 'info', 'warning', 'critical' |
| `audit` | `login_history` | `login_history_status_check` | 'success', 'failure', 'locked', 'blocked' |

**Total:** 21 check constraints

### Unique Constraints

| Schema | Table | Columns |
|--------|-------|---------|
| `platform` | `users` | `email` |
| `platform` | `permissions` | `name` |
| `platform` | `notification_preferences` | `(user_id, type, channel)` |
| `platform` | `system_settings` | `(category, key)` |
| `platform` | `feature_flags` | `key` |
| `platform` | `task_dependencies` | `(task_id, depends_on_id)` |

**Total:** 6 unique constraints

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Schemas** | 6 |
| **Tables (active)** | 62 |
| **Tables (legacy)** | 6 |
| **Views** | 9 |
| **Functions** | 4 |
| **Triggers** | 8 |
| **Sequences** | 17 |
| **Indexes** | 71 |
| **Foreign Keys** | 44 |
| **Check Constraints** | 21 |
| **Unique Constraints** | 6 |

---

**Version:** 2.1

**Status:** Current State Documentation
