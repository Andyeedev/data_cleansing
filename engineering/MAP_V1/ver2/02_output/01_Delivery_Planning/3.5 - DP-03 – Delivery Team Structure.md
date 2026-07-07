# DP-03 – Delivery Team Structure

## Migration Assurance Platform (MAP)

Version 1.0
Status: Complete

---

# Purpose

This document defines the Delivery Team Structure for the Migration Assurance Platform (MAP) Release 1.

The team structure establishes the organisational model, role definitions, responsibilities, reporting lines, skill requirements, and scaling approach for the teams delivering MAP.

This document translates the Delivery Strategy (DP-01) and Agile Delivery Framework (DP-02) into a concrete organisational design that enables:

* Effective delivery execution
* Clear accountability and ownership
* Domain-aligned engineering
* Governance compliance
* Scalable team growth
* Operational readiness

---

# Objectives

The delivery team structure must:

### Define Clear Roles and Responsibilities

---

### Enable Domain-Aligned Delivery

---

### Support Cross-Functional Collaboration

---

### Maintain Governance Accountability

---

### Scale from MVP to Full SaaS

---

### Align with Azure RBAC Strategy

---

### Support Multi-Customer Delivery

---

# Team Vision

The MAP delivery team will operate as:

> A lean, cross-functional, domain-aligned product delivery team with clear ownership, strong governance, and the ability to scale from MVP delivery through multi-customer SaaS operations.

---

# Organisational Structure

## Full Delivery Hierarchy

```text id="dp03-001"
Programme Sponsor
        |
  Product Owner
        |
  Delivery Lead
        |
 -----------------------------------------------------------
 |        |        |        |         |         |           |
Arch    QA      Ops    Discovery  Mapping   Validation
Lead    Lead    Lead     Eng Lead   Eng Lead   Eng Lead
 |       |       |         |          |          |
 |       |       |      Engineering  Engineering Engineering
 |       |       |        Team        Team        Team
 |       |       |
 |       |    Governance Eng Lead
 |       |       |
 |       |    Engineering Team
 |       |
 |    Reporting Eng Lead
 |       |
 |    Engineering Team
 |       |
 |    Administration Eng Lead
 |       |
 |    Engineering Team
 |
Business Analyst
 |
UX Designer
```

---

# Core Delivery Team

The MAP delivery team consists of the following core roles.

---

# Programme Sponsor

## Responsibility

Provide strategic direction and executive oversight.

---

### Activities

#### Strategic Alignment

---

#### Investment Decisions

---

#### Escalation Resolution

---

#### Stakeholder Management

---

#### Programme Governance

---

---

# Product Owner

## Responsibility

Own product vision, backlog, and business priorities.

---

### Activities

#### Product Vision

Define and communicate product direction.

---

#### Backlog Prioritisation

Order work by business value and risk.

---

#### Business Decisions

Make scope and feature decisions.

---

#### Sprint Acceptance

Accept or reject completed sprint work.

---

#### Stakeholder Communication

Represent business needs to the team.

---

#### Pilot Customer Engagement

Validate product-market fit with target customers.

---

---

# Delivery Lead

## Responsibility

Coordinate delivery execution across all workstreams.

---

### Activities

#### Delivery Coordination

Manage sprint execution and team dependencies.

---

#### Risk Management

Identify, assess, and mitigate delivery risks.

---

#### Sprint Reporting

Produce sprint reports and delivery metrics.

---

#### Governance Alignment

Ensure delivery aligns with governance requirements.

---

#### Stakeholder Reporting

Provide status updates to Programme Sponsor and stakeholders.

---

#### Escalation Management

Escalate blockers and issues through governance layers.

---

---

# Architecture Lead

## Responsibility

Govern solution architecture and technical design.

---

### Activities

#### Solution Governance

Ensure alignment with approved architecture (PD-01).

---

#### Design Compliance

Review designs against architecture principles.

---

#### Technical Decisions

Make architectural decisions within the delivery context.

---

