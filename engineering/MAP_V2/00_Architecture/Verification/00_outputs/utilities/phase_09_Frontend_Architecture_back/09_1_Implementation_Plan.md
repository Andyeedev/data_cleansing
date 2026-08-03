# Phase 09.1 — Implementation Plan

> **Work Package:** 09.1 Frontend Restoration & Backend Traceability Reconciliation
> **Status:** APPROVED — Governing document for Phase 09.1 implementation
> **Date:** 2026-07-29
> **Governed by:** 09Z_Implementation_Governance.md

---

## Stage 0: Pre-Implementation Setup

### 0.1 References

| # | Reference | Location | Status |
|---|-----------|----------|--------|
| 1 | Phase 09.1 Work Package | `09_1_Frontend_Restoration_and_Backend_Traceability_Reconciliation.md` | Extracted |
| 2 | 09A Platform Foundation Output | `09A_Platform_Foundation_Output.md` | Extracted |
| 3 | 09_Frontend_Restoration_Traceability_Matrix | `09_Frontend_Restoration_Traceability_Matrix.md` | Extracted |
| 4 | 09_Restoration_Plan | `09_Restoration_Plan.md` | Extracted |
| 5 | 09_Final_Compliance_Report | `09_Final_Compliance_Report.md` | Extracted |
| 6 | MAP_CLI_Frontend_Capability_Matrix (Phase 08) | `Phase_08/MAP_CLI_Frontend_Capability_Matrix.md` | Extracted |
| 7 | Phase_08_Table_Inventory | `Phase_08/Phase_08_Table_Inventory.md` | Extracted |
| 8 | 09Z_Implementation_Governance | `09Z_Implementation_Governance.md` | Extracted |
| 9 | 09Z_Gap_Analysis_and_Compliance_Audit | `09Z_Gap_Analysis_and_Compliance_Audit.md` | Extracted |
| 10 | 09Y_Current_Application_Inventory | `09Y_Current_Application_Inventory.md` | Extracted |

> **Status definitions:** Reference = document located; Loaded = file read; Verified = key data confirmed; Extracted = authoritative information extracted and recorded.

### 0.2 Frozen Frontend Scanning Setup

The authoritative frozen frontend is `MAP_V2/03_Source/frontend/` (NOT frontend-mvp).

Scan target directories:
- `MAP_V2/03_Source/frontend/src/pages/` — all pages
- `MAP_V2/03_Source/frontend/src/components/` — all components
- `MAP_V2/03_Source/frontend/src/layouts/` — layout components
- `MAP_V2/03_Source/frontend/src/widgets/` — widget components
- `MAP_V2/03_Source/frontend/src/dashboard/` — dashboard widgets
- `MAP_V2/03_Source/frontend/src/portal/` — portal/overlay components
- `MAP_V2/03_Source/frontend/src/navigation/` — navigation items
- `MAP_V2/03_Source/frontend/src/theme/` — theme system
- `MAP_V2/03_Source/frontend/src/hooks/` — hooks
- `MAP_V2/03_Source/frontend/src/context/` — contexts
- `MAP_V2/03_Source/frontend/src/services/` — services
- `MAP_V2/03_Source/frontend/package.json` — dependencies and scripts

---

### 0.3 Mandatory Implementation Constraints Going Forward

#### Rule 19 — No Frontend Restoration From Old Schema

The old frontend table names are historical references only. They must NOT be used in any implementation, SQL query, repository code, or documentation going forward.

##### Prohibited Table Names

| Old Table Name | Status | Must Use Instead |
|----------------|--------|------------------|
| `engine.audit_log` | Replaced | `engine.migration_control_execution` |
| `engine.approvals` | Replaced | `engine.migration_release_decision` |
| `engine.exceptions` | Replaced | `engine.migration_control_exceptions` |
| `engine.systems` | Replaced | `core.system_registry` |
| `engine.controls` | Replaced | `engine.control_registry` |
| `engine.migration_batch_lifecycle` | Does not exist | `engine.batch_execution_checkpoint` (partial) |
| `engine.migration_risk_scores` | DDL never executed | Authoritative view discovered via Stage 3/4 evidence |
| `engine.unified_scores` | Invalid — no Python INSERT, no MAP CLI writer | Authoritative source discovered via Stage 3/4 evidence |
| `audit.audit_events` | Replaced | `engine.migration_control_execution` |
| `platform.approval_requests` | 0 rows, no MAP CLI writer | `engine.migration_release_decision` (for release gate decisions) |

##### Rule 19 Constraints

- ❌ Do not write SQL queries referencing any old table name listed above.
- ❌ Do not create or execute DDL for any old table name listed above.
- ❌ Do not reference any old table name in a repository, service, or API route that writes or reads data.
- ✅ Do use the authoritative replacement tables/views documented in the Phase 08 Table Inventory and the Data Lineage Report.
- ✅ Do verify every table reference against the frozen lineage (DL-xxx) before implementation.
- ✅ Do report any encounter with an old table name immediately so it can be documented as deprecated.

##### Rationale

The old schema was a transitional state during earlier phases. MAP CLI now writes exclusively to the authoritative tables listed above. Restoring from the old schema would create incorrect data mappings, violate RULE 18 (every frontend feature must trace to exactly one authoritative MAP CLI table), and introduce the same table-name drift that Phase 09.1 was created to correct.

---

## Stage 1: Load Existing Architecture

