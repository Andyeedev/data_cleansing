# Phase 09 — Corrected Restoration Plan

> **Generated:** 2026-07-29
> **Basis:** Comparison of frozen frontend (`frontend/`) against current MVP (`frontend-mvp/`)
> **Status:** Analysis only — no implementation

---

## 1. Baseline Correction

The frozen frontend at `engineering/MAP_V2/03_Source/frontend/` is a **Vite + React 19 starter template**, not a functional enterprise application.

### Actual Frozen State

| Item | Status |
|------|--------|
| Source lines of code | ~430 (CSS + TSX counter demo) |
| Page components | 0 (1: counter App.tsx) |
| Shared components | 0 |
| Hooks | 0 |
| Services | 0 |
| Auth | 0 |
| Navigation | 0 |
| Theme system | 3 CSS custom properties (--text, --bg, --accent) |
| Routes | 1 (`/` counter demo) |
| Testing | 0 |
| TypeScript strict | 0 |
| Dependencies listed | `recharts`, `ag-grid`, `react-hook-form`, `lucide-react`, `axios`, `react-toastify`, `zod` — all unused |

### Required Correction

The Phase 09 baseline was incorrectly identified. The frozen frontend has no enterprise capabilities to restore. Phase 09 must build the entire frontend application from scratch.

The `frontend-mvp/` directory is the actual starting point for Frontend Restoration work.

---

## 2. Comparison: Frozen vs MVP

### 2.1 Authentication

| Capability | Frozen (actual) | MVP (current) | Verdict |
|------------|-----------------|---------------|---------|
| Login page | ✗ None | ✓ `LoginPage.tsx` — email/password with error handling | **Build in MVP** |
| Auth context | ✗ None | ✓ `AuthContext.tsx` — login/logout/switchRole | **Build in MVP** |
| Token handling | ✗ None | ✓ localStorage with 6 fallback keys | **Build in MVP** |
| Protected routes | ✗ None | ✓ `ProtectedRoute.tsx` | **Build in MVP** |
| Role management | ✗ None | ✓ `RoleSwitcher.tsx` — admin/manager/operator/viewer | **Build in MVP** |
| RBAC | ✗ None | ✓ `permissionGuard.ts` + per-page checks | **Build in MVP** |
| Session persistence | ✗ None | ✓ Reads token on app load | **Build in MVP** |
| Logout flow | ✗ None | ✓ ConfirmDialog → clear → redirect | **Build in MVP** |

**Conclusion:** All authentication capabilities must be built in the MVP. The frozen frontend has nothing to restore.

### 2.2 Themes

| Capability | Frozen (actual) | MVP (current) | Verdict |
|------------|-----------------|---------------|---------|
| CSS variables | 3 basic (--text, --bg, --accent) | 80+ tokens (colors, spacing, typography, shadows, z-index) | **Upgrade in MVP** |
| Dark mode | OS-based only (`prefers-color-scheme`) | Manual toggle with `[data-theme='dark']` + localStorage persistence | **Build in MVP** |
| Design tokens | None | `tokens.ts` — JS exports for all design values | **Build in MVP** |
| Typography | Default browser | Full scale (xs through h1, 4 weight levels) | **Build in MVP** |
| Spacing | Default browser | xs through xl (4px–32px) | **Build in MVP** |
| Shadow scale | Single `--shadow` | 5 levels (xs through xl) | **Build in MVP** |
| Z-index layers | None | 8 defined layers | **Build in MVP** |
| Accessibility utilities | None | `.skip-link`, `.sr-only`, `.focus-ring`, `prefers-reduced-motion` | **Build in MVP** |
| CSS reset | None | Full `*, *::before, *::after` box-sizing reset | **Build in MVP** |

**Conclusion:** The MVP upgrades the frozen theme from 3 CSS variables to a professional design system. This is enhancement, not restoration.

### 2.3 Dashboard Framework

| Capability | Frozen (actual) | MVP (current) | Verdict |
|------------|-----------------|---------------|---------|
| Dashboard page | ✗ None | ✓ `DashboardPage.tsx` | **Build in MVP** |
| Metric cards | ✗ None | ✓ `MetricCard` — reusable with title, value, icon, trend | **Build in MVP** |
| Quick actions | ✗ None | ✓ "Manage Systems", "Start Migration", "View Operations" | **Build in MVP** |
| Activity feed | ✗ None | ✓ Executive-only activity log with PASS/FAIL badges | **Build in MVP** |
| Role-conditional content | ✗ None | ✓ Executive view vs basic view | **Build in MVP** |