#### Technology Evaluation

Assess technologies and frameworks for suitability.

---

#### Architecture Reviews

Conduct sprint-level architecture reviews.

---

#### Security Architecture

Ensure security controls are embedded in design (PD-04).

---

---

# Domain Engineering Leads

MAP organises engineering by platform domain. Each domain has a dedicated Engineering Lead responsible for technical delivery within that domain.

---

## Discovery Domain Engineering Lead

### Responsibility

Lead engineering for the Discovery domain.

---

### Domain Scope

#### Systems Management

Source system inventory and metadata.

---

#### Application Discovery

Application cataloguing and classification.

---

#### Database Discovery

Database identification and profiling.

---

#### Dependency Mapping

Asset relationship and dependency tracking.

---

---

## Mapping Domain Engineering Lead

### Responsibility

Lead engineering for the Mapping domain.

---

### Domain Scope

#### Source-to-Target Mapping

Transformation rule definition and management.

---

#### Transformation Rules

Business rule authoring and versioning.

---

#### Mapping Versioning

Version control for mapping definitions.

---

#### Mapping Validation

Mapping completeness and correctness checks.

---

---

## Validation Domain Engineering Lead

### Responsibility

Lead engineering for the Validation domain.

---

### Domain Scope

#### Validation Rules

Rule definition and configuration.

---

#### Validation Runs

Execution of validation processes.

---

#### Validation Results

Result capture and classification.

---

#### Defect Management

Defect identification, tracking, and resolution.

---

---

## Governance Domain Engineering Lead

### Responsibility

Lead engineering for the Governance domain.

---

### Domain Scope

#### Approval Workflows

Workflow definition and execution.

---

#### Approval Management

Approval routing and completion.

---

#### Evidence Management

Evidence capture and storage.

---

#### Audit Records

Audit trail creation and retrieval.

---

---

## Reporting Domain Engineering Lead

### Responsibility

Lead engineering for the Reporting domain.

---

### Domain Scope

#### KPI Management

Key Performance Indicator definition and calculation.

---

#### Dashboard Delivery

Five role-specific dashboards (PD-01).

---

#### Report Generation

Executive and operational reporting.

---

#### Metrics Aggregation

Cross-domain metrics collection and analysis.

---

---

## Administration Domain Engineering Lead

### Responsibility

Lead engineering for the Administration domain.

---

### Domain Scope

#### User Management

User identity and profile management.

---

#### Role Management

Role definition and assignment (RBAC).

---

#### Permission Management

Permission configuration and enforcement.

---

#### Platform Configuration

System settings and tenant configuration.

---

---

# Engineering Team

## Responsibility

Develop, test, and deliver technical solutions.

---

### Activities

#### Development

Build features, services, and components.

---

#### Unit Testing

Write and execute unit tests.

---

#### Technical Delivery

Implement technical tasks from the backlog.

---

#### Code Reviews

Participate in peer code review.

---

#### Documentation

Maintain technical documentation.

---

#### Defect Resolution

Fix defects identified during testing.

---

---

# QA Lead

## Responsibility

Define and execute the quality assurance strategy.

---

### Activities

#### Quality Assurance

Ensure product quality standards are met.

---

#### Test Strategy

Define test approach, scope, and coverage.

---

#### Release Validation

Validate releases for production readiness.

---

#### Defect Management

Triage and prioritise defects.

---

#### Test Automation

Define and maintain automated test suites.

---

#### UAT Coordination

Coordinate User Acceptance Testing with stakeholders.

---

---

# QA Engineers

## Responsibility

Execute test activities across all testing layers.

---

### Activities

#### Test Case Design

Create test cases from acceptance criteria.

---

#### Test Execution

Execute manual and automated tests.

---

#### Defect Reporting

Log defects with clear reproduction steps.

---

#### Regression Testing

Execute regression test suites.

---

#### Performance Testing

Conduct performance and load testing.

---

#### Security Testing

Execute security test scenarios.

---

---

# Operations Lead

