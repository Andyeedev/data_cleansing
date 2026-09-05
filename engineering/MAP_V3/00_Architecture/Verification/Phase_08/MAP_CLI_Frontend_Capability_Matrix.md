# MAP CLI → Frontend Capability Matrix

> **RULE 18 Master Artefact** — Every frontend feature must be traceable to exactly one authoritative MAP CLI table.
> Generated: 2026-07-26 | RULES 6-18 enforced | Evidence-only (no assumptions)

---

## RULE 18 — Frontend Traceability

> Every frontend feature must be traceable to exactly one authoritative MAP CLI business capability.
> Before implementing any dashboard or API endpoint, OpenCode must:
> 1. Identify the authoritative MAP CLI table
> 2. Verify it is actively populated
> 3. Trace the Python code that writes it
> 4. Confirm it has not been superseded by another table
> 5. Record the mapping in this matrix
>
> **No implementation may proceed until this matrix entry exists.**

---

## Dashboard

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Portfolio Summary — System Count | Count registered migration systems | `GET /api/v1/dashboard/portfolio` | `engine.systems` | `core.system_registry` | 3 | 2026-04-24 15:19:29 | `app/db/repositories/system_repository.py:insert` (line 19) | ✅ VERIFIED |
| Portfolio Summary — Total Controls | Count registered validation controls | `GET /api/v1/dashboard/portfolio` | `engine.controls` | `engine.control_registry` | 10 | 2026-03-08 10:36:52 | SQL DDL (`install_governance_tables.sql`) | ✅ VERIFIED |
| Portfolio Summary — Total Batches | Count total batch runs | `GET /api/v1/dashboard/portfolio` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Portfolio Summary — Active Batches | Count currently running batches | `GET /api/v1/dashboard/portfolio` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| KPIs — Migration Score | Average overall_score from recent batches | `GET /api/v1/dashboard/kpis` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| KPIs — Pass Rate | Percentage of PASSED batches | `GET /api/v1/dashboard/kpis` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| KPIs — Exception Count | Total control exceptions | `GET /api/v1/dashboard/kpis` | `engine.migration_control_exceptions` | `engine.migration_control_exceptions` | 2,482 | 2026-07-25 22:19:38 | `app/rule_executor.py:_log_exception` (line 413) | ✅ VERIFIED |
| Activity Feed | Recent execution activity | `GET /api/v1/dashboard/activity` | `engine.audit_log` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ⚠️ NEEDS FIX |

---

## Governance

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Audit Log | View execution audit trail | `GET /api/v1/governance/audit` | `engine.audit_log` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ⚠️ NEEDS FIX |
| Pending Approvals | View release gate decisions | `GET /api/v1/governance/approvals` | `engine.approvals` | `engine.migration_release_decision` | 13 | 2026-03-10 13:10:48 | `app/execution_engine.py:_enforce_release_gate` (line 759) | ✅ VERIFIED |
| Exception Requests | View control exceptions | `GET /api/v1/governance/exceptions` | `engine.exceptions` | `engine.migration_control_exceptions` | 2,482 | 2026-07-25 22:19:38 | `app/rule_executor.py:_log_exception` (line 413) | ⚠️ NEEDS FIX |
| Compliance Status | View governance pass/fail | `GET /api/v1/governance/compliance` | `engine.migration_governance_status` | `engine.migration_governance_status` | 524 | 2026-07-25 22:19:39 | `app/execution_engine.py:_evaluate_governance` (line 865) | ✅ VERIFIED |

---

## Execution Control

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Run Execution | Trigger batch execution | `POST /api/v1/execution/run` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Execution Status | Get batch status | `GET /api/v1/execution/status/{batch_id}` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Cancel Execution | Cancel running batch | `POST /api/v1/execution/{batch_id}/cancel` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Pause Execution | Pause running batch | `POST /api/v1/execution/{batch_id}/pause` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Resume Execution | Resume paused batch | `POST /api/v1/execution/{batch_id}/resume` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Retry Execution | Retry failed batch | `POST /api/v1/execution/{batch_id}/retry` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Lifecycle Events | View batch lifecycle events | `GET /api/v1/execution/{batch_id}/lifecycle` | `engine.migration_batch_lifecycle` | `engine.batch_execution_checkpoint` | 436 | Unknown | `app/execution_engine.py:_save_checkpoint` (line 887) | ⚠️ PARTIAL |

