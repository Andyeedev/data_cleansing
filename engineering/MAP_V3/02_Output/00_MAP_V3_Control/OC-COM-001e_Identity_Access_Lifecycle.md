# OC-COM-001e — Identity & Access Lifecycle (Invitation, Registration, Password Management)

**DATE:** 2026-09-14  
**STATUS:** REQUIRES FINAL REVIEW  
**PREDECESSOR:** OC-COM-001d — SaaS Customer Experience & Frontend Implementation (COMPLETE)  
**BASELINE:** OC-COM-001c — SaaS Product & Tenant Lifecycle Architecture (APPROVED / CANONICAL)  
**DEPENDENCY:** OC-COM-001d Phase 5 (Suspension UX + Hardening) — COMPLETE  

**Conflict rule:** where this specification and OC-COM-001c conflict, **001c wins**.

**NO CODE CHANGES AUTHORISED BY THIS TASK.** Implementation begins only after explicit approval of this corrected specification.

---

## 1. Document Control

| Field | Value |
|-------|-------|
| Document ID | OC-COM-001e |
| Title | Identity & Access Lifecycle |
| Version | 1.0 (Corrected) |
| Author | MAP Nexus Engineering |
| Reviewers | Edward Odewale (Founder), Technical Lead |
| Approval Gate | Explicit approval required before Phase 1 |

---

## 2. Problem Statement

MAP Nexus currently supports a **closed, admin-driven user provisioning model**:

- Super Admin creates tenants via API (`TenantService.create_tenant()`) — auto-creates an admin user with a caller-supplied password
- Admin creates additional users via `/administration/users` (`UserService.create_user()`) — admin sets password directly
- No self-service path exists for new users or tenants
- No invitation, registration, forgot-password, or reset-password flow exists
- **The `change-password` backend endpoint (`POST /api/v1/auth/change-password`) was broken** — called a non-existent service method — **FIXED in OC-COM-001d Phase 5 Step 2** via `AuthService.change_password()` (validates current password, enforces policy, increments `token_version`)
- No email sending infrastructure exists (no SMTP, no email service abstraction)
- The public website (mapnexus.co.uk) has no integration with the platform for lead-to-customer conversion

**Impact:**
- Potential customers registering on mapnexus.co.uk have no path into the platform
- Existing users cannot self-serve password resets
- Admins must know and communicate passwords directly (security risk)
- No audit trail for user provisioning events

---

## 3. Scope

### In Scope (OC-COM-001e)

| Item | Description |
|------|-------------|
| **Invitation system** | Admin invites user by email → user receives email → accepts invitation → sets password → activates account |
| **Forgot password flow** | User requests reset email → receives token → sets new password → logs in |
| **Reset password flow** | Validates token, sets new password, invalidates existing sessions via `token_version` |
| **Email service** | Abstract `EmailService` interface with SMTP implementation; provider selected via deployment config |
| **Website registration integration** | mapnexus.co.uk POSTs to `POST /api/v1/public/register` → creates lead in `platform.website_registrations` → Super Admin reviews/converts via canonical `TenantService.create_tenant()` |
| **First-admin bootstrapping** | Define mechanism for first admin to establish password without ever emailing credentials |
| **Audit** | All identity events logged via existing audit architecture |

### Out of Scope (Explicit)

| Item | Future Workstream |
|------|-------------------|
| SSO/SAML/OIDC integration | Identity Federation |
| Multi-factor authentication | MFA Workstream |
| Social login (Google, Microsoft) | Social Auth |
| **Role-based invitation** (invite as specific role) | RBAC Enhancement — admin assigns roles after acceptance using existing RBAC |
| **Tenant self-provisioning** (public create-tenant flow) | Self-Service Tenant |
| **Self-service user registration** (public `/auth/register`) | Deferred — requires tenant self-provisioning |
| Automated tenant offboarding / user purge | Retention/Purge |
| OC-COM-001d onboarding journey | Separate workstream (complete) |
| Email templates customization | Branding Workstream |

---

## 4. Existing / Completed Dependencies

