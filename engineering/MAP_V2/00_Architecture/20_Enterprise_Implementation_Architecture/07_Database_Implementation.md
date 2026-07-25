# 07 — Database Implementation

## Schemas

The `migration_engine` database uses five schemas:

| Schema | Purpose | Creation Script |
|--------|---------|----------------|
| `core` | Tenant and project management | Cross-schema FK references in `create_platform_schema.sql` |
| `engine` | Validation engine metadata and execution | `sql/schema/01_engine_schema.sql`, `sql/schema/01_engine_schema_20260217.sql` |
| `platform` | Enterprise platform tables | `MAP_V2/03_Source/database/create_platform_schema.sql` |
| `audit` | Append-only audit and security logging | `MAP_V2/03_Source/database/create_audit_schema.sql` |
| `reporting` | Reporting views and dashboards | `sql/schema/02_views.sql`, `sql/views/` |

## Physical Organisation — engine Schema

### Tables

| Table | Source File | Purpose |
|-------|-----------|---------|
| `engine.control_registry` | `sql/schema/01_engine_schema.sql:6-13` | Control definitions (C01-C10) |
| `engine.rule_registry` | `sql/schema/01_engine_schema.sql:19-27` | Rule-to-SQL template mapping |
| `engine.rule_parameter_metadata` | `sql/schema/01_engine_schema.sql:38-51` | Entity mapping (source/target pairs) |
| `engine.migration_validation_batch` | `sql/schema/01_engine_schema_20260217.sql:3-9` | Batch execution records |
| `engine.migration_control_execution` | `sql/schema/01_engine_schema_20260217.sql:11-20` | Control execution results |
| `engine.migration_exception_register` | `sql/schema/01_engine_schema_20260217.sql:22-34` | Failure exception records |
| `engine.migration_control_summary` | `sql/schema/01_engine_schema.sql:145-155` | Control-level aggregation |
| `engine.migration_batch_registry` | `app/execution_engine.py:1093-1123` | Batch lifecycle tracking |
| `engine.migration_batch_summary` | `app/execution_engine.py:681-697` | Batch-level aggregation |
| `engine.migration_release_decision` | `app/execution_engine.py:758-774` | Release gate decisions |
| `engine.migration_governance_status` | `app/execution_engine.py:864-876` | Governance status per batch |
| `engine.batch_execution_checkpoint` | `app/execution_engine.py:884-899` | DAG execution checkpoints |

### Views

| View | Source File | Purpose |
|------|-----------|---------|
| `engine.v_migration_control_summary` | `sql/schema/02_views.sql:5-17` | Control-level score aggregation |
| `engine.v_migration_executive_summary` | `sql/schema/02_views.sql:24-39` | Batch-level executive summary |
| `engine.v_migration_exception_detail` | `sql/schema/02_views.sql:46-54` | Exception drill-down |

## Physical Organisation — platform Schema

| Table | Source File | Purpose |
|-------|-----------|---------|
| `platform.users` | `create_platform_schema.sql:12-38` | User accounts |
| `platform.refresh_tokens` | `create_platform_schema.sql:44-53` | JWT refresh tokens |
| `platform.user_sessions` | `create_platform_schema.sql:57-67` | Active sessions |
| `platform.roles` | `create_platform_schema.sql:75-93` | Role definitions |
| `platform.permissions` | `create_platform_schema.sql:99-108` | Permission definitions |
| `platform.role_permissions` | `create_platform_schema.sql:113-120` | Role-permission junction |
| `platform.user_roles` | `create_platform_schema.sql:122-130` | User-role junction |
| `platform.workflow_definitions` | `create_platform_schema.sql:139-158` | Workflow templates |
| `platform.workflow_instances` | `create_platform_schema.sql:164-181` | Running workflow instances |
| `platform.workflow_step_instances` | `create_platform_schema.sql:186-200` | Workflow steps |
| `platform.workflow_history` | `create_platform_schema.sql:204-216` | Workflow audit trail |
| `platform.approval_templates` | `create_platform_schema.sql:222-232` | Approval templates |
| `platform.approval_requests` | `create_platform_schema.sql:234-251` | Approval requests |
| `platform.approval_step_instances` | `create_platform_schema.sql:256-266` | Approval steps |
| `platform.tasks` | `create_platform_schema.sql:274-298` | Task management |
| `platform.task_comments` | `create_platform_schema.sql:305-313` | Task comments |
| `platform.task_dependencies` | `create_platform_schema.sql:317-324` | Task dependency graph |
| `platform.notifications` | `create_platform_schema.sql:330-347` | User notifications |
| `platform.notification_preferences` | `create_platform_schema.sql:349-359` | Notification prefs |
| `platform.calendar_events` | `create_platform_schema.sql:365-388` | Calendar events |
| `platform.calendar_event_reminders` | `create_platform_schema.sql:395-404` | Event reminders |
| `platform.system_settings` | `create_platform_schema.sql:412-427` | Key-value settings |
| `platform.feature_flags` | `create_platform_schema.sql:431-444` | Feature flag registry |

## Physical Organisation — audit Schema

