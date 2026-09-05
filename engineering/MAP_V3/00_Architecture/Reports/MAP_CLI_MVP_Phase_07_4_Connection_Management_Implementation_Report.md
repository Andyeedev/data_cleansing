# MAP CLI MVP Phase 07.4 — Frontend Capability Implementation Report

## Capability: Connection Management

**Phase:** 7 — Frontend Capability Implementation
**Date:** 2026-07-22
**Status:** APPROVED

---

## 1. Capability Implemented

**Connection Management** (Doc 16 §4.1 #1.2) — Systems list with role/database type filters, system detail view with connection config, and inline test connection with expandable result display.

**Scope Note:** Create System form is **deferred** — `SystemCreateRequest` requires `project_id` but no Projects API exists (`project_routes.py`, `project_service.py`, `project_repository.py` all missing from backend). This capability covers list, detail, and test connection only.

---

## 2. Files Created (NEW in Phase 07.4)

| File | Purpose |
|------|---------|
| `src/types/systems.ts` | System, SystemDetail, ConnectionConfig, TestConnectionResponse type definitions |
| `src/hooks/useSystems.ts` | API hooks: useSystemList, useSystemDetail, useTestConnection |
| `src/routes/SystemsPage.tsx` | System list page with role/dbType filters, inline test connection badge + expandable details |
| `src/routes/SystemDetailPage.tsx` | System detail page with connection config display, test connection with expandable result |
| `src/routes/SystemsPage.test.tsx` | Unit tests (6 tests) |
| `src/routes/SystemDetailPage.test.tsx` | Unit tests (6 tests) |
| `src/routes/SystemsPage.integration.test.tsx` | Integration tests (4 tests) |

---

## 3. Files Modified

| File | Change |
|------|--------|
| `src/AppRoutes.tsx` | Added imports for SystemsPage, SystemDetailPage. Updated `/migration/connections` route to SystemsPage, added `/migration/connections/:id` route for SystemDetailPage. |

---

## 4. APIs Consumed

| Endpoint | Method | Source Route |
|----------|--------|-------------|
| `/api/v1/systems` | GET | SystemsPage |
| `/api/v1/systems/{id}` | GET | SystemDetailPage |
| `/api/v1/systems/{id}/test` | GET | SystemsPage, SystemDetailPage |

**Note:** `POST /api/v1/systems` is commented out in `app/api/routes/system_routes.py`. Create System form deferred pending Projects API implementation.

---

## 5. Metadata Consumed

| Metadata | Source | Usage |
|----------|--------|-------|
| Navigation | `/api/v1/navigation` | Shell renders sidebar from API |
| Permissions | Doc 21 §7 | Admin role gating on SystemsPage and SystemDetailPage |
| Runtime routing | Doc 21 §6 | Route definitions aligned with Doc 21 architecture. Current implementation continues using the existing Navigation API until runtime metadata navigation is fully implemented. |

---

## 6. Doc 04 Compliance

| Doc 04 Convention | Implementation |
|-------------------|----------------|
| `/api/v1` prefix | `const API_BASE = '/api/v1'` in apiClient.ts |
| Noun-based resources | `/systems` |
| Standard HTTP methods | GET (list, detail, test) |
| Response format `{ success, data, error }` | Parsed from JSON response in apiClient.ts |
| Standard HTTP status codes | Throws on `!res.ok` with status text |
| Standardized error handling | apiGet throws on failure; hooks propagate errors |
| Request/response abstraction | All API calls go through apiClient.ts utilities |

---

## 7. Permission Gating

| Page | Required Role | Behavior |
|------|---------------|----------|
| SystemsPage | `admin` | Shows permission error if not admin |
| SystemDetailPage | `admin` | Shows permission error if not admin |

**Permission architecture:**
- Follows Doc 21 §7 runtime permissions model
- Currently uses development AuthContext (temporary) — `useAuth()` provides `userRoles`
- Both pages: `userRoles.includes('admin')` gates page access
- This is a temporary frontend enforcement layer and is not the final security boundary.
- Designed for future JWT/OIDC integration; current implementation remains on temporary development AuthContext.

---

## 8. States Implemented

| State | Implementation |
|-------|----------------|
| **Loading** | LoadingSpinner component while API fetches |
| **Error** | ErrorMessage component with error details |
| **Empty** | "No systems found" message with filter-aware subtext |
| **Permission Denied** | "You do not have permission to view this page" message |
| **Filter Active** | Client-side role/database type filters on SystemsPage |
| **Test Connection** | Inline badge (Connected/Failed) with expandable detail row |
| **Test Connection Detail** | Expandable section on SystemDetailPage with status indicator and message |

---

## 9. Backend Fields Exposed But Not Editable

| Field | Entity | Reason |
|-------|--------|--------|
| `system_id` | System, SystemDetail | Read-only identifier |
| `system_name` | System, SystemDetail | Display only |
| `system_role` | System, SystemDetail | Display only — SOURCE/TARGET badge |
| `database_type` | System, SystemDetail | Display only — icon + label |
| `credential_id` | System, SystemDetail | Display only |
| `connection_config` | SystemDetail | Display only — host, port, database fields |

**No editable fields** in this phase — Create System form deferred.

---

## 10. Tests Completed (New in Phase 07.4)

| Test Type | Count | Status |
|-----------|-------|--------|
| Unit tests (SystemsPage) | 6 | ✅ All passing |
| Unit tests (SystemDetailPage) | 6 | ✅ All passing |
| Integration tests (SystemsPage) | 4 | ✅ All passing |
| **Total (new in 07.4)** | **16** | ✅ **All passing** |
| **Cumulative (all phases)** | **163** | ✅ **All passing** |

### Test Coverage — SystemsPage Unit Tests (6)

- Permission error for non-admin users
- Loading state renders correctly
- System list renders after loading
- Empty state when no systems
- Error state on API failure
- Role badge displays correctly

### Test Coverage — SystemDetailPage Unit Tests (6)

- Permission error for non-admin users
- Loading state renders spinner
- System details render after loading (name, role, db type, connection config)
- Error state on API failure
- Connection config section displays
- Test connection button displays

### Test Coverage — SystemsPage Integration Tests (4)

- Fetches systems on mount
- Role filter updates displayed systems
- Database type filter updates displayed systems
- Test connection button triggers API call and shows result

---

## 11. Outstanding Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | `act()` warnings in tests for async state updates | Low | Test infrastructure issue — React 19 strict mode. Does not affect functionality. |
| 2 | AuthContext is development-only | Medium | Phase 7 prompt confirms: keep development AuthContext for now, replace during authentication integration phase. |
| 3 | Create System form blocked on missing Projects API | Medium | `SystemCreateRequest` requires `project_id` but `project_routes.py`, `project_service.py`, `project_repository.py` do not exist. Deferred until Projects API is implemented. |
| 4 | `POST /api/v1/systems` route commented out in backend | Medium | `system_routes.py` has POST route commented out. Will need uncommenting when Create System form is implemented. |
| 5 | Client-side filtering only | Low | Role and database type filters are applied client-side. For large datasets, server-side filtering would be more efficient. Acceptable for MVP. |

---

## 12. Traceability to Phase 6

| Phase 6 Reference | Implementation |
|-------------------|----------------|
| §4.1 #1.2 Connection Management | ✅ List, detail, test connection implemented |
| §8 Build Order — Connection Management | ✅ Implemented |
| §6 Page Reference Matrix — SystemsPage | ✅ Page implemented |
| §6 Page Reference Matrix — SystemDetailPage | ✅ Page implemented |
| §7 Readiness Matrix — Connection Management ✅ Candidate ready | ✅ All layers satisfied |
| Appendix A — GET /systems endpoints | ✅ Consumed |
| Appendix A — POST /systems | ⏳ Deferred (Projects API dependency) |
| Appendix A — GET /systems/{id}/test | ✅ Consumed |

---

## 13. Gate

✅ **Approved.** Phase 7.4 is complete. Connection Management has been implemented with list, detail, and test connection functionality (16 new tests passing). Create System form is deferred pending Projects API implementation.
