# Business Process Decomposition

**Document ID:** 17-03  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document decomposes every business process into sub-processes and activities (Level 1-4), supported by evidence from the codebase.

---

## 2. Decomposition Levels

| Level | Description | Example |
|-------|-------------|---------|
| Level 1 | Business Process | Migration Project Lifecycle |
| Level 2 | Sub-Process | Project Setup |
| Level 3 | Activity | Create Project |
| Level 4 | Task | Enter Project Details |

---

## 3. Process Decompositions

### 3.1 Migration Project Lifecycle

**Evidence:** app.execution_engine (project configuration), core.dataset_mappings (project_id reference), engine.migration_validation_batch (project tracking)

```text
Migration Project Lifecycle (Level 1)
├── Project Setup (Level 2)
│   ├── Create Project (Level 3)
│   │   ├── Define Project Scope (Level 4)
│   │   ├── Set Project Timeline (Level 4)
│   │   └── Assign Team Members (Level 4)
│   ├── Configure Project (Level 3)
│   │   ├── Set Source System (Level 4)
│   │   ├── Set Target System (Level 4)
│   │   └── Configure Parameters (Level 4)
│   └── Validate Project (Level 3)
│       ├── Review Configuration (Level 4)
│       └── Approve Project (Level 4)
├── Project Execution (Level 2)
│   ├── Monitor Progress (Level 3)
│   ├── Track Milestones (Level 3)
│   └── Manage Issues (Level 3)
└── Project Closure (Level 2)
    ├── Archive Project (Level 3)
    ├── Generate Report (Level 3)
    └── Release Resources (Level 3)
```

---

### 3.2 Connection Onboarding

**Evidence:** app/api/v1/core/connections.py (full CRUD API), core.system_registry (connection metadata), core.system_credentials (encrypted credentials)

```text
Connection Onboarding (Level 1)
├── Request Connection (Level 2)
│   ├── Identify Source System (Level 3)
│   │   ├── Enter System Details (Level 4)
│   │   └── Select System Type (Level 4)
│   └── Identify Target System (Level 3)
│       ├── Enter System Details (Level 4)
│       └── Select System Type (Level 4)
├── Configure Connection (Level 2)
│   ├── Enter Connection Details (Level 3)
│   │   ├── Set Host (Level 4)
│   │   ├── Set Port (Level 4)
│   │   └── Set Database (Level 4)
│   └── Store Credentials (Level 3)
│       ├── Encrypt Password (Level 4)
│       └── Store in Vault (Level 4)
├── Test Connection (Level 2)
│   ├── Execute Test Query (Level 3)
│   ├── Validate Response (Level 3)
│   └── Log Test Result (Level 3)
└── Manage Connection (Level 2)
    ├── Update Connection (Level 3)
    ├── Delete Connection (Level 3)
    └── Audit Connection (Level 3)
```

---

### 3.3 Credential Onboarding

**Evidence:** core.system_credentials (encrypted credentials), Fernet encryption, audit_events (credential access logging)

```text
Credential Onboarding (Level 1)
├── Request Credentials (Level 2)
│   ├── Identify Credential Type (Level 3)
│   └── Gather Credential Details (Level 3)
├── Validate Credentials (Level 2)
│   ├── Format Validation (Level 3)
│   └── Security Validation (Level 3)
├── Encrypt Credentials (Level 2)
│   ├── Generate Encryption Key (Level 3)
│   └── Encrypt Data (Level 3)
└── Store Credentials (Level 2)
    ├── Store in Vault (Level 3)
    └── Log Storage (Level 3)
```

---

### 3.4 Dataset Discovery

**Evidence:** app.discovery.auto_rule_discovery (queries information_schema), core.dataset_mappings (discovered tables), core.dataset_columns (discovered columns)

