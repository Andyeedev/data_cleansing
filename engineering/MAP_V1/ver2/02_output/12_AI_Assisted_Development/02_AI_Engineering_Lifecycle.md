# MAP AI Engineering Lifecycle

| Field | Value |
|-------|-------|
| **Document** | MAP AI Engineering Lifecycle |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal |
| **Owner** | MAP Engineering Leadership |

---

## Overview

This document defines how AI is integrated into every phase of the MAP software development lifecycle. For each phase, we specify the AI role, human role, automation level, and approval requirements. The guiding principle remains: AI accelerates, humans decide.

---

## Lifecycle Phases

### 1. Planning

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with backlog refinement, story estimation, sprint planning, risk identification, and dependency analysis |
| **Human Role** | Makes final prioritization decisions, negotiates scope, owns delivery commitments |
| **Automation Level** | Low |
| **Approval Required** | Yes |

#### AI Capabilities

- **Backlog Refinement:** AI analyzes user stories for completeness, identifies missing acceptance criteria, suggests story splitting when items are too large
- **Story Estimation:** AI provides effort estimates based on historical velocity, complexity analysis, and similar past stories
- **Sprint Planning:** AI suggests optimal sprint allocations based on team capacity, skill distribution, and dependency chains
- **Risk Identification:** AI flags stories with high complexity, unclear requirements, or external dependencies
- **Dependency Analysis:** AI maps cross-team dependencies and identifies critical path bottlenecks

#### Human Responsibilities

- Validate AI-generated estimates against engineering judgment
- Make final priority calls based on business context AI cannot see
- Approve sprint commitments and delivery timelines
- Override AI recommendations when domain expertise dictates

---

### 2. Requirements

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with requirement analysis, gap detection, acceptance criteria generation, and user story refinement |
| **Human Role** | Validates business alignment, confirms regulatory compliance, owns requirement decisions |
| **Automation Level** | Medium |
| **Approval Required** | Yes |

#### AI Capabilities

- **Requirement Analysis:** AI parses natural language requirements and identifies ambiguities, contradictions, and incomplete specifications
- **Gap Detection:** AI compares requirements against existing system capabilities and identifies missing functionality
- **Acceptance Criteria:** AI generates testable acceptance criteria from user stories, including edge cases and error scenarios
- **Story Refinement:** AI suggests clarifying questions, identifies implicit assumptions, and proposes structured formats

#### Human Responsibilities

- Confirm requirements align with MAP business objectives and migration domain expertise
- Validate AI-identified gaps against actual stakeholder needs
- Approve acceptance criteria for regulatory and compliance alignment
- Own final requirement sign-off

---

### 3. Architecture

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with design patterns, technology evaluation, architecture decisions, diagram generation, and trade-off analysis |
| **Human Role** | Makes architecture decisions, owns technical vision, validates non-functional requirements |
| **Automation Level** | Low |
| **Approval Required** | Yes |

#### AI Capabilities

- **Design Patterns:** AI suggests applicable patterns (CQRS, Event Sourcing, etc.) based on requirements and constraints
- **Technology Evaluation:** AI provides comparative analysis of libraries, frameworks, and services against requirements
- **Architecture Decisions:** AI drafts Architecture Decision Records (ADRs) with trade-off analysis and alternatives considered
- **Diagram Generation:** AI produces C4 model diagrams, sequence diagrams, and data flow diagrams from descriptions
- **Trade-off Analysis:** AI quantifies trade-offs between performance, cost, complexity, and maintainability

#### Human Responsibilities

- Make final architecture decisions based on long-term technical vision
- Validate AI suggestions against MAP's existing architecture and team capabilities
- Ensure architectural choices meet security, compliance, and scalability requirements
- Own the architecture backlog and technical debt strategy

---

### 4. Development

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with code generation, refactoring, code completion, boilerplate creation, API design, and database schema |
| **Human Role** | Writes critical business logic, reviews all AI output, owns code quality |
| **Automation Level** | High |
| **Approval Required** | Yes |

#### AI Capabilities

- **Code Generation:** AI produces implementation code from specifications, including React components, .NET services, and Azure infrastructure
- **Refactoring:** AI identifies and applies refactoring opportunities (extract method, rename, simplify logic)
- **Code Completion:** AI provides inline suggestions as engineers type, reducing keystrokes and boilerplate
- **Boilerplate Creation:** AI generates repetitive code (CRUD operations, API clients, configuration files)
- **API Design:** AI suggests RESTful API designs, OpenAPI specifications, and client code generation
- **Database Schema:** AI designs migration scripts, index strategies, and query optimizations for Azure SQL MI

#### Human Responsibilities

- Review every line of AI-generated code for correctness and security
- Write complex business logic and domain-specific algorithms personally
- Ensure AI-generated code follows MAP coding standards and conventions
- Validate performance characteristics of AI-suggested implementations
- Own code review and merge decisions

---

### 5. Testing

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with test generation, test data creation, edge case identification, regression test selection, and coverage analysis |
| **Human Role** | Validates test quality, defines test strategy, owns test decisions |
| **Automation Level** | High |
| **Approval Required** | Yes |

#### AI Capabilities

