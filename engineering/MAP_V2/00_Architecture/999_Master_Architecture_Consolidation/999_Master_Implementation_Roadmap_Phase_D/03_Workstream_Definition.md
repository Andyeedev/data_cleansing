# 03_Workstream_Definition.md

# Workstream Definition — Phase D Enterprise Implementation Roadmap

### MAP Nexus Enterprise Architecture

---

## Purpose

This document defines the workstreams required to execute the implementation roadmap. Each workstream groups related actions by execution domain, identifies ownership, and establishes parallel execution boundaries.

---

## Scope

| Workstream | Focus Area | Actions |
|------------|------------|---------|
| WS-01 | Authoritative Source Establishment | 6 actions |
| WS-02 | Contradiction Resolution | 1 action (19 contradictions) |
| WS-03 | Documentation Consolidation | 3 actions (duplicates, terminology, evidence gaps) |
| WS-04 | Missing Deliverables Creation | 1 action (18 documents) |
| WS-05 | Architecture Chain Repair | 2 actions (Operations, Governance) |

---

## Inputs

| Source | Document | Key Data |
|--------|----------|----------|
| Phase A | Contradiction Register (03) | 19 contradictions to resolve |
| Phase A | Duplicate Register (02) | 57 duplicate groups to consolidate |
| Phase A | Terminology Register (04) | 15 terminology issues to standardise |
| Phase A | Evidence Gaps Register (06) | 25 evidence gaps to verify |
| Phase C | Missing Deliverables (08) | 18 documents to create |
| Phase C | Gap Analysis (04, 05) | 2 broken chains to repair |
| Phase C QA | QA Validation Report | 7 corrective actions |

---

## Evidence Sources

- Phase A Contradiction Register (03): CTR-001 through CTR-019
- Phase A Duplicate Register (02): #1 through #57
- Phase A Terminology Register (04): #1 through #15
- Phase A Evidence Gaps Register (06): EG-01 through EG-25
- Phase B Gap Register (08): CG-01, CG-02
- Phase C Missing Deliverables (08): #1 through #18
- Phase C Gap Analysis (04): Governance Chain, Operations Chain
- Phase C QA Validation Report: Corrective Actions 1-7

---

## Workstream Definitions

### WS-01: Authoritative Source Establishment

| Attribute | Value |
|-----------|-------|
| Workstream ID | WS-01 |
| Name | Authoritative Source Establishment |
| Purpose | Establish single authoritative sources for contradictory counts |
| Owner | Architecture |
| Priority | Critical |
| Phase | Immediate (Week 1-2) |
| Actions | 6 |

#### Actions

| # | Action | Evidence | Effort |
|---|--------|----------|--------|
| WS-01-01 | Establish authoritative table count from database | Phase A CTR-002, CTR-003, CTR-004, CTR-005 | Small |
| WS-01-02 | Establish authoritative schema count from database | Phase A CTR-008, CTR-009, CTR-010 | Small |
| WS-01-03 | Establish authoritative PostgreSQL version from deployment config | Phase A CTR-001 | Small |
| WS-01-04 | Correct Phase B Contradiction Classification Register (Critical count 8 → 7) | Phase C QA Validation Report | Small |
| WS-01-05 | Correct Phase B Master Repository Statistics (Medium gap count 9 → 8) | Phase C QA Validation Report | Small |
| WS-01-06 | Reconcile Phase A Repository Inventory total (85) with layer breakdown (81) | Phase C QA Validation Report | Small |

#### Dependencies

- None (independent workstream)

#### Parallel Execution

- All 6 actions can run in parallel

#### Acceptance Criteria

- Single authoritative table count established
- Single authoritative schema count established
- Single authoritative PostgreSQL version established
- Phase B registers corrected
- Phase A document count reconciled

---

### WS-02: Contradiction Resolution

| Attribute | Value |
|-----------|-------|
| Workstream ID | WS-02 |
| Name | Contradiction Resolution |
| Purpose | Resolve all 19 verified contradictions |
| Owner | Architecture |
| Priority | High |
| Phase | Critical Stabilisation (Week 3-4) |
| Actions | 1 (19 contradictions) |

#### Actions

| # | Action | Evidence | Effort |
|---|--------|----------|--------|
| WS-02-01 | Resolve Critical contradictions CTR-001 through CTR-010 | Phase A CTR-001 through CTR-010 | Large |

#### Dependencies

- WS-01 must complete (authoritative sources established)

#### Parallel Execution

- Sequential (depends on WS-01)

#### Acceptance Criteria

- All 19 contradictions resolved
- No open Critical severity items
- No open High severity items
- No open Medium severity items

---

### WS-03: Documentation Consolidation

| Attribute | Value |
|-----------|-------|
| Workstream ID | WS-03 |
| Name | Documentation Consolidation |
| Purpose | Resolve duplicates, terminology, and evidence gaps |
| Owner | Documentation |
| Priority | Medium |
| Phase | Architecture Corrections (Week 5-12) |
| Actions | 3 |

