# 08AA — Frozen Frontend Gap Analysis

**Date:** 2026-07-30
**Scope:** Complete comparison of frozen frontend (`MAP_V2/03_Source/frontend/`) vs MVP (`engineering/MAP_V2/03_Source/frontend-mvp/`)
**Status:** Research-only — no implementation changes
**Phase 08B Update:** 2026-07-31 — Scheduler subsystem implemented, theme consistency fixes applied, AccessDeniedPage verified

---

## Executive Summary

| Metric | Frozen Frontend | MVP Frontend |
|--------|----------------|--------------|
| Total source files | 140 portal files + 23 page files | 28 route files |
| Architecture | Portal-based (PortalShell, WidgetRenderer, PortalRegistry) | Page-based (simple React pages) |
| Data source | **100% mock data** (hardcoded in hooks) | **Real API calls** to backend |
| UI richness | High (gauges, KPI widgets, AI summaries, trend charts) | Low (basic cards, tables, status badges) |
| Backend integration | None (all mock) | Full (REST API calls) |
| Test coverage | None | Unit + integration tests |
| Auth pages | 4 pages (Login, ForgotPassword, SessionExpired, AccessDenied) | 1 page (LoginPage) |
| Theme support | Full (CSS vars, dark mode, branding, env-aware colors) | Partial (CSS vars, dark mode toggle) |
| Layout components | 14 components (shell, header, sidebar, footer, breadcrumbs, etc.) | 3 components (Layout, Shell, PageContainer) |
| Navigation items | 17 top-level + 100+ nested children | 8 top-level (flat) |

**Critical Findings:**
1. The frozen frontend is a **UI prototype with mock data** — no backend integration
2. The MVP has **real backend integration** but lacks visual richness
3. **Theme support is equivalent** — both have light/dark mode via CSS variables
4. **Layout gap is significant** — frozen has 14 layout components, MVP has 3
5. **Navigation is simpler in MVP** — 8 items vs 17 items, flat vs nested

---

## Portal-by-Portal Gap Analysis

### 1. Executive Dashboard Portal

**Frozen location:** `portal/executive/` (12 files)
**MVP location:** `routes/DashboardPage.tsx`

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| ExecutiveSummary (gradient banner) | ✅ Exists | ✅ Implemented | MVP DashboardPage.tsx — gradient banner with completion %, confidence % |
| ExecutiveKPI (5 KPI cards with trends) | ✅ Exists | ✅ Implemented | MVP DashboardPage.tsx — 5 metric cards (systems, batches, controls, active, completion rate) |
| ExecutiveHealth (gauge widget) | ✅ Exists | ✅ Implemented | MVP DashboardPage.tsx — gauge widget for migration health score (78%) |
| ExecutiveRisk (risk overview) | ✅ Exists | ❌ Missing | New — risk level badge + critical/high/medium/low counts (blocked by v_batch_risk_index) |
| ExecutiveInsights (AI summary) | ✅ Exists | ❌ Missing | New — AI-generated executive summary (AI not yet integrated) |
| ExecutiveActions (quick action buttons) | ✅ Exists | ✅ Implemented | MVP DashboardPage.tsx — 3 link buttons (Manage Systems, Start Migration, View Operations) |
| ExecutiveNotifications | ✅ Exists | ❌ Missing | New — notification list with severity |
| ExecutiveActivity (recent activity) | ✅ Exists | ✅ Exists | MVP DashboardPage.tsx — activity table from `/dashboard/activity` with StatusBadge |
| **Data source** | Mock (hardcoded) | Real API (`/dashboard/portfolio`, `/dashboard/activity`) | **MVP is production-ready; frozen is not** |
| **Data source** | Mock (hardcoded) | Real API (`/dashboard/portfolio`, `/dashboard/activity`) | **MVP is production-ready; frozen is not** |

**MVP Data Relevance:** 95% — portfolio and activity endpoints return real data
**Frozen Data Relevance:** 0% — all mock data
**Existing Views:** `engine.migration_batch_registry`, `engine.migration_control_execution` (used by dashboard_repository.py)
**SQL View Assessment:** No new view needed — existing tables provide sufficient data
**Backend Readiness:** ✅ Ready — dashboard routes functional
**Priority:** P1 (Dashboard is primary entry point)
**Overall Page Completion:** 95% — ExecutiveSummary, ExecutiveKPI, ExecutiveHealth, ExecutiveActions all implemented with real data

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| ExecutiveSummary (gradient banner) | ✅ YES — 95% | Primary visual anchor; high user impact; low effort | 2h |
| ExecutiveKPI (5 cards with trends) | ✅ YES — 90% | Core dashboard metric; trends add value | 4h |
| ExecutiveHealth (gauge widget) | ✅ YES — 85% | Visual health indicator; unique to frozen | 3h |
| ExecutiveRisk (risk overview) | ⚠️ CONDITIONAL — 70% | Only valuable after `v_batch_risk_index` created | 3h |
| ExecutiveInsights (AI summary) | ❌ NO — 30% | AI not yet integrated; mock data only | 8h |
| ExecutiveActions (6 buttons) | ✅ YES — 80% | Quick navigation; high usability | 1h |
| ExecutiveNotifications | ⚠️ CONDITIONAL — 60% | Only if notification backend is expanded | 4h |

---

### 2. Migration Portal

**Frozen location:** `portal/migration/` (10 files)
**MVP location:** `routes/MigrationPage.tsx`, `routes/MappingPage.tsx`, `routes/DiscoveryPage.tsx`

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| MigrationProjects | ✅ Exists | ✅ Implemented | MVP MigrationProjectsPage.tsx — real API, tenant filter, role-based filtering |
| MigrationDatasets | ✅ Exists | ✅ Implemented | MVP MigrationDatasetsPage.tsx — real API, tenant filter, StatusBadge |
| MigrationSchedules | ✅ Exists | ✅ Implemented | MVP MigrationSchedulesPage.tsx — full CRUD, MAP CLI runner, terminal output, calendar events |
| MigrationOverview | ✅ Exists | ✅ Implemented | MVP MigrationOverviewPage.tsx — real API, tenant filter, StatusBadge |
| MigrationMappings | ✅ Exists | ✅ Exists | MVP MappingPage.tsx |
| MigrationHistory | ✅ Exists | ✅ Exists | MVP ExecutionHistoryPage.tsx |
| MigrationReports | ✅ Exists | ✅ Exists | MVP ReportsPage.tsx |
| MigrationWorkspace | ✅ Exists | ❌ Missing | New — workspace view |
| **Data source** | Mock | Real API | — |

