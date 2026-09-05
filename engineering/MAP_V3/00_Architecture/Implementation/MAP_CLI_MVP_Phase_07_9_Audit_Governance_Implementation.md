# MAP CLI MVP Phase 07.9 — Audit & Governance UI Implementation

## Objective
Implement the Audit & Governance UI (GovernancePage.tsx) to provide audit trail visibility, governance decision tracking, compliance monitoring, risk scoring, and exception management. This replaces the current placeholder with a functional governance dashboard.

## Current Situation
The GovernancePage.tsx is currently a placeholder displaying only a title and description. The `/governance/*` routes all point to this placeholder.

| Current State | Issue |
|---------------|-------|
| GovernancePage.tsx | Placeholder — no functionality |
| `/governance/overview` | Points to placeholder |
| `/governance/compliance` | Points to placeholder |
| `/governance/controls` | Points to placeholder |
| `/governance/exceptions` | Points to placeholder |
| `/governance/risk` | Points to placeholder |
| `/governance/audit` | Points to placeholder |
| `/governance/approvals` | Points to placeholder |

## Capability Implemented
**Audit & Governance UI** — Users can:
1. View governance decisions for migration batches
2. See compliance check results and exceptions
3. View risk scores with breakdown
4. Access full audit trail for executions
5. Manage exceptions and view details
6. Track approval history

## APIs Consumed (Existing)

| Endpoint | Method | Purpose | Source |
|----------|--------|---------|--------|
| `GET /api/v1/execution/{batch_id}/governance` | GET | Governance decisions | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /api/v1/execution/{batch_id}/compliance` | GET | Compliance checks | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /api/v1/execution/{batch_id}/risk-score` | GET | Risk scoring | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /api/v1/execution/{batch_id}/audit` | GET | Full audit trail | `app/api/routes/execution_history_routes.py` (07.6.1) |
| `GET /api/v1/execution/{batch_id}/report` | GET | Validation report | `app/api/routes/validation_report_routes.py` (07.5.1) |
| `GET /api/v1/execution/history` | GET | Execution history | `app/api/routes/execution_history_routes.py` (07.6.1) |

## Files Created

| File | Purpose |
|------|---------|
| `src/routes/GovernancePage.test.tsx` | Unit tests for GovernancePage |
| `src/routes/GovernancePage.integration.test.tsx` | Integration tests |
| `src/hooks/useGovernance.ts` | Hook for governance data |

## Files Modified

| File | Change |
|------|--------|
| `src/routes/GovernancePage.tsx` | Replace placeholder with governance dashboard |

## Reuse

| Component | Source | Usage |
|-----------|--------|-------|
| `LoadingSpinner` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Loading state |
| `ErrorMessage` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Error state |
| `useAuth` | `src/context/AuthContext.tsx` | Permission gating |

## Page Reference Matrix

| Page | Route | Parent | Component | Description |
|------|-------|--------|-----------|-------------|
| GovernancePage | `/governance` | — | `GovernancePage.tsx` | Top-level governance page with tabs |
| GovernancePage (Overview) | `/governance/overview` | GovernancePage | `GovernancePage.tsx` | Overview dashboard |
| GovernancePage (Compliance) | `/governance/compliance` | GovernancePage | `GovernancePage.tsx` | Compliance checks |
| GovernancePage (Controls) | `/governance/controls` | GovernancePage | `GovernancePage.tsx` | Control framework |
| GovernancePage (Exceptions) | `/governance/exceptions` | GovernancePage | `GovernancePage.tsx` | Exception list |
| GovernancePage (Risk) | `/governance/risk` | GovernancePage | `GovernancePage.tsx` | Risk scoring |
| GovernancePage (Audit) | `/governance/audit` | GovernancePage | `GovernancePage.tsx` | Audit trail |
| GovernancePage (Approvals) | `/governance/approvals` | GovernancePage | `GovernancePage.tsx` | Approval history |

## Navigation/RBAC Matrix

| Route | Nav Label | Role Required | Behavior |
|-------|-----------|---------------|----------|
| `/governance` | Governance | admin | Full access to all tabs |
| `/governance/overview` | Governance | admin | Overview tab (default) |
| `/governance/compliance` | Governance | admin | Compliance tab |
| `/governance/controls` | Governance | admin | Controls tab |
| `/governance/exceptions` | Governance | admin | Exceptions tab |
| `/governance/risk` | Governance | admin | Risk tab |
| `/governance/audit` | Governance | admin | Audit tab |
| `/governance/approvals` | Governance | admin | Approvals tab |

## Tab Structure

| Tab | Route | Content | Default |
|-----|-------|---------|---------|
| Overview | `/governance/overview` | Summary dashboard with KPIs | ✅ Yes |
| Compliance | `/governance/compliance` | Compliance checks + exceptions | No |
| Controls | `/governance/controls` | Control framework status | No |
| Exceptions | `/governance/exceptions` | Exception list with filtering | No |
| Risk | `/governance/risk` | Risk scoring + breakdown | No |
| Audit | `/governance/audit` | Full audit trail with search | No |
| Approvals | `/governance/approvals` | Approval history | No |

## Search/Filter Requirements

| Tab | Filter | Description |
|-----|--------|-------------|
| Audit | Search bar | Search by actor, action, timestamp |
| Audit | Date range filter | Filter by date range |
| Audit | Action type filter | Filter by action type |
| Exceptions | Severity filter | Filter by HIGH, MEDIUM, LOW |
| Exceptions | Batch filter | Filter by batch_id |
| Compliance | Status filter | Filter by PASS, FAIL, WARN |
| Governance | Batch filter | Filter by batch_id |
| Governance | Decision filter | Filter by decision type |

## States Implemented

| State | Implementation |
|-------|----------------|
| **Loading** | `LoadingSpinner` while fetching governance data |
| **Error** | `ErrorMessage` component with error details |
| **Empty** | "No governance data available" message |
| **Permission Denied** | "You do not have permission" message for non-admin users |
| **No Batch Selected** | "Select a batch to view governance data" message |

## Metadata Consumed

| Metadata | Source | Usage |
|----------|--------|-------|
| Navigation | `/api/v1/navigation` | Shell renders sidebar with governance links |

## Doc 04 Compliance

| Doc 04 Convention | Implementation |
|-------------------|----------------|
| `/api/v1` prefix | All API calls use `/api/v1` prefix |
| Noun-based resources | `/execution` |
| Standard HTTP methods | GET |
| Response format `{ success, data, error }` | Standard API response handling |
| Standard HTTP status codes | Throws on `!res.ok` |

## Permission Gating

| Page | Required Role | Behavior |
|------|---------------|----------|
| GovernancePage | `admin` | Shows permission error if not admin |

## Phase 6 Traceability
- §4.1 #1.2 Audit & Governance
- §8 Build Order — Audit & Governance
- §6 Page Reference Matrix — GovernancePage
- §7 Readiness Matrix — Audit & Governance

## Backend Dependencies

| Dependency | Phase | Purpose |
|------------|-------|---------|
| 07.5.1 | Discovery & Validation APIs | Provides governance, compliance, risk, report endpoints |
| 07.6.1 | Reporting & Results APIs | Provides audit trail endpoint |
| 07.9.1 | Audit & Governance APIs | **NEW** — Approval history, exception management (see below) |

### Missing APIs (Requires 07.9.1 Backend)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/governance/approvals` | GET | List approval history |
| `/api/v1/governance/approvals/{id}` | GET | Approval detail |
| `/api/v1/governance/exceptions` | GET | List all exceptions |
| `/api/v1/governance/exceptions/{id}` | GET | Exception detail |
| `/api/v1/governance/audit/search` | GET | Search audit trail |

