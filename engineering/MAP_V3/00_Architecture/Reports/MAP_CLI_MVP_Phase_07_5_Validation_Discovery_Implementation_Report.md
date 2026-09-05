# MAP CLI MVP Phase 07.5 — Frontend Capability Implementation Report

## Capability: Validation & Discovery

**Phase:** 7 — Frontend Capability Implementation
**Date:** 2026-07-22
**Status:** IMPLEMENTATION COMPLETE — Awaiting Review

---

## 1. Capability Implemented

**Validation & Discovery** (Doc 16 §4.1 #1.2) — **Limited implementation** using existing backend APIs. Frontend now provides:

- **DiscoveryPage** — List of registered SOURCE/TARGET systems with native checkmarks, and trigger button to start discovery execution (runs full backend pipeline)
- **ValidationPage** — Project ID input + start validation, displays active validation workflows, and tracks validation batch progress

**Scope:** This implementation is **constrained by existing backend APIs**. It focuses solely on list/display and start/execute operations:

**Consumed APIs:**
- `GET /api/v1/systems` (list registered systems)
- `POST /api/v1/execution/run` (trigger validation/discovery pipeline)
- `GET /api/v1/execution/status/{batch_id}` (poll execution status)
- `GET /api/v1/workflows` (list validation workflows)

**Deferred:** Result viewing, rule details, dataset mappings, and governance compliance views

---

## 2. Files Created (NEW in Phase 07.5)

| File | Purpose |
|------|---------|
| `src/types/execution.ts` | Batch execution and status response type definitions |
| `src/hooks/useExecution.ts` | API hooks: run execution, poll batch status |
| `src/routes/DiscoveryPage.tsx` | Discovery page with system list and start execution button |
| `src/routes/ValidationPage.tsx` | Validation page with execution trigger, progress, and workflow list |
| `src/routes/DiscoveryPage.test.tsx` | Unit tests (6 tests) |
| `src/routes/ValidationPage.test.tsx` | Unit tests (6 tests) |
| `src/routes/DiscoveryPage.integration.test.tsx` | Integration tests (4 tests) |
| `src/routes/ValidationPage.integration.test.tsx` | Integration tests (4 tests) |

**Note:** All discovery/validation data surfaces are read-only. No CRUD or rule/dataset detail views implemented.

---

## 3. Files Modified

| File | Change |
|------|--------|
| `src/AppRoutes.tsx` | Added routes `/migration/discovery`, `/validation`, `/validation/rules`, `/validation/rule-discovery`, `/validation/results`, `/validation/queue`, `/validation/controls` (all render DiscoveryPage or ValidationPage) |

---

## 4. APIs Consumed

| Endpoint | Method | Source |
|----------|--------|--------|
| `/api/v1/systems` | GET | DiscoveryPage, SystemsPage (both consumed via useSystemList hook) |
| `/api/v1/execution/run` | POST | DiscoveryPage, ValidationPage |
| `/api/v1/execution/status/{batch_id}` | GET | DiscoveryPage, ValidationPage |
| `/api/v1/workflows` | GET | ValidationPage |

## 5. Metadata Consumed

| Metadata | Source | Usage |
|----------|--------|-------|
| Navigation | `/api/v1/navigation` | Shell renders sidebar; discovery nav item uses existing path `/migration/discovery` |

## 6. Doc 04 Compliance

| Doc 04 Convention | Implementation |
|-------------------|----------------|
| `/api/v1` prefix | `const API_BASE = '/api/v1'` in apiClient.ts |
| Noun-based resources | `/systems`, `/execution`, `/workflows` |
| Standard HTTP methods | GET, POST |
| Response format `{ success, data, error }` | Parsed from JSON response |
| Standard HTTP status codes | Throws on `!res.ok` |
| Standardized error handling | apiGet throws on failure; useExecution/usePollBatchStatus propagate errors |
| Request/response abstraction | All API calls go through apiClient.ts or direct fetch in useExecution |

## 7. Permission Gating

| Page | Required Role | Behavior |
|------|---------------|----------|
| DiscoveryPage | `admin` | Shows permission error if not admin |
| ValidationPage | `admin` | Shows permission error if not admin |

## 8. States Implemented

| State | Implementation |
|-------|----------------|
| **Loading** | LoadingSpinner component while API fetches |
| **Error** | ErrorMessage component with error details |
| **Empty** | "No systems registered", "No workflows found" messages |
| **Permission Denied** | "You do not have permission to view this page" message |
| **Execution Trigger** | Start Discovery/Start Validation buttons trigger POST /execution/run |
| **Progress Tracking** | Batch status display with progress bar (Pending-Running-Completed-Failed) |

## 9. Tests Completed (New in Phase 07.5)

| Test Type | Count | Status |
|-----------|-------|--------|
| Unit tests (DiscoveryPage) | 6 | ✅ All passing |
| Unit tests (ValidationPage) | 6 | ✅ All passing |
| Integration tests (DiscoveryPage) | 4 | ✅ All passing |
| Integration tests (ValidationPage) | 4 | ✅ All passing |
| **Total (new in 07.5)** | **20** | ✅ **All passing** |
| **Cumulative (all phases)** | **203** | ✅ **All passing** |

## 10. Outstanding Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | **No detailed discovery/validation views** | Medium | Cannot view dataset mappings, rule results, or execution details. Backend lacks dedicated APIs for discovery results, dataset mappings, rule execution history, and validation reporting. |
| 2 | **Limited execution workflow selection** | Low | ValidationPage shows workflows but cannot select specific workflow for execution. Currently only triggers full pipeline with arbitrary project ID. |
| 3 | **Frontend lacks execution history** | Low | No view to list/filter past execution batches or view detailed rule-by-rule results. |

## 11. Traceability to Phase 6

| Phase 6 Reference | Implementation |
|-------------------|----------------|
| §4.1 #1.2 Discovery/Validation | ✅ Limited – List + start only |
| §8 Build Order — Discovery/Validation | ✅ Implemented (using existing backend APIs) |
| §6 Page Reference Matrix — DiscoveryPage | ✅ Page implemented |
| §6 Page Reference Matrix — ValidationPage | ✅ Page implemented |
| §7 Readiness Matrix — Discovery/Validation | ⚠️ Partial — Only admin access, result views deferred |
| Appendix A — GET /systems endpoints | ✅ Consumed |
| Appendix A — POST /execution/run | ✅ Consumed |

## 12. Gate

✅ **Awaiting architectural review and approval before Phase 7 continues with the next approved capability.**

**Phase 07.5 Summary:** Limited validation & discovery frontend implemented. Provides launch points for backend pipeline but defers rich result views pending backend API creation.