**Conclusion:** No dashboard exists in frozen frontend. MVP builds it from scratch.

### 2.4 Charts/Widgets

| Capability | Frozen (actual) | MVP (current) | Verdict |
|------------|-----------------|---------------|---------|
| Chart library | Listed in package.json (unused) | None installed | **None restored** |
| Bar/pie/line charts | ✗ None | ✗ None | **Defer** |
| MetricCard | ✗ None | ✓ Delivered in MVP | **Build in MVP** |
| ProgressBar | ✗ None | ✓ Delivered in MVP | **Build in MVP** |
| StatusBadge | ✗ None | ✓ Delivered in MVP | **Build in MVP** |
| LoadingSkeleton | ✗ None | ✓ Delivered in MVP | **Build in MVP** |
| DataTable | ✗ ag-grid listed but unused | ✓ Custom DataTable with sortable columns | **Build in MVP** |

**Conclusion:** Charts are missing in both frozen and MVP. This is a new capability gap.

### 2.5 Portals/Overlays

| Capability | Frozen (actual) | MVP (current) | Verdict |
|------------|-----------------|---------------|---------|
| Modal | ✗ None | ✓ `Modal.tsx` with focus trap | **Build in MVP** |
| ConfirmDialog | ✗ None | ✓ `ConfirmDialog.tsx` | **Build in MVP** |
| Toast system | `react-toastify` in package.json (unused) | ✓ Custom `Toast.tsx` with `toastService` | **Build in MVP** |
| Overlay z-index | None | 3 defined layers (300, 400, 500) | **Build in MVP** |

**Conclusion:** No portal system exists in frozen frontend. MVP builds it from scratch.

### 2.6 Navigation

| Capability | Frozen (actual) | MVP (current) | Verdict |
|------------|-----------------|---------------|---------|
| Sidebar | ✗ None | ✓ Fixed 260px sidebar in `Layout.tsx` | **Build in MVP** |
| Dynamic navigation | ✗ None | ✓ `DynamicNavigation.tsx` — tree from API with fallback | **Build in MVP** |
| Breadcrumbs | ✗ None | ✓ `Breadcrumb.tsx` — auto-generated | **Build in MVP** |
| Header | ✗ None | ✓ 56px header with RoleSwitcher, ThemeToggle, Logout | **Build in MVP** |
| Skip link | ✗ None | ✓ `<a href="#main-content">Skip to main content</a>` | **Build in MVP** |
| Nav filtering | ✗ None | ✓ `filterByPermissions()` hides items by role | **Build in MVP** |

**Conclusion:** No navigation exists in frozen frontend. MVP builds it from scratch.

### 2.7 Advanced UI Components

| Capability | Frozen (actual) | MVP (current) | Verdict |
|------------|-----------------|---------------|---------|
| DataTable | ✗ None (ag-grid unused) | ✓ Generic sortable table with pagination | **Build in MVP** |
| Pagination | ✗ None | ✓ `Pagination.tsx` with ellipsis, prev/next | **Build in MVP** |
| SearchBar | ✗ None | ✓ Debounced input with Enter key | **Build in MVP** |
| TabBar | ✗ None | ✓ Keyboard nav, ARIA roles | **Build in MVP** |
| Date pickers | ✗ None | ⚠ Native `<input type="date">` only | **Enhance later** |
| Rich forms | ✗ None | ⚠ inline-styled forms, no form library | **Enhance later** |
| Error boundary | ✗ None | ✓ `ErrorBoundary.tsx` with retry | **Build in MVP** |
| Loading states | ✗ None | ✓ `LoadingSkeleton` (table/list/text/circle) | **Build in MVP** |
| Empty states | ✗ None | ✓ `EmptyState.tsx` | **Build in MVP** |
| Error states | ✗ None | ✓ `ErrorState.tsx` | **Build in MVP** |
| Accessibility | ✗ None | ✓ ARIA roles, focus management, axe-core | **Build in MVP** |

---

## 3. Capability Reconciliation

### 3.1 What Can Be Restored Directly

**None.** The frozen frontend IS a Vite starter template. There are no enterprise capabilities to restore.

### 3.2 What Should Be Enhanced

The frozen frontend's `package.json` lists dependencies that were never used. These represent planned-but-unrealized capabilities:

