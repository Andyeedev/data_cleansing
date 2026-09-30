RD-OC-E2E-002 — MAP Nexus E2E Product UI / Admin Integration Audit Results

WORK PACKAGE: OC-E2E-002 — UI / Admin Integration Audit
TYPE: Audit Report (evidence-based)
ASSESSMENT: DEFECTS PRESENT — PARTIALLY READY
DATE: 2026-09-23

---

## 1. EXECUTIVE SUMMARY

A full E2E UI ↔ Backend integration audit was executed against the MAP Nexus stack
(backend :8000, frontend dev :5173) using authenticated probes for both a Super Admin
(`admin@mapnexus.com`) and a Tenant Admin (`e2e-admin@e2e-validation.com`), a static
route→API contract extractor, the production build (`tsc -b && vite build`) and the
Vitest suite.

Result: **the product UI and Admin integration are NOT fully ready.**

SEVERITY      COUNT   NOTES
P1 (Critical)   4     Build breaker + broken admin endpoints + auth gap
P2 (High)       5     Role gating mismatch, roles list empty, currentUser contract gap, invitation gating, registration status lifecycle
P3 (Medium)     3     Test-suite health, redundant code, maintenance cache-clear wiring

The single most important finding is **the frontend does not currently build**
(`AdministrationPage.tsx` has a JSX sibling error causing TS2657), which in turn
breaks 19 test files / 44 tests. The Admin/Registrations backend 500 and the
sidebar navigation role mismatch are the second-highest-risk findings.

---

## 2. ROUTE → API CONTRACT MATRIX

### 2.1 Extract method
22 frontend API call sites were statically extracted (`_audit_api_calls.py`) and
cross-checked against live backend routes (authenticated as Super Admin and Tenant
Admin). 21/22 matched a registered backend route. **1 unmatched:**
`POST /admin/cache/clear` (from `AdministrationPage.tsx` Maintenance tab) — no route
exists anywhere in `app/api/routes`.

### 2.2 Verified live probes (Super Admin session, cookie-based)

ENDPOINT                          STATUS  NOTES
GET  /health                            200  `{"status":"healthy","version":"2.0.0"}`
GET  /navigation                        200  Returns administration subtree (see §6)
GET  /settings/flags/list               200  Feature flags — CORRECT frontend path
GET  /settings                          200  Settings list
GET  /invitations                       200  SA: invitation list
GET  /invitations                       403  TA: `Admin access required`
GET  /permissions                       200  Permissions map
GET  /permissions/roles                 200  `["admin","manager","operator","viewer"]`
PUT  /permissions                       200  (writable even for Tenant Admin — see §6)
POST /permissions/reset                 200  (writable even for Tenant Admin)
GET  /roles?page=1&page_size=20         200  Returns EMPTY `{"roles":[],"total":0}` ← P2
GET  /users?page=1&page_size=20         200  SA + TA (tenant-scoped)
GET  /governance/audit?limit=10         200
GET  /admin/registrations               500  ← P1 (leads schema mismatch)
POST /admin/cache/clear                 404  ← P1 (no backend route)
POST /admin/registrations/{id}/convert  422  ← P1 (no auth dependency; body validation short-circuit)

---

## 3. FINDINGS

### 3.1 P1-001 — Frontend does not build: JSX sibling error (CRITICAL)

Location: `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/AdministrationPage.tsx:304`

The non-empty Users branch of `UsersTab` returns two sibling JSX root nodes without a
wrapping fragment:

```
304   return (
305     <div style={{...}}>      <-- opening
...
402     </div>
403     <InvitationModal        <-- second root, no parent element
404       isOpen={...}
```

`npm run build` fails with `TS2657: JSX expressions must have one parent element`.
This is a **hard build breaker** and also breaks the Vitest transform step
(esbuild `Expected ")" but found "isOpen"`), which cascades into most of the 44 test
failures (see §3.5).

Evidence:
- `npm run build` → `tsc -b` error TS2657 at AdministrationPage.tsx(305,5).
- Failed suites `PermissionGuard.test.tsx` and `src/App.test.tsx` report
  `Transform failed ... AdministrationPage.tsx:404:6 ERROR: Expected ")" but found "isOpen"`.

### 3.2 P1-002 — GET /admin/registrations returns 500 for all admin roles

Location: `app/api/routes/admin_registration_routes.py:27-33`

Query selects `converted_to_tenant` and `converted_at` from `core.leads`, but the
leads schema (verified live) has **no such columns**. Leads columns:
`lead_id, full_name, work_email, work_email_hash, company, org_size, industry, role,
challenge, message, source_form, utm_source, referrer, is_qualified,
is_design_partner_candidate, created_at, contacted_at, status`.

→ The Registrations admin tab always throws `Internal server error`.

### 3.3 P1-003 — Admin Registration/Convert endpoints have NO authentication

Location: `app/api/routes/admin_registration_routes.py:14,56`

