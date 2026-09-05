# MAP CLI MVP Phase 07.7.1 — Backend Support for Phase 07.7

## Objective
Implement backend APIs to fully support Phase 07.7 frontend (MigrationPage.tsx — Migration Execution UI). This is a **required dependency** — without these APIs, Phase 07.7 remains limited.

## Current Situation
Phase 07.7 frontend launched successfully but remains **functionally incomplete** due to backend API gaps:

| Missing Capability | Frontend Impact |
|-------------------|-----------------|
| ❌ Start migration execution | MigrationPage cannot trigger migrations |
| ❌ Cancel execution | No ability to abort running migrations |
| ❌ Pause execution | No ability to pause long-running migrations |
| ❌ Resume execution | No ability to resume paused migrations |
| ❌ Retry failed execution | No ability to retry failed migrations |

## Why Needed — Business Requirements
1. **Control:** Operations teams need to start, stop, and manage migration executions
2. **Flexibility:** Need ability to pause/resume for resource management
3. **Recovery:** Need retry capability for failed migrations
4. **Safety:** Need cancel capability to abort problematic migrations
5. **Audit:** Must track execution lifecycle events for compliance

## Implemented (Phase 07.7 Frontend)
- ✅ GET `/api/v1/execution/status/{batch_id}` (exists — used for polling)
- ✅ GET `/api/v1/execution/history` (exists — from 07.6.1)
- ✅ POST `/api/v1/execution/run` (exists — triggers execution)

## Missing Backend APIs (Phase 07.7.1)

### 1. Execution Control APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/start` | POST | Start migration execution with project_id | MigrationPage — start button |
| `/api/v1/execution/{batch_id}/cancel` | POST | Cancel running execution | MigrationPage — cancel button |
| `/api/v1/execution/{batch_id}/pause` | POST | Pause running execution | MigrationPage — pause button |
| `/api/v1/execution/{batch_id}/resume` | POST | Paused execution | MigrationPage — resume button |
| `/api/v1/execution/{batch_id}/retry` | POST | Retry failed execution | MigrationPage — retry button |

### 2. Execution Status APIs (Extended)
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/{batch_id}/lifecycle` | GET | Get execution lifecycle events | MigrationPage — audit trail |
| `/api/v1/execution/{batch_id}/progress` | GET | Get detailed progress info | MigrationPage — progress bar |

## Files Created
- `app/api/routes/execution_control_routes.py` (Execution Control APIs)
- `app/api/models/execution_control_models.py`
- `app/services/execution_control_service.py`
- `app/repositories/execution_control_repository.py`

## Files Modified
- `app/api/main.py` (add new route registration)
- `app/services/execution_service.py` (extend to support control APIs)
- `app/models/execution.py` (extend lifecycle states)

## Reuse
- `ExecutionEngine` — batch registry queries and execution state management
- `RuleExecutor` — rule execution from `migration_control_execution`
- `ExecutionService` — extend for control operations
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
MAP_CLI_MVP_Phase_07_7_1_Backend_Migration_Execution_Support_Implementation_Report.md

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
- §4.1 #1.2 Migration Execution
- §8 Build Order — Migration Execution
- §6 Page Reference Matrix — MigrationPage
- §7 Readiness Matrix — Migration Execution

## Gate
➡ **Awaiting architectural review and approval before Phase 7 continues with the next approved capability.**

**Phase 07.7.1 Summary:** Backend APIs complete. Phase 07.7 frontend can now start, cancel, pause, resume, and retry migration executions with full lifecycle management.
