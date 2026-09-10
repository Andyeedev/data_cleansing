# OC-COM-001d — SaaS Customer Experience & Frontend Implementation

**DATE:** 2026-09-08
**STATUS:** IMPLEMENTATION SPECIFICATION
**PREDECESSOR:** OC-COM-001c — SaaS Product & Tenant Lifecycle Architecture
**PREDECESSOR STATUS:** ACCEPTED / CANONICAL ARCHITECTURAL BASELINE
**IMPLEMENTATION MODE:** AUDIT FIRST → PLAN → APPROVAL GATE → IMPLEMENTATION

---

# 1. PURPOSE

Implement the MAP Nexus SaaS customer experience defined by **OC-COM-001c**.

OC-COM-001c is the **canonical architectural baseline** and must be treated as authoritative.

001d is responsible for the **customer-facing experience and frontend orchestration** required to take a customer from:

> Welcome → Create Project → Connect Source → Connect Target → Run Discovery → Review Datasets → Mappings → Validation → Results → Report

001d must consume and orchestrate the existing backend, security, tenant isolation, RBAC, entitlement, Stripe, migration and validation capabilities.

**Do not recreate existing functionality.**

**Do not replace existing security or backend architecture merely to simplify implementation.**

**Do not make opportunistic schema or architectural changes.**

Any required deviation must be explicitly identified and approved.

---

# 2. MANDATORY IMPLEMENTATION PRINCIPLE

Before modifying any code:

## PHASE A — AUDIT

Perform a repository-wide audit of the existing implementation.

The audit must establish:

1. What already exists.
2. What is partially implemented.
3. What is missing.
4. What is inconsistent with OC-COM-001c.
5. What can be reused directly.
6. What requires modification.
7. What requires a database/schema change.
8. What APIs already exist.
9. What frontend routes/components/pages already exist.
10. What security/RBAC/tenant controls already exist.
11. What migration-engine functionality already exists.
12. What tests already exist.
13. What is potentially broken by the Project-owned System decision.

**Do not begin implementation during the audit.**

---

# 3. REQUIRED AUDIT OUTPUT

Produce an explicit **OC-COM-001d Audit Report** before coding.

The report must contain at minimum:

## 3.1 Existing Frontend Inventory

Audit:

* `AppRoutes.tsx`
* dashboard
* application shell
* sidebar/navigation
* project pages
* connection pages
* diagnostics
* discovery
* mappings
* validation
* results
* reports
* governance
* administration
* profile
* settings
* authentication/session handling
* reusable components
* API client/service layer
* state management
* project-selection mechanisms
* tenant context mechanisms

For each relevant area state:

| Area | Existing | Partial | Missing | Reuse/Modify/New |
| ---- | -------- | ------- | ------- | ---------------- |

---

# 4. BACKEND/API AUDIT

Audit existing APIs and backend services for:

### Tenant

* tenant retrieval
* tenant context
* tenant status
* tenant administration

### Users/RBAC

* current-user endpoint
* user management
* invitations
* roles
* permissions
* tenant isolation

### Subscription

* current subscription
* plans
* trial information
* subscription status
* upgrade
* downgrade
* cancellation

### Billing

* Stripe customer
* checkout
* billing portal
* invoices
* payment state

### Entitlements

* entitlement middleware
* plan feature checks
* limits

### Usage

Determine whether usage metering already exists.

If not, identify exactly what is required for 001d versus what should remain future work.

### Projects

* project creation
* project listing
* project selection
* project details
* project lifecycle

### Systems

Audit current implementation carefully.

**OC-COM-001c binding decision:**

> `core.system_registry` is Project-owned.

Target relationship:

```text
system.project_id → core.projects.project_id
```

The existing implementation may currently be tenant-scoped.

Determine:

* current schema
* current repository
* current service
* current routes
* current queries
* current authorization
* current frontend
* all references to `tenant_id`
* all tests
* all discovery dependencies
* all credential dependencies

Do not silently migrate the schema.