## Responsibility

Ensure environment readiness and operational transition.

---

### Activities

#### Environment Readiness

Prepare development, test, UAT, and production environments.

---

#### Deployment Support

Support release deployment activities.

---

#### Operational Transition

Handover solution to operational support.

---

#### Monitoring Setup

Configure monitoring and alerting.

---

#### Infrastructure Management

Manage Azure infrastructure (AZ-01, AZ-02).

---

#### Cost Management

Monitor Azure costs and FinOps compliance.

---

---

# Business Analyst

## Responsibility

Bridge business needs and technical delivery.

---

### Activities

#### Requirements Analysis

Translate business needs into user stories.

---

#### Stakeholder Liaison

Communicate between business and delivery teams.

---

#### Documentation

Maintain requirements and process documentation.

---

#### Acceptance Criteria

Define acceptance criteria for user stories.

---

#### Process Mapping

Map current and future state processes.

---

#### Validation Support

Support UAT and business validation activities.

---

---

# UX Designer

## Responsibility

Design user experience and interface patterns.

---

### Activities

#### UX Design

Design user interfaces aligned with UX-01 strategy.

---

#### Wireframes

Create wireframes and page layouts (UX-05).

---

#### Dashboard Design

Design role-specific dashboards (UX-04).

---

#### Navigation Design

Define navigation model (UX-03).

---

#### Accessibility

Ensure compliance with accessibility standards (UX-06).

---

#### User Research

Conduct user research and usability testing.

---

---

# Role Responsibilities Matrix

## RACI Matrix

| Activity                    | Programme Sponsor | Product Owner | Delivery Lead | Architecture Lead | Domain Eng Lead | Engineering Team | QA Lead | Ops Lead | BA    | UX Designer |
| --------------------------- | ----------------- | ------------- | ------------- | ----------------- | --------------- | ---------------- | ------- | -------- | ----- | ----------- |
| Product Vision              | I                 | A             | C             | C                 | I               | I                | I       | I        | C     | C           |
| Backlog Prioritisation      | I                 | A             | R             | C                 | C               | I                | I       | I        | R     | I           |
| Sprint Planning             | I                 | A             | R             | C                 | R               | R                | R       | C        | R     | C           |
| Architecture Decisions      | I                 | C             | C             | A                 | R               | C                | I       | I        | I     | I           |
| Domain Development          | I                 | I             | C             | C                 | A               | R                | I       | I        | I     | I           |
| Quality Assurance           | I                 | C             | C             | I                 | C               | R                | A       | I        | I     | I           |
| Test Strategy               | I                 | C             | C             | I                 | I               | C                | A       | I        | R     | I           |
| Environment Management      | I                 | I             | C             | I                 | I               | I                | I       | A        | I     | I           |
| Deployment                  | I                 | A             | R             | C                 | C               | R                | R       | A        | I     | I           |
| Security Implementation     | I                 | C             | C             | A                 | R               | R                | R       | C        | I     | I           |
| UX Design                   | I                 | C             | I             | C                 | I               | I                | I       | I        | R     | A           |
| Requirements Analysis       | I                 | A             | C             | C                 | C               | I                | I       | I        | R     | R           |
| Release Readiness           | A                 | A             | R             | R                 | R               | R                | R       | R        | C     | I           |
| Risk Management             | I                 | C             | A             | C                 | R               | I                | C       | C        | C     | I           |
| Governance Compliance       | A                 | C             | R             | R                 | C               | I                | C       | C        | R     | I           |

Key: R = Responsible, A = Accountable, C = Consulted, I = Informed

---

# Domain Team Structure

## Domain Alignment Model

Each platform domain (PD-02) is assigned a dedicated engineering team led by a Domain Engineering Lead.

---

### Domain Team Composition

```text id="dp03-002"
Domain Engineering Lead
         |
 --------------------------------
 |              |              |
Senior Dev     Dev          QA Engineer
```

---

### Domain Mapping

