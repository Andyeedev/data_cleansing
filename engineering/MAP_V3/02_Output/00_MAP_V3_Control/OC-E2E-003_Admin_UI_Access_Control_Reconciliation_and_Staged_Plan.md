# OC-E2E-003 — Admin UI & Access-Control: Codebase Reconciliation + Staged Implementation Plan

**Status:** Reconciliation only. No code changed, no commit.
**Baseline spec:** `engineering/MAP_V3/TODO/Admin_UI_Specification/MAP_Nexus_Admin_UI_Access_Control_Specification.md` (v1.0) — authoritative.
**Method:** Live-code inspection of backend (`app/`) and frontend (`engineering/MAP_V3/03_Source/frontend-mvp/src/`). All file/line references verified against current working tree.

---

## 1. Current role model vs proposed canonical roles

### What exists today

**Database-seeded system roles** (`MAP_V2/03_Source/database/seed_platform_data.sql:9-15`, `platform.roles` — `type='system'`, `is_system=TRUE`):

| Seed name | Seeded role_permissions |
|---|---|
| Super Admin | **All** permissions (`seed_platform_data.sql:99-100`) |
| Tenant Admin | none |
| Migration Lead | none |
| Data Analyst | none |
| Team Member | none (also `is_default=TRUE`) |
| Viewer | none |

**Backend role enforcement** (sparse, inconsistent):
- `require_admin` (`app/api/core/auth/rbac.py:83-103`) checks literal DB role `'Super Admin'` only.
- `require_role` (`rbac.py:49-80`) by name; used nowhere today.
- `resolve_tenant` (`app/api/core/auth/dependencies.py:87-99`) treats either `'Super Admin'` **or** `'admin'` as the cross-tenant principal.
- `get_current_user_with_tenant` (dependencies.py:63-84) — the de-facto gate for most business routes (any authenticated user of an ACTIVE tenant).

**Frontend role vocabulary** (a second, conflicting taxonomy):
- `RoleSwitcher` (`components/RoleSwitcher/RoleSwitcher.tsx:3`) hardcodes `['admin','manager','operator','viewer']` and calls `switchRole` which only rewrites local state (`AuthContext.tsx:117-124`); no backend call.
- Route guard for all of `/administration/*` uses `requiredRoles={['admin']}` (`AppRoutes.tsx:181`) — **this blocks real `Super Admin` users**, because the JWT/`/auth/me` role is `'Super Admin'`, never `'admin'`.
- Nav `DEFAULT_NAV` (Shell.tsx:59-71) tags every admin child `['admin']`.
- Per-page self-guards mix vocabularies: `r === 'admin' || r === 'Super Admin' || r === 'Tenant Admin'` (AdministrationPage.tsx:49, GovernancePage.tsx:167, MigrationPage, DiscoveryPage, DiscoveryTreeTablePage, MappingSpreadsheetPage), `'admin' || 'Super Admin'` (ControlDependenciesPage, ConnectionDiagnosticsPage, SettingsPage, SystemDetailPage).
- `permissionGuard.ts:22-30` hardcodes `'admin'/'manager'/'compliance-officer'`.
- Report-pack gating uses **only `userRoles[0]`** against a `'admin'/'manager'/'operator'/'viewer'` matrix (`reports/ReportSuitePage.tsx:143`).

### Reconciliation

| Spec canonical | Current backend name | Current frontend string(s) | Global vs tenant |
|---|---|---|---|
| Super Admin | `Super Admin` ✅ | `'admin'` (RouteSwitcher/nav), `'Super Admin'` (self-guards) — split | Platform/global |
| Tenant Admin | `Tenant Admin` ✅ | `'admin'` (nav/route), `'Tenant Admin'` (self-guards) | Tenant |
| Migration Lead | `Migration Lead` ✅ | `'manager'/'operator'` (report matrix) | Tenant |
| Data Analyst | `Data Analyst` ✅ | `'operator'` (matrix) | Tenant |
| Team Member | `Team Member` ✅ | — | Tenant |
| Viewer | `Viewer` ✅ | `'viewer'` ✅ | Tenant |

