MAP Nexus™ Enterprise Platform
Prompt 026
Testing — Workflow Framework

Version: 1.0

Prompt ID: 026_TEST

Workstream: 05 — Testing

Status: Draft — Pending Review

---

Prerequisites

Complete

026_DB_Workflow_Framework (database schema created)
026_API_Workflow_Framework (API endpoints implemented)
026_UI_Workflow_Framework (frontend implemented)

---

Purpose

Test the Workflow Framework implementation in the MAP Nexus™ platform.

This prompt provides comprehensive testing for database, API, and frontend layers.

---

## PART 1: Database Testing

### Test 1.1 — Verify Tables Exist

```sql
-- Run in PostgreSQL
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'platform' 
  AND table_name IN (
    'workflow_definitions',
    'workflow_steps', 
    'workflow_instances',
    'workflow_step_instances',
    'workflow_history'
  )
ORDER BY table_name;
```

**Expected Result:** 5 rows returned

---

### Test 1.2 — Verify Columns

```sql
-- Check workflow_definitions columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'platform' 
  AND table_name = 'workflow_definitions'
ORDER BY ordinal_position;
```

**Expected Result:** id, name, description, type, status, version, steps, triggers, variables, tenant_id, is_system, metadata, created_at, updated_at, created_by, deleted_at

---

### Test 1.3 — Verify Seed Data

```sql
-- Check default workflows exist
SELECT id, name, type, status, is_system
FROM platform.workflow_definitions
WHERE is_system = TRUE;
```

**Expected Result:** 3 rows (User Provisioning, Role Change Request, Migration Execution)

---

### Test 1.4 — Verify Indexes

```sql
-- Check indexes exist
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'platform'
  AND tablename LIKE 'workflow%'
ORDER BY tablename, indexname;
```

**Expected Result:** Multiple indexes on workflow tables

---

## PART 2: API Testing

### Test 2.1 — List Workflow Definitions

```bash
curl -X GET "http://localhost:8000/api/v1/workflows" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with list of workflows

---

### Test 2.2 — Get Workflow Definition

```bash
curl -X GET "http://localhost:8000/api/v1/workflows/{id}" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with workflow details

---

### Test 2.3 — Create Workflow Definition

```bash
curl -X POST "http://localhost:8000/api/v1/workflows" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "description": "Test workflow for validation",
    "type": "custom",
    "steps": [
      {"name": "Step 1", "type": "action", "config": {}},
      {"name": "Step 2", "type": "approval", "config": {}}
    ]
  }'
```

**Expected Result:** 201 Created with workflow ID

---

### Test 2.4 — Start Workflow Instance

```bash
curl -X POST "http://localhost:8000/api/v1/workflows/{id}/start" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with instance ID

---

### Test 2.5 — Pause Workflow Instance

```bash
curl -X POST "http://localhost:8000/api/v1/workflows/instances/{id}/pause" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK, status changed to 'paused'

---

### Test 2.6 — Resume Workflow Instance

```bash
curl -X POST "http://localhost:8000/api/v1/workflows/instances/{id}/resume" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK, status changed to 'running'

---

### Test 2.7 — Cancel Workflow Instance

```bash
curl -X POST "http://localhost:8000/api/v1/workflows/instances/{id}/cancel" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK, status changed to 'cancelled'

---

### Test 2.8 — Get Workflow History

```bash
curl -X GET "http://localhost:8000/api/v1/workflows/instances/{id}/history" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with history entries

---

## PART 3: Frontend Testing

### Test 3.1 — Build Success

```bash
cd MAP_V2/03_Source/frontend
npm run build
```

**Expected Result:** Build completes without errors

---

### Test 3.2 — Page Load

Navigate to: `http://localhost:5173/workflow`

**Expected Result:** Workflow list page loads

---

### Test 3.3 — Create Workflow

1. Click "Add Workflow" button
2. Fill in workflow name
3. Add steps
4. Click "Save"

**Expected Result:** Workflow created and appears in list

---

### Test 3.4 — View Workflow Instances

1. Click on a workflow
2. View instance list

**Expected Result:** Instances display with status

---

### Test 3.5 — Pause/Resume Workflow

1. Select a running instance
2. Click "Pause"
3. Verify status changes
4. Click "Resume"
5. Verify status changes back

**Expected Result:** Status updates correctly

---

## PART 4: Integration Testing

### Test 4.1 — Full Workflow Lifecycle

1. Create workflow definition via API
2. Start workflow instance via API
3. Verify instance appears in frontend
4. Complete each step
5. Verify workflow completes

**Expected Result:** Full lifecycle works end-to-end

---

### Test 4.2 — Error Handling

1. Try to start workflow that doesn't exist
2. Try to pause already paused workflow
3. Try to cancel completed workflow

**Expected Result:** Appropriate error messages returned

---

## Acceptance Criteria

| Test Category | Tests | Pass Criteria |
|---------------|-------|---------------|
| Database | 4 | All tables, columns, seed data verified |
| API | 8 | All endpoints return correct responses |
| Frontend | 5 | All pages load and actions work |
| Integration | 2 | End-to-end flows work |
| **Total** | **19** | **All pass** |

---

## Test Report Template

```markdown
# Workflow Framework Test Report

Date: _______________
Tester: _______________

## Database Tests
- [ ] Tables exist
- [ ] Columns correct
- [ ] Seed data present
- [ ] Indexes created

## API Tests
- [ ] List workflows
- [ ] Get workflow
- [ ] Create workflow
- [ ] Start instance
- [ ] Pause instance
- [ ] Resume instance
- [ ] Cancel instance
- [ ] Get history

## Frontend Tests
- [ ] Build succeeds
- [ ] Page loads
- [ ] Create workflow
- [ ] View instances
- [ ] Pause/Resume

## Integration Tests
- [ ] Full lifecycle
- [ ] Error handling

Result: PASS / FAIL
```

---

## Next Steps

After this prompt, test:

027_TEST_Approval_Workflows

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
