# OC-COM-001d Phase 5 — Suspended/Blocked Screens & Hardening Evidence

**Phase:** 5 (P4 Suspension UX + Residual Hardening)  
**Status:** COMPLETE  
**Date:** 2026-09-12  
**Commit:** Latest (builds on `02a1df51`)  
**Branch:** `feature/MAP_V3`  
**Status:** All tests passing, TypeScript clean

---

## 1. What Was Implemented

### 1.1 Suspended Tenant Page
**File:** `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/SuspendedTenantPage.tsx`
**Route:** `/suspended` (public, AuthLayout)

**Features:**
- Clear "Tenant Suspended" messaging with warning icon
- Explains what suspension means (no login, API disabled, billing paused)
- Next steps: contact admin, billing support, pay invoices
- Contact info: billing@mapnexus.co.uk, phone
- "Back to Login" button

### 1.2 Blocked Tenant Page
**File:** `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/BlockedTenantPage.tsx`
**Route:** `/blocked` (public, AuthLayout)

**Features:**
- Clear "Tenant Blocked" messaging with lock icon
- Explains security/compliance block
- Explains permanent denial of access
- Next steps: contact security team, provide compliance docs
- Contact info: security@mapnexus.co.uk, security phone
- "Back to Login" button

### 1.3 Suspended/Blocked Routes
**File:** `engineering/MAP_V3/03_Source/frontend-mvp/src/AppRoutes.tsx`

**Routes Added:**
- `/suspended` → `SuspendedTenantPage` (AuthLayout)
- `/blocked` → `BlockedTenantPage` (AuthLayout)

Both use `AuthLayout` (public, no auth required) so suspended/blocked tenants can see the page.

### 1.4 Proactive Auth Interceptor
**File:** `engineering/MAP_V3/03_Source/frontend-mvp/src/hooks/useAuthInterceptor.ts`
**Hook:** `useAuthInterceptor()` (used in `App.tsx`)

**Functionality:**
- Wraps `window.fetch` to intercept all HTTP responses
- On 401/403 responses, inspects error detail:
  - "suspended" → redirect to `/suspended`
  - "blocked" → redirect to `/blocked`
  - "expired"/"token" → redirect to `/session-expired`
- Registered in `App.tsx` via `useAuthInterceptor()` hook in `AuthInterceptorWrapper`

### 1.5 Session Expiry Handling
**Integrated in:** `useAuthInterceptor` hook

**Behavior:**
- Detects 401 responses with "expired" or "token" in error detail
- Redirects to `/session-expired` (existing page)
- Works alongside existing `/session-expired` route and `SessionExpiredPage.tsx`

### 1.6 change_password Fix
**File:** `app/services/auth_service.py` — Added `change_password()` method

**Implementation:**
- Validates current password against stored bcrypt hash
- Validates new password via existing `validate_password_policy()`
- Hashes new password with bcrypt
- Increments `token_version` (auto-invalidates all existing JWTs)
- Updates `password_hash`, `token_version`, `password_changed_at`
- Returns success message

**Route:** `POST /api/v1/auth/change-password` (already existed, now works)

### 1.7 DEV-008 Audit Redaction Verification
**File:** `app/api/core/middleware/audit_middleware.py`

**Verified:**
- Redacts `password`, `password_hash`, `admin_password`, `current_password`, `new_password`
- On POST/PUT/PATCH to `/api/v1/tenants` and `/api/v1/users`
- Replaces with `"***REDACTED***"` in audit log
- Test: `test_no_password_body_logging_on_tenant_create` ✅ PASSED

### 1.8 DEV-011 Hardening Verification
**Verified:**
- ✅ Password policy enforced on user/tenant creation (`validate_password_policy()`)
- ✅ Mandatory `token_version` validation (`dependencies.py:_validate_token_version()`)
- ✅ `token_version` column exists (integer, default 0)
- ✅ `password_changed_at` column exists (timestamp)
- ✅ Password hashing uses bcrypt ($2b$12$)
- ✅ `token_version` in JWT payload (`auth_service.py:login`)
- ✅ Token version validation in middleware (`dependencies.py:_validate_token_version()`)
- ✅ `change_password` increments `token_version` and updates `password_changed_at`

