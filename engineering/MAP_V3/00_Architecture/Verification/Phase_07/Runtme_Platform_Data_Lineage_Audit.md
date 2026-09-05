# Runtime & Platform Data Lineage Audit
# Phase 07 MAP CLI MVP - Table Classification & KPI Lineage Analysis

## Date: 2026-07-24
## Status: TASK CREATED

---

# PART 1: TABLE CLASSIFICATION MATRIX

## Schema: ENGINE (41 tables)

| Table | Rows | CLI | API | Service | Repository | UI | Status |
|-------|------|-----|-----|---------|------------|-----|--------|
| engine.migration_control_execution | 7,191 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| engine.migration_control_summary | 3,589 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| engine.migration_control_exceptions | 2,470 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| engine.migration_validation_batch | 21 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| engine.migration_batch_registry | 539 | ✅ | ✅ | ✅ | ✅ | ✅ | Runtime |
| engine.migration_batch_summary | 13 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| engine.migration_governance_status | 520 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| engine.migration_release_decision | 13 | ✅ | ✅ | ✅ | ❌ | ❌ | Runtime |
| engine.batch_execution_checkpoint | 432 | ✅ | ✅ | ✅ | ❌ | ❌ | Runtime |
| engine.execution_performance_metrics | 16 | ✅ | ✅ | ✅ | ❌ | ❌ | Runtime |
| engine.rule_registry | 11 | ✅ | ✅ | ✅ | ❌ | ❌ | Runtime |
| engine.rule_weights | 6 | ✅ | ✅ | ✅ | ❌ | ❌ | Runtime |
| engine.control_registry | 10 | ✅ | ✅ | ✅ | ❌ | ❌ | Runtime |
| engine.data_profiling_results | 5,653 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.table_matching_results | 1,639 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.fk_inference_results | 981 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.fk_constraint_validation | 390 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.relationship_graph_results | 105 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.explainability_results | 83 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.unified_scores | 58 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.migration_batch_intelligence | 13 | ✅ | ❌ | ✅ | ❌ | ❌ | Runtime |
| engine.governance_config | 1 | ❌ | ✅ | ✅ | ✅ | ❌ | Platform |
| engine.migration_exception_register | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.migration_score_details | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.migration_score_summary | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.batch_anomaly_analysis | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.batch_intelligence | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.batch_rule_scores | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.control_persistence_analysis | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.rule_anomaly_history | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.rule_execution_statistics | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.rule_weight_config | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| engine.governance_config_OLD | 1 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.governance_config_OLD_1 | 1 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.migration_batch_intelligence_OLD | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.migration_control_execution_OLD | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.dataset_mappings_OLD | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.projects_OLD | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.system_registry_OLD | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.tenants_OLD | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| engine.rule_parameter_metadata_legacy | 3 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |

## Schema: CORE (25 tables)

| Table | Rows | CLI | API | Service | Repository | UI | Status |
|-------|------|-----|-----|---------|------------|-----|--------|
| core.projects | 1 | ✅ | ✅ | ✅ | ✅ | ✅ | Runtime |
| core.system_registry | 3 | ✅ | ✅ | ✅ | ✅ | ✅ | Runtime |
| core.system_credentials | 3 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.tenants | 1 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.datasets | 8 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.dataset_columns | 12 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.dataset_mappings | 3 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.column_mappings | 4 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.discovered_datasets | 8 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.discovered_columns | 16 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.table_matches | 4 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.table_match_details | 8 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.rule_dataset_mapping | 20 | ✅ | ✅ | ✅ | ✅ | ❌ | Runtime |
| core.mapping_suggestions | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| core.schema_diffs | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| core.schema_diff_details | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | Legacy |
| core.column_mappings_legacy | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.column_mappings_legacy_2 | 6 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.dataset_columns_future | 0 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.dataset_columns_legacy | 12 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.dataset_mappings_legacy | 3 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.rule_dataset_mapping_legacy | 30 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.schema_diffs_legacy | 28 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.table_match_details_legacy | 40 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |
| core.table_matches_legacy | 20 | ❌ | ❌ | ❌ | ❌ | ❌ | Legacy |

