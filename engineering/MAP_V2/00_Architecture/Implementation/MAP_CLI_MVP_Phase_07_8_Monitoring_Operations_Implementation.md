# MAP CLI MVP Phase 07.8 — Monitoring & Operations UI Implementation

## Objective
Implement the Monitoring & Operations UI (OperationsPage.tsx) to provide system health monitoring, execution queue visibility, performance metrics, and operational alerts. This replaces the current placeholder with a functional monitoring dashboard.

## Current Situation
The OperationsPage.tsx is currently a placeholder displaying only a title and description. The `/operations/*` routes all point to this placeholder.

| Current State | Issue |
|---------------|-------|
| OperationsPage.tsx | Placeholder — no functionality |
| `/operations/monitoring` | Points to placeholder |
| `/operations/alerts` | Points to placeholder |
| `/operations/schedules` | Points to placeholder |
| `/operations/retry` | Points to placeholder |
| `/operations/health` | Points to placeholder |

## Capability Implemented
**Monitoring & Operations UI** — Users can:
1. View system health status (database, services)
2. See active executions with real-time status
3. View execution history with filtering
4. Access performance metrics (response times, throughput)
5. View operational alerts and notifications
6. Access runtime diagnostics

## APIs Consumed (Existing)

| Endpoint | Method | Purpose | Source |
|----------|--------|---------|--------|
| `GET /health` | GET | Basic health check | `app/api/main.py` |
| `GET /api/v1/health` | GET | API health check | `app/api/main.py` |
| `GET /api/v1/ready` | GET | Readiness check (DB) | `app/api/main.py` |
| `GET /api/v1/execution/history` | GET | Execution history list | `app/api/routes/execution_history_routes.py` (07.6.1) |
| `GET /api/v1/execution/status/{batch_id}` | GET | Individual execution status | `app/api/routes/execution_routes.py` |
| `GET /api/v1/execution/{batch_id}/report` | GET | Execution report | `app/api/routes/validation_report_routes.py` (07.5.1) |

## Files Created

| File | Purpose |
|------|---------|
| `src/routes/OperationsPage.test.tsx` | Unit tests for OperationsPage |
| `src/routes/OperationsPage.integration.test.tsx` | Integration tests |
| `src/hooks/useHealth.ts` | Hook for health check APIs |
| `src/hooks/useMonitoring.ts` | Hook for monitoring data aggregation |

## Files Modified

| File | Change |
|------|--------|
| `src/routes/OperationsPage.tsx` | Replace placeholder with monitoring dashboard |

## Reuse

| Component | Source | Usage |
|-----------|--------|-------|
| `usePollBatchStatus` | `src/hooks/useExecution.ts` | Real-time execution status |
| `LoadingSpinner` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Loading state |
| `ErrorMessage` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Error state |
| `useAuth` | `src/context/AuthContext.tsx` | Permission gating |

## Page Reference Matrix

| Page | Route | Parent | Component | Description |
|------|-------|--------|-----------|-------------|
| OperationsPage | `/operations` | — | `OperationsPage.tsx` | Top-level operations page with tabs |
| OperationsPage (Monitoring) | `/operations/monitoring` | OperationsPage | `OperationsPage.tsx` | Health + Active Executions |
| OperationsPage (Alerts) | `/operations/alerts` | OperationsPage | `OperationsPage.tsx` | Alerts list |
| OperationsPage (Schedules) | `/operations/schedules` | OperationsPage | `OperationsPage.tsx` | Schedules list |
| OperationsPage (Retry) | `/operations/retry` | OperationsPage | `OperationsPage.tsx` | Retry queue |
| OperationsPage (Health) | `/operations/health` | OperationsPage | `OperationsPage.tsx` | Detailed health |

## Navigation/RBAC Matrix

| Route | Nav Label | Role Required | Behavior |
|-------|-----------|---------------|----------|
| `/operations` | Operations | admin | Full access to all tabs |
| `/operations/monitoring` | Operations | admin | Monitoring tab (default) |
| `/operations/alerts` | Operations | admin | Alerts tab |
| `/operations/schedules` | Operations | admin | Schedules tab |
| `/operations/retry` | Operations | admin | Retry queue tab |
| `/operations/health` | Operations | admin | Health detail tab |

## Tab Structure

| Tab | Route | Content | Default |
|-----|-------|---------|---------|
| Monitoring | `/operations/monitoring` | Health status + Active executions + Queue | ✅ Yes |
| Alerts | `/operations/alerts` | Alerts list with severity filtering | No |
| Schedules | `/operations/schedules` | Scheduled tasks | No |
| Retry | `/operations/retry` | Retry queue for failed jobs | No |
| Health | `/operations/health` | Detailed system health | No |