If the migration is required, raise it explicitly as a deviation.

### Credentials

Audit:

```text
core.system_credentials
```

Target ownership:

```text
credential
    ↓
system
    ↓
project
    ↓
tenant
```

Determine how tenant isolation is currently enforced.

### Discovery

Audit:

* discovery APIs
* discovery execution
* discovery history
* discovered tables
* discovered columns
* dependencies
* project/system relationships
* frontend workflow

### Dataset inventory

OC-COM-001c establishes:

> Discovery Runs ≠ Dataset inventory.

Datasets are first-class Project-level inventory.

Audit:

```text
core.discovered_tables
```

and associated:

* columns
* dependencies
* metadata
* project relationships

Determine whether this model already exists or requires changes.

### Mapping

Audit existing:

* mapping configuration
* mapping rules
* mapping versions
* mapping APIs
* mapping UI
* project relationships

### Validation

Audit:

* validation runs
* validation results
* defects
* rule configuration
* execution APIs
* result APIs
* project relationships

### Reporting

Audit:

* report generation
* report suites
* report templates
* generated reports
* dashboards
* export functionality

---

# 5. SECURITY AUDIT

OC-SEC-006 and its final isolation model remain authoritative.

Audit the existing implementation against:

* authenticated session/JWT tenant context
* tenant isolation
* project isolation through tenant
* system isolation through project
* credential isolation
* RBAC
* permissions
* admin access
* Super Admin access
* route protection
* frontend route guards
* API authorization

## Mandatory rule

The client MUST NOT establish tenant identity.

The following MUST NOT be trusted to establish tenancy:

```text
?tenant_id=
X-Tenant-ID
```

unless explicitly part of an authorised internal/system-admin mechanism.

The authenticated session/JWT is authoritative.

Super Admin is an explicitly authorised system-wide context.

Do not interpret Super Admin as "tenant isolation disabled".

---

# 6. CANONICAL ENTITY HIERARCHY

The following hierarchy is binding:

```text
PLATFORM
│
├── Plans
├── System-wide Roles
└── Super Admin / explicit system context
│
└── TENANT
    │
    ├── Subscription
    ├── Billing / Invoices
    ├── Entitlements
    ├── Usage
    ├── Users
    ├── Roles
    ├── Feature Flags
    ├── Workflows / Approvals / Audit
    │
    └── PROJECT
         │
         ├── Systems
         │    └── Credentials
         │
         ├── Discovery Runs
         │
         ├── Datasets
         │    └── Dataset Columns
         │
         ├── Mappings
         │    └── Mapping Versions
         │
         ├── Validation Runs
         │    └── Validation Results
         │         └── Defects
         │
         └── Generated Reports
```

Binding ownership:

| Entity                | Ownership                                   |
| --------------------- | ------------------------------------------- |
| Plan                  | Global                                      |
| Tenant                | System/top-level                            |
| Subscription          | Tenant                                      |
| Billing               | Tenant                                      |
| Entitlements          | Tenant                                      |
| Usage                 | Tenant                                      |
| User                  | Tenant                                      |
| Role                  | Tenant or system                            |
| Project               | Tenant                                      |
| System                | **Project**                                 |
| Credential            | System                                      |
| Discovery Run         | Project/System execution                    |
| Dataset               | **Project**                                 |
| Dataset Column        | Dataset                                     |
| Mapping               | Project                                     |
| Mapping Version       | Project                                     |
| Validation Run        | Project                                     |
| Validation Result     | Run                                         |
| Defect                | Result                                      |
| Report Template/Suite | Tenant                                      |
| Generated Report      | Project                                     |
| Workflow/Approval     | Tenant, with Project scope where applicable |
| Audit                 | Tenant or system context                    |

---

# 7. CUSTOMER EXPERIENCE TO IMPLEMENT

001d must implement/orchestrate the following customer journey.

## Stage 1 — Welcome

First-time Tenant Admin should not simply land on an unexplained empty dashboard.

Target experience:

```text
Welcome
  ↓
Create first migration project
```

