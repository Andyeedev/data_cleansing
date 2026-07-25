# MAP CLI MVP Phase 07.7 — Migration Execution UI Implementation

## Objective
Implement the Migration Execution UI (MigrationPage.tsx) to allow users to start migration executions, monitor progress in real-time, and view execution results. This replaces the current placeholder with a fully functional execution interface.

## Current Situation
The MigrationPage.tsx is currently a placeholder displaying only a title and description. The `/migration/execution` and `/migration/history` routes both point to this placeholder.

| Current State | Issue |
|---------------|-------|
| MigrationPage.tsx | Placeholder — no functionality |
| `/migration/execution` | Points to placeholder |
| `/migration/history` | Points to placeholder |

## Capability Implemented
**Migration Execution UI** — Users can:
1. Enter a Project ID to execute
2. Start a migration execution
3. View real-time progress with polling
4. See execution status, control counts, and progress bar
5. Navigate to execution history (tab within MigrationPage, NOT a separate page)

## APIs Consumed (Existing)

| Endpoint | Method | Purpose | Source |
|----------|--------|---------|--------|
| `POST /api/v1/execution/run` | POST | Start migration execution | `app/api/routes/execution_routes.py` |
| `GET /api/v1/execution/status/{batch_id}` | GET | Poll execution status | `app/api/routes/execution_routes.py` |
| `GET /api/v1/execution/history` | GET | List past executions | `app/api/routes/execution_history_routes.py` (07.6.1) |

## Files Created

| File | Purpose |
|------|---------|
| `src/routes/MigrationPage.test.tsx` | Unit tests for MigrationPage |
| `src/routes/MigrationPage.integration.test.tsx` | Integration tests |

## Files Modified

| File | Change |
|------|--------|
| `src/routes/MigrationPage.tsx` | Replace placeholder with full execution UI (Execution tab + History tab) |

## Reuse

| Component | Source | Usage |
|-----------|--------|-------|
| `useRunExecution` | `src/hooks/useExecution.ts` | Trigger execution |
| `usePollBatchStatus` | `src/hooks/useExecution.ts` | Poll execution status |
| `LoadingSpinner` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Loading state |
| `ErrorMessage` | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Error state |
| `useAuth` | `src/context/AuthContext.tsx` | Permission gating |
| `APIResponse` | `src/utils/apiClient.ts` | API response type |

## Page Reference Matrix

| Page | Route | Parent | Component | Description |
|------|-------|--------|-----------|-------------|
| MigrationPage | `/migration` | — | `MigrationPage.tsx` | Top-level migration page with tabs |
| MigrationPage (Execution tab) | `/migration` | MigrationPage | `MigrationPage.tsx` | Execution form + progress |
| MigrationPage (History tab) | `/migration/history` | MigrationPage | `MigrationPage.tsx` | Execution history list |

## Navigation/RBAC Matrix

| Route | Nav Label | Role Required | Behavior |
|-------|-----------|---------------|----------|
| `/migration` | Migration | admin | Full access (execution + history tabs) |
| `/migration/history` | Migration | admin | History tab view only |

## Tab Structure

| Tab | Route | Content | Default |
|-----|-------|---------|---------|
| Execution | `/migration` | Execution form + progress bar + status | ✅ Yes |
| History | `/migration/history` | Execution history list with filtering | No |

## States Implemented

| State | Implementation |
|-------|----------------|
| **Loading** | `LoadingSpinner` while fetching initial data |
| **Error** | `ErrorMessage` component with error details |
| **Empty** | "No executions yet" message when history is empty |
| **Permission Denied** | "You do not have permission" message for non-admin users |
| **Execution Running** | Progress bar with polling indicator |
| **Execution Complete** | Status badge with completion details |
| **Execution Failed** | Error status with failure details |

## Metadata Consumed

| Metadata | Source | Usage |
|----------|--------|-------|
| Navigation | `/api/v1/navigation` | Shell renders sidebar with migration links |

## Doc 04 Compliance

| Doc 04 Convention | Implementation |
|-------------------|----------------|
| `/api/v1` prefix | `const API_BASE = '/api/v1'` in useExecution.ts |
| Noun-based resources | `/execution` |
| Standard HTTP methods | POST, GET |
| Response format `{ success, data, error }` | Execution API returns raw dict — handled directly |
| Standard HTTP status codes | Throws on `!res.ok` |

## Permission Gating

| Page | Required Role | Behavior |
|------|---------------|----------|
| MigrationPage (Execution) | `admin` | Shows permission error if not admin |
| MigrationPage (History) | `admin` | Shows permission error if not admin |

## Phase 6 Traceability
- §4.1 #1.2 Migration Execution
- §8 Build Order — Migration Execution
- §6 Page Reference Matrix — MigrationPage
- §7 Readiness Matrix — Migration Execution

## Backend Dependencies

| Dependency | Phase | Purpose |
|------------|-------|---------|
| 07.5.1 | Discovery & Validation APIs | Provides discovery and validation endpoints |
| 07.6.1 | Reporting & Results APIs | Provides execution history endpoint |
| 07.7.1 | Migration Execution APIs | **NEW** — Start, cancel, pause, resume, retry (see below) |

### Missing APIs (Requires 07.7.1 Backend)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/execution/start` | POST | Start migration execution |
| `/api/v1/execution/{batch_id}/cancel` | POST | Cancel running execution |
| `/api/v1/execution/{batch_id}/pause` | POST | Pause execution |
| `/api/v1/execution/{batch_id}/resume` | POST | Resume execution |
| `/api/v1/execution/{batch_id}/retry` | POST | Retry failed execution |

## Tests Required

| Test Type | Count | Status |
|-----------|-------|--------|
| Unit tests (MigrationPage) | — | Required |
| Unit tests (useExecution hook) | — | Required |
| Integration tests | — | Required |
| RBAC tests | — | Required |
| **Total** | — | **Required** |

## Outstanding Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | No project selector | Low | Currently requires manual Project ID entry |
| 2 | No batch list view | Medium | History view not implemented |
| 3 | No execution control APIs | High | Requires 07.7.1 backend implementation |

## Gate
➡ **Awaiting architectural review and approval before implementation.**

**Phase 07.7 Summary:** Migration Execution UI implementation plan. Replaces placeholder MigrationPage.tsx with full execution interface using existing `/execution/run` and `/execution/status/{batch_id}` APIs. Consumes execution history from 07.6.1. Tab-based layout: Execution tab (default) + History tab. Requires 07.7.1 for execution control APIs (start, cancel, pause, resume, retry).

---

## Rules
- Do NOT invent APIs. Use only existing endpoints.
- Reuse existing hooks and components.
- Do NOT recreate infrastructure.
- No mock data.
- Frontend follows Doc 21 architecture.
- Extend existing patterns from ValidationPage.tsx.

## Stop after completion.
Wait for approval before implementing the next capability.

## Create report
MAP_CLI_MVP_Phase_07_7_Migration_Execution_UI_Implementation_Report.md

## Save report to
engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
