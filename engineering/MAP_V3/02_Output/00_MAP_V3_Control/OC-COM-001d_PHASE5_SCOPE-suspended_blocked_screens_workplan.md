# OC-COM-001d Phase 5 — Investigation & Proposed Work Plan

**Phase:** 5 (P4 Suspension UX + Residual Hardening)  
**Status:** INVESTIGATION COMPLETE — PROPOSED WORK PLAN  
**Date:** 2026-09-12  
**Prerequisites:** Phase 4 COMPLETE (approved)

---

## 1. Current State Analysis

### 1.1 What's Already Implemented (Phase 1-4)

| Area | Status | Details |
|------|--------|---------|
| **Tenant suspension check at login** | ✅ DONE | `auth_service.py:49-58` — rejects login if `tenants.status != 'ACTIVE'` |
| **Tenant middleware** | ✅ DONE | `dependencies.py` — derives tenant from JWT, validates tenant exists |
| **Session expiry page** | ✅ DONE | `/session-expired` route + `SessionExpiredPage.tsx` |
| **Access denied page** | ✅ DONE | `/access-denied` route |
| **Password policy** | ✅ DONE | `auth_service.py:14-25` — enforced on create paths (DEV-011) |
| **Token version validation** | ✅ DONE | `dependencies.py:_validate_token_token()` — mandatory, rejects missing version |
| **Token version increment** | ✅ DONE | `auth_service.py` change_password increments (but change_password is broken) |
| **Audit body redaction** | ✅ DONE | `audit_middleware.py` — redacts passwords on `/tenants`, `/users` |
| **Session expiry page** | ✅ DONE | `/session-expired` route + `SessionExpiredPage.tsx` |

---

### 1.2 What's MISSING (Phase 5 Scope)

| Requirement (from spec) | Current Status | Gap |
|-------------------------|----------------|-----|
| **Suspended/blocked tenant screens** | ❌ MISSING | No dedicated UI for suspended/blocked tenants (only login rejection) |
| **Session expiry handling** | PARTIAL | Page exists but no auto-redirect / proactive handling |
| **DEV-006 verification** | PARTIAL | Login check done; need suspended/blocked UX screens |
| **DEV-008 verification** | DONE | Audit middleware redacts passwords on `/tenants`, `/users` |
| **DEV-011 verification** | PARTIAL | Password policy ✅, token_version ✅, but `change_password` broken |
| **Session expiry proactive handling** | ❌ MISSING | No automatic redirect on 401/token expiry |
| **Suspended/blocked tenant UX** | ❌ MISSING | No dedicated screens, no proactive redirect |

---

## 2. Phase 5 Scope Definition (from Spec)

### Spec Requirements (Phase 5 — P4 Suspension UX + Residual Hardening)

| Spec Item | Description |
|-----------|-------------|
| **P4 suspension UX** | suspended/blocked screens, session-expiry handling |
| **Residual hardening** | verification of DEV-006/008/011 |

### DEV Requirements to Verify

| DEV | Requirement | Current Status |
|-----|-------------|----------------|
| **DEV-006** | login respects `tenants.status` (suspended ⇒ no session); wire tenant middleware; clear suspended/blocked UX | Login check ✅; Middleware ✅; **UX screens MISSING** |
| **DEV-008** | audit-body redaction on POST /tenants + POST /users | ✅ DONE (audit_middleware.py) |
| **DEV-011** | password policy on creation paths; token-version validation mandatory; existing session architecture preserved | Password policy ✅; token_version ✅; **change_password broken** |

---

## 3. Proposed Work Plan

### Phase 5 Work Items

| # | Work Item | Description | Effort | Dependencies |
|---|-----------|-------------|--------|--------------|
| **5.1** | **Create SuspendedTenantPage** | Dedicated UI for suspended tenants (shown when tenant.status=SUSPENDED) | S | — |
| **5.2** | **Create BlockedTenantPage** | Dedicated UI for blocked tenants (if distinct from suspended) | S | — |
| **5.3** | **Proactive Suspended Redirect Middleware** | Frontend interceptor: detect 401/403 with suspended reason → redirect to SuspendedTenantPage | M | 5.1 |
| **5.4** | **Proactive Session Expiry Handling** | Axios interceptor: detect 401 with expired token → redirect to /session-expired | S | — |
| **5.5** | **Fix change_password endpoint** | Implement `AuthService.change_password()` with token_version increment | M | — |
| **5.6** | **Verify DEV-008 Audit Redaction** | Confirm audit middleware redacts passwords on all provisioning routes | S | — |
| **5.7** | **Verify DEV-011 Hardening** | Confirm token_version validation, password policy, session architecture | S | — |
| **5.8** | **Add Suspended/Blocked Routes** | Add routes: `/suspended`, `/blocked` (public auth layout) | S | 5.1, 5.2 |
| **5.9** | **Add Proactive Auth Interceptor** | Axios interceptor for 401/403 handling → redirect | M | 5.3, 5.4 |
| **5.10** | **Tests** | Unit/integration tests for suspended flow, session expiry, change_password | M | 5.1-5.5 |

---

## 4. Detailed Technical Design

### 5.1 SuspendedTenantPage (New File)
**Location:** `.../src/routes/SuspendedTenantPage.tsx`
**Route:** `/suspended` (public auth layout)

**UI Requirements:**
- Clear message: "Your tenant account has been suspended"
- Explain: "Contact your administrator / billing to restore access"
- Show tenant name, suspension reason (if available), contact info
- **No login form** — tenant is suspended, login will fail anyway
- Contact support CTA

