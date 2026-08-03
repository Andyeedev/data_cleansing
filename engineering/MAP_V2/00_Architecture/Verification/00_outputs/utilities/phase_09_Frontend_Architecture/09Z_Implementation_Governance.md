# 09Z — Implementation Governance

> **Governing implementation policy for Phase 09. This document is the single source of truth for all implementation rules, standards, and verification requirements.**

---

## 1. Implementation Directive – Mandatory

The supplied Phase 09A–09G architecture documents define a restoration, consolidation, and standardisation programme, not a frontend rewrite.

For every implementation task, the following rules are mandatory:

## 1A. Implementation Gate (Mandatory)

No implementation work may begin until this gate has been satisfied.

The following activities are mandatory prerequisites for every workstream:

1. Inspect the existing implementation using 10Y_Current_Platform_Inventory.md (or 09Y_Current_Application_Inventory.md for Phase 09).

2. Complete the mandatory Gap Analysis defined in this governance document.

3. Record a coverage assessment for every page, component, service, hook, API, worker, or module within scope.

4. Assign one implementation decision for every item:

- Reuse
- Refactor
- Extend
- Create

5. Justify each decision with evidence from the 
existing implementation.

6. Verify that the proposed implementation preserves:
- existing routes
- API contracts
- authentication
- RBAC
- business logic

7. Obtain approval of the Gap Analysis before any source code modifications begin.

Until all of the above steps have been completed, implementation is prohibited.

The Gap Analysis is a mandatory project deliverable and forms part of the permanent implementation record.

Any implementation performed without satisfying this gate is considered non-compliant with the Phase Architecture Governance and must be reviewed before further development continues.

8. AI coding agents must treat this Implementation Gate as a blocking precondition rather than advisory guidance. If the gate has not been satisfied, the correct action is to produce the required Gap Analysis instead of generating or modifying source code.

### 1.1 General Rules

1. Inspect the existing implementation before making any changes.
2. Compare the existing implementation against the approved architecture.
3. Reuse existing pages wherever possible.
4. Refactor existing components before creating new ones.
5. Create new components only where equivalent functionality does not already exist.
6. Preserve all existing routes.
7. Preserve all API contracts.
8. Preserve authentication.
9. Preserve RBAC and permission behaviour.
10. Preserve business logic.
11. Preserve existing page layouts wherever practical.
12. Maintain backwards compatibility throughout implementation.

### 1.2 Prohibited Actions

Do not:

- Replace working pages simply to match the architecture.
- Duplicate pages.
- Duplicate services.
- Duplicate layouts.
- Create parallel implementations of existing functionality.
- Remove existing functionality until its replacement has been fully integrated, verified, and approved.

The architecture documents describe the target platform architecture. They do not authorise replacing working implementations that already satisfy the required behaviour.

### 1.3 Component Decision Matrix (Mandatory)

Before creating any new page, component, service, hook, or layout, assess the existing implementation using the following rules:

| Existing implementation coverage | Action |
|----------------------------------|--------|
| ≥70% of required functionality | Refactor the existing implementation |
| 30–70% of required functionality | Extend the existing implementation incrementally |
| <30% of required functionality, or no equivalent exists | Create a new implementation |

Existing functionality must never be removed until the replacement has been fully integrated, tested, and verified.

If an existing implementation already satisfies both the architecture and functional requirements, no modification is required.

### 1.4 Required Workflow

For every task:

1. Inspect existing implementation.
2. Identify reusable components.
3. Produce a gap analysis against the architecture.
4. Reuse or refactor wherever possible.
5. Create only genuinely missing functionality.
6. Verify routes, APIs, authentication, RBAC, and existing behaviours remain unchanged.
7. Proceed to the next task only after validation.

### 1.5 Expected Outcome

The final result should be a single, consolidated frontend that has been progressively standardised and enhanced.

The implementation must not result in duplicated pages, duplicated components, duplicated services, or multiple implementations of the same feature.

---

## 2. Mandatory Gap Analysis

No implementation should begin until a gap analysis has been completed for the relevant scope. The gap analysis is the first deliverable for every workstream.

Reference `09Y_Current_Application_Inventory.md` for the complete list of existing assets before scoring coverage.

### 2.1 Gap Analysis Template

For each component, page, service, or hook covered by the implementation scope, produce the following table:

| Existing Component | Coverage | Action | Notes |
|--------------------|----------|--------|-------|
| `<component name>` | `<percentage or "Missing">` | Reuse / Refactor / Extend / Create | `<brief justification>` |

