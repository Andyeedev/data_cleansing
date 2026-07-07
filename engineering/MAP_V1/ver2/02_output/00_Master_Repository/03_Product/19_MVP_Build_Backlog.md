# MVP-07 – MVP Build Backlog

## Migration Assurance Platform (MAP)

Version 1.0
Status: Complete

---

# Purpose

This document defines the complete MVP build backlog for the Migration Assurance Platform (MAP).

It translates the approved MAP planning artefacts (MVP-01 through MVP-06) into an executable backlog of Epics, Features, User Stories, Acceptance Criteria, Story Point Estimates, Release Mapping, and Sprint Mapping.

The backlog is formatted for direct import into Azure DevOps.

This backlog integrates with the Delivery Planning artefacts (DP-01 through DP-12) to ensure alignment with sprint capacity, team structure, test strategy, DevOps pipeline, and operational transition plans.

---

# Delivery Planning Alignment (DP-01 through DP-12)

This backlog is aligned with the following Delivery Planning documents:

| Document | Alignment |
|----------|-----------|
| DP-01 Delivery Strategy & Approach | Sprint cadence, governance model |
| DP-02 Agile Delivery Framework | Ceremonies, estimation, DoR/DoD |
| DP-03 Delivery Team Structure | Team roles, domain ownership |
| DP-04 Sprint Planning Model | Sprint timing, capacity calculation |
| DP-05 Product Backlog & Release Plan | Backlog hierarchy, dependency tracking |
| DP-06 Resource & Capacity Plan | Velocity targets, capacity allocation |
| DP-07 Test Strategy & Quality Plan | Test pyramid, quality gates |
| DP-08 DevOps & Release Management | CI/CD pipeline, branching model |
| DP-09 Environment & Deployment | DEV/TEST/UAT/PROD topology |
| DP-10 Go-Live Readiness | Go/No-Go criteria, hypercare |
| DP-11 Operational Transition | Knowledge transfer, support handover |
| DP-12 Delivery Review & Sign-off | Governance gates, delivery scorecard |

---

# Backlog Vision

> The MAP MVP backlog transforms strategic product definitions into delivery-ready work items, enabling rapid, governed, and traceable execution through Azure DevOps.

---

# Backlog Structure

The backlog follows a four-level hierarchy:

```text
Epic
  └── Feature
        └── User Story
              └── Task
```

| Level | Count | Description |
| ----- | ----- | ----------- |
| Epic | 6 | One per platform domain |
| Feature | 30 | MVP features from MVP-02 |
| User Story | ~120 | Implementation stories per feature |
| Task | ~360 | Technical tasks per story |

---

# User Story Format

All user stories follow the standard format:

```text
As a <user persona>
I want <capability>
So that <benefit>
```

Acceptance Criteria use Given/When/Then format:

```text
Given <context>
When <action>
Then <outcome>
```

---

# Story Point Scale

| Points | Description |
| ------ | ----------- |
| 1 | Trivial — few hours |
| 2 | Small — half day |
| 3 | Medium — 1 day |
| 5 | Large — 2-3 days |
| 8 | Very Large — 4-5 days |
| 13 | Epic-sized — needs further breakdown |

---

# Priority Model

| Priority | Description |
| -------- | ----------- |
| P1 | Critical — must have for MVP |
| P2 | High — should have for MVP |
| P3 | Medium — nice to have, defer if needed |
| P4 | Low — future release |

---

# Definition of Done

Every user story must meet the following criteria before being accepted as complete:

| # | Criterion |
|---|-----------|
| 1 | Code complete and peer reviewed |
| 2 | Unit tests written and passing |
| 3 | Integration tests written and passing |
| 4 | No P1/P2 defects open |
| 5 | Acceptance criteria verified |
| 6 | Documentation updated |
| 7 | Security scan passed |
| 8 | Deployed to test environment |
| 9 | Product Owner accepted |

---

# Personas (from MVP-04)

| ID | Persona | Role |
| ---- | ------- | ---- |
| P01 | Programme Manager | Programme oversight, dashboard monitoring |
| P02 | Business Analyst | Mapping, validation, reporting |
| P03 | Data Analyst | Data profiling, schema analysis |
| P04 | Governance Lead | Approval workflows, audit, compliance |
| P05 | Executive Stakeholder | Executive dashboards, KPIs |
| P06 | Platform Administrator | System config, user management |

---

# Release Strategy (from MVP-01)

| Release | Scope | Timeline |
| ------- | ----- | -------- |
| R1 | MVP — 30 features | Sprint 1-12 |
| R2 | Enhanced Mapping & Validation | Post-MVP |
| R3 | AI Integration & Advanced Governance | Post-R2 |
| R4 | Enterprise Scale & Marketplace | Post-R3 |

---

# Epic Register

| Epic ID | Domain | Epic Name | Description | Features | Total Story Points |
| ------- | ------ | --------- | ----------- | -------- | ------------------ |
| E-01 | Discovery | Legacy System Discovery | Discover, register, and analyse legacy systems | 5 | ~45 |
| E-02 | Mapping | Data Mapping & Transformation | Create, manage, and approve data mappings | 5 | ~50 |
| E-03 | Validation | Migration Validation | Define and execute validation rules, manage defects | 5 | ~48 |
| E-04 | Governance | Programme Governance | Approval workflows, audit trails, compliance | 5 | ~42 |
| E-05 | Reporting | Dashboards & Reporting | Executive, programme, and operational dashboards | 5 | ~38 |
| E-06 | Administration | Platform Administration | Users, roles, permissions, configuration | 5 | ~35 |
| | | | **Total** | **30** | **~258** |

---

# Feature Register

| Feature ID | Domain | Feature Name | Priority | MVP | Release | Est. Points |
| ---------- | ------ | ------------ | -------- | --- | ------- | ----------- |
| F-D-01 | Discovery | System Registration | P1 | Yes | R1 | 8 |
| F-D-02 | Discovery | Database Connection | P1 | Yes | R1 | 13 |
| F-D-03 | Discovery | Schema Discovery | P1 | Yes | R1 | 13 |
| F-D-04 | Discovery | Dependency Mapping | P2 | Yes | R1 | 5 |
| F-D-05 | Discovery | Data Profiling | P2 | Yes | R1 | 5 |
| F-M-01 | Mapping | Mapping Specification | P1 | Yes | R1 | 8 |
| F-M-02 | Mapping | Transformation Rules | P1 | Yes | R1 | 8 |
| F-M-03 | Mapping | Mapping Versioning | P1 | Yes | R1 | 5 |
| F-M-04 | Mapping | Mapping Approval | P2 | Yes | R1 | 8 |
| F-M-05 | Mapping | Mapping Comparison | P3 | No | R2 | 5 |
| F-V-01 | Validation | Validation Rules | P1 | Yes | R1 | 8 |
| F-V-02 | Validation | Validation Execution | P1 | Yes | R1 | 13 |
| F-V-03 | Validation | Defect Management | P1 | Yes | R1 | 8 |
| F-V-04 | Validation | Validation Reporting | P2 | Yes | R1 | 5 |
| F-V-05 | Validation | Automated Validation | P3 | No | R2 | 5 |
| F-G-01 | Governance | Approval Workflows | P1 | Yes | R1 | 8 |
| F-G-02 | Governance | Audit Trail | P1 | Yes | R1 | 5 |
| F-G-03 | Governance | Evidence Management | P2 | Yes | R1 | 5 |
| F-G-04 | Governance | Compliance Dashboard | P2 | Yes | R1 | 5 |
| F-G-05 | Governance | Policy Engine | P3 | No | R3 | 5 |
| F-R-01 | Reporting | Executive Dashboard | P1 | Yes | R1 | 8 |
| F-R-02 | Reporting | Programme Dashboard | P1 | Yes | R1 | 5 |
| F-R-03 | Reporting | Operational Dashboard | P2 | Yes | R1 | 5 |
| F-R-04 | Reporting | Custom Reports | P3 | No | R2 | 5 |
| F-R-05 | Reporting | Export Capabilities | P3 | No | R2 | 3 |
| F-A-01 | Administration | User Management | P1 | Yes | R1 | 5 |
| F-A-02 | Administration | Role Management | P1 | Yes | R1 | 5 |
| F-A-03 | Administration | Permission Management | P1 | Yes | R1 | 8 |
| F-A-04 | Administration | System Configuration | P2 | Yes | R1 | 5 |
| F-A-05 | Administration | Tenant Management | P3 | No | R4 | 5 |

