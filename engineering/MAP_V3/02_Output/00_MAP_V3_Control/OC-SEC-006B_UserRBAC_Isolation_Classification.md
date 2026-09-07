# OC-SEC-006B — Pre-Flight Resource Ownership Classification
**WORK PACKAGE:** OC-SEC-006B | **DATE:** 2026-09-07 | **STATUS:** PENDING REVIEW

---

## 1. Route Files — Auth Dependency & Tenant Enforcement

| Route File | Auth Dependency | tenant_id Enforced? | Operations |
|---|---|---|---|
| `user_routes.py` | `get_current_user` | **NO** | list, get, create, update, delete, assign_role, remove_role, get_user_roles |
| `role_routes.py` | `get_current_user` | **NO** | list, get, create, update, delete, assign_permission, remove_permission, get_role_permissions, list_all_permissions |
| `permissions_routes.py` | `get_current_user` | **NO** | get_permissions, get_roles, get_packs, update_permissions, reset_permissions |

---

## 2. Database Schema — tenant_id Column Status

| Table | Has `tenant_id`? | Classification | Rationale |
|---|---|---|---|
| `platform.users` | **YES** | **TENANT-OWNED** | Has `tenant_id` + FK + index. Schema-ready but not enforced. |
| `platform.roles` | **YES** | **TENANT-OWNED** | Has `tenant_id` + FK + index. Schema-ready but not enforced. |
| `platform.permissions` | **NO** | **GLOBAL** (permission catalogue) | No `tenant_id`. Correct — permissions are a global system catalogue. |
| `platform.role_permissions` | **NO** | **TENANT-BOUND** (via role) | Isolation depends on role being tenant-scoped. Currently not enforced. |
| `platform.user_roles` | **NO** | **TENANT-BOUND** (via user/role) | Isolation depends on user and role being tenant-scoped. Currently not enforced. |

---

## 3. Full Path Map

```
platform.users [TENANT-OWNED]
  → UserService (no tenant filter)
    → user_routes.py (get_current_user — no tenant check)
      → Auth: get_current_user (JWT decoded, tenant_id ignored)

platform.roles [TENANT-OWNED]
  → RoleService (no tenant filter)
    → role_routes.py (get_current_user — no tenant check)
      → Auth: get_current_user (JWT decoded, tenant_id ignored)

platform.permissions [GLOBAL]
  → RoleService.list_all_permissions() (no tenant filter — acceptable)
    → role_routes.py (get_current_user — no tenant check)

platform.role_permissions [TENANT-BOUND]
  → RoleService.assign_permission() / get_role_permissions() (no tenant filter)
    → role_routes.py (get_current_user — no tenant check)

platform.user_roles [TENANT-BOUND]
  → UserService.assign_role() / remove_role() / get_user_roles() (no tenant filter)
    → user_routes.py (get_current_user — no tenant check)
  → rbac.py require_permissions / require_role (queries user_roles by user_id only)
```

---

## 4. Identified Cross-Tenant Vulnerabilities

| # | Vulnerability | Severity | Location |
|---|---|---|---|
| V1 | User enumeration across tenants — `list_users()` returns ALL users | CRITICAL | `user_service.py:14-52` |
| V2 | Cross-tenant user modification — update/delete any user | CRITICAL | `user_service.py:93-150` |
| V3 | Cross-tenant role assignment — assign any role to any user | CRITICAL | `user_service.py:152-167` |
| V4 | Cross-tenant role CRUD — list/modify/delete all roles | HIGH | `role_service.py:9-128` |
| V5 | Cross-tenant permission escalation — add permissions to any role | HIGH | `role_service.py:130-142` |
| V6 | RBAC bypass — no tenant scoping in permission checks | CRITICAL | `rbac.py:15-24` |
| V7 | Admin role escalation — Super Admin in ANY tenant = global admin | CRITICAL | `rbac.py:67-71` |
| V8 | permissions_routes.py queries wrong table (legacy) | MEDIUM | `permissions_routes.py:29-101` |
| V9 | tenant_id accepted from request body on create | CRITICAL | `user_routes.py:21` |

---

## 5. Proposed Minimum Remediation

| Priority | Remediation | Scope |
|---|---|---|
| P0 | Inject tenant boundary into UserService and RoleService | `user_service.py`, `role_service.py` |
| P0 | Replace `get_current_user` → `get_current_user_with_tenant` in RBAC routes | `user_routes.py`, `role_routes.py`, `permissions_routes.py` |
| P0 | Scope RBAC queries by tenant in `rbac.py` | `rbac.py` |
| P0 | Scope login-time role resolution by tenant | `auth_service.py` |
| P1 | Reject client-supplied `tenant_id` on create — derive from JWT | `user_routes.py`, `user_service.py` |
| P1 | Add `is_system` guard to role updates/deletes | `role_service.py` |

---

## 6. Files Expected to Change

| File | Change |
|---|---|
| `app/api/routes/user_routes.py` | `get_current_user` → `get_current_user_with_tenant` |
| `app/api/routes/role_routes.py` | `get_current_user` → `get_current_user_with_tenant` |
| `app/api/routes/permissions_routes.py` | `get_current_user` → `get_current_user_with_tenant` |
| `app/services/user_service.py` | Add `tenant_id` parameter to all methods, filter by tenant |
| `app/services/role_service.py` | Add `tenant_id` parameter to all methods, filter by tenant |
| `app/api/core/auth/rbac.py` | Scope `require_permissions` and `require_role` by tenant |
| `tests/test_user_rbac_isolation.py` | **NEW** — cross-tenant isolation tests |
