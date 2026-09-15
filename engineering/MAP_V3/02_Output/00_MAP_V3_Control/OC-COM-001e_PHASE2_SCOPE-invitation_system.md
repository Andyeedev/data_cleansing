# OC-COM-001e Phase 2 — Invitation System Implementation Scope

**Date:** 2026-09-15  
**Status:** COMPLETE ✅  
**Predecessor:** Phase 1 — Email Service & Rate Limiting (COMPLETE)  
**Spec:** OC-COM-001e Identity & Access Lifecycle (Corrected v3)

---

## Phase 2 Authorised Scope

Implemented the **Admin → User Invitation System** with full tenant limit enforcement and atomic transaction guarantees.

### Backend API
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/invitations` | Admin | Send invitation email to new user |
| `GET` | `/api/v1/invitations` | Admin | List pending invitations for tenant |
| `DELETE` | `/api/v1/invitations/{id}` | Admin | Revoke/cancel invitation |
| `POST` | `/api/v1/invitations/{id}/resend` | Admin | Resend invitation (new token, new expiry) |
| `POST` | `/api/v1/invitations/accept` | Public | Accept invitation, set password, create user account |

### Database
- New table: `platform.invitations` (invitation_id, tenant_id, email, token, invited_by, status, expires_at, accepted_at, created_at)
- Add column: `platform.users.invitation_id` (FK to invitations, nullable)
- Partial unique index: prevent duplicate pending invitations per tenant+email

### Frontend Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/invites/accept` | `AcceptInvitePage` | Public: Accept invitation, set password, create account |
| `/administration/invitations` | `InvitationsPage` | Admin: Manage pending invitations |

### Modified Frontend
| Route | Component | Change |
|-------|-----------|--------|
| `/administration/users` | `AdministrationPage` (UsersTab) | Added "Invite User" button → InvitationModal |

### Email Integration (Phase 2 Only)
- **On `POST /invitations` (admin sends):** Create invitation in DB → send invitation email via `EmailService` with `render_invitation()`
- **On `POST /invitations/{id}/resend`:** Update token/expiry in DB → send new invitation email
- **On `POST /invitations/accept`:** NO verification email — user account created with `email_verified = FALSE` (existing column)

### Rate Limiting (Already Implemented in Phase 1)
- `POST /api/v1/invitations/accept` → 5 req/hr/IP via `rate_limit_public_endpoint`

---

## Explicit Phase 2 / Phase 4 Boundary

| Phase | Responsibility |
|-------|----------------|
| **Phase 2** | Invitation acceptance → `UserService.create_user()` → user created with `email_verified = FALSE`, `invitation_id` set, `status = 'active'` |
| **Phase 4** | Email verification flow: create `email_verifications` record, send verification email, `POST /auth/verify-email` sets `email_verified = TRUE`, login enforcement |

