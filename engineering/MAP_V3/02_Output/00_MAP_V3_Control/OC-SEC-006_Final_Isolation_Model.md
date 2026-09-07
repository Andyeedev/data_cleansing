# OC-SEC-006 — Final Multi-Tenant Isolation Model

**Date:** 2026-09-07
**Status:** OC-SEC-006A-D COMPLETE

---

## Isolation Architecture

### Authentication Flow
1. User authenticates → JWT issued with `{sub, user, tenant_id, roles}`
2. Every protected route uses `get_current_user_with_tenant` (raises 403 if tenant_id missing)
3. `tenant_id` comes from JWT only — never from request body

### Tenant Scoping Pattern
```
JWT tenant_id → service/repository → SQL WHERE tenant_id = %s
```

### Route Protection Matrix

| Route File | Auth Dependency | Tenant Scoping | Classification |
|------------|----------------|----------------|----------------|
| credential_routes.py | get_current_user_with_tenant | Repository JOIN via system_registry | TENANT-OWNED |
| user_routes.py | get_current_user_with_tenant | Service WHERE tenant_id = %s | TENANT-OWNED |
| role_routes.py | get_current_user_with_tenant | Service WHERE tenant_id = %s | TENANT-OWNED |
| mapping_routes.py | get_current_user_with_tenant | _resolve_tenant (Super Admin all_tenants) | TENANT-OWNED |
| discovery_routes.py | get_current_user_with_tenant | _resolve_tenant (Super Admin all_tenants) | TENANT-OWNED |
| control_routes.py | get_current_user_with_tenant | Optional tenant filter via project JOIN | GLOBAL-PLATFORM |
| execution_control_routes.py | get_current_user_with_tenant | batch_id (tenant via project) | TENANT-OWNED |
| governance_routes.py | rbac.require_admin | Cross-tenant (admin-only) | GLOBAL-PLATFORM |
| export_routes.py | get_current_user_with_tenant | batch_id (tenant via project) | TENANT-OWNED |
| operations_execution_routes.py | get_current_user_with_tenant | body.tenant_id enforced == JWT | TENANT-OWNED |
| lead_routes.py | get_current_user_with_tenant | Public POST, admin GET (global) | GLOBAL-PUBLIC |
| permissions_routes.py | get_current_user_with_tenant | core.role_permissions (global) | GLOBAL-PLATFORM |
| dashboard_routes.py | rbac.require_admin | Optional tenant filter | GLOBAL-PLATFORM |
| validation_report_routes.py | get_current_user_with_tenant | effective_tenant from JWT | TENANT-OWNED |

### Resource Ownership Model

| Resource | Schema | Owner | Scoping |
|----------|--------|-------|---------|
| Users | platform.users | TENANT | WHERE tenant_id = %s |
| Roles | platform.roles | TENANT | WHERE tenant_id = %s |
| User-Role Assignments | platform.user_roles | TENANT | JOIN roles.tenant_id |
| Role Permissions | platform.role_permissions | TENANT | via roles.tenant_id |
| Permissions (catalogue) | platform.permissions | GLOBAL | Read-only, not tenant-scoped |
| Credentials | core.credentials | TENANT | JOIN system_registry.tenant_id |
| Systems | core.system_registry | TENANT | WHERE tenant_id = %s |
| Mappings | core.dataset_mappings | TENANT | JOIN system_registry.tenant_id |
| Column Mappings | core.column_mappings | TENANT | JOIN dataset_mappings |
| Discovery | core.dataset_mappings | TENANT | JOIN system_registry.tenant_id |
| Leads | core.leads | GLOBAL | No tenant_id (public website) |
| Controls | engine.control_registry | GLOBAL | System-wide (C01-C10) |
| Batches | engine.migration_batch_registry | TENANT | via projects.tenant_id |
| Control Execution | engine.migration_control_execution | TENANT | via batch |
| Governance | engine.* | GLOBAL | Admin-only cross-tenant |
| Audit Log | engine.* | GLOBAL | Admin-only cross-tenant |

### Bypass Controls

| Bypass | Status | Restriction |
|--------|--------|-------------|
| `all_tenants=true` | BLOCKED | Super Admin role required |
| Query param `tenant_id` override | BLOCKED | Must match JWT tenant_id (Super Admin exempt) |
| Body `tenant_id` (operations/run) | BLOCKED | Must match JWT tenant_id |
| `POST /leads` | OPEN | Public endpoint (rate-limited) |

### RBAC Tenant Scoping

`rbac.py` functions scope all SQL queries by `r.tenant_id` from JWT:
- `require_permissions(*perms)` — checks permissions within tenant
- `require_role(*roles)` — checks roles within tenant
- `require_admin` — verifies Super Admin role within tenant

---

## Remaining Deferred Items

The following route files still use `get_current_user` (no tenant enforcement). They should be updated in a future pass:

- `approval_routes.py`
- `calendar_routes.py`
- `workflow_routes.py`
- `report_suite_routes.py`
- `execution_routes.py`
- `schedule_routes.py`
- `notification_routes.py`
- `task_routes.py`
- `execution_history_routes.py`
- `monitoring_routes.py`
- `rule_registry_routes.py`
- `settings_routes.py`
- `migration_project_routes.py`
- `migration_dataset_routes.py`
- `migration_timeline_routes.py`
- `control_dependencies_routes.py`
- `rule_execution_routes.py`
- `rule_discovery_routes.py`

**Total deferred:** 18 route files

---

## Test Coverage

| Test File | Tests | Scope |
|-----------|-------|-------|
| test_credential_isolation.py | 20 | Credential cross-tenant isolation |
| test_user_rbac_isolation.py | 19 | User/RBAC cross-tenant isolation |
| test_operational_routes_isolation.py | 13 | Operational routes auth |
| test_edge_cases_isolation.py | 11 | Edge cases (all_tenants, impersonation, leads, permissions, dashboard) |
| **Total** | **63** | **All passing** |
