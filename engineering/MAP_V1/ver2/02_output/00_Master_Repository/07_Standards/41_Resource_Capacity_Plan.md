# DP-06 – Resource & Capacity Plan

## Migration Assurance Platform (MAP)

Version 1.0
Status: Complete

---

# Purpose

This document defines the Resource & Capacity Plan for the Migration Assurance Platform (MAP) Release 1.

The resource and capacity plan establishes the resource allocation model, capacity calculation methodology, hiring strategy, cost implications, and risk management approach for delivering MAP MVP.

This document translates the Delivery Team Structure (DP-03) and Sprint Planning Model (DP-04) into a concrete resource management framework that enables:

* Predictable delivery capacity
* Optimal resource utilisation
* Cost-effective delivery
* Scalable team growth
* Risk-aware resource planning
* Domain-aligned allocation
* Operational readiness

---

# Objectives

The resource and capacity plan must:

### Establish Predictable Capacity

---

### Optimise Resource Utilisation

---

### Support Domain-Aligned Delivery

---

### Enable Cost-Effective Growth

---

### Manage Resource Risks

---

### Align with Sprint Cadence

---

### Support Scaling from MVP to SaaS

---

# Resource Vision

MAP resource planning will operate as:

> A data-driven, capacity-aware resource model that allocates the right people with the right skills to the right domains at the right time, enabling predictable delivery while maintaining cost efficiency and team sustainability.

---

# Resource Planning Principles

## Core Principles

```text id="dp06-001"
Principle 1: Capacity Before Commitment
       |
Principle 2: Skill-Domain Alignment
       |
Principle 3: Sustainable Pace
       |
Principle 4: Buffer for Uncertainty
       |
Principle 5: Scalable by Design
       |
Principle 6: Cost-Conscious Allocation
```

---

## Principle Details

| Principle | Description | Implementation |
| --------- | ----------- | -------------- |
| Capacity Before Commitment | Never commit to sprint scope exceeding calculated capacity | Capacity calculation before sprint planning |
| Skill-Domain Alignment | Assign resources based on domain expertise and skill match | Domain team structure per DP-03 |
| Sustainable Pace | Maintain 40-hour work week, avoid overtime as standard | 10% buffer in all capacity calculations |
| Buffer for Uncertainty | Account for unknowns and risks in capacity | 10-15% contingency allocation |
| Scalable by Design | Resource model supports growth from R1 to R4 | Scaling triggers defined per release |
| Cost-Conscious Allocation | Optimise FTE vs. contractor mix for cost efficiency | Contractor usage for peak demand |

---

## Resource Allocation Strategy

```text id="dp06-002"
R1 (MVP)          R2 (Multi-Env)     R3 (SaaS)          R4 (Enterprise)
   |                   |                  |                   |
22 FTE            26 FTE            37 FTE              46 FTE
   |                   |                  |                   |
Core Team        Enhanced Team     Scaled Team        Enterprise Team
   |                   |                  |                   |
Lean Delivery    Multi-Env         Multi-Tenant       Full Operations
```

---

# Team Composition

## R1 MVP Headcount

| Role | Count | Type | Allocation | Domain |
| ---- | ----- | ---- | ---------- | ------ |
| Programme Sponsor | 1 | FTE | 20% | Programme |
| Product Owner | 1 | FTE | 100% | Product |
| Delivery Lead | 1 | FTE | 100% | Delivery |
| Architecture Lead | 1 | FTE | 100% | Architecture |
| Discovery Domain Eng Lead | 1 | FTE | 100% | Discovery |
| Mapping Domain Eng Lead | 1 | FTE | 100% | Mapping |
| Validation Domain Eng Lead | 1 | FTE | 100% | Validation |
| Governance Domain Eng Lead | 1 | FTE | 100% | Governance |
| Reporting Domain Eng Lead | 1 | FTE | 100% | Reporting |
| Administration Domain Eng Lead | 1 | FTE | 100% | Administration |
| Senior Developer | 3 | FTE | 100% | Discovery, Mapping, Validation |
| Developer | 3 | FTE | 100% | Governance, Reporting, Administration |
| QA Lead | 1 | FTE | 100% | Quality |
| QA Engineer | 2 | FTE | 100% | Quality |
| Operations Lead | 1 | FTE | 100% | Operations |
| Business Analyst | 1 | FTE | 100% | Product |
| UX Designer | 1 | FTE | 100% | Product |
| **Total** | **22** | | | |

---

## R2 Team Additions

| Role | Count | Type | Allocation | Domain |
| ---- | ----- | ---- | ---------- | ------ |
| Senior Developer | +2 | FTE | 100% | Multi-Environment |
| QA Engineer | +1 | FTE | 100% | Multi-Environment Testing |
| Operations Engineer | +1 | FTE | 100% | Environment Management |
| **Total** | **26** | | | |

---

## R3 Team Additions

| Role | Count | Type | Allocation | Domain |
| ---- | ----- | ---- | ---------- | ------ |
| Product Owner | +1 | FTE | 100% | Customer Success |
| Domain Engineering Lead | +2 | FTE | 100% | Feature Expansion |
| Senior Developer | +3 | FTE | 100% | SaaS Features |
| Developer | +2 | FTE | 100% | SaaS Capacity |
| QA Engineer | +1 | FTE | 100% | Multi-Tenant Testing |
| Operations Engineer | +1 | FTE | 100% | SaaS Operations |
| Business Analyst | +1 | FTE | 100% | Customer Requirements |
| **Total** | **37** | | | |