Neither `GET /admin/registrations` nor `POST /admin/registrations/{lead_id}/convert`
declares an auth dependency (`get_current_user` / `get_current_user_with_tenant` /
`require_admin`). Unauthenticated probes:
- `GET /admin/registrations` → 500 (reached the query, bypassing auth)
- `POST /admin/registrations/aaa/convert` → 422 (FastAPI body validation, NOT 401/403)

→ Once §3.2 is fixed, lead PII (name, work email, company) and lead→tenant
conversion would be **public, unauthenticated operations**.

### 3.4 P1-004 — POST /admin/cache/clear has no backend route

Location: `AdministrationPage.tsx:618` (Maintenance tab).

Frontend calls `apiPost('/admin/cache/clear', {})`. No matching route exists in
`app/api/routes` (grep for `cache/clear` returns nothing). Live probe returns
404 `Resource not found`. → Maintenance "Clear Cache" button is a dead action.

### 3.5 P2-001 — Role gating mismatch: sidebar Administration section hidden from ALL users

Locations:
- `app/api/routes/navigation_routes.py:483,493,503,513,523,533,543,553,563,573` — every
  Administration nav item declares `requiredRoles=["admin"]`.
- `engineering/MAP_V3/03_Source/frontend-mvp/src/utils/filterByPermissions.ts:11` —
  exact-match filter: `item.requiredRoles.some((role) => userRoles.includes(role))`.
- Actual roles (from JWT + `/auth/me`): `["Super Admin"]`, `["Tenant Admin"]`.

`"admin"` is never in `userRoles` → **the entire Administration menu group is
filtered out of the sidebar for every user**, including Super Admin. The feature is
therefore unreachable through navigation via the dynamic `GET /navigation` payload
(though it remains reachable by direct URL). The static fallback
`Shell.tsx:59` has the same `requiredRoles: ['admin']` defect.

Backend inconsistency amplifying this: `get_current_user_with_tenant`
(`dependencies.py:95`) accepts `"Super Admin" in roles or "admin" in roles`,
while `require_admin` (`rbac.py:87`) only accepts `"Super Admin"`.

### 3.6 P2-002 — /roles returns empty (system roles invisible)

Location: `app/services/role_service.py:15-22`.

`list_roles` filters `WHERE deleted_at IS NULL AND tenant_id = %s`. The 6 system
roles (`Super Admin`, `Tenant Admin`, `Data Analyst`, `Migration Lead`, `Team
Member`, `Viewer`) live in `platform.roles` with **`tenant_id = NULL`**, so the
tenant-scoped filter excludes them. Live probe:
`GET /roles` → `{"roles":[],"total":0}`. → Roles admin tab always shows empty.

### 3.7 P2-003 — currentUser contract gap: never provided by AuthProvider

Locations:
- `src/types/auth.ts:26` declares `currentUser?: User | null`.
- `src/context/AuthContext.tsx:157` provider value is `{ ...state, userRoles, tenantId, login, logout, switchRole, refetchUser }` — it contains `user`, NOT `currentUser`.

Consumers destructure `currentUser` and cannot be satisfied:
- `RegistrationsPage.tsx:28,110,137,187` — `currentUser?.role !== 'super_admin'`
  always evaluates truthy (undefined) → **Convert buttons permanently disabled** even
  for Super Admin. Note also the role name mismatch: `'super_admin'` vs actual
  `'Super Admin'`.
- `ApprovalDetailPage.tsx:10,114` — `approval.assigned_to === _currentUser?.email` is
  always false → approval action gating broken.
- `WelcomePage.tsx:29,34`, `ApprovalsPage.tsx:14`, `InvitationsPage.tsx:18` —
  same contract gap.

### 3.8 P2-004 — Registration status lifecycle contradiction

- Leads are inserted without an explicit `status` → default `'active'`
  (`OC-COM-001f` migration default).
- List+convert query requires `status = 'pending'` (`admin_registration_routes.py:31,89`).
- `core.leads` CHECK constraint allows `('active','inactive','converted','archived')`
  — `'pending'` is not even valid → conversion path can never reach a row.

→ Even after fixing P1-002, pending registrations would never surface and the
convert flow cannot transition a lead through `pending`.

### 3.9 P2-005 — Invitations backend is Super-Admin-only in a tenant-scoped world

Location: `app/api/routes/invitation_routes.py` (all handlers `Depends(require_admin)`).

`require_admin` requires `"Super Admin"` role (`rbac.py:87`). The Tenant Admin
receives 403 on `GET /invitations`, `POST /invitations`, `PATCH/POST resend`, `DELETE`.
→ The Admin → Invitations workflow shown to Tenant Admin in the frontend cannot
function. Presented as a gating/authorization inconsistency rather than a bug fix
(tenant-scoping a first admin invitation is a product decision).

### 3.10 P3-001 — Test suite health (baseline)

