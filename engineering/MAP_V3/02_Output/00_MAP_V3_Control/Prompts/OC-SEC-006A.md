# CHATGPT REVIEW — OC-SEC-006A

**STATUS: APPROVED FOR REMEDIATION**

The OC-SEC-006A pre-flight resource ownership classification has been reviewed and is approved.

## 1. Ownership Decision

`core.system_credentials` is confirmed as:

**TENANT-OWNED**

Ownership is established indirectly:

`core.system_credentials`
→ `system_id`
→ `core.system_registry`
→ `project_id`
→ `core.projects`
→ `tenant_id`

No database schema change is required.

Proceed with the JOIN-based tenant enforcement approach.

## 2. Approved Security Boundary

The security model must be:

**JWT authentication → tenant context → service validation → repository/query tenant enforcement**

The repository/query layer must enforce the tenant boundary.

Do not rely solely on route-level checks.

Do not leave repository methods capable of unrestricted cross-tenant credential access if they are used by tenant-facing operations.

## 3. Approved Remediation

Implement:

1. `credential_routes.py`

   * Replace `get_current_user` with the appropriate existing tenant-aware authentication dependency.
   * Extract the authenticated tenant context.
   * Ensure credential operations are performed only against systems belonging to that tenant.

2. `credential_repository.py`

   * Add tenant enforcement to credential retrieval.
   * Enforce tenant ownership for create/update/delete operations.
   * Use the existing `system_registry.tenant_id` relationship.
   * Prevent a credential ID or system ID from being used to bypass the tenant boundary.

3. `credential_service.py`

   * Inspect whether tenant validation must be passed through the service layer.
   * If required, pass tenant context to repository methods.
   * Do not create a parallel authorization mechanism.

4. Tests

   * Add cross-tenant isolation tests covering the approved scenarios.

## 4. Super Admin — Important Constraint

Do **NOT** automatically implement a Super Admin cross-tenant credential bypass.

The existing architecture/policy must first establish whether Super Admin is intentionally permitted to access credentials across tenants.

Until that is established:

**Default = deny cross-tenant access.**

If an existing, documented Super Admin privilege permits cross-tenant credential administration, document and test that explicitly.

Do not invent a new privileged bypass simply to satisfy a test case.

## 5. Required Tests

Demonstrate:

| Test                                            | Expected                                                    |
| ----------------------------------------------- | ----------------------------------------------------------- |
| Tenant A creates credential for Tenant A system | Success                                                     |
| Tenant A creates credential for Tenant B system | 403 / denied                                                |
| Tenant A lists credentials                      | Tenant A only                                               |
| Tenant A retrieves Tenant B credential          | 403 / 404 / denied                                          |
| Tenant A updates Tenant B credential            | 403 / denied                                                |
| Tenant A deletes Tenant B credential            | 403 / denied                                                |
| Unauthenticated credential request              | 401                                                         |
| Authorised tenant user                          | Only own tenant resources                                   |
| Super Admin                                     | Follow existing documented policy; no newly invented bypass |

Also verify that no alternative credential route/repository path permits the same cross-tenant access.

## 6. Security Requirement

A request such as:

`Tenant A + credential_id belonging to Tenant B`

must never result in:

* credential data being returned;
* credential data being modified;
* credential data being deleted;
* credential ownership being changed.

This must remain true even if the caller supplies another tenant's `system_id` or `credential_id`.

## 7. Database

**NO DATABASE SCHEMA CHANGES APPROVED.**

Do not add `tenant_id` to `core.system_credentials` for this work package.

## 8. Scope Control

Do not implement OC-SEC-006B, 006C or 006D during this work package.

Those remain separate controlled stages.

MAP_V2 remains unchanged.

All implementation remains under:

`engineering/MAP_V3`

## 9. Commit Control

Implementation and tests may be committed locally.

**DO NOT PUSH.**

Return the local commit ID for review.

## 10. Evidence Required

After implementation return:

* exact files changed;
* exact repository/query changes;
* exact route/auth changes;
* service-layer changes, if any;
* before/after behaviour;
* cross-tenant test results;
* unauthenticated test result;
* Super Admin behaviour and the policy/architecture basis for it;
* confirmation that no database migration was performed;
* confirmation that MAP_V2 remains unchanged;
* local commit ID.

**DECISION: OC-SEC-006A APPROVED FOR REMEDIATION.**

Do not proceed to OC-SEC-006B until OC-SEC-006A implementation evidence has been reviewed and approved.
