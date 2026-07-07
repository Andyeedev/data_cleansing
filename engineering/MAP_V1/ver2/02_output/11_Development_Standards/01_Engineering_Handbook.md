# MAP MVP Engineering Handbook

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Document | MAP MVP Engineering Handbook             |
| Version  | 1.0                                      |
| Date     | July 2026                                |
| Status   | Official                                 |
| Owner    | MAP Platform Engineering                 |
| Scope    | All engineering activities on the MAP platform |

---

## 1. Development Philosophy

The MAP platform is built on five foundational beliefs that guide every engineering decision.

### Build for Scale

Design systems that handle 10x current load without re-architecture. Favor horizontal scaling, stateless services, and partitioned data. Every component must justify why it cannot scale horizontally.

### Embrace Automation

If a human does something twice, it should be automated. CI/CD pipelines, testing, deployments, infrastructure provisioning, monitoring alerts — all automated. Manual processes are defects waiting to happen.

### Prefer Simplicity

Choose the simplest solution that meets requirements today. Complex solutions create maintenance burdens and cognitive overhead. Simplicity is not the absence of sophistication — it is the presence of clarity.

### Document Decisions

Every significant technical decision gets an Architecture Decision Record (ADR). Document the context, options considered, rationale, and consequences. Future engineers need to understand *why*, not just *what*.

### Test Everything

Code without tests is legacy code. Unit tests for logic, integration tests for boundaries, end-to-end tests for critical paths, load tests for performance. Test-driven development is preferred; test-after is acceptable; no tests is unacceptable.

---

## 2. Engineering Principles

### SOLID

| Principle                   | Meaning                                                                 | MAP Application                                          |
| --------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| **S**ingle Responsibility   | One reason to change                                                    | One service per bounded context, one class per concern   |
| **O**pen/Closed             | Open for extension, closed for modification                             | Plugin architecture for validation rules, strategy pattern for exporters |
| **L**iskov Substitution     | Subtypes must be substitutable                                          | Interface-driven design for all service dependencies     |
| **I**nterface Segregation   | Clients depend only on interfaces they use                              | Small, focused interfaces; avoid fat service contracts   |
| **D**ependency Inversion     | Depend on abstractions, not concretions                                 | DI containers, constructor injection throughout          |

### DRY (Don't Repeat Yourself)

Every piece of knowledge has a single representation. Shared logic goes into libraries, utilities, or base classes. Duplication is the root of all evil in software maintenance.

### KISS (Keep It Simple, Stupid)

Complexity is the enemy of reliability. If you cannot explain a solution to a junior engineer in under two minutes, it is too complex. Refactor until it is clear.

### YAGNI (You Ain't Gonna Need It)

Do not build features speculatively. Build what is needed now, with clean interfaces that allow future extension. Premature generalization is a form of waste.

### Separation of Concerns

Each module, layer, and component has a distinct responsibility. Presentation logic does not live with business logic. Infrastructure concerns do not leak into domain code. Data access is abstracted behind repositories.

### Convention over Configuration

Use sensible defaults. When a developer must make an explicit choice, provide a clear default. When conventions reduce boilerplate, adopt them. When conventions obscure behavior, reject them.

---

## 3. Software Craftsmanship

### Clean Code

Code is read far more often than it is written. Write code for human comprehension. Meaningful names, small functions, clear structure, minimal indirection. Code should tell a story.

### Boy Scout Rule

Always leave the code cleaner than you found it. Every commit should contain at least one improvement — rename a variable, extract a method, simplify a condition, add a test. Small incremental improvements compound over time.

### Broken Window Theory

Fix broken windows immediately. A neglected codebase degrades faster than a clean one. When you encounter a bug, tech debt, or poor pattern, fix it or create a tracked work item. Do not let rot accumulate.

### Technical Excellence

Excellence is not an act but a habit. Continuous learning, deliberate practice, code reviews, pairing, and knowledge sharing are not optional — they are the foundation of sustainable engineering.

---

## 4. Architecture Philosophy

### Cloud-Native