---

# Domain 1 — Discovery (E-01)

## US-D-001: Register Legacy System
**Feature:** F-D-01 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 1
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to register a legacy system in the platform
So that I can begin the discovery and assessment process

**Acceptance Criteria:**
- Given I am on the Discovery dashboard, when I click "Register System", then a registration form is displayed
- Given I complete the form with system name, type, and owner, when I submit, then the system is created with status "Registered"
- Given I register a system with a duplicate name, when I submit, then an error message is displayed
- Given I register a system, when I view the system list, then the new system appears in the list

---

## US-D-002: Edit Legacy System Details
**Feature:** F-D-01 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 1
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to edit the details of a registered legacy system
So that I can keep system information accurate and up to date

**Acceptance Criteria:**
- Given I am viewing a system detail page, when I click "Edit", then the form becomes editable
- Given I modify system details and save, when the save succeeds, then an audit record is created
- Given I modify system details and cancel, when I confirm cancellation, then changes are discarded

---

## US-D-003: View System List
**Feature:** F-D-01 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 1
**Persona:** P01 (Programme Manager)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Programme Manager
I want to view a list of all registered legacy systems
So that I can understand the scope of the migration programme

**Acceptance Criteria:**
- Given I navigate to the System List, when the page loads, then all registered systems are displayed in a table
- Given the list contains more than 20 systems, when I view the list, then pagination is displayed
- Given I use the search filter, when I enter a system name, then the list is filtered to matching systems

---

## US-D-004: View System Detail
**Feature:** F-D-01 | **Priority:** P1 | **Points:** 2 | **Release:** R1 | **Sprint:** 2
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to view the detailed information of a registered system
So that I can understand its characteristics before discovery

**Acceptance Criteria:**
- Given I am on the System List, when I click a system name, then the system detail page is displayed
- Given I am on the System Detail page, when I view the page, then system metadata, status, and discovery history are shown

---

## US-D-005: Configure Database Connection
**Feature:** F-D-02 | **Priority:** P1 | **Points:** 8 | **Release:** R1 | **Sprint:** 2
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to configure a database connection for a legacy system
So that the platform can connect to and analyse the source database

**Acceptance Criteria:**
- Given I am on a system detail page, when I click "Configure Connection", then a connection form is displayed
- Given I enter connection details (host, port, database, credentials), when I click "Test Connection", then the connection is validated
- Given the connection test succeeds, when I save the connection, then it is stored encrypted in Azure Key Vault
- Given the connection test fails, when I view the result, then an error message with details is displayed
- Given I save a connection, when I view the system detail, then the connection status shows "Configured"

---

## US-D-006: Test Database Connection
**Feature:** F-D-02 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 2
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to test a database connection before running discovery
So that I can verify connectivity without running a full discovery

**Acceptance Criteria:**
- Given I have a configured connection, when I click "Test Connection", then a connectivity test is performed
- Given the test succeeds, when I view the result, then a success message with server version is displayed
- Given the test fails, when I view the result, then an error with failure reason is displayed

---

## US-D-007: Run Schema Discovery
**Feature:** F-D-03 | **Priority:** P1 | **Points:** 8 | **Release:** R1 | **Sprint:** 3
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to run automated schema discovery on a connected database
So that I can extract metadata without manual documentation

**Acceptance Criteria:**
- Given I have a validated connection, when I click "Run Discovery", then a discovery job is initiated
- Given a discovery job is running, when I view the system detail, then the status shows "Discovery In Progress"
- Given discovery completes successfully, when I view the results, then tables, columns, relationships, and data types are displayed
- Given discovery fails, when I view the results, then an error log is available

---

## US-D-008: View Discovery Results
**Feature:** F-D-03 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 3
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to view the results of schema discovery
So that I can review the extracted metadata

**Acceptance Criteria:**
- Given discovery has completed, when I view the results, then a summary showing table count, column count, and relationship count is displayed
- Given I am viewing discovery results, when I click on a table name, then column details are shown
- Given I am viewing discovery results, when I export the results, then a CSV file is downloaded

---