**Finding:** backend seed names are already close to the canonical model; the defects are (a) the **frontend `admin/manager/operator/viewer` alias layer** (RoleSwitcher, nav `requiredRoles`, route guards, pack matrix) and (b) **two `require_admin` semantics** (`'Super Admin'` only in rbac, vs `'Super Admin' or 'admin'` in resolve_tenant).

**Required work (Stage A):** normalize frontend to the seed names; route/nav/guard checks change from `'admin'` to a canonical-admin resolver; `switchRole` must not fabricate roles for security decisions (spec §7 explicitly warns against a second taxonomy).

---

## 2. Current permission stores and the authoritative source

Two parallel stores exist — the exact duplication the spec prohibits (§2.6).

### Store 1 — `platform` RBAC (resource:action) — **the authoritative one per spec §8**
- Tables: `platform.permissions` (`name, resource, action, category, is_system`), `platform.role_permissions` (`role_id, permission_id, granted, conditions`), `platform.user_roles` (`user_id, role_id, assigned_at, assigned_by, expires_at, is_temporary`).
- Seeded permissions (`seed_platform_data.sql:22-93`): `users.*`, `roles.*`, `workflows.*`, `tasks.*`, `calendar.*`, `approvals.*`, `settings.*`, `migrations.*`, `systems.*`, `reports.*`.
- Enforced via `require_permissions` (rbac.py:7-46), which resolves the user's grants through active roles + tenant scope. **Used today only by** approvals, calendar, notifications (`tasks:*`), tasks routes.
- `app/services/role_service.py` + `app/api/routes/role_routes.py` manage roles and permission assignment against this store.

### Store 2 — `core.role_permissions` — **the legacy report-pack matrix**
- `core.role_permissions (role_name, pack_key, enabled)` with pack keys `operational, executive, validation_pack, governance_pack, audit_pack`.
- Edited by the current Admin `PermissionsPage` and `PUT /api/v1/permissions` (`permissions_routes.py:65-80`); reset endpoint re-seeds the `admin/manager/operator/viewer` defaults (`permissions_routes.py:83-104`).
- **Consumed for reports**: `ReportSuitePage` merges this matrix onto a fallback map and hides packs by `userRoles[0]`.

### Reconciliation & decision

- **Adopt `platform` (resource:action) as the single authoritative store.** It is the only one with a backend-enforced path (`require_permissions`), matches the spec's resource/action vocabulary, and already has `role_service` CRUD.
- `core.role_permissions` and the pack matrix become a **report-pack projection** of the platform store (packs ⇒ permission lists), not an independent grant table. Keep `GET/PUT /permissions` endpoints working during Stage A by backing them with the platform store, then retire `core.role_permissions`.

### Genuine data gaps in the authoritative store (must be filled during Stage A)
- Only Super Admin has any grants; other system roles have **zero** permission rows — flipping enforcement on would lock out every non-SA user.
- Spec §8 resources **do not exist** as seeded permissions: `invitations.*`, `registrations.*`, `tenants.*`, `security.*`, `maintenance.*`, `subscriptions.*`, `projects.*` (as separate resource), `systems:test`, `reports.validation:view/export`, etc. Seed additions are required (see §7).
- `require_permissions` currently does **not** filter by `rp.granted` (it ignores the column) and no longer checks `r.is_system`/role `type`; confirm semantics during Stage A implementation.

---

## 3. Current `requiredRoles` / `capabilityId` usage

### `requiredRoles`
- Route guard: `ProtectedRoute` (`components/ProtectedRoute.tsx`) — `requiredRoles.some()` on role strings; the whole app is behind one at AppRoutes.tsx:102, the admin subtree behind `['admin']` at :181. **No route uses `requiredPermissions`**, even though the API supports it.
- Nav: `DEFAULT_NAV` (Shell.tsx) and backend `MOCK_NAV_ITEMS` (`app/api/routes/navigation_routes.py`) both carry `requiredRoles`; `filterByPermissions.ts` (17 lines) filters nav by role-name match recursively. Server nav **replaces** DEFAULT_NAV when `/api/v1/navigation` succeeds (Shell.tsx:94-96).

