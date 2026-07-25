# MAP CLI MVP Phase 07.10.1 — Backend Support for Phase 07.10

## Objective
Implement backend APIs to fully support Phase 07.10 frontend (DashboardPage.tsx — Enterprise Dashboard). This is a **required dependency** — without these APIs, Phase 07.10 remains limited.

## Current Situation
Phase 07.10 frontend launched successfully but remains **functionally incomplete** due to backend API gaps:

| Missing Capability | Frontend Impact |
|-------------------|-----------------|
| ❌ Aggregated portfolio summary | DashboardPage cannot show migration portfolio overview |
| ❌ KPI calculations | No access to programme KPIs (success rate, average score) |
| ❌ Dashboard summary | No aggregated dashboard view across all metrics |
| ❌ Role-aware data | Cannot provide different data views for admin vs viewer |

## Why Needed — Business Requirements
1. **Executive Visibility:** Leadership needs portfolio-level overview
2. **Performance Tracking:** Need KPIs for programme success measurement
3. **Decision Support:** Need aggregated data for governance decisions
4. **Efficiency:** Need single dashboard view instead of multiple page visits
5. **Role-Based:** Different stakeholders need different data views

## Implemented (Phase 07.10 Frontend)
- ✅ GET `/api/v1/execution/history` (exists — from 07.6.1)
- ✅ GET `/api/v1/execution/{batch_id}/report` (exists — from 07.5.1)
- ✅ GET `/api/v1/execution/{batch_id}/risk-score` (exists — from 07.5.1)
- ✅ GET `/api/v1/execution/{batch_id}/compliance` (exists — from 07.5.1)
- ✅ GET `/api/v1/execution/{batch_id}/governance` (exists — from 07.5.1)
- ✅ GET `/health` (exists — basic health)
- ✅ GET `/api/v1/ready` (exists — readiness check)

## Missing Backend APIs (Phase 07.10.1)

### 1. Dashboard Aggregation APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/dashboard/portfolio` | GET | Aggregated portfolio summary | PortfolioWidget |
| `/api/v1/dashboard/kpis` | GET | KPI calculations | KPIWidget |
| `/api/v1/dashboard/summary` | GET | Aggregated dashboard summary | DashboardPage overview |

### 2. Dashboard Data APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/dashboard/recent` | GET | Recent executions for dashboard | ExecutionSummaryWidget |
| `/api/v1/dashboard/risk-summary` | GET | Risk summary for dashboard | RiskSummaryWidget |
| `/api/v1/dashboard/compliance-summary` | GET | Compliance summary for dashboard | ComplianceSummaryWidget |
| `/api/v1/dashboard/governance-summary` | GET | Governance summary for dashboard | GovernanceSummaryWidget |

## Files Created
- `app/api/routes/dashboard_routes.py` (Dashboard APIs)
- `app/api/models/dashboard_models.py`
- `app/services/dashboard_service.py`
- `app/repositories/dashboard_repository.py`

## Files Modified
- `app/api/main.py` (add new route registration)
- `app/services/execution_service.py` (extend for dashboard queries)

## Reuse
- `ExecutionEngine` — batch registry queries for portfolio
- `RuleExecutor` — rule execution metrics from `migration_control_execution`
- `ScoringEngine` — risk scoring for dashboard
- Response models and error handling patterns
- Existing database tables: `migration_batch_registry`, `migration_control_execution`, `migration_governance_status`

## Implement
- Loading state
- Error state
- Empty state
- Permission gating
- API integration for new endpoints
- Error handling and fallback
- Request/response validation with Pydantic models

## Testing
- Appropriate test coverage for services, repositories, routes, and RBAC
- Unit tests for service and repository layers
- Integration tests for API endpoints
- Auth/Permissions tests for RBAC enforcement
- Error scenario tests for failure modes

## Create report
MAP_CLI_MVP_Phase_07_10_1_Backend_Dashboard_Aggregation_Support_Implementation_Report.md

Include:
1. Capability Implemented
2. Files Created
3. Files Modified
4. APIs Created
5. Metadata Consumed
6. Doc 04 Compliance
7. Permission Gating
8. States Implemented
9. Tests Completed (new tests only)
10. Outstanding Issues
11. Traceability to Phase 6
12. Gate

## Rules
- Do NOT invent APIs. First verify existing services/repositories before adding endpoints.
- Do NOT include Discovery or Validation APIs — those belong in 07.5.1.
- Do NOT include History or Export APIs — those belong in 07.6.1.
- Do NOT include Execution Control APIs — those belong in 07.7.1.
- Do NOT include Monitoring APIs — those belong in 07.8.1.
- Do NOT include Audit or Governance APIs — those belong in 07.9.1.
- Reuse existing backend foundation.
- Do NOT recreate infrastructure.
- No mock data.
- Backend remains implementation-only.
- No business logic in backend.
- Extend existing services where possible.

## Stop after completion.
Wait for approval before implementing the next capability.

Save report to:
engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/

## Phase 6 Traceability
- §4.1 #1.2 Enterprise Dashboard
- §8 Build Order — Enterprise Dashboard
- §6 Page Reference Matrix — DashboardPage
- §7 Readiness Matrix — Enterprise Dashboard

## Gate
➡ **Awaiting architectural review and approval before Phase 7 continues with the next approved capability.**

**Phase 07.10.1 Summary:** Backend APIs complete. Phase 07.10 frontend can now access aggregated portfolio summary, KPI calculations, and dashboard summary data.