## US-D-009: Map System Dependencies
**Feature:** F-D-04 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 4
**Persona:** P02 (Business Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Business Analyst
I want to map dependencies between legacy systems
So that I can understand system coupling and migration sequencing

**Acceptance Criteria:**
- Given I am on a system detail page, when I click "Map Dependencies", then a dependency mapping interface is displayed
- Given I select related systems and define the dependency type, when I save, then the dependency is recorded
- Given I view the dependency map, when the map loads, then a visual dependency graph is displayed

---

## US-D-010: Run Data Profiling
**Feature:** F-D-05 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 4
**Persona:** P03 (Data Analyst)
**Business Value:** Enables migration teams to understand legacy system scope and dependencies before migration begins, reducing discovery risk.

As a Data Analyst
I want to run data profiling on discovered tables
So that I can understand data characteristics and quality

**Acceptance Criteria:**
- Given I have discovery results, when I select a table and click "Profile Data", then a profiling job runs
- Given profiling completes, when I view results, then row count, null percentages, distinct values, and data distribution are shown
- Given profiling is in progress, when I view the table, then a progress indicator is displayed

---

# Domain 2 — Mapping (E-02)

## US-M-001: Create Mapping Specification
**Feature:** F-M-01 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 5
**Persona:** P02 (Business Analyst)
**Business Value:** Provides structured, version-controlled data mappings that ensure transformation accuracy and audit readiness.

As a Business Analyst
I want to create a mapping specification between source and target fields
So that I can define how data migrates from legacy to modern systems

**Acceptance Criteria:**
- Given I am on the Mapping dashboard, when I click "Create Mapping", then a mapping creation form is displayed
- Given I select source and target fields, when I save the mapping, then it is created with status "Draft"
- Given I create a mapping without selecting both fields, when I save, then a validation error is displayed

---

## US-M-002: Edit Mapping Specification
**Feature:** F-M-01 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 5
**Persona:** P02 (Business Analyst)
**Business Value:** Provides structured, version-controlled data mappings that ensure transformation accuracy and audit readiness.

As a Business Analyst
I want to edit an existing mapping specification
So that I can refine mappings based on analysis

**Acceptance Criteria:**
- Given I am viewing a mapping, when I click "Edit", then the mapping form becomes editable
- Given I save changes to a mapping, when the save succeeds, then a new version is created

---

## US-M-003: Define Transformation Rules
**Feature:** F-M-02 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 5
**Persona:** P02 (Business Analyst)
**Business Value:** Provides structured, version-controlled data mappings that ensure transformation accuracy and audit readiness.

As a Business Analyst
I want to define transformation rules for data mappings
So that data is correctly transformed during migration

**Acceptance Criteria:**
- Given I am editing a mapping, when I click "Add Transformation", then a rule editor is displayed
- Given I define a transformation rule (type, expression, parameters), when I save, then the rule is attached to the mapping
- Given I define multiple rules, when I view the mapping, then rules are listed in execution order

---

## US-M-004: Version Control Mappings
**Feature:** F-M-03 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 6
**Persona:** P02 (Business Analyst)
**Business Value:** Provides structured, version-controlled data mappings that ensure transformation accuracy and audit readiness.

As a Business Analyst
I want mappings to be version-controlled
So that I can track changes and revert if needed

**Acceptance Criteria:**
- Given I modify a mapping, when the change is saved, then a new version number is assigned
- Given I am viewing a mapping, when I click "Version History", then all previous versions are listed
- Given I select a previous version, when I click "Restore", then the mapping is restored to that version

---

## US-M-005: Submit Mapping for Approval
**Feature:** F-M-04 | **Priority:** P2 | **Points:** 5 | **Release:** R1 | **Sprint:** 6
**Persona:** P02 (Business Analyst)
**Business Value:** Provides structured, version-controlled data mappings that ensure transformation accuracy and audit readiness.

As a Business Analyst
I want to submit a mapping for approval
So that mappings are reviewed before migration

**Acceptance Criteria:**
- Given I have completed a mapping, when I click "Submit for Approval", then the mapping status changes to "Pending Approval"
- Given I submit a mapping with incomplete required fields, when I submit, then a validation error prevents submission
- Given a mapping is submitted, when the approver views their queue, then the mapping appears in their pending list

---

## US-M-006: Approve or Reject Mapping
**Feature:** F-M-04 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 6
**Persona:** P04 (Governance Lead)
**Business Value:** Provides structured, version-controlled data mappings that ensure transformation accuracy and audit readiness.

As a Governance Lead
I want to approve or reject mapping submissions
So that only validated mappings proceed to migration

**Acceptance Criteria:**
- Given I am reviewing a pending mapping, when I click "Approve", then the mapping status changes to "Approved"
- Given I am reviewing a pending mapping, when I click "Reject" and provide a reason, then the status changes to "Rejected"
- Given a mapping is approved, when the Business Analyst views it, then a read-only approved state is shown

---

# Domain 3 — Validation (E-03)

## US-V-001: Create Validation Rule
**Feature:** F-V-01 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 7
**Persona:** P02 (Business Analyst)
**Business Value:** Automates validation to replace manual sampling, ensuring 100% record coverage and reducing migration defects.

As a Business Analyst
I want to create validation rules for migration data
So that I can ensure data quality during migration

**Acceptance Criteria:**
- Given I am on the Validation dashboard, when I click "Create Rule", then a rule creation form is displayed
- Given I define rule criteria (type, expression, severity), when I save, then the rule is created with status "Active"
- Given I create a rule without required fields, when I save, then a validation error is displayed

---

## US-V-002: Edit Validation Rule
**Feature:** F-V-01 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 7
**Persona:** P02 (Business Analyst)
**Business Value:** Automates validation to replace manual sampling, ensuring 100% record coverage and reducing migration defects.

As a Business Analyst
I want to edit an existing validation rule
So that I can refine validation criteria

**Acceptance Criteria:**
- Given I am viewing a rule, when I click "Edit", then the rule form becomes editable
- Given I save changes, when the save succeeds, then an audit record is created

---

## US-V-003: Execute Validation Run
**Feature:** F-V-02 | **Priority:** P1 | **Points:** 8 | **Release:** R1 | **Sprint:** 7
**Persona:** P02 (Business Analyst)
**Business Value:** Automates validation to replace manual sampling, ensuring 100% record coverage and reducing migration defects.

As a Business Analyst
I want to execute a validation run against migration data
So that I can identify data quality issues

**Acceptance Criteria:**
- Given I have active validation rules, when I click "Run Validation", then a validation job is initiated
- Given a validation run is in progress, when I view the dashboard, then a progress indicator is shown
- Given validation completes, when I view results, then pass/fail counts and detail list are displayed
- Given validation fails for critical rules, when results are available, then a notification is sent to the Governance Lead

---

## US-V-004: View Validation Results
**Feature:** F-V-02 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 8
**Persona:** P02 (Business Analyst)
**Business Value:** Automates validation to replace manual sampling, ensuring 100% record coverage and reducing migration defects.

As a Business Analyst
I want to view detailed validation results
So that I can analyse data quality issues

**Acceptance Criteria:**
- Given validation has completed, when I view results, then a summary with pass/fail/warning counts is shown
- Given I click on a failed rule, when the detail loads, then affected records are listed
- Given I export results, when I click "Export", then a CSV file is downloaded

---

## US-V-005: Log Validation Defect
**Feature:** F-V-03 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 8
**Persona:** P02 (Business Analyst)
**Business Value:** Automates validation to replace manual sampling, ensuring 100% record coverage and reducing migration defects.

As a Business Analyst
I want to log a defect when validation fails
So that issues are tracked and resolved before migration

**Acceptance Criteria:**
- Given I am viewing a validation failure, when I click "Log Defect", then a defect form is pre-populated with rule and record details
- Given I complete the defect form and save, when the save succeeds, then the defect is created with status "Open"
- Given a defect is logged, when the Governance Lead views the defect list, then the defect appears in their queue

---

## US-V-006: Manage Defect Lifecycle
**Feature:** F-V-03 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 8
**Persona:** P04 (Governance Lead)
**Business Value:** Automates validation to replace manual sampling, ensuring 100% record coverage and reducing migration defects.

As a Governance Lead
I want to manage the defect lifecycle from open to resolved
So that all validation issues are tracked to closure

**Acceptance Criteria:**
- Given I am viewing an open defect, when I click "Assign", then I can assign it to a team member
- Given a defect is assigned, when the assignee updates status, then the status changes to "In Progress" or "Resolved"
- Given a defect is resolved, when I verify the fix, then I can close the defect

---

## US-V-007: Generate Validation Report
**Feature:** F-V-04 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 9
**Persona:** P01 (Programme Manager)
**Business Value:** Automates validation to replace manual sampling, ensuring 100% record coverage and reducing migration defects.

As a Programme Manager
I want to generate a validation report
So that I can communicate validation status to stakeholders

**Acceptance Criteria:**
- Given I am on the Validation dashboard, when I click "Generate Report", then a report is generated
- Given the report is generated, when I view it, then summary, detail, and trend sections are included
- Given I export the report, when I click "Export PDF", then a PDF file is downloaded

---

# Domain 4 — Governance (E-04)

## US-G-001: Create Approval Workflow
**Feature:** F-G-01 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 9
**Persona:** P04 (Governance Lead)
**Business Value:** Establishes approval workflows and audit trails that satisfy regulatory requirements and enable compliance reporting.

As a Governance Lead
I want to create multi-stage approval workflows
So that governance processes are consistently followed

**Acceptance Criteria:**
- Given I am on the Governance dashboard, when I click "Create Workflow", then a workflow builder is displayed
- Given I define stages, approvers, and criteria, when I save, then the workflow is created with status "Active"
- Given I create a workflow with no approvers, when I save, then a validation error is displayed

---

## US-G-002: Execute Approval Workflow
**Feature:** F-G-01 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 9
**Persona:** P04 (Governance Lead)
**Business Value:** Establishes approval workflows and audit trails that satisfy regulatory requirements and enable compliance reporting.

As a Governance Lead
I want approval workflows to execute automatically when items are submitted
So that governance is enforced without manual intervention

**Acceptance Criteria:**
- Given an item is submitted for approval, when the workflow triggers, then the first approver is notified
- Given an approver approves, when the approval is recorded, then the next stage is triggered
- Given all stages are approved, when the workflow completes, then the item status is updated to "Approved"

---

## US-G-003: View Audit Trail
**Feature:** F-G-02 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 10
**Persona:** P04 (Governance Lead)
**Business Value:** Establishes approval workflows and audit trails that satisfy regulatory requirements and enable compliance reporting.

As a Governance Lead
I want to view a complete audit trail of all system activities
So that I can demonstrate compliance and traceability

**Acceptance Criteria:**
- Given I navigate to the Audit Trail, when the page loads, then all audit records are displayed in chronological order
- Given I use the filter, when I select date range, user, or action type, then the audit list is filtered
- Given I export audit records, when I click "Export", then a CSV file is downloaded

---

## US-G-004: Upload Evidence
**Feature:** F-G-03 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 10
**Persona:** P04 (Governance Lead)
**Business Value:** Establishes approval workflows and audit trails that satisfy regulatory requirements and enable compliance reporting.

As a Governance Lead
I want to upload and manage evidence documents
So that governance artefacts are centrally stored

**Acceptance Criteria:**
- Given I am on the Evidence page, when I click "Upload", then a file upload dialog is displayed
- Given I select a file and upload, when the upload completes, then the evidence record is created
- Given I view evidence, when I click a file, then the file is previewed or downloaded

---

## US-G-005: View Compliance Dashboard
**Feature:** F-G-04 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 10
**Persona:** P05 (Executive Stakeholder)
**Business Value:** Establishes approval workflows and audit trails that satisfy regulatory requirements and enable compliance reporting.

As an Executive Stakeholder
I want to view a compliance dashboard
So that I can assess governance compliance at a glance

**Acceptance Criteria:**
- Given I navigate to the Compliance Dashboard, when the page loads, then compliance metrics are displayed
- Given I view the dashboard, when I see the data, then approval status, audit coverage, and defect trends are shown
- Given I drill into a metric, when I click on it, then detailed records are displayed

---

# Domain 5 — Reporting (E-05)

## US-R-001: View Executive Dashboard
**Feature:** F-R-01 | **Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 11
**Persona:** P05 (Executive Stakeholder)
**Business Value:** Delivers real-time dashboards that give stakeholders visibility into migration progress, quality, and risk.

As an Executive Stakeholder
I want to view an executive dashboard with key programme metrics
So that I can make informed decisions about the migration programme

**Acceptance Criteria:**
- Given I navigate to the Executive Dashboard, when the page loads, then KPIs, progress charts, and risk indicators are displayed
- Given I view the dashboard, when data is stale, then a "Last updated" timestamp is shown
- Given I click on a KPI, when the detail loads, then underlying data is displayed

---

## US-R-002: View Programme Dashboard
**Feature:** F-R-02 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 11
**Persona:** P01 (Programme Manager)
**Business Value:** Delivers real-time dashboards that give stakeholders visibility into migration progress, quality, and risk.

As a Programme Manager
I want to view a programme dashboard with delivery progress
So that I can track sprint completion, velocity, and milestones

**Acceptance Criteria:**
- Given I navigate to the Programme Dashboard, when the page loads, then sprint progress, velocity chart, and milestone timeline are displayed
- Given I filter by date range, when the filter is applied, then the dashboard updates to show the selected period

---

## US-R-003: View Operational Dashboard
**Feature:** F-R-03 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 11
**Persona:** P02 (Business Analyst)
**Business Value:** Delivers real-time dashboards that give stakeholders visibility into migration progress, quality, and risk.

As a Business Analyst
I want to view an operational dashboard with day-to-day activity
So that I can monitor my work items and progress

**Acceptance Criteria:**
- Given I navigate to the Operational Dashboard, when the page loads, then my assigned items, recent activity, and task status are displayed
- Given I click on a work item, when the detail loads, then I can update its status

---

# Domain 6 — Administration (E-06)

## US-A-001: Create User Account
**Feature:** F-A-01 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 12
**Persona:** P06 (Platform Administrator)
**Business Value:** Provides secure user and role management that supports enterprise access control and audit requirements.

As a Platform Administrator
I want to create user accounts
So that team members can access the platform

**Acceptance Criteria:**
- Given I am on the User Management page, when I click "Create User", then a user creation form is displayed
- Given I enter user details and assign a role, when I save, then the user account is created
- Given I create a user with a duplicate email, when I save, then an error message is displayed

---

## US-A-002: Edit User Account
**Feature:** F-A-01 | **Priority:** P1 | **Points:** 2 | **Release:** R1 | **Sprint:** 12
**Persona:** P06 (Platform Administrator)
**Business Value:** Provides secure user and role management that supports enterprise access control and audit requirements.

As a Platform Administrator
I want to edit user account details
So that user information remains accurate

**Acceptance Criteria:**
- Given I am viewing a user, when I click "Edit", then the user form becomes editable
- Given I save changes, when the save succeeds, then an audit record is created

---

## US-A-003: Deactivate User Account
**Feature:** F-A-01 | **Priority:** P1 | **Points:** 2 | **Release:** R1 | **Sprint:** 12
**Persona:** P06 (Platform Administrator)
**Business Value:** Provides secure user and role management that supports enterprise access control and audit requirements.

As a Platform Administrator
I want to deactivate a user account
So that former team members can no longer access the platform

**Acceptance Criteria:**
- Given I am viewing an active user, when I click "Deactivate", then a confirmation prompt is displayed
- Given I confirm deactivation, when the action completes, then the user status changes to "Inactive"
- Given a user is deactivated, when they attempt to log in, then access is denied

---

## US-A-004: Create Role
**Feature:** F-A-02 | **Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 12
**Persona:** P06 (Platform Administrator)
**Business Value:** Provides secure user and role management that supports enterprise access control and audit requirements.

As a Platform Administrator
I want to create custom roles
So that access control can be tailored to organisational needs

**Acceptance Criteria:**
- Given I am on the Role Management page, when I click "Create Role", then a role creation form is displayed
- Given I define role name and permissions, when I save, then the role is created
- Given I create a role with a duplicate name, when I save, then an error message is displayed

---

## US-A-005: Assign Role to User
**Feature:** F-A-02 | **Priority:** P1 | **Points:** 2 | **Release:** R1 | **Sprint:** 12
**Persona:** P06 (Platform Administrator)
**Business Value:** Provides secure user and role management that supports enterprise access control and audit requirements.

As a Platform Administrator
I want to assign roles to users
So that users have appropriate access permissions

**Acceptance Criteria:**
- Given I am viewing a user, when I click "Assign Role", then available roles are listed
- Given I select a role and save, when the save succeeds, then the user's permissions are updated
- Given a role is assigned, when the user logs in, then they see only features permitted by their role

---

## US-A-006: Configure Platform Settings
**Feature:** F-A-04 | **Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 12
**Persona:** P06 (Platform Administrator)
**Business Value:** Provides secure user and role management that supports enterprise access control and audit requirements.

As a Platform Administrator
I want to configure platform settings
So that the platform behaves according to organisational requirements

**Acceptance Criteria:**
- Given I am on the Configuration page, when I view settings, then current configuration values are displayed
- Given I modify a setting and save, when the save succeeds, then the change is applied and audited
- Given I modify a critical setting, when I save, then a confirmation prompt is displayed

---

# Non-Functional User Stories

## US-NFR-001: API Performance
**Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 4

As a platform user
I want API responses to complete within 500 milliseconds
So that the platform feels responsive

**Acceptance Criteria:**
- Given the platform is running, when any API endpoint is called, then the response time is less than 500ms for the 95th percentile
- Given load testing is performed, when 100 concurrent users access the platform, then response times remain within threshold

---

## US-NFR-002: Dashboard Load Time
**Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 9

As a platform user
I want dashboards to load within 3 seconds
So that I can quickly access information

**Acceptance Criteria:**
- Given I navigate to any dashboard, when the page loads, then full render completes within 3 seconds
- Given I am on a dashboard, when data refreshes, then the update completes within 2 seconds

---

## US-NFR-003: Authentication
**Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 1

As a platform user
I want to authenticate using Microsoft Entra ID
So that I can use single sign-on and enterprise identity

**Acceptance Criteria:**
- Given I navigate to the platform, when I am not authenticated, then I am redirected to Microsoft Entra ID login
- Given I complete Entra ID authentication, when the token is validated, then I am granted access based on my role
- Given my session expires, when I attempt an action, then I am redirected to re-authenticate

---

## US-NFR-004: Role-Based Access Control
**Priority:** P1 | **Points:** 5 | **Release:** R1 | **Sprint:** 2

As a platform user
I want access to be controlled by my assigned role
So that I can only see and do what my role permits

**Acceptance Criteria:**
- Given I am authenticated, when I access a feature, then the system checks my role permissions
- Given I attempt to access a feature not in my role, when the check fails, then access is denied with a clear message
- Given I am a Programme Manager, when I view the platform, then all dashboards and management features are visible
- Given I am a Business Analyst, when I view the platform, then only mapping, validation, and reporting features are visible

---

## US-NFR-005: Audit Logging
**Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 3

As a Governance Lead
I want all user actions to be logged in an audit trail
So that compliance and traceability are maintained

**Acceptance Criteria:**
- Given a user performs any create, update, or delete action, when the action completes, then an audit record is created with user, timestamp, action, and affected entity
- Given I view the audit trail, when records are displayed, then they are immutable and cannot be edited or deleted

---

## US-NFR-006: Data Encryption
**Priority:** P1 | **Points:** 3 | **Release:** R1 | **Sprint:** 1

As a security administrator
I want data encrypted at rest and in transit
So that sensitive data is protected

**Acceptance Criteria:**
- Given the platform stores data, when data is written to Azure SQL or Cosmos DB, then encryption at rest is enabled
- Given data is transmitted, when any API call is made, then TLS 1.2+ is enforced
- Given credentials are stored, when saved to Key Vault, then they are encrypted with customer-managed keys

---

## US-NFR-007: Accessibility Compliance
**Priority:** P2 | **Points:** 5 | **Release:** R1 | **Sprint:** 10

As a platform user
I want the platform to meet WCAG 2.2 AA standards
So that the platform is accessible to all users

**Acceptance Criteria:**
- Given I use a screen reader, when I navigate the platform, then all content is accessible
- Given I use keyboard-only navigation, when I interact with forms and dashboards, then all elements are reachable
- Given I view the platform, when colour contrast is measured, then it meets AA contrast ratios

---

## US-NFR-008: Scalability
**Priority:** P2 | **Points:** 3 | **Release:** R1 | **Sprint:** 6

As a platform operator
I want the platform to support 100 concurrent users in MVP
So that the platform serves the target user base

**Acceptance Criteria:**
- Given load testing with 100 concurrent users, when the test completes, then all response times are within NFR thresholds
- Given Azure Container Apps scaling, when CPU exceeds 70%, then additional instances are automatically provisioned

---

# Acceptance Summary

| Domain | Stories | Total Points |
| ------ | ------- | ------------ |
| Discovery | 10 | ~50 |
| Mapping | 6 | ~30 |
| Validation | 7 | ~38 |
| Governance | 5 | ~17 |
| Reporting | 3 | ~11 |
| Administration | 6 | ~15 |
| Non-Functional | 8 | ~32 |
| **Total** | **45** | **~193** |

---

# Sprint Mapping

The MVP R1 delivery spans 12 sprints (24 weeks). Stories are allocated based on priority, dependencies, and domain alignment.

## Sprint Plan Overview

| Sprint | Duration | Focus Domain | Stories | Velocity Target |
| ------ | -------- | ------------ | ------- | --------------- |
| Sprint 1 | Weeks 1-2 | Infrastructure & Discovery | US-D-001, US-D-002, US-D-003, US-NFR-003, US-NFR-006 | 21 |
| Sprint 2 | Weeks 3-4 | Discovery & Access | US-D-004, US-D-005, US-D-006, US-NFR-004 | 21 |
| Sprint 3 | Weeks 5-6 | Discovery & Audit | US-D-007, US-D-008, US-NFR-005 | 21 |
| Sprint 4 | Weeks 7-8 | Discovery & Performance | US-D-009, US-D-010, US-NFR-001, US-NFR-008 | 21 |
| Sprint 5 | Weeks 9-10 | Mapping | US-M-001, US-M-002, US-M-003 | 21 |
| Sprint 6 | Weeks 11-12 | Mapping & Versioning | US-M-004, US-M-005, US-M-006 | 21 |
| Sprint 7 | Weeks 13-14 | Validation | US-V-001, US-V-002, US-V-003 | 21 |
| Sprint 8 | Weeks 15-16 | Validation & Defects | US-V-004, US-V-005, US-V-006 | 21 |
| Sprint 9 | Weeks 17-18 | Governance & Reporting | US-G-001, US-G-002, US-R-001, US-R-002, US-R-003, US-NFR-002 | 21 |
| Sprint 10 | Weeks 19-20 | Governance & Accessibility | US-G-003, US-G-004, US-G-005, US-V-007, US-NFR-007 | 21 |
| Sprint 11 | Weeks 21-22 | Reporting & Integration | Integration testing, bug fixes | 21 |
| Sprint 12 | Weeks 23-24 | Administration & Hardening | US-A-001, US-A-002, US-A-003, US-A-004, US-A-005, US-A-006, UAT, Security hardening | 21 |

## Sprint Detail — Sprint 1

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-D-001 | Register Legacy System | 5 | P03 | Discovery |
| US-D-002 | Edit Legacy System Details | 3 | P03 | Discovery |
| US-D-003 | View System List | 3 | P01 | Discovery |
| US-NFR-003 | Authentication (Entra ID) | 5 | All | Platform |
| US-NFR-006 | Data Encryption | 3 | All | Platform |
| **Total** | | **19** | | |

## Sprint Detail — Sprint 2

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-D-004 | View System Detail | 2 | P03 | Discovery |
| US-D-005 | Configure Database Connection | 8 | P03 | Discovery |
| US-D-006 | Test Database Connection | 3 | P03 | Discovery |
| US-NFR-004 | Role-Based Access Control | 5 | All | Platform |
| **Total** | | **18** | | |

## Sprint Detail — Sprint 3

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-D-007 | Run Schema Discovery | 8 | P03 | Discovery |
| US-D-008 | View Discovery Results | 5 | P03 | Discovery |
| US-NFR-005 | Audit Logging | 3 | P04 | Platform |
| **Total** | | **16** | | |

## Sprint Detail — Sprint 4

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-D-009 | Map System Dependencies | 3 | P02 | Discovery |
| US-D-010 | Run Data Profiling | 3 | P03 | Discovery |
| US-NFR-001 | API Performance | 5 | All | Platform |
| US-NFR-008 | Scalability | 3 | All | Platform |
| **Total** | | **14** | | |

## Sprint Detail — Sprint 5

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-M-001 | Create Mapping Specification | 5 | P02 | Mapping |
| US-M-002 | Edit Mapping Specification | 3 | P02 | Mapping |
| US-M-003 | Define Transformation Rules | 5 | P02 | Mapping |
| **Total** | | **13** | | |

## Sprint Detail — Sprint 6

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-M-004 | Version Control Mappings | 3 | P02 | Mapping |
| US-M-005 | Submit Mapping for Approval | 5 | P02 | Mapping |
| US-M-006 | Approve or Reject Mapping | 3 | P04 | Mapping |
| **Total** | | **11** | | |

## Sprint Detail — Sprint 7

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-V-001 | Create Validation Rule | 5 | P02 | Validation |
| US-V-002 | Edit Validation Rule | 3 | P02 | Validation |
| US-V-003 | Execute Validation Run | 8 | P02 | Validation |
| **Total** | | **16** | | |

## Sprint Detail — Sprint 8

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-V-004 | View Validation Results | 5 | P02 | Validation |
| US-V-005 | Log Validation Defect | 5 | P02 | Validation |
| US-V-006 | Manage Defect Lifecycle | 3 | P04 | Validation |
| **Total** | | **13** | | |

## Sprint Detail — Sprint 9

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-G-001 | Create Approval Workflow | 5 | P04 | Governance |
| US-G-002 | Execute Approval Workflow | 3 | P04 | Governance |
| US-R-001 | View Executive Dashboard | 5 | P05 | Reporting |
| US-R-002 | View Programme Dashboard | 3 | P01 | Reporting |
| US-R-003 | View Operational Dashboard | 3 | P02 | Reporting |
| US-NFR-002 | Dashboard Load Time | 3 | All | Platform |
| **Total** | | **22** | | |

## Sprint Detail — Sprint 10

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-G-003 | View Audit Trail | 3 | P04 | Governance |
| US-G-004 | Upload Evidence | 3 | P04 | Governance |
| US-G-005 | View Compliance Dashboard | 3 | P05 | Governance |
| US-V-007 | Generate Validation Report | 3 | P01 | Validation |
| US-NFR-007 | Accessibility Compliance | 5 | All | Platform |
| **Total** | | **17** | | |

## Sprint Detail — Sprint 11

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| — | Integration Testing | 5 | All | Cross-domain |
| — | Bug Fixes & Refinement | 5 | All | Cross-domain |
| — | Regression Testing | 3 | P02 | Testing |
| **Total** | | **13** | | |

## Sprint Detail — Sprint 12

| Story ID | Story Title | Points | Persona | Domain |
| -------- | ----------- | ------ | ------- | ------ |
| US-A-001 | Create User Account | 3 | P06 | Administration |
| US-A-002 | Edit User Account | 2 | P06 | Administration |
| US-A-003 | Deactivate User Account | 2 | P06 | Administration |
| US-A-004 | Create Role | 3 | P06 | Administration |
| US-A-005 | Assign Role to User | 2 | P06 | Administration |
| US-A-006 | Configure Platform Settings | 3 | P06 | Administration |
| — | UAT & Hardening | 5 | All | Cross-domain |
| **Total** | | **20** | | |

---

# Velocity & Burndown Forecast

## Velocity Targets

| Sprint | Planned Points | Cumulative |
| ------ | -------------- | ---------- |
| Sprint 1 | 19 | 19 |
| Sprint 2 | 18 | 37 |
| Sprint 3 | 16 | 53 |
| Sprint 4 | 14 | 67 |
| Sprint 5 | 13 | 80 |
| Sprint 6 | 11 | 91 |
| Sprint 7 | 16 | 107 |
| Sprint 8 | 13 | 120 |
| Sprint 9 | 22 | 142 |
| Sprint 10 | 17 | 159 |
| Sprint 11 | 13 | 172 |
| Sprint 12 | 20 | 192 |
| **Total** | **192** | |

## Burndown Target

The target burndown assumes consistent velocity of ~16 points per sprint with a total of 192 points across 12 sprints.

---

# Release Mapping

## Release 1 — MVP (Sprint 1-12)

| Feature ID | Feature Name | Stories | Points | Sprints |
| ---------- | ------------ | ------- | ------ | ------- |
| F-D-01 | System Registration | US-D-001, US-D-002, US-D-003, US-D-004 | 13 | 1-2 |
| F-D-02 | Database Connection | US-D-005, US-D-006 | 11 | 2 |
| F-D-03 | Schema Discovery | US-D-007, US-D-008 | 13 | 3 |
| F-D-04 | Dependency Mapping | US-D-009 | 3 | 4 |
| F-D-05 | Data Profiling | US-D-010 | 3 | 4 |
| F-M-01 | Mapping Specification | US-M-001, US-M-002 | 8 | 5 |
| F-M-02 | Transformation Rules | US-M-003 | 5 | 5 |
| F-M-03 | Mapping Versioning | US-M-004 | 3 | 6 |
| F-M-04 | Mapping Approval | US-M-005, US-M-006 | 8 | 6 |
| F-V-01 | Validation Rules | US-V-001, US-V-002 | 8 | 7 |
| F-V-02 | Validation Execution | US-V-003, US-V-004 | 13 | 7-8 |
| F-V-03 | Defect Management | US-V-005, US-V-006 | 8 | 8 |
| F-V-04 | Validation Reporting | US-V-007 | 3 | 10 |
| F-G-01 | Approval Workflows | US-G-001, US-G-002 | 8 | 9 |
| F-G-02 | Audit Trail | US-G-003 | 3 | 10 |
| F-G-03 | Evidence Management | US-G-004 | 3 | 10 |
| F-G-04 | Compliance Dashboard | US-G-005 | 3 | 10 |
| F-R-01 | Executive Dashboard | US-R-001 | 5 | 9 |
| F-R-02 | Programme Dashboard | US-R-002 | 3 | 9 |
| F-R-03 | Operational Dashboard | US-R-003 | 3 | 9 |
| F-A-01 | User Management | US-A-001, US-A-002, US-A-003 | 7 | 12 |
| F-A-02 | Role Management | US-A-004, US-A-005 | 5 | 12 |
| F-A-03 | Permission Management | (via US-NFR-004) | 5 | 2 |
| F-A-04 | System Configuration | US-A-006 | 3 | 12 |
| | **NFR Stories** | US-NFR-001 to US-NFR-008 | 32 | 1-10 |
| | **Total R1** | | **~192** | |

## Release 2 — Enhanced (Post-MVP)

| Feature ID | Feature Name | Est. Points |
| ---------- | ------------ | ----------- |
| F-M-05 | Mapping Comparison | 5 |
| F-V-05 | Automated Validation | 5 |
| F-R-04 | Custom Reports | 5 |
| F-R-05 | Export Capabilities | 3 |
| | Additional R2 features | ~22 |
| | **Total R2** | **~40** |

## Release 3 — AI & Governance (Post-R2)

| Feature ID | Feature Name | Est. Points |
| ---------- | ------------ | ----------- |
| F-G-05 | Policy Engine | 5 |
| | AI Copilot features | ~30 |
| | Advanced governance | ~15 |
| | **Total R3** | **~50** |

## Release 4 — Enterprise Scale (Post-R3)

| Feature ID | Feature Name | Est. Points |
| ---------- | ------------ | ----------- |
| F-A-05 | Tenant Management | 5 |
| | Multi-tenant SaaS | ~30 |
| | Marketplace integration | ~20 |
| | **Total R4** | **~55** |

---

# Dependency Map

## Feature Dependencies

| Feature | Depends On | Reason |
| ------- | ---------- | ------ |
| F-D-02 Database Connection | F-D-01 System Registration | Must register system before connecting |
| F-D-03 Schema Discovery | F-D-02 Database Connection | Must connect before discovering |
| F-D-04 Dependency Mapping | F-D-03 Schema Discovery | Must discover before mapping dependencies |
| F-D-05 Data Profiling | F-D-03 Schema Discovery | Must discover before profiling |
| F-M-01 Mapping Specification | F-D-03 Schema Discovery | Must discover schema before mapping |
| F-M-02 Transformation Rules | F-M-01 Mapping Specification | Must have mapping before transformations |
| F-M-03 Mapping Versioning | F-M-01 Mapping Specification | Must have mapping before versioning |
| F-M-04 Mapping Approval | F-M-01 Mapping Specification | Must have mapping before approval |
| F-V-01 Validation Rules | F-M-01 Mapping Specification | Must have mappings to validate |
| F-V-02 Validation Execution | F-V-01 Validation Rules | Must have rules before executing |
| F-V-03 Defect Management | F-V-02 Validation Execution | Must execute before finding defects |
| F-V-04 Validation Reporting | F-V-02 Validation Execution | Must execute before reporting |
| F-G-01 Approval Workflows | F-M-04 Mapping Approval | Approval workflow used for mapping approval |
| F-G-02 Audit Trail | All features | Audit trail logs all activities |
| F-R-01 Executive Dashboard | F-V-04, F-G-04 | Dashboard aggregates validation and compliance data |
| F-A-03 Permission Management | F-A-01, F-A-02 | Must have users and roles before permissions |

---

# Azure DevOps Import Format

The following CSV format can be imported directly into Azure DevOps using the bulk import feature.

## CSV Header

```csv
Work Item Type,Title,Description,Priority,Story Points,Tags,Acceptance Criteria
```

## Sample Rows (R1 Stories)

```csv
User Story,US-D-001: Register Legacy System,"As a Data Analyst I want to register a legacy system so that I can begin discovery",1,5,"Discovery;Sprint 1;R1;P03","Given I am on the Discovery dashboard, when I click Register System, then a registration form is displayed; Given I complete the form, when I submit, then the system is created with status Registered"
User Story,US-D-002: Edit Legacy System Details,"As a Data Analyst I want to edit system details so that I can keep information accurate",1,3,"Discovery;Sprint 1;R1;P03","Given I am viewing a system, when I click Edit, then the form becomes editable; Given I save changes, when the save succeeds, then an audit record is created"
User Story,US-D-003: View System List,"As a Programme Manager I want to view all registered systems so that I can understand scope",1,3,"Discovery;Sprint 1;R1;P01","Given I navigate to System List, when the page loads, then all systems are displayed; Given the list is large, when I view it, then pagination is shown"
User Story,US-D-004: View System Detail,"As a Data Analyst I want to view system details so that I can understand its characteristics",1,2,"Discovery;Sprint 2;R1;P03","Given I am on the System List, when I click a system name, then the detail page is displayed"
User Story,US-D-005: Configure Database Connection,"As a Data Analyst I want to configure a database connection so that the platform can analyse the source",1,8,"Discovery;Sprint 2;R1;P03","Given I am on a system detail page, when I click Configure Connection, then a form is displayed; Given I enter details, when I click Test Connection, then connectivity is validated; Given test succeeds, when I save, then credentials are stored in Key Vault"
User Story,US-D-006: Test Database Connection,"As a Data Analyst I want to test a connection before discovery so that I can verify connectivity",1,3,"Discovery;Sprint 2;R1;P03","Given I have a configured connection, when I click Test Connection, then a test is performed; Given test succeeds, when I view result, then success message with server version is shown"
User Story,US-D-007: Run Schema Discovery,"As a Data Analyst I want to run schema discovery so that metadata is extracted automatically",1,8,"Discovery;Sprint 3;R1;P03","Given I have a validated connection, when I click Run Discovery, then a job is initiated; Given discovery completes, when I view results, then tables, columns, and relationships are shown"
User Story,US-D-008: View Discovery Results,"As a Data Analyst I want to view discovery results so that I can review extracted metadata",1,5,"Discovery;Sprint 3;R1;P03","Given discovery completed, when I view results, then summary with table/column/relationship counts is displayed; Given I export results, when I click Export, then CSV is downloaded"
User Story,US-D-009: Map System Dependencies,"As a Business Analyst I want to map dependencies so that I can understand system coupling",2,3,"Discovery;Sprint 4;R1;P02","Given I am on a system detail, when I click Map Dependencies, then a mapping interface is shown; Given I select systems, when I save, then dependency is recorded"
User Story,US-D-010: Run Data Profiling,"As a Data Analyst I want to profile data so that I can understand data characteristics",2,3,"Discovery;Sprint 4;R1;P03","Given I have discovery results, when I select a table and click Profile Data, then a profiling job runs; Given profiling completes, when I view results, then row count, nulls, and distribution are shown"
User Story,US-M-001: Create Mapping Specification,"As a Business Analyst I want to create mapping specifications so that I can define data migration",1,5,"Mapping;Sprint 5;R1;P02","Given I am on the Mapping dashboard, when I click Create Mapping, then a form is displayed; Given I select source and target, when I save, then mapping is created with status Draft"
User Story,US-M-002: Edit Mapping Specification,"As a Business Analyst I want to edit mappings so that I can refine based on analysis",1,3,"Mapping;Sprint 5;R1;P02","Given I am viewing a mapping, when I click Edit, then the form becomes editable; Given I save, when success, then a new version is created"
User Story,US-M-003: Define Transformation Rules,"As a Business Analyst I want to define transformations so that data is correctly migrated",1,5,"Mapping;Sprint 5;R1;P02","Given I am editing a mapping, when I click Add Transformation, then a rule editor is shown; Given I define a rule, when I save, then the rule is attached to the mapping"
User Story,US-M-004: Version Control Mappings,"As a Business Analyst I want version control so that I can track changes",1,3,"Mapping;Sprint 6;R1;P02","Given I modify a mapping, when saved, then a new version is assigned; Given I view version history, when I click a version, then previous state is shown"
User Story,US-M-005: Submit Mapping for Approval,"As a Business Analyst I want to submit mappings for approval so that they are reviewed",2,5,"Mapping;Sprint 6;R1;P02","Given I have a completed mapping, when I click Submit for Approval, then status changes to Pending Approval; Given I submit incomplete mapping, when I submit, then validation error prevents submission"
User Story,US-M-006: Approve or Reject Mapping,"As a Governance Lead I want to approve or reject mappings so that only validated mappings proceed",2,3,"Mapping;Sprint 6;R1;P04","Given I am reviewing a pending mapping, when I click Approve, then status changes to Approved; Given I click Reject with reason, when saved, then status changes to Rejected"
User Story,US-V-001: Create Validation Rule,"As a Business Analyst I want to create validation rules so that data quality is ensured",1,5,"Validation;Sprint 7;R1;P02","Given I am on the Validation dashboard, when I click Create Rule, then a form is displayed; Given I define criteria, when I save, then rule is created with status Active"
User Story,US-V-002: Edit Validation Rule,"As a Business Analyst I want to edit rules so that I can refine criteria",1,3,"Validation;Sprint 7;R1;P02","Given I am viewing a rule, when I click Edit, then the form becomes editable; Given I save, when success, then audit record is created"
User Story,US-V-003: Execute Validation Run,"As a Business Analyst I want to execute validation so that data quality issues are identified",1,8,"Validation;Sprint 7;R1;P02","Given I have active rules, when I click Run Validation, then a job is initiated; Given validation completes, when I view results, then pass/fail counts and details are shown"
User Story,US-V-004: View Validation Results,"As a Business Analyst I want to view validation results so that I can analyse issues",1,5,"Validation;Sprint 8;R1;P02","Given validation completed, when I view results, then summary with pass/fail/warning is shown; Given I export, when I click Export, then CSV is downloaded"
User Story,US-V-005: Log Validation Defect,"As a Business Analyst I want to log defects so that issues are tracked",1,5,"Validation;Sprint 8;R1;P02","Given I view a failure, when I click Log Defect, then a pre-populated form is shown; Given I save, when success, then defect is created with status Open"
User Story,US-V-006: Manage Defect Lifecycle,"As a Governance Lead I want to manage defects so that issues are resolved",1,3,"Validation;Sprint 8;R1;P04","Given I view an open defect, when I click Assign, then I can assign it; Given defect is resolved, when I verify, then I can close it"
User Story,US-V-007: Generate Validation Report,"As a Programme Manager I want reports so that I can communicate status",2,3,"Validation;Sprint 10;R1;P01","Given I am on Validation dashboard, when I click Generate Report, then a report is generated; Given I export, when I click Export PDF, then PDF is downloaded"
User Story,US-G-001: Create Approval Workflow,"As a Governance Lead I want workflows so that governance is consistently followed",1,5,"Governance;Sprint 9;R1;P04","Given I click Create Workflow, when the builder loads, then I can define stages and approvers; Given I save with no approvers, when I save, then validation error is shown"
User Story,US-G-002: Execute Approval Workflow,"As a Governance Lead I want workflows to execute automatically so that governance is enforced",1,3,"Governance;Sprint 9;R1;P04","Given an item is submitted, when workflow triggers, then first approver is notified; Given all stages approved, when complete, then item status is Updated"
User Story,US-G-003: View Audit Trail,"As a Governance Lead I want audit trails so that compliance is demonstrated",1,3,"Governance;Sprint 10;R1;P04","Given I navigate to Audit Trail, when page loads, then records are displayed chronologically; Given I filter, when I select criteria, then list is filtered"
User Story,US-G-004: Upload Evidence,"As a Governance Lead I want to upload evidence so that artefacts are centrally stored",2,3,"Governance;Sprint 10;R1;P04","Given I click Upload, when dialog opens, then I can select a file; Given I upload, when complete, then evidence record is created"
User Story,US-G-005: View Compliance Dashboard,"As an Executive Stakeholder I want compliance metrics so that I can assess compliance",2,3,"Governance;Sprint 10;R1;P05","Given I navigate to Compliance Dashboard, when it loads, then metrics are displayed; Given I drill into a metric, when I click, then details are shown"
User Story,US-R-001: View Executive Dashboard,"As an Executive Stakeholder I want an executive dashboard so that I can make informed decisions",1,5,"Reporting;Sprint 9;R1;P05","Given I navigate to Executive Dashboard, when it loads, then KPIs and charts are shown; Given I click a KPI, when detail loads, then underlying data is shown"
User Story,US-R-002: View Programme Dashboard,"As a Programme Manager I want a programme dashboard so that I can track delivery",1,3,"Reporting;Sprint 9;R1;P01","Given I navigate to Programme Dashboard, when it loads, then sprint progress and velocity are shown; Given I filter by date, when applied, then dashboard updates"
User Story,US-R-003: View Operational Dashboard,"As a Business Analyst I want an operational dashboard so that I can monitor my work",2,3,"Reporting;Sprint 9;R1;P02","Given I navigate to Operational Dashboard, when it loads, then my items and activity are shown; Given I click a work item, when detail loads, then I can update status"
User Story,US-A-001: Create User Account,"As a Platform Administrator I want to create users so that team members can access the platform",1,3,"Administration;Sprint 12;R1;P06","Given I click Create User, when form loads, then I can enter details; Given I save with duplicate email, when I save, then error is displayed"
User Story,US-A-002: Edit User Account,"As a Platform Administrator I want to edit users so that information remains accurate",1,2,"Administration;Sprint 12;R1;P06","Given I view a user, when I click Edit, then form becomes editable; Given I save, when success, then audit record is created"
User Story,US-A-003: Deactivate User Account,"As a Platform Administrator I want to deactivate users so that access is revoked",1,2,"Administration;Sprint 12;R1;P06","Given I view an active user, when I click Deactivate, then confirmation is shown; Given I confirm, when complete, then status changes to Inactive"
User Story,US-A-004: Create Role,"As a Platform Administrator I want to create roles so that access is tailored",1,3,"Administration;Sprint 12;R1;P06","Given I click Create Role, when form loads, then I can define name and permissions; Given I save with duplicate name, when I save, then error is displayed"
User Story,US-A-005: Assign Role to User,"As a Platform Administrator I want to assign roles so that users have correct access",1,2,"Administration;Sprint 12;R1;P06","Given I view a user, when I click Assign Role, then available roles are listed; Given I select and save, when success, then permissions are updated"
User Story,US-A-006: Configure Platform Settings,"As a Platform Administrator I want to configure settings so that platform meets requirements",2,3,"Administration;Sprint 12;R1;P06","Given I view Configuration page, when it loads, then current settings are shown; Given I modify and save, when success, then change is applied and audited"
User Story,US-NFR-001: API Performance,"Platform NFR - API responses within 500ms at p95",1,5,"NFR;Sprint 4;R1;Platform","Given platform running, when API called, then response <500ms at p95; Given 100 concurrent users, when tested, then thresholds maintained"
User Story,US-NFR-002: Dashboard Load Time,"Platform NFR - Dashboards load within 3 seconds",1,3,"NFR;Sprint 9;R1;Platform","Given I navigate to dashboard, when it loads, then full render <3 seconds"
User Story,US-NFR-003: Authentication,"Platform NFR - Microsoft Entra ID authentication",1,5,"NFR;Sprint 1;R1;Platform","Given I navigate to platform, when not authenticated, then redirected to Entra ID; Given I authenticate, when token validated, then access granted per role"
User Story,US-NFR-004: Role-Based Access Control,"Platform NFR - Access controlled by assigned role",1,5,"NFR;Sprint 2;R1;Platform","Given I am authenticated, when I access feature, then role permissions checked; Given access denied, when check fails, then clear message shown"
User Story,US-NFR-005: Audit Logging,"Platform NFR - All actions logged in audit trail",1,3,"NFR;Sprint 3;R1;Platform","Given user performs action, when complete, then audit record created; Given I view audit trail, when displayed, then records are immutable"
User Story,US-NFR-006: Data Encryption,"Platform NFR - Data encrypted at rest and in transit",1,3,"NFR;Sprint 1;R1;Platform","Given platform stores data, when written, then encryption at rest enabled; Given data transmitted, when API called, then TLS 1.2+ enforced"
User Story,US-NFR-007: Accessibility Compliance,"Platform NFR - WCAG 2.2 AA compliance",2,5,"NFR;Sprint 10;R1;Platform","Given I use screen reader, when navigating, then content accessible; Given keyboard-only navigation, when interacting, then all elements reachable"
User Story,US-NFR-008: Scalability,"Platform NFR - Support 100 concurrent users in MVP",2,3,"NFR;Sprint 6;R1;Platform","Given load test with 100 users, when complete, then all thresholds met; Given CPU >70%, when scaling checked, then instances provisioned"
```

---

# Backlog Summary

| Metric | Value |
| ------ | ----- |
| Total Epics | 6 |
| Total Features | 30 |
| Total User Stories (R1) | 45 |
| Total Story Points (R1) | ~192 |
| Total Sprints | 12 |
| Average Velocity per Sprint | ~16 points |
| MVP Duration | 24 weeks |
| Release 2 Features | 4 |
| Release 3 Features | 1 + AI |
| Release 4 Features | 1 + Enterprise |

---

# MVP Build Backlog Review Summary

| Area | Status |
| ---- | ------ |
| Epic Structure | Approved |
| Feature Register | Approved |
| User Stories | Approved |
| Acceptance Criteria | Approved |
| Story Point Estimates | Approved |
| Sprint Mapping | Approved |
| Release Mapping | Approved |
| Dependency Map | Approved |
| Azure DevOps Format | Approved |

---

# Approval Statement

This MVP Build Backlog establishes the complete executable backlog for MAP Release 1.

All user stories are ready for Azure DevOps import and sprint execution.

The backlog aligns with MVP-01 through MVP-06, PD-01 through PD-07, UX-01 through UX-07, AZ-01 through AZ-10, and DP-01 through DP-12.

---

# Conclusion

The MVP Build Backlog provides a delivery-ready, traceable, and governed backlog for building the Migration Assurance Platform MVP.

The backlog enables:

* Rapid sprint execution
* Traceability from epic to task
* Azure DevOps integration
* Controlled scope management
* Measurable delivery progress
* Governance compliance
* Delivery Planning integration (DP-01–12)

while maintaining alignment with all approved MAP planning artefacts.

---

# Status

✅ MVP Build Backlog Approved

Backlog Ready for Azure DevOps Import
