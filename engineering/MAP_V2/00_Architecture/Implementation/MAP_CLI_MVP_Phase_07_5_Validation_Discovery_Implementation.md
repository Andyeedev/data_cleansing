# MAP CLI MVP Phase 07.5 — Frontend Validation & Discovery Implementation

Capability:
Validation & Discovery

Objective:
Implement the next approved capability from the Phase 6 Capability Implementation Architecture.

Traceability:
- Doc 16 Validation & Discovery
- Phase 6 Build Order
- Phase 6 Readiness Matrix
- Doc 21 Runtime Metadata Contract
- Doc 04 API Conventions

Rules:
- Review existing MAP CLI implementation first.
- Reuse existing frontend foundation.
- Do NOT recreate infrastructure.
- Consume ONLY approved backend APIs.
- No mock data.
- No invented APIs.
- Frontend remains presentation-only.
- No business logic.

Implement:

Pages:
- DiscoveryPage
- ValidationPage

Review first:
- Existing Discovery implementation
- Existing Validation implementation
- Existing metadata discovery workflow
- Existing validation execution workflow

Reuse:
- apiClient.ts
- LoadingSpinner
- ErrorMessage
- Breadcrumb
- MetadataRenderer
- AuthContext
- Existing routing/navigation

Implement:
- Loading state
- Error state
- Empty state
- Permission gating
- Discovery execution
- Discovery results
- Validation execution
- Validation results
- Progress display

Testing:
- Unit tests
- Integration tests
- Verify API interactions
- Verify permission behaviour

Create report:

MAP_CLI_MVP_Phase_07_5_Validation_Discovery_Implementation_Report.md

Include:
1. Capability Implemented
2. Existing Components Reused
3. Files Created
4. Files Modified
5. APIs Consumed
6. Metadata Consumed
7. Doc 04 Compliance
8. Permission Gating
9. States Implemented
10. Tests Completed (new tests only)
11. Outstanding Issues
12. Traceability to Phase 6
13. Gate

STOP after completion.

Wait for approval before implementing the next capability.

Save report to:

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/