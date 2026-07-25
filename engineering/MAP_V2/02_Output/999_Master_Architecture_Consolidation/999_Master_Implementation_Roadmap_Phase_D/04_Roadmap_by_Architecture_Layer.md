# 04_Roadmap_by_Architecture_Layer.md

# Roadmap by Architecture Layer — Phase D Enterprise Implementation Roadmap

### MAP Nexus Enterprise Architecture

---

## Purpose

This document maps implementation actions to each of the 8 architecture layers, identifying layer-specific contradictions, duplicates, gaps, and missing deliverables.

---

## Scope

| Layer | Name | Documents | Issues |
|-------|------|-----------|--------|
| L1 | Core Architecture (00-13) | 14 | Schema contradictions |
| L2 | Enterprise Application Architecture (14) | 10 | No contradictions |
| L3 | Enterprise Functional Traceability (15) | 1 | 4 contradictions |
| L4 | Enterprise Business Capability Model (16) | 1 | Evidence gap |
| L5 | Enterprise Business Process Model (17) | 10 | No contradictions |
| L6 | Enterprise Information Data Model (18) | 10 | 5 contradictions |
| L7 | Enterprise Solution Architecture (19) | 18 | 3 contradictions |
| L8 | Enterprise Implementation Architecture (20) | 17 | 3 contradictions |

---

## Inputs

| Source | Document | Key Data |
|--------|----------|----------|
| Phase A | Repository Inventory (01) | Layer structure and document counts |
| Phase A | Contradiction Register (03) | Contradictions per layer |
| Phase A | Duplicate Register (02) | Duplicates per domain |
| Phase C | Gap Analysis by Architecture Layer (03) | Layer-specific gaps |

---

## Evidence Sources

- Phase A Repository Inventory (01): lines 11-131 (layer structure)
- Phase A Contradiction Register (03): lines 11-31 (contradictions by document)
- Phase A Duplicate Register (02): lines 36-120 (duplicates by domain)
- Phase C Gap Analysis by Architecture Layer (03): lines 9-113 (layer analysis)

---

## Layer 1: Core Architecture (00-13)

