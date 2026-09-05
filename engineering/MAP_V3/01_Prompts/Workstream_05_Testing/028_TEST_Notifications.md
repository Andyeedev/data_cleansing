MAP Nexus™ Enterprise Platform
Prompt 028
Testing — Notifications

Version: 1.0

Prompt ID: 028_TEST

Workstream: 05 — Testing

Status: Draft — Pending Review

---

Prerequisites

Complete

028_DB_Notifications (database schema created)
028_API_Notifications (API endpoints implemented)
028_UI_Notifications (frontend implemented)

---

Purpose

Test the Notifications implementation.

---

## PART 1: Database Testing

### Test 1.1 — Verify Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'platform' 
  AND table_name IN (
    'notifications',
    'notification_preferences', 
    'notification_templates',
    'notification_log'
  )
ORDER BY table_name;
```

**Expected Result:** 4 rows returned

---

### Test 1.2 — Verify Templates Seeded

```sql
SELECT name, type, channel, is_system
FROM platform.notification_templates
WHERE is_system = TRUE;
```

**Expected Result:** 10 rows (default templates)

---

## PART 2: API Testing

### Test 2.1 — List Notifications

```bash
curl -X GET "http://localhost:8000/api/v1/notifications" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with notification list

---

### Test 2.2 — Get Unread Count

```bash
curl -X GET "http://localhost:8000/api/v1/notifications/unread" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with count

---

### Test 2.3 — Mark as Read

```bash
curl -X POST "http://localhost:8000/api/v1/notifications/{id}/read" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK, read=true

---

### Test 2.4 — Mark All as Read

```bash
curl -X POST "http://localhost:8000/api/v1/notifications/read-all" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK

---

### Test 2.5 — Get Preferences

```bash
curl -X GET "http://localhost:8000/api/v1/notifications/preferences" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with preferences

---

### Test 2.6 — Update Preferences

```bash
curl -X PUT "http://localhost:8000/api/v1/notifications/preferences" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "approval",
    "channel": "email",
    "enabled": true,
    "frequency": "daily"
  }'
```

**Expected Result:** 200 OK

---

## PART 3: Frontend Testing

### Test 3.1 — Build Success

```bash
cd MAP_V2/03_Source/frontend
npm run build
```

**Expected Result:** Build completes without errors

---

### Test 3.2 — Notification Bell

Navigate to any page, check header for notification bell.

**Expected Result:** Bell displays with unread count

---

### Test 3.3 — Notification Dropdown

Click on notification bell.

**Expected Result:** Dropdown shows recent notifications

---

### Test 3.4 — Mark as Read

Click on an unread notification.

**Expected Result:** Notification marked as read, count decreases

---

### Test 3.5 — Preferences Page

Navigate to notification preferences.

**Expected Result:** Preferences page loads and saves

---

## PART 4: Integration Testing

### Test 4.1 — Notification Flow

1. Create approval request (triggers notification)
2. Check user notifications
3. Verify notification received
4. Mark as read

**Expected Result:** Notifications created and displayed

---

## Acceptance Criteria

| Test Category | Tests | Pass Criteria |
|---------------|-------|---------------|
| Database | 2 | Tables and templates verified |
| API | 6 | All endpoints return correct responses |
| Frontend | 5 | All UI elements work |
| Integration | 1 | Notification flow works |
| **Total** | **14** | **All pass** |

---

## Next Steps

After this prompt, test:

029_TEST_Task_Manager

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
