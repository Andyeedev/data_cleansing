# Connection Manager — Assessment Report

**Date:** 2026-08-04
**Scope:** Phase 10.5.1 — Connection Manager Completion
**Target Layout:** Option C — Full Diagnostic Page
**Route:** `/migration/connections/diagnostics`

---

## 1. Page Inventory

| # | File | Lines | Implements | Missing for Option C |
|---|------|-------|-----------|---------------------|
| 1 | `src/routes/SystemsPage.tsx` | 218 | Basic filtered list with type/status/role dropdowns, inline test connection button, expand rows for credentials | No CRUD (create/edit/delete), no pagination, no link to diagnostic page, no export, no KPI summary bar, hardcoded colors `#22c55e`/`#ef4444` |
| 2 | `src/routes/SystemDetailPage.tsx` | 156 | Read-only detail view + inline test button. Shows system info + credential info | Uses `LoadingSpinner`/`ErrorMessage` (not shared components), hardcoded colors `#3b82f6`/`#22c55e`/`#ef4444`, no edit/delete actions, no link to diagnostic page |
| 3 | `src/routes/ConnectionDiagnosticsPage.tsx` | 420 | Full diagnostic page with system grid, tabbed detail (Health/Profile/History/Schema) | Calls 3 nonexistent endpoints (`/diagnostics/summary`, `/diagnostics`, `/diagnostics/{id}/run`), no backend support for health checks, profile metrics, or history. Well-structured but entirely broken. |

**Summary:** 3 pages exist. `SystemsPage` and `SystemDetailPage` are functional but incomplete. `ConnectionDiagnosticsPage` is structurally complete but entirely non-functional (broken API calls).

---

## 2. Hook Inventory

| # | File | Endpoint Consumed | Return Shape | Notes |
|---|------|------------------|-------------|-------|
| 1 | `src/hooks/useSystems.ts:5-17` | `GET /systems` | `System[]` | `useSystemList()` — basic list, no pagination, no filters |
| 2 | `src/hooks/useSystems.ts:19-34` | `GET /systems/{id}` | `SystemDetail` | `useSystemDetail(id)` — single system detail |
| 3 | `src/hooks/useSystems.ts:36-53` | `GET /systems/{id}/test` | `TestConnectionResponse` | `useTestConnection()` — mutation hook for test |
| 4 | `src/hooks/useHealth.ts:5-22` | `GET /monitoring/health` | `HealthResponse` | Uses raw `fetch()` instead of `apiClient`. Not connection-related. |

**Missing hooks:**
- `useCreateSystem()` — POST /systems
- `useUpdateSystem()` — PUT /systems/{id}
- `useDeleteSystem()` — DELETE /systems/{id}
- `useSystemDiagnostics(id)` — GET /systems/{id}/diagnostics
- `useRunDiagnostics(id)` — POST /systems/{id}/run-diagnostics
- `useTestHistory(id)` — GET /systems/{id}/test-history
- `useConnectionProfile(id)` — GET /systems/{id}/connection-profile

**Pattern established:** `useWorkflows.ts` (158 lines) demonstrates the convention — `useState`/`useEffect`/`useCallback`, `apiGet`/`apiPost`/`apiPut`/`apiDelete` from `apiClient`, separate hooks for list/detail/create/update/delete. New hooks should follow this pattern.

---

## 3. Type Inventory

**File:** `src/types/systems.ts` (22 lines)

| Interface | Defined | Notes |
|-----------|---------|-------|
| `ConnectionConfig` | ✅ | `{ host: string, port: number, database: string }` |
| `System` | ✅ | `{ system_id, system_name, system_role, database_type, credential_id }` |
| `SystemDetail` | ✅ | Extends `System` + `connection_config` |
| `TestConnectionResponse` | ✅ | `{ status, message }` |

**Missing types:**
- `SystemCreateRequest` — for POST /systems
- `SystemUpdateRequest` — for PUT /systems/{id}
- `DiagnosticsSummary` — aggregate health stats for KPI cards
- `HealthCheckResult` — individual health check (network, auth, SSL, version, pool, query)
- `ConnectionProfile` — pool stats, query metrics, uptime
- `TestHistoryEntry` — single test result with timestamp
- `DiagnosticReport` — full diagnostic with all sub-checks

