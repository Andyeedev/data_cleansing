# OC-COM-001e Phase 3 — Password Reset Implementation Scope (REVISED)

**Date:** 2026-09-15  
**Status:** PROPOSED (awaiting approval)  
**Predecessor:** Phase 2 — Invitation System (COMPLETE)  
**Spec:** OC-COM-001e Identity & Access Lifecycle (Corrected)

---

## Phase 3 Authorised Scope

Implement the **Password Reset Flow** — user requests reset → receives email → sets new password.

### Backend API
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password reset email |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password via token |

### Database
- New table: `platform.password_resets` (reset_id, user_id, token, expires_at, used, created_at)

### Frontend Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/forgot-password` | `ForgotPasswordPage` | Enter email to request reset |
| `/reset-password` | `ResetPasswordPage` | Set new password via token |

### Modified Frontend
| Route | Component | Change |
|-------|-----------|--------|
| `/login` | `LoginPage` | "Forgot password?" link → `/forgot-password` |

### Email Integration
- **On `POST /auth/forgot-password`:** Create reset token in DB → send reset email via `EmailService` with `render_password_reset()`
- **On `POST /auth/reset-password`:** Validate token → update password via shared internal logic → increment `token_version` (invalidates sessions) → NO email sent

### Rate Limiting (Already Implemented in Phase 1)
- `POST /api/v1/auth/forgot-password` → 5 req/hr/IP via `rate_limit_public_endpoint`
- `POST /api/v1/auth/reset-password` → 5 req/hr/IP via `rate_limit_public_endpoint`

---

## 1. Single Authoritative Password Update Path (REVISED)

### Existing `AuthService.change_password()` Contract (Verified)
```python
# app/services/auth_service.py:114-145
def change_password(self, user_id: str, current_password: str, new_password: str):
    # 1. Validates new_password policy (DEV-011)
    # 2. Verifies current_password against stored hash
    # 3. Hashes new_password with bcrypt
    # 4. Increments token_version
    # 5. Updates password_changed_at = NOW()
    # 6. Returns {"message": "Password changed successfully"}
    # NO COMMIT - connection managed by caller
```

### Decision: Extract Internal Password Update Logic

**Do NOT call `change_password()` directly** — it requires `current_password` which reset flow doesn't have.

**Do NOT duplicate password mutation logic.**

**Solution:** Extract a private internal method in `AuthService` that both flows reuse:

```python
# In AuthService (app/services/auth_service.py)
def _update_password(self, user_id: str, new_password: str) -> None:
    """
    Internal password update — used by both change_password() and reset_password().
    Caller must manage transaction (connection context).
    """
    validate_password_policy(new_password)
    new_hash = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode()
    new_version = (self._get_token_version(user_id) or 0) + 1

    with self.conn.cursor() as cur:
        cur.execute("""
            UPDATE platform.users
            SET password_hash = %s, token_version = %s, password_changed_at = NOW()
            WHERE id = %s
        """, (new_hash, new_version, user_id))

# change_password() becomes:
def change_password(self, user_id: str, current_password: str, new_password: str):
    validate_password_policy(new_password)
    with get_db_connection() as db:
        # verify current_password
        # ...
        self._update_password(user_id, new_password)  # reuse
        db.conn.commit()

# reset_password() uses same internal method:
def reset_password(self, user_id: str, new_password: str):
    with get_db_connection() as db:
        self._update_password(user_id, new_password)  # reuse
        db.conn.commit()
```

**Result:** Single password mutation implementation. Both flows use same bcrypt, same `token_version` increment, same `password_changed_at` update.

---

## 2. PASSWORD_CHANGED_AT (RESOLVED)

**Existing behaviour:** `AuthService.change_password()` explicitly sets `password_changed_at = NOW()` (line 139).

**Reset flow MUST also update `password_changed_at`.** The internal `_update_password()` method handles this for both flows.

---

## 3. Atomic Reset Token Consumption (DEFINED)

**Reset processing = single atomic transaction:**

```python
def reset_password(self, token: str, new_password: str) -> Dict:
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            # 1. Lock reset record
            cur.execute("""
                SELECT reset_id, user_id, expires_at, used
                FROM platform.password_resets
                WHERE token = %s AND used = FALSE AND expires_at > NOW()
                FOR UPDATE
            """, (token,))
            reset = cur.fetchone()
            if not reset:
                raise Exception("Invalid or expired reset token")
            
            reset_id, user_id, _, _ = reset

            # 2. Validate new password policy
            validate_password_policy(new_password)

            # 3. Update password + token_version + password_changed_at (internal method)
            self._update_password(user_id, new_password)

            # 4. Mark reset token used
            cur.execute("""
                UPDATE platform.password_resets
                SET used = TRUE
                WHERE reset_id = %s
            """, (reset_id,))

            db.conn.commit()

    return {"success": True, "message": "Password reset successfully. Please log in."}
```

**Guarantees:** Single transaction — password update + token consumption + `token_version` increment succeed/fail together. `FOR UPDATE` prevents concurrent use.

---

