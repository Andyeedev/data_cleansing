# Phase 11 – Validation Platform Integration

## Work Breakdown Structure (WBS)

**Status:** Approved — Scope Frozen  
**Date:** 2026-08-06  
**Baseline:** 11_0_Scope_Document.md (Frozen)

---

## Task Overview

| Task | Description | Effort | Dependency | Deliverable |
|------|-------------|--------|------------|-------------|
| 11.1 | Backend Assessment (Rules) | Low | None | 11_1_Closure_Report.md |
| 11.2 | Backend Assessment (Controls) | Low | None | 11_2_Closure_Report.md |
| 11.3 | Backend Assessment (Rule Discovery) | Low | None | 11_3_Closure_Report.md |
| 11.4 | Rules Integration (Backend + Frontend) | Medium | 11.1 | 11_4_Closure_Report.md |
| 11.5 | Controls UI (3 Design Options) | Medium | 11.2 | 11_5_Closure_Report.md |
| 11.6 | Controls Implementation | Medium | 11.5 (Approved) | 11_6_Closure_Report.md |
| 11.7 | Rule Discovery Integration (Backend + Frontend) | Medium | 11.3 | 11_7_Closure_Report.md |
| 11.8 | End-to-End Validation & Closure | High | 11.4, 11.6, 11.7 | 11_8_Closure_Report.md |

---

## Task Definitions

### 11.1 – Backend Assessment (Rules)

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Determine which Rules API endpoints already exist, which are partial, and which are absent.

**Deliverable Only (No Code Changes):**
- Existing APIs
- Missing APIs
- Proposed minimum changes

Any proposed changes must include the exact files, routes, services, hooks, components, and database objects that will be modified. No new artifacts may be created unless the assessment demonstrates they do not already exist.

**Gate Process:**
1. Assess current implementation — Search backend for `/api/v1/validation/rules` endpoints
2. Compare against approved scope — Check if listing, detail, toggle APIs exist
3. Propose minimum changes — Document only missing endpoints
4. Wait for approval — No implementation without approval
5. Produce closure report — 11_1_Closure_Report.md

**Assessment Checklist:**
- [ ] `GET /api/v1/validation/rules` — Rule listing
- [ ] `GET /api/v1/validation/rules/{rule_id}` — Rule detail
- [ ] `POST /api/v1/validation/rules/{rule_id}/toggle` — Enable/disable
- [ ] `GET /api/v1/validation/rules/registry` — Full registry view

**Exit Criteria:**
- Closure report documents: existing endpoints, missing endpoints, proposed changes
- No code changes made

---

### 11.2 – Backend Assessment (Controls)

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Determine which Controls API endpoints already exist, which are partial, and which are absent.

**Deliverable Only (No Code Changes):**
- Existing APIs
- Missing APIs
- Proposed minimum changes

Any proposed changes must include the exact files, routes, services, hooks, components, and database objects that will be modified. No new artifacts may be created unless the assessment demonstrates they do not already exist.

**Gate Process:**
1. Assess current implementation — Search backend for `/api/v1/validation/controls` endpoints
2. Compare against approved scope — Check if listing, detail, toggle APIs exist
3. Propose minimum changes — Document only missing endpoints
4. Wait for approval — No implementation without approval
5. Produce closure report — 11_2_Closure_Report.md

**Assessment Checklist:**
- [ ] `GET /api/v1/validation/controls` — Control listing
- [ ] `GET /api/v1/validation/controls/{control_id}` — Control detail
- [ ] `POST /api/v1/validation/controls/{control_id}/toggle` — Enable/disable
- [ ] `GET /api/v1/validation/controls/registry` — Full registry view

**Exit Criteria:**
- Closure report documents: existing endpoints, missing endpoints, proposed changes
- No code changes made

---

### 11.3 – Backend Assessment (Rule Discovery)

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Determine which Rule Discovery API endpoints already exist, which are partial, and which are absent.

**Deliverable Only (No Code Changes):**
- Existing APIs
- Missing APIs
- Proposed minimum changes

Any proposed changes must include the exact files, routes, services, hooks, components, and database objects that will be modified. No new artifacts may be created unless the assessment demonstrates they do not already exist.

