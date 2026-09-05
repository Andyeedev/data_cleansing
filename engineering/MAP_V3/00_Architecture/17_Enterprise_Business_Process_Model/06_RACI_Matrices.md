# RACI Matrices

**Document ID:** 17-06  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides RACI (Responsible, Accountable, Consulted, Informed) matrices for all 29 business processes. It defines clear roles and responsibilities for each process.

---

## 2. RACI Legend

| Code | Role | Description |
|------|------|-------------|
| R | Responsible | Does the work |
| A | Accountable | Ultimately answerable |
| C | Consulted | Provides input |
| I | Informed | Kept updated |

---

## 3. RACI Matrices

### 3.1 Migration Management Domain

#### Process 1: Migration Project Lifecycle

| Activity | Migration Lead | Migration Engineer | Programme Manager | Governance Officer |
|----------|---------------|-------------------|-------------------|-------------------|
| Define Project Scope | R | C | A | I |
| Identify Systems | R | R | I | I |
| Assign Team | R | I | A | I |
| Set Timeline | R | C | A | I |
| Create Project Plan | R | R | A | I |
| Allocate Resources | R | I | A | I |
| Define Milestones | R | C | A | I |
| Risk Assessment | R | C | I | C |
| Track Progress | R | R | I | I |
| Monitor Milestones | R | I | A | I |
| Update Status | R | R | I | I |
| Manage Changes | R | C | A | I |
| Escalate Issues | R | I | A | C |
| Approve Deliverables | R | I | A | C |
| Final Review | R | C | A | C |
| Lessons Learned | R | R | A | I |
| Archive Project | R | I | A | I |
| Close Project | R | I | A | I |

---

#### Process 2: Connection Onboarding

| Activity | Migration Lead | Migration Engineer | Security Officer |
|----------|---------------|-------------------|-----------------|
| Enter Connection Details | I | R | I |
| Validate Parameters | I | R | I |
| Store Metadata | I | R | I |
| Test Connectivity | I | R | I |
| Validate Credentials | I | R | C |
| Verify Access | I | R | I |
| Monitor Status | A | R | I |
| Alert on Failures | A | R | I |
| Retry Connections | I | R | I |
| Update Details | I | R | I |
| Rotate Credentials | I | R | C |
| Remove Deprecated | A | R | C |

---

#### Process 3: Credential Onboarding

| Activity | Migration Lead | Security Officer | Migration Engineer |
|----------|---------------|-----------------|-------------------|
| Encrypt Credentials | I | R | I |
| Store Encrypted | I | R | I |
| Manage Keys | I | R | I |
| Retrieve Credentials | I | R | C |
| Decrypt Credentials | I | R | I |
| Log Access | I | R | I |
| Rotate Credentials | I | R | C |
| Update References | I | R | I |
| Verify Rotation | I | R | I |
| Revoke Credentials | I | R | I |
| Remove Stored | I | R | I |
| Audit Revocation | I | R | I |

---

#### Process 4: Dataset Discovery

| Activity | Migration Lead | Migration Engineer |
|----------|---------------|-------------------|
| Query Source Schema | I | R |
| Extract Source Metadata | I | R |
| Store Source Results | I | R |
| Query Target Schema | I | R |
| Extract Target Metadata | I | R |
| Store Target Results | I | R |
| List Source Tables | I | R |
| Extract Table Metadata | I | R |
| Store Table Results | I | R |
| List Target Tables | I | R |
| Store Results | I | R |

---

#### Process 5: Column Discovery

| Activity | Migration Lead | Migration Engineer |
|----------|---------------|-------------------|
| Query Column Metadata | I | R |
| Extract Data Types | I | R |
| Extract Constraints | I | R |
| Store Column Results | I | R |
| Analyse Types | I | R |
| Identify Relationships | I | R |
| Generate Profiles | I | R |

---

#### Process 6: Mapping Lifecycle

| Activity | Migration Lead | Migration Engineer |
|----------|---------------|-------------------|
| Create Table Mappings | I | R |
| Validate Table Mappings | C | R |
| Store Table Mappings | I | R |
| Update Table Mappings | I | R |
| Version Table Mappings | I | R |
| Archive Table Mappings | I | R |
| Create Column Mappings | I | R |
| Validate Column Mappings | C | R |
| Store Column Mappings | I | R |
| Update Column Mappings | I | R |
| Version Column Mappings | I | R |
| Archive Column Mappings | I | R |

---

### 3.2 Validation Management Domain

#### Process 7: Rule Authoring

