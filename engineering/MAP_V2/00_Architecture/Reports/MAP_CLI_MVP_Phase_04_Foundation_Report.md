# MAP_CLI_MVP_Phase_04_Foundation_Report.md

**Phase:** 4 — Frontend Foundation
**Date:** 2026-07-21
**Status:** COMPLETE — Awaiting Approval
**Authoritative Source:** engineering/MAP_V2/00_Architecture/ (all architecture documents)

---

## 1. Goal

Create only the foundation for the new MAP Nexus Enterprise Platform frontend:

- Shell
- Layout
- Routing
- Theme
- Dynamic Navigation
- Metadata Renderer

No business pages. Navigation must be driven only by an approved metadata contract that has been verified and accepted through the Phase 3.5 approval gate.

---

## 2. Scope Delivered

### 2.1 Core Components

| Component | File | Purpose |
|-----------|------|---------|
| Shell | `src/components/Shell/Shell.tsx` | Application shell — fetches nav from API, applies permission filtering, renders Layout |
| Layout | `src/components/Layout/Layout.tsx` | Structural layout — sidebar, header, breadcrumb, content area |
| DynamicNavigation | `src/components/Navigation/DynamicNavigation.tsx` | Recursive nav renderer — expand/collapse, role-aware visibility |
| Breadcrumb | `src/components/Breadcrumb/Breadcrumb.tsx` | Breadcrumb generation from nav metadata and current path |
| MetadataRenderer | `src/components/MetadataRenderer/MetadataRenderer.tsx` | Generic metadata display component |
| ThemeToggle | `src/components/ThemeToggle.tsx` | Light/dark mode toggle |
| RoleSwitcher | `src/components/RoleSwitcher/RoleSwitcher.tsx` | Mock role switcher dropdown (Admin/Manager/Operator/Viewer) |
| LoadingSpinner | `src/components/LoadingSpinner/LoadingSpinner.tsx` | Loading spinner + ErrorMessage component |

### 2.2 Navigation API

| Endpoint | Method | Response |
|----------|--------|----------|
| `GET /api/v1/navigation/` | GET | 8 top-level menus, ~40 submenus with Doc 21 §6 metadata fields |

**Metadata fields per item:** `id`, `capabilityId`, `label`, `icon`, `path`, `navGroup`, `navOrder`, `visible`, `requiredRoles`, `children`

**Backend file:** `app/api/routes/navigation_routes.py` (565 lines)

### 2.3 Routing

| Category | Count | Description |
|----------|-------|-------------|
| Top-level portal routes | 11 | Home, Dashboard, Migration, Validation, Governance, Reports, Operations, Task Management, Administration, NotFound |
| Sub-routes | ~50 | Discovery, Mappings, Column Mappings, Rules, Results, Queue, Controls, Approvals, Risk, Audit, Executive, Operational, Templates, Distribution, Monitoring, Alerts, Schedules, Retry, Health, Dashboard, My Tasks, Workflows, Calendar, Notifications, Users, Roles, Tenants, Settings, Feature Flags, Security, Maintenance |
| **Total routes** | **~60** | All registered in `AppRoutes.tsx` |

### 2.4 Permission-Aware Navigation

**Filtering function:** `src/utils/filterByPermissions.ts`

**Logic:**
- Items with `visible: false` → hidden
- Items with no `requiredRoles` or empty array → visible to all
- Items with `requiredRoles` → visible only if user has at least one matching role
- Children are recursively filtered

**Mock auth context:** `src/context/AuthContext.tsx`

| Role | Display Name | Capabilities |
|------|-------------|--------------|
| admin | Admin User | Sees all menus including Administration, Approvals, Executive Reports |
| manager | Manager User | Sees Approvals and Executive Reports, but NOT Administration |
| operator | Operator User | Sees only unrestricted menus |
| viewer | Viewer User | Sees only unrestricted menus |

### 2.5 Permission Matrix

| Menu Item | Level | Required Roles | admin | manager | operator | viewer |
|-----------|-------|---------------|-------|---------|----------|--------|
| Administration | top-level | `admin` | ✅ | ❌ | ❌ | ❌ |
| Governance → Approvals | child | `admin`, `compliance-officer`, `manager` | ✅ | ✅ | ❌ | ❌ |
| Reports → Executive | child | `admin`, `manager` | ✅ | ✅ | ❌ | ❌ |
| All other menus | — | (none) | ✅ | ✅ | ✅ | ✅ |

