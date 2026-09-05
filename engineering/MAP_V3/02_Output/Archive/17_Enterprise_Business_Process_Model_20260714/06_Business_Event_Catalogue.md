# Business Event Catalogue

**Date:** 14 July 2026  
**Audit:** Enterprise Business Process Model (Prompt 17)  
**Scope:** MAP Nexus Enterprise Platform — Business Events  

---

## 1. Purpose

This document catalogues all business events, including trigger, producer, consumers, business process, capability, persistence, and API.

---

## 2. Engine Business Events

| # | Event | Trigger | Producer | Consumers | Business Process | Business Capability | Persistence | API |
|---|-------|---------|----------|-----------|------------------|---------------------|-------------|-----|
| 1 | Batch Started | Execution started | Validation Execution | Notifications, Tasks, Calendar | Validation Execution | Validation Execution | engine.migration_validation_batch | POST /api/v1/execution/run |
| 2 | Batch Completed | Execution completed | Validation Execution | Governance, Reporting, Notifications | Validation Execution | Validation Execution | engine.migration_validation_batch | GET /api/v1/execution/status/{id} |
| 3 | Batch Failed | Execution failed | Validation Execution | Governance, Notifications, Tasks | Validation Execution | Validation Execution | engine.migration_validation_batch | GET /api/v1/execution/status/{id} |
| 4 | Control Executed | Control completed | Validation Execution | Reporting, Governance | Validation Execution | Validation Execution | engine.migration_control_execution | — |
| 5 | Validation Failed | Validation failed | Validation Execution | Tasks, Notifications, Governance | Validation Execution | Validation Execution | engine.migration_control_exceptions | — |
| 6 | Governance Blocked | Governance blocked | Governance Decisions | Tasks, Notifications, Approvals | Governance Decision | Governance Decisions | engine.migration_governance_status | — |
| 7 | Release Approved | Release approved | Release Gates | Notifications, Tasks | Governance Decision | Release Gates | engine.migration_release_decision | — |
| 8 | Release Rejected | Release rejected | Release Gates | Tasks, Notifications | Governance Decision | Release Gates | engine.migration_release_decision | — |
| 9 | Checkpoint Created | Checkpoint saved | Checkpointing | Validation Execution | Validation Execution | Checkpointing | engine.batch_execution_checkpoint | — |
| 10 | Retry Triggered | Retry initiated | Retry Engine | Notifications, Tasks | Validation Execution | Retry Engine | — | — |
| 11 | Dataset Discovered | Discovery complete | Dataset Discovery | Notifications | Dataset Discovery | Dataset Discovery | core.dataset_mappings | — |
| 12 | Rule Discovered | Rule generated | Rule Discovery | Notifications | Validation Execution | Rule Discovery | engine.rule_registry | — |
| 13 | Connection Tested | Test complete | Connection Management | Notifications | Connection Management | Connection Management | core.system_registry | GET /api/v1/systems/{id}/test |
| 14 | Anomaly Detected | Anomaly found | Risk Scoring | Governance, Notifications | Governance Decision | Risk Scoring | engine.migration_risk_scores | — |

---

## 3. Platform Business Events

| # | Event | Trigger | Producer | Consumers | Business Process | Business Capability | Persistence | API |
|---|-------|---------|----------|-----------|------------------|---------------------|-------------|-----|
| 15 | User Created | User created | User Management | Notifications | User Administration | User Management | platform.users | POST /api/v1/users/ |
| 16 | Role Assigned | Role assigned | Role Management | Notifications | User Administration | Role & Permission Management | platform.user_roles | POST /api/v1/users/{id}/roles |
| 17 | Task Created | Task created | Task Management | Notifications, Calendar | Task Management | Task Management | platform.tasks | POST /api/v1/tasks/ |
| 18 | Task Completed | Task completed | Task Management | Notifications, Workflow | Task Management | Task Management | platform.tasks | PUT /api/v1/tasks/{id} |
| 19 | Workflow Completed | Workflow finished | Workflow Management | Tasks, Notifications | Workflow Execution | Workflow Management | platform.workflow_instances | — |
| 20 | Approval Requested | Approval requested | Approvals | Tasks, Notifications | Approval Workflow | Approvals | platform.approval_requests | POST /api/v1/approvals/ |
| 21 | Approval Decided | Approval decided | Approvals | Tasks, Notifications, Workflow | Approval Workflow | Approvals | platform.approval_requests | PUT /api/v1/approvals/{id}/approve |
| 22 | Login Successful | Login success | Authentication | Audit Trail | Security Management | Authentication | platform.user_sessions | POST /api/v1/auth/login |
| 23 | Login Failed | Login failed | Authentication | Audit Trail, Security Events | Security Management | Authentication | audit.security_events | POST /api/v1/auth/login |
| 24 | Settings Changed | Settings updated | System Settings | Audit Trail | Security Management | System Settings | platform.system_settings | PUT /api/v1/settings/{cat}/{key} |

---

## 4. Event Statistics

| Metric | Count |
|--------|-------|
| Total Events | 24 |
| Engine Events | 14 |
| Platform Events | 10 |
| Events with API | 10 |
| Events without API | 14 |

---

*This catalogue is part of the Enterprise Business Process Model (Prompt 17).*