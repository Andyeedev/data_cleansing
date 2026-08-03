# 09F — Cross-Cutting Platform Services — Architecture Output

> **Generated from:** `09F_Cross_Cutting_Platform_Services.md`
> **Status:** Awaiting Review & Approval
> **Date:** 2026-07-27

---

## Executive Summary

This document defines the architecture for Phase 09F — Cross-Cutting Platform Services: state machines, error recovery, performance, accessibility, and testing.

---

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

---

## Dependency Order

```
Shared Components (from 09A)
    ↓
ErrorBoundary (check before create — don't replace existing)
    ↓
State Machine Hook (create if not exists)
    ↓
Error Recovery (enhance existing apiClient)
    ↓
Performance (lazy loading, debounce)
    ↓
Accessibility (enhance existing components)
    ↓
Testing (add tests for existing + new)
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

## 1. State Machine Architecture

### 1.1 Generic State Machine Hook

```typescript
// src/hooks/useStateMachine.ts

type State = 'idle' | 'loading' | 'loaded' | 'error' | 'empty' | string;

interface StateMachineConfig {
  initial: State;
  transitions: Record<State, Record<string, State>>;
}

function useStateMachine(config: StateMachineConfig) {
  const [state, setState] = useState(config.initial);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const transition = (event: string, payload?: any) => { ... };
  const fetchData = async (fetchFn: () => Promise<any>) => { ... };
  const retry = () => { ... };

  return { state, data, error, transition, fetchData, retry };
}
```

### 1.2 Page-Specific State Machines

| Screen | States | Transitions |
|--------|--------|-------------|
| Dashboard | idle, loadingPortfolio, loadingActivity, loaded, empty, partial, complete, error | onMount, portfolioLoaded, activityLoaded, fetchFailed |
| Migration | idle, loading, loaded, starting, polling, updating, completed, failed | onMount, systemsLoaded, batchesCreated, progressUpdate, error |
| Governance | idle, loadingTab, loaded, tabEmpty, tabData, error | onTabSwitch, tabLoaded, tabLoadFailed |
| Tasks | idle, loadingTasks, loaded, tasksEmpty, tasksLoaded, creating, created, deleting, deleted | onMount, tasksLoaded, createTask, taskCreated, deleteTask, taskDeleted |
| Notifications | idle, loading, loaded, empty, loaded, marking, markingAll | onMount, notificationsLoaded, markRead, marked, markAllRead, markedAll |
| Login | idle, authenticating, authenticated, error, rateLimited | formSubmit, authSuccess, authFailed, rateLimited |

---

## 2. Error Recovery Architecture

### 2.1 Error Handler Service

```typescript
// src/services/errorHandler.ts

interface ErrorResponse {
  detail: string;
  code: string;
  field?: string;
}

class ErrorHandler {
  handle(error: Response, context?: any): void {
    switch (error.status) {
      case 401: this.handle401(); break;
      case 403: this.handle403(); break;
      case 404: this.handle404(); break;
      case 422: this.handle422(error.body); break;
      case 429: this.handle429(error.headers.retryAfter); break;
      case 500: this.handle500(error); break;
      case 503: this.handle503(); break;
    }
  }

  private handle401(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('map_nexus_user');
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/login';
  }

  private handle403(): void {
    // Show Access Denied page
  }

  private handle422(errors: ErrorResponse[]): void {
    // Parse errors, highlight fields, show inline messages
  }

  private handle429(retryAfter: number): void {
    // Show countdown, auto-retry
  }

  private handle500(error: Response): void {
    // Generate support ID, show error with retry
  }

  private handle503(): void {
    // Show maintenance banner, disable actions
  }
}
```

### 2.2 Error Boundary

```typescript
// src/components/ErrorBoundary.tsx

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error, generate support ID
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState message={this.state.error.message} onRetry={this.retry} />;
    }
    return this.props.children;
  }
}
```

---

## 3. Performance Architecture

### 3.1 Lazy Loading

```typescript
// src/AppRoutes.tsx

