# 19 — Architecture Decision Records

**Document:** MAP MVP Architecture Decision Records
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## ADR-001: Backend Framework

- **Status:** Accepted
- **Context:** Need modern, high-performance backend framework
- **Decision:** .NET 8 (ASP.NET Core 8)
- **Consequences:** Excellent performance, Microsoft ecosystem alignment, strong typing, good tooling
- **Alternatives considered:** Node.js, Go, Python
- **Future Review:** Q2 2027

---

## ADR-002: Frontend Framework

- **Status:** Accepted
- **Context:** Need responsive, maintainable UI
- **Decision:** React 18 with TypeScript
- **Consequences:** Large ecosystem, component reusability, strong typing
- **Alternatives considered:** Angular, Vue.js, Blazor
- **Future Review:** Q2 2027

---

## ADR-003: Database

- **Status:** Accepted
- **Context:** Need enterprise-grade relational database
- **Decision:** Azure SQL Managed Instance
- **Consequences:** Managed service, auto-tuning, built-in HA, good tooling
- **Alternatives considered:** PostgreSQL, Cosmos DB
- **Future Review:** Q2 2027

---

## ADR-004: Authentication

- **Status:** Accepted
- **Context:** Need enterprise SSO
- **Decision:** Microsoft Entra ID (Azure AD)
- **Consequences:** Seamless Microsoft 365 integration, B2B support, conditional access
- **Alternatives considered:** Auth0, Okta
- **Future Review:** Q2 2027

---

## ADR-005: Cloud Platform

- **Status:** Accepted
- **Context:** Need scalable, enterprise cloud
- **Decision:** Microsoft Azure (UK South primary)
- **Consequences:** Microsoft ecosystem alignment, enterprise support, data residency options
- **Alternatives considered:** AWS, GCP
- **Future Review:** Q2 2027

---

## ADR-006: Infrastructure as Code

- **Status:** Accepted
- **Context:** Need repeatable infrastructure
- **Decision:** Bicep + ARM Templates
- **Consequences:** Native Azure support, good tooling, version control
- **Alternatives considered:** Terraform, Pulumi
- **Future Review:** Q2 2027

---

## ADR-007: AI Integration

- **Status:** Accepted
- **Context:** Need enterprise AI with data privacy
- **Decision:** Azure OpenAI Service
- **Consequences:** Data stays within Azure, enterprise support, compliance
- **Alternatives considered:** OpenAI API, open-source models
- **Future Review:** Q2 2027

---

## ADR-008: CI/CD

- **Status:** Accepted
- **Context:** Need automated pipeline
- **Decision:** GitHub Actions + Azure DevOps
- **Consequences:** Good integration, community support, free for public repos
- **Alternatives considered:** Jenkins, CircleCI
- **Future Review:** Q2 2027

---

*End of Architecture Decision Records*
