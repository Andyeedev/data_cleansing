# Authentication Trace Report

**Date:** 2026-07-26
**Prepared for:** Phase 08 Repository Reference Resolution
**Scope:** Baseline Frontend vs MVP Frontend authentication comparison
**Status:** Awaiting approval before implementation

---

## Executive Summary

The MVP frontend has **no real authentication**. It was created as a new codebase in commit `45e0f8da` without copying the authentication system from the baseline frontend. The baseline frontend has a complete JWT authentication system with login, token storage, API client injection, and protected routes. The backend enforces JWT validation on all protected endpoints, causing the MVP frontend's dashboard API calls to return 401 errors silently.

---

## 1. Login Flow

| Aspect | Baseline Frontend | MVP Frontend |
|--------|-------------------|--------------|
| **Login page** | `src/authentication/pages/LoginPage.tsx` | **NONE** |
| **Login route** | `/login` (wrapped in `<PublicRoute>`) | **NONE** |
| **Login form** | Email + password + "Remember me" | **NONE** |
| **Login submission** | `useAuth().login({ email, password, rememberMe })` | **NONE** |
| **Login API call** | `POST /api/v1/auth/login` with `{ username: email, password }` | **NONE** |
| **Login response** | `{ access_token: "<jwt>" }` | **NONE** |
| **Login error handling** | Shows error message on page | **NONE** |
| **Post-login redirect** | Navigates to previous page or `/` | **NONE** |

---

## 2. Token Acquisition

| Aspect | Baseline Frontend | MVP Frontend |
|--------|-------------------|--------------|
| **Token endpoint** | `POST /api/v1/auth/login` | **NONE** |
| **Token format** | JWT (validated by `jose` library) | **NONE** |
| **Token claim** | `access_token` in response body | **NONE** |
| **User object** | Constructed client-side from email (hardcoded roles: `['admin']`) | Mock users selected by dropdown |
| **Role extraction** | Not from JWT — hardcoded in `AuthProvider.tsx:73-74` | Not from JWT — hardcoded in `types/auth.ts` |

---

## 3. Token Storage

| Aspect | Baseline Frontend | MVP Frontend |
|--------|-------------------|--------------|
| **Storage mechanism** | `localStorage` | **NONE** |
| **Token key** | `access_token` | **NONE** |
| **User key** | `map_nexus_user` (JSON stringified) | **NONE** |
| **Session restore** | `AuthProvider.useEffect` checks localStorage on page load | **NONE** |
| **Logout cleanup** | Clears `access_token` + `map_nexus_user` | **NONE** |

**Known inconsistency in baseline:** Constants define `map_nexus_auth_token` but `AuthProvider` stores under `access_token`. The vanilla fetch client checks 6 fallback keys; the Axios interceptor only checks `map_nexus_auth_token`.

---

## 4. API Client Injection

| Aspect | Baseline Frontend | MVP Frontend |
|--------|-------------------|--------------|
| **API client** | `src/api/client.ts` (vanilla fetch) + `src/api/interceptors.ts` (Axios) | `src/utils/apiClient.ts` (vanilla fetch) |
| **Auth header** | `Authorization: Bearer ${token}` | **NONE** |
| **Token source** | Reads from localStorage (6-key fallback chain) | **NONE** |
| **401 handling** | Axios interceptor clears tokens, redirects to `/session-expired` | Silent `catch(() => {})` |
| **Base URL** | `/api/v1` (relative) | `/api/v1` (relative) |

**MVP apiClient.ts** (the file used by all MVP hooks):
```typescript
// NO auth headers anywhere
const res = await fetch(url.toString());              // apiGet
const res = await fetch(`${API_BASE}${path}`, {       // apiPost
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },    // <-- ONLY this header
  body: body ? JSON.stringify(body) : undefined,
});
```

---

## 5. Protected Route Handling

| Aspect | Baseline Frontend | MVP Frontend |
|--------|-------------------|--------------|
| **Route guard component** | `src/authentication/components/ProtectedRoute.tsx` | **NONE** |
| **Public route guard** | `src/authentication/components/PublicRoute.tsx` | **NONE** |
| **Auth check on load** | Checks `isAuthenticated` from `AuthProvider` | **NONE** |
| **Unauthenticated redirect** | Redirects to `/login` with return URL | **NONE** |
| **Role-based guard** | `requiredRoles` / `requiredPermissions` props (not enforced) | **NONE** |
| **Route wrapping** | All app routes wrapped in `<ProtectedRoute>` | All routes accessible without auth |

---

## 6. Backend JWT Validation

| Aspect | Implementation |
|--------|----------------|
| **Auth dependency** | `app/api/core/auth/dependencies.py:get_current_user()` |
| **Token validation** | `jose.jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])` |
| **Missing token** | Returns 401: `"Missing token"` |
| **Invalid token** | Returns 401: `"Invalid token"` |
| **Header extraction** | `Authorization: Bearer <token>` or raw token |
| **Protected endpoints** | Dashboard, Governance, Operations, Migration, Validation, Administration |
| **Unprotected endpoints** | `/api/v1/auth/login`, `/api/v1/monitoring/health` |

---

## 7. Divergence Analysis

### When did the divergence occur?

The MVP frontend was created in a **single commit**: `45e0f8da feat: initialize MAP V2 MVP development baseline`

This commit created the entire MVP frontend from scratch, including:
- `engineering/MAP_V2/03_Source/frontend-mvp/` (new directory)
- No authentication system copied from baseline
- Mock-only `AuthContext` with role switching dropdown
- `apiClient.ts` without auth headers

### Why did the divergence occur?

The MVP frontend was built as a **new codebase** for Phase 08 validation work, focused on:
- Dashboard metrics display
- Governance views
- Operations pages
- Task management

