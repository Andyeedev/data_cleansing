# 05_Service_Architecture.md

# Service Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document documents all 15 backend services, their interfaces, consumers, providers, and dependencies.

---

## 1. AuthService

### Purpose
Authenticate users via email/password, issue JWT tokens, and manage password hashing.

### Interface
| Method | Description |
|--------|-------------|
| `login(username, password)` | Authenticate user, return JWT token |
| `get_password_hash(password)` | Hash password with bcrypt |

### Consumers
- `app/api/routes/auth_routes.py:16` — `POST /api/v1/auth/login`

### Providers
- `app/db/connection.py:5` — PostgreSQL connection
- `app/api/core/auth/jwt_config.py` — JWT secret key

### Dependencies
- `jose` (JWT encoding)
- `passlib` (bcrypt hashing)
- PostgreSQL: `platform.users`

### Evidence
| Component | File Path |
|-----------|-----------|
| Auth service | `app/services/auth_service.py:11` |
| Auth routes | `app/api/routes/auth_routes.py:16` |

---

## 2. CredentialService

### Purpose
Manage database credentials with encryption, including create, update, delete, and link to systems.

### Interface
| Method | Description |
|--------|-------------|
| `create_credential(system_id, username, password)` | Create encrypted credential |
| `update_credential(credential_id, username, password)` | Update credential |
| `delete_credential(credential_id)` | Soft delete credential |
| `list_credentials()` | List all credentials |

### Consumers
- `app/api/routes/credential_routes.py:28` — CRUD endpoints
- `app/services/system_service.py:9` — system creation

### Providers
- `app/db/repositories/credential_repository.py` — data access
- `app/api/core/security/encryption.py` — encryption manager

### Dependencies
- PostgreSQL: `core.system_credentials`

### Evidence
| Component | File Path |
|-----------|-----------|
| Credential service | `app/services/credential_service.py:9` |
| Credential routes | `app/api/routes/credential_routes.py:28` |
| Credential repository | `app/db/repositories/credential_repository.py` |

---

## 3. SystemService

### Purpose
Manage migration system definitions (SOURCE/TARGET), including creation, listing, testing connections, and linking credentials.

### Interface
| Method | Description |
|--------|-------------|
| `create_system(payload)` | Create system definition |
| `list_systems()` | List all systems |
| `get_system(system_id)` | Get system details |
| `update_system(system_id, payload)` | Update system |
| `delete_system(system_id)` | Soft delete system |
| `test_connection(system_id)` | Test database connectivity |

### Consumers
- `app/api/routes/system_routes.py:31` — CRUD + test endpoints

### Providers
- `app/db/repositories/system_repository.py` — data access
- `app/services/credential_service.py` — credential management

### Dependencies
- PostgreSQL: `core.system_registry`

### Evidence
| Component | File Path |
|-----------|-----------|
| System service | `app/services/system_service.py:9` |
| System routes | `app/api/routes/system_routes.py:31` |
| System repository | `app/db/repositories/system_repository.py` |

---

## 4. ExecutionService

### Purpose
Trigger validation engine execution for a project, manage batch lifecycle, and return execution status.

### Interface
| Method | Description |
|--------|-------------|
| `run(project_id)` | Execute validation for project |
| `get_status(batch_id)` | Get batch execution status |

### Consumers
- `app/api/routes/execution_routes.py:9` — `POST /api/v1/execution/run`

### Providers
- `app/execution_engine.py:24` — core execution engine
- `app/db/connection.py:5` — database connection

### Dependencies
- `ExecutionEngine` — full validation pipeline

### Evidence
| Component | File Path |
|-----------|-----------|
| Execution service | `app/services/execution_service.py:6` |
| Execution routes | `app/api/routes/execution_routes.py:9` |
| Execution engine | `app/execution_engine.py:24` |

---

## 5. UserService

### Purpose
Manage platform users with CRUD operations, search, status filtering, and role assignment.

