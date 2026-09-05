# Phase 09QA — Quality & Governance Closure

> **Work Package ID:** 09QA
> **Status:** READY FOR EXECUTION
> **Created:** 2026-07-29
> **Baseline:** Phase 09 Baseline v1
> **Objective:** Bring Phase 09 implementation to full compliance with 09Z before any additional feature implementation.

---

## 1. Objective

Bring the Phase 09 implementation to **full compliance** with `09Z_Implementation_Governance.md` before any additional feature implementation begins.

This work package has three mandatory stages. Each stage must complete before the next begins. No new functionality, no Future Modules Track work, no source code modifications outside the defined scope.

---

## 2. Constraints

| Constraint | Rule |
|------------|------|
| New functionality | PROHIBITED |
| Future Modules Track work | PROHIBITED |
| Modifications to Phase 1–6 implementation | PROHIBITED unless regression identified |
| New files | PROHIBITED except compliance documents |
| Source code changes | LIMITED to Blocking items only (B-01, B-02) |

---

## 3. Stage 1 — Blocking

**Mandatory. Must complete before anything else.**

### B-01: Fix 22 Failing Tests

| Field | Value |
|-------|-------|
| **ID** | B-01 |
| **Priority** | BLOCKING |
| **Description** | 17 test files have "renders error state on API failure" tests that fail. Root cause: tests mock `global.fetch` to return `{ ok: false, status: 500 }`, but `apiClient.ts` retries 500 errors twice (with delays), causing test timeouts. |
| **Root Cause** | `apiClient.ts` lines 64-67: retry logic for `status >= 500`. Tests wait for retry completion which exceeds test timeout. |
| **Fix** | Change test mocks from `mockResolvedValue({ ok: false, status: 500 })` to `mockRejectedValue(new Error('HTTP 500'))`. This bypasses retry logic and propagates error immediately to hooks. |
| **Files to modify** | `src/routes/SettingsPage.test.tsx`, `src/routes/SystemsPage.test.tsx`, `src/routes/UsersPage.test.tsx`, `src/routes/RolesPage.test.tsx`, `src/routes/ApprovalsPage.test.tsx`, `src/routes/CalendarPage.test.tsx`, `src/routes/NotificationsPage.test.tsx`, `src/routes/TaskManagementPage.test.tsx`, `src/routes/TaskDetailPage.test.tsx`, `src/routes/SystemDetailPage.test.tsx`, `src/routes/WorkflowsPage.test.tsx`, `src/routes/DiscoveryPage.test.tsx`, `src/routes/ValidationPage.test.tsx`, `src/routes/MigrationPage.test.tsx`, `src/routes/ValidationResultsPage.test.tsx`, `src/routes/GovernancePage.test.tsx`, `src/routes/OperationsPage.test.tsx` |
| **Verification** | Run `npx vitest run` — all tests pass (254/254) |
| **Est. Effort** | 2–4 hours |
| **Acceptance Criteria** | 0 failing tests. `vitest run` exits with code 0. |

### B-02: Resolve 32 TypeScript Errors

| Field | Value |
|-------|-------|
| **ID** | B-02 |
| **Priority** | BLOCKING |
| **Description** | 32 TypeScript errors prevent clean `tsc --noEmit` check. All are pre-existing but must be resolved for code quality. |
| **Root Cause** | Various: unused imports, incorrect type assertions, missing type definitions, Toast export syntax. |
| **Files to modify** | `src/components/shared/Toast.tsx`, `src/components/shared/TabBar.tsx`, `src/hooks/useNotifications.ts`, `src/hooks/useStateMachine.ts`, `src/routes/ApprovalDetailPage.tsx` |
| **Verification** | Run `npx tsc -b --noEmit` — 0 errors |
| **Est. Effort** | 2–3 hours |
| **Acceptance Criteria** | 0 TypeScript errors. `tsc --noEmit` exits with code 0. |

### Stage 1 Exit Criteria

- [ ] B-01: All 254 tests passing
- [ ] B-02: 0 TypeScript errors
- [ ] Build still passes (`npx vite build` succeeds)
- [ ] No regressions in existing functionality

---

## 4. Stage 2 — Governance Compliance

**Mandatory after Stage 1. Completes all remaining 09Z Definition of Done items.**

### H-01: Complete ARIA Audit for All Refactored Pages

