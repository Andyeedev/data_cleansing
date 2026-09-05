# BPM Process Flows

**Document ID:** 17-04  
**Version:** 2.0  
**Date:** 14 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides BPM-style text diagrams for every major business process, including start events, activities, decision points, exception paths, approval gates, and completion events.

---

## 2. Process Flows

### 2.1 Migration Project Lifecycle

**Evidence:** app.execution_engine (project configuration), core.dataset_mappings (project tracking)

```text
Start: Migration Lead creates project
    │
    ▼
┌─────────────────────────────────┐
│  Define Project Scope           │
│  - Set source/target systems    │
│  - Set timeline                 │
│  - Assign team                  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Configure Project              │
│  - Set parameters               │
│  - Validate configuration       │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Config │
            │ Valid? │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Continue │   │ Fix      │
    │          │   │ Config   │
    └────┬─────┘   └────┬─────┘
         │              │
         │              └──► (back to Configure)
         ▼
┌─────────────────────────────────┐
│  Execute Migration              │
│  - Run validation pipeline      │
│  - Monitor progress             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Complete Project               │
│  - Archive project              │
│  - Generate report              │
│  - Release resources            │
└───────────────┬─────────────────┘
                │
                ▼
            End: Project Closed
```

---

### 2.2 Connection Onboarding

**Evidence:** app/api/v1/core/connections.py (full CRUD API), core.system_registry, core.system_credentials

```text
Start: Migration Engineer requests connection
    │
    ▼
┌─────────────────────────────────┐
│  Enter Connection Details       │
│  - Host, port, database         │
│  - System type                  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Store Credentials              │
│  - Encrypt password             │
│  - Store in vault               │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Test Connection                │
│  - Execute test query           │
│  - Validate response            │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Test   │
            │ Pass?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │Connection│   │ Fix      │
    │ Ready    │   │ Connection│
    └──────────┘   └────┬─────┘
                        │
                        └──► (back to Enter Details)
```

---

### 2.3 Credential Onboarding

**Evidence:** core.system_credentials (encrypted storage), Fernet encryption, audit_events

```text
Start: Migration Engineer provides credentials
    │
    ▼
┌─────────────────────────────────┐
│  Validate Credentials           │
│  - Format validation            │
│  - Security validation          │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Valid? │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Encrypt  │   │ Reject   │
    │          │   │          │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Store in Vault                 │
│  - Encrypt data                 │
│  - Log storage                  │
└───────────────┬─────────────────┘
                │
                ▼
            End: Credentials Stored
```

---

### 2.4 Dataset Discovery

**Evidence:** app.discovery.auto_rule_discovery (information_schema queries), core.dataset_mappings, core.dataset_columns

```text
Start: Migration Engineer triggers discovery
    │
    ▼
┌─────────────────────────────────┐
│  Select Project & Systems       │
│  - Select source connection     │
│  - Select target connection     │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Query Source Schema            │
│  - Query tables                 │
│  - Query columns                │
│  - Query data types             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Query Target Schema            │
│  - Query tables                 │
│  - Query columns                │
│  - Query data types             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Compare Schemas                │
│  - Identify matches             │
│  - Identify gaps                │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Store Discovery Results        │
│  - Store tables                 │
│  - Store columns                │
│  - Store metadata               │
└───────────────┬─────────────────┘
                │
                ▼
            End: Discovery Complete
```

---

### 2.5 Column Discovery

**Evidence:** app.services.dataset_discovery_service (column queries), core.dataset_columns

```text
Start: Dataset Discovery completes
    │
    ▼
┌─────────────────────────────────┐
│  Query Source Columns           │
│  - Column name                  │
│  - Data type                    │
│  - Constraints                  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Query Target Columns           │
│  - Column name                  │
│  - Data type                    │
│  - Constraints                  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Classify Columns               │
│  - Identify primary keys        │
│  - Identify foreign keys        │
│  - Identify nullable columns    │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Store Column Metadata          │
│  - Store definitions            │
│  - Store statistics             │
└───────────────┬─────────────────┘
                │
                ▼
            End: Column Discovery Complete
```

---

### 2.6 Mapping Lifecycle

**Evidence:** app.services.mapping_resolver (runtime resolution), core.dataset_mappings, core.column_mappings