| # | Document | Key Data Extracted | Purpose |
|---|----------|---------------------|---------|
| 1 | `MAP_CLI_Frontend_Capability_Matrix.md` | All 28+ capability rows with authoritative table mappings | Master reference for reconciliation |
| 2 | `Phase_08_Table_Inventory.md` | All tables actively populated by MAP CLI with row counts, last populated dates, Python INSERT traces | Authoritative table inventory |
| 3 | `Phase_08_Evidence_Package.md` | Evidence links, verification chains | Traceability backbone |
| 4 | `Phase_08_Implementation_Plan.md` | Implementation order, phases, deliverables | Execution sequencing |
| 5 | `Definition_of_Done.md` | 17 DoD criteria | Compliance verification |
| 6 | `Architecture_Decision_Record_ADR-08-001.md` | Phase 8 architecture decisions | Context for traceability |
| 7 | `Execution_Backlog.md` | Remaining work items | Gap identification |
| 8 | `Integration_Runbook.md` | Testing and validation procedures | Verification approach |
| 9 | `Authentication_Trace_Report.md` | Auth flow details | Frontend auth reconciliation |
| 10 | `OpenCode_Execution_Guide.md` | OpenCode rules and constraints | Implementation governance |

### 1.1 Phase 08 Documents Review

| # | Document | Key Data Extracted | Purpose |
|---|----------|---------------------|---------|
| 1 | MAP_CLI_Frontend_Capability_Matrix.md | All 28+ capability rows with authoritative table mappings | Master reference for reconciliation |
| 2 | Phase_08_Table_Inventory.md | All tables actively populated by MAP CLI with row counts, last populated dates, Python INSERT traces | Authoritative table inventory |
| 3 | Phase_08_Evidence_Package.md | Evidence links, verification chains | Traceability backbone |
| 4 | Phase_08_Implementation_Plan.md | Implementation order, phases, deliverables | Execution sequencing |
| 5 | Definition_of_Done.md | 17 DoD criteria | Compliance verification |
| 6 | Architecture_Decision_Record_ADR-08-001.md | Phase 8 architecture decisions | Context for traceability |
| 7 | Execution_Backlog.md | Remaining work items | Gap identification |
| 8 | Integration_Runbook.md | Testing and validation procedures | Verification approach |
| 9 | Authentication_Trace_Report.md | Auth flow details | Frontend auth reconciliation |
| 10 | OpenCode_Execution_Guide.md | OpenCode rules and constraints | Implementation governance |

### 1.2 Phase 09 Documents Review

| # | Document | Key Data Extracted | Purpose |
|---|----------|---------------------|---------|
| 1 | `09A_Platform_Foundation_Output.md` | 28 deliverables, dependency order, component specs | Foundation reference |
| 2 | `09_Frontend_Restoration_Traceability_Matrix.md` | 68 RESTORE, 3 NEEDS RESTORING, 7 ENHANCED, 5 DEPRECATED, 15+ DEFERRED | Current restoration status |
| 3 | `09_Restoration_Plan.md` | Restore/enhance/defer categorization | Implementation priorities |
| 4 | `09_Delivered_vs_Missing_Capabilities.md` | Delivered vs missing comparison | Gap analysis |
| 5 | `09_Final_Compliance_Report.md` | All governance gates passed, compliance certified | Baseline status |
| 6 | `09_PreExisting_Test_Failures.md` | 9 pre-existing failures with root causes | Test health baseline |
| 7 | `09_Remaining_Work.md` | Medium and nice-to-have items not blocking | Future work scope |
| 8 | `09Z_Gap_Analysis_and_Compliance_Audit.md` | All gaps identified and resolved | Architecture compliance |
| 9 | `09Y_Current_Application_Inventory.md` | Current application scan results | Source of truth for what exists |

### 1.3 09Z Governance Documents Review

| # | Document | Purpose |
|---|----------|---------|
| 1 | `09Z_Implementation_Governance.md` | All implementation rules, gap analysis templates, DoD, coding standards |
| 2 | `09Z_Implementation_Gate_Closure.md` | Gate closure report, all activity evidence |
| 3 | `09Z_Implementation_Governance.md` | Component decision matrix (70/30%), prohibition rules |

---

## Stage 2: Inventory & Reconciliation

### 2.1 Frozen Component Inventory

Generate a complete inventory of every component in `MAP_V2/03_Source/frontend/` before any comparison:

| Component Name | Category | Purpose | Dependencies | File Path |
|----------------|----------|---------|-------------|-----------|
| _(to be populated from scan)_ | _(pages/components/layouts/hooks/widgets/contexts/services/navigation/theme/portal/dashboard)_ | _(brief description)_ | _(imports, CSS tokens, theme)_ | _(relative path)_ |

> **Inventory rules:** Every file under `src/pages/`, `src/components/`, `src/layouts/`, `src/hooks/`, `src/context/`, `src/services/`, `src/navigation/`, `src/theme/`, `src/widgets/`, `src/portal/`, `src/dashboard/` must appear in this inventory. No component may be skipped.

### 2.2 Component Classification Matrix

After inventory is complete, each component is classified:

| Classification | Criteria | Action |
|----------------|----------|--------|
| **Restore** | Component exists in frozen but missing or incomplete in MVP; architecture compatible | Copy/adapt from frozen frontend |
| **Wrap** | Component exists in frozen but MVP uses a different architecture; wrapper adapts frozen component to MVP patterns | Wrap frozen component in MVP-compatible interface |
| **Rewrite** | Component exists in frozen but architecture has changed so fundamentally that copy is not viable | Rewrite from scratch using frozen as reference |
| **Discard** | Component uses deprecated tables or obsolete patterns; no longer valid | Remove; document reason |
| **Enhanced** | Component exists in both; MVP has better implementation | Keep MVP version; document differences |
| **Identical** | Component exists in both with equivalent implementation | Verify parity; no action needed |

### 2.3 Component-by-Component Reconciliation