The UI should communicate:

* organisation/workspace
* trial/subscription state where applicable
* next recommended action
* migration setup progress

---

# 8. ONBOARDING BACKBONE

The primary onboarding flow is:

```text
Welcome
  ↓
Create Project
  ↓
Connect Source
  ↓
Connect Target
  ↓
Run Discovery
  ↓
Review Datasets
  ↓
Mappings
  ↓
Validation
  ↓
Results
  ↓
Report
```

This is the canonical 001d onboarding backbone.

Do not create a disconnected onboarding experience that duplicates the main application workflow.

The onboarding experience should guide the user into the actual project/application areas.

---

# 9. PROJECT EXPERIENCE

Implement a clear project-centric experience.

Users must be able to:

* view projects
* create a project
* select a project
* see which project is active
* understand project progress/status
* navigate project-specific systems
* navigate project-specific discovery
* navigate project-specific datasets
* navigate mappings
* navigate validation
* navigate reports

The active project must be explicit in the UI.

Do not rely on an implicit tenant-level system context for project-owned resources.

---

# 10. SYSTEM / CONNECTION EXPERIENCE

Because Systems are now Project-level:

```text
Tenant
  └── Project
       ├── Source System
       └── Target System
```

The frontend must reflect this.

Connection screens must operate in the context of the selected Project.

Users should be able to:

1. Add source system.
2. Add target system.
3. Configure connection.
4. Store/use credentials through existing secure mechanisms.
5. Test connection.
6. View connection health.
7. Edit connection.
8. Remove/deactivate connection where supported.

Do not expose credentials.

Do not create a new credential storage mechanism unless the audit proves one is genuinely missing and the change is explicitly raised.

---

# 11. SOURCE / TARGET MODEL

The UX should clearly distinguish:

* Source
* Target

where the existing backend/migration model supports that distinction.

The project should make it obvious which systems participate in the migration.

Avoid creating tenant-global connection screens that obscure project ownership.

---

# 12. DISCOVERY EXPERIENCE

The user should be able to:

1. Select project.
2. Select appropriate system(s).
3. Run discovery.
4. See discovery progress/status.
5. View historical discovery runs.
6. Review discovered inventory.
7. Review tables.
8. Review columns.
9. Review dependencies where available.

Critical distinction:

```text
Discovery Run
= execution/history/evidence

Dataset Inventory
= current usable project inventory
```

Do not model discovery runs as if they are the datasets themselves.

---

# 13. DATASET EXPERIENCE

Datasets must be presented as first-class project inventory.

The UI should allow the user to understand:

* discovered datasets/tables
* source/target association
* columns
* data types
* inferred metadata where available
* dependencies
* mapping status
* validation readiness

Dataset inventory feeds:

```text
Dataset → Mapping → Validation
```

Do not introduce an alternative dataset model if the existing `core.discovered_tables` model can support this.

---

# 14. MAPPING EXPERIENCE

The existing mapping engine is authoritative.

001d should provide the customer-facing orchestration around it.

Users should be able to:

* see available datasets
* create/review source → target mappings
* see mapping completeness
* define/review transformation rules where already supported
* see mapping versions
* understand what remains unmapped
* move toward validation

Do not recreate the mapping engine.

---

# 15. VALIDATION EXPERIENCE

The existing validation engine is authoritative.

001d should provide:

* validation setup
* rule configuration where supported
* run initiation
* progress/status
* pass/fail/warning summary
* result navigation
* defect drill-down
* rerun workflow

Use existing validation APIs/services.

Do not recreate validation execution logic.

---

# 16. RESULTS EXPERIENCE

The user should be able to understand:

* total controls/rules
* passed
* failed
* warnings
* critical failures
* defects
* affected datasets
* affected mappings
* run history

Use existing result data.

Do not create a parallel validation result model.

---

# 17. REPORT EXPERIENCE

The customer should be able to move from validation results to reporting.

Existing report functionality should be reused.

Distinguish:

