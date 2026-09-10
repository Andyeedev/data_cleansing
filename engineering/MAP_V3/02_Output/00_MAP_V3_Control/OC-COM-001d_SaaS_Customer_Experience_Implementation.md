# OC-COM-001d — SaaS Customer Experience & Frontend Implementation (Revised Specification)

**DATE:** 2026-09-08
**STATUS:** AUTHORIZED FOR IMPLEMENTATION — DECISION GATE RECORDED (see §16)
**PREDECESSOR:** OC-COM-001c — SaaS Product & Tenant Lifecycle Architecture (APPROVED / CANONICAL BASELINE)
**AUDIT BASIS:** OC-COM-001d Audit Report dated 2026-09-08 (accepted as audit finding; implementation REJECTED until this spec is approved)
**DECISION BASIS:** OC-COM-001d DECISION / REQUIRED AMENDMENT — REJECTED FOR IMPLEMENTATION, AMEND SPECIFICATION FIRST (DEV-001…DEV-012 resolved below)

**Conflict rule:** where this specification and OC-COM-001c conflict, **001c wins**.

---

## 1. Approved implementation scope

Deliver the customer-facing experience for the canonical backbone, reusing existing backend/security/engine work:

```text
Welcome → Create Project → Connect Source → Connect Target → Run Discovery
→ Review Datasets → Mappings → Validation → Results → Report
```

- **P0 — Architectural correctness:** ProjectContext, Project-owned Systems convergence (DEV-001), tenant/project isolation enforcement (DEV-003), login tenant-status check (DEV-006), `GET /me`, project write endpoints (DEV-005), entitlement wiring (DEV-009), limited hardening (DEV-011).
- **P1 — First customer journey:** Welcome page + OnboardingWizard orchestrating EXISTING pages; project-setup progress from real backend state; empty/error/loading states.
- **P2 — Subscription experience:** `/subscription/plans`, `/billing/subscription|checkout|portal|invoices` on 001b APIs; trial countdown from `trial_end_date`; past-due/suspended UX.
- **P3 — Usage/entitlement UX:** Entitlement/Usage/Limit cards, 80%/100% policy display, upgrade prompts — on explicit contract, illustrative placeholders where metering absent (DEV-004).
- **P4 — Suspension UX:** suspended/blocked screens, session-expiry handling, audit-body redaction (DEV-006/008).
- **Phase 6 — Tests + evidence** (no duplication of existing 63+ tenant isolation tests).

---

## 2. Explicit non-goals

001d MUST NOT: rewrite the migration/validation/rule engines; replace RBAC, tenant isolation, or authentication; recreate the Stripe backend, plans, or subscriptions; redesign the database beyond approved DEV migrations; introduce second models for mapping, dataset, discovery, metering, entitlements, or project-context; remove working functionality without evidence; perform unapproved schema migrations; make speculative architecture changes; redesign control/rule architecture (DEV-010 DEFERRED); build a complete invitation platform (DEV-008); implement backend usage metering, retention/purge automation, logout-all/revoke, report-template/version persistence (all future workstreams, §15).

---

## 3. Final resolved deviations

