# 09F — Cross-Cutting Platform Services

> **Generated from:** `00_MASTER_FRONTEND_RESTORATION_PROMPT.md`
> **References:** `01_Master_Frontend_Restoration_Specification.md` (Revision 4)
> **Dependencies:** 09A (Platform Foundation) — requires shared components, design system, API client

---

## Implementation Directive – Mandatory

> **This section is governed by `09Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**

---

## Existing Frontend Review

> **MUST be completed before ANY implementation.**

| Requested Component | Existing? | Location | Reuse | Refactor | Replace | Create |
|---------------------|-----------|----------|-------|----------|---------|--------|
| ErrorBoundary | Audit first | `src/components/ErrorBoundary.tsx` | ✅ | ✅ | ❌ | ❌ |
| LoadingSpinner | Audit first | `src/components/shared/LoadingSpinner.tsx` | ✅ | ✅ | ❌ | ❌ |
| ErrorMessage | Audit first | `src/components/shared/ErrorMessage.tsx` | ✅ | ✅ | ❌ | ❌ |
| useStateMachine | Audit first | Check `src/hooks/` | — | — | — | ✅ if missing |
| PageState enum | Audit first | Check for state constants | — | — | — | ✅ if missing |

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

## Objective

Define everything that supports every page: state machines, error recovery, performance, accessibility, and testing. **Check before creating — do not replace existing services.**

---

## Scope

### 1. State Machines (Step 20)

#### Global PageState Enum

> **Every page uses exactly the same lifecycle. That makes the UI feel very consistent.**

```typescript
// src/types/PageState.ts
enum PageState {
  Idle = 'idle',
  Loading = 'loading',
  Loaded = 'loaded',
  Empty = 'empty',
  Error = 'error',
  Refreshing = 'refreshing',
  Saving = 'saving',
  Deleting = 'deleting',
  Submitting = 'submitting',
  Polling = 'polling',
  Completed = 'completed',
  Failed = 'failed',
}
```

#### Standard Page State Machine

```
Idle
  ↓ (onMount / fetchData)
Loading
  ↓ (fetchSuccess)
Loaded
  ├── Empty (data.length === 0)
  ├── Partial (data.length < expected)
  ├── Complete (data.length >= expected)
  └── Error (fetchFailed)