| Table | Source File | Purpose |
|-------|-----------|---------|
| `audit.audit_events` | `create_audit_schema.sql:13-34` | General audit trail |
| `audit.security_events` | `create_audit_schema.sql:47-74` | Security event log |
| `audit.login_history` | `create_audit_schema.sql:85-98` | Login attempt history |
| `audit.api_logs` | `create_audit_schema.sql:108-127` | HTTP request/response logs |
| `audit.configuration_history` | `create_audit_schema.sql:139-151` | Settings change history |

## Naming Conventions

| Convention | Example | Applied To |
|------------|---------|-----------|
| `snake_case` tables | `migration_control_execution` | All tables |
| `snake_case` columns | `control_id`, `enabled_flag` | All columns |
| UUID primary keys | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` | platform, audit tables |
| VARCHAR PKs | `control_id VARCHAR(10) PRIMARY KEY` | engine tables |
| `idx_{table}_{column}` | `idx_platform_users_email` | All indexes |
| `v_{description}` | `v_migration_control_summary` | All views |

## Indexes

### platform Schema (selected)

| Index | Table | Column(s) |
|-------|-------|----------|
| `idx_platform_users_email` | `users` | `email` |
| `idx_platform_users_status` | `users` | `status` |
| `idx_platform_users_tenant_id` | `users` | `tenant_id` |
| `idx_platform_roles_tenant_id` | `roles` | `tenant_id` |
| `idx_platform_tasks_assigned_to` | `tasks` | `assigned_to` |
| `idx_platform_tasks_status` | `tasks` | `status` |
| `idx_platform_notifications_user_id` | `notifications` | `user_id` |
| `idx_platform_feature_flags_key` | `feature_flags` | `key` |

### audit Schema (selected)

| Index | Table | Column(s) |
|-------|-------|----------|
| `idx_audit_events_timestamp` | `audit_events` | `timestamp DESC` |
| `idx_audit_events_user_id` | `audit_events` | `user_id` |
| `idx_audit_security_events_event_type` | `security_events` | `event_type` |
| `idx_audit_api_logs_path` | `api_logs` | `path` |
| `idx_audit_login_history_login_at` | `login_history` | `login_at DESC` |

## Constraints

### CHECK Constraints

| Table | Column | Constraint |
|-------|--------|-----------|
| `platform.users` | `status` | `IN ('active','inactive','suspended','pending','locked')` |
| `platform.roles` | `type` | `IN ('system','custom','template')` |
| `platform.tasks` | `status` | `IN ('todo','in_progress','review','done','blocked','cancelled')` |
| `platform.tasks` | `priority` | `IN ('critical','high','medium','low')` |
| `platform.tasks` | `completion_percentage` | `>= 0 AND <= 100` |
| `audit.audit_events` | `status` | `IN ('success','failure','error')` |
| `audit.security_events` | `severity` | `IN ('info','warning','critical')` |
| `audit.login_history` | `status` | `IN ('success','failure','locked','blocked')` |

### UNIQUE Constraints

| Table | Columns |
|-------|---------|
| `platform.users` | `email` |
| `platform.refresh_tokens` | `token_hash` |
| `platform.user_sessions` | `session_token` |
| `platform.permissions` | `name` |
| `platform.role_permissions` | `(role_id, permission_id)` |
| `platform.user_roles` | `(user_id, role_id)` |
| `platform.system_settings` | `(category, key)` |
| `platform.feature_flags` | `key` |
| `platform.notification_preferences` | `(user_id, type, channel)` |
| `platform.task_dependencies` | `(task_id, depends_on_id)` |

### Foreign Key Constraints (Cross-Schema)

Defined in `create_platform_schema.sql:447-462`:

| Source Table | FK | Target |
|-------------|-----|--------|
| `platform.users` | `tenant_id` | `core.tenants(tenant_id)` |
| `platform.roles` | `tenant_id` | `core.tenants(tenant_id)` |
| `platform.tasks` | `tenant_id` | `core.tenants(tenant_id)` |
| `platform.tasks` | `project_id` | `core.projects(project_id)` |
| `platform.workflow_definitions` | `tenant_id` | `core.tenants(tenant_id)` |
| `platform.workflow_instances` | `tenant_id` | `core.tenants(tenant_id)` |
| `platform.approval_requests` | `tenant_id` | `core.tenants(tenant_id)` |
| `platform.calendar_events` | `tenant_id` | `core.tenants(tenant_id)` |
| `platform.calendar_events` | `project_id` | `core.projects(project_id)` |

## Functions

Referenced in execution engine (`app/execution_engine.py:718`):

```sql
SELECT * FROM engine.run_governance_intelligence(%s)
```

This function evaluates anomaly scores and auto-blocking decisions per batch.

## Sequences

- `engine.rule_parameter_metadata_id_seq` — auto-increment for `rule_parameter_metadata.id` (`SERIAL PRIMARY KEY`)
- `engine.migration_control_summary_id_seq` — auto-increment for `migration_control_summary.id` (`SERIAL PRIMARY KEY`)

All platform and audit tables use `UUID PRIMARY KEY DEFAULT gen_random_uuid()` and do not require sequences.