---

## R4 Team Composition

| Role | Count | Type | Allocation | Domain |
| ---- | ----- | ---- | ---------- | ------ |
| Programme Sponsor | 1 | FTE | 20% | Programme |
| Product Owner | 2 | FTE | 100% | Product + Customer Success |
| Delivery Lead | 2 | FTE | 100% | Multiple Workstreams |
| Architecture Lead | 1 | FTE | 100% | Enterprise Architecture |
| Domain Engineering Lead | 8 | FTE | 100% | Feature + Platform Domains |
| Senior Developer | 6 | FTE | 100% | Core Delivery |
| Developer | 6 | FTE | 100% | Feature Delivery |
| QA Lead | 1 | FTE | 100% | Quality Strategy |
| QA Engineer | 4 | FTE | 100% | Comprehensive Testing |
| Operations Lead | 2 | FTE | 100% | Platform + Customer Ops |
| Business Analyst | 2 | FTE | 100% | Requirements + Customer |
| UX Designer | 2 | FTE | 100% | Product + Customer UX |
| DevOps Engineer | 2 | FTE | 100% | CI/CD and Infrastructure |
| Security Engineer | 1 | FTE | 100% | Security Operations |
| **Total** | **46** | | | |

---

## Domain Team Allocation

| Domain | Eng Lead | Senior Dev | Dev | QA Eng | Total |
| ------ | -------- | ---------- | --- | ------ | ----- |
| Discovery | 1 | 1 | 0 | 0 | 2 |
| Mapping | 1 | 1 | 0 | 0 | 2 |
| Validation | 1 | 1 | 0 | 1 | 3 |
| Governance | 1 | 0 | 1 | 1 | 3 |
| Reporting | 1 | 0 | 1 | 0 | 2 |
| Administration | 1 | 0 | 1 | 0 | 2 |
| **Total** | **6** | **3** | **3** | **2** | **14** |

---

# Skill Requirements Matrix

## Role-to-Skill Mapping

| Skill Area | Required For | Proficiency Level |
| ---------- | ------------ | ----------------- |
| .NET / C# | Domain Eng Lead, Senior Dev, Developer | Expert |
| TypeScript / React | Domain Eng Lead, Senior Dev, Developer | Expert |
| Azure SQL | Domain Eng Lead, Senior Dev, Developer | Advanced |
| Azure Services (App Service, Functions, SQL, Storage) | Domain Eng Lead, Operations Lead, Senior Dev | Advanced |
| REST API Design | Architecture Lead, Domain Eng Lead, Senior Dev | Expert |
| Security / Entra ID | Architecture Lead, Operations Lead, QA Lead | Advanced |
| CI/CD Pipelines | Operations Lead, Senior Dev | Advanced |
| Infrastructure as Code | Operations Lead | Expert |
| Test Automation | QA Lead, QA Engineer | Advanced |
| Agile / Scrum | Delivery Lead, Product Owner, QA Lead | Expert |
| Domain-Driven Design | Architecture Lead, Domain Eng Lead | Expert |
| Git / Version Control | All engineering roles | Advanced |
| React / Next.js | Domain Eng Lead, Senior Dev, Developer | Expert |
| Azure DevOps / GitHub | Operations Lead, Senior Dev | Advanced |
| Monitoring & Logging | Operations Lead, QA Lead | Advanced |

---

## Skill-to-Domain Matrix

| Skill Area | Discovery | Mapping | Validation | Governance | Reporting | Administration |
| ---------- | --------- | ------- | ---------- | ---------- | --------- | -------------- |
| .NET / C# | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TypeScript / React | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Azure SQL | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Azure Services | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| REST API Design | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Security / Entra ID | | | ✓ | ✓ | | ✓ |
| CI/CD Pipelines | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Infrastructure as Code | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Test Automation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Domain-Driven Design | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Skill Proficiency Levels

| Level | Description |
| ----- | ----------- |
| Expert | Can lead design and implementation, mentor others |
| Advanced | Can implement independently, handle complex scenarios |
| Intermediate | Can implement with guidance, handle standard scenarios |
| Basic | Can assist with implementation, requires supervision |

---

# Resource Allocation by Sprint

## R1 Sprint Resource Allocation

| Sprint | Duration | Dev Resources | QA Resources | Total Effort (person-days) |
| ------ | -------- | ------------- | ------------ | -------------------------- |
| Sprint 1 | 2 weeks | 14 | 2 | 80 |
| Sprint 2 | 2 weeks | 14 | 2 | 80 |
| Sprint 3 | 2 weeks | 14 | 2 | 80 |
| Sprint 4 | 2 weeks | 14 | 2 | 80 |
| Sprint 5 | 2 weeks | 14 | 2 | 80 |
| Sprint 6 | 2 weeks | 14 | 3 | 85 |
| Sprint 7 | 2 weeks | 14 | 3 | 85 |
| Sprint 8 | 2 weeks | 12 | 4 | 80 |
| Sprint 9 | 2 weeks | 10 | 3 | 65 |
| Sprint 10 | 2 weeks | 8 | 2 | 50 |
| Sprint 11 | 2 weeks | 6 | 2 | 40 |
| Sprint 12 | 2 weeks | 4 | 1 | 25 |
| **Total** | **24 weeks** | | | **830** |

---

## Resource Allocation Details

### Sprint 1: Foundation Setup

