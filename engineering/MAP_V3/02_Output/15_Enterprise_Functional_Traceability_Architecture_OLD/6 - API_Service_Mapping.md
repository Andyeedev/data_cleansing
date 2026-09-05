# API Endpoint to Service Mapping

Complete mapping of all API endpoints to their backing services and database tables.

---

## 1. Health Checks (`/health`, `/api/v1/health`, `/api/v1/ready`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /health | inline | none | No | public |
| GET | /api/v1/health | inline | none | No | public |
| GET | /api/v1/ready | inline | core.system_registry (DB ping) | No | public |

---

## 2. Auth (`/api/v1/auth`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| POST | /api/v1/auth/login | AuthService | platform.users | No | public |

---

## 3. Systems (`/api/v1/systems`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/systems/ | SystemService | core.system_registry | Yes | systems:read |
| GET | /api/v1/systems/{id} | SystemService | core.system_registry | Yes | systems:read |
| POST | /api/v1/systems/ | SystemService | core.system_registry | Yes | systems:write |
| GET | /api/v1/systems/{id}/test | SystemService | core.system_registry, core.system_credentials | Yes | systems:test |

---

## 4. Credentials (`/api/v1/credentials`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/credentials/ | CredentialService | core.system_credentials | Yes | credentials:read |
| POST | /api/v1/credentials/ | CredentialService | core.system_credentials, core.system_registry | Yes | credentials:write |
| PUT | /api/v1/credentials/{id} | CredentialService | core.system_credentials | Yes | credentials:write |
| DELETE | /api/v1/credentials/{id} | CredentialService | core.system_credentials | Yes | credentials:delete |

---

## 5. Execution (`/api/v1/execution`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| POST | /api/v1/execution/run | ExecutionService | engine.migration_batch_registry (via ExecutionEngine) | Yes | execution:run |
| GET | /api/v1/execution/status/{batch_id} | ExecutionService | engine.migration_batch_registry | Yes | execution:read |

---

## 6. Users (`/api/v1/users`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/users/ | UserService | platform.users | Yes | users:read |
| GET | /api/v1/users/{id} | UserService | platform.users | Yes | users:read |
| POST | /api/v1/users/ | UserService | platform.users | Yes | users:write |
| PUT | /api/v1/users/{id} | UserService | platform.users | Yes | users:write |
| DELETE | /api/v1/users/{id} | UserService | platform.users (soft delete) | Yes | users:delete |
| POST | /api/v1/users/{id}/roles | UserService | platform.user_roles | Yes | users:manage_roles |
| DELETE | /api/v1/users/{id}/roles/{role_id} | UserService | platform.user_roles | Yes | users:manage_roles |
| GET | /api/v1/users/{id}/roles | UserService | platform.user_roles, platform.roles | Yes | users:read |

---

## 7. Roles (`/api/v1/roles`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/roles/ | RoleService | platform.roles | Yes | roles:read |
| GET | /api/v1/roles/{id} | RoleService | platform.roles | Yes | roles:read |
| POST | /api/v1/roles/ | RoleService | platform.roles | Yes | roles:write |
| PUT | /api/v1/roles/{id} | RoleService | platform.roles | Yes | roles:write |
| DELETE | /api/v1/roles/{id} | RoleService | platform.roles (soft delete) | Yes | roles:delete |
| POST | /api/v1/roles/{id}/permissions | RoleService | platform.role_permissions | Yes | roles:manage_permissions |
| DELETE | /api/v1/roles/{id}/permissions/{perm_id} | RoleService | platform.role_permissions | Yes | roles:manage_permissions |
| GET | /api/v1/roles/{id}/permissions | RoleService | platform.role_permissions, platform.permissions | Yes | roles:read |
| GET | /api/v1/roles/permissions/list | RoleService | platform.permissions | Yes | roles:read |

---

## 8. Workflows (`/api/v1/workflows`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/workflows/ | WorkflowService | platform.workflow_definitions | Yes | workflows:read |
| GET | /api/v1/workflows/{id} | WorkflowService | platform.workflow_definitions | Yes | workflows:read |
| POST | /api/v1/workflows/ | WorkflowService | platform.workflow_definitions | Yes | workflows:write |
| PUT | /api/v1/workflows/{id} | WorkflowService | platform.workflow_definitions | Yes | workflows:write |
| DELETE | /api/v1/workflows/{id} | WorkflowService | platform.workflow_definitions (soft delete) | Yes | workflows:delete |
| POST | /api/v1/workflows/{id}/execute | WorkflowService | platform.workflow_instances, platform.workflow_history | Yes | workflows:execute |
| GET | /api/v1/workflows/{id}/instances | WorkflowService | platform.workflow_instances | Yes | workflows:read |
| GET | /api/v1/workflows/instances/{id} | WorkflowService | platform.workflow_instances | Yes | workflows:read |

---