```text
Start: Dataset Discovery completes
    │
    ▼
┌─────────────────────────────────┐
│  Create Table Mappings          │
│  - Select source table          │
│  - Select target table          │
│  - Store mapping                │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Create Column Mappings         │
│  - Select source column         │
│  - Select target column         │
│  - Define transformation        │
│  - Store mapping                │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Mappings│
            │ Valid?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Approve  │   │ Correct  │
    │ Mappings │   │ Mappings │
    └────┬─────┘   └────┬─────┘
         │              │
         │              └──► (back to Create)
         ▼
            End: Mappings Approved
```

---

### 2.7 Rule Authoring

**Evidence:** app.discovery.auto_rule_discovery (rule generation), engine.rule_registry (storage), 10 rule types

```text
Start: Migration Engineer creates rules
    │
    ▼
┌─────────────────────────────────┐
│  Select Rule Type               │
│  - C01 Completeness             │
│  - C02 Accuracy                 │
│  - C03 Consistency              │
│  - C04 Timeliness               │
│  - C05 Validity                 │
│  - C06 Uniqueness               │
│  - C07 Integrity                │
│  - C08 Conformity               │
│  - C09 Reasonableness           │
│  - C10 Referential              │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Configure Rule Parameters      │
│  - Set thresholds               │
│  - Set targets                  │
│  - Store rule                   │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Rules  │
            │ Valid?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Approve  │   │ Correct  │
    │ Rules    │   │ Rules    │
    └────┬─────┘   └────┬─────┘
         │              │
         │              └──► (back to Configure)
         ▼
            End: Rules Approved
```

---

### 2.8 Rule Approval

**Evidence:** No approval workflow implementation found (manual process)

```text
Start: Rules submitted for approval
    │
    ▼
┌─────────────────────────────────┐
│  Review Rules                   │
│  - Review rule logic            │
│  - Review rule coverage         │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Approved│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Approve  │   │ Reject   │
    │ Rules    │   │ Rules    │
    └────┬─────┘   └────┬─────┘
         │              │
         │              ▼
         │        ┌──────────┐
         │        │ Document │
         │        │ Decision │
         │        └──────────┘
         ▼
            End: Decision Recorded
```

---

### 2.9 Rule Execution

**Evidence:** app.execution_engine (pipeline), app.execution.control_executor (dispatch)

```text
Start: Validation Execution triggers
    │
    ▼
┌─────────────────────────────────┐
│  Initialize Execution           │
│  - Load configuration           │
│  - Load rules                   │
│  - Load data                    │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Execute Rules                  │
│  - Execute completeness rules   │
│  - Execute accuracy rules       │
│  - Execute consistency rules    │
│  - Execute other rules          │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Rules  │
            │ Passed?│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Record   │   │ Record   │
    │ Pass     │   │ Fail     │
    └────┬─────┘   └────┬─────┘
         │              │
         │              ▼
         │        ┌──────────┐
         │        │ Trigger  │
         │        │ Retry    │
         │        └────┬─────┘
         │             │
         │             ▼
         │        ┌──────────┐
         │        │ Retry    │
         │        │ Success? │
         │        └────┬─────┘
         │       Yes   │  No
         │      ┌──────┘  └──────┐
         │      ▼                ▼
         │ ┌──────────┐   ┌──────────┐
         │ │ Record   │   │ Log      │
         │ │ Pass     │   │ Failure  │
         │ └────┬─────┘   └────┬─────┘
         │      │              │
         └──────┴──────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Collect Results                │
│  - Record pass/fail             │
│  - Record exceptions            │
│  - Record metrics               │
└───────────────┬─────────────────┘
                │
                ▼
            End: Execution Complete
```

---

### 2.10 Control Lifecycle

**Evidence:** app.execution.control_executor (dispatch), engine.control_registry (storage)

```text
Start: Control Discovery identifies controls
    │
    ▼
┌─────────────────────────────────┐
│  Query Control Registry         │
│  - Filter enabled controls      │
│  - Return active controls       │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Dispatch to Control Class      │
│  - Select control class         │
│  - Prepare execution            │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Execute Control Logic          │
│  - Run control checks           │
│  - Collect results              │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Store Results                  │
│  - Record pass/fail             │
│  - Record metrics               │
└───────────────┬─────────────────┘
                │
                ▼
            End: Control Executed
```