Build for the cloud from day one. Leverage managed services (Azure SQL MI, Azure Container Apps, Microsoft Entra ID). Design for failure. Use the cloud's strengths — elasticity, managed infrastructure, built-in resilience.

### API-First

Every capability is exposed through a well-defined API. APIs are contracts between teams. Design APIs before implementation. Version APIs from the start. Document APIs with OpenAPI specifications.

### Event-Driven

Use events for loose coupling between services. Events enable asynchronous processing, audit trails, and decoupled workflows. Prefer event-driven patterns over synchronous orchestration where latency tolerance allows.

### Microservices Where Needed

Do not start with microservices. Start with a well-structured monolith and extract services at clear boundary points. Each microservice owns its data, has a single responsibility, and can be deployed independently.

### Monolith Where Sufficient

A monolith is not a failure. A well-structured modular monolith can be faster to develop, easier to debug, and simpler to operate. Choose architecture based on team structure, domain complexity, and scaling requirements — not trends.

---

## 5. Development Lifecycle

```
Plan → Design → Build → Review → Test → Deploy → Monitor → Iterate
```

### Plan

Define requirements, acceptance criteria, and success metrics. Break work into small, deliverable increments. Identify dependencies and risks early.

### Design

Create technical designs before implementation. Document API contracts, data models, and integration points. Get design review approval before building.

### Build

Implement in small, testable increments. Write tests alongside production code. Keep changes focused and scoped. Commit frequently with clear messages.

### Review

All code requires peer review before merge. Reviews focus on correctness, maintainability, security, and adherence to standards. Reviews are learning opportunities, not gatekeeping.

### Test

Automated tests run on every commit. Manual testing for exploratory and usability validation. Performance testing for critical paths. Security testing as part of CI/CD.

### Deploy

Deploy through automated pipelines. Use feature flags for controlled rollouts. Support blue-green and canary deployments. Rollback plans are mandatory for production changes.

### Monitor

Monitor application health, performance, and user behavior. Alert on anomalies. Track error rates, latency, and throughput. Use monitoring data to inform iteration.

### Iterate

Learn from production data, user feedback, and operational metrics. Prioritize improvements based on impact and effort. Continuous improvement is a core engineering discipline.

---

## 6. Decision-Making Principles

### Data-Driven

Make decisions based on evidence, not opinions. Measure before optimizing. A/B test when uncertain. Use metrics to validate assumptions and measure outcomes.

### Reversible Decisions Preferred

Choose approaches that can be changed later. Use abstractions, feature flags, and configuration to keep options open. Irreversible decisions require more deliberation and documentation.

### Document ADRs

Record every significant architectural decision using the ADR format:

```markdown
# ADR-{NUMBER}: {TITLE}

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
What is the issue that motivates this decision?

## Decision
What is the change that is being proposed or has been agreed upon?

## Consequences
What becomes easier or harder to do because of this change?

## Alternatives Considered
What other options were evaluated and why were they rejected?
```

### Bias for Action

Analysis paralysis is a real risk. When uncertainty exists, make the best decision with available information, execute, and iterate. A good plan executed today is better than a perfect plan executed next week.

---

## Appendix A: Technology Stack Reference

| Layer           | Technology                     |
| --------------- | ------------------------------ |
| Frontend        | React 18, TypeScript, Vite     |
| Backend         | .NET 8, C#                     |
| Database        | Azure SQL Managed Instance     |
| Authentication  | Microsoft Entra ID (Azure AD)  |
| AI Services     | Azure OpenAI                   |
| Hosting         | Azure Container Apps           |
| Infrastructure  | Bicep, Azure Bicep             |
| CI/CD           | GitHub Actions                 |
| Monitoring      | Azure Application Insights     |
| Logging         | Serilog, Azure Log Analytics   |

## Appendix B: Key Resources

- [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/)
- [.NET Application Architecture](https://learn.microsoft.com/dotnet/architecture/)
- [React Documentation](https://react.dev/)
- [Azure Well-Architected Review](https://learn.microsoft.com/azure/architecture/well-architected/)