---

## 4. Backend API Audit

### System Routes (`app/api/routes/system_routes.py`, 96 lines)

| Method | Path | Exists | Frontend Consumed | Notes |
|--------|------|--------|------------------|-------|
| GET | `/api/v1/systems/` | ✅ | ✅ `useSystemList()` | Returns list with system_id, name, role, db_type, credential_id |
| GET | `/api/v1/systems/{system_id}` | ✅ | ✅ `useSystemDetail()` | Returns detail with connection_config |
| POST | `/api/v1/systems/` | ✅ | ❌ No hook | Uses `SystemCreateRequest` model (requires project_id) |
| GET | `/api/v1/systems/{system_id}/test` | ✅ | ✅ `useTestConnection()` | Actually connects to DB via psycopg2 |
| PUT | `/api/v1/systems/{system_id}` | ❌ | ❌ | **Not implemented** |
| DELETE | `/api/v1/systems/{system_id}` | ❌ | ❌ | **Not implemented** |
| GET | `/api/v1/systems/{system_id}/diagnostics` | ❌ | ❌ `ConnectionDiagnosticsPage` | **Not implemented** — called by frontend |
| POST | `/api/v1/systems/{system_id}/run-diagnostics` | ❌ | ❌ `ConnectionDiagnosticsPage` | **Not implemented** — called by frontend |
| GET | `/api/v1/systems/{system_id}/test-history` | ❌ | ❌ `ConnectionDiagnosticsPage` | **Not implemented** — called by frontend |
| GET | `/api/v1/systems/{system_id}/connection-profile` | ❌ | ❌ | **Not implemented** — needed for Profile tab |

### Credential Routes (`app/api/routes/credential_routes.py`, 99 lines)

| Method | Path | Exists | Notes |
|--------|------|--------|-------|
| GET | `/api/v1/credentials/` | ✅ | Returns list of {credential_id, username} |
| POST | `/api/v1/credentials/` | ✅ | Creates credential, links to system |
| PUT | `/api/v1/credentials/{id}` | ✅ | Updates credential |
| DELETE | `/api/v1/credentials/{id}` | ✅ | Deletes credential |

### Backend Models (`app/api/models/system_models.py`, 22 lines)

| Model | Fields |
|-------|--------|
| `ConnectionConfig` | `host: str, port: int, database: str` |
| `SystemCreateRequest` | `project_id, system_name, system_role, database_type, connection_config` |
| `SystemResponse` | `system_id, system_name, system_role, database_type` |

**Missing:** `SystemUpdateRequest` model.

### Services

| Service | Methods | Notes |
|---------|---------|-------|
| `SystemService` (151 lines) | `create_system`, `list_systems`, `get_system`, `test_connection`, `list_tables` | No update/delete. `test_connection` uses psycopg2 directly. `list_tables` uses AdapterRegistry (frozen). |
| `CredentialService` (170 lines) | `create_credential`, `update_credential`, `upsert_credentials`, `get_decrypted_credentials`, `list_credentials`, `delete_credential`, `update_password` | Full CRUD. Uses EncryptionManager for encrypt/decrypt. |

---

## 5. Component Usage

### Shared Components Available (15 exported from `src/components/shared/index.ts`)

| Component | Used by Connection pages? | Should be used? |
|-----------|--------------------------|----------------|
| `StatusBadge` | ❌ | ✅ Health check status indicators |
| `ProgressBar` | ❌ | ✅ Connection pool utilization |
| `DataTable` | ❌ | ✅ Test history table |
| `MetricCard` | ❌ | ✅ KPI cards (Systems/Healthy/Unhealthy) |
| `EmptyState` | ❌ | ✅ Empty system list |
| `ErrorState` | ❌ | ✅ Replace custom error displays |
| `LoadingSkeleton` | ❌ | ✅ Replace custom spinners |
| `SearchBar` | ❌ | ✅ System search |
| `Pagination` | ❌ | ✅ System list pagination |
| `Modal` | ❌ | ✅ System create/edit dialogs |
| `ConfirmDialog` | ❌ | ✅ Delete confirmation |
| `TabBar` | ❌ | ✅ Diagnostic page tabs |
| `TenantFilter` | ❌ | ✅ Tenant-scoped filtering |