> **RULE 18 Note:** Partial implementation only. Use `engine.batch_execution_checkpoint` only for the fields it can legitimately provide (`batch_id`, `last_completed_control`). Do not fabricate lifecycle events. Any missing lifecycle information (`event_type`, `event_timestamp`, `details`) must remain unavailable until an authoritative MAP CLI source exists.
| Progress | View batch progress | `GET /api/v1/execution/{batch_id}/progress` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |

---

## Execution History

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Batch List | List all batch runs | `GET /api/v1/execution/history` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Batch Detail | View batch details | `GET /api/v1/execution/history/{batch_id}` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Re-execute Batch | Re-run a batch | `POST /api/v1/execution/history/{batch_id}/re-execute` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Audit Trail | View batch audit trail | `GET /api/v1/execution/{batch_id}/audit` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |
| Control Summaries | View per-control summary | (within batch detail) | `engine.migration_control_summary` | `engine.migration_control_summary` | 3,625 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_control_summary` (line 301) | ✅ VERIFIED |
| Governance Decision | View governance decision | (within batch detail) | `engine.migration_governance_status` | `engine.migration_governance_status` | 524 | 2026-07-25 22:19:39 | `app/execution_engine.py:_evaluate_governance` (line 865) | ✅ VERIFIED |

---

## Rule Execution

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Rules by Batch | List all rule executions for a batch | `GET /api/v1/execution/{batch_id}/rules` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |
| Rule Detail | View single rule execution | `GET /api/v1/execution/{batch_id}/rules/{rule_id}` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |
| Control Rules | List rules for a specific control | `GET /api/v1/execution/{batch_id}/control/{control_id}/rules` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |
| Execution Results | View execution results summary | `GET /api/v1/execution/{batch_id}/results` | `engine.migration_control_summary` | `engine.migration_control_summary` | 3,625 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_control_summary` (line 301) | ✅ VERIFIED |

---

## Validation Report

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Validation Report | Full batch validation report | `GET /api/v1/execution/{batch_id}/report` | `engine.migration_validation_batch` | `engine.migration_validation_batch` | 21 | Unknown | `app/execution_engine.py:_create_batch` (line 496) | ✅ VERIFIED |
| Governance Decision | View governance decision | `GET /api/v1/execution/{batch_id}/governance` | `engine.migration_governance_status` | `engine.migration_governance_status` | 524 | 2026-07-25 22:19:39 | `app/execution_engine.py:_evaluate_governance` (line 865) | ✅ VERIFIED |
| Risk Score | View risk score | `GET /api/v1/execution/{batch_id}/risk-score` | `engine.migration_risk_scores` | `engine.unified_scores` | 58 | 2026-04-17 08:17:07 | Unknown (no Python INSERT found) | ⚠️ INVESTIGATE |
| Compliance Checks | View compliance checks | `GET /api/v1/execution/{batch_id}/compliance` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |
| Export CSV | Export batch results as CSV | `GET /api/v1/execution/export/{batch_id}/csv` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |
| Export PDF | Export batch results as PDF | `GET /api/v1/execution/export/{batch_id}/pdf` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |

---

## Monitoring

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| System Health | System health check | `GET /api/v1/monitoring/health` | N/A (SELECT 1) | N/A | N/A | N/A | N/A | ✅ VERIFIED |
| Performance Metrics | System metrics | `GET /api/v1/monitoring/metrics` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Queue Status | View execution queue | `GET /api/v1/monitoring/queue` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | ✅ VERIFIED |
| Alerts | View system alerts | `GET /api/v1/monitoring/alerts` | `engine.migration_control_exceptions` | `engine.migration_control_exceptions` | 2,482 | 2026-07-25 22:19:38 | `app/rule_executor.py:_log_exception` (line 413) | ✅ VERIFIED |
| Operational Logs | View operational logs | `GET /api/v1/monitoring/logs` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | ✅ VERIFIED |

---