## 9. Tasks (`/api/v1/tasks`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/tasks/ | TaskService | platform.tasks | Yes | tasks:read |
| GET | /api/v1/tasks/{id} | TaskService | platform.tasks | Yes | tasks:read |
| POST | /api/v1/tasks/ | TaskService | platform.tasks | Yes | tasks:write |
| PUT | /api/v1/tasks/{id} | TaskService | platform.tasks | Yes | tasks:write |
| DELETE | /api/v1/tasks/{id} | TaskService | platform.tasks (soft delete) | Yes | tasks:delete |
| POST | /api/v1/tasks/{id}/comments | TaskService | platform.task_comments | Yes | tasks:comment |
| GET | /api/v1/tasks/{id}/comments | TaskService | platform.task_comments | Yes | tasks:read |
| GET | /api/v1/tasks/my/list | TaskService | platform.tasks (filtered by user) | Yes | tasks:read |

---

## 10. Notifications (`/api/v1/notifications`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/notifications/ | NotificationService | platform.notifications | Yes | notifications:read |
| GET | /api/v1/notifications/{id} | NotificationService | platform.notifications | Yes | notifications:read |
| PUT | /api/v1/notifications/{id}/read | NotificationService | platform.notifications | Yes | notifications:write |
| PUT | /api/v1/notifications/read-all | NotificationService | platform.notifications | Yes | notifications:write |
| DELETE | /api/v1/notifications/{id} | NotificationService | platform.notifications (hard delete) | Yes | notifications:delete |
| GET | /api/v1/notifications/unread/count | NotificationService | platform.notifications | Yes | notifications:read |
| GET | /api/v1/notifications/preferences/list | NotificationService | platform.notification_preferences | Yes | notifications:read_preferences |
| PUT | /api/v1/notifications/preferences | NotificationService | platform.notification_preferences | Yes | notifications:write_preferences |

---

## 11. Calendar (`/api/v1/calendar`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/calendar/events | CalendarService | platform.calendar_events | Yes | calendar:read |
| GET | /api/v1/calendar/events/{id} | CalendarService | platform.calendar_events | Yes | calendar:read |
| POST | /api/v1/calendar/events | CalendarService | platform.calendar_events | Yes | calendar:write |
| PUT | /api/v1/calendar/events/{id} | CalendarService | platform.calendar_events | Yes | calendar:write |
| DELETE | /api/v1/calendar/events/{id} | CalendarService | platform.calendar_events (soft delete) | Yes | calendar:delete |
| GET | /api/v1/calendar/events/upcoming/list | CalendarService | platform.calendar_events | Yes | calendar:read |

---

## 12. Approvals (`/api/v1/approvals`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/approvals/ | ApprovalService | platform.approval_requests | Yes | approvals:read |
| GET | /api/v1/approvals/pending/count | ApprovalService | platform.approval_requests | Yes | approvals:read |
| GET | /api/v1/approvals/{id} | ApprovalService | platform.approval_requests | Yes | approvals:read |
| POST | /api/v1/approvals/ | ApprovalService | platform.approval_requests | Yes | approvals:create |
| PUT | /api/v1/approvals/{id}/approve | ApprovalService | platform.approval_requests | Yes | approvals:approve |
| PUT | /api/v1/approvals/{id}/reject | ApprovalService | platform.approval_requests | Yes | approvals:reject |

---

## 13. Settings (`/api/v1/settings`)

| Method | Path | Service | Database Table | Auth Required | RBAC Permission |
|--------|------|---------|----------------|---------------|-----------------|
| GET | /api/v1/settings/ | SettingsService | platform.system_settings | Yes | settings:read |
| GET | /api/v1/settings/{category} | SettingsService | platform.system_settings | Yes | settings:read |
| GET | /api/v1/settings/{category}/{key} | SettingsService | platform.system_settings | Yes | settings:read |
| PUT | /api/v1/settings/{category}/{key} | SettingsService | platform.system_settings | Yes | settings:write |
| GET | /api/v1/settings/flags/list | SettingsService | platform.feature_flags | Yes | settings:read |

---

## Summary

| Route Group | Endpoint Count | Primary Service | Primary Schema |
|-------------|----------------|-----------------|----------------|
| Health Checks | 3 | inline | core |
| Auth | 1 | AuthService | platform |
| Systems | 4 | SystemService | core |
| Credentials | 4 | CredentialService | core |
| Execution | 2 | ExecutionService | engine |
| Users | 8 | UserService | platform |
| Roles | 9 | RoleService | platform |
| Workflows | 8 | WorkflowService | platform |
| Tasks | 8 | TaskService | platform |
| Notifications | 8 | NotificationService | platform |
| Calendar | 6 | CalendarService | platform |
| Approvals | 6 | ApprovalService | platform |
| Settings | 5 | SettingsService | platform |
| **Total** | **72** | | |