**Phase 2 does NOT:**
- Create `email_verifications` records
- Send verification emails
- Check `email_verified` on login (that's Phase 4 + auth hardening)

---

## Database Changes

### New Table: `platform.invitations`
```sql
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

CREATE INDEX IF NOT EXISTS idx_invitations_tenant_id ON platform.invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON platform.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON platform.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON platform.invitations(status);

-- Prevent duplicate pending invitations per tenant+email
CREATE UNIQUE INDEX IF NOT EXISTS uq_invitations_tenant_email_pending
    ON platform.invitations (tenant_id, email)
    WHERE status = 'pending';
```

### Modified Table: `platform.users`
```sql
-- invitation_id tracks how user was created
ALTER TABLE platform.users ADD COLUMN IF NOT EXISTS invitation_id UUID REFERENCES platform.invitations(invitation_id);
```

**Verified against live schema:**
- `platform.users` PK is `id` (UUID) — `invited_by REFERENCES platform.users(id)` is correct
- `email_verified` exists (DEFAULT FALSE) — Phase 2 sets explicitly to FALSE
- `status` CHECK constraint includes 'active' — user created as 'active'

---

## UserService.create_user() Integration (Verified)

### Existing Contract
```python
# app/services/user_service.py:86-114
class UserService:
    def __init__(self, conn):
        self.conn = conn  # Uses shared connection

    def create_user(self, payload, tenant_id=None):
        # 1. Validates password policy (DEV-011) via validate_password_policy()
        # 2. Enforces tenant user limit (DEV-009) via TenantService(self.conn).check_limit()
        # 3. Hashes password with bcrypt
        # 4. Inserts user with status='active'
        # 5. Returns {"success": True, "data": {"id", "email", "first_name", "last_name", "created_at"}}
        # NO COMMIT - connection managed by caller
```

### Integration Strategy for Atomic Transaction

```python
# app/services/invitation_service.py
class InvitationService:
    def __init__(self, conn):
        self.conn = conn
        self.user_service = UserService(conn)  # SHARED CONNECTION = SAME TRANSACTION

    def accept_invitation(self, token: str, password: str, first_name: str, last_name: str):
        """
        Atomic: invitation validation + user creation + invitation acceptance
        All in single transaction via shared connection.
        Caller (route) manages commit/rollback via `with get_db_connection() as db:`
        """
        with self.conn.cursor() as cur:
            # 1. Validate & lock invitation row
            cur.execute("""
                SELECT invitation_id, tenant_id, email, status, expires_at
                FROM platform.invitations
                WHERE token = %s AND status = 'pending' AND expires_at > NOW()
                FOR UPDATE
            """, (token,))
            invite = cur.fetchone()
            if not invite:
                raise Exception("Invalid or expired invitation")
            
            invitation_id, tenant_id, email, _, _ = invite
            
            # 2. Create user via canonical UserService (shares transaction via self.conn)
            payload = type('Payload', (), {
                'email': email,
                'password': password,
                'first_name': first_name,
                'last_name': last_name,
                'display_name': f"{first_name} {last_name}",
                'phone': None,
                'department': None,
                'tenant_id': tenant_id,
            })()
            
            # Calls UserService.create_user() - enforces password policy + tenant limit
            result = self.user_service.create_user(payload, tenant_id=tenant_id)
            user_id = result["data"]["id"]
            
            # 3. Update user with invitation_id and email_verified=FALSE
            cur.execute("""
                UPDATE platform.users
                SET invitation_id = %s, email_verified = FALSE
                WHERE id = %s
            """, (invitation_id, user_id))
            
            # 4. Mark invitation accepted
            cur.execute("""
                UPDATE platform.invitations
                SET status = 'accepted', accepted_at = NOW()
                WHERE invitation_id = %s
            """, (invitation_id,))
            
            # Commit/rollback handled by route's connection context manager
            return {"success": True, "data": {"user_id": user_id}}
```

**Key Guarantees:**
- Single transaction — `UserService` shares `self.conn` with invitation service (same connection = same transaction)
- `FOR UPDATE` locks invitation row — prevents concurrent acceptance
- `email_verified = FALSE` explicitly set after user creation
- `invitation_id` linked after user creation
- Password policy enforced via `UserService.create_user()`
- **Tenant limit enforced** via `UserService.create_user()` — **no bypass**
- If tenant limit exceeded, `ValueError` raised → entire transaction rolls back → invitation remains pending

---

## Email / Database Failure Behaviour

### POST /api/v1/invitations (Admin Creates Invitation)

| Scenario | Behaviour |
|----------|-----------|
| **A. DB transaction fails** | No invitation created, no email sent. Route returns 500. |
| **B. DB succeeds, SMTP send fails** | Invitation created in DB (status='pending'). Email error logged. Route returns 201 with warning: `"invitation_created": true, "email_sent": false, "warning": "Invitation created but email delivery failed. Use resend."` |
| **C. SMTP succeeds, DB rolls back** | Impossible — DB commit happens before email send. |

**Implementation:**
```python
# In route handler
with get_db_connection() as db:
    invitation = invitation_service.create_invitation(...)
    db.conn.commit()  # DB commit first

# Then send email (outside transaction)
email_result = email_service.send(render_invitation(...))
if not email_result.success:
    logger.error(f"Invitation email failed: {email_result.error}")
    return {"success": True, "data": {..., "email_sent": False, "warning": "..."}}
```

### POST /api/v1/invitations/{id}/resend (Admin Resends)

| Scenario | Behaviour |
|----------|-----------|
| DB update fails | No token change, no email sent. Returns error. |
| DB succeeds, SMTP fails | New token saved, email error logged. Returns 200 with warning. |

### POST /api/v1/invitations/accept (Public Accepts)

| Scenario | Behaviour |
|----------|-----------|
| User creation fails (limit, policy, etc.) | Transaction rolls back. Invitation remains pending. Returns 400/403. |
| User created, invitation update fails | Impossible — same transaction. |
| Email send after accept | Phase 2 sends NO email on accept. Phase 4 handles verification email. |

**No queue/outbox architecture introduced.** Minimal approach: log email failures, allow admin resend via UI.

---

## API Contracts

### POST /api/v1/invitations (Admin)
**Request:**
```json
{
  "email": "user@example.com",
  "message": "Optional personal message"
}
```
**No `role_name`** — role-based invitation is OUT OF SCOPE. Role assigned after acceptance via existing `UserService.assign_role()`.

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "invitation_id": "uuid",
    "email": "user@example.com",
    "status": "pending",
    "expires_at": "2026-09-21T10:00:00Z",
    "email_sent": true
  }
}
```
If email fails: `"email_sent": false, "warning": "Invitation created but email delivery failed. Use resend."`

### GET /api/v1/invitations (Admin)
**Query:** `?status=pending&page=1&page_size=50`
**Response:** 200 OK
```json
{
  "success": true,
  "data": [...],
  "total": 1,
  "page": 1,
  "page_size": 50
}
```

### DELETE /api/v1/invitations/{id} (Admin)
**Response:** 200 OK
```json
{ "success": true, "message": "Invitation revoked" }
```

### POST /api/v1/invitations/{id}/resend (Admin)
**Behaviour:** Revokes current token, generates new token, updates `expires_at = NOW() + 7 days`, sends new email.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "invitation_id": "uuid",
    "email": "user@example.com",
    "status": "pending",
    "expires_at": "2026-09-21T10:00:00Z",
    "email_sent": true
  }
}
```