## Discovery

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Discovery Datasets | View discovered datasets | `GET /api/v1/discovery/{batch_id}/datasets` | `core.dataset_mappings` | `core.dataset_mappings` | 3 | 2026-04-01 13:21:39 | `app/services/dataset_discovery_service.py:_create_mapping` (line 181) | ✅ VERIFIED |
| Dataset Detail | View dataset mapping detail | `GET /api/v1/discovery/{batch_id}/datasets/{dataset_id}` | `core.dataset_mappings` | `core.dataset_mappings` | 3 | 2026-04-01 13:21:39 | `app/services/dataset_discovery_service.py:_create_mapping` (line 181) | ✅ VERIFIED |
| Trigger Discovery | Start discovery process | `POST /api/v1/discovery/current` | `core.dataset_mappings` | `core.dataset_mappings` | 3 | 2026-04-01 13:21:39 | `app/services/dataset_discovery_service.py:_create_mapping` (line 181) | ✅ VERIFIED |
| Discovery Status | View discovery status | `GET /api/v1/discovery/{batch_id}/status` | `engine.migration_validation_batch` | `engine.migration_validation_batch` | 21 | Unknown | `app/execution_engine.py:_create_batch` (line 496) | ✅ VERIFIED |

---

## Auth

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Login | User authentication | `POST /api/v1/auth/login` | `platform.users` | `platform.users` | 1 | 2026-07-12 23:36:59 | `app/services/user_service.py:create_user` (line 76) | ✅ VERIFIED |

---

## Users

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Users | List all users | `GET /api/v1/users/` | `platform.users` | `platform.users` | 1 | 2026-07-12 23:36:59 | `app/services/user_service.py:create_user` (line 76) | ✅ VERIFIED |
| Get User | View user details | `GET /api/v1/users/{user_id}` | `platform.users` | `platform.users` | 1 | 2026-07-12 23:36:59 | `app/services/user_service.py:create_user` (line 76) | ✅ VERIFIED |
| Create User | Create new user | `POST /api/v1/users/` | `platform.users` | `platform.users` | 1 | 2026-07-12 23:36:59 | `app/services/user_service.py:create_user` (line 76) | ✅ VERIFIED |
| Update User | Update user | `PUT /api/v1/users/{user_id}` | `platform.users` | `platform.users` | 1 | 2026-07-12 23:36:59 | `app/services/user_service.py:create_user` (line 76) | ✅ VERIFIED |
| Delete User | Delete user | `DELETE /api/v1/users/{user_id}` | `platform.users` | `platform.users` | 1 | 2026-07-12 23:36:59 | `app/services/user_service.py:create_user` (line 76) | ✅ VERIFIED |
| Assign Role | Assign role to user | `POST /api/v1/users/{user_id}/roles` | `platform.user_roles` | `platform.user_roles` | 0 | N/A | `app/services/user_service.py:assign_role` (line 154) | ✅ VERIFIED |
| Remove Role | Remove role from user | `DELETE /api/v1/users/{user_id}/roles/{role_id}` | `platform.user_roles` | `platform.user_roles` | 0 | N/A | `app/services/user_service.py:remove_role` | ✅ VERIFIED |
| Get User Roles | View user roles | `GET /api/v1/users/{user_id}/roles` | `platform.user_roles`, `platform.roles` | `platform.user_roles`, `platform.roles` | 0 + 6 | 2026-07-12 | `app/services/user_service.py:assign_role` (line 154) | ✅ VERIFIED |

---

