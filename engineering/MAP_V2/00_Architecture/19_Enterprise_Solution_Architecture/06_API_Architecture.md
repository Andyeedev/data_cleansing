# 06_API_Architecture.md

# API Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document documents the REST API structure, routers, endpoints, middleware, authentication, and authorization.

---

## API Structure

### Base Configuration
- **Framework**: FastAPI (`app/api/main.py:33`)
- **Title**: "Migration Validation SaaS"
- **Base URL**: `/api/v1/`
- **OpenAPI**: Custom schema with JWT Bearer auth

### Routers Registered
| # | Router | Prefix | File |
|---|--------|--------|------|
| 1 | auth_routes | `/api/v1/auth` | `app/api/routes/auth_routes.py` |
| 2 | credential_routes | `/api/v1/credentials` | `app/api/routes/credential_routes.py` |
| 3 | system_routes | `/api/v1/systems` | `app/api/routes/system_routes.py` |
| 4 | execution_routes | `/api/v1/execution` | `app/api/routes/execution_routes.py` |
| 5 | user_routes | `/api/v1/users` | `app/api/routes/user_routes.py` |
| 6 | role_routes | `/api/v1/roles` | `app/api/routes/role_routes.py` |
| 7 | workflow_routes | `/api/v1/workflows` | `app/api/routes/workflow_routes.py` |
| 8 | task_routes | `/api/v1/tasks` | `app/api/routes/task_routes.py` |
| 9 | approval_routes | `/api/v1/approvals` | `app/api/routes/approval_routes.py` |
| 10 | calendar_routes | `/api/v1/calendar` | `app/api/routes/calendar_routes.py` |
| 11 | notification_routes | `api/v1/notifications` | `app/api/routes/notification_routes.py` |
| 12 | settings_routes | `/api/v1/settings` | `app/api/routes/settings_routes.py` |

---

## Middleware

### CORS Middleware
- **File**: `app/api/main.py:41`
- **Origins**: `http://localhost:5173`, `http://localhost:3000`
- **Methods**: All
- **Headers**: All
- **Credentials**: True

### Audit Logging Middleware
- **File**: `app/api/core/middleware/audit_middleware.py:9`
- **Purpose**: Log all HTTP requests with user, status, duration
- **Extracts**: User ID from JWT token in Authorization header

### Request Timing Middleware
- **File**: `app/api/main.py:60`
- **Purpose**: Add `X-Response-Time` header to all responses
- **Format**: `{duration}ms`

### Rate Limiting
- **File**: `app/api/main.py:31`
- **Library**: slowapi
- **Key**: Remote IP address
- **Exempt**: Health check endpoints

---

## Authentication

### JWT Bearer Authentication
- **Token location**: `Authorization: Bearer {token}`
- **Token creation**: `app/api/core/auth/jwt_handler.py:6`
- **Token decoding**: `app/api/core/auth/jwt_handler.py:13`
- **Secret key**: `app/api/core/auth/jwt_config.py`
- **Algorithm**: HS256
- **Expiry**: 2 hours

### Token Payload
```json
{
  "sub": "user_id",
  "user": "email",
  "tenant_id": "tenant_id",
  "exp": "datetime"
}
```

---

## Authorization

### Role-Based Access Control (RBAC)
- **File**: `app/api/core/auth/rbac.py:7`
- **Permission format**: `{resource}:{action}` (e.g., `users:create`)
- **Wildcard**: `*:*` grants all permissions
- **Tables**: `platform.user_roles`, `platform.roles`, `platform.role_permissions`, `platform.permissions`

### RBAC Dependencies
| Dependency | Description |
|------------|-------------|
| `require_permissions(*required)` | Check specific permissions |
| `require_role(*role_names)` | Check specific roles |
| `get_current_user` | Extract user from JWT |

---

## Health Check Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Basic health check |
| `/api/v1/health` | GET | API health check |
| `/api/v1/ready` | GET | Readiness check (database) |

---

## Endpoint Inventory

### Authentication (1 endpoint)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | User login |

### Credentials (4 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/credentials/` | List credentials |
| POST | `/api/v1/credentials/` | Create credential |
| PUT | `/api/v1/credentials/{credential_id}` | Update credential |
| DELETE | `/api/v1/credentials/{credential_id}` | Delete credential |

### Systems (4 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/systems/` | List systems |
| GET | `/api/v1/systems/{system_id}` | Get system |
| POST | `/api/v1/systems/` | Create system |
| GET | `/api/v1/systems/{system_id}/test` | Test connection |

### Execution (2 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/execution/run` | Run execution |
| GET | `/api/v1/execution/status/{batch_id}` | Get batch status |

### Users (8 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/users/` | List users |
| GET | `/api/v1/users/{user_id}` | Get user |
| POST | `/api/v1/users/` | Create user |
| PUT | `/api/v1/users/{user_id}` | Update user |
| DELETE | `/api/v1/users/{user_id}` | Delete user |
| POST | `/api/v1/users/{user_id}/roles` | Assign role |
| DELETE | `/api/v1/users/{user_id}/roles/{role_id}` | Remove role |
| GET | `/api/v1/users/{user_id}/roles` | Get user roles |