| Domain         | Engineering Lead        | Team Size (R1) | Key Entities                                    |
| -------------- | ----------------------- | -------------- | ----------------------------------------------- |
| Discovery      | Discovery Eng Lead      | 2              | System, Application, Database, Dependency       |
| Mapping        | Mapping Eng Lead        | 2              | Mapping, Transformation Rule, Mapping Version   |
| Validation     | Validation Eng Lead     | 2              | Validation Rule, Validation Run, Validation Result, Defect |
| Governance     | Governance Eng Lead     | 2              | Approval Workflow, Approval, Evidence, Audit Record |
| Reporting      | Reporting Eng Lead      | 1              | KPI, Dashboard                                  |
| Administration | Administration Eng Lead | 1              | User, Role, Permission                          |

---

### Domain Responsibilities

#### Discovery Domain

Source system and application inventory for migration programmes.

---

#### Mapping Domain

Source-to-target transformation definitions and rule management.

---

#### Validation Domain

Migration assurance through rule-based validation and defect tracking.

---

#### Governance Domain

Approval workflows, evidence management, and audit trails.

---

#### Reporting Domain

KPI dashboards and executive reporting across five dashboards (PD-01).

---

#### Administration Domain

User identity, RBAC, and platform configuration management.

---

---

# Skill Requirements Matrix

## Role-to-Skill Mapping

| Role                    | Primary Skills                                                            |
| ----------------------- | ------------------------------------------------------------------------- |
| Programme Sponsor       | Strategic leadership, Investment management, Stakeholder engagement       |
| Product Owner           | Product management, Backlog prioritisation, Business analysis, Agile      |
| Delivery Lead           | Delivery management, Risk management, Agile ceremonies, Reporting         |
| Architecture Lead       | Solution architecture, Cloud architecture, Security design, API design    |
| Domain Engineering Lead | Domain expertise, Technical leadership, Code review, Design patterns      |
| Senior Developer        | Full-stack development, Cloud services, API development, Testing          |
| Developer               | Application development, Unit testing, CI/CD, Version control            |
| QA Lead                 | Test strategy, Test automation, Quality management, Defect management      |
| QA Engineer             | Test execution, Test case design, Automation frameworks, Reporting        |
| Operations Lead         | Azure management, CI/CD pipelines, Monitoring, Infrastructure as Code    |
| Business Analyst        | Requirements analysis, Process mapping, User stories, Documentation       |
| UX Designer             | UX design, Wireframing, Dashboard design, Accessibility, User research    |

---

### Technical Skill Requirements

| Skill Area               | Roles Required                                      |
| ------------------------ | --------------------------------------------------- |
| .NET / C#                | Domain Eng Lead, Senior Dev, Developer              |
| TypeScript / React       | Domain Eng Lead, Senior Dev, Developer              |
| Azure SQL                | Domain Eng Lead, Senior Dev, Developer              |
| Azure Services           | Domain Eng Lead, Operations Lead, Senior Dev        |
| REST API Design          | Architecture Lead, Domain Eng Lead, Senior Dev      |
| Security / Entra ID      | Architecture Lead, Operations Lead, QA Lead         |
| CI/CD Pipelines          | Operations Lead, Senior Dev                         |
| Infrastructure as Code   | Operations Lead                                     |
| Test Automation          | QA Lead, QA Engineer                                |
| Agile / Scrum            | Delivery Lead, Product Owner, QA Lead               |
| Domain-Driven Design     | Architecture Lead, Domain Eng Lead                  |
| Git / Version Control    | All engineering roles                                |

---

# Team Scaling Model

## Release 1 – MVP (Current)

Lean team focused on MVP delivery.

---

### R1 Team Composition

| Role                    | Headcount |
| ----------------------- | --------- |
| Programme Sponsor       | 1         |
| Product Owner           | 1         |
| Delivery Lead           | 1         |
| Architecture Lead       | 1         |
| Domain Engineering Leads| 6         |
| Senior Developers       | 3         |
| Developers              | 3         |
| QA Lead                 | 1         |
| QA Engineers            | 2         |
| Operations Lead         | 1         |
| Business Analyst        | 1         |
| UX Designer             | 1         |
| **Total**               | **22**    |

