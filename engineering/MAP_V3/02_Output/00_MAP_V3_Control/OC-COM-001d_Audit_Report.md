# OC-COM-001d Audit Report

**DATE:** 2026-09-08
**SPEC:** OC-COM-001d SaaS Customer Experience & Frontend Implementation (chat-issued 2026-09-08)
**BASELINE:** OC-COM-001c (APPROVED / CANONICAL)
**MODE:** AUDIT FIRST — no code modified. All findings verified by repository-wide inspection (4 parallel audits).
**NOTE:** A stale unapproved draft `OC-COM-001d_SaaS_Customer_Experience.md` (written 2026-09-07, pre-spec) exists in this folder — see DEV-012. It is NOT the implementation plan.

---

## A. Executive Finding

**READY WITH DEVIATIONS**

The customer journey is ~80% buildable from existing parts: every onboarding step except Welcome has a working page + API (Projects list, Systems, Discovery, Datasets, Mapping spreadsheet, Validation Centre, Results, ReportSuite). Subscription/billing backend (001b) is complete and reusable. Three deviations require explicit decisions before implementation: **DEV-001** (system_registry dual ownership — DDL says Project, code says Tenant), **DEV-002** (no `discovered_tables` model — `core.datasets` is System-scoped, `dataset_columns` Mapping-scoped), **DEV-003** (frontend + ~15 backend routes accept `?tenant_id=` overrides — 001c forbids client-established tenancy). No implementation until deviations are approved (§42 gate).

---

## B. Existing Architecture (summary)

- **Backend (`app/`):** raw-SQL repositories (psycopg2, no ORM/Alembic; manual `sql/schema/*.sql` + `OC-*.sql` migrations). Tenant/user/role/subscription/Stripe services complete. Projects read-only. Systems tenant-filtered, `project_id` ignored. Credentials encrypted, JOIN-isolated. Discovery/mapping/validation/reports engines complete; versions/templates/suites persistence + usage metering + purge jobs absent.
- **Frontend (`frontend-mvp/src/`):** ~50 routed pages under Shell+ProtectedRoute(auth-only), server-driven nav with permission filter, hooks per domain appending `?tenant_id=&project_id=`, ephemeral ValidationFilterContext only (no global project context), AuthContext with localStorage JWT + hardcoded roles. Zero billing/subscription/onboarding files.
- **Security:** JWT (cookie + Bearer fallback) with token_version, lockout 5/15, password policy on change only, RBAC present; tenant middleware + entitlement middleware exist but UNWIRED; `?tenant_id=` trusted almost everywhere; no project-A-vs-B tests.

---

## C. Frontend Audit