`npm run test` → **19 failed files / 44 failed tests / 2 failed suites** (out of 54
files, 348 tests). Root causes observed:
1. P1-001 cascades: `AdministrationPage` transform failure breaks every test that
   transitively imports it (App.test.tsx, DashboardPage, GovernancePage, etc.).
2. Test/implementation drift: `GovernancePage` tests expect an `approvals` tab
   (`Unable to find role="tab" and name /approvals/i`) that the current page does not
   render.
3. Missing provider: `MigrationDatasetsPage.test.tsx` throws
   `useAuth must be used within AuthProvider`.
4. Suite-level: `e2e/login.test.ts` (Playwright spec executed under Vitest) and
   `PermissionGuard.test.tsx` (transform error from P1-001).

### 3.11 P3-002 — Duplicate import in AdministrationPage

`AdministrationPage.tsx:4` and `:19` both `import { apiPost } from '../utils/apiClient'`.
Redundant (harmless to runtime, fails lint cleanliness).

### 3.12 P3-003 — /permissions write surface too broad

`PUT /permissions` and `POST /permissions/reset` return 200 for Tenant Admin as well
as Super Admin (verified live). If the intent is Super-Admin-only mutation, an admin
scope check is missing; flagging for product confirmation.

---

## 4. ROLE MATRIX (verified live)

ENDPOINT                            SUPER ADMIN   TENANT ADMIN
GET  /users                         OK (scoped)    OK (scoped)
GET  /invitations                   OK (all)       403
GET  /permissions                   OK             OK
PUT  /permissions                   OK             OK (see P3-003)
POST /permissions/reset             OK             OK (see P3-003)
GET  /roles                         OK (empty!)    OK (empty!)
GET  /settings / flags              OK             OK
GET  /admin/registrations           500            500
POST /admin/registrations/*/convert 422 (no auth)  422 (no auth)
POST /admin/cache/clear             404            404
GET  /governance/audit              OK             OK
GET  /navigation                    OK             OK (admin group hidden for all — P2-001)

---

## 5. BUILD & TEST BASELINE

BUILD (tsc -b && vite build):      FAIL — TS2657 JSX sibling error (P1-001)
TESTS (npm run test):              44 failed | 304 passed | 2 failed suites
  Failed files (19): App, DashboardPage (+integration), GovernancePage (+integration),
  MigrationDatasetsPage, MigrationPage, MigrationProjectsPage, MigrationSchedulesPage,
  SystemsPage.integration, TaskManagementPage (+integration), UsersPage.integration,
  ValidationDiscoveryPage, ValidationResultsPage, Shell, Layout,
  PermissionGuard (suite: transform), e2e/login (suite: Playwright-under-Vitest).

---

## 6. POSITIVE CONFIRMATIONS

- Feature-flag integration is healthy: frontend hook calls `/settings/flags/list`
  (correct) — the `/feature-flags` 404 earlier observed was a probe against the wrong
  path, not an app defect.
- `/users`, `/settings`, `/governance/reconciliation`, `/governance/audit`, `/health`
  all return correct payloads for both roles.
- `src/routes/administration/RegistrationsPage.tsx` correctly calls
  `/admin/registrations` and `/admin/registrations/{id}/convert` (the failures are
  backend-side).
- Backend auth base is sane: `get_current_user_with_tenant` resolves tenant scoping
  and role names match DB (`platform.roles`).

---

## 7. RECOMMENDED REMEDIATION ORDER

1. P1-001 (build) — wrap `UsersTab` non-empty return in `<>...</>` (one-line fix).
2. P1-002/003/004 + P2-004 (admin registrations) — align leads schema/status contract:
   add `converted_to_tenant`/`converted_at` or drop them; add auth dependencies;
   decide `pending`/`active` lifecycle; remove the dead cache-clear call or implement
   a backend route.
3. P2-001 (nav visibility) — either add `Super Admin`/`Tenant Admin` to
   `requiredRoles` server-side (navigation_routes) and Shell default, or map role
   names at the filter layer.
4. P2-002 (/roles) — include `tenant_id IS NULL` system roles in `RoleService.list_roles`.
5. P2-003 (currentUser) — alias the provider to expose `currentUser` (or migrate
   consumers to `user`), and normalize role-name comparison (`Super Admin`).
6. P2-005 / P3-003 — product decision on Super-Admin-only vs Tenant-Admin scoped
   invitation/permission mutation.
7. P3-001 — re-run tests after P1-001; fix GovernancePage test expectations +
   `MigrationDatasetsPage` provider wrapper + move `e2e/login` out of Vitest scope.

---

## 8. TRACEABILITY

CONTRACT EXTRACT:  `_audit_api_calls.py`
LIVE PROBES:       `_audit_admin_api.py`
SCHEMA CHECKS:     `_audit_diag.py`, `_audit_diag2.py`, `_audit_roles.py`
BUILD:             `npm run build` (frontend-mvp)
TESTS:             `npm run test` (frontend-mvp)
EVIDENCE FILES:    `C:\Users\devwork\AppData\Local\Temp\opencode\test_output.txt`