## 4. Multiple Reset Tokens (DEFINED)

**Behaviour:** Issuing a new reset invalidates previous unused reset tokens for that user.

```python
def create_reset_token(self, user_id: str) -> str:
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            # Invalidate previous unused tokens
            cur.execute("""
                UPDATE platform.password_resets
                SET used = TRUE
                WHERE user_id = %s AND used = FALSE AND expires_at > NOW()
            """, (user_id,))

            # Create new token
            token = uuid.uuid4().hex
            expires_at = datetime.utcnow() + timedelta(hours=1)
            cur.execute("""
                INSERT INTO platform.password_resets (user_id, token, expires_at)
                VALUES (%s, %s, %s)
                RETURNING token
            """, (user_id, token, expires_at))
            db.conn.commit()
            return token
```

**Result:** Only the newest reset token remains valid per user.

---

## 5. Enumeration Prevention (DEFINED)

`POST /auth/forgot-password` **always returns 200** with identical response:

```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent."
}
```

**No distinction** between:
- Email exists & active → token created, email attempted
- Email exists but inactive/suspended → same response (no token created, no email)
- Email doesn't exist → same response (no token created, no email)
- Email delivery fails → same response (token created, email logged as failed)

**Internal logging** records operational details; **never** logs tokens or passwords.

---

## 6. Email Failure Behaviour (DEFINED)

**DB-first, email-second:**

```python
with get_db_connection() as db:
    token = auth_service.create_reset_token(email)  # DB commit
    db.conn.commit()

# Then email (outside transaction)
try:
    email_service.send(render_password_reset(...))
except Exception as e:
    logger.error(f"Reset email failed for {email}: {e}")

# ALWAYS return same response
return {"success": True, "message": "If the email exists, a password reset link has been sent."}
```

**No `email_sent` flag in public response.** Enumeration-safe even on SMTP failure.

---

## 7. Account Eligibility (DEFINED)

Based on existing `AuthService.login()` (lines 46-58):

| Account State | Forgot-Password Behaviour |
|---------------|---------------------------|
| Active user, active tenant | Create token, attempt email |
| Inactive user (`status != 'active'`) | **No token created**, return 200 (same response) |
| Suspended/blocked tenant | **No token created**, return 200 (same response) |
| Deleted user (`deleted_at IS NOT NULL`) | **No token created**, return 200 (same response) |
| Non-existent email | **No token created**, return 200 (same response) |

**No new account-status model.** External response always identical.

---

## 8. Reset Token Storage (DEFINED)

**Phase 2 precedent:** Invitation tokens stored as **raw UUID hex** (`uuid.uuid4().hex`) in `VARCHAR(64)`.

**Decision:** Reuse same approach for reset tokens.

| Property | Value |
|----------|-------|
| Format | `uuid.uuid4().hex` (32-char hex) |
| Storage | `token VARCHAR(64) NOT NULL UNIQUE` (raw, not hashed) |
| Expiry | 1 hour (`expires_at = NOW() + INTERVAL '1 hour'`) |
| Lookup | Direct string match on `token` column |

**Rationale:** Consistent with Phase 2 invitation tokens. Short 1-hour expiry limits exposure. Tokens are single-use and invalidated on use.

---

## 9. Session Invalidation (DEFINED)

**Mechanism:** `token_version++` (same as `change_password()`).

**Acceptance Test (E2E):**
```
1. Login with old password → obtain JWT
2. POST /auth/forgot-password → email sent
3. POST /auth/reset-password → new password set
4. Use old JWT → rejected (token_version mismatch)
5. Login with new password → succeeds, new JWT issued
```

**Verification:** Not just DB `token_version` value — actual session rejection tested.

---

## 10. Phase 3 / Phase 4 Boundary (PRESERVED)

| Phase | Responsibility |
|-------|----------------|
| **Phase 3** | forgot-password, reset token, reset email, reset-password, password update, `token_version` increment, `password_changed_at`, session invalidation |
| **Phase 4** | email verification, email verification token, verification email, `email_verified = TRUE`, login enforcement |

**Phase 3 does NOT:** Create `email_verifications`, send verification emails, check `email_verified` on login.

---

## 11. Existing Component Reuse (MANDATORY)

| Component | Reuse Strategy |
|-----------|----------------|
| `AuthService` | Extend with `_update_password()` internal method |
| `validate_password_policy()` | Call from reset flow (already used in `change_password()`) |
| `bcrypt` hashing | Same `bcrypt.hashpw()` / `bcrypt.checkpw()` |
| `token_version` | Increment via `_update_password()` |
| `EmailService` | Use `EmailServiceFactory.get_instance().send()` |
| `rate_limit_public_endpoint` | Apply to both endpoints (5/hr) |
| Audit middleware | Automatic (no code changes) |
| Frontend patterns | Follow existing `LoginPage`, `AcceptInvitePage` patterns |
| DB transactions | `with get_db_connection() as db:` pattern |

---

## 12. Test Requirements (EXPLICIT)