```text
Tenant-level:
Report Templates / Suites / KPI definitions

Project-level:
Generated Migration / Validation / Defect / Evidence Reports
```

Do not collapse these into one concept.

---

# 18. SUBSCRIPTION EXPERIENCE

001d must define/implement the frontend experience around existing 001b Stripe functionality.

The following concepts must remain separate:

### Subscription

"What plan am I on?"

### Billing

"How am I paying?"

### Entitlements

"What am I allowed to use?"

### Usage

"How much have I consumed?"

These must not be merged into one generic billing page.

---

# 19. REQUIRED SUBSCRIPTION UI

Target routes:

```text
/subscription/plans
/billing/subscription
/billing/checkout
/billing/portal
/billing/invoices
```

Audit existing routing first.

Do not create duplicate routes if an existing route already serves the same purpose.

The subscription UI should support, where backend capabilities exist:

* current plan
* trial state
* trial countdown
* plan comparison
* upgrade
* downgrade
* cancellation
* subscription status
* renewal/period information

Trial default:

```text
30 days
```

Do not hard-code values if the backend already provides them.

---

# 20. BILLING UI

Billing should cover the Stripe payment relationship.

Where supported by existing APIs:

* Stripe customer status
* billing period
* payment method summary
* invoices
* billing portal access
* checkout

Never expose sensitive payment details unnecessarily.

Reuse existing 001b Stripe routes/services.

---

# 21. ENTITLEMENT UI

Where useful, communicate feature availability.

Examples:

```text
Feature available
Feature unavailable on current plan
Upgrade required
```

Use the existing entitlement middleware/backend contract.

Do not duplicate entitlement logic independently in the frontend.

Frontend checks are UX only.

Backend enforcement remains authoritative.

---

# 22. USAGE UI

Usage is a first-class tenant capability.

Concept:

```text
Entitlement = allowed?
Usage      = consumed?
Limit      = maximum?
```

Potential usage dimensions:

* users
* projects
* systems
* validation runs
* storage

Target UX:

```text
18 / 20 users
⚠ Approaching plan limit
```

Expected policy from 001c:

* warning at 80%
* block at 100%

However:

**Do not invent backend usage infrastructure during 001d if it does not exist.**

Audit it first.

If missing, clearly separate:

* frontend placeholder/contract required now
* backend metering required later

Any backend/schema work must be explicitly identified.

---

# 23. TENANT SUSPENSION / ACCESS STATE

001c establishes separate lifecycles.

Subscription:

```text
TRIALING
→ ACTIVE
→ PAST_DUE
→ CANCELLED
→ EXPIRED
```

Tenant access:

```text
ACTIVE
→ SUSPENDED
→ OFFBOARDING
→ PURGED
```

Suspension reasons may include:

* cancellation
* payment failure
* administrative action
* policy/security action

User status is separate.

001d must not incorrectly infer:

```text
subscription.status == tenant.status
```

Audit existing support for suspended tenants.

If suspension enforcement is missing, do not silently implement a new backend state machine as part of frontend work.

Raise the gap explicitly.

---

# 24. WELCOME / FIRST LOGIN

Implement a first-login/customer onboarding experience where supported by the existing authentication/session architecture.

Target:

```text
First Login
   ↓
Welcome
   ↓
Create First Project
   ↓
Connect Source
   ↓
Connect Target
   ↓
Discovery
```

The user should always have an obvious next action.

Avoid forcing users to understand the entire application before starting.

---

# 25. NAVIGATION ARCHITECTURE

Navigation should reflect the hierarchy.

Suggested conceptual structure:

```text
Dashboard

Projects
  └── Active Project
       ├── Overview
       ├── Connections
       ├── Discovery
       ├── Datasets
       ├── Mappings
       ├── Validation
       ├── Results
       └── Reports

Governance

Administration
  ├── Users
  ├── Roles
  └── Tenant settings

Subscription
Billing
Usage

Profile
Settings
```

This is a UX target, not permission to blindly replace the existing navigation.

