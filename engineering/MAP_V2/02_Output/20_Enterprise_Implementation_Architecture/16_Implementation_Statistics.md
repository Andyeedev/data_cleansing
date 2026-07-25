# Document 16: Implementation Statistics

## Overview

Factual counts derived from repository evidence. All counts reflect the actual file system state.

---

## Python Backend (app/)

| Category | Count | Evidence |
|---|---|---|
| Python modules (app/) | 56 | Glob `app/**/*.py` — includes all subdirectories |
| API route modules | 12 | `app/api/routes/`: auth, execution, credential, system, user, role, workflow, task, calendar, notification, settings, approval |
| Service modules | 17 | `app/services/`: auth, audit_pack, approval, calendar, credential, dataset_discovery, execution, mapping_resolver, mapping_validator, metadata_intelligence, notification, role, settings, system, task, user, workflow |
| Rule classes | 10 | `app/rules/`: C01 through C010 (RowCount, SumCompare, Referential, ColumnCount, ColumnNull, DataTypeMatch, DuplicateDetection, DataDrift, ReferentialCoverage, SchemaDrift) |
| Database adapters | 7 | `app/db/adapters/`: postgres, mysql, sqlserver, snowflake, bigquery, oracle, databricks |
| Repository modules | 2 | `app/db/repositories/`: credential_repository, system_repository |
| Governance modules | 2 | `app/governance/`: risk_scoring, decision_engine |
| Utility modules | 3 | `app/utils/`: logger, sanitizer, encryption_utils |
| Orchestration modules | 4 | `app/orchestration/`: rule_retry_manager, rule_isolation, dag_validator (empty), dag_scheduler (empty) |
| Control modules | 2 | `app/controls/`: base_control, rule_adapter_control |
| Security modules | 3 | `app/security/crypto.py`, `app/api/core/security/encryption.py`, `app/api/core/encryption_manager.py` |
| Auth modules | 4 | `app/api/core/auth/`: jwt_handler, jwt_config, rbac, dependencies |
| Middleware modules | 2 | `app/api/core/middleware/`: audit_middleware, tenant_middleware |
| Test files | 2 | `tests/`: test_engine.py, test_controls.py |
| CLI entry points | 3 | `app/main.py`: run, discover, export |

---

## React Frontend (MAP_V2/03_Source/frontend/)

| Category | Count | Evidence |
|---|---|---|
| TSX component files | 100+ | Glob `MAP_V2/03_Source/frontend/src/**/*.tsx` (truncated at 100) |
| TypeScript modules | 100+ | Glob `MAP_V2/03_Source/frontend/src/**/*.ts` (truncated at 100) |
| Frontend services | 7 | `src/services/`: AdminService, AIService, GovernanceService, MigrationService, ReportingService, RiskService, ValidationService |
| AI widgets | 4 | `src/ai/widgets/`: AIInsightWidget, AIRecommendationWidget, AIStatusWidget, AIUsageWidget |
| Dashboard widgets | 14 | `src/dashboard/widgets/`: ActivityPanel, AIInsightPanel, ChartPanel, InformationCard, KPICard, MigrationCard, ProgressPanel, ReportPanel, RiskCard, StatusCard, SummaryCard, TablePanel, TrendCard, ValidationCard |
| Dashboard charts | 8 | `src/dashboard/charts/`: Area, Bar, Donut, Gauge, Heatmap, Line, Pie, Timeline |
| Dashboard framework | 9 | `src/dashboard/framework/`: DashboardActions, DashboardContext, DashboardFilters, DashboardGrid, DashboardLayout, DashboardPage, DashboardSection, DashboardToolbar, WidgetContainer, WidgetFooter, WidgetHeader |
| Widget components | 18 | `src/components/widgets/`: 5 base, 3 cards, 5 charts, 3 system, 2 tables, 2 reports, 3 AI, 2 engine |
| Layout components | 7 | `src/components/layout/`: Breadcrumb, ContentArea, Footer, Header, MainLayout, PageTitle, Sidebar |
| Common components | 7 | `src/components/common/`: AccessDenied, ComingSoon, ErrorPage, LoadingScreen, LoadingSpinner, NoData, NotFound |
| Reporting modules | 20+ | `src/reporting/`: viewer (20+), scheduler (14), distribution (14), html templates (7) |
| Portal types | 5 | `src/portal/types/`: PortalContext, PortalDefinition, PortalProps, ReportingMetrics, SecurityMetrics |
| AI framework modules | 12 | `src/ai/framework/`: AIAudit, AIConfiguration, AIEngine, AIFramework, AIPipeline, AIQuota, AIRegistry, AISettings, AIUsage, AIContext |
| AI insight modules | 9 | `src/ai/insights/`: AIInsights, AnomalyDetector, InsightCategoriser, InsightDashboard, InsightDelivery, InsightExplorer, InsightGenerator, InsightPrioritiser, PatternDetector, PredictiveEngine, TrendAnalyser |
| AI recommendation modules | 11 | `src/ai/recommendations/`: AIRecommendations, GovernanceRecommendations, MigrationRecommendations, OptimizationRecommendations, RecommendationDashboard, RecommendationDelivery, RecommendationExplorer, RecommendationGenerator, RecommendationPrioritiser, ResourceRecommendations, RiskRecommendations, SecurityRecommendations, WorkflowRecommendations |
| AI report generator modules | 10 | `src/ai/report-generator/`: AIReportGenerator, ChartGenerator, ComplianceReport, CustomReportBuilder, DataStoryTeller, ExecutiveSummary, NarrativeGenerator, ReportGeneratorDashboard, ReportGeneratorExplorer, ReportTemplateEngine, SummaryGenerator, TechnicalReport |
| Navigation modules | 3 | `src/navigation/`: index, navigation.config, navigation.types |
| Custom hooks | 4 | `src/hooks/`: useCalendar, useNotifications, useTasks, useWorkflows |
| Authentication modules | 3 | `src/authentication/`: AuthService, auth.types |
| API layer | 3 | `src/api/`: client, endpoints, interceptors |
| Theme modules | 20+ | `src/theme/`: animations, borders, breakpoints, colours, icons, index, radius, shadows, spacing, typography, zindex + components (6) + dashboard (8) |
| Config modules | 5 | `src/config/`: constants, environment, navigation, routes, theme |