| ID | Decision | Binding resolution |
| -- | -------- | ------------------ |
| DEV-001 | **APPROVE** — System ownership | `Tenant → Project → System → Credential`. `core.system_registry.project_id` authoritative: `NOT NULL`, FK → `core.projects.project_id`. Backfill from current project relationship where deterministic. Remove all system-tenancy decisions based directly on `tenant_id`; tenant derived via `system → project → tenant`. Legacy `tenant_id` column may persist transiently for migration/rollback ONLY — never as authority. Credentials remain System-owned. |
| DEV-002 | **APPROVE VARIANT (a)** — Dataset ownership | NO second `discovered_tables` model. Evolve `core.datasets`: add/establish `project_id` (Project-level inventory). Dataset Columns belong to their Dataset (`dataset_id`), not to a Mapping — migrate via convergence, preserving discovery/mapping function. Model: `Tenant → Project → Dataset → Dataset Columns`. Discovery Runs stay historical execution evidence, distinct from current inventory. |
| DEV-003 | **APPROVE BOTH** — Tenant identity | Client-supplied tenancy NEVER establishes tenancy. Frontend: stop sending `?tenant_id=` for normal operations; remove localStorage-JWT dependency where safe → httpOnly cookie authoritative. Backend: derive tenant from JWT/session; reject or safely ignore conflicting client identifiers (never override). `tenant_id=all` forbidden as ordinary mechanism. Wire authoritative tenant middleware. NEW `GET /me` = frontend source for user/tenant/roles/subscription context. Super Admin cross-tenant stays via `require_admin`. OC-SEC-006 untouched. |
| DEV-004 | **APPROVE** — Usage | 001d defines frontend Usage/Entitlement/Limit contract + clearly-labelled illustrative placeholders where metering absent. No invented backend data. No second metering system. Full metering/enforcement = future workstream. |
| DEV-005 | **APPROVE** — Project lifecycle | Minimum backend: create, update, delete/archive (where architecture permits), list, retrieve/select active project context. Project stays Tenant-owned. No extra lifecycle abstractions. |
| DEV-006 | **APPROVE** — Suspension | Minimum enforcement: login respects `core.tenants.status` (suspended ⇒ no session); wire tenant middleware into request path; clear suspended/blocked UX. Subscription/billing state stays distinct from Tenant access state; Stripe state never equated to tenant state. Retention/purge = future. |
| DEV-007 | **APPROVE** — ProjectContext | ONE authoritative frontend ProjectContext: persisted selection, validated against authenticated tenant's projects, progressively consumed by existing pages, exposed in header/navigation. No competing mechanism. Never weakens backend authorisation. |
| DEV-008 | **APPROVE LIMITED** — Passwords/invitations | 001d scope ONLY: stop logging request bodies with plaintext passwords on tenant/user provisioning routes. Auth architecture preserved. Invitation/activation/forgot-password = future workstream. No silent redesign. |
| DEV-009 | **APPROVE** — Entitlements | Wire existing `require_entitlement` + enforce existing `max_*` limits on creation paths. Reuse `platform.plans`. No second mechanism, no invented limits. Explicit gated-route list produced in Phase 1 (proposed: POST /execution/run, POST /operations/run, POST /systems, POST /users, POST /migration/projects, POST /mappings/auto-map — confirm during implementation). |
| DEV-010 | **DEFER** — Control registry | No engine changes in 001d. Future decision recorded: Global rule/control templates + project-specific assignment/override. Alter engine semantics ONLY if an approved journey cannot function without it (re-raise, never silent). |
| DEV-011 | **APPROVE LIMITED** — Hardening | In 001d ONLY: password policy enforced on user/tenant creation paths; token-version validation mandatory for issued tokens; existing session architecture preserved. No auth rewrite. Logout/revoke beyond minimum = future. |
| DEV-012 | **APPROVE CLEANUP** — Stale spec | `OC-COM-001d_SaaS_Lifecycle_Architecture.md` (pre-spec draft, 2026-09-07) is NOT authoritative. On approval of THIS canonical spec: replace it with a pointer to this file, or remove/archive it — confirm variant at approval. |

**Schema drift (binding constraint):** `UUID tenant_id` vs `VARCHAR(100) tenant_id` and other DDL/code divergence are recorded as future schema-hardening debt. No broad hardening in 001d; touch drift ONLY where an approved DEV directly requires it (DEV-001/002 migrations).

---

## 4. Exact implementation sequence