## Schema: PLATFORM (23 tables)

| Table | Rows | CLI | API | Service | Repository | UI | Status |
|-------|------|-----|-----|---------|------------|-----|--------|
| platform.roles | 6 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.permissions | 44 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.role_permissions | 44 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.users | 1 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.user_roles | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.tasks | 8 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.task_comments | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.task_dependencies | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.workflow_definitions | 4 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.workflow_instances | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.workflow_step_instances | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.workflow_history | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.approval_requests | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.approval_step_instances | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.approval_templates | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.calendar_events | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.calendar_event_reminders | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.notifications | 5 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.notification_preferences | 0 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.system_settings | 15 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.feature_flags | 6 | ❌ | ✅ | ✅ | ✅ | ✅ | Platform |
| platform.refresh_tokens | 0 | ❌ | ✅ | ✅ | ✅ | ❌ | Platform |
| platform.user_sessions | 0 | ❌ | ✅ | ✅ | ✅ | ❌ | Platform |

## Schema: AUDIT (5 tables)

| Table | Rows | CLI | API | Service | Repository | UI | Status |
|-------|------|-----|-----|---------|------------|-----|--------|
| audit.api_logs | 0 | ❌ | ✅ | ✅ | ❌ | ❌ | Platform |
| audit.audit_events | 0 | ❌ | ✅ | ✅ | ❌ | ❌ | Platform |
| audit.configuration_history | 0 | ❌ | ✅ | ✅ | ❌ | ❌ | Platform |
| audit.login_history | 0 | ❌ | ✅ | ✅ | ❌ | ❌ | Platform |
| audit.security_events | 0 | ❌ | ✅ | ✅ | ❌ | ❌ | Platform |

---

# PART 2: KPI ENDPOINT LINEAGE ANALYSIS

## Dashboard KPIs Endpoint
**Route:** `GET /api/v1/dashboard/kpis`
**Service:** `DashboardService.get_kpis()`
**Repository:** `DashboardRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_batch_stats()` | `SELECT COUNT(*), COUNT(CASE WHEN batch_status = 'RUNNING'...) FROM engine.migration_batch_registry` | engine.migration_batch_registry | ✅ Runtime |
| `get_system_count()` | `SELECT COUNT(*) FROM engine.systems` | engine.systems | ❌ DOES NOT EXIST |

**Finding:** Dashboard KPIs reads from `engine.migration_batch_registry` (Runtime) but also tries to read from `engine.systems` which does NOT exist as a table. This is a bug.

## Dashboard Portfolio Endpoint
**Route:** `GET /api/v1/dashboard/portfolio`
**Service:** `DashboardService.get_portfolio_summary()`
**Repository:** `DashboardRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_system_count()` | `SELECT COUNT(*) FROM engine.systems` | engine.systems | ❌ DOES NOT EXIST |
| `get_batch_stats()` | `SELECT COUNT(*) FROM engine.migration_batch_registry` | engine.migration_batch_registry | ✅ Runtime |
| `get_total_controls()` | `SELECT COUNT(*) FROM engine.controls` | engine.controls | ❌ DOES NOT EXIST |

**Finding:** Portfolio endpoint has 2 broken queries referencing non-existent tables.

## Dashboard Activity Endpoint
**Route:** `GET /api/v1/dashboard/activity`
**Service:** `DashboardService.get_activity()`
**Repository:** `DashboardRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_recent_activity()` | `SELECT ... FROM engine.audit_log ORDER BY timestamp DESC` | engine.audit_log | ❌ DOES NOT EXIST |

**Finding:** Activity endpoint reads from `engine.audit_log` which does NOT exist. This is a bug.

## Monitoring Metrics Endpoint
**Route:** `GET /api/v1/monitoring/metrics`
**Service:** `MonitoringService.get_performance_metrics()`
**Repository:** `MonitoringRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_execution_stats()` | `SELECT COUNT(*), COUNT(CASE WHEN...) FROM engine.migration_batch_registry` | engine.migration_batch_registry | ✅ Runtime |