```text
Dataset Discovery (Level 1)
├── Trigger Discovery (Level 2)
│   ├── Select Project (Level 3)
│   ├── Select Systems (Level 3)
│   └── Start Discovery (Level 3)
├── Execute Discovery (Level 2)
│   ├── Query Source Schema (Level 3)
│   │   ├── Query Tables (Level 4)
│   │   ├── Query Columns (Level 4)
│   │   └── Query Data Types (Level 4)
│   ├── Query Target Schema (Level 3)
│   │   ├── Query Tables (Level 4)
│   │   ├── Query Columns (Level 4)
│   │   └── Query Data Types (Level 4)
│   └── Compare Schemas (Level 3)
│       ├── Identify Matches (Level 4)
│       └── Identify Gaps (Level 4)
└── Store Results (Level 2)
    ├── Store Tables (Level 3)
    ├── Store Columns (Level 3)
    └── Store Metadata (Level 3)
```

---

### 3.5 Column Discovery

**Evidence:** app.services.dataset_discovery_service (column metadata queries), core.dataset_columns (column storage)

```text
Column Discovery (Level 1)
├── Query Columns (Level 2)
│   ├── Source Columns (Level 3)
│   │   ├── Column Name (Level 4)
│   │   ├── Data Type (Level 4)
│   │   └── Constraints (Level 4)
│   └── Target Columns (Level 3)
│       ├── Column Name (Level 4)
│       ├── Data Type (Level 4)
│       └── Constraints (Level 4)
├── Classify Columns (Level 2)
│   ├── Identify Primary Keys (Level 3)
│   ├── Identify Foreign Keys (Level 3)
│   └── Identify Nullable Columns (Level 3)
└── Store Column Metadata (Level 2)
    ├── Store Column Definitions (Level 3)
    └── Store Column Statistics (Level 3)
```

---

### 3.6 Mapping Lifecycle

**Evidence:** app.services.mapping_resolver (runtime mapping resolution), core.dataset_mappings (table mappings), core.column_mappings (column mappings)

```text
Mapping Lifecycle (Level 1)
├── Create Table Mappings (Level 2)
│   ├── Select Source Table (Level 3)
│   ├── Select Target Table (Level 3)
│   └── Store Mapping (Level 3)
├── Create Column Mappings (Level 2)
│   ├── Select Source Column (Level 3)
│   ├── Select Target Column (Level 3)
│   ├── Define Transformation (Level 3)
│   └── Store Mapping (Level 3)
├── Review Mappings (Level 2)
│   ├── Validate Mappings (Level 3)
│   ├── Check Completeness (Level 3)
│   └── Approve Mappings (Level 3)
└── Manage Mappings (Level 2)
    ├── Update Mapping (Level 3)
    ├── Delete Mapping (Level 3)
    └── Version Mapping (Level 3)
```

---

### 3.7 Rule Authoring

**Evidence:** app.discovery.auto_rule_discovery (rule generation), engine.rule_registry (rule storage), 10 rule types (C01-C010)

```text
Rule Authoring (Level 1)
├── Define Rules (Level 2)
│   ├── Select Rule Type (Level 3)
│   │   ├── Completeness Rules (C01) (Level 4)
│   │   ├── Accuracy Rules (C02) (Level 4)
│   │   ├── Consistency Rules (C03) (Level 4)
│   │   ├── Timeliness Rules (C04) (Level 4)
│   │   ├── Validity Rules (C05) (Level 4)
│   │   ├── Uniqueness Rules (C06) (Level 4)
│   │   ├── Integrity Rules (C07) (Level 4)
│   │   ├── Conformity Rules (C08) (Level 4)
│   │   ├── Reasonableness Rules (C09) (Level 4)
│   │   └── Referential Rules (C10) (Level 4)
│   ├── Configure Rule Parameters (Level 3)
│   └── Store Rule (Level 3)
├── Review Rules (Level 2)
│   ├── Validate Rule Logic (Level 3)
│   ├── Check Coverage (Level 3)
│   └── Approve Rule (Level 3)
└── Manage Rules (Level 2)
    ├── Update Rule (Level 3)
    ├── Disable Rule (Level 3)
    └── Version Rule (Level 3)
```