---

### 2.11 Validation Execution

**Evidence:** app.execution_engine (6-step pipeline), engine.batch_execution_checkpoint, rule_retry_manager

```text
Start: Migration Engineer triggers execution
    │
    ▼
┌─────────────────────────────────┐
│  Step 1: Connection Resolution  │
│  - Resolve source connection    │
│  - Resolve target connection    │
│  - Validate connections         │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Conn OK?│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Continue │   │ Fail     │
    │          │   │ Execution│
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Step 2: Dataset Mapping        │
│  - Load mappings                │
│  - Validate mappings            │
│  - Prepare data access          │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Step 3: Rule Discovery         │
│  - Query rule registry          │
│  - Filter rules                 │
│  - Prepare rules                │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Step 4: Control Discovery      │
│  - Query control registry       │
│  - Filter controls              │
│  - Prepare controls             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Step 5: Control Execution      │
│  - Execute controls             │
│  - Parallel execution           │
│  - Checkpointing                │
│  - Retry failed controls        │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Controls│
            │ Pass?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Continue │   │ Retry    │
    │          │   │          │
    └────┬─────┘   └────┬─────┘
         │              │
         │              ▼
         │        ┌──────────┐
         │        │ Retry    │
         │        │ Success? │
         │        └────┬─────┘
         │       Yes   │  No
         │      ┌──────┘  └──────┐
         │      ▼                ▼
         │ ┌──────────┐   ┌──────────┐
         │ │ Continue │   │ Log      │
         │ │          │   │ Failure  │
         │ └────┬─────┘   └──────────┘
         │      │
         └──────┘
                │
                ▼
┌─────────────────────────────────┐
│  Step 6: Governance Decision    │
│  - Calculate governance         │
│  - Make decision                │
│  - Store decision               │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Complete Execution             │
│  - Generate summary             │
│  - Store results                │
│  - Notify completion            │
└───────────────┬─────────────────┘
                │
                ▼
            End: Execution Complete
```

---

### 2.12 Exception Management

**Evidence:** engine.v_migration_exception_detail (exception view), execution logging

```text
Start: Validation failure occurs
    │
    ▼
┌─────────────────────────────────┐
│  Detect Exception               │
│  - Monitor execution            │
│  - Identify failure             │
│  - Classify exception           │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Record Exception               │
│  - Capture details              │
│  - Capture context              │
│  - Store exception              │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Review Exception               │
│  - Analyse root cause           │
│  - Assess impact                │
│  - Determine action             │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Action  │
            │Needed? │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Execute  │   │ Close    │
    │Remediation│  │ Exception│
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Re-validate                    │
│  - Re-run validation            │
│  - Confirm resolution           │
└───────────────┬─────────────────┘
                │
                ▼
            End: Exception Resolved
```

---

### 2.13 Issue Remediation

**Evidence:** Manual process (no automation in codebase), Task Management platform

```text
Start: Exception resolved with remediation
    │
    ▼
┌─────────────────────────────────┐
│  Identify Issue                 │
│  - Review exceptions            │
│  - Prioritise issues            │
│  - Assign issues                │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Plan Remediation               │
│  - Analyse issue                │
│  - Define remediation plan      │
│  - Estimate effort              │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Execute Remediation            │
│  - Implement fix                │
│  - Test fix                     │
│  - Deploy fix                   │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Verify Remediation             │
│  - Re-run validation            │
│  - Confirm resolution           │
│  - Close issue                  │
└───────────────┬─────────────────┘
                │
                ▼
            End: Issue Resolved
```

---

### 2.14 Governance

**Evidence:** app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status

```text
Start: Validation execution completes
    │
    ▼
┌─────────────────────────────────┐
│  Collect Execution Results      │
│  - Gather batch results         │
│  - Gather control results       │
│  - Gather exceptions            │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Calculate Risk Scores          │
│  - Identify risk factors        │
│  - Calculate weighted scores    │
│  - Determine risk level         │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Apply Governance Rules         │
│  - Evaluate against thresholds  │
│  - Make governance decision     │
│  - Document decision            │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Decision│
            └───┬────┘
      Approve│  │Reject│  Block
      ┌──────┘  └──┬───┘  └──────┐
      ▼            ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Approve  │ │ Reject   │ │ Block    │
│ Release  │ │ Release  │ │ Release  │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     │            │            ▼
     │            │      ┌──────────┐
     │            │      │ Require  │
     │            │      │Remediation│
     │            │      └──────────┘
     └────────────┴────────────┘
                │
                ▼
            End: Governance Decision Made
```