Authentication was **not included** in the MVP scope because:
1. The MVP was designed for internal/development use
2. The focus was on data display, not security
3. The mock auth context was sufficient for role-based UI filtering

### What was lost?

| Capability | Baseline | MVP | Impact |
|------------|----------|-----|--------|
| Real login flow | Yes | No | Cannot authenticate users |
| JWT token storage | Yes | No | Cannot maintain sessions |
| API auth headers | Yes | No | All protected API calls fail (401) |
| Route protection | Yes | No | All routes accessible without auth |
| Session management | Yes | No | No token refresh, no expiry handling |
| 401 error handling | Yes | No | Errors silently swallowed |

---

## 8. Root Cause of Dashboard Metrics Showing No Count

```
DashboardPage.tsx
  → fetch('/api/v1/dashboard/portfolio')  // No auth header
  → Backend: get_current_user() → 401 "Missing token"
  → .catch(() => {})  // Silent error swallowing
  → portfolio = null
  → Shows '—' (dash) for all metrics
```

**The dashboard metrics show no count because:**
1. The MVP frontend sends no JWT token with API requests
2. The backend returns 401 for all protected endpoints
3. The `catch(() => {})` silently swallows the 401 error
4. The state remains `null`, showing `'—'` placeholders

---

## 9. Recommended Fix Options

### Option A: Restore Baseline Auth System (Recommended)
- Copy authentication module from baseline frontend to MVP frontend
- Includes: LoginPage, AuthProvider, ProtectedRoute, apiClient with auth headers
- **Risk:** Medium — requires integrating a larger auth system
- **Effort:** Medium — ~15 files to copy/adapt

### Option B: Add Auth Headers to MVP apiClient
- Modify `apiClient.ts` to read token from localStorage and inject Bearer header
- Add a minimal login page that calls `POST /api/v1/auth/login`
- **Risk:** Low — minimal changes
- **Effort:** Low — ~3 files to modify

### Option C: Remove Auth Requirement from Dashboard Routes
- Remove `_require_admin` dependency from dashboard endpoints
- Dashboard is read-only, no security risk in dev
- **Risk:** Low — but doesn't solve the underlying auth gap
- **Effort:** Low — ~2 files to modify

---

## 10. Files Requiring Modification (by option)

### Option A (Restore Baseline Auth)
| File | Action |
|------|--------|
| `frontend-mvp/src/authentication/` | Copy entire directory from baseline |
| `frontend-mvp/src/api/client.ts` | Copy from baseline (has auth injection) |
| `frontend-mvp/src/App.tsx` | Wrap in `AuthProvider` |
| `frontend-mvp/src/AppRoutes.tsx` | Add `<ProtectedRoute>` wrapper |
| `frontend-mvp/src/utils/apiClient.ts` | Replace with baseline `api/client.ts` |

### Option B (Add Auth Headers)
| File | Action |
|------|--------|
| `frontend-mvp/src/utils/apiClient.ts` | Add Bearer token injection |
| `frontend-mvp/src/routes/LoginPage.tsx` | Create minimal login page |
| `frontend-mvp/src/context/AuthContext.tsx` | Add real login/logout/token state |

### Option C (Remove Auth)
| File | Action |
|------|--------|
| `app/api/routes/dashboard_routes.py` | Remove `_require_admin` dependency |
| `app/api/routes/governance_routes.py` | Remove `_require_admin` dependency |

---

## Appendix A: Baseline Frontend Auth File Inventory

| # | File | Purpose |
|---|------|---------|
| 1 | `src/authentication/types/auth.types.ts` | TypeScript interfaces |
| 2 | `src/authentication/context/AuthContext.tsx` | React Context creation |
| 3 | `src/authentication/context/AuthProvider.tsx` | Auth state management |
| 4 | `src/authentication/services/AuthService.ts` | Mock API + helpers |
| 5 | `src/authentication/components/ProtectedRoute.tsx` | Route guard |
| 6 | `src/authentication/components/PublicRoute.tsx` | Public route guard |
| 7 | `src/authentication/pages/LoginPage.tsx` | Login page |
| 8 | `src/authentication/pages/LogoutPage.tsx` | Logout page |
| 9 | `src/authentication/pages/ForgotPasswordPage.tsx` | Forgot password |
| 10 | `src/authentication/pages/ResetPasswordPage.tsx` | Reset password |
| 11 | `src/authentication/pages/ChangePasswordPage.tsx` | Change password |
| 12 | `src/authentication/pages/VerifyMFAPage.tsx` | MFA verification |
| 13 | `src/authentication/pages/ProfilePage.tsx` | User profile |
| 14 | `src/authentication/pages/AccessDeniedPage.tsx` | 403 page |
| 15 | `src/authentication/pages/AccountLockedPage.tsx` | Account locked |
| 16 | `src/authentication/pages/SessionExpiredPage.tsx` | Session expired |
| 17 | `src/api/client.ts` | Vanilla fetch with auth |
| 18 | `src/api/interceptors.ts` | Axios interceptors |
| 19 | `src/config/constants.ts` | Storage key constants |

## Appendix B: MVP Frontend Auth-Related Files

| # | File | Purpose |
|---|------|---------|
| 1 | `src/context/AuthContext.tsx` | Mock context (39 lines) |
| 2 | `src/types/auth.ts` | 4 hardcoded mock users (30 lines) |
| 3 | `src/utils/apiClient.ts` | Bare fetch, NO auth (95 lines) |
| 4 | `src/components/RoleSwitcher/RoleSwitcher.tsx` | Dropdown role switcher |
| 5 | `src/utils/filterByPermissions.ts` | Nav visibility filtering |