---

## API Routes

| Prefix | File | Methods |
|---|---|---|
| `/api/v1/auth` | `auth_routes.py` | POST /login |
| `/api/v1/execution` | `execution_routes.py` | POST /run, GET /status/{batch_id} |
| `/api/v1/credentials` | `credential_routes.py` | CRUD |
| `/api/v1/systems` | `system_routes.py` | CRUD |
| `/api/v1/users` | `user_routes.py` | CRUD |
| `/api/v1/roles` | `role_routes.py` | CRUD |
| `/api/v1/workflows` | `workflow_routes.py` | CRUD |
| `/api/v1/tasks` | `task_routes.py` | CRUD |
| `/api/v1/calendar` | `calendar_routes.py` | CRUD |
| `/api/v1/notifications` | `notification_routes.py` | CRUD |
| `/api/v1/settings` | `settings_routes.py` | CRUD |
| `/api/v1/approvals` | `approval_routes.py` | CRUD |
| `/health` | `main.py` | GET |
| `/api/v1/health` | `main.py` | GET |
| `/api/v1/ready` | `main.py` | GET |

---

## Database Schema

### Tables (from `sql/schema/01_engine_schema.sql` + code references)

| Table | Schema | Source Evidence |
|---|---|---|
| `control_registry` | engine | `01_engine_schema.sql:6` |
| `rule_registry` | engine | `01_engine_schema.sql:19` |
| `rule_parameter_metadata` | engine | `01_engine_schema.sql:38` |
| `migration_control_summary` | engine | `01_engine_schema.sql:145` |
| `migration_control_execution` | engine | `rule_executor.py:386` |
| `migration_control_exceptions` | engine | `rule_executor.py:413` |
| `migration_validation_batch` | engine | `execution_engine.py:496` |
| `migration_batch_summary` | engine | `execution_engine.py:682` |
| `migration_batch_registry` | engine | `execution_engine.py:784` |
| `batch_execution_checkpoint` | engine | `execution_engine.py:887` |
| `migration_release_decision` | engine | `execution_engine.py:759` |
| `migration_governance_status` | engine | `execution_engine.py:864` |
| `migration_risk_scores` | engine | `risk_scoring.py:28` |
| `migration_control_decisions` | engine | `decision_engine.py:14` |
| `system_registry` | core | `connection_resolver.py:109` |
| `system_credentials` | core | `connection_resolver.py:270` |
| `dataset_mappings` | core | `rule_executor.py:194` |
| `dataset_columns` | core | `rule_executor.py:436` |
| `rule_dataset_mapping` | core | `auto_rule_discovery.py:247` |
| `users` | platform | `auth_service.py:18` |
| `user_roles` | platform | `rbac.py:16` |
| `roles` | platform | `rbac.py:18` |
| `role_permissions` | platform | `rbac.py:19` |
| `permissions` | platform | `rbac.py:20` |

**Total tables**: 24

### Views

| View | Schema | Source |
|---|---|---|
| `v_migration_control_summary` | engine | `sql/schema/02_views.sql:5` |
| `v_migration_executive_summary` | engine | `sql/schema/02_views.sql:24` |
| `v_migration_exception_detail` | engine | `sql/schema/02_views.sql:46` |
| `v_migration_governance_report` | engine | `sql/views/1_migration_governance_report.sql:1` |
| `v_migration_executive_summary` (alt) | engine | `sql/views/2_Executive_Dashboard_View.sql:1` |

**Total views**: 5 (with 1 duplicate name across files)

---

## Infrastructure

| Component | Count | Evidence |
|---|---|---|
| Dockerfiles | 1 | `Dockerfile` (multi-stage, Python 3.11-slim) |
| Docker Compose files | 1 | `docker/docker-compose.yml` |
| GitHub Actions workflows | 1 | `.github/workflows/ci.yml` |
| SQL schema files | 2 | `sql/schema/01_engine_schema.sql`, `02_views.sql` |
| SQL view files | 4 | `sql/views/1-4_*.sql` |
| SQL control files | 3 | `sql/controls/C01-C03_*.sql` |
| SQL demo files | 8 | `sql/demo/` |
| Config files | 1 | `config.yaml` |

---

## Summary Counts

| Metric | Count |
|---|---|
| Python modules (app/) | 56 |
| React/TSX files (frontend) | 100+ |
| API route files | 12 |
| Backend service files | 17 |
| Frontend service files | 7 |
| Rule classes | 10 |
| Database adapters | 7 |
| Database tables | 24 |
| Database views | 5 |
| Docker files | 2 |
| CI/CD workflows | 1 |
| Test files | 2 |
| SQL files (schema+views+controls+demo) | 17 |