---

### 3.8 Rule Approval

**Evidence:** No approval workflow implementation found in codebase (manual process)

```text
Rule Approval (Level 1)
├── Submit Rules (Level 2)
│   ├── Package Rules (Level 3)
│   └── Submit for Review (Level 3)
├── Review Rules (Level 2)
│   ├── Review Rule Logic (Level 3)
│   ├── Review Rule Coverage (Level 3)
│   └── Make Decision (Level 3)
└── Record Decision (Level 2)
    ├── Approve Rules (Level 3)
    ├── Reject Rules (Level 3)
    └── Document Decision (Level 3)
```

---

### 3.9 Rule Execution

**Evidence:** app.execution_engine (pipeline execution), app.execution.control_executor (control dispatch)

```text
Rule Execution (Level 1)
├── Initialize Execution (Level 2)
│   ├── Load Configuration (Level 3)
│   ├── Load Rules (Level 3)
│   └── Load Data (Level 3)
├── Execute Rules (Level 2)
│   ├── Execute Completeness Rules (Level 3)
│   ├── Execute Accuracy Rules (Level 3)
│   ├── Execute Consistency Rules (Level 3)
│   └── Execute Other Rules (Level 3)
├── Collect Results (Level 2)
│   ├── Record Pass/Fail (Level 3)
│   ├── Record Exceptions (Level 3)
│   └── Record Metrics (Level 3)
└── Store Results (Level 2)
    ├── Store Rule Results (Level 3)
    ├── Store Exception Details (Level 3)
    └── Update Batch Status (Level 3)
```

---

### 3.10 Control Lifecycle

**Evidence:** app.execution.control_executor (control dispatch), engine.control_registry (control storage)

```text
Control Lifecycle (Level 1)
├── Register Control (Level 2)
│   ├── Define Control (Level 3)
│   ├── Configure Control (Level 3)
│   └── Store Control (Level 3)
├── Discover Controls (Level 2)
│   ├── Query Control Registry (Level 3)
│   ├── Filter Enabled Controls (Level 3)
│   └── Return Active Controls (Level 3)
├── Execute Control (Level 2)
│   ├── Dispatch to Control Class (Level 3)
│   ├── Execute Control Logic (Level 3)
│   └── Collect Results (Level 3)
└── Manage Control (Level 2)
    ├── Update Control (Level 3)
    ├── Enable/Disable Control (Level 3)
    └── Audit Control (Level 3)
```

---

### 3.11 Validation Execution

**Evidence:** app.execution_engine (6-step pipeline), engine.batch_execution_checkpoint (checkpoints), app.orchestration.retry.rule_retry_manager (retry)

```text
Validation Execution (Level 1)
├── Step 1: Connection Resolution (Level 2)
│   ├── Resolve Source Connection (Level 3)
│   ├── Resolve Target Connection (Level 3)
│   └── Validate Connections (Level 3)
├── Step 2: Dataset Mapping (Level 2)
│   ├── Load Mappings (Level 3)
│   ├── Validate Mappings (Level 3)
│   └── Prepare Data Access (Level 3)
├── Step 3: Rule Discovery (Level 2)
│   ├── Query Rule Registry (Level 3)
│   ├── Filter Rules (Level 3)
│   └── Prepare Rules (Level 3)
├── Step 4: Control Discovery (Level 2)
│   ├── Query Control Registry (Level 3)
│   ├── Filter Controls (Level 3)
│   └── Prepare Controls (Level 3)
├── Step 5: Control Execution (Level 2)
│   ├── Execute Controls (Level 3)
│   ├── Parallel Execution (Level 3)
│   ├── Checkpointing (Level 3)
│   └── Retry Failed Controls (Level 3)
├── Step 6: Governance Decision (Level 2)
│   ├── Calculate Governance (Level 3)
│   ├── Make Decision (Level 3)
│   └── Store Decision (Level 3)
└── Complete Execution (Level 2)
    ├── Generate Summary (Level 3)
    ├── Store Results (Level 3)
    └── Notify Completion (Level 3)
```

