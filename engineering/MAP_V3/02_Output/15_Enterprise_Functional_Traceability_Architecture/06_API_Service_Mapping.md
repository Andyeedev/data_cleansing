# API Service Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  
**Backend:** FastAPI (app/api/)  

---

## 1. Summary

| Metric | Value |
|--------|-------|
| Total Endpoints | 72+ |
| Route Groups | 12 |
| Auth Required | 69 (96%) |
| RBAC Enforced | 31 (43%) |
| Public Endpoints | 3 (health checks) |

---

## 2. Middleware Stack

| # | Middleware | Purpose |
|---|-----------|---------|
| 1 | CORSMiddleware | Allows localhost:5173, localhost:3000 |
| 2 | AuditLoggingMiddleware | Logs every HTTP request (user, path, status, duration) |
| 3 | Request Timing Middleware | Adds X-Response-Time header |
| 4 | SlowAPI Rate Limiter | Global rate limiting |

---

## 3. Endpoint Inventory by Route Group

### GROUP 1: Health Checks (3 endpoints)

| Method | Path | Auth | Rate Limit | Response |
|--------|------|------|------------|----------|
| GET | /health | No | Exempt | `{"status": "healthy", "version": "2.0.0"}` |
| GET | /api/v1/health | No | Exempt | `{"status": "healthy", "version": "2.0.0"}` |
| GET | /api/v1/ready | No | Exempt | `{"status": "ready", "checks": {"database": true}}` |

---

### GROUP 2: Auth (1 endpoint)

| Method | Path | Auth | Rate Limit | Service | Table |
|--------|------|------|------------|---------|-------|
| POST | /api/v1/auth/login | No | 5/minute | AuthService | platform.users |

**Request:** `{"username": str, "password": str}`  
**Response:** `{"access_token": "<jwt>", "token_type": "bearer"}`

---

### GROUP 3: Systems (4 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/systems/ | Yes | — | SystemService | core.system_registry |
| GET | /api/v1/systems/{system_id} | Yes | — | SystemService | core.system_registry |
| POST | /api/v1/systems/ | Yes | — | SystemService | core.system_registry |
| GET | /api/v1/systems/{system_id}/test | Yes | — | SystemService | core.system_registry, core.system_credentials |

---

### GROUP 4: Credentials (4 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/credentials/ | Yes | — | CredentialService | core.system_credentials |
| POST | /api/v1/credentials/ | Yes | — | CredentialService | core.system_credentials, core.system_registry |
| PUT | /api/v1/credentials/{credential_id} | Yes | — | CredentialService | core.system_credentials |
| DELETE | /api/v1/credentials/{credential_id} | Yes | — | CredentialService | core.system_credentials |

**Note:** Passwords encrypted via Fernet (EncryptionManager) before storage.

---

### GROUP 5: Execution (2 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| POST | /api/v1/execution/run | Yes | — | ExecutionService | engine.migration_batch_registry |
| GET | /api/v1/execution/status/{batch_id} | Yes | — | ExecutionService | engine.migration_batch_registry |

**Request:** `project_id` (query param)  
**Response:** `{"batch_id": "<uuid>", "status_url": "/execution/status/{batch_id}"}`  
**Note:** Execution runs in background via BackgroundTasks.

---

### GROUP 6: Users (8 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/users/ | Yes | — | UserService | platform.users |
| GET | /api/v1/users/{user_id} | Yes | — | UserService | platform.users |
| POST | /api/v1/users/ | Yes | — | UserService | platform.users |
| PUT | /api/v1/users/{user_id} | Yes | — | UserService | platform.users |
| DELETE | /api/v1/users/{user_id} | Yes | — | UserService | platform.users |
| POST | /api/v1/users/{user_id}/roles | Yes | — | UserService | platform.user_roles |
| DELETE | /api/v1/users/{user_id}/roles/{role_id} | Yes | — | UserService | platform.user_roles |
| GET | /api/v1/users/{user_id}/roles | Yes | — | UserService | platform.user_roles, platform.roles |

**Note:** DELETE performs soft delete (sets deleted_at).

---

### GROUP 7: Roles (9 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/roles/ | Yes | — | RoleService | platform.roles |
| GET | /api/v1/roles/{role_id} | Yes | — | RoleService | platform.roles |
| POST | /api/v1/roles/ | Yes | — | RoleService | platform.roles |
| PUT | /api/v1/roles/{role_id} | Yes | — | RoleService | platform.roles |
| DELETE | /api/v1/roles/{role_id} | Yes | — | RoleService | platform.roles |
| POST | /api/v1/roles/{role_id}/permissions | Yes | — | RoleService | platform.role_permissions |
| DELETE | /api/v1/roles/{role_id}/permissions/{permission_id} | Yes | — | RoleService | platform.role_permissions |
| GET | /api/v1/roles/{role_id}/permissions | Yes | — | RoleService | platform.role_permissions, platform.permissions |
| GET | /api/v1/roles/permissions/list | Yes | — | RoleService | platform.permissions |

**Note:** System roles (is_system=TRUE) cannot be deleted.

---