### `capabilityId`
- **Defined, never consumed.** Field exists in `types/metadata.ts:3` and is set throughout `MOCK_NAV_ITEMS` (`admin.userManagement`, `admin.roleManagement`, `admin.tenantManagement`, `admin.systemSettings`, `admin.featureFlags`, `admin.securityManagement`, `admin.maintenanceHealth`, `platform.notificationServices`; full set in `src/temp_nav.txt`). The frontend never reads it for visibility, gating, or labels.

### Reconciliation
- Spec §8: permission → drives nav visibility, routes, API, objects, reports. `requiredRoles`/`capabilityId` may remain **temporarily as frontend projections** while migrating (§8 note), but the projection source must become the effective-permission envelope (§3 of spec), not hardcoded role strings.
- Stage B will map each rail item and card to a **capability** (reusing `capabilityId`) and the route guard to the capability's permission — so `requiredRoles` becomes derived, not literal.
- Server nav currently carries the most complete capability catalog (11 admin children incl. invitations/registrations/missing in DEFAULT_NAV). Keep **both nav sources** consistent during the transition; converge on the server nav + capability resolution.

---

## 4. Current backend authorization gaps

Verified against route files:

1. **`role_routes.py` (critical)** — every endpoint uses `Depends(get_current_user_with_tenant)` only (`:36,48,58,70,79,90,102,111,119`). Any authenticated tenant user can create/update/delete roles and assign permissions. Must require `roles.*` permissions (SA/TA boundary).
2. **`user_routes.py` (critical)** — the same: all `get_current_user_with_tenant` (`:42,55,65,84,93,104,116,125`). Any authenticated tenant user can create/update/delete users and assign roles. Must require `users.*` (+ seat-limit checks already partially present).
3. **`admin_registration_routes.py` (critical)** — `GET /api/v1/admin/registrations` and `POST /convert` have **no auth dependency at all** (`admin_list_registrations(request)`, `admin_convert_lead(...)`); only IP rate-limiting. Must require Super Admin (spec: Registrations = Super Admin boundary).
4. **`invitation_routes.py`** — already uses `require_admin` (only SA). Spec wants Tenant Admin to invite within its tenant → needs a **Tenant-Admin-compatible** gate (e.g., `invitations:create` SA/TA), not SA-only. Decision required.
5. **`tenant_routes.py`** — `require_admin` (SA-only) on tenant CRUD + subscription change — correct per spec (tenants = SA boundary) and can stay; but `get_tenant`/plan reads should become entitlement/permission-aware for TA visibility of its own tenant.
6. **`require_permissions` enforcement coverage** — only approvals/calendar/notifications/tasks. **Zero** admin-surface endpoints use it. Spec §13 wants a 4-layer check; the decorative permission model must be made real.
7. **`require_entitlement` coverage** — only `execution_routes.py:20` and `operations_execution_routes.py:32` (`"migration"`). Admin/report/dashboard features are not entitlement-gated yet.
8. **`resolve_tenant`** (dependencies.py:95) accepts `'admin'` as Super-Admin-equivalent for cross-tenant — contradicts the canonical model; must become `'Super Admin'` only.

**Pattern to standardize (Stage A):** `require_permissions("resource:action")` as the gate + `require_administrator` helper (SA or TA with delegation) for admin surfaces + `require_entitlement` layered on top, mirroring the spec pipeline.

---

## 5. Current tenant / subscription / entitlement implementation

### Tenant
- `core.tenants` extended by commercial schema (`OC-COM-001a_commercial_schema.sql`): `plan_id`, `billing_email`, `max_users=5`, `max_projects=3`, `max_connections=5`, `metadata JSONB`, `updated_at`. No `status` CHECK constraint; status values in use: `ACTIVE`, `SUSPENDED`, `BLOCKED`.
- JWT-only tenancy (DEV-003, `tenant_middleware.py:14-29`): `X-Tenant-ID` and `?tenant_id=` never establish tenancy; DB row must be `ACTIVE` else 403 (`:54-58`). Skip paths listed (`:6-11`).
- `tenant_repository.py::update_tenant` whitelist includes `status, max_users/max_projects/max_connections, plan_id`.

