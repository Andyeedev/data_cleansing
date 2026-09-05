MAP Nexus™ Enterprise Platform
Prompt 026
Backend API — Workflow Framework

Version: 1.0

Prompt ID: 026

Workstream: 05 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

026_DB_Workflow_Framework

---

Purpose

Create the FastAPI backend for the Workflow Framework in the MAP Nexus™ platform.

---

Objective

Create a workflow API capable of:

Workflow Definition CRUD — Create, read, update, delete workflows
Workflow Execution — Start, pause, resume, cancel workflows
Step Management — Track step execution
Workflow History — Audit trail for workflow changes

---

Folder Structure

Create

app/
api/routes/workflow_router.py
services/workflow_service.py
api/models/workflow.py
schemas/workflow.py
db/repositories/workflow_repository.py

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/workflows | List workflow definitions |
| GET | /api/v1/workflows/{id} | Get workflow definition |
| POST | /api/v1/workflows | Create workflow definition |
| PUT | /api/v1/workflows/{id} | Update workflow definition |
| DELETE | /api/v1/workflows/{id} | Delete workflow definition |
| POST | /api/v1/workflows/{id}/start | Start workflow instance |
| GET | /api/v1/workflows/instances | List running instances |
| GET | /api/v1/workflows/instances/{id} | Get workflow instance |
| POST | /api/v1/workflows/instances/{id}/pause | Pause workflow |
| POST | /api/v1/workflows/instances/{id}/resume | Resume workflow |
| POST | /api/v1/workflows/instances/{id}/cancel | Cancel workflow |
| GET | /api/v1/workflows/instances/{id}/history | Get workflow history |

---

Acceptance Criteria

1. Workflow definition CRUD implemented
2. Workflow instance creation works
3. Workflow pause/resume/cancel works
4. Step tracking implemented
5. Workflow history logging works

---

Dependencies

026_DB_Workflow_Framework (database tables)
036_User_API (authentication)

---

Next Steps

After this prompt, implement:

027_API_Approval_Workflows — FastAPI endpoints for approvals
026_UI_Workflow_Framework — React frontend for workflows

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