### 2.2 Coverage Assessment Rules

- **100%** — Existing implementation satisfies all architecture and functional requirements. **Action: Reuse.** No modification required.
- **≥70%** — Existing implementation covers most requirements with minor gaps. **Action: Refactor.** Align with architecture, fill gaps incrementally.
- **30–70%** — Existing implementation covers partial requirements. **Action: Extend.** Add missing functionality without replacing what works.
- **<30%** — Existing implementation covers minimal requirements. **Action: Create.** Build new implementation.
- **Missing** — No existing implementation found. **Action: Create.** Build new implementation.

### 2.3 Gap Analysis Rules

- Every component, page, service, and hook in the implementation scope must appear in the gap analysis.
- The gap analysis must reference actual inspection of the existing codebase, not assumptions.
- Coverage percentages must be justified with specific observations (e.g., "has search but no debounce", "missing ARIA labels").
- The gap analysis must be completed and reviewed before any code changes begin.
- If the gap analysis reveals that all existing implementations satisfy the architecture, no code changes are required for that scope.

---

## 3. Definition of Done

No task, story, or workstream is considered complete until all of the following criteria are satisfied:

### 3.1 Implementation Verification

- [ ] Existing implementation inspected before any changes
- [ ] Gap analysis completed and reviewed
- [ ] Existing functionality preserved (no regressions)
- [ ] No duplicated pages, components, or services introduced
- [ ] API contracts unchanged
- [ ] RBAC and permission behaviour preserved
- [ ] Authentication flow preserved
- [ ] All existing routes preserved
- [ ] Existing business logic preserved

### 3.2 Quality Verification

- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (where applicable)
- [ ] Permission tests verified
- [ ] Accessibility requirements met (ARIA, keyboard navigation, focus management)
- [ ] Regression tests passing
- [ ] No console errors or warnings
- [ ] Responsive design verified at all breakpoints

### 3.3 Architecture Compliance

- [ ] Implementation matches approved architecture
- [ ] Shared components used where specified
- [ ] Design tokens applied consistently
- [ ] Error handling follows platform patterns
- [ ] Loading states follow platform patterns
- [ ] Empty states follow platform patterns

---

## 4. Testing Requirements

All implementation must include the following test categories:

### 4.1 Unit Tests

- Component rendering and behaviour
- Hook functionality
- Service methods
- Utility functions
- State machine transitions
- Permission checks

### 4.2 Integration Tests

- Page-level workflows
- API client integration
- Form submission and validation
- Tab switching and navigation
- Error recovery flows

### 4.3 Permission Tests

- Role-based access control for each route
- Component-level permission visibility
- API endpoint access verification
- 401/403 error handling behaviour

### 4.4 Accessibility Tests

- ARIA attributes applied correctly
- Keyboard navigation functional
- Focus management working
- Screen reader compatibility
- Colour contrast compliance
- Skip links functional

### 4.5 Regression Tests

- Existing functionality verified unchanged
- API contracts verified
- Routes verified
- Authentication flow verified
- RBAC behaviour verified

---

## 5. Coding Standards

### 5.1 Component Standards

- Functional components with hooks
- TypeScript for all new code
- Props interfaces defined for all components
- No inline styles — use CSS variables and design tokens
- Shared components used wherever specified in architecture

### 5.2 State Management

- React hooks for local state
- Context for app-wide state (auth, feature flags)
- State machines for complex page states (Loading, Loaded, Empty, Error)
- No global state libraries unless explicitly approved

### 5.3 API Integration

- All API calls through `apiClient`
- Error handling through `errorHandler` service
- Loading states for all async operations
- Retry logic for transient failures

### 5.4 File Organization

- Pages in `src/routes/`
- Shared components in `src/components/shared/`
- Domain components in `src/components/<domain>/`
- Hooks in `src/hooks/`
- Services in `src/services/`
- Types in `src/types/`

### 5.5 Naming Conventions

- PascalCase for components and types
- camelCase for functions, hooks, and variables
- Prefix hooks with `use`
- Prefix context with the domain name
- Suffix page components with `Page`

---

## 6. Architecture Decision Records

Key architectural decisions and their rationale:

### ADR-001: React Context instead of Redux

**Decision:** Use React Context for app-wide state (auth, feature flags, tenant).

**Rationale:** The application state is predominantly server-driven with minimal client-side mutation. Context + hooks provides sufficient capability without the bundle overhead and boilerplate of Redux. State machines handle complex page states locally.