### Roles (9 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/roles/` | List roles |
| GET | `/api/v1/roles/{role_id}` | Get role |
| POST | `/api/v1/roles/` | Create role |
| PUT | `/api/v1/roles/{role_id}` | Update role |
| DELETE | `/api/v1/roles/{role_id}` | Delete role |
| POST | `/api/v1/roles/{role_id}/permissions` | Assign permission |
| DELETE | `/api/v1/roles/{role_id}/permissions/{permission_id}` | Remove permission |
| GET | `/api/v1/roles/{role_id}/permissions` | Get role permissions |
| GET | `/api/v1/roles/permissions/list` | List all permissions |

### Workflows (8 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/workflows/` | List workflows |
| GET | `/api/v1/workflows/{workflow_id}` | Get workflow |
| POST | `/api/v1/workflows/` | Create workflow |
| PUT | `/api/v1/workflows/{workflow_id}` | Update workflow |
| DELETE | `/api/v1/workflows/{workflow_id}` | Delete workflow |
| POST | `/api/v1/workflows/{workflow_id}/execute` | Execute workflow |
| GET | `/api/v1/workflows/{workflow_id}/instances` | List instances |
| GET | `/api/v1/workflows/instances/{instance_id}` | Get instance |

### Tasks (8 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/tasks/` | List tasks |
| GET | `/api/v1/tasks/{task_id}` | Get task |
| POST | `/api/v1/tasks/` | Create task |
| PUT | `/api/v1/tasks/{task_id}` | Update task |
| DELETE | `/api/v1/tasks/{task_id}` | Delete task |
| POST | `/api/v1/tasks/{task_id}/comments` | Add comment |
| GET | `/api/v1/tasks/{task_id}/comments` | Get comments |
| GET | `/api/v1/tasks/my/list` | My tasks |

### Approvals (6 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/approvals/` | List approvals |
| GET | `/api/v1/approvals/pending/count` | Pending count |
| GET | `/api/v1/approvals/{approval_id}` | Get approval |
| POST | `/api/v1/approvals/` | Create approval |
| PUT | `/api/v1/approvals/{approval_id}/approve` | Approve |
| PUT | `/api/v1/approvals/{approval_id}/reject` | Reject |

### Calendar (6 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/calendar/events` | List events |
| GET | `/api/v1/calendar/events/{event_id}` | Get event |
| POST | `/api/v1/calendar/events` | Create event |
| PUT | `/api/v1/calendar/events/{event_id}` | Update event |
| DELETE | `/api/v1/calendar/events/{event_id}` | Delete event |
| GET | `/api/v1/calendar/events/upcoming/list` | Upcoming events |

### Notifications (8 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/notifications/` | List notifications |
| GET | `/api/v1/notifications/{notification_id}` | Get notification |
| PUT | `/api/v1/notifications/{notification_id}/read` | Mark read |
| PUT | `/api/v1/notifications/read-all` | Mark all read |
| DELETE | `/api/v1/notifications/{notification_id}` | Delete notification |
| GET | `/api/v1/notifications/unread/count` | Unread count |
| GET | `/api/v1/notifications/preferences/list` | Get preferences |
| PUT | `/api/v1/notifications/preferences` | Update preferences |

### Settings (7 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/settings/` | List settings |
| GET | `/api/v1/settings/{category}` | Get category |
| GET | `/api/v1/settings/{category}/{key}` | Get setting |
| PUT | `/api/v1/settings/{category}/{key}` | Update setting |
| GET | `/api/v1/settings/flags/list` | List feature flags |
| GET | `/api/v1/settings/flags/{key}` | Get feature flag |
| PUT | `/api/v1/settings/flags/{key}` | Update feature flag |

---

## Endpoint Summary

| Router | Endpoints |
|--------|-----------|
| Auth | 1 |
| Credentials | 4 |
| Systems | 4 |
| Execution | 2 |
| Users | 8 |
| Roles | 9 |
| Workflows | 8 |
| Tasks | 8 |
| Approvals | 6 |
| Calendar | 6 |
| Notifications | 8 |
| Settings | 7 |
| **Total** | **71** |

Plus 3 health check endpoints = **74 total endpoints**

---

## Global Error Handlers

| Status | Handler | File |
|--------|---------|------|
| 500 | `global_exception_handler` | `app/api/main.py:72` |
| 404 | `not_found_handler` | `app/api/main.py:85` |
| 422 | `validation_error_handler` | `app/api/main.py:96` |

---

## Evidence

| Component | File Path |
|-----------|-----------|
| FastAPI app | `app/api/main.py:33` |
| Route registration | `app/api/main.py:146-158` |
| CORS middleware | `app/api/main.py:41` |
| Audit middleware | `app/api/core/middleware/audit_middleware.py:9` |
| Timing middleware | `app/api/main.py:60` |
| JWT handler | `app/api/core/auth/jwt_handler.py:6` |
| RBAC | `app/api/core/auth/rbac.py:7` |
| OpenAPI schema | `app/api/main.py:164` |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 15+*
