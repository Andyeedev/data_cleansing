# OC-SEC-005 — Evidence Report

**Date:** 2026-09-07
**Status:** COMPLETE
**Tests:** 22/22 passing (85/85 combined with OC-SEC-006)

---

## What Was Done

Hardened the authentication system: JWT moved from body/Authorization header to httpOnly Secure cookie, account lockout implemented, password policy enforced, session invalidation via token_version on password change.

## Files Modified

| File | Change |
|------|--------|
| `app/api/core/auth/dependencies.py` | JWT extracted from cookie first, then Authorization header fallback. Added `_validate_token_version()` for session invalidation. |
| `app/services/auth_service.py` | Account lockout (5 attempts / 15-min), password policy (8+ chars, uppercase, lowercase, digit), `token_version` in JWT and DB, `change_password()` method with session invalidation. |
| `app/api/routes/auth_routes.py` | Login sets httponly/secure/samesite cookie (no token in body). Added `POST /logout` to clear cookie. Added `POST /change-password` endpoint. |
| `MAP_V2/03_Source/database/create_platform_schema.sql` | Added `token_version INTEGER DEFAULT 0` to `platform.users`. |
| `engineering/MAP_V3/.../migrations/OC-SEC-005_add_token_version.sql` | Migration to add `token_version` column. |
| `tests/test_auth_hardening.py` | NEW — 22 tests. |

## Test Results

```
tests/test_auth_hardening.py — 22 passed
tests/test_edge_cases_isolation.py — 11 passed
tests/test_operational_routes_isolation.py — 13 passed
tests/test_user_rbac_isolation.py — 19 passed
tests/test_credential_isolation.py — 20 passed
Total: 85/85 passing
```

## Implementation Details

### 1. JWT → httpOnly Secure Cookie
- Login sets `access_token` cookie with `httponly=True`, `secure=True`, `samesite="strict"`, `path="/"`
- Cookie max age: 2 hours (matches JWT expiry)
- Token no longer returned in response body
- `dependencies.py` reads from cookie first, falls back to `Authorization` header for API clients
- `POST /logout` clears cookie

### 2. Account Lockout
- `MAX_FAILED_ATTEMPTS = 5`, `LOCKOUT_MINUTES = 15`
- `failed_login_attempts` incremented on each failed login
- After 5 failures, `locked_until` set to now + 15 minutes
- Locked users get clear error message with remaining minutes
- On successful login, `failed_login_attempts` and `locked_until` reset

### 3. Password Policy
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- Enforced on `change_password` and `get_password_hash`

### 4. Session Invalidation
- `token_version` column added to `platform.users`
- `token_version` included in JWT payload
- `dependencies.py` validates `token_version` from JWT matches DB value
- On password change, `token_version` incremented → all existing JWTs invalidated

## What Was NOT Changed (Per Approval)
- Refresh-token architecture (deferred)
- Encryption-key rotation (deferred — requires design + migration strategy)
- CSP cookie domain (CSP does not control cookie transmission)