### Interface
| Method | Description |
|--------|-------------|
| `list_users(page, page_size, status, search)` | List users with filtering |
| `get_user(user_id)` | Get user details |
| `create_user(payload)` | Create user with password hash |
| `update_user(user_id, payload)` | Update user |
| `delete_user(user_id)` | Soft delete user |
| `assign_role(user_id, role_id)` | Assign role to user |
| `remove_role(user_id, role_id)` | Remove role from user |
| `get_user_roles(user_id)` | Get user roles |

### Consumers
- `app/api/routes/user_routes.py:37` — CRUD + role endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.users`, `platform.user_roles`

### Evidence
| Component | File Path |
|-----------|-----------|
| User service | `app/services/user_service.py:8` |
| User routes | `app/api/routes/user_routes.py:37` |

---

## 6. RoleService

### Purpose
Manage platform roles with CRUD operations, permission assignment, and system role protection.

### Interface
| Method | Description |
|--------|-------------|
| `list_roles(page, page_size, status)` | List roles with filtering |
| `get_role(role_id)` | Get role details |
| `create_role(payload)` | Create role |
| `update_role(role_id, payload)` | Update role |
| `delete_role(role_id)` | Delete role (non-system only) |
| `assign_permission(role_id, permission_id)` | Assign permission |
| `remove_permission(role_id, permission_id)` | Remove permission |
| `get_role_permissions(role_id)` | Get role permissions |
| `list_permissions()` | List all permissions |

### Consumers
- `app/api/routes/role_routes.py:31` — CRUD + permission endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.roles`, `platform.role_permissions`, `platform.permissions`

### Evidence
| Component | File Path |
|-----------|-----------|
| Role service | `app/services/role_service.py:5` |
| Role routes | `app/api/routes/role_routes.py:31` |

---

## 7. WorkflowService

### Purpose
Manage workflow definitions, instances, and execution with multi-tenant support.

### Interface
| Method | Description |
|--------|-------------|
| `list_workflows(page, page_size, type, status)` | List workflows |
| `get_workflow(workflow_id)` | Get workflow details |
| `create_workflow(payload)` | Create workflow |
| `update_workflow(workflow_id, payload)` | Update workflow |
| `delete_workflow(workflow_id)` | Soft delete workflow |
| `execute_workflow(workflow_id)` | Execute workflow |
| `list_instances(workflow_id)` | List workflow instances |
| `get_instance(instance_id)` | Get instance details |

### Consumers
- `app/api/routes/workflow_routes.py:35` — CRUD + execute endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.workflow_definitions`, `platform.workflow_instances`

### Evidence
| Component | File Path |
|-----------|-----------|
| Workflow service | `app/services/workflow_service.py:10` |
| Workflow routes | `app/api/routes/workflow_routes.py:35` |

---

## 8. TaskService

### Purpose
Manage tasks with CRUD operations, comments, user assignment, and priority tracking.

### Interface
| Method | Description |
|--------|-------------|
| `list_tasks(page, page_size, status, priority, assigned_to)` | List tasks |
| `get_task(task_id)` | Get task details |
| `create_task(payload)` | Create task |
| `update_task(task_id, payload)` | Update task |
| `delete_task(task_id)` | Soft delete task |
| `add_comment(task_id, payload)` | Add comment to task |
| `get_comments(task_id)` | Get task comments |
| `get_my_tasks(user_id)` | Get user's assigned tasks |

### Consumers
- `app/api/routes/task_routes.py:42` — CRUD + comment endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.tasks`, `platform.task_comments`

### Evidence
| Component | File Path |
|-----------|-----------|
| Task service | `app/services/task_service.py:10` |
| Task routes | `app/api/routes/task_routes.py:42` |

---

## 9. ApprovalService

### Purpose
Manage approval requests with CRUD operations, approve/reject actions, and pending count tracking.