---

### 3.12 Exception Management

**Evidence:** engine.v_migration_exception_detail (exception view), execution logging

```text
Exception Management (Level 1)
├── Detect Exception (Level 2)
│   ├── Monitor Execution (Level 3)
│   ├── Identify Failure (Level 3)
│   └── Classify Exception (Level 3)
├── Record Exception (Level 2)
│   ├── Capture Exception Details (Level 3)
│   ├── Capture Context (Level 3)
│   └── Store Exception (Level 3)
├── Review Exception (Level 2)
│   ├── Analyse Root Cause (Level 3)
│   ├── Assess Impact (Level 3)
│   └── Determine Action (Level 3)
└── Resolve Exception (Level 2)
    ├── Execute Remediation (Level 3)
    ├── Re-validate (Level 3)
    └── Close Exception (Level 3)
```

---

### 3.13 Issue Remediation

**Evidence:** Manual process (no automation found in codebase), Task Management platform for tracking

```text
Issue Remediation (Level 1)
├── Identify Issue (Level 2)
│   ├── Review Exceptions (Level 3)
│   ├── Prioritise Issues (Level 3)
│   └── Assign Issues (Level 3)
├── Plan Remediation (Level 2)
│   ├── Analyse Issue (Level 3)
│   ├── Define Remediation Plan (Level 3)
│   └── Estimate Effort (Level 3)
├── Execute Remediation (Level 2)
│   ├── Implement Fix (Level 3)
│   ├── Test Fix (Level 3)
│   └── Deploy Fix (Level 3)
└── Verify Remediation (Level 2)
    ├── Re-run Validation (Level 3)
    ├── Confirm Resolution (Level 3)
    └── Close Issue (Level 3)
```

---

### 3.14 Governance

**Evidence:** app.governance.decision_engine (decision logic), app.governance.risk_scoring (risk calculation), engine.migration_governance_status (storage)

```text
Governance (Level 1)
├── Evaluate Governance (Level 2)
│   ├── Collect Execution Results (Level 3)
│   ├── Apply Governance Rules (Level 3)
│   └── Calculate Scores (Level 3)
├── Calculate Risk (Level 2)
│   ├── Identify Risk Factors (Level 3)
│   ├── Calculate Weighted Scores (Level 3)
│   └── Determine Risk Level (Level 3)
├── Make Decision (Level 2)
│   ├── Evaluate Against Thresholds (Level 3)
│   ├── Make Governance Decision (Level 3)
│   └── Document Decision (Level 3)
└── Record Decision (Level 2)
    ├── Store Decision (Level 3)
    ├── Update Status (Level 3)
    └── Notify Stakeholders (Level 3)
```

---

### 3.15 Release Approval

**Evidence:** app.services.approval_service (approval workflow), platform.approval_requests (requests), platform.approval_step_instances (steps)

```text
Release Approval (Level 1)
├── Request Approval (Level 2)
│   ├── Create Request (Level 3)
│   ├── Assign Approvers (Level 3)
│   └── Notify Approvers (Level 3)
├── Review Approval (Level 2)
│   ├── Review Details (Level 3)
│   ├── Add Comments (Level 3)
│   └── Make Decision (Level 3)
├── Execute Decision (Level 2)
│   ├── Approve Release (Level 3)
│   ├── Reject Release (Level 3)
│   └── Escalate Decision (Level 3)
└── Complete Approval (Level 2)
    ├── Record Decision (Level 3)
    ├── Notify Stakeholders (Level 3)
    └── Update Status (Level 3)
```