| Attribute | Value |
|-----------|-------|
| Documents | 14 |
| Contradictions | CTR-009, CTR-010 (schema count) |
| Duplicates | 15 (Security domain: #1-#15) |
| Evidence Gaps | None directly |
| Missing Deliverables | Architecture Principles (#1), Decision Log (#5) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L1-01 | Resolve schema count contradiction (5 vs 6) | Critical | Architecture | Immediate | Phase A CTR-009, CTR-010 |
| L1-02 | Consolidate 15 Security duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #1-#15 |
| L1-03 | Create Architecture Principles document | High | Architecture | Critical Stabilisation | Phase C Missing Deliverable #1 |
| L1-04 | Create Decision Log document | High | Architecture | Critical Stabilisation | Phase C Missing Deliverable #5 |

---

## Layer 2: Enterprise Application Architecture (14)

| Attribute | Value |
|-----------|-------|
| Documents | 10 |
| Contradictions | None |
| Duplicates | None |
| Evidence Gaps | None directly |
| Missing Deliverables | None |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L2-01 | No layer-specific actions required | — | — | — | Phase A Repository Inventory |

---

## Layer 3: Enterprise Functional Traceability (15)

| Attribute | Value |
|-----------|-------|
| Documents | 1 |
| Contradictions | CTR-004, CTR-009, CTR-012, CTR-019 |
| Duplicates | None |
| Evidence Gaps | EG-03, EG-04, EG-05, EG-08, EG-09, EG-10, EG-11, EG-12, EG-13 |
| Missing Deliverables | Requirements Traceability Matrix (#16) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L3-01 | Resolve table count contradiction (24 vs 62 vs 69) | Critical | Architecture | Immediate | Phase A CTR-004 |
| L3-02 | Resolve schema count contradiction (6 vs 5) | Critical | Architecture | Immediate | Phase A CTR-009 |
| L3-03 | Resolve endpoint count contradiction (72+ vs 74) | High | Architecture | Critical Stabilisation | Phase A CTR-012 |
| L3-04 | Resolve navigation count contradiction (103+ vs ~130) | High | Architecture | Critical Stabilisation | Phase A CTR-019 |
| L3-05 | Verify 9 evidence gaps | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register |
| L3-06 | Create Requirements Traceability Matrix | High | Architecture | Technology Alignment | Phase C Missing Deliverable #16 |

---

## Layer 4: Enterprise Business Capability Model (16)

| Attribute | Value |
|-----------|-------|
| Documents | 1 |
| Contradictions | None |
| Duplicates | None |
| Evidence Gaps | EG-05 (capabilities lack implementation evidence) |
| Missing Deliverables | None |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L4-01 | Verify capability implementation evidence | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register EG-05 |

---

## Layer 5: Enterprise Business Process Model (17)

| Attribute | Value |
|-----------|-------|
| Documents | 10 |
| Contradictions | None |
| Duplicates | None |
| Evidence Gaps | None directly |
| Missing Deliverables | None |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L5-01 | No layer-specific actions required | — | — | — | Phase A Repository Inventory |

---

## Layer 6: Enterprise Information Data Model (18)

| Attribute | Value |
|-----------|-------|
| Documents | 10 |
| Contradictions | CTR-001, CTR-002, CTR-005, CTR-006, CTR-007, CTR-008, CTR-010, CTR-014, CTR-015, CTR-016, CTR-017, CTR-018 |
| Duplicates | 13 (Database domain: #39-#51) |
| Evidence Gaps | EG-04, EG-10, EG-15, EG-18, EG-19, EG-22 |
| Missing Deliverables | Data Governance (#10) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L6-01 | Resolve PostgreSQL version contradiction (17.4 vs 15 vs 16) | Critical | Infrastructure | Immediate | Phase A CTR-001 |
| L6-02 | Resolve table count contradiction (62 vs 24 vs 69) | Critical | Architecture | Immediate | Phase A CTR-002, CTR-005 |
| L6-03 | Resolve view count contradiction (9 vs 5) | High | Architecture | Critical Stabilisation | Phase A CTR-006, CTR-007 |
| L6-04 | Resolve schema count contradiction (6 vs 5) | Critical | Architecture | Immediate | Phase A CTR-008, CTR-010 |
| L6-05 | Resolve core table count contradiction (7 vs 8) | Medium | Architecture | Architecture Corrections | Phase A CTR-014 |
| L6-06 | Resolve engine table count contradiction (15 vs 22) | High | Architecture | Critical Stabilisation | Phase A CTR-015 |
| L6-07 | Resolve platform table count contradiction (20 vs 22) | Medium | Architecture | Architecture Corrections | Phase A CTR-016 |
| L6-08 | Resolve engine_v14 existence contradiction | High | Architecture | Critical Stabilisation | Phase A CTR-017 |
| L6-09 | Resolve engine_v14 table count contradiction (7 vs 10) | Medium | Architecture | Architecture Corrections | Phase A CTR-018 |
| L6-10 | Consolidate 13 Database duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #39-#51 |
| L6-11 | Verify 6 evidence gaps | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register |
| L6-12 | Create Data Governance document | Medium | Data | Technology Alignment | Phase C Missing Deliverable #10 |

---

## Layer 7: Enterprise Solution Architecture (19)

| Attribute | Value |
|-----------|-------|
| Documents | 18 |
| Contradictions | CTR-001, CTR-003, CTR-008, CTR-011, CTR-013, CTR-019 |
| Duplicates | 7 (API domain: #32-#38) |
| Evidence Gaps | EG-01, EG-02, EG-06, EG-07, EG-14, EG-17, EG-20, EG-21 |
| Missing Deliverables | Service Catalogue (#13), Application Portfolio (#14), Technology Portfolio (#15) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L7-01 | Resolve PostgreSQL version contradiction (15 vs 17.4 vs 16) | Critical | Infrastructure | Immediate | Phase A CTR-001 |
| L7-02 | Resolve table count contradiction (~62 vs 24 vs 69) | Critical | Architecture | Immediate | Phase A CTR-003 |
| L7-03 | Resolve schema count contradiction (5 vs 6) | Critical | Architecture | Immediate | Phase A CTR-008 |
| L7-04 | Resolve endpoint count contradiction (~65 vs 74) | High | Architecture | Critical Stabilisation | Phase A CTR-011 |
| L7-05 | Resolve service count contradiction (15 vs 17) | High | Architecture | Critical Stabilisation | Phase A CTR-013 |
| L7-06 | Resolve navigation count contradiction (~130 vs 103+) | High | Architecture | Critical Stabilisation | Phase A CTR-019 |
| L7-07 | Consolidate 7 API duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #32-#38 |
| L7-08 | Verify 8 evidence gaps | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register |
| L7-09 | Create Service Catalogue | Low | Operations | Operational Readiness | Phase C Missing Deliverable #13 |
| L7-10 | Create Application Portfolio | Low | Architecture | Operational Readiness | Phase C Missing Deliverable #14 |
| L7-11 | Create Technology Portfolio | Low | Architecture | Operational Readiness | Phase C Missing Deliverable #15 |

---

## Layer 8: Enterprise Implementation Architecture (20)

| Attribute | Value |
|-----------|-------|
| Documents | 17 |
| Contradictions | CTR-002, CTR-003, CTR-004, CTR-006, CTR-013 |
| Duplicates | 12 (Deployment domain: #16-#27) |
| Evidence Gaps | EG-16, EG-22, EG-23, EG-24, EG-25 |
| Missing Deliverables | Disaster Recovery (#8), Business Continuity (#9), Test Architecture (#17), Change Management (#18) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| L8-01 | Resolve table count contradiction (24 vs 62 vs 69) | Critical | Architecture | Immediate | Phase A CTR-002, CTR-003, CTR-004 |
| L8-02 | Resolve view count contradiction (5 vs 9) | High | Architecture | Critical Stabilisation | Phase A CTR-006 |
| L8-03 | Resolve service count contradiction (17 vs 15) | High | Architecture | Critical Stabilisation | Phase A CTR-013 |
| L8-04 | Consolidate 12 Deployment duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #16-#27 |
| L8-05 | Verify 5 evidence gaps | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register |
| L8-06 | Create Disaster Recovery Plan | Medium | Infrastructure | Technology Alignment | Phase C Missing Deliverable #8 |
| L8-07 | Create Business Continuity Plan | Medium | Infrastructure | Technology Alignment | Phase C Missing Deliverable #9 |
| L8-08 | Create Test Architecture document | Medium | Development | Technology Alignment | Phase C Missing Deliverable #17 |
| L8-09 | Create Change Management Plan | Medium | Development | Technology Alignment | Phase C Missing Deliverable #18 |

---

## Layer Summary

| Layer | Actions | Critical | High | Medium | Low |
|-------|---------|----------|------|--------|-----|
| L1 | 4 | 1 | 2 | 1 | 0 |
| L2 | 0 | 0 | 0 | 0 | 0 |
| L3 | 6 | 2 | 2 | 2 | 0 |
| L4 | 1 | 0 | 0 | 1 | 0 |
| L5 | 0 | 0 | 0 | 0 | 0 |
| L6 | 12 | 4 | 3 | 5 | 0 |
| L7 | 11 | 3 | 3 | 2 | 3 |
| L8 | 9 | 1 | 2 | 4 | 0 |
| **Total** | **43** | **11** | **12** | **15** | **3** |

---

## Cross-Layer Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| CL-01 | Resolve document count contradiction (85 vs 81) | Critical | Documentation | Immediate | Phase A Repository Inventory; Phase B Statistics |
| CL-02 | Correct Phase B Critical count (8 vs 7 IDs) | Critical | Documentation | Immediate | Phase C QA Validation Report |
| CL-03 | Correct Phase B Medium count (9 vs 8 IDs) | Critical | Documentation | Immediate | Phase C QA Validation Report |
| CL-04 | Consolidate 6 Cross-Domain duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #52-#57 |
| CL-05 | Create Governance Architecture | High | Architecture | Operational Readiness | Phase B Gap Register CG-01 |
| CL-06 | Create Operational Architecture | High | Operations | Operational Readiness | Phase C Gap Analysis |
| CL-07 | Create Risk Architecture | High | Architecture | Critical Stabilisation | Phase C Missing Deliverable #3 |
| CL-08 | Create Standards Catalogue | Medium | Documentation | Technology Alignment | Phase C Missing Deliverable #6 |
| CL-09 | Create Reference Architectures | Medium | Architecture | Technology Alignment | Phase C Missing Deliverable #7 |
| CL-10 | Create Security Operations document | Medium | Security | Technology Alignment | Phase C Missing Deliverable #12 |
| CL-11 | Create AI Governance document | Low | Architecture | Operational Readiness | Phase B Gap Register CG-02 |
| CL-12 | Establish architecture review process | Low | Architecture | Operational Readiness | Process improvement — no Phase C deliverable |
| CL-13 | Establish architecture compliance monitoring | Low | Architecture | Operational Readiness | Process improvement — no Phase C deliverable |
| CL-14 | Establish architecture metrics framework | Low | Architecture | Operational Readiness | Process improvement — no Phase C deliverable |

---

## Deliverables

| # | Document | Status |
|---|----------|--------|
| 01 | Executive Roadmap | Complete |
| 02 | Current State vs Target State | Complete |
| 03 | Workstream Definition | Complete |
| 04 | Roadmap by Architecture Layer | This document |
| 05 | Roadmap by Domain | Pending |
| 06 | Detailed Implementation Plan | Pending |
| 07 | Dependencies and Critical Path | Pending |
| 08 | Risk Register | Pending |
| 09 | Milestone and Delivery Plan | Pending |
| 10 | Final Implementation Strategy | Pending |

---

## Acceptance Criteria

- All layer actions trace to Phase A/B/C sources
- All actions include Priority, Owner, Phase, Evidence
- No new architecture introduced
- Evidence-first methodology maintained

---

**Version:** 1.0

**Status:** Phase D — Roadmap by Architecture Layer
