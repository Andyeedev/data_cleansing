# OC-COM-001e — Identity & Access Lifecycle (Invitation, Registration, Password Management)

**DATE:** 2026-09-10
**STATUS:** DRAFT — PENDING REVIEW
**PREDECESSOR:** OC-COM-001d — SaaS Customer Experience & Frontend Implementation (IN PROGRESS)
**BASELINE:** OC-COM-001c — SaaS Product & Tenant Lifecycle Architecture (APPROVED / CANONICAL)

**Conflict rule:** where this specification and OC-COM-001c conflict, **001c wins**.

---

## 1. Problem Statement

MAP Nexus currently supports a **closed, admin-driven user provisioning model**:

- Super Admin creates tenants via API (which auto-creates an admin user with a known password)
- Admin creates additional users via `/administration/users` (setting passwords directly)
- No self-service path exists for new users or tenants
- No invitation, registration, forgot-password, or reset-password flow exists
- The `change-password` backend route calls a non-existent service method (will 500 at runtime)
- No email sending infrastructure exists (no SMTP, no email service)
- The public website (mapnexus.co.uk) has no integration with the platform for lead-to-customer conversion

**Impact:**
- Potential customers registering on mapnexus.co.uk have no path into the platform
- Existing users cannot self-serve password resets
- Admins must know and communicate passwords directly (security risk)
- No audit trail for user provisioning

---

## 2. Scope

Deliver the complete identity and access lifecycle for MAP Nexus:

```
Website Registration → Email Verification → Tenant Provisioning → Admin Setup
→ User Invitation → Accept Invite → Set Password → Login
→ Forgot Password → Reset Token → New Password → Login
→ Change Password (while logged in)
```

### In Scope (001e)
- Invitation system (admin invites user via email)
- Self-service registration (public signup page)
- Email verification (verify email before account activation)
- Forgot password flow (token-based reset via email)
- Reset password flow (validate token, set new password)
- Change password flow (while logged in — fix broken endpoint)
- Email sending service (SMTP abstraction)
- Website registration integration (mapnexus.co.uk → platform)
- Tenant self-provisioning (optional: public create-tenant flow)
- First admin bootstrapping (improve env-var / invite mechanism)

### Out of Scope
- SSO/SAML/OIDC integration (future)
- Multi-factor authentication (future)
- Social login (Google, Microsoft) (future)
- Role-based invitation (invite as specific role) — admin assigns roles after acceptance
- Automated tenant offboarding / user purge (future workstream)
- OC-COM-001d onboarding journey (separate workstream)

---

## 3. Architecture Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| ID-001 | **Invitation tokens** — UUID-based, stored in `platform.invitations` table, 7-day expiry, single-use | Standard pattern; UUIDs are unguessable; expiry limits exposure |
| ID-002 | **Password reset tokens** — UUID-based, stored in `platform.password_resets` table, 1-hour expiry, single-use | Shorter expiry for security; separate table from invitations |
| ID-003 | **Email verification** — UUID token stored in `platform.email_verifications` table, 24-hour expiry, sent on registration | Separate from invitation (different flows) |
| ID-004 | **Email service** — Abstract `EmailService` with SMTP backend, configurable via env vars | Pluggable; can swap to SendGrid/SES later without code changes |
| ID-005 | **Website registration** — mapnexus.co.uk POST to `POST /api/v1/public/register` → creates invitation or pending user | Public endpoint (no auth required); rate-limited |
| ID-006 | **Tenant self-provisioning** — NOT in 001e; Super Admin still creates tenants | Keeps admin control; self-provisioning = future |
| ID-007 | **Token storage** — httpOnly cookies for session tokens; invitation/reset tokens in DB only (not JWT) | Reset tokens must be server-validated; JWT cannot be revoked |
| ID-008 | **Rate limiting** — Public endpoints (register, forgot-password) rate-limited to 5/hour per IP | Prevent abuse |
| ID-009 | **Provisioning convergence** — All user/tenant provisioning flows MUST reuse existing `TenantService.create_tenant()` and `UserService.create_user()`. No second provisioning paths. | Enforces canonical lifecycle (001c); prevents duplicate models; ensures subscription/plan sync |

---

## 4. Database Changes

### New Tables