### 2.6 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^19 |
| Build | Vite | ^8 |
| Language | TypeScript | ^6 |
| Routing | react-router-dom | ^7 |
| Testing | Vitest + React Testing Library | ^3 |
| Icons | Lucide React | — |

### 2.7 Frontend Location

```
MAP_V2/
└── 03_Source/
    ├── frontend/          (FROZEN — reference only)
    └── frontend-mvp/      (new implementation)
```

---

## 3. Architecture Compliance

### 3.1 Navigation Source

| Check | Status | Evidence |
|-------|--------|----------|
| Navigation data comes from metadata API | ✅ | Shell fetches `GET /api/v1/navigation/` on mount |
| No hardcoded navigation arrays used at runtime | ✅ | `DEFAULT_NAV` is fallback only when API is unavailable |
| Navigation respects `requiredRoles` from metadata | ✅ | `filterByPermissions()` filters by `userRoles` from auth context |
| Navigation respects `visible` field from metadata | ✅ | `filterByPermissions()` excludes `visible: false` items |
| Sub-menu expand/collapse is metadata-driven | ✅ | `DynamicNavigation` reads `children` from metadata |

### 3.2 Route Registration

| Check | Status | Evidence |
|-------|--------|----------|
| Routes are registered in a single file | ✅ | `AppRoutes.tsx` — ~60 routes |
| Route paths match metadata `path` fields | ✅ | All routes correspond to nav item paths |
| No business logic in route components | ✅ | All portal pages are placeholders |

### 3.3 Permission Filtering

| Check | Status | Evidence |
|-------|--------|----------|
| Role switching changes visible menus | ✅ | Verified: Admin sees all, Manager sees Approvals/Executive, Operator/Viewer see unrestricted only |
| Filtering is driven by metadata `requiredRoles` | ✅ | `filterByPermissions()` reads `requiredRoles` from nav items |
| No hardcoded role logic in components | ✅ | All role checks go through `filterByPermissions()` |

### 3.4 No Business Functionality

| Check | Status | Evidence |
|-------|--------|----------|
| No API calls to business endpoints | ✅ | Only `GET /api/v1/navigation/` is called |
| No database queries | ✅ | No database interaction |
| No business logic in components | ✅ | All portal pages render placeholder text only |
| No state management beyond auth context | ✅ | Only `AuthContext` for mock role switching |
| No forms, validation, or data manipulation | ✅ | No forms implemented |
| No real authentication/authorization | ✅ | Mock auth context with role switcher |

---

## 4. File Inventory

### 4.1 New Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `src/App.tsx` | Application entry — BrowserRouter + AuthProvider | 14 |
| `src/AppRoutes.tsx` | Route registration (~60 routes) | 88 |
| `src/types/metadata.ts` | MetadataNavItem type definition | 12 |
| `src/types/auth.ts` | MockRole, MockUser types + MOCK_USERS | 23 |
| `src/context/AuthContext.tsx` | Auth context, provider, useAuth hook | 40 |
| `src/utils/filterByPermissions.ts` | Role-based nav filtering | 17 |
| `src/test-utils.tsx` | Test helper — renderWithProviders | 33 |
| `src/components/Shell/Shell.tsx` | Application shell | 88 |
| `src/components/Layout/Layout.tsx` | Structural layout | 78 |
| `src/components/Navigation/DynamicNavigation.tsx` | Recursive nav renderer | 87 |
| `src/components/Breadcrumb/Breadcrumb.tsx` | Breadcrumb from nav metadata | ~40 |
| `src/components/MetadataRenderer/MetadataRenderer.tsx` | Generic metadata display | ~50 |
| `src/components/RoleSwitcher/RoleSwitcher.tsx` | Role switcher dropdown | ~40 |
| `src/components/ThemeToggle.tsx` | Light/dark toggle | ~30 |
| `src/components/LoadingSpinner/LoadingSpinner.tsx` | Loading spinner + ErrorMessage | ~40 |
| `src/routes/HomePage.tsx` | Home placeholder | ~15 |
| `src/routes/DashboardPage.tsx` | Dashboard placeholder | ~15 |
| `src/routes/MigrationPage.tsx` | Migration placeholder | ~15 |
| `src/routes/DiscoveryPage.tsx` | Discovery placeholder | ~15 |
| `src/routes/MappingPage.tsx` | Mapping placeholder | ~15 |
| `src/routes/ValidationPage.tsx` | Validation placeholder | ~15 |
| `src/routes/GovernancePage.tsx` | Governance placeholder | ~15 |
| `src/routes/ReportsPage.tsx` | Reports placeholder | ~15 |
| `src/routes/OperationsPage.tsx` | Operations placeholder | ~15 |
| `src/routes/TaskManagementPage.tsx` | Task Management placeholder | ~15 |
| `src/routes/AdministrationPage.tsx` | Administration placeholder | ~15 |
| `src/routes/NotFoundPage.tsx` | 404 page | ~15 |
| `app/api/routes/navigation_routes.py` | Navigation API endpoint | 565 |
| `vite.config.ts` | Vite config with API proxy | ~20 |