const DashboardPage = React.lazy(() => import('./routes/DashboardPage'));
const MigrationPage = React.lazy(() => import('./routes/MigrationPage'));
const GovernancePage = React.lazy(() => import('./routes/GovernancePage'));
// ... etc

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        {/* ... */}
      </Routes>
    </Suspense>
  );
}
```

### 3.2 Debounce Hook

```typescript
// src/hooks/useDebounce.ts

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
```

### 3.3 Performance Targets

| Metric | Target | Implementation |
|--------|--------|----------------|
| Initial render | < 1.5s | Lazy loading, code splitting |
| Bundle size | < 200KB gzipped | Tree shaking, minification |
| API response | < 500ms | Backend optimization |
| Tab switch | < 300ms | Cached data, optimistic updates |
| Search debounce | 300ms | useDebounce hook |
| Polling interval | 2s | Configurable interval |

---

## 4. Accessibility Architecture

### 4.1 ARIA Implementation

| Component | ARIA Attributes |
|-----------|-----------------|
| Skip link | `href="#main-content"` |
| Sidebar | `aria-label="Main navigation"` |
| Header | `role="banner"` |
| Main | `role="main"` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="alert"`, `aria-live="polite"` |
| Progress | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Tab | `role="tab"`, `aria-selected`, `aria-controls` |
| TabPanel | `role="tabpanel"`, `aria-labelledby` |
| Loading | `aria-busy="true"`, `aria-label="Loading"` |
| Search | `aria-label="Search"` |
| Pagination | `aria-label="Pagination"` |

### 4.2 Keyboard Navigation

| Element | Keys | behaviour |
|---------|------|-----------|
| Buttons | Enter, Space | Activate |
| Links | Enter | Navigate |
| Modals | Escape | Close |
| Dropdowns | Arrow keys | Navigate items |
| Tabs | Arrow keys | Switch tabs |
| Tables | Arrow keys | Navigate cells |

### 4.3 Focus Management

| Scenario | behaviour |
|----------|-----------|
| Page load | Focus main heading |
| Modal open | Focus first focusable element |
| Modal close | Return focus to trigger |
| Tab switch | Focus new tab panel |
| Form error | Focus first invalid field |
| Toast | Do not steal focus |

---

## 5. Testing Architecture

### 5.1 Test Setup

```typescript
// src/test-setup.ts
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

### 5.2 Test Types

| Type | Tools | Coverage | Files |
|------|-------|----------|-------|
| Unit Tests | Vitest, React Testing Library | 80% | Components, hooks, utilities |
| Integration Tests | Vitest, MSW | 70% | Page + API interactions |
| E2E Tests | Playwright | P0 screens | Critical user flows |
| Visual Regression | Playwright screenshot | Shared components | UI component snapshots |
| API Mock Tests | MSW, Vitest | All endpoints | API contract validation |
| Permission Tests | Vitest, custom helpers | All protected routes | Role-based access |
| Accessibility Tests | axe-core, Playwright | All pages | WCAG compliance |
| Performance Tests | Lighthouse CI | All pages | Load time, bundle size |

### 5.3 MSW Handlers

```typescript
// tests/mocks/handlers.ts

import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/dashboard/portfolio', (req, res, ctx) => {
    return res(ctx.json({ totalSystems: 3, totalBatches: 543, ... }));
  }),
  // ... all API endpoints
];
```

---

## 6. Files to Implement

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| File | Action |
|------|--------|
| `src/hooks/useStateMachine.ts` | Inspect existing patterns first; create if no suitable state management exists |
| `src/hooks/useDebounce.ts` | Inspect existing hooks first; create if no suitable debounce exists |
| `src/components/ErrorBoundary.tsx` | Inspect existing error handling first; create if no suitable boundary exists |
| `src/services/errorHandler.ts` | Inspect existing error handling first; refactor existing if suitable |
| `src/services/accessibility.ts` | Inspect existing accessibility support first; extend existing if suitable |
| `src/AppRoutes.tsx` | Extend existing routes with lazy loading |
| `src/test-setup.ts` | Extend existing test setup with axe-core |
| `tests/mocks/handlers.ts` | Inspect existing test mocks first; create MSW handlers if none exist |
| `tests/e2e/` | Inspect existing E2E tests first; extend if suitable, create if none exist |
| `tests/a11y/` | Create accessibility test suite (no existing a11y tests) |

---

## 7. Acceptance Criteria

- [ ] State machine hook works for all pages
- [ ] Error handler covers all HTTP codes
- [ ] Error boundary catches unhandled errors
- [ ] Lazy loading reduces initial bundle
- [ ] Debounce hook works for search
- [ ] All ARIA attributes applied
- [ ] Keyboard navigation functional
- [ ] Focus management working
- [ ] Unit tests at 80% coverage
- [ ] Integration tests at 70% coverage
- [ ] E2E tests for critical flows
- [ ] Accessibility tests pass
- [ ] Performance targets met

---

## 8. Approval Required

- [ ] State machine architecture approved
- [ ] Error recovery strategy approved
- [ ] Performance approach approved
- [ ] Accessibility requirements approved
- [ ] Testing strategy approved

**Awaiting your approval before implementation.**