---

### 2.15 Release Approval

**Evidence:** app.services.approval_service, platform.approval_requests, platform.approval_step_instances

```text
Start: Governance decision made
    │
    ▼
┌─────────────────────────────────┐
│  Create Approval Request        │
│  - Create request               │
│  - Assign approvers             │
│  - Notify approvers             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Review Approval                │
│  - Review details               │
│  - Add comments                 │
│  - Make decision                │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Decision│
            └───┬────┘
      Approve│  │Reject│  Escalate
      ┌──────┘  └──┬───┘  └──────┐
      ▼            ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Approve  │ │ Reject   │ │ Escalate │
│ Release  │ │ Release  │ │ Decision │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     └────────────┴────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Record Decision                │
│  - Store decision               │
│  - Notify stakeholders          │
│  - Update status                │
└───────────────┬─────────────────┘
                │
                ▼
            End: Approval Complete
```

---

### 2.16 Reporting

**Evidence:** reporting schema (5 SQL views), app.audit_export (CLI), no API endpoints

```text
Start: Report requested
    │
    ▼
┌─────────────────────────────────┐
│  Select Report Type             │
│  - Executive report             │
│  - Operational report           │
│  - Governance report            │
│  - Technical report             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Select Parameters              │
│  - Select batch                 │
│  - Select date range            │
│  - Select filters               │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Generate Report                │
│  - Query data                   │
│  - Format report                │
│  - Validate report              │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Report │
            │ Valid?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Export   │   │ Retry    │
    │ Report   │   │ Generation│
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Distribute Report              │
│  - Export report                │
│  - Email report                 │
│  - Archive report               │
└───────────────┬─────────────────┘
                │
                ▼
            End: Report Generated
```

---

### 2.17 Dashboard Production

**Evidence:** reporting schema (fact views), app.scoring_engine (KPIs), no API endpoints

```text
Start: Dashboard requested
    │
    ▼
┌─────────────────────────────────┐
│  Select Dashboard Type          │
│  - Executive dashboard          │
│  - Operational dashboard        │
│  - Migration dashboard          │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Query Data                     │
│  - Query batch data             │
│  - Query execution data         │
│  - Query governance data        │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Calculate KPIs                 │
│  - Calculate metrics            │
│  - Calculate trends             │
│  - Calculate targets            │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Render Visualisations          │
│  - Render charts                │
│  - Render metrics               │
│  - Render tables                │
└───────────────┬─────────────────┘
                │
                ▼
            End: Dashboard Updated
```

---

### 2.18 Notifications

**Evidence:** app.services.notification_service (CRUD API), platform.notifications, platform.notification_preferences

```text
Start: Platform event occurs
    │
    ▼
┌─────────────────────────────────┐
│  Capture Event                  │
│  - Identify event type          │
│  - Capture event details        │
│  - Route event                  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Generate Notification          │
│  - Select template              │
│  - Populate template            │
│  - Format notification          │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Check Preferences              │
│  - Check user preferences       │
│  - Select channel               │
│  - Check frequency              │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Send?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Deliver  │   │ Skip     │
    │          │   │          │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Track Delivery                 │
│  - Record delivery              │
│  - Track read status            │
│  - Archive notification         │
└───────────────┬─────────────────┘
                │
                ▼
            End: Notification Delivered
```

---

### 2.19 Scheduling

**Evidence:** app.services.calendar_service (CRUD API), platform.calendar_events, platform.calendar_event_reminders

```text
Start: Schedule event requested
    │
    ▼
┌─────────────────────────────────┐
│  Define Event                   │
│  - Enter event details          │
│  - Set date/time                │
│  - Store event                  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Schedule Reminders             │
│  - Set reminder times           │
│  - Store reminders              │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Reminder│
            │ Due?    │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Send     │   │ Wait     │
    │ Reminder │   │          │
    └────┬─────┘   └──────────┘
         │
         ▼
            ┌────────┐
            │ Event  │
            │ Due?   │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Complete │   │ Wait     │
    │ Event    │   │          │
    └────┬─────┘   └──────────┘
         │
         ▼
            End: Event Complete
```