- **Phase 0 — Gate (this spec):** approve spec + DEV variants + gated-route list + migration SQL review. No code before approval.
- **Phase 1 — P0 correctness:** DEV-001 migration (backfill → NOT NULL → repo/route convergence → dual-read window → drop direct `tenant_id` filtering); credential JOIN extension (`sr.project_id`); `_resolve_tenant`/equality-or-ignore on system/project routes; `GET /me`; project write endpoints (DEV-005); login tenant-status check + middleware wiring (DEV-006); `require_entitlement` wiring + `max_*` enforcement (DEV-009); ProjectContext + guard props (DEV-007); frontend stops `?tenant_id=` + cookie-only auth (DEV-003 frontend); creation-path password policy + mandatory token_version (DEV-011); audit-body redaction (DEV-008).
- **Phase 2 — P1 journey:** Welcome page; OnboardingWizard + shared stepper orchestrating existing pages in backbone order; project-setup progress from real state; §30/31 empty/error/loading states.
- **Phase 3 — P2 subscription:** subscription/billing pages on 001b APIs; trial countdown; past-due/suspended UX.
- **Phase 4 — P3 usage UX:** cards + policy display + upgrade prompts on approved contract.
- **Phase 5 — P4 suspension UX + residual hardening:** suspended screens, session-expiry, verification of DEV-006/008/011.
- **Phase 6 — Tests + evidence:** §11; re-baseline counts (audit measured 443 tests / 45 files; billing file 38 — prior "169/169" was cross-file total).
- Per-phase: implement → run affected suites → evidence (§14) → proceed.

---

## 5. Backend changes (approved only)

1. `system_service.py` / `system_routes.py` / `system_models.py`: accept + require `project_id`; scope reads/writes by `project_id` with tenant derived via project join; remove `tenant_id=all`/empty bypass (Super Admin via `_resolve_tenant` model).
2. `migration_project_routes.py` (+service/repo): NEW POST/PUT/DELETE + list/select/active-context.
3. `credential_service.py` callers unchanged; isolation extended via `sr.project_id` (after DEV-001).
4. `auth_service.login`: reject `tenants.status != ACTIVE`; wire tenant middleware into request path.
5. NEW `GET /me`: id, email, roles, tenant_id, subscription summary (plan/tier/status/trial_end/entitlements).
6. `user_service.create_user` + `tenant_service.create_tenant`: enforce password policy (DEV-011).
7. `dependencies.py`: token-version validation mandatory (no silent skip when claim absent on fresh tokens).
8. `require_entitlement` attached to §3 gated-route list; `max_users/max_projects/max_connections` enforced on corresponding create paths.
9. Audit-log middleware: exclude bodies on POST /tenants + POST /users (DEV-008).
10. NOTHING else: no engine, RBAC, Stripe, isolation-model, or auth-architecture changes.

---

## 6. Frontend changes (approved only)

1. NEW `ProjectContext` (App-level, persisted, tenant-validated) + header project indicator; existing pages consume progressively.
2. NEW OnboardingWizard + shared stepper + Welcome page (`/onboarding/welcome`, `/onboarding/setup`); orchestrates existing pages — no duplicated workflows.
3. NEW pages: `/subscription/plans`, `/billing/subscription|checkout|portal|invoices`; typed API clients (subscription/billing/usage/me).
4. `apiClient`: stop sending `?tenant_id=`; cookie-first auth; drop localStorage-JWT writes (keep read-fallback only until cutover verified).
5. `AuthContext`: consume real roles from `/me`; remove hardcoded `['admin']`; remove client-only `switchRole`; hide `RoleSwitcher` in prod.
6. `AppRoutes`: add `requiredRoles/requiredPermissions` props per route (UX hiding only); add new routes inside Shell block.
7. Shell nav: onboarding/billing links (API or DEFAULT_NAV); usage/subscription banners on Dashboard.
8. Hooks: drop `tenant_id` params progressively as ProjectContext lands; keep `project_id` from context.
9. States: empty/error/loading/suspended/trial-ending/limit-reached/session-expired per §30/31 list; project-setup progress from real backend state (never fabricated).
10. Delete-or-wire `HomePage.tsx` stub (wire into Welcome or delete — decide in Phase 2).

---

## 7. Database changes/migrations (approved only)

Single guarded migration file `OC-COM-001d.sql` (raw-SQL pattern, manual apply, no down-migration theatre):

