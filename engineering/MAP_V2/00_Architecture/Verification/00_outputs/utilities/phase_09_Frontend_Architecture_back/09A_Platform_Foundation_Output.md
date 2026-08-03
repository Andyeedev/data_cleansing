# 09A — Platform Foundation — Architecture Output

> **Generated from:** `09A_Platform_Foundation.md`
> **Status:** Awaiting Review & Approval
> **Date:** 2026-07-27

---

## Executive Summary

This document defines the architecture for Phase 09A — Platform Foundation, the reusable application framework that every functional area depends upon.

---

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

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

## Cross-Document Dependencies

> **Implementation order flows top-down.**

```
09A Platform Foundation
    ↓
09F Cross-Cutting Platform Services
    ↓
09B Migration & Execution
    ↓
09C Governance & Compliance
    ↓
09D Operations
    ↓
09E Platform Administration
    ↓
09G Future Modules
```

---

## 1. Design System Architecture

### 1.1 CSS Variables (`src/theme/variables.css`)

#### New Tokens to Add

| Category | Token | Value | Purpose |
|----------|-------|-------|---------|
| **Spacing** | `--space-xs` | 4px | Inline spacing, icon gaps |
| | `--space-sm` | 8px | Small component padding |
| | `--space-md` | 16px | Standard component padding |
| | `--space-lg` | 24px | Section spacing |
| | `--space-xl` | 32px | Page-level spacing |
| **Typography** | `--font-size-xs` | 12px | Captions, badges |
| | `--font-size-sm` | 13px | Small text |
| | `--font-size-base` | 14px | Body text |
| | `--font-size-lg` | 16px | Large text |
| | `--font-size-h3` | 18px | Subsection headers |
| | `--font-size-h2` | 22px | Section headers |
| | `--font-size-h1` | 28px | Page titles |
| | `--font-weight-normal` | 400 | Regular text |
| | `--font-weight-medium` | 500 | Emphasized text |
| | `--font-weight-semibold` | 600 | Strong emphasis |
| | `--font-weight-bold` | 700 | Headings |
| **Border Radius** | `--radius-sm` | 4px | Badges, small elements |
| | `--radius-md` | 8px | Cards, buttons, inputs |
| | `--radius-lg` | 12px | Modals, panels |
| | `--radius-full` | 9999px | Pills, avatars |
| **Shadows** | `--shadow-xs` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| | `--shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Cards, dropdowns |
| | `--shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Modals, popovers |
| | `--shadow-xl` | 0 20px 25px rgba(0,0,0,0.15) | Large overlays |
| **Animation** | `--duration-fast` | 100ms | Tooltips |
| | `--duration-normal` | 200ms | Buttons, focus |
| | `--duration-slow` | 300ms | Modals, toasts |
| | `--duration-slower` | 500ms | Page transitions |
| | `--easing-default` | ease-in-out | Standard |
| | `--easing-smooth` | cubic-bezier(0.4, 0, 0.2, 1) | Smooth |
| **Z-Index** | `--z-base` | 0 | Default |
| | `--z-dropdown` | 100 | Dropdowns |
| | `--z-sticky` | 200 | Sticky headers |
| | `--z-modal-backdrop` | 300 | Modal overlay |
| | `--z-modal` | 400 | Modal content |
| | `--z-toast` | 500 | Toasts |
| | `--z-tooltip` | 600 | Tooltips |
| | `--z-skip-link` | 700 | Skip link |
| **Icon Sizes** | `--icon-xs` | 12px | Inline badges |
| | `--icon-sm` | 16px | Button icons |
| | `--icon-md` | 20px | Navigation icons |
| | `--icon-lg` | 24px | Header icons |
| | `--icon-xl` | 32px | Empty states |
| **Grid** | `--grid-columns` | 12 | Default grid |
| | `--grid-gutter` | 16px | Column gap |
| | `--grid-margin` | 24px | Page margin |
| **Containers** | `--container-sm` | 640px | Small content |
| | `--container-md` | 768px | Medium content |
| | `--container-lg` | 1024px | Large content |
| | `--container-xl` | 1280px | Extra large |
| **Border** | `--border-width` | 1px | Default borders |
| | `--border-width-focus` | 2px | Focus rings |
| **Opacity** | `--opacity-disabled` | 0.5 | Disabled elements |
| | `--opacity-overlay` | 0.5 | Modal backdrop |
| | `--opacity-loading` | 0.7 | Loading states |

#### Additional Colours

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-surface` | #ffffff | Card/panel background |
| `--color-info` | #2563EB | Informational |
| `--color-secondary` | #6B7280 | Secondary actions |

#### Utility Classes to Add

```css
/* Skip Link */
.skip-link { position: absolute; top: -100%; ... }
.skip-link:focus { top: 16px; }

/* Screen Reader Only */
.sr-only { position: absolute; width: 1px; height: 1px; ... }