| Field | Value |
|-------|-------|
| **ID** | H-01 |
| **Priority** | HIGH |
| **Description** | Only ~43% of pages have full ARIA attributes. Audit all refactored pages and add missing ARIA. |
| **Scope** | GovernancePage, OperationsPage, SystemsPage, UsersPage, RolesPage, SettingsPage, TaskManagementPage, NotificationsPage, WorkflowsPage, AdministrationPage |
| **Requirements per 09Z** | role attributes, aria-label, aria-expanded, aria-selected, aria-current, aria-modal, keyboard navigation |
| **Verification** | Manual audit + axe-core tests pass for each page |
| **Est. Effort** | 4–6 hours |
| **Acceptance Criteria** | Every interactive element has appropriate ARIA attributes. axe-core reports 0 violations for each page. |

### H-02: Verify Responsive Design at All Breakpoints

| Field | Value |
|-------|-------|
| **ID** | H-02 |
| **Priority** | HIGH |
| **Description** | No responsive design verification performed. Check all refactored pages at mobile, tablet, desktop breakpoints. |
| **Breakpoints per 09A** | Mobile: 375px, Tablet: 768px, Desktop: 1280px |
| **Scope** | All 22 refactored page components |
| **Verification** | Visual inspection at each breakpoint. No layout overflow, no text truncation, no horizontal scroll. |
| **Est. Effort** | 3–4 hours |
| **Acceptance Criteria** | All pages render correctly at 375px, 768px, 1280px. No layout breaks. |

### H-03: Check Console Errors/Warnings

| Field | Value |
|-------|-------|
| **ID** | H-03 |
| **Priority** | HIGH |
| **Description** | Run application and check browser console for errors or warnings in all refactored pages. |
| **Scope** | All routes |
| **Verification** | Navigate to every route. Check browser console. No errors, no warnings. |
| **Est. Effort** | 1–2 hours |
| **Acceptance Criteria** | 0 console errors. 0 console warnings across all routes. |

### H-04: Write Permission Tests for All Routes

| Field | Value |
|-------|-------|
| **ID** | H-04 |
| **Priority** | HIGH |
| **Description** | Admin-only checks exist in pages but no dedicated permission test suite. Create tests for each route's access control. |
| **Scope** | All routes with role restrictions |
| **Test cases** | Non-admin user sees Access Denied. Admin user sees page content. Unauthenticated user redirected to login. |
| **Verification** | `npx vitest run` — permission tests pass |
| **Est. Effort** | 3–4 hours |
| **Acceptance Criteria** | Permission tests exist for every restricted route. All pass. |

### H-05: Write Service Unit Tests

| Field | Value |
|-------|-------|
| **ID** | H-05 |
| **Priority** | HIGH |
| **Description** | `errorHandler.ts` and `permissionGuard.ts` have no unit tests. |
| **Scope** | `src/services/errorHandler.ts`, `src/services/permissionGuard.ts` |
| **Test cases** | errorHandler: handle401 clears token, handle403 shows access denied, handle422 parses errors, handle429 retries. permissionGuard: hasRole, hasPermission, requireRole, requirePermission. |
| **Verification** | `npx vitest run` — service tests pass |
| **Est. Effort** | 2–3 hours |
| **Acceptance Criteria** | Unit tests for all public methods. All pass. |

### H-06: Write useStateMachine Unit Tests

| Field | Value |
|-------|-------|
| **ID** | H-06 |
| **Priority** | HIGH |
| **Description** | `useStateMachine` hook has no unit tests. |
| **Scope** | `src/hooks/useStateMachine.ts` |
| **Test cases** | Initial state, transitions, fetchData success/failure, retry, reset. |
| **Verification** | `npx vitest run` — hook tests pass |
| **Est. Effort** | 1–2 hours |
| **Acceptance Criteria** | Unit tests for all hook operations. All pass. |

### Stage 2 Exit Criteria

- [ ] H-01: ARIA audit complete, axe-core passes for all pages
- [ ] H-02: Responsive design verified at 375px, 768px, 1280px
- [ ] H-03: 0 console errors/warnings
- [ ] H-04: Permission tests for all restricted routes
- [ ] H-05: Service unit tests written and passing
- [ ] H-06: useStateMachine tests written and passing
- [ ] All 09Z Definition of Done items satisfied

---

## 5. Stage 3 — Architecture Review

**Mandatory after Stage 2. Produces final compliance report.**

### Activities

| # | Activity | Description |
|---|----------|-------------|
| 1 | Re-run Gap Analysis | Re-execute gap analysis against current implementation. Verify all coverage assessments still accurate. |
| 2 | Re-run Definition of Done | Verify every criterion in 09Z Section 3 is satisfied. |
| 3 | Re-run Architecture Compliance | Verify implementation matches 09A, 09B, 09C, 09D, 09E, 09F architecture documents. |
| 4 | Regression Verification | Run full test suite. Verify 0 failures. Verify build passes. Verify TypeScript clean. |
| 5 | Produce Final Compliance Report | Create `09_Final_Compliance_Report.md` |

