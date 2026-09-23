# OC-COM-001e — Corrections Applied

## A. Complete Corrected Specification
See: `engineering/MAP_V3/02_Output/00_MAP_V3_Control/OC-COM-001e_Identity_Access_Lifecycle.md`

---

## B. Corrections Applied (per 17 mandatory corrections)

| # | Correction | What Was Fixed |
|---|------------|----------------|
| 1 | **Invitation role contradiction** | Removed `role_name` from `platform.invitations` schema, invite request, and Flow A. Role-based invitation is OUT OF SCOPE. Role assignment uses existing `UserService.assign_role()` after acceptance via existing RBAC. |
| 2 | **Email verification lifecycle** | Defined precisely in §8: when record created (invitation acceptance), when email sent, when `email_verified` flips to TRUE, login blocked before verification, expiry/resend/reuse behavior. Uses existing `platform.users.email_verified` column. |
| 3 | **First-admin bootstrap** | Documented as **Prerequisite #1 requiring review** in §17. Three options outlined. Must be resolved before Phase 6. No invented mechanism. |
| 4 | **Rate limiting consistency** | Explicit table in §12 listing all 6 public endpoints with limits (5/hr/IP for state-changing, 30/min/IP for plans). Implementation via existing `slowapi` / `rate_limit_leads` pattern. |
| 5 | **Duplicate/corrupted sections removed** | Single authoritative version of every section. Corrected numbering: 1–19 sequential. No repeated sections. |
| 6 | **Email provider examples corrected** | `SMTP_HOST=<deployment-specific SMTP host>` — no implication that `smtp.mapnexus.co.uk` exists. Provider = deployment config. |
| 7 | **Provisioning convergence tightened** | Explicit rules: Tenant → `TenantService.create_tenant()`, User → `UserService.create_user()`, Invitation acceptance → `UserService.create_user()`, Website registration → `website_registrations` only, conversion → `TenantService.create_tenant()`. No duplicate paths. |
| 8 | **Change password removed from phases** | Moved to §4 "Existing / Completed Dependencies" — `AuthService.change_password()` implemented in 001d Phase 5 Step 2. Not a future phase. |
| 9 | **Phase structure corrected** | Phases 0–7 with clear dependencies. Change password removed. Self-service registration DEFERRED. Tenant self-provisioning DEFERRED. Phase 6 added for first-admin bootstrap (prerequisite-dependent). |
| 10 | **Database design reviewed against live schema** | Verified: `email_verified` exists (don't re-add), `token_version` exists, `UserService.create_user()`/`TenantService.create_tenant()` exist, RBAC exists, audit middleware exists, rate limiting framework exists. New tables only where none exist. |
| 11 | **Auth architecture preserved** | Explicit ID-010: JWT + httpOnly cookie + `token_version` = session. Invitation/reset/verification = separate one-time DB tokens. No second auth architecture. |
| 12 | **Audit requirements specified** | Events listed in §11/security table and §15 tests. Uses existing `AuditLoggingMiddleware`. No duplicate audit model. No secrets logged. |
| 13 | **Security language tightened** | Clear EXISTING/COMPLETE vs PLANNED vs DEFERRED vs PREREQUISITE labels throughout. No claims of existing controls that don't exist. |
| 14 | **Self-service registration DEFERRED** | Explicit in §3 Out of Scope, §7.2 API table, §9 Frontend (no `/register` page), §14 Phases, §16 Acceptance Criteria. Only invitation acceptance creates users. |
| 15 | **Website registration separated** | Creates `website_registrations` lead only. No tenant/user. Super Admin converts via canonical `TenantService.create_tenant()`. No second tenant workflow. |
| 16 | **Final specification structure** | Clean 19-section structure: Document Control, Problem Statement, Scope, Out of Scope, Existing Dependencies, Architecture Decisions, Database Changes, Backend APIs, Email Verification Lifecycle, Frontend Pages, Email Service, Security, Rate Limiting, User Journeys, Implementation Phases, Tests, Acceptance Criteria, Prerequisites, Future Workstreams, Approval Gate. |
| 17 | **Approval gate corrected** | STATUS: REQUIRES FINAL REVIEW. "NO CODE CHANGES AUTHORISED BY THIS TASK." Implementation only after explicit approval. |

---

## C. Implementation Phase Sequence

| Phase | Scope | Dependency | Status |
|-------|-------|------------|--------|
| **Phase 0** | Specification review / prerequisite verification | None | **THIS TASK** |
| **Phase 1** | EmailService abstraction + SMTP impl + env config + rate limiting middleware for public endpoints | None | PLANNED |
| **Phase 2** | Invitation system (backend API + DB migrations + frontend) | Phase 1 | PLANNED |
| **Phase 3** | Password reset (forgot/reset backend API + DB + frontend) | Phase 1 | PLANNED |
| **Phase 4** | Email verification lifecycle (verify-email backend + DB + frontend) | Phase 2 | PLANNED |
| **Phase 5** | Website registration integration (backend + admin panel) | Phase 1 | PLANNED |
| **Phase 6** | First-admin bootstrap mechanism (if prerequisite resolved) | Phase 5 + Prereq #1 | PLANNED |
| **Phase 7** | Tests, security verification, evidence | All above | PLANNED |

---

## D. Prerequisites / Decisions Requiring Review

| # | Decision | Status | Options |
|---|----------|--------|---------|
| 1 | **First-admin password mechanism** | **REQUIRES REVIEW BEFORE PHASE 6** | (a) Super Admin sets temporary password in admin panel → user forced change on first login<br>(b) Super Admin triggers invitation email to admin email<br>(c) One-time setup token generated and delivered out-of-band<br>Must reuse `TenantService.create_tenant()` and `UserService.create_user()` |
| 2 | **Email provider selection** | DEPLOYMENT CONFIG | `EMAIL_PROVIDER=smtp|sendgrid|ses` — no code change |
| 3 | **Verification required for invitation flow** | RESOLVED | Yes — user created with `email_verified=FALSE`, verification sent, login blocked until verified |
| 4 | **Resend verification** | RESOLVED | New token issued, old invalidated by expiry |
| 5 | **Invitation role** | RESOLVED | Role-based invitation OUT OF SCOPE — admin assigns via existing RBAC after acceptance |

---

## E. Explicit Confirmation

✅ **No code changed** — specification file only  
✅ **No database changed** — no migrations run  
✅ **No migrations run** — SQL shown for reference only  
✅ **No commits made** — working tree clean  
✅ **No implementation started** — Phase 0 only  
✅ **OC-COM-001c preserved** — canonical baseline untouched  
✅ **OC-COM-001d/Phase 5 preserved** — working implementation untouched  

---

**AWAITING APPROVAL OF CORRECTED SPECIFICATION BEFORE PHASE 1.**