# MAP Engineering Decision Matrix

**Document:** MAP Engineering Decision Matrix  
**Version:** 1.0  
**Date:** July 2026  
**Status:** Official  

---

## 1. Python vs .NET

| Criteria | Python | .NET | Notes |
|----------|--------|------|-------|
| Performance | Medium | High | .NET 8 benchmarks show 2-3x throughput over Python for CPU-bound tasks |
| Type Safety | Optional (typing available) | Strong (compile-time) | .NET catches errors earlier; Python relies on runtime checks |
| Ecosystem | Data/AI focused | Enterprise focused | Python leads in ML libraries; .NET excels in enterprise patterns |
| Learning Curve | Low | Medium | Python widely taught; .NET requires understanding of CLR concepts |
| Azure Integration | Good | Excellent | .NET has first-party Azure SDK support; Python well-supported via Azure SDK |
| Cloud Portability | Excellent | Good | Python runs everywhere; .NET Core improved portability but Windows-specific gaps remain |
| Enterprise Support | Community | Microsoft | Microsoft provides LTS, support contracts, and compliance certifications |
| When to Use | AI/ML, scripting, prototyping, data pipelines | Web APIs, enterprise systems, performance-critical services | |

**Recommendation for MAP:** Use .NET 8 for backend services (performance, type safety, Azure integration). Use Python for AI/ML workloads, data analysis scripts, and internal tooling where rapid development matters more than runtime performance.

---

## 2. PostgreSQL vs Azure SQL

| Criteria | PostgreSQL | Azure SQL | Notes |
|----------|------------|-----------|-------|
| Cost | Free (open source) | Medium-High (managed service pricing) | PostgreSQL: no license fees; Azure SQL: predictable operational costs |
| Management | Self-managed (or use managed services like Azure Database for PostgreSQL) | Fully managed PaaS | Azure SQL handles patching, backups, HA automatically |
| Cloud Portability | Excellent | Azure only | PostgreSQL runs on any cloud, on-premises, or hybrid |
| Features | Extensible (JSONB, PostGIS, full-text search) | Auto-tuning, built-in HA, threat detection | PostgreSQL more flexible; Azure SQL more automated |
| Enterprise Support | Community (or EDB, Crunchy Data) | Microsoft | Azure SQL includes SLA, support, compliance certifications |
| When to Use | Portable, cost-effective, complex queries, polyglot persistence | Azure-native, managed, Microsoft ecosystem, minimal DBA overhead | |

**Recommendation for MAP:** Use Azure SQL MI for primary application database (managed, integrated with Microsoft Entra ID, compliance). Use PostgreSQL for secondary data stores, analytics, or when cloud portability is required.

---

## 3. React vs Angular vs Vue

| Criteria | React | Angular | Vue | Notes |
|----------|-------|---------|-----|-------|
| Learning Curve | Medium | High | Low | React: component model familiar; Angular: steep learning curve (RxJS, decorators); Vue: gentle onboarding |
| Type Safety | TypeScript (optional) | TypeScript (required) | TypeScript (optional) | All support TypeScript; Angular enforces it |
| Ecosystem | Largest | Enterprise | Growing | React has most libraries, community packages; Angular more batteries-included; Vue ecosystem maturing |
| Performance | Good | Good | Good | All perform well; React Fiber, Angular Ivy, Vue 3 Composition API optimize rendering |
| Corporate Backing | Meta | Google | Community (Evan You, sponsors) | React and Angular have strong corporate backing; Vue community-driven |
| When to Use | Large ecosystem needed, flexible architecture | Enterprise, Angular teams, opinionated structure | Quick adoption, simpler apps,渐进式 adoption | |

**Recommendation for MAP:** Use React 18 with TypeScript for frontend (ecosystem breadth, team expertise, Azure SDK support). Consider Angular for large enterprise dashboards requiring strict structure. Use Vue for internal tools or smaller components where rapid development is preferred.

---

## 4. Containers vs Serverless vs Kubernetes

| Criteria | Containers | Serverless | Kubernetes | Notes |
|----------|------------|------------|------------|-------|
| Scale | Manual (or use auto-scaling) | Automatic (per request) | Automatic (HPA, cluster autoscaler) | Serverless scales to zero; Kubernetes scales based on metrics |
| Cost | Predictable (VM/container costs) | Pay-per-use (can spike) | Predictable (cluster costs) | Serverless costs unpredictable at scale; Kubernetes has fixed infrastructure costs |
| Complexity | Low-Medium | Low (operational) | High | Kubernetes requires significant operational knowledge |
| Cold Start | None (always running) | Yes (can be 100ms-seconds) | None | Cold start impacts latency-sensitive workloads |
| When to Use | Simple deployments, stateful apps | Event-driven, variable load, microservices | Complex microservices, multi-tenant, platform teams | |

**Recommendation for MAP:** Use Azure Container Apps (serverless containers) for most backend services (scales to zero, reduced operational overhead). Use Kubernetes (AKS) only for complex orchestration needs. Use containers for local development and testing.

