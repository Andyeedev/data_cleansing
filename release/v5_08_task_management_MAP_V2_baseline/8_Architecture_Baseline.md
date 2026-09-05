# Architecture Baseline — v5.08

## Complete Technical Baseline

This document provides a comprehensive snapshot of the MAP Nexus Enterprise Platform at v5.08 — every table, every route, every rule, every component.

---

## 1. Database Schema (115 Tables)

### core (27 tables)

| Table | Purpose |
|-------|---------|
| `tenants` | Multi-tenant root |
| `projects` | Migration projects |
| `system_registry` | DB connection definitions |
| `system_credentials` | Encrypted credentials |
| `datasets` | Discovered datasets |
| `dataset_mappings` | Source→target mapping pairs |
| `dataset_columns` | Column-level mappings |
| `column_mappings` | Active column mappings |
| `rule_dataset_mapping` | Rule-to-dataset bindings |
| `discovered_datasets` | Discovery session results |
| `discovered_columns` | Discovery column results |
| `schema_diffs` | Schema comparison records |
| `schema_diff_details` | Column-level diff details |
| `table_matches` | Table matching results |
| `table_match_details` | Column match details |
| `mapping_suggestions` | Auto-map suggestions |
| `connection_diagnostics` | Connection test results |
| `column_mapping_audit` | Mapping change audit |
| `*_legacy` | Legacy v1.4 tables (7 tables) |

### engine (47 tables)

| Table | Purpose |
|-------|---------|
| `migration_batch_registry` | Batch execution records |
| `migration_control_execution` | Per-control results |
| `migration_control_summary` | Control-level aggregates |
| `migration_batch_summary` | Batch-level aggregates |
| `migration_score_summary` | Scoring summaries |
| `migration_score_details` | Score breakdowns |
| `migration_exception_register` | Exception tracking |
| `migration_control_exceptions` | Control exceptions |
| `migration_release_decision` | Governance decisions |
| `migration_governance_status` | Governance status |
| `migration_validation_batch` | Validation records |
| `control_registry` | Control definitions |
| `control_dependencies` | Execution order |
| `control_persistence_analysis` | Persistence analysis |
| `rule_registry` | Rule definitions |
| `rule_weights` | Rule weight config |
| `rule_weight_config` | Weight configuration |
| `rule_execution_statistics` | Execution stats |
| `rule_anomaly_history` | Anomaly tracking |
| `rule_parameter_metadata_legacy` | Legacy rule params |
| `migration_schedules` | Schedule definitions |
| `schedule_execution_log` | Schedule run history |
| `governance_config` | Governance settings |
| `batch_anomaly_analysis` | Anomaly detection |
| `batch_intelligence` | Batch intelligence |
| `batch_rule_scores` | Rule scoring |
| `batch_execution_checkpoint` | Checkpoint tracking |
| `connection_health_checks` | Health monitoring |
| `data_profiling_results` | Data profiling |
| `execution_performance_metrics` | Perf metrics |
| `explainability_results` | Explainability |
| `fk_constraint_validation` | FK validation |
| `fk_inference_results` | FK inference |
| `relationship_graph_results` | Relationship graphs |
| `table_matching_results` | Table matching |
| `unified_scores` | Unified scoring |
| `e2e_run_history` | E2E run history |
| `e2e_run_logs` | E2E logs |
| `*_OLD` | Legacy tables (7 tables) |

### engine_v14 (10 tables)

| Table | Purpose |
|-------|---------|
| `tenants` | Legacy tenants |
| `projects` | Legacy projects |
| `systems` | Legacy systems |
| `datasets` | Legacy datasets |
| `dataset_mappings` | Legacy mappings |
| `dataset_columns` | Legacy columns |
| `column_mappings` | Legacy column mappings |
| `batch_runs` | Legacy batch runs |
| `control_executions` | Legacy control executions |
| `batch_intelligence` | Legacy intelligence |

### platform (23 tables)

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `roles` | RBAC roles |
| `user_roles` | User-role assignments |
| `permissions` | Permission definitions |
| `role_permissions` | Role-permission assignments |
| `user_sessions` | Active sessions |
| `refresh_tokens` | Token refresh |
| `tasks` | Task management |
| `task_comments` | Task comments |
| `task_dependencies` | Task dependencies |
| `workflow_definitions` | Workflow templates |
| `workflow_instances` | Running workflows |
| `workflow_step_instances` | Step instances |
| `workflow_history` | Workflow audit |
| `approval_templates` | Approval templates |
| `approval_requests` | Approval requests |
| `approval_step_instances` | Approval steps |
| `calendar_events` | Calendar events |
| `calendar_event_reminders` | Event reminders |
| `notifications` | User notifications |
| `notification_preferences` | Notification settings |
| `feature_flags` | Feature toggles |
| `system_settings` | System config |

