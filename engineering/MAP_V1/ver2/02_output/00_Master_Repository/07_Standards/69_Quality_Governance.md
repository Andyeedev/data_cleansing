# Quality Governance Framework

## Migration Assurance Platform (MAP)

---

| Field | Value |
|-------|-------|
| **Document Title** | Quality Governance Framework |
| **Document ID** | MAP-QA-GOV-001 |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal — Engineering |
| **Owner** | QA Engineering Lead |
| **Domain** | Quality Assurance & Testing |

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Definitions & Terminology](#2-definitions--terminology)
3. [Quality Governance Structure](#3-quality-governance-structure)
4. [Quality Board](#4-quality-board)
5. [Quality Roles & Responsibilities](#5-quality-roles--responsibilities)
6. [RACI Matrix for Quality Activities](#6-raci-matrix-for-quality-activities)
7. [Quality Gates & Approval Process](#7-quality-gates--approval-process)
8. [Decision Authority Framework](#8-decision-authority-framework)
9. [Escalation Procedures](#9-escalation-procedures)
10. [Audit Trail & Compliance](#10-audit-trail--compliance)
11. [Review Cadence](#11-review-cadence)
12. [Continuous Improvement](#12-continuous-improvement)
13. [Quality Policies & Standards](#13-quality-policies--standards)
14. [Quality Reporting Framework](#14-quality-reporting-framework)
15. [Quality Training Programme](#15-quality-training-programme)
16. [Quality Metrics Governance](#16-quality-metrics-governance)
17. [Best Practices](#17-best-practices)
18. [Dependencies & References](#18-dependencies--references)
19. [Compliance & Audit](#19-compliance--audit)
20. [Appendices](#20-appendices)
21. [Revision History](#21-revision-history)
22. [Approval](#22-approval)

---

## 1. Purpose & Scope

### 1.1 Purpose

This document establishes the Quality Governance Framework for the Migration Assurance Platform (MAP). It defines the organisational structure, decision-making authority, accountability mechanisms, compliance requirements, and review processes that govern all quality activities across the MAP programme.

Quality governance provides the formal framework through which quality is directed, monitored, and assured. It ensures that quality decisions are made at the appropriate level, that quality activities are properly resourced, and that quality outcomes are measured and continuously improved.

### 1.2 Objectives

| # | Objective | Success Measure |
|---|-----------|-----------------|
| O1 | Establish clear quality decision-making authority | All quality decisions traceable to authorised approvers |
| O2 | Ensure accountability for quality outcomes | RACI matrix maintained and followed for all quality activities |
| O3 | Provide auditable quality records | 100% of quality decisions documented with evidence |
| O4 | Enable data-driven quality governance | Quality metrics drive all governance decisions |
| O5 | Support regulatory compliance | All quality governance activities meet compliance requirements |
| O6 | Drive continuous improvement | Quarterly process improvement actions implemented |
| O7 | Align governance with delivery methodology | Governance integrated into Agile/Scrum ceremonies |

### 1.3 Scope

#### 1.3.1 In Scope

| Area | Governance Coverage |
|------|---------------------|
| Quality Decision-Making | Quality gates, Go/No-Go decisions, Release approvals |
| Quality Accountability | RACI matrix, Role assignments, Responsibility tracking |
| Quality Compliance | Audit trails, Regulatory compliance, Standards adherence |
| Quality Review | Review cadence, Reporting, Metrics governance |
| Quality Improvement | Retrospectives, Process improvement, Maturity model |
| Quality Training | Skills development, Certification, Competency frameworks |
| Quality Policies | Standards, Procedures, Guidelines, Work instructions |
| Quality Metrics | Definitions, Targets, Thresholds, Dashboards |

#### 1.3.2 Out of Scope

| Area | Rationale |
|------|-----------|
| Product roadmap decisions | Product Owner and business authority |
| Technical architecture decisions | Technical Lead and Architecture Board authority |
| Budget allocation | Finance and programme sponsor authority |
| Personnel decisions | HR and management authority |
| Infrastructure operations | SRE/DevOps per Batch 11 standards |

### 1.4 Intended Audience

| Audience | Governance Role |
|----------|-----------------|
| Quality Board Members | Governance oversight and decision-making |
| QA Lead | Governance execution and coordination |
| Quality Champions | Quality advocacy and enforcement |
| QA Engineers | Quality process execution |
| Delivery Lead | Delivery governance alignment |
| Product Owner | Quality acceptance authority |
| Programme Sponsor | Escalation and strategic oversight |
| Compliance Officers | Regulatory compliance oversight |

---

## 2. Definitions & Terminology

### 2.1 Core Governance Terms

| Term | Definition |
|------|------------|
| **Quality Governance** | The framework of policies, processes, roles, and decision-making structures that direct and control quality activities |
| **Quality Board** | The governing body responsible for quality oversight, policy direction, and major quality decisions |
| **Quality Gate** | A mandatory checkpoint at which quality criteria must be met before progression to the next phase |
| **RACI Matrix** | A responsibility assignment matrix: Responsible, Accountable, Consulted, Informed |
| **Escalation** | The process of raising issues to a higher authority when they cannot be resolved at the current level |
| **Audit Trail** | A chronological record of quality decisions, activities, and evidence |
| **Quality Policy** | A high-level statement of the organisation's quality intentions and direction |
| **Quality Standard** | A documented set of mandatory requirements for quality activities |
| **Compliance** | Adherence to quality policies, standards, and regulatory requirements |
| **Continuous Improvement** | Ongoing effort to enhance quality processes, products, and outcomes |
| **Quality Maturity** | A measure of the sophistication and effectiveness of quality processes |
| **Quality Champion** | An individual who advocates for quality within their team or function |
| **Quality Gate Review** | An assessment conducted at a quality gate to evaluate readiness for progression |
| **Retrospective** | A structured reflection on completed work to identify improvements |
| **Definition of Done (DoD)** | A shared checklist that defines when a user story or sprint increment is complete |
| **Definition of Ready (DoR)** | A shared checklist that defines when a user story is ready to enter a sprint |

### 2.2 Acronym Reference

| Acronym | Full Form |
|---------|-----------|
| MAP | Migration Assurance Platform |
| QMS | Quality Management System |
| QA | Quality Assurance |
| QC | Quality Control |
| RACI | Responsible, Accountable, Consulted, Informed |
| SLA | Service Level Agreement |
| KPI | Key Performance Indicator |
| MTTR | Mean Time to Resolve |
| MTTD | Mean Time to Detect |
| DOD | Definition of Done |
| DOR | Definition of Ready |
| CI/CD | Continuous Integration / Continuous Deployment |
| ISO | International Organization for Standardization |
| OWASP | Open Web Application Security Project |
| WCAG | Web Content Accessibility Guidelines |
| ISTQB | International Software Testing Qualifications Board |

---

## 3. Quality Governance Structure

### 3.1 Governance Hierarchy

```text
Programme Sponsor
        |
  Quality Board
        |
  QA Lead
        |
  Quality Champions
        |
  QA Engineers
        |
  Development Team
```

### 3.2 Three Lines of Defence Model

| Line | Function | Quality Role | Responsibility |
|------|----------|-------------|----------------|
| **First Line** | Delivery Teams | Quality Champions, Developers | Own quality at source; build quality in; execute quality activities |
| **Second Line** | Quality Function | QA Lead, QA Engineers | Design quality processes; monitor compliance; provide quality assurance |
| **Third Line** | Independent Oversight | Quality Board, Audit | Independent assurance; governance oversight; strategic direction |

### 3.3 Governance Model

| Level | Forum | Chair | Frequency | Scope |
|-------|-------|-------|-----------|-------|
| **Strategic** | Quality Board | Programme Sponsor | Monthly | Quality strategy, policy, investment, risk |
| **Tactical** | Quality Review Meeting | QA Lead | Weekly | Quality progress, metrics, issues, improvements |
| **Operational** | Sprint Quality Review | Quality Champion | Daily | Sprint quality activities, defects, test execution |
| **Compliance** | Quality Audit | QA Lead / External Auditor | Quarterly | Compliance, audit findings, corrective actions |

### 3.4 Governance Principles

| # | Principle | Description |
|---|-----------|-------------|
| GP1 | Clear Authority | Every quality decision has a single accountable owner |
| GP2 | Evidence-Based | All quality decisions supported by data and evidence |
| GP3 | Risk-Proportionate | Governance intensity proportional to quality risk |
| GP4 | Transparent | Quality information visible to all relevant stakeholders |
| GP5 | Auditable | All quality decisions create a traceable audit trail |
| GP6 | Continuously Improved | Governance framework itself is subject to improvement |
| GP7 | Aligned with Delivery | Quality governance integrated into delivery methodology |
| GP8 | Regulatory Compliant | Quality governance meets all regulatory requirements |

---

## 4. Quality Board

### 4.1 Board Composition

| Role | Representative | Voting | Term |
|------|---------------|--------|------|
| **Chair** | Programme Sponsor | Yes (tie-break) | Permanent |
| **Quality Director** | QA Lead | Yes | Permanent |
| **Delivery Representative** | Delivery Lead | Yes | Annual |
| **Product Representative** | Product Owner | Yes | Annual |
| **Technical Representative** | Technical Lead | Yes | Annual |
| **Operations Representative** | Ops Lead | Yes | Annual |
| **Compliance Representative** | Compliance Officer | Advisory | Permanent |
| **Customer Representative** | Customer Success Lead | Advisory | Annual |

### 4.2 Board Responsibilities

| # | Responsibility | Description |
|---|----------------|-------------|
| BR1 | Quality Strategy | Define and approve the quality strategy and policy |
| BR2 | Quality Investment | Approve quality investment and resource allocation |
| BR3 | Quality Risk | Identify, assess, and mitigate quality risks |
| BR4 | Quality Standards | Define and maintain quality standards |
| BR5 | Quality Metrics | Approve quality metrics, targets, and thresholds |
| BR6 | Release Decisions | Make Go/No-Go release decisions for critical releases |
| BR7 | Quality Compliance | Ensure compliance with regulatory requirements |
| BR8 | Quality Improvement | Approve quality improvement initiatives |
| BR9 | Dispute Resolution | Resolve escalated quality disputes |
| BR10 | Governance Review | Review and update the governance framework |

### 4.3 Board Operating Procedures

#### 4.3.1 Meeting Schedule

| Meeting Type | Frequency | Duration | Attendees |
|--------------|-----------|----------|-----------|
| Regular Board Meeting | Monthly | 90 minutes | All board members |
| Emergency Board Meeting | As needed | 60 minutes | Available board members |
| Strategy Session | Quarterly | Half day | All board members + extended team |
| Annual Quality Review | Annually | Full day | All board members + stakeholders |

#### 4.3.2 Quorum Rules

| Meeting Type | Quorum Requirement |
|--------------|--------------------|
| Regular Board Meeting | Chair + 3 voting members (50% + 1) |
| Emergency Board Meeting | Chair + 2 voting members |
| Release Decision | Chair + 4 voting members |
| Policy Approval | Chair + 4 voting members |

#### 4.3.3 Decision-Making

| Decision Type | Voting Requirement | Escalation Path |
|---------------|-------------------|-----------------|
| Operational Quality | Simple majority | QA Lead authority |
| Tactical Quality | Simple majority | Quality Board |
| Strategic Quality | 2/3 majority | Programme Sponsor |
| Policy Change | 2/3 majority | Programme Board |
| Release Go/No-Go | Chair + 3 voting members | Programme Sponsor |
| Emergency Quality | Available members | Programme Sponsor within 24h |

### 4.4 Board Authority Limits

| Authority Level | Decision Limit | Approval Required |
|----------------|----------------|-------------------|
| QA Lead | Tactical decisions, Sprint quality | Quality Board notification |
| Quality Board | Strategic decisions, Policy changes | Programme Sponsor notification |
| Programme Sponsor | Emergency override, Budget > threshold | Board ratification |
| Programme Board | Governance framework changes | Board recommendation |

---

## 5. Quality Roles & Responsibilities

### 5.1 Quality Board

| Aspect | Description |
|--------|-------------|
| **Purpose** | Strategic quality oversight and decision-making |
| **Scope** | Enterprise-wide quality governance |
| **Authority** | Quality policy, standards, investment, release decisions |
| **Reports To** | Programme Board |
| **Meeting Frequency** | Monthly (minimum) |
| **Key Deliverables** | Quality strategy, Quality policy, Quality metrics framework, Release decisions |

### 5.2 QA Lead

| Aspect | Description |
|--------|-------------|
| **Purpose** | Lead quality function; execute quality governance |
| **Scope** | All quality activities across MAP |
| **Authority** | Tactical quality decisions, Process design, Team management |
| **Reports To** | Quality Board / Programme Sponsor |
| **Meeting Frequency** | Daily standup, Weekly review, Monthly board |
| **Key Deliverables** | Quality plans, Quality reports, Governance documentation, Audit coordination |

| Responsibility | Detail |
|----------------|--------|
| Strategy Execution | Translate quality strategy into actionable plans |
| Process Design | Design and maintain quality processes and standards |
| Team Leadership | Lead and develop the quality team |
| Metrics Management | Define, collect, and report quality metrics |
| Governance Execution | Run governance forums, maintain governance records |
| Stakeholder Management | Communicate quality status to stakeholders |
| Risk Management | Identify and manage quality risks |
| Compliance Oversight | Ensure compliance with quality standards and regulations |
| Audit Coordination | Coordinate internal and external quality audits |
| Continuous Improvement | Drive quality process improvement |

### 5.3 Quality Champions

| Aspect | Description |
|--------|-------------|
| **Purpose** | Advocate quality within delivery teams |
| **Scope** | Assigned delivery team's quality activities |
| **Authority** | Team-level quality decisions, Sprint quality gates |
| **Reports To** | QA Lead (dotted), Delivery Lead (solid) |
| **Meeting Frequency** | Daily standup, Weekly champion meeting |
| **Key Deliverables** | Team quality reports, Quality risk identification, Process compliance |

| Responsibility | Detail |
|----------------|--------|
| Quality Advocacy | Promote quality culture within the team |
| Quality Coaching | Coach team members on quality practices |
| Quality Monitoring | Monitor team quality activities and metrics |
| Quality Reporting | Report quality status to QA Lead |
| Quality Risk | Identify and escalate quality risks |
| Process Compliance | Ensure team follows quality processes |
| Defect Triage | Participate in defect triage for team defects |
| Retrospective Input | Drive quality improvement actions in retrospectives |

### 5.4 QA Engineers

| Aspect | Description |
|--------|-------------|
| **Purpose** | Execute quality activities; provide quality assurance |
| **Scope** | Assigned testing and quality activities |
| **Authority** | Test design decisions, Defect classification |
| **Reports To** | QA Lead |
| **Meeting Frequency** | Daily standup, Sprint ceremonies |
| **Key Deliverables** | Test plans, Test cases, Test reports, Defect reports |

| Responsibility | Detail |
|----------------|--------|
| Test Planning | Create and maintain test plans |
| Test Design | Design test cases and test data |
| Test Execution | Execute manual and automated tests |
| Defect Management | Log, classify, and verify defects |
| Automation | Develop and maintain automated tests |
| Reporting | Generate test execution and coverage reports |
| Quality Analysis | Analyse quality trends and patterns |
| Environment Management | Coordinate test environment needs |
| Documentation | Maintain test documentation standards |
| Knowledge Sharing | Share quality knowledge with the team |

### 5.5 Development Team

| Aspect | Description |
|--------|-------------|
| **Purpose** | Build quality into the product |
| **Scope** | Code quality, Unit testing, Integration testing |
| **Authority** | Technical quality decisions within standards |
| **Reports To** | Delivery Lead |
| **Meeting Frequency** | Daily standup, Sprint ceremonies |
| **Key Deliverables** | Unit tests, Code reviews, Integration tests |

| Responsibility | Detail |
|----------------|--------|
| Unit Testing | Write and maintain unit tests |
| Code Review | Participate in peer code reviews |
| Integration Testing | Write and execute integration tests |
| Code Quality | Maintain code quality standards |
| Static Analysis | Run and resolve static analysis findings |
| Defect Resolution | Fix assigned defects within SLA |
| Quality Awareness | Apply quality practices in daily work |
| Documentation | Maintain technical documentation |

---

## 6. RACI Matrix for Quality Activities

### 6.1 Strategic Quality Activities

| Activity | Quality Board | QA Lead | Quality Champion | QA Engineer | Dev Lead | Product Owner |
|----------|:------------:|:-------:|:----------------:|:-----------:|:--------:|:-------------:|
| Quality Strategy Definition | **A** | R | C | C | C | C |
| Quality Policy Approval | **A** | R | I | I | C | C |
| Quality Budget Allocation | **A** | R | I | I | I | I |
| Quality Risk Assessment | I | **A** | C | C | C | C |
| Quality Standards Definition | **A** | R | C | C | C | I |
| Regulatory Compliance Oversight | **A** | R | I | I | I | I |
| Quality Investment Decisions | **A** | R | I | I | I | C |
| Governance Framework Approval | **A** | R | I | I | C | C |

### 6.2 Tactical Quality Activities

| Activity | Quality Board | QA Lead | Quality Champion | QA Engineer | Dev Lead | Product Owner |
|----------|:------------:|:-------:|:----------------:|:-----------:|:--------:|:-------------:|
| Test Strategy Development | I | **A** | C | R | C | C |
| Test Plan Creation | I | **A** | C | R | C | C |
| Test Case Design | I | I | C | **R** | I | I |
| Test Execution | I | **A** | C | R | I | I |
| Defect Triage | I | **A** | C | R | R | C |
| Defect Resolution | I | I | I | I | **A** | I |
| Defect Verification | I | **A** | C | R | I | I |
| Test Automation | I | **A** | C | R | C | I |
| Test Environment Management | I | **A** | I | R | C | I |
| Test Data Management | I | **A** | I | R | C | I |
| Code Review | I | I | I | C | **A** | I |
| Static Analysis | I | I | I | C | **A** | I |
| Performance Testing | I | **A** | I | R | C | C |
| Security Testing | I | **A** | I | R | C | C |
| Accessibility Testing | I | **A** | I | R | C | C |

### 6.3 Release Quality Activities

| Activity | Quality Board | QA Lead | Quality Champion | QA Engineer | Dev Lead | Product Owner |
|----------|:------------:|:-------:|:----------------:|:-----------:|:--------:|:-------------:|
| Release Readiness Assessment | C | **A** | C | R | C | R |
| Go/No-Go Decision | **A** | R | I | C | R | R |
| Release Notes Preparation | I | **A** | I | R | R | C |
| Deployment Validation | I | **A** | C | R | C | I |
| Smoke Test Execution | I | **A** | I | R | I | I |
| Production Validation | I | **A** | I | R | C | I |
| Rollback Decision | C | R | I | C | **A** | R |
| Post-Release Review | I | **A** | C | R | C | C |

### 6.4 Compliance & Audit Activities

| Activity | Quality Board | QA Lead | Quality Champion | QA Engineer | Dev Lead | Product Owner |
|----------|:------------:|:-------:|:----------------:|:-----------:|:--------:|:-------------:|
| Quality Audit Planning | **A** | R | I | I | I | I |
| Internal Quality Audit | I | **A** | C | R | C | I |
| External Quality Audit | **A** | R | I | C | C | I |
| Compliance Monitoring | I | **A** | C | R | I | I |
| Non-Conformance Management | I | **A** | C | R | C | I |
| Corrective Action Tracking | I | **A** | C | R | C | I |
| Evidence Collection | I | **A** | C | R | C | I |
| Audit Report Generation | I | **A** | I | R | I | I |
| Regulatory Reporting | **A** | R | I | I | I | I |

### 6.5 Continuous Improvement Activities

| Activity | Quality Board | QA Lead | Quality Champion | QA Engineer | Dev Lead | Product Owner |
|----------|:------------:|:-------:|:----------------:|:-----------:|:--------:|:-------------:|
| Retrospective Facilitation | I | **A** | R | C | C | C |
| Improvement Action Tracking | I | **A** | R | C | C | C |
| Process Improvement Proposals | I | **A** | R | R | C | C |
| Maturity Assessment | **A** | R | C | C | C | C |
| Best Practice Documentation | I | **A** | C | R | C | I |
| Knowledge Management | I | **A** | R | R | C | I |
| Training Programme Development | **A** | R | C | C | I | I |
| Lessons Learned | I | **A** | R | C | C | C |

### 6.6 RACI Assignment Rules

| Rule | Description |
|------|-------------|
| **One Accountable** | Each activity must have exactly one Accountable person |
| **Minimum Responsible** | At least one person must be assigned as Responsible |
| **Consulted First** | Consulted parties must be engaged before decisions are made |
| **Informed Promptly** | Informed parties must receive timely updates |
| **No Blanks** | Every cell must have at least one assignment (R, A, C, or I) |
| **No Overload** | No individual should be Accountable for more than 5 concurrent activities |

---

## 7. Quality Gates & Approval Process

### 7.1 Quality Gate Framework

#### 7.1.1 Gate Definitions

| Gate ID | Gate Name | Phase | Purpose |
|---------|-----------|-------|---------|
| G0 | DoR Gate | Sprint Entry | Ensure user stories are ready for development |
| G1 | Requirements Gate | Discovery | Confirm requirements are complete and testable |
| G2 | Design Gate | Design | Confirm architecture and design are approved |
| G3 | Code Quality Gate | Development | Confirm code meets quality standards |
| G4 | Test Execution Gate | Testing | Confirm testing is complete and passed |
| G5 | UAT Gate | UAT | Confirm business acceptance |
| G6 | Release Gate | Release | Confirm release readiness |
| G7 | Production Gate | Operations | Confirm production validation complete |

#### 7.1.2 Gate Criteria Detail

**G0 — DoR Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G0.1 | User story follows INVEST principles | Checklist completed | Quality Champion |
| G0.2 | Acceptance criteria defined | AC documented in story | Quality Champion |
| G0.3 | Test conditions identified | Test conditions listed | QA Engineer |
| G0.4 | Dependencies identified | Dependency register | Delivery Lead |
| G0.5 | Estimation complete | Story points assigned | Dev Lead |

**G1 — Requirements Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G1.1 | Requirements traceability complete | Requirements matrix | QA Lead |
| G1.2 | Acceptance criteria approved | AC review sign-off | Product Owner |
| G1.3 | Non-functional requirements defined | NFR document | Technical Lead |
| G1.4 | Test strategy approved | Test strategy document | QA Lead |
| G1.5 | Compliance requirements identified | Compliance checklist | Compliance Officer |

**G2 — Design Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G2.1 | Architecture design reviewed | Architecture review record | Technical Lead |
| G2.2 | Security design approved | Security review record | Security Lead |
| G2.3 | Performance requirements addressed | Performance design spec | Performance Engineer |
| G2.4 | Accessibility design addressed | Accessibility design spec | QA Lead |
| G2.5 | Test design approved | Test design document | QA Lead |

**G3 — Code Quality Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G3.1 | Code review complete | Pull request approved | Dev Lead |
| G3.2 | Unit tests written and passing | Unit test results | Dev Lead |
| G3.3 | Code coverage meets target | Coverage report | QA Lead |
| G3.4 | Static analysis clean | Analysis report | Dev Lead |
| G3.5 | No open P1/P2 defects | Defect report | QA Lead |
| G3.6 | Integration tests passing | Integration test results | QA Lead |

**G4 — Test Execution Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G4.1 | All test cases executed | Test execution report | QA Lead |
| G4.2 | Pass rate meets target (≥95%) | Test summary report | QA Lead |
| G4.3 | No open P1/P2 defects | Defect report | QA Lead |
| G4.4 | Test coverage targets met | Coverage report | QA Lead |
| G4.5 | Regression tests complete | Regression results | QA Lead |
| G4.6 | Performance tests passed | Performance report | Performance Engineer |

**G5 — UAT Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G5.1 | UAT scenarios executed | UAT execution report | Product Owner |
| G5.2 | Business validation complete | Business sign-off | Product Owner |
| G5.3 | User acceptance confirmed | UAT sign-off form | Product Owner |
| G5.4 | No open business defects | Defect report | Product Owner |
| G5.5 | Documentation updated | Documentation review | QA Lead |

**G6 — Release Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G6.1 | All previous gates passed | Gate checklist | QA Lead |
| G6.2 | Release notes prepared | Release notes document | QA Lead |
| G6.3 | Rollback plan tested | Rollback test results | DevOps Lead |
| G6.4 | Deployment checklist complete | Deployment checklist | DevOps Lead |
| G6.5 | Monitoring configured | Monitoring setup confirmation | Ops Lead |
| G6.6 | Go/No-Go decision made | Go/No-Go record | Release Manager |

**G7 — Production Gate**

| Criterion | Criteria | Evidence Required | Approver |
|-----------|----------|-------------------|----------|
| G7.1 | Smoke tests passed | Smoke test results | QA Lead |
| G7.2 | Production validation complete | Validation report | QA Lead |
| G7.3 | No production incidents | Incident report | Ops Lead |
| G7.4 | Performance baseline met | Production metrics | Performance Engineer |
| G7.5 | Monitoring active and alerting | Monitoring dashboard | Ops Lead |
| G7.6 | Post-deployment review complete | Review record | QA Lead |

### 7.2 Gate Review Process

```text
Submit Gate Evidence
        |
Gate Review Scheduled (within 2 business days)
        |
Gate Review Conducted
        |
   [Pass] ---[Conditional Pass] --- [Fail]
    |              |                    |
Proceed to      Proceed with        Remediation
Next Gate       Conditions          Required
                Tracked             |
                              Re-Review
                              Scheduled
```

### 7.3 Gate Review Documentation

| Document | Purpose | Maintained By |
|----------|---------|---------------|
| Gate Checklist | Track gate criteria completion | QA Engineer |
| Gate Review Record | Document gate review decision | QA Lead |
| Gate Exception Log | Track any gate waivers or exceptions | QA Lead |
| Gate Metrics | Track gate pass/fail rates | QA Lead |

---

## 8. Decision Authority Framework

### 8.1 Decision Matrix

| Decision Type | Low Risk | Medium Risk | High Risk | Critical Risk |
|---------------|----------|-------------|-----------|---------------|
| **Test Approach** | QA Engineer | QA Lead | Quality Board | Programme Sponsor |
| **Defect Resolution** | QA Engineer | QA Lead | Quality Board | Programme Sponsor |
| **Release Go/No-Go** | QA Lead | Quality Board | Programme Sponsor | Programme Board |
| **Quality Waiver** | QA Lead | Quality Board | Programme Sponsor | Programme Board |
| **Process Change** | QA Lead | Quality Board | Programme Sponsor | Programme Board |
| **Budget Reallocation** | QA Lead | Quality Board | Programme Sponsor | Programme Board |
| **Policy Exception** | Quality Board | Programme Sponsor | Programme Board | Board of Directors |

### 8.2 Risk Classification

| Risk Level | Impact | Probability | Examples |
|------------|--------|-------------|----------|
| **Low** | Minimal impact, easily reversible | < 20% | Minor test approach change, Low-priority defect |
| **Medium** | Moderate impact, reversible with effort | 20-50% | Test environment issue, Medium-priority defect |
| **High** | Significant impact, partially reversible | 50-80% | Critical path defect, Performance issue |
| **Critical** | Severe impact, irreversible | > 80% | Data integrity issue, Security breach, Regulatory violation |

### 8.3 Decision Record Template

| Field | Description |
|-------|-------------|
| **Decision ID** | Unique identifier (QD-YYYY-NNN) |
| **Decision Date** | Date the decision was made |
| **Decision Maker** | Individual who made the decision |
| **Decision Type** | Category of decision |
| **Risk Level** | Low / Medium / High / Critical |
| **Decision** | The decision made |
| **Rationale** | Reasoning behind the decision |
| **Alternatives Considered** | Other options evaluated |
| **Impact** | Expected impact of the decision |
| **Review Date** | Date for decision review |
| **Evidence** | Supporting evidence and data |

### 8.4 Delegation of Authority

| Authority | Primary Holder | Delegated To | Conditions |
|-----------|---------------|--------------|------------|
| Sprint Quality Approval | QA Lead | Quality Champion | During QA Lead absence |
| Defect Triage (P3/P4) | QA Lead | Quality Champion | Within defined criteria |
| Test Approach Approval | QA Lead | Senior QA Engineer | For well-understood features |
| Gate Review (G0-G3) | QA Lead | Quality Champion | With QA Lead oversight |
| Release Readiness | Quality Board | QA Lead | With Quality Board notification |
| Emergency Quality Decision | Quality Board | QA Lead | With post-hoc ratification |

---

## 9. Escalation Procedures

### 9.1 Escalation Levels

| Level | Escalation Path | Trigger | Response Time |
|-------|----------------|---------|---------------|
| **Level 1** | QA Engineer → QA Lead | Issue cannot be resolved within team | 4 hours |
| **Level 2** | QA Lead → Quality Board | Issue requires cross-team coordination | 24 hours |
| **Level 3** | Quality Board → Programme Sponsor | Issue requires strategic decision | 48 hours |
| **Level 4** | Programme Sponsor → Programme Board | Issue requires executive decision | 5 business days |
| **Level 5** | Programme Board → Board of Directors | Issue requires governance intervention | Next board meeting |

### 9.2 Escalation Triggers

| Trigger | Escalation Level | Action Required |
|---------|------------------|-----------------|
| Open P1 defect > 4 hours | Level 2 | Immediate escalation to QA Lead |
| Open P2 defect > 24 hours | Level 2 | Escalation to QA Lead |
| Gate review failure | Level 2 | QA Lead convenes review |
| Release blocker identified | Level 3 | Quality Board convened |
| Regulatory compliance breach | Level 4 | Programme Sponsor notified |
| Data integrity issue | Level 3 | Quality Board convened |
| Security vulnerability (Critical) | Level 3 | Quality Board convened |
| Quality budget overrun > 10% | Level 3 | Quality Board review |
| Quality metric below threshold for 2 sprints | Level 2 | Quality Board review |
| Customer quality complaint | Level 2 | QA Lead investigates |
| Audit non-conformance | Level 2 | QA Lead manages |
| Repeated quality gate failures | Level 3 | Quality Board review |

### 9.3 Escalation Record Template

| Field | Description |
|-------|-------------|
| **Escalation ID** | Unique identifier (ESC-YYYY-NNN) |
| **Date/Time** | When the escalation was raised |
| **Raised By** | Individual raising the escalation |
| **Escalated To** | Individual being escalated to |
| **Level** | Escalation level (1-5) |
| **Trigger** | What triggered the escalation |
| **Description** | Detailed description of the issue |
| **Impact** | Impact if not resolved |
| **Urgency** | Urgency level (Low/Medium/High/Critical) |
| **Resolution** | How the issue was resolved |
| **Resolution Date** | When the issue was resolved |
| **Root Cause** | Root cause analysis |
| **Preventive Action** | Actions to prevent recurrence |

### 9.4 Escalation Communication Matrix

| Escalation Level | Notification Recipients | Communication Method | Update Frequency |
|------------------|------------------------|---------------------|-----------------|
| Level 1 | QA Lead | Direct communication | As needed |
| Level 2 | Quality Board, Delivery Lead | Email + Slack | Every 4 hours |
| Level 3 | Programme Sponsor, Quality Board | Email + Meeting | Daily |
| Level 4 | Programme Board, Programme Sponsor | Formal report + Meeting | Daily |
| Level 5 | Board of Directors, Programme Board | Formal report + Meeting | As required |

---

## 10. Audit Trail & Compliance

### 10.1 Quality Audit Framework

#### 10.1.1 Audit Types

| Audit Type | Frequency | Scope | Conducted By |
|------------|-----------|-------|--------------|
| **Process Audit** | Monthly | Quality process compliance | QA Lead |
| **Product Audit** | Per release | Product quality attributes | QA Engineer |
| **System Audit** | Quarterly | QMS effectiveness | Internal Audit |
| **Compliance Audit** | Semi-annually | Regulatory compliance | External Auditor |
| **Management Review** | Annually | Quality management system | Quality Board |

#### 10.1.2 Audit Process

```text
Audit Planning
      |
Audit Preparation (scope, checklist, team)
      |
Audit Execution (evidence collection)
      |
Audit Findings (non-conformances, observations)
      |
Audit Report (findings, recommendations)
      |
Corrective Actions (root cause, action plan)
      |
Verification (action effectiveness)
      |
Close Audit
```

### 10.2 Evidence Management

#### 10.2.1 Evidence Types

| Evidence Type | Description | Retention Period | Storage |
|---------------|-------------|------------------|---------|
| **Test Evidence** | Test execution results, screenshots, logs | 7 years | QA Repository |
| **Defect Evidence** | Defect reports, resolution records | 7 years | Defect Tracking System |
| **Review Evidence** | Code review records, design review records | 7 years | Code Repository |
| **Approval Evidence** | Quality gate approvals, release approvals | 7 years | Governance Repository |
| **Audit Evidence** | Audit reports, corrective action records | 10 years | Compliance Repository |
| **Training Evidence** | Training records, certification records | Employment + 3 years | HR System |
| **Metrics Evidence** | Quality metrics, trend data, dashboards | 7 years | Metrics Repository |

#### 10.2.2 Evidence Standards

| Standard | Requirement |
|----------|-------------|
| **Completeness** | Evidence must fully support the claim or decision |
| **Accuracy** | Evidence must be factually correct and verifiable |
| **Timeliness** | Evidence must be captured at the time of the activity |
| **Authenticity** | Evidence must be attributable to the person who created it |
| **Integrity** | Evidence must not be altered after capture |
| **Accessibility** | Evidence must be retrievable when needed |
| **Confidentiality** | Evidence must be protected based on classification |

### 10.3 Compliance Requirements

#### 10.3.1 Regulatory Compliance

| Regulation | Quality Requirement | Compliance Evidence |
|------------|---------------------|---------------------|
| **Financial Services Regulations** | Data integrity, Audit trails | Migration validation reports, Audit logs |
| **GDPR** | Data protection, Privacy by design | Privacy impact assessments, Data handling records |
| **ISO 9001:2015** | Quality management system | QMS documentation, Audit records |
| **ISO 27001** | Information security management | Security audit records, Risk assessments |
| **SOX** | Internal controls, Financial reporting | Control testing records, Audit trails |

#### 10.3.2 Quality Standards Compliance

| Standard | Requirement | Compliance Mechanism |
|----------|-------------|---------------------|
| **ISTQB** | Testing terminology, Processes | Test documentation standards |
| **OWASP** | Security testing, Vulnerability management | Security testing procedures |
| **WCAG 2.1** | Accessibility requirements | Accessibility testing standards |
| **ISO/IEC 25010** | Product quality model | Quality metrics framework |

### 10.4 Non-Conformance Management

| Step | Action | Responsibility | Timeline |
|------|--------|---------------|----------|
| 1 | Identify non-conformance | Any team member | Immediate |
| 2 | Record non-conformance | QA Lead | Within 24 hours |
| 3 | Assess severity | QA Lead | Within 24 hours |
| 4 | Investigate root cause | QA Lead + relevant team | Within 5 business days |
| 5 | Develop corrective action plan | QA Lead | Within 10 business days |
| 6 | Implement corrective actions | Assigned owner | Per plan |
| 7 | Verify effectiveness | QA Lead | Within 30 days |
| 8 | Close non-conformance | QA Lead | After verification |

### 10.5 Quality Record Management

| Record Type | Owner | Retention | Disposal |
|-------------|-------|-----------|----------|
| Quality Plans | QA Lead | Current + 3 years | Archive |
| Test Plans | QA Lead | Current + 3 years | Archive |
| Test Reports | QA Engineer | Current + 3 years | Archive |
| Defect Records | QA Lead | Current + 7 years | Secure delete |
| Audit Records | QA Lead | Current + 10 years | Secure delete |
| Gate Review Records | QA Lead | Current + 7 years | Archive |
| Training Records | QA Lead | Current + 3 years | Archive |
| Metrics Reports | QA Lead | Current + 7 years | Archive |

---

## 11. Review Cadence

### 11.1 Daily Reviews

| Review | Timing | Participants | Purpose | Output |
|--------|--------|-------------|---------|--------|
| **Daily Quality Standup** | 09:15 | QA Team | Daily quality status | Updated board |
| **Sprint Quality Board** | During standup | Scrum Team | Quality risks in sprint | Risk register update |
| **Defect Triage** | 10:00 | QA Lead + Dev Lead | Triage new defects | Updated defect priorities |
| **Quality Dashboard Review** | 16:00 | QA Lead | End-of-day quality check | Dashboard refresh |

### 11.2 Weekly Reviews

| Review | Timing | Participants | Purpose | Output |
|--------|--------|-------------|---------|--------|
| **Weekly Quality Review** | Monday 14:00 | QA Team + Quality Champions | Week ahead planning | Weekly quality plan |
| **Quality Metrics Review** | Wednesday 10:00 | QA Lead + Delivery Lead | Metrics analysis | Metrics report |
| **Sprint Quality Health Check** | Thursday 14:00 | Scrum Team | Sprint quality health | Quality status update |
| **Champion Sync** | Friday 11:00 | Quality Champions | Cross-team quality alignment | Champion report |
| **Quality Risk Review** | Friday 15:00 | QA Lead | Quality risk assessment | Updated risk register |

### 11.3 Monthly Reviews

| Review | Timing | Participants | Purpose | Output |
|--------|--------|-------------|---------|--------|
| **Quality Board Meeting** | First Tuesday 10:00 | Quality Board | Strategic quality governance | Board minutes |
| **Quality Performance Review** | Second Monday 14:00 | QA Team + Delivery Leads | Monthly quality performance | Monthly quality report |
| **Quality Audit Review** | Third Tuesday 10:00 | QA Lead + Internal Audit | Audit findings review | Audit action tracker |
| **Quality Trend Analysis** | Last Thursday 14:00 | QA Lead | Monthly quality trends | Trend analysis report |
| **Quality Champions Workshop** | Last Friday 10:00 | Quality Champions | Quality improvement workshop | Improvement actions |

### 11.4 Quarterly Reviews

| Review | Timing | Participants | Purpose | Output |
|--------|--------|-------------|---------|--------|
| **Quality Board Strategy Session** | Q1/Q2/Q3/Q4 start | Quality Board + Extended | Quarterly strategy review | Quarterly quality strategy |
| **Quality Maturity Assessment** | Q1/Q3 | QA Lead + External | Maturity evaluation | Maturity assessment report |
| **Quality Training Review** | Q2/Q4 | QA Lead + HR | Training effectiveness review | Training programme update |
| **Quality Compliance Review** | Q1/Q3 | QA Lead + Compliance | Compliance status review | Compliance report |
| **Quality Budget Review** | Q2/Q4 | QA Lead + Finance | Quality investment review | Budget status report |
| **Quality Retrospective** | End of quarter | QA Team | Quarterly quality improvement | Improvement action plan |

### 11.5 Annual Reviews

| Review | Timing | Participants | Purpose | Output |
|--------|--------|-------------|---------|--------|
| **Annual Quality Review** | January | Quality Board + Programme Board | Annual quality assessment | Annual quality report |
| **Quality Strategy Refresh** | February | Quality Board | Strategy update | Updated quality strategy |
| **Quality Policy Review** | March | Quality Board + Compliance | Policy review and update | Updated quality policy |
| **Quality Standards Review** | April | QA Team + Delivery Teams | Standards review | Updated standards |
| **Quality Metrics Review** | May | Quality Board + QA Lead | Metrics framework review | Updated metrics framework |
| **Quality Training Plan** | June | QA Lead + HR | Annual training plan | Training plan |

---

## 12. Continuous Improvement

### 12.1 Improvement Framework

```text
Identify Improvement Opportunity
        |
Root Cause Analysis
        |
Develop Improvement Proposal
        |
Evaluate and Prioritise
        |
Approve Improvement Action
        |
Implement Improvement
        |
Measure Impact
        |
Standardise if Effective
        |
Share Learnings
```

### 12.2 Retrospective Process

#### 12.2.1 Retrospective Types

| Type | Frequency | Scope | Facilitator | Participants |
|------|-----------|-------|-------------|--------------|
| **Sprint Retrospective** | End of sprint | Sprint quality activities | Quality Champion | Scrum Team |
| **Release Retrospective** | Post-release | Release quality process | QA Lead | Delivery Team |
| **Quality Team Retrospective** | Monthly | Quality team effectiveness | QA Lead | QA Team |
| **Quarterly Quality Retrospective** | Quarterly | Quality programme | QA Lead | Quality Board + Team |
| **Annual Quality Retrospective** | Annually | Quality strategy and governance | Quality Board | Extended Team |

#### 12.2.2 Retrospective Format

| Phase | Activity | Timebox |
|-------|----------|---------|
| **Set the Stage** | Establish purpose, ground rules | 5 minutes |
| **Gather Data** | Collect facts, metrics, observations | 15 minutes |
| **Generate Insights** | Analyse root causes, patterns | 20 minutes |
| **Decide What to Do** | Prioritise improvement actions | 15 minutes |
| **Close the Retrospective** | Summarise, assign owners, set follow-up | 5 minutes |

#### 12.2.3 Retrospective Action Tracking

| Field | Description |
|-------|-------------|
| **Action ID** | Unique identifier (RA-YYYY-NNN) |
| **Source** | Retrospective where action was identified |
| **Action** | Description of the improvement action |
| **Owner** | Individual responsible for implementing the action |
| **Due Date** | Target completion date |
| **Priority** | High / Medium / Low |
| **Status** | Open / In Progress / Completed / Deferred |
| **Impact** | Measured impact after implementation |

### 12.3 Process Improvement

#### 12.3.1 Improvement Sources

| Source | Collection Method | Review Frequency |
|--------|-------------------|------------------|
| **Retrospectives** | Action items from retrospectives | Per retrospective |
| **Quality Metrics** | Trend analysis, Anomaly detection | Monthly |
| **Audit Findings** | Non-conformances, Observations | Per audit |
| **Defect Analysis** | Root cause analysis, Pattern analysis | Monthly |
| **Customer Feedback** | Surveys, Complaints, Suggestions | Monthly |
| **Team Feedback** | 1:1s, Team meetings, Surveys | Quarterly |
| **Industry Benchmarks** | Best practice research | Quarterly |
| **Process Audits** | Process compliance assessments | Monthly |

#### 12.3.2 Improvement Prioritisation

| Priority | Criteria | Response Time |
|----------|----------|---------------|
| **Critical** | Regulatory impact, Data integrity risk | Immediate |
| **High** | Significant quality impact, Customer impact | Within 2 sprints |
| **Medium** | Moderate quality impact, Efficiency gain | Within 4 sprints |
| **Low** | Minor improvement, Nice to have | Backlog |

#### 12.3.3 Improvement Validation

| Step | Criteria | Evidence Required |
|------|----------|-------------------|
| **Implementation** | Action implemented as planned | Implementation record |
| **Effectiveness** | Measurable improvement achieved | Metrics comparison |
| **Sustainability** | Improvement sustained over time | Trend data |
| **Standardisation** | Process/standard updated if effective | Updated documentation |
| **Knowledge Transfer** | Learnings shared with team | Training/Knowledge record |

### 12.4 Quality Maturity Model

#### 12.4.1 Maturity Levels

| Level | Name | Description | Characteristics |
|-------|------|-------------|-----------------|
| **Level 1** | Initial | Ad-hoc quality processes | Inconsistent, Reactive, Individual heroics |
| **Level 2** | Managed | Basic quality processes defined | Repeatable, Project-level, Basic metrics |
| **Level 3** | Defined | Organisation-wide quality processes | Standardised, Proactive, Organisation metrics |
| **Level 4** | Quantitatively Managed | Quality measured and controlled | Data-driven, Predictive, Optimised |
| **Level 5** | Optimising | Continuous quality improvement | Innovative, Leading, Industry benchmark |

#### 12.4.2 Maturity Assessment Areas

| Area | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
|------|---------|---------|---------|---------|---------|
| **Quality Strategy** | None | Documented | Approved & communicated | Measured & reviewed | Continuously improved |
| **Quality Processes** | Ad-hoc | Defined | Standardised | Measured & controlled | Optimised |
| **Quality Metrics** | None | Basic | Comprehensive | Data-driven | Predictive |
| **Quality Automation** | None | Basic automation | Significant automation | Comprehensive automation | AI-assisted |
| **Quality Training** | None | Ad-hoc training | Structured programme | Skills matrix | Continuous learning |
| **Quality Culture** | Quality = QA | Quality = Team | Quality = Organisation | Quality = Value | Quality = Differentiator |
| **Quality Governance** | None | Basic oversight | Formal governance | Data-driven governance | Optimised governance |

#### 12.4.3 Maturity Assessment Process

| Step | Activity | Frequency |
|------|----------|-----------|
| 1 | Self-assessment by QA Lead | Quarterly |
| 2 | Independent assessment by Quality Board | Semi-annually |
| 3 | Gap analysis | After each assessment |
| 4 | Improvement plan development | After gap analysis |
| 5 | Improvement execution | Ongoing |
| 6 | Re-assessment | Semi-annually |

---

## 13. Quality Policies & Standards

### 13.1 Quality Policy

#### 13.1.1 Quality Policy Statement

MAP is committed to delivering the highest quality financial services migration validation engine through systematic quality management, continuous improvement, and a culture of quality ownership across all team members. We shall:

- Build quality into every phase of the software development lifecycle
- Meet or exceed all applicable regulatory and compliance requirements
- Continuously improve our quality processes and practices
- Invest in our people and their quality capabilities
- Measure, monitor, and report on quality transparently
- Ensure quality decisions are evidence-based and properly governed

#### 13.1.2 Quality Policy Scope

| Area | Coverage |
|------|----------|
| Product Quality | Functional correctness, Performance, Security, Accessibility, Usability |
| Process Quality | Development, Testing, Release, Operations |
| Service Quality | Customer support, Incident response, Communication |
| People Quality | Training, Skills development, Competency |
| Governance Quality | Decision-making, Accountability, Compliance |

### 13.2 Quality Standards

#### 13.2.1 Coding Standards

| Standard | Requirement | Enforcement |
|----------|-------------|-------------|
| **Code Style** | Follow agreed coding standards | Linting, Code review |
| **Code Coverage** | Minimum 80% unit test coverage | CI pipeline gate |
| **Code Review** | All changes reviewed before merge | Branch protection |
| **Static Analysis** | Zero critical/high findings | CI pipeline gate |
| **Documentation** | Code documented per standards | Code review |
| **Security** | No known vulnerabilities | Security scanning |

#### 13.2.2 Testing Standards

| Standard | Requirement | Enforcement |
|----------|-------------|-------------|
| **Test Coverage** | ≥95% regression automation | Automation metrics |
| **Test Design** | Tests designed per test design standards | Test review |
| **Test Execution** | ≥95% pass rate for release | Gate review |
| **Defect Management** | All defects logged and tracked | Defect tracking system |
| **Test Documentation** | Per Test Documentation Standards | Documentation review |
| **Test Data** | Per Test Data Management standards | Data review |

#### 13.2.3 Release Standards

| Standard | Requirement | Enforcement |
|----------|-------------|-------------|
| **Release Readiness** | All quality gates passed | Gate checklist |
| **Rollback Plan** | Tested and documented | Gate review |
| **Monitoring** | Active monitoring and alerting | Ops checklist |
| **Documentation** | Release notes and deployment guide | Release review |
| **Approval** | Formal Go/No-Go decision | Quality Board |
| **Post-Release** | Production validation complete | Gate review |

### 13.3 Quality Procedures

#### 13.3.1 Mandatory Procedures

| Procedure | Purpose | Reference |
|-----------|---------|-----------|
| Defect Management Procedure | Classify, assign, resolve, verify defects | Defect Management Framework |
| Test Execution Procedure | Execute, record, and report test results | Testing Strategy |
| Gate Review Procedure | Conduct and document quality gate reviews | Quality Gates Framework |
| Release Approval Procedure | Obtain and document release approval | Release Readiness Framework |
| Audit Procedure | Plan, conduct, and report quality audits | Audit Framework |
| Escalation Procedure | Escalate quality issues appropriately | Escalation Framework |
| Non-Conformance Procedure | Manage non-conformances to closure | Non-Conformance Framework |
| Continuous Improvement Procedure | Identify and implement improvements | Improvement Framework |

### 13.4 Quality Guidelines

| Guideline | Description | Application |
|-----------|-------------|-------------|
| **Shift-Left Testing** | Start testing as early as possible | All quality activities |
| **Risk-Based Testing** | Focus testing effort on highest risk areas | Test planning |
| **Test Automation First** | Automate tests where feasible | Test design |
| **Exploratory Testing** | Supplement automated testing with exploration | Sprint testing |
| **Peer Review** | All work products reviewed by peers | All work products |
| **Data-Driven Decisions** | Use metrics to drive quality decisions | All decisions |
| **Documentation as Code** | Version control documentation | All documentation |
| **Quality at Source** | Build quality in, don't inspect it in | Development |

---

## 14. Quality Reporting Framework

### 14.1 Executive Reporting

#### 14.1.1 Monthly Quality Dashboard

| Section | Content | Audience |
|---------|---------|----------|
| **Quality Summary** | Overall quality status, Trend, Highlights | Programme Sponsor, Quality Board |
| **Quality Scorecard** | KPIs vs targets, Red/Amber/Green status | Programme Sponsor, Quality Board |
| **Quality Risks** | Top quality risks, Mitigation status | Programme Sponsor, Quality Board |
| **Quality Investment** | Budget vs actual, ROI metrics | Programme Sponsor, Quality Board |
| **Regulatory Compliance** | Compliance status, Audit findings | Programme Sponsor, Compliance |
| **Recommendations** | Strategic recommendations, Decisions needed | Programme Sponsor, Quality Board |

#### 14.1.2 Quarterly Quality Report

| Section | Content | Audience |
|---------|---------|----------|
| **Executive Summary** | Quarter quality highlights, Key achievements | Programme Board |
| **Quality Metrics** | Detailed metrics analysis, Trends | Quality Board |
| **Quality Risks** | Risk register review, Emerging risks | Quality Board |
| **Quality Improvements** | Improvement actions and impact | Quality Board |
| **Quality Maturity** | Maturity assessment results | Quality Board |
| **Quality Strategy** | Strategy progress, Adjustments needed | Quality Board |
| **Forward Look** | Next quarter quality priorities | Quality Board |

#### 14.1.3 Annual Quality Report

| Section | Content | Audience |
|---------|---------|----------|
| **Year in Review** | Annual quality highlights, Key achievements | Programme Board |
| **Quality Performance** | Annual metrics analysis, Year-over-year trends | Programme Board |
| **Quality Strategy** | Strategy effectiveness, Adjustments | Programme Board |
| **Quality Maturity** | Maturity progress, Benchmark comparison | Programme Board |
| **Quality Investment** | Annual investment, ROI analysis | Programme Board |
| **Regulatory Compliance** | Compliance status, Audit outcomes | Programme Board |
| **Quality Roadmap** | Next year quality priorities, Initiatives | Programme Board |

### 14.2 Team Reporting

#### 14.2.1 Sprint Quality Report

| Section | Content | Audience |
|---------|---------|----------|
| **Test Execution** | Tests executed, Pass rate, Coverage | Scrum Team |
| **Defect Summary** | New, Resolved, Open defects | Scrum Team |
| **Quality Risks** | Sprint quality risks, Issues | Scrum Team |
| **Automation Status** | Automation progress, New automated tests | Scrum Team |
| **Quality Gate Status** | Gate status, Blockers | Scrum Team |

#### 14.2.2 Release Quality Report

| Section | Content | Audience |
|---------|---------|----------|
| **Release Summary** | Release scope, Key changes | All stakeholders |
| **Quality Summary** | Overall quality status for release | All stakeholders |
| **Test Results** | Test execution summary, Key findings | All stakeholders |
| **Defect Summary** | Defect summary for release | All stakeholders |
| **Known Issues** | Known issues, Workarounds | All stakeholders |
| **Quality Gate Status** | Gate pass/fail, Exceptions | All stakeholders |
| **Recommendations** | Go/No-Go recommendation | Quality Board |

#### 14.2.3 Weekly Quality Summary

| Section | Content | Audience |
|---------|---------|----------|
| **Week Summary** | Key quality activities, Achievements | QA Team, Delivery Leads |
| **Metrics Snapshot** | Key metrics vs targets | QA Team, Delivery Leads |
| **Risks & Issues** | Current quality risks and issues | QA Team, Delivery Leads |
| **Next Week Plan** | Quality activities planned for next week | QA Team, Delivery Leads |

### 14.3 Reporting Standards

| Standard | Requirement |
|----------|-------------|
| **Timeliness** | Reports delivered within 2 business days of due date |
| **Accuracy** | Data verified before publication |
| **Completeness** | All required sections populated |
| **Clarity** | Reports understandable by intended audience |
| **Consistency** | Consistent format and terminology |
| **Actionability** | Reports drive decisions and actions |
| **Accessibility** | Reports accessible to all intended recipients |

### 14.4 Report Distribution

| Report | Frequency | Distribution | Channel |
|--------|-----------|-------------|---------|
| Monthly Quality Dashboard | Monthly | Quality Board, Programme Sponsor | Email + SharePoint |
| Quarterly Quality Report | Quarterly | Programme Board | Formal meeting + Document |
| Annual Quality Report | Annually | Programme Board, Board of Directors | Formal meeting + Document |
| Sprint Quality Report | Per sprint | Scrum Team | Sprint review meeting |
| Release Quality Report | Per release | All stakeholders | Email + SharePoint |
| Weekly Quality Summary | Weekly | QA Team, Delivery Leads | Email + Slack |

---

## 15. Quality Training Programme

### 15.1 Training Strategy

#### 15.1.1 Training Objectives

| # | Objective | Success Measure |
|---|-----------|-----------------|
| TO1 | Ensure team members have required quality skills | Skills matrix completeness ≥ 95% |
| TO2 | Maintain quality certifications | All certifications current |
| TO3 | Develop quality leadership capabilities | Quality Champion programme completion |
| TO4 | Promote quality culture | Quality awareness survey scores ≥ 4.0/5 |
| TO5 | Support continuous improvement | Training applied in practice |

#### 15.1.2 Training Principles

| Principle | Description |
|-----------|-------------|
| **Role-Relevant** | Training aligned to role requirements |
| **Practical** | Training focused on practical application |
| **Measurable** | Training effectiveness measured |
| **Continuous** | Learning is ongoing, not one-time |
| **Accessible** | Training available to all who need it |
| **Certified** | Key skills certified where appropriate |

### 15.2 Training Programme

#### 15.2.1 Role-Based Training

| Role | Required Training | Certification | Renewal |
|------|-------------------|---------------|---------|
| **QA Lead** | Quality Management, Test Management, Leadership | ISTQB Advanced Test Manager | Annual |
| **QA Engineer** | Test Design, Test Automation, Defect Management | ISTQB Foundation | Biennial |
| **Test Automation Engineer** | Automation Frameworks, CI/CD, Tool-specific | ISTQB Test Automation Engineer | Biennial |
| **Quality Champion** | Quality Advocacy, Coaching, Metrics | Internal Quality Champion certification | Annual |
| **Developer** | Unit Testing, Code Quality, TDD | Internal Code Quality certification | Annual |
| **Product Owner** | UAT, Quality Acceptance, Defect Triage | Internal UAT certification | Annual |

#### 15.2.2 Quality Training Catalogue

| Training | Audience | Duration | Frequency | Delivery |
|----------|----------|----------|-----------|----------|
| **Quality Fundamentals** | All team members | 4 hours | Quarterly | Workshop |
| **Test Design Techniques** | QA Engineers, Developers | 8 hours | Quarterly | Workshop |
| **Test Automation** | QA Engineers, Automation Engineers | 16 hours | Bi-annually | Workshop |
| **Security Testing** | QA Engineers | 8 hours | Annually | Workshop |
| **Performance Testing** | QA Engineers, Performance Engineer | 8 hours | Annually | Workshop |
| **Accessibility Testing** | QA Engineers | 4 hours | Annually | Workshop |
| **Quality Metrics** | QA Lead, Quality Champions | 4 hours | Quarterly | Workshop |
| **Defect Management** | QA Engineers, Developers | 4 hours | Quarterly | Workshop |
| **Quality Governance** | QA Lead, Quality Champions | 4 hours | Annually | Workshop |
| **Quality Culture** | All team members | 2 hours | Quarterly | Awareness session |

### 15.3 Certification Framework

#### 15.3.1 Certification Requirements

| Level | Certification | Requirements | Validity |
|-------|--------------|--------------|----------|
| **Foundation** | ISTQB Foundation Level | Pass ISTQB Foundation exam | Lifetime |
| **Advanced** | ISTQB Advanced Level | Foundation + 3 years experience + exam | Lifetime |
| **Expert** | ISTQB Expert Level | Advanced + 5 years experience + exam | Lifetime |
| **Internal: Quality Champion** | MAP Quality Champion | Complete internal programme + assessment | 1 year |
| **Internal: Code Quality** | MAP Code Quality | Complete internal programme + assessment | 1 year |
| **Internal: UAT** | MAP UAT Certified | Complete internal programme + assessment | 1 year |

#### 15.3.2 Certification Tracking

| Field | Description |
|-------|-------------|
| **Employee** | Team member name |
| **Role** | Current role |
| **Certification** | Certification obtained |
| **Date Obtained** | Date certification was obtained |
| **Expiry Date** | Date certification expires (if applicable) |
| **Renewal Required** | Whether renewal is required |
| **Renewal Date** | Date renewal is due |
| **Status** | Current / Expired / Pending |

### 15.4 Skills Development

#### 15.4.1 Skills Matrix

| Skill Area | Foundation | Intermediate | Advanced | Expert |
|------------|:----------:|:------------:|:--------:|:------:|
| **Test Design** | Basic test case writing | Test design techniques | Complex scenario design | Test strategy design |
| **Test Automation** | Script writing | Framework usage | Framework development | Architecture design |
| **Security Testing** | Basic security checks | OWASP testing | Penetration testing | Security architecture |
| **Performance Testing** | Basic load testing | Performance analysis | Performance engineering | Capacity planning |
| **Accessibility Testing** | Basic WCAG checks | WCAG testing | Accessibility engineering | Accessibility architecture |
| **Data Quality** | Data validation | Data testing | Data engineering | Data architecture |
| **Quality Management** | Quality awareness | Quality processes | Quality strategy | Quality leadership |
| **Quality Metrics** | Basic metrics | Metrics analysis | Metrics design | Metrics strategy |

#### 15.4.2 Skills Development Plan Template

| Field | Description |
|-------|-------------|
| **Employee** | Team member name |
| **Current Level** | Current skill level per skills matrix |
| **Target Level** | Target skill level (role requirement or growth) |
| **Gap** | Gap between current and target level |
| **Development Actions** | Actions to close the gap (training, practice, mentoring) |
| **Timeline** | Expected completion date |
| **Evidence** | How the development will be evidenced |
| **Reviewer** | Who will review and validate the development |

### 15.5 Knowledge Management

#### 15.5.1 Knowledge Sharing Mechanisms

| Mechanism | Purpose | Frequency |
|-----------|---------|-----------|
| **Quality Community of Practice** | Share quality knowledge across teams | Monthly |
| **Quality Brown Bag Sessions** | Short presentations on quality topics | Bi-weekly |
| **Quality Newsletter** | Share quality news, tips, and learnings | Monthly |
| **Quality Knowledge Base** | Central repository for quality knowledge | Ongoing |
| **Peer Mentoring** | One-on-one quality knowledge transfer | Ongoing |
| **Post-Release Reviews** | Share learnings from releases | Per release |

---

## 16. Quality Metrics Governance

### 16.1 Metric Definitions

#### 16.1.1 Metric Governance Principles

| Principle | Description |
|-----------|-------------|
| **Purposeful** | Every metric must serve a clear purpose |
| **Measurable** | Metrics must be quantifiable and objective |
| **Actionable** | Metrics must drive decisions or actions |
| **Timely** | Metrics must be available when needed |
| **Accurate** | Metrics must be factually correct |
| **Consistent** | Metrics must be calculated consistently |
| **Transparent** | Metric definitions and calculations must be visible |

#### 16.1.2 Metric Classification

| Classification | Description | Examples |
|----------------|-------------|----------|
| **KPI** | Key Performance Indicator — critical to quality objectives | Test coverage, Defect escape rate |
| **Operational Metric** | Measures day-to-day quality operations | Test execution rate, Defect resolution time |
| **Strategic Metric** | Measures long-term quality trends | Quality maturity, Customer satisfaction |
| **Compliance Metric** | Measures regulatory compliance | Audit pass rate, Non-conformance count |

### 16.2 Metric Targets & Thresholds

#### 16.2.1 Quality KPI Targets

| Metric | Target | Red Threshold | Yellow Threshold | Green Threshold | Measurement Frequency |
|--------|--------|---------------|------------------|-----------------|----------------------|
| **Test Coverage** | ≥80% | <60% | 60-79% | ≥80% | Per sprint |
| **Automation Coverage** | ≥95% | <80% | 80-94% | ≥95% | Per sprint |
| **Defect Escape Rate** | ≤5% | >10% | 5-10% | ≤5% | Per release |
| **Defect Detection Rate** | ≥90% | <70% | 70-89% | ≥90% | Per release |
| **MTTD** | <4 hours | >8 hours | 4-8 hours | <4 hours | Continuous |
| **MTTR (P1)** | <24 hours | >48 hours | 24-48 hours | <24 hours | Per defect |
| **MTTR (P2)** | <72 hours | >120 hours | 72-120 hours | <72 hours | Per defect |
| **Test Execution Rate** | ≥95% | <85% | 85-94% | ≥95% | Per sprint |
| **Pass Rate** | ≥95% | <85% | 85-94% | ≥95% | Per test cycle |
| **Customer Satisfaction** | ≥4.5/5 | <3.5 | 3.5-4.4 | ≥4.5 | Per release |

#### 16.2.2 Operational Metrics Targets

| Metric | Target | Red Threshold | Yellow Threshold | Green Threshold | Measurement Frequency |
|--------|--------|---------------|------------------|-----------------|----------------------|
| **Gate Pass Rate** | ≥90% | <70% | 70-89% | ≥90% | Per gate |
| **First-Time Pass Rate** | ≥80% | <60% | 60-79% | ≥80% | Per gate |
| **Defect Reopen Rate** | ≤5% | >10% | 5-10% | ≤5% | Per sprint |
| **Code Review Turnaround** | <4 hours | >8 hours | 4-8 hours | <4 hours | Per review |
| **Test Environment Availability** | ≥95% | <85% | 85-94% | ≥95% | Continuous |
| **Test Data Availability** | ≥95% | <85% | 85-94% | ≥95% | Continuous |
| **Documentation Currency** | ≥90% | <70% | 70-89% | ≥90% | Monthly |
| **Audit Finding Closure** | ≥95% on time | <80% | 80-94% | ≥95% | Per audit |

### 16.3 Metric Collection & Analysis

#### 16.3.1 Metric Collection

| Metric Source | Collection Method | Collection Frequency | Owner |
|---------------|-------------------|---------------------|-------|
| **Test Management Tool** | Automated extraction | Daily | QA Engineer |
| **Defect Tracking System** | Automated extraction | Daily | QA Engineer |
| **Code Repository** | Automated analysis | Per commit | Dev Lead |
| **CI/CD Pipeline** | Automated extraction | Per build | DevOps Lead |
| **Performance Tool** | Automated extraction | Per test | Performance Engineer |
| **Security Scanner** | Automated extraction | Per scan | Security Lead |
| **Manual Reports** | Manual entry | Per occurrence | QA Lead |
| **Surveys** | Survey tool | Per survey period | QA Lead |

#### 16.3.2 Metric Analysis Process

| Step | Activity | Responsibility | Output |
|------|----------|---------------|--------|
| 1 | Collect raw metrics data | QA Engineer | Raw data |
| 2 | Validate data accuracy | QA Lead | Validated data |
| 3 | Calculate metric values | QA Engineer | Calculated metrics |
| 4 | Compare against targets/thresholds | QA Lead | Status assessment |
| 5 | Analyse trends | QA Lead | Trend analysis |
| 6 | Identify anomalies | QA Lead | Anomaly report |
| 7 | Generate insights | QA Lead | Insights report |
| 8 | Recommend actions | QA Lead | Action recommendations |
| 9 | Present findings | QA Lead | Dashboard/report |
| 10 | Track action implementation | QA Lead | Action tracker |

### 16.4 Metric Reporting

#### 16.4.1 Dashboard Requirements

| Requirement | Description |
|-------------|-------------|
| **Real-Time** | Dashboard updated within 5 minutes of metric generation |
| **Role-Based** | Different views for different roles |
| **Drill-Down** | Ability to drill down into metric details |
| **Trend Display** | Historical trends displayed alongside current values |
| **Threshold Alerts** | Visual alerts when metrics breach thresholds |
| **Exportable** | Data exportable for analysis |
| **Accessible** | Accessible to all intended users |

#### 16.4.2 Dashboard Views

| View | Audience | Content |
|------|----------|---------|
| **Executive Dashboard** | Programme Sponsor, Quality Board | KPIs, Trends, Risks, Strategic view |
| **Quality Team Dashboard** | QA Team | Detailed operational metrics, Team performance |
| **Sprint Dashboard** | Scrum Team | Sprint quality status, Test execution, Defects |
| **Release Dashboard** | All stakeholders | Release quality status, Gate status, Release metrics |

---

## 17. Best Practices

### 17.1 Transparency

| Practice | Description | Implementation |
|----------|-------------|----------------|
| **Open Quality Data** | Quality metrics visible to all stakeholders | Dashboards, Reports |
| **Open Defect Tracking** | Defect information accessible to all team members | Defect tracking tool |
| **Open Quality Decisions** | Quality decisions documented and shared | Decision records, Meeting minutes |
| **Open Quality Risks** | Quality risks visible and tracked | Risk register, Dashboards |
| **Open Quality Feedback** | Feedback mechanisms available to all | Surveys, Retrospectives, Slack channels |
| **Open Quality Reports** | Quality reports accessible to all intended recipients | SharePoint, Email distribution |
| **Open Quality Improvement** | Improvement actions tracked openly | Improvement tracker |

### 17.2 Accountability

| Practice | Description | Implementation |
|----------|-------------|----------------|
| **Clear Ownership** | Every quality activity has a clear owner | RACI matrix |
| **Quality Commitments** | Team members commit to quality targets | Sprint commitments, Personal quality goals |
| **Quality Consequences** | Quality failures have clear consequences | Defect escalation, Process enforcement |
| **Quality Recognition** | Quality achievements are recognised | Quality awards, Team recognition |
| **Quality Reporting** | Quality performance reported regularly | Dashboards, Reports, Reviews |
| **Quality Auditing** | Quality activities audited regularly | Audit programme |
| **Quality Standards** | Quality standards enforced consistently | Standards compliance, Gate reviews |

### 17.3 Continuous Improvement

| Practice | Description | Implementation |
|----------|-------------|----------------|
| **Regular Retrospectives** | Regular reflection on quality practices | Sprint, Release, Quarterly retrospectives |
| **Root Cause Analysis** | Systematic analysis of quality failures | 5 Whys, Fishbone, Pareto analysis |
| **Metrics-Driven Improvement** | Quality improvement driven by metrics | Trend analysis, Anomaly detection |
| **Benchmark Comparison** | Compare quality practices against industry | Benchmark studies, Conference attendance |
| **Innovation Time** | Dedicated time for quality innovation | 10% time, Innovation sprints |
| **Knowledge Sharing** | Share quality learnings across teams | Community of Practice, Knowledge base |
| **Process Refinement** | Continuously refine quality processes | Process audits, Feedback loops |

### 17.4 Quality Culture

| Practice | Description | Implementation |
|----------|-------------|----------------|
| **Quality First** | Quality prioritised over speed | Quality gates, Release standards |
| **Quality Ownership** | Every team member owns quality | Quality champions, Quality in DoD |
| **Quality Learning** | Defects are learning opportunities | Blameless postmortems, Root cause analysis |
| **Quality Investment** | Quality investment is non-negotiable | Quality budget, Training time |
| **Quality Celebration** | Quality achievements celebrated | Quality awards, Team recognition |
| **Quality Advocacy** | Quality championed by leadership | Quality board, Management support |
| **Quality Integration** | Quality integrated into all activities | Quality in ceremonies, Quality in planning |

### 17.5 Governance Effectiveness

| Practice | Description | Implementation |
|----------|-------------|----------------|
| **Governance Review** | Governance framework regularly reviewed | Annual governance review |
| **Governance Metrics** | Governance effectiveness measured | Governance metrics, Board effectiveness review |
| **Governance Communication** | Governance requirements clearly communicated | Documentation, Training, Reminders |
| **Governance Compliance** | Governance compliance monitored | Compliance checks, Audits |
| **Governance Adaptation** | Governance adapted to context | Risk-proportionate governance |
| **Governance Simplification** | Governance streamlined where possible | Process improvement, Automation |
| **Governance Training** | Governance training provided | Governance training programme |

---

## 18. Dependencies & References

### 18.1 Internal Dependencies

| Document | Reference | Relationship |
|----------|-----------|--------------|
| **DP-01: Delivery Strategy** | Batch 01 Delivery Planning | Quality governance aligned with delivery strategy |
| **DP-03: Delivery Team Structure** | Batch 01 Delivery Planning | Quality roles aligned with team structure |
| **DP-04: Sprint Planning Model** | Batch 01 Delivery Planning | Quality gates integrated into sprint planning |
| **DP-05: Product Backlog & Release Plan** | Batch 01 Delivery Planning | Quality activities planned in backlog |
| **DP-07: Test Strategy & Quality Plan** | Batch 01 Delivery Planning | Quality governance supports test strategy |
| **DP-08: DevOps & Release Management Plan** | Batch 01 Delivery Planning | Release governance aligned with DevOps |
| **DP-12: Delivery Review & Sign-off** | Batch 01 Delivery Planning | Delivery sign-off aligned with quality gates |
| **DS-01: Development Standards** | Batch 11 Development Standards | Quality standards aligned with dev standards |
| **DS-02: Code Review Standards** | Batch 11 Development Standards | Code quality governance aligned |
| **DS-03: CI/CD Standards** | Batch 11 Development Standards | Quality automation aligned with CI/CD |
| **DS-04: Documentation Standards** | Batch 11 Development Standards | Quality documentation aligned |
| **01: Quality Assurance Strategy** | Testing QA Framework | Quality governance implements QA strategy |
| **02: Testing Strategy** | Testing QA Framework | Quality governance supports testing strategy |
| **03: Test Planning Framework** | Testing QA Framework | Quality gates integrated into test planning |
| **17: Defect Management** | Testing QA Framework | Defect governance aligned |
| **18: Quality Metrics** | Testing QA Framework | Metrics governance aligned |
| **19: Release Readiness** | Testing QA Framework | Release governance aligned |

### 18.2 External References

| Reference | Source | Applicable To |
|-----------|--------|---------------|
| **ISO 9001:2015** | International Organization for Standardization | Quality management system |
| **ISO/IEC 25010** | International Organization for Standardization | Product quality model |
| **ISTQB Foundation Syllabus** | ISTQB | Testing terminology and processes |
| **ISTQB Test Manager Syllabus** | ISTQB | Test management practices |
| **OWASP Testing Guide** | OWASP | Security testing practices |
| **WCAG 2.1** | W3C | Accessibility requirements |
| **CMMI for Development** | CMMI Institute | Process maturity model |
| **ITIL 4** | AXELOS | Service management practices |
| **SAFe Quality Practices** | Scaled Agile Framework | Agile quality practices |

### 18.3 Related MAP Documents

| Document | Purpose | Relationship |
|----------|---------|--------------|
| **Testing QA Framework** | Complete testing framework | Quality governance provides oversight |
| **Delivery Planning** | Delivery approach and planning | Quality governance aligned with delivery |
| **Development Standards** | Development practices and standards | Quality standards aligned with dev standards |
| **Master Repository** | Central document repository | Quality governance documents stored here |

---

## 19. Compliance & Audit

### 19.1 Quality Governance Compliance

| Requirement | Compliance Method | Frequency |
|-------------|-------------------|-----------|
| Quality gates enforced | Gate review records | Per gate |
| RACI matrix followed | Activity records | Per activity |
| Escalation procedures followed | Escalation records | Per escalation |
| Quality audits conducted | Audit reports | Per audit type |
| Training requirements met | Training records | Quarterly |
| Metrics reported | Metrics reports | Per reporting cadence |
| Review cadence maintained | Meeting minutes | Per review type |
| Documentation standards followed | Documentation review | Per document |

### 19.2 Quality Audit Programme

| Audit Type | Scope | Frequency | Auditor | Report To |
|------------|-------|-----------|---------|-----------|
| **Process Compliance Audit** | Quality process adherence | Monthly | QA Lead | Quality Board |
| **Quality Gate Audit** | Gate review effectiveness | Quarterly | Internal Audit | Quality Board |
| **Metrics Audit** | Metrics accuracy and completeness | Quarterly | QA Lead | Quality Board |
| **Training Audit** | Training programme effectiveness | Semi-annually | QA Lead + HR | Quality Board |
| **Compliance Audit** | Regulatory compliance | Semi-annually | External Auditor | Programme Board |
| **Governance Audit** | Governance framework effectiveness | Annually | External Auditor | Programme Board |

### 19.3 Audit Evidence Requirements

| Audit Area | Evidence Required | Evidence Owner |
|------------|-------------------|----------------|
| **Quality Strategy** | Strategy document, Review records, Approval records | QA Lead |
| **Quality Gates** | Gate checklists, Gate review records, Gate decisions | QA Lead |
| **RACI Compliance** | Activity records, Role assignments, Decision records | QA Lead |
| **Escalation Compliance** | Escalation records, Resolution records, Follow-up records | QA Lead |
| **Training Compliance** | Training records, Certification records, Skills matrices | QA Lead |
| **Metrics Compliance** | Metrics reports, Dashboard records, Trend analyses | QA Lead |
| **Review Compliance** | Meeting minutes, Action items, Decision records | QA Lead |
| **Documentation Compliance** | Document records, Version control, Review records | QA Lead |

### 19.4 Non-Conformance & Corrective Action

| Step | Activity | Timeline | Responsibility |
|------|----------|----------|---------------|
| 1 | Non-conformance identified | Immediate | Any team member |
| 2 | Non-conformance recorded | Within 24 hours | QA Lead |
| 3 | Root cause analysis | Within 5 business days | QA Lead + relevant team |
| 4 | Corrective action plan | Within 10 business days | QA Lead |
| 5 | Corrective action implementation | Per plan | Assigned owner |
| 6 | Effectiveness verification | Within 30 days | QA Lead |
| 7 | Non-conformance closure | After verification | QA Lead |

---

## 20. Appendices

### Appendix A: Quality Governance Checklist

| # | Checklist Item | Status | Notes |
|---|---------------|--------|-------|
| 1 | Quality governance structure defined | | |
| 2 | Quality Board established | | |
| 3 | Quality roles and responsibilities defined | | |
| 4 | RACI matrix created and approved | | |
| 5 | Quality gates defined | | |
| 6 | Escalation procedures documented | | |
| 7 | Audit framework established | | |
| 8 | Review cadence defined | | |
| 9 | Quality policies approved | | |
| 10 | Quality standards defined | | |
| 11 | Quality metrics framework approved | | |
| 12 | Reporting framework established | | |
| 13 | Training programme approved | | |
| 14 | Improvement framework defined | | |
| 15 | Maturity model defined | | |

### Appendix B: Quality Board Meeting Template

| Section | Content |
|---------|---------|
| **Meeting Details** | Date, Time, Location, Attendees |
| **Agenda** | Items to be discussed |
| **Previous Minutes** | Review of previous meeting actions |
| **Quality Status** | Current quality status summary |
| **Quality Metrics** | Key metrics review |
| **Quality Risks** | Current quality risks |
| **Quality Issues** | Current quality issues |
| **Quality Decisions** | Decisions to be made |
| **Quality Actions** | Actions from this meeting |
| **Next Meeting** | Date and time of next meeting |

### Appendix C: Quality Gate Review Template

| Section | Content |
|---------|---------|
| **Gate Details** | Gate ID, Gate Name, Date, Reviewer |
| **Evidence Summary** | Summary of evidence provided |
| **Criterion Assessment** | Assessment against each criterion |
| **Exception Requests** | Any requests for exceptions |
| **Risk Assessment** | Risks associated with proceeding/failing |
| **Decision** | Pass / Conditional Pass / Fail |
| **Conditions** | Any conditions for conditional pass |
| **Actions** | Actions arising from the review |
| **Next Steps** | What happens next |

### Appendix D: Escalation Record Template

| Field | Description |
|-------|-------------|
| **Escalation ID** | ESC-YYYY-NNN |
| **Date/Time** | When escalated |
| **Raised By** | Who escalated |
| **Escalated To** | Who received escalation |
| **Level** | 1-5 |
| **Trigger** | What triggered escalation |
| **Description** | Detailed description |
| **Impact** | Impact if not resolved |
| **Urgency** | Low / Medium / High / Critical |
| **Resolution** | How resolved |
| **Resolution Date** | When resolved |
| **Root Cause** | Root cause |
| **Preventive Action** | Prevention measure |

### Appendix E: Quality Metrics Dashboard Sample

```
┌─────────────────────────────────────────────────────────────┐
│                 QUALITY METRICS DASHBOARD                    │
│                 MAP Programme - July 2026                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TEST COVERAGE          AUTOMATION COVERAGE   DEFECT ESCAPE │
│  ┌─────────────┐       ┌─────────────┐       ┌────────────┐│
│  │   82%  ●    │       │   96%  ●    │       │   3%  ●   ││
│  │  Target:80% │       │  Target:95% │       │  Target:5% ││
│  │  GREEN      │       │  GREEN      │       │  GREEN     ││
│  └─────────────┘       └─────────────┘       └────────────┘│
│                                                             │
│  MTTD                  MTTR (P1)              PASS RATE     │
│  ┌─────────────┐       ┌─────────────┐       ┌────────────┐│
│  │  3.2 hrs ●  │       │  18 hrs ●   │       │  97%  ●   ││
│  │  Target:4hrs│       │ Target:24hrs│       │ Target:95% ││
│  │  GREEN      │       │  GREEN      │       │  GREEN     ││
│  └─────────────┘       └─────────────┘       └────────────┘│
│                                                             │
│  GATE PASS RATE       CUSTOMER SATISFACTION  TEAM QUALITY   │
│  ┌─────────────┐       ┌─────────────┐       ┌────────────┐│
│  │   92%  ●    │       │  4.6/5 ●    │       │   ● ● ● ○  ││
│  │  Target:90% │       │ Target:4.5  │       │  Excellent  ││
│  │  GREEN      │       │  GREEN      │       │             ││
│  └─────────────┘       └─────────────┘       └────────────┘│
│                                                             │
│  OVERALL QUALITY STATUS: GREEN                              │
│  All quality metrics within target thresholds               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 21. Revision History

| Version | Date | Author | Changes | Status |
|---------|------|--------|---------|--------|
| 0.1 | July 2026 | QA Lead | Initial draft | Draft |
| 0.2 | July 2026 | QA Lead | Added RACI matrix and governance structure | Draft |
| 0.3 | July 2026 | QA Lead | Added quality gates and escalation procedures | Draft |
| 0.4 | July 2026 | QA Lead | Added audit trail and compliance requirements | Draft |
| 0.5 | July 2026 | QA Lead | Added review cadence and continuous improvement | Draft |
| 0.6 | July 2026 | QA Lead | Added quality policies and training programme | Draft |
| 0.7 | July 2026 | QA Lead | Added metrics governance and reporting framework | Draft |
| 0.8 | July 2026 | QA Lead | Added best practices and appendices | Draft |
| 0.9 | July 2026 | QA Lead | Review and refinement | Review |
| 1.0 | July 2026 | QA Lead | Final version for approval | Official |

---

## 22. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Quality Board Chair** | [Programme Sponsor] | _________________ | ________ |
| **QA Lead** | [QA Lead] | _________________ | ________ |
| **Delivery Lead** | [Delivery Lead] | _________________ | ________ |
| **Technical Lead** | [Technical Lead] | _________________ | ________ |
| **Product Owner** | [Product Owner] | _________________ | ________ |

---

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | MAP-QA-GOV-001 |
| **Document Title** | Quality Governance Framework |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal — Engineering |
| **Owner** | QA Engineering Lead |
| **Location** | Quality Assurance & Testing Framework |
| **Next Review** | January 2027 |

---

*This document is the property of MAP Programme. Unauthorised reproduction or distribution is prohibited.*