| Role | Allocation | Focus |
| ---- | ---------- | ----- |
| Programme Sponsor | 20% | Strategic alignment |
| Product Owner | 100% | Backlog preparation |
| Delivery Lead | 100% | Sprint planning, environment setup |
| Architecture Lead | 100% | Architecture decisions, environment design |
| Domain Eng Leads | 100% | Domain backlog preparation |
| Senior Developers | 100% | Environment setup, CI/CD pipelines |
| Developers | 100% | Development environment configuration |
| QA Lead | 100% | Test strategy, test environment setup |
| QA Engineers | 100% | Test framework setup |
| Operations Lead | 100% | Azure infrastructure provisioning |
| Business Analyst | 100% | Requirements documentation |
| UX Designer | 100% | UX strategy, design system setup |

---

### Sprint 2-5: Core Build

| Role | Allocation | Focus |
| ---- | ---------- | ----- |
| Programme Sponsor | 20% | Strategic oversight |
| Product Owner | 100% | Backlog management, story refinement |
| Delivery Lead | 100% | Sprint execution, risk management |
| Architecture Lead | 100% | Architecture governance, design reviews |
| Domain Eng Leads | 100% | Domain development leadership |
| Senior Developers | 100% | Feature development, code reviews |
| Developers | 100% | Feature implementation |
| QA Lead | 100% | Test execution, defect management |
| QA Engineers | 100% | Test case design, test execution |
| Operations Lead | 100% | Environment management, deployment support |
| Business Analyst | 100% | Requirements clarification, UAT preparation |
| UX Designer | 100% | UI design, usability testing |

---

### Sprint 6-8: Validation

| Role | Allocation | Focus |
| ---- | ---------- | ----- |
| Programme Sponsor | 30% | Governance oversight |
| Product Owner | 100% | UAT coordination, acceptance decisions |
| Delivery Lead | 100% | Release coordination, risk resolution |
| Architecture Lead | 80% | Architecture compliance, security review |
| Domain Eng Leads | 100% | Defect resolution, integration support |
| Senior Developers | 100% | Defect resolution, performance optimisation |
| Developers | 1000% | Defect resolution, documentation |
| QA Lead | 100% | UAT coordination, release validation |
| QA Engineers | 100% | UAT execution, regression testing |
| Operations Lead | 100% | Deployment preparation, monitoring setup |
| Business Analyst | 100% | UAT support, business validation |
| UX Designer | 60% | Usability testing, UX validation |

---

### Sprint 9-10: Deployment

| Role | Allocation | Focus |
| ---- | ---------- | ----- |
| Programme Sponsor | 40% | Go-live oversight |
| Product Owner | 100% | Go-live decision, stakeholder communication |
| Delivery Lead | 100% | Deployment coordination, rollback planning |
| Architecture Lead | 60% | Architecture compliance verification |
| Domain Eng Leads | 80% | Production support, issue resolution |
| Senior Developers | 80% | Production support, monitoring |
| Developers | 60% | Documentation, knowledge transfer |
| QA Lead | 100% | Production validation, smoke testing |
| QA Engineers | 100% | Production testing, defect monitoring |
| Operations Lead | 100% | Production deployment, monitoring |
| Business Analyst | 80% | Business validation, documentation |
| UX Designer | 40% | UX validation, accessibility testing |

---

### Sprint 11-12: Buffer & Transition

| Role | Allocation | Focus |
| ---- | ---------- | ----- |
| Programme Sponsor | 20% | Programme closure |
| Product Owner | 80% | Product roadmap, future planning |
| Delivery Lead | 80% | Knowledge transfer, lessons learned |
| Architecture Lead | 40% | Architecture documentation |
| Domain Eng Leads | 60% | Knowledge transfer, documentation |
| Senior Developers | 60% | Documentation, knowledge transfer |
| Developers | 40% | Documentation, knowledge transfer |
| QA Lead | 60% | Test documentation, automation handover |
| QA Engineers | 60% | Test documentation, automation handover |
| Operations Lead | 100% | Operational transition, runbook creation |
| Business Analyst | 60% | Process documentation |
| UX Designer | 40% | Design documentation, asset handover |

---

# Capacity Calculation Model

## Step-by-Step Process

```text id="dp06-003"
Step 1: Determine team size and allocation
       |
Step 2: Calculate available days per person per sprint
       |
Step 3: Apply deductions (meetings, leave, operational)
       |
Step 4: Calculate effective capacity in hours
       |
Step 5: Convert to story points using velocity target
       |
Step 6: Compare capacity to demand
       |
Step 7: Adjust scope or resources as needed
```

---

## Available Days Per Person Per Sprint

| Factor | Value | Description |
| ------ | ----- | ----------- |
| Sprint Duration | 10 working days | 2-week sprint |
| Working Hours per Day | 7.5 hours | Standard work day |
| Hours per Sprint | 75 hours | Gross capacity per person |

---

## Capacity Deductions

| Deduction Category | Hours per Sprint | Percentage | Description |
| ------------------ | ---------------- | ---------- | ----------- |
| Sprint Ceremonies | 6.0 hours | 8% | Planning, stand-up, review, retro |
| Backlog Refinement | 2.0 hours | 3% | Weekly refinement sessions |
| Architecture Reviews | 1.0 hours | 1% | Weekly architecture review |
| Security Reviews | 0.5 hours | 1% | Bi-weekly security review |
| Leave Allowance | 3.0 hours | 4% | Average leave per sprint |
| Operational Activities | 3.0 hours | 4% | Support, maintenance, incidents |
| **Total Deductions** | **15.5 hours** | **21%** | |
| **Net Capacity** | **59.5 hours** | **79%** | Available for delivery |

