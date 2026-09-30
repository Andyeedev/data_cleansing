Prepare an architecture and implementation plan for a new optional MAP Nexus add-on:

# OC-REPORT-001 — Report & Analytics Studio

THIS IS A PLAN-ONLY REQUEST.

Do NOT implement.
Do NOT create migrations.
Do NOT modify code.
Do NOT commit.

## Product objective

MAP Nexus should eventually allow authorised users to create, save, manage and share their own governed reports.

The capability should support multiple report types rather than being limited to PDF/report generation.

Proposed report types include:

### Visual / analytical

* KPI cards
* tables
* bar/column charts
* line/trend charts
* pie/donut where appropriate
* scatter charts
* matrix/crosstab
* pivot-style analysis

### MAP Nexus operational

* migration validation
* reconciliation
* data quality
* exceptions
* governance
* audit
* control/rule results

### Engineering

* schema comparison
* data profiling
* mapping analysis
* technical diagnostics
* execution/performance
* migration engineering reports

### Executive

* management summary
* migration status
* risk/issues summary
* governance posture

## FIRST: RECONCILE EXISTING CAPABILITIES

Before proposing new architecture, inspect:

* existing report pages
* existing report APIs
* report/export services
* Governance reporting
* Audit reporting
* Validation reporting
* Reconciliation reporting
* existing chart/table components
* existing permission model
* existing subscription/entitlement model
* existing saved configuration/report models
* existing scheduling/export functionality
* existing frontend reporting components
* any existing report definitions in MAP_V2 or MAP_V3

Do NOT create duplicate reporting logic.

Identify what can be reused.

## SaaS design

Evaluate a standard governed SaaS model:

Report
→ Report Definition
→ Data Source
→ Components/Visualisations
→ Filters
→ Parameters
→ Version
→ Permissions
→ Sharing
→ Optional Schedule
→ Export

Determine which parts should be stored as metadata/configuration rather than hard-coded pages.

## Report builder

Evaluate a simple report-builder workflow:

1. Select report type
2. Select authorised data source
3. Select fields/metrics
4. Apply filters
5. Select visualisation
6. Configure grouping/sorting
7. Preview
8. Save
9. Name/version report
10. Assign permissions
11. Share/publish
12. Optional schedule/export

Do not over-engineer the first version.

## Permissions

Use the existing MAP Nexus:

Role
→ Permission
→ Entitlement
→ Tenant/Object Scope

Do NOT create a separate report permission architecture.

Determine appropriate capabilities such as:

* reports:create
* reports:read
* reports:update
* reports:delete
* reports:export
* reports:share
* reports:schedule

Only propose capabilities after checking the existing permission vocabulary.

## Saved reports

Determine how saved reports should be:

* tenant scoped
* owned
* shared
* published
* versioned
* copied
* archived
* deleted

Determine whether existing tables/models can support this.

Do not create database tables until the existing model has been reconciled.

## Data security

A saved report must never bypass:

* tenant isolation
* RBAC
* object permissions
* subscription entitlements
* existing data-access controls

A user saving a report must not make its underlying data accessible to another user who would otherwise lack permission.

## Add-on / entitlement model

Treat Report & Analytics Studio as an optional SaaS capability.

Inspect the existing canonical entitlement model.

Do NOT invent a new entitlement architecture.

Recommend how the capability could eventually be exposed as an add-on while preserving the existing subscription model.

Consider separate capabilities for:

* Report Studio
* Advanced Analytics
* Engineering Reports
* Report Distribution/Scheduling
* AI-assisted Analytics

These are proposals only and must be reconciled against the existing commercial architecture.

## Export

Assess existing export mechanisms and determine whether the first version should support:

* on-screen report
* CSV
* Excel
* PDF

Do not build export engines if equivalent functionality already exists.

## Scheduling

Assess whether scheduled reports already exist.

If not, identify scheduling as a later capability rather than unnecessarily expanding V1.

## Charts

Do not create a chart catalogue without purpose.

For each proposed visualisation explain:

* use case
* required data shape
* whether existing frontend components can render it
* whether server-side aggregation is required

## AI compatibility

Design the report definition so that a future AI analytics capability can consume it.

For example:

AI should eventually be able to say:

"Create a reconciliation report showing differences by dataset."

and generate a governed report definition using authorised data sources.

Do NOT implement AI as part of this work package.

## Required output

Return:

1. Product concept
2. Existing reporting reconciliation
3. Proposed report model
4. Report types
5. Builder workflow
6. Saved-report lifecycle
7. Permission model
8. Tenant/security model
9. Entitlement/add-on model
10. Data-source architecture
11. Visualisation architecture
12. Export architecture
13. Scheduling recommendation
14. AI compatibility
15. Existing code/components reusable
16. New components/services required
17. Database impact
18. API impact
19. Frontend impact
20. Implementation phases
21. V1 vs later capabilities
22. Risks/discrepancies
23. Acceptance criteria

Keep the first implementation deliberately simple and SaaS-standard.

No implementation.
No migration.
No commit.