**Gate Process:**
1. Assess current implementation — Search backend for `/api/v1/validation/rule-discovery` endpoints
2. Compare against approved scope — Check if trigger, results, status APIs exist
3. Propose minimum changes — Document only missing endpoints
4. Wait for approval — No implementation without approval
5. Produce closure report — 11_3_Closure_Report.md

**Assessment Checklist:**
- [ ] `POST /api/v1/validation/rule-discovery` — Trigger discovery
- [ ] `GET /api/v1/validation/rule-discovery/{project_id}` — Get results
- [ ] `GET /api/v1/validation/rule-discovery/{project_id}/status` — Check status
- [ ] `GET /api/v1/validation/rule-discovery/{project_id}/mappings` — View mappings

**Exit Criteria:**
- Closure report documents: existing endpoints, missing endpoints, proposed changes
- No code changes made

---

### 11.4 – Rules Integration (Backend + Frontend)

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Build the Rules page at `/validation/rules` reusing Migration → Mappings patterns. Implement any missing backend APIs identified in 11.1.

**Gate Process:**
1. Assess current implementation — Review Migration → Mappings page components and 11.1 findings
2. Compare against approved scope — Confirm reuse patterns
3. Propose minimum changes — Document new components/hooks/backend endpoints needed
4. Wait for approval — No implementation without approval
5. Implement — Build Rules page and any missing backend APIs
6. Verify — Test rendering, data flow, error handling
7. Produce closure report — 11_4_Closure_Report.md

**Reuse Sources:**
- `MigrationMappingsPage.tsx` — Table layout, sorting, filtering
- `useMappings.ts` — Data fetching hooks
- `StatusBadge`, `MetricCard`, `SearchBar` — Shared components

**New Components Required:**
- `ValidationRulesPage.tsx` — Main page component
- `useValidationRules.ts` — Hook for Rules API
- Route definition in `AppRoutes.tsx`
- Backend API endpoints (only those identified as missing in 11.1)

**Exit Criteria:**
- Page renders at `/validation/rules`
- Rule listing displays with status, severity, enabled flag
- Enable/disable toggle functional
- Closure report documents: components created, patterns reused, backend APIs added/extended, tests passed

---

### 11.5 – Controls UI (3 Design Options)

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Produce 3 design recommendations for the Controls page. No implementation.

**Gate Process:**
1. Assess current implementation — Review Migration design system
2. Compare against approved scope — Confirm design system patterns
3. Propose minimum changes — Create 3 HTML mockups
4. Wait for approval — No implementation without approval
5. Verify — Visual review of mockups
6. Produce closure report — 11_5_Closure_Report.md

**Design Requirements:**
- Option A: Table-based (reuse Execution History pattern)
- Option B: Card-based (reuse Migration Timeline pattern)
- Option C: Visual progress (reuse Validation Dashboard pattern)

**Exit Criteria:**
- 3 HTML mockups created and reviewable
- Each option shows: control listing, status, severity, enable/disable
- Closure report documents: design options, recommendations, approval status

---

### 11.6 – Controls Implementation

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Implement the approved Controls page design. Implement any missing backend APIs identified in 11.2.

**Prerequisite:** 11.5 completed and design approved.

**Gate Process:**
1. Assess current implementation — Review approved design from 11.5 and 11.2 findings
2. Compare against approved scope — Confirm implementation matches design
3. Propose minimum changes — Document components to build
4. Wait for approval — No implementation without approval
5. Implement — Build Controls page and any missing backend APIs
6. Verify — Test rendering, data flow, error handling
7. Produce closure report — 11_6_Closure_Report.md

**Reuse Sources:**
- Approved design from 11.5
- Migration → Mappings patterns (if table-based)
- Migration → Timeline patterns (if card-based)
- Validation → Dashboard patterns (if visual progress)
- Backend API endpoints (only those identified as missing in 11.2)

**Exit Criteria:**
- Page renders at `/validation/controls`
- Control listing displays with status, severity, enabled flag
- Enable/disable toggle functional
- Closure report documents: components created, patterns reused, backend APIs added/extended, tests passed

---

