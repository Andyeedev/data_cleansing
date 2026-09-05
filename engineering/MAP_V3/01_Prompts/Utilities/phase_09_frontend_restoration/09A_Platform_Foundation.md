# 09A — Platform Foundation

> **Generated from:** `00_MASTER_FRONTEND_RESTORATION_PROMPT.md`
> **References:** `01_Master_Frontend_Restoration_Specification.md` (Revision 4)
> **Dependencies:** None — this is the foundation for all other workstreams

---

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

---

## Existing Frontend Review

> **MUST be completed before ANY implementation. This is the first deliverable.**

### Step 1 — Inspect Current State

| Area | Inspect | Location |
|------|---------|----------|
| Component library | Existing shared components | `src/components/` |
| Shared folder | Any shared utilities | `src/components/shared/` (if exists) |
| Theme folder | Existing CSS variables, tokens | `src/theme/` |
| Shell/Layout | Existing shell components | `src/components/Shell/`, `src/components/Layout/` |
| Navigation | Existing navigation | `src/components/Navigation/` |
| Authentication | Existing auth flow | `src/context/`, `src/hooks/` |
| API client | Existing API utilities | `src/utils/apiClient.ts` |
| Hooks | Existing custom hooks | `src/hooks/` |

### Step 2 — Mandatory Existing Asset Audit

> **Complete this table for EVERY component before writing any code. Without this, developers create StatusBadge.tsx, StatusBadge2.tsx, PlatformStatusBadge.tsx, SharedStatusBadge.tsx — six months later nobody knows which is correct.**

| Requested Component | Existing? | Location | Reuse | Refactor | Replace | Create |
|---------------------|-----------|----------|-------|----------|---------|--------|
| StatusBadge | Audit first | Check `src/components/shared/` | ✅ if >80% compatible | ✅ if minor gaps | ❌ | ❌ |
| ProgressBar | Audit first | Check MigrationPage inline | ✅ | ✅ | ❌ | ❌ |
| DataTable | Audit first | Check `<table>` in pages | ✅ | ✅ | ❌ | ❌ |
| MetricCard | Audit first | Check DashboardPage | ✅ | ✅ | ❌ | ❌ |
| EmptyState | Audit first | Check "No data" patterns | ✅ | ✅ | ❌ | ❌ |
| ErrorState | Audit first | Check ErrorMessage | ✅ | ✅ | ❌ | ❌ |
| LoadingSkeleton | Audit first | Check LoadingSpinner | ✅ | Refactor | ❌ | ❌ |
| SearchBar | Audit first | Check search inputs | ✅ | ✅ | ❌ | ❌ |
| Pagination | Audit first | Check pagination patterns | ✅ | ✅ | ❌ | ❌ |
| Modal | Audit first | Check modal patterns | ✅ | ✅ | ❌ | ❌ |
| ConfirmDialog | Audit first | Check delete confirms | ✅ | ✅ | ❌ | ❌ |
| Toast | Audit first | Check toast patterns | ✅ | ✅ | ❌ | ❌ |
| TabBar | Audit first | Check tab implementations | ✅ | ✅ | ❌ | ❌ |
| AlertBanner | Audit first | Check monitoring/alerts | — | — | — | ✅ if missing |
| Breadcrumb | Audit first | `src/components/Breadcrumb/` | ✅ | ✅ | ❌ | ❌ |
| ActionToolbar | Audit first | Check for search+filter+export patterns | — | — | — | ✅ if missing |
| tokens.ts | ❌ | — | ❌ | ❌ | ❌ | ✅ |

### Step 3 — Component Maturity Matrix

> **Action depends on maturity. Only create when functionality does not exist.**

| Component | Existing | Action |
|-----------|----------|--------|
| StatusBadge | Audit | Reuse if >80% compatible |
| MetricCard | Audit | Refactor |
| Modal | Audit | Extend |
| Pagination | Audit | Reuse |
| DataTable | Audit | Refactor |
| Toast | Audit | Replace only if missing |
| ActionToolbar | Audit | Create if missing |

