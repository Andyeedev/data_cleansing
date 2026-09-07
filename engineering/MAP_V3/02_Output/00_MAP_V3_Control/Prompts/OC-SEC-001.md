**CHATGPT REVIEW — OC-SEC-001A**

Status: **APPROVED FOR REMEDIATION**

OC-SEC-001A has confirmed a genuine **P0 security/privacy vulnerability**:

`GET /api/v1/leads` is publicly accessible without authentication and returns personal lead information including `full_name` and `work_email`.

The endpoint can be accessed directly using non-browser clients, therefore CORS does not provide meaningful protection.

The investigation is sufficient to proceed.

### Approved remediation objective

Change:

`GET /api/v1/leads`

from:

`Unauthenticated → full lead dataset`

to:

`Authenticated + authorised → lead data`

### Important implementation requirement

Before implementing the authentication/authorisation change, inspect the existing MAP_V3/MAP_V2 authentication, role and tenant mechanisms.

Specifically establish:

1. Existing `get_current_user` implementation.
2. Existing user/role model.
3. Existing admin roles.
4. Existing tenant/project scoping.
5. Whether any existing authorisation dependency should be reused.
6. Whether the endpoint should be restricted to a specific administrative role.
7. Whether tenant filtering is already available or needs to be introduced.

Do **not** invent a parallel authentication or authorisation mechanism if an existing one can safely be reused.

### Tenant architecture consideration

MAP Nexus is being developed as a multi-tenant product.

Therefore the implementation must not create an access pattern that later permits:

Tenant A administrator → Tenant B lead data.

For the current implementation, determine the minimum safe authorisation boundary required by the existing architecture and document any future tenant-scoping requirement.

### Database

No database schema change is approved or required for this work package.

### Backward compatibility

The investigation confirms zero callers to this endpoint.

Therefore the security change should have low backward-compatibility risk.

### Required tests

Before completion demonstrate:

1. Anonymous `GET /api/v1/leads` → **401/403**.
2. Authenticated non-authorised user → **403** where applicable.
3. Authorised user → successful response.
4. Existing `POST /api/v1/leads` continues to work anonymously.
5. No lead records are exposed through an alternative unauthenticated endpoint.
6. CORS is not treated as the security control.

### Evidence required

Return:

* exact files changed;
* authentication/authorisation mechanism used;
* role/tenant logic relied upon;
* before/after endpoint behaviour;
* test results;
* confirmation that anonymous access is blocked;
* confirmation that POST lead capture remains functional;
* confirmation that no database migration was required.

### Commit control

The local implementation may proceed under:

**OC-SEC-001A — Public Lead Endpoint Security**

MAP_V2 remains unchanged.

All implementation remains in:

`engineering/MAP_V3`

Do not push or create a release yet.

After implementation and testing, return the evidence to CHATGPT for final validation before proceeding to the next security work package.

**Decision: APPROVED FOR IMPLEMENTATION.**
