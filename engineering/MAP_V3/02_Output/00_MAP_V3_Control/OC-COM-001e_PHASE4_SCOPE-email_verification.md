# OC-COM-001e Phase 4 — Email Verification Implementation Scope (REVISED)

**DATE:** 2026-09-15  
**STATUS:** PROPOSED (awaiting approval)  
**PREDECESSOR:** Phase 3 — Password Reset (COMPLETE)  
**SPEC:** OC-COM-001e Identity & Access Lifecycle (Corrected)

---

## Phase 4 Authorised Scope

Implement the **Email Verification Flow** — user receives verification email → clicks link → `email_verified = TRUE` → can login.

### Backend API
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/verify-email` | Public | Verify email via token |
| `POST` | `/api/v1/auth/resend-verification` | Public | Resend verification email |

### Database
- New table: `platform.email_verifications` (verification_id, user_id, token, expires_at, verified, created_at)

### Frontend Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/verify-email` | `VerifyEmailPage` | Verify email via token |
| `/resend-verification` | `ResendVerificationPage` | Resend verification email |

### Modified Frontend
| Route | Component | Change |
|-------|-----------|--------|
| `/login` | `LoginPage` | Show message if login blocked due to unverified email |
| `/invites/accept` | `AcceptInvitePage` | After acceptance, redirect to `/verify-email` with message |
| `/verify-email` | `VerifyEmailPage` | Show resend link if token invalid/expired |

### Phase 2 → Phase 4 Integration (CRITICAL)

**Phase 2 was deliberately completed WITHOUT email verification.** Phase 4 must extend invitation acceptance to:

1. Create `email_verifications` record for the new user
2. Send verification email via `EmailService` with `render_verification()`
3. **Retain `email_verified = FALSE`** on the user record (Phase 4 activates enforcement)

**Phase 2 does NOT currently create verification records or send verification emails.** Phase 4 adds this behaviour to the existing invitation acceptance flow.

---

## 1. Existing User Transition Strategy (CRITICAL)

### Current State (Verified Against Live DB)
| User | Email | email_verified | Status | Created Via |
|------|-------|----------------|--------|-------------|
| admin@mapnexus.com | admin@mapnexus.com | FALSE | active | Super Admin bootstrap (env var) |
| andyee2015@gmail.com | andyee2015@gmail.com | FALSE | active | Phase 2 invitation acceptance |
| test@test.com | test@test.com | FALSE | active | Phase 2 invitation acceptance |

**All existing users have `email_verified = FALSE`.**

### Transition Strategy

| User Category | Transition Action | Rationale |
|---------------|-------------------|-----------|
| **Existing users created before Phase 4** (all 3 current users) | **One-time backfill:** Set `email_verified = TRUE` via migration. No verification email sent. | Preserves production access. These users were created before verification existed and are already authenticated. |
| **Newly invited users (Phase 2+4 flow)** | `email_verified = FALSE` at creation → verification email sent → must verify to login. | New lifecycle applies. |
| **Users created via Super Admin/TenantService.create_tenant()** | `email_verified = FALSE` at creation → verification email sent → must verify to login. | Consistent verification requirement for all new users after Phase 4 activation. |
| **Existing verified/active users (none currently)** | N/A — no such users exist. | — |
| **Future self-service registration (DEFERRED)** | `email_verified = FALSE` → must verify. | Out of scope for Phase 4. |

### Migration Action (One-Time)

```sql
-- One-time backfill for existing production users
UPDATE platform.users
SET email_verified = TRUE
WHERE email_verified = FALSE
  AND status = 'active'
  AND deleted_at IS NULL;
```

**No verification emails sent for backfilled users.** They retain access immediately.

### Existing User Exemptions

| Exemption | Duration | Condition |
|-----------|----------|-----------|
| Existing users backfilled to TRUE | Permanent | Verified via migration |

---

## Database Changes

### New Table: `platform.email_verifications`
```sql
CREATE TABLE IF NOT EXISTS platform.email_verifications (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON platform.email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON platform.email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires ON platform.email_verifications(expires_at);
```

**Existing column:** `platform.users.email_verified` (BOOLEAN DEFAULT FALSE) — Phase 4 sets to TRUE on verification.

### One-Time Migration (Applied Before Phase 4 Enforcement)
```sql
-- Backfill existing active users
UPDATE platform.users
SET email_verified = TRUE
WHERE email_verified = FALSE
  AND status = 'active'
  AND deleted_at IS NULL;
```