| Activity | Migration Lead | Migration Engineer | Governance Officer |
|----------|---------------|-------------------|-------------------|
| Define Rule Parameters | I | R | C |
| Set Thresholds | I | R | C |
| Configure Logic | I | R | I |
| Store Rule Definition | I | R | I |
| Validate Syntax | I | R | I |
| Test Execution | I | R | I |
| Approve Rule | A | R | C |
| Version Definitions | I | R | I |
| Track Changes | I | R | I |
| Archive Old Versions | I | R | I |

---

#### Process 8: Rule Approval

| Activity | Migration Lead | Governance Officer |
|----------|---------------|-------------------|
| Submit Rules | R | I |
| Notify Approvers | I | R |
| Track Status | I | R |
| Review Rules | C | R |
| Approve/Reject | C | R |
| Document Decision | I | R |
| Track Progress | I | R |
| Escalate Delays | I | R |
| Report Status | I | R |
| Log Decisions | I | R |

---

#### Process 9: Rule Execution

| Activity | Migration Lead | Migration Engineer |
|----------|---------------|-------------------|
| Select Rules | I | R |
| Validate Parameters | I | R |
| Dispatch to Engine | I | R |
| Execute Logic | I | R |
| Capture Results | I | R |
| Handle Exceptions | I | R |
| Monitor Progress | A | R |
| Track Status | A | R |
| Alert on Failures | A | R |
| Generate Reports | I | R |

---

#### Process 10: Control Lifecycle

| Activity | Migration Lead | Migration Engineer |
|----------|---------------|-------------------|
| Register Controls | I | R |
| Configure Parameters | I | R |
| Store Metadata | I | R |
| Execute Controls | I | R |
| Capture Results | I | R |
| Store Outcomes | I | R |
| Track Status | A | R |
| Monitor Performance | A | R |
| Alert on Failures | A | R |
| Generate Reports | I | R |

---

#### Process 11: Validation Execution

| Activity | Migration Lead | Migration Engineer | Governance Officer |
|----------|---------------|-------------------|-------------------|
| Configure Pipeline | A | R | I |
| Validate Configuration | I | R | I |
| Initialize Pipeline | I | R | I |
| Execute Step 1 | I | R | I |
| Execute Step 2 | I | R | I |
| Execute Step 3 | I | R | I |
| Execute Step 4 | I | R | I |
| Execute Step 5 | I | R | I |
| Execute Step 6 | I | R | C |
| Monitor Progress | A | R | I |
| Track Completion | A | R | I |
| Checkpoint State | I | R | I |
| Resume from Checkpoint | I | R | I |

---

#### Process 12: Exception Management

| Activity | Migration Lead | Migration Engineer | Governance Officer |
|----------|---------------|-------------------|-------------------|
| Detect Failures | I | R | I |
| Classify Exceptions | I | R | C |
| Prioritise Exceptions | A | R | C |
| Analyse Root Cause | I | R | I |
| Assess Impact | I | R | C |
| Recommend Remediation | I | R | C |
| Assign Exceptions | A | R | I |
| Track Progress | A | R | I |
| Verify Resolution | A | R | C |
| Document Resolution | I | R | I |

---

#### Process 13: Issue Remediation

| Activity | Migration Lead | Migration Engineer |
|----------|---------------|-------------------|
| Assess Severity | A | R |
| Identify Root Cause | I | R |
| Plan Remediation | I | R |
| Execute Remediation | I | R |
| Verify Remediation | A | R |
| Document Remediation | I | R |
| Re-run Validation | I | R |
| Compare Results | I | R |
| Confirm Resolution | A | R |
| Close Issue | A | R |

---

### 3.3 Governance & Compliance Domain

#### Process 14: Governance

| Activity | Governance Officer | Migration Lead | Programme Manager |
|----------|-------------------|---------------|-------------------|
| Evaluate Controls | R | C | I |
| Calculate Risk Scores | R | C | I |
| Assess Compliance | R | C | I |
| Generate Decision | R | I | I |
| Document Rationale | R | I | I |
| Notify Stakeholders | R | I | I |
| Trigger Workflows | R | I | I |
| Create Tasks | R | I | I |
| Feed Reports | R | I | I |
| Update Dashboards | R | I | I |
| Trigger Release Approval | R | I | I |
| Gate Releases | R | I | A |
| Block Non-Compliant | R | I | A |

**Current Implementation:** app.governance.decision_engine, app.governance.risk_scoring

**Planned Integration:** Notifications, Workflow, Tasks, Reporting, Dashboard, Release Approval

---

#### Process 15: Release Approval

| Activity | Governance Officer | Programme Manager |
|----------|-------------------|-------------------|
| Compile Release Package | C | R |
| Validate Criteria | R | A |
| Submit Request | C | R |
| Review Package | R | A |
| Assess Risk | R | C |
| Approve/Reject | R | A |
| Deploy Release | C | R |
| Verify Deployment | R | A |
| Monitor Release | R | A |
| Detect Issues | R | A |
| Execute Rollback | C | R |
| Verify Rollback | R | A |