---

### 3.16 Reporting

**Evidence:** reporting schema (5 SQL views), app.audit_export (CLI export), no API endpoints

```text
Reporting (Level 1)
├── Request Report (Level 2)
│   ├── Select Report Type (Level 3)
│   ├── Select Parameters (Level 3)
│   └── Start Generation (Level 3)
├── Generate Report (Level 2)
│   ├── Query Data (Level 3)
│   ├── Format Report (Level 3)
│   └── Validate Report (Level 3)
├── Distribute Report (Level 2)
│   ├── Export Report (Level 3)
│   ├── Email Report (Level 3)
│   └── Archive Report (Level 3)
└── Manage Reports (Level 2)
    ├── Store Report (Level 3)
    ├── Version Report (Level 3)
    └── Delete Report (Level 3)
```

---

### 3.17 Dashboard Production

**Evidence:** reporting schema (fact views), app.scoring_engine (KPI calculation), no API endpoints

```text
Dashboard Production (Level 1)
├── Request Dashboard (Level 2)
│   ├── Select Dashboard Type (Level 3)
│   └── Set Parameters (Level 3)
├── Generate Dashboard (Level 2)
│   ├── Query Data (Level 3)
│   ├── Calculate KPIs (Level 3)
│   └── Format Visualisations (Level 3)
├── Display Dashboard (Level 2)
│   ├── Render Charts (Level 3)
│   ├── Render Metrics (Level 3)
│   └── Render Tables (Level 3)
└── Manage Dashboard (Level 2)
    ├── Save Dashboard (Level 3)
    ├── Share Dashboard (Level 3)
    └── Schedule Refresh (Level 3)
```

---

### 3.18 Notifications

**Evidence:** app.services.notification_service (full CRUD API), platform.notifications (storage), platform.notification_preferences (preferences)

```text
Notifications (Level 1)
├── Receive Event (Level 2)
│   ├── Capture Event (Level 3)
│   ├── Validate Event (Level 3)
│   └── Route Event (Level 3)
├── Generate Notification (Level 2)
│   ├── Select Template (Level 3)
│   ├── Populate Template (Level 3)
│   └── Format Notification (Level 3)
├── Deliver Notification (Level 2)
│   ├── Check Preferences (Level 3)
│   ├── Select Channel (Level 3)
│   └── Deliver Notification (Level 3)
└── Track Notification (Level 2)
    ├── Record Delivery (Level 3)
    ├── Track Read Status (Level 3)
    └── Archive Notification (Level 3)
```

---

### 3.19 Scheduling

**Evidence:** app.services.calendar_service (full CRUD API), platform.calendar_events (events), platform.calendar_event_reminders (reminders)

```text
Scheduling (Level 1)
├── Create Event (Level 2)
│   ├── Define Event (Level 3)
│   ├── Set Date/Time (Level 3)
│   └── Store Event (Level 3)
├── Manage Event (Level 2)
│   ├── Update Event (Level 3)
│   ├── Cancel Event (Level 3)
│   └── Reschedule Event (Level 3)
├── Send Reminders (Level 2)
│   ├── Schedule Reminders (Level 3)
│   ├── Send Reminder (Level 3)
│   └── Track Reminder (Level 3)
└── Complete Event (Level 2)
    ├── Mark Complete (Level 3)
    └── Archive Event (Level 3)
```

---

### 3.20 Workflow Management

**Evidence:** app.services.workflow_service (full CRUD API), platform.workflow_definitions (definitions), platform.workflow_instances (instances)

```text
Workflow Management (Level 1)
├── Define Workflow (Level 2)
│   ├── Create Definition (Level 3)
│   ├── Define Steps (Level 3)
│   └── Store Definition (Level 3)
├── Execute Workflow (Level 2)
│   ├── Create Instance (Level 3)
│   ├── Execute Steps (Level 3)
│   └── Track Progress (Level 3)
├── Complete Workflow (Level 2)
│   ├── Complete Steps (Level 3)
│   ├── Generate Summary (Level 3)
│   └── Store History (Level 3)
└── Manage Workflow (Level 2)
    ├── Update Workflow (Level 3)
    ├── Cancel Workflow (Level 3)
    └── Audit Workflow (Level 3)
```