## Widget Catalogue

| Widget | Data Source | Refresh Interval | Description |
|--------|-------------|------------------|-------------|
| HealthWidget | `/health`, `/api/v1/ready` | 15s | System health indicators |
| QueueWidget | `/api/v1/monitoring/queue` | 10s | Job queue status |
| ActiveExecutionsWidget | `/api/v1/execution/history` | 10s | Running executions |
| AlertsWidget | `/api/v1/monitoring/alerts` | 30s | Active alerts |
| LogsWidget | `/api/v1/monitoring/logs` | 30s | Operational logs |
| MetricsWidget | `/api/v1/monitoring/metrics` | 60s | Performance metrics |

## States Implemented

| State | Implementation |
|-------|----------------|
| **Loading** | `LoadingSpinner` while fetching health/data |
| **Error** | `ErrorMessage` component with error details |
| **Healthy** | Green status indicators for all systems |
| **Degraded** | Yellow status indicators for partial failures |
| **Unhealthy** | Red status indicators for system failures |
| **Empty** | "No active executions" message |
| **Permission Denied** | "You do not have permission" message for non-admin users |

## Metadata Consumed

| Metadata | Source | Usage |
|----------|--------|-------|
| Navigation | `/api/v1/navigation` | Shell renders sidebar with operations links |

## Doc 04 Compliance

| Doc 04 Convention | Implementation |
|-------------------|----------------|
| `/api/v1` prefix | All API calls use `/api/v1` prefix |
| Noun-based resources | `/health`, `/execution` |
| Standard HTTP methods | GET |
| Response format `{ success, data, error }` | Standard API response handling |
| Standard HTTP status codes | Throws on `!res.ok` |

## Permission Gating

| Page | Required Role | Behavior |
|------|---------------|----------|
| OperationsPage | `admin` | Shows permission error if not admin |

## Phase 6 Traceability
- §4.1 #1.2 Monitoring & Operations
- §8 Build Order — Monitoring & Operations
- §6 Page Reference Matrix — OperationsPage
- §7 Readiness Matrix — Monitoring & Operations

## Backend Dependencies

| Dependency | Phase | Purpose |
|------------|-------|---------|
| 07.5.1 | Discovery & Validation APIs | Provides report endpoints |
| 07.6.1 | Reporting & Results APIs | Provides execution history endpoint |
| 07.8.1 | Monitoring APIs | **NEW** — System health, metrics, alerts (see below) |

### Missing APIs (Requires 07.8.1 Backend)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/monitoring/health` | GET | Detailed system health |
| `/api/v1/monitoring/metrics` | GET | Performance metrics |
| `/api/v1/monitoring/queue` | GET | Job queue status |
| `/api/v1/monitoring/alerts` | GET | Active alerts |
| `/api/v1/monitoring/logs` | GET | Operational logs |

## Tests Required

| Test Type | Count | Status |
|-----------|-------|--------|
| Unit tests (OperationsPage) | — | Required |
| Unit tests (useHealth hook) | — | Required |
| Unit tests (useMonitoring hook) | — | Required |
| Integration tests | — | Required |
| RBAC tests | — | Required |
| **Total** | — | **Required** |

## Outstanding Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | No monitoring APIs | High | Requires 07.8.1 backend implementation |
| 2 | No metrics collection | Medium | Backend needs to expose performance data |
| 3 | No alerts system | Medium | Backend needs alerts API |

## Gate
➡ **Awaiting architectural review and approval before implementation.**

**Phase 07.8 Summary:** Monitoring & Operations UI implementation plan. Replaces placeholder OperationsPage.tsx with monitoring dashboard. Uses existing health endpoints. Tab-based layout: Monitoring (default), Alerts, Schedules, Retry, Health. Requires 07.8.1 for monitoring-specific APIs (health details, metrics, queue, alerts, logs).

---

## Rules
- Do NOT invent APIs. Use only existing endpoints.
- Document missing APIs for 07.8.1 backend implementation.
- Reuse existing hooks and components.
- Do NOT recreate infrastructure.
- No mock data.
- Frontend follows Doc 21 architecture.

## Stop after completion.
Wait for approval before implementing the next capability.

## Create report
MAP_CLI_MVP_Phase_07_8_Monitoring_Operations_UI_Implementation_Report.md

## Save report to
engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