- **Test Generation:** AI creates unit tests, integration tests, and end-to-end tests from code and specifications
- **Test Data Creation:** AI generates realistic test datasets for migration validation scenarios
- **Edge Case Identification:** AI discovers boundary conditions, null scenarios, and error paths humans may overlook
- **Regression Selection:** AI identifies which existing tests are affected by code changes and prioritizes execution
- **Coverage Analysis:** AI identifies coverage gaps and suggests tests to close critical paths

#### Human Responsibilities

- Define overall test strategy and quality gates
- Validate AI-generated tests actually verify intended behavior
- Write tests for complex business rules and regulatory requirements
- Approve test data for production-like scenarios
- Own quality release decisions

---

### 6. Deployment

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with pipeline configuration, deployment scripts, rollback procedures, and environment setup |
| **Human Role** | Approves production deployments, owns deployment strategy, validates rollback plans |
| **Automation Level** | Medium |
| **Approval Required** | Yes |

#### AI Capabilities

- **Pipeline Configuration:** AI generates and optimizes Azure DevOps/GitHub Actions pipeline definitions
- **Deployment Scripts:** AI creates ARM/Bicep templates, container configurations, and infrastructure-as-code
- **Rollback Procedures:** AI drafts rollback playbooks with step-by-step recovery actions
- **Environment Setup:** AI provisions development, staging, and production environments consistently

#### Human Responsibilities

- Approve all production deployment configurations
- Validate infrastructure-as-code against security and compliance policies
- Authorize production releases and validate rollback procedures
- Monitor deployments and own incident response
- Ensure deployment aligns with MAP's Azure Container Apps architecture

---

### 7. Support

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with incident analysis, root cause detection, fix suggestions, and knowledge base updates |
| **Human Role** | Diagnoses incidents, implements fixes, owns customer communication |
| **Automation Level** | Medium |
| **Approval Required** | Yes |

#### AI Capabilities

- **Incident Analysis:** AI correlates logs, metrics, and traces to identify failure patterns
- **Root Cause Detection:** AI suggests probable root causes based on symptoms, recent changes, and historical incidents
- **Fix Suggestions:** AI proposes code fixes for known error patterns and common failure modes
- **Knowledge Base Updates:** AI drafts post-incident documentation and updates runbooks

#### Human Responsibilities

- Triage and prioritize incidents based on business impact
- Validate AI-suggested root causes against actual system behavior
- Implement and test fixes before deployment
- Communicate with stakeholders during incidents
- Own post-incident reviews and corrective actions

---

### 8. Operations

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with monitoring analysis, anomaly detection, capacity planning, and performance optimization |
| **Human Role** | Interprets operational data, makes infrastructure decisions, owns SLAs |
| **Automation Level** | Medium |
| **Approval Required** | Yes |

#### AI Capabilities

- **Monitoring Analysis:** AI processes Application Insights, Log Analytics, and Azure Monitor data to identify trends
- **Anomaly Detection:** AI flags unusual patterns in latency, error rates, and resource utilization
- **Capacity Planning:** AI forecasts resource needs based on usage trends and growth projections
- **Performance Optimization:** AI suggests query optimizations, caching strategies, and scaling configurations

#### Human Responsibilities

- Interpret operational insights in business context
- Make infrastructure scaling and optimization decisions
- Own SLA commitments and performance budgets
- Validate AI recommendations against cost and compliance constraints

---

### 9. Maintenance

| Attribute | Value |
|-----------|-------|
| **AI Role** | Assists with dependency updates, technical debt identification, code modernization, and documentation updates |
| **Human Role** | Prioritizes maintenance work, validates modernization decisions, owns technical debt strategy |
| **Automation Level** | Medium |
| **Approval Required** | Yes |

#### AI Capabilities

- **Dependency Updates:** AI identifies outdated packages, evaluates breaking changes, and suggests update strategies
- **Technical Debt Identification:** AI flags code smells, duplication, complexity hotspots, and anti-patterns
- **Code Modernization:** AI suggests language feature upgrades (e.g., C# modern patterns, React hooks) and architectural improvements
- **Documentation Updates:** AI refreshes documentation when code changes, keeping docs synchronized with implementation

#### Human Responsibilities

- Prioritize maintenance work alongside feature development
- Validate AI-suggested dependency updates for compatibility and security
- Decide which technical debt to address and when
- Approve modernization changes that affect system behavior

---

## Automation Level Summary

| Phase | Automation Level | Rationale |
|-------|-----------------|-----------|
| Planning | Low | Business context and prioritization require human judgment |
| Requirements | Medium | AI accelerates analysis, humans validate business alignment |
| Architecture | Low | Long-term technical vision requires human ownership |
| Development | High | AI excels at code generation; humans review for correctness |
| Testing | High | AI generates comprehensive tests; humans validate quality |
| Deployment | Medium | AI automates pipeline config; humans approve production |
| Support | Medium | AI accelerates diagnosis; humans implement fixes |
| Operations | Medium | AI identifies patterns; humans interpret business impact |
| Maintenance | Medium | AI identifies opportunities; humans prioritize work |

---

## AI Integration Principles

1. **Phase-gated AI:** AI assistance is available throughout, but human approval gates exist at each phase transition
2. **Escalation path:** Any AI output can be overridden by human judgment at any time
3. **Auditability:** All AI-generated artefacts are version-controlled with attribution
4. **Continuous improvement:** AI tool effectiveness is measured and optimized quarterly
5. **Model flexibility:** AI tools can be swapped without changing the lifecycle process