#### Authentication Components (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| Login page | `pages/LoginPage.tsx` | Restore from 09A | Identical / Enhanced |
| JWT token management | `services/authService.ts` | Already in MVP | Identical |
| RoleSwitcher dropdown | `components/RoleSwitcher/RoleSwitcher.tsx` | Already in MVP | Enhanced |
| ProtectedRoute | `components/ProtectedRoute.tsx` | Already in MVP | Enhanced |
| Logout with cleanup | `context/AuthContext.tsx` | Already in MVP | Identical |

#### Theme System Components (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| CSS token design system | `theme/variables.css` | Rebuilt from 09A tokens | Wrap / Enhanced |
| Dark mode toggle | `components/ThemeToggle.tsx` | Already in MVP | Enhanced |
| Tailwind CSS integration | `tailwind.config.js` | Not used (MVP uses CSS tokens) | Rewrite (if adopting) or Discard (if keeping CSS tokens) |
| Typography scale | `theme/variables.css` | Rebuilt from 09A tokens | Restore or Wrap |
| Spacing scale | `theme/variables.css` | Rebuilt from 09A tokens | Restore or Wrap |
| Shadow scale | `theme/variables.css` | Rebuilt from 09A tokens | Restore or Wrap |
| z-index layers | `theme/variables.css` | Defined in 09A tokens | Identical |
| Accessibility utilities | `theme/variables.css` | Already in MVP | Enhanced |
| Reduced motion support | `theme/variables.css` | Already in MVP | Enhanced |
| Icon library (lucide-react) | `package.json` dependency | Not used in MVP | Restore or Discard |

#### Navigation Components (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| Dynamic sidebar tree | `navigation/DynamicNavigation.tsx` | Restored from 09A | Enhanced |
| Breadcrumb component | `components/Breadcrumb/Breadcrumb.tsx` | Already in MVP | Identical or Enhanced |
| Header with user menu | `layout/Header.tsx` | Already in MVP | Identical or Enhanced |
| Role-filtered navigation | `hooks/usePermissions.ts` | Already in MVP | Enhanced |
| Mobile responsive nav | `layout/Layout.tsx` | Already in MVP | Enhanced |

#### Dashboard Framework (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| Executive dashboard layout | `pages/DashboardPage.tsx` | Rebuilt in MVP | Wrap or Rewrite |
| Metric tiles with live data | `widgets/MetricTile.tsx` | MVP has MetricCard | Wrap or Enhanced |
| Activity feed | `widgets/ActivityFeed.tsx` | MVP has activity feed | Wrap or Rewrite (needs FIX) |
| Quick action links | `pages/DashboardPage.tsx` | Implemented in MVP | Identical |
| Role-conditional widgets | `pages/DashboardPage.tsx` | Implemented in MVP | Enhanced |

#### Charts & Widgets (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| Bar charts (recharts) | `widgets/BarChart.tsx` | Not in MVP | Restore |
| Pie/donut charts | `widgets/PieChart.tsx` | Not in MVP | Restore |
| Line charts (trends) | `widgets/LineChart.tsx` | Not in MVP | Restore |
| Area charts (cumulative) | `widgets/AreaChart.tsx` | Not in MVP | Restore |
| Chart containers with loading | `widgets/ChartContainer.tsx` | Not in MVP | Restore |
| Data grid (ag-grid) | `widgets/DataGrid.tsx` | MVP has basic DataTable | Wrap or Restore |
| Table export (CSV) | `widgets/DataGrid.tsx` | MVP has basic export | Enhanced |
| Pagination with page size | `widgets/Pagination.tsx` | MVP has basic Pagination | Wrap or Enhanced |
| Sortable columns | `widgets/DataGrid.tsx` | Not in MVP DataTable | Restore |
| Resizable columns | `widgets/DataGrid.tsx` | Not in MVP DataTable | Restore |

#### Form Library (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| react-hook-form integration | `forms/FormWrapper.tsx` | Not used in MVP | Restore |
| zod validation schemas | `schemas/validationSchemas.ts` | Custom validation in MVP | Restore or Rewrite |
| Reusable form field components | `forms/FormField.tsx` | Inline forms in pages | Restore |
| Error display patterns | `forms/FormError.tsx` | Basic inline in MVP | Restore or Wrap |
| Form dirty tracking | `hooks/useFormDirty.ts` | Not in MVP | Restore |
| Multi-step forms | `forms/MultiStepForm.tsx` | Not in MVP | Restore |

#### Portal & Overlay (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| Portal system (React portals) | `portal/Portal.tsx` | MVP uses DOM-based Modal | Wrap or Rewrite |
| Notification portal (react-toastify) | `widgets/Toast.tsx` | MVP uses custom Toast | Wrap or Rewrite |
| Confirmation dialogs | `widgets/ConfirmDialog.tsx` | MVP has ConfirmDialog | Enhanced |
| Image/preview modals | `widgets/ImageModal.tsx` | Not in MVP | Restore |
| Tooltips and popovers | `widgets/Tooltip.tsx` | Not in MVP | Restore |

#### Advanced UI (Frozen → MVP)

| Frozen Component | Frozen Location | MVP Status | Classification |
|------------------|----------------|------------|----------------|
| Autocomplete / typeahead | `widgets/Autocomplete.tsx` | Not in MVP | Restore |
| Date picker (custom) | `widgets/DatePicker.tsx` | MVP uses native `<input type="date">` | Wrap or Discard |
| File upload component | `widgets/FileUpload.tsx` | Not in MVP | Restore |
| Drag-and-drop lists | `widgets/DragDrop.tsx` | Not in MVP | Restore |
| Rich text editor | `widgets/RichTextEditor.tsx` | Not in MVP | Restore |
| Code block / syntax highlighting | `widgets/CodeBlock.tsx` | Not in MVP | Restore |
| Empty state illustration | `widgets/EmptyStateIllustration.tsx` | MVP has basic EmptyState | Enhanced |
| Skeleton loading patterns | `widgets/SkeletonLoader.tsx` | MVP has LoadingSkeleton | Enhanced |
| Error boundary with reporting | `error/ErrorBoundary.tsx` | MVP has ErrorBoundary | Enhanced |

