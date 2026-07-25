# MAP CLI MVP Phase 07.6.1 — Backend Support for Phase 07.6

## Objective
Implement backend APIs to fully support Phase 07.6 frontend (ValidationResultsPage, ExecutionHistoryPage, ReportsPage). This is a **required dependency** — without these APIs, Phase 07.6 remains limited.

## Current Situation
Phase 07.6 frontend launched successfully but remains **functionally incomplete** due to backend API gaps:

| Missing Capability | Frontend Impact |
|-------------------|-----------------|
| ❌ Execution history listing | ExecutionHistoryPage shows empty state |
| ❌ Rule execution results | ValidationResultsPage shows only status — no per-rule details |
| ❌ Validation reports | ReportsPage shows disabled buttons for all 5 report types |
| ❌ Governance decisions | No access to blocking controls, release gate status |
| ❌ Risk scoring | No access to risk-weighted validation scores |
| ❌ Compliance checks | No access to compliance audit results |
| ❌ Export functionality | Cannot export reports as CSV/PDF |

## Why Needed — Business Requirements
1. **Visibility:** Operations teams need to see rule execution details and report outputs
2. **Accountability:** Need to track rule execution history and governance decisions
3. **Reporting:** Require validation reports with scores, risks, and compliance status
4. **Export:** Need CSV/PDF export for audit and compliance teams
5. **Audit:** Must provide immutable execution records for compliance

## Implemented (Phase 07.6 Frontend)
- ✅ GET `/api/v1/execution/status/{batch_id}` (exists — used by ValidationResultsPage)
- ✅ POST `/api/v1/execution/run` (exists — used by ValidationPage)
- ✅ GET `/api/v1/workflows` (exists — used by ValidationPage)

## Missing Backend APIs (Phase 07.6.1)

### 1. Execution History APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/history` | GET | List past executions with pagination | ExecutionHistoryPage |
| `/api/v1/execution/history/{batch_id}` | GET | Full execution details | ExecutionHistoryPage detail |
| `/api/v1/execution/history/{batch_id}/re-execute` | POST | Re-execute past batch | ExecutionHistoryPage actions |

### 2. Rule Execution Results APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/{batch_id}/rules` | GET | List all executed rules with results | ValidationResultsPage |
| `/api/v1/execution/{batch_id}/rules/{rule_id}` | GET | Individual rule detail with execution data | ValidationResultsPage rule details |
| `/api/v1/execution/{batch_id}/results` | GET | Consolidated execution results summary | ValidationResultsPage summary |

### 3. Validation Report APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/{batch_id}/report` | GET | Full validation report with scores | ReportsPage — Validation Report |
| `/api/v1/execution/{batch_id}/governance` | GET | Governance decisions and exceptions | ReportsPage — Governance Decision |
| `/api/v1/execution/{batch_id}/risk-score` | GET | Risk scoring summary | ReportsPage — Risk Score |
| `/api/v1/execution/{batch_id}/compliance` | GET | Compliance check results | ReportsPage — Compliance |
| `/api/v1/execution/{batch_id}/audit` | GET | Full audit trail | ReportsPage — Audit Report |

### 4. Export APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/export/{batch_id}/csv` | GET | Export execution report as CSV | ReportsPage export |
| `/api/v1/execution/export/{batch_id}/pdf` | GET | Export execution report as PDF | ReportsPage export |

## Files Created
- `app/api/routes/execution_history_routes.py` (Execution History APIs)
- `app/api/routes/validation_results_routes.py` (Rule Results APIs)
- `app/api/routes/reporting_routes.py` (Report Generation APIs)
- `app/api/routes/export_routes.py` (Export APIs)
- `app/api/models/validation_results_models.py`
- `app/api/models/reporting_models.py`
- `app/api/models/export_models.py`
- `app/services/execution_history_service.py`
- `app/services/validation_results_service.py`
- `app/services/reporting_service.py`
- `app/services/export_service.py`
- `app/repositories/execution_repository.py`
- `app/repositories/validation_results_repository.py`
- `app/repositories/reporting_repository.py`

## Files Modified
- `app/api/main.py` (add new route registrations)
- `app/services/execution_service.py` (extend to support new APIs)
- `app/scoring_engine.py` (expose risk scoring via API)
- `app/audit_export.py` (expose audit export via API)

## Reuse
- `ExecutionEngine` — batch registry queries for history
- `RuleExecutor` — rule execution results from `migration_control_execution`
- `RuleFactory` + C01-C010 Rules — rule metadata for results
- `ScoringEngine` — risk scoring logic
- `AuditExporter` — export queries and CSV generation
- `ExecutionService` — extend for history and reporting
- Response models and error handling patterns
- Existing database tables: `migration_batch_registry`, `migration_control_execution`, `migration_control_exceptions`, `migration_governance_status`

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
- Frontend extension tests: ValidationResultsPage, ExecutionHistoryPage, ReportsPage

## Create report
MAP_CLI_MVP_Phase_07_6_1_Backend_Reporting_Results_Support_Implementation_Report.md

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
- Do NOT include Discovery or Dataset APIs — those belong in 07.5.1.
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
- §4.1 #1.2 Validation & Reporting
- §8 Build Order — Reporting & Results
- §6 Page Reference Matrix — ValidationResultsPage
- §6 Page Reference Matrix — ExecutionHistoryPage
- §6 Page Reference Matrix — ReportsPage
- §7 Readiness Matrix — Reporting & Results

## Gate
➡ **Awaiting architectural review and approval before Phase 7 continues with the next approved capability.**

**Phase 07.6.1 Summary:** Backend APIs complete. Phase 07.6 frontend can now access execution history, rule results, validation reports, governance decisions, risk scores, compliance checks, and export functionality.