---

### 3.4 Reporting & Analytics Domain

#### Process 16: Reporting

| Activity | Programme Manager | Migration Lead | Governance Officer |
|----------|-------------------|---------------|-------------------|
| Query SQL Views | I | R | I |
| Aggregate Report Data | I | R | I |
| Validate Data | I | R | C |
| Generate Report | A | R | I |
| Format Report | I | R | I |
| Export Report | I | R | I |
| Distribute Reports | A | R | I |
| Manage Access | A | R | I |
| Track Usage | A | R | I |
| Archive Reports | I | R | I |

**Current State:** SQL views, CLI export, no API

**Target State:** Reporting API, Dashboard API, real-time data

---

#### Process 17: Dashboard Production

| Activity | Programme Sponsor | Programme Manager |
|----------|-------------------|-------------------|
| Query Fact Views | I | R |
| Calculate KPIs | I | R |
| Validate Data | I | R |
| Generate Dashboard | A | R |
| Render Visualisations | I | R |
| Update Dashboard | A | R |
| Distribute Dashboards | A | R |
| Manage Access | A | R |
| Track Usage | A | R |
| Archive Dashboards | I | R |

**Current State:** Fact views, scoring engine, no API

**Target State:** Dashboard API, real-time updates, real data

---

### 3.5 Platform Services Domain

#### Process 18: Notifications

| Activity | Administrator | All Users |
|----------|--------------|-----------|
| Receive Events | R | I |
| Validate Event Data | R | I |
| Route to Handlers | R | I |
| Generate Content | R | I |
| Apply Preferences | R | C |
| Send Notifications | R | I |
| Track Delivery | R | I |
| Monitor Status | R | I |
| Handle Failures | R | I |
| Manage Preferences | R | C |

---

#### Process 19: Scheduling

| Activity | Administrator | All Users |
|----------|--------------|-----------|
| Define Parameters | R | C |
| Configure Recurrence | R | C |
| Store Definition | R | I |
| Trigger Events | R | I |
| Execute Tasks | R | I |
| Track Execution | R | I |
| Create Reminders | R | I |
| Configure Timing | R | C |
| Store Reminders | R | I |
| Send Reminders | R | I |
| Track Delivery | R | I |
| Handle Failures | R | I |

---

#### Process 20: Workflow Management

| Activity | Administrator | All Users |
|----------|--------------|-----------|
| Define Steps | R | C |
| Configure Parameters | R | C |
| Store Definition | R | I |
| Validate Logic | R | I |
| Test Execution | R | I |
| Approve Workflow | R | I |
| Create Instance | R | I |
| Execute Steps | R | I |
| Track Progress | R | I |
| Monitor Status | R | I |
| Handle Failures | R | I |
| Retry Workflows | R | I |

**Current Implementation:** Full CRUD API, event subscriptions

**Planned Integration:** Governance, Release Approval, Validation

---

#### Process 21: Task Management

| Activity | Programme Manager | Migration Lead | All Users |
|----------|-------------------|---------------|-----------|
| Create Task | A | R | R |
| Assign Task | A | R | I |
| Set Priorities | A | R | I |
| Store Record | I | R | I |
| Track Progress | A | R | I |
| Update Status | I | R | R |
| Complete Task | I | R | R |
| Define Dependencies | I | R | I |
| Track Resolution | A | R | I |
| Manage Blocking | A | R | I |
| Generate Reports | A | R | I |
| Analyse Metrics | A | R | I |
| Optimise Allocation | A | R | I |

**Current Implementation:** Full CRUD API, event subscriptions

**Planned Integration:** Governance, Validation, Release, Workflow

---

### 3.6 Administration Domain

#### Process 22: User Lifecycle

| Activity | Administrator | Security Officer |
|----------|--------------|-----------------|
| Create Account | R | I |
| Assign Initial Roles | R | I |
| Send Welcome | R | I |
| Update Details | R | I |
| Change Roles | R | I |
| Manage Preferences | R | I |
| Disable Account | R | I |
| Revoke Access | R | I |
| Archive Data | R | I |
| Review Access | R | C |
| Audit Permissions | R | C |
| Report Access | R | I |

---

#### Process 23: Role Administration

| Activity | Administrator | Security Officer |
|----------|--------------|-----------------|
| Define Role | R | I |
| Assign Permissions | R | C |
| Store Definition | R | I |
| Update Permissions | R | C |
| Version Definitions | R | I |
| Archive Definitions | R | I |
| Assign to Roles | R | I |
| Validate Assignments | R | C |
| Store Mappings | R | I |
| Audit Assignments | R | C |
| Report Usage | R | I |
| Optimise Structure | R | C |