| Area | Status | Existing Location | Reuse | Required Change |
| ---- | ------ | ----------------- | ----- | --------------- |
| Routes | EXISTS | `src/AppRoutes.tsx` (all app routes under ProtectedRoute+Shell) | Reuse as-is | Add `/subscription/*`, `/billing/*`, `/onboarding/*` inside Shell block |
| Dashboard | EXISTS | `routes/DashboardPage.tsx` + CascadeDropdowns | Post-onboarding landing | Add trial/usage banner, setup-progress card |
| Shell/nav/layout | EXISTS | `components/Shell/Shell.tsx`, `Navigation/DynamicNavigation.tsx`, `Layout/Layout.tsx`, Breadcrumb | Reuse frame | Inject onboarding/billing links (API or DEFAULT_NAV); NO project switcher in header — add one |
| Nav RBAC filter | EXISTS | `utils/filterByPermissions.ts`, `types/metadata.ts` | Reuse pattern for new items | None (UX-only) |
| Auth/session | PARTIAL | `context/AuthContext.tsx` (localStorage JWT, hardcoded `roles:['admin']`, client-only `switchRole`) | Reuse `useAuth()` shape | Consume real backend roles; remove hardcode + RoleSwitcher in prod; stop sending `?tenant_id=` (DEV-003) |
| API client | EXISTS | `utils/apiClient.ts` (Bearer, 401→`/session-expired`, retry) | Reuse for all new calls | NEW: typed clients for subscription/billing/usage/me |
| Project context | MISSING | — (only ephemeral `ValidationFilterContext`, 7 routes; CascadeDropdowns/TenantFilter local state elsewhere) | Lift ValidationFilter pattern | NEW: global `ProjectContext` (App-level, persisted selection, server-authorised project) |
| Projects UI | EXISTS | `routes/MigrationProjectsPage.tsx` (`/migration/projects`) | Reuse list + API | Wrap in onboarding step; no `/new` route — use modal |
| Connections UI | EXISTS | `SystemsPage` / `SystemDetailPage` / `SystemFormModal` / `ConnectionDiagnosticsPage` | Reuse directly (step 3) | Must receive active `project_id` (currently tenant-only) |
| Discovery UI | EXISTS | `DiscoveryPage` + `DiscoveryTreeTablePage`, `useDiscovery.triggerDiscovery(project_id)` | Reuse directly (step 4) | None expected |
| Datasets UI | EXISTS | `MigrationDatasetsPage.tsx` (`/migration/datasets`) | Reuse directly (step 5) | Confirm Project scoping after DEV-002 decision |
| Mappings UI | EXISTS | `MappingSpreadsheetPage.tsx` (`/migration/mappings/spreadsheet`) | Reuse directly (step 6) | None expected |
| Validation UI | EXISTS | `ValidationCentrePage`, `ValidationPage`, `ValidationRulesPage`, `ValidationDiscoveryPage` | Reuse directly (step 7) | None expected |
| Results UI | EXISTS | `ValidationResultsPage.tsx` (`/validation/results[/:batchId]`) | Reuse directly (step 8) | None expected |
| Reports UI | PARTIAL | `ReportsPage.tsx` (stub aliases) + `ReportSuitePage.tsx` (`/reports/suite/:section`, real) | Reuse `ReportSuitePage` (step 9) | Avoid stub aliases |
| Governance UI | PARTIAL | `GovernancePage.tsx` (8 routes, one component; Approvals/Calendar dead code) | Reuse shell | None for 001d P0–P2 |
| Admin UI | EXISTS | `AdministrationPage`, `UsersPage/Detail`, `RolesPage/Detail`, `PermissionsPage`, `SettingsPage` | Reuse | None for 001d P0–P2 |
| Profile/settings | EXISTS | `ProfilePage`, `UserSettingsPage`, `SettingsPage` | Reuse | None |
| Route guards | PARTIAL | `ProtectedRoute` (bare, auth-only everywhere), `permissionGuard`, `usePermissions`, pack permissions | Add `requiredRoles/Permissions` props per route | Frontend hiding only — backend authoritative |
| Subscription/billing UI | MISSING | Zero hits (`billing\|subscription\|stripe\|checkout`) | — | NEW pages (Sec 19–22 of spec) |
| Onboarding/welcome UI | MISSING | No `Onboarding*/Welcome*`; `HomePage.tsx` unrouted stub | — | NEW wizard orchestrating existing pages; delete or wire `HomePage` |
| Stepper/wizard component | MISSING | No wizard in `components/` | — | NEW shared stepper |

---

## D. Backend/API Audit