| Component | Status | Notes |
|-----------|--------|-------|
| `platform.users.email_verified` | **EXISTS** (live schema line 15) | Boolean, DEFAULT FALSE — do not re-add |
| `AuthService.change_password()` | **IMPLEMENTED** (Phase 5 Step 2) | Validates current password, enforces policy, bcrypt hashes, increments `token_version` |
| `UserService.create_user()` | **EXISTS** | Enforces password policy (DEV-011), checks tenant user limits (DEV-009) |
| `TenantService.create_tenant()` | **EXISTS** | Creates tenant + admin user + trial subscription; canonical path |
| `platform.users.token_version` | **EXISTS** (live schema line 31) | Integer, DEFAULT 0 — used for session invalidation |
| JWT + httpOnly cookie + `token_version` | **EXISTS** | Authenticated session mechanism — must not be replaced |
| Audit middleware (`AuditLoggingMiddleware`) | **EXISTS** | Logs method, path, user_id, status, duration, redacted request body |
| Rate limiting (`slowapi` + `rate_limit_leads`) | **EXISTS** | Applied to `/api/v1/leads` (10/min); pattern available for extension |
| Password policy (`validate_password_policy`) | **EXISTS** | Min 8 chars, upper, lower, digit — enforced on create/change/reset |
| RBAC (`platform.roles`, `platform.permissions`, `platform.user_roles`) | **EXISTS** | Role assignment via `UserService.assign_role()` after user creation |

---

## 5. Architecture Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **ID-001** | **Invitation tokens** — UUID-based, stored in `platform.invitations` table, 7-day expiry, single-use | Standard pattern; UUIDs unguessable; expiry limits exposure |
| **ID-002** | **Password reset tokens** — UUID-based, stored in `platform.password_resets` table, 1-hour expiry, single-use | Shorter expiry for security; separate table from invitations |
| **ID-003** | **Email verification tokens** — UUID-based, stored in `platform.email_verifications` table, 24-hour expiry, single-use | Separate from invitation/reset; tracks verification independently |
| **ID-004** | **Email service** — Abstract `EmailService` interface with pluggable implementations (SMTP, SendGrid, SES); provider selected via `EMAIL_PROVIDER` deployment config | No provider lock-in; swap without code changes |
| **ID-005** | **Website registration** — mapnexus.co.uk POSTs directly to `POST /api/v1/public/register` (public, no auth) → creates `platform.website_registrations` lead only | No tenant/user created at submission; Super Admin converts via canonical path |
| **ID-006** | **Tenant self-provisioning** — NOT in 001e; Super Admin creates tenants via existing API | Preserves admin control; self-provisioning = future workstream |
| **ID-007** | **Token storage** — Session tokens: JWT in httpOnly cookie + `token_version`; Invitation/reset/verification tokens: server-side one-time DB tokens only (never JWT) | Reset/invitation tokens must be server-validated and revocable |
| **ID-008** | **Rate limiting** — All public state-changing endpoints rate-limited (see §12) | Prevent abuse/enumeration |
| **ID-009** | **Provisioning convergence** — All user/tenant provisioning MUST reuse existing `TenantService.create_tenant()` and `UserService.create_user()`. No second provisioning paths. | Enforces canonical lifecycle (001c); prevents duplicate models; ensures subscription/plan sync |
| **ID-010** | **Session architecture** — JWT + httpOnly cookie + `token_version` remains the authenticated session mechanism. Invitation/reset/verification use separate server-side one-time DB tokens. | Preserves existing auth architecture; no session disruption |

---

## 6. Database Changes

### New Tables (do not exist in live schema)