/* Focus Ring */
.focus-ring:focus-visible { outline: 2px solid var(--color-primary); }

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) { ... }
```

### 1.2 TypeScript Tokens (`src/theme/tokens.ts`)

```typescript
export const colours = { primary, secondary, success, warning, danger, info, ... };
export const spacing = { xs, sm, md, lg, xl };
export const typography = { size: {...}, weight: {...}, lineHeight: {...} };
export const borderRadius = { sm, md, lg, full };
export const shadows = { xs, sm, md, lg, xl };
export const animation = { duration: {...}, easing: {...} };
export const zIndex = { base, dropdown, sticky, modalBackdrop, modal, toast, tooltip, skipLink };
export const iconSizes = { xs, sm, md, lg, xl };
export const grid = { columns, gutter, margin };
export const container = { sm, md, lg, xl };
export const breakpoints = { mobile: 375, tablet: 768, desktop: 1280 };
```

---

## 2. Shared Components Architecture

### 2.1 Component Inventory

| Component | File | Props | States |
|-----------|------|-------|--------|
| StatusBadge | `StatusBadge.tsx` | status, variant?, size?, ariaLabel? | auto-detect from status |
| ProgressBar | `ProgressBar.tsx` | value, max?, colour?, label? | loading, error, complete, partial |
| DataTable | `DataTable.tsx` | columns, data, loading, empty, pagination, onSort?, onPageChange? | loading, empty, error, populated |
| MetricCard | `MetricCard.tsx` | title, value, colour?, icon?, subtitle?, trend?, loading?, error?, onRetry? | loading, error, empty |
| EmptyState | `EmptyState.tsx` | title, description?, action?, icon? | — |
| ErrorState | `ErrorState.tsx` | title?, message, code?, onRetry? | — |
| LoadingSkeleton | `LoadingSkeleton.tsx` | rows?, variant?, height?, width?, style? | card, table, list, text, circle |
| SearchBar | `SearchBar.tsx` | value, onChange, onSearch?, placeholder?, debounce? | — |
| Pagination | `Pagination.tsx` | page, pageSize, total, onPageChange | — |
| Modal | `Modal.tsx` | open, title, onClose, children, footer? | — |
| ConfirmDialog | `ConfirmDialog.tsx` | open, title, message, onConfirm, onCancel, variant? | danger, warning, info |
| Toast | `Toast.tsx` | message, type, duration?, onDismiss? | success, error, warning, info |
| TabBar | `TabBar.tsx` | tabs, activeTab, onTabChange, urlBased? | — |

### 2.2 Component Patterns

All components follow:
- Named exports (no default exports)
- Inline styles using CSS variables
- ARIA attributes per accessibility spec
- Keyboard navigation support
- No external UI libraries

### 2.3 File Structure

```
src/components/shared/
├── StatusBadge.tsx
├── ProgressBar.tsx
├── DataTable.tsx
├── MetricCard.tsx
├── EmptyState.tsx
├── ErrorState.tsx
├── LoadingSkeleton.tsx
├── SearchBar.tsx
├── Pagination.tsx
├── Modal.tsx
├── ConfirmDialog.tsx
├── Toast.tsx
├── TabBar.tsx
└── index.ts          (barrel export)
```

---

## 3. Application Shell Architecture

### 3.1 Responsive Navigation

| Breakpoint | Width | Navigation | behaviour |
|------------|-------|------------|-----------|
| Desktop | ≥ 1280px | Fixed left sidebar (260px) | Always visible |
| Tablet | 768px-1279px | Collapsible sidebar (64px collapsed) | Toggle button |
| Mobile | < 768px | Bottom nav bar (64px, 5 items) | Fixed bottom |

### 3.2 Accessibility Additions

| Element | Attribute | Value |
|---------|-----------|-------|
| Skip link | href | `#main-content` |
| Sidebar | aria-label | "Main navigation" |
| Header | role | "banner" |
| Main content | role | "main" |
| Modal | role, aria-modal | "dialog", "true" |
| Toast | role, aria-live | "alert", "polite" |

### 3.3 Error Recovery Integration

| HTTP Code | Current Behaviour | New Behaviour |
|-----------|-------------------|---------------|
| 401 | Redirect to /login | Clear JWT → Store URL → Redirect → Restore |
| 403 | Generic error | "Access Denied" page with request link |

### 3.4 Files to Implement

| File | Changes |
|------|---------|
| `Shell.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. Add ARIA labels, responsive navigation. |
| `Layout.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. Add skip link, focus management, mobile bottom nav. |
| `DynamicNavigation.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. Add ARIA, keyboard navigation, responsive collapse. |
| `ProtectedRoute.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. Add 401/403 error recovery. |

---

## 4. Platform Services Architecture

### 4.1 Error Handler (`src/services/errorHandler.ts`)

```typescript
interface ErrorHandler {
  handle401(): void;      // Clear JWT, redirect, store URL
  handle403(): void;      // Show Access Denied
  handle404(): void;      // Show Not Found
  handle422(errors): void; // Parse, highlight fields
  handle429(retryAfter): void; // Countdown, auto-retry
  handle500(errorId): void;    // Show error, support ID
  handle503(): void;      // Show maintenance banner
}
```