---

## 5. Microservices vs Modular Monolith

| Criteria | Microservices | Modular Monolith | Notes |
|----------|---------------|------------------|-------|
| Complexity | High (distributed systems) | Low (single process) | Microservices require service discovery, distributed tracing, network resilience |
| Deployment | Independent per service | Single deployment | Microservices enable independent releases; monolith simpler CI/CD |
| Scalability | Per service (fine-grained) | Per module (coarser) | Microservices scale hot paths independently |
| Team Size | Large (10+ developers) | Small-Medium (3-10 developers) | Microservices require dedicated teams per service |
| When to Use | Large teams, complex domains, independent scaling needs | Small teams, simpler domains, faster time-to-market | |

**Recommendation for MAP:** Start with Modular Monolith for MVP (faster development, simpler operations). Identify service boundaries during development. Extract to microservices when:
- Team grows beyond 8-10 developers
- Specific modules need independent scaling
- Deployment coupling becomes a bottleneck
- Domain boundaries are well-understood

---

## 6. SQL vs NoSQL vs NewSQL

| Criteria | SQL (RDBMS) | NoSQL | NewSQL | Notes |
|----------|-------------|-------|--------|-------|
| Data Model | Relational (tables, rows) | Document, Key-Value, Graph, Column-family | Relational with distributed architecture | SQL for structured data; NoSQL for flexible schemas; NewSQL for both |
| ACID Compliance | Full | Eventual (typically) | Full | SQL and NewSQL guarantee consistency; NoSQL trades consistency for availability |
| Schema | Rigid (migrations required) | Flexible (schema-on-read) | Flexible or rigid | NoSQL enables rapid iteration; SQL enforces data integrity |
| Scaling | Vertical (primarily) | Horizontal (designed for) | Horizontal | NoSQL and NewSQL designed for distributed scaling |
| Query Language | SQL (standardized) | Varies (API-specific) | SQL (standardized) | SQL widely known; NoSQL requires learning new query patterns |
| When to Use | Structured data, complex joins, transactions | Unstructured data, rapid iteration, massive scale | Distributed SQL, global consistency, hybrid workloads | |

**Recommendation for MAP:** Use Azure SQL MI (SQL) for core transactional data. Use PostgreSQL for JSON-heavy workloads or analytics. Use Cosmos DB (NoSQL) only if specific document/graph requirements arise.

---

## 7. REST vs GraphQL vs gRPC

| Criteria | REST | GraphQL | gRPC | Notes |
|----------|------|---------|------|-------|
| Protocol | HTTP/1.1 | HTTP/1.1 | HTTP/2 | gRPC uses binary protocol; REST and GraphQL use text |
| Schema | OpenAPI (optional) | Schema (required) | Protobuf (required) | GraphQL and gRPC enforce contracts; REST is flexible |
| Performance | Good | Good (over-fetching eliminated) | Excellent (binary, streaming) | gRPC best for service-to-service; GraphQL best for client-driven |
| Caching | HTTP caching built-in | Requires custom caching | No built-in caching | REST benefits from HTTP caching; GraphQL requires application-level caching |
| Tooling | Mature | Growing | Growing | REST has most tooling; GraphQL tooling improving; gRPC strong in polyglot environments |
| When to Use | Public APIs, simple CRUD, broad compatibility | Complex data requirements, multiple clients, rapid iteration | Service-to-service, performance-critical, streaming | |

**Recommendation for MAP:** Use REST for public APIs and simple internal services. Use gRPC for service-to-service communication (performance, type safety). Evaluate GraphQL for complex frontend data requirements if over-fetching becomes a problem.

---

## 8. Monorepo vs Polyrepo

| Criteria | Monorepo | Polyrepo | Notes |
|----------|----------|----------|-------|
| Code Sharing | Easy (same repo) | Requires package management | Monorepo simplifies cross-cutting changes |
| CI/CD | Complex (build affected areas) | Simple (per repo) | Monorepo requires incremental builds; polyrepo simpler pipelines |
| Ownership | Shared | Clear boundaries | Polyrepo enforces service boundaries; monorepo requires discipline |
| Tooling | Specialized (Nx, Turborepo, Rush) | Standard Git | Monorepo needs build tools to maintain performance |
| When to Use | Tightly coupled services, shared libraries, small-medium teams | Independent services, large teams, clear domain boundaries | |

**Recommendation for MAP:** Use Monorepo for MAP MVP (single team, shared libraries, tight coupling expected). Transition to Polyrepo if team splits into autonomous service teams.

---

## 9. CSS-in-JS vs CSS Modules vs Tailwind