### Output

`09_Final_Compliance_Report.md` — states:

```
Phase 09 Status: ✓ Fully compliant with 09Z

Ready for Future Modules Track implementation
```

### Stage 3 Exit Criteria

- [ ] Gap Analysis re-run and current
- [ ] Definition of Done fully satisfied
- [ ] Architecture Compliance verified
- [ ] Regression verification passed (0 test failures, clean build, clean type check)
- [ ] `09_Final_Compliance_Report.md` produced

---

## 6. Execution Sequence

```
Stage 1: Blocking
    │
    ├── B-01: Fix 22 failing tests
    ├── B-02: Resolve 32 TypeScript errors
    │
    ▼ [Exit Criteria Met]
    │
Stage 2: Governance Compliance
    │
    ├── H-01: ARIA audit
    ├── H-02: Responsive design verification
    ├── H-03: Console error check
    ├── H-04: Permission tests
    ├── H-05: Service unit tests
    ├── H-06: useStateMachine tests
    │
    ▼ [Exit Criteria Met]
    │
Stage 3: Architecture Review
    │
    ├── Re-run Gap Analysis
    ├── Re-run Definition of Done
    ├── Re-run Architecture Compliance
    ├── Regression Verification
    │
    ▼ [All Passed]
    │
09_Final_Compliance_Report.md
    │
    ▼
Phase 09 Complete
    │
    ▼
Future Modules Track May Begin
```

---

## 7. Effort Summary

| Stage | Items | Effort |
|-------|-------|--------|
| Stage 1 — Blocking | 2 | 4–7 hours |
| Stage 2 — Governance Compliance | 6 | 14–21 hours |
| Stage 3 — Architecture Review | 5 | 3–4 hours |
| **Total** | **13** | **21–32 hours** |

---

## 8. Deliverables

| # | Document | Stage | Status |
|---|----------|-------|--------|
| 1 | Updated test files (B-01) | Stage 1 | PENDING |
| 2 | Updated TypeScript files (B-02) | Stage 1 | PENDING |
| 3 | ARIA audit report (H-01) | Stage 2 | PENDING |
| 4 | Responsive design report (H-02) | Stage 2 | PENDING |
| 5 | Console error report (H-03) | Stage 2 | PENDING |
| 6 | Permission test files (H-04) | Stage 2 | PENDING |
| 7 | Service test files (H-05) | Stage 2 | PENDING |
| 8 | useStateMachine test files (H-06) | Stage 2 | PENDING |
| 9 | `09_Final_Compliance_Report.md` | Stage 3 | PENDING |

---

## 9. Rules

1. **No new functionality.** This work package is quality and governance only.
2. **No Future Modules Track work.** Future Modules Track begins only after `09_Final_Compliance_Report.md` is produced.
3. **No modifications to Phase 1–6 implementation** unless a regression is identified and documented.
4. **Each stage must complete before the next begins.** No skipping ahead.
5. **All exit criteria must be met** before progressing.
6. **All deliverables must be produced** before declaring Phase 09 complete.

---

## 10. Success Criteria

Phase 09QA is complete when:

- [ ] 0 failing tests
- [ ] 0 TypeScript errors
- [ ] Full ARIA coverage across all refactored pages
- [ ] Responsive design verified at all breakpoints
- [ ] 0 console errors/warnings
- [ ] Permission tests for all restricted routes
- [ ] Service unit tests written and passing
- [ ] useStateMachine tests written and passing
- [ ] Gap Analysis current
- [ ] Definition of Done fully satisfied
- [ ] Architecture Compliance verified
- [ ] `09_Final_Compliance_Report.md` produced and states "✓ Fully compliant with 09Z"

---

## 11. Relationship to Overall Flow

```
Phase 09: Implementation (Phases 1–6)  ← COMPLETE
    │
    ▼
Phase 09: Governance Closure            ← COMPLETE (retroactive)
    │
    ▼
Phase 09QA: Quality & Governance       ← THIS WORK PACKAGE
    │
    ▼
Phase 09: Final Compliance Report       ← STAGE 3 OUTPUT
    │
    ▼
Phase 09: COMPLETE
    │
    ▼
Future Modules Track: Deferred Capabilities     ← BEGINS ONLY AFTER PHASE 09 COMPLETE
    │
    ▼
Phase 10: (Next phase)
```

---

*This work package must be executed before any Future Modules Track implementation begins.*