---

#### Process 24: Tenant Management

| Activity | Administrator | Security Officer |
|----------|--------------|-----------------|
| Create Tenant | R | I |
| Configure Settings | R | I |
| Provision Resources | R | I |
| Update Settings | R | I |
| Manage Policies | R | C |
| Configure Features | R | I |
| Monitor Usage | R | I |
| Track Health | R | I |
| Alert on Issues | R | I |
| Deactivate Tenant | R | I |
| Archive Data | R | I |
| Restore Access | R | I |

**Current Implementation:** core.tenants, tenant_id in JWT

---

#### Process 25: Security Administration

| Activity | Security Officer | Administrator |
|----------|-----------------|--------------|
| Manage Encryption Keys | R | I |
| Rotate Keys | R | I |
| Audit Usage | R | I |
| Manage Certificates | R | I |
| Renew Certificates | R | I |
| Revoke Certificates | R | I |
| Monitor Events | R | I |
| Analyse Patterns | R | I |
| Respond to Incidents | R | C |
| Generate Reports | R | I |
| Audit Configs | R | I |
| Report Compliance | R | I |

---

#### Process 26: Audit Lifecycle

| Activity | Security Officer | Auditors |
|----------|-----------------|----------|
| Capture API Calls | R | I |
| Capture Security Events | R | I |
| Store Records | R | I |
| Validate Data | R | I |
| Enrich Records | R | I |
| Index Records | R | I |
| Generate Reports | R | C |
| Analyse Patterns | R | C |
| Export Data | R | C |
| Retain Data | R | I |
| Purge Expired Data | R | I |
| Verify Compliance | R | C |

---

#### Process 27: Platform Administration

| Activity | Administrator | DevOps |
|----------|--------------|--------|
| Update Settings | R | I |
| Validate Settings | R | I |
| Audit Changes | R | I |
| Toggle Features | R | I |
| Configure Parameters | R | I |
| Monitor Usage | R | I |
| Run Health Checks | R | C |
| Monitor Health | R | C |
| Alert on Issues | R | C |
| Schedule Maintenance | R | C |
| Execute Tasks | R | C |
| Verify Completion | R | I |

---

#### Process 28: Customer Onboarding

| Activity | Administrator | Security Officer | DevOps |
|----------|--------------|-----------------|--------|
| Submit Registration Form | R | I | I |
| Validate Details | R | I | I |
| Create Customer Record | R | I | I |
| Create Organisation | R | I | I |
| Assign Details | R | I | I |
| Store Metadata | R | I | I |
| Provision Tenant | R | I | C |
| Configure Settings | R | I | I |
| Validate Configuration | R | I | I |
| Create Administrator | R | I | I |
| Assign Roles | R | C | I |
| Send Welcome | R | I | I |
| Allocate Licence | R | I | I |
| Configure Parameters | R | I | I |
| Activate Access | R | I | I |

**Not implemented** — no dedicated customer onboarding workflow found

---

#### Process 29: Authentication

| Activity | Security Officer | All Users |
|----------|-----------------|-----------|
| Validate Username | R | I |
| Validate Password | R | I |
| Check Account Status | R | I |
| Request MFA Code | R | R |
| Validate MFA Code | R | R |
| Handle MFA Failures | R | I |
| Generate JWT | R | I |
| Set Token Claims | R | I |
| Issue Refresh Token | R | I |
| Create Session | R | I |
| Manage Timeout | R | I |
| Invalidate on Logout | R | R |
| Log Failures | R | I |
| Implement Rate Limit | R | I |
| Lock Accounts | R | I |
| Validate Refresh Token | R | I |
| Issue New JWT | R | I |
| Revoke Old Token | R | I |

---

## 4. RACI Summary

### 4.1 Role Assignment Summary

| Role | Processes | Activities |
|------|-----------|------------|
| Migration Lead | 10 | 85+ |
| Migration Engineer | 12 | 100+ |
| Programme Manager | 5 | 40+ |
| Governance Officer | 6 | 50+ |
| Security Officer | 6 | 45+ |
| Administrator | 7 | 60+ |
| All Users | 4 | 20+ |
| DevOps | 2 | 5+ |
| Programme Sponsor | 1 | 5+ |
| Auditors | 1 | 5+ |

### 4.2 Accountability Gaps

| Process | Gap | Recommendation |
|---------|-----|----------------|
| Issue Remediation | No clear accountability | Assign to Migration Lead |
| Customer Onboarding | Not implemented | Define when implemented |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*These RACI matrices are part of the Enterprise Business Process Model (Prompt 17 v2.1). All findings are based on source code analysis — no code was modified.*
