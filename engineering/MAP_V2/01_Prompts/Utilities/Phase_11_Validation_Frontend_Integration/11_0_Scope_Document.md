# Phase 11 – Validation Platform Integration

**Status:** ✅ Approved — Scope Frozen  
**Date:** 2026-08-06  
**Classification:** Scope Document — Frozen Baseline  
**Frozen By:** User approval  
**WBS Reference:** 11_1_Work_Breakdown_Structure.md

---

## 1. Scope Clarification

This Phase 11 is **NOT** building the Validation module from scratch.

It is specifically for the Validation frontend submenus whose backend largely already exists.

The objective is to integrate the existing backend with the frontend, reusing the Migration module patterns wherever possible.

**The backend must be assessed first to determine what already exists. Do not recreate backend services that are already implemented. Only build missing APIs where genuinely required.**

---

## 2. Carry-Forward Findings

### From 10_3_Assessment_Report.md
- Backend execution engine fully operational (6-step pipeline)
- 10 migration controls (C01-C10) implemented in `app/rules/`
- `AutoRuleDiscovery` class (186 lines) fully implemented as internal engine step
- `rule_registry` and `control_registry` tables defined in schema with seed data
- Execution lifecycle API (pause/resume/retry) fully implemented
- Read-only access to rules/controls exists via execution flow

### From 10_4_Platform_Stabilisation.md
- Frontend infrastructure complete: hooks, API client, shared components
- Results page fully implemented (tabbed: Overview, Controls, Exceptions, Governance)
- Validation Dashboard fully implemented (metrics, charts, alerts, active runs)
- Execution History fully implemented (paginated, sortable, re-run capability)
- Routing structure defined for all Validation submenus

### From 10_4_Platform_Stabilisation_Closure_Report.md
- Migration Timeline page fixed and operational
- API path double-prefix issue resolved
- Null-safety crashes resolved
- Backend-fronted data flow verified
- Design pattern established: card-based layout with color-coded status

---

## 3. Current Validation Analysis (Baseline)

### Menu Structure
```
Validation (/validation)
├── Rules            (/validation/rules)           [validation.ruleDiscovery]
├── Rule Discovery   (/validation/rule-discovery)  [validation.ruleDiscovery]  ← Backend only
├── Results          (/validation/results)          [validation.results]        ✅ Complete
├── Queue            (/validation/queue)            [validation.queue]
├── Controls         (/validation/controls)         [validation.controlDiscovery]
└── Validation Dashboard (/validation/dashboard)   ✅ Complete
```

### Implementation Status

| Feature | Frontend | Backend API | Database | Status |
|---------|----------|-------------|----------|--------|
| Rules - Read | ❌ Generic page | ⚠️ Read-only via execution | ✅ `rule_registry` | Partial |
| Rules - CRUD | ❌ | ❌ | ✅ Schema exists | Not started |
| Rule Discovery - Auto-gen | ❌ | ✅ Internal engine step | ✅ `rule_dataset_mapping` | Backend only |
| Rule Discovery - UI trigger | ❌ | ❌ | — | Not started |
| Queue - View | ❌ Generic page | ⚠️ Minimal (monitoring only) | ⚠️ No dedicated table | Minimal |
| Queue - Management | ❌ | ❌ | ❌ | Not started |
| Controls - Read | ❌ Generic page | ❌ | ✅ `control_registry` | Partial |
| Controls - CRUD | ❌ | ❌ | ✅ Schema exists | Not started |
| Results | ✅ Full | ✅ Full | ✅ Full | **Complete** |
| Dashboard | ✅ Full | ✅ Full | ✅ Full | **Complete** |

### Reuse Matrix

| Validation | Reuse From | Redesign Allowed |
|------------|------------|------------------|
| Rule Discovery | Migration → Discovery | ❌ No |
| Rules | Migration → Mappings | ❌ No |
| Controls | New page | ✅ Yes (3 options required) |
| Queue | Deferred | N/A |

---

## 4. Validation Frontend Scope

### Rule Discovery → Reuse Migration → Discovery
- **Source:** `AutoRuleDiscovery` class (`app/discovery/auto_rule_discovery.py`)
- **Target:** New frontend page at `/validation/rule-discovery`
- **Approach:** Reuse Migration → Discovery page patterns
- **Backend needed:** New API endpoint to trigger rule discovery independently and return results
- **Database:** Uses existing `core.rule_dataset_mapping`, `core.dataset_mappings`, `engine.rule_registry`