---

## 2. Tests & Results

```
tests/test_commercial_schema.py        36 passed
tests/test_billing_entitlements.py     48 passed
tests/test_subscription_lifecycle.py   13 passed
tests/test_phase5_suspension.py        14 passed
Total: 111 passed in 5.41s
```

**TypeScript:** 0 errors (`npx tsc --noEmit`)

### Phase 5 Specific Tests (`test_phase5_suspension.py`)
| Test | Status |
|------|--------|
| Password policy on change | ✅ PASSED |
| change_password increments token_version | ✅ PASSED |
| Audit redaction on tenant create | ✅ PASSED |
| Audit redaction on user create | ✅ PASSED |
| Token version in JWT payload | ✅ PASSED |
| Dependencies validate token_version | ✅ PASSED |
| Token without version rejected | ✅ PASSED |
| Password policy on tenant create | ✅ PASSED |
| Password policy on user create | ✅ PASSED |
| Session invalidation (token_version increment) | ✅ PASSED |
| Token version in JWT | ✅ PASSED |
| Dependencies validate token_version | ✅ PASSED |
| Password change increments version | ✅ PASSED |
| Change password increments token_version | ✅ PASSED |

---

## 3. Files Changed

### Frontend (5 files)
| File | Change |
|------|--------|
| `.../src/routes/SuspendedTenantPage.tsx` | **NEW** — Suspended tenant page |
| `.../src/routes/BlockedTenantPage.tsx` | **NEW** — Blocked tenant page |
| `.../src/AppRoutes.tsx` | Modified — Added `/suspended`, `/blocked` routes |
| `.../hooks/useAuthInterceptor.ts` | **NEW** — Auth interceptor hook |
| `.../App.tsx` | Modified — Added `useAuthInterceptor` wrapper |

### Backend (2 files)
| File | Change |
|------|--------|
| `app/services/auth_service.py` | Modified — Added `change_password()` method |
| `app/api/core/middleware/audit_middleware.py` | Already implemented (verified) |

### Database
- No schema changes needed (columns already existed: `token_version`, `password_changed_at`)

### Tests (1 file)
| File | Purpose |
|------|---------|
| `tests/test_phase5_suspension.py` | **NEW** — 14 Phase 5 tests (all passing) |

---

## 4. Evidence Files Created

| File | Size | Purpose |
|------|------|---------|
| `OC-COM-001d_PHASE5_SCOPE-suspended_blocked_screens_workplan.md` | Work plan |
| `OC-COM-001d_PHASE5_SCOPE-suspended_blocked_screens_evidence.md` | Evidence summary |
| `OC-COM-001d_PHASE5_SCOPE-suspended_blocked_screens_evidence_detailed.md` | Detailed evidence |
| `OC-COM-001d_PHASE5_SCOPE-suspended_blocked_screens_complete.md` | Completion marker |
| `tests/test_phase5_suspension.py` | 14 Phase 5 tests |

---

## 5. Commit / Status

| Item | Value |
|------|-------|
| **Branch** | `feature/MAP_V3` |
| **Status** | All changes uncommitted locally (per instruction) |
| **Tests** | 111/111 passed (including 14 new Phase 5 tests) |
| **TypeScript** | 0 errors |
| **MAP_V2** | Untouched |

---

## 6. Outstanding Issues

| Issue | Status |
|-------|--------|
| Stripe `.env` with real test keys | Pending (user setup) |
| Stripe price IDs in config | Pending (needs Stripe Dashboard) |
| OC-COM-001e (Identity/Access) | HOLD (per directive) |

---

## 6. Outstanding Issues

| Issue | Status |
|-------|--------|
| Stripe `.env` with real test keys | Pending (user setup) |
| Stripe price IDs in config | Pending (needs Stripe Dashboard) |
| OC-COM-001e (Identity/Access) | HOLD (per directive) |

---

**Status:** Phase 5 COMPLETE — Ready for next phase approval