### 4.2 Toast Service (`src/services/toastService.ts`)

```typescript
interface ToastService {
  success(message, duration?): void;
  error(message, duration?): void;
  warning(message, duration?): void;
  info(message, duration?): void;
  dismiss(id): void;
}
```

### 4.3 Permission Guard (`src/services/permissionGuard.ts`)

```typescript
interface PermissionGuard {
  hasRole(user, role): boolean;
  hasAnyRole(user, roles[]): boolean;
  canAccess(user, requiredRoles): boolean;
}
```

### 4.4 API Client Enhancement

| Feature | Implementation |
|---------|----------------|
| Error parsing | Extract detail, code, field from response |
| Retry logic | 429: Parse Retry-After, auto-retry |
| Token refresh | Check expiry, refresh if needed |
| Support ID | Generate UUID for 500 errors |

### 4.5 Hooks to Migrate

| Hook | Current | Target |
|------|---------|--------|
| `useExecution.ts` | raw fetch | apiClient |
| `useExecutionHistory.ts` | raw fetch | apiClient |
| `useHealth.ts` | raw fetch | apiClient |
| `useMonitoring.ts` | raw fetch | apiClient |

---

## 5. Deliverables Summary

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| # | File | Action | Lines (est.) |
|---|------|--------|--------------|
| 1 | `src/theme/variables.css` | Extend | +150 |
| 2 | `src/theme/tokens.ts` | Inspect existing theme patterns first; create if no suitable token system exists | 120 |
| 3 | `src/components/shared/StatusBadge.tsx` | Inspect existing status display first; create if no suitable component exists | 80 |
| 4 | `src/components/shared/ProgressBar.tsx` | Inspect existing progress indicators first; create if no suitable component exists | 70 |
| 5 | `src/components/shared/DataTable.tsx` | Inspect existing table components first; refactor if suitable, create only if none exist | 150 |
| 6 | `src/components/shared/MetricCard.tsx` | Inspect existing metric displays first; create if no suitable component exists | 90 |
| 7 | `src/components/shared/EmptyState.tsx` | Inspect existing empty state patterns first; create if no suitable component exists | 50 |
| 8 | `src/components/shared/ErrorState.tsx` | Inspect existing error display first; create if no suitable component exists | 70 |
| 9 | `src/components/shared/LoadingSkeleton.tsx` | Inspect existing loading patterns first; create if no suitable component exists | 100 |
| 10 | `src/components/shared/SearchBar.tsx` | Inspect existing search components first; create if no suitable component exists | 60 |
| 11 | `src/components/shared/Pagination.tsx` | Inspect existing pagination first; create if no suitable component exists | 70 |
| 12 | `src/components/shared/Modal.tsx` | Inspect existing modal/dialog patterns first; create if no suitable component exists | 80 |
| 13 | `src/components/shared/ConfirmDialog.tsx` | Inspect existing confirmation patterns first; create if no suitable component exists | 70 |
| 14 | `src/components/shared/Toast.tsx` | Inspect existing notification patterns first; create if no suitable component exists | 80 |
| 15 | `src/components/shared/TabBar.tsx` | Inspect existing tab components first; create if no suitable component exists | 70 |
| 16 | `src/components/shared/index.ts` | Create barrel export (structural, no logic) | 20 |
| 17 | `src/components/Shell/Shell.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | +30 |
| 18 | `src/components/Layout/Layout.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | +50 |
| 19 | `src/components/Navigation/DynamicNavigation.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | +40 |
| 20 | `src/components/ProtectedRoute.tsx` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | +20 |
| 21 | `src/utils/apiClient.ts` | Enhance | +80 |
| 22 | `src/services/errorHandler.ts` | Inspect existing error handling first; refactor existing if suitable | 100 |
| 23 | `src/services/toastService.ts` | Inspect existing notification services first; create if no suitable service exists | 60 |
| 24 | `src/services/permissionGuard.ts` | Inspect existing permission checks first; create if no suitable guard exists | 40 |
| 25 | `src/hooks/useExecution.ts` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | - |
| 26 | `src/hooks/useExecutionHistory.ts` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | - |
| 27 | `src/hooks/useHealth.ts` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | - |
| 28 | `src/hooks/useMonitoring.ts` | Inspect existing implementation. Extend or refactor as required. Preserve current behaviour. | - |

**Total estimated new lines:** ~1,800

---

## 6. Dependencies

- **None** — this is the foundation workstream

## 7. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inline styles may become unwieldy | Medium | Consistent token usage, component abstraction |
| No CSS modules = potential naming conflicts | Low | Unique class names, BEM-like convention |
| Mobile bottom nav may conflict with existing layout | Medium | Test at all breakpoints, gradual migration |

---

## 8. Approval Required

- [ ] Design System tokens approved
- [ ] Shared component specs approved
- [ ] App Shell responsive approach approved
- [ ] Error handling strategy approved
- [ ] File structure approved

**Awaiting your approval before implementation.**