---

## Capacity Calculation Formula

```text id="dp06-004"
Net Capacity = Gross Capacity - Deductions

Net Capacity = 75 hours - 15.5 hours = 59.5 hours per person per sprint

Story Point Capacity = Net Capacity / Average Hours per Story Point

Assuming 1 story point = 4 hours:
Story Point Capacity = 59.5 / 4 = 14.875 story points per person per sprint
```

---

## Team Capacity Calculation

| Team Size | Net Capacity (hours) | Story Points (at 4 hrs/SP) |
| --------- | -------------------- | --------------------------- |
| 14 Dev + 2 QA = 16 | 16 × 59.5 = 952 | 238 |
| 14 Dev + 3 QA = 17 | 17 × 59.5 = 1011.5 | 253 |
| 12 Dev + 4 QA = 16 | 16 × 59.5 = 952 | 238 |
| 10 Dev + 3 QA = 13 | 13 × 59.5 = 773.5 | 193 |
| 8 Dev + 2 QA = 10 | 10 × 59.5 = 595 | 149 |
| 6 Dev + 2 QA = 8 | 8 × 59.5 = 476 | 119 |
| 4 Dev + 1 QA = 5 | 5 × 59.5 = 297.5 | 74 |

---

## Capacity Calculation Example

### Sprint 3 Detailed Calculation

| Factor | Calculation | Value |
| ------ | ----------- | ----- |
| Team Size | 6 Domain Eng Leads + 3 Senior Dev + 3 Dev + 2 QA Lead + 2 QA + 1 Ops + 1 BA + 1 UX | 16 people |
| Gross Capacity | 16 × 75 hours | 1,200 hours |
| Sprint Ceremonies | 16 × 6 hours | -96 hours |
| Backlog Refinement | 16 × 2 hours | -32 hours |
| Architecture Reviews | 8 × 1 hour | -8 hours |
| Security Reviews | 4 × 0.5 hours | -2 hours |
| Leave Allowance | 16 × 3 hours | -48 hours |
| Operational Activities | 16 × 3 hours | -48 hours |
| **Net Capacity** | 1,200 - 234 | **966 hours** |
| **Story Points** | 966 / 4 | **241.5 SP** |

---

## Capacity by Role Category

| Role Category | Count | Net Capacity (hours) | Story Points | Percentage of Total |
| ------------- | ----- | -------------------- | ------------ | ------------------- |
| Engineering Leads | 6 | 357 | 89 | 37% |
| Senior Developers | 3 | 178.5 | 45 | 19% |
| Developers | 3 | 178.5 | 45 | 19% |
| QA Lead | 1 | 59.5 | 15 | 6% |
| QA Engineers | 2 | 119 | 30 | 12% |
| Operations Lead | 1 | 59.5 | 15 | 6% |
| Business Analyst | 1 | 59.5 | 15 | 6% |
| UX Designer | 1 | 59.5 | 15 | 6% |
| **Total** | **16** | **966** | **241.5** | **100%** |

---

## Velocity Target

| Metric | Target | Description |
| ------ | ------ | ----------- |
| Sprint Goal Achievement | > 90% | Percentage of sprint goals met |
| Story Completion Rate | > 90% | Stories completed vs. committed |
| Velocity Stability | ± 15% | Variance between sprints |
| Estimation Accuracy | ± 10% | Estimated vs. actual effort |

---

## Velocity Tracking by Sprint

| Sprint | Planned Points | Completed Points | Velocity | Trend |
| ------ | -------------- | ---------------- | -------- | ----- |
| Sprint 1 | 200 | 180 | 180 | Baseline |
| Sprint 2 | 230 | 220 | 220 | Improving |
| Sprint 3 | 240 | 235 | 235 | Improving |
| Sprint 4 | 240 | 230 | 230 | Stable |
| Sprint 5 | 240 | 240 | 240 | Stable |
| Sprint 6 | 220 | 215 | 215 | Stable |
| Sprint 7 | 220 | 225 | 225 | Stable |
| Sprint 8 | 200 | 200 | 200 | Stable |
| Sprint 9 | 180 | 175 | 175 | Decreasing |
| Sprint 10 | 150 | 150 | 150 | Decreasing |
| Sprint 11 | 100 | 105 | 105 | Stable |
| Sprint 12 | 60 | 60 | 60 | Stable |

---

## Capacity vs. Demand Analysis

| Sprint | Demand (Story Points) | Capacity (Story Points) | Gap | Action |
| ------ | --------------------- | ----------------------- | --- | ------ |
| Sprint 1 | 200 | 238 | +38 | Sufficient capacity |
| Sprint 2 | 230 | 238 | +8 | Sufficient capacity |
| Sprint 3 | 240 | 238 | -2 | Monitor closely |
| Sprint 4 | 240 | 238 | -2 | Monitor closely |
| Sprint 5 | 240 | 238 | -2 | Monitor closely |
| Sprint 6 | 220 | 253 | +33 | Sufficient capacity |
| Sprint 7 | 220 | 253 | +33 | Sufficient capacity |
| Sprint 8 | 200 | 238 | +38 | Sufficient capacity |
| Sprint 9 | 180 | 193 | +13 | Sufficient capacity |
| Sprint 10 | 150 | 149 | -1 | Monitor closely |
| Sprint 11 | 100 | 119 | +19 | Sufficient capacity |
| Sprint 12 | 60 | 74 | +14 | Sufficient capacity |
| **Total** | **2,280** | **2,469** | **+189** | **Sufficient** |