### Rules → Reuse Migration → Mappings
- **Source:** `engine.rule_registry` table, `app/rules/` implementations (C01-C10)
- **Target:** New frontend page at `/validation/rules`
- **Approach:** Reuse Migration → Mappings page patterns (table layout, CRUD operations)
- **Backend needed:** New API endpoints for rule listing, detail view, enable/disable toggle
- **Database:** Uses existing `engine.rule_registry`

### Queue → Deferred
- **Status:** Deferred to future phase
- **Reason:** No dedicated queue table exists. Current implementation derives queue from `migration_batch_registry` status (RUNNING/PENDING). Architecture decision needed on whether to create dedicated queue table.
- **Documentation only:** No implementation in this phase

### Controls → New Frontend Page (3 Design Options Required)
- **Source:** `engine.control_registry` table, `app/controls/` framework
- **Target:** New frontend page at `/validation/controls`
- **Approach:** New page design — 3 design options required before implementation
- **Backend needed:** New API endpoints for control listing, detail view, enable/disable toggle
- **Database:** Uses existing `engine.control_registry`
- **Design requirement:** Provide 3 design recommendations (similar to Migration Timeline design options)

---

## 5. Mandatory Governance Gates

### Pre-Implementation Gates
1. **Assess Current Implementation** — Check what already exists in backend and frontend
2. **Check for Existing Functionality** — Verify no duplicate work needed
3. **Reuse Before Creating** — Follow Migration module patterns wherever possible
4. **Produce Minimum-Change Proposal** — Document only what needs to be built
5. **Wait for Approval** — No implementation without explicit approval

### Implementation Gates
6. **Implement Only Approved Scope** — Stay strictly within approved boundaries
7. **Verify** — Run lint, typecheck, and tests after each change
8. **Produce Closure Report** — Document what was delivered vs. proposed

### Frontend Design Gate

Any page requiring a new UI (currently Controls only) must:

1. Produce 3 design recommendations
2. Remain consistent with the Migration design system
3. Receive explicit approval before implementation

---

## 6. Backend Assessment Requirement

**No backend implementation may begin until the assessment confirms whether each API already exists, partially exists, or is absent. Existing implementations must be extended, never duplicated.**

| Assessment Area | Question |
|-----------------|----------|
| Rule Listing API | Does `GET /api/v1/validation/rules` exist? |
| Rule Detail API | Does `GET /api/v1/validation/rules/{rule_id}` exist? |
| Rule Toggle API | Does `POST /api/v1/validation/rules/{rule_id}/toggle` exist? |
| Control Listing API | Does `GET /api/v1/validation/controls` exist? |
| Control Detail API | Does `GET /api/v1/validation/controls/{control_id}` exist? |
| Control Toggle API | Does `POST /api/v1/validation/controls/{control_id}/toggle` exist? |
| Rule Discovery API | Does `POST /api/v1/validation/rule-discovery` exist? |
| Rule Discovery Results | Does `GET /api/v1/validation/rule-discovery/{project_id}` exist? |

**Result:** Only build what is genuinely missing. Do not recreate existing services.

---

## 7. Implementation Priority

| Phase | Feature | Effort | Dependency |
|-------|---------|--------|------------|
| 11.1 | Rules Backend Assessment | Low | None |
| 11.2 | Controls Backend Assessment | Low | None |
| 11.3 | Rule Discovery Backend Assessment | Low | None |
| 11.4 | Rules Integration (Backend + Frontend) | Medium | 11.1 |
| 11.5 | Controls UI (3 designs) | Medium | 11.2 |
| 11.6 | Controls Implementation | Medium | 11.5 (Approved) |
| 11.7 | Rule Discovery Integration (Backend + Frontend) | Medium | 11.3 |
| Deferred | Queue page | — | Architecture decision |

---

## 8. Phase 11 Deliverable

Upon completion produce:

- `Phase_11_Closure_Report.md`
- Validation API Matrix
- Frontend Conformance Report
- Reuse vs New Components Report

---

**End of Document**
