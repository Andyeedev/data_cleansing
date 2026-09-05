# Business Event Model

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  

---

## 1. Engine Business Events

| # | Event | Producer | Consumers | Schema |
|---|-------|----------|-----------|--------|
| 1 | Batch Started | Validation Execution | Notifications, Tasks, Calendar | engine |
| 2 | Batch Completed | Validation Execution | Governance, Reporting, Notifications | engine |
| 3 | Batch Failed | Validation Execution | Governance, Notifications, Tasks | engine |
| 4 | Control Executed | Validation Execution | Reporting, Governance | engine |
| 5 | Validation Failed | Validation Execution | Tasks, Notifications, Governance | engine |
| 6 | Governance Blocked | Governance Decisions | Tasks, Notifications, Approvals | engine |
| 7 | Release Approved | Release Gates | Notifications, Tasks | engine |
| 8 | Release Rejected | Release Gates | Tasks, Notifications | engine |
| 9 | Checkpoint Created | Checkpointing | Validation Execution | engine |
| 10 | Retry Triggered | Retry Engine | Notifications, Tasks | engine |
| 11 | Dataset Discovered | Dataset Discovery | Notifications | core |
| 12 | Rule Discovered | Rule Discovery | Notifications | engine |
| 13 | Connection Tested | Connection Management | Notifications | core |
| 14 | Anomaly Detected | Risk Scoring | Governance, Notifications | engine |

---

## 2. Platform Business Events

| # | Event | Producer | Consumers | Schema |
|---|-------|----------|-----------|--------|
| 15 | User Created | User Management | Notifications | platform |
| 16 | Role Assigned | Role Management | Notifications | platform |
| 17 | Task Created | Task Management | Notifications, Calendar | platform |
| 18 | Task Completed | Task Management | Notifications, Workflow | platform |
| 19 | Workflow Completed | Workflow Management | Tasks, Notifications | platform |
| 20 | Approval Requested | Approvals | Tasks, Notifications | platform |
| 21 | Approval Decided | Approvals | Tasks, Notifications, Workflow | platform |
| 22 | Login Successful | Authentication | Audit Trail | platform |
| 23 | Login Failed | Authentication | Audit Trail, Security Events | platform |
| 24 | Settings Changed | System Settings | Audit Trail | platform |

---

## 3. Event Flow Diagram

```text
Validation Execution
    ├── Batch Started → Notifications, Tasks, Calendar
    ├── Batch Completed → Governance, Reporting, Notifications
    ├── Batch Failed → Governance, Notifications, Tasks
    ├── Control Executed → Reporting, Governance
    └── Validation Failed → Tasks, Notifications, Governance

Governance Decisions
    ├── Governance Blocked → Tasks, Notifications, Approvals
    └── Anomaly Detected → Governance, Notifications

Release Gates
    ├── Release Approved → Notifications, Tasks
    └── Release Rejected → Tasks, Notifications

Task Management
    ├── Task Created → Notifications, Calendar
    └── Task Completed → Notifications, Workflow

Workflow Management
    └── Workflow Completed → Tasks, Notifications

Approvals
    ├── Approval Requested → Tasks, Notifications
    └── Approval Decided → Tasks, Notifications, Workflow

Authentication
    ├── Login Successful → Audit Trail
    └── Login Failed → Audit Trail, Security Events
```

---

*This event model is part of the Enterprise Business Capability Model (Prompt 16).*