### audit (5 tables)

| Table | Purpose |
|-------|---------|
| `audit_events` | Audit trail |
| `api_logs` | API request logs |
| `login_history` | Login audit |
| `security_events` | Security events |
| `configuration_history` | Config change audit |

### reporting (3 tables, 19 views)

| Table | Purpose |
|-------|---------|
| `dim_date` | Date dimension |
| `dim_severity` | Severity dimension |
| `dim_status` | Status dimension |

---

## 2. API Routes (34 files, ~200+ endpoints)

### Auth & User Management
| Route | Prefix | Endpoints |
|-------|--------|-----------|
| `auth_routes` | `/api/v1/auth` | login |
| `user_routes` | `/api/v1/users` | CRUD |
| `role_routes` | `/api/v1/roles` | CRUD |
| `settings_routes` | `/api/v1/settings` | GET/PUT |
| `notification_routes` | `/api/v1/notifications` | CRUD |

### Execution Pipeline
| Route | Prefix | Endpoints |
|-------|--------|-----------|
| `execution_routes` | `/api/v1/execution` | run, status |
| `execution_control_routes` | `/api/v1/execution` | cancel, pause, resume, retry, lifecycle, progress |
| `execution_history_routes` | `/api/v1/execution` | history, breakdown, re-execute, audit |
| `operations_execution_routes` | `/api/v1/operations` | System 2 execution |

### Rules & Validation
| Route | Prefix | Endpoints |
|-------|--------|-----------|
| `rule_execution_routes` | `/api/v1/execution` | rules, control rules, fix-options, apply-fix, latest-batch |
| `rule_discovery_routes` | `/api/v1/rules/discovery` | trigger, mappings, latest-batch |
| `rule_registry_routes` | `/api/v1/rules` | CRUD, usage-stats, projects |
| `validation_report_routes` | `/api/v1/execution` | report, governance, risk, compliance, dashboard |

### Mapping & Discovery
| Route | Prefix | Endpoints |
|-------|--------|-----------|
| `mapping_routes` | `/api/v1/mapping` | summary, schema, columns, auto-map, validate, clear |
| `migration_dataset_routes` | `/api/v1/migration/datasets` | list |
| `migration_project_routes` | `/api/v1/migration/projects` | list, tenants, overview |
| `discovery_routes` | `/api/v1/discovery` | summary, tree, tables, clear, datasets, status |

### System & Infrastructure
| Route | Prefix | Endpoints |
|-------|--------|-----------|
| `system_routes` | `/api/v1/systems` | CRUD, test-connection |
| `credential_routes` | `/api/v1/credentials` | CRUD |
| `control_routes` | `/api/v1/controls` | CRUD |
| `control_dependencies_routes` | `/api/v1/control-dependencies` | list, create, delete |
| `diagnostics_routes` | `/api/v1/diagnostics` | summary, list, run, history |
| `schedule_routes` | `/api/v1/schedules` | CRUD |

### Governance & Workflow
| Route | Prefix | Endpoints |
|-------|--------|-----------|
| `governance_routes` | `/api/v1/governance` | audit, approvals, exceptions, compliance |
| `approval_routes` | `/api/v1/approvals` | list, pending, detail, approve, reject |
| `workflow_routes` | `/api/v1/workflows` | CRUD |
| `task_routes` | `/api/v1/tasks` | CRUD |
| `calendar_routes` | `/api/v1/calendar` | events CRUD, upcoming |

### Export & Dashboard
| Route | Prefix | Endpoints |
|-------|--------|-----------|
| `export_routes` | `/api/v1/execution` | csv, pdf |
| `dashboard_routes` | `/api/v1/dashboard` | portfolio, kpis, activity |
| `monitoring_routes` | `/api/v1/monitoring` | system monitoring |
| `navigation_routes` | `/api/v1/navigation` | sidebar nav |

---

## 3. Validation Rules (10 rules)

