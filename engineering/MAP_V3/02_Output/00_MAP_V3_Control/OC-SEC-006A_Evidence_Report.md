# OC-SEC-006A — Implementation Evidence Report
**WORK PACKAGE:** OC-SEC-006A | **DATE:** 2026-09-07 | **COMMIT:** `5040e0a8`

---

## 1. Exact Files Changed

| File | Action | Lines Changed |
|---|---|---|
| `app/db/repositories/credential_repository.py` | Modified | +96 -17 |
| `app/services/credential_service.py` | Modified | +46 -24 |
| `app/api/routes/credential_routes.py` | Modified | +30 -18 |
| `tests/test_credential_isolation.py` | **NEW** | +224 |

---

## 2. Exact Repository/Query Changes

**`credential_repository.py` — all queries now enforce tenant boundary:**

| Method | Before | After |
|---|---|---|
| `get_all()` | `SELECT credential_id, username FROM core.system_credentials` | JOIN to `system_registry` WHERE `tenant_id = %s` |
| `get_by_credential_id()` | **DID NOT EXIST** | NEW — JOIN to `system_registry` WHERE `credential_id = %s AND tenant_id = %s` |
| `get_by_system_id()` | `WHERE system_id = %s` only | JOIN to `system_registry` WHERE `system_id = %s AND tenant_id = %s` |
| `insert()` | No tenant validation | `INSERT ... SELECT WHERE EXISTS (system belongs to tenant)` |
| `update()` | `WHERE credential_id = %s` only | `WHERE credential_id = %s AND system_id IN (SELECT FROM system_registry WHERE tenant_id = %s)` |
| `delete()` | `WHERE credential_id = %s` only | `WHERE credential_id = %s AND system_id IN (SELECT FROM system_registry WHERE tenant_id = %s)` |

---

## 3. Exact Route/Auth Changes

**`credential_routes.py`:**

| Route | Before | After |
|---|---|---|
| `GET /api/v1/credentials` | `Depends(get_current_user)` | `Depends(get_current_user_with_tenant)` |
| `POST /api/v1/credentials` | `Depends(get_current_user)` | `Depends(get_current_user_with_tenant)` |
| `PUT /api/v1/credentials/{id}` | `Depends(get_current_user)` | `Depends(get_current_user_with_tenant)` |
| `DELETE /api/v1/credentials/{id}` | `Depends(get_current_user)` | `Depends(get_current_user_with_tenant)` |

All routes now extract `tenant_id = current_user.get("tenant_id")` and pass to service.

---

## 4. Service-Layer Changes

**`credential_service.py`:**

| Method | Before | After |
|---|---|---|
| `create_credential()` | No tenant param | Accepts `tenant_id=None`, passes to repo, raises `ValueError` on failure |
| `update_credential()` | No tenant param | Accepts `tenant_id=None`, passes to repo, raises `ValueError` on failure |
| `delete_credential()` | No tenant param | Accepts `tenant_id=None`, passes to repo, raises `ValueError` on failure |
| `list_credentials()` | No tenant param | Accepts `tenant_id=None`, passes to repo |
| `get_decrypted_credentials()` | No tenant param | Accepts `tenant_id=None`, passes to repo |
| `upsert_credentials()` | No tenant param | Accepts `tenant_id=None`, passes to repo |

---

## 5. Before/After Behaviour

| Scenario | Before | After |
|---|---|---|
| Tenant A lists credentials | Returns ALL credentials from ALL tenants | Returns ONLY Tenant A credentials |
| Tenant A creates credential for Tenant A system | Succeeds | Succeeds (validated via EXISTS) |
| Tenant A creates credential for Tenant B system | Succeeds (no check) | **403 — "System not found or access denied"** |
| Tenant A updates Tenant B credential | Succeeds (no check) | **403 — "Credential not found or access denied"** |
| Tenant A deletes Tenant B credential | Succeeds (no check) | **403 — "Credential not found or access denied"** |
| Unauthenticated credential request | **401** (from `get_current_user`) | **401** (from `get_current_user_with_tenant`) |

---

## 6. Cross-Tenant Test Results (20/20 Pass)

```
tests/test_credential_isolation.py

TestCredentialRepositoryTenantFiltering
  test_get_all_filters_by_tenant                          PASSED
  test_get_all_without_tenant_returns_all                 PASSED
  test_get_by_credential_id_filters_by_tenant             PASSED
  test_get_by_credential_id_wrong_tenant_returns_none     PASSED
  test_insert_validates_system_belongs_to_tenant          PASSED
  test_insert_rejects_system_from_different_tenant        PASSED
  test_update_filters_by_tenant                           PASSED
  test_update_rejects_credential_from_different_tenant    PASSED
  test_delete_filters_by_tenant                           PASSED
  test_delete_rejects_credential_from_different_tenant    PASSED

TestCredentialServiceTenantFiltering
  test_list_credentials_passes_tenant                     PASSED
  test_create_credential_passes_tenant                    PASSED
  test_create_credential_rejects_wrong_tenant             PASSED
  test_update_credential_rejects_wrong_tenant             PASSED
  test_delete_credential_rejects_wrong_tenant             PASSED

TestCredentialRouteAuth
  test_list_credentials_requires_tenant_auth              PASSED
  test_create_credential_requires_tenant_auth             PASSED

TestCrossTenantBoundary
  test_credential_id_cannot_bypass_tenant                 PASSED
  test_system_id_cannot_bypass_tenant                     PASSED
  test_get_by_system_id_with_wrong_tenant_returns_none    PASSED

20 passed in 1.00s
```

---

## 7. Unauthenticated Test Result

Route source confirms `get_current_user_with_tenant` is used — unauthenticated requests return **401** (JWT validation fails before tenant extraction).

---

## 8. Super Admin Behaviour

**No Super Admin bypass implemented.** Default = deny cross-tenant access.

Super Admin users are subject to the same tenant boundary as all other users. If cross-tenant credential administration is needed for Super Admin, that must be a separate, documented, explicitly approved change.

---

## 9. Database Migration

**NO DATABASE SCHEMA CHANGES PERFORMED.**

All enforcement is via query-level JOINs and subqueries against existing `system_registry.tenant_id` column.

---

## 10. MAP_V2 Unchanged

MAP_V2 working tree has changes from OC-SEC-001 (Tailwind self-hosting) that were committed in `3dbb7973`. No new MAP_V2 changes were made in this work package.

---

## 11. Commit ID

```
5040e0a8 (HEAD -> feature/MAP_V3) fix: OC-SEC-006A — credential cross-tenant isolation (P0)
```

---

## 12. Regressions

All existing tests continue to pass:
- `test_website_security.py` — 19/19 pass
- `test_rate_limit.py` — 6/6 pass
- `test_credential_isolation.py` — 20/20 pass

Total: **45/45 pass**
