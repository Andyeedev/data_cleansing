# Build Readiness Assessment

**Document:** MAP MVP Build Readiness
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

This document evaluates the team's readiness to begin implementation of the MAP MVP across 10 key dimensions. Each dimension is scored on a 1-5 scale and assessed for gaps that must be addressed before or during Sprint 0.

---

## Readiness Scorecard

| Dimension | Score (1-5) | Status | Gap |
|-----------|-------------|--------|-----|
| Architecture | 5 | Ready | None |
| Technology Stack | 5 | Ready | None |
| Team Skills | 4 | Almost Ready | .NET 8 training needed |
| Infrastructure | 3 | Partial | Azure subscription needed |
| CI/CD | 3 | Partial | Pipeline setup needed |
| Security | 4 | Almost Ready | Key Vault setup needed |
| Testing | 3 | Partial | Test framework setup needed |
| Documentation | 4 | Almost Ready | API docs generation needed |
| Branding | 5 | Ready | None |
| Business Model | 4 | Almost Ready | Pricing strategy needed |

**Overall Readiness: 4.0/5.0 — READY WITH CONDITIONS**

---

## Dimension Details

### 1. Architecture (5/5 — Ready)

The target architecture is fully defined and validated. Azure-native patterns are well-established with clear separation of concerns across frontend (React 18), backend (.NET 8), and data (Azure SQL MI) tiers. Microservices boundaries are defined, and integration patterns with Azure services (ARM API, OpenAI, Entra ID) are documented.

**No gaps identified.**

---

### 2. Technology Stack (5/5 — Ready)

All technology choices are finalized: React 18 + TypeScript for frontend, .NET 8 for backend, Azure SQL MI for database, Microsoft Entra ID for authentication, Azure OpenAI for AI features. Versions are pinned, and compatibility between components is verified.

**No gaps identified.**

---

### 3. Team Skills (4/5 — Almost Ready)

Team has strong React and general cloud development experience. .NET 8 and Azure-specific skills require targeted training.

**Gap:** .NET 8 training needed for backend developers.

**Mitigation:** Schedule structured training in Week 1 covering .NET 8 fundamentals, minimal APIs, and Azure SDK integration. Leverage Microsoft Learn modules and engage Microsoft FastTrack for architecture guidance.

---

### 4. Infrastructure (3/5 — Partial)

Azure subscription and core services (SQL MI, Container Apps, Key Vault, Entra ID) are not yet provisioned.

**Gap:** Azure subscription procurement required.

**Mitigation:** Submit Azure subscription request immediately. Engage Microsoft sales team for expedited approval. Provision dev environment in Sprint 0.

---

### 5. CI/CD (3/5 — Partial)

CI/CD pipeline is not yet configured. Build, test, and deployment automation needs to be established.

**Gap:** Pipeline setup needed.

**Mitigation:** Set up CI/CD pipeline in Sprint 0 using Azure DevOps or GitHub Actions. Implement automated build, test, and deployment workflows for all environments.

---

### 6. Security (4/5 — Almost Ready)

Security architecture is defined with RBAC, encryption, and access controls planned. Azure Key Vault is not yet configured for secret management.

**Gap:** Key Vault setup needed.

**Mitigation:** Configure Azure Key Vault in Sprint 1. Implement secret rotation policies and integrate with .NET 8 configuration system.

---

### 7. Testing (3/5 — Partial)

Testing strategy is defined (unit, integration, E2E, performance) but test frameworks and tooling are not yet initialized.

**Gap:** Test framework setup needed.

**Mitigation:** Initialize test frameworks in Sprint 0:
- Backend: xUnit + FluentAssertions + Moq
- Frontend: Jest + React Testing Library + Playwright
- E2E: Playwright
- Performance: k6 or Azure Load Testing

---

### 8. Documentation (4/5 — Almost Ready)

Product and technical documentation structure is planned. API documentation generation tooling (e.g., Swagger/OpenAPI) needs to be configured.