### Interface
| Method | Description |
|--------|-------------|
| `list_approvals(page, page_size, status, assigned_to)` | List approvals |
| `get_approval(approval_id)` | Get approval details |
| `create_approval(payload)` | Create approval request |
| `approve(approval_id, user)` | Approve request |
| `reject(approval_id, user)` | Reject request |
| `get_pending_count(user_id)` | Count pending approvals |

### Consumers
- `app/api/routes/approval_routes.py:27` — CRUD + approve/reject endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.approval_requests`

### Evidence
| Component | File Path |
|-----------|-----------|
| Approval service | `app/services/approval_service.py:10` |
| Approval routes | `app/api/routes/approval_routes.py:27` |

---

## 10. CalendarService

### Purpose
Manage calendar events with CRUD operations, date range filtering, and upcoming event queries.

### Interface
| Method | Description |
|--------|-------------|
| `list_events(page, page_size, type, start_date, end_date)` | List events |
| `get_event(event_id)` | Get event details |
| `create_event(payload)` | Create event |
| `update_event(event_id, payload)` | Update event |
| `delete_event(event_id)` | Soft delete event |
| `get_upcoming(user_id)` | Get upcoming events |

### Consumers
- `app/api/routes/calendar_routes.py:38` — CRUD + upcoming endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.calendar_events`

### Evidence
| Component | File Path |
|-----------|-----------|
| Calendar service | `app/services/calendar_service.py:10` |
| Calendar routes | `app/api/routes/calendar_routes.py:38` |

---

## 11. NotificationService

### Purpose
Manage user notifications with CRUD operations, read/unread tracking, and preference management.

### Interface
| Method | Description |
|--------|-------------|
| `list_notifications(user_id, page, page_size, is_read, type)` | List notifications |
| `get_notification(notification_id)` | Get notification details |
| `create_notification(payload)` | Create notification |
| `mark_read(notification_id)` | Mark as read |
| `mark_all_read(user_id)` | Mark all as read |
| `delete_notification(notification_id)` | Delete notification |
| `get_unread_count(user_id)` | Count unread |
| `get_preferences(user_id)` | Get preferences |
| `update_preferences(user_id, prefs)` | Update preferences |