## Tests Required

| Test Type | Count | Status |
|-----------|-------|--------|
| Unit tests (GovernancePage) | — | Required |
| Unit tests (useGovernance hook) | — | Required |
| Integration tests | — | Required |
| RBAC tests | — | Required |
| **Total** | — | **Required** |

## Outstanding Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | No approval history API | High | Requires 07.9.1 backend implementation |
| 2 | No exception management API | Medium | Requires 07.9.1 backend implementation |
| 3 | No audit search API | Medium | Requires 07.9.1 backend implementation |

## Gate
➡ **Awaiting architectural review and approval before implementation.**

**Phase 07.9 Summary:** Audit & Governance UI implementation plan. Replaces placeholder GovernancePage.tsx with governance dashboard. Uses existing governance, compliance, risk, and audit endpoints from 07.5.1/07.6.1. Tab-based layout: Overview (default), Compliance, Controls, Exceptions, Risk, Audit, Approvals. Requires 07.9.1 for approval history and exception management APIs.

---

## Rules
- Do NOT invent APIs. Use only existing endpoints.
- Document missing APIs for 07.9.1 backend implementation.
- Reuse existing hooks and components.
- Do NOT recreate infrastructure.
- No mock data.
- Frontend follows Doc 21 architecture.

## Stop after completion.
Wait for approval before implementing the next capability.

## Create report
MAP_CLI_MVP_Phase_07_9_Audit_Governance_UI_Implementation_Report.md

## Save report to
engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