```sql
-- Invitation tokens
CREATE TABLE IF NOT EXISTS platform.invitations (
    invitation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role_name VARCHAR(100) DEFAULT 'viewer',
    token VARCHAR(64) NOT NULL UNIQUE,
    invited_by UUID REFERENCES platform.users(user_id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','revoked')),
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS platform.password_resets (
    reset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(user_id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS platform.email_verifications (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(user_id) ON DELETE CASCADE,
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

## 5. Backend API Endpoints

### 5.1 Invitation System (Admin → User)

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
  "role_name": "viewer",
  "message": "Optional personal message"
}
```

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

### 5.2 Self-Service Registration — DEFERRED

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/register` | Public | **DEFERRED** — not implemented in this workstream |
| `POST` | `/api/v1/auth/verify-email` | Public | **DEFERRED** — not implemented in this workstream |

**Rationale:** Per 001c canonical baseline, User → Tenant ownership is mandatory. Self-service registration without tenant context would require tenant self-provisioning (DEFERRED per ID-006). The only user creation path in 001e is **invitation acceptance** (`POST /invitations/accept`), which already has tenant context from the invitation record.

### 5.3 Password Management

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password reset email |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password via token |
| `POST` | `/api/v1/auth/change-password` | Authenticated | Change password while logged in (FIX) |

**Forgot Password Request:**
```json
POST /api/v1/auth/forgot-password
{
  "email": "user@example.com"
}
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

**Change Password Request (FIX existing broken endpoint):**
```json
POST /api/v1/auth/change-password
{
  "current_password": "OldP@ss1",
  "new_password": "NewSecureP@ss1"
}
```

### 5.4 Website Registration (Public)

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

**Response:** Creates a `website_registrations` row (status: `pending`). Super Admin processes via admin panel (converts to tenant + admin user).

---

## 6. Frontend Pages

### New Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/register` | `RegisterPage` | Self-service registration form |
| `/verify-email` | `VerifyEmailPage` | Email verification confirmation |
| `/forgot-password` | `ForgotPasswordPage` | Request password reset |
| `/reset-password` | `ResetPasswordPage` | Set new password via token |
| `/invites/accept` | `AcceptInvitePage` | Accept invitation, set password |
| `/administration/invitations` | `InvitationsPage` | Admin: manage pending invitations |
| `/administration/registrations` | `RegistrationsPage` | Super Admin: process website leads |

### Modified Pages

| Route | Component | Change |
|-------|-----------|--------|
| `/login` | `LoginPage` | Add "Create account" link → `/register`; fix "Forgot password" link → `/forgot-password` |
| `/profile` | `ProfilePage` | Wire "Change Password" button to actual API |
| `/administration/users` | `UsersPage` | Add "Invite User" button → invitation modal |

---

## 7. Email Service

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

### Environment Variables