```

#### Page-Specific State Machines

| Screen | State Machine |
|--------|---------------|
| DashboardPage | Idle → LoadingPortfolio + LoadingActivity → Loaded → (Empty \| Partial \| Complete) → Error → Loading |
| MigrationPage | Idle → Loading → Loaded → Starting → Polling → Updating → Polling → Completed → Failed |
| GovernancePage | Idle → LoadingTab → Loaded → (TabEmpty \| TabData) → Error |
| TaskManagementPage | Idle → LoadingTasks → Loaded → (TasksEmpty \| TasksLoaded) → Creating → Created → Loading |
| NotificationsPage | Idle → LoadingNotifications → Loaded → (NotificationsEmpty \| NotificationsLoaded) → Marking → Loaded |
| LoginPage | Idle → Authenticating → (Authenticated \| Error) → RateLimited |

#### Implementation

Create `src/hooks/useStateMachine.ts`:
- Generic state machine hook
- States: Idle, Loading, Loaded, Error, and page-specific states
- Transitions: onMount, onSuccess, onError, onRetry
- Returns: state, data, error, transition functions

---

#### Error Recovery (Step 24)

| Code | Trigger | Recovery Sequence |
|------|---------|-------------------|
| 401 | JWT expired or invalid | 1. Clear JWT from storage 2. Redirect to `/login` 3. Store requested URL in sessionStorage 4. After login, redirect to stored URL |
| 403 | Insufficient permissions | 1. Show "Access Denied" page 2. Log permission failure 3. Offer "Request Access" link |
| 404 | Resource not found | 1. Show "Not Found" page 2. Log missing resource 3. Offer "Go Home" link |
| 422 | Validation error | 1. Parse error response 2. Highlight invalid fields 3. Show inline error messages 4. Focus first invalid field |
| 429 | Rate limited | 1. Parse Retry-After header 2. Show "Too many requests" 3. Show countdown timer 4. Auto-retry after timer |
| 500 | Server error | 1. Show error with retry button 2. Generate support ID 3. Log error details 4. Offer "Contact Support" link |
| 503 | Maintenance | 1. Show maintenance banner 2. Disable all actions 3. Show estimated restore time 4. Auto-refresh every 60s |
| **Offline** | **navigator.onLine === false** | **1. Show OfflineBanner 2. Queue actions 3. Auto-recover when online** |

#### Implementation

Enhance `src/utils/apiClient.ts`:
- Structured error handling for all HTTP codes
- Automatic retry for 429 with Retry-After
- Error response parsing
- **Support ID generation for 500 errors**
- **Offline detection and action queuing**

Create `src/components/OfflineBanner.tsx`:
- **Auto-appear when navigator.onLine === false**
- Global toast-style notification
- Retry button to attempt reconnect
- Disables all actions while offline

#### Implementation

Enhance `src/utils/apiClient.ts`:
- Structured error handling for all HTTP codes
- Automatic retry for 429 with Retry-After
- Error response parsing
- Support ID generation for 500 errors

Create `src/components/ErrorBoundary.tsx`:
- React error boundary
- Catches unhandled errors
- Shows ErrorState with retry option

---

### 3. Performance (Step 25)

| Screen | Metric | Target |
|--------|--------|--------|
| Dashboard | Initial render | < 1.5s |
| Dashboard | Portfolio fetch | < 500ms |
| Migration | Initial render | < 1.5s |
| Migration | Polling interval | 2s |
| Governance | Initial render | < 1.5s |
| Governance | Tab switch | < 300ms |
| Tasks | Initial render | < 1.5s |
| Tasks | Create task | < 300ms |
| Notifications | Initial render | < 1.5s |
| Login | Initial render | < 1s |
| All | Pagination | < 500ms |
| All | Search results | < 500ms |

#### Bundle Size Targets

| Bundle | Target |
|--------|--------|
| Initial JS | < 200KB gzipped |
| Initial CSS | < 50KB gzipped |
| Total First Load | < 250KB gzipped |
| Lazy chunks | < 50KB each |

#### Implementation

- Lazy load route components with `React.lazy()` and `Suspense`
- Debounce search inputs (300ms)
- Pagination with 20 items per page
- Polling with 2s interval (configurable)
- Virtual scrolling for large lists (if needed)

---

### 4. Accessibility (Step 26)

#### WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Colour Contrast | 4.5:1 normal text, 3:1 large text |
| Keyboard Navigation | All interactive elements focusable and operable |
| Focus Order | Logical tab order matching visual layout |
| Screen Readers | ARIA labels for all interactive elements |
| Modal Focus Trapping | Tab cycles within modal when open |
| Escape Handling | Escape closes modals, dropdowns, popovers |
| Button Labels | All buttons have visible text or aria-label |
| Form Labels | All inputs have associated labels |
| Error Messages | Linked to inputs via aria-describedby |
| Loading States | aria-busy="true" on loading containers |
| Skip Link | "Skip to main content" at top of page |
| **High Contrast Mode** | **[data-contrast='high'] CSS variables, WCAG 4.5:1 override** |
| **High Contrast Mode** | **[data-contrast='high'] CSS variables, WCAG 4.5:1 override** |

#### High Contrast Variables

#### ARIA Labels

| Element | ARIA Label |
|---------|------------|
| Navigation sidebar | `aria-label="Main navigation"` |
| Loading spinner | `aria-label="Loading"` |
| Search input | `aria-label="Search"` |
| Pagination | `aria-label="Pagination"` |
| Modal | `role="dialog"`, `aria-modal="true"` |
| Toast | `role="alert"`, `aria-live="polite"` |
| Progress bar | `role="progressbar"` |
| Tab panel | `role="tabpanel"` |
| Tab button | `role="tab"`, `aria-selected` |

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Next focusable element |
| `Shift+Tab` | Previous focusable element |
| `Enter` | Activate button/link |
| `Space` | Activate button/checkbox |
| `Escape` | Close modal/dropdown |
| `Arrow keys` | Navigate within tabs/dropdowns |

#### Implementation

- Add ARIA attributes to all shared components (09A.2)
- Implement focus management in App Shell (09A.3)
- Add skip link to Layout component
- Implement modal focus trapping in Modal component
- Add keyboard event handlers to interactive elements

---

### 5. Testing

| Test Type | Scope | Tools | Coverage |
|-----------|-------|-------|----------|
| Unit Tests | Components, hooks, utilities | Vitest, React Testing Library | 80% |
| Integration Tests | Page + API interactions | Vitest, MSW | 70% |
| E2E Tests | Critical user flows | Playwright | P0 screens |
| Visual Regression | UI component snapshots | Playwright screenshot | Shared components |
| API Mock Tests | API contract validation | MSW, Vitest | All endpoints |
| Permission Tests | Role-based access | Vitest, custom helpers | All protected routes |
| Accessibility Tests | WCAG compliance | axe-core, Playwright | All pages |
| Performance Tests | Load time, bundle size | Lighthouse CI | All pages |

#### Critical E2E Flows

| Flow | Steps | Expected |
|------|-------|----------|
| Login | Enter credentials → Submit → Redirect | Dashboard loads |
| Start Migration | Click Start → Enter Project ID → Submit | Migration starts, progress updates |
| View Governance | Navigate → Click tabs → Verify data | Tabs load with real data |
| Create Task | Click Create → Fill form → Submit | Task appears in list |
| Mark Notification Read | Click Mark Read → Verify | Notification marked as read |
| Permission Denied | Login as Viewer → Access /users | Access Denied shown |

#### Implementation

- Add axe-core to test setup for accessibility testing
- Create Playwright E2E test suite
- Add MSW handlers for API mocking
- Create permission test helpers
- Add Lighthouse CI for performance testing

---

## Deliverables

> Inspect existing code first. Reuse where possible. Refactor before creating. Create only if no suitable implementation exists.

| File | Action |
|------|--------|
| `src/hooks/useStateMachine.ts` | Inspect existing state management patterns first; create if no suitable state machine exists |
| `src/components/ErrorBoundary.tsx` | Inspect existing error handling first; create if no suitable boundary exists |
| `src/utils/apiClient.ts` | Enhance with error recovery |
| `src/services/accessibility.ts` | Inspect existing accessibility support first; create if no suitable helpers exist (ARIA, focus management) |
| `tests/accessibility/` | Create accessibility test suite (no existing a11y tests) |
| `tests/e2e/` | Inspect existing E2E tests first; extend if suitable, create if none exist |
| `tests/performance/` | Create performance test suite (no existing perf tests) |

---

## Traceability

| Deliverable | Master Spec Section |
|-------------|---------------------|
| State machines | Step 20 |
| Error recovery | Step 24 |
| Performance | Step 25 |
| Accessibility | Step 26 |
| Testing | Step 27 |