```sql
-- Invitation tokens
CREATE TABLE IF NOT EXISTS platform.invitations (
    invitation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    invited_by UUID REFERENCES platform.users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','revoked')),
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS platform.password_resets (
    reset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS platform.email_verifications (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Public website registrations (leads)
CREATE TABLE IF NOT EXISTS platform.website_registrations (
    registration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processed','converted','rejected')),
    converted_to_tenant UUID REFERENCES core.tenants(tenant_id),
    converted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Modified Tables

```sql
-- Add invitation_id to users (tracks how user was created)
-- NOTE: email_verified column ALREADY EXISTS in live schema (create_platform_schema.sql line 15)
-- Do NOT add email_verified — it is already present with DEFAULT FALSE
ALTER TABLE platform.users ADD COLUMN IF NOT EXISTS invitation_id UUID REFERENCES platform.invitations(invitation_id);
```

---

## 7. Backend API Endpoints

### 7.1 Invitation System (Admin → User)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/invitations` | Admin | Send invitation email to new user |
| `GET` | `/api/v1/invitations` | Admin | List pending invitations for tenant |
| `DELETE` | `/api/v1/invitations/{id}` | Admin | Revoke/cancel invitation |
| `POST` | `/api/v1/invitations/accept` | Public | Accept invitation, set password, activate account |

**Invite Request:**
```json
POST /api/v1/invitations
{
  "email": "user@example.com",
  "message": "Optional personal message"
}
```
**Note:** `role_name` REMOVED from request — role-based invitation is OUT OF SCOPE. Role assignment uses existing RBAC after acceptance.

**Accept Invite Request:**
```json
POST /api/v1/invitations/accept
{
  "token": "abc123...",
  "password": "SecureP@ss1",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Accept Invite Logic:**
1. Validate token (exists, not expired, status='pending', not used)
2. Call `UserService.create_user()` with provided details + `tenant_id` from invitation
3. Set `invitation_id` on new user record
4. Mark invitation `status='accepted'`, `accepted_at=NOW()`
5. Create `email_verifications` record for new user
6. Send verification email
7. Return success — user must verify email before login (see §8)

### 7.2 Password Management

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password reset email |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password via token |
| `POST` | `/api/v1/auth/change-password` | Authenticated | Change password while logged in |

**Forgot Password Request:**
```json
POST /api/v1/auth/forgot-password
{ "email": "user@example.com" }
```
Always returns 200 (even if email doesn't exist — prevents enumeration).

**Reset Password Request:**
```json
POST /api/v1/auth/reset-password
{
  "token": "abc123...",
  "new_password": "NewSecureP@ss1"
}
```

**Change Password Request (ALREADY IMPLEMENTED in Phase 5 Step 2):**
```json
POST /api/v1/auth/change-password
{
  "current_password": "OldP@ss1",
  "new_password": "NewSecureP@ss1"
}
```
Implemented in `AuthService.change_password()`: validates current password, enforces policy, bcrypt hashes, increments `token_version`, commits.

### 7.3 Email Verification

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/verify-email` | Public | Verify email via token |

**Verify Email Request:**
```json
POST /api/v1/auth/verify-email
{ "token": "abc123..." }
```

**Verification Logic:**
1. Validate token (exists, not expired, not used)
2. Set `platform.users.email_verified = TRUE` for associated `user_id`
3. Mark `email_verifications.verified = TRUE`
4. Return success — user can now login

### 7.4 Website Registration (Public)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/public/register` | Public | Submit registration from mapnexus.co.uk |
| `GET` | `/api/v1/public/plans` | Public | List available plans (for pricing page) |

**Website Register Request:**
```json
POST /api/v1/public/register
{
  "email": "lead@company.com",
  "company_name": "Acme Corp",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+44 123 456 7890",
  "plan_interest": "professional",
  "message": "Looking to migrate our ERP system"
}
```

**Response:** Creates `platform.website_registrations` row (status: `pending`). No tenant/user created. Super Admin processes via `/administration/registrations`.

---

## 8. Email Verification Lifecycle (Resolved)

| Event | Action |
|-------|--------|
| **User created via invitation acceptance** | `email_verifications` record created, verification email sent |
| **Verification email sent** | Contains link to `/verify-email?token=...` |
| **User clicks link → `POST /auth/verify-email`** | Token validated → `platform.users.email_verified = TRUE` → `email_verifications.verified = TRUE` |
| **Login attempt before verification** | Blocked — `AuthService.login()` checks `email_verified` and rejects if FALSE |
| **Token expires (24 hours)** | Record remains, `verified=FALSE` — user cannot login; new token can be issued via resend |
| **Token already consumed** | Returns error — single-use enforcement |
| **Resend verification** | New `email_verifications` record created, new email sent — old token invalidated by expiry |

