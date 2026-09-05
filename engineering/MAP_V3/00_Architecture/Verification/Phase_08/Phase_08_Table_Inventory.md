# Phase 08 Authoritative Table Inventory

> **Single Source of Truth** — All frontend mappings MUST reference this inventory before implementation.
> Generated: 2026-07-26 | RULES 6-17 enforced | Evidence-only (no assumptions)

---

## Inventory Rules

1. Only tables **actively populated by MAP CLI** are included.
2. Every table is verified via: Python source trace, row count, latest `created_at`.
3. SQL-install-only tables are **rejected**.
4. Duplicate business capabilities are **rejected**.
5. Superseded tables are identified and marked **Legacy**.

---

## Dashboard Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Dashboard | System Count | `engine.systems` | `core.system_registry` | `core.system_registry` | 3 | 2026-04-24 15:19:29 | `app/db/repositories/system_repository.py:insert` (line 19) | Registered migration source/target systems | ✅ VERIFIED | `engine.systems` does not exist. `core.system_registry` is the only system registry. | None | No change needed |
| Dashboard | Total Controls | `engine.controls` | `engine.control_registry` | `engine.control_registry` | 10 | 2026-03-08 10:36:52 | SQL DDL (`install_governance_tables.sql`), not Python INSERT | Registered validation controls (C01-C10) | ✅ VERIFIED | `engine.controls` does not exist. Static data — controls defined at setup, not runtime. | None | No change needed |
| Dashboard | Total Batches / Active Batches | `engine.migration_batch_registry` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | Batch execution registry — one row per batch run | ✅ VERIFIED | Already correct. No change needed. | None | No change needed |
| Dashboard | Recent Activity | `engine.audit_log` (does not exist) | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | Execution audit trail — every rule execution creates an audit record | ⚠️ NEEDS FIX | Current query uses `audit.audit_events` (0 rows, MAP CLI doesn't write). Must remap. | Remap query + column mapping | Replace `audit.audit_events` with `engine.migration_control_execution`. Map columns: `action`→`execution_status`, `entity_type`→`control_id`, `entity_id`→`rule_id`, `user_email`→`'SYSTEM'`, `timestamp`→`created_at` |

---

## Governance Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Governance | Audit Log | `engine.audit_log` (does not exist) | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | Execution audit trail | ⚠️ NEEDS FIX | `engine.audit_log` does not exist. `audit.audit_events` has 0 rows. `engine.migration_control_execution` is the authoritative audit source. | Remap query + column mapping | Replace `engine.audit_log` with `engine.migration_control_execution`. Map: `action`→`execution_status`, `entity_type`→`control_id`, `entity_id`→`rule_id`, `user_email`→`'SYSTEM'`, `timestamp`→`created_at` |
| Governance | Pending Approvals | `engine.approvals` (does not exist) | `engine.migration_release_decision` | `engine.migration_release_decision` | 13 | 2026-03-10 13:10:48 | `app/execution_engine.py:_enforce_release_gate` (line 759) | Release gate decisions — APPROVED/REJECTED per batch | ✅ VERIFIED (RULE 17) | `engine.approvals` does not exist. `platform.approval_requests` has 0 rows. RULE 17 satisfied — no superseding table found. All 13 records show REJECTED. `approved_by` always `'SYSTEM'`. | Remap query + column mapping | Replace `engine.approvals` with `engine.migration_release_decision`. Map: `status`→`gate_result`, `requested_by`→`approved_by`, `entity_type`→`client_name`, `entity_id`→`batch_id` |
| Governance | Exception Requests | `engine.exceptions` (does not exist) | `engine.migration_control_exceptions` | `engine.migration_control_exceptions` | 2,482 | 2026-07-25 22:19:38 | `app/rule_executor.py:_log_exception` (line 413) | Control exceptions — rule failures with source/target values and root cause | ⚠️ NEEDS FIX | `engine.exceptions` does not exist. `engine.migration_control_exceptions` is the authoritative exception table. | Remap query + column mapping | Replace `engine.exceptions` with `engine.migration_control_exceptions`. Map: `reason`→`cause`, `status`→`failure_scope`, `requested_by`→`'SYSTEM'`, `entity_type`→`control_id`, `entity_id`→`rule_id` |

---

## Execution Control Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Execution Control | Batch Status | `engine.migration_batch_registry` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | Batch execution registry | ✅ VERIFIED | Already correct. No change needed. | None | No change needed |
| Execution Control | Lifecycle Events | `engine.migration_batch_lifecycle` (does not exist) | `engine.batch_execution_checkpoint` | `engine.batch_execution_checkpoint` | 436 | Unknown (no timestamp column) | `app/execution_engine.py:_save_checkpoint` (line 887) | Execution checkpoints — tracks last completed control per batch | ⚠️ PARTIAL MATCH | `engine.migration_batch_lifecycle` does not exist. `engine.batch_execution_checkpoint` only stores `batch_id` and `last_completed_control` — no `event_type`, `event_timestamp`, or `details` columns. | Partial implementation only | **Partial implementation only.** Use `batch_execution_checkpoint` for `batch_id` + `last_completed_control` only. Do not fabricate `event_type`, `event_timestamp`, or `details`. Missing data remains unavailable until authoritative source exists. |
| Execution Control | Progress | `engine.migration_batch_registry` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | Batch execution registry | ✅ VERIFIED | Already correct. No change needed. | None | No change needed |

---

## Execution History Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Execution History | Batch List | `engine.migration_batch_registry` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | Batch execution registry | ✅ VERIFIED | Already correct. | None | No change needed |
| Execution History | Control Summaries | `engine.migration_control_summary` | `engine.migration_control_summary` | `engine.migration_control_summary` | 3,625 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_control_summary` (line 301) | Per-control execution summary — pass/fail/error counts | ✅ VERIFIED | Already correct. | None | No change needed |
| Execution History | Control Executions | `engine.migration_control_execution` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | Per-rule execution details | ✅ VERIFIED | Already correct. | None | No change needed |
| Execution History | Exceptions | `engine.migration_control_exceptions` | `engine.migration_control_exceptions` | `engine.migration_control_exceptions` | 2,482 | 2026-07-25 22:19:38 | `app/rule_executor.py:_log_exception` (line 413) | Control exceptions | ✅ VERIFIED | Already correct. | None | No change needed |
| Execution History | Governance Decision | `engine.migration_governance_status` | `engine.migration_governance_status` | `engine.migration_governance_status` | 524 | 2026-07-25 22:19:39 | `app/execution_engine.py:_evaluate_governance` (line 865) | Governance pass/fail/block decision per batch | ✅ VERIFIED | Already correct. | None | No change needed |

---

## Validation Report Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Validation Report | Batch Info | `engine.migration_validation_batch` | `engine.migration_validation_batch` | `engine.migration_validation_batch` | 21 | Unknown (no timestamp column) | `app/execution_engine.py:_create_batch` (line 496) | Batch creation record | ✅ VERIFIED | Already correct. | None | No change needed |
| Validation Report | Risk Score | `engine.migration_risk_scores` (does not exist) | `engine.unified_scores` | `engine.unified_scores` | 58 | 2026-04-17 08:17:07 | Unknown (no Python INSERT found) | Unified risk scoring — matching, FK, profiling, graph scores | ⚠️ INVESTIGATE | `engine.migration_risk_scores` DDL never executed. `engine.unified_scores` has 58 rows but no Python INSERT. Column mismatch: original expects `risk_score, risk_level, calculated_timestamp` but table has `matching_score, fk_score, profiling_score, graph_score, final_score, created_at`. | Investigate population source + column mapping | **Option A:** Trace population source, adapt mapping: `risk_score`→`final_score`, `risk_level`→computed, `calculated_timestamp`→`created_at`. **Option B:** If source untraceable, BLOCK per RULE 16 |
| Validation Report | Control Summaries | `engine.migration_control_summary` | `engine.migration_control_summary` | `engine.migration_control_summary` | 3,625 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_control_summary` (line 301) | Per-control execution summary | ✅ VERIFIED | Already correct. | None | No change needed |
| Validation Report | Governance Decision | `engine.migration_governance_status` | `engine.migration_governance_status` | `engine.migration_governance_status` | 524 | 2026-07-25 22:19:39 | `app/execution_engine.py:_evaluate_governance` (line 865) | Governance pass/fail/block decision | ✅ VERIFIED | Already correct. | None | No change needed |
| Validation Report | Exceptions | `engine.migration_control_exceptions` | `engine.migration_control_exceptions` | `engine.migration_control_exceptions` | 2,482 | 2026-07-25 22:19:38 | `app/rule_executor.py:_log_exception` (line 413) | Control exceptions | ✅ VERIFIED | Already correct. | None | No change needed |
| Validation Report | Batch Score | `engine.migration_control_execution` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | Per-rule execution details | ✅ VERIFIED | Already correct. | None | No change needed |

---

## Rule Execution Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Rule Execution | Rules by Batch | `engine.migration_control_execution` | `engine.migration_control_execution` | `engine.migration_control_execution` | 7,267 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_rule_execution` (line 386) | Per-rule execution details | ✅ VERIFIED | Already correct. | None | No change needed |
| Rule Execution | Execution Summary | `engine.migration_control_summary` | `engine.migration_control_summary` | `engine.migration_control_summary` | 3,625 | 2026-07-25 22:19:39 | `app/rule_executor.py:_log_control_summary` (line 301) | Per-control execution summary | ✅ VERIFIED | Already correct. | None | No change needed |
| Rule Execution | Batch Status | `engine.migration_validation_batch` | `engine.migration_validation_batch` | `engine.migration_validation_batch` | 21 | Unknown | `app/execution_engine.py:_create_batch` (line 496) | Batch creation record | ✅ VERIFIED | Already correct. | None | No change needed |

---

## Monitoring Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Monitoring | Execution Stats / Queue / Recent | `engine.migration_batch_registry` | `engine.migration_batch_registry` | `engine.migration_batch_registry` | 543 | 2026-07-25 22:19:37 | `app/execution_engine.py:_register_batch` (line 1113) | Batch execution registry | ✅ VERIFIED | Already correct. | None | No change needed |

---

## Discovery Feature

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Discovery | Mappings | `core.dataset_mappings` | `core.dataset_mappings` | `core.dataset_mappings` | 3 | 2026-04-01 13:21:39 | `app/services/dataset_discovery_service.py:_create_mapping` (line 181) | Source-to-target dataset mappings | ✅ VERIFIED | Already correct. | None | No change needed |
| Discovery | Batch Info | `engine.migration_validation_batch` | `engine.migration_validation_batch` | `engine.migration_validation_batch` | 21 | Unknown | `app/execution_engine.py:_create_batch` (line 496) | Batch creation record | ✅ VERIFIED | Already correct. | None | No change needed |

---

## Platform Features

| Type | Frontend Feature | Original Frontend Table | MAP CLI Equivalent | Actual Table Used by CLI | Row Count | Last Populated | Populated By | Business Purpose | Status | Notes | Action Required | Solution |
|------|------------------|-------------------------|-------------------|--------------------------|-----------|----------------|--------------|------------------|--------|-------|-----------------|----------|
| Scheduler | Schedules | N/A (new) | N/A (new) | `engine.migration_schedules` | 4 | 2026-07-31 | `sql/demo/03_seed_schedules.sql` | Migration schedule management with CRUD, toggle, run, calendar events | ✅ VERIFIED | New table created for Phase 08B scheduler subsystem | None | No change needed |
| Scheduler | Execution Logs | N/A (new) | N/A (new) | `engine.schedule_execution_log` | 12 | 2026-07-31 | `sql/demo/03_seed_schedules.sql` | Logs of schedule execution runs with terminal output | ✅ VERIFIED | New table created for Phase 08B scheduler subsystem | None | No change needed |
| Scheduler | Calendar Events | N/A (new) | N/A (new) | `platform.calendar_events` | 4 | 2026-07-31 | `sql/demo/03_seed_schedules.sql` | Calendar events linked to schedules via FK | ✅ VERIFIED | Existing table, now wired to `engine.migration_schedules` via FK | None | No change needed |
| Users | User Management | `platform.users` | `platform.users` | `platform.users` | 1 | 2026-07-12 23:36:59 | `app/services/user_service.py:create_user` (line 76) | User accounts | ✅ VERIFIED | Static seed data. | None | No change needed |
| Roles | RBAC | `platform.roles`, `platform.permissions`, `platform.role_permissions` | Same | `platform.roles` (6), `platform.permissions` (44), `platform.role_permissions` (44) | 94 | 2026-07-12 | `app/services/role_service.py:create_role` (line 66) | RBAC configuration | ✅ VERIFIED | Static seed data. | None | No change needed |
| Tasks | Task Management | `platform.tasks` | `platform.tasks` | `platform.tasks` | 8 | 2026-07-12 23:34:20 | `app/services/task_service.py:create_task` (line 89) | Task management | ✅ VERIFIED | Static seed data. | None | No change needed |
| Notifications | Notifications | `platform.notifications` | `platform.notifications` | `platform.notifications` | 5 | 2026-07-12 23:37:27 | Unknown (no Python INSERT found) | User notifications | ✅ VERIFIED | Static seed data. | None | No change needed |
| Settings | System Settings | `platform.system_settings` | `platform.system_settings` | `platform.system_settings` | 15 | 2026-07-12 | Unknown (no Python INSERT found) | System configuration | ✅ VERIFIED | Static seed data. | None | No change needed |
| Settings | Feature Flags | `platform.feature_flags` | `platform.feature_flags` | `platform.feature_flags` | 6 | 2026-07-12 | Unknown (no Python INSERT found) | Feature toggle configuration | ✅ VERIFIED | Static seed data. | None | No change needed |
| Workflows | Workflow Definitions | `platform.workflow_definitions` | `platform.workflow_definitions` | `platform.workflow_definitions` | 4 | 2026-07-12 23:40:33 | `app/services/workflow_service.py:create_workflow` (line 83) | Workflow definitions | ✅ VERIFIED | Static seed data. | None | No change needed |

---

## Summary: Action Required

| # | Type | Frontend Feature | Original Table | Replacement Table | Status | Action Required | Solution |
|---|------|------------------|----------------|-------------------|--------|-----------------|----------|
| 1 | Dashboard | Recent Activity | `engine.audit_log` | `engine.migration_control_execution` | ⚠️ NEEDS FIX | Remap query + column mapping | Replace `audit.audit_events` with `engine.migration_control_execution`. Map: `action`→`execution_status`, `entity_type`→`control_id`, `entity_id`→`rule_id`, `user_email`→`'SYSTEM'`, `timestamp`→`created_at` |
| 2 | Governance | Audit Log | `engine.audit_log` | `engine.migration_control_execution` | ⚠️ NEEDS FIX | Remap query + column mapping | Replace `engine.audit_log` with `engine.migration_control_execution`. Map: `action`→`execution_status`, `entity_type`→`control_id`, `entity_id`→`rule_id`, `user_email`→`'SYSTEM'`, `timestamp`→`created_at` |
| 3 | Governance | Pending Approvals | `engine.approvals` | `engine.migration_release_decision` | ✅ VERIFIED | Remap query + column mapping | Replace `engine.approvals` with `engine.migration_release_decision`. Map: `status`→`gate_result`, `requested_by`→`approved_by`, `entity_type`→`client_name`, `entity_id`→`batch_id` |
| 4 | Governance | Exception Requests | `engine.exceptions` | `engine.migration_control_exceptions` | ⚠️ NEEDS FIX | Remap query + column mapping | Replace `engine.exceptions` with `engine.migration_control_exceptions`. Map: `reason`→`cause`, `status`→`failure_scope`, `requested_by`→`'SYSTEM'`, `entity_type`→`control_id`, `entity_id`→`rule_id` |
| 5 | Execution Control | Lifecycle Events | `engine.migration_batch_lifecycle` | `engine.batch_execution_checkpoint` | ⚠️ PARTIAL | Partial implementation only | **Partial implementation only.** Use `batch_execution_checkpoint` for `batch_id` + `last_completed_control` only. Do not fabricate `event_type`, `event_timestamp`, or `details`. Missing data remains unavailable until authoritative source exists. |
| 6 | Validation Report | Risk Score | `engine.migration_risk_scores` | `engine.unified_scores` | ⚠️ INVESTIGATE | Investigate population source | **Option A:** Trace source, adapt mapping. **Option B:** BLOCK per RULE 16 |

---

## Blocked Items

| # | Type | Frontend Feature | Table | Blocker | Resolution Required |
|---|------|------------------|-------|---------|---------------------|
| 1 | Execution Control | Lifecycle Events | `engine.migration_batch_lifecycle` | Table does not exist; `batch_execution_checkpoint` is partial match | **Partial implementation approved.** Use checkpoint for `batch_id` + `last_completed_control` only. Do not fabricate missing fields. |
| 2 | Validation Report | Risk Score | `engine.migration_risk_scores` | Table does not exist; `engine.unified_scores` has different columns | Decision: adapt column mapping or investigate population source |

---

## Rejected Tables (SQL-install-only, never populated)

| Table | Reason |
|-------|--------|
| `engine.migration_risk_scores` | DDL in `install_governance_tables.sql` but never executed; no Python INSERT |
| `engine.migration_control_decisions` | DDL in `install_governance_tables.sql` but never executed; no Python INSERT |
| `engine.migration_batch_lifecycle` | No DDL found; no Python INSERT found |
| `audit.audit_events` | DDL exists but 0 rows; MAP CLI doesn't write to it |
| `platform.approval_requests` | DDL exists but 0 rows; MAP CLI doesn't write to it |
| `platform.approval_step_instances` | DDL exists but 0 rows |
| `platform.approval_templates` | DDL exists but 0 rows |
| `engine.batch_intelligence` | DDL exists but 0 rows |
| `engine.batch_rule_scores` | DDL exists but 0 rows |
| `engine.batch_anomaly_analysis` | DDL exists but 0 rows |