### Step 4 — Only Create Missing

- If it exists → enhance, refactor, preserve public interfaces
- If it does not exist → create it
- Never duplicate existing functionality

---

## Objective

Build the reusable application framework that every functional area depends upon.

---

## Dependency Order

```
variables.css (extend)
    ↓
tokens.ts (create)
    ↓
Shared Components (inspect → reuse/refactor/create)
    ↓
Shell/Layout (refactor, preserve auth)
    ↓
Navigation (refactor, add ARIA)
    ↓
Platform Services (refactor existing, don't replace)
    ↓
Hooks (migrate raw fetch to apiClient)
    ↓
Pages (consume shared components)
```

---

## Scope

### 09A.1 Design System

Extend the existing `variables.css` and create TypeScript token definitions.

**Source:** Master Spec Step 13 (Design System) + Step 29 (Design Tokens Extended)

**Action:** Inspect `src/theme/variables.css` first. Extend existing tokens. Do not replace existing colour values unless standardising.

#### Deliverables

1. **Extend `src/theme/variables.css`** with:
   - Spacing scale: `--space-xs` (4px) through `--space-xl` (32px)
   - Typography: `--font-size-xs` (12px) through `--font-size-h1` (28px), weights, line heights
   - Border radius: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-full` (9999px)
   - Shadows: `--shadow-xs` through `--shadow-xl`
   - **Elevation tokens** (semantic layer over shadows):
     - `--elevation-surface-1`: `--shadow-xs` — cards, inputs
     - `--elevation-surface-2`: `--shadow-md` — dropdowns, popovers
     - `--elevation-surface-3`: `--shadow-lg` — modals, dialogs
     - `--elevation-overlay`: `--shadow-xl` — full-screen overlays
   - Animation: `--duration-fast` (100ms) through `--duration-slower` (500ms), easing curves
   - Z-index layers: `--z-base` (0) through `--z-skip-link` (700)
   - Icon sizes: `--icon-xs` (12px) through `--icon-xl` (32px)
   - Grid: `--grid-columns` (12), `--grid-gutter` (16px), `--grid-margin` (24px)
   - Container widths: `--container-sm` (640px) through `--container-xl` (1280px)
   - Border widths: `--border-width` (1px), `--border-width-focus` (2px)
   - Opacity: `--opacity-disabled` (0.5), `--opacity-overlay` (0.5), `--opacity-loading` (0.7)
   - Additional colours: `--color-surface`, `--color-info`, `--color-secondary`
   - Skip link styles, focus ring utilities, `.sr-only` class
   - `prefers-reduced-motion` media query
   - **High Contrast Mode** support via `[data-contrast='high']` selector

2. **Create `src/theme/tokens.ts`** with TypeScript constants matching CSS variables

3. **Dark mode updates** for all new tokens in `[data-theme='dark']` selector

#### Acceptance Criteria

- [ ] All tokens from Step 13 and Step 29 defined in CSS
- [ ] TypeScript token file created
- [ ] Dark mode variants for all new tokens
- [ ] Skip link and focus ring utilities functional
- [ ] Reduced motion respected

---

### 09A.2 Shared Components

Inspect existing component library. Standardise or create 16 reusable components.

**Source:** Master Spec Step 12 (Component Library Standard) + Step 21 (Component Ownership Matrix)

#### Component Specifications

| Component | Action | Notes |
|-----------|--------|-------|
| StatusBadge | Inspect → enhance existing or create | Check for inline badge helpers in pages |
| ProgressBar | Inspect → enhance existing or create | Check MigrationPage for existing progress display |
| DataTable | Inspect → standardise existing tables | All `<table>` elements should use this |
| MetricCard | Inspect → enhance existing or create | Check DashboardPage for existing card patterns |
| EmptyState | Inspect → enhance existing or create | Check for "No data" patterns |
| ErrorState | Inspect → enhance existing or create | Check LoadingSpinner.tsx for ErrorMessage |
| LoadingSkeleton | Inspect → refactor LoadingSpinner | Preserve existing LoadingSpinner export |
| SearchBar | Inspect → enhance existing or create | Check for search inputs in pages |
| Pagination | Inspect → enhance existing or create | Check for pagination patterns |
| Modal | Inspect → enhance existing or create | Check for modal patterns in pages |
| ConfirmDialog | Inspect → enhance existing or create | Check for delete confirmations |
| Toast | Inspect → create or refactor existing | Check for toast/snackbar patterns |
| TabBar | Inspect → enhance existing or create | Check MigrationPage, GovernancePage tabs |
| **AlertBanner** | **Inspect → create** | Used throughout monitoring/alerts |
| **Breadcrumb** | **Inspect → refactor** | Already exists at `src/components/Breadcrumb/` |
| **ActionToolbar** | **Inspect → create** | Reusable Search + Filter + Export + Refresh bar |

#### Component Requirements

Each component must:
- Use named export (no default exports)
- Include ARIA attributes per Step 26 (Accessibility)
- Support keyboard navigation per Step 26
- Use CSS variables from design system
- Follow inline style pattern (existing codebase convention)
- Include `role`, `aria-label`, `aria-busy`, `aria-live` as appropriate
- Preserve existing public interfaces when refactoring

#### Acceptance Criteria

- [ ] All 16 components inspected and actioned
- [ ] Existing components enhanced/refactored (not replaced)
- [ ] Only missing components created
- [ ] Each component has named export
- [ ] ARIA attributes applied per Step 26
- [ ] Keyboard navigation functional
- [ ] Uses CSS variables for all styling
- [ ] No external UI library dependencies

---

### 09A.3 Application Shell

Refactor existing shell components for responsive navigation and accessibility. **Preserve existing authentication flow.**

**Source:** Master Spec Step 16 (Route Map) + Step 26 (Accessibility) + Step 28 (Responsive Breakpoints)

#### Current Files

- `src/components/Shell/Shell.tsx` (92 lines)
- `src/components/Layout/Layout.tsx` (106 lines)
- `src/components/Navigation/DynamicNavigation.tsx` (87 lines)
- `src/components/Breadcrumb/Breadcrumb.tsx` (53 lines)
- `src/components/ProtectedRoute.tsx` (30 lines)

#### Action: Inspect → Refactor (preserve existing)

| File | Action | Preserve |
|------|--------|----------|
| Shell.tsx | Refactor | Navigation fetch logic, fallback handling |
| Layout.tsx | Refactor | Sidebar structure, header, logout button |
| DynamicNavigation.tsx | Refactor | Recursive nav, expand/collapse, permission filtering |
| Breadcrumb.tsx | Refactor | Auto-generation from nav tree |
| ProtectedRoute.tsx | Refactor | Auth check, role-based access |

#### Changes Required

1. **Responsive Navigation** (Step 28):
   - Desktop (≥1280px): Fixed left sidebar (260px)
   - Tablet (768px-1279px): Collapsible left sidebar (64px collapsed)
   - Mobile (<768px): Bottom navigation bar (64px height, 5 items: Home, Migration, Governance, Tasks, More)

2. **Accessibility** (Step 26):
   - Add skip link ("Skip to main content")
   - Add `aria-label="Main navigation"` to sidebar
   - Add `role="banner"` to header
   - Add `role="main"` to content area
   - Implement focus management for page transitions
   - Modal focus trapping

3. **Protected Route Enhancement** (Step 24 - Error Recovery):
   - 401: Clear JWT, redirect to `/login`, store requested URL
   - 403: Show "Access Denied" page
   - **Do not replace existing authentication — integrate with it**

4. **Route Map** (Step 16):
   - Verify all 26 routes from Route Map are registered in `AppRoutes.tsx`
   - Ensure feature flag gates for `/reports` and `/mapping`

#### Acceptance Criteria

- [ ] Responsive navigation works at all breakpoints
- [ ] Skip link present and functional
- [ ] ARIA labels on all navigation elements
- [ ] Focus management for page transitions
- [ ] 401/403 error recovery implemented
- [ ] All 26 routes registered
- [ ] Feature flag gates functional
- [ ] Existing authentication flow preserved

---

### 09A.4 Platform Services

Refactor existing services. **Do not create new services if equivalents exist.**

**Source:** Master Spec Step 14 (API Response Contracts) + Step 15 (Error Codes) + Step 24 (Error Recovery)

#### Action: Inspect → Refactor existing

| Service | Inspect | Action |
|---------|---------|--------|
| API client | `src/utils/apiClient.ts` | Enhance with error handling |
| Error handling | Check for existing error utilities | Refactor into shared service (don't create new) |
| Toast | Check for existing toast patterns | Refactor into shared service |
| Permission guard | Check `filterByPermissions.ts` | Enhance with role checking |

#### Changes Required

1. **API Client Enhancement** (`src/utils/apiClient.ts`):
   - Add structured error handling for all HTTP codes (Step 15)
   - Add retry logic for 429 (Rate Limited) with Retry-After header
   - Add automatic token refresh handling
   - Standardize response unwrapping
   - **Preserve existing apiGet, apiPost, apiPut, apiDelete interfaces**

2. **Error Handling Service**:
   - **Inspect first** — check for existing error handling patterns
   - If exists: refactor into shared service
   - If not exists: create `src/services/errorHandler.ts`
   - Implement recovery sequences per Step 24:
     - 401: Clear JWT → Redirect to `/login` → Store URL
     - 403: Show "Access Denied" → Log failure
     - 404: Show "Not Found" → Log missing resource
     - 422: Parse error → Highlight fields → Show inline messages
     - 429: Parse Retry-After → Show countdown → Auto-retry
     - 500: Show error → Generate support ID → Log details
     - 503: Show banner → Disable actions → Auto-refresh
   - **Offline detection**: Use `navigator.onLine` + online/offline events
   - **OfflineBanner**: Auto-appear when `navigator.onLine === false`, hide when online

3. **Toast Service**:
   - **Inspect first** — check for existing toast/snackbar patterns
   - If exists: refactor into shared service
   - If not exists: create `src/services/toastService.ts`
   - Global toast queue via React context
   - Toast types: success, error, warning, info
   - Auto-dismiss after 5 seconds (configurable)

4. **Permission Guard Service**:
   - **Preserve existing `filterByPermissions.ts`**
   - Enhance with role-based access per Step 7 (Permissions Matrix)
   - Check user roles against required roles
   - **Use existing JWT roles — do not invent frontend permission models**

5. **Migrate Raw Fetch Hooks**:
   - `src/hooks/useExecution.ts` → use apiClient
   - `src/hooks/useExecutionHistory.ts` → use apiClient
   - `src/hooks/useHealth.ts` → use apiClient
   - `src/hooks/useMonitoring.ts` → use apiClient
   - **Preserve existing hook interfaces**

6. **API Response Envelope** (standardise all endpoints):
   ```typescript
   interface ApiResponse<T> {
     success: boolean;
     data: T;
     message: string;
     errors: string[];
   }
   ```
   - All API calls must unwrap this envelope
   - apiClient returns `data` directly, throws on `success: false`

#### Acceptance Criteria

- [ ] apiClient handles all HTTP error codes
- [ ] Error recovery sequences implemented
- [ ] OfflineBanner appears when `navigator.onLine === false`
- [ ] Toast service functional with auto-dismiss
- [ ] Permission guard uses existing JWT roles
- [ ] All hooks use apiClient (no raw fetch)
- [ ] API contracts match Step 14
- [ ] API response envelope standardised
- [ ] Existing services refactored, not replaced

#### Acceptance Criteria

- [ ] apiClient handles all HTTP error codes
- [ ] Error recovery sequences implemented
- [ ] OfflineBanner appears when `navigator.onLine === false`
- [ ] Toast service functional with auto-dismiss
- [ ] Permission guard uses existing JWT roles
- [ ] All hooks use apiClient (no raw fetch)
- [ ] API contracts match Step 14
- [ ] API response envelope standardised
- [ ] Existing services refactored, not replaced

---

## Deliverables

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| File | Action | Notes |
|------|--------|-------|
| `src/theme/variables.css` | Extend | Preserve existing tokens |
| `src/theme/tokens.ts` | Inspect existing theme patterns first; create if no suitable token system exists | TypeScript constants |
| `src/components/shared/StatusBadge.tsx` | Inspect → create/enhance | Check existing badge patterns |
| `src/components/shared/ProgressBar.tsx` | Inspect → create/enhance | Check MigrationPage |
| `src/components/shared/DataTable.tsx` | Inspect → standardise | All tables should use this |
| `src/components/shared/MetricCard.tsx` | Inspect → create/enhance | Check DashboardPage |
| `src/components/shared/EmptyState.tsx` | Inspect → create/enhance | Check "No data" patterns |
| `src/components/shared/ErrorState.tsx` | Inspect → create/enhance | Check ErrorMessage |
| `src/components/shared/LoadingSkeleton.tsx` | Inspect → refactor | Preserve LoadingSpinner |
| `src/components/shared/SearchBar.tsx` | Inspect → create/enhance | Check search inputs |
| `src/components/shared/Pagination.tsx` | Inspect → create/enhance | Check pagination patterns |
| `src/components/shared/Modal.tsx` | Inspect → create/enhance | Check modal patterns |
| `src/components/shared/ConfirmDialog.tsx` | Inspect → create/enhance | Check delete confirms |
| `src/components/shared/Toast.tsx` | Inspect → create/refactor | Check toast patterns |
| `src/components/shared/TabBar.tsx` | Inspect → create/enhance | Check tab implementations |
| `src/components/shared/AlertBanner.tsx` | Inspect → create | Monitoring/alerts |
| `src/components/shared/Breadcrumb.tsx` | Refactor | Already exists |
| `src/components/shared/ActionToolbar.tsx` | Inspect → create | Search + Filter + Export + Refresh |
| `src/components/shared/OfflineBanner.tsx` | Inspect existing offline detection first; create if no suitable banner exists | Auto-show when offline |
| `src/components/shared/index.ts` | Create barrel export (structural, no logic) | Barrel export |
| `src/components/Shell/Shell.tsx` | Refactor | Preserve nav logic |
| `src/components/Layout/Layout.tsx` | Refactor | Preserve structure |
| `src/components/Navigation/DynamicNavigation.tsx` | Refactor | Preserve recursive nav |
| `src/components/ProtectedRoute.tsx` | Refactor | Preserve auth flow |
| `src/utils/apiClient.ts` | Enhance | Preserve existing interfaces |
| `src/services/errorHandler.ts` | Inspect → create/refactor | Check existing patterns |
| `src/services/toastService.ts` | Inspect → create/refactor | Check existing patterns |
| `src/services/permissionGuard.ts` | Enhance | Use existing JWT roles |
| `src/hooks/useExecution.ts` | Refactor | Migrate to apiClient |
| `src/hooks/useExecutionHistory.ts` | Refactor | Migrate to apiClient |
| `src/hooks/useHealth.ts` | Refactor | Migrate to apiClient |
| `src/hooks/useMonitoring.ts` | Refactor | Migrate to apiClient |

---

## Traceability

| Deliverable | Master Spec Section |
|-------------|---------------------|
| Design tokens | Step 13, Step 29 |
| Shared components | Step 12, Step 21 |
| App shell | Step 16, Step 26, Step 28 |
| Error handling | Step 15, Step 24 |
| API client | Step 14 |
| Permissions | Step 7 |
| Toast service | Step 12 (Toast component) |