## Roles

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Roles | List all roles | `GET /api/v1/roles/` | `platform.roles` | `platform.roles` | 6 | 2026-07-12 13:15:13 | `app/services/role_service.py:create_role` (line 66) | ✅ VERIFIED |
| Get Role | View role details | `GET /api/v1/roles/{role_id}` | `platform.roles` | `platform.roles` | 6 | 2026-07-12 13:15:13 | `app/services/role_service.py:create_role` (line 66) | ✅ VERIFIED |
| Create Role | Create new role | `POST /api/v1/roles/` | `platform.roles` | `platform.roles` | 6 | 2026-07-12 13:15:13 | `app/services/role_service.py:create_role` (line 66) | ✅ VERIFIED |
| Update Role | Update role | `PUT /api/v1/roles/{role_id}` | `platform.roles` | `platform.roles` | 6 | 2026-07-12 13:15:13 | `app/services/role_service.py:create_role` (line 66) | ✅ VERIFIED |
| Delete Role | Delete role | `DELETE /api/v1/roles/{role_id}` | `platform.roles` | `platform.roles` | 6 | 2026-07-12 13:15:13 | `app/services/role_service.py:create_role` (line 66) | ✅ VERIFIED |
| Assign Permission | Assign permission to role | `POST /api/v1/roles/{role_id}/permissions` | `platform.role_permissions` | `platform.role_permissions` | 44 | 2026-07-12 13:15:13 | `app/services/role_service.py:assign_permission` (line 132) | ✅ VERIFIED |
| Remove Permission | Remove permission from role | `DELETE /api/v1/roles/{role_id}/permissions/{permission_id}` | `platform.role_permissions` | `platform.role_permissions` | 44 | 2026-07-12 13:15:13 | `app/services/role_service.py:assign_permission` (line 132) | ✅ VERIFIED |
| Get Role Permissions | View role permissions | `GET /api/v1/roles/{role_id}/permissions` | `platform.role_permissions`, `platform.permissions` | `platform.role_permissions`, `platform.permissions` | 44 + 44 | 2026-07-12 | `app/services/role_service.py:assign_permission` (line 132) | ✅ VERIFIED |
| List All Permissions | List all permissions | `GET /api/v1/roles/permissions/list` | `platform.permissions` | `platform.permissions` | 44 | 2026-07-12 13:15:13 | SQL DDL (seed data) | ✅ VERIFIED |

---

## Tasks

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Tasks | List all tasks | `GET /api/v1/tasks/` | `platform.tasks` | `platform.tasks` | 8 | 2026-07-12 23:34:20 | `app/services/task_service.py:create_task` (line 89) | ✅ VERIFIED |
| Get Task | View task details | `GET /api/v1/tasks/{task_id}` | `platform.tasks` | `platform.tasks` | 8 | 2026-07-12 23:34:20 | `app/services/task_service.py:create_task` (line 89) | ✅ VERIFIED |
| Create Task | Create new task | `POST /api/v1/tasks/` | `platform.tasks` | `platform.tasks` | 8 | 2026-07-12 23:34:20 | `app/services/task_service.py:create_task` (line 89) | ✅ VERIFIED |
| Update Task | Update task | `PUT /api/v1/tasks/{task_id}` | `platform.tasks` | `platform.tasks` | 8 | 2026-07-12 23:34:20 | `app/services/task_service.py:create_task` (line 89) | ✅ VERIFIED |
| Delete Task | Delete task | `DELETE /api/v1/tasks/{task_id}` | `platform.tasks` | `platform.tasks` | 8 | 2026-07-12 23:34:20 | `app/services/task_service.py:create_task` (line 89) | ✅ VERIFIED |
| Add Comment | Add comment to task | `POST /api/v1/tasks/{task_id}/comments` | `platform.task_comments` | `platform.task_comments` | 0 | N/A | `app/services/task_service.py:add_comment` (line 177) | ✅ VERIFIED |
| Get Comments | View task comments | `GET /api/v1/tasks/{task_id}/comments` | `platform.task_comments` | `platform.task_comments` | 0 | N/A | `app/services/task_service.py:add_comment` (line 177) | ✅ VERIFIED |
| My Tasks | View assigned tasks | `GET /api/v1/tasks/my/list` | `platform.tasks` | `platform.tasks` | 8 | 2026-07-12 23:34:20 | `app/services/task_service.py:create_task` (line 89) | ✅ VERIFIED |

---

## Approvals

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Approvals | List approval requests | `GET /api/v1/approvals/` | `platform.approval_requests` | `platform.approval_requests` | 0 | N/A | `app/services/approval_service.py:create_approval` (line 85) | ⚠️ EMPTY |
| Pending Count | Count pending approvals | `GET /api/v1/approvals/pending/count` | `platform.approval_requests` | `platform.approval_requests` | 0 | N/A | `app/services/approval_service.py:create_approval` (line 85) | ⚠️ EMPTY |
| Get Approval | View approval details | `GET /api/v1/approvals/{approval_id}` | `platform.approval_requests` | `platform.approval_requests` | 0 | N/A | `app/services/approval_service.py:create_approval` (line 85) | ⚠️ EMPTY |
| Create Approval | Create approval request | `POST /api/v1/approvals/` | `platform.approval_requests` | `platform.approval_requests` | 0 | N/A | `app/services/approval_service.py:create_approval` (line 85) | ⚠️ EMPTY |
| Approve Request | Approve request | `PUT /api/v1/approvals/{approval_id}/approve` | `platform.approval_requests` | `platform.approval_requests` | 0 | N/A | `app/services/approval_service.py:create_approval` (line 85) | ⚠️ EMPTY |
| Reject Request | Reject request | `PUT /api/v1/approvals/{approval_id}/reject` | `platform.approval_requests` | `platform.approval_requests` | 0 | N/A | `app/services/approval_service.py:create_approval` (line 85) | ⚠️ EMPTY |