---

## Capacity Utilisation Analysis

| Sprint | Capacity (SP) | Utilisation | Utilisation Status |
| ------ | ------------- | ----------- | ------------------ |
| Sprint 1 | 238 | 84% | Under-utilised |
| Sprint 2 | 238 | 97% | Optimal |
| Sprint 3 | 238 | 101% | Over-utilised |
| Sprint 4 | 238 | 101% | Over-utilised |
| Sprint 5 | 238 | 101% | Over-utilised |
| Sprint 6 | 253 | 87% | Optimal |
| Sprint 7 | 253 | 87% | Optimal |
| Sprint 8 | 238 | 84% | Under-utilised |
| Sprint 9 | 193 | 93% | Optimal |
| Sprint 10 | 149 | 101% | Over-utilised |
| Sprint 11 | 119 | 84% | Under-utilised |
| Sprint 12 | 74 | 81% | Under-utilised |

---

## Capacity Adjustment Strategies

| Strategy | When to Use | Impact |
|----------|-------------|--------|
| Reduce scope | When capacity is insufficient | Lower delivery commitment |
| Add resources | When scope cannot be reduced | Increased cost, longer ramp-up |
| Reallocate resources | When skills are mismatched | Cross-domain flexibility |
| Extend timeline | When capacity gap is significant | Delayed delivery |
| Improve efficiency | When utilisation is low | Process optimisation |

---

# Resource Gaps & Hiring Plan

## Identified Gaps

| Gap | Sprint | Impact | Mitigation |
| --- | ------ | ------ |------------|
| Validation domain requires additional QA capacity | Sprint 6-8 | Increased testing risk | Contractor QA Engineer |
| Scaled environment needs additional DevOps | Sprint 9-10 | Deployment risk | Operations Lead overtime |
| Multi-tenant testing requires specialised QA | Sprint 11-12 | Security testing gap | External security consultant |
| Reporting domain requires additional developer capacity | Sprint 4-6 | Feature delivery risk | Reallocate from Administration domain |
| Governance domain requires senior oversight | Sprint 7-8 | Architecture risk | Architecture Lead additional allocation |

---

## Hiring Timeline

| Role | When Needed | Type | Duration | Cost Impact |
| ---- | ----------- | ---- |----------| ------------ |
| QA Engineer (Contractor) | Sprint 6 | Contractor | 3 months | £25,000 |
| Security Consultant | Sprint 9 | Contractor | 2 months | £20,000 |
| Senior Developer | Sprint 11 | FTE | Permanent | £85,000/year |
| DevOps Engineer | Sprint 9 | Contractor | 2 months | £18,000 |
| Performance Consultant | Sprint 8 | Contractor | 1 month | £12,000 |

---

## Recruitment Lead Times

| Role | Lead Time | Process |
| ---- | --------- | ------- |
| Senior Developer | 6-8 weeks | Recruit → Onboard → Productive |
| QA Engineer | 4-6 weeks | Recruit → Onboard → Productive |
| Contractor | 2-3 weeks | Contract → Onboard → Productive |
| Consultant | 1-2 weeks | Engage → Onboard → Productive |

---

## Onboarding Process

```text id="dp06-006"
Day 1        Day 2-3       Day 4-5       Week 2
  |             |             |             |
Access        Orientation   Domain       Sprint
Setup         & Tools       Training     Join
```

---

## Onboarding Activities

| Activity | Duration | Owner |
| -------- | -------- | ----- |
| Access Provisioning | 1 day | Operations Lead |
| Platform Overview | 0.5 day | Delivery Lead |
| Architecture Walkthrough | 0.5 day | Architecture Lead |
| Domain Training | 1 day | Domain Eng Lead |
| Tooling Setup | 0.5 day | Operations Lead |
| Security Training | 0.5 day | Architecture Lead |
| Sprint Participation | Ongoing | Domain Eng Lead |

---

## Knowledge Transfer Plan

| Knowledge Area | Transfer Method | Owner | Timeline |
| -------------- | --------------- | ----- |---------- |
| Architecture Decisions | Documentation + Walkthrough | Architecture Lead | Sprint 1-2 |
| Domain Expertise | Pair Programming + Documentation | Domain Eng Leads | Sprint 1-3 |
| Operations Procedures | Runbook + Shadowing | Operations Lead | Sprint 2-4 |
| Test Strategy | Documentation + Automation | QA Lead | Sprint 2-4 |
| Business Requirements | Documentation + Sessions | Product Owner + BA | Sprint 1-3 |
| UX Design Patterns | Documentation + Design System | UX Designer | Sprint 1-2 |

---

# Scaling Triggers

## Trigger Conditions

| Trigger | Condition | Action |
| ------- |-----------| ------ |
| Velocity Decline | Velocity drops > 20% for 2 consecutive sprints | Assess resource needs, consider additions |
| Defect Rate | Defect escape rate > 5% | Add QA capacity, improve test automation |
| Technical Debt | Technical debt > 20% of sprint capacity | Add developer capacity for remediation |
| Scope Increase | Scope increase > 15% | Add resources or reduce scope |
| Key Person Departure | Critical role vacancy | Immediate recruitment, knowledge transfer |
| Security Vulnerability | Critical security issue identified | Security consultant engagement |
| Performance Issue | Performance degradation > 20% | Performance specialist engagement |

