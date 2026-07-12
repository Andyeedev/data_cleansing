# 22 — Cloud Portability Assessment

**Document:** MAP MVP Cloud Portability Assessment
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Portability Classification

| Category | Technologies | Cloud Neutral? |
|----------|--------------|----------------|
| Azure Native | Azure SQL MI, Azure OpenAI, Azure Container Apps, Bicep | ❌ Vendor-specific |
| Open Standard | React, .NET 8, Docker, PostgreSQL | ✅ Cloud neutral |
| Hybrid | Entra ID, Application Insights, Azure DevOps | ⚠️ Partially portable |
| Open Source | Prometheus, Grafana, Keycloak | ✅ Cloud neutral |

---

## 2. Azure Dependencies

| Dependency | Portability Impact | Migration Effort |
|------------|-------------------|------------------|
| Azure SQL MI | High — managed service | Medium (to PostgreSQL) |
| Azure OpenAI | High — no equivalent | High (to OpenAI API) |
| Azure Container Apps | Medium — to Kubernetes | Low |
| Azure Policy | Low — governance only | N/A |
| Entra ID | Medium — to Auth0/Okta | Medium |

---

## 3. Cloud-Neutral Technologies

| Technology | Portability | Notes |
|------------|-------------|-------|
| .NET 8 | ✅ Full | Runs on any cloud |
| React | ✅ Full | Static files, any CDN |
| Docker | ✅ Full | Container standard |
| PostgreSQL | ✅ Full | Open-source database |
| Prometheus | ✅ Full | Open-source monitoring |
| Grafana | ✅ Full | Open-source dashboards |

---

## 4. Vendor Lock-in Assessment

| Risk Level | Technology | Mitigation |
|------------|------------|------------|
| High | Azure SQL MI | Abstract via Entity Framework |
| High | Azure OpenAI | Abstract via service interface |
| Medium | Azure Container Apps | Can migrate to Kubernetes |
| Medium | Entra ID | Standard OIDC/OAuth |
| Low | Application Insights | Can switch to Prometheus |
| Low | Bicep | Can switch to Terraform |

---

## 5. Multi-Cloud Strategy

| Phase | Cloud Strategy |
|-------|----------------|
| MVP | Azure only |
| Phase 2 | Azure primary, AWS secondary |
| Phase 3 | Azure, AWS, GCP |

---

## 6. Portability Recommendations

| # | Recommendation |
|---|----------------|
| 1 | Use Entity Framework for database abstraction |
| 2 | Abstract AI service behind interface |
| 3 | Use standard OIDC for authentication |
| 4 | Keep business logic cloud-agnostic |
| 5 | Use Terraform for multi-cloud IaC (Phase 2) |

---

*End of Cloud Portability Assessment*