### Plans & subscriptions
- `platform.plans`: tiers `professional/enterprise/enterprise_plus` (+ `government/msp/oem/foundation` in CHECK), `entitlements JSONB`, `max_users/projects/connections`, `monthly_price/annual_price`, `status`. Seeds carry entitlements e.g. professional `{"migration":true,"data_quality":true,"discovery":true,"reporting":"basic","support":"standard"}`.
- `platform.subscriptions`: `status` CHECK `active/trialing/suspended/cancelled/expired/pending` — **but** code uses `pending_cancellation` and `past_due`, which are not in the CHECK (schema drift, noted in repo). `subscription_repository`: create/trial(30d)/active (incl. `pending_cancellation`)/cancel.

### Entitlement enforcement
- `app/middleware/entitlement_middleware.py`: `DEFAULT_ENTITLEMENTS` per tier (`professional/enterprise/enterprise_plus`); `get_tenant_entitlements` returns `set(entitlements.keys())` of the current active/trialing/past_due/pending_cancellation subscription's plan, falling back to `DEFAULT_ENTITLEMENTS[tier]`; `require_entitlement(feature)` is a proper FastAPI sub-dependency (tenant from JWT, DEV-009); `check_entitlement`.

### Frontend
- `auth_routes.py:/auth/me` (`:74-145`) returns `roles`, `tenant_id`, and `subscription { plan_tier, plan_name, status, trial_end_date, billing_cycle, end_date, limits.{projects,users,connections} = {current,max} }` computed live (project/system/user counts).
- `hooks/useSubscription.ts` consumes it; helpers `isAtLimit/isNearLimit/usagePercent/daysUntilTrialEnd`. Used by `/billing/*` and `DashboardPage` limit tiles. **`/auth/me` itself needs `get_current_user_with_tenant`** (currently `:74`) — this is what populates roles/tenant/subscription for the UI.
- **Bug to note:** frontend `AuthContext.login/refetchUser` map `permissions` to hardcoded `['read']` (AuthContext.tsx:93-100) and default roles to `['viewer']` when absent.

### Reconciliation vs spec §9/§12
- Spec pipeline (Identity AND Role-Permission AND Entitlement AND Tenant/Object-scope) is **architecturally supported** by `require_permissions` + `require_entitlement` + JWT tenant + SQL tenant scoping — the pieces exist but are barely wired (only 2 entitlement checks, ~20 permission checks). Stage A is a wiring task, not a rewrite.
- Entitlement **keys** in plan seeds must cover the features the UI will gate (reporting, audit_trail, reconciliation, governance) — align the canonical entitlement catalog in Stage A.
- `subscriptions.status` CHECK drift (`pending_cancellation`, `past_due`) must be resolved in the schema-change review (§7).

---

## 6. Current Administration routes/pages and reuse inventory

### Routes (`AppRoutes.tsx:181-198`, inside `requiredRoles={['admin']}`)
`/administration`, `/administration/users`, `/users/new`, `/users/:id`, `/roles`, `/roles/new`, `/roles/:id`, `/tenants`, `/settings`, `/permissions`, `/feature-flags`, `/security`, `/notifications`, `/maintenance`, `/invitations`, `/registrations`.

Rail (spec §4.1) needs a **Subscriptions** section — currently only `/billing/subscription`, `/subscription/plans`, `/billing/success|cancel` exist (`AppRoutes.tsx:110-113`); no admin subscription page.