### Broken Shared Component

| Component | Issue |
|-----------|-------|
| `ConnectionTestPanel.tsx` (104 lines) | Uses Tailwind utility classes (`className="border rounded-lg p-4"`, `className="px-4 py-2 bg-blue-500 text-white rounded"`). Calls `POST /api/v1/systems/test-connection` — wrong endpoint (actual: `GET /api/v1/systems/{id}/test`). Sends `{ system_id, db_type, config }` body — actual endpoint takes no body. |

---

## 6. Broken Items

| # | File | Line(s) | Issue | Severity |
|---|------|---------|-------|----------|
| 1 | `ConnectionDiagnosticsPage.tsx` | 19 | `apiGet('/diagnostics/summary')` — endpoint does not exist | 🔴 Critical |
| 2 | `ConnectionDiagnosticsPage.tsx` | 35 | `apiGet('/diagnostics')` — endpoint does not exist | 🔴 Critical |
| 3 | `ConnectionDiagnosticsPage.tsx` | 57 | `apiPost(\`/diagnostics/${systemId}/run\`)` — endpoint does not exist | 🔴 Critical |
| 4 | `ConnectionTestPanel.tsx` | 41 | `apiPost('/api/v1/systems/test-connection', ...)` — wrong endpoint and method | 🔴 Critical |
| 5 | `ConnectionTestPanel.tsx` | 69-101 | Tailwind utility classes (`border`, `rounded-lg`, `bg-blue-500`, `bg-green-50`, etc.) — not available in design system | 🟡 Medium |
| 6 | `useHealth.ts` | 10 | Uses raw `fetch()` instead of `apiClient` — inconsistent with all other hooks | 🟡 Medium |
| 7 | `SystemDetailPage.tsx` | 59, 107 | Hardcoded colors `#3b82f6`, `#22c55e`, `#ef4444` — should use CSS variables | 🟢 Low |
| 8 | `SystemsPage.tsx` | 156, 178 | Hardcoded colors `#22c55e`, `#ef4444` — should use CSS variables | 🟢 Low |
| 9 | `SystemDetailPage.tsx` | 4-5 | Imports `LoadingSpinner`, `ErrorMessage` from `../components/LoadingSpinner` — not shared components | 🟢 Low |
| 10 | `system_models.py` | — | `SystemCreateRequest` requires `project_id` — frontend has no way to provide this in current UX | 🟡 Medium |

---

## 7. Gap Analysis

### What Exists vs What Option C Requires

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| **Page: System List** | `SystemsPage.tsx` — basic list | Missing: pagination, CRUD actions, KPI bar, export |
| **Page: System Detail** | `SystemDetailPage.tsx` — read-only | Missing: edit/delete actions, link to diagnostics |
| **Page: Diagnostic** | `ConnectionDiagnosticsPage.tsx` — broken | Missing: working backend, health checks, profile, history |
| **Hook: System CRUD** | `useSystemList`, `useSystemDetail`, `useTestConnection` | Missing: create, update, delete hooks |
| **Hook: Diagnostics** | None | Missing: all diagnostic hooks |
| **Types: System** | `ConnectionConfig`, `System`, `SystemDetail`, `TestConnectionResponse` | Missing: 7 types (see §3) |
| **Backend: System CRUD** | GET list, GET one, POST create, GET test | Missing: PUT update, DELETE delete |
| **Backend: Diagnostics** | None | Missing: all 4 diagnostic endpoints |
| **Backend: Health Checks** | None | Missing: network, auth, SSL, version, pool, query checks |
| **Backend: Connection Profile** | None | Missing: pool stats, query metrics, uptime |
| **Backend: Test History** | None | Missing: history storage and retrieval |
| **Shared Components** | 15 available, 0 used by Connection pages | All 13 relevant components should be adopted |
| **ConnectionTestPanel** | Exists but broken | Needs: fix endpoint, fix API call pattern, replace Tailwind |