| Capability | Status | Existing Endpoint/Service | Required Change |
| ---------- | ------ | ------------------------- | --------------- |
| Tenant provision/admin | EXISTS | `tenant_routes.py`: POST/GET/PUT `/tenants`, GET `/tenants/plans`, GET+POST `/{id}/subscription`; `TenantService`/`TenantRepository` | Reuse; no DELETE (by design); suspension via PUT status |
| Current user | MISSING | Only `get_current_user[_with_tenant]` + `auth_routes.py` login/logout/change-password | NEW: `GET /me` (id, email, roles, tenant_id, subscription summary) for header/welcome |
| Users/Roles | EXISTS | `user_routes.py` CRUD + role attach (JWT tenant, soft-delete); `role_routes.py`, `permissions_routes.py` (global catalogue) | Reuse; invitations absent — out of 001d scope (note as future) |
| Plans/subscription | EXISTS | GET `/tenants/plans`; GET `/{id}/subscription` (active/trialing + trial_end); POST `/{id}/subscription` (cancel+create, updates tenant max_*) | Reuse; matches 001c one-current-subscription model |
| Trial | EXISTS | Auto-created `trialing` 30d in `create_tenant`; no dedicated endpoint | Reuse; expose via `/me` or subscription GET |
| Stripe billing | EXISTS | `billing_routes.py`: checkout/portal/webhook/invoices/upgrade/cancel; `stripe_service.py` (all webhook events → subs + `tenants.stripe_*`); `stripe_config.py` TIER_MAP | Reuse as-is; account/env is deployment work |
| Entitlements | PARTIAL | `entitlement_middleware.py` complete (plan JSON, `require_entitlement`) but zero usages, not mounted | Wire `require_entitlement` onto gated routes (DEV-009); enforce `max_*` (DEV-009) |
| Usage metering | MISSING | Zero (`usage/meter/quota` absent; only rule-stats, frontend AI quota) | Frontend contract + placeholders now; backend metering later (DEV-004) |
| Projects | PARTIAL | `migration_project_routes.py`: GET list/tenants/overview/`{id}` | Reuse reads; NEW: POST/PUT/DELETE + select/active + archive/complete (DEV-005) |
| Systems | PARTIAL | `system_routes.py`: full CRUD + test/health-check; `CreateSystemRequest` has NO `project_id`; service orphans `project_id=uuid4()`; all queries `WHERE tenant_id` | Converge to `project_id` scoping (DEV-001); NEW: accept+require `project_id` |
| Credentials | EXISTS | `credential_routes.py` CRUD (no GET-one); encrypted at rest; all methods `JOIN system_registry WHERE sr.tenant_id` | Reuse JOIN-guard; extend with `sr.project_id` after DEV-001 |
| Discovery | EXISTS | `discovery_routes.py`: summary/tree/tables, clear-all, `{batch}/datasets[/{id}]`, POST `/current {project_id}`, `{batch}/status`; service signature `(project_id, source, target)` | Reuse; `_resolve_tenant` pattern is the model to copy |
| Datasets | PARTIAL | Via discovery `{batch}/datasets` + `migration_dataset_routes.py`; `core.datasets` System-scoped | Resolve per DEV-002; do NOT fork a second model |
| Mapping | EXISTS | `mapping_routes.py`: summary/schema/columns(+/all), auto-map, bulk save, validate, clear-pair/clear-all, `/{project_id}`(+/auto), `/{mapping_id}`(+/columns/validate) | Reuse; versions/history absent — defer unless trivial (note) |
| Validation | EXISTS | `execution_routes.py` (run/status), `operations_execution_routes.py` (run/runs/re-execute/cancel), `execution_control_routes.py` (cancel/pause/resume/retry/lifecycle/progress), `rule_execution_routes.py` (rules/results/fix-options/apply-fix), `rule_registry_routes.py`, `execution_history_routes.py`, `control_routes.py` | Reuse all; no parallel result model |
| Reports | PARTIAL | `report_suite_routes.py` (batches/suite on-read), `validation_report_routes.py` (dashboard/scores/governance/risk/compliance), `dashboard_routes.py` [require_admin], `export_routes.py` (csv/pdf), `governance_routes.py`, `monitoring_routes.py` | Reuse; templates/suites/schedule CRUD absent — defer (note) |
| Suspension | PARTIAL | `tenants.status` + `tenant_middleware` blocks non-ACTIVE (403) but UNWIRED; Stripe sets subscription `suspended`, never propagates to tenant; login ignores tenant status | Wire enforcement (DEV-006); purge/retention job = future work |

---

## E. Database Audit

