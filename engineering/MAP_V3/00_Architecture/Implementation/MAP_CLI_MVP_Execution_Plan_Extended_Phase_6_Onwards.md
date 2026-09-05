# MAP_CLI_MVP_Execution_Plan_Extended_06_Onwards.md


Phase 6 – Frontend Capability Architecture & Execution Plan
Objective

Build the architecture and execution plan for the next implementation phase of the MAP CLI MVP frontend.

This phase is planning only.

Do not implement code.

Determine which real frontend capabilities should be built next using only the approved enterprise architecture.

Authoritative Sources

The only sources of truth are:

Doc 16 – Enterprise Business Capability Model
Doc 21 – Enterprise Runtime Metadata Contract
Doc 22 – Enterprise Navigation Contract
Doc 23 – Enterprise API Contract
Doc 24 – Enterprise Data Contract
Existing MAP CLI MVP implementation (frontend-mvp/)

The frozen frontend is not authoritative.

It may only be referenced for approved presentation patterns already identified during Phase 5.

Execution Rules

Follow the same execution principles as the original MAP CLI execution plan.

1. Execute one phase only

Do not design or discuss future phases.

Deliver only Phase 6.

2. MAP CLI remains the source of implementation

Every recommendation must align with:

approved architecture
approved metadata
approved APIs
existing MAP CLI implementation

Never allow the frozen frontend to become the source of truth.

3. Canonical capability rule

Every capability must exist only once.

If duplicate capability definitions are discovered:

identify them
explain the conflict
recommend the canonical source

Do not invent new capabilities.

4. Existing implementation assessment

Treat existing implementation as:

partially complete
non-authoritative unless verified against policy

Verify before recommending changes.

5. No invention

Do not invent:

APIs
metadata
workflows
permissions
business logic
dashboard widgets

Everything must trace back to Docs 16, 21, 22, 23 or 24.

6. No mock functionality

Do not recommend:

mock business pages
placeholder workflows
fake dashboards
dummy APIs

Only identify genuine gaps where backend work is required.

Required Analysis
1. Review Current Frontend State

Assess what currently exists after Phase 5.

Completed foundation includes:

Shell
Layout
Metadata-driven navigation
Routing
Theme
Permission-aware navigation
Metadata renderer
Mock authentication framework

Identify:

frontend capabilities already implemented
frontend capabilities still missing
existing APIs available
backend capabilities already ready
backend capabilities still required
dependencies between capabilities
2. Capability Assessment

Evaluate the next implementation candidates.

Examples include:

Dashboard

Examples:

migration status
validation status
KPIs
execution progress
risk indicators

Determine:

APIs available
metadata available
widgets required
backend readiness
Migration

Examples:

projects
connections
datasets
mappings
execution history

Verify against:

Doc 16
Doc 21
Doc 23
Discovery

Examples:

schema discovery
dataset discovery
column discovery
relationship discovery

Verify against:

Discovery APIs
metadata
backend readiness
Validation

Examples:

rules
controls
execution
results
failures
exceptions

Verify against:

Validation Engine architecture.

Governance

Examples:

approvals
audit
compliance
risk

Verify against:

Governance capabilities and APIs.

Capability Traceability

Every capability must include:

| Capability | Doc 16 | Doc 21 | Doc 23 API | Doc 24 Data | Backend Ready | Dependencies |

If traceability cannot be established:

STOP

Report the gap.

Do not guess.

Produce Recommended Build Order

Create the recommended implementation sequence.

For every capability provide:

| Capability | Priority | Reason | Dependencies | APIs Required | Backend Ready |

Explain why the order is correct considering:

business value
backend readiness
architecture dependencies
implementation risk
testing impact
Frontend Architecture

Define:

page structure
component strategy
metadata usage
API integration pattern
state management
permission handling
loading/error strategy

Ensure no regression of Phase 4 principles.

Risks

Identify:

missing APIs
missing metadata
missing backend implementation
architectural risks
dependency risks
Deliverable

Produce:

MAP_CLI_MVP_Phase_06_Capability_Implementation_Architecture.md

Include:

Objective
Current State Assessment
Architecture Constraints
Capability Assessment
Capability Traceability Matrix
Capability Prioritisation
Recommended Build Order
Frontend Architecture
API Dependencies
Backend Dependencies
Risks
Testing Strategy
Phase 6 Gate Criteria
Phase 6 Gate Criteria

The report cannot pass unless:

Every capability maps to Doc 16.
Every API maps to Doc 23.
Metadata usage maps to Docs 21 & 22.
Data dependencies map to Doc 24.
Dependencies are documented.
Implementation order is justified.
Backend gaps are identified.
No invented APIs.
No invented metadata.
No mock business functionality.
No frozen frontend business logic introduced.
Final Rules
Do not write implementation code.
Do not modify the frontend.
Do not create business pages.
Do not generate mock data.
Do not invent APIs.
Wait for approval before any implementation.



Gate
➡ Wait for approval.

---

After engineering review and explicit user approval, promote approved reports only:

Save  report to:


engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
            


---

