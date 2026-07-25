# MAP CLI MVP Phase 07.9.1 — Backend Support for Phase 07.9

## Objective
Implement backend APIs to fully support Phase 07.9 frontend (GovernancePage.tsx — Audit & Governance UI). This is a **required dependency** — without these APIs, Phase 07.9 remains limited.

## Current Situation
Phase 07.9 frontend launched successfully but remains **functionally incomplete** due to backend API gaps:

| Missing Capability | Frontend Impact |
|-------------------|-----------------|
| ❌ Approval history | GovernancePage cannot track approval decisions |
| ❌ Exception management | No visibility into governance exceptions |
| ❌ Audit search | No ability to search audit trail |
| ❌ Exception details | Cannot view individual exception details |
| ❌ Approval details | Cannot view individual approval details |

## Why Needed — Business Requirements
1. **Accountability:** Need to track all governance decisions and approvals
2. **Exception Handling:** Must manage and resolve governance exceptions
3. **Audit:** Must provide searchable audit trail for compliance
4. **Visibility:** Need approval history for governance reporting
5. **Compliance:** Must provide exception records for regulatory audits

## Implemented (Phase 07.9 Frontend)
- ✅ GET `/api/v1/execution/{batch_id}/governance` (exists — from 07.5.1)
- ✅ GET `/api/v1/execution/{batch_id}/compliance` (exists — from 07.5.1)
- ✅ GET `/api/v1/execution/{batch_id}/risk-score` (exists — from 07.5.1)
- ✅ GET `/api/v1/execution/{batch_id}/audit` (exists — from 07.6.1)
- ✅ GET `/api/v1/execution/{batch_id}/report` (exists — from 07.5.1)
- ✅ GET `/api/v1/execution/history` (exists — from 07.6.1)

## Missing Backend APIs (Phase 07.9.1)

### 1. Approval APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/governance/approvals` | GET | List approval history | ApprovalsTab |
| `/api/v1/governance/approvals/{id}` | GET | Approval detail | ApprovalsTab detail |
| `/api/v1/governance/approvals/{id}/approve` | POST | Approve decision | ApprovalsTab action |
| `/api/v1/governance/approvals/{id}/reject` | POST | Reject decision | ApprovalsTab action |

### 2. Exception APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/governance/exceptions` | GET | List all exceptions | ExceptionsTab |
| `/api/v1/governance/exceptions/{id}` | GET | Exception detail | ExceptionsTab detail |
| `/api/v1/governance/exceptions/{id}/resolve` | POST | Resolve exception | ExceptionsTab action |

### 3. Audit Search APIs
| Endpoint | Method | Purpose | Required for Frontend |
|----------|--------|---------|-----------------------|
| `/api/v1/governance/audit/search` | GET | Search audit trail with filters | AuditTab search |
| `/api/v1/governance/audit/actors` | GET | List audit actors | AuditTab actor filter |
| `/api/v1/governance/audit/actions` | GET | List audit actions | AuditTab action filter |

## Files Created
- `app/api/routes/governance_routes.py` (Governance APIs)
- `app/api/models/governance_models.py`
- `app/services/governance_service.py`
- `app/repositories/governance_repository.py`

## Files Modified
- `app/api/main.py` (add new route registration)
- `app/services/execution_service.py` (extend for governance queries)

## Reuse
- `ExecutionEngine` — batch registry queries for governance
- `RuleExecutor` — rule execution from `migration_control_execution`
- Response models and error handling patterns
- Existing database tables: `migration_governance_status`, `migration_control_exceptions`

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
MAP_CLI_MVP_Phase_07_9_1_Backend_Audit_Governance_Support_Implementation_Report.md

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
- §4.1 #1.2 Audit & Governance
- §8 Build Order — Audit & Governance
- §6 Page Reference Matrix — GovernancePage
- §7 Readiness Matrix — Audit & Governance

## Gate
➡ **Awaiting architectural review and approval before Phase 7 continues with the next approved capability.**

**Phase 07.9.1 Summary:** Backend APIs complete. Phase 07.9 frontend can now access approval history, exception management, and searchable audit trail.