---

## API Contracts

### POST /api/v1/auth/verify-email (Public)
**Request:**
```json
{ "token": "abc123..." }
```

**Logic:**
1. Validate token (exists, not expired, not verified)
2. Set `platform.users.email_verified = TRUE`
3. Mark `email_verifications.verified = TRUE`
4. Return success

**Response:** 200 OK
```json
{ "success": true, "message": "Email verified successfully. You can now log in." }
```

**Error Responses:**
- `400` — Invalid/expired/already verified token

### POST /api/v1/auth/resend-verification (Public)
**Request:**
```json
{ "email": "user@example.com" }
```

**Logic:**
1. Find user by email (if active, active tenant, `email_verified = FALSE`)
2. Invalidate previous unused verification tokens for that user
3. Create new verification token
4. Send verification email
5. **Always return 200** (enumeration-safe)

**Response:** 200 OK
```json
{ "success": true, "message": "If the email exists and is eligible, a verification link has been sent." }
```

---

## Token Specification

| Property | Value |
|----------|-------|
| Format | UUID v4 hex (`uuid.uuid4().hex`) — 32 chars |
| Storage | `token VARCHAR(64) NOT NULL UNIQUE` (raw, Phase 2/3 precedent) |
| Expiry | 24 hours (`expires_at = NOW() + INTERVAL '24 hours'`) |
| Single-use | `verified` boolean, marked TRUE after verification |
| Lookup | Direct string match on `token` column |

---

## Frontend Components

### VerifyEmailPage (`/verify-email?token=...`)
- Extract token from URL
- POST to `/api/v1/auth/verify-email`
- On success: show success message, link to `/login`
- On error (expired/invalid/already verified): show error, link to `/resend-verification`

### ResendVerificationPage (`/resend-verification`) — **REQUIRED**
- Form: email input
- POST to `/auth/resend-verification`
- Same enumeration-safe response as forgot-password
- Linked from `VerifyEmailPage` on error

### AcceptInvitePage Modification
- After successful acceptance: redirect to `/verify-email` with message "Check your email to verify your account"

---

## Login Enforcement (Phase 4 Change)

### Current AuthService.login() Behaviour (No email_verified check)
```python
# Line 49: Only checks status == 'active'
if status != "active":
    raise Exception("Account is not active")
```

### Phase 4 Change (Add email_verified Check)
```python
# After line 47 (status check), add:
if not email_verified:
    raise Exception("Email not verified. Please verify your email address.")
```

**This is a NEW check introduced by Phase 4.** Not currently enforced.

---

## Phase 2 → Phase 4 Integration

### Invitation Acceptance Extended To:
1. Create user via `UserService.create_user()` (sets `email_verified = FALSE`)
2. Create `email_verifications` record for the new user
3. Send verification email via `EmailService` with `render_verification()`
4. Redirect to `/verify-email` with message "Check your email to verify your account"

**Phase 2 did NOT do steps 2-4. Phase 4 adds them.**

---

## Token Concurrency (FOR UPDATE)

```python
# verify_email():
cur.execute("""
    SELECT verification_id, user_id, token, expires_at, verified
    FROM platform.email_verifications
    WHERE token = %s AND verified = FALSE AND expires_at > NOW()
    FOR UPDATE
""", (token,))
```

**Concurrent verification:** Exactly one succeeds (first wins, second gets "already verified" error).

---

## Resend Verification Behaviour

| Scenario | Behaviour |
|----------|-----------|
| User requests resend, `email_verified = FALSE` | Invalidate old unused tokens → create new token → send email |
| User requests resend, `email_verified = TRUE` | **No token created**, return 200 (same response) |
| User requests resend, email doesn't exist / inactive / suspended | **No token created**, return 200 (enumeration-safe) |
| Email delivery fails | Log internally, return 200 (same response) |

**Already-verified users MUST NOT receive unnecessary tokens/emails.**

---

## Email Failure Behaviour (DB-First Pattern)

```python
with get_db_connection() as db:
    # 1. Create verification record in DB
    token = auth_service.create_verification_token(email)
    db.conn.commit()

# 2. Attempt email send (outside transaction)
try:
    email_service.send(render_verification(...))
except Exception as e:
    logger.error(f"Verification email failed for {email}: {e}")

# ALWAYS return same response (enumeration-safe)
return {"success": True, "message": "If the email exists and is eligible, a verification link has been sent."}
```