---

### R1 Focus

#### MVP Feature Delivery

---

#### Core Domain Services

---

#### Basic Security Implementation

---

#### Single Environment Deployment

---

#### Pilot Customer Readiness

---

---

## Release 2 – Multi-Environment

Expand team for multi-environment support.

---

### R2 Team Additions

| Role                    | Headcount | Purpose                      |
| ----------------------- | --------- | ---------------------------- |
| Senior Developers       | +2        | Additional domain capacity   |
| QA Engineers            | +1        | Multi-environment testing    |
| Operations Engineer     | +1        | Environment management       |
| **Total**               | **26**    |                              |

---

### R2 Focus

#### Multi-Environment Management

---

#### Enhanced Testing Coverage

---

#### Performance Optimisation

---

#### Operational Maturity

---

---

## Release 3 – Multi-Customer SaaS

Scale team for SaaS operations.

---

### R3 Team Additions

| Role                    | Headcount | Purpose                      |
| ----------------------- | --------- | ---------------------------- |
| Product Owner           | +1        | Customer success focus       |
| Domain Engineering Leads| +2        | Feature expansion            |
| Senior Developers       | +3        | SaaS feature delivery        |
| Developers              | +2        | Additional capacity          |
| QA Engineers            | +1        | Multi-tenant testing         |
| Operations Engineers    | +1        | SaaS operations              |
| Business Analyst        | +1        | Customer requirements        |
| **Total**               | **37**    |                              |

---

### R3 Focus

#### Multi-Tenant Architecture

---

#### Customer Onboarding

---

#### SaaS Operations

---

#### Scalability Enhancement

---

---

## Release 4 – Enterprise Scale

Full enterprise team for scaled operations.

---

### R4 Team Composition

| Role                    | Headcount | Purpose                      |
| ----------------------- | --------- | ---------------------------- |
| Programme Sponsor       | 1         | Executive oversight          |
| Product Owners          | 2         | Product + Customer success   |
| Delivery Leads          | 2         | Multiple workstreams         |
| Architecture Lead       | 1         | Enterprise architecture      |
| Domain Engineering Leads| 8         | Feature + platform domains   |
| Senior Developers       | 6         | Core delivery                |
| Developers              | 6         | Feature delivery             |
| QA Lead                 | 1         | Quality strategy             |
| QA Engineers            | 4         | Comprehensive testing        |
| Operations Leads        | 2         | Platform + customer ops      |
| Business Analysts       | 2         | Requirements + customer      |
| UX Designers            | 2         | Product + customer UX        |
| DevOps Engineer         | 2         | CI/CD and infrastructure     |
| Security Engineer       | 1         | Security operations          |
| **Total**               | **46**    |                              |

---

### R4 Focus

#### Enterprise Customer Support

---

#### Advanced Analytics & AI

---

#### Global Expansion

---

#### Regulatory Compliance

---

---

## Scaling Summary

```text id="dp03-003"
R1 (MVP)       R2 (Multi-Env)   R3 (SaaS)       R4 (Enterprise)
   |                |                |                |
 22               26               37               46
   |                |                |                |
  Core           Enhanced        Scaled          Enterprise
```

---

# External Dependencies

## Microsoft

### Relationship Type

Technology Partner / Azure Platform Provider

---

### Dependencies

#### Azure Platform

Core infrastructure and managed services.

---

#### Microsoft Entra ID

Identity and access management (PD-04).

---

#### Microsoft Founders Hub

Credits, benefits, and technical support.

---

#### Azure Support

Technical support for Azure services.

---

### Engagement Model

#### Technical Support

Azure support tickets and escalation.

---

#### Architecture Reviews

Microsoft architecture review sessions.

---

#### Co-Sell Readiness

Joint go-to-market activities (ISP-06).

