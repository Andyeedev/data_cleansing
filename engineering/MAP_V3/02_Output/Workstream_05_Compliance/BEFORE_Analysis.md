# Workstream 05 Compliance Analysis — BEFORE

**Date:** 13 July 2026

**Policies Audited:** 13_Architecture_Compliance_Audit.md, 14_Enterprise_Application_Architecture

**Workstream:** 05 — Workflow & Administration

**Overall Score:** 68% ⚠️ WARNING

---

## Executive Summary

Workstream 05 was implemented without policies 13 and 14 being available. The code is functionally complete for most components but has significant compliance gaps against the enterprise architecture standards. Critical issues include: RBAC not enforced, no tenant isolation, no repository layer, and incomplete approval workflow API.

---

## Policy 13: Architecture Compliance Audit — Findings

### 1. Database Audit — ⚠️ WARNING (80%)

| Check | Status | Detail |
|-------|--------|--------|
| Tables in `platform` schema | ✅ | 17 tables correctly in `platform` |
| `tenant_id` FK to `core.tenants` | ⚠️ | Column exists but **no FK constraint** |
| Audit columns (`created_at`, `updated_at`) | ✅ | Present on all tables |
| `created_by` column | ⚠️ | Present on some tables but **no FK to `platform.users`** |
| Indexes | ✅ | Indexes exist on key columns |
| `workflow_history` table | ❌ | **Missing** — required by Policy 14 Module 007 §491 |
| Naming standards | ✅ | Consistent `snake_case` |

**Gaps:**
1. No FK constraint on `tenant_id` → `core.tenants`
2. No `workflow_history` audit trail table
3. No FK on `created_by` → `platform.users`

### 2. Frontend Audit — ⚠️ WARNING (85%)

| Check | Status | Detail |
|-------|--------|--------|
| Frontend → API only | ✅ | All hooks use `api.get/post/put/delete` |
| No business logic in React | ✅ | Components are presentational |
| Widget reuse | ⚠️ | Loading/error patterns duplicated — no shared widget library |
| Routing consistent | ✅ | Routes registered in `navigation.config.ts` |
| Portal isolation | ✅ | `task-management/` is self-contained |
| State management | ✅ | Hooks manage state locally |
| Centralised auth | ✅ | `get_current_user` used in all routes |

**Gaps:**
1. No shared widget library — loading/error patterns duplicated across portals
2. TaskApprovals uses `useTasks({ status: 'pending' })` — not a dedicated approval API call

### 3. API Audit — ⚠️ WARNING (60%)

| Check | Status | Detail |
|-------|--------|--------|
| Versioning (`/api/v1/`) | ✅ | All routes use `/api/v1/` |
| Authentication | ✅ | `get_current_user` dependency on all routes |
| Authorisation (RBAC) | ❌ | **Routes do NOT use `require_permissions()`** |
| Routing conventions | ✅ | RESTful CRUD |
| Services layer | ✅ | Separate service files per domain |
| Repository usage | ⚠️ | Services use direct SQL — **no repository layer** |
| Error handling | ⚠️ | Basic try/catch — no structured error responses |
| Logging | ❌ | **No logging** in workflow routes or services |
| Input validation | ⚠️ | Pydantic models exist but are minimal |

**Gaps:**
1. **RBAC not enforced** — `require_permissions()` exists but not used
2. **No repository layer** — services bypass repositories (layer violation)
3. **No logging** in workflow services
4. **Minimal input validation**

### 4. Integration Audit — ❌ FAIL (55%)

Expected architecture:
```
React → FastAPI → Application Services → Python Validation Engine → Repositories → PostgreSQL
```

| Check | Status | Detail |
|-------|--------|--------|
| React → Database | ✅ | No direct DB access from frontend |
| API → Database bypassing services | ✅ | Routes call services |
| **Services → Database bypassing repositories** | ❌ | **VIOLATION** — `workflow_service.py` executes SQL directly |
| **Repositories containing business logic** | ❌ | N/A — repositories don't exist |

**Gap:** Services bypass repositories — layer violation per Policy 13 §387-427.

### 5. Workflow Audit — ⚠️ WARNING (75%)