**Rule:** No user may login until `email_verified = TRUE`. This applies to all user creation paths (invitation acceptance, future self-service).

---

## 9. Frontend Pages

### New Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/verify-email` | `VerifyEmailPage` | Email verification confirmation |
| `/forgot-password` | `ForgotPasswordPage` | Request password reset |
| `/reset-password` | `ResetPasswordPage` | Set new password via token |
| `/invites/accept` | `AcceptInvitePage` | Accept invitation, set password |
| `/administration/invitations` | `InvitationsPage` | Admin: manage pending invitations |
| `/administration/registrations` | `RegistrationsPage` | Super Admin: process website leads |

### Modified Pages

| Route | Component | Change |
|-------|-----------|--------|
| `/login` | `LoginPage` | Fix "Forgot password" link → `/forgot-password`; remove "Create account" link (self-service DEFERRED) |
| `/profile` | `ProfilePage` | Wire "Change Password" button to `POST /auth/change-password` (already works) |
| `/administration/users` | `UsersPage` | Add "Invite User" button → invitation modal |

**Note:** `/register` (RegisterPage) REMOVED — self-service registration is DEFERRED.

---

## 10. Email Service

### Architecture

```
EmailService (abstract interface)
   ├─ SMTPEmailService (implementation)
   ├─ SendGridEmailService (implementation)
   └─ SESEmailService (implementation)
   └─ Config via env vars:
        EMAIL_PROVIDER=smtp|sendgrid|ses
        # Provider-specific env vars loaded dynamically
```

### Emails to Send

| Trigger | Email Template | Recipient |
|---------|---------------|-----------|
| Admin invites user | `invitation.html` | Invitee |
| User requests password reset | `password_reset.html` | User |
| Email verification | `verification.html` | User |

### Environment Variables (Deployment Configuration)

```env
# Email Provider (deployment decision — NOT hardcoded in code)
EMAIL_PROVIDER=smtp
# SMTP config (used if EMAIL_PROVIDER=smtp)
SMTP_HOST=<deployment-specific SMTP host>
SMTP_PORT=587
SMTP_USER=<deployment-specific SMTP user>
SMTP_PASS=<secret>
SMTP_FROM="MAP Nexus <noreply@mapnexus.co.uk>"
# SendGrid config (used if EMAIL_PROVIDER=sendgrid)
SENDGRID_API_KEY=<secret>
# SES config (used if EMAIL_PROVIDER=ses)
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=<secret>
AWS_SECRET_ACCESS_KEY=<secret>
APP_COOKIE_SECURE=true
```

**Provider selection is a deployment/ops decision, not a code change.** The `EmailService` interface is implemented by the chosen provider at container startup. `smtp.mapnexus.co.uk` does not currently exist and must not be assumed.

---

## 11. Security Requirements

| Concern | Mitigation |
|---------|------------|
| Password enumeration | `forgot-password` always returns 200; `invitations/accept` always returns 200 |
| Token brute-force | Rate limit: 5 requests/hour per IP on public endpoints |
| Token reuse | Single-use tokens (marked `used=true` / `verified=true` after consumption) |
| Token expiry | Invitations: 7 days; Password reset: 1 hour; Email verification: 24 hours |
| Password policy | Enforced on all creation/reset/change paths (min 8, upper, lower, digit) |
| Session after reset/change | Existing sessions invalidated via `token_version` increment |
| Audit trail | All identity events logged to existing audit architecture |
| Email delivery failures | Logged internally; never expose internal errors to user |
| Invitation token exposure | UUID tokens; HTTPS only; short expiry |

---

## 12. Rate Limiting (Explicit Endpoints)