### 5.2 BlockedTenantPage (New File)
**Location:** `.../src/routes/BlockedTenantPage.tsx`
**Route:** `/blocked` (public auth layout)

**UI Requirements:**
- Clear message: "Your tenant account has been blocked"
- Explain: "This account has been blocked due to policy violation / security concern"
- Contact support CTA
- **No login form**

### 5.3 Proactive Suspended Redirect Middleware
**Location:** `.../src/hooks/useAuthInterceptor.ts` (new) or extend `useAuth`

**Logic:**
```typescript
// In axios interceptor or ProtectedRoute wrapper
if (error.response?.status === 401) {
  const errorData = error.response.data;
  if (errorData?.detail?.includes('suspended') || errorData?.detail?.includes('Tenant account is suspended')) {
    navigate('/suspended', { replace: true });
    return;
  }
  if (errorData?.detail?.includes('expired') || errorData?.detail?.includes('Session expired')) {
    navigate('/session-expired', { replace: true });
    return;
  }
  // ... other cases
}
```

### 5.5 Fix change_password Endpoint
**Backend:** `app/services/auth_service.py` — add `change_password` method
**Frontend:** `ProfilePage.tsx` — wire to `/auth/change-password`

**Implementation:**
```python
def change_password(self, user_id: str, current_password: str, new_password: str):
    validate_password_policy(new_password)
    with get_db_connection() as db:
        with db.conn.cursor() as cur:
            cur.execute("SELECT password_hash, token_version FROM platform.users WHERE id = %s", (user_id,))
            row = cur.fetchone()
            if not row or not bcrypt.checkpw(current_password.encode(), row[0].encode()):
                raise Exception("Current password incorrect")
            
            new_hash = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
            new_version = (row[1] or 0) + 1
            cur.execute("""
                UPDATE platform.users 
                SET password_hash = %s, token_version = %s, password_changed_at = NOW()
                WHERE id = %s
            """, (new_hash, new_version, user_id))
            db.conn.commit()
    return {"message": "Password changed successfully"}
```

### 5.6 DEV-008 Audit Redaction Verification
**Already implemented in `audit_middleware.py`:**
- Redacts `password`, `password_hash`, `admin_password`, `current_password`, `new_password` on POST `/tenants`, `/users`
- Returns `{success: true, data: ...}` with redacted body in audit log

**Verification needed:** Test that audit logs show `***REDACTED***` for password fields.

### 5.7 DEV-011 Hardening Verification
| Check | Status | Notes |
|-------|--------|-------|
| Password policy on create | ✅ | `validate_password_policy()` called in `create_tenant`, `create_user` |
| Token version mandatory | ✅ | `dependencies.py:_validate_token_version()` rejects missing |
| Token version increment | ⚠️ | Works on login/logout, **broken on change_password** |
| Session architecture preserved | ✅ | JWT in httpOnly cookie, token_version in payload |

---

## 5. Proposed Implementation Sequence

| Sprint | Work Items | Deliverable |
|--------|------------|-------------|
| **5A** | 5.1, 5.2, 5.8 | Suspended/Blocked pages + routes |
| **5B** | 5.3, 5.4, 5.9 | Proactive interceptors (suspended + session expiry) |
| **5C** | 5.5, 5.6, 5.7 | Fix change_password, verify hardening |
| **5C** | 5.10 | Tests |

**Estimated Effort:** ~3-4 days total

---

## 5. Files to Create / Modify

| File | Action | Type |
|------|--------|------|
| `.../src/routes/SuspendedTenantPage.tsx` | CREATE | New page |
| `.../src/routes/BlockedTenantPage.tsx` | CREATE | New page |
| `.../src/routes/AppRoutes.tsx` | MODIFY | Add `/suspended`, `/blocked` routes |
| `.../src/hooks/useAuthInterceptor.ts` | CREATE | New hook for proactive intercept |
| `.../src/components/ProtectedRoute.tsx` | MODIFY | Integrate interceptor |
| `app/services/auth_service.py` | MODIFY | Add `change_password()` method |
| `.../src/routes/ProfilePage.tsx` | MODIFY | Wire change_password |
| `app/api/routes/auth_routes.py` | MODIFY | Wire change_password endpoint |
| `tests/test_phase5_suspension.py` | CREATE | New test file |

---

## 7. Testing Strategy

| Test | Description |
|------|-------------|
| `test_suspended_tenant_redirect` | Login with suspended tenant → redirects to `/suspended` |
| `test_blocked_tenant_redirect` | Login with blocked tenant → redirects to `/blocked` |
| `test_session_expiry_redirect` | Expired token → redirects to `/session-expired` |
| `test_change_password_success` | Valid current + new password → success, token_version increments |
| `test_change_password_wrong_current` | Wrong current password → 400 error |
| `test_change_password_weak_policy` | Weak new password → 400 error |
| `test_audit_redaction` | POST /tenants with password → audit log shows `***REDACTED***` |
| `test_token_version_increment` | change_password increments token_version |

---

## 9. Approval Gate

**This work plan requires approval before implementation begins.**

**Required approvals:**
1. ✅ Suspended/Blocked page designs
2. ✅ Proactive redirect approach (axios interceptor vs ProtectedRoute)
3. ✅ Change_password fix scope
4. ✅ Test scope

**Once approved, implementation begins immediately.**

---

**Next Step:** Await your approval on this work plan before implementation begins.