### Pages today
| Page | File | Data source | Notes / reuse |
|---|---|---|---|
| Administration lander | `routes/AdministrationPage.tsx` | audit log fetch | `TabBar` Overview/Users/Roles/Settings/Feature Flags/Security/Maintenance, `InvitationModal`; superseded by Mission Control landing (Stage B) |
| Users | `administration/UsersPage.tsx`, `UserDetailPage.tsx` | `useUsers` → `/api/v1/users` | reusable table/cards; CSS-var era |
| Roles | `administration/RolesPage.tsx` (191 L), `RoleDetailPage.tsx` | `useRoleList`/`useDeleteRole` → `/api/v1/roles` | reusable; system-role delete guarded |
| Tenants | `administration/TenantsPage.tsx` (71 L) | **`/rules/tenants` (WRONG SOURCE)** | returns only `{tenant_id, tenant_name}`; renders hardcoded `StatusPill="Active"`; **must re-point to `/api/v1/tenants`** (full shape incl. plan/limits) for Stage D/E |
| Permissions | `administration/PermissionsPage.tsx` | `GET/PUT/POST /api/v1/permissions` (pack matrix) | legacy matrix UI; rewrite target against platform store (Stage A/E) |
| Settings | `routes/SettingsPage.tsx` (maps to `/administration/settings`) | `useSettingList`/`useUpdateSetting` + `useFeatureFlagList`/`useUpdateFeatureFlag` | tabs System Settings / Feature Flags; reusable hooks |
| Feature Flags | `administration/FeatureFlagsPage.tsx` | local | `FlagCard` (ReportCard + checkbox + StatusPill + rollout%) |
| Security | `administration/SecurityPage.tsx` | `useAuth` | identity readout only; real security actions → Stage E |
| Notifications | `administration/NotificationsPage.tsx` | `useHealth` | monitor KpiBoxes; delivery "Armed" |
| Maintenance | `administration/MaintenancePage.tsx` | `useHealth` | health checks |
| Invitations | `administration/InvitationsPage.tsx` | raw `apiGet('/invitations')` | modal, resend/revoke; ok |
| Registrations | `administration/RegistrationsPage.tsx` | raw `apiGet('/admin/registrations')` | convert-lead; **backend now unauth** → tighten in Stage A |

### Reusable components (verified surfaces)
- Scaffold: `PageContainer` (`{children, maxWidth?, padding?, className?}`), `PageHeader` (`{title, description?, actions?, backLink?}`).
- Shared barrel `components/shared`: `StatusBadge, ProgressBar, DataTable, MetricCard, EmptyState, ErrorState, LoadingSkeleton, SearchBar, Pagination, Modal, ConfirmDialog, ToastContainer/toastService, TabBar, SplitPane, TenantFilter`.
- Report widgets (reportWidgets.tsx): `KpiBox, ReportCard, StatusPill, BarList, ScoreBar, EmptyState, LineChart`.
- Layout/nav for the console shell: `Layout`, `DynamicNavigation` (+ `filterByPermissions`), `TenantFilter`.
- Hooks: `useSubscription`, `useHealth`, `useUsers`, `useRoleList/useDeleteRole`, `useSettingList/useUpdateSetting`, `useFeatureFlagList/useUpdateFeatureFlag`; `useTenants` (must be **replaced** with the full tenant source).
- **No shared admin layout** exists (each page self-contains); two style eras (CSS-var vs Tailwind) coexist — Stage B introduces the `AdminConsole` shell to unify.

---

## 7. Database changes genuinely required

Goal: minimal, canonical, no "make-the-UI-work" migrations (§17). Changes split into **seed/data** vs **schema**:

### Seed/data (authoritative permission store must be populated for enforcement to be safe)
1. **`platform.permissions` additions** for spec §8 resources missing today: `invitations` (`view,create,revoke`), `registrations` (`view,convert`), `tenants` (`view,create,suspend,edit`) — already partially intended but not seeded for roles; `security`, `maintenance`, `subscriptions` (`view,manage`), `projects` (`view,create,edit,delete`) as an admin resource, `systems:test`, `reports.*` (incl. `reports.validation:view/export`), `roles:assign`.
2. **`platform.role_permissions` grants for all system roles** (currently only Super Admin). Tenant Admin: `users:*`, `roles:*` (bounded), `invitations:*`, `settings:update`, tenant-scoped admin perms. Migration Lead/Data Analyst/Team Member/Viewer: read + operational subsets per spec §7 matrix.
3. **(If appropriate) pack→permission mapping** so the legacy report matrix projects onto the platform store — can be a seed table or in-repo constant; avoid a parallel table where a constant mapping in `role_service`/report service suffices.