**MVP Data Relevance:** 85% — core pages exist with real data; workspace missing
**Frozen Data Relevance:** 0% — all mock
**Existing Views:** `engine.migration_batch_registry`, `engine.migration_validation_batch`, `engine.control_registry`, `engine.migration_schedules`, `engine.schedule_execution_log`, `core.tenants`, `core.dataset_mappings`
**SQL View Assessment:** No new view needed — existing tables sufficient
**Backend Readiness:** ✅ Ready — all migration routes functional
**Priority:** P1 (Core migration functionality)
**Overall Page Completion:** 85% — 7 of 9 sub-pages implemented with real data

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| MigrationOverview (KPI grid) | ✅ YES — 90% | Core migration summary; high value | 3h |
| MigrationProjects | ✅ YES — 85% | Essential for project management | 6h |
| MigrationExecution (live queue) | ✅ YES — 95% | Critical for execution monitoring | 4h |
| MigrationDatasets | ✅ YES — 80% | Dataset management is core workflow | 6h |
| MigrationMappings | ✅ EXISTS — 100% | Already implemented in MVP | 0h |
| MigrationSchedules | ⚠️ CONDITIONAL — 50% | Only if scheduler backend is built | 8h |
| MigrationHistory | ✅ EXISTS — 100% | Already implemented in MVP | 0h |
| MigrationReports | ✅ EXISTS — 100% | Already implemented in MVP | 0h |
| MigrationWorkspace | ❌ NO — 25% | Complex feature; low priority for MVP | 12h |

---

### 3. Governance Portal

**Frozen location:** `portal/governance/` (11 files)
**MVP location:** `routes/GovernancePage.tsx`

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| GovernanceOverview (compliance metrics) | ✅ Exists | ✅ Exists | MVP has compliance tab with real data |
| Policies | ✅ Exists | ❌ Missing | New — policy management |
| ComplianceMonitoring | ✅ Exists | ✅ Exists | MVP compliance tab |
| RiskGovernance | ✅ Exists | ⚠️ Partial | MVP risk tab shows "No risk data" |
| RegulatoryReporting | ✅ Exists | ❌ Missing | New — regulatory reports |
| AuditTrail | ✅ Exists | ✅ Exists | MVP audit tab with real data |
| ExceptionManagement | ✅ Exists | ✅ Exists | MVP exceptions tab with real data |
| ReleaseGates | ✅ Exists | ⚠️ Partial | MVP controls tab shows "No controls configured" |
| **Data source** | Mock | Real API (`/governance/compliance`, `/governance/audit`, `/governance/exceptions`) | — |

**MVP Data Relevance:** 85% — compliance, audit, exceptions return real data; risk/controls empty
**Frozen Data Relevance:** 0% — all mock
**Existing Views:** `engine.migration_control_execution`, `engine.migration_release_decision`, `engine.migration_control_exceptions`, `engine.migration_control_summary`
**SQL View Assessment:** No new view needed — existing tables sufficient
**Backend Readiness:** ✅ Ready — governance routes functional
**Priority:** P2 (Governance is secondary but important)
**Overall Page Completion:** 70% — 4 of 7 sub-tabs implemented with real data

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| GovernanceOverview (compliance metrics) | ✅ EXISTS — 100% | Already implemented | 0h |
| Policies | ⚠️ CONDITIONAL — 55% | Only if policy backend is built | 8h |
| ComplianceMonitoring | ✅ EXISTS — 100% | Already implemented | 0h |
| RiskGovernance | ⚠️ CONDITIONAL — 70% | Only after `v_batch_risk_index` created | 3h |
| RegulatoryReporting | ❌ NO — 35% | Complex; requires regulatory framework | 12h |
| AuditTrail | ✅ EXISTS — 100% | Already implemented | 0h |
| ExceptionManagement | ✅ EXISTS — 100% | Already implemented | 0h |
| ReleaseGates | ⚠️ CONDITIONAL — 60% | Only if gate logic is expanded | 4h |

---

### 4. Operations Portal

**Frozen location:** `portal/operations/` (14 files)
**MVP location:** `routes/OperationsPage.tsx`

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| OperationsDashboard (overview) | ✅ Exists | ✅ Exists | MVP monitoring tab |
| OperationsMonitoring (live queue) | ✅ Exists | ✅ Exists | MVP monitoring tab with queue |
| OperationsAlerts | ✅ Exists | ✅ Exists | MVP alerts tab |
| OperationsSchedules | ✅ Exists | ⚠️ Partial | MVP schedules tab shows "No scheduled tasks" |
| OperationsRetry | ✅ Exists | ⚠️ Partial | MVP retry tab shows "No items in retry queue" |
| OperationsHealth (system health grid) | ✅ Exists | ✅ Exists | MVP health tab |
| OperationsExecution | ✅ Exists | ✅ Exists | MVP monitoring tab shows recent executions |
| OperationsFailures | ✅ Exists | ✅ Implemented | New — failure details view added to OperationsPage (Failures tab with expandable control execution grid) |
| OperationsQueues | ✅ Exists | ⚠️ Partial | MVP monitoring tab shows queue |
| **Data source** | Mock | Real API (`/health`, `/monitoring`, `/execution/history`) | — |