Audit and reuse existing navigation components first.

---

# 26. PROJECT CONTEXT REQUIREMENT

Project-specific pages must have a reliable project context.

Determine whether the existing application uses:

* route parameter
* global state
* context provider
* selected-project store
* backend session
* query parameter

Use the existing architecture where appropriate.

Do not create multiple competing project-context mechanisms.

The project context must ultimately resolve to a server-authorised Project belonging to the authenticated Tenant.

---

# 27. ROUTE MAP

The canonical current route inventory from OC-COM-001c is:

```text
/login
/session-expired
/dashboard

/administration/tenants
/administration/users
/administration/roles

/migration/projects
/migration/connections
/migration/connections/diagnostics
/migration/discovery
/migration/mappings

/validation
/validation/results

/reports
/governance

/profile
/settings
```

Target missing customer-experience routes identified by 001c:

```text
/billing/portal
/billing/checkout
/billing/subscription
/billing/invoices
/subscription/plans

/onboarding/welcome
/onboarding/setup
```

But:

**Audit `AppRoutes.tsx` and the actual page/component tree first.**

The route list above is architectural intent, not evidence that the routes are currently absent.

---

# 28. TENANT ADMINISTRATION

Tenant administration is not the same as customer onboarding.

Super Admin tenant management remains system-level functionality.

Tenant Admin functionality must remain tenant-scoped.

Do not expose Super Admin functionality to ordinary tenant users.

---

# 29. ROLE-AWARE UX

Existing RBAC remains authoritative.

Frontend should use existing permission/role information to:

* hide inaccessible navigation
* disable unavailable actions
* show appropriate empty/error states

But:

**Frontend hiding is not authorization.**

Backend authorization remains mandatory.

Do not replace `require_admin`, `require_role`, `require_permissions`, or existing security dependencies.

---

# 30. ERROR / EMPTY / LOADING STATES

001d must provide proper customer experience for:

* no project yet
* no systems yet
* no discovery run
* no datasets
* no mappings
* no validation runs
* no results
* no reports
* trial ending
* subscription inactive
* tenant suspended
* insufficient entitlement
* plan limit reached
* API failure
* session expiry
* unauthorized access
* project not found
* project belonging to another tenant

Avoid blank screens.

---

# 31. CUSTOMER JOURNEY STATUS

The dashboard/project experience should make progress understandable.

Conceptually:

```text
Project Setup
✓ Project created
✓ Source connected
✓ Target connected
✓ Discovery completed
○ Dataset review
○ Mapping
○ Validation
○ Results
○ Report
```

Use actual backend state where available.

Do not fabricate completion states.

---

# 32. BACKWARD COMPATIBILITY

This is mandatory.

The existing MAP Nexus application contains substantial functionality.

Before modifying anything:

* locate the current implementation
* understand its dependencies
* identify callers
* inspect tests
* preserve existing contracts unless change is required

Do not rewrite functioning modules simply because a cleaner implementation is possible.

Do not delete existing functionality without explicit justification.

---

# 33. DATABASE CHANGE CONTROL

001d is primarily a customer-experience implementation.

Do not perform database migrations automatically.

The most important known potential schema change is:

```text
core.system_registry.tenant_id
```

moving to:

```text
core.system_registry.project_id
```

This is an architectural requirement from 001c but must be treated as a controlled deviation/change.

Before proposing implementation:

* inspect current schema
* inspect all foreign keys
* inspect repository queries
* inspect services
* inspect routes
* inspect discovery
* inspect credentials
* inspect tests
* identify migration impact

If required, produce a separate explicit migration plan.

Do not opportunistically modify the schema.

---

# 34. API CONTRACT CONTROL

Before creating frontend API calls:

1. Search for existing API endpoints.
2. Search for service/repository implementations.
3. Search frontend API clients.
4. Search tests.
5. Reuse existing contracts.

Do not invent new endpoints where an existing endpoint already provides the required data.

If a missing endpoint is required, document:

```text
Endpoint
Method
Request
Response
Authorization
Tenant/project scope
Reason required
Existing alternative considered
```

---

# 35. STRIPE CONTROL

Existing OC-COM-001b Stripe implementation must be reused.

Do not recreate:

* Stripe service
* Stripe configuration
* Stripe customer logic
* checkout logic
* webhook logic
* entitlement middleware

unless the audit identifies a defect requiring change.

If actual Stripe account/environment configuration is required, identify it as deployment/configuration work.

---

# 36. SECURITY CONTROL

Existing security work packages remain authoritative:

```text
OC-SEC-005
OC-SEC-006A
OC-SEC-006B
OC-SEC-006C
OC-SEC-006D
OC-SEC-006_Final_Isolation_Model
```

Do not weaken them.

Do not create alternative tenant isolation logic.

Do not trust client-provided tenant IDs.

Do not introduce a frontend mechanism that can select arbitrary tenants.

---

# 37. TESTING REQUIREMENTS

Audit existing tests before adding new tests.

001d should ultimately include appropriate tests for:

### Routing

* authenticated routes
* unauthenticated redirects
* role-based routes

### Tenant isolation

* tenant cannot access another tenant's project
* tenant cannot access another tenant's systems
* tenant cannot access another tenant's datasets
* tenant cannot access another tenant's mappings
* tenant cannot access another tenant's validation results

### Project isolation

* project A cannot access project B resources incorrectly
* system belongs to correct project
* discovery belongs to correct project
* datasets belong to correct project

### Onboarding

* first-login welcome
* project creation
* connection workflow
* discovery workflow
* transition to mapping
* transition to validation

### Subscription

* trial display
* active subscription
* inactive/past-due state
* entitlement restriction

### UX states

* loading
* empty
* error
* suspended tenant
* expired session

Do not duplicate the existing 63+ isolation tests unnecessarily.

---

# 38. UI QUALITY EXPECTATION

The customer experience should feel like a coherent SaaS product rather than a collection of existing engineering screens.

Priorities:

1. Clear hierarchy.
2. Clear next action.
3. Project context always understandable.
4. Consistent navigation.
5. Consistent loading/error/empty states.
6. Clear subscription state.
7. Clear onboarding progress.
8. Minimal unnecessary clicks.
9. Reuse existing design system/components.
10. Do not introduce visual inconsistency.

Do not perform a wholesale visual redesign unless the audit shows it is required.

---

# 39. IMPLEMENTATION PRIORITY

After audit approval, implementation should be prioritised:

## P0 — Architectural correctness

* project context
* Project-owned Systems
* tenant isolation
* project isolation
* existing security preservation

## P1 — First customer journey

```text
Welcome
→ Project
→ Source
→ Target
→ Discovery
→ Datasets
→ Mapping
→ Validation
→ Results
→ Report
```

## P2 — Subscription experience

* plans
* trial
* subscription
* billing
* checkout
* invoices

## P3 — Usage / entitlement UX

* current limits
* usage
* warnings
* upgrade prompts

## P4 — Offboarding/suspension UX

Only to the extent supported by existing backend lifecycle controls.

---

# 40. NON-GOALS

Do NOT use 001d to:

* rewrite the migration engine
* rewrite validation
* rewrite rule execution
* replace existing RBAC
* replace tenant isolation
* replace authentication
* recreate Stripe backend
* recreate plans/subscriptions
* redesign the entire database
* introduce a second mapping model
* introduce a second dataset model
* introduce a second discovery model
* introduce a second project-context mechanism
* remove working functionality without evidence
* perform unapproved schema migrations
* make speculative architecture changes

---

# 41. REQUIRED AUDIT REPORT FORMAT

Before implementation, return:

## A. Executive Finding

One concise statement:

```text
READY / NOT READY / READY WITH DEVIATIONS
```

## B. Existing Architecture

Summarise what is actually present.

## C. Frontend Audit

Table:

| Area | Status | Existing Location | Reuse | Required Change |
| ---- | ------ | ----------------- | ----- | --------------- |

