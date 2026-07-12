MAP Nexus™ Enterprise Platform
Prompt 027
Backend API — Approval Workflows

Version: 1.0

Prompt ID: 027

Workstream: 05 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

027_DB_Approval_Workflows

---

Purpose

Create the FastAPI backend for Approval Workflows in the MAP Nexus™ platform.

---

Folder Structure

Create

app/
api/routes/approval_router.py
services/approval_service.py
api/models/approval.py
schemas/approval.py
db/repositories/approval_repository.py

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/approvals/chains | List approval chains |
| GET | /api/v1/approvals/chains/{id} | Get approval chain |
| POST | /api/v1/approvals/chains | Create approval chain |
| GET | /api/v1/approvals/requests | List approval requests |
| GET | /api/v1/approvals/requests/{id} | Get approval request |
| POST | /api/v1/approvals/requests | Create approval request |
| POST | /api/v1/approvals/{id}/approve | Approve request |
| POST | /api/v1/approvals/{id}/reject | Reject request |
| GET | /api/v1/approvals/pending | Get pending approvals for user |

---

Acceptance Criteria

1. Approval chain CRUD implemented
2. Approval request creation works
3. Approve/reject actions work
4. Pending approvals list works
5. Approval history logging works

---

Dependencies

027_DB_Approval_Workflows (database tables)
026_API_Workflow_Framework (workflow context)

---

Next Steps

After this prompt, implement:

028_API_Notifications — FastAPI endpoints for notifications
027_UI_Approval_Workflows — React frontend for approvals

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