| Entity | Current Ownership | 001c Ownership | Compatible? | Required Change |
| ------ | ----------------- | -------------- | ----------- | --------------- |
| Tenant (`core.tenants`) | Root (PK tenant_id UUID) + 001a/b cols (plan_id, billing_email, max_*=5/3/5, stripe_*) ; status default ACTIVE, no CHECK | Top-level customer | YES | Add status discipline (ACTIVE→SUSPENDED→OFFBOARDING→PURGED); seed max_* are illustrative, not hard plan truth — confirm before UI |
| Project (`core.projects`) | `tenant_id→tenants CASCADE`, UNIQUE(tenant,name) | Tenant | YES | None |
| System (`core.system_registry`) | DUMP: `project_id NOT NULL→projects`, UNIQUE(project,system_name) / CODE: inserts+filters `tenant_id` (undocumented cols) | Project | **NO — dual ownership** | DEV-001: single `project_id NOT NULL`, tenant via join; backfill; drop direct `tenant_id` filtering |
| Credential (`core.system_credentials`) | No DDL anywhere; inferred (`system_id→registry`, encrypted); scoped via `JOIN registry WHERE sr.tenant_id` | System | Transitive NO (via system) | DDL-ify table; extend JOIN with `project_id` after DEV-001 |
| Discovery Runs | `discovery_snapshots`: `project_id`+`source/target_system_id`→registry; `discovery_results`: code-only (project_id, systems) | Project/System execution | YES (runs) | Formalise `discovery_results` DDL |
| Dataset | `core.datasets`: `system_id→registry` (System-scoped); `dataset_columns`: `mapping_id`-scoped; **`discovered_tables` DOES NOT EXIST** | Project (first-class) | **NO** | DEV-002: `project_id` on datasets + scope columns to dataset, OR create `discovered_tables` — decision needed |
| Mapping | `dataset_mappings`: `project_id→projects CASCADE` + source/target systems; `column_mappings`: two divergent definitions (backup vs `05_mapping_tables.sql`) | Project | YES (ancestry) | Reconcile `column_mappings` drift; versions table deferred |
| Validation | `migration_batch_registry` (code-only DDL): `project_id` + redundant `tenant_id VARCHAR(100)` (type-mismatched, no FK); results/exceptions via `batch_id`/`mapping_id` ancestry | Run=Project, Result=Run, Defect=Result | PARTIAL | Keep `project_id`, derive tenant via join; fix VARCHAR→UUID; DDL-ify registry |
| Controls/rules | `control_registry`: dump `project_id NOT NULL` vs schema Global (no project_id) — divergence; `rule_registry` via control | Runs Project; templates Global | DIVERGENCE | DEV-010: decide Global-template vs per-project copy |
| Reports | No `report_*`/suites DDL; suite built on-read | Templates=Tenant, Generated=Project | GAP (persistence) | Defer; reuse on-read suite |
| Plans/Subscriptions | `platform.plans` Global (tier CHECK + prices + entitlements JSONB + max_*); `subscriptions`: `tenant_id→tenants`, status CHECK lacks `past_due` | Plan Global, Sub Tenant | PARTIAL | Add `past_due` (+ history discipline); seeds Professional £25k/Enterprise £75k/Plus £200k are the plan truth for UI |
| Users/Roles | `users.tenant_id NULL→tenants` (NULL=Super Admin ✓), status+token_version+mfa+lockout cols; `roles.tenant_id NULL` (system-wide); `user_roles` via joins | Tenant (/system) | YES | None |
| Usage | NONE (zero tables) | Tenant first-class | GAP | DEV-004: meter later; UI contract now |
| Audit | `audit.*` append-only, no tenant FK; engine decisions/scores carry `tenant_id VARCHAR` | Tenant/system | PARTIAL |СТЬ: no FK change for 001d; note VARCHAR drift |
| Ancillary | schedules/tasks/events: redundant `tenant_id+project_id`; diagnostics/health_checks: bare `system_id` | Project-scoped | PARTIAL/NO | Derive tenant via project; link diagnostics via system→project |

Migration framework: NO Alembic/ORM — raw `CREATE TABLE IF NOT EXISTS` / guarded `ALTER` in `sql/schema/*.sql` + `OC-*.sql`, manual psql, no down-migrations. DDL is trivial; drift control is the risk.

---

## F. Security Audit