---

## Scaling Decision Framework

```text id="dp06-005"
Trigger Identified
       |
Assess Impact
       |
Determine Response Options
       |
   Option 1: Add FTE
   Option 2: Add Contractor
   Option 3: Reallocate Existing
   Option 4: Reduce Scope
       |
Evaluate Cost/Benefit
       |
Make Decision
       |
Execute Response
```

---

## Scaling Cost-Benefit Matrix

| Response Option | Time to Impact | Cost | Risk | Best For |
| --------------- | -------------- |------|------|----------|
| Add FTE | 6-8 weeks | High | Low | Long-term capacity |
| Add Contractor | 2-3 weeks | Medium | Medium | Short-term surge |
| Reallocate Existing | 1-2 weeks | Low | Medium | Cross-domain flexibility |
| Reduce Scope | Immediate | Low | Low | Schedule protection |

---

# Cost Implications

## Per-Role Cost Estimates

| Role | Annual Salary (FTE) | Contractor Rate (Daily) | R1 Cost (FTE) | R1 Cost (Contractor) |
| ---- | ------------------- | ----------------------- | ------------- | -------------------- |
| Programme Sponsor | £120,000 | £800 | £120,000 | £80,000 |
| Product Owner | £95,000 | £600 | £95,000 | £60,000 |
| Delivery Lead | £90,000 | £550 | £90,000 | £55,000 |
| Architecture Lead | £110,000 | £700 | £110,000 | £70,000 |
| Domain Eng Lead | £95,000 | £600 | £570,000 | £360,000 |
| Senior Developer | £85,000 | £550 | £255,000 | £165,000 |
| Developer | £70,000 | £450 | £210,000 | £135,000 |
| QA Lead | £85,000 | £550 | £85,000 | £55,000 |
| QA Engineer | £65,000 | £420 | £130,000 | £84,000 |
| Operations Lead | £90,000 | £550 | £90,000 | £55,000 |
| Business Analyst | £75,000 | £480 | £75,000 | £48,000 |
| UX Designer | £80,000 | £500 | £80,000 | £50,000 |
| **Total R1** | | | **£1,910,000** | **£1,217,000** |

---

## Total Delivery Cost (R1 MVP)

| Cost Category | Amount | Percentage |
| ------------- | ------ |------------|
| Personnel Cost (FTE) | £1,910,000 | 75% |
| Contractor Cost (if used) | £1,217,000 | 48% |
| Azure Infrastructure | £120,000 | 5% |
| Tooling & Licenses | £50,000 | 2% |
| Training & Certification | £30,000 | 1% |
| **Total (FTE Model)** | **£2,110,000** | **100%** |
| **Total (Contractor Model)** | **£1,417,000** | **67%** |

---

## Azure Infrastructure Cost Reference

| Azure Service | Monthly Cost | Annual Cost | Description |
| ------------- |--------------| ------------| ----------- |
| Azure App Service | £2,500 | £30,000 | Application hosting |
| Azure SQL Database | £1,800 | £21,600 | Data storage |
| Azure Functions | £500 | £6,000 | Serverless processing |
| Azure Storage | £300 | £3,600 | Blob and file storage |
| Azure Monitor | £400 | £4,800 | Monitoring and logging |
| Azure DevOps | £600 | £7,200 | CI/CD and project management |
| Azure Entra ID | £200 | £2,400 | Identity management |
| Azure Networking | £300 | £3,600 | Network infrastructure |
| **Total** | **£6,600** | **£79,200** | |

---

## Cost per Release

| Release | Duration | Team Size | Personnel Cost | Infrastructure Cost | Total Cost |
| ------- | -------- | --------- | --------------- | --------------------| ---------- |
| R1 (MVP) | 24 weeks | 22 | £1,910,000 | £79,200 | £1,989,200 |
| R2 (Multi-Env) | 16 weeks | 26 | £1,200,000 | £120,000 | £1,320,000 |
| R3 (SaaS) | 24 weeks | 37 | £2,800,000 | £180,000 | £2,980,000 |
| R4 (Enterprise) | 16 weeks | 46 | £3,500,000 | £240,000 | £3,740,000 |
| **Total** | **80 weeks** | | **£9,410,000** | **£619,200** | **£10,029,200** |

---

# Risk & Contingency

## Resource Risks

| Risk | Probability | Impact | Mitigation |
| ---- |------------|--------|------------|
| Key Person Dependency | Medium | High | Cross-training, documentation, knowledge sharing |
| Skill Gaps | Medium | Medium | Training, contractors, external consultants |
| Availability Risks | High | Medium | Buffer allocation, backup resources |
| Team Attrition | Low | High | Competitive compensation, positive culture |
| Contractor Unavailability | Medium | Medium | Early engagement, multiple contractors |
| Skill Obsolescence | Low | Medium | Continuous learning, training budget |
| Resource Allocation Conflict | Medium | Medium | Clear prioritisation, resource management |
| Capacity Overestimation | Medium | High | Conservative estimation, regular review |
| Scope Creep | High | High | Change control, scope management |
| Dependency Delays | Medium | High | Early identification, mitigation planning |

---

## Risk Assessment Matrix