| Endpoint | Limit | Window | Implementation |
|----------|-------|--------|----------------|
| `POST /api/v1/public/register` | 5 req/hour/IP | 1 hour | `slowapi` or `rate_limit_leads` pattern |
| `POST /api/v1/invitations/accept` | 5 req/hour/IP | 1 hour | `slowapi` or `rate_limit_leads` pattern |
| `POST /api/v1/auth/forgot-password` | 5 req/hour/IP | 1 hour | `slowapi` or `rate_limit_leads` pattern |
| `POST /api/v1/auth/reset-password` | 5 req/hour/IP | 1 hour | `slowapi` or `rate_limit_leads` pattern |
| `POST /api/v1/auth/verify-email` | 5 req/hour/IP | 1 hour | `slowapi` or `rate_limit_leads` pattern |
| `GET /api/v1/public/plans` | 30 req/min/IP | 1 minute | `slowapi` (read-only, higher limit) |

**Note:** Rate limiting for public endpoints does not currently exist — must be implemented in Phase 1 alongside email service. Existing `slowapi` middleware in `app/api/main.py` provides the framework.

---

## 13. User Journey Flows

### Flow A: Admin Invites User
```
1. Admin → /administration/users → "Invite User"
2. Admin enters email + optional message → POST /invitations
3. System creates invitation record + sends email
4. User clicks link in email → /invites/accept?token=...
5. User sets password + name → POST /invitations/accept
6. System calls UserService.create_user() → creates user, sets invitation_id
7. System creates email_verifications record + sends verification email
8. User clicks verification link → /verify-email?token=... → POST /auth/verify-email
9. email_verified = TRUE → redirect to /login
10. User logs in → JWT issued
```

### Flow B: Self-Service Registration
**DEFERRED** — not implemented in this workstream. The only user-creation path is invitation acceptance.

### Flow C: Forgot Password
```
1. User → /login → "Forgot password?"
2. User enters email → POST /auth/forgot-password
3. System creates password_resets record + sends reset email (if user exists)
4. User clicks link → /reset-password?token=...
5. User enters new password → POST /auth/reset-password
6. Password updated + existing sessions invalidated (token_version++)
7. User logs in with new password
```

### Flow D: Website Registration (mapnexus.co.uk)
```
1. Visitor → mapnexus.co.uk → "Get Started" / "Register"
2. Visitor fills form → POST /public/register
3. System stores lead in website_registrations (status: pending)
4. Super Admin reviews → /administration/registrations
5. Super Admin clicks "Convert" → calls TenantService.create_tenant() (canonical path)
6. Canonical tenant + admin user created (caller-supplied password, email_verified=FALSE)
7. First-admin password mechanism (see §17 — prerequisite decision)
```

**Critical Rules:**
- Website registration creates `website_registrations` row ONLY — no tenant/user created
- Conversion reuses existing `TenantService.create_tenant()` — no second provisioning path
- **No passwords/default credentials ever emailed** — admin sets own password at creation
- First-login mechanism to be resolved before Phase 6 implementation

### Flow E: Change Password (Logged In) — **ALREADY IMPLEMENTED**
```
1. User → /profile → "Change Password"
2. User enters current + new password → POST /auth/change-password
3. System validates current password + policy
4. Password updated + token_version incremented
5. User re-logs in (session invalidated)
```
Implemented in `AuthService.change_password()` (Phase 5 Step 2).

---

## 14. Implementation Phases

| Phase | Scope | Dependencies | Status |
|-------|-------|--------------|--------|
| **Phase 0** | Specification review / prerequisite verification | None | **THIS TASK** |
| **Phase 1** | EmailService abstraction + SMTP implementation + env config + rate limiting middleware for public endpoints | None | PLANNED |
| **Phase 2** | Invitation system (backend API + DB + frontend) | Phase 1 | PLANNED |
| **Phase 3** | Password reset (forgot/reset backend API + DB + frontend) | Phase 1 | PLANNED |
| **Phase 4** | Email verification lifecycle (verify-email backend + DB + frontend) | Phase 2 | PLANNED |
| **Phase 5** | Website registration integration (backend + admin panel) | Phase 1 | PLANNED |
| **Phase 6** | First-admin bootstrap mechanism implementation (if prerequisite resolved) | Phase 5 | PLANNED |
| **Phase 7** | Tests, security verification, evidence | All above | PLANNED |

