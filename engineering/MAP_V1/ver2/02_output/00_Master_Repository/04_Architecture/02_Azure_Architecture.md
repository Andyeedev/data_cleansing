# 08 — Azure Architecture

**Document:** MAP MVP Azure Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Azure Services Selection

### Compute

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure Container Apps | Consumption | Serverless containers, auto-scaling, cost-effective for MVP, Kubernetes-based |
| Azure Functions | Consumption | Event-driven processing, future use for async workflows |

**Why Container Apps over App Service:**
- Container-native deployment
- Built on Kubernetes (portability)
- Consumption-based pricing (cost optimization)
- Better microservices support

**Why Container Apps over AKS:**
- Lower operational overhead for MVP
- No cluster management required
- Cost-effective at MVP scale
- Easy migration path to AKS later

---

### API Management

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure API Management | Developer (MVP) | Centralized API gateway, authentication, rate limiting, future scaling to Production tier |

**Why API Management:**
- Enterprise-grade API gateway
- Entra ID integration
- Rate limiting and throttling
- Developer portal for API documentation
- Scalable to production tier

---

### Database

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure SQL Database | Basic (MVP) | Managed SQL, minimal operational overhead, enterprise-grade, scalable |
| Azure Cache for Redis | Basic C1 | Session caching, performance optimization, real-time data |

**Why Azure SQL over PostgreSQL:**
- Native Azure integration
- Managed service (no patching)
- Entra ID authentication
- Built-in security features
- Scalable to Enterprise tier

**Note:** Existing PostgreSQL can be retained for specific use cases with Azure Database for PostgreSQL.

---

### Storage

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure Blob Storage | Standard LRS | Report storage, audit logs, file attachments |
| Azure Files | Standard | Shared configuration files |

---

### Security

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure Key Vault | Standard | Centralized secrets management, certificate storage |
| Microsoft Entra ID | P2 (via existing tenant) | Enterprise identity, SSO, RBAC |
| Azure DDoS Protection | Basic | Network-level protection |

---

### Monitoring

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure Monitor | Pay-as-you-go | Centralized monitoring, alerting |
| Application Insights | Pay-as-you-go | Application performance monitoring, distributed tracing |
| Log Analytics | Pay-as-you-go | Log aggregation, KQL queries, operational analytics |

---

### AI

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure OpenAI | Pay-as-you-go | Enterprise AI, data privacy, compliance, Azure integration |

---

### Integration

| Service | SKU | Rationale |
|---------|-----|-----------|
| Azure Event Grid | Pay-as-you-go | Event-driven architecture, async processing |
| Azure Service Bus | Basic (Future) | Enterprise messaging, future use |

---

### DevOps

| Service | SKU | Rationale |
|---------|-----|-----------|
| GitHub Actions | Free tier | CI/CD pipeline, Git-native workflow |
| Azure Bicep | Free | Infrastructure as Code, Azure-native |

---

## 2. Azure Resource Organization

```
Subscription: map-prod-subscription
├── Resource Group: map-prod-rg
│   ├── Container Apps Environment
│   ├── API Management
│   ├── SQL Database
│   ├── Redis Cache
│   ├── Blob Storage
│   ├── Key Vault
│   └── Log Analytics
├── Resource Group: map-prod-networking
│   ├── Virtual Network
│   └── Private Endpoints
└── Resource Group: map-prod-monitoring
    ├── Application Insights
    └── Alert Rules
```

---

## 3. Azure Well-Architected Framework Alignment

| Pillar | Implementation |
|--------|----------------|
| Reliability | Geo-redundant SQL, Container Apps HA, Health probes |
| Security | Zero Trust, Entra ID, Key Vault, DDoS protection |
| Cost Optimization | Consumption-based pricing, auto-scaling, right-sizing |
| Operational Excellence | Infrastructure as Code, CI/CD, monitoring |
| Performance Efficiency | Redis caching, API Management, auto-scaling |

---

*End of Azure Architecture*