- **Authoritative tenant:** JWT claim (`auth_service.py:75-82`, cookie + Bearer fallback, `dependencies.py:9-20`). ✓ design correct.
- **Client tenancy accepted (VIOLATION of 001c, DEV-003):** `tenant_middleware.py:28,31` trusts `X-Tenant-ID` then `?tenant_id=` (dead code — middleware NOT registered in `main.py:87-88`); ~15 route files accept `?tenant_id=` with `effective = query or jwt` and NO equality check (`system_routes.py:45-48` even allows `all`/empty = cross-tenant list without `require_admin`); body tenancy in `user_service.py:89` (saved only because callers pass JWT first; Super-Admin-NULL path falls to body). Only `discovery_routes.py:20-36` + `mapping_routes.py:13-29` enforce `_resolve_tenant` (403 unless jwt match or JWT role says super admin).
- **Frontend complicit:** `apiClient` sends `?tenant_id=` / `{project_id}` body, never headers; AuthContext holds `tenantId` from JWT (good) but persists JWT in localStorage (XSS-readable despite httpOnly cookie) with hardcoded `roles:['admin']` + client-only `switchRole` driving UI gating.
- **Super Admin:** no explicit context object; = `tenant_id NULL` user + `Super Admin` role string. `require_admin` DB-checks `r.tenant_id IS NULL` (good); `require_role/require_permissions` apply NO tenant filter when tenant_id falsy (cross-tenant aggregation, not scoping); `_resolve_tenant` trusts JWT role string without DB check.
- **Token lifecycle:** token_version enforced on both dependencies (gap: skipped if claim omitted); password policy on change/hash only (NOT on create_user/create_tenant — DEV-011); logout = cookie delete only (no version bump; change-password bumps); no logout-all/revoke; no invite/activation/forgot flow (plaintext passwords in POST /tenants + POST /users JSON, visible to audit logger — DEV-008).
- **Credential exposure:** encrypted at rest ✓; but `POST /systems/{id}/health-check` loads system with NO tenant filter + decrypted creds (`system_routes.py:141`), history endpoint unscoped (`:187-198`).
- **Suspension:** login checks `users.status` only, never `tenants.status`; suspended tenants still get JWT (middleware that would 403 is unwired; entitlement middleware unused).
- **Tests (measured, not claimed):** 443 `def test_` in 45 files. Isolation: credential 20, user/rbac 19, operational 13, edge 11; auth hardening 22; billing/entitlements file 38 (prior "169/169" claim = cross-file total, not this file — record corrected); commercial schema 46. Scope = tenant-A-vs-B only; ZERO project-A-vs-B tests.

---

## G. Route Audit (actual vs 001c §27)

Existing (verified in `AppRoutes.tsx`): all 001c-listed routes present. Missing (verified zero hits): `/billing/*`, `/subscription/*`, `/onboarding/*`. No duplicate-route risk. `HomePage.tsx` unrouted stub — delete or wire. `RoleSwitcher` dev dropdown — hide in prod.

---

## H. Onboarding Audit (pages → backbone)

| Backbone step | Page | API | Verdict |
| ------------- | ---- | --- | ------- |
| Welcome | NONE (`HomePage` stub) | `GET /me` MISSING | NEW both |
| Create Project | `MigrationProjectsPage` (list; modal TBD) | GET list+overview EXISTS; POST/PUT/DELETE MISSING | Reuse page; NEW write endpoints |
| Connect Source/Target | `SystemsPage`/`SystemDetailPage`/`SystemFormModal`/diagnostics | CRUD+test EXISTS (tenant-scoped) | Reuse; needs `project_id` (DEV-001) |
| Run Discovery | `DiscoveryPage`/`DiscoveryTreeTablePage` | trigger/status/history EXISTS | Reuse |
| Review Datasets | `MigrationDatasetsPage` | batch datasets EXISTS | Reuse; confirm scope (DEV-002) |
| Mappings | `MappingSpreadsheetPage` | full CRUD+auto+validate EXISTS | Reuse |
| Validation | ValidationCentre/pages | run/control APIs EXISTS | Reuse |
| Results | `ValidationResultsPage` | results/history/audit EXISTS | Reuse |
| Report | `ReportSuitePage` (real) | suite/dashboard/export EXISTS | Reuse suite; avoid stub aliases |

---

## I. Subscription/Billing Audit (001b)

