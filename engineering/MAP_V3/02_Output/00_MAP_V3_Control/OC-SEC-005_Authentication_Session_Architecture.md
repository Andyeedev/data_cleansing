# OC-SEC-005 — Authentication & Session Architecture
**WORK PACKAGE:** OC-SEC-005 | **ID:** OC-SEC-005 | **DATE:** 2026-09-07 | **MAP VERSION:** MAP_V3
**OBJECTIVE:** Deep audit and remediation of authentication, session management, encryption key lifecycle, and service-to-service security.
**CREATED FROM:** OC-SEC-002 revised assessment (findings 2, 6, 7, 9).

---

## SCOPE

### Authentication Gaps
* `JWT` in `localStorage` (XSS-extractable) — migrate to `httpOnly` cookie
* No account lockout after failed login attempts
* No password policy enforcement
* `failed_login_attempts` column exists but no lockout logic

### Session Management
* `2h` fixed expiry, no refresh token strategy
* No session invalidation on password change
* No concurrent session limit
* `isTokenExpired` client-side check only

### Encryption Key Lifecycle
* `EncryptionManager` Fernet key — no rotation policy
* `JWT_SECRET_KEY` — no rotation strategy
* `password_encrypted` — Fernet AES-128-CBC, no key versioning
* Key Vault access policies not audited

### Service-to-Service Authentication
* Internal API calls (if any) — no service principal verification
* `snowflake` JWT DER vs `externalbrowser` — two separate auth paths

---

## FILES TO INSPECT
* `app/api/core/auth/jwt_config.py` — JWT config, secret key management
* `app/api/core/auth/dependencies.py` — `get_current_user` implementation
* `app/services/credential_service.py` — `EncryptionManager`, Fernet key
* `app/api/main.py` — `slowapi` limiter, login route
* `app/api/routes/auth_routes.py` — login, token refresh, session management
* `engineering/MAP_V2/03_Source/frontend-mvp/src/context/AuthContext.tsx` — JWT storage
* `engineering/MAP_V2/03_Source/frontend-mvp/src/services/apiClient.ts` — token handling

---

## PROPOSED CHANGES (P1)
1. Migrate JWT from `localStorage` to `httpOnly` secure cookie
2. Add account lockout after 5 failed attempts (15-min window)
3. Implement encryption key rotation (Fernet + JWT_SECRET_KEY)
4. Add session invalidation on password change
5. Add refresh token strategy (optional, needs frontend refactor)

---

## DEPENDENCIES
* Frontend `apiClient` refactor required for httpOnly cookie
* OC-SEC-001 CSP must allow cookie domain

---

## STATUS:** NOT STARTED — Awaiting approval.
