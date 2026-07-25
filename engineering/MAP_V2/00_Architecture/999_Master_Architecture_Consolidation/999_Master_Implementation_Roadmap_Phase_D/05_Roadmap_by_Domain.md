# 05_Roadmap_by_Domain.md

# Roadmap by Domain — Phase D Enterprise Implementation Roadmap

### MAP Nexus Enterprise Architecture

---

## Purpose

This document maps implementation actions to each of the 9 architecture domains, identifying domain-specific contradictions, duplicates, gaps, and missing deliverables.

---

## Scope

| Domain | Documents | Issues |
|--------|-----------|--------|
| Enterprise Architecture Planning | 8 | Document count contradiction |
| Application Architecture | 16 | No contradictions |
| Data Architecture | 15 | Schema/table contradictions |
| Integration Architecture | 4 | Endpoint contradictions |
| Technology Architecture | 7 | PostgreSQL version contradiction |
| Business Architecture | 11 | No contradictions |
| Security Architecture | 3 | No contradictions |
| Infrastructure Architecture | 4 | Deployment duplicates |
| Business Intelligence Architecture | 3 | No contradictions |

---

## Inputs

| Source | Document | Key Data |
|--------|----------|----------|
| Phase A | Repository Inventory (01) | Domain structure |
| Phase A | Duplicate Register (02) | Duplicates by domain |
| Phase A | Contradiction Register (03) | Contradictions by document |
| Phase B | Master Repository Statistics (09) | Domain distribution |

---

## Evidence Sources

- Phase A Repository Inventory (01): lines 11-131 (domain classification)
- Phase A Duplicate Register (02): lines 36-120 (duplicates by domain)
- Phase A Contradiction Register (03): lines 11-31 (contradictions by document)
- Phase B Master Repository Statistics (09): lines 44-56 (domain distribution)

---

## Enterprise Architecture Planning

