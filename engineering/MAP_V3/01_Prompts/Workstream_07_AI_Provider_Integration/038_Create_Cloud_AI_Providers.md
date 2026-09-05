# MAP Nexus Enterprise Platform

## Prompt 38: Create Cloud AI Providers

**Version:** 1.0

**Status:** Pending

**Workstream:** 07 - AI Provider Integration

---

# Purpose

This prompt defines the implementation requirements for Create Cloud AI Providers.

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 06_AI_Architecture.md — AI provider integration architecture
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

## AI Architecture

From 06_AI_Architecture.md:

- AI never accesses PostgreSQL directly
- AI communicates only through API Layer → AI Framework → Provider Adapter → Configured Provider
- Provider Connector handles: authentication, API calls, retries, timeouts, error handling, usage tracking

---

# Prerequisites

- Workstream 06 Administration prompts completed
- AI architecture defined in 06_AI_Architecture.md

---

# Implementation TODO

- [ ] Define provider connector interface
- [ ] Implement provider adapters
- [ ] Create AI service layer
- [ ] Build admin UI for provider management

---

# Acceptance Criteria

- [ ] Provider connector interface defined
- [ ] At least one provider adapter implemented
- [ ] AI service functional
- [ ] Admin UI working