> **Note:** `platform.approval_requests` has 0 rows. MAP CLI uses `engine.migration_release_decision` (13 rows) for release gate decisions. The approval service is a platform-level workflow feature, not MAP CLI. No MAP CLI data flows into this table.
>
> **RULE 18 Flag:** Recommend removal unless a business requirement is defined. Empty feature = dead code.

---

## Notifications

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Notifications | List user notifications | `GET /api/v1/notifications/` | `platform.notifications` | `platform.notifications` | 5 | 2026-07-12 23:37:27 | Seed data | ✅ VERIFIED |
| Get Notification | View notification | `GET /api/v1/notifications/{notification_id}` | `platform.notifications` | `platform.notifications` | 5 | 2026-07-12 23:37:27 | Seed data | ✅ VERIFIED |
| Mark as Read | Mark notification read | `PUT /api/v1/notifications/{notification_id}/read` | `platform.notifications` | `platform.notifications` | 5 | 2026-07-12 23:37:27 | Seed data | ✅ VERIFIED |
| Mark All Read | Mark all notifications read | `PUT /api/v1/notifications/read-all` | `platform.notifications` | `platform.notifications` | 5 | 2026-07-12 23:37:27 | Seed data | ✅ VERIFIED |
| Delete Notification | Delete notification | `DELETE /api/v1/notifications/{notification_id}` | `platform.notifications` | `platform.notifications` | 5 | 2026-07-12 23:37:27 | Seed data | ✅ VERIFIED |
| Unread Count | Count unread notifications | `GET /api/v1/notifications/unread/count` | `platform.notifications` | `platform.notifications` | 5 | 2026-07-12 23:37:27 | Seed data | ✅ VERIFIED |
| Get Preferences | View notification prefs | `GET /api/v1/notifications/preferences/list` | `platform.notification_preferences` | `platform.notification_preferences` | 0 | N/A | `app/services/notification_service.py:update_preference` (line 147) | ✅ VERIFIED |
| Update Preference | Update notification pref | `PUT /api/v1/notifications/preferences` | `platform.notification_preferences` | `platform.notification_preferences` | 0 | N/A | `app/services/notification_service.py:update_preference` (line 147) | ✅ VERIFIED |

---

## Settings

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Settings | List system settings | `GET /api/v1/settings/` | `platform.system_settings` | `platform.system_settings` | 15 | 2026-07-12 | Seed data | ✅ VERIFIED |
| Get Category Settings | View settings by category | `GET /api/v1/settings/{category}` | `platform.system_settings` | `platform.system_settings` | 15 | 2026-07-12 | Seed data | ✅ VERIFIED |
| Get Setting | View single setting | `GET /api/v1/settings/{category}/{key}` | `platform.system_settings` | `platform.system_settings` | 15 | 2026-07-12 | Seed data | ✅ VERIFIED |
| Update Setting | Update setting | `PUT /api/v1/settings/{category}/{key}` | `platform.system_settings` | `platform.system_settings` | 15 | 2026-07-12 | Seed data | ✅ VERIFIED |
| List Feature Flags | List feature flags | `GET /api/v1/settings/flags/list` | `platform.feature_flags` | `platform.feature_flags` | 6 | 2026-07-12 | Seed data | ✅ VERIFIED |
| Get Feature Flag | View feature flag | `GET /api/v1/settings/flags/{key}` | `platform.feature_flags` | `platform.feature_flags` | 6 | 2026-07-12 | Seed data | ✅ VERIFIED |
| Update Feature Flag | Update feature flag | `PUT /api/v1/settings/flags/{key}` | `platform.feature_flags` | `platform.feature_flags` | 6 | 2026-07-12 | Seed data | ✅ VERIFIED |

---