Complete and reusable: plans list, active-subscription read (active/trialing + trial_end + entitlements), tenant subscription write (cancel+create), 30-day auto-trial, full Stripe surface (checkout/portal/webhook/invoices/upgrade/cancel, TIER_MAP, webhook→subs+tenant sync). Missing: `past_due` status value, invoice-history persistence beyond Stripe, deployment account/env (config work, not code).

---

## J. Usage Audit

Does not exist at any layer (DB/API/UI). Per spec §22: 001d defines the frontend contract + placeholders (Entitlement/Usage/Limit cards, 80%/100% policy display); backend metering (table + counters + enforcement) is nato explicitly future work (DEV-004).

---

## K. Suspension/Offboarding Audit

Exists: `tenants.status` field, PUT status, tenant-middleware 403 block (unwired), Stripe subscription suspend on payment failure. Missing: login-time tenant check, subscription→tenant propagation, retention/purge/offboarding jobs, DELETE tenant. 001d: wire read-path enforcement + suspended UX; purge = future (DEV-006).

---

## L. Deviations (explicit approval required)

| ID | Description | Reason | Impact | Files/tables affected | Recommended action |
| -- | ----------- | ------ | ------ | --------------------- | ------------------ |
| DEV-001 | `system_registry` dual ownership (DDL Project vs code Tenant) | 001c binding: System=Project | Blocks project isolation, connections, discovery scoping | `core.system_registry`, `system_repository.py`, `credential_repository.py` (5 JOINs), `system_routes.py`, `system_service.py`, tests | (a) backfill `project_id`, enforce NOT NULL, scope by join, drop direct `tenant_id` filtering; (b) keep column transiently for rollback. Data+code migration, DDL trivial. Approve (a)/(b) |
| DEV-002 | No `discovered_tables`; `datasets` System-scoped, `dataset_columns` Mapping-scoped | 001c: Dataset first-class Project | Blocks dataset step + mapping ancestry | `core.datasets`, `dataset_columns`, (new?) `discovered_tables` | (a) add `project_id` to datasets + scope columns to dataset; or (b) create `discovered_tables` per 001c naming. Recommend (a) minimal — approve variant |
| DEV-003 | `?tenant_id=` trusted (~15 route files + frontend apiClient sends it); tenant middleware dead | 001c: client MUST NOT establish tenancy | Security acceptance fails until fixed | `app/api/routes/*.py` (list §F), `utils/apiClient.ts`, `AuthContext.tsx` | Frontend: STOP sending `tenant_id` (use JWT), remove localStorage JWT → cookie-only; Backend: enforce equality-or-ignore + wire middleware. Approve scope (frontend-only vs both) |
| DEV-004 | Usage metering absent everywhere | 001c Amend.4 | Usage UI has no source | (new) metering table/service; UI cards | 001d: UI contract + static/illustrative placeholders; backend meter = future workstream. Approve |
| DEV-005 | Project write/select/lifecycle endpoints absent | Onboarding needs Create+select | Cannot create/select project via API | `migration_project_routes.py`+service/repo | NEW POST/PUT/DELETE + active-project (frontend store + optional backend preference). Approve |
| DEV-006 | Suspension unenforced (login ignores tenant status; middleware unwired; no propagation/purge) | 001c lifecycles | Suspended tenants usable | `auth_service.login`, middleware wiring, `stripe_service` webhook, suspended UX | 001d: login check + 403 UX + propagation; purge/retention = future. Approve |
| DEV-007 | No global ProjectContext; inconsistent per-page scoping | Project workspace backbone | Onboarding cannot carry context | NEW `ProjectContext`, route-props on guards, header project indicator | Frontend-only, low risk. Approve |
| DEV-008 | Plaintext passwords in POST /tenants + POST /users; no invite/activation flow | 001c Stage 1 = invitation/activation | Security hygiene; audit-log exposure | `tenant_routes.py`, `user_routes.py`, (new) invitations | 001d: short-term — stop logging bodies for these routes; invitations = future workstream. Approve |
| DEV-009 | Entitlement middleware + `max_*` limits implemented but never wired/enforced | Plans must gate | Any plan can do anything | Route dependencies, `main.py` mounting | Wire `require_entitlement` on gated routes + enforce `max_*` on create paths. Approve list of routes |
| DEV-010 | `control_registry.project_id` divergence (dump NOT NULL vs schema Global) | Template vs instance unclear | Rule/mapping duplication risk | `control_registry`, `rule_registry`, seeds | Decide: Global templates + project overrides. Approve model |
| DEV-011 | Password policy bypassed on create_user/create_tenant; logout doesn't bump token_version; `token_version` claim optional | OC-SEC-005 completeness | Weak provisioning, session semantics | `user_service.py:87`, `tenant_service.py:23`, `auth_routes.py:46-55`, `dependencies.py:27` | Small hardening patch inside 001d or separate hardening ticket — approve placement |
| DEV-012 | Stale unapproved `OC-COM-001d_SaaS_Customer_Experience.md` draft in control folder | Predates canonical spec | Confusion / double-spec risk | That file | Delete or replace with canonical spec pointer on approval |