| Rule | Control | Purpose |
|------|---------|---------|
| `C01_row_count_rule` | C01 | Source vs target row count |
| `C02_sum_compare_rule` | C02 | Numeric column sum comparison |
| `C03_referential_rule` | C03 | Referential integrity check |
| `C04_column_count_rule` | C04 | Source vs target column count |
| `C05_column_null_compare_rule` | C05 | Null value comparison |
| `C06_data_type_match_rule` | C06 | Data type compatibility |
| `C07_duplicate_detection_rule` | C07 | Duplicate row detection |
| `C08_data_drift_detection_rule` | C08 | Data drift detection |
| `C09_referential_coverage_rule` | C09 | FK coverage check |
| `C010_schema_drift_rule` | C010 | Schema drift detection |

---

## 4. Frontend Pages (87 route pages)

### Validation
- `ValidationResultsPage` — Batch results with controls drilldown
- `ValidationRulesPage` — Rule mappings & usage, rule definitions
- `ValidationDashboardPage` — Validation overview
- `ValidationDiscoveryPage` — Rule discovery with auto-discover
- `ControlsPage` — Control management
- `GovernancePage` — Governance decisions

### Operations
- `OperationsExecutionPage` — Run history, execute batches
- `ExecutionHistoryPage` — Full execution history
- `WorkflowsPage` — Workflow management

### Migration
- `MigrationPage` — Start migration
- `MigrationSchedulesPage` — Schedule management
- `MigrationTimelinePage` — Execution timeline
- `MigrationOverviewPage` — Migration overview
- `MigrationProjectsPage` — Project management
- `MigrationDatasetsPage` — Dataset management

### Discovery
- `DiscoveryPage` — Schema discovery
- `DiscoveryTreeTablePage` — Tree view of schemas

### Mapping
- `MappingSpreadsheetPage` — Column mapping spreadsheet

### Administration
- `AdministrationPage` — Admin overview
- `UsersPage` — User management
- `RolesPage` — Role management
- `SettingsPage` — System settings
- `NotificationsPage` — Notification management
- `UserDetailPage` — User detail
- `RoleDetailPage` — Role detail

### Dashboard & Reports
- `DashboardPage` — Executive dashboard
- `ReportsPage` — Report generation
- `SystemDetailPage` — System detail

### Other
- `ConnectionDiagnosticsPage` — Connection testing
- `ControlDependenciesPage` — Dependency management
- `AccessDeniedPage` — Access denied
- `NotFoundPage` — 404 page
- `TaskManagementPage` — Task management
- `TaskDetailPage` — Task detail

---

## 5. Shared Components (46 TSX files)

### Data Display
- `StatusBadge` — Status indicator (pass/fail/error/skipped)
- `MetricCard` — KPI display card
- `ProgressBar` — Execution progress
- `TabBar` — Tab navigation

### Forms & Inputs
- `SearchBar` — Search input
- `CascadeDropdowns` — Tenant → Project → Batch cascade

### Layout
- `PageHeader` — Page header with title and actions
- `PageContainer` — Page layout wrapper
- `SplitPane` — Resizable split view
- `Pagination` — Table pagination

### Feedback
- `EmptyState` — Empty state placeholder
- `ErrorState` — Error state with retry
- `LoadingSkeleton` — Loading placeholder
- `LoadingOverlay` — Loading overlay
- `Toast` — Toast notifications

### Modals
- `Modal` — Generic modal component
- `ControlReportModal` — Control rules popup

### Other
- `TenantFilter` — Tenant selector
- `CalendarEventEditModal` — Calendar event editor

---

## 6. Database Statistics

| Metric | Count |
|--------|-------|
| Total tables | 115 |
| Total views | 19 |
| Foreign keys | 91 |
| Indexes | 220 |
| Schemas | 6 |
| Legacy tables (engine_v14) | 10 |
| Legacy tables (engine) | 7 |
| Legacy tables (core) | 7 |

### Tables per Schema

| Schema | Tables |
|--------|--------|
| engine | 47 |
| core | 27 |
| platform | 23 |
| engine_v14 | 10 |
| audit | 5 |
| reporting | 3 |

---

## 7. Backend Statistics

| Metric | Count |
|--------|-------|
| Python files (app/) | 191 |
| API route files | 34 |
| Service files | ~20 |
| Repository files | ~10 |
| Adapter files | 9 |
| Rule files | 11 |

---

## 8. Frontend Statistics

| Metric | Count |
|--------|-------|
| Total TSX files | 140 |
| Route pages | 87 |
| Shared components | 46 |
| Hook files | ~15 |
| Type definitions | ~10 |

---

## Version

**Version:** v5.08

**Branch:** `feature/workstream-07-task_management`

**Status:** Complete Architecture Baseline
