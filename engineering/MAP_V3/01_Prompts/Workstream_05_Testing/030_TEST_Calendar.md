MAP Nexus™ Enterprise Platform
Prompt 030
Testing — Calendar

Version: 1.0

Prompt ID: 030_TEST

Workstream: 05 — Testing

Status: Draft — Pending Review

---

Prerequisites

Complete

030_DB_Calendar (database schema created)
030_API_Calendar (API endpoints implemented)
030_UI_Calendar (frontend implemented)

---

Purpose

Test the Calendar implementation.

---

## PART 1: Database Testing

### Test 1.1 — Verify Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'platform' 
  AND table_name IN (
    'calendar_events',
    'calendar_event_attendees', 
    'calendar_reminders',
    'calendar_views'
  )
ORDER BY table_name;
```

**Expected Result:** 4 rows returned

---

### Test 1.2 — Verify Seed Data

```sql
SELECT title, type, status, location
FROM platform.calendar_events
WHERE type = 'maintenance';
```

**Expected Result:** 1 row (Scheduled Maintenance)

---

## PART 2: API Testing

### Test 2.1 — List Events

```bash
curl -X GET "http://localhost:8000/api/v1/calendar/events" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with event list

---

### Test 2.2 — Create Event

```bash
curl -X POST "http://localhost:8000/api/v1/calendar/events" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Meeting",
    "type": "meeting",
    "startTime": "2026-07-20T10:00:00Z",
    "endTime": "2026-07-20T11:00:00Z",
    "location": "Conference Room A"
  }'
```

**Expected Result:** 201 Created with event ID

---

### Test 2.3 — Update Event

```bash
curl -X PUT "http://localhost:8000/api/v1/calendar/events/{id}" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Meeting Title"}'
```

**Expected Result:** 200 OK

---

### Test 2.4 — Add Attendee

```bash
curl -X POST "http://localhost:8000/api/v1/calendar/events/{id}/attendees" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "xxx", "role": "required"}'
```

**Expected Result:** 200 OK

---

### Test 2.5 — Get Upcoming Events

```bash
curl -X GET "http://localhost:8000/api/v1/calendar/upcoming" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with upcoming events

---

## PART 3: Frontend Testing

### Test 3.1 — Build Success

```bash
cd MAP_V2/03_Source/frontend
npm run build
```

**Expected Result:** Build completes without errors

---

### Test 3.2 — Calendar View Load

Navigate to: `http://localhost:5173/calendar`

**Expected Result:** Calendar grid loads

---

### Test 3.3 — Month View

Click "Month" view button.

**Expected Result:** Monthly calendar displays

---

### Test 3.4 — Week View

Click "Week" view button.

**Expected Result:** Weekly calendar displays

---

### Test 3.5 — Day View

Click "Day" view button.

**Expected Result:** Daily calendar displays

---

### Test 3.6 — Create Event

1. Click on a date
2. Fill in event details
3. Click "Save"

**Expected Result:** Event created and appears on calendar

---

### Test 3.7 — Event Detail

Click on an event.

**Expected Result:** Event detail modal opens

---

## PART 4: Integration Testing

### Test 4.1 — Event Lifecycle

1. Create event via API
2. Add attendee via API
3. Verify event in frontend
4. Update event via frontend
5. Verify changes via API

**Expected Result:** Full lifecycle works

---

## Acceptance Criteria

| Test Category | Tests | Pass Criteria |
|---------------|-------|---------------|
| Database | 2 | Tables and seed data verified |
| API | 5 | All endpoints return correct responses |
| Frontend | 7 | All views and actions work |
| Integration | 1 | Event lifecycle works |
| **Total** | **15** | **All pass** |

---

## Final Summary

### All Workstream 05 Tests

| Prompt | Component | Tests |
|--------|-----------|-------|
| 026_TEST | Workflow Framework | 19 |
| 027_TEST | Approval Workflows | 12 |
| 028_TEST | Notifications | 14 |
| 029_TEST | Task Manager | 14 |
| 030_TEST | Calendar | 15 |
| **Total** | | **74** |

---

## Next Steps

After all tests pass, Workstream 05 is complete.

Proceed to Workstream 06 testing.

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