| Dependency | Planned Capability | Enhancement Action |
|------------|-------------------|-------------------|
| `recharts` | Chart widgets | Install + create chart components (bar, pie, line) |
| `ag-grid` | Data grid | Evaluate vs current `DataTable` — keep or replace |
| `react-hook-form` | Form management | Install + create form field components |
| `lucide-react` | Icons | Install + replace inline SVGs with icon components |
| `axios` | HTTP client | Already replaced by `apiClient.ts` (native fetch) |
| `react-toastify` | Toast notifications | Already replaced by `Toast.tsx` (custom, more accessible) |
| `zod` | Schema validation | Install + add runtime type validation |

### 3.3 What Should Remain Deferred

| Capability | Reason |
|------------|--------|
| Charts (bar, pie, line, area) | No chart library in MVP; deferred until Phase 7 |
| Custom date picker | Native `<input type="date">` works for current scope |
| Form library (react-hook-form) | Current inline forms function correctly |
| Data grid (ag-grid) | Custom `DataTable` meets current needs |
| Markdown editor | No rich text input required by current pages |
| Drag and drop (kanban) | No visual task management required |
| i18n (translations) | English-only is sufficient for current scope |
| RTL support | Not required for current user base |

---

## 4. Corrected Phase 09 Restoration Plan

### Phase 09 — Baseline: Empty Template → Full MVP Application

```
Frozen frontend (frontend/):
  430 lines of code
  0 application pages
  0 components
  0 hooks
  0 services
  0 auth
  0 navigation
  0 theme system
  1 route (counter demo)

MVP frontend (frontend-mvp/):
  ~10,000+ lines of code
  26 page components
  14 shared components
  17 custom hooks
  4 services
  Full auth (login, RBAC, role switcher)
  Full navigation (sidebar, breadcrumbs, dynamic)
  Complete theme system (80+ tokens, dark mode)
  75+ route paths
```

### Phase 09 — What Was Actually Done

| Workstream | What Was Built | Effort Equivalent |
|------------|---------------|-------------------|
| Auth infrastructure | Login, RBAC, token management, protected routes | 20–30 hours |
| Design system (theme) | 80+ design tokens, dark mode, accessibility utilities | 15–20 hours |
| Application shell | Layout, sidebar, header, navigation, breadcrumbs | 15–20 hours |
| Shared components | 14 reusable components (StatusBadge, Modal, Toast, etc.) | 25–30 hours |
| Data layer | apiClient with retry, MSW handlers, errorHandler, permissionGuard | 15–20 hours |
| State management | useStateMachine, useDebounce, 17 data hooks | 15–20 hours |
| Pages (26) | All pages from counter demo to full application | 60–80 hours |
| Accessibility | ARIA attributes, focus management, axe-core integration | 15–20 hours |
| Testing infrastructure | Vitest + testing-library + MSW + jest setup | 10–15 hours |
| **Total** | | **200–275 hours** |

### Phase 09 — Gap Analysis (Corrected)

| Capability | Status | Action |
|------------|--------|--------|
| Login/authentication | ✓ Built from scratch | None |
| Dashboard | ✓ Built from scratch | None |
| Navigation | ✓ Built from scratch | None |
| Theme system | ✓ Built from scratch | None |
| Chart widgets | ✗ Not built | **Defer to Phase 7** |
| Form library | ⚠ Partial (inline forms only) | **Defer to Phase 7** |
| Data grid (ag-grid) | ✗ Custom DataTable used instead | **Defer to Phase 7** |
| Date picker | ⚠ Native only | **Enhance in Phase 8** |
| Rich text editor | ✗ Not built | **Defer to Phase 7** |
| i18n | ✗ Not built | **Defer to Phase 10** |
| Drag-and-drop | ✗ Not built | **Defer to Phase 10** |
| Toast notifications | ✓ Custom implementation | None |
| Modals/portals | ✓ Custom implementation | None |
| Error handling | ✓ Global error boundary + apiClient | None |
| Permission system | ✓ RBAC with permissionGuard | None |

---

## 5. Recommendation

**Phase 09 was Frontend Restoration from an empty template, not Enhancement of an existing enterprise application.**

The frozen frontend had no enterprise capabilities. Phase 09 built everything from scratch. The remaining gaps (charts, form library, ag-grid, i18n, drag-and-drop) are capabilities that were planned but never implemented in the frozen frontend, and are now correctly deferred to Phase 7.

---

*This document corrects the Phase 09 baseline assumption. The frozen frontend IS a Vite starter template, not a functional enterprise application. All MVP capabilities were built from scratch.*
