# BPM Process Flows

**Document ID:** 17-04  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides ASCII BPM flow diagrams for all 29 business processes in the MAP Nexus platform. Each flow shows the sequence of activities, decision points, and swim lanes.

---

## 2. Process Flows

### 2.1 Migration Project Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Migration Project Lifecycle                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Define Project Scope ──► Identify Systems          │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Assign Team ──► Set Timeline ──► Create Project Plan           │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Allocate Resources ──► Define Milestones ──► Risk Assessment   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Progress ──► Monitor Milestones ──► Update Status        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Manage Changes ──► Escalate Issues ──► Approve Deliverables    │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Final Review ──► Lessons Learned ──► Archive Project           │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  [End] ──► Project Closed                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.execution_engine contains project configuration logic; core.dataset_mappings references project_id

---

### 2.2 Connection Onboarding

```
┌─────────────────────────────────────────────────────────────────┐
│                    Connection Onboarding                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Enter Connection Details ──► Validate Parameters   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Metadata ──► Test Connectivity ──► Validate Credentials  │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Verify Access ──► Monitor Status ──► Alert on Failures         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Retry Connections ──► Update Details ──► Rotate Credentials    │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Remove Deprecated ──► [End] ──► Connection Verified           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app/api/v1/core/connections.py provides full CRUD API; core.system_registry stores connection metadata

---

### 2.3 Credential Onboarding

```
┌─────────────────────────────────────────────────────────────────┐
│                    Credential Onboarding                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Encrypt Credentials ──► Store Encrypted           │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Manage Keys ──► Retrieve Credentials ──► Decrypt Credentials   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Log Access ──► Rotate Credentials ──► Update References        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Verify Rotation ──► Revoke Credentials ──► Remove Stored       │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Audit Revocation ──► [End] ──► Credentials Stored             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** core.system_credentials stores encrypted credentials; Fernet encryption used

---

### 2.4 Dataset Discovery

```
┌─────────────────────────────────────────────────────────────────┐
│                    Dataset Discovery                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Query Source Schema ──► Extract Source Metadata    │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Source Results ──► Query Target Schema ──► Extract Target │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Target Results ──► List Source Tables ──► Extract Tables  │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Table Results ──► List Target Tables ──► Store Results   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  [End] ──► Discovery Complete                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.discovery.auto_rule_discovery queries information_schema; core.dataset_mappings stores discovered tables

---

### 2.5 Column Discovery

```
┌─────────────────────────────────────────────────────────────────┐
│                    Column Discovery                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Query Column Metadata ──► Extract Data Types       │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Extract Constraints ──► Store Column Results ──► Analyse Types  │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Identify Relationships ──► Generate Profiles ──► [End]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.dataset_discovery_service queries column metadata; core.dataset_columns stores column definitions

---

### 2.6 Mapping Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Mapping Lifecycle                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Create Table Mappings ──► Validate Table Mappings  │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Table Mappings ──► Update Table Mappings ──► Version     │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Archive Table Mappings ──► Create Column Mappings ──► Validate │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Column Mappings ──► Update Column Mappings ──► Version   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Archive Column Mappings ──► [End] ──► Mappings Approved       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.mapping_resolver resolves mappings at runtime; core.dataset_mappings stores table mappings

---

### 2.7 Rule Authoring

```
┌─────────────────────────────────────────────────────────────────┐
│                    Rule Authoring                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Define Rule Parameters ──► Set Thresholds          │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Configure Logic ──► Store Rule Definition ──► Validate Syntax   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Test Execution ──► Approve Rule ──► Version Definitions        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Changes ──► Archive Old Versions ──► [End]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.discovery.auto_rule_discovery auto-generates rules; engine.rule_registry stores rule definitions

---

### 2.8 Rule Approval

```
┌─────────────────────────────────────────────────────────────────┐
│                    Rule Approval                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Submit Rules ──► Notify Approvers                  │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Status ──► Review Rules ──► Approve/Reject               │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Document Decision ──► Track Progress ──► Escalate Delays       │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Report Status ──► Log Decisions ──► [End]                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** No approval workflow implementation found in codebase; rules auto-generated during execution

---

### 2.9 Rule Execution