| Component | DB Tables | API Routes | Frontend | Status |
|-----------|-----------|------------|----------|--------|
| Workflow Framework | ✅ | ✅ | ✅ | **Partial** |
| Approvals | ✅ | ❌ **Missing** | ⚠️ Uses task filter | **Incomplete** |
| Notifications | ✅ | ✅ | ✅ | **Complete** |
| Task Manager | ✅ | ✅ | ✅ | **Complete** |
| Calendar | ✅ | ✅ | ✅ | **Complete** |

**Gaps:**
1. **No approval routes/service** — DB tables exist, UI exists, backend API missing
2. **No workflow history** — no audit trail table
3. **No shared services** — each domain has its own service

### 6. Security Audit — ⚠️ WARNING (50%)

| Check | Status | Detail |
|-------|--------|--------|
| Authentication | ✅ | JWT via `get_current_user` |
| RBAC enforcement | ❌ | `require_permissions()` exists but **not used** |
| Tenant isolation | ❌ | `tenant_id` column exists but **no enforcement** in queries |
| Secrets | ✅ | `JWT_SECRET_KEY` in `.env` (gitignored) |
| Audit logging | ✅ | `audit_middleware.py` logs API calls |
| Request-level logging | ❌ | No logging in services |

**Gaps:**
1. **RBAC not enforced** on any workflow endpoint
2. **No tenant isolation** in queries — all users see all data
3. **No service-level logging**

---

## Policy 14: Enterprise Application Architecture — Findings

### Section 13 — Workflow Platform (Module 007 §473-492)

| Requirement | Status | Detail |
|-------------|--------|--------|
| Workflow Engine | ✅ | Implemented |
| Approvals | ⚠️ | DB yes, API no |
| Tasks | ✅ | Implemented |
| Notifications | ✅ | Implemented |
| Calendar | ✅ | Implemented |
| Execution lifecycle | ❌ | Not documented, no history table |
| History | ❌ | No `workflow_history` table |
| Audit | ⚠️ | Middleware exists, no workflow-level audit |

### Section 17 — Platform Contracts (Module 007 §571-600)

| Contract | Status |
|----------|--------|
| Workflow Contract | ❌ Not generated |

### Section 19 — Ownership Matrix (Module 007 §641-659)

| Requirement | Status |
|-------------|--------|
| Component → Owner mapping | ❌ Not generated |

---

## Compliance Scorecard

| Category | Score | Status |
|----------|-------|--------|
| Architecture | 70% | ⚠️ WARNING |
| API | 60% | ⚠️ WARNING |
| Database | 80% | ⚠️ WARNING |
| Frontend | 85% | ⚠️ WARNING |
| Backend | 55% | ❌ FAIL |
| Security | 50% | ❌ FAIL |
| Workflow | 75% | ⚠️ WARNING |
| Integration | 55% | ❌ FAIL |
| **Overall** | **68%** | **⚠️ WARNING** |

---

## Critical Gaps Summary

| # | Gap | Severity | Policy Reference |
|---|-----|----------|-----------------|
| 1 | No RBAC enforcement on workflow routes | 🔴 High | Policy 13 §481, Policy 14 §15 |
| 2 | No tenant isolation in queries | 🔴 High | Policy 13 §481, Policy 14 §15 |
| 3 | No repository layer — services bypass repositories | 🔴 High | Policy 13 §387-427 |
| 4 | No approval routes/service | 🔴 High | Policy 13 §455, Policy 14 §13 |
| 5 | No workflow history audit trail | 🟡 Medium | Policy 14 §13 |
| 6 | No logging in services | 🟡 Medium | Policy 13 §333 |
| 7 | No FK constraints on tenant_id | 🟡 Medium | Policy 13 §247 |
| 8 | No shared widget library | 🟢 Low | Policy 13 §309 |
| 9 | Prompts not approved | 🟡 Medium | Policy 13 §149 |
| 10 | No tests written | 🟡 Medium | Policy 14 §008 |

---

## Remediation Plan

| Fix | Priority | Estimated Effort |
|-----|----------|-----------------|
| Enforce RBAC on all workflow routes | High | 1 hour |
| Add tenant isolation to all queries | High | 2 hours |
| Create repository layer | High | 3 hours |
| Build approval routes and service | High | 2 hours |
| Add workflow_history table | Medium | 30 mins |
| Add service-level logging | Medium | 1 hour |
| Add FK constraints | Medium | 30 mins |

---

*This document captures the state BEFORE remediation. See AFTER_Analysis.md for post-implementation results.*