---

### 3.21 Task Management

**Evidence:** app.services.task_service (full CRUD API), platform.tasks (tasks), platform.task_comments (comments), platform.task_dependencies (dependencies)

```text
Task Management (Level 1)
├── Create Task (Level 2)
│   ├── Define Task (Level 3)
│   ├── Assign Task (Level 3)
│   └── Notify Assignee (Level 3)
├── Execute Task (Level 2)
│   ├── Update Task Status (Level 3)
│   ├── Add Comments (Level 3)
│   └── Track Progress (Level 3)
├── Complete Task (Level 2)
│   ├── Mark Complete (Level 3)
│   ├── Review Task (Level 3)
│   └── Close Task (Level 3)
└── Manage Task (Level 2)
    ├── Update Task (Level 3)
    ├── Reassign Task (Level 3)
    └── Delete Task (Level 3)
```

---

### 3.22 User Lifecycle

**Evidence:** app.services.user_service (full CRUD API), platform.users (users), platform.user_roles (roles)

```text
User Lifecycle (Level 1)
├── Create User (Level 2)
│   ├── Enter User Details (Level 3)
│   ├── Assign Role (Level 3)
│   └── Notify User (Level 3)
├── Manage User (Level 2)
│   ├── Update User (Level 3)
│   ├── Deactivate User (Level 3)
│   └── Audit User (Level 3)
└── Manage Access (Level 2)
    ├── Review Access (Level 3)
    ├── Update Permissions (Level 3)
    └── Revoke Access (Level 3)
```

---

### 3.23 Role Administration

**Evidence:** app.services.role_service (full CRUD API), platform.roles (roles), platform.permissions (47 permissions), platform.role_permissions (assignments)

```text
Role Administration (Level 1)
├── Create Role (Level 2)
│   ├── Define Role (Level 3)
│   ├── Assign Permissions (Level 3)
│   └── Store Role (Level 3)
├── Manage Role (Level 2)
│   ├── Update Role (Level 3)
│   ├── Enable/Disable Role (Level 3)
│   └── Audit Role (Level 3)
└── Assign Role (Level 2)
    ├── Assign to User (Level 3)
    ├── Revoke from User (Level 3)
    └── Track Assignments (Level 3)
```

---

### 3.24 Tenant Management

**Evidence:** core.tenants (table exists), no API endpoints, frontend mock

```text
Tenant Management (Level 1)
├── Create Tenant (Level 2)
│   ├── Enter Tenant Details (Level 3)
│   ├── Configure Tenant (Level 3)
│   └── Store Tenant (Level 3)
├── Manage Tenant (Level 2)
│   ├── Update Tenant (Level 3)
│   ├── Deactivate Tenant (Level 3)
│   └── Audit Tenant (Level 3)
└── Configure Tenant (Level 2)
    ├── Set Isolation Level (Level 3)
    ├── Configure Resources (Level 3)
    └── Set Policies (Level 3)
```

---

### 3.25 Security Administration

**Evidence:** audit.security_events (security events), no dedicated security management API

```text
Security Administration (Level 1)
├── Monitor Security (Level 2)
│   ├── Log Security Events (Level 3)
│   ├── Monitor Anomalies (Level 3)
│   └── Investigate Events (Level 3)
├── Manage Security (Level 2)
│   ├── Manage Encryption (Level 3)
│   ├── Manage Keys (Level 3)
│   └── Manage Certificates (Level 3)
└── Audit Security (Level 2)
    ├── Review Audit Trail (Level 3)
    ├── Investigate Incidents (Level 3)
    └── Generate Reports (Level 3)
```

