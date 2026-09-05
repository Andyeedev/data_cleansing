# 09_Recommended_Remediation_Roadmap.md

# Recommended Remediation Roadmap

### MAP Nexus Enterprise Architecture — Gap Analysis Phase C

---

## Purpose

This document organises remediation actions into four phases based on gap severity, dependency, and architecture maturity impact. Actions are derived from Phase A and Phase B findings. This is a sequencing recommendation only — no implementation is performed.

---

## Phase C1: Critical Gaps

Priority: Resolve contradictions and missing foundational architecture.

| # | Remediation Action | Source Gap | Risk Addressed | Dependencies |
|---|--------------------|------------|----------------|--------------|
| C1-01 | Resolve PostgreSQL version contradiction (15 vs 16 vs 17.4) by establishing single source of truth | CTR-001; EG-24 | RR-04 | Requires infrastructure team validation |
| C1-02 | Resolve table count contradiction (24 vs 62 vs 69) by establishing authoritative database inventory | CTR-002 to CTR-005; EG-04, EG-22 | RR-03 | Requires database team validation |
| C1-03 | Resolve schema count contradiction (5 vs 6 schemas) by establishing canonical schema list | CTR-008 to CTR-010; EG-10 | RR-02 | Requires database team validation |
| C1-04 | Resolve API endpoint count contradiction (~65 vs 71 vs 74) by establishing canonical endpoint inventory | CTR-011, CTR-012; EG-03, EG-21 | RR-08 | Requires API team validation |
| C1-05 | Resolve backend service count contradiction (15 vs 17) by establishing canonical service list | CTR-013; EG-02 | RR-26 | Requires backend team validation |
| C1-06 | Create Disaster Recovery Architecture document | MD-05; DG-026 | RR-05 | Requires infrastructure and operations input |
| C1-07 | Create Business Continuity Architecture document | MD-06 | RR-06 | Requires business and compliance input |
| C1-08 | Create Governance Architecture document | CG-01; MD-02 | RR-07 | Requires governance team input |
| C1-09 | Create Risk Architecture document | MD-01 | RR-12 | Requires governance team input |
| C1-10 | Create Operational Architecture document | MD-03 | RR-13 | Requires operations team input |
| C1-11 | Create Support Architecture document | MD-04 | RR-13 | Requires support team input |
| C1-12 | Create Data Governance document | MD-07 | RR-15 | Requires data team input |
| C1-13 | Create Security Operations document | MD-09 | RR-14 | Requires security team input |
| C1-14 | Create Technology Portfolio document | MD-12 | RR-16 | Requires technology team input |
| C1-15 | Resolve view count contradiction (9 vs 5) by establishing canonical view inventory | CTR-006, CTR-007 | — | Requires database team validation |
| C1-16 | Resolve engine_v14 schema existence contradiction by confirming schema status | CTR-017; EG-17 | — | Requires database team validation |

---

## Phase C2: Traceability Improvements

Priority: Establish links between documents and improve architecture governance foundations.

| # | Remediation Action | Source Gap | Risk Addressed | Dependencies |
|---|--------------------|------------|----------------|--------------|
| C2-01 | Create Architecture Principles document | MD-15 | RR-17 | Requires architecture board input |
| C2-02 | Create centralised Architecture Decision Log with status tracking | MD-13 | RR-22 | Requires architecture board input |
| C2-03 | Add document metadata (version, owner, status, last-modified) to all architecture documents | MI-01 to MI-04 | RR-18 | Requires metadata schema definition |
| C2-04 | Create cross-reference links between dependent documents | MI-05 | RR-18 | Requires document-by-document analysis |
| C2-05 | Create Service Catalogue | MD-10 | RR-20 | Requires service team input |
| C2-06 | Create Application Portfolio | MD-11 | RR-21 | Requires application team input |
| C2-07 | Create AI Governance document | CG-02; MD-08 | RR-25 | Requires AI/ML team input |
| C2-08 | Resolve remaining inventory count contradictions (core schema, engine schema, platform schema, navigation) | CTR-014 to CTR-016, CTR-018, CTR-019 | RR-01 | Requires respective team validation |
| C2-09 | Verify evidence gaps with supporting artefacts (525 components, 15 Python modules, 71 indexes, etc.) | EG-01, EG-16, EG-19 | RR-10 | Requires codebase scanning |

---

## Phase C3: Repository Consistency

Priority: Standardise naming, numbering, folder structure, and terminology.

| # | Remediation Action | Source Gap | Risk Addressed | Dependencies |
|---|--------------------|------------|----------------|--------------|
| C3-01 | Establish canonical product naming and apply consistently across all documents | NI-01 to NI-15 | RR-11 | Requires branding/product team approval |
| C3-02 | Standardise document numbering scheme (leading zeros, prefix format) | NBI-01 to NBI-05 | RR-19 | Requires repository restructuring plan |
| C3-03 | Standardise folder structure (standalone files vs subdirectories) | FI-01 to FI-05 | RR-19 | Requires repository restructuring plan |
| C3-04 | Create Standards Catalogue from existing standards scattered across documents | MD-14 | RR-23 | Requires standards consolidation |
| C3-05 | Create Reference Architectures for common integration patterns | MD-16 | RR-24 | Requires architecture team input |
| C3-06 | Standardise section heading format across all documents | MI-07 | RR-19 | Low-effort consistency pass |
| C3-07 | Add classification metadata to all documents | MI-06 | RR-18 | Requires security classification policy |

---

## Phase C4: Architecture Maturity Improvements

Priority: Advance repository from current state to production-grade EA repository.

| # | Remediation Action | Source Gap | Risk Addressed | Dependencies |
|---|--------------------|------------|----------------|--------------|
| C4-01 | Establish automated database inventory validation (prevent future count contradictions) | CTR-002 to CTR-010 | RR-01, RR-02, RR-03 | Requires CI/CD integration |
| C4-02 | Establish automated API endpoint inventory validation | CTR-011, CTR-012 | RR-08 | Requires CI/CD integration |
| C4-03 | Establish document freshness monitoring (flag stale documents) | MI-04 | RR-18 | Requires metadata infrastructure |
| C4-04 | Establish terminology governance process to prevent future variants | NI-01 to NI-15 | RR-11 | Requires governance framework |
| C4-05 | Establish automated duplicate detection across documents | Phase B Duplicate Group Register | RR-09 | Requires tooling investment |
| C4-06 | Establish architecture compliance checking process | 13_Architecture_Compliance_Audit.md exists but not operationalised | RR-07 | Requires governance framework |
| C4-07 | Create architecture quality metrics dashboard | — | All risks | Requires metrics framework |
| C4-08 | Conduct periodic repository health checks (quarterly) | — | All risks | Requires governance cadence |

---

## Summary by Phase

| Phase | Actions | Focus |
|-------|---------|-------|
| Phase C1 | 16 | Critical gaps: contradictions, missing foundational architecture |
| Phase C2 | 9 | Traceability: principles, decisions, metadata, portfolios |
| Phase C3 | 7 | Repository consistency: naming, numbering, folders, terminology |
| Phase C4 | 8 | Maturity: automation, monitoring, governance processes |
| **Total** | **40** | |

---

## Dependency Chain

```
Phase C1 (Critical)
    |
    v
Phase C2 (Traceability)
    |
    v
Phase C3 (Consistency)
    |
    v
Phase C4 (Maturity)
```

Phases C2-C4 depend on C1 being substantially complete. Within each phase, actions can proceed in parallel where dependencies allow.

---

**Version:** 1.0

**Status:** Phase C — Gap Analysis (sequencing recommendation only)