**Explicitly NOT an implementation phase:**
- Change password fix — **COMPLETE** (Phase 5 Step 2 of 001d)
- Self-service registration — **DEFERRED**
- Tenant self-provisioning — **DEFERRED**

---

## 15. Tests and Evidence

| Area | Tests |
|------|-------|
| Invitation | create, list, revoke, accept, expire, duplicate email prevention, role assignment via existing RBAC after acceptance |
| Password reset | request, reset, expire, reuse prevention, invalid email handling (200 always) |
| Email verification | verify, expire, reuse prevention, resend, login blocked before verification |
| Email service | send success, send failure (logged, not exposed), template rendering, provider swap |
| Website registration | submit, duplicate prevention, rate limiting, admin conversion via `TenantService.create_tenant()` |
| Security | token brute-force protection, enumeration prevention, audit logging |
| Regression | existing auth tests pass, login/logout unaffected, RBAC unchanged |

---

## 16. Acceptance Criteria

- Admin can invite user by email → user receives email → sets password → verifies email → logs in
- User can request password reset → receives email → sets new password → logs in (sessions invalidated)
- User can change password while logged in (already working — no 500)
- Super Admin can process website registrations → calls `TenantService.create_tenant()` (canonical path)
- All public endpoints rate-limited per §12
- No password enumeration possible
- All tokens single-use and time-limited
- Login blocked until `email_verified = TRUE`
- Audit trail for all identity events (via existing audit architecture)
- Existing functionality unaffected

---

## 17. Prerequisites / Decisions Requiring Review

| # | Decision | Status | Notes |
|---|----------|--------|-------|
| 1 | **First-admin password mechanism** | **PREREQUISITE — REQUIRES REVIEW** | `TenantService.create_tenant()` requires `admin_password` at call time. Options: (a) Super Admin sets temporary password in admin panel, user forced to change on first login; (b) Super Admin triggers invitation email to admin email; (c) One-time setup token generated and delivered out-of-band. Must be resolved before Phase 6. |
| 2 | **Email provider selection** | DEPLOYMENT CONFIG | `EMAIL_PROVIDER=smtp|sendgrid|ses` — no code change |
| 3 | **Verification requirement for invitation flow** | RESOLVED | Yes — invitation acceptance creates user with `email_verified=FALSE`, verification email sent, login blocked until verified |
| 4 | **Resend verification** | RESOLVED | New token issued, old invalidated by expiry |
| 5 | **Invitation role** | RESOLVED | Role-based invitation OUT OF SCOPE — admin assigns roles after acceptance using existing `UserService.assign_role()` |

---

## 18. Future Workstreams

| Item | Future Workstream |
|------|-------------------|
| SSO/SAML/OIDC | Identity Federation |
| Multi-factor authentication | MFA Workstream |
| Social login (Google, Microsoft) | Social Auth |
| Tenant self-provisioning | Self-Service Tenant |
| Automated user offboarding | Retention/Purge |
| Role-based invitation (invite as specific role) | RBAC Enhancement |
| Email templates customization | Branding Workstream |
| Self-service user registration | Deferred — requires tenant self-provisioning |

---

## 19. Approval Gate

**CONDITIONAL APPROVAL** — OC-COM-001e may proceed to implementation ONLY after:

1. This corrected specification is reviewed and approved
2. Prerequisite #1 (First-admin password mechanism) is resolved
3. Explicit go-ahead given for Phase 1

**Gate criteria:** Approved specification + resolved prerequisite → Phase 1 implementation begins.

---

**NO CODE CHANGES MADE. NO DATABASE CHANGES. NO MIGRATIONS RUN. NO COMMITS MADE. SPECIFICATION CORRECTION ONLY.**