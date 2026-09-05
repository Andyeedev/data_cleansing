# MAP Nexus Enterprise Platform

## Prompt 29: Create Task Manager

**Version:** 1.0

**Status:** Pending

**Workstream:** 05 - Workflow

---

# Purpose

This prompt defines the implementation requirements for Create Task Manager.

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

---

# Prerequisites

- Workstream 05 Database prompts completed
- Workstream 05 Backend prompts completed

---

# Implementation TODO

- [ ] Define database tables
- [ ] Create API routes
- [ ] Build frontend components
- [ ] Write tests

---

# Acceptance Criteria

- [ ] All tables created in platform schema
- [ ] All API endpoints functional
- [ ] Frontend components working
- [ ] Tests passing