---

## Stage 3: Static Trace

### 3.0 Purpose

Generate the initial traceability chain using source code analysis only. This stage does NOT require a running application.

### 3.1 Static Trace Chain

For each frontend UI element, trace through the static codebase:

```
UI Component (frozen frontend source)
  ↓ imports
Page/View Component
  ↓ API calls
API Endpoint (route definition)
  ↓ calls
Service Function (Python)
  ↓ calls
Repository Function
  ↓ executes
SQL Query / View Definition
  ↓ reads
Underlying Database Tables
  ↓ populated by
Python Writer (MAP CLI function or DDL seed)
```

### 3.2 Static Trace Targets

| # | UI Feature | UI Source File | API Endpoint | Static Trace Method | Status |
|---|-----------|----------------|--------------|---------------------|--------|
| 1 | Risk Score | Frozen validation report page | `GET /api/v1/execution/{batch_id}/risk-score` | Trace API route → service → repository → SQL | Pending |
| 2 | Migration Score | Frozen dashboard page | `GET /api/v1/dashboard/portfolio` | Trace API route → service → repository → SQL | Pending |
| 3 | Dashboard charts | Frozen chart widgets | Various chart APIs | Trace each chart component to API call | Pending |
| 4 | Executive dashboard metrics | Frozen dashboard page | `GET /api/v1/dashboard/portfolio` | Trace all 4 metric tiles to API calls | Pending |
| 5 | Validation widgets | Frozen validation pages | `GET /api/v1/execution/{batchId}/results` | Trace validation components to API calls | Pending |
| 6 | Governance widgets | Frozen governance pages | `GET /api/v1/governance/audit`, etc. | Trace each governance tab to API calls | Pending |

### 3.3 Static Trace Output

For each target, produce a static trace record:

```
UI Component: [component name]
  API Endpoint: [endpoint]
    Service: [file.function]
      Repository: [file.function]
        SQL/View: [view or table name]
          Source Tables: [table names, column mappings]
            Python Writer: [file.function] or "DDL seed / no writer"
```

### 3.4 Static Trace Deliverable

Produce initial trace records for all 6 target categories. These records become the input for Stage 4 runtime verification. Any path that cannot be traced statically (missing service function, unreachable repository, etc.) is flagged as "Static Only — requires Stage 4 runtime verification."

---

## Stage 4: Runtime Verification

### 4.0 Purpose

Verify the static traces against the live application where available. This stage produces evidence IDs that cross-reference the Traceability Matrix, Compliance Report, and Data Lineage Report.

### 4.1 Dual Execution Paths

#### Mode A — Running Application Available

Perform all of the following steps for each runtime view:

| Step | Action | Record |
|------|--------|--------|
| 4.1.1 | Open the UI screen in the running application | Screenshot or description of what is displayed |
| 4.1.2 | Open browser DevTools Network tab, reload the screen | API endpoints called, response payload |
| 4.1.3 | Identify the API endpoint servicing each data element | Endpoint URL, HTTP method, response JSON |
| 4.1.4 | Locate the Python service function handling that endpoint | Service file, function name, line number |
| 4.1.5 | Trace the service call to the repository layer | Repository file, function name, SQL query |
| 4.1.6 | Identify the SQL view or table queried | View/table name, DDL if view |
| 4.1.7 | Identify the underlying source tables | Table names, column mappings |
| 4.1.8 | Identify the Python code that writes data to those tables | Writer function, file, line number |
| 4.1.9 | Run a live database query to confirm current data | Row count, sample rows, last updated timestamp |

#### Mode B — Application Unavailable

Perform static code trace only (from Stage 3) and mark all verification entries as `Static Only`:

| Step | Action | Record |
|------|--------|--------|
| 4.1.10 | Review the static trace from Stage 3 | Static trace record |
| 4.1.11 | Document what cannot be verified without live app | List of unverified path segments |
| 4.1.12 | Mark all evidence IDs as "Static Only" | Evidence IDs recorded |

### 4.2 Runtime Verification Status

Each verification entry receives one of these statuses:

| Status | Meaning | Action |
|--------|---------|--------|
| **Verified** | Full chain traced and confirmed live | Evidence ID assigned, trace complete |
| **Partially Verified** | Some links confirmed, others static only | Evidence ID assigned, gaps documented |
| **Static Only** | Application unavailable; static trace only | Evidence ID assigned, marked "static only" |
| **Unable to Verify** | No data available at all | Flagged for follow-up |

### 4.3 Evidence IDs

Each verification produces an evidence identifier for cross-document traceability:

| Evidence ID | Runtime View | Stage | Status |
|-------------|-------------|-------|--------|
| DL-001 | Risk Score | 3+4 | TBD |
| DL-002 | Migration Score | 3+4 | TBD |
| DL-003 | Dashboard charts | 3+4 | TBD |
| DL-004 | Executive dashboard metrics | 3+4 | TBD |
| DL-005 | Validation widgets | 3+4 | TBD |
| DL-006 | Governance widgets | 3+4 | TBD |
| DL-007 | Activity Feed | 3+4 | TBD |
| DL-008 | Audit Log | 3+4 | TBD |
| DL-009 | Exception Requests | 3+4 | TBD |
| DL-010 | Pending Approvals | 3+4 | TBD |