### 11.7 – Rule Discovery Integration (Backend + Frontend)

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Build the Rule Discovery page at `/validation/rule-discovery` reusing Migration → Discovery patterns. Implement any missing backend APIs identified in 11.3.

**Gate Process:**
1. Assess current implementation — Review Migration → Discovery page components and 11.3 findings
2. Compare against approved scope — Confirm reuse patterns
3. Propose minimum changes — Document new components/hooks/backend endpoints needed
4. Wait for approval — No implementation without approval
5. Implement — Build Rule Discovery page and any missing backend APIs
6. Verify — Test rendering, data flow, error handling
7. Produce closure report — 11_7_Closure_Report.md

**Reuse Sources:**
- `MigrationDiscoveryPage.tsx` — Tree view, table layout
- `useDiscovery.ts` — Data fetching hooks
- `StatusBadge`, `MetricCard`, `SearchBar` — Shared components

**New Components Required:**
- `ValidationRuleDiscoveryPage.tsx` — Main page component
- `useValidationRuleDiscovery.ts` — Hook for Rule Discovery API
- Route definition in `AppRoutes.tsx`
- Backend API endpoints (only those identified as missing in 11.3)

**Exit Criteria:**
- Page renders at `/validation/rule-discovery`
- Rule discovery results display with inferred rules, mappings
- Trigger discovery button functional
- Closure report documents: components created, patterns reused, backend APIs added/extended, tests passed

---

### 11.8 – End-to-End Validation & Closure

> **Stop Gate:** If a full or partial implementation already exists, implementation must stop until it has been evaluated for reuse. Existing code must be extended rather than replaced wherever practical. Duplication is prohibited unless explicitly approved.

**Objective:** Verify all Phase 11 deliverables work together and produce final closure.

**Gate Process:**
1. Assess current implementation — Review all closure reports (11.1-11.7)
2. Compare against approved scope — Confirm all tasks completed
3. Propose minimum changes — Document any remaining gaps
4. Wait for approval — No implementation without approval
5. Implement — Fix any issues found
6. Verify — Full integration test
7. Produce closure report — 11_8_Closure_Report.md

**Verification Checklist:**
- [ ] Rules page functional at `/validation/rules`
- [ ] Controls page functional at `/validation/controls`
- [ ] Rule Discovery page functional at `/validation/rule-discovery`
- [ ] All API endpoints responding correctly
- [ ] All pages render without errors
- [ ] All pages follow Migration design system
- [ ] No duplicate backend services created

**Exit Criteria:**
- All Phase 11 tasks completed
- All closure reports reviewed
- Final closure report documents: deliverables, gaps, recommendations
- Phase 11 marked as complete

---

## Gate Process Reference

Every task follows this mandatory gate process:

| Gate | Action | Required Before |
|------|--------|-----------------|
| 0 | **Stop Gate** — If a full or partial implementation already exists, implementation must stop until evaluated for reuse | Any analysis |
| 1 | Assess current implementation | Any code change |
| 2 | Compare against approved scope | Any code change |
| 3 | Propose minimum changes | Any code change |
| 4 | Wait for approval | Any code change |
| 5 | Implement | Approval received |
| 6 | Verify | Implementation complete |
| 7 | Produce closure report | Verification passed |

**No gate may be skipped. No implementation may begin without approval.**

---

## File Naming Convention

All Phase 11 deliverables follow this pattern:

```
engineering/MAP_V2/01_Prompts/Utilities/Phase_11_Validation_Frontend_Integration/
├── 11_0_Scope_Document.md              (Frozen baseline)
├── 11_1_Work_Breakdown_Structure.md    (This document)
├── 11_1_Closure_Report.md              (Task 11.1 deliverable)
├── 11_2_Closure_Report.md              (Task 11.2 deliverable)
├── 11_3_Closure_Report.md              (Task 11.3 deliverable)
├── 11_4_Closure_Report.md              (Task 11.4 deliverable)
├── 11_5_Closure_Report.md              (Task 11.5 deliverable)
├── 11_6_Closure_Report.md              (Task 11.6 deliverable)
├── 11_7_Closure_Report.md              (Task 11.7 deliverable)
└── 11_8_Closure_Report.md              (Task 11.8 deliverable)
```

---

**End of Document**