| Criteria | CSS-in-JS | CSS Modules | Tailwind CSS | Notes |
|----------|-----------|-------------|--------------|-------|
| Performance | Runtime overhead (mitigated with extraction) | Zero runtime | Zero runtime | CSS-in-JS adds bundle size; others are pure CSS |
| Developer Experience | Excellent (colocation, dynamic styles) | Good (scoped classes) | Excellent (utility-first, IDE support) | All have strong DX; preference depends on team style |
| Learning Curve | Medium | Low | Medium | Tailwind requires learning utility classes; CSS-in-JS requires learning library API |
| Theming | Excellent (JS variables) | Manual (CSS variables) | Excellent (config-based) | All support theming; Tailwind and CSS-in-JS most flexible |
| When to Use | Dynamic styling, component libraries | Standard projects, zero-runtime requirement | Rapid prototyping, design systems, utility-first preference | |

**Recommendation for MAP:** Use Tailwind CSS for rapid development and consistent design system. Use CSS Modules for component libraries requiring encapsulation. Avoid CSS-in-JS for performance-critical applications.

---

## 10. Authentication & Authorization

| Criteria | Microsoft Entra ID | Auth0 | Keycloak | Notes |
|----------|-------------------|-------|----------|-------|
| Integration | Native Azure/Office 365 | Universal (OIDC/SAML) | Self-hosted (OIDC/SAML) | Entra ID best for Microsoft ecosystem; Auth0/Keycloak for multi-cloud |
| Cost | Free tier generous; per-user pricing | Per-MAU pricing | Free (open source) | Entra ID included with Microsoft 365; Auth0 scales with MAU; Keycloak has infrastructure costs |
| Features | SSO, MFA, Conditional Access, PIM | SSO, MFA, RBAC, Actions | SSO, MFA, RBAC, Federation | All provide core features; Entra ID strongest for Azure-native |
| Compliance | SOC, ISO, HIPAA, FedRAMP | SOC, ISO, HIPAA | Depends on deployment | Entra ID has most certifications; Keycloak compliance depends on hosting |
| When to Use | Azure-native, Microsoft ecosystem, enterprise | Multi-cloud, rapid integration, SaaS | Self-hosted, data sovereignty, full control | |

**Recommendation for MAP:** Use Microsoft Entra ID for authentication (native Azure integration, Founders Hub benefits). Implement RBAC in application layer. Consider Keycloak if multi-cloud identity federation becomes required.

---

## 11. Monitoring & Observability

| Criteria | Prometheus + Grafana | Datadog | Azure Monitor | Notes |
|----------|---------------------|---------|---------------|-------|
| Cost | Free (open source) | Per-host + per-feature pricing | Pay-per-use | Prometheus most cost-effective; Datadog easiest to start; Azure Monitor included with Azure |
| Self-Hosted | Yes | No (SaaS only) | No (PaaS) | Prometheus requires operational overhead; others managed |
| Features | Metrics, alerting, dashboards | Full observability (metrics, logs, traces, APM) | Azure-native, Log Analytics, Application Insights | Datadog most comprehensive; Azure Monitor best for Azure workloads |
| Learning Curve | Medium | Low | Low-Medium | Datadog easiest; Prometheus + Grafana more flexible |
| When to Use | Cost-sensitive, Kubernetes, multi-cloud | Full observability, SaaS preference, enterprise support | Azure-native, minimal additional tooling | |

**Recommendation for MAP:** Use Azure Monitor + Application Insights for production monitoring (native integration, reduced operational overhead). Use Prometheus + Grafana for Kubernetes-specific metrics. Evaluate Datadog if advanced APM features become necessary.

---

## 12. CI/CD Platform

| Criteria | GitHub Actions | Azure DevOps | GitLab CI | Notes |
|----------|---------------|--------------|-----------|-------|
| Cost | Free for public; paid for private | Free tier generous; per-user pricing | Free tier; paid for private | GitHub Actions most accessible; Azure DevOps best for enterprise |
| Integration | GitHub (natural fit) | Azure ecosystem, Microsoft tools | GitLab (natural fit) | Platform choice often follows repo hosting |
| Features | Workflows, marketplace, reusable actions | Pipelines, boards, repos, artifacts | Full DevOps lifecycle | All provide comprehensive CI/CD; Azure DevOps most integrated |
| Self-Hosted | Yes (runners) | Yes (agents) | Yes (runners) | All support self-hosted for compliance/air-gapped |
| When to Use | GitHub-hosted repos, open source, simple workflows | Enterprise, Azure-native, Microsoft ecosystem | GitLab-hosted, self-managed DevOps | |

**Recommendation for MAP:** Use GitHub Actions for CI/CD (tight integration with GitHub repos, marketplace actions, free for open source). Use Azure DevOps if deeper Azure integration or enterprise compliance features are required.

---

## Decision Framework

When evaluating technology choices:

1. **Start with requirements** — What does the problem actually require?
2. **Evaluate objectively** — Consider all options, not just familiar ones
3. **Consider cloud portability** — Avoid lock-in unless benefits outweigh costs
4. **Assess team capabilities** — Choose technologies the team can operate effectively
5. **Factor in total cost** — License, operational, training, and migration costs
6. **Plan for evolution** — Technology choices should be revisited as requirements change
7. **Document decisions** — Record the "why" behind choices for future reference

---

*This document is owned by the Engineering team and reviewed quarterly.*