### ADR-002: Feature Flags are DB-driven

**Decision:** Feature flags stored in the database, fetched via API, not hardcoded.

**Rationale:** Enables runtime feature toggling without redeployment. Supports gradual rollouts and tenant-specific feature availability. Aligns with the metadata-driven architecture of the platform.

### ADR-003: apiClient wraps fetch

**Decision:** All HTTP requests go through a centralised `apiClient` utility.

**Rationale:** Provides consistent error handling, authentication header injection, retry logic, and request/response interceptors. Prevents scattered fetch calls with inconsistent error handling.

### ADR-004: Design Tokens instead of CSS Modules

**Decision:** Use CSS variables (design tokens) for theming, not CSS Modules.

**Rationale:** Design tokens enable runtime theme switching (dark/light mode), consistent spacing/typography/colour across all components, and are simpler to maintain than per-component CSS Module files. Aligns with the platform's metadata-driven theming approach.

### ADR-005: Co-located Tests

**Decision:** Unit and integration tests co-located with components (`*.test.tsx`, `*.integration.test.tsx`).

**Rationale:** Improves discoverability, ensures tests are updated alongside components, and supports incremental test execution during development.

---

## 7. API Contract Rules

No endpoint may change without completing the following:

### 7.1 Change Requirements

1. **Version review** — Assess impact on all consumers. Major changes require a new version prefix.
2. **OpenAPI update** — Update the OpenAPI specification before frontend implementation begins.
3. **Frontend compatibility review** — Verify all existing frontend consumers will continue to function.
4. **Regression testing** — Run full API regression test suite before merging.

### 7.2 Frontend Rules

- All API calls go through `apiClient`. Never call `fetch` directly.
- Never hardcode API endpoints. Use the configured base URL.
- Never assume response shape. Use typed interfaces from `src/types/`.
- Handle all error responses (4xx, 5xx) through `errorHandler`.
- Never modify request/response bodies outside `apiClient`.

### 7.3 Versioning

- Breaking changes require a new API version (e.g., `/api/v1/` → `/api/v2/`).
- Additive changes (new fields, new endpoints) do not require versioning.
- Deprecated endpoints must remain functional until all frontend consumers are migrated.

---

## 8. Database Compatibility Rules

The frontend is tightly coupled to the metadata-driven backend. The following rules prevent assumptions that could break deployment:

### 8.1 Frontend Implementation May NOT Assume

- New tables exist that are not in the current schema.
- New columns exist on existing tables.
- Enum values have changed or been added.
- Backend refactoring has been completed.
- Database migrations have been applied.

### 8.2 Required Verification

- All data fetching must handle empty responses gracefully.
- All data models must be typed defensively (optional fields where schema may vary).
- Feature flags gate access to features that depend on new schema elements.
- Never query tables directly. Always use the API layer.

### 8.3 Schema Change Protocol

1. Backend team implements and tests the schema change.
2. API layer is updated to expose the new schema.
3. OpenAPI specification is updated.
4. Frontend team is notified with the updated OpenAPI spec.
5. Frontend implementation begins only after the API layer is stable.

---

## 9. Performance Budgets

### 9.1 Bundle Limits

| Metric | Budget |
|--------|--------|
| Maximum bundle increase per module | +20KB |
| Maximum initial bundle size | 250KB (gzipped) |
| Maximum route-level chunk | 50KB (gzipped) |

### 9.2 Runtime Limits

| Metric | Budget |
|--------|--------|
| Maximum route load time | 1.5s |
| Maximum API latency assumption | 500ms |
| Maximum tab switch time | 300ms |
| Maximum search debounce | 300ms |
| Polling interval (where applicable) | 2s |

### 9.3 Lighthouse Targets

| Metric | Target |
|--------|--------|
| Performance | >90 |
| Accessibility | >95 |
| Best Practices | >95 |
| SEO | >90 |

### 9.4 Monitoring

- Bundle size checked in CI. PRs exceeding budget are blocked.
- Lighthouse CI run on every deployment to staging.
- Performance regressions investigated before merge to main.

---

## 10. Feature Flag Governance

Every unfinished or experimental module must comply with the following rules:

### 10.1 Mandatory Requirements

- Must be behind a feature flag.
- Must not appear in navigation when the flag is disabled.
- Must not expose routes unless explicitly permitted by the flag.
- Must not make API calls if the flag is disabled.
- Must render a safe empty state or redirect when the flag is disabled.

### 10.2 Flag Lifecycle