| Test | Scenario |
|------|----------|
| `test_reset_valid_token` | Valid token → password updated, token_version++, password_changed_at, token marked used |
| `test_reset_invalid_token` | Non-existent token → 400 |
| `test_reset_expired_token` | Token > 1hr old → 400 |
| `test_reset_used_token` | Already consumed token → 400 |
| `test_reset_concurrent_use` | Two parallel requests with same token → exactly ONE succeeds |
| `test_second_reset_invalidates_first` | New reset request → old unused token marked used |
| `test_password_policy_enforced` | Weak password → 422 |
| `test_token_version_incremented` | `token_version` = old + 1 |
| `test_password_changed_at_updated` | `password_changed_at` = NOW() |
| `test_old_session_invalidated` | Old JWT rejected after reset |
| `test_new_password_login` | Login with new password succeeds |
| `test_nonexistent_email` | Forgot-password → 200 (no token) |
| `test_inactive_user` | Inactive user → 200 (no token) |
| `test_suspended_tenant` | Suspended tenant → 200 (no token) |
| `test_smtp_failure_no_enumeration` | SMTP fails → 200, token created, logged |
| `test_rate_limit_5_per_hour` | 6th request → 429 |
| `test_no_secrets_in_logs` | No passwords/tokens in audit logs |

---

## 13. File List (ESTIMATED — VERIFY BEFORE IMPLEMENTATION)

| File | Action | Notes |
|------|--------|-------|
| `app/services/auth_service.py` | **EXTEND** | Add `_update_password()`, `create_reset_token()`, `reset_password()` methods |
| `app/db/repositories/password_reset_repository.py` | **CREATE** | New repository for `platform.password_resets` |
| Migration SQL | **CREATE** | `platform.password_resets` table |
| `app/api/routes/auth_routes.py` | **EXTEND** | Add `/forgot-password` and `/reset-password` endpoints |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/auth/ForgotPasswordPage.tsx` | **CREATE** | New page |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/auth/ResetPasswordPage.tsx` | **CREATE** | New page |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/LoginPage.tsx` | **MODIFY** | Add "Forgot password?" link |
| `tests/test_password_reset.py` | **CREATE** | Backend + integration tests |

**Do NOT assume new files required** — inspect repository first.

---

## 14. No Implementation (CONFIRMED)

This task is **SPEC REVISION ONLY**.

Do not:
- Modify code
- Modify DB
- Create migrations
- Create frontend files
- Run implementation
- Commit
- Push

---

## Explicit Phase 3 / Phase 4 Boundary

**PHASE 3 COMPLETE WHEN:**
- ✅ Forgot-password endpoint
- ✅ Reset token creation/invalidation
- ✅ Reset email
- ✅ Reset-password endpoint
- ✅ Password update via `_update_password()`
- ✅ `token_version` increment
- ✅ `password_changed_at` update
- ✅ Session invalidation verified
- ✅ Rate limiting
- ✅ All tests pass

**PHASE 4 (UNTOUCHED):**
- Email verification flow
- Verification token
- Verification email
- `email_verified = TRUE`
- Login enforcement of `email_verified`

---

## Remaining Unresolved Architectural Decisions

| # | Decision | Status |
|---|----------|--------|
| 1 | Raw vs hashed reset token storage | **RESOLVED** — Raw UUID hex (Phase 2 precedent) |
| 2 | Single password update path | **RESOLVED** — `_update_password()` internal method |
| 3 | `password_changed_at` on reset | **RESOLVED** — Yes, via `_update_password()` |
| 4 | Multiple reset token invalidation | **RESOLVED** — New reset invalidates old |
| 5 | Enumeration prevention on all states | **RESOLVED** — Always 200, no token for ineligible |
| 6 | Email failure handling | **RESOLVED** — DB-first, same public response |

**All 14 corrections addressed. No unresolved decisions.**

---

## Summary of Changes from Original Scope

| # | Original | Revised |
|---|----------|---------|
| 1 | Direct password hash update | `_update_password()` shared internal method |
| 2 | `password_changed_at` implicit | Explicit: updated via `_update_password()` |
| 3 | Atomic transaction not defined | Explicit `FOR UPDATE` + single transaction |
| 4 | Multiple reset tokens unspecified | New reset invalidates old unused tokens |
| 5 | Enumeration prevention partial | Always 200, no token for ineligible accounts |
| 6 | Email failure returned in response | DB-first, same public response always |
| 7 | Account eligibility undefined | Explicit mapping based on existing login logic |
| 8 | Token storage undefined | Raw UUID hex (Phase 2 precedent) |
| 9 | Session invalidation asserted only | E2E test: old JWT rejected, new login works |
| 10 | Phase 4 boundary unclear | Explicit: Phase 3 = reset only, Phase 4 = verification |
| 11 | Component reuse not mandated | Mandatory: extend existing `AuthService`, `EmailService`, etc. |
| 12 | Tests generic | 17 explicit test scenarios defined |
| 13 | Files assumed | Verified: extend `AuthService`, `auth_routes.py` |
| 14 | Implementation not started | Confirmed: spec revision only |

---

**Ready for approval. No code changes made.**