### GROUP 8: Workflows (8 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/workflows/ | Yes | workflows:read | WorkflowService | platform.workflow_definitions |
| GET | /api/v1/workflows/{workflow_id} | Yes | workflows:read | WorkflowService | platform.workflow_definitions |
| POST | /api/v1/workflows/ | Yes | workflows:create | WorkflowService | platform.workflow_definitions |
| PUT | /api/v1/workflows/{workflow_id} | Yes | workflows:update | WorkflowService | platform.workflow_definitions |
| DELETE | /api/v1/workflows/{workflow_id} | Yes | workflows:delete | WorkflowService | platform.workflow_definitions |
| POST | /api/v1/workflows/{workflow_id}/execute | Yes | workflows:execute | WorkflowService | platform.workflow_instances, platform.workflow_history |
| GET | /api/v1/workflows/{workflow_id}/instances | Yes | workflows:read | WorkflowService | platform.workflow_instances |
| GET | /api/v1/workflows/instances/{instance_id} | Yes | workflows:read | WorkflowService | platform.workflow_instances |

---

### GROUP 9: Tasks (8 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/tasks/ | Yes | tasks:read | TaskService | platform.tasks |
| GET | /api/v1/tasks/{task_id} | Yes | tasks:read | TaskService | platform.tasks |
| POST | /api/v1/tasks/ | Yes | tasks:create | TaskService | platform.tasks |
| PUT | /api/v1/tasks/{task_id} | Yes | tasks:update | TaskService | platform.tasks |
| DELETE | /api/v1/tasks/{task_id} | Yes | tasks:delete | TaskService | platform.tasks |
| POST | /api/v1/tasks/{task_id}/comments | Yes | tasks:update | TaskService | platform.task_comments |
| GET | /api/v1/tasks/{task_id}/comments | Yes | tasks:read | TaskService | platform.task_comments |
| GET | /api/v1/tasks/my/list | Yes | tasks:read | TaskService | platform.tasks |

**Note:** GET /my/list filters tasks to authenticated user only.

---

### GROUP 10: Notifications (8 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/notifications/ | Yes | tasks:read | NotificationService | platform.notifications |
| GET | /api/v1/notifications/{notification_id} | Yes | tasks:read | NotificationService | platform.notifications |
| PUT | /api/v1/notifications/{notification_id}/read | Yes | tasks:update | NotificationService | platform.notifications |
| PUT | /api/v1/notifications/read-all | Yes | tasks:update | NotificationService | platform.notifications |
| DELETE | /api/v1/notifications/{notification_id} | Yes | tasks:delete | NotificationService | platform.notifications |
| GET | /api/v1/notifications/unread/count | Yes | tasks:read | NotificationService | platform.notifications |
| GET | /api/v1/notifications/preferences/list | Yes | tasks:read | NotificationService | platform.notification_preferences |
| PUT | /api/v1/notifications/preferences | Yes | tasks:update | NotificationService | platform.notification_preferences |

**Note:** DELETE performs hard delete on notifications.

---

### GROUP 11: Calendar (6 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/calendar/events | Yes | calendar:read | CalendarService | platform.calendar_events |
| GET | /api/v1/calendar/events/{event_id} | Yes | calendar:read | CalendarService | platform.calendar_events |
| POST | /api/v1/calendar/events | Yes | calendar:create | CalendarService | platform.calendar_events |
| PUT | /api/v1/calendar/events/{event_id} | Yes | calendar:update | CalendarService | platform.calendar_events |
| DELETE | /api/v1/calendar/events/{event_id} | Yes | calendar:delete | CalendarService | platform.calendar_events |
| GET | /api/v1/calendar/events/upcoming/list | Yes | calendar:read | CalendarService | platform.calendar_events |

**Note:** GET /upcoming/list accepts `days` param (1-90, default 7).

---

### GROUP 12: Approvals (6 endpoints)

| Method | Path | Auth | RBAC | Service | Table |
|--------|------|------|------|---------|-------|
| GET | /api/v1/approvals/ | Yes | approvals:read | ApprovalService | platform.approval_requests |
| GET | /api/v1/approvals/pending/count | Yes | approvals:read | ApprovalService | platform.approval_requests |
| GET | /api/v1/approvals/{approval_id} | Yes | approvals:read | ApprovalService | platform.approval_requests |
| POST | /api/v1/approvals/ | Yes | approvals:create | ApprovalService | platform.approval_requests |
| PUT | /api/v1/approvals/{approval_id}/approve | Yes | approvals:approve | ApprovalService | platform.approval_requests |
| PUT | /api/v1/approvals/{approval_id}/reject | Yes | approvals:reject | ApprovalService | platform.approval_requests |

---

### GROUP 13: Settings (5 endpoints)

| Method | Path | Auth | Service | Table |
|--------|------|------|---------|-------|
| GET | /api/v1/settings/ | Yes | SettingsService | platform.system_settings |
| GET | /api/v1/settings/{category} | Yes | SettingsService | platform.system_settings |
| GET | /api/v1/settings/{category}/{key} | Yes | SettingsService | platform.system_settings |
| PUT | /api/v1/settings/{category}/{key} | Yes | SettingsService | platform.system_settings |
| GET | /api/v1/settings/flags/list | Yes | SettingsService | platform.feature_flags |

---

## 4. API Response Format

All responses wrapped in standard format via `app/api/helpers.py`:

```json
{
  "success": true,
  "data": { ... }
}
```

Error format:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 5. Authentication Flow

1. User sends `POST /api/v1/auth/login` with `{"username", "password"}`
2. AuthService queries `platform.users` for email match
3. Password verified via bcrypt (passlib)
4. JWT token generated with `sub=user_id`, `tenant_id`, `permissions`
5. Token returned as `{"access_token": "<jwt>", "token_type": "bearer"}`
6. Subsequent requests include `Authorization: Bearer <token>` header
7. `get_current_user()` dependency decodes JWT
8. `require_permissions()` dependency checks RBAC
9. `get_current_user_with_tenant()` dependency validates tenant_id

---

*This mapping is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