| Risk Category | Probability Score | Impact Score | Risk Score | Priority |
| ------------- | ----------------- | ------------ | ---------- | -------- |
| Key Person Dependency | 3 | 4 | 12 | High |
| Skill Gaps | 3 | 3 | 9 | Medium |
| Availability Risks | 4 | 3 | 12 | High |
| Team Attrition | 2 | 4 | 8 | Medium |
| Contractor Unavailability | 3 | 3 | 9 | Medium |
| Skill Obsolescence | 2 | 3 | 6 | Low |
| Resource Allocation Conflict | 3 | 3 | 9 | Medium |
| Capacity Overestimation | 3 | 4 | 12 | High |
| Scope Creep | 4 | 4 | 16 | Critical |
| Dependency Delays | 3 | 4 | 12 | High |

---

## Key Person Dependency Mitigation

| Role | Dependency Level | Mitigation Strategy |
| ---- | ---------------- | ------------------- |
| Architecture Lead | High | Document architecture decisions, cross-train Domain Leads |
| Domain Engineering Leads | High | Pair programming, documentation, backup assignments |
| Operations Lead | High | Runbook documentation, automation, backup procedures |
| QA Lead | Medium | Document test strategy, automate test suites |
| Product Owner | Medium | Document product vision, backup BA support |
| Delivery Lead | Medium | Document processes, backup assignments |
| Senior Developers | Medium | Code reviews, documentation, knowledge sharing |

---

## Contingency Allocation

| Contingency Type | Percentage | Purpose |
| ---------------- | ---------- | ------- |
| Schedule Buffer | 15% | 2 sprints buffer in R1 timeline |
| Resource Buffer | 10% | Additional capacity for unplanned work |
| Cost Contingency | 10% | Budget reserve for cost overruns |
| Technical Contingency | 10% | Capacity for technical debt and refactoring |

---

## Risk Response Actions

| Risk Event | Response Action | Owner | Timeline |
| ---------- | --------------- | ----- |---------- |
| Key person departure | Activate knowledge transfer plan, recruit replacement | Delivery Lead | Immediate |
| Skill gap identified | Engage contractor or consultant, arrange training | Architecture Lead | 2-3 weeks |
| Capacity shortfall | Reallocate resources, reduce scope, engage contractors | Delivery Lead | 1-2 weeks |
| Cost overrun | Review allocation, optimise Azure usage, adjust scope | Programme Sponsor | 2-4 weeks |
| Quality issues | Add QA capacity, improve automation, extend testing | QA Lead | 1-2 sprints |
| Scope creep | Implement change control, review priorities | Product Owner | Immediate |
| Dependency delay | Identify alternatives, adjust schedule | Delivery Lead | 1-2 weeks |
| Technical issues | Engage architecture review, technical spike | Architecture Lead | 1-2 weeks |

---

## Risk Monitoring

| Monitoring Activity | Frequency | Owner |
| ------------------- |-----------| ----- |
| Risk Register Review | Weekly | Delivery Lead |
| Risk Assessment | Per Sprint | Delivery Lead |
| Dependency Review | Weekly | Delivery Lead |
| Capacity Monitoring | Per Sprint | Delivery Lead |
| Quality Metrics Review | Per Sprint | QA Lead |
| Cost Monitoring | Monthly | Programme Sponsor |

---

# External Resource Dependencies

## Microsoft

| Dependency | Type | Impact | Mitigation |
| ---------- | ---- |--------|------------|
| Azure Platform | Infrastructure | High | Multi-region deployment, SLA monitoring |
| Microsoft Entra ID | Identity | High | Configuration planning, support engagement |
| Microsoft Founders Hub | Credits & Support | Medium | Active engagement, benefit optimisation |
| Azure Support | Technical Support | Medium | Support plan, escalation paths |
| Azure DevOps | CI/CD Platform | High | Pipeline configuration, licence management |
| Azure Monitoring | Observability | Medium | Configuration, alerting setup |

---

## System Integrators

| Dependency | Type | Impact | Mitigation |
| ---------- | ---- |--------|------------|
| Customer Deployments | Implementation | Medium | Partner certification, joint delivery |
| Domain Expertise | Industry Knowledge | Medium | Knowledge transfer, documentation |
| Training | End-User Training | Low | Training materials, e-learning platform |
| Custom Development | Feature Extension | Low | Clear specifications, review processes |

---

## Third-Party Consultants

| Dependency | Type | Impact | Mitigation |
| ---------- | ---- |--------|------------|
| Security Consultants | Security Review | Medium | Early engagement, clear scope |
| Performance Consultants | Performance Testing | Low | Tool selection, training |
| Architecture Reviewers | Architecture Review | Low | Review scheduling, documentation |
| Compliance Consultants | Regulatory Compliance | Medium | Early engagement, documentation |

---

## External Dependency Management

| Activity | Frequency | Owner |
| -------- |-----------| ----- |
| Microsoft Support Review | Monthly | Operations Lead |
| SI Engagement Review | Per Sprint | Delivery Lead |
| Consultant Coordination | Per Engagement | Delivery Lead |
| Dependency Risk Assessment | Per Sprint | Delivery Lead |

---

# Resource Review Summary

| Area | Status |
| ---- | ------ |
| Team Composition | Approved |
| Skill Requirements | Approved |
| Resource Allocation | Approved |
| Capacity Calculation | Approved |
| Capacity vs. Demand | Approved |
| Resource Gaps & Hiring | Approved |
| Scaling Triggers | Approved |
| Cost Implications | Approved |
| Risk & Contingency | Approved |
| External Dependencies | Approved |