```env
# Email Provider (deployment decision — NOT hardcoded in code)
EMAIL_PROVIDER=smtp
# SMTP config (used if EMAIL_PROVIDER=smtp)
SMTP_HOST=smtp.mapnexus.co.uk
SMTP_PORT=587
SMTP_USER=noreply@mapnexus.co.uk
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

**Provider selection is a deployment/ops decision, not a code change.** The `EmailService` interface is implemented by the chosen provider at container startup.

---

## 8. Security Considerations

| Concern | Mituration |
|---------|-----------|
| Password enumeration | Forgot-password always returns 200; invitation accept always returns 200 |
| Token brute-force | Rate limit: 5 requests/hour per IP on public endpoints |
| Token reuse | Single-use tokens (marked `used=true` after consumption) |
| Token expiry | Invitations: 7 days; Password reset: 1 hour; Email verification: 24 hours |
| Password policy | Enforced on all creation/reset paths (min 8, upper, lower, digit) |
| Session after reset | Existing sessions invalidated via `token_version` increment |
| Audit trail | All invitation/registration/reset events logged to `audit.*` |
| Email delivery | Failed deliveries logged but don't expose internal errors to user |

---

## 9. User Journey Flows

### Flow A: Admin Invites User
```
1. Admin → /administration/users → "Invite User"
2. Admin enters email + role → POST /invitations
3. System creates invitation record + sends email
4. User clicks link in email → /invites/accept?token=...
5. User sets password + name → POST /invitations/accept
6. Account activated → redirect to /login
7. User logs in → JWT issued
```

### Flow B: Self-Service Registration
```
1. Visitor → /register (or link from mapnexus.co.uk)
2. User fills form → POST /auth/register
3. System creates pending user + sends verification email
4. User clicks link → /verify-email?token=...
5. Email verified → account activated
6. User logs in → JWT issued
```

### Flow C: Forgot Password
```
1. User → /login → "Forgot password?"
2. User enters email → POST /auth/forgot-password
3. System sends reset email (if user exists)
4. User clicks link → /reset-password?token=...
5. User enters new password → POST /auth/reset-password
6. Password updated + existing sessions invalidated
7. User logs in with new password
```

### Flow D: Website Registration (mapnexus.co.uk)
```
1. Visitor → mapnexus.co.uk → "Get Started" / "Register"
2. Visitor fills form → POST /public/register
3. System stores lead in website_registrations (status: pending)
4. Super Admin reviews → /administration/registrations
5. Super Admin clicks "Convert" → calls TenantService.create_tenant() (canonical path)
6. Canonical tenant + admin user created (random password, email_verified=FALSE)
7. First-login password setup mechanism — **TBD during 001e review** (not implemented by assumption)
```

**Critical Rules:**
- Website registration creates `website_registrations` row ONLY — no tenant/user created
- Conversion reuses existing `TenantService.create_tenant()` — no second provisioning path
- **No passwords/default credentials ever emailed** — admin sets own password on first login
- First-login mechanism (forced change, invitation flow, etc.) to be resolved during 001e review

### Flow E: Change Password (Logged In)
```
1. User → /profile → "Change Password"
2. User enters current + new password → POST /auth/change-password
3. System validates current password + policy
4. Password updated + token_version incremented
5. User continues session (or re-login required — configurable)
```

---

## 10. Implementation Phases

| Phase | What | Dependencies |
|-------|------|-------------|
| **Phase 1** | Email service (abstract interface + SMTP impl) + env config | None |
| **Phase 2** | Invitation system (backend + frontend) | Phase 1 |
| **Phase 3** | Forgot/reset password (backend + frontend) | Phase 1 |
| **Phase 4** | Change password fix: implement `AuthService.change_password()` (validates current, enforces policy, increments token_version) — **independent, high priority** | None |
| **Phase 5** | Self-service registration — **DEFERRED** | — |
| **Phase 6** | Website registration integration (backend + admin panel) | Phase 1, Phase 4 |
| **Phase 7** | Tests + evidence | All above |

---

## 11. Tests Required

- Invitation: create, list, revoke, accept, expire, duplicate email prevention
- **Registration (self-service): DEFERRED — not tested in this workstream**
- Password reset: request, reset, expire, reuse prevention, invalid email handling
- Change password: correct old password, wrong old password, policy enforcement
- Email service: send success, send failure (logged, not exposed), template rendering
- Website registration: submit, duplicate prevention, rate limiting, admin conversion
- Security: token brute-force protection, enumeration prevention, audit logging
- Regression: existing auth tests still pass, login/logout unaffected

---

## 12. Acceptance Criteria

- Admin can invite user by email → user receives email → sets password → logs in
- **Self-service registration: DEFERRED — not in this workstream**
- User can request password reset → receives email → sets new password → logs in
- User can change password while logged in (500 error fixed)
- Super Admin can process website registrations → calls `TenantService.create_tenant()` (canonical path)
- All public endpoints rate-limited
- No password enumeration possible
- All tokens single-use and time-limited
- Audit trail for all identity events
- Existing functionality unaffected

---

## 13. Non-Goals (Future Workstreams)

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

## 14. Open Questions

1. **Email provider:** Provider selection = deployment config (EMAIL_PROVIDER=smtp|sendgrid|ses) — no code change
2. **Website registration:** mapnexus.co.uk POSTs directly to `POST /api/v1/public/register` — no middleware
3. **Tenant self-provisioning:** DEFERRED — not in 001e
4. **Password change policy:** Sessions invalidated via `token_version` increment — user re-logs in
5. **Invitation role:** Admin specifies role at invite time (stored in `platform.invitations.role_name`)

---

**SPECIFICATION COMPLETE. Pending review and approval before implementation.**