### Schema (only if truly needed — to be confirmed in Stage A):
4. **`platform.subscriptions.status` CHECK** — currently allows `active,trialing,suspended,cancelled,expired,pending` but code emits `pending_cancellation`/`past_due`. Genuine correctness fix; align CHECK with the codes the code and middleware actually use (this existing drift otherwise blocks clean entitlement queries).
5. **`core.tenants.status`** — add CHECK or enum for `ACTIVE/SUSPENDED/BLOCKED` if we tighten status handling; alternatively keep as-is (middleware only treats non-`ACTIVE` as blocked). **Prefer no-op here** unless Stage A finds a concrete defect.
6. **`platform.role_permissions`** — decide whether to add `granted` handling (column already exists; `require_permissions` currently ignores it). No migration needed if we start honoring the existing column.

### Explicitly NOT required
- No new permission store, no `core.role_permissions` schema change (we retire it by projection), no plan/entitlement table redesign, no new tenant table. Spec §20 non-goals honored.

**Process guardrail (§17.4):** any of 4-6 triggers a file-level SQL + migration plan for approval **before** Stage A implementation; item 1-3 are seed updates reviewed alongside.

---

## 8. Stage A–F implementation plan (dependencies + verification)

Each stage is a reviewable unit (spec §17/§19 "Do not implement all stages in one uncontrolled change").

### Stage A — Access-control foundation
**Dependencies:** none (foundation). **Order matters:** A1 → A2…A4.

1. **Canonical role normalization (A1).** 
   - Backend: `require_admin`/`resolve_tenant` accept only `'Super Admin'`; remove `'admin'` shortcut.
   - Frontend: replace literal `'admin'` checks (`ProtectedRoute`, `DEFAULT_NAV` requiredRoles, RoleSwitcher, permissionGuard, pack matrix, page self-guards) with canonical-admin + capability resolution; disable `switchRole` security effects.
2. **Permission store consolidation (A2).** Make `platform` store authoritative; back `GET/PUT /permissions` (pack matrix) with the platform store; seed missing permissions + role grants (§7.1-7.3); start honoring `role_permissions.granted`.
3. **Authorization hardening of existing routes (A3).** Close §4 gaps: `user_routes`, `role_routes` → `require_permissions('users:*' / 'roles:*')`; `admin_registration_routes` → Super Admin gate (+ optional `require_entitlement`); fix `invitation_routes` gate to allow Tenant Admin where the spec says; standardize admin-surface gate helper.
4. **Entitlement wiring + entitlement catalog (A4).** Unify plan-seed entitlement keys with the canonical catalog; add `require_entitlement` to admin/report/dashboard endpoints as needed; confirm tenant-scope enforcement at object/query layer.