> **Evidence IDs are referenced from:**
> - Traceability Matrix (`09_Frontend_Restoration_Traceability_Matrix.md`) — Runtime Evidence column
> - Compliance Report (`09_Final_Compliance_Report.md`) — Evidence column
> - Data Lineage Report (`09_2_Data_Lineage_Report.md`) — Full trace chain
> - Drift Report (`09_3_Frozen_vs_MVP_Drift_Report.md`) — Baseline correction record
> - Component Reconciliation Report (`09_4_Component_Reconciliation_Report.md`) — Component mapping
> - Any document updated in Stage 5

### 4.4 Critical Constraint

No replacement source may be documented until discovered through Stage 3 static trace and Stage 4 runtime verification evidence. This prevents future drift by ensuring every traceable mapping is backed by evidence, not assumption.

### 4.5 Lineage Freezing Rule

Once a lineage chain is verified (via Stage 3 static trace or Stage 4 runtime verification), that lineage becomes **frozen** — the authoritative reference for all downstream documents.

**Frozen lineage rules:**

1. A verified lineage chain may not be re-investigated or changed without a documented reason and new evidence ID.
2. Frozen lineage chains are referenced by Evidence ID from the Traceability Matrix, Compliance Report, Data Lineage Report, and Drift Report.
3. Any future implementation plan or traceability update that references a previously verified lineage must use the frozen Evidence ID, not re-derive the chain.
4. This prevents rediscovery of the same information in later phases and maintains a single source of truth.

**Example — frozen lineage DL-001:**

```
Dashboard → GET /api/v1/dashboard/portfolio → dashboard_service.py → dashboard_repository.py → core.system_registry → system_repository.py:insert
```

This chain, once verified and assigned DL-001, becomes the authoritative trace for all subsequent documents. It is not re-derived in the Data Lineage Report, Compliance Report, or Drift Report — it is referenced by DL-001.



## Stage 5: Documentation Update

### 5.0 Precondition

No document may be updated until the corresponding evidence ID is generated in Stage 4. Static traces (Mode B) are permitted with a `Static Only` notation.

### 5.1 Update All Documents Referencing Incorrect Mappings

Each document update includes Change Reason, Evidence ID, Reviewer, and Date for audit trail:

| # | Document | Current Reference | Correct Source | Change Reason | Evidence ID | Reviewer | Date |
|---|----------|-------------------|----------------|---------------|-------------|----------|------|
| 1 | `09_Frontend_Restoration_Traceability_Matrix.md` | `engine.unified_scores` (58 rows) | TBD from Stage 3/4 | Source changed during Phase 08; must be rediscovered via runtime evidence | DL-001, DL-002, DL-003 | TBD | TBD |
| 2 | `09_Restoration_Plan.md` | `engine.unified_scores` | TBD | Same as above | DL-001, DL-002 | TBD | TBD |
| 3 | `09_Delivered_vs_Missing_Capabilities.md` | `engine.unified_scores` | TBD | Same as above | DL-001, DL-002 | TBD | TBD |
| 4 | `09_Final_Compliance_Report.md` | Risk score data source | TBD | Same as above | DL-001 | TBD | TBD |
| 5 | `09QA_Work_Package.md` | `engine.unified_scores` | TBD | Same as above | DL-001, DL-002 | TBD | TBD |
| 6 | `09_Remaining_Work.md` | `engine.unified_scores` | TBD | Same as above | DL-001 | TBD | TBD |
| 7 | `09Z_Gap_Analysis_and_Compliance_Audit.md` | `engine.unified_scores` | TBD | Same as above | DL-001 | TBD | TBD |
| 8 | `09_Frontend_Restoration_Dashboard.xlsx` | `engine.unified_scores` | TBD | Same as above | DL-001, DL-002 | TBD | TBD |
| 9 | `MAP_CLI_Frontend_Capability_Matrix.md` (Phase 08) | `engine.unified_scores` | TBD | Source changed during Phase 08 | DL-001, DL-002 | TBD | TBD |
| 10 | `Phase_08_Table_Inventory.md` | `engine.unified_scores` | TBD | Same as above | DL-001, DL-002 | TBD | TBD |
| 11 | `09_PreExisting_Test_Failures.md` | Risk score test references | TBD | Same as above | DL-001 | TBD | TBD |

### 5.2 Additional Document Updates (Dashboard Charts, Validation Widgets, Governance Widgets)

| # | Document | Change Reason | Evidence ID | Reviewer | Date |
|---|----------|---------------|-------------|----------|------|
| 12 | `09_Frontend_Restoration_Traceability_Matrix.md` | Dashboard chart source traces | DL-003 | TBD | TBD |
| 13 | `09_Frontend_Restoration_Traceability_Matrix.md` | Validation widget source traces | DL-004, DL-005 | TBD | TBD |
| 14 | `09_Frontend_Restoration_Traceability_Matrix.md` | Governance widget source traces | DL-006 | TBD | TBD |
| 15 | `09_Frontend_Restoration_Traceability_Matrix.md` | Activity feed trace (verified: `engine.migration_control_execution`) | DL-007 | TBD | TBD |
| 16 | `09_Frontend_Restoration_Traceability_Matrix.md` | Audit log trace (verified: `engine.migration_control_execution`) | DL-008 | TBD | TBD |
| 17 | `09_Frontend_Restoration_Traceability_Matrix.md` | Exception requests trace (verified: `engine.migration_control_exceptions`) | DL-009 | TBD | TBD |
| 18 | `09_Frontend_Restoration_Traceability_Matrix.md` | Pending approvals trace (verified: `engine.migration_release_decision`) | DL-010 | TBD | TBD |

---

## Stage 6: Deliverables

### 6.1 Summary of Incorrect Mappings Found

Produce a table of all incorrect mappings discovered during reconciliation.