---

# Resource Management Processes

## Resource Allocation Process

```text id="dp06-007"
Sprint Planning
       |
Capacity Calculation
       |
Resource Allocation
       |
Sprint Execution
       |
Capacity Monitoring
       |
Adjustment if Needed
```

---

## Resource Management Activities

| Activity | Frequency | Owner | Output |
| -------- |-----------| ----- | ------ |
| Capacity Calculation | Per Sprint | Delivery Lead | Capacity Report |
| Resource Allocation | Per Sprint | Delivery Lead | Allocation Plan |
| Utilisation Monitoring | Weekly | Delivery Lead | Utilisation Report |
| Skill Gap Assessment | Monthly | Architecture Lead | Training Plan |
| Cost Monitoring | Monthly | Programme Sponsor | Cost Report |
| Risk Assessment | Per Sprint | Delivery Lead | Risk Register |

---

## Resource Reporting

| Report | Frequency | Audience | Content |
| ------ |-----------|----------|---------|
| Sprint Capacity Report | Per Sprint | Delivery Team | Capacity calculation, allocation |
| Resource Utilisation Report | Weekly | Delivery Lead | Utilisation metrics, trends |
| Cost Report | Monthly | Programme Sponsor | Cost tracking, budget status |
| Skill Gap Report | Monthly | Architecture Lead | Skills assessment, training needs |
| Hiring Progress Report | Bi-weekly | Programme Sponsor | Recruitment status, timeline |

---

## Resource Governance

| Governance Activity | Frequency | Participants |
| ------------------- |-----------|--------------|
| Resource Review Board | Monthly | Programme Sponsor, Delivery Lead, Architecture Lead |
| Capacity Planning Session | Per Sprint | Delivery Lead, Domain Leads |
| Budget Review | Monthly | Programme Sponsor, Delivery Lead |
| Hiring Decision | As Needed | Programme Sponsor, Delivery Lead |

---

# Team Development & Training

## Training Budget

| Training Area | Annual Budget | Description |
| ------------- |---------------|------------- |
| Technical Training | £15,000 | Azure certifications, .NET training |
| Agile Training | £5,000 | Scrum Master, Product Owner certifications |
| Domain Training | £5,000 | Financial services, migration knowledge |
| Security Training | £5,000 | Security certifications, best practices |
| **Total** | **£30,000** | |

---

## Certification Plan

| Role | Required Certifications | Timeline |
| ---- | ----------------------- |----------|
| Architecture Lead | Azure Solutions Architect, TOGAF | Sprint 1-4 |
| Operations Lead | Azure Administrator, Azure DevOps | Sprint 1-4 |
| QA Lead | ISTQB Advanced, Azure Test Engineer | Sprint 1-4 |
| Domain Eng Leads | Azure Developer, .NET certifications | Sprint 2-6 |
| Senior Developers | Azure Developer, .NET certifications | Sprint 2-6 |
| QA Engineers | ISTQB Foundation, Azure Test Engineer | Sprint 2-6 |

---

## Knowledge Sharing

| Activity | Frequency | Participants |
| -------- |-----------|--------------|
| Tech Talks | Bi-weekly | Engineering Team |
| Architecture Reviews | Weekly | Architecture Lead, Domain Leads |
| Code Reviews | Daily | Engineering Team |
| Retrospectives | Per Sprint | Full Team |
| Knowledge Base | Ongoing | All Team Members |

---

# Resource Monitoring & Reporting

## Key Performance Indicators

| KPI | Target | Measurement |
| ----- | ------ |-------------|
| Resource Utilisation | 75-85% | Billable hours / Available hours |
| Capacity Accuracy | ± 10% | Estimated vs. Actual capacity |
| Velocity Trend | Stable or improving | Sprint-over-sprint velocity |
| Cost Variance | ± 5% | Budget vs. Actual spend |
| Skill Coverage | > 90% | Required skills available |
| Onboarding Time | < 5 days | Time to productive |

---

## Monitoring Dashboard

```text id="dp06-008"
Resource Utilisation    Capacity vs. Demand    Cost Tracking
     |                        |                     |
   78%                     +189 SP              On Budget
     |                        |                     |
   Optimal                 Sufficient            Green
```

---

## Escalation Path

| Issue | Escalation Level | Response Time |
| ----- | ---------------- |---------------|
| Capacity shortfall | Delivery Lead | Immediate |
| Budget overrun | Programme Sponsor | 24 hours |
| Key person issue | Programme Sponsor | 24 hours |
| Skill gap critical | Architecture Lead | 48 hours |
| External dependency | Delivery Lead | 24 hours |

---

# Approval Statement

This Resource & Capacity Plan establishes the official resource management framework for MAP Release 1.

All resource allocation, capacity planning, and hiring decisions must be executed according to this document.

Resource changes must be reviewed and approved through the governance process defined in DP-01.

---

# Conclusion

The MAP Resource & Capacity Plan provides a comprehensive, data-driven approach to resource management that enables predictable delivery while maintaining cost efficiency and team sustainability.

The plan enables:

* Predictable capacity calculation and allocation
* Domain-aligned resource assignment
* Cost-effective FTE and contractor mix
* Scalable growth from MVP to enterprise
* Risk-aware resource planning
* External dependency management
* Continuous capacity monitoring and adjustment

while maintaining focus on rapid MVP delivery and business value realisation.

---

# Status

✅ Resource & Capacity Plan Approved

Resource Management Framework Established