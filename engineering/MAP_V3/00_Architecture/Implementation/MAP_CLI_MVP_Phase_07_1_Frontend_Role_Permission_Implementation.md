# MAP CLI MVP Phase 07 — Frontend Capability Implementation

## Capability: Role & Permission Management

Phase: 7 — Frontend Capability Implementation (Phase 1)

Objective:
Implement the next approved frontend capability from the Phase 6 Capability Implementation Architecture.

Capability:
Role & Permission Management

Traceability:
- Doc 16 §4.6 #6.2
- Phase 6 §8 Build Order
- Phase 6 Page Reference Matrix
- Phase 6 Readiness Matrix
- MAP CLI backend API inventory Appendix A

---

## Mandatory Rules

Before implementation:

1. Verify existing frontend foundation:
- Shell
- Layout
- DynamicNavigation
- Breadcrumb
- MetadataRenderer
- AuthContext
- AppRoutes
- Existing shared components

Do not recreate existing infrastructure.

2. Verify backend APIs exist before coding.

Use only approved MAP CLI backend APIs.

Do not:
- invent APIs
- create mock data
- create placeholder business workflows
- duplicate backend logic

3. Frontend remains presentation-only.

Business rules remain backend responsibility.

4. Navigation, routing and permissions must align with:
- Doc 21 Runtime Metadata Contract
- Existing Phase 4/5 foundation

---

## Required Implementation Pattern

For Role & Permission Management:

1. Create API service hook(s)

Example:
- useRoles.ts
- usePermissions.ts

2. Replace placeholder pages with real implementation:

Required pages:
- RolesPage.tsx
- RoleDetailPage.tsx

3. Consume approved APIs:

Expected:
- GET /api/v1/roles
- POST /api/v1/roles
- PUT /api/v1/roles/{id}
- DELETE /api/v1/roles/{id}
- GET /api/v1/roles/{id}/permissions
- GET /api/v1/permissions/list
- Assign/remove permissions APIs

Verify actual backend routes before use.

4. Implement required states:

- Loading state
- Error state
- Empty state
- Permission denied state

Reuse:
- LoadingSpinner
- ErrorMessage
- Breadcrumb
- MetadataRenderer
- Existing API client

5. Permission gating:

Follow Doc 21 §7.

Current:
- Use existing development AuthContext

Important:
- This is temporary frontend enforcement only.
- Do not treat frontend permission checks as security boundaries.

---

## Testing Requirements

Create:

Unit tests:
- Permission denied
- Loading state
- Error handling
- Roles rendering
- Permissions rendering

Integration tests:
- Fetch roles
- Fetch permissions
- Role detail loading
- Assign/remove permission workflow
- Search/filter if supported

All tests must pass.

---

## Report Requirement

After completion create:

MAP_CLI_MVP_Phase_07_1_Frontend_Role_Permission_Implementation.md

Include:

1. Capability Implemented
2. Files Created
3. Files Modified
4. APIs Consumed
5. Metadata Consumed
6. Doc 04 API Compliance
7. Permission Gating
8. States Implemented
9. Tests Completed
10. Outstanding Issues
11. Traceability to Phase 6
12. Gate

---

## STOP Condition

After implementation:

STOP.

Do not continue to next capability.

Wait for approval.

Final output:
- Implementation report only
- No next capability implementation
- No architectural changes



--------------------------------------------------

# Gate

After every capability:

STOP

Wait for approval before implementing the next capability.

Do NOT continue automatically.

One approved capability at a time.


Save  report to:


engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
            

---


