1. **DEV-001:** verify live `system_registry` columns (`\d`); backfill `project_id` deterministically (via existing project linkage; orphan systems → per-tenant default project ONLY if approved at Phase 0, else fail loudly); `SET NOT NULL`; `UNIQUE(project_id, system_name)`; `CREATE INDEX`; convert repo filters to `JOIN projects … WHERE p.tenant_id`; retain legacy `tenant_id` transiently, then drop in a follow-up once verified.
2. **DEV-002:** `datasets ADD project_id` (backfill via `system → project`); `dataset_columns ADD dataset_id` (backfill via `mapping → dataset`); scope constraints; preserve existing rows (convergence, no parallel tables).
3. **DEV-006 support:** no new tables; uses existing `tenants.status` / `users.status` / subscription statuses (+ `past_due` value on `subscriptions.status` CHECK where the CHECK exists).
4. Formalise DDL for code-only tables touched by 001d paths (`system_credentials`, `migration_batch_registry` incl. VARCHAR→UUID alignment on new writes) ONLY to the extent Phase 1 requires; rest stays drift-noted future debt.
5. Pre-migration backup mandatory; post-migration verification queries (orphan counts must be zero) in §14 evidence.

---

## 8. Security changes (approved only)

- Enforce: JWT/session-derived tenancy everywhere in 001d-touched paths; equality-or-ignore for client identifiers; `_resolve_tenant` pattern extended to system/project routes.
- Wire (not rewrite): tenant middleware + `require_entitlement` + `max_*` enforcement.
- Harden (limited): creation-path password policy; mandatory token_version; body redaction on provision routes.
- Preserve: OC-SEC-005/006(A–D) + Final Isolation Model, cookie/session architecture, RBAC dependencies, Stripe webhook handling.
- Forbid: client-established tenancy, `tenant_id=all` for tenants, localStorage-JWT as authority, isolation bypasses, auth rewrites, plaintext-password logging.

---

## 9. Existing assets to reuse (do not recreate)

Tenant service/repo + routes; user/role services + soft-delete pattern; plans list + active-subscription read + subscription write + 30-day auto-trial; full Stripe surface (checkout/portal/webhook/invoices/upgrade/cancel, TIER_MAP); entitlement middleware + plan JSON; project reads (list/tenants/overview/detail); system CRUD + test/health-check logic; credential encryption + JOIN-guard pattern; discovery trigger/status/history + `_resolve_tenant`; dataset/mapping CRUD + auto-map + validate; validation run/control/rule/result/history APIs; report suite + dashboards + csv/pdf export; governance/monitoring reads; all Shell/nav/layout/components/hooks/pages listed EXISTING in audit §C; all 443 existing tests.

---

## 10. Files/modules expected to change

**Backend:** `app/db/repositories/system_repository.py`, `credential_repository.py`, `migration_project_repository.py` (+services), `app/api/routes/system_routes.py`, `migration_project_routes.py`, `auth_routes.py` (me endpoint), `app/services/auth_service.py` (login check), `user_service.py`, `tenant_service.py`, `app/api/core/auth/dependencies.py`, `app/api/core/middleware/tenant_middleware.py` (wiring in `main.py`), `app/middleware/entitlement_middleware.py` (mount + usages), audit-logging middleware (redaction), `app/api/models/system_models.py`; NEW `OC-COM-001d.sql`.
**Frontend:** NEW `context/ProjectContext.tsx`, `components/OnboardingWizard/*` (+stepper), `routes/WelcomePage.tsx`, `routes/subscription/*`, `routes/billing/*`, service clients; MODIFIED `App.tsx`, `AppRoutes.tsx`, `Shell.tsx` (nav), `context/AuthContext.tsx`, `utils/apiClient.ts`, `utils/filterByPermissions.ts` (entries), domain hooks (param cleanup), consuming pages (context adoption), `RoleSwitcher` (hide), `HomePage.tsx` (wire/delete).
**Docs:** this spec; Phase evidence notes; DEV-012 cleanup target.

---

## 11. Tests required

