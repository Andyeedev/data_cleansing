# MAP MVP Build Specification - Epic Breakdown

**Document:** MAP MVP Epic Breakdown
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Epic Summary

| Epic | Purpose | Priority | Effort |
|------|---------|----------|--------|
| E01: Foundation & Infrastructure | Azure setup, CI/CD, project scaffolding | P0 | 40 SP |
| E02: Identity & Authentication | Entra ID SSO, RBAC, tenant isolation | P0 | 35 SP |
| E03: Discovery & Inventory | Azure resource scanning, dependency mapping | P1 | 50 SP |
| E04: Validation Engine | Check execution, findings, health scoring | P1 | 60 SP |
| E05: AI Insights | Azure OpenAI integration, prompt management | P2 | 40 SP |
| E06: Reporting & Dashboards | Real-time dashboards, report generation | P2 | 35 SP |
| E07: Governance & Compliance | Policy engine, compliance evaluation | P2 | 30 SP |
| E08: Operations & Monitoring | Observability, alerting, health checks | P1 | 25 SP |

**Total Estimated Effort:** 315 Story Points

---

## E01: Foundation & Infrastructure

### Purpose
Establish the Azure infrastructure, CI/CD pipelines, project scaffolding, and development environment foundation upon which all subsequent epics build.

### Business Value
Provides the stable, repeatable infrastructure foundation that enables rapid, consistent delivery across all subsequent sprints. Eliminates manual environment setup and deployment risks.

### Dependencies
None (first epic to execute).

### Priority
P0 - Critical path; all other epics depend on this.

### Estimated Effort
40 Story Points

### Acceptance Criteria

1. Azure subscription is provisioned with all required resource groups and service quotas
2. CI/CD pipeline builds, tests, and deploys all projects to dev environment on every push to main
3. All projects compile, pass unit tests, and deploy successfully
4. Infrastructure as Code templates deploy identical environments across dev/staging/prod
5. Development environment is fully operational with database, cache, and container hosting

### Suggested Sprint
Sprint 0 (Weeks 1-2)

---

## E02: Identity & Authentication

### Purpose
Implement enterprise-grade identity and access management using Microsoft Entra ID, including single sign-on, role-based access control, and multi-tenant data isolation.

### Business Value
Enables enterprise adoption by providing secure, familiar SSO login, proper access controls, and data isolation between customer tenants - critical requirements for financial services customers.

### Dependencies
- E01: Foundation & Infrastructure (Azure services, CI/CD, project scaffolding)

### Priority
P0 - Required for all user-facing functionality.

### Estimated Effort
35 Story Points

### Acceptance Criteria

1. Users authenticate via Microsoft Entra ID using OAuth 2.0/OpenID Connect
2. Role-based access control enforces permissions for all API endpoints
3. Multi-tenant data isolation ensures no cross-tenant data access
4. JWT tokens are validated and refresh tokens manage session lifecycle
5. Admin portal allows tenant and user management operations

### Suggested Sprint
Sprint 1 (Weeks 3-4)

---

## E03: Discovery & Inventory

### Purpose
Connect to Azure subscriptions, scan resource groups, discover all Azure resources, map dependencies between resources, and present a comprehensive inventory.

### Business Value
Provides the foundation for migration assessment by giving teams complete visibility into their Azure environment, resource inventory, and dependency relationships.

### Dependencies
- E01: Foundation & Infrastructure
- E02: Identity & Authentication (tenant scoping, RBAC)

### Priority
P1 - Core platform capability.

### Estimated Effort
50 Story Points

### Acceptance Criteria

1. Platform connects to Azure subscriptions via service principal with read-only access
2. All Azure resource types in scope are discovered and inventoried
3. Resource dependencies are mapped using ARM graph and connection analysis
4. Inventory data refreshes on configurable schedules (hourly/daily/manual)
5. Discovery results are searchable, filterable, and exportable

### Suggested Sprint
Sprint 2 (Weeks 5-6)

---

## E04: Validation Engine

### Purpose
Execute pre-migration validation checks against discovered resources, generate findings with severity levels, calculate health scores, and track remediation progress.

### Business Value
Delivers the core value proposition of MAP - automated, comprehensive validation that identifies migration risks before they become production issues.

### Dependencies
- E01: Foundation & Infrastructure
- E02: Identity & Authentication
- E03: Discovery & Inventory (requires discovered resources to validate)

### Priority
P1 - Core platform capability.

### Estimated Effort
60 Story Points

### Acceptance Criteria

1. Validation engine executes configurable check suites against resource inventory
2. Findings are categorized by severity (Critical, High, Medium, Low, Informational)
3. Health scores are calculated per resource group, subscription, and overall
4. Validation runs can be triggered manually or on schedule
5. Findings support status tracking (Open, In Progress, Resolved, Dismissed)

### Suggested Sprint
Sprint 3 (Weeks 7-8)

---

## E05: AI Insights

### Purpose
Integrate Azure OpenAI to provide intelligent migration insights, risk analysis, effort estimation, and natural language explanations for validation findings.

