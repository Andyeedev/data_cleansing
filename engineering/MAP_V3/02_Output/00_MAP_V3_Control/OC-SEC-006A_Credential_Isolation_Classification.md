# OC-SEC-006A — Pre-Flight Resource Ownership Classification
**WORK PACKAGE:** OC-SEC-006A | **DATE:** 2026-09-07 | **STATUS:** APPROVED

---

## 1. Data Model: How Credentials Relate to Tenants

```
core.system_credentials
  ├── credential_id (PK)
  ├── system_id (FK → core.system_registry.system_id)
  ├── username
  ├── password_encrypted (Fernet)
  └── encryption_key_id

core.system_registry
  ├── system_id (PK)
  ├── project_id (FK → core.projects.project_id)
  ├── system_name
  ├── system_role
  ├── database_type
  ├── connection_config (JSONB)
  └── tenant_id (added via migration, not in SQL dump)

core.projects
  ├── project_id (PK)
  └── tenant_id (FK → core.tenants.tenant_id)
```

**Tenant relationship is indirect:**
`system_credentials` → `system_registry` (via `system_id`) → `projects` (via `project_id`) → `tenants` (via `tenant_id`)

There is **no direct `tenant_id` on `core.system_credentials`**. The tenant boundary must be enforced through the `system_id` → `system_registry.tenant_id` JOIN.

---

## 2. Resource Ownership Classification

| Resource | Classification | Rationale |
|---|---|---|
| `core.system_credentials` | **TENANT-OWNED** | Credentials belong to a specific system, which belongs to a specific tenant. A credential for Tenant A's Snowflake instance must never be accessible to Tenant B. |
| `core.system_registry` | **TENANT-OWNED** | Systems belong to a specific tenant (via `project_id` → `projects` → `tenant_id`). The code already filters by `tenant_id` in `system_repository.get_all()` and `get_by_id()`. |
| `CredentialRepository` | **TENANT-OWNED** (must enforce) | All queries must include tenant boundary — either directly or via JOIN to `system_registry`. |
| `CredentialService` | **TENANT-OWNED** (must enforce) | Service layer must pass `tenant_id` to repository or validate `system_id` belongs to tenant. |
| `credential_routes.py` | **TENANT-OWNED** (must enforce) | Routes must extract `tenant_id` from JWT and validate against the credential's owning system. |

---

## 3. Full Path Map: Table → Repo → Service → Route → Auth → Tenant Boundary

| Layer | Current State | Tenant Boundary |
|---|---|---|
| **Table** (`core.system_credentials`) | No `tenant_id` column | Indirect via `system_id` → `system_registry.tenant_id` |
| **Repository** (`credential_repository.py`) | `get_by_system_id(system_id)` — **no tenant filter** | ❌ **MISSING** — queries by `system_id` only |
| **Service** (`credential_service.py`) | `create_credential(system_id, username, password)` — **no tenant validation** | ❌ **MISSING** — does not verify `system_id` belongs to tenant |
| **Route** (`credential_routes.py`) | `Depends(get_current_user)` — **no tenant extraction** | ❌ **MISSING** — uses `get_current_user` not `get_current_user_with_tenant` |
| **Auth** (`dependencies.py`) | `get_current_user` returns `{sub, user, tenant_id, roles}` | ✅ `tenant_id` is available in JWT |
| **Authorization** | No admin check on credential routes | ⚠️ Any authenticated user can access credentials |

---

## 4. Affected Tables

| Table | Action Required |
|---|---|
| `core.system_credentials` | **NO schema change** — enforce tenant boundary via query, not new column |
| `core.system_registry` | Read-only — used for JOIN to establish tenant ownership |

---

## 5. Affected Routes

| Route | Method | Current Auth | Required Change |
|---|---|---|---|
| `GET /api/v1/credentials` | list | `get_current_user` | Add tenant boundary (JOIN to system_registry) |
| `POST /api/v1/credentials` | create | `get_current_user` | Validate `system_id` belongs to tenant |
| `PUT /api/v1/credentials/{id}` | update | `get_current_user` | Validate credential belongs to tenant's system |
| `DELETE /api/v1/credentials/{id}` | delete | `get_current_user` | Validate credential belongs to tenant's system |

---

## 6. Existing Authentication/Authorization Mechanism

* **Authentication:** JWT `HS256` via `get_current_user` — returns `{sub, user, tenant_id, roles}`
* **Authorization:** None on credential routes — any authenticated user can access
* **Admin check:** Not present — should consider `require_admin` for credential management

---

## 7. Existing Tenant Relationship

* `core.system_registry` has `tenant_id` column (added via migration)
* `system_repository.py` already filters by `tenant_id` in `get_all()` and `get_by_id()`
* `system_routes.py` uses `get_current_user_with_tenant` — extracts `tenant_id` from JWT
* `credential_routes.py` uses `get_current_user` — does NOT extract `tenant_id`

---

## 8. Identified Cross-Tenant Vulnerability

**Current flow (VULNERABLE):**
```
User A (Tenant X) → GET /api/v1/credentials
  → Depends(get_current_user) → JWT decoded, tenant_id available but NOT used
  → CredentialService.list_credentials()
  → CredentialRepository.get_all()
  → SELECT credential_id, username FROM core.system_credentials
  → Returns ALL credentials from ALL tenants
```

**Impact:** User A can see credentials (usernames, though not decrypted passwords) for Tenant B's database systems.

**Even worse — update/delete flow:**
```
User A (Tenant X) → PUT /api/v1/credentials/{credential_id}
  → Depends(get_current_user) → tenant_id NOT checked
  → CredentialService.update_credential(credential_id, ...)
  → CredentialRepository.update(credential_id, ...)
  → UPDATE core.system_credentials SET ... WHERE credential_id = %s
  → Tenant A can update Tenant B's credentials
```

---

## 9. Proposed Minimum Remediation

**Option A — JOIN-based enforcement (no schema change):**
* `CredentialRepository.get_all()` → JOIN to `system_registry` WHERE `tenant_id = %s`
* `CredentialRepository.get_by_system_id()` → JOIN to `system_registry` WHERE `system_id = %s AND tenant_id = %s`
* `CredentialRepository.update()` / `delete()` → Verify credential belongs to tenant's system via subquery
* `credential_routes.py` → Change to `get_current_user_with_tenant` to extract `tenant_id`

**Option B — Direct tenant_id (schema change, NOT recommended for this stage):**
* Add `tenant_id` column to `core.system_credentials`
* Populate via migration
* Not recommended — adds schema change, JOIN-based is sufficient

---

## 10. Files Expected to Change

| File | Change |
|---|---|
| `app/db/repositories/credential_repository.py` | Add tenant filtering to all queries |
| `app/api/routes/credential_routes.py` | Change `get_current_user` → `get_current_user_with_tenant` |
| `tests/test_credential_isolation.py` | **NEW** — cross-tenant isolation tests |

---

## 11. Cross-Tenant Test Strategy

| Test | Expected Result |
|---|---|
| User A (Tenant X) creates credential for system in Tenant X | 200 OK |
| User A (Tenant X) creates credential for system in Tenant Y | 403 Forbidden |
| User A (Tenant X) lists credentials | Returns only Tenant X credentials |
| User A (Tenant X) updates Tenant Y's credential | 403 Forbidden |
| User A (Tenant X) deletes Tenant Y's credential | 403 Forbidden |
| Super Admin lists credentials | Returns all credentials (or tenant-scoped per policy) |
| Unauthenticated user accesses credentials | 401 Unauthorized |

---

**Classification produced for CHATGPT review. Approved for remediation.**