## D. Backend/API Audit

| Capability | Status | Existing Endpoint/Service | Required Change |
| ---------- | ------ | ------------------------- | --------------- |

## E. Database Audit

| Entity | Current Ownership | 001c Ownership | Compatible? | Required Change |
| ------ | ----------------- | -------------- | ----------- | --------------- |

Pay particular attention to:

```text
Tenant
Project
System
Credential
Discovery Run
Dataset
Dataset Column
Mapping
Validation
Reports
Subscription
Usage
```

## F. Security Audit

Confirm whether:

* tenant derives from authenticated session/JWT
* client tenant IDs are rejected/ignored
* project ancestry is enforced
* system ancestry is enforced
* credentials are protected
* RBAC remains authoritative
* Super Admin context is explicit

## G. Route Audit

Compare actual routes against OC-COM-001c.

## H. Onboarding Audit

Map existing pages to:

```text
Welcome
Project
Source
Target
Discovery
Datasets
Mapping
Validation
Results
Report
```

## I. Subscription/Billing Audit

Identify exactly what 001b already provides.

## J. Usage Audit

State whether usage metering exists.

## K. Suspension/Offboarding Audit

State what exists and what is missing.

## L. Deviations

Every deviation must be explicitly listed:

```text
DEV-001
Description:
Reason:
Impact:
Files/tables affected:
Recommended action:
```

## M. Proposed Implementation Plan

Only after the audit.

Break into logical implementation steps.

## N. Risk Assessment

Identify:

* schema risk
* security risk
* regression risk
* API compatibility risk
* project ownership migration risk
* frontend routing risk

---

# 42. APPROVAL GATE

After producing the audit:

**STOP.**

Do not begin implementation until the audit and implementation plan have been reviewed/approved.

The audit is the gate between discovery and code modification.

If the audit identifies a required architectural deviation, stop and highlight it before implementation.

---

# 43. ACCEPTANCE CRITERIA

001d will be considered complete only when:

### Customer Journey

A tenant user can coherently progress through:

```text
Welcome
→ Create Project
→ Connect Source
→ Connect Target
→ Discovery
→ Dataset Review
→ Mapping
→ Validation
→ Results
→ Report
```

### Tenant Boundary

No customer can use the frontend to establish or switch arbitrary tenant context.

### Project Boundary

Project-owned resources resolve through the authenticated tenant.

### System Boundary

Systems are treated as Project-owned in the customer experience and API orchestration.

### Dataset Boundary

Datasets are treated as first-class Project inventory.

### Discovery

Discovery execution and dataset inventory remain separate concepts.

### Subscription

Subscription, Billing, Entitlements and Usage remain distinct concepts.

### Existing Architecture

Existing security/backend/migration functionality is reused rather than recreated.

### Backward Compatibility

Existing working functionality and tests remain intact unless a documented, approved change requires otherwise.

### Auditability

Every architectural deviation is documented.

---

# 44. FINAL DIRECTIVE TO OPENCODE

Treat this specification and **OC-COM-001c** as the authoritative requirements for this work.

The order of operations is mandatory:

```text
READ 001c
   ↓
READ 001d
   ↓
AUDIT ENTIRE REPOSITORY
   ↓
IDENTIFY EXISTING IMPLEMENTATION
   ↓
IDENTIFY GAPS
   ↓
IDENTIFY DEVIATIONS
   ↓
PRODUCE AUDIT REPORT
   ↓
PROPOSE IMPLEMENTATION PLAN
   ↓
STOP FOR APPROVAL
   ↓
IMPLEMENT ONLY AFTER APPROVAL
```

**Do not code before the audit/plan approval gate.**

**Do not infer that something is missing merely because it is not where expected. Search the repository thoroughly.**

**Do not recreate functionality already implemented under another module/package/work package.**

**Do not make schema changes silently.**

**Do not weaken existing security/isolation controls.**

**OC-COM-001c is the architectural baseline. OC-COM-001d is the customer-experience implementation specification.**