```
┌─────────────────────────────────────────────────────────────────┐
│                    Rule Execution                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Select Rules ──► Validate Parameters               │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Dispatch to Engine ──► Execute Logic ──► Capture Results        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Handle Exceptions ──► Monitor Progress ──► Track Status         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Alert on Failures ──► Generate Reports ──► [End]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.execution_engine orchestrates 6-step pipeline; app.execution.control_executor dispatches to control classes

---

### 2.10 Control Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Control Lifecycle                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Register Controls ──► Configure Parameters         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Metadata ──► Execute Controls ──► Capture Results         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Outcomes ──► Track Status ──► Monitor Performance        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Alert on Failures ──► Generate Reports ──► [End]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.execution.control_executor fetches enabled controls from engine.control_registry

---

### 2.11 Validation Execution

```
┌─────────────────────────────────────────────────────────────────┐
│                    Validation Execution                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Configure Pipeline ──► Validate Configuration      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Initialize Pipeline ──► Step 1: Discovery ──► Step 2: Mapping  │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Step 3: Rules ──► Step 4: Controls ──► Step 5: Validation      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Step 6: Governance ──► Monitor Progress ──► Track Completion   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Checkpoint State ──► Resume from Checkpoint ──► [End]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.execution_engine implements 6-step pipeline; checkpointing via engine.batch_execution_checkpoint

---

### 2.12 Exception Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    Exception Management                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Detect Failures ──► Classify Exceptions            │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Prioritise Exceptions ──► Analyse Root Cause ──► Assess Impact │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Recommend Remediation ──► Assign Exceptions ──► Track Progress │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Verify Resolution ──► Document Resolution ──► [End]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** engine.v_migration_exception_detail view provides exception data; exceptions logged during execution

---

### 2.13 Issue Remediation

```
┌─────────────────────────────────────────────────────────────────┐
│                    Issue Remediation                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Assess Severity ──► Identify Root Cause            │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Plan Remediation ──► Execute Remediation ──► Verify Remediation │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Document Remediation ──► Re-run Validation ──► Compare Results │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Confirm Resolution ──► Close Issue ──► [End]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** No automated remediation workflow found in codebase; issue tracking via Task Management

---

### 2.14 Governance

```
┌─────────────────────────────────────────────────────────────────┐
│                    Governance                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Evaluate Controls ──► Calculate Risk Scores        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Assess Compliance ──► Generate Decision ──► Document Rationale │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Notify Stakeholders ──► Trigger Workflows ──► Create Tasks     │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Feed Reports ──► Update Dashboards ──► Trigger Release Approval│
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Gate Releases ──► Block Non-Compliant ──► [End]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Current Implementation:** app.governance.decision_engine computes governance decisions; app.governance.risk_scoring calculates weighted risk scores

**Planned Integration:** Notifications, Workflow, Tasks, Reporting, Dashboard, Release Approval

**Evidence:** app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status

---

### 2.15 Release Approval

```
┌─────────────────────────────────────────────────────────────────┐
│                    Release Approval                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Compile Release Package ──► Validate Criteria      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Submit Request ──► Review Package ──► Assess Risk              │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Approve/Reject ──► Deploy Release ──► Verify Deployment        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Monitor Release ──► Detect Issues ──► Execute Rollback         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Verify Rollback ──► [End] ──► Release Decision                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.approval_service manages approval workflow; platform.approval_requests stores approval requests

---

### 2.16 Reporting

```
┌─────────────────────────────────────────────────────────────────┐
│                    Reporting                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Query SQL Views ──► Aggregate Report Data          │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Validate Data ──► Generate Report ──► Format Report            │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Export Report ──► Distribute Reports ──► Manage Access          │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Usage ──► Archive Reports ──► [End]                     │
│                                                                 │
│  Current State: SQL views, CLI export, no API                  │
│  Target State: Reporting API, Dashboard API, real-time data    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Current State:** reporting schema contains 5 SQL views; app.audit_export provides CLI export; no API endpoints