**MVP Data Relevance:** 90% — monitoring, alerts, health return real data; schedules/retry empty
**Frozen Data Relevance:** 0% — all mock
**Existing Views:** `engine.migration_batch_registry`, `engine.batch_execution_checkpoint`
**SQL View Assessment:** No new view needed
**Backend Readiness:** ✅ Ready — monitoring/health routes functional
**Priority:** P2 (Operations is secondary)
**Overall Page Completion:** 85% — 7 of 8 sub-tabs implemented (OperationsFailures added 2026-08-03)

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| OperationsDashboard | ✅ EXISTS — 100% | Already implemented | 0h |
| OperationsMonitoring | ✅ EXISTS — 100% | Already implemented | 0h |
| OperationsAlerts | ✅ EXISTS — 100% | Already implemented | 0h |
| OperationsSchedules | ⚠️ CONDITIONAL — 50% | Only if scheduler backend is built | 6h |
| OperationsRetry | ⚠️ CONDITIONAL — 55% | Only if retry logic is expanded | 4h |
| OperationsHealth | ✅ EXISTS — 100% | Already implemented | 0h |
| OperationsExecution | ✅ EXISTS — 100% | Already implemented | 0h |
| OperationsFailures | ✅ YES — 100% | Implementation complete — Failures tab with expandable detail view | 0h (done 2026-08-03) |
| OperationsQueues | ✅ EXISTS — 100% | Already implemented | 0h |

---

### 5. Reports Portal

**Frozen location:** `portal/reporting/` (14 files)
**MVP location:** `routes/ReportsPage.tsx`

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| ReportingOverview | ✅ Exists | ⚠️ Partial | MVP has batch selector + 4 report tabs |
| ValidationReports | ✅ Exists | ✅ Exists | MVP validation report tab with real data |
| GovernanceReports | ✅ Exists | ✅ Exists | MVP governance tab with real data |
| RiskScoreReport | ✅ Exists | ⚠️ Partial | MVP risk tab shows "No risk score" |
| ComplianceReport | ✅ Exists | ✅ Exists | MVP compliance tab with real data |
| ScheduledReports | ✅ Exists | ❌ Missing | New — scheduled report management |
| ReportTemplates | ✅ Exists | ❌ Missing | New — template management |
| ReportingWorkspace | ✅ Exists | ❌ Missing | New — workspace view |
| **Data source** | Mock | Real API (`/execution/{batch}/report`, `/execution/{batch}/governance`, etc.) | — |

**MVP Data Relevance:** 85% — validation, governance, compliance reports return real data; risk empty
**Frozen Data Relevance:** 0% — all mock
**Existing Views:** `engine.migration_control_summary`, `engine.migration_governance_status`, `engine.v_migration_stability_score`, `engine.migration_control_exceptions`
**SQL View Assessment:** `v_migration_stability_score` used for risk — 40% relevance (pass-rate, not risk score). Proposed `v_batch_risk_index` would improve to 100%.
**Backend Readiness:** ✅ Ready — report routes functional
**Priority:** P2 (Reports are important but secondary)
**Overall Page Completion:** 65% — 4 of 7 sub-pages implemented

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| ReportingOverview | ✅ EXISTS — 100% | Already implemented | 0h |
| ValidationReports | ✅ EXISTS — 100% | Already implemented | 0h |
| GovernanceReports | ✅ EXISTS — 100% | Already implemented | 0h |
| RiskScoreReport | ⚠️ CONDITIONAL — 70% | Only after `v_batch_risk_index` created | 3h |
| ComplianceReport | ✅ EXISTS — 100% | Already implemented | 0h |
| ScheduledReports | ❌ NO — 40% | Requires scheduler backend | 8h |
| ReportTemplates | ❌ NO — 35% | Complex template engine | 12h |
| ReportingWorkspace | ❌ NO — 25% | Low priority for MVP | 10h |

---

### 6. Administration Portal

**Frozen location:** `portal/administration/` (19 files)
**MVP location:** `routes/AdministrationPage.tsx`, `routes/UsersPage.tsx`, `routes/RolesPage.tsx`, `routes/SettingsPage.tsx`

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| AdministrationOverview (dashboard) | ✅ Exists | ✅ Exists | MVP overview tab |
| UserManagement | ✅ Exists | ✅ Exists | MVP UsersPage.tsx |
| RoleManagement | ✅ Exists | ✅ Exists | MVP RolesPage.tsx |
| TenantManagement | ✅ Exists | ⚠️ Partial | MVP tenants route exists but uses AdministrationPage |
| SystemSettings | ✅ Exists | ✅ Exists | MVP SettingsPage.tsx |
| FeatureFlags | ✅ Exists | ✅ Exists | MVP settings tab |
| PermissionManagement | ✅ Exists | ❌ Missing | New — permission matrix |
| OrganisationManagement | ✅ Exists | ❌ Missing | New — org structure |
| NotificationManagement | ✅ Exists | ❌ Missing | New — notification config |
| MaintenanceCentre | ✅ Exists | ⚠️ Partial | MVP maintenance tab |
| Licensing | ✅ Exists | ❌ Missing | New — license management |
| JobScheduler | ✅ Exists | ❌ Missing | New — job scheduling |
| HealthMonitoring | ✅ Exists | ✅ Exists | MVP health check |
| EnvironmentManagement | ✅ Exists | ❌ Missing | New — env management |
| PlatformConfiguration | ✅ Exists | ❌ Missing | New — platform config |
| SubscriptionManagement | ✅ Exists | ❌ Missing | New — subscription mgmt |
| **Data source** | Mock | Real API (`/users`, `/roles`, `/settings`, `/health`) | — |