### Business Value
Differentiates MAP from manual validation tools by providing AI-powered analysis that accelerates decision-making and reduces the expertise required for migration planning.

### Dependencies
- E01: Foundation & Infrastructure
- E02: Identity & Authentication
- E03: Discovery & Inventory (requires resource context)
- E04: Validation Engine (requires findings to analyze)

### Priority
P2 - Value-add capability; MVP can function without AI.

### Estimated Effort
40 Story Points

### Acceptance Criteria

1. Azure OpenAI integration is functional with managed identity authentication
2. AI generates risk explanations for each validation finding
3. Migration effort estimation considers resource count, complexity, and dependencies
4. Prompt templates are versioned and configurable per resource type
5. AI responses are cached to reduce token consumption and cost

### Suggested Sprint
Sprint 4 (Weeks 9-10)

---

## E06: Reporting & Dashboards

### Purpose
Provide real-time dashboards showing migration readiness, generate exportable reports (PDF, Excel), and deliver executive summary views for stakeholder communication.

### Business Value
Enables data-driven decision-making and stakeholder communication by translating complex validation data into accessible, actionable insights.

### Dependencies
- E01: Foundation & Infrastructure
- E02: Identity & Authentication
- E04: Validation Engine (requires findings and scores for reporting)

### Priority
P2 - Important for user experience; can be deferred if needed.

### Estimated Effort
35 Story Points

### Acceptance Criteria

1. Real-time dashboard displays migration readiness metrics with live updates
2. Executive summary report generates PDF with key findings and recommendations
3. Detailed report includes all findings, resources, and dependency maps
4. Reports can be scheduled for automatic generation and email delivery
5. Dashboard supports drill-down from summary to detailed resource views

### Suggested Sprint
Sprint 4 (Weeks 9-10)

---

## E07: Governance & Compliance

### Purpose
Implement a policy engine that evaluates resources against organizational standards, regulatory compliance requirements, and custom governance rules.

### Business Value
Ensures migrations meet compliance requirements and organizational standards, reducing regulatory risk and audit burden for financial services customers.

### Dependencies
- E01: Foundation & Infrastructure
- E02: Identity & Authentication
- E03: Discovery & Inventory (requires resource data)
- E04: Validation Engine (shares check execution infrastructure)

### Priority
P2 - Critical for regulated industries; can be partially delivered in MVP.

### Estimated Effort
30 Story Points

### Acceptance Criteria

1. Policy engine evaluates resources against configurable compliance rules
2. Built-in policies cover Azure best practices and common regulatory requirements
3. Custom policies can be created using a declarative policy definition language
4. Compliance scores are calculated and tracked over time
5. Non-compliant resources are linked to remediation guidance

### Suggested Sprint
Sprint 5 (Weeks 11-12)

---

## E08: Operations & Monitoring

### Purpose
Implement comprehensive observability, alerting, health checks, and operational tooling to ensure platform reliability and performance.

### Business Value
Ensures the platform itself is production-ready, reliable, and observable - critical for customer trust and operational excellence.

### Dependencies
- E01: Foundation & Infrastructure

### Priority
P1 - Required for production readiness.

### Estimated Effort
25 Story Points

### Acceptance Criteria

1. Application Insights tracks all requests, dependencies, and exceptions
2. Health checks validate all platform components (database, cache, AI, storage)
3. Alert rules notify operations team of degraded performance or failures
4. Structured logging captures business events and technical diagnostics
5. Platform metrics dashboard shows throughput, latency, and error rates

### Suggested Sprint
Sprint 3 (Weeks 7-8) - foundational; extended in Sprint 5

---

## Epic Dependency Matrix

```
E01 Foundation ─────────┬──────────────────────┬─────────────┬───────────────────┐
                        │                      │             │                   │
                        ▼                      ▼             ▼                   ▼
                   E02 Identity          E08 Operations  E03 Discovery    E04 Validation
                        │                                         │             │
                        ▼                                         ▼             │
                   E05 AI Insights ◄──────────────────────────────┘             │
                   E06 Reporting ◄──────────────────────────────────────────────┤
                   E07 Governance ◄─────────────────────────────────────────────┘
```

## Sprint Allocation Summary

| Sprint | Epics in Scope | Story Points |
|--------|---------------|--------------|
| Sprint 0 | E01 (Foundation) | 21 SP |
| Sprint 1 | E02 (Identity) | 21 SP |
| Sprint 2 | E03 (Discovery) | 21 SP |
| Sprint 3 | E04 (Validation Core) + E08 (Ops foundation) | 24 SP |
| Sprint 4 | E05 (AI) + E06 (Reporting) | 21 SP |
| Sprint 5 | E07 (Governance) + E08 (Ops polish) + Hardening | 21 SP |
| **Total** | | **129 SP** (of 315 total capacity) |

> **Note:** The 129 SP sprint allocation represents the committed MVP scope. The remaining 186 SP across epics represent stretch goals and post-MVP enhancements.