---

---

## System Integrators

### Relationship Type

Implementation Partners

---

### Dependencies

#### Customer Deployments

On-site implementation support.

---

#### Domain Expertise

Industry-specific migration knowledge.

---

#### Training

End-user and administrator training.

---

### Engagement Model

#### Partner Programme

Structured partnership framework (ISP-09).

---

#### Certification

SI certification on MAP platform.

---

#### Joint Delivery

Collaborative customer implementations.

---

---

## Third-Party Vendors

### Relationship Type

Technology and Service Providers

---

### Dependencies

#### Development Tools

IDE, version control, CI/CD tooling.

---

#### Testing Tools

Test automation and performance testing.

---

#### Monitoring

Application and infrastructure monitoring.

---

### Engagement Model

#### Tool Licensing

Commercial licensing agreements.

---

#### Technical Support

Vendor support agreements.

---

---

# Reporting Lines

## Internal Reporting Structure

```text id="dp03-004"
Programme Sponsor
        |
  Product Owner
        |
  Delivery Lead
        |
 --------------------------------------------------
 |         |         |         |         |        |
Arch     QA Lead   Ops Lead  Domain   BA      UX
Lead                          Eng Leads        Designer
 |
Domain Eng Leads
 |
Engineering Team
```

---

### Reporting Relationships

| Role                    | Reports To           | Direct Reports                 |
| ----------------------- | -------------------- | ------------------------------ |
| Programme Sponsor       | Board / investors    | Product Owner, Delivery Lead   |
| Product Owner           | Programme Sponsor    | BA, UX Designer                |
| Delivery Lead           | Programme Sponsor    | Arch Lead, QA Lead, Ops Lead   |
| Architecture Lead       | Delivery Lead        | Domain Eng Leads               |
| Domain Engineering Lead | Architecture Lead    | Senior Dev, Dev, QA Eng        |
| Senior Developer        | Domain Eng Lead      | Developer                      |
| QA Lead                 | Delivery Lead        | QA Engineers                   |
| Operations Lead         | Delivery Lead        | Operations Engineer            |
| Business Analyst        | Product Owner        | —                              |
| UX Designer             | Product Owner        | —                              |

---

### Escalation Path

```text id="dp03-005"
Team Member
     |
Domain Eng Lead / QA Lead / Ops Lead
     |
Delivery Lead
     |
Programme Sponsor
```

---

---

# Team Ceremonies

## Ceremony Calendar

| Ceremony                    | Frequency | Duration | Participants                    |
| --------------------------- | --------- | -------- | ------------------------------- |
| Daily Stand-Up              | Daily     | 15 min   | All delivery team members       |
| Sprint Planning             | Bi-weekly | 2 hours  | Product Owner, Delivery Lead, Domain Leads, QA Lead |
| Sprint Review               | Bi-weekly | 1 hour   | Full team + stakeholders        |
| Sprint Retrospective        | Bi-weekly | 1 hour   | Full delivery team              |
| Backlog Refinement          | Weekly    | 1 hour   | Product Owner, BA, Domain Leads |
| Architecture Review         | Weekly    | 1 hour   | Architecture Lead, Domain Leads |
| Security Review             | Bi-weekly | 30 min   | Architecture Lead, Ops Lead, QA Lead |
| Delivery Board              | Weekly    | 30 min   | Delivery Lead, Domain Leads, QA Lead, Ops Lead |
| Programme Governance        | Monthly   | 1 hour   | Programme Sponsor, Product Owner, Delivery Lead |
| Release Readiness Review    | Per release| 1 hour  | Full team + stakeholders        |

---

### Ceremony Details

#### Daily Stand-Up

Purpose: synchronise team activities and identify blockers.

---

#### Sprint Planning

Purpose: define sprint scope and commitment.

---

#### Sprint Review

Purpose: demonstrate completed work and gather feedback.

---

#### Sprint Retrospective

Purpose: identify improvements and increase effectiveness.

---

#### Backlog Refinement