**Verification (A):** `tsc --noEmit`; frontend `npm run build`; backend `pytest`; RBAC matrix test (who can access each admin surface); tenant-isolation test (TA can't cross tenant, incl. `?tenant_id=` attempt); entitlement rejection test (feature not in plan → 403 even with permission); assert **no** frontend-only gate remains the sole control. **Acceptance:** spec §18 bullets 3, 8, 9, 10, 12, 14.

### Stage B — Administration shell
**Depends:** A (it must read the effective envelope for rail/card visibility).

1. `AdminConsole` layout: persistent rail (spec §4.1 list incl. **Subscriptions**) + detail pane + breadcrumb `Administration → Section → Detail`.
2. Mission Control landing for `/administration` (spec §5): cards for Governance posture, Access capacity, Entitlements vs plan, Security & health, Role & permission matrix, Pending registrations/alerts, Quick actions — reusing shared components.
3. Rail/card visibility + route guard derive from capability resolution (spec §8/§13): nav checks, routes check, API checks, query scopes.
4. Re-point `TenantsPage` to the real tenant source; unify style era; remove per-page `TabBar` duplication.

**Verification (B):** shell renders on every admin route; rail/cards match effective scope (SA sees all, TA sees bounded, Viewer sees none); a card navigates to its console pane; direct-URL to a hidden section renders gated state, never data; build + tests.

### Stage C — Tenant context
**Depends:** A (envelope + scope), B (shell to hold the switcher).
*NOTE: spec confirms the tenant dropdown is in scope; the earlier user instruction "do not implement the tenant dropdown yet" is superseded where it conflicts, but confirm scope/priority with the product owner before this stage.*

1. Super Admin switcher: `All Tenants` (aggregate, clearly labeled) + tenant list; selection changes working scope, not role.
2. Tenant Admin: locked to own tenant — non-switchable selector/label, no cross-tenant picker, no `?tenant_id=` escape.
3. Context propagation: selected tenant persisted to API/query context (server-enforced) and refreshes dashboard KPIs, users, projects, systems/connections, reports, findings/audit, entitlement/usage (§6 context behavior).
4. Audit: cross-tenant context switches where appropriate (§15).

**Verification (C):** SA aggregate vs scoped views return correct scoped data; TA attempts to pass `?tenant_id=` of another tenant → 403; refresh semantics verified per grouped surface; tests + build.

### Stage D — Dashboard data
**Depends:** A (entitlements/permissions), B (cards surface), C (tenant context feeds KPIs).

1. Capacity (users/projects/connections used/allowed) from subscription limits — reuse `useSubscription`.
2. Entitlements vs plan panel (enabled/limited/upgrade) — from entitlement catalog.
3. Governance posture + findings/alerts counts; Security & health; Role & permission matrix; Pending registrations/operational alerts; Quick actions (all permission/entitlement-aware).
4. Refresh mechanism: aggregate endpoint or batched hooks with consistent "last refreshed" indicator; avoid chatty calls (§14).

**Verification (D):** each panel shows correct, live data under SA/TA/Viewer; a disabled action cannot bypass backend authorization; charts kept minimal (KPI/progress/status, small trends only).

### Stage E — Admin sections
**Depends:** A (gates), B (shell routing), D (data patterns).
Per section: Users, Roles & Permissions, Invitations, Registrations, Tenants, **Subscriptions (new admin page)**, Settings, Feature Flags, Security, Notifications, Maintenance — migrate each to the console detail pane, canonical permission gating, entitlement-aware affordances, and (where applicable) audit events (§15).

**Verification (E):** section-by-section matrix test (route, API, entitlement, tenant scope, audit); existing pages preserved/reused where possible.

### Stage F — Verification (overall)
**Depends:** A-E.
1. `npm run build` + `tsc --noEmit`; backend test suite; targeted component/integration tests.
2. **RBAC matrix:** every system role × every admin surface (acceptance §18.7/§18.10).
3. **Tenant isolation:** SA cross-tenant, TA locked, route/API escape attempts blocked.
4. **Entitlement checks:** gate matrix vs plan tiers (§18.8).
5. **Audit evidence:** security-sensitive admin actions logged (actor/tenant/action/target/timestamp/outcome).
6. Regression: previously working routes/services unchanged unless the spec explicitly changed them (§18.13).

**Gate:** each stage reviewed (this plan or per-stage) before the next; no uncontrolled single change; no commit of unrelated cleanup (§17.8).

---

## Summary of must-fix before any implementation
1. Seed the authoritative `platform.permissions` + `role_permissions` (currently SA-only grants).
2. Decide `invitation_routes` Tenant-Admin boundary; secure `user_routes`/`role_routes`/`admin_registration_routes`.
3. Remove the frontend `admin/manager/operator/viewer` alias vocabulary.
4. Re-point TenantsPage to `/api/v1/tenants`.
5. Resolve `subscriptions.status` CHECK drift.
6. Build AdminConsole + Mission Control on top of the effective-permission envelope (spec §4/§5).

*This document is a reconciliation artifact only: no code modified, nothing committed.*