# MAP CLI MVP Phase 07.4 — Frontend Connection Management Implementation

Capability:
Connection Management

Objective:
Implement the next approved capability from the Phase 6 Capability Implementation Architecture.

Traceability:
- Doc 16 §4.1 #1.2 Connection Management
- Phase 6 Build Order
- Phase 6 Readiness Matrix
- Doc 21 Runtime Metadata Contract
- Doc 04 API Conventions

Rules:
- Reuse existing frontend foundation.
- Do NOT recreate infrastructure.
- Consume ONLY approved MAP CLI backend APIs.
- No mock data.
- No invented APIs.
- Frontend remains presentation-only.
- No business logic in frontend.

Implement:

Pages:
- SystemsPage
- SystemDetailPage

Consume approved APIs:
- GET /api/v1/systems
- POST /api/v1/systems
- GET /api/v1/systems/{id}
- GET /api/v1/systems/{id}/test

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
- Permission gating (Doc 21 §7)
- List systems
- View system details
- Create system
- Test connection

Testing:
- Unit tests
- Integration tests
- Verify API interactions
- Verify permission behaviour

Create report:

MAP_CLI_MVP_Phase_07_4_Connection_Management_Implementation_Report.md

Include:
1. Capability Implemented
2. Files Created
3. Files Modified
4. APIs Consumed
5. Metadata Consumed
6. Doc 04 Compliance
7. Permission Gating
8. States Implemented
9. Tests Completed (new tests only)
10. Outstanding Issues
11. Traceability to Phase 6
12. Gate

STOP after completion.

Wait for approval before implementing the next capability.

Save report to:

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/