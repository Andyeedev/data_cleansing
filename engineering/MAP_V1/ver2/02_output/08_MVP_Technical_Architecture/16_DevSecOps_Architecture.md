# 16 — DevSecOps Architecture

**Document:** MAP MVP DevSecOps Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Pipeline Strategy

| Stage | Tools | Purpose |
|-------|-------|---------|
| Code | GitHub / Azure Repos | Source control |
| Build | GitHub Actions / Azure Pipelines | CI build |
| Test | xUnit / Playwright | Automated testing |
| Security | SonarQube / Snyk | SAST/DAST |
| Deploy | Azure DevOps / ArgoCD | CD deployment |
| Monitor | Application Insights | Runtime monitoring |

---

## 2. CI/CD Pipeline

```
Code Commit
    ↓
Build (.NET 8)
    ↓
Unit Tests
    ↓
Security Scan (SAST)
    ↓
Docker Build
    ↓
Image Scan (Trivy)
    ↓
Push to ACR
    ↓
Deploy to Staging
    ↓
Integration Tests
    ↓
Deploy to Production (Blue-Green)
    ↓
Smoke Tests
```

---

## 3. Security Integration

| Practice | Tool | Frequency |
|----------|------|-----------|
| SAST | SonarQube | Every build |
| DAST | OWASP ZAP | Weekly |
| Dependency scan | Snyk | Every build |
| Container scan | Trivy | Every build |
| Secret scan | GitLeaks | Every commit |
| IaC scan | Checkov | Every build |

---

## 4. Quality Gates

| Gate | Criteria |
|------|----------|
| Code coverage | > 80% |
| Bugs | 0 |
| Vulnerabilities | 0 |
| Code smells | < 10 |
| Security hotspots | Reviewed |

---

## 5. Secrets Management

| Secret Type | Storage | Rotation |
|-------------|---------|----------|
| API keys | Azure Key Vault | 90 days |
| Connection strings | Azure Key Vault | 90 days |
| Certificates | Azure Key Vault | 365 days |

---

## 6. Monitoring

| Tool | Purpose |
|------|---------|
| Application Insights | APM, logs, traces |
| Azure Monitor | Infrastructure metrics |
| PagerDuty | Alert escalation |
| Grafana | Dashboard visualization |

---

*End of DevSecOps Architecture*