### 6.2 Summary of Corrected Backend Sources

| Frontend Feature | Old Source | Correct Source | View Name | Source Tables | MAP CLI Writer | API Path | Evidence ID | Status |
|------------------|------------|----------------|-----------|---------------|----------------|----------|-------------|--------|
| Risk Score (3 locations) | `engine.unified_scores` | TBD from Stage 3/4 | TBD | TBD | TBD | `GET /api/v1/execution/{batch_id}/risk-score` | DL-001 | Pending verification |
| Migration Score | TBD | TBD from Stage 3/4 | TBD | TBD | TBD | `GET /api/v1/dashboard/portfolio` | DL-002 | Pending verification |
| Dashboard charts | TBD | TBD from Stage 3/4 | TBD | TBD | TBD | Various chart APIs | DL-003 | Pending verification |
| Executive dashboard metrics | TBD | TBD from Stage 3/4 | TBD | TBD | TBD | `GET /api/v1/dashboard/portfolio` | DL-004 | Pending verification |
| Validation widgets | TBD | TBD from Stage 3/4 | TBD | TBD | TBD | `GET /api/v1/execution/{batchId}/results` | DL-005 | Pending verification |
| Governance widgets | TBD | TBD from Stage 3/4 | TBD | TBD | TBD | Various governance APIs | DL-006 | Pending verification |
| Activity Feed | `engine.audit_log` / `audit.audit_events` | `engine.migration_control_execution` | N/A (direct table) | `engine.migration_control_execution` | `rule_executor.py:_log_rule_execution` | `GET /api/v1/dashboard/activity` | DL-007 | FIXED in Phase 08 |
| Audit Log | `engine.audit_log` | `engine.migration_control_execution` | N/A (direct table) | `engine.migration_control_execution` | `rule_executor.py:_log_rule_execution` | `GET /api/v1/governance/audit` | DL-008 | FIXED in Phase 08 |
| Exception Requests | `engine.exceptions` | `engine.migration_control_exceptions` | N/A (direct table) | `engine.migration_control_exceptions` | `rule_executor.py:_log_exception` | `GET /api/v1/governance/exceptions` | DL-009 | FIXED in Phase 08 |
| Pending Approvals | `engine.approvals` | `engine.migration_release_decision` | N/A (direct table) | `engine.migration_release_decision` | `execution_engine.py:_enforce_release_gate` | `GET /api/v1/governance/approvals` | DL-010 | VERIFIED (Phase 08) |
| Lifecycle Events | `engine.migration_batch_lifecycle` | `engine.batch_execution_checkpoint` (partial) | N/A (direct table) | `engine.batch_execution_checkpoint` | `execution_engine.py:_save_checkpoint` | `GET /api/v1/execution/{batch_id}/lifecycle` | DL-005 (PARTIAL) | PARTIAL — Phase 08 |

### 6.3 Updated Views/Tables

| View/Table | Status | Notes | Evidence ID |
|------------|--------|-------|-------------|
| `engine.unified_scores` | DEPRECATED | 58 stale rows, no Python INSERT, no MAP CLI writer. Replaced by correct view (TBD after Stage 3/4). | DL-001 |
| `engine.migration_control_execution` | ACTIVE | 7,267 rows, populated by `rule_executor.py:_log_rule_execution` | DL-007 |
| `engine.migration_control_exceptions` | ACTIVE | 2,482 rows, populated by `rule_executor.py:_log_exception` | DL-009 |
| `engine.migration_release_decision` | ACTIVE | 13 rows, populated by `execution_engine.py:_enforce_release_gate` | DL-010 |
| `engine.batch_execution_checkpoint` | ACTIVE | 436 rows, populated by `execution_engine.py:_save_checkpoint` | DL-005 (PARTIAL) |
| `engine.migration_control_summary` | ACTIVE | 3,625 rows, populated by `rule_executor.py:_log_control_summary` | DL-006 |
| `core.system_registry` | ACTIVE | 3 rows, populated by `system_repository.py:insert` | DL-002 |
| `engine.control_registry` | ACTIVE | 10 rows, seeded by SQL DDL | DL-002 |
| `engine.migration_batch_registry` | ACTIVE | 543 rows, populated by `execution_engine.py:_register_batch` | DL-002, DL-004 |
| Risk Score view (TBD) | PENDING VERIFICATION | Name and definition TBD after Stage 3/4 | DL-001 |
| Migration Score view/table (TBD) | PENDING VERIFICATION | TBD after Stage 3/4 | DL-002 |
| Dashboard chart view (TBD) | PENDING VERIFICATION | TBD after Stage 3/4 | DL-003 |
| Validation widget view (TBD) | PENDING VERIFICATION | TBD after Stage 3/4 | DL-005 |
| Governance widget views (TBD) | PENDING VERIFICATION | TBD after Stage 3/4 | DL-006 |

### 6.4 Documents Modified (Audit Trail)