### Summary Score

| Category | Score | Notes |
|----------|-------|-------|
| Frontend Pages | 30% | 3 pages exist, 1 broken, 2 incomplete |
| Frontend Hooks | 25% | 3/10 needed hooks exist |
| Frontend Types | 36% | 4/11 needed types exist |
| Backend API | 40% | 4/10 needed endpoints exist |
| Backend Services | 50% | SystemService partial, CredentialService complete |
| Shared Components | 0% | 13 components available but 0 used |
| **Overall** | **~30%** | Significant work remaining |

---

## 8. Effort Re-estimate

Based on actual code review, here is the revised effort estimate per step:

| Step | Description | Original Estimate | Revised Estimate | Notes |
|------|-------------|-------------------|-----------------|-------|
| **Step 2** | Backend: diagnostics API, CRUD endpoints, health checks | 3-4 days | **3 days** | CredentialService already complete. SystemService needs update/delete + 4 diagnostic endpoints. Health checks can reuse psycopg2 pattern from test_connection. |
| **Step 3** | Frontend: types, hooks, shared components | 2 days | **2 days** | Follow `useWorkflows.ts` pattern. 7 types, 7 hooks, adopt 13 shared components. |
| **Step 4** | Frontend: CRUD pages, enhance existing | 2-3 days | **2 days** | SystemsPage needs pagination/CRUD. SystemDetailPage needs edit/delete. Modal + ConfirmDialog already available. |
| **Step 5** | Diagnostic page: split-pane, tabs, all tabs | 3-4 days | **3 days** | ConnectionDiagnosticsPage structure is solid (420 lines). Needs: fix API calls, wire to real endpoints, add Profile/History tab content. |
| **Step 6** | Polish: export, responsive, accessibility | 2 days | **2 days** | Export, responsive breakpoints, a11y attributes, replace hardcoded colors. |
| **Step 7** | Closure: verify, produce report | 1 day | **1 day** | Standard verification. |
| **Total** | | **10-14 days** | **~13 days** | Revised estimate is within original range. |

---

## 9. Risks & Blockers

| # | Risk | Impact | Mitigation |
|---|------|--------|-----------|
| 1 | `ConnectionDiagnosticsPage` calls 3 nonexistent endpoints — page is entirely non-functional | High | Step 2 must create these endpoints before Step 5 can wire them up |
| 2 | `ConnectionTestPanel` uses Tailwind — cannot be used as-is in the custom design system | Medium | Must rewrite with inline styles + CSS variables before adoption |
| 3 | `SystemCreateRequest` requires `project_id` — no frontend mechanism to provide it | Medium | Either add project selector to create form, or make project_id optional with a default |
| 4 | No health check infrastructure in backend — all 6 checks (network, auth, SSL, version, pool, query) must be built from scratch | Medium | Can reuse psycopg2 pattern from `test_connection` for most checks. SSL and version checks need additional queries. |
| 5 | `useHealth.ts` uses raw `fetch` instead of `apiClient` — inconsistent pattern | Low | Rewrite to use `apiClient` in Step 3 |
| 6 | `list_tables` in SystemService uses frozen AdapterRegistry — may not work for all DB types | Low | Out of scope for 10.5.1 — skip if adapter not available |

---

## 10. Recommendation

**Proceed to Step 2 (Backend).** The assessment confirms:

1. The existing code provides a solid foundation — no rewrites needed, only enhancement
2. Backend gaps are well-defined and bounded (2 CRUD endpoints + 4 diagnostic endpoints + health check logic)
3. Frontend gaps are mechanical — follow established `useWorkflows.ts` patterns, adopt existing shared components
4. The `ConnectionDiagnosticsPage` structure (420 lines) is sound and can be rewired to real endpoints
5. Original effort estimate (10-14 days) remains valid at ~13 days

**No blockers identified.** All dependencies (shared components, design system tokens, apiClient utilities) are available.