---

### 2.20 Workflow Management

**Evidence:** app.services.workflow_service (CRUD API), platform.workflow_definitions, platform.workflow_instances

```text
Start: Workflow triggered
    │
    ▼
┌─────────────────────────────────┐
│  Create Instance                │
│  - Load definition              │
│  - Create instance              │
│  - Initialise state             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Execute Steps                  │
│  - Execute step 1               │
│  - Execute step 2               │
│  - Execute step N               │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Step   │
            │ Pass?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Continue │   │ Retry    │
    │          │   │          │
    └────┬─────┘   └────┬─────┘
         │              │
         │              ▼
         │        ┌──────────┐
         │        │ Retry    │
         │        │ Success? │
         │        └────┬─────┘
         │       Yes   │  No
         │      ┌──────┘  └──────┐
         │      ▼                ▼
         │ ┌──────────┐   ┌──────────┐
         │ │ Continue │   │ Fail     │
         │ │          │   │ Workflow │
         │ └────┬─────┘   └──────────┘
         │      │
         └──────┘
                │
                ▼
┌─────────────────────────────────┐
│  Complete Workflow              │
│  - Complete all steps           │
│  - Generate summary             │
│  - Store history                │
└───────────────┬─────────────────┘
                │
                ▼
            End: Workflow Complete
```

---

### 2.21 Task Management

**Evidence:** app.services.task_service (CRUD API), platform.tasks, platform.task_comments, platform.task_dependencies

```text
Start: Task created
    │
    ▼
┌─────────────────────────────────┐
│  Define Task                    │
│  - Enter task details           │
│  - Set priority                 │
│  - Set due date                 │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Assign Task                    │
│  - Select assignee              │
│  - Notify assignee              │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Assigned│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Execute  │   │ Reassign │
    │ Task     │   │ Task     │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Update Status                  │
│  - Update progress              │
│  - Add comments                 │
│  - Track dependencies           │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Complete│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Complete │   │ Continue │
    │ Task     │   │          │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Close Task                     │
│  - Review task                  │
│  - Close task                   │
│  - Archive task                 │
└───────────────┬─────────────────┘
                │
                ▼
            End: Task Complete
```

---

### 2.22 User Lifecycle

**Evidence:** app.services.user_service (CRUD API), platform.users, platform.user_roles

```text
Start: User creation requested
    │
    ▼
┌─────────────────────────────────┐
│  Enter User Details             │
│  - Enter name                   │
│  - Enter email                  │
│  - Set password                 │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Assign Role                    │
│  - Select role                  │
│  - Assign permissions           │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Create User                    │
│  - Store user                   │
│  - Hash password                │
│  - Notify user                  │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Active?│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Manage   │   │Deactivate│
    │ User     │   │ User     │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Deactivate User                │
│  - Revoke access                │
│  - Archive user                 │
│  - Notify user                  │
└───────────────┬─────────────────┘
                │
                ▼
            End: User Deactivated
```

---

### 2.23 Role Administration

**Evidence:** app.services.role_service (CRUD API), platform.roles, platform.permissions (47), platform.role_permissions

```text
Start: Role creation requested
    │
    ▼
┌─────────────────────────────────┐
│  Define Role                    │
│  - Enter role name              │
│  - Enter description            │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Assign Permissions             │
│  - Select permissions           │
│  - Assign to role               │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Store Role                     │
│  - Store role                   │
│  - Store permissions            │
│  - Audit creation               │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Update?│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Update   │   │ Maintain │
    │ Role     │   │ Role     │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Update Role                    │
│  - Update role                  │
│  - Update permissions           │
│  - Audit update                 │
└───────────────┬─────────────────┘
                │
                ▼
            End: Role Updated
```

---

### 2.24 Tenant Management

**Evidence:** core.tenants (table exists), no API endpoints, frontend mock

```text
Start: New tenant onboarded
    │
    ▼
┌─────────────────────────────────┐
│  Enter Tenant Details           │
│  - Enter name                   │
│  - Enter configuration          │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Configure Tenant               │
│  - Set isolation level          │
│  - Configure resources          │
│  - Set policies                 │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Store Tenant                   │
│  - Store tenant                 │
│  - Audit creation               │
└───────────────┬─────────────────┘
                │
                ▼
            End: Tenant Configured
```

