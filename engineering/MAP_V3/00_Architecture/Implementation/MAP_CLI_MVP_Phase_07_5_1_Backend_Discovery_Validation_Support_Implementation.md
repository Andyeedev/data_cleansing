# MAP CLI MVP Phase 07.5.1 — Backend Support for Phase 07.5

## Objective
Implement backend APIs to fully support Phase 07.5 frontend (DiscoveryPage and ValidationPage). This is a **required dependency** — without these APIs, Phase 07.5 remains limited.

## Current Situation
Phase 07.5 frontend launched successfully but remains **functionally incomplete** due to backend API gaps:

| Missing Capability | Frontend Impact |
|-------------------|-----------------|
| ❌ Dataset discovery results | DiscoveryPage shows system list but cannot display discovered datasets/mappings |
| ❌ Rule execution results | ValidationPage shows progress but cannot view per-rule results, failures, governance decisions |
| ❌ Validation reports | No access to validation scoring, risk assessment, or compliance reports |

## Why Needed — Business Requirements
1. **Visibility:** Operations teams need to see what was discovered and validated
2. **Accountability:** Need to track rule execution history and governance decisions
3. **Debugging:** Need execution logs for troubleshooting
4. **Audit:** Must provide execution records for compliance

## Implemented (Phase 07.5 Frontend)
- ✅ GET `/api/v1/systems` (exists)
- ✅ POST `/api/v1/execution/run` (exists)  
- ✅ GET `/api/v1/execution/status/{batch_id}` (exists)
- ✅ GET `/api/v1/workflows` (exists)

## Missing Backend APIs (Phase 07.5.1)

### 1. Discovery APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/discovery/{batch_id}/datasets` | GET | List discovered datasets/mappings | DiscoveryPage result viewing |
| `/api/v1/discovery/{batch_id}/datasets/{dataset_id}` | GET | Dataset detail view | DiscoveryPage dataset details |
| `/api/v1/discovery/current` | POST | Trigger standalone discovery (separate from execution) | Alternative discovery trigger |
| `/api/v1/discovery/{batch_id}/status` | GET | Discovery step status within execution | Progress detail in DiscoveryPage |

### 2. Rule Execution APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/{batch_id}/rules` | GET | List all executed rules with results | ValidationPage results viewing |
| `/api/v1/execution/{batch_id}/rules/{rule_id}` | GET | Individual rule detail with execution data | ValidationPage rule details |
| `/api/v1/execution/{batch_id}/control/{control_id}/rules` | GET | Rules executed for specific control | ValidationPage control views |
| `/api/v1/execution/{batch_id}/results` | GET | Consolidated execution results summary | ValidationPage report view |

### 3. Validation Reporting APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/execution/{batch_id}/report` | GET | Full validation report with scores | ValidationPage report page |
| `/api/v1/execution/{batch_id}/governance` | GET | Governance decisions and exceptions | ValidationPage governance |
| `/api/v1/execution/{batch_id}/risk-score` | GET | Risk scoring summary | ValidationPage risk dashboard |
| `/api/v1/execution/{batch_id}/compliance` | GET | Compliance check results | ValidationPage compliance |

## Files Created
- `app/api/routes/discovery_routes.py` (Discovery APIs)  
- `app/api/routes/validation_routes.py` (Validation Reporting APIs)
- `app/api/models/discovery_models.py`
- `app/api/models/validation_models.py`
- `app/api/models/execution_enhanced_models.py` (extend existing)
- `app/services/discovery_service.py`
- `app/services/validation_service.py`
- `app/repositories/discovery_repository.py`
- `app/repositories/validation_repository.py`

## Files Modified
- `app/api/main.py` (add new route registrations)
- `app/api/models/responses.py` (extend models if needed)
- `app/services/execution_service.py` (extend to support new APIs)

## Reuse
- ExecutionEngine integration for discovery execution workflows
- RuleFactory + C01-C010 Rules for execution result generation
- BaseRule abstract class for individual rule result API contracts
- Response models and error handling patterns

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
- Frontend extension tests: ValidationPage result views, new ReportPage, HistoryPage

## Create report
MAP_CLI_MVP_Phase_07_5_1_Backend_Discovery_Validation_Support_Implementation_Report.md

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
- §4.1 #1.2 Discovery/Validation
- §8 Build Order — Discovery/Validation  
- §6 Page Reference Matrix — DiscoveryPage
- §6 Page Reference Matrix — ValidationPage
- §7 Readiness Matrix — Discovery/Validation

## Gate
➡ **Awaiting architectural review and approval before Phase 7 continues with the next approved capability.**

**Phase 07.5.1 Summary:** Backend APIs complete. Phase 07.5 frontend can now access discovery results, rule execution results, and validation reports.