#### Actions

| # | Action | Evidence | Effort |
|---|--------|----------|--------|
| WS-03-01 | Consolidate 57 duplicate content groups | Phase A Duplicate Register #1-#57 | Large |
| WS-03-02 | Standardise 15 terminology inconsistencies | Phase A Terminology Register #1-#15 | Medium |
| WS-03-03 | Verify or mark 25 evidence gaps | Phase A Evidence Gaps Register EG-01 through EG-25 | Large |

#### Dependencies

- WS-02 must complete (contradictions resolved)

#### Parallel Execution

- WS-03-01, WS-03-02, WS-03-03 can run in parallel

#### Acceptance Criteria

- All 57 duplicate groups consolidated to authoritative sources
- All 15 terminology inconsistencies resolved
- All 25 evidence gaps verified or marked UNVERIFIABLE

---

### WS-04: Missing Deliverables Creation

| Attribute | Value |
|-----------|-------|
| Workstream ID | WS-04 |
| Name | Missing Deliverables Creation |
| Purpose | Create all 18 missing architecture documents |
| Owner | Architecture / Documentation |
| Priority | High |
| Phase | Technology Alignment (Week 9-16) |
| Actions | 1 (18 documents) |

#### Actions

| # | Action | Evidence | Effort |
|---|--------|----------|--------|
| WS-04-01 | Create 18 missing deliverables | Phase C Missing Deliverables #1-#18 | Large |

#### Dependencies

- WS-03 must complete (documentation consolidated)

#### Parallel Execution

- Documents can be created in parallel by multiple owners

#### Acceptance Criteria

- All 18 missing deliverables created
- All documents follow evidence-first methodology
- All documents trace to Phase A/B/C sources

---

### WS-05: Architecture Chain Repair

| Attribute | Value |
|-----------|-------|
| Workstream ID | WS-05 |
| Name | Architecture Chain Repair |
| Purpose | Repair broken architecture chains |
| Owner | Architecture / Operations |
| Priority | High |
| Phase | Operational Readiness (Week 17-20) |
| Actions | 2 |

#### Actions

| # | Action | Evidence | Effort |
|---|--------|----------|--------|
| WS-05-01 | Create Operational Architecture document | Phase C Gap Analysis: Deployment → Operations broken | Medium |
| WS-05-02 | Create Governance Architecture document | Phase C Gap Analysis: Governance → All Layers broken; Phase B Gap Register CG-01 | Medium |

#### Dependencies

- WS-04 must complete (missing deliverables created)

#### Parallel Execution

- WS-05-01 and WS-05-02 can run in parallel

#### Acceptance Criteria

- Operations chain complete
- Governance chain complete
- All 10 architecture chains verified

---

## Workstream Summary

| Workstream | Name | Actions | Priority | Phase | Duration |
|------------|------|---------|----------|-------|----------|
| WS-01 | Authoritative Source Establishment | 6 | Critical | Immediate | Week 1-2 |
| WS-02 | Contradiction Resolution | 1 | High | Critical Stabilisation | Week 3-4 |
| WS-03 | Documentation Consolidation | 3 | Medium | Architecture Corrections | Week 5-12 |
| WS-04 | Missing Deliverables Creation | 1 | High | Technology Alignment | Week 9-16 |
| WS-05 | Architecture Chain Repair | 2 | High | Operational Readiness | Week 17-20 |
| **Total** | | **13** | | | **20 weeks** |

---

## Dependencies Between Workstreams

```
WS-01 (Authoritative Sources)
    ↓
WS-02 (Contradiction Resolution)
    ↓
WS-03 (Documentation Consolidation)
    ↓
WS-04 (Missing Deliverables)
    ↓
WS-05 (Chain Repair)
```

---

## Risks

| Risk | Workstream | Impact | Mitigation |
|------|------------|--------|------------|
| Database administrator unavailable | WS-01 | Actions 1-3 blocked | Escalate to management |
| Resource constraints | All | Timeline extends | Prioritise Critical actions |
| Scope creep | All | Additional findings | Freeze scope after Phase D approval |

---

## Deliverables

| # | Document | Status |
|---|----------|--------|
| 01 | Executive Roadmap | Complete |
| 02 | Current State vs Target State | Complete |
| 03 | Workstream Definition | This document |
| 04 | Roadmap by Architecture Layer | Pending |
| 05 | Roadmap by Domain | Pending |
| 06 | Detailed Implementation Plan | Pending |
| 07 | Dependencies and Critical Path | Pending |
| 08 | Risk Register | Pending |
| 09 | Milestone and Delivery Plan | Pending |
| 10 | Final Implementation Strategy | Pending |

---

## Acceptance Criteria

- All workstreams trace to Phase A/B/C sources
- All actions include Priority, Effort, Owner, Dependency, Phase
- No new architecture introduced
- Evidence-first methodology maintained

---

**Version:** 1.0

**Status:** Phase D — Workstream Definition