## Workflows

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Workflows | List workflow definitions | `GET /api/v1/workflows/` | `platform.workflow_definitions` | `platform.workflow_definitions` | 4 | 2026-07-12 23:40:33 | `app/services/workflow_service.py:create_workflow` (line 83) | ✅ VERIFIED |
| Get Workflow | View workflow details | `GET /api/v1/workflows/{workflow_id}` | `platform.workflow_definitions` | `platform.workflow_definitions` | 4 | 2026-07-12 23:40:33 | `app/services/workflow_service.py:create_workflow` (line 83) | ✅ VERIFIED |
| Create Workflow | Create workflow | `POST /api/v1/workflows/` | `platform.workflow_definitions` | `platform.workflow_definitions` | 4 | 2026-07-12 23:40:33 | `app/services/workflow_service.py:create_workflow` (line 83) | ✅ VERIFIED |
| Update Workflow | Update workflow | `PUT /api/v1/workflows/{workflow_id}` | `platform.workflow_definitions` | `platform.workflow_definitions` | 4 | 2026-07-12 23:40:33 | `app/services/workflow_service.py:create_workflow` (line 83) | ✅ VERIFIED |
| Delete Workflow | Delete workflow | `DELETE /api/v1/workflows/{workflow_id}` | `platform.workflow_definitions` | `platform.workflow_definitions` | 4 | 2026-07-12 23:40:33 | `app/services/workflow_service.py:create_workflow` (line 83) | ✅ VERIFIED |
| Execute Workflow | Execute workflow | `POST /api/v1/workflows/{workflow_id}/execute` | `platform.workflow_instances` | `platform.workflow_instances` | 0 | N/A | `app/services/workflow_service.py:execute_workflow` (line 157) | ✅ VERIFIED |
| Workflow Instances | View workflow instances | `GET /api/v1/workflows/{workflow_id}/instances` | `platform.workflow_instances` | `platform.workflow_instances` | 0 | N/A | `app/services/workflow_service.py:execute_workflow` (line 157) | ✅ VERIFIED |
| Workflow Instance | View single instance | `GET /api/v1/workflows/instances/{instance_id}` | `platform.workflow_instances` | `platform.workflow_instances` | 0 | N/A | `app/services/workflow_service.py:execute_workflow` (line 157) | ✅ VERIFIED |

---

## Calendar

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Events | List calendar events | `GET /api/v1/calendar/events` | `platform.calendar_events` | `platform.calendar_events` | 0 | N/A | `app/services/calendar_service.py:create_event` (line 84) | ⚠️ EMPTY |
| Get Event | View event details | `GET /api/v1/calendar/events/{event_id}` | `platform.calendar_events` | `platform.calendar_events` | 0 | N/A | `app/services/calendar_service.py:create_event` (line 84) | ⚠️ EMPTY |
| Create Event | Create calendar event | `POST /api/v1/calendar/events` | `platform.calendar_events` | `platform.calendar_events` | 0 | N/A | `app/services/calendar_service.py:create_event` (line 84) | ⚠️ EMPTY |
| Update Event | Update event | `PUT /api/v1/calendar/events/{event_id}` | `platform.calendar_events` | `platform.calendar_events` | 0 | N/A | `app/services/calendar_service.py:create_event` (line 84) | ⚠️ EMPTY |
| Delete Event | Delete event | `DELETE /api/v1/calendar/events/{event_id}` | `platform.calendar_events` | `platform.calendar_events` | 0 | N/A | `app/services/calendar_service.py:create_event` (line 84) | ⚠️ EMPTY |
| Upcoming Events | View upcoming events | `GET /api/v1/calendar/events/upcoming/list` | `platform.calendar_events` | `platform.calendar_events` | 0 | N/A | `app/services/calendar_service.py:create_event` (line 84) | ⚠️ EMPTY |

> **RULE 18 Flag:** Recommend removal unless a business requirement is defined. Empty feature = dead code.

---

