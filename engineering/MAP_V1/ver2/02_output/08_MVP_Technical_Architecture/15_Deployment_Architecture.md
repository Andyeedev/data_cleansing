# 15 — Deployment Architecture

**Document:** MAP MVP Deployment Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Deployment Strategy

| Component | Strategy |
|-----------|----------|
| Frontend | Static files on Azure CDN |
| Backend | Azure App Service (Docker containers) |
| Database | Azure SQL Managed Instance |
| AI | Azure OpenAI Service |
| CI/CD | Azure DevOps / GitHub Actions |

---

## 2. Environments

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| Development | Active development | Shared Azure resources |
| Staging | Pre-production testing | Production mirror |
| Production | Live customer environment | Full HA setup |

---

## 3. Blue-Green Deployment

```
Current (Blue)
┌─────────────────┐
│   App Service   │
│   (v1.2.3)      │
└─────────────────┘
        ↓
New (Green)
┌─────────────────┐
│   App Service   │
│   (v1.2.4)      │
└─────────────────┘
        ↓
   Traffic Switch
        ↓
   Monitor (30 min)
        ↓
   Complete / Rollback
```

---

## 4. Infrastructure as Code

| Tool | Purpose |
|------|---------|
| Bicep | Azure resource provisioning |
| Terraform | Multi-cloud (future) |
| ARM Templates | Legacy support |

---

## 5. Container Strategy

| Service | Container | Registry |
|---------|-----------|----------|
| API | Docker | Azure Container Registry |
| Worker | Docker | Azure Container Registry |
| Dashboard | Static | Azure CDN |

---

## 6. Release Process

| Step | Action |
|------|--------|
| 1 | Code merged to main |
| 2 | Build pipeline triggers |
| 3 | Tests executed |
| 4 | Container image built |
| 5 | Image pushed to ACR |
| 6 | Staging deployment |
| 7 | Integration tests |
| 8 | Production deployment (blue-green) |
| 9 | Smoke tests |
| 10 | Traffic switch |

---

## 7. Rollback

| Trigger | Action |
|---------|--------|
| Health check failure | Auto-rollback |
| Error rate > 5% | Auto-rollback |
| Manual trigger | Instant rollback |

---

## 8. Monitoring

| Tool | Purpose |
|------|---------|
| Application Insights | Application monitoring |
| Azure Monitor | Infrastructure monitoring |
| Health Dashboard | Real-time status |

---

*End of Deployment Architecture*
