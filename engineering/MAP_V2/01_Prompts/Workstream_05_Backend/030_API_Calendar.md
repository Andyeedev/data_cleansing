MAP Nexus™ Enterprise Platform
Prompt 030
Backend API — Calendar

Version: 1.0

Prompt ID: 030

Workstream: 05 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

030_DB_Calendar

---

Purpose

Create the FastAPI backend for Calendar in the MAP Nexus™ platform.

---

Folder Structure

Create

app/
api/routes/calendar_router.py
services/calendar_service.py
api/models/calendar.py
schemas/calendar.py
db/repositories/calendar_repository.py

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/calendar/events | List calendar events |
| GET | /api/v1/calendar/events/{id} | Get event |
| POST | /api/v1/calendar/events | Create event |
| PUT | /api/v1/calendar/events/{id} | Update event |
| DELETE | /api/v1/calendar/events/{id} | Delete event |
| POST | /api/v1/calendar/events/{id}/attendees | Add attendee |
| POST | /api/v1/calendar/events/{id}/respond | Respond to invitation |
| GET | /api/v1/calendar/views | Get user calendar views |
| POST | /api/v1/calendar/views | Create calendar view |
| GET | /api/v1/calendar/upcoming | Get upcoming events |

---

Acceptance Criteria

1. Event CRUD implemented
2. Attendee management works
3. RSVP responses work
4. Calendar view preferences work
5. Upcoming events query works

---

Dependencies

030_DB_Calendar (database tables)
036_User_API (authentication)

---

Next Steps

After this prompt, implement:

030_UI_Calendar — React frontend for calendar

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