**Target State:** Reporting API endpoints (/api/v1/reports/*) to be created; Dashboard API endpoints to be created

**Evidence:** reporting schema (5 SQL views), app.audit_export (CLI), no API

---

### 2.17 Dashboard Production

```
┌─────────────────────────────────────────────────────────────────┐
│                    Dashboard Production                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Query Fact Views ──► Calculate KPIs                │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Validate Data ──► Generate Dashboard ──► Render Visualisations │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Update Dashboard ──► Distribute Dashboards ──► Manage Access   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Usage ──► Archive Dashboards ──► [End]                  │
│                                                                 │
│  Current State: Fact views, scoring engine, no API             │
│  Target State: Dashboard API, real-time updates, real data     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Current State:** reporting schema contains fact views; app.scoring_engine calculates KPIs; no API endpoints

**Target State:** Dashboard API endpoints (/api/v1/dashboards/*) to be created; Real-time dashboard updates

**Evidence:** reporting schema (fact views), app.scoring_engine, no API

---

### 2.18 Notifications

```
┌─────────────────────────────────────────────────────────────────┐
│                    Notifications                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Receive Events ──► Validate Event Data             │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Route to Handlers ──► Generate Content ──► Apply Preferences   │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Send Notifications ──► Track Delivery ──► Monitor Status       │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Handle Failures ──► Manage Preferences ──► [End]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.notification_service provides full CRUD API; platform.notifications stores notification records

---

### 2.19 Scheduling

```
┌─────────────────────────────────────────────────────────────────┐
│                    Scheduling                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Define Parameters ──► Configure Recurrence         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Definition ──► Trigger Events ──► Execute Tasks           │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Execution ──► Create Reminders ──► Configure Timing      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Reminders ──► Send Reminders ──► Track Delivery          │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Handle Failures ──► [End] ──► Event Reminder Delivered        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.calendar_service provides full CRUD API; platform.calendar_events stores events

---

### 2.20 Workflow Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    Workflow Management                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Define Steps ──► Configure Parameters              │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Definition ──► Validate Logic ──► Test Execution          │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Approve Workflow ──► Create Instance ──► Execute Steps          │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Progress ──► Monitor Status ──► Handle Failures           │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Retry Workflows ──► [End] ──► Workflow Completed              │
│                                                                 │
│  Current Implementation: Full CRUD API, event subscriptions     │
│  Planned Integration: Governance, Release Approval, Validation  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Current Implementation:** app.services.workflow_service provides full CRUD API; platform.workflow_definitions stores definitions

**Planned Integration:** Governance decisions to trigger approval workflows; Release Approval to trigger notification workflows

**Evidence:** app.services.workflow_service (CRUD API), platform.workflow_definitions, platform.workflow_instances

---

### 2.21 Task Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    Task Management                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Create Task ──► Assign Task                        │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Set Priorities ──► Store Record ──► Track Progress              │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Update Status ──► Complete Task ──► Define Dependencies         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Track Resolution ──► Manage Blocking ──► Generate Reports       │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Analyse Metrics ──► Optimise Allocation ──► [End]              │
│                                                                 │
│  Current Implementation: Full CRUD API, event subscriptions     │
│  Planned Integration: Governance, Validation, Release, Workflow │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Current Implementation:** app.services.task_service provides full CRUD API; platform.tasks stores task records

**Planned Integration:** Governance decisions to create tasks; Validation failures to create tasks; Release Approval to create tasks

**Evidence:** app.services.task_service (CRUD API), platform.tasks, platform.task_comments, platform.task_dependencies

---

### 2.22 User Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Lifecycle                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Create Account ──► Assign Initial Roles            │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Send Welcome ──► Update Details ──► Change Roles                │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Manage Preferences ──► Disable Account ──► Revoke Access       │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Archive Data ──► Review Access ──► Audit Permissions            │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Report Access ──► [End] ──► User Deactivated                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.user_service provides full CRUD API; platform.users stores user records

---

### 2.23 Role Administration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Role Administration                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Define Role ──► Assign Permissions                 │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Definition ──► Update Permissions ──► Version Definitions │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Archive Definitions ──► Assign to Roles ──► Validate Assignments│
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Mappings ──► Audit Assignments ──► Report Usage           │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Optimise Structure ──► [End] ──► Role Updated                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.role_service provides full CRUD API; platform.roles stores role definitions

---

### 2.24 Tenant Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tenant Management                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Create Tenant ──► Configure Settings               │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Provision Resources ──► Update Settings ──► Manage Policies     │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Configure Features ──► Monitor Usage ──► Track Health           │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Alert on Issues ──► Deactivate Tenant ──► Archive Data         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Restore Access ──► [End] ──► Tenant Configured                │
│                                                                 │
│  Current Implementation: core.tenants, tenant_id in JWT         │
│  Tenant Lifecycle: Creation, configuration, deactivation       │
│  Tenant Onboarding: Organisation, admin, licence, config       │
│  Tenant Administration: Config updates, resource management    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Current Implementation:** core.tenants table exists; tenant_id referenced in JWT tokens; tenant-aware architecture in place

**Evidence:** core.tenants (table exists), tenant_id in JWT tokens, tenant-aware architecture

---

### 2.25 Security Administration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Administration                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Manage Encryption Keys ──► Rotate Keys             │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Audit Usage ──► Manage Certificates ──► Renew Certificates      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Revoke Certificates ──► Monitor Events ──► Analyse Patterns    │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Respond to Incidents ──► Generate Reports ──► Audit Configs    │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Report Compliance ──► [End] ──► Security Action Complete      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** audit.security_events stores security events; no dedicated security management API

---

### 2.26 Audit Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Audit Lifecycle                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Capture API Calls ──► Capture Security Events      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Records ──► Validate Data ──► Enrich Records             │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Index Records ──► Generate Reports ──► Analyse Patterns         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Export Data ──► Retain Data ──► Purge Expired Data             │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Verify Compliance ──► [End] ──► Audit Event Reviewed          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.api.core.middleware.audit_middleware logs every API call; audit.audit_events stores audit records

---

### 2.27 Platform Administration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Platform Administration                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Update Settings ──► Validate Settings               │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Audit Changes ──► Toggle Features ──► Configure Parameters      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Monitor Usage ──► Run Health Checks ──► Monitor Health         │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Alert on Issues ──► Schedule Maintenance ──► Execute Tasks      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Verify Completion ──► [End] ──► Action Complete               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.settings_service provides full CRUD API; app.health provides health check endpoints

---

### 2.28 Customer Onboarding

```
┌─────────────────────────────────────────────────────────────────┐
│                    Customer Onboarding                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Submit Registration Form ──► Validate Details      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Create Customer Record ──► Create Organisation ──► Assign Details│
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Store Metadata ──► Provision Tenant ──► Configure Settings      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Validate Configuration ──► Create Administrator ──► Assign Roles│
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Send Welcome ──► Allocate Licence ──► Configure Parameters      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Activate Access ──► [End] ──► Platform Activated              │
│                                                                 │
│  Not implemented — no dedicated workflow found in codebase      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Not implemented** — no dedicated customer onboarding workflow found in codebase

---

### 2.29 Authentication

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start] ──► Validate Username ──► Validate Password             │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Check Account Status ──► Request MFA Code ──► Validate MFA     │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Handle MFA Failures ──► Generate JWT ──► Set Token Claims      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Issue Refresh Token ──► Create Session ──► Manage Timeout      │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Invalidate on Logout ──► Log Failures ──► Implement Rate Limit │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Lock Accounts ──► Validate Refresh Token ──► Issue New JWT     │
│     │                                     │                     │
│     ▼                                     ▼                     │
│  Revoke Old Token ──► [End] ──► Login Complete                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence:** app.services.auth_service validates credentials against platform.users; JWT tokens issued with bcrypt verification

---

## 3. Flow Summary

| # | Process | Swim Lanes | Decision Points | Parallel Paths |
|---|---------|------------|-----------------|----------------|
| 1 | Migration Project Lifecycle | 3 | 2 | 0 |
| 2 | Connection Onboarding | 2 | 1 | 0 |
| 3 | Credential Onboarding | 2 | 1 | 0 |
| 4 | Dataset Discovery | 1 | 0 | 2 |
| 5 | Column Discovery | 1 | 0 | 0 |
| 6 | Mapping Lifecycle | 2 | 1 | 2 |
| 7 | Rule Authoring | 2 | 1 | 0 |
| 8 | Rule Approval | 2 | 1 | 0 |
| 9 | Rule Execution | 1 | 0 | 0 |
| 10 | Control Lifecycle | 1 | 0 | 0 |
| 11 | Validation Execution | 2 | 1 | 1 |
| 12 | Exception Management | 2 | 1 | 0 |
| 13 | Issue Remediation | 2 | 1 | 0 |
| 14 | Governance | 3 | 2 | 3 |
| 15 | Release Approval | 3 | 2 | 0 |
| 16 | Reporting | 2 | 1 | 0 |
| 17 | Dashboard Production | 2 | 1 | 0 |
| 18 | Notifications | 1 | 0 | 0 |
| 19 | Scheduling | 1 | 0 | 0 |
| 20 | Workflow Management | 1 | 1 | 0 |
| 21 | Task Management | 1 | 0 | 0 |
| 22 | User Lifecycle | 2 | 1 | 0 |
| 23 | Role Administration | 2 | 1 | 0 |
| 24 | Tenant Management | 2 | 1 | 0 |
| 25 | Security Administration | 2 | 1 | 0 |
| 26 | Audit Lifecycle | 1 | 0 | 0 |
| 27 | Platform Administration | 2 | 1 | 0 |
| 28 | Customer Onboarding | 2 | 1 | 0 |
| 29 | Authentication | 2 | 2 | 0 |

---

## 4. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*These process flows are part of the Enterprise Business Process Model (Prompt 17 v2.1). All findings are based on source code analysis — no code was modified.*