| Attribute | Value |
|-----------|-------|
| Documents | 8 |
| Contradictions | Document count (85 vs 81) |
| Duplicates | None |
| Evidence Gaps | None directly |
| Missing Deliverables | Architecture Principles (#1), Governance Architecture (#2), Decision Log (#5) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-EAP-01 | Reconcile document count (85 vs 81) | Critical | Documentation | Immediate | Phase A Repository Inventory; Phase B Statistics |
| D-EAP-02 | Create Architecture Principles | High | Architecture | Critical Stabilisation | Phase C Missing Deliverable #1 |
| D-EAP-03 | Create Governance Architecture | High | Architecture | Operational Readiness | Phase B Gap Register CG-01 |
| D-EAP-04 | Create Decision Log | High | Architecture | Critical Stabilisation | Phase C Missing Deliverable #5 |

---

## Application Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 16 |
| Contradictions | None |
| Duplicates | None |
| Evidence Gaps | EG-01, EG-02, EG-06, EG-14 |
| Missing Deliverables | Application Portfolio (#14) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-AA-01 | Verify 4 evidence gaps | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register |
| D-AA-02 | Create Application Portfolio | Low | Architecture | Operational Readiness | Phase C Missing Deliverable #14 |

---

## Data Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 15 |
| Contradictions | CTR-001, CTR-002, CTR-003, CTR-004, CTR-005, CTR-006, CTR-007, CTR-008, CTR-009, CTR-010 |
| Duplicates | 13 (#39-#51) |
| Evidence Gaps | EG-04, EG-10, EG-15, EG-18, EG-19, EG-22 |
| Missing Deliverables | Data Governance (#10) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-DA-01 | Resolve PostgreSQL version (17.4 vs 15 vs 16) | Critical | Infrastructure | Immediate | Phase A CTR-001 |
| D-DA-02 | Resolve table count (24 vs 62 vs 69) | Critical | Architecture | Immediate | Phase A CTR-002, CTR-003, CTR-004, CTR-005 |
| D-DA-03 | Resolve view count (9 vs 5) | High | Architecture | Critical Stabilisation | Phase A CTR-006, CTR-007 |
| D-DA-04 | Resolve schema count (5 vs 6) | Critical | Architecture | Immediate | Phase A CTR-008, CTR-009, CTR-010 |
| D-DA-05 | Consolidate 13 Database duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #39-#51 |
| D-DA-06 | Verify 6 evidence gaps | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register |
| D-DA-07 | Create Data Governance | Medium | Data | Technology Alignment | Phase C Missing Deliverable #10 |

---

## Integration Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 4 |
| Contradictions | CTR-011, CTR-012 |
| Duplicates | None |
| Evidence Gaps | EG-03, EG-17, EG-21 |
| Missing Deliverables | None |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-IA-01 | Resolve endpoint count (~65 vs 74) | High | Architecture | Critical Stabilisation | Phase A CTR-011 |
| D-IA-02 | Resolve endpoint count (74 vs 72+) | High | Architecture | Critical Stabilisation | Phase A CTR-012 |
| D-IA-03 | Verify 3 evidence gaps | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register |

---

## Technology Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 7 |
| Contradictions | CTR-001 |
| Duplicates | None |
| Evidence Gaps | EG-23, EG-24 |
| Missing Deliverables | Technology Portfolio (#15) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-TA-01 | Resolve PostgreSQL version (15 vs 16 vs 17.4) | Critical | Infrastructure | Immediate | Phase A CTR-001 |
| D-TA-02 | Verify Python version (3.11 vs 3.12) | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register EG-23 |
| D-TA-03 | Verify Docker Compose version | Low | Documentation | Architecture Corrections | Phase A Evidence Gaps Register EG-25 |
| D-TA-04 | Create Technology Portfolio | Low | Architecture | Operational Readiness | Phase C Missing Deliverable #15 |

---

## Business Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 11 |
| Contradictions | None |
| Duplicates | None |
| Evidence Gaps | EG-05 |
| Missing Deliverables | None |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-BA-01 | Verify capability implementation evidence | Medium | Documentation | Architecture Corrections | Phase A Evidence Gaps Register EG-05 |

---

## Security Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 3 |
| Contradictions | None |
| Duplicates | 15 (#1-#15) |
| Evidence Gaps | None directly |
| Missing Deliverables | Security Operations (#12) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-SA-01 | Consolidate 15 Security duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #1-#15 |
| D-SA-02 | Create Security Operations | Medium | Security | Technology Alignment | Phase C Missing Deliverable #12 |

---

## Infrastructure Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 4 |
| Contradictions | None |
| Duplicates | 12 (#16-#27) |
| Evidence Gaps | EG-25 |
| Missing Deliverables | Disaster Recovery (#8), Business Continuity (#9) |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-InfA-01 | Consolidate 12 Deployment duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #16-#27 |
| D-InfA-02 | Verify Docker Compose version | Low | Documentation | Architecture Corrections | Phase A Evidence Gaps Register EG-25 |
| D-InfA-03 | Create Disaster Recovery Plan | Medium | Infrastructure | Technology Alignment | Phase C Missing Deliverable #8 |
| D-InfA-04 | Create Business Continuity Plan | Medium | Infrastructure | Technology Alignment | Phase C Missing Deliverable #9 |

---

## Business Intelligence Architecture

| Attribute | Value |
|-----------|-------|
| Documents | 3 |
| Contradictions | None |
| Duplicates | None |
| Evidence Gaps | None directly |
| Missing Deliverables | None |

### Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-BIA-01 | No domain-specific actions required | — | — | — | Phase A Repository Inventory |

---

## Cross-Domain Actions

| # | Action | Priority | Owner | Phase | Evidence |
|---|--------|----------|-------|-------|----------|
| D-CD-01 | Resolve 6 Cross-Domain duplicates | Medium | Documentation | Architecture Corrections | Phase A Duplicate Register #52-#57 |
| D-CD-02 | Create Risk Architecture | High | Architecture | Critical Stabilisation | Phase C Missing Deliverable #3 |
| D-CD-03 | Create Standards Catalogue | Medium | Documentation | Technology Alignment | Phase C Missing Deliverable #6 |
| D-CD-04 | Create Reference Architectures | Medium | Architecture | Technology Alignment | Phase C Missing Deliverable #7 |
| D-CD-05 | Create Operational Architecture | High | Operations | Operational Readiness | Phase C Gap Analysis |
| D-CD-06 | Create AI Governance | Low | Architecture | Operational Readiness | Phase B Gap Register CG-02 |
| D-CD-07 | Create Requirements Traceability Matrix | High | Architecture | Technology Alignment | Phase C Missing Deliverable #16 |
| D-CD-08 | Create Test Architecture | Medium | Development | Technology Alignment | Phase C Missing Deliverable #17 |
| D-CD-09 | Create Change Management Plan | Medium | Development | Technology Alignment | Phase C Missing Deliverable #18 |
| D-CD-10 | Establish architecture review process | Low | Architecture | Operational Readiness | Process improvement — no Phase C deliverable |
| D-CD-11 | Establish architecture compliance monitoring | Low | Architecture | Operational Readiness | Process improvement — no Phase C deliverable |
| D-CD-12 | Establish architecture metrics framework | Low | Architecture | Operational Readiness | Process improvement — no Phase C deliverable |

---

## Domain Summary

| Domain | Actions | Critical | High | Medium | Low |
|--------|---------|----------|------|--------|-----|
| Enterprise Architecture Planning | 4 | 1 | 3 | 0 | 0 |
| Application Architecture | 2 | 0 | 0 | 1 | 1 |
| Data Architecture | 7 | 3 | 1 | 3 | 0 |
| Integration Architecture | 3 | 0 | 2 | 1 | 0 |
| Technology Architecture | 4 | 1 | 0 | 1 | 2 |
| Business Architecture | 1 | 0 | 0 | 1 | 0 |
| Security Architecture | 2 | 0 | 0 | 2 | 0 |
| Infrastructure Architecture | 4 | 0 | 0 | 3 | 1 |
| Business Intelligence Architecture | 0 | 0 | 0 | 0 | 0 |
| Cross-Domain | 12 | 0 | 3 | 5 | 4 |
| **Total** | **39** | **5** | **9** | **17** | **8** |

---

## Deliverables

| # | Document | Status |
|---|----------|--------|
| 01 | Executive Roadmap | Complete |
| 02 | Current State vs Target State | Complete |
| 03 | Workstream Definition | Complete |
| 04 | Roadmap by Architecture Layer | Complete |
| 05 | Roadmap by Domain | This document |
| 06 | Detailed Implementation Plan | Pending |
| 07 | Dependencies and Critical Path | Pending |
| 08 | Risk Register | Pending |
| 09 | Milestone and Delivery Plan | Pending |
| 10 | Final Implementation Strategy | Pending |

---

## Acceptance Criteria

- All domain actions trace to Phase A/B/C sources
- All actions include Priority, Owner, Phase, Evidence
- No new architecture introduced
- Evidence-first methodology maintained

---

**Version:** 1.0

**Status:** Phase D — Roadmap by Domain
