# Defect Management Framework

## Migration Assurance Platform (MAP)

---

| Field | Value |
|-------|-------|
| **Document Title** | Defect Management Framework |
| **Document ID** | MAP-QA-DM-001 |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal — Engineering |
| **Owner** | QA Engineering Lead |
| **Domain** | Quality Assurance & Testing |

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Definitions & Terminology](#2-definitions--terminology)
3. [Bug Lifecycle](#3-bug-lifecycle)
4. [Severity Classification (P1–P4)](#4-severity-classification-p1p4)
5. [Priority Classification](#5-priority-classification)
6. [Root Cause Analysis](#6-root-cause-analysis)
7. [Triage Process](#7-triage-process)
8. [Resolution Workflow](#8-resolution-workflow)
9. [Defect Reporting Standards](#9-defect-reporting-standards)
10. [Metrics & Reporting](#10-metrics--reporting)
11. [Defect Prevention](#11-defect-prevention)
12. [Tooling & Integration](#12-tooling--integration)
13. [Best Practices](#13-best-practices)
14. [Roles & Responsibilities](#14-roles--responsibilities)
15. [Escalation Matrix](#15-escalation-matrix)
16. [Dependencies & References](#16-dependencies--references)
17. [Compliance & Audit](#17-compliance--audit)
18. [Appendices](#18-appendices)
19. [Revision History](#19-revision-history)
20. [Approval](#20-approval)

---

## 1. Purpose & Scope

### 1.1 Purpose

This document establishes the standardized defect management process for the Migration Assurance Platform (MAP). It defines how defects are identified, classified, triaged, resolved, tracked, and prevented across all MAP modules, services, and integrations.

MAP is a financial services migration validation engine that ensures data integrity, regulatory compliance, and operational continuity during complex system migrations. Given the critical nature of financial data, defect management within MAP must adhere to the highest standards of rigor, traceability, and accountability.

### 1.2 Scope

This framework applies to all defects discovered in the following MAP components:

| Component | Description |
|-----------|-------------|
| **Validation Engine** | Core rule engine for migration data validation |
| **Batch Processing** | Batch job orchestration and monitoring |
| **Reconciliation Module** | Source-to-target data reconciliation |
| **Reporting & Dashboards** | Analytics, dashboards, and audit reports |
| **API Layer** | RESTful APIs and integration endpoints |
| **User Interface** | Web application and admin console |
| **Data Pipeline** | ETL/ELT orchestration and transformation |
| **Security Module** | Authentication, authorization, encryption |

### 1.3 Out of Scope

- defects in third-party vendor libraries (managed via vendor escalation)
- Infrastructure-level issues (managed by SRE/DevOps per Batch 11 standards)
- UI/UX design feedback (managed via separate design review process)

---

## 2. Definitions & Terminology

| Term | Definition |
|------|------------|
| **Defect** | A flaw in a component that causes it to produce incorrect or unexpected results, or to behave in unintended ways |
| **Bug** | Synonymous with Defect in this document |
| **Defect ID** | Unique identifier assigned upon defect creation (format: `MAP-BUG-YYYYMMDD-NNN`) |
| **Severity** | The impact of the defect on system functionality (P1–P4) |
| **Priority** | The business urgency for resolving the defect (Critical, High, Medium, Low) |
| **Root Cause** | The fundamental reason for the defect occurrence |
| **Regression** | A defect reintroduced after a previous fix |
| **Defect Leakage** | A defect that escapes to production or a later phase |
| **Triage** | The process of evaluating, prioritizing, and assigning defects |
| **RCA** | Root Cause Analysis |
| **SLA** | Service Level Agreement |
| **MTTR** | Mean Time to Resolution |

### 2.1 Acronyms

| Acronym | Full Form |
|---------|-----------|
| MAP | Migration Assurance Platform |
| RCA | Root Cause Analysis |
| QA | Quality Assurance |
| UAT | User Acceptance Testing |
| SIT | System Integration Testing |
| SLA | Service Level Agreement |
| MTTR | Mean Time to Resolution |
| DOD | Definition of Done |

---

## 3. Bug Lifecycle

### 3.1 Defect States

Every defect in MAP progresses through a defined set of states. The state machine ensures controlled transitions and prevents orphaned defects.

```
┌──────────────┐
│   NEW        │
└──────┬───────┘
       │ Assign
       ▼
┌──────────────┐
│  ASSIGNED    │
└──────┬───────┘
       │ Accept
       ▼
┌──────────────┐     ┌──────────────┐
│  IN PROGRESS │────▶│  ON HOLD     │
└──────┬───────┘     └──────┬───────┘
       │ Resolve             │ Resume
       ▼                     │
┌──────────────┐             │
│  RESOLVED    │◀────────────┘
└──────┬───────┘
       │ Verify
       ▼
┌──────────────┐        ┌──────────────┐
│  VERIFIED    │───────▶│  CLOSED      │
└──────────────┘        └──────────────┘
       │ Reopen
       ▼
┌──────────────┐
│  REOPENED    │──▶ (cycles back to IN PROGRESS)
└──────────────┘
```

### 3.2 State Descriptions

| State | Description | Allowed Transitions |
|-------|-------------|---------------------|
| **New** | Defect just reported; awaiting initial review | → Assigned, → Closed (Invalid) |
| **Assigned** | Defect triaged and assigned to developer | → In Progress, → Closed (Duplicate/Won't Fix) |
| **In Progress** | Developer actively working on the fix | → Resolved, → On Hold |
| **On Hold** | Resolution deferred pending dependency or decision | → In Progress |
| **Resolved** | Developer claims fix is complete | → Verified, → Reopened |
| **Verified** | QA confirms fix resolves the defect | → Closed |
| **Reopened** | QA rejects the fix; defect persists | → In Progress |
| **Closed** | Defect is final; no further action | (terminal state) |

### 3.3 Transition Rules

| From State | To State | Trigger | Actor |
|------------|----------|---------|-------|
| New | Assigned | Triage complete | Triage Lead |
| New | Closed | Invalid / Cannot Reproduce | Triage Lead |
| Assigned | In Progress | Developer begins work | Developer |
| In Progress | Resolved | Code submitted + unit tests pass | Developer |
| In Progress | On Hold | Blocked by dependency | Developer |
| On Hold | In Progress | Blocker removed | Developer |
| Resolved | Verified | Regression suite passes | QA Engineer |
| Resolved | Reopened | Defect still reproducible | QA Engineer |
| Reopened | In Progress | Developer re-investigates | Developer |
| Verified | Closed | Final sign-off | QA Lead |

### 3.4 Automated State Transitions

MAP integrates with Azure DevOps pipelines to automate certain state transitions:

```yaml
# azure-pipelines-defect-automation.yml
trigger:
  branches:
    include:
      - main
      - release/*

stages:
  - stage: DefectValidation
    jobs:
      - job: VerifyDefectResolution
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: AzureCLI@2
            displayName: 'Run Regression Suite'
            inputs:
              azureSubscription: 'MAP-Production-Service-Connection'
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                # Fetch resolved defects
                DEFECT_IDS=$(az boards work-item query \
                  --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.State] = 'Resolved' AND [System.Tags] CONTAINS 'MAP'" \
                  --output json | jq -r '.[].id')

                for DEFECT_ID in $DEFECT_IDS; do
                  echo "Verifying defect MAP-BUG-$DEFECT_ID"
                  ./scripts/run-defect-regression.sh $DEFECT_ID
                  if [ $? -eq 0 ]; then
                    az boards work-item update --id $DEFECT_ID \
                      --fields "System.State=Verified" \
                      --reason "Automated verification passed"
                  else
                    az boards work-item update --id $DEFECT_ID \
                      --fields "System.State=Reopened" \
                      --reason "Automated verification failed"
                  fi
                done
```

---

## 4. Severity Classification (P1–P4)

### 4.1 Severity Definitions

| Severity | Name | Definition | Example |
|----------|------|------------|---------|
| **P1** | **Critical / Blocker** | Complete system outage, data loss, regulatory breach, or security vulnerability. No workaround exists. | Migration engine corrupts financial records; production database inaccessible; PII exposure |
| **P2** | **Major** | Significant functionality broken. Core business process impaired. Workaround may exist but is impractical for sustained use. | Reconciliation engine produces incorrect totals for >5% of records; batch job fails silently |
| **P3** | **Moderate** | Non-critical functionality impaired. Workaround exists and is acceptable for short-term use. | Dashboard chart renders incorrectly; export to CSV truncates special characters |
| **P4** | **Minor / Cosmetic** | UI typo, alignment issue, minor UX annoyance. No functional impact. | Button label misspelled; tooltip text outdated; padding inconsistency |

### 4.2 Response & Resolution Targets

| Severity | Initial Response | Investigation Complete | Fix Deployed | Verification Complete |
|----------|-----------------|----------------------|--------------|----------------------|
| **P1** | ≤ 15 minutes | ≤ 2 hours | ≤ 4 hours | ≤ 6 hours |
| **P2** | ≤ 1 hour | ≤ 8 hours | ≤ 24 hours (1 business day) | ≤ 32 hours |
| **P3** | ≤ 4 hours | ≤ 2 business days | ≤ 5 business days | ≤ 7 business days |
| **P4** | ≤ 1 business day | ≤ 5 business days | ≤ 15 business days | ≤ 20 business days |

### 4.3 Severity Impact Matrix

```
                HIGH IMPACT                    LOW IMPACT
            ┌─────────────────────┬─────────────────────┐
 HIGH       │                     │                     │
 LIKELIHOOD │   P1 — CRITICAL     │   P2 — MAJOR        │
            │                     │                     │
            ├─────────────────────┼─────────────────────┤
 LOW        │                     │                     │
 LIKELIHOOD │   P2 — MAJOR        │   P3 — MODERATE     │
            │                     │                     │
            └─────────────────────┴─────────────────────┘
```

### 4.4 Severity Assignment Criteria

When assigning severity, the triage team evaluates:

1. **Business Impact** — Does it affect financial calculations, regulatory reporting, or customer data?
2. **User Impact** — How many users are affected? Is it all users or a subset?
3. **Data Integrity** — Can the defect cause data corruption or loss?
4. **Security** — Does it expose sensitive data or create an attack surface?
5. **Workaround Availability** — Can users continue working around the defect?

---

## 5. Priority Classification

### 5.1 Priority Definitions

| Priority | Definition | SLA Response | SLA Resolution |
|----------|------------|-------------|----------------|
| **Critical** | Must be resolved immediately. Blocks release, deployment, or production operation. Escalation to engineering leadership required. | 15 minutes | 4 hours |
| **High** | Should be resolved in current sprint. Significant business impact if delayed. Escalation to team lead if not started within 4 hours. | 1 hour | 1 business day |
| **Medium** | Should be resolved in current or next sprint. Business impact is manageable with workaround. | 4 hours | 5 business days |
| **Low** | Resolve when capacity permits. Minimal business impact. | 1 business day | 20 business days |

### 5.2 Severity vs. Priority Cross-Reference

| Severity\Priority | Critical | High | Medium | Low |
|-------------------|----------|------|--------|-----|
| **P1** | Must be Critical | — | — | — |
| **P2** | May be Critical (if data breach) | Must be High+ | — | — |
| **P3** | Rare (e.g., regulatory deadline) | May be High | Standard | May be Low |
| **P4** | Never | Rare | Standard | Standard |

### 5.3 Priority Assignment Rules

```
IF (severity == P1) AND (no_workaround == true):
    priority = Critical

IF (severity == P1) AND (no_workaround == false):
    priority = High

IF (severity == P2) AND (data_integrity_risk == true):
    priority = Critical

IF (severity == P2) AND (data_integrity_risk == false):
    priority = High

IF (severity == P3) AND (regulatory_impact == true):
    priority = High

IF (severity == P3) AND (regulatory_impact == false):
    priority = Medium

IF (severity == P4):
    priority = Low
```

---

## 6. Root Cause Analysis

### 6.1 RCA Trigger Criteria

Root Cause Analysis is mandatory for:

- All P1 and P2 defects
- Any defect that leaks to production
- Any defect causing data corruption or financial miscalculation
- Any defect causing regulatory non-compliance
- Recurring defects (same module, same root cause, 3+ occurrences)

### 6.2 RCA Techniques

#### 6.2.1 The 5 Whys

Iterative interrogation technique to peel back layers of symptoms to find root cause.

**Example — Data Reconciliation Mismatch:**

```
Why 1: Why did the reconciliation report show a $50,000 discrepancy?
→ The source system included tax adjustments that were not mapped in the target.

Why 2: Why were tax adjustments not mapped?
→ The mapping configuration file was not updated for Q4 2026 tax rules.

Why 3: Why was the mapping configuration not updated?
→ The configuration update process was not included in the sprint backlog.

Why 4: Why was it not included in the sprint backlog?
→ The tax rule change notification was sent to the legacy team, not the MAP team.

Why 5: Why was the notification sent to the wrong team?
→ There is no automated routing rule for tax regulation change notifications.

ROOT CAUSE: Missing automated routing rule for regulatory change notifications.
ACTION: Implement automated notification routing from regulatory feeds to MAP backlog.
```

#### 6.2.2 Fishbone (Ishikawa) Diagram

Causal diagram for systematic defect cause identification.

```
                    ┌─────────────────────────────────────────────────────┐
                    │              DEFECT: Migration Data Loss            │
                    └─────────────────────────────────────────────────────┘
                                       │
       ┌───────────────┬───────────────┼───────────────┬───────────────┐
       │               │               │               │               │
       ▼               ▼               ▼               ▼               ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │ PEOPLE  │    │ PROCESS │    │  TOOLS  │    │  DATA   │    │ ENVIRON │
  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
       │              │              │              │              │
  - Insufficient   - No code    - ETL tool     - Missing     - Prod vs
    training       review for   lacks         checksum      dev data
  - High turnover  batch jobs   validation    validation    mismatch
  - No on-call   - Missing     - Logging     - Corrupt     - Network
    rotation       rollback     too verbose   source data    latency
                   procedure  - No alerting  - Schema     - Memory
                                on failure    drift         constraints
```

#### 6.2.3 Fault Tree Analysis (FTA)

Top-down deductive analysis for critical system failures:

```
                    ┌─────────────────────────────────┐
                    │  TOP EVENT: Data Integrity      │
                    │  Failure in Production          │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
              ┌─────┴─────┐                   ┌─────┴─────┐
              │ Input Data│                   │ Processing│
              │  Failure  │                   │  Failure  │
              └─────┬─────┘                   └─────┬─────┘
                    │                               │
            ┌───────┴───────┐               ┌───────┴───────┐
            │               │               │               │
      ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
      │  Schema   │  │  Source   │  │  Logic    │  │  Memory   │
      │  Mismatch │  │  Corrupt  │  │  Error    │  │  Overflow │
      └───────────┘  └───────────┘  └───────────┘  └───────────┘
```

#### 6.2.4 8D Problem Solving

Eight disciplines methodology for structured defect resolution:

| Step | Discipline | Description |
|------|------------|-------------|
| D0 | Planning | Prepare for 8D process |
| D1 | Team Formation | Assemble cross-functional team |
| D2 | Problem Description | Define problem using 5W2H (Who, What, When, Where, Why, How, How many) |
| D3 | Interim Containment | Implement temporary containment actions |
| D4 | Root Cause Analysis | Identify and verify root cause(s) |
| D5 | Permanent Corrective Actions | Define and verify corrective actions |
| D6 | Implementation | Implement and validate permanent corrective actions |
| D7 | Prevention | Prevent recurrence through systemic changes |
| D8 | Recognition | Congratulate the team |

### 6.3 RCA Template

```markdown
## Root Cause Analysis Report

**Defect ID:** MAP-BUG-20260701-042
**Reported By:** [Name]
**Date:** [Date]
**RCA Lead:** [Name]

### 1. Problem Statement
[Clear, concise description of what happened]

### 2. Impact Assessment
- Users Affected: [Number/Percentage]
- Financial Impact: [Amount if applicable]
- Regulatory Impact: [Yes/No + details]
- Duration: [Time the defect was active]

### 3. Timeline
| Time | Event |
|------|-------|
| HH:MM | Defect first occurred |
| HH:MM | Defect detected |
| HH:MM | Investigation began |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |

### 4. Root Cause
[Description using 5 Whys or Fishbone findings]

### 5. Contributing Factors
- [Factor 1]
- [Factor 2]

### 6. Corrective Actions
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action 1] | [Name] | [Date] | [Status] |

### 7. Preventive Actions
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action 1] | [Name] | [Date] | [Status] |

### 8. Lessons Learned
- [Lesson 1]
- [Lesson 2]
```

---

## 7. Triage Process

### 7.1 Triage Meeting Cadence

| Meeting | Frequency | Duration | Attendees | Purpose |
|---------|-----------|----------|-----------|---------|
| **Daily Standup Triage** | Daily | 15 min | QA Lead, Dev Lead, Scrum Master | Review new/unassigned defects |
| **Weekly Defect Review** | Weekly | 30 min | QA Lead, Dev Lead, Product Owner, Engineering Manager | Trend review, priority adjustment, backlog grooming |
| **P1/P2 Emergency Triage** | As needed | Immediate | On-call QA, On-call Dev, Engineering Manager, VP Engineering | Rapid response to critical defects |
| **Monthly Defect Review** | Monthly | 60 min | Full engineering team | RCA review, process improvement, metrics review |

### 7.2 Triage Decision Matrix

| Condition | Action |
|-----------|--------|
| Defect is reproducible, severity confirmed | Assign to appropriate developer |
| Defect cannot be reproduced | Request additional info from reporter; set to "Info Requested" |
| Duplicate of existing defect | Mark as Duplicate, link to original |
| Not a defect (expected behavior) | Mark as "By Design" with explanation |
| Third-party / vendor issue | Log with vendor; set to "External Dependency" |
| Requires design change | Route to Product Owner for backlog item creation |
| Security vulnerability | Escalate to Security Lead immediately |

### 7.3 Triage Workflow

```
                    ┌───────────────────┐
                    │  New Defect       │
                    │  Submitted        │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Initial Review   │
                    │  (Auto-assign to  │
                    │  Triage Queue)    │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Completeness     │
                    │  Check            │
                    └────┬──────────┬───┘
                         │          │
                    Incomplete    Complete
                         │          │
                    ┌────▼────┐  ┌──▼──────────────┐
                    │ Return  │  │ Duplicate       │
                    │ to      │  │ Check           │
                    │ Reporter│  └──┬──────────┬───┘
                    └─────────┘     │          │
                               Duplicate  Not Duplicate
                                    │          │
                               ┌────▼────┐  ┌──▼──────────────┐
                               │ Mark    │  │ Severity &      │
                               │Dup, Link│  │ Priority Assign │
                               └─────────┘  └──┬──────────────┘
                                               │
                                         ┌─────▼──────────┐
                                         │ Assign to Dev  │
                                         │ with SLA Timer │
                                         └────────────────┘
```

### 7.4 Triage Checklist

- [ ] Defect title is clear and descriptive
- [ ] Steps to reproduce are provided (minimum 3 steps)
- [ ] Expected vs. actual behavior is documented
- [ ] Environment details are specified
- [ ] Screenshots / video / logs are attached
- [ ] Severity is assessed (P1–P4)
- [ ] Priority is assessed (Critical/High/Medium/Low)
- [ ] Module/component is tagged
- [ ] Duplicate check completed
- [ ] Assigned to correct developer

---

## 8. Resolution Workflow

### 8.1 Resolution Dispositions

| Disposition | Description | When to Use |
|-------------|-------------|-------------|
| **Fixed** | Defect resolved with code change | Root cause identified, fix verified in test environment |
| **Deferred** | Defect acknowledged but resolution postponed | Low priority; will be addressed in future sprint |
| **Won't Fix** | Defect acknowledged but will not be resolved | By design; cost/benefit analysis favors living with defect |
| **Duplicate** | Defect is a copy of an existing defect | Same root cause, same symptoms as another defect |
| **Cannot Reproduce** | Defect cannot be reproduced despite multiple attempts | Insufficient information; environment-specific |
| **By Design** | Behavior is intentional and documented | Product Owner confirms intended behavior |

### 8.2 Fix Verification Process

```
Developer Claims Fix
        │
        ▼
┌─────────────────────┐
│ Code Review Complete │
│ (≥ 1 approval)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Unit Tests Pass     │
│ (Coverage ≥ 80%)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Integration Tests   │
│ Pass                │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Defect-Specific     │
│ Regression Test     │
│ Added to Suite      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ QA Verification     │
│ (Original Reporter) │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
  Pass        Fail
     │           │
  ┌──▼──┐    ┌───▼───┐
  │Close│    │Reopen │
  └─────┘    └───────┘
```

### 8.3 Deferred Defect Tracking

Deferred defects must be reviewed at every sprint planning meeting:

| Review Action | Criteria |
|---------------|----------|
| Promote to current sprint | Severity increased; new dependency discovered |
| Remain deferred | No change in impact; workaround remains viable |
| Close as Won't Fix | Business decision made to accept the defect |

### 8.4 Fix Quality Gates

| Gate | Criteria | Enforced By |
|------|----------|-------------|
| **Code Coverage** | ≥ 80% for new/modified code | CI/CD pipeline |
| **Static Analysis** | Zero critical/high violations | SonarQube |
| **Security Scan** | No new vulnerabilities | OWASP ZAP / Snyk |
| **Performance** | No regression > 5% in response time | Load test suite |
| **Accessibility** | WCAG 2.1 AA compliance | axe-core |

---

## 9. Defect Reporting Standards

### 9.1 Required Fields

Every defect report must contain:

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | Concise, descriptive summary (max 120 characters) |
| **Description** | Yes | Detailed explanation of the defect |
| **Steps to Reproduce** | Yes | Numbered, sequential steps (minimum 3) |
| **Expected Result** | Yes | What should happen |
| **Actual Result** | Yes | What actually happens |
| **Environment** | Yes | Browser, OS, MAP version, environment |
| **Severity** | Yes | P1–P4 |
| **Priority** | Yes | Critical/High/Medium/Low |
| **Module** | Yes | Affected MAP component |
| **Screenshots/Evidence** | Recommended | Visual proof of defect |
| **Logs** | Recommended | Relevant error logs or stack traces |
| **Workaround** | Optional | How to work around the defect |
| **Reporter** | Yes | Person who identified the defect |
| **Assignee** | Yes (after triage) | Person responsible for resolution |

### 9.2 Defect Title Format

```
[Module] Brief description of defect

Examples:
[Reconciliation] Tax adjustment amounts not included in quarterly totals
[Batch Processing] Batch job MAP-BATCH-007 fails silently on malformed CSV input
[Dashboard] Export to PDF truncates column headers longer than 50 characters
[API] /api/v2/migrations endpoint returns 500 when tenant_id is null
```

### 9.3 Steps to Reproduce Template

```markdown
**Steps to Reproduce:**

1. Log in to MAP as a user with the "Migration Analyst" role
2. Navigate to Migration Jobs → Batch Processing
3. Click "Create New Batch Job"
4. Select source file: `test_data_Q4_2026_with_tax_adjustments.csv`
5. Configure mapping: Source System → Target System
6. Click "Validate and Run"
7. Wait for batch job to complete
8. Navigate to Reconciliation → Quarterly Summary
9. Observe the Tax Adjustments column shows $0.00

**Expected Result:** Tax Adjustments column should show $50,000.00 (sum of tax adjustment records in source file)

**Actual Result:** Tax Adjustments column shows $0.00 for all records
```

### 9.4 Defect Description Template

```markdown
## Summary
[One sentence describing the defect]

## Environment
- **MAP Version:** v1.4.2
- **Environment:** UAT
- **Browser:** Chrome 126.0.6478.126
- **OS:** Windows 11 Enterprise
- **Database:** PostgreSQL 16.3
- **Tenant:** MAP-DEMO-001

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Evidence
- Screenshot: [attachment]
- Video Recording: [link]
- Error Log: [attachment]

## Workaround
[If available]

## Additional Context
[Any other relevant information]
```

### 9.5 Evidence Standards

| Evidence Type | Format | Maximum Size | Required For |
|---------------|--------|-------------|--------------|
| Screenshot | PNG, JPG | 5 MB | All UI defects |
| Screen Recording | MP4, WebM | 50 MB | Complex multi-step defects |
| Error Log | TXT, LOG | 2 MB | All P1/P2 defects |
| HAR File | .har | 10 MB | API/network defects |
| Database Dump | SQL, CSV | 50 MB | Data integrity defects |
| Performance Trace | .trace, .pprof | 10 MB | Performance defects |

---

## 10. Metrics & Reporting

### 10.1 Key Metrics

| Metric | Formula | Target | Review Frequency |
|--------|---------|--------|------------------|
| **Defect Density** | Defects / KLOC | ≤ 5 defects/KLOC | Per Sprint |
| **Defect Leakage Rate** | Production Defects / Total Defects | ≤ 5% | Monthly |
| **MTTR (P1)** | Total P1 resolution time / P1 count | ≤ 4 hours | Per Incident |
| **MTTR (P2)** | Total P2 resolution time / P2 count | ≤ 24 hours | Weekly |
| **Defect Reopen Rate** | Reopened Defects / Resolved Defects | ≤ 10% | Per Sprint |
| **First Pass Resolution** | Fixed on first attempt / Total resolved | ≥ 85% | Per Sprint |
| **Defect Age** | Days since defect creation | ≤ 30 days avg | Weekly |
| **RCA Completion Rate** | RCAs completed / RCAs required | 100% | Monthly |
| **Test Coverage (new code)** | Covered lines / Total new lines | ≥ 80% | Per PR |

### 10.2 Defect Trend Analysis

#### Sprint Velocity Report

| Sprint | Opened | Closed | Net Change | Backlog |
|--------|--------|--------|------------|---------|
| Sprint 22 | 24 | 20 | +4 | 38 |
| Sprint 23 | 18 | 22 | -4 | 34 |
| Sprint 24 | 15 | 19 | -4 | 30 |
| Sprint 25 | 12 | 16 | -4 | 26 |

#### Defect Distribution by Module

| Module | P1 | P2 | P3 | P4 | Total | Trend |
|--------|----|----|----|----|-------|-------|
| Validation Engine | 1 | 3 | 8 | 2 | 14 | ↓ |
| Batch Processing | 0 | 2 | 5 | 3 | 10 | → |
| Reconciliation | 2 | 4 | 6 | 1 | 13 | ↑ |
| Dashboard | 0 | 1 | 4 | 6 | 11 | → |
| API Layer | 1 | 2 | 3 | 1 | 7 | ↓ |
| Security Module | 1 | 1 | 2 | 0 | 4 | → |

### 10.3 Defect Reports

#### Daily Defect Summary (Automated)

```python
# scripts/generate_defect_summary.py
from datetime import datetime, timedelta
from azure.devops.connection import Connection
from msrest.authentication import BasicAuthentication

def generate_daily_defect_summary():
    """Generate daily defect summary report."""
    
    organization = "map-org"
    project = "MigrationAssurancePlatform"
    pat = os.environ["AZURE_DEVOPS_PAT"]
    
    credentials = BasicAuthentication("", pat)
    connection = Connection(
        base_url=f"https://dev.azure.com/{organization}",
        creds=credentials
    )
    
    wi_client = connection.clients.get_work_item_tracking_client()
    
    # Query for open defects
    wiql_query = {
        "query": """
            SELECT [System.Id], [System.Title], [System.State],
                   [Microsoft.VSTS.Common.Severity], [Microsoft.VSTS.Common.Priority],
                   [System.AssignedTo], [System.CreatedDate]
            FROM WorkItems
            WHERE [System.TeamProject] = 'MigrationAssurancePlatform'
              AND [System.WorkItemType] = 'Bug'
              AND [System.State] <> 'Closed'
            ORDER BY [Microsoft.VSTS.Common.Priority] ASC, [System.CreatedDate] ASC
        """
    }
    
    result = wi_client.query_by_wiql(wiql_query)
    
    summary = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total_open": len(result.work_items),
        "by_severity": {"P1": 0, "P2": 0, "P3": 0, "P4": 0},
        "by_priority": {"Critical": 0, "High": 0, "Medium": 0, "Low": 0},
        "overdue": [],
        "aging": []
    }
    
    for wi_ref in result.work_items:
        wi = wi_client.get_work_item(wi_ref.id)
        severity = wi.fields.get("Microsoft.VSTS.Common.Severity", "Unknown")
        priority = wi.fields.get("Microsoft.VSTS.Common.Priority", 3)
        created = wi.fields.get("System.CreatedDate")
        
        summary["by_severity"][severity] = summary["by_severity"].get(severity, 0) + 1
        
        # Check aging
        age_days = (datetime.now() - created).days
        if age_days > 30:
            summary["aging"].append({
                "id": wi.id,
                "title": wi.fields["System.Title"],
                "age_days": age_days
            })
    
    return summary

if __name__ == "__main__":
    summary = generate_daily_defect_summary()
    print(json.dumps(summary, indent=2))
```

### 10.4 Dashboard Configuration

MAP dashboards in Azure DevOps should include:

| Widget | Purpose | Refresh Rate |
|--------|---------|-------------|
| **Defect Trend** | Open vs. closed over time | Daily |
| **Severity Distribution** | Pie chart of P1–P4 | Real-time |
| **SLA Compliance** | % of defects resolved within SLA | Daily |
| **Defect Hotspots** | Module with highest defect density | Per Sprint |
| **Aging Defects** | Defects older than 30/60/90 days | Weekly |
| **RCA Status** | Pending/completed RCAs | Daily |

---

## 11. Defect Prevention

### 11.1 Pattern Analysis

Monthly review of defect patterns to identify systemic issues:

| Pattern Category | Analysis Method | Action |
|------------------|-----------------|--------|
| **Module Hotspots** | Pareto analysis of defect distribution | Increase test coverage in hotspot modules |
| **Root Cause Clusters** | Group RCAs by root cause category | Process improvement for most common root cause |
| **Defect Introduction Phase** | Track when defect was introduced | Strengthen gates at phase where most defects originate |
| **Escaped Defects** | Analyze defects found in production | Improve pre-production testing |
| **Time-of-Day Patterns** | Correlate defect occurrence with deployment times | Adjust deployment windows |

### 11.2 Prevention Techniques

| Technique | Description | Frequency |
|-----------|-------------|-----------|
| **Code Reviews** | Peer review of all code changes | Every PR |
| **Static Analysis** | Automated code quality checks | Every commit (CI/CD) |
| **Pair Programming** | Two developers on complex features | As needed |
| **Test-Driven Development** | Write tests before implementation | Recommended for new features |
| **Mutation Testing** | Introduce mutations to verify test effectiveness | Monthly |
| **Security Audits** | OWASP Top 10 review | Quarterly |
| **Load Testing** | Performance regression testing | Pre-release |
| **Chaos Engineering** | Deliberate failure injection | Quarterly |

### 11.3 Process Improvement Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEFECT PREVENTION CYCLE                       │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ COLLECT  │───▶│ ANALYZE  │───▶│ IMPLEMENT│───▶│ VERIFY   │  │
│  │ Data     │    │ Patterns │    │ Changes  │    │ Results  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       ▲                                                   │      │
│       └───────────────────────────────────────────────────┘      │
│                                                                 │
│  Inputs:                                                        │
│  - Defect data from Azure DevOps                                │
│  - RCA reports                                                  │
│  - Sprint retrospectives                                        │
│  - Customer feedback                                            │
│                                                                 │
│  Outputs:                                                       │
│  - Process updates                                              │
│  - Test suite enhancements                                      │
│  - Training materials                                           │
│  - Coding standards revisions                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 11.4 Defect Prevention Actions

| Root Cause Category | Prevention Action | Owner | Tracking |
|---------------------|-------------------|-------|----------|
| Insufficient Unit Tests | Increase minimum coverage to 80% | Dev Lead | CI/CD gate |
| Missing Edge Case Handling | Add edge case checklist to PR template | QA Lead | PR template |
| Environment Differences | Implement environment parity checks | DevOps Lead | Pre-deploy check |
| Configuration Drift | Implement config-as-code with validation | DevOps Lead | Infrastructure CI |
| Knowledge Gaps | Conduct module-specific training sessions | Engineering Manager | Quarterly |

---

## 12. Tooling & Integration

### 12.1 Azure DevOps

Primary tool for defect tracking and management in MAP.

#### Work Item Configuration

```json
{
  "fieldAssignments": {
    "System.Title": "Defect Title",
    "System.Description": "Detailed Description",
    "Microsoft.VSTS.Common.Severity": "P1-P4",
    "Microsoft.VSTS.Common.Priority": "1-Critical, 2-High, 3-Medium, 4-Low",
    "System.Tags": "module-name, environment, regression-type",
    "Microsoft.VSTS.TCM.ReproSteps": "Step-by-step reproduction",
    "System.AreaPath": "MigrationAssurancePlatform\\Module\\SubModule",
    "System.IterationPath": "MigrationAssurancePlatform\\Sprint XX"
  },
  "customFields": [
    {
      "name": "RootCauseCategory",
      "type": "String",
      "allowedValues": [
        "Coding Error",
        "Design Flaw",
        "Requirements Gap",
        "Environment Issue",
        "Data Issue",
        "Third Party",
        "Unknown"
      ]
    },
    {
      "name": "DefectSource",
      "type": "String",
      "allowedValues": [
        "Development Testing",
        "QA Testing",
        "UAT",
        "Production Monitoring",
        "Customer Report",
        "Security Audit"
      ]
    },
    {
      "name": "RegressionDefect",
      "type": "Boolean"
    }
  ]
}
```

#### Azure DevOps Query Examples

**Find all P1/P2 defects not assigned:**

```sql
SELECT [System.Id], [System.Title], [System.State],
       [Microsoft.VSTS.Common.Severity], [System.AssignedTo]
FROM WorkItems
WHERE [System.WorkItemType] = 'Bug'
  AND [Microsoft.VSTS.Common.Severity] IN ('P1 - Critical', 'P2 - Major')
  AND [System.State] = 'New'
  AND [System.TeamProject] = 'MigrationAssurancePlatform'
ORDER BY [Microsoft.VSTS.Common.Priority] ASC
```

**Find overdue defects:**

```sql
SELECT [System.Id], [System.Title], [System.State],
       [Microsoft.VSTS.Common.Severity], [System.ChangedDate]
FROM WorkItems
WHERE [System.WorkItemType] = 'Bug'
  AND [System.State] IN ('New', 'Assigned', 'In Progress')
  AND [System.ChangedDate] < @Today - 7
  AND [System.TeamProject] = 'MigrationAssurancePlatform'
ORDER BY [System.ChangedDate] ASC
```

### 12.2 GitHub Issues

Used for open-source components and community-reported defects.

#### GitHub Issue Template

```yaml
# .github/ISSUE_TEMPLATE/bug_report.md
name: Bug Report
description: Report a defect in MAP
title: "[Module] Brief description"
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thank you for reporting a defect. Please fill out the template below.
  - type: input
    id: map-version
    attributes:
      label: MAP Version
      description: "What version of MAP are you using?"
      placeholder: "e.g., v1.4.2"
    validations:
      required: true
  - type: input
    id: environment
    attributes:
      label: Environment
      description: "What environment did you encounter this in?"
      options:
        - Production
        - UAT
        - Staging
        - Development
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: "How can we reproduce this defect?"
      value: |
        1. Go to '...'
        2. Click on '...'
        3. Scroll down to '...'
        4. See error
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: "What did you expect to happen?"
    validations:
      required: true
  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: "What actually happened?"
    validations:
      required: true
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots / Evidence
      description: "Attach any relevant screenshots or logs"
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options:
        - P1 - Critical (System Down / Data Loss)
        - P2 - Major (Core Feature Broken)
        - P3 - Moderate (Workaround Available)
        - P4 - Minor (Cosmetic / UI)
    validations:
      required: true
```

### 12.3 Jira Integration

For organizations using Jira, MAP defect tracking can be integrated:

#### Jira Workflow Configuration

```json
{
  "workflow": {
    "name": "MAP Defect Workflow",
    "statuses": [
      {"name": "Open", "category": "To Do"},
      {"name": "Triage", "category": "To Do"},
      {"name": "In Progress", "category": "In Progress"},
      {"name": "On Hold", "category": "In Progress"},
      {"name": "Resolved", "category": "Done"},
      {"name": "Verified", "category": "Done"},
      {"name": "Closed", "category": "Done"},
      {"name": "Reopened", "category": "To Do"}
    ],
    "transitions": [
      {"from": "Open", "to": "Triage", "name": "Start Triage"},
      {"from": "Triage", "to": "In Progress", "name": "Assign"},
      {"from": "Triage", "to": "Closed", "name": "Close Invalid"},
      {"from": "In Progress", "to": "Resolved", "name": "Resolve"},
      {"from": "In Progress", "to": "On Hold", "name": "Hold"},
      {"from": "On Hold", "to": "In Progress", "name": "Resume"},
      {"from": "Resolved", "to": "Verified", "name": "Verify"},
      {"from": "Resolved", "to": "Reopened", "name": "Reopen"},
      {"from": "Reopened", "to": "In Progress", "name": "Restart"},
      {"from": "Verified", "to": "Closed", "name": "Close"}
    ]
  }
}
```

#### Jira Automation Rules

| Rule | Trigger | Action |
|------|---------|--------|
| Auto-assign P1 | Severity = P1 | Assign to on-call developer + notify Slack |
| SLA Warning | SLA 75% elapsed | Add label "SLA-AT-RISK" + notify assignee |
| SLA Breach | SLA 100% elapsed | Add label "SLA-BREACHED" + escalate to manager |
| Stale Defect | No activity > 14 days | Notify assignee + add label "STALE" |
| Auto-close | State = Resolved + 5 days no reopen | Transition to Closed |

### 12.4 Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MAP DEFECT MANAGEMENT ECOSYSTEM                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │
│  │  Azure DevOps │     │    GitHub     │     │     Jira     │       │
│  │  (Primary)    │     │  (Community)  │     │ (Alternative)│       │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘       │
│         │                    │                    │                 │
│         └────────────────────┼────────────────────┘                 │
│                              │                                      │
│                    ┌─────────▼─────────┐                           │
│                    │   Sync Service     │                           │
│                    │   (Azure Functions)│                           │
│                    └─────────┬─────────┘                           │
│                              │                                      │
│         ┌────────────────────┼────────────────────┐                │
│         │                    │                    │                 │
│  ┌──────▼───────┐     ┌─────▼──────┐     ┌──────▼───────┐       │
│  │  Slack / Teams│     │   Grafana   │     │  PagerDuty   │       │
│  │  (Notifications│    │  (Dashboards)│    │  (Alerting)  │       │
│  │              │     │             │     │              │       │
│  └──────────────┘     └─────────────┘     └──────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 13. Best Practices

### 13.1 Defect Writing Best Practices

| Practice | Good Example | Bad Example |
|----------|-------------|-------------|
| **Be specific** | "Reconciliation totals are off by $50,000 for Q4 2026" | "Numbers are wrong" |
| **Include environment** | "MAP v1.4.2, UAT, Chrome 126, Windows 11" | "It doesn't work" |
| **One defect per report** | Single focused defect | Multiple unrelated issues |
| **Use precise language** | "The batch job crashes with NullPointerException on line 42" | "It crashes sometimes" |
| **Provide evidence** | Attach screenshot, video, logs | "See attached" (no attachment) |
| **Check for duplicates** | Search existing defects first | Duplicate of existing defect |
| **Include reproduction steps** | 1→2→3→4→5 numbered steps | "Just do the thing" |

### 13.2 Reproduction Steps Best Practices

1. **Start from a known state** — "Log in fresh / clear cache"
2. **Be specific about data** — Use exact values, not "some data"
3. **Include timing** — "Wait for batch job to complete (approximately 5 minutes)"
4. **Note variations** — "Defect occurs in Chrome and Firefox, but not Edge"
5. **Test isolation** — "This defect occurs regardless of other batch jobs"

### 13.3 Evidence Collection Checklist

- [ ] Screenshot of the defect with browser developer tools open
- [ ] Console errors (F12 → Console)
- [ ] Network requests (F12 → Network)
- [ ] Application logs from MAP server
- [ ] Database state (query results before/after)
- [ ] Browser version and OS details
- [ ] MAP version and build number
- [ ] Timestamp of occurrence (UTC)

### 13.4 Defect Communication Standards

| Audience | Channel | Content |
|----------|---------|---------|
| Development Team | Azure DevOps / Jira | Full defect report with evidence |
| Product Owner | Sprint Review | Impact summary, business implications |
| Stakeholders | Weekly Report | Trend analysis, risk assessment |
| Executive Team | Monthly Dashboard | Key metrics, SLA compliance |
| Customers | Support Portal | Status updates, workaround guidance |

### 13.5 Code Review for Defect Prevention

```markdown
## PR Review Checklist — Defect Prevention

### Before Reviewing Code
- [ ] Read the linked defect/requirement
- [ ] Understand the expected behavior

### During Code Review
- [ ] Does the code handle edge cases?
- [ ] Are error conditions properly handled?
- [ ] Is input validation sufficient?
- [ ] Are there proper null/empty checks?
- [ ] Is the fix scoped to the defect (no unrelated changes)?
- [ ] Are adequate unit tests included?
- [ ] Does the test cover the specific reproduction scenario?
- [ ] Are logging statements appropriate (not too verbose, not too sparse)?
- [ ] Is the fix backwards-compatible?

### After Review
- [ ] Verify the defect can be reproduced before the fix
- [ ] Verify the defect cannot be reproduced after the fix
- [ ] Confirm no regressions in related functionality
```

---

## 14. Roles & Responsibilities

### 14.1 RACI Matrix

| Activity | QA Engineer | Developer | QA Lead | Dev Lead | Product Owner | Engineering Manager |
|----------|:-----------:|:---------:|:-------:|:--------:|:-------------:|:-------------------:|
| Report Defect | **R** | C | I | I | I | — |
| Triage Defect | C | C | **R/A** | C | I | I |
| Assign Defect | I | I | **R** | **A** | I | C |
| Investigate Root Cause | C | **R** | I | **A** | I | I |
| Implement Fix | — | **R** | I | **A** | I | — |
| Code Review | — | **R** | — | **A** | — | — |
| Verify Fix | **R** | C | **A** | I | I | — |
| Close Defect | **R** | I | **A** | I | — | — |
| Conduct RCA | C | C | **R** | C | I | **A** |
| Report Metrics | **R** | — | **A** | C | I | I |
| Process Improvement | C | C | **R** | C | I | **A** |

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

### 14.2 Escalation Responsibilities

| Level | Role | Escalation Trigger | Decision Authority |
|-------|------|--------------------|--------------------|
| **L1** | QA Engineer / Developer | Initial defect handling | Technical resolution |
| **L2** | QA Lead / Dev Lead | SLA breach, resource conflict | Sprint scope adjustment |
| **L3** | Engineering Manager | Cross-team dependency, architectural impact | Release scope adjustment |
| **L4** | VP Engineering | Business-critical impact, security incident | Emergency response activation |

---

## 15. Escalation Matrix

### 15.1 Escalation Triggers

| Trigger | Level | Response Time |
|---------|-------|---------------|
| P1 defect reported | L2 → L3 | Immediate |
| SLA 75% elapsed (P1/P2) | L1 → L2 | Within 1 hour |
| SLA breached (P1/P2) | L2 → L3 | Within 1 hour |
| Defect affects >100 users | L2 → L3 | Within 2 hours |
| Data integrity issue | L2 → L3 → L4 | Immediate |
| Security vulnerability | L3 → L4 | Immediate |
| Recurring defect (same root cause, 3+ times) | L2 → L3 | Within 1 business day |
| Cross-team dependency blocked | L2 → L3 | Within 1 business day |

### 15.2 Escalation Notification Matrix

| Severity | Notify | Channel | Template |
|----------|--------|---------|----------|
| P1 | On-call Dev, QA Lead, Dev Lead, EM, VP Eng | PagerDuty + Slack + Email | `[P1 ALERT] MAP-BUG-XXXX: {title}` |
| P2 | QA Lead, Dev Lead, EM | Slack + Email | `[P2 ALERT] MAP-BUG-XXXX: {title}` |
| P3 | QA Lead | Slack | `[P3] MAP-BUG-XXXX: {title}` |
| P4 | Assignee | Azure DevOps notification | Standard assignment notification |

### 15.3 Emergency Contact List

| Role | Primary Contact | Backup Contact | Escalation Phone |
|------|-----------------|----------------|------------------|
| On-Call Developer | [Rotation Schedule] | Dev Lead | +1-XXX-XXX-XXXX |
| QA Lead | [Name] | Senior QA Engineer | +1-XXX-XXX-XXXX |
| Dev Lead | [Name] | Senior Developer | +1-XXX-XXX-XXXX |
| Engineering Manager | [Name] | VP Engineering | +1-XXX-XXX-XXXX |
| VP Engineering | [Name] | CTO | +1-XXX-XXX-XXXX |

---

## 16. Dependencies & References

### 16.1 Internal Dependencies

| Document | Batch | Relationship | Description |
|----------|-------|-------------|-------------|
| **Development Standards** | Batch 11 | Primary | Coding standards, PR review requirements, CI/CD gates that prevent defects |
| **Quality Metrics** | Batch 18 | Metrics | Defines quality KPIs, SLA thresholds, and measurement methodology |
| **Testing Strategy** | Batch 09 | Process | Test planning, execution, and coverage requirements |
| **CI/CD Pipeline** | Batch 07 | Tooling | Automated build, test, and deployment processes |
| **Security Standards** | Batch 12 | Compliance | Security testing requirements for defect-free releases |
| **Incident Management** | Batch 15 | Process | Production incident response and defect-to-incident linkage |

### 16.2 External References

| Reference | Description |
|-----------|-------------|
| **ISTQB Foundation Syllabus** | International Software Testing Qualifications Board defect classification standards |
| **IEEE 730-2014** | Software Quality Assurance Processes |
| **ISO/IEC 25010** | Systems and software Quality Requirements and Evaluation (SQuaRE) |
| **CMMI-DEV** | Capability Maturity Model Integration for Development |
| **OWASP Testing Guide** | Web application security testing methodology |

### 16.3 Related Documents

| Document | Location | Purpose |
|----------|----------|---------|
| MAP Architecture Document | `/docs/architecture/` | System architecture reference |
| MAP API Specification | `/docs/api/` | API contract for defect API testing |
| MAP Deployment Guide | `/docs/deployment/` | Deployment process for fix verification |
| MAP Runbook | `/docs/runbook/` | Operational procedures for production defects |
| Sprint Retrospective Notes | `/retrospectives/` | Process improvement context |

---

## 17. Compliance & Audit

### 17.1 Regulatory Requirements

MAP operates in the financial services domain. Defect management must comply with:

| Regulation | Defect Management Requirement |
|------------|------------------------------|
| **SOX (Sarbanes-Oxley)** | All defects affecting financial reporting must have documented RCA and resolution trail |
| **GDPR** | Security/data defects must be resolved within regulatory timelines; breach notification requirements |
| **PCI DSS** | Payment data handling defects must follow PCI incident response procedures |
| **Basel III** | Risk calculation defects must be resolved before regulatory reporting deadlines |
| **MiFID II** | Transaction reporting defects must be resolved within T+1 for live trading data |

### 17.2 Audit Trail Requirements

All defect records must maintain a complete audit trail:

| Audit Requirement | Implementation |
|-------------------|----------------|
| **Immutable History** | Azure DevOps / Jira history is append-only |
| **Timestamp Logging** | All state changes timestamped in UTC |
| **User Attribution** | All changes attributed to specific user |
| **RCA Documentation** | Mandatory for P1/P2 defects, stored in defect record |
| **Approval Chain** | Resolution of P1 defects requires QA Lead + Engineering Manager approval |
| **Retention Period** | Defect records retained for 7 years (financial services requirement) |

### 17.3 Compliance Checklist

- [ ] All P1/P2 defects have documented RCA within 5 business days
- [ ] SLA compliance tracked and reported monthly
- [ ] Defect resolution audit trail is complete and unaltered
- [ ] Security defects follow OWASP incident response
- [ ] Financial data defects notify compliance team within 1 hour
- [ ] All defect records retained per retention policy

---

## 18. Appendices

### Appendix A: Defect ID Format

```
MAP-BUG-YYYYMMDD-NNN

Where:
  MAP      = Migration Assurance Platform
  BUG      = Work item type
  YYYY     = Year (4 digits)
  MM       = Month (2 digits)
  DD       = Day (2 digits)
  NNN      = Sequential number (001-999, resets daily)

Example: MAP-BUG-20260701-042
```

### Appendix B: Module Code Reference

| Module Code | Module Name | Area Path |
|-------------|-------------|-----------|
| VAL | Validation Engine | MigrationAssurancePlatform/Validation |
| BAT | Batch Processing | MigrationAssurancePlatform/Batch |
| REC | Reconciliation | MigrationAssurancePlatform/Reconciliation |
| DBR | Dashboard & Reporting | MigrationAssurancePlatform/Dashboard |
| API | API Layer | MigrationAssurancePlatform/API |
| SEC | Security Module | MigrationAssurancePlatform/Security |
| ETL | Data Pipeline | MigrationAssurancePlatform/ETL |
| ADM | Admin Console | MigrationAssurancePlatform/Admin |

### Appendix C: Defect Template (Azure DevOps Work Item)

```json
{
  "op": "add",
  "path": "/fields/System.Title",
  "value": "[MODULE] Brief defect description"
},
{
  "op": "add",
  "path": "/fields/System.Description",
  "value": "<h2>Summary</h2><p>[Description]</p><h2>Environment</h2><ul><li>MAP Version: </li><li>Browser: </li><li>OS: </li></ul>"
},
{
  "op": "add",
  "path": "/fields/Microsoft.VSTS.Common.Severity",
  "value": "P2 - Major"
},
{
  "op": "add",
  "path": "/fields/Microsoft.VSTS.Common.Priority",
  "value": "2"
},
{
  "op": "add",
  "path": "/fields/System.Tags",
  "value": "validation-engine; regression; needs-rca"
}
```

### Appendix D: SLA Monitoring Script

```bash
#!/bin/bash
# scripts/check_sla_compliance.sh
# Monitor defect SLA compliance and send alerts

set -euo pipefail

AZURE_ORG="map-org"
AZURE_PROJECT="MigrationAssurancePlatform"
SLACK_WEBHOOK="${SLACK_DEFECTS_WEBHOOK}"

# SLA thresholds in hours
SLA_P1=4
SLA_P2=24
SLA_P3=120
SLA_P4=400

check_sla_breach() {
    local defect_id=$1
    local severity=$2
    local created_date=$3
    
    case $severity in
        P1) threshold=$SLA_P1 ;;
        P2) threshold=$SLA_P2 ;;
        P3) threshold=$SLA_P3 ;;
        P4) threshold=$SLA_P4 ;;
    esac
    
    created_epoch=$(date -d "$created_date" +%s)
    current_epoch=$(date +%s)
    elapsed_hours=$(( (current_epoch - created_epoch) / 3600 ))
    
    if [ $elapsed_hours -ge $threshold ]; then
        echo "SLA BREACHED: Defect $defect_id ($severity) - ${elapsed_hours}h elapsed, threshold ${threshold}h"
        send_alert "$defect_id" "$severity" "$elapsed_hours" "$threshold"
        return 1
    elif [ $elapsed_hours -ge $((threshold * 3 / 4)) ]; then
        echo "SLA WARNING: Defect $defect_id ($severity) - ${elapsed_hours}h elapsed, threshold ${threshold}h"
        return 2
    fi
    return 0
}

send_alert() {
    local defect_id=$1
    local severity=$2
    local elapsed=$3
    local threshold=$4
    
    curl -s -X POST "$SLACK_WEBHOOK" \
        -H 'Content-type: application/json' \
        -d "{
            \"text\": \"🚨 *SLA BREACH*\nDefect: $defect_id\nSeverity: $severity\nElapsed: ${elapsed}h / ${threshold}h\nAction Required: Immediate attention needed.\nhttps://dev.azure.com/$AZURE_ORG/$AZURE_PROJECT/_workitems/edit/$defect_id\"
        }"
}

# Main execution
echo "Checking SLA compliance at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Query open defects from Azure DevOps
DEFECTS=$(az boards work-item query \
    --wiql "SELECT [System.Id], [Microsoft.VSTS.Common.Severity], [System.CreatedDate] FROM WorkItems WHERE [System.WorkItemType] = 'Bug' AND [System.State] <> 'Closed'" \
    --output json)

echo "$DEFECTS" | jq -r '.[] | "\(.id) \(.fields["Microsoft.VSTS.Common.Severity"]) \(.fields["System.CreatedDate"])"' | \
while read -r id severity created; do
    check_sla_breach "$id" "$severity" "$created" || true
done

echo "SLA check complete."
```

### Appendix E: Defect Export Template

```csv
Defect ID,Title,Description,Severity,Priority,State,Module,Reporter,Assignee,Created Date,Resolved Date,SLA Status,Root Cause,Resolution
MAP-BUG-20260701-001,"Tax adjustment not mapped","Tax adjustments excluded from reconciliation totals",P2,High,Closed,Reconciliation,J. Smith,A. Jones,2026-07-01,2026-07-02,Met,Configuration Gap,Fixed
MAP-BUG-20260701-002,"Export CSV truncation","CSV export truncates special characters in column headers",P3,Medium,In Progress,Dashboard,K. Lee,,2026-07-01,,At Risk,Encoding Issue,
MAP-BUG-20260701-003,"Batch job silent failure","Batch job fails without error on malformed input",P1,Critical,Resolved,Batch,M. Chen,J. Smith,2026-07-01,2026-07-01,Met,Missing Validation,Fixed
```

---

## 19. Revision History

| Version | Date | Author | Changes | Approved By |
|---------|------|--------|---------|-------------|
| 0.1 | 2026-06-01 | QA Engineering Lead | Initial draft | — |
| 0.2 | 2026-06-10 | QA Engineering Lead | Added severity definitions, triage process | QA Lead |
| 0.3 | 2026-06-15 | Dev Lead | Added tooling integration, Azure DevOps config | Dev Lead |
| 0.4 | 2026-06-20 | QA Engineering Lead | Added RCA templates, metrics section | Engineering Manager |
| 0.5 | 2026-06-25 | QA Engineering Lead | Incorporated Batch 11 & Batch 18 references | Engineering Manager |
| 0.6 | 2026-06-28 | QA Engineering Lead | Added compliance section, escalation matrix | VP Engineering |
| 0.7 | 2026-06-30 | QA Engineering Lead | Peer review feedback incorporated | QA Lead, Dev Lead |
| 0.8 | 2026-07-01 | QA Engineering Lead | Final review and corrections | Engineering Manager |
| 1.0 | 2026-07-02 | QA Engineering Lead | Official release | VP Engineering |

---

## 20. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **VP Engineering** | | | |
| **Engineering Manager** | | | |
| **QA Lead** | | | |
| **Development Lead** | | | |
| **Product Owner** | | | |
| **Compliance Officer** | | | |

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | MAP-QA-DM-001 |
| **Classification** | Internal — Engineering |
| **Storage Location** | SharePoint > MAP > Documentation > QA > Defect Management |
| **Review Cycle** | Quarterly (next review: October 2026) |
| **Distribution** | All MAP engineering team members |
| **Confidentiality** | Internal use only |

---

*End of Document*