## Credentials

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Credentials | List system credentials | `GET /api/v1/credentials/` | `core.system_credentials` | `core.system_credentials` | 3 | 2026-04-24 15:24:00 | `app/db/repositories/credential_repository.py:insert` (line 18) | ✅ VERIFIED |
| Create Credential | Create credential | `POST /api/v1/credentials/` | `core.system_credentials` | `core.system_credentials` | 3 | 2026-04-24 15:24:00 | `app/db/repositories/credential_repository.py:insert` (line 18) | ✅ VERIFIED |
| Update Credential | Update credential | `PUT /api/v1/credentials/{credential_id}` | `core.system_credentials` | `core.system_credentials` | 3 | 2026-04-24 15:24:00 | `app/db/repositories/credential_repository.py:insert` (line 18) | ✅ VERIFIED |
| Delete Credential | Delete credential | `DELETE /api/v1/credentials/{credential_id}` | `core.system_credentials` | `core.system_credentials` | 3 | 2026-04-24 15:24:00 | `app/db/repositories/credential_repository.py:insert` (line 18) | ✅ VERIFIED |

---

## Systems

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| List Systems | List registered systems | `GET /api/v1/systems/` | `core.system_registry` | `core.system_registry` | 3 | 2026-04-24 15:19:29 | `app/db/repositories/system_repository.py:insert` (line 19) | ✅ VERIFIED |
| Get System | View system details | `GET /api/v1/systems/{system_id}` | `core.system_registry` | `core.system_registry` | 3 | 2026-04-24 15:19:29 | `app/db/repositories/system_repository.py:insert` (line 19) | ✅ VERIFIED |
| Create System | Register new system | `POST /api/v1/systems/` | `core.system_registry` | `core.system_registry` | 3 | 2026-04-24 15:19:29 | `app/db/repositories/system_repository.py:insert` (line 19) | ✅ VERIFIED |
| Test Connection | Test system connection | `GET /api/v1/systems/{system_id}/test` | `core.system_registry` | `core.system_registry` | 3 | 2026-04-24 15:19:29 | `app/db/repositories/system_repository.py:insert` (line 19) | ✅ VERIFIED |

---

## Navigation

| Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Authoritative Table | Rows | Last Populated | Populated By | Status |
|------------------|---------------------|--------------|----------------|----------------------------|------|----------------|--------------|--------|
| Navigation Items | App navigation structure | `GET /api/v1/navigation/` | N/A (hardcoded) | N/A | N/A | N/A | N/A | ✅ VERIFIED |

---

## Summary: Items Requiring Action

| # | Frontend Feature | Business Capability | API Endpoint | Original Table | MAP CLI Table | Status | Action |
|---|------------------|---------------------|--------------|----------------|--------------|--------|--------|
| 1 | Dashboard Activity Feed | View execution activity | `GET /api/v1/dashboard/activity` | `engine.audit_log` | `engine.migration_control_execution` | NEEDS FIX | Remap query + column mapping |
| 2 | Governance Audit Log | View execution audit trail | `GET /api/v1/governance/audit` | `engine.audit_log` | `engine.migration_control_execution` | NEEDS FIX | Remap query + column mapping |
| 3 | Governance Pending Approvals | View release gate decisions | `GET /api/v1/governance/approvals` | `engine.approvals` | `engine.migration_release_decision` | VERIFIED | Remap query + column mapping |
| 4 | Governance Exception Requests | View control exceptions | `GET /api/v1/governance/exceptions` | `engine.exceptions` | `engine.migration_control_exceptions` | NEEDS FIX | Remap query + column mapping |
| 5 | Execution Control Lifecycle | View batch lifecycle events | `GET /api/v1/execution/{batch_id}/lifecycle` | `engine.migration_batch_lifecycle` | `engine.batch_execution_checkpoint` | PARTIAL | **Partial implementation only.** Use checkpoint for `batch_id` + `last_completed_control` only. Do not fabricate `event_type`, `event_timestamp`, or `details`. Missing data remains unavailable until authoritative source exists. |
| 6 | Validation Report Risk Score | View risk score | `GET /api/v1/execution/{batch_id}/risk-score` | `engine.migration_risk_scores` | `engine.unified_scores` | INVESTIGATE | Trace population source |
| 7 | Approvals (all endpoints) | Platform approval workflow | `GET /api/v1/approvals/*` | `platform.approval_requests` | `platform.approval_requests` | EMPTY | **Removal review** — no MAP CLI data, no business requirement |
| 8 | Calendar (all endpoints) | Platform calendar | `GET /api/v1/calendar/*` | `platform.calendar_events` | `platform.calendar_events` | EMPTY | **Removal review** — no MAP CLI data, no business requirement |
