# MAP CLI MVP Phase 07.10 — Enterprise Dashboard Implementation

## Objective
Implement the Enterprise Dashboard (DashboardPage.tsx) to provide an executive-level overview with migration portfolio summary, KPIs, validation status, execution summary, risk/compliance/governance summaries, and system health. This replaces the current placeholder with a widget-based, role-aware dashboard.

## Current Situation
The DashboardPage.tsx is currently a placeholder displaying only a title and description. The `/dashboard` route points to this placeholder.

| Current State | Issue |
|---------------|-------|
| DashboardPage.tsx | Placeholder — no functionality |
| `/dashboard` | Points to placeholder |

## Capability Implemented
**Enterprise Dashboard** — Users can:
1. View migration portfolio overview (active projects, batches)
2. See programme KPIs (success rate, average score, total executions)
3. View live validation summary (running/completed/failed)
4. See execution summary (recent executions with status)
5. View risk summary (average risk score, high-risk items)
6. See compliance summary (exceptions by severity)
7. View governance summary (pending decisions, approval rate)
8. See system health summary (database, services status)
9. Access quick actions (start execution, view reports)
10. Role-aware dashboard (different views for admin vs viewer)

## APIs Consumed (Existing)

| Endpoint | Method | Purpose | Source |
|----------|--------|---------|--------|
| `GET /api/v1/execution/history` | GET | Execution history for portfolio | `app/api/routes/execution_history_routes.py` (07.6.1) |
| `GET /api/v1/execution/{batch_id}/report` | GET | Validation report | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /api/v1/execution/{batch_id}/risk-score` | GET | Risk scoring | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /api/v1/execution/{batch_id}/compliance` | GET | Compliance checks | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /api/v1/execution/{batch_id}/governance` | GET | Governance decisions | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /health` | GET | Basic health check | `app/api/main.py` |
| `GET /api/v1/ready` | GET | Readiness check | `app/api/main.py` |

## Files Created

| File | Purpose |
|------|---------|
| `src/routes/DashboardPage.test.tsx` | Unit tests for DashboardPage |
| `src/routes/DashboardPage.integration.test.tsx` | Integration tests |
| `src/hooks/useDashboard.ts` | Hook for dashboard data aggregation |
| `src/components/widgets/PortfolioWidget.tsx` | Migration portfolio widget |
| `src/components/widgets/KPIWidget.tsx` | KPI metrics widget |
| `src/components/widgets/ValidationSummaryWidget.tsx` | Validation summary widget |
| `src/components/widgets/ExecutionSummaryWidget.tsx` | Execution summary widget |
| `src/components/widgets/RiskSummaryWidget.tsx` | Risk summary widget |
| `src/components/widgets/ComplianceSummaryWidget.tsx` | Compliance summary widget |
| `src/components/widgets/GovernanceSummaryWidget.tsx` | Governance summary widget |
| `src/components/widgets/HealthWidget.tsx` | System health widget |

## Files Modified

| File | Change |
|------|--------|
| `src/routes/DashboardPage.tsx` | Replace placeholder with widget-based dashboard |

## Reuse

| Component | Source | Usage |
|-----------|--------|-------|
| `LoadingSpinner` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Loading state |
| `ErrorMessage` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Error state |
| `useAuth` | `src/context/AuthContext.tsx` | Permission gating, role-based views |

## Page Reference Matrix

| Page | Route | Parent | Component | Description |
|------|-------|--------|-----------|-------------|
| DashboardPage | `/dashboard` | — | `DashboardPage.tsx` | Executive dashboard |
| DashboardPage (Executive) | `/dashboard` | DashboardPage | `DashboardPage.tsx` | Executive view (admin only) |
| DashboardPage (Operational) | `/dashboard` | DashboardPage | `DashboardPage.tsx` | Operational view (admin only) |
| DashboardPage (Viewer) | `/dashboard` | DashboardPage | `DashboardPage.tsx` | Read-only view (viewer role) |

## Navigation/RBAC Matrix

| Route | Nav Label | Role Required | Behavior |
|-------|-----------|---------------|----------|
| `/dashboard` | Dashboard | admin | Full dashboard with all widgets |
| `/dashboard` | Dashboard | viewer | Read-only view with limited widgets |

## Dashboard Layouts

### Executive Layout (Admin)

| Row | Widgets | Width |
|-----|---------|-------|
| 1 | PortfolioWidget (1/3) + KPIWidget (2/3) | Full |
| 2 | ExecutionSummaryWidget (1/2) + ValidationSummaryWidget (1/2) | Full |
| 3 | RiskSummaryWidget (1/3) + ComplianceSummaryWidget (1/3) + GovernanceSummaryWidget (1/3) | Full |
| 4 | HealthWidget (1/2) + QuickActions (1/2) | Full |

### Operational Layout (Admin)

| Row | Widgets | Width |
|-----|---------|-------|
| 1 | HealthWidget (1/3) + QueueWidget (2/3) | Full |
| 2 | ActiveExecutionsWidget (1/2) + AlertsWidget (1/2) | Full |
| 3 | ExecutionSummaryWidget (1/3) + ValidationSummaryWidget (2/3) | Full |

### Viewer Layout

| Row | Widgets | Width |
|-----|---------|-------|
| 1 | KPIWidget (1/2) + ExecutionSummaryWidget (1/2) | Full |
| 2 | ComplianceSummaryWidget (1/2) + RiskSummaryWidget (1/2) | Full |

## Widget Catalogue

