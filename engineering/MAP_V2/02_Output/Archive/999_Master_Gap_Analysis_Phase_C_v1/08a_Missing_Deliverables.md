# 08a_Missing_Deliverables.md

# Missing Deliverables Register

### MAP Nexus Enterprise Architecture — Gap Analysis Phase C

---

## Purpose

This document identifies recognised Enterprise Architecture deliverables that are absent from the MAP Nexus repository. Each deliverable is assessed against repository coverage from Phase A and Phase B outputs. No redesign, rewriting, or new architecture is proposed.

---

## Missing Deliverables

| # | Missing Deliverable | Why Required | Priority | Recommended Phase |
|---|---------------------|--------------|----------|-------------------|
| MD-01 | Risk Architecture | No dedicated document addressing architecture-level risks, threat models, or risk treatment plans. Risk is mentioned only in passing within Security Architecture. EA requires explicit risk documentation for governance and compliance. | High | Phase C1 |
| MD-02 | Governance Architecture | Identified as Partially Present in Phase A Coverage Register (CG-01). Governance is scattered across 16_Capability_Model, 13_Compliance_Audit, and 19_Solution docs with no dedicated governance architecture. Required for decision-making framework, policy enforcement, and compliance. | High | Phase C1 |
| MD-03 | Operational Architecture | No document describing operational processes, runbooks, operational handover, or day-to-day operational procedures. Implementation Architecture covers build/deploy but not steady-state operations. | High | Phase C1 |
| MD-04 | Support Architecture | No document describing support model, support tiers, escalation paths, or support tooling. Required for production readiness and service management. | High | Phase C1 |
| MD-05 | Disaster Recovery Architecture | Disaster Recovery mentioned only as a duplicate topic (DG-026) between 08_Security_Architecture.md and 09_Deployment_Architecture.md. No dedicated DR plan, RTO/RPO definitions, or recovery procedures documented. | Critical | Phase C1 |
| MD-06 | Business Continuity Architecture | No document addressing business continuity planning, BIA (Business Impact Analysis), or continuity strategies. Critical for financial services domain compliance. | Critical | Phase C1 |
| MD-07 | Data Governance | No dedicated document for data governance policies, data stewardship, data quality rules, data lineage ownership, or data classification. Data Architecture covers structure but not governance. | High | Phase C1 |
| MD-08 | AI Governance | AI Architecture identified as Partially Present in Phase A Coverage Register (CG-02); AI is frontend-local mock only. No governance framework for AI/ML model lifecycle, bias detection, explainability, or responsible AI. | Medium | Phase C2 |
| MD-09 | Security Operations | Security Architecture covers controls and design but not operational security processes: SIEM, SOC procedures, incident response playbooks, vulnerability management, or threat intelligence. | High | Phase C1 |
| MD-10 | Service Catalogue | No catalogue of services offered by the platform, their descriptions, SLAs, dependencies, or consumption models. Required for service management and stakeholder communication. | Medium | Phase C2 |
| MD-11 | Application Portfolio | No portfolio view of all applications, their business value, technology risk, lifecycle stage, or rationalisation strategy. Repository lists documents but not an application inventory. | Medium | Phase C2 |
| MD-12 | Technology Portfolio | No consolidated portfolio of technology components, versions, lifecycle status, vendor relationships, or licence management. Technology version contradictions (CTR-001, CTR-023, CTR-024) indicate no single source of truth. | High | Phase C1 |
| MD-13 | Decision Logs | 19_Enterprise_Solution_Architecture/18_Architecture_Decision_Summary.md and 20_Enterprise_Implementation_Architecture/17_Implementation_Decision_Record.md exist but no centralised Architecture Decision Log (ADL) with status tracking, decision dates, and review schedules. | Medium | Phase C2 |
| MD-14 | Standards Catalogue | No consolidated catalogue of technology standards, approved technology lists, version constraints, or coding standards. 11_Development_Standards.md exists but is not structured as a standards catalogue. | Medium | Phase C3 |
| MD-15 | Architecture Principles | No document defining architecture principles, design principles, or architectural values. Principles are foundational for architecture governance and decision-making. | High | Phase C2 |
| MD-16 | Reference Architectures | No reference architecture diagrams or patterns for common scenarios (e.g., new integration, new module, data migration pattern). Would accelerate decision-making and ensure consistency. | Medium | Phase C3 |

---

## Summary by Priority

| Priority | Count | Deliverables |
|----------|-------|-------------|
| Critical | 2 | MD-05 (Disaster Recovery), MD-06 (Business Continuity) |
| High | 7 | MD-01 (Risk), MD-02 (Governance), MD-03 (Operational), MD-04 (Support), MD-07 (Data Governance), MD-09 (Security Operations), MD-12 (Technology Portfolio), MD-15 (Architecture Principles) |
| Medium | 7 | MD-08 (AI Governance), MD-10 (Service Catalogue), MD-11 (Application Portfolio), MD-13 (Decision Logs), MD-14 (Standards Catalogue), MD-16 (Reference Architectures) |
| Low | 0 | — |
| **Total** | **16** | |

---

## Summary by Recommended Phase

| Phase | Count | Deliverables |
|-------|-------|-------------|
| Phase C1 | 9 | MD-01, MD-02, MD-03, MD-04, MD-05, MD-06, MD-07, MD-09, MD-12 |
| Phase C2 | 5 | MD-08, MD-10, MD-11, MD-13, MD-15 |
| Phase C3 | 2 | MD-14, MD-16 |
| Phase C4 | 0 | — |

---

**Version:** 1.0

**Status:** Phase C — Gap Analysis (identification only)