**MVP Data Relevance:** 80% — users, roles, settings, health return real data; many sub-pages missing
**Frozen Data Relevance:** 0% — all mock
**Existing Views:** `platform.users`, `platform.roles`, `platform.settings` (assumed)
**SQL View Assessment:** No new view needed
**Backend Readiness:** ✅ Ready — admin routes functional
**Priority:** P3 (Administration is lower priority)
**Overall Page Completion:** 50% — 6 of 16 sub-pages implemented

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| AdministrationOverview | ✅ EXISTS — 100% | Already implemented | 0h |
| UserManagement | ✅ EXISTS — 100% | Already implemented | 0h |
| RoleManagement | ✅ EXISTS — 100% | Already implemented | 0h |
| TenantManagement | ⚠️ CONDITIONAL — 60% | Only if multi-tenant is needed | 6h |
| SystemSettings | ✅ EXISTS — 100% | Already implemented | 0h |
| FeatureFlags | ✅ EXISTS — 100% | Already implemented | 0h |
| PermissionManagement | ❌ NO — 40% | Complex; low priority | 8h |
| OrganisationManagement | ❌ NO — 30% | Not needed for MVP | 10h |
| NotificationManagement | ❌ NO — 35% | Low priority | 6h |
| MaintenanceCentre | ⚠️ CONDITIONAL — 50% | Basic maintenance only | 4h |
| Licensing | ❌ NO — 20% | Not needed for MVP | 8h |
| JobScheduler | ❌ NO — 30% | Requires scheduler backend | 10h |
| HealthMonitoring | ✅ EXISTS — 100% | Already implemented | 0h |
| EnvironmentManagement | ❌ NO — 25% | Not needed for MVP | 8h |
| PlatformConfiguration | ❌ NO — 30% | Not needed for MVP | 8h |
| SubscriptionManagement | ❌ NO — 20% | Not needed for MVP | 10h |

---

### 7. Security Portal

**Frozen location:** `portal/security/` (17 files)
**MVP location:** `routes/AdministrationPage.tsx` (security tab)

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| SecurityOverview | ✅ Exists | ⚠️ Partial | MVP security tab shows static policies |
| AuthenticationPolicies | ✅ Exists | ⚠️ Partial | MVP security tab |
| EncryptionManagement | ✅ Exists | ❌ Missing | New |
| KeyManagement | ✅ Exists | ❌ Missing | New |
| CertificateManagement | ✅ Exists | ❌ Missing | New |
| CredentialManagement | ✅ Exists | ❌ Missing | New |
| IdentityProviders | ✅ Exists | ❌ Missing | New |
| MultiFactorAuthentication | ✅ Exists | ❌ Missing | New |
| SessionManagement | ✅ Exists | ❌ Missing | New |
| ThreatMonitoring | ✅ Exists | ❌ Missing | New |
| AuditLogs | ✅ Exists | ⚠️ Partial | MVP audit tab in governance |
| ApiSecurity | ✅ Exists | ❌ Missing | New |
| ComplianceStatus | ✅ Exists | ⚠️ Partial | MVP compliance tab in governance |
| **Data source** | Mock | Static/hardcoded | — |

**MVP Data Relevance:** 30% — only static policy display
**Frozen Data Relevance:** 0% — all mock
**Backend Readiness:** ❌ Not ready — no security-specific routes
**Priority:** P3 (Security is lower priority for MVP)
**Overall Page Completion:** 15% — 2 of 13 sub-pages partially implemented

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| SecurityOverview | ⚠️ CONDITIONAL — 55% | Basic security status only | 3h |
| AuthenticationPolicies | ⚠️ CONDITIONAL — 50% | Only if auth config is needed | 4h |
| EncryptionManagement | ❌ NO — 20% | Not needed for MVP | 8h |
| KeyManagement | ❌ NO — 20% | Not needed for MVP | 8h |
| CertificateManagement | ❌ NO — 20% | Not needed for MVP | 8h |
| CredentialManagement | ❌ NO — 25% | Not needed for MVP | 6h |
| IdentityProviders | ❌ NO — 25% | Not needed for MVP | 8h |
| MultiFactorAuthentication | ❌ NO — 30% | Not needed for MVP | 6h |
| SessionManagement | ❌ NO — 30% | Not needed for MVP | 4h |
| ThreatMonitoring | ❌ NO — 20% | Not needed for MVP | 10h |
| AuditLogs | ✅ EXISTS — 80% | Already in governance audit tab | 0h |
| ApiSecurity | ❌ NO — 25% | Not needed for MVP | 6h |
| ComplianceStatus | ✅ EXISTS — 80% | Already in governance compliance tab | 0h |

---

### 8. Task Management Portal

**Frozen location:** `portal/task-management/` (8 files)
**MVP location:** `routes/TaskManagementPage.tsx`, `routes/WorkflowsPage.tsx`, `routes/NotificationsPage.tsx`

| Component | Frozen | MVP | Gap |
|-----------|--------|-----|-----|
| TaskDashboard | ✅ Exists | ✅ Exists | MVP TaskManagementPage.tsx |
| AllTasks | ✅ Exists | ✅ Exists | MVP TaskManagementPage.tsx |
| MyTasks | ✅ Exists | ❌ Missing | New — personal task view |
| TaskWorkflows | ✅ Exists | ✅ Exists | MVP WorkflowsPage.tsx |
| TaskCalendar | ✅ Exists | ❌ Missing | New — removed in Phase 08C |
| TaskApprovals | ✅ Exists | ❌ Missing | New — removed in Phase 08C |
| TaskNotifications | ✅ Exists | ✅ Exists | MVP NotificationsPage.tsx |
| **Data source** | Mock | Real API (`/workflows`, `/notifications`) | — |

**MVP Data Relevance:** 75% — workflows and notifications return real data
**Frozen Data Relevance:** 0% — all mock
**Backend Readiness:** ✅ Ready — workflow/notification routes functional
**Priority:** P3 (Task management is lower priority)
**Overall Page Completion:** 55% — 3 of 7 sub-pages implemented

**UI Component Recommendations:**

| Component | Include? | Rationale | Effort |
|-----------|----------|-----------|--------|
| TaskDashboard | ✅ EXISTS — 100% | Already implemented | 0h |
| AllTasks | ✅ EXISTS — 100% | Already implemented | 0h |
| MyTasks | ⚠️ CONDITIONAL — 55% | Only if user-specific tasks are needed | 4h |
| TaskWorkflows | ✅ EXISTS — 100% | Already implemented | 0h |
| TaskCalendar | ❌ NO — 30% | Removed in Phase 08C (dead feature) | 0h |
| TaskApprovals | ❌ NO — 30% | Removed in Phase 08C (dead feature) | 0h |
| TaskNotifications | ✅ EXISTS — 100% | Already implemented | 0h |

---

## Database Tables/Views Reference

### Tables Used by MVP Backend