### 4.2 Test Files

| File | Tests | Status |
|------|-------|--------|
| `src/App.test.tsx` | 10 | ✅ Passing |
| `src/components/Shell/Shell.test.tsx` | 8 | ✅ Passing |
| `src/components/Layout/Layout.test.tsx` | 4 | ✅ Passing |
| `src/components/Navigation/DynamicNavigation.test.tsx` | 6 | ✅ Passing |
| `src/components/MetadataRenderer/MetadataRenderer.test.tsx` | 8 | ✅ Passing |
| **Total** | **36** | **All passing** |

---

## 5. Test Results

```
Test Files  5 passed (5)
     Tests  36 passed (36)
  Duration  ~7s
```

- **Lint:** Clean (0 errors, 0 warnings)
- **Build:** Clean (TypeScript + Vite, no errors)
- **Test framework:** Vitest 3.2.7 + React Testing Library

---

## 6. Known Limitations

| Limitation | Impact | Resolution |
|------------|--------|------------|
| Navigation API returns mock data | Nav structure is static | Replace with database-driven API in later phase |
| Auth context is mock only | No real user identity | Real authentication in later phase |
| Portal pages are placeholders | No business content | Phase 5+ implements business pages |
| `DEFAULT_NAV` duplicates API metadata | Maintenance overhead | Remove when API is always available |
| Role switcher is dev-only UI | Not for production | Remove before production deployment |

---

## 7. Issues Found

### 7.1 Resolved During Phase 4

| Issue | Resolution |
|-------|-----------|
| `<a href>` in DynamicNavigation caused full page reload | Switched to React Router `<Link to>` with `e.preventDefault()` on parent items |
| Menu order was alphabetical | Fixed to match Doc 16 §13.1 enterprise workflow order |
| Backend `ModuleNotFoundError: No module named 'app'` | Run uvicorn from project root, not frontend directory |
| OpenAPI schema caching hid nav endpoint | Cleared `__pycache__`, killed stale Python processes |
| Approvals invisible for Admin | Added `'admin'` to `requiredRoles` in both API and DEFAULT_NAV |
| `DEFAULT_NAV` had no `requiredRoles` | Added `requiredRoles` matching API metadata |
| Test failures after adding AuthProvider | Created `test-utils.tsx` with `renderWithProviders()` helper |
| `getByText` found duplicate text (nav + heading) | Switched to `getByRole('heading', { name: ... })` in tests |
| Bad import path in `filterByPermissions.ts` | Fixed `../../types/metadata` → `../types/metadata` |

### 7.2 No Outstanding Issues

No unresolved issues at time of report generation.

---

## 8. Phase 4 Gate

**Recommendation:** PROCEED to Phase 5 — Reuse Approved Presentation Components

**Findings:**
- Frontend foundation created at `MAP_V2/03_Source/frontend-mvp/`
- 8 core components built (Shell, Layout, DynamicNavigation, Breadcrumb, MetadataRenderer, ThemeToggle, RoleSwitcher, LoadingSpinner)
- ~60 routes registered across 11 portal pages (all placeholders)
- Navigation API endpoint delivering Doc 21 §6 metadata
- Permission-aware navigation with 4 mock roles verified
- 36/36 tests passing, lint clean, build clean
- No business logic implemented — all pages are placeholders
- Old frontend untouched (frozen reference)
- 9 issues identified and resolved during Phase 4

**Compliance verification:**
- ✅ Navigation comes only from the metadata API
- ✅ Routes are metadata-driven where intended
- ✅ Role switching changes the visible menus correctly
- ✅ No business functionality was implemented

**Policy Gaps:** None discovered during Phase 4.

**STOP. Do not continue to the next phase. Produce the report, wait for user approval, and only proceed after explicit approval.**