1. **Created** — Flag defined in the database with default `false`.
2. **Development** — Feature built behind the flag. Flag remains `false`.
3. **Testing** — Flag enabled in test environment. QA validates.
4. **Staging** — Flag enabled in staging. Full regression testing.
5. **Production** — Flag enabled for tenants/users per rollout plan.
6. **Retired** — Flag removed from code. Feature always on.

### 10.3 Code Rules

- Feature flag checks use `useFeatureFlag` hook or `FeatureFlagGuard` component.
- Never use environment variables for feature flags. Always use the database-driven system.
- Flag state must be reactive — UI updates when flag state changes.
- Navigation filtering must respect flag state in real time.

---

## 11. Rollback Strategy

### 11.1 Rollback Requirements

If a deployment fails, the rollback must preserve:

- API compatibility (all existing endpoints functional)
- Authentication (login, session, token refresh)
- Navigation (all existing routes accessible)
- Shared components (no broken imports or interfaces)
- RBAC (all permission checks functional)

### 11.2 Rollback Rules

- No partial deployments. If any module fails, roll back the entire release.
- Database migrations must be backwards-compatible. Never deploy a frontend that depends on a migration that has not been applied.
- Feature flags provide a safety net — disable the flag to hide unfinished features without rollback.
- Rollback must be completable within 5 minutes.

### 11.3 Rollback Procedure

1. Identify the failing module.
2. Disable feature flags for the failing module (if applicable).
3. If flags do not resolve, revert the deployment to the previous stable version.
4. Verify all existing functionality is restored.
5. Notify the team and create an incident ticket.

---

## 12. Migration Strategy

### 12.1 Execution Order

Implementation must follow this sequence. Each phase must be completed and validated before the next begins:

| Phase | Scope | Components | Validation |
|-------|-------|------------|------------|
| 1 | Platform Foundation | Design tokens, shared components, Shell, Layout, Navigation, Platform services | All shared components render correctly. Navigation works. Error handling functional. |
| 2 | Cross-Cutting Services | State machine, error recovery, performance, accessibility, testing | Unit tests passing. Accessibility verified. Bundle within budget. |
| 3 | Migration Execution | MigrationPage, ValidationPage, ExecutionHistoryPage | Start migration flow works. Progress polling functional. History loads. |
| 4 | Governance & Compliance | GovernancePage | All 7 tabs render. Data loads. Risk tab shows empty state (B-07). |
| 5 | Operations | OperationsPage | All 5 tabs render. Monitoring data loads. Health checks work. |
| 6 | Platform Administration | UsersPage, RolesPage, SettingsPage, TaskManagementPage, NotificationsPage | CRUD operations work. Permissions enforced. |
| 7 | Future Modules | Feature flags, ReportsPage (now functional), MappingPage stub | Feature flags gate correctly. ReportsPage displays data. Navigation filtering works. |

### 12.2 Phase Completion Criteria

Each phase must satisfy:

- [ ] Gap analysis completed for the phase scope
- [ ] All files in the phase implemented
- [ ] All tests written and passing
- [ ] No regressions in previously completed phases
- [ ] Accessibility verified
- [ ] Performance within budget
- [ ] Code review completed
- [ ] Approved by at least one reviewer

### 12.3 Dependency Enforcement

- Phase 2 depends on Phase 1 (shared components must exist).
- Phase 3 depends on Phase 2 (error recovery and state machines must exist).
- Phase 4 depends on Phase 1 (shared components must exist).
- Phase 5 depends on Phase 1 (shared components must exist).
- Phase 6 depends on Phase 1 (shared components must exist).
- Future Modules Track depends on Phase 2 (feature flag infrastructure must exist).

---

## 13. Code Review Checklist

Every PR must include verification of the following:

### 13.1 Implementation Integrity

- [ ] Existing implementation inspected before changes
- [ ] Gap analysis attached to the PR
- [ ] No duplicated components, pages, or services
- [ ] Shared components used where specified
- [ ] Design tokens applied (no hardcoded colours, spacing, typography)

### 13.2 Preservation

- [ ] API contracts unchanged
- [ ] RBAC preserved
- [ ] Authentication flow preserved
- [ ] All existing routes preserved
- [ ] Existing business logic preserved

### 13.3 Quality

- [ ] Tests added (unit, integration, or permission tests as applicable)
- [ ] Accessibility verified (ARIA, keyboard, focus)
- [ ] Feature flags respected (unfinished features behind flags)
- [ ] No console errors or warnings
- [ ] Responsive design verified

