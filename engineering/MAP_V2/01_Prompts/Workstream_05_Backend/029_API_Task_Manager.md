MAP Nexus™ Enterprise Platform
Prompt 029
Backend API — Task Manager

Version: 1.0

Prompt ID: 029

Workstream: 05 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

029_DB_Task_Manager

---

Purpose

Create the FastAPI backend for Task Manager in the MAP Nexus™ platform.

---

Folder Structure

Create

app/
api/routes/task_router.py
services/task_service.py
api/models/task.py
schemas/task.py
db/repositories/task_repository.py

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/tasks | List tasks |
| GET | /api/v1/tasks/{id} | Get task |
| POST | /api/v1/tasks | Create task |
| PUT | /api/v1/tasks/{id} | Update task |
| DELETE | /api/v1/tasks/{id} | Delete task |
| POST | /api/v1/tasks/{id}/assign | Assign task to user |
| POST | /api/v1/tasks/{id}/complete | Mark task as complete |
| GET | /api/v1/tasks/my-tasks | Get current user's tasks |

---

Acceptance Criteria

1. Task CRUD implemented
2. Task assignment works
3. Task completion works
4. My tasks filter works
5. Task activity logging works

---

Dependencies

029_DB_Task_Manager (database tables)
036_User_API (authentication)

---

Next Steps

After this prompt, implement:

030_API_Calendar — FastAPI endpoints for calendar
029_UI_Task_Manager — React frontend for tasks

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