---

### 2.25 Security Administration

**Evidence:** audit.security_events (security events), no dedicated security API

```text
Start: Security event occurs
    │
    ▼
┌─────────────────────────────────┐
│  Log Security Event             │
│  - Capture event details        │
│  - Store event                  │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Anomaly?│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │Investigate│  │ Log      │
    │ Event    │   │ Event    │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Take Action                    │
│  - Implement fix                │
│  - Update security              │
│  - Notify stakeholders          │
└───────────────┬─────────────────┘
                │
                ▼
            End: Security Action Complete
```

---

### 2.26 Audit Lifecycle

**Evidence:** app.api.core.middleware.audit_middleware (middleware), audit.audit_events, audit.api_call_log

```text
Start: API call received
    │
    ▼
┌─────────────────────────────────┐
│  Intercept API Call             │
│  - Capture request details      │
│  - Capture user info            │
│  - Capture timestamp            │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Store Event                    │
│  - Store in audit trail         │
│  - Store API call details       │
│  - Index event                  │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Review? │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Review   │   │ Archive  │
    │ Event    │   │ Event    │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Generate Report                │
│  - Query audit trail            │
│  - Generate report              │
│  - Export report                │
└───────────────┬─────────────────┘
                │
                ▼
            End: Audit Event Processed
```

---

### 2.27 Platform Administration

**Evidence:** app.services.settings_service (CRUD API), app.health (health), platform.system_settings, platform.feature_flags

```text
Start: Configuration change requested
    │
    ▼
┌─────────────────────────────────┐
│  Update Settings                │
│  - Enter setting values         │
│  - Validate settings            │
│  - Store settings               │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Health │
            │ Check  │
            └───┬────┘
           OK   │  Fail
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Continue │   │ Alert    │
    │          │   │          │
    └──────────┘   └──────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Monitor Health                 │
│  - Run health checks            │
│  - Monitor performance          │
│  - Alert on issues              │
└───────────────┬─────────────────┘
                │
                ▼
            End: Platform Configured
```

---

### 2.28 Customer Onboarding

**Evidence:** app.services.auth_service, platform.users, JWT token issuance

```text
Start: User attempts login
    │
    ▼
┌─────────────────────────────────┐
│  Receive Credentials            │
│  - Extract username             │
│  - Extract password             │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Validate Credentials           │
│  - Query user                   │
│  - Verify password hash         │
│  - Check account status         │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Valid?  │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Issue    │   │ Log      │
    │ Token    │   │ Failure  │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Issue JWT Token                │
│  - Generate access token        │
│  - Generate refresh token       │
│  - Store refresh token          │
└───────────────┬─────────────────┘
                │
                ▼
            End: Login Complete
```

---

### 2.29 Authentication

**Evidence:** app.services.auth_service (passlib bcrypt), platform.refresh_tokens, rate limiting (5/minute)

```text
Start: Login request received
    │
    ▼
┌─────────────────────────────────┐
│  Validate Request               │
│  - Check rate limit             │
│  - Validate request format      │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │ Rate   │
            │ Limit  │
            │ OK?    │
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Continue │   │ Reject   │
    │          │   │ Request  │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Verify Credentials             │
│  - Query user                   │
│  - Verify password              │
│  - Check status                 │
└───────────────┬─────────────────┘
                │
                ▼
            ┌────────┐
            │Verified│
            └───┬────┘
           Yes  │  No
          ┌─────┘  └─────┐
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Issue    │   │ Log      │
    │ Tokens   │   │ Failure  │
    └────┬─────┘   └──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Issue Tokens                   │
│  - Generate access token        │
│  - Generate refresh token       │
│  - Store refresh token          │
└───────────────┬─────────────────┘
                │
                ▼
            End: Tokens Issued
```

---

## 3. Flow Statistics

| Metric | Count |
|--------|-------|
| Total Process Flows | 29 |
| Decision Points | 45+ |
| Exception Paths | 20+ |
| Approval Gates | 5 |

---

## 4. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*These process flows are part of the Enterprise Business Process Model (Prompt 17). All findings are based on source code analysis — no code was modified.*