**Gap:** API docs generation needed.

**Mitigation:** Configure Swagger/OpenAPI in Sprint 0 for automatic API documentation. Generate client SDKs as part of CI/CD pipeline.

---

### 9. Branding (5/5 — Ready)

Brand identity, logo assets, and UI design system are finalized. Design tokens and component library are available for implementation.

**No gaps identified.**

---

### 10. Business Model (4/5 — Almost Ready)

Value proposition and target market are defined. Pricing strategy needs finalization.

**Gap:** Pricing strategy needed.

**Mitigation:** Finalize pricing model by Week 4. Consider tiered SaaS pricing based on number of Azure subscriptions monitored. Implement usage tracking from Sprint 4.

---

## Remaining Gaps

| # | Gap | Impact | Owner | Target Sprint | Status |
|---|-----|--------|-------|---------------|--------|
| 1 | Azure subscription procurement | Blocks all infrastructure | Tech Lead | Sprint 0 | Pending |
| 2 | Team .NET 8 training | Blocks backend development | Engineering Manager | Sprint 0 | Scheduled |
| 3 | CI/CD pipeline setup | Blocks automated deployment | DevOps Engineer | Sprint 0 | Pending |
| 4 | Key Vault configuration | Blocks secret management | DevOps Engineer | Sprint 1 | Pending |
| 5 | Test framework initialization | Blocks testing activities | QA Engineer | Sprint 0 | Pending |

---

## Recommendations

| # | Recommendation | Priority | Timeline | Owner |
|---|----------------|----------|----------|-------|
| 1 | Procure Azure subscription immediately | Critical | Week 1 | Tech Lead |
| 2 | Schedule .NET 8 training for Week 1 | High | Week 1 | Engineering Manager |
| 3 | Set up CI/CD pipeline in Sprint 0 | Critical | Sprint 0 | DevOps Engineer |
| 4 | Configure Key Vault in Sprint 1 | High | Sprint 1 | DevOps Engineer |
| 5 | Initialize test framework in Sprint 0 | High | Sprint 0 | QA Engineer |
| 6 | Engage Microsoft FastTrack for architecture review | Medium | Sprint 1 | Tech Lead |
| 7 | Finalize pricing strategy by Week 4 | Medium | Week 4 | Product Owner |
| 8 | Configure API documentation generation | Medium | Sprint 0 | Tech Lead |

---

## Go/No-Go Recommendation

### CONDITIONAL GO

The MAP MVP build is **ready to proceed** with the following conditions:

1. **Azure subscription** must be provisioned before Sprint 0 activities begin
2. **.NET 8 training** must be completed by end of Week 1
3. **CI/CD pipeline** must be operational by end of Sprint 0
4. **Test framework** must be initialized by end of Sprint 0

Full feature implementation can begin Sprint 1 once these conditions are met. Sprint 0 should be dedicated to closing the identified gaps and establishing a solid foundation for the 16-week implementation timeline.

---

## Readiness Gate Checklist

| Gate | Criteria | Status |
|------|----------|--------|
| Architecture | Architecture document approved | ✅ Pass |
| Technology | Stack decisions finalized | ✅ Pass |
| Team | Core team identified and onboarded | ✅ Pass |
| Infrastructure | Azure dev environment accessible | ⏳ Pending |
| CI/CD | Automated build pipeline operational | ⏳ Pending |
| Security | Key Vault and RBAC configured | ⏳ Pending |
| Testing | Test frameworks initialized | ⏳ Pending |
| Documentation | API docs tooling configured | ⏳ Pending |
| Branding | Design assets available | ✅ Pass |
| Business | Pricing model defined | ⏳ Pending |

**Gates Passed:** 4/10
**Gates Pending:** 6/10
**Sprint 0 Target:** Close all pending gates

---

*This assessment is maintained by the Project Manager and reviewed at project kickoff and Sprint 0 boundary.*