Purpose: prepare and clarify upcoming backlog items.

---

#### Architecture Review

Purpose: ensure technical alignment and quality.

---

#### Security Review

Purpose: validate security controls and compliance.

---

#### Delivery Board

Purpose: review delivery progress, risks, and dependencies.

---

#### Programme Governance

Purpose: strategic oversight and escalation resolution.

---

#### Release Readiness Review

Purpose: validate release for production deployment.

---

---

# Team Collaboration Model

## Cross-Functional Collaboration

```text id="dp03-006"
Product Owner  <-->  Business Analyst  <-->  UX Designer
        |                    |                    |
        +--------------------+--------------------+
                             |
                       Delivery Lead
                             |
        +--------------------+--------------------+
        |                    |                    |
Architecture Lead      QA Lead            Operations Lead
        |                    |                    |
Domain Eng Leads       QA Engineers       Ops Engineers
        |
Engineering Team
```

---

### Collaboration Points

| Interaction                  | Participants                            | Purpose                        |
| ---------------------------- | --------------------------------------- | ------------------------------ |
| Story Refinement             | PO, BA, UX, Domain Lead                 | Clarify requirements           |
| Design Review                | Arch Lead, Domain Lead, UX              | Validate design approach       |
| Test Planning                | QA Lead, Domain Lead, BA                | Define test approach           |
| Deployment Planning          | Ops Lead, QA Lead, Domain Lead          | Plan release deployment        |
| Security Consultation        | Arch Lead, Ops Lead                     | Security design review         |
| Sprint Demo Preparation      | Domain Lead, QA Eng                     | Prepare sprint demonstration   |

---

---

# Governance Alignment

## Three-Layer Governance

The team structure aligns with the three governance layers defined in DP-01.

---

### Programme Governance

| Activity              | Team Participant  |
| --------------------- | ----------------- |
| Strategic Decisions   | Programme Sponsor |
| Investment Oversight  | Programme Sponsor |
| Programme Reporting   | Delivery Lead     |
| Stakeholder Alignment | Product Owner     |

---

### Delivery Governance

| Activity              | Team Participant         |
| --------------------- | ------------------------ |
| Sprint Oversight      | Delivery Lead            |
| Architecture Governance| Architecture Lead       |
| Quality Governance    | QA Lead                  |
| Operational Governance| Operations Lead          |
| Scope Management      | Product Owner            |

---

### Sprint Governance

| Activity              | Team Participant         |
| --------------------- | ------------------------ |
| Sprint Planning       | Full team                |
| Daily Execution       | Domain Leads + Engineers |
| Sprint Review         | Full team + stakeholders |
| Sprint Retrospective  | Full team                |
| Backlog Management    | Product Owner + BA       |

---

---

# Azure RBAC Alignment

## Team Role to Azure Role Mapping

The delivery team roles align with the Azure RBAC roles defined in AZ-02.

---

### RBAC Role Mapping

| Delivery Role           | Azure RBAC Role           | Access Scope                    |
| ----------------------- | ------------------------- | ------------------------------- |
| Operations Lead         | Platform Administrator    | Full platform control           |
| Delivery Lead           | Platform Administrator    | Full platform control           |
| Architecture Lead       | Environment Administrator | Environment management          |
| Domain Engineering Lead | Application Operator      | Application deployment          |
| Senior Developer        | Application Operator      | Application deployment          |
| Developer               | Application Operator      | Application deployment          |
| QA Lead                 | Application Operator      | Test environment access         |
| QA Engineer             | Read Only User            | Reporting and test results      |
| Product Owner           | Read Only User            | Reporting access                |
| Business Analyst        | Read Only User            | Reporting access                |

---

### Access Principles

#### Least Privilege

Team members receive minimum required access.

---

#### Role-Based Access

Access granted through role assignment, not individual.

---

#### Environment Separation

Production access restricted to authorised roles.

---

#### Audit Trail

All access changes logged and auditable.

---

---

# Team Capability Matrix