### 13.4 Architecture Compliance

- [ ] Implementation matches the approved architecture document
- [ ] File organization follows conventions
- [ ] Naming conventions followed
- [ ] Error handling follows platform patterns

---

## 14. Traceability Matrix

| Requirement | Document | Components |
|-------------|----------|------------|
| Platform Foundation | `09A_Platform_Foundation_Output.md` | Shell, Layout, DynamicNavigation, ProtectedRoute, Design Tokens, Shared Components |
| Migration Execution | `09B_Migration_Execution_Output.md` | MigrationPage, ValidationPage, ValidationResultsPage, useExecution, useExecutionHistory |
| Governance & Compliance | `09C_Governance_Compliance_Output.md` | GovernancePage |
| Operations | `09D_Operations_Output.md` | OperationsPage, useMonitoring, useHealth |
| Platform Administration | `09E_Platform_Administration_Output.md` | UsersPage, RolesPage, SettingsPage, TaskManagementPage, NotificationsPage |
| Cross-Cutting Services | `09F_Cross_Cutting_Services_Output.md` | useStateMachine, ErrorBoundary, errorHandler, accessibility, testing |
| Future Modules | `09G_Future_Modules_Output.md` | featureFlags, ReportsPage (now functional), MappingPage, FeatureFlagGuard, DynamicNavigation filtering |
| Current Inventory | `09Y_Current_Application_Inventory.md` | All existing pages, components, hooks, services, contexts, types |
| Implementation Governance | `09Z_Implementation_Governance.md` | All implementation rules, standards, and verification requirements |

---

## 15. Rule 19 — No Frontend Restoration From Old Schema

The old frontend table names are historical references only. They must NOT be used in any implementation, SQL query, repository code, or documentation going forward.

### Prohibited Table Names

| Old Table Name | Status | Must Use Instead | Authoritative Source |
|----------------|--------|------------------|---------------------|
| `engine.audit_log` | Replaced | `engine.migration_control_execution` | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab |
| `engine.approvals` | Replaced | `engine.migration_release_decision` | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab |
| `engine.exceptions` | Replaced | `engine.migration_control_exceptions` | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab |
| `engine.systems` | Replaced | `core.system_registry` | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab |
| `engine.controls` | Replaced | `engine.control_registry` | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab |
| `engine.migration_batch_lifecycle` | Does not exist | `engine.batch_execution_checkpoint` (partial) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab; `09_Cross_Reference_Index.md` → B-06 |
| `engine.migration_risk_scores` | DDL never executed | `engine.v_batch_risk_index` (proposed view) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab; `09_Cross_Reference_Index.md` → B-07 |
| `engine.unified_scores` | Invalid — no Python INSERT, no MAP CLI writer | `engine.v_batch_risk_index` (risk) / `engine.v_dataset_risk_index` (entity) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `SQL Views & Relevance` tab; `09_Risk_Score_Decision.md` → Decision 1 |
| `audit.audit_events` | Replaced | `engine.migration_control_execution` | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab |
| `platform.approval_requests` | 0 rows, no MAP CLI writer | `engine.migration_release_decision` (for release gate decisions) | `08AA_Frozen_Frontend_Gap_Analysis.xlsx` → `Backend Readiness` tab |

### Rule 19 Constraints

- ❌ **Do not** write SQL queries referencing any old table name listed above.
- ❌ **Do not** create or execute DDL for any old table name listed above.
- ❌ **Do not** reference any old table name in a repository, service, or API route that writes or reads data.
- ✅ **Do** use the authoritative replacement tables/views documented in the Phase 08 Table Inventory and the Data Lineage Report.
- ✅ **Do** verify every table reference against the frozen lineage (DL-xxx) before implementation.
- ✅ **Do** report any encounter with an old table name immediately so it can be documented as deprecated.

### Rationale

The old schema was a transitional state during earlier phases. MAP CLI now writes exclusively to the authoritative tables listed above. Restoring from the old schema would create incorrect data mappings, violate RULE 18 (every frontend feature must trace to exactly one authoritative MAP CLI table), and introduce the same table-name drift that Phase 09.1 was created to correct.

### Blocked Items Cross-Reference

All blocked items (B-06, B-07, FB-07, FB-08) and their resolutions are indexed in `09_Cross_Reference_Index.md`. This is the single entry point for finding the resolution, authoritative Excel source, and supporting Phase 09 research documents for any blocked table or view.