### POST /api/v1/invitations/accept (Public)
**Request:**
```json
{
  "token": "abc123...",  // 64-char UUID string
  "password": "SecureP@ss1",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Transaction:** Single atomic transaction (see Integration Strategy above)

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Account created. Please verify your email address.",
  "user_id": "uuid"
}
```

**Error Responses:**
- `400` — Invalid/expired/used token
- `403` — Tenant user limit exceeded (from UserService)
- `422` — Password policy violation (from UserService)

---

## Token Specification

| Property | Value |
|----------|-------|
| Format | UUID v4 string (36 chars) or URL-safe base64 (43 chars) — fits in `VARCHAR(64)` |
| Generation | `uuid.uuid4()` or `secrets.token_urlsafe(32)` |
| Storage | `token VARCHAR(64) NOT NULL UNIQUE` |
| Expiry | 7 days from creation (`expires_at = NOW() + INTERVAL '7 days'`) |
| Uniqueness | UNIQUE constraint on `token` column |

---

## Frontend Components

### AcceptInvitePage (`/invites/accept?token=...`)
- Validates token format (UUID regex or 64-char alphanumeric)
- Form: password, confirm password, first_name, last_name
- POST to `/api/v1/invitations/accept`
- On success: redirect to `/login` with message

### InvitationsPage (`/administration/invitations`)
- Table: Email, Status, Invited By, Created, Expires, Actions
- "Invite User" button → modal with email + optional message
- Actions: Revoke (DELETE), Resend (POST `/resend`)
- Empty state: "No pending invitations"

### UsersPage Modification
- Add "Invite User" button in header
- Opens same invitation modal as InvitationsPage

---

## Acceptance Criteria (Phase 2 Only)

- [x] Admin can invite user by email → invitation created in DB, email sent via EmailService
- [x] If email fails, invitation still created, warning returned, admin can resend
- [x] User clicks link → `/invites/accept?token=...` shows form
- [x] User sets password → **user account created via `UserService.create_user()`** in same transaction
- [x] User created with `email_verified = FALSE`, `status = 'active'`, `invitation_id` set
- [x] Invitation marked `status = 'accepted'`, `accepted_at = NOW()`
- [x] **User has `email_verified = FALSE`** (verifiable via DB inspection)
- [x] Admin can list pending invitations (paginated)
- [x] Admin can revoke invitation
- [x] Admin can resend invitation (new token, new expiry)
- [x] Expired invitations cannot be accepted
- [x] Duplicate pending invitation per tenant+email prevented (partial unique index)
- [x] Tenant user limit enforced — invitation rejected if limit reached
- [x] All public endpoints rate-limited (5/hr/IP — already in Phase 1)
- [x] Audit trail via existing middleware (invitation created/accepted/revoked/resent)
- [x] No passwords/tokens in logs
- [x] Existing functionality unaffected

