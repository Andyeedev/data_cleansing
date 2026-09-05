MAP Nexus™ Enterprise Platform
Prompt 027
Testing — Approval Workflows

Version: 1.0

Prompt ID: 027_TEST

Workstream: 05 — Testing

Status: Draft — Pending Review

---

Prerequisites

Complete

027_DB_Approval_Workflows (database schema created)
027_API_Approval_Workflows (API endpoints implemented)
027_UI_Approval_Workflows (frontend implemented)

---

Purpose

Test the Approval Workflows implementation.

---

## PART 1: Database Testing

### Test 1.1 — Verify Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'platform' 
  AND table_name IN (
    'approval_chains',
    'approval_requests', 
    'approvals',
    'approval_history'
  )
ORDER BY table_name;
```

**Expected Result:** 4 rows returned

---

### Test 1.2 — Verify Seed Data

```sql
SELECT id, name, type, is_system
FROM platform.approval_chains
WHERE is_system = TRUE;
```

**Expected Result:** 3 rows (User Role Change, Migration Execution, Tenant Provisioning)

---

## PART 2: API Testing

### Test 2.1 — List Approval Chains

```bash
curl -X GET "http://localhost:8000/api/v1/approvals/chains" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with list of chains

---

### Test 2.2 — Create Approval Request

```bash
curl -X POST "http://localhost:8000/api/v1/approvals/requests" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "approvalChainId": "00000000-0000-0000-0000-000000000001",
    "title": "Role Change Request",
    "requestData": {"userId": "xxx", "newRole": "admin"}
  }'
```

**Expected Result:** 201 Created with request ID

---

### Test 2.3 — Approve Request

```bash
curl -X POST "http://localhost:8000/api/v1/approvals/{id}/approve" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"comments": "Approved by admin"}'
```

**Expected Result:** 200 OK, status changed to 'approved'

---

### Test 2.4 — Reject Request

```bash
curl -X POST "http://localhost:8000/api/v1/approvals/{id}/reject" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"comments": "Rejected due to policy"}'
```

**Expected Result:** 200 OK, status changed to 'rejected'

---

### Test 2.5 — Get Pending Approvals

```bash
curl -X GET "http://localhost:8000/api/v1/approvals/pending" \
  -H "Authorization: Bearer <token>"
```

**Expected Result:** 200 OK with pending approvals for user

---

## PART 3: Frontend Testing

### Test 3.1 — Build Success

```bash
cd MAP_V2/03_Source/frontend
npm run build
```

**Expected Result:** Build completes without errors

---

### Test 3.2 — Approval Queue Load

Navigate to: `http://localhost:5173/approvals`

**Expected Result:** Approval queue page loads

---

### Test 3.3 — Approve Action

1. Click on pending approval
2. Add comment
3. Click "Approve"

**Expected Result:** Approval status changes to 'approved'

---

### Test 3.4 — Reject Action

1. Click on pending approval
2. Add comment
3. Click "Reject"

**Expected Result:** Approval status changes to 'rejected'

---

## PART 4: Integration Testing

### Test 4.1 — Approval Lifecycle

1. Create approval chain via API
2. Create approval request via API
3. Verify request appears in frontend
4. Approve via frontend
5. Verify status updated via API

**Expected Result:** Full lifecycle works

---

## Acceptance Criteria

| Test Category | Tests | Pass Criteria |
|---------------|-------|---------------|
| Database | 2 | Tables and seed data verified |
| API | 5 | All endpoints return correct responses |
| Frontend | 4 | All pages load and actions work |
| Integration | 1 | End-to-end flow works |
| **Total** | **12** | **All pass** |

---

## Next Steps

After this prompt, test:

028_TEST_Notifications

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