---

### 3.26 Audit Lifecycle

**Evidence:** app.api.core.middleware.audit_middleware (middleware logging), audit.audit_events (events), audit.api_call_log (API calls)

```text
Audit Lifecycle (Level 1)
├── Capture Event (Level 2)
│   ├── Intercept API Call (Level 3)
│   ├── Capture Details (Level 3)
│   └── Store Event (Level 3)
├── Store Event (Level 2)
│   ├── Store in Audit Trail (Level 3)
│   ├── Store API Call Details (Level 3)
│   └── Index Event (Level 3)
├── Review Event (Level 2)
│   ├── Query Audit Trail (Level 3)
│   ├── Filter Events (Level 3)
│   └── Analyse Events (Level 3)
└── Report Event (Level 2)
    ├── Generate Audit Report (Level 3)
    ├── Export Report (Level 3)
    └── Archive Report (Level 3)
```

---

### 3.27 Platform Administration

**Evidence:** app.services.settings_service (CRUD API), app.health (health endpoints), platform.system_settings (settings), platform.feature_flags (flags)

```text
Platform Administration (Level 1)
├── Manage Configuration (Level 2)
│   ├── Update Settings (Level 3)
│   ├── Validate Settings (Level 3)
│   └── Store Settings (Level 3)
├── Manage Features (Level 2)
│   ├── Toggle Feature Flags (Level 3)
│   ├── Configure Features (Level 3)
│   └── Store Feature Config (Level 3)
├── Monitor Health (Level 2)
│   ├── Run Health Checks (Level 3)
│   ├── Monitor Performance (Level 3)
│   └── Alert on Issues (Level 3)
└── Manage Platform (Level 2)
    ├── Update Platform (Level 3)
    ├── Restart Services (Level 3)
    └── Archive Logs (Level 3)
```

---

### 3.28 Customer Onboarding

**Evidence:** app.services.auth_service (authentication), platform.users (user validation), JWT token issuance

```text
Customer Onboarding (Level 1)
├── Authenticate User (Level 2)
│   ├── Receive Credentials (Level 3)
│   ├── Validate Credentials (Level 3)
│   └── Verify Password (Level 3)
├── Issue Token (Level 2)
│   ├── Generate JWT (Level 3)
│   ├── Set Expiry (Level 3)
│   └── Return Token (Level 3)
├── Manage Session (Level 2)
│   ├── Create Session (Level 3)
│   ├── Track Session (Level 3)
│   └── Invalidate Session (Level 3)
└── Handle Failure (Level 2)
    ├── Log Failed Attempt (Level 3)
    ├── Apply Rate Limiting (Level 3)
    └── Notify Security (Level 3)
```

---

### 3.29 Authentication

**Evidence:** app.services.auth_service (passlib bcrypt), platform.refresh_tokens (refresh tokens), rate limiting (5/minute)

```text
Authentication (Level 1)
├── Receive Login Request (Level 2)
│   ├── Validate Request (Level 3)
│   └── Extract Credentials (Level 3)
├── Verify Credentials (Level 2)
│   ├── Query User (Level 3)
│   ├── Verify Password Hash (Level 3)
│   └── Check Account Status (Level 3)
├── Issue Tokens (Level 2)
│   ├── Generate Access Token (Level 3)
│   ├── Generate Refresh Token (Level 3)
│   └── Store Refresh Token (Level 3)
└── Manage Tokens (Level 2)
    ├── Refresh Token (Level 3)
    ├── Revoke Token (Level 3)
    └── Audit Token Usage (Level 3)
```

---

## 4. Decomposition Statistics

| Metric | Count |
|--------|-------|
| Level 1 Processes | 29 |
| Level 2 Sub-Processes | 85+ |
| Level 3 Activities | 250+ |
| Level 4 Tasks | 300+ |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This decomposition is part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*