| # | Document | Modification Type | Change Reason | Evidence ID | Reviewer | Date |
|---|----------|-------------------|---------------|-------------|----------|------|
| 1 | `09_Frontend_Restoration_Traceability_Matrix.md` | Update Risk Score/Migration Score/chart/widget rows | Source changed during Phase 08 | DL-001 through DL-006 | TBD | TBD |
| 2 | `09_Restoration_Plan.md` | Update `engine.unified_scores` references | Same | DL-001, DL-002 | TBD | TBD |
| 3 | `09_Delivered_vs_Missing_Capabilities.md` | Update risk score and migration score sections | Same | DL-001, DL-002 | TBD | TBD |
| 4 | `09_Final_Compliance_Report.md` | Update risk score data source references | Same | DL-001 | TBD | TBD |
| 5 | `09QA_Work_Package.md` | Update risk score investigation section | Same | DL-001 | TBD | TBD |
| 6 | `09_Remaining_Work.md` | Update any risk score block references | Same | DL-001 | TBD | TBD |
| 7 | `09Z_Gap_Analysis_and_Compliance_Audit.md` | Update risk score and migration score gaps | Same | DL-001 | TBD | TBD |
| 8 | `09_Frontend_Restoration_Dashboard.xlsx` | Update Traceability Matrix sheet | Same | DL-001 through DL-006 | TBD | TBD |
| 9 | `MAP_CLI_Frontend_Capability_Matrix.md` (Phase 08) | Update risk score and migration score rows | Same | DL-001, DL-002 | TBD | TBD |
| 10 | `Phase_08_Table_Inventory.md` | Update risk score and migration score rows | Same | DL-001, DL-002 | TBD | TBD |
| 11 | `09_PreExisting_Test_Failures.md` | Update any risk score test references for correct source | Same | DL-001 | TBD | TBD |

### 6.5 New Deliverables

#### Deliverable 1: Data Lineage Report (`09_2_Data_Lineage_Report.md`)

Permanent architecture documentation showing every screen → API → SQL → View → Tables chain, verified against the live application where available, static trace where unavailable. Each entry includes its Evidence ID for cross-document traceability.

Structure:

```
# Phase 09.2 — Data Lineage Report

## 1. Dashboard Screens

### 1.1 Portfolio Summary
- UI: DashboardPage.tsx → MetricCard components
- API: GET /api/v1/dashboard/portfolio
- Service: dashboard_service.py
- Repository: dashboard_repository.py
- SQL/View: core.system_registry, engine.control_registry, engine.migration_batch_registry
- Source Tables: core.system_registry (3 rows), engine.control_registry (10 rows), engine.migration_batch_registry (543 rows)
- MAP CLI Writer: system_repository.py:insert, execution_engine.py:_register_batch, SQL DDL seed
- Evidence ID: DL-002
- Verification: Static Only / Verified / Partially Verified

### 1.2 Executive Dashboard
... (each dashboard widget with its own Evidence ID)

## 2. Validation Report Screens
... (each validation widget with its own Evidence ID)

## 3. Governance Screens
... (each governance widget with its own Evidence ID)

## 4. Risk Score Screen
... (risk score trace chain with Evidence ID DL-001)

## 5. Migration Score Tile
... (migration score trace chain with Evidence ID DL-002)

## 6. Dashboard Charts
... (each chart widget trace chain with its own Evidence ID)

## 7. Summary Matrix
| Screen | API | Service | Repository | SQL/View | Source Tables | MAP CLI Writer | Evidence ID | Verification Status |
```

#### Deliverable 2: Frozen vs MVP Drift Report (`09_3_Frozen_vs_MVP_Drift_Report.md`)

Clean record of the baseline correction, listing missing features, improved features, deprecated features, and incorrect assumptions from previous Phase 09.

Structure:

```
# Phase 09.3 — Frozen vs MVP Drift Report

## 1. Baseline Correction Record

### Previous Assumption (Incorrect)
- Frozen frontend reference: `frontend-mvp/` (assumed to be the enterprise source)
- Reality: `frontend-mvp/` is the Phase 09 restoration target, not the frozen source
- `frontend/` is the authoritative frozen enterprise application

### Correct Baseline (Current)
- Frozen frontend reference: `MAP_V2/03_Source/frontend/`
- This is a fully functional enterprise application with login, JWT auth, dashboard, portal framework, navigation, theme system, widgets, governance, administration
- `frontend-mvp/` is the Phase 09 restoration target built from scratch per 09A/09Z specs

---

## 2. Missing Features (In Frozen but Not in MVP)

| Feature | Frozen Location | MVP Status | Classification | Evidence ID | Notes |
|---------|-----------------|------------|----------------|-------------|-------|
| _(to be populated from Stage 2)_ | | | Restore/Wrap/Rewrite/Discard | | |

## 3. Improved Features (MVP Exceeds Frozen)

| Feature | Frozen State | MVP State | MVP Improvement | Evidence ID |
|---------|-------------|-----------|-----------------|-------------|
| Accessibility | Basic ARIA | Full audit — 90% ARIA, focus trap, keyboard nav | Per 09A/H-01 | DL-010 |
| Testing | None | 301 tests + MSW + axe-core + permission tests | Per 09QA | DL-010 |
| Code architecture | Inline styles, no structure | CSS tokens, shared components, state machines | Per 09Z/09A | DL-010 |
| Error handling | Silent try/except | Centralized errorHandler with retry, standardized format | Per 09F | DL-010 |
| CSS architecture | Tailwind utility classes | Design token system with variables.css | Per 09A | DL-010 |
| State management | Ad hoc | useStateMachine hooks for all async operations | Per 09F | DL-010 |
| API layer | Raw fetch + axios | apiClient with retry, token injection, 429/500 handling | Per 09F | DL-010 |
| Permission guarding | Basic | Full RBAC with permissionGuard + 45 route tests | Per 09QA/H-04 | DL-010 |
| Error boundary | None | ErrorBoundary with standardized error format | Per 09A | DL-010 |

## 4. Deprecated Features (In Frozen but Deprecated in MVP)

| Component | Reason | Evidence ID |
|-----------|--------|-------------|
| `engine.systems`, `engine.controls`, `engine.audit_log`, `engine.approvals`, `engine.exceptions` | Legacy table names — replaced by authoritative MAP CLI tables | DL-007 through DL-010 |
| `engine.migration_batch_lifecycle` | Does not exist — no DDL or Python INSERT | DL-005 |
| `engine.migration_risk_scores` | DDL exists but never executed — no Python INSERT | DL-001 |
| `engine.unified_scores` | No Python INSERT, no MAP CLI writer, 58 stale rows — replaced by correct view (TBD) | DL-001 |

## 5. Incorrect Assumptions from Previous Phase 09

| # | Assumption | Reality | Impact | Evidence ID |
|---|------------|---------|--------|-------------|
| 1 | `frontend-mvp/` was the frozen reference | `frontend/` is the authoritative frozen enterprise source | All capability comparisons were against the wrong baseline | DL-001 |
| 2 | `engine.unified_scores` was the valid source for risk scores | Replaced during Phase 08 by a database view | Risk Score tab shows stale/empty data | DL-001 |
| 3 | `engine.unified_scores` was also the source for Migration Score | Same issue — source changed during Phase 08 | Migration Score may also show incorrect/stale data | DL-002 |
| 4 | Dashboard charts had no data source | Charts exist in frozen but data source chain was unverified | Charts may rely on the same invalid source | DL-003 |
| 5 | Validation widgets had correct data source | Chain was unverified | May reference invalid source | DL-005 |
| 6 | Governance widgets had correct data source | Activity feed, audit log, exceptions had incorrect mappings | NEEDS FIX per Phase 08 | DL-006 through DL-010 |
| 7 | `engine.migration_batch_lifecycle` existed for lifecycle events | Does not exist; replaced by `engine.batch_execution_checkpoint` (partial) | Lifecycle events are partial per Phase 08 | DL-005 |

## 6. Recommendations

1. **Correct all `engine.unified_scores` references** across all Phase 09 documents — the source changed during Phase 08 and must be rediscovered via Stage 3/4 evidence.
2. **Apply the Activity Feed FIX** from Phase 08 evidence package — verify it is in the current codebase.
3. **Synchronize all documents** once correct sources are identified via Stage 4 runtime evidence (or Stage 3 static trace).
4. **Map CLI gap for risk scores** — if the correct view has no MAP CLI writer, this is a MAP CLI gap that requires adding a writer to the MAP CLI backend.
5. **Deprecate `engine.unified_scores`** in all documentation and remove from schema if no longer served by any API endpoint.
6. **Frontend restoration 80% direct restore** — 68 of 85+ frozen components can be restored directly; 3 need adaptation; 7 areas are enhanced in MVP; 15+ deferred pending MAP CLI capabilities.

#### Deliverable 3: Component Reconciliation Report (`09_4_Component_Reconciliation_Report.md`)

Definitive mapping of every frozen component to its MVP counterpart with decision and evidence.

```
# Phase 09.4 — Component Reconciliation Report