## Capability Coverage

| Capability          | Primary Owner        | Supporting Roles                    |
| ------------------- | -------------------- | ----------------------------------- |
| Product Direction   | Product Owner        | BA, UX Designer                     |
| Architecture        | Architecture Lead    | Domain Eng Leads                    |
| Discovery Domain    | Discovery Eng Lead   | Senior Dev, Developer               |
| Mapping Domain      | Mapping Eng Lead     | Senior Dev, Developer               |
| Validation Domain   | Validation Eng Lead  | Senior Dev, Developer, QA Eng       |
| Governance Domain   | Governance Eng Lead  | Senior Dev, Developer, QA Eng       |
| Reporting Domain    | Reporting Eng Lead   | Developer, BA                       |
| Administration Domain| Administration Eng Lead| Senior Dev, Developer              |
| Quality Assurance   | QA Lead              | QA Engineers, Domain Eng Leads      |
| Operations          | Operations Lead      | DevOps Engineer                     |
| Security            | Architecture Lead    | Operations Lead, QA Lead            |
| UX Design           | UX Designer          | BA, Product Owner                   |
| Delivery Management | Delivery Lead        | Domain Eng Leads, QA Lead           |

---

---

# Team Onboarding

## Onboarding Process

```text id="dp03-007"
Day 1        Day 2-3       Day 4-5       Week 2
  |             |             |             |
Access        Orientation   Domain       Sprint
Setup         & Tools       Training     Join
```

---

### Onboarding Activities

| Activity                | Duration | Owner              |
| ----------------------- | -------- | ------------------ |
| Access Provisioning     | 1 day    | Operations Lead    |
| Platform Overview       | 0.5 day  | Delivery Lead      |
| Architecture Walkthrough| 0.5 day  | Architecture Lead  |
| Domain Training         | 1 day    | Domain Eng Lead    |
| Tooling Setup           | 0.5 day  | Operations Lead    |
| Security Training       | 0.5 day  | Architecture Lead  |
| Sprint Participation    | Ongoing  | Domain Eng Lead    |

---

---

# Success Measures

## Team Performance Metrics

| Measure                        | Target   |
| ------------------------------ | -------- |
| Sprint Goal Achievement        | > 90%    |
| Story Completion Rate          | > 90%    |
| Defect Escape Rate             | < 5%     |
| Team Velocity Stability        | ±15%     |
| Architecture Review Pass Rate  | > 95%    |
| Security Review Pass Rate      | 100%     |
| Onboarding Time (new member)   | < 5 days |
| Team Satisfaction Score        | > 4/5    |

---

---

# Delivery Team Structure Review Summary

| Area                       | Status   |
| -------------------------- | -------- |
| Organisational Structure   | Approved |
| Role Definitions           | Approved |
| RACI Matrix                | Approved |
| Domain Team Structure      | Approved |
| Skill Requirements         | Approved |
| Team Scaling Model         | Approved |
| External Dependencies      | Approved |
| Reporting Lines            | Approved |
| Team Ceremonies            | Approved |
| Azure RBAC Alignment       | Approved |
| Governance Alignment       | Approved |
| Onboarding Process         | Approved |

---

# Approval Statement

This Delivery Team Structure establishes the official organisational model for MAP Release 1.

All delivery activities must be executed by roles defined in this document.

Team members must operate according to the reporting lines, ceremonies, and governance structures defined herein.

---

# Conclusion

The MAP Delivery Team Structure provides a clear, domain-aligned, and scalable organisational model for delivering the MAP MVP and evolving toward full SaaS operations.

The team structure enables:

* Clear role ownership and accountability
* Domain-aligned engineering delivery
* Cross-functional collaboration
* Governance compliance at all levels
* Scalable growth from MVP to enterprise
* Alignment with Azure RBAC strategy
* Structured onboarding and capability development

while maintaining focus on rapid MVP delivery and business value realisation.

---

# Status

✅ Delivery Team Structure Approved

Team Structure Established