**Phase 2 does NOT test:**
- Email verification record creation
- Verification email send
- `/auth/verify-email` endpoint
- Login rejection based on `email_verified`

---

## Tests Required

### Backend
- Invitation CRUD: create, list, revoke, resend, accept, expire
- Duplicate email handling (partial unique index)
- Token validation (expired, used, invalid, concurrent accept)
- Atomic transaction: user created + invitation accepted OR both rolled back
- `UserService.create_user()` called with shared connection
- `invitation_id` set on user, `email_verified = FALSE`
- Password policy enforced via `UserService`
- Tenant limit enforced via `UserService` (invitation rejected if limit reached)
- Email failure handling: DB succeeds, SMTP fails → invitation created, warning returned
- Audit logging (middleware captures events)

### Frontend
- AcceptInvitePage renders, validates, submits
- InvitationsPage lists, creates, revokes, resends
- UsersPage "Invite User" opens modal

### Integration
- EmailService.send() called with rendered invitation template on create and resend
- Rate limiter returns 429 on 6th accept attempt
- Existing lead rate limiter unaffected

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Phase 1 EmailService | ✅ COMPLETE |
| Phase 1 Rate Limiting | ✅ COMPLETE |
| `UserService.create_user()` | ✅ EXISTS — used unchanged (enforces limit + policy) |
| `platform.users.email_verified` | ✅ EXISTS (DEFAULT FALSE) |
| `AuthService.login()` | ✅ EXISTS — Phase 4 adds `email_verified` check |
| RBAC (`UserService.assign_role()`) | ✅ EXISTS |
| Audit middleware | ✅ EXISTS |

---

## Prerequisite Decisions (Resolved)

| Decision | Resolution |
|----------|------------|
| Invitation role | OUT OF SCOPE — admin assigns via existing RBAC after acceptance |
| Email verification | **Phase 4** — Phase 2 creates user with `email_verified = FALSE` |
| Token format | UUID v4 string, `VARCHAR(64)`, 7-day expiry |
| Duplicate email | Partial unique index: `WHERE status = 'pending'` |
| Transaction atomicity | Shared connection + `FOR UPDATE` lock |
| Tenant limit | **Enforced** via `UserService.create_user()` — no bypass |
| Resend endpoint | `POST /api/v1/invitations/{id}/resend` — explicit |
| Email/DB failure | DB commit first, then email; log failures, allow resend |

---

## Unresolved Dependencies (Discovered During Inspection)

| # | Dependency | Status |
|---|------------|--------|
| 1 | `UserService.create_user()` enforces tenant limit | **RESOLVED** — limit enforced, no bypass |
| 2 | `UserService` shares connection for atomicity | **VERIFIED** — `UserService(conn)` works |
| 3 | `create_user()` doesn't set `email_verified` or `invitation_id` | **RESOLVED** — Phase 2 updates these after `create_user()` returns |
| 4 | No email queue/outbox | **RESOLVED** — minimal approach: log failure, allow resend |

---

## Files Created (Estimated)

| File | Type |
|------|------|
| `app/api/routes/invitation_routes.py` | Backend API |
| `app/services/invitation_service.py` | Business logic |
| `app/db/repositories/invitation_repository.py` | Data access |
| Migration SQL for `platform.invitations` + `users.invitation_id` + partial index | DB |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/invites/AcceptInvitePage.tsx` | Frontend |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/administration/InvitationsPage.tsx` | Frontend |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/components/invitation/InvitationModal.tsx` | Frontend |
| `tests/test_invitation_system.py` | Tests |

---

## Implementation Order

1. **DB Migration** — Create `platform.invitations` + `users.invitation_id` + partial unique index
2. **Repository** — CRUD for invitations
3. **Service** — Business logic with atomic accept transaction using shared connection
4. **Routes** — API endpoints with auth/rate limiting
5. **Frontend Pages** — AcceptInvitePage, InvitationsPage, InvitationModal
6. **UsersPage** — Add Invite User button
7. **Tests** — Backend + frontend + integration
8. **Evidence** — Phase 2 scope + evidence docs

---

## Approval Gate

**Phase 2 may begin ONLY after:**
- [x] This revised scope reviewed and approved
- [x] Phase 1 evidence reviewed and accepted
- [x] Explicit go-ahead given

**No implementation before approval.**