| Table | Used By | Data Status |
|-------|---------|-------------|
| `engine.migration_batch_registry` | dashboard, execution_history, execution_control, monitoring, validation_report | ✅ Has data |
| `engine.migration_control_execution` | dashboard, governance, rule_execution, validation_report | ✅ Has data |
| `engine.migration_control_summary` | execution_history, governance, rule_execution, validation_report | ✅ Has data |
| `engine.migration_control_exceptions` | governance, validation_report | ✅ Has data |
| `engine.migration_release_decision` | governance | ✅ Has data |
| `engine.migration_governance_status` | execution_history, validation_report | ✅ Has data |
| `engine.batch_execution_checkpoint` | execution_control | ✅ Has data |
| `engine.control_registry` | dashboard | ✅ Has data |
| `engine.migration_validation_batch` | discovery, rule_execution | ✅ Has data |
| `engine.v_migration_stability_score` | validation_report (risk score) | ✅ Has data (40% relevance for risk) |

### Views — Relevance Assessment

| View | Current Use | Relevance | Assessment |
|------|-------------|-----------|------------|
| `engine.v_migration_stability_score` | Risk score in reports | 40% | Pass-rate stability, NOT risk score. Proposed `v_batch_risk_index` would be 100%. |
| `engine.v_dataset_risk_index` | Not used by MVP | 80% | Per-entity risk scoring. Could be used for risk tab. |
| `engine.v_migration_score_trend` | Not used by MVP | 60% | Score trends over time. Could enhance dashboard. |
| `engine.v_migration_health_dashboard` | Not used by MVP | 70% | Health metrics. Could enhance dashboard. |

### Proposed New Views

| View | Purpose | Relevance | Status |
|------|---------|-----------|--------|
| `v_batch_risk_index` | Per-batch risk scoring using FAIL=1, ERROR=2 methodology | 100% | Created — 506 batches, FAIL=1/ERROR=2 methodology | 2026-08-01 |
| `v_migration_score_summary` | Migration score summary per batch | 95% | Created — 506 batches, pass rate methodology | 2026-08-01 |

---

## Gap Summary Matrix

| Portal | Frozen Files | MVP Files | MVP Completion | Data Relevance | Backend Ready | Priority |
|--------|-------------|-----------|----------------|----------------|---------------|----------|
| Executive Dashboard | 12 | 1 | 95% | 95% | ✅ | P1 |
| Migration | 10 | 4 | 85% | 85% | ✅ | P1 |
| Governance | 11 | 1 | 70% | 85% | ✅ | P2 |
| Operations | 14 | 1 | 75% | 90% | ✅ | P2 |
| Reports | 14 | 1 | 65% | 85% | ✅ | P2 |
| Administration | 19 | 4 | 50% | 80% | ✅ | P3 |
| Security | 17 | 1 | 15% | 30% | ❌ | P3 |
| Task Management | 8 | 3 | 55% | 75% | ✅ | P3 |
| **TOTAL** | **105** | **16** | **65%** | **77%** | — | — |

---

## Key Findings

### 1. Frozen Frontend is a Mock Prototype
- All 8 portal hooks use hardcoded mock data
- No API calls to backend
- Rich UI components (WidgetRenderer, gauges, KPI cards, trend charts) are purely visual
- **Frozen frontend cannot be used as-is for production**

### 2. MVP Has Real Backend Integration
- All pages make real API calls
- Backend routes are functional and return real data
- Data flows correctly from database → repository → service → route → frontend

### 3. Gap is UI Richness, Not Data Flow
- MVP needs: gauge widgets, KPI trend charts, AI summaries, risk overview cards
- MVP has: basic metric cards, tables, status badges, tab navigation
- The frozen frontend's WidgetRenderer pattern could be adapted for MVP

### 4. Missing Backend Routes
- Project management routes (frozen has MigrationProjects)
- Dataset management routes (frozen has MigrationDatasets)
- Schedule management routes (frozen has MigrationSchedules)
- Security-specific routes (frozen has full security portal)
- These are P3 priorities and not blocking MVP deployment

### 5. Risk Score Data Gap — RESOLVED
- `v_batch_risk_index` view created in DB with 506 batches
- Uses FAIL=1, ERROR=2 risk scoring methodology
- Risk tabs in Reports and Governance now have a valid data source
- `v_migration_stability_score` (40% relevance) replaced by `v_batch_risk_index` (100% relevance)

---

## Recommendations

### Phase 1 (P1 — Immediate)
1. **Enhance DashboardPage** with ExecutiveSummary banner, ExecutiveKPI trends, ExecutiveHealth gauge, ExecutiveRisk card — ✅ ExecutiveSummary, ExecutiveKPI, ExecutiveHealth, ExecutiveActions implemented. ExecutiveRisk, ExecutiveInsights, ExecutiveNotifications deferred (P2)
2. **Add Migration sub-pages** for Projects, Datasets, Schedules — ✅ All 3 implemented with real API data, tenant filtering, role-based access
3. **Create `v_batch_risk_index` view** to enable Risk tab data — ✅ DONE — view created in DB with 506 batches, FAIL=1/ERROR=2 methodology
4. **Create `v_migration_score_summary` view** to enable Migration Score tile — ✅ DONE — view created in DB with 506 batches, pass rate methodology
4. **Add AccessDeniedPage** — ✅ Already exists at `src/routes/AccessDeniedPage.tsx`, routed at `/access-denied`, but ProtectedRoute shows inline message instead of redirecting

### Phase 2 (P2 — Short-term)
6. **Enhance ReportsPage** with better report formatting — ❌ NOT DONE — risk tab now has data via `v_batch_risk_index`, but formatting enhancements still pending
7. **Add Governance sub-pages** for Policies, Regulatory Reporting — ❌ NOT DONE
8. **Add EnvironmentBanner** — ❌ NOT DONE
9. **Add Breadcrumb navigation** — ✅ DONE — component wired in `Shell.tsx:89`, tests added
10. **Add Failures tab to OperationsPage** — ✅ DONE — failure details view with expandable control execution grid

### Phase 3 (P3 — Medium-term)
10. **Add Administration sub-pages** for Permissions, Organizations, Licensing
11. **Add Security portal** with authentication, encryption, certificate management
12. **Add Task Management sub-pages** for MyTasks, Calendar
13. **Add Role-based navigation filtering** (~16h)
14. **Add NotificationPanel** — live notification overlay (~12h)

### Phase 4 (P4 — Future)
15. **Add ForgotPasswordPage** — requires backend endpoint (~4h frontend + backend)
16. **Add SessionExpiredPage** — requires auth interceptor (~4h frontend + backend)
17. **Add Branding customization** — logo, colors, favicon (~8h)

---

## Blocked Items Resolution (Phase 09)

The following items were previously BLOCKED in Phase 08. Phase 09 analysis has resolved each.

### B-06: `engine.migration_batch_lifecycle` → RESOLVED

| Property | Value |
|----------|-------|
| Resolution | Use `engine.batch_execution_checkpoint` (partial match) |
| Rationale | `engine.migration_batch_lifecycle` never existed (no DDL, no Python INSERT). `engine.batch_execution_checkpoint` has 436 rows, populated by `execution_engine.py:_save_checkpoint`. Lifecycle endpoint `GET /api/v1/execution/{batch_id}/lifecycle` already uses this table. |
| Authoritative Source | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row |
| Supporting Docs | `09_Risk_Score_Decision.md`, `09_1_Implementation_Plan.md` |
| Action Required | None — existing `engine.batch_execution_checkpoint` is sufficient |

### B-07: `engine.migration_risk_scores` → RESOLVED

| Property | Value |
|----------|-------|
| Resolution | Create `engine.v_batch_risk_index` view instead of the table |
| Rationale | `engine.migration_risk_scores` DDL was never executed; table does not exist. `risk_scoring.py` INSERTs into it and fails. The correct alternative is `engine.v_batch_risk_index` — a proposed view using FAIL=1, ERROR=2 risk methodology grouped by `batch_id`, matching the API parameter with 100% relevance for the Risk Score tab. |
| Authoritative Source | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index` row; `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Unified Gap Analysis` tab → `RiskGovernance` row |
| SQL Definition | `09_Component_Source_Analysis.md` lines 179–268 (identical SQL also in `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab → `v_batch_risk_index (PROPOSED)` row → `Proposed SQL` column) |
| Supporting Docs | `09_Risk_Score_Decision.md`, `09_1_Implementation_Plan.md` |
| Action Required | 1. Create `engine.v_batch_risk_index` view in database. 2. Update `risk_scoring.py` to read from `engine.v_batch_risk_index` instead of `engine.migration_risk_scores`. 3. Wire Risk Score tab in ReportsPage and GovernancePage to the new view. |

### Deprecated: `engine.unified_scores`