## Frozen Component → MVP Component Mapping

| Frozen Component | Frozen File | MVP Component | MVP File | Decision | Evidence ID | Implementation Status |
|------------------|-------------|---------------|----------|----------|-------------|----------------------|
| _(per component from Stage 2)_ | | | | Restore/Wrap/Rewrite/Discard/Enhanced/Identical | DL-0XX | Not Started / In Progress / Complete |
```

This report becomes the permanent record of how every frozen frontend component was handled in the MVP restoration.

---

## Implementation Guidance

The implementation team should follow the stages in the order defined below. No stage may be skipped or reordered without documented approval.

1. **Stage 2 � Generate the Frozen Component Inventory.** Produce a complete inventory of every component in MAP_V2/03_Source/frontend/ with Component Name, Purpose, Dependencies, and File Path before any comparison begins.
2. **Stage 3 � Perform Static Trace Analysis.** Trace every UI element through the static codebase (UI ? API ? Service ? Repository ? SQL ? Tables ? Writer) without requiring a running application.
3. **Stage 4 � Perform Runtime Verification where possible.** Where a running application is available, verify the static traces against live data and assign Evidence IDs. Where unavailable, mark entries as Static Only and proceed.
4. **Stage 5 � Update Backend Traceability only after evidence is collected.** No backend trace update may be made without a corresponding Evidence ID from Stage 3 or 4.
5. **Stage 5 � Update Documentation.** Update all documents with Change Reason, Evidence ID, Reviewer, and Date.
6. **Stage 6 � Produce the three new reports with evidence references.** Produce  9_2_Data_Lineage_Report.md,  9_3_Frozen_vs_MVP_Drift_Report.md, and  9_4_Component_Reconciliation_Report.md referencing Evidence IDs from Stage 4.
7. **Only then begin frontend restoration or backend modifications** that depend on the verified findings. No implementation work may begin until the relevant Evidence IDs are generated and the corresponding lineage chains are frozen.

## Approval Required

| # | Item | Approved? |
|---|------|-----------|
| 1 | Implementation plan scope | ☐ |
| 2 | Stage 0: References extracted | ☐ |
| 3 | Stage 1: Architecture documents loaded and extracted | ☐ |
| 4 | Stage 2: Frozen Component Inventory generated and reconciliation complete | ☐ |
| 5 | Stage 3: Static Trace completed for all 6 view categories | ☐ |
| 6 | Stage 4: Runtime Verification completed (Mode A or Mode B) with all Evidence IDs assigned | ☐ |
| 7 | Stage 5: All 11 documents updated with Change Reason, Evidence ID, Reviewer, Date | ☐ |
| 8 | Stage 6: All deliverables produced (09_2_Data_Lineage_Report.md, 09_3_Frozen_vs_MVP_Drift_Report.md, 09_4_Component_Reconciliation_Report.md) | ☐ |

**No code changes will be made until this plan is approved.**

---

*This plan is governed by `09Z_Implementation_Governance.md`. All rules apply. Gap analysis must be completed before implementation begins. Definition of Done must be met for each stage. No replacement source may be documented until discovered through Stage 3/4 evidence.*