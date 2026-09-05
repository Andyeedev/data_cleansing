# MAP CLI MVP Phase 07.8.1 — Backend Support for Phase 07.8

## Objective
Implement backend APIs to fully support Phase 07.8 frontend (OperationsPage.tsx — Monitoring & Operations UI). This is a **required dependency** — without these APIs, Phase 07.8 remains limited.

## Current Situation
Phase 07.8 frontend launched successfully but remains **functionally incomplete** due to backend API gaps:

| Missing Capability | Frontend Impact |
|-------------------|-----------------|
| ❌ Detailed system health | OperationsPage shows basic health only |
| ❌ Performance metrics | No access to response times, throughput data |
| ❌ Job queue status | No visibility into execution queue |
| ❌ Active alerts | No alert visibility or notification |
| ❌ Operational logs | No access to runtime diagnostics |

## Why Needed — Business Requirements
1. **Visibility:** Operations teams need real-time system health monitoring
2. **Performance:** Need metrics for capacity planning and optimization
3. **Proactive:** Need alerts for early problem detection
4. **Debugging:** Need operational logs for troubleshooting
5. **Audit:** Must provide monitoring records for compliance

## Implemented (Phase 07.8 Frontend)
- ✅ GET `/health` (exists — basic health check)
- ✅ GET `/api/v1/ready` (exists — readiness check)
- ✅ GET `/api/v1/execution/history` (exists — from 07.6.1)
- ✅ GET `/api/v1/execution/status/{batch_id}` (exists — execution status)

## Missing Backend APIs (Phase 07.8.1)

### 1. Monitoring APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/monitoring/health` | GET | Detailed system health | HealthWidget |
| `/api/v1/monitoring/metrics` | GET | Performance metrics | MetricsWidget |
| `/api/v1/monitoring/queue` | GET | Job queue status | QueueWidget |
| `/api/v1/monitoring/alerts` | GET | Active alerts | AlertsWidget |
| `/api/v1/monitoring/logs` | GET | Operational logs | LogsWidget |

## Files Created
- `app/api/routes/monitoring_routes.py` (Monitoring APIs)
- `app/api/models/monitoring_models.py`
- `app/services/monitoring_service.py`
- `app/repositories/monitoring_repository.py`

## Files Modified
- `app/api/main.py` (add new route registration)
- `app/services/execution_service.py` (extend for queue status)

## Reuse
- `ExecutionEngine` — batch registry queries for queue status
- `RuleExecutor` — rule execution metrics from `migration_control_execution`
- Response models and error handling patterns
- Existing database tables: `migration_batch_registry`, `migration_control_execution`

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
MAP_CLI_MVP_Phase_07_8_1_Backend_Monitoring_Support_Implementation_Report.md

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
- §4.1 #1.2 Monitoring & Operations
- §8 Build Order — Monitoring & Operations
- §6 Page Reference Matrix — OperationsPage
- §7 Readiness Matrix — Monitoring & Operations

## Gate
➡ **Awaiting architectural review and approval before Phase 7 continues with the next approved capability.**

**Phase 07.8.1 Summary:** Backend APIs complete. Phase 07.8 frontend can now access detailed system health, performance metrics, job queue status, active alerts, and operational logs.