**Finding:** Monitoring Metrics correctly reads from Runtime table.

## Monitoring Queue Endpoint
**Route:** `GET /api/v1/monitoring/queue`
**Service:** `MonitoringService.get_queue_status()`
**Repository:** `MonitoringRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_queue_items()` | `SELECT ... FROM engine.migration_batch_registry WHERE batch_status IN ('RUNNING', 'PENDING')` | engine.migration_batch_registry | ✅ Runtime |

**Finding:** Monitoring Queue correctly reads from Runtime table.

## Governance Audit Endpoint
**Route:** `GET /api/v1/governance/audit`
**Service:** `GovernanceService.get_audit_log()`
**Repository:** `GovernanceRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_audit_entries()` | `SELECT ... FROM engine.audit_log` | engine.audit_log | ❌ DOES NOT EXIST |

**Finding:** Governance Audit reads from `engine.audit_log` which does NOT exist. This is a bug.

## Governance Approvals Endpoint
**Route:** `GET /api/v1/governance/approvals`
**Service:** `GovernanceService.get_approvals()`
**Repository:** `GovernanceRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_pending_approvals()` | `SELECT ... FROM engine.approvals WHERE status = 'PENDING'` | engine.approvals | ❌ DOES NOT EXIST |

**Finding:** Governance Approvals reads from `engine.approvals` which does NOT exist. This is a bug.

## Governance Exceptions Endpoint
**Route:** `GET /api/v1/governance/exceptions`
**Service:** `GovernanceService.get_exceptions()`
**Repository:** `GovernanceRepository`

| Method | SQL Query | Tables | Classification |
|--------|-----------|--------|----------------|
| `get_exception_requests()` | `SELECT ... FROM engine.exceptions WHERE status = 'OPEN'` | engine.exceptions | ❌ DOES NOT EXIST |

**Finding:** Governance Exceptions reads from `engine.exceptions` which does NOT exist. This is a bug.

---

# PART 3: CRITICAL FINDINGS

## Bugs Found (Non-Existent Tables)

| Repository | Method | Missing Table | Impact |
|------------|--------|---------------|--------|
| DashboardRepository | `get_system_count()` | engine.systems | Dashboard KPIs returns 0 |
| DashboardRepository | `get_total_controls()` | engine.controls | Dashboard KPIs returns 0 |
| DashboardRepository | `get_recent_activity()` | engine.audit_log | Dashboard Activity returns empty |
| GovernanceRepository | `get_audit_entries()` | engine.audit_log | Governance Audit returns empty |
| GovernanceRepository | `get_pending_approvals()` | engine.approvals | Governance Approvals returns empty |
| GovernanceRepository | `get_exception_requests()` | engine.exceptions | Governance Exceptions returns empty |

## Classification Summary

| Category | Tables | Status |
|----------|--------|--------|
| Runtime (MAP CLI execution) | 21 tables | ✅ Active, populated |
| Platform Feature (UI) | 23 tables | ✅ Active, mostly empty |
| Legacy/OLD | 30 tables | ⚠️ Candidate for cleanup |
| Audit | 5 tables | ✅ Platform feature |
| **Total** | **94 tables** | |

---

# PART 4: TASK - Runtime & Platform Data Lineage Audit

## Task Name
**Runtime & Platform Data Lineage Audit**

## Objective
1. Identify MAP CLI runtime data flow
2. Identify platform feature data flow
3. Identify orphaned/legacy tables
4. Align dashboards and KPIs with the correct data source
5. Produce a safe cleanup list

## Scope
- All tables in core, engine, platform, audit schemas
- All repository files
- All service files
- All route files
- Dashboard/Monitoring/Governance KPIs

## Deliverables
1. Table Classification Matrix (complete)
2. KPI Endpoint Lineage Map (complete)
3. Incorrect Reference List for non-existent table references
4. Legacy Table Candidate List (candidate for architectural review)
5. Runtime Data Flow Diagram

## Priority
**HIGH** - 6 broken queries found in Dashboard/Governance endpoints

## Status
**IN PROGRESS** - Matrix and lineage analysis complete