Type drift note (no action in 001d unless approved): `tenant_id` UUID (core/platform) vs VARCHAR(100) (engine batch registry, e2e, decisions/scores) blocks real FKs — record for schema-hardening workstream.

---

## M. Proposed Implementation Plan (after approval)

- **Phase 0 — Decisions:** approve/adjust DEV-001…DEV-012 (variants where offered).
- **Phase 1 — P0 correctness (no UI yet):** DEV-001 migration + repo/route convergence; credential JOIN extension; `_resolve_tenant` pattern applied to system/project routes (or equality-or-ignore); `GET /me`; project write endpoints (DEV-005); login tenant-status check (DEV-006); `require_entitlement` wiring list (DEV-009); `ProjectContext` + guard props (DEV-007); stop sending `?tenant_id=` from frontend (DEV-003 frontend half).
- **Phase 2 — P1 journey:** Welcome page + `ProjectContext` + OnboardingWizard orchestrating EXISTING pages in backbone order; project-setup progress from real backend state; empty/error/loading states (§30–31).
- **Phase 3 — P2 subscription:** `/subscription/plans`, `/billing/subscription|checkout|portal|invoices` on 001b APIs; trial countdown from `trial_end_date`; suspend/past-due UX.
- **Phase 4 — P3 usage/entitlement UX:** cards + 80/100 policy display on illustrative-or-real data contract; upgrade prompts (no backend meter).
- **Phase 5 — P4 suspension UX + hardening placement (DEV-008/011):** suspended screens, session-expiry, audit-body redaction.
- **Phase 6 — Tests:** route/auth guards, tenant + PROJECT isolation (new — none exist), onboarding flows, subscription states, UX states. No duplication of existing 63+ tenant tests.
- Each phase: implement → run affected suites → evidence. Schema/backend deviations only as approved.

---

## N. Risk Assessment

| Risk | Level | Mitigation |
| ---- | ----- | ---------- |
| Project-ownership migration (DEV-001) breaks existing tenant-filtered callers | HIGH | Backfill + dual-read window, full test run, rollback column retained |
| `?tenant_id=` removal breaks pages relying on cross-tenant `all` (admin views) | MEDIUM | Explicit Super-Admin `all_tenants` path kept (`_resolve_tenant` model); admin views migrated deliberately |
| Dataset model choice (DEV-002) ripples to mapping/validation ancestry | MEDIUM | Decision before Phase 1; no second model either way |
| Scope creep into engine/RBAC/Stripe rewrites | MEDIUM | §40 non-goals enforced per-phase; deviations re-raised, never silent |
| Raw-SQL migration drift (no runner) | MEDIUM | Single guarded `OC-COM-001d` SQL file, manual-apply + verify queries, no down-migration theatre |
| Test-count evidence mismatch (prior "169/169" vs measured 38 in billing file) | LOW | Re-baseline counts in Phase 6 evidence; no functional impact |
| Frontend localStorage JWT + hardcoded roles | MEDIUM | Cookie-only + `/me` roles in Phase 1 (DEV-003/007) |

---

**AUDIT COMPLETE. STOPPING PER §42 — no implementation until audit + plan approved. Awaiting decisions on DEV-001…DEV-012.**