### Consumers
- `app/api/routes/notification_routes.py:24` — CRUD + preference endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.notifications`, `platform.notification_preferences`

### Evidence
| Component | File Path |
|-----------|-----------|
| Notification service | `app/services/notification_service.py:8` |
| Notification routes | `app/api/routes/notification_routes.py:24` |

---

## 12. SettingsService

### Purpose
Manage system settings with category-based organization, key-value storage, and feature flags.

### Interface
| Method | Description |
|--------|-------------|
| `list_settings(category)` | List settings |
| `get_category_settings(category)` | Get category settings |
| `get_setting(category, key)` | Get setting |
| `update_setting(category, key, value)` | Update setting |
| `list_feature_flags()` | List feature flags |
| `get_feature_flag(key)` | Get feature flag |
| `update_feature_flag(key, value)` | Update feature flag |

### Consumers
- `app/api/routes/settings_routes.py:23` — CRUD + flag endpoints

### Providers
- `app/db/connection.py:5` — database connection

### Dependencies
- PostgreSQL: `platform.system_settings`, `platform.feature_flags`

### Evidence
| Component | File Path |
|-----------|-----------|
| Settings service | `app/services/settings_service.py:5` |
| Settings routes | `app/api/routes/settings_routes.py:23` |

---

## 13. DatasetDiscoveryService

### Purpose
Discover and match source/target tables, create dataset mappings, and infer column roles.

### Interface
| Method | Description |
|--------|-------------|
| `discover()` | Run full discovery process |

### Consumers
- `app/main.py:62` — CLI `discover` command
- `app/scripts/run_validation.py`

### Providers
- `app/db_connector.py` — database connectivity
- `app/services/metadata_intelligence_service.py` — column role inference

### Dependencies
- PostgreSQL: `core.system_registry`, `core.dataset_mappings`, `core.dataset_columns`

### Evidence
| Component | File Path |
|-----------|-----------|
| Dataset discovery service | `app/services/dataset_discovery_service.py:4` |
| Metadata intelligence | `app/services/metadata_intelligence_service.py:1` |

---

## 14. MetadataIntelligenceService

### Purpose
Infer column roles (PRIMARY_KEY, NUMERIC_METRIC, AUDIT_COLUMN) based on naming patterns and data types.

### Interface
| Method | Description |
|--------|-------------|
| `infer_column_roles(mapping_id)` | Infer roles for mapping columns |

### Consumers
- `app/services/dataset_discovery_service.py:4` — during discovery
- `app/discovery/auto_rule_discovery.py` — during rule generation

### Providers
- PostgreSQL: `core.dataset_columns`

### Dependencies
- None (standalone service)

### Evidence
| Component | File Path |
|-----------|-----------|
| Metadata intelligence service | `app/services/metadata_intelligence_service.py:1` |

---

## 15. AuditPackService

### Purpose
Generate CSV audit packs for compliance, extracting execution data for a given batch.

### Interface
| Method | Description |
|--------|-------------|
| `generate(engine_db, batch_id)` | Generate CSV audit pack |

### Consumers
- `app/main.py:25` — CLI `export` command
- `app/audit_export.py` — audit exporter

### Providers
- PostgreSQL: `engine.migration_control_execution`

### Dependencies
- Python `csv` module

### Evidence
| Component | File Path |
|-----------|-----------|
| Audit pack service | `app/services/audit_pack_service.py:4` |
| Audit exporter | `app/audit_export.py` |

---

## Service Dependency Matrix

| Service | Depends On |
|---------|------------|
| AuthService | JWT config, PostgreSQL |
| CredentialService | EncryptionManager, CredentialRepository |
| SystemService | SystemRepository, CredentialService |
| ExecutionService | ExecutionEngine |
| UserService | PostgreSQL |
| RoleService | PostgreSQL |
| WorkflowService | PostgreSQL |
| TaskService | PostgreSQL |
| ApprovalService | PostgreSQL |
| CalendarService | PostgreSQL |
| NotificationService | PostgreSQL |
| SettingsService | PostgreSQL |
| DatasetDiscoveryService | DBConnector, MetadataIntelligenceService |
| MetadataIntelligenceService | PostgreSQL |
| AuditPackService | PostgreSQL |

---

## Summary

| # | Service | File | Consumers |
|---|---------|------|-----------|
| 1 | AuthService | `app/services/auth_service.py:11` | auth_routes |
| 2 | CredentialService | `app/services/credential_service.py:9` | credential_routes |
| 3 | SystemService | `app/services/system_service.py:9` | system_routes |
| 4 | ExecutionService | `app/services/execution_service.py:6` | execution_routes |
| 5 | UserService | `app/services/user_service.py:8` | user_routes |
| 6 | RoleService | `app/services/role_service.py:5` | role_routes |
| 7 | WorkflowService | `app/services/workflow_service.py:10` | workflow_routes |
| 8 | TaskService | `app/services/task_service.py:10` | task_routes |
| 9 | ApprovalService | `app/services/approval_service.py:10` | approval_routes |
| 10 | CalendarService | `app/services/calendar_service.py:10` | calendar_routes |
| 11 | NotificationService | `app/services/notification_service.py:8` | notification_routes |
| 12 | SettingsService | `app/services/settings_service.py:5` | settings_routes |
| 13 | DatasetDiscoveryService | `app/services/dataset_discovery_service.py:4` | CLI |
| 14 | MetadataIntelligenceService | `app/services/metadata_intelligence_service.py:1` | DatasetDiscoveryService |
| 15 | AuditPackService | `app/services/audit_pack_service.py:4` | CLI |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 35+*