---

## Resend Verification Page (REQUIRED)

**Route:** `/resend-verification` (public)

**Component:** `ResendVerificationPage`

**Behaviour:**
- Form: email input
- POST to `/api/v1/auth/resend-verification`
- Same enumeration-safe response as forgot-password
- Linked from `VerifyEmailPage` on error (expired/invalid token)

---

## Security

| Check | Implementation |
|-------|----------------|
| No token logging | Audit middleware redacts |
| No email logging | Only log operational failures |
| Rate limiting | 5 req/hr/IP via `rate_limit_public_endpoint` |
| Enumeration prevention | Always 200, same response |
| Token unguessable | UUID v4 hex |
| Already-verified users | No token created, no email sent |

---

## Rate Limiting (Phase 1 Infrastructure)
- `POST /api/v1/auth/verify-email` → 5 req/hr/IP
- `POST /api/v1/auth/resend-verification` → 5 req/hr/IP

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Phase 1 EmailService | ✅ COMPLETE |
| Phase 1 Rate Limiting | ✅ COMPLETE |
| Phase 2 Invitation System | ✅ COMPLETE |
| Phase 3 Password Reset | ✅ COMPLETE |
| `platform.users.email_verified` | ✅ EXISTS (DEFAULT FALSE) |
| `AuthService.login()` | ✅ EXISTS (add check) |
| Audit middleware | ✅ EXISTS |

---

## Files to Create (Estimated)

| File | Type |
|------|------|
| `app/db/repositories/email_verification_repository.py` | Repository |
| Migration SQL for `platform.email_verifications` + backfill | DB |
| `app/services/auth_service.py` | Extend: `create_verification_token()`, `verify_email()`, `resend_verification()`, login check |
| `app/api/routes/auth_routes.py` | Extend: `/verify-email`, `/resend-verification` |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/auth/VerifyEmailPage.tsx` | Frontend |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/auth/ResendVerificationPage.tsx` | Frontend |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/invites/AcceptInvitePage.tsx` | Modify: redirect to `/verify-email` |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/LoginPage.tsx` | Modify: show unverified message |
| `tests/test_email_verification.py` | Tests |

---

## Implementation Order

1. **DB Migration** — Create `platform.email_verifications` table
2. **Backfill Migration** — Set `email_verified = TRUE` for existing active users
3. **Repository** — CRUD for email verifications
4. **AuthService** — Add `create_verification_token()`, `verify_email()`, `resend_verification()`, login check
5. **Routes** — API endpoints with rate limiting
6. **Frontend** — VerifyEmailPage, ResendVerificationPage, AcceptInvitePage redirect, LoginPage message
7. **Tests** — Backend + integration
8. **Evidence** — Phase 4 scope + evidence docs

---

## Approval Gate

**Phase 4 may begin ONLY after:**
- [ ] This revised scope reviewed and approved
- [ ] Phase 3 evidence reviewed and accepted
- [ ] Explicit go-ahead given

**No implementation before approval.**

---

## Summary of Changes from Original Scope

| # | Original | Revised |
|---|----------|---------|
| 1 | Existing users ignored | Explicit backfill strategy: set `email_verified = TRUE` for all existing active users |
| 2 | Phase 2 integration implied | Explicit: Phase 2 extended to create verification record + send email |
| 3 | Resend page optional | **Required** — linked from VerifyEmailPage |
| 4 | Login enforcement "already exists" | Explicit: NEW check added to `AuthService.login()` |
| 4 | Email failure undefined | DB-first pattern: commit first, then email; log failures |
| 5 | Token concurrency undefined | `FOR UPDATE` lock, concurrent = one succeeds |
| 5 | Already-verified resend undefined | No token, no email, same 200 response |
| 6 | No security section | Added: no token logging, rate limiting, enumeration prevention |

---

## Explicit Phase 4 / Future Boundary

| Phase | Responsibility |
|-------|----------------|
| **Phase 4** | Email verification: token, email, verification, `email_verified = TRUE`, login enforcement |
| **Future** | MFA, SSO, social login, self-service registration, tenant provisioning changes |

---

## Approval Gate

**Phase 4 may begin ONLY after:**
- [ ] This revised scope reviewed and approved
- [ ] Phase 3 evidence reviewed and accepted
- [ ] Explicit go-ahead given

**No implementation before approval.**