| Widget | Data Source | Refresh Interval | Layout |
|--------|-------------|------------------|--------|
| PortfolioWidget | `/execution/history` | 60s | Executive Row 1 |
| KPIWidget | Aggregated from history | 60s | Executive Row 1 |
| ValidationSummaryWidget | `/execution/{id}/report` | 30s | Executive Row 2 |
| ExecutionSummaryWidget | `/execution/history` | 30s | Executive Row 2 |
| RiskSummaryWidget | `/execution/{id}/risk-score` | 60s | Executive Row 3 |
| ComplianceSummaryWidget | `/execution/{id}/compliance` | 60s | Executive Row 3 |
| GovernanceSummaryWidget | `/execution/{id}/governance` | 60s | Executive Row 3 |
| HealthWidget | `/health`, `/api/v1/ready` | 15s | Executive Row 4 |
| QueueWidget | `/api/v1/monitoring/queue` | 10s | Operational Row 1 |
| ActiveExecutionsWidget | `/api/v1/execution/history` | 10s | Operational Row 2 |
| AlertsWidget | `/api/v1/monitoring/alerts` | 30s | Operational Row 2 |
| QuickActions | — | — | Executive Row 4 |

## KPI Definitions

| KPI | Calculation | Source |
|-----|-------------|--------|
| Total Executions | COUNT(batch_id) | execution_history |
| Success Rate | (COMPLETED / total) * 100 | execution_history |
| Average Score | AVG(overall_score) | validation_report |
| Active Projects | COUNT(DISTINCT project_id) | execution_history |
| High Risk Items | COUNT where risk_level = 'HIGH' or 'CRITICAL' | risk_score |
| Pending Approvals | COUNT where status = 'PENDING' | governance |

## Dashboard Refresh Strategy

| Widget Category | Refresh Interval | Strategy |
|-----------------|------------------|----------|
| Health (HealthWidget) | 15s | Polling |
| Active (QueueWidget, ActiveExecutionsWidget) | 10s | Polling |
| Summary (ExecutionSummary, ValidationSummary) | 30s | Polling |
| KPI (PortfolioWidget, KPIWidget) | 60s | Polling |
| Governance (Risk, Compliance, Governance) | 60s | Polling |
| Alerts | 30s | Polling |

**Total Refresh:** All widgets refresh independently. No full-page refresh required.

## States Implemented

| State | Implementation |
|-------|----------------|
| **Loading** | `LoadingSpinner` while fetching dashboard data |
| **Error** | `ErrorMessage` component with error details |
| **Empty** | "No data available" message for each widget |
| **Permission Denied** | "You do not have permission" message for non-admin users |
| **Healthy** | Green indicators for all systems |
| **Degraded** | Yellow indicators for partial failures |

## Metadata Consumed

| Metadata | Source | Usage |
|----------|--------|-------|
| Navigation | `/api/v1/navigation` | Shell renders sidebar with dashboard link |

## Doc 04 Compliance

| Doc 04 Convention | Implementation |
|-------------------|----------------|
| `/api/v1` prefix | All API calls use `/api/v1` prefix |
| Noun-based resources | `/execution`, `/health` |
| Standard HTTP methods | GET |
| Response format `{ success, data, error }` | Standard API response handling |
| Standard HTTP status codes | Throws on `!res.ok` |

## Permission Gating

| Page | Required Role | Behavior |
|------|---------------|----------|
| DashboardPage | `admin` | Full dashboard with all widgets |
| DashboardPage | `viewer` | Read-only view with limited widgets |

## Phase 6 Traceability
- §4.1 #1.2 Enterprise Dashboard
- §8 Build Order — Enterprise Dashboard
- §6 Page Reference Matrix — DashboardPage
- §7 Readiness Matrix — Enterprise Dashboard

## Backend Dependencies

| Dependency | Phase | Purpose |
|------------|-------|---------|
| 07.5.1 | Discovery & Validation APIs | Provides report, compliance, risk, governance endpoints |
| 07.6.1 | Reporting & Results APIs | Provides execution history endpoint |
| 07.10.1 | Dashboard Aggregation APIs | **NEW** — Aggregated KPIs, portfolio summary (see below) |

### Missing APIs (Requires 07.10.1 Backend)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/dashboard/portfolio` | GET | Aggregated portfolio summary |
| `/api/v1/dashboard/kpis` | GET | KPI calculations |
| `/api/v1/dashboard/summary` | GET | Aggregated dashboard summary |

## Tests Required

| Test Type | Count | Status |
|-----------|-------|--------|
| Unit tests (DashboardPage) | — | Required |
| Unit tests (useDashboard hook) | — | Required |
| Unit tests (all widgets) | — | Required |
| Integration tests | — | Required |
| RBAC tests | — | Required |
| **Total** | — | **Required** |

## Outstanding Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | No dashboard aggregation API | High | Requires 07.10.1 backend implementation |
| 2 | No KPI calculation API | Medium | Backend needs to aggregate metrics |
| 3 | No monitoring APIs | Medium | Requires 07.8.1 for Operational layout widgets |

## Gate
➡ **Awaiting architectural review and approval before implementation.**

**Phase 07.10 Summary:** Enterprise Dashboard implementation plan. Replaces placeholder DashboardPage.tsx with widget-based executive dashboard. Uses existing execution, report, compliance, risk, governance, and health endpoints. Role-aware layouts: Executive (admin), Operational (admin), Viewer (viewer). Requires 07.10.1 for dashboard aggregation APIs and 07.8.1 for monitoring widgets.

---

## Rules
- Do NOT invent APIs. Use only existing endpoints.
- Document missing APIs for 07.10.1 backend implementation.
- Reuse existing hooks and components.
- Do NOT recreate infrastructure.
- No mock data.
- Frontend follows Doc 21 architecture.
- Widgets must be modular and reusable.

## Stop after completion.
Wait for approval before implementing the next capability.

## Create report
MAP_CLI_MVP_Phase_07_10_Enterprise_Dashboard_Implementation_Report.md

## Save report to
engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
