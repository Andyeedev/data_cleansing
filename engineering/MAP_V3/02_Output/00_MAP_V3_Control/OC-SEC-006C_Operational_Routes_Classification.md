# OC-SEC-006C — Operational Routes Isolation Classification

**Date:** 2026-09-07
**Status:** IN PROGRESS
**Scope:** mapping, control, execution-control, governance, export, operations-execution routes

---

## Route-by-Route Classification

### 1. mapping_routes.py — MIXED (ALREADY HAS AUTH + 9 UNPROTECTED LEGACY ROUTES)

**Current auth:** `get_current_user_with_tenant` on lines 23-228 (summary, schema, columns, auto-map, bulk save, validate, clear-pair, clear-all)
**Lines 231-308:** 9 legacy async routes with **ZERO AUTH** — most critical fix

| Route | Method | Auth | Classification | Action |
|-------|--------|------|----------------|--------|
| `/mappings/summary` | GET | get_current_user_with_tenant | TENANT-OWNED | OK (already has tenant) |
| `/mappings/schema` | GET | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/mappings/columns` | GET | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/mappings/auto-map` | POST | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/mappings/columns` | POST | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/mappings/validate` | POST | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/mappings/columns/all` | GET | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/mappings/clear-pair` | POST | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/mappings/clear-all` | POST | get_current_user_with_tenant | TENANT-OWNED | OK |
| `/{project_id}` | GET | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{project_id}/auto` | POST | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{mapping_id}` | GET | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{mapping_id}` | PUT | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{mapping_id}/columns` | GET | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{mapping_id}/columns` | POST | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{mapping_id}/columns/{id}` | PUT | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{mapping_id}/columns/{id}` | DELETE | **NONE** | TENANT-OWNED | **ADD AUTH** |
| `/{mapping_id}/validate` | POST | **NONE** | TENANT-OWNED | **ADD AUTH** |

**CRITICAL:** 9 routes have zero authentication. Any anonymous user can read, create, update, delete mappings.

### 2. control_routes.py — GLOBAL-PLATFORM

**Current auth:** `get_current_user` (no tenant enforcement)

| Route | Method | Auth | Classification | Action |
|-------|--------|------|----------------|--------|
| `/controls/outcomes` | GET | get_current_user | GLOBAL-PLATFORM | Add get_current_user_with_tenant |
| `/controls/` | GET | get_current_user | GLOBAL-PLATFORM | Add get_current_user_with_tenant |
| `/controls/{id}` | GET | get_current_user | GLOBAL-PLATFORM | Add get_current_user_with_tenant |
| `/controls/{id}` | PUT | get_current_user | GLOBAL-PLATFORM | Add get_current_user_with_tenant |
| `/controls/` | POST | get_current_user | GLOBAL-PLATFORM | Add get_current_user_with_tenant |
| `/controls/{id}` | DELETE | get_current_user | GLOBAL-PLATFORM | Add get_current_user_with_tenant |

**Notes:** Controls (C01-C010) are system-wide platform controls, not per-tenant. `tenant_id` query param is used to filter execution outcomes by project ownership, not control ownership. Service already handles optional tenant_id. Only auth dependency change needed.

### 3. execution_control_routes.py — TENANT-OWNED via batch

**Current auth:** `get_current_user` (no tenant enforcement)

| Route | Method | Auth | Classification | Action |
|-------|--------|------|----------------|--------|
| `/{batch_id}/cancel` | POST | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/{batch_id}/pause` | POST | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/{batch_id}/resume` | POST | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/{batch_id}/retry` | POST | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/{batch_id}/lifecycle` | GET | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/{batch_id}/progress` | GET | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |

**Notes:** Batch belongs to a tenant via `migration_batch_registry.project_id → core.projects.tenant_id`. Batch tenant validation is 006D scope (requires service-layer JOIN). 006C adds auth only.

### 4. governance_routes.py — GLOBAL-PLATFORM (admin-only)

**Current auth:** `get_current_user` with local `_require_admin`

| Route | Method | Auth | Classification | Action |
|-------|--------|------|----------------|--------|
| `/governance/audit` | GET | _require_admin | GLOBAL-PLATFORM | Replace local _require_admin with rbac.require_admin |
| `/governance/approvals` | GET | _require_admin | GLOBAL-PLATFORM | Replace local _require_admin with rbac.require_admin |
| `/governance/exceptions` | GET | _require_admin | GLOBAL-PLATFORM | Replace local _require_admin with rbac.require_admin |
| `/governance/compliance` | GET | _require_admin | GLOBAL-PLATFORM | Replace local _require_admin with rbac.require_admin |

**Notes:** Governance data (audit log, approvals, exceptions, compliance) is cross-tenant. Uses local `_require_admin` copy instead of `rbac.require_admin`. Replace with proper dependency that includes tenant scoping.

### 5. export_routes.py — TENANT-OWNED via batch

**Current auth:** `get_current_user` (no tenant enforcement)

| Route | Method | Auth | Classification | Action |
|-------|--------|------|----------------|--------|
| `/export/{batch_id}/csv` | GET | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/export/{batch_id}/pdf` | GET | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |

**Notes:** Export operates on batch_id. Batch tenant validation is 006D scope. 006C adds auth only.

### 6. operations_execution_routes.py — TENANT-OWNED

**Current auth:** `get_current_user` (no tenant enforcement)

| Route | Method | Auth | Classification | Action |
|-------|--------|------|----------------|--------|
| `/operations/run` | POST | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant + enforce body.tenant_id == JWT |
| `/operations/run/{run_id}` | GET | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/operations/runs` | GET | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant + default tenant_id from JWT |
| `/operations/runs/status-breakdown` | GET | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant + default tenant_id from JWT |
| `/operations/run/{run_id}/re-execute` | POST | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |
| `/operations/run/{run_id}/cancel` | POST | get_current_user | TENANT-OWNED | Add get_current_user_with_tenant |

**Notes:** `start_run` takes `tenant_id` in body — must enforce `body.tenant_id == current_user.tenant_id`. `get_run_history` and `status-breakdown` take optional `tenant_id` query — default to JWT tenant_id.

---

## Summary

| Route File | Routes | Current Auth | Action |
|------------|--------|-------------|--------|
| mapping_routes.py | 9 legacy | **NONE** | Add get_current_user_with_tenant (CRITICAL) |
| control_routes.py | 6 | get_current_user | Replace with get_current_user_with_tenant |
| execution_control_routes.py | 6 | get_current_user | Replace with get_current_user_with_tenant |
| governance_routes.py | 4 | local _require_admin | Replace with rbac.require_admin |
| export_routes.py | 2 | get_current_user | Replace with get_current_user_with_tenant |
| operations_execution_routes.py | 6 | get_current_user | Replace with get_current_user_with_tenant + enforce body tenant |

**Total: 33 routes across 6 files**

## What 006C Does NOT Change

- Batch-to-tenant validation in services (006D scope)
- `all_tenants` query param bypass (006D scope)
- `platform.permissions` catalogue (GLOBAL, not tenant-scoped)
- `mapping_repository.py` tenant filtering (already implemented)
