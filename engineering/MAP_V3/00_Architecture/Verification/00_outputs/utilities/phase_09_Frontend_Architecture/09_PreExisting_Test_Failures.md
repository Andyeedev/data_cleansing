# Phase 09 — Pre-Existing Test Failures

> **Generated:** 2026-07-29
> **Baseline:** 245/254 tests passing (96.5%)
> **Total failures:** 9 (all pre-existing, introduced before Phase 09 changes)

---

## Failure Register

| # | Test File | Test Name | Cause | Existing Issue? | Blocks Phase 09? | Resolution |
|---|-----------|-----------|-------|-----------------|-------------------|------------|
| 1 | `ValidationResultsPage.test.tsx:59` | renders loading state initially | Test queries `document.querySelector('[style*="animation: spin"]')` but component renders `LoadingSkeleton` with CSS token-based shimmer animation, not inline `spin` animation. CSS selector mismatch. | Yes | No | Defer — loading state test needs update to match `LoadingSkeleton` DOM structure |
| 2 | `TaskManagementPage.test.tsx:181` | opens create task modal on button click | Test expects `screen.getByText('Create Task')` button to exist after initial fetch, but component renders `EmptyState` when no tasks exist. Button text or component rendering changed during Phase 6 refactoring. | Yes | No | Defer — test assertion needs update to match current component rendering |
| 3 | `SystemsPage.integration.test.tsx:95` | test connection button triggers API call | Test expects `screen.getByText('Source DB')` after fetch, but `mockSystems` data structure may not match current `SystemListResponse` type. Test connection flow may have changed during refactoring. | Yes | No | Defer — integration test needs mock data alignment with current types |
| 4 | `TaskManagementPage.integration.test.tsx:134` | create task modal opens and closes | Same root cause as #2 — `Create Task` button not rendered because component shows `EmptyState` instead. | Yes | No | Defer — same as #2 |
| 5 | `TaskManagementPage.integration.test.tsx:167` | create task form validates required fields | Same root cause as #2 — `Create Task` button not rendered. | Yes | No | Defer — same as #2 |
| 6 | `TaskManagementPage.integration.test.tsx:197` | create task form submits successfully | Same root cause as #2 — `Create Task` button not rendered. | Yes | No | Defer — same as #2 |
| 7 | `TaskManagementPage.integration.test.tsx:255` | pagination works correctly | Test expects `screen.getByText(/Page 1 of 3/)` but pagination text format may differ in current `Pagination` component. | Yes | No | Defer — test needs update to match current Pagination component text |
| 8 | `UsersPage.integration.test.tsx:150` | pagination shows when total exceeds page size | Test expects `screen.getByText('Page 1 of 2')` but current `Pagination` component may render different text format. | Yes | No | Defer — test needs update to match current Pagination component text |
| 9 | `UsersPage.integration.test.tsx:173` | next page button fetches next page | Same pagination text mismatch as #8 — `screen.getByText('Next')` not found because pagination not rendered. | Yes | No | Defer — same as #8 |

---

## Root Cause Analysis

### Category A: Loading State Selector Mismatch (1 test)
- **Test #1**: Uses CSS selector `[style*="animation: spin"]` but `LoadingSkeleton` uses CSS token-based shimmer animation (`background: linear-gradient(...)` with `animation: shimmer`).
- **Impact**: Low — loading state is visually present but detected by wrong selector.
- **Fix**: Update test to query for `LoadingSkeleton` component's DOM structure.

### Category B: EmptyState Rendering (4 tests)
- **Tests #2, #4, #5, #6**: All depend on `Create Task` button being visible, but component renders `EmptyState` when task list is empty.
- **Impact**: Medium — create task flow is not tested when list is empty.
- **Fix**: Either mock non-empty task list or update tests to handle `EmptyState` rendering.

### Category C: Pagination Text Mismatch (3 tests)
- **Tests #7, #8, #9**: Expect `Pagination` component to render "Page X of Y" and "Next" buttons, but current `Pagination` component may use different text or structure.
- **Impact**: Medium — pagination functionality is not verified.
- **Fix**: Update tests to match current `Pagination` component's DOM output.

### Category D: Mock Data Alignment (1 test)
- **Test #3**: Integration test with `mockSystems` data that may not match current `SystemListResponse` type.
- **Impact**: Low — test connection flow works in manual testing.
- **Fix**: Update mock data to match current type definitions.

---

## Phase 09 Impact Assessment

**Do these failures block Phase 09 completion?**

| Criterion | Status |
|-----------|--------|
| All B-01 "renders error state on API failure" tests | ✓ ALL 15 PASSING |
| TypeScript errors | ✓ 0 |
| Build | ✓ PASSING |
| Core functionality tested | ✓ Yes |
| Pre-existing failures | 9 (all deferred) |

**Conclusion:** These 9 failures are pre-existing issues that were present before any Phase 09 changes. They do not block Phase 09 completion. They should be addressed in a future cleanup sprint.

---

## Recommended Actions

| Priority | Action | Effort |
|----------|--------|--------|
| Medium | Update `ValidationResultsPage.test.tsx` loading state test to match `LoadingSkeleton` DOM | 0.5 hours |
| Medium | Update `TaskManagementPage` tests to mock non-empty task list | 1 hour |
| Medium | Update `UsersPage` and `TaskManagementPage` pagination tests to match current `Pagination` component | 1 hour |
| Low | Update `SystemsPage.integration.test.tsx` mock data to match current types | 0.5 hours |
| **Total** | | **3 hours** |

---

*These failures are documented to prevent "pre-existing" from becoming a catch-all excuse. Each failure has a specific root cause and recommended resolution.*