| Property | Value |
|----------|-------|
| Status | DEPRECATED — 58 stale rows, no Python INSERT, no MAP CLI writer |
| Replacement | `engine.v_batch_risk_index` (100% relevance) for risk scoring; `engine.v_dataset_risk_index` (80% relevance) for entity-level risk |
| Authoritative Source | `09_Risk_Score_Decision.md` → Decision 1 |
| Supporting Docs | `09_Component_Source_Analysis.md`, `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab |

---

## Appendix A: Frozen Frontend File Inventory

### Portal Files (140 total)
- `portal/executive/` — 12 files (ExecutivePortal, ExecutiveHome, ExecutiveSummary, ExecutiveKPI, ExecutiveHealth, ExecutiveRisk, ExecutiveInsights, ExecutiveActions, ExecutiveNotifications, ExecutiveReports, ExecutiveNavigation, ExecutiveWidgets)
- `portal/migration/` — 10 files (MigrationPortal, MigrationOverview, MigrationProjects, MigrationExecution, MigrationDatasets, MigrationMappings, MigrationSchedules, MigrationHistory, MigrationReports, MigrationWorkspace)
- `portal/governance/` — 11 files (GovernancePortal, GovernanceOverview, Policies, ComplianceMonitoring, RiskGovernance, RegulatoryReporting, AuditTrail, ExceptionManagement, ReleaseGates, GovernanceNavigation, GovernanceWidgets)
- `portal/operations/` — 14 files (OperationsPortal, OperationsDashboard, OperationsMonitoring, OperationsAlerts, OperationsSchedules, OperationsRetry, OperationsHealth, OperationsExecution, OperationsFailures, OperationsQueues, OperationsNavigation, OperationsWidgets, OperationsHeader, OperationsHome)
- `portal/reporting/` — 14 files (ReportingPortal, ReportingOverview, ValidationReports, GovernanceReports, RiskScoreReport, ComplianceReport, ScheduledReports, ReportTemplates, ReportingWorkspace, ReportingNavigation, ReportingWidgets)
- `portal/administration/` — 19 files (AdministrationPortal, AdministrationOverview, UserManagement, RoleManagement, TenantManagement, SystemSettings, FeatureFlags, PermissionManagement, OrganisationManagement, NotificationManagement, MaintenanceCentre, Licensing, JobScheduler, HealthMonitoring, EnvironmentManagement, PlatformConfiguration, SubscriptionManagement, AdministrationNavigation, AdministrationDashboard)
- `portal/security/` — 17 files (SecurityPortal, SecurityOverview, AuthenticationPolicies, EncryptionManagement, KeyManagement, CertificateManagement, CredentialManagement, IdentityProviders, MultiFactorAuthentication, SessionManagement, ThreatMonitoring, AuditLogs, ApiSecurity, ComplianceStatus, SecurityNavigation, SecurityDashboard, SecurityEvents)
- `portal/task-management/` — 8 files (TaskManagementPortal, TaskDashboard, AllTasks, MyTasks, TaskWorkflows, TaskCalendar, TaskApprovals, TaskNotifications)
- `portal/framework/` — 11 files (PortalShell, PortalLayout, PortalHeader, PortalFooter, PortalBreadcrumb, PortalContent, PortalContext, PortalError, PortalLoader, PortalProvider, PortalRenderer)
- `portal/hooks/` — 8 files (useExecutiveDashboard, useMigrationDashboard, useGovernanceDashboard, useOperationsDashboard, useReportingDashboard, useSecurityDashboard, useAdminDashboard, usePortal)
- `portal/types/` — 12 files
- `portal/registry/` — 1 file
- `portal/routing/` — 1 file
- `portal/metadata/` — 1 file
- `portal/permissions/` — 1 file

### Page Files (23 total)
- `pages/dashboard/ExecutiveDashboardPage.tsx` — wraps ExecutivePortal
- `pages/governance/GovernancePage.tsx` — ComingSoon placeholder
- `pages/migration/MigrationOverviewPage.tsx` — ComingSoon placeholder
- `pages/migration/MigrationJobsPage.tsx` — ComingSoon placeholder
- `pages/migration/MigrationHistoryPage.tsx` — ComingSoon placeholder
- `pages/validation/ValidationRulesPage.tsx` — ComingSoon placeholder
- `pages/validation/ValidationResultsPage.tsx` — ComingSoon placeholder
- `pages/validation/ValidationQueuePage.tsx` — ComingSoon placeholder
- `pages/reports/ReportsPage.tsx` — ComingSoon placeholder
- `pages/risk/RiskPage.tsx` — ComingSoon placeholder
- `pages/settings/SettingsPage.tsx` — ComingSoon placeholder
- `pages/administration/AdministrationPage.tsx` — ComingSoon placeholder
- `pages/ai/AIAssistantPage.tsx` — ComingSoon placeholder
- `pages/ai/AIInsightsPage.tsx` — ComingSoon placeholder
- `pages/ai/AIRecommendationsPage.tsx` — ComingSoon placeholder
- `pages/ai/AIReportGeneratorPage.tsx` — ComingSoon placeholder
- `pages/help/HelpPage.tsx` — ComingSoon placeholder
- `pages/HomePage.tsx` — ComingSoon placeholder
- `pages/authentication/LoginPage.tsx` — ComingSoon placeholder
- `pages/authentication/LogoutPage.tsx` — ComingSoon placeholder
- `pages/authentication/SessionExpiredPage.tsx` — ComingSoon placeholder
- `pages/authentication/ForgotPasswordPage.tsx` — ComingSoon placeholder
- `pages/authentication/AccessDeniedPage.tsx` — ComingSoon placeholder

---

## Cross-Cutting Analysis: Login, Themes, Layout & Navigation

### 9. Login & Authentication UI

| Item | Frozen Frontend | MVP Frontend | Include in New MVP? |
|------|----------------|--------------|-------------------|
| LoginPage | Rich UI: email+password, show/hide toggle, lucide icons, loading state | Functional: email+password, useAuth hook, real API, navigate('/dashboard') | **YES — already exists** |
| ForgotPasswordPage | Mock form: email input, submit → "reset email sent" toast, no backend | **MISSING** | **CONDITIONAL — needs backend endpoint** |
| SessionExpiredPage | Clears localStorage → redirect /login with "Session expired" message | **MISSING** | **CONDITIONAL — needs auth interceptor** |
| AccessDeniedPage | "Access Denied" wrapper (404-style page with icon + "Go Back" button) | **MISSING** | **YES — simple static component** |

**Summary:** Frozen has 4 auth pages (LoginPage, ForgotPassword, SessionExpired, AccessDenied). MVP has only LoginPage (functional). Gap: 3 pages missing.

**Recommendation:**
- **AccessDeniedPage** — INCLUDE: Simple static component, no backend dependency (~2h)
- **SessionExpiredPage** — CONDITIONAL: Requires auth interceptor to detect 401; MVP already handles logout redirect via RoleSwitcher logout. Lower priority
- **ForgotPasswordPage** — CONDITIONAL: Requires backend `/auth/forgot-password` endpoint (not yet built). Lower priority

### 10. Themes (Light/Dark, Branding, Colours)

| Item | Frozen Frontend | MVP Frontend | Include in New MVP? |
|------|----------------|--------------|-------------------|
| CSS Variables | Comprehensive: 22+ color vars, layout vars, typography, spacing, shadows, transitions | Has `variables.css` with 22 color vars (same schema: --color-primary-* through --color-*), spacing, typography | **YES — already exists** |
| Dark Mode Toggle | Header has Moon/Sun toggle → calls `setTheme()` + localStorage | `ThemeToggle.tsx` — Moon/Sun toggle, persists to localStorage, respects system preference | **YES — already exists** |
| Theme Application | `theme/light.ts` + `theme/dark.ts` — full theme objects | CSS variables applied via `:root`/`.dark` class on `<html>` | **YES — already exists** (different approach, same outcome) |
| Branding/Customization | Frozen has logo, brand colors, custom favicon support | MVP: hardcoded logo, no branding config | **NO — not MVP scope** |
| System Preference Detection | `prefers-color-scheme` media query | Same — `window.matchMedia('(prefers-color-scheme: dark)')` | **YES — already exists** |

**Summary:** Both frontends have light/dark theme support. Frozen uses theme objects, MVP uses CSS variables. Functionally equivalent. No gap for basic theme support.

**Recommendation:**
- **Light/Dark Theme** — YES, already in MVP. No action needed
- **Branding customization** — NO, not MVP scope. Future enhancement
- **Environment-aware theming** — CONDITIONAL: Frozen's `EnvironmentBanner` uses theme-aware colors (dev=blue, testing=yellow, prod=red). MVP has no environment banner

### 11. Layout & Navigation

#### Layout Components

| Component | Frozen Frontend | MVP Frontend | Include in New MVP? |
|-----------|----------------|--------------|-------------------|
| ApplicationShell | Wraps all portals: EnvironmentBanner + Header + Sidebar + Breadcrumb + Footer + StatusBar + LoadingOverlay | **MISSING** (MVP uses `Layout.tsx` as shell) | **NO — MVP has simpler Layout** |
| Header | Sticky top: GlobalSearch, EnvironmentIndicator, ThemeToggle, RoleSwitcher, NotificationsDropdown, ProfileMenu, LogoutConfirm | **MISSING** (MVP header is inline in Layout.tsx) | **NO — MVP has simpler header** |
| Sidebar | Collapsible: navigation config, mobile responsive, icons+labels, active state highlighting | `DynamicNavigation.tsx` — similar collapsible sidebar with icons+labels | **YES — already exists** |
| Footer | `ApplicationFooter`: version, copyright, links, API status | **MISSING** | **NO — not critical for MVP** |
| Breadcrumb | Auto-generated from current path, click-to-navigate | **MISSING** | **CONDITIONAL — nice-to-have** |
| StatusBar | Live system metrics (CPU, memory, response time) — always visible at bottom | **MISSING** | **NO — operational dashboard has this** |
| EnvironmentBanner | Dev/Testing/UAT/Prod banner at top — always visible | **MISSING** | **CONDITIONAL — useful for multi-env deployments** |
| GlobalSearch | Search portal names, categories, recent searches | **MISSING** | **NO — not critical for MVP** |
| NotificationPanel | Live notification list with mark-read, filter by type | `NotificationsPage.tsx` — full page, not a panel | **CONDITIONAL — panel vs page** |
| UserProfileMenu | Profile, preferences, logout, role info | **MISSING** — RoleSwitcher has logout | **NO — MVP has RoleSwitcher** |
| LoadingOverlay | Global loading spinner for transitions | **MISSING** | **NO — individual pages handle loading** |
| QuickActions | Floating action button: common tasks | **MISSING** | **NO — not critical for MVP** |
| PageHeader | Page title, description, breadcrumb, action buttons | **MISSING** — pages define their own headers | **NO — MVP has simpler approach** |
| PageContainer | Consistent page padding, max-width, responsive | `PageContainer.tsx` — padding, max-width, responsive | **YES — already exists** |

**Summary:** Frozen has 14 layout components. MVP has 3 (Layout, Shell, PageContainer). Gap: 11 components missing, but most are non-critical for MVP scope.

**Recommendation:**
- **Header, Sidebar, Layout, PageContainer** — YES, already in MVP
- **EnvironmentBanner** — CONDITIONAL: Useful for multi-env deployments, but MVP uses single env. ~8h
- **Breadcrumb** — CONDITIONAL: Nice-to-have for navigation. ~4h
- **StatusBar** — NO, operational dashboard already covers system metrics
- **Footer, GlobalSearch, QuickActions, LoadingOverlay, UserProfileMenu, PageHeader** — NO, not MVP scope

#### Navigation Structure

| Navigation Config | Frozen Frontend | MVP Frontend | Include in New MVP? |
|-------------------|----------------|--------------|-------------------|
| Sections | 4 sections: Main, Portals, Operations, System | 1 section: DEFAULT_NAV array (8 items) | **YES — MVP has simpler structure** |
| Top-level items | 17 items (Home, Dashboard, Operations, Migration, Validation, Governance, Risk, Reports, Report Centre, Scheduler, Distribution, Task Management, AI Platform, Administration, Security, Settings, Help) | 8 items (Home, Migration, Validation, Governance, Reports, Operations, Tasks, Administration) | **PARTIAL — 8 items cover core MVP** |
| Sub-items | 100+ nested children across all portals | DynamicNavigation renders from `DEFAULT_NAV` (no nested children) | **NO — MVP uses flat nav** |
| Mobile responsive | Dedicated MobileNavigation component | DynamicNavigation has responsive drawer | **YES — already exists** |
| Role-based filtering | Navigation filtered by user roles via NavigationContext | Navigation visible to all authenticated users | **CONDITIONAL — RBAC filtering** |

**Summary:** Frozen has 17 nav items with 100+ sub-items in 4 sections. MVP has 8 items in a flat structure. Frozen has role-based filtering, MVP does not.

**Recommendation:**
- **Core navigation items** — YES, MVP covers the essentials (Home, Migration, Validation, Governance, Reports, Operations, Tasks, Administration)
- **Additional nav items (Risk, Security, AI Platform)** — CONDITIONAL: Phase 08B/08C already added Governance tabs. Risk nav can be added when risk pages are built
- **Nested children/sections** — NO, flat nav is simpler for MVP
- **Role-based nav filtering** — CONDITIONAL: Useful for enterprise, but MVP assumes all authenticated users see all nav. ~16h to implement
- **Mobile navigation** — YES, already in MVP via DynamicNavigation

---

## Appendix B: MVP Frontend File Inventory

### Route Files (28 total)
- `routes/DashboardPage.tsx` — Real API calls, portfolio + activity
- `routes/GovernancePage.tsx` — Real API calls, 6 tabs (overview, compliance, controls, exceptions, risk, audit)
- `routes/MigrationPage.tsx` — Migration trigger + status
- `routes/MappingPage.tsx` — Mapping management
- `routes/ValidationPage.tsx` — Validation trigger + workflow list
- `routes/ValidationResultsPage.tsx` — Batch status polling
- `routes/ExecutionHistoryPage.tsx` — Paginated history + re-execute
- `routes/DiscoveryPage.tsx` — System discovery trigger
- `routes/ReportsPage.tsx` — 4 report tabs (validation, governance, risk, compliance)
- `routes/OperationsPage.tsx` — 5 tabs (monitoring, alerts, schedules, retry, health)
- `routes/WorkflowsPage.tsx` — Workflow management
- `routes/NotificationsPage.tsx` — Notification list
- `routes/TaskManagementPage.tsx` — Task management
- `routes/TaskDetailPage.tsx` — Task details
- `routes/SystemsPage.tsx` — System list
- `routes/SystemDetailPage.tsx` — System details
- `routes/UsersPage.tsx` — User management
- `routes/UserDetailPage.tsx` — User details
- `routes/RolesPage.tsx` — Role management
- `routes/RoleDetailPage.tsx` — Role details
- `routes/SettingsPage.tsx` — Settings management
- `routes/AdministrationPage.tsx` — Admin dashboard with tabs
- `routes/CalendarPage.tsx` — Calendar (removed in Phase 08C)
- `routes/ApprovalsPage.tsx` — Approvals (removed in Phase 08C)
- `routes/ApprovalDetailPage.tsx` — Approval details (removed in Phase 08C)
- `routes/HomePage.tsx` — Home page
- `routes/LoginPage.tsx` — Login page
- `routes/NotFoundPage.tsx` — 404 page

---

*End of Gap Analysis*
