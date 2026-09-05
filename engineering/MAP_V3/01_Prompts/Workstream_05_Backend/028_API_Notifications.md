MAP Nexus™ Enterprise Platform
Prompt 028
Backend API — Notifications

Version: 1.0

Prompt ID: 028

Workstream: 05 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

028_DB_Notifications

---

Purpose

Create the FastAPI backend for Notifications in the MAP Nexus™ platform.

---

Folder Structure

Create

app/
api/routes/notification_router.py
services/notification_service.py
api/models/notification.py
schemas/notification.py
db/repositories/notification_repository.py

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/notifications | List user notifications |
| GET | /api/v1/notifications/unread | Get unread count |
| GET | /api/v1/notifications/{id} | Get notification |
| POST | /api/v1/notifications/{id}/read | Mark as read |
| POST | /api/v1/notifications/read-all | Mark all as read |
| GET | /api/v1/notifications/preferences | Get notification preferences |
| PUT | /api/v1/notifications/preferences | Update notification preferences |

---

Acceptance Criteria

1. Notification listing works
2. Unread count returns correctly
3. Mark as read works
4. Mark all as read works
5. Notification preferences CRUD works

---

Dependencies

028_DB_Notifications (database tables)
036_User_API (authentication)

---

Next Steps

After this prompt, implement:

029_API_Task_Manager — FastAPI endpoints for tasks
028_UI_Notifications — React frontend for notifications

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.