- Routing: authenticated/unauthenticated redirects; per-route role props; suspended-tenant block; expired-session flow.
- Tenant isolation (extend, don't duplicate 63+): systems/datasets/mappings/results cross-tenant denial incl. `?tenant_id=` override attempts now ignored/rejected.
- **Project isolation (NEW — zero exist):** project-A vs project-B same tenant for systems, discovery, datasets, mappings, validation; system→wrong-project rejection; credential via foreign system rejection.
- Onboarding: welcome → project create → source/target connect → discovery → datasets → mapping → validation → results → report happy path + empty-state branches.
- Subscription: trial display/countdown, active, past-due, suspended; entitlement gating (allowed/denied paths); `max_*` create-block + warning display.
- Migration: backfill determinism check, zero-orphan verification, rollback-column removal check.
- Hardening: creation-path weak-password rejection; token without version rejected; login with suspended tenant rejected; provision bodies absent from audit logs.
- Regression: full affected suites per phase (§14).

---

## 12. Acceptance criteria

- Journey: tenant user progresses Welcome → … → Report coherently through real backend state.
- Tenant boundary: frontend cannot establish/switch arbitrary tenant context (`?tenant_id=`, header, body all inert).
- Project boundary: resources resolve through authenticated tenant; active project explicit; cross-project access denied.
- System boundary: Project-owned in UX + API orchestration; `project_id` authoritative.
- Dataset boundary: first-class Project inventory; runs ≠ inventory.
- Subscription/Billing/Entitlements/Usage remain four distinct concepts in UI + API usage.
- Existing architecture reused, not recreated; working functionality + tests intact unless an approved DEV required otherwise.
- Every deviation from audit/plan documented; 001c conflicts resolved in 001c's favour.

---

## 13. Rollback/safety considerations

- DB backup before migration; migration in backfill → verify (zero orphans) → enforce (NOT NULL/constraints) → converge code (dual-read window) → drop legacy authority order.
- Legacy `system_registry.tenant_id` retained transiently; removal only after Phase 1 verification passes.
- Frontend changes additive (new context/routes/pages); existing pages untouched until adopting context one by one; guards props default to current behaviour.
- No engine/RBAC/Stripe/auth-architecture touched ⇒ blast radius confined to listed files (§10).
- Any Phase that cannot meet its acceptance criteria stops the sequence (re-raise, never silent).

---

## 14. Evidence required after each phase

- Phase 0: this approved spec + DEV variant confirmations + reviewed migration SQL.
- Phase 1: migration verify output (orphan counts zero, constraint checks); `GET /me` sample; route table before/after (entitlement attachments); test run (new isolation + regression) with counts.
- Phase 2: backbone walkthrough against live backend (each step's entity id recorded); empty/error-state catalogue check.
- Phase 3: trial/active/past-due/suspended UI states against real subscription rows; Stripe calls logged (no secret values).
- Phase 4: usage cards vs contract; placeholder labelling audit (every illustrative value tagged).
- Phase 5: suspended-login rejection proof; session-expiry flow; audit-log sample proving no plaintext passwords.
- Phase 6: full suite counts re-baselined (correcting prior cross-file claims); project-isolation suite green.

---

## 15. 001d vs future workstreams (separation)

| Item | 001d | Future |
| ---- | ---- | ------ |
| Usage metering backend + enforcement | Contract + placeholders only | Dedicated metering workstream |
| Retention/purge/offboarding automation | Suspended-state enforcement + UX | Retention/purge workstream |
| Invitation/activation/forgot-password | Body redaction only | Identity workstream |
| Control registry Global-vs-project | Deferred (DEV-010) | Engine governance workstream |
| UUID↔VARCHAR drift + DDL/code divergence | Touch only where DEV-001/002 require | Schema-hardening workstream |
| Report templates/suites persistence, mapping versions | Reuse on-read; defer | Reporting workstream (if needed) |
| Logout-all/admin revoke, broader session work | Minimum only (DEV-011) | Security-hardening workstream |
| Full `tsc -b` clean build (~40 pre-existing errors) | Out of scope (verify via `vite build`) | Frontend-debt workstream |
| OC-SEC-006D / 003 / 004 / PROD-001 | Untouched, queued after 001d | Per MAP_V3 TODO sequence |

---

**SPECIFICATION COMPLETE. Phase 0 decision gate recorded below — implementation authorized in Phase order.**

## 16. Decision Gate Record (AUTHORIZED 2026-09-08)

DECISION GATE / IMPLEMENTATION AUTHORISATION accepted. Audit accepted as authoritative repository assessment. Resolutions:

- **DEV-001 — APPROVE (a)+(b):** `project_id` authoritative (`NOT NULL`, FK → projects); backfill to valid projects; scope via project→tenant; drop direct `tenant_id` filtering; retain `tenant_id` transiently for rollback only (no dual semantics); credentials JOIN-scoped via system/project; add project-isolation tests.
- **DEV-002 — APPROVE (a):** no `discovered_tables`; `datasets.project_id` added (Project-owned, system link preserved); `dataset_columns` re-homed to dataset; convergence, no fork; runs ≠ inventory.
- **DEV-003 — APPROVE BOTH:** no client-established tenancy; frontend drops `?tenant_id=` + localStorage-JWT → cookie authoritative; backend derives from JWT, rejects/ignores conflicts; `_resolve_tenant` applied consistently; tenant middleware wired; Super Admin via `require_admin` only; no `tenant_id=all`; NEW `GET /me`; OC-SEC-006 preserved.
- **DEV-004 — APPROVE:** frontend contract + labelled illustrative placeholders; no backend meter in 001d.
- **DEV-005 — APPROVE:** minimum project CRUD + list + select/active context; Tenant-owned; no second model.
- **DEV-006 — APPROVE:** login respects `tenants.status`; wire enforcement; suspended UX; subscription ≠ tenant state; Stripe propagation only where architecturally intended; no purge/DELETE-tenant.
- **DEV-007 — APPROVE:** single global ProjectContext (persisted, server-authorised, header-exposed + switcher); consume ValidationFilterContext patterns without duplicating; backend authoritative.
- **DEV-008 — APPROVE SHORT-TERM:** redact plaintext-password bodies on POST /tenants + POST /users; invitations future.
- **DEV-009 — APPROVE:** wire `require_entitlement` + enforce existing `max_*` on creation paths; exact gated-route list recorded in Phase 1 evidence before route edits.
- **DEV-010 — APPROVE GLOBAL-TEMPLATE + PROJECT-OVERRIDE (minimal):** no engine redesign; resolve `control_registry.project_id` divergence minimally; no accidental global mutation. (Delta vs draft spec §15 which said defer — this decision governs.)
- **DEV-011 — APPROVE P0/P4:** policy on creation paths; mandatory token_version (no silent skip); correct logout/session semantics via token_version; no auth rewrite; focused regression tests.
- **DEV-012 — SATISFIED:** stale pre-spec draft already removed from control folder (verified absent); this file is the sole authoritative 001d specification.

**Phase 0 reassessment (conflicts checked before coding):**
1. Cookie-only auth vs cross-origin dev (`:5173` → `:8000`): cookie requires CORS `allow_credentials` + frontend `credentials:include` + SameSite/secure alignment. Solvable inside Phase 1 (DEV-003); not a contradiction — approach recorded, no silent reinterpretation.
2. DEV-001 backfill determinism: systems lacking resolvable project linkage fail loudly at migration verify (zero-orphan rule); per-tenant default-project creation ONLY if live data requires it — re-raised at Phase 1 evidence, never silent.
3. `past_due` schema value: minimum CHECK alteration permitted in Phase 3 ONLY as audit-identified; no broader subscription rework.
4. Rollback honesty: transient columns + pre-migration backup + dual-read window; no rollback guarantees beyond what is actually implemented and tested.
5. No contradiction with 001c found; where any future conflict arises, 001c wins and work STOPS per Final Stop Conditions.

**DEV-002 RESOLUTION (APPROVED Option A, 2026-09-08):** live-DB evidence accepted — `core.datasets` has zero readers (unreachable legacy, left untouched); `discovered_datasets` (+`discovered_columns`) recognised as THE first-class Project-owned inventory (8 rows, 0 NULL project, 0 orphans). Migration scope for 001d: enforce `discovered_datasets.project_id NOT NULL` + FK only; document 001c naming variance; `dataset_columns` NOT re-homed (212 rows stay mapping-keyed; linkage = future debt); no engine rewrites; no second model. `platform.subscriptions`/`platform.plans` absence confirmed as environment state — existing approved 001a/001b SQL applied to dev DB (3 plans seeded) as setup, not architecture.
