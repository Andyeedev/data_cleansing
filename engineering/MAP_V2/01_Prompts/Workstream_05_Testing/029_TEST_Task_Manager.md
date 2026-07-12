MAP Nexus™ Enterprise Platform
Prompt 029
Testing — Task Manager

Version: 1.0

Prompt ID: 029_TEST

Workstream: 05 — Testing

Status: Draft — Pending Review

---

Prerequisites

Complete

029_DB_Task_Manager (database schema created)
029_API_Task_Manager (API endpoints implemented)
029_UI_Task_Manager (frontend implemented)

---

Purpose

Test the Task Manager implementation.

---

## PART 1: Database Testing

### Test 1.1 — Verify Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'platform' 
  AND table_name IN (
    'tasks',
    'task_assignments', 
    'task_comments',
    'task_attachments',
    'task_activity'
  )
ORDER BY table_name;
```

**Expected Result:** 5 rows returned

---

### Test 1.2 — Verify Seed Data

```sql
SELECT title, type, status, priority
FROM platform.tasks
WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
```

**Expected Result:** 3 rows (default tasks)

---

## PART 2: API Testing

### Test 2.1 — List Tasks

```bash
curl -X GET "http://localhost:8000/api/v1/tasks" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with task list

---

### Test 2.2 — Create Task

```bash
curl -X POST "http://localhost:8000/api/v1/tasks" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Task for testing",
    "type": "general",
    "priority": "medium",
    "dueDate": "2026-07-20"
  }'
```

**Expected Result:** 201 Created with task ID

---

### Test 2.3 — Assign Task

```bash
curl -X POST "http://localhost:8000/api/v1/tasks/{id}/assign" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "xxx"}'
```

**Expected Result:** 200 OK

---

### Test 2.4 — Complete Task

```bash
curl -X POST "http://localhost:8000/api/v1/tasks/{id}/complete" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK, status='completed'

---

### Test 2.5 — Get My Tasks

```bash
curl -X GET "http://localhost:8000/api/v1/tasks/my-tasks" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with assigned tasks

---

## PART 3: Frontend Testing

### Test 3.1 — Build Success

```bash
cd MAP_V2/03_Source/frontend
npm run build
```

**Expected Result:** Build completes without errors

---

### Test 3.2 — Task Board Load

Navigate to: `http://localhost:5173/tasks`

**Expected Result:** Task board loads with columns (Pending, In Progress, Completed)

---

### Test 3.3 — Create Task

1. Click "Add Task" button
2. Fill in task details
3. Click "Save"

**Expected Result:** Task created and appears in board

---

### Test 3.4 — Drag Task

Drag task from "Pending" to "In Progress" column.

**Expected Result:** Task status updates

---

### Test 3.5 — Complete Task

Drag task to "Completed" column or click complete button.

**Expected Result:** Task marked as completed

---

### Test 3.6 — Task Detail

Click on a task card.

**Expected Result:** Task detail modal opens

---

## PART 4: Integration Testing

### Test 4.1 — Task Lifecycle

1. Create task via API
2. Assign task via API
3. Verify task in frontend
4. Complete task via frontend
5. Verify status via API

**Expected Result:** Full lifecycle works

---

## Acceptance Criteria

| Test Category | Tests | Pass Criteria |
|---------------|-------|---------------|
| Database | 2 | Tables and seed data verified |
| API | 5 | All endpoints return correct responses |
| Frontend | 6 | All UI elements work |
| Integration | 1 | Task lifecycle works |
| **Total** | **14** | **All pass** |

---

## Next Steps

After this prompt, test:

030_TEST_Calendar

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
