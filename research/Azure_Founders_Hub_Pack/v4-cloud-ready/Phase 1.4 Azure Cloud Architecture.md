# Phase 1.4 — Azure Cloud Architecture

**Version:** 2.0  
**Product:** FS Migration Validation Engine  
**Status:** Founders Hub Ready  
**Audience:** Microsoft Reviewers, Cloud Architects, Engineering Team

---

# Executive Summary

The FS Migration Validation Engine is designed as an **Azure-native, cloud-first SaaS solution** built on Microsoft's Well-Architected Framework. It leverages managed Azure services to maximise scalability, security, reliability, and operational efficiency for regulated Financial Services data migration validation.

The architecture follows a **Platform Core + microservices** model where independent domain engines (Discovery, Validation, Scoring, Governance) are orchestrated through a central coordination layer. The solution is cloud-portable while taking full advantage of Azure's managed services ecosystem.

---

# High-Level Architecture

```text
                    Users / CLI / DevOps
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Web Portal                REST API
          (Future)                  (FastAPI)
             │                           │
             └─────────────┬─────────────┘
                           │
                  Azure Front Door (Optional)
                           │
                   Azure API Management
                           │
                Microsoft Entra ID (Future)
                           │
                     Platform Core
                           │
      ┌──────────┬──────────┼──────────┬──────────┐
      │          │          │          │          │
  Discovery  Validation  Scoring   Governance  Reports
   Engine     Engine     Engine     Engine     Engine
      │          │          │          │          │
      └──────────┴──────────┼──────────┴──────────┘
                           │
               Azure SQL / PostgreSQL
                           │
                   Azure Blob Storage
```

---

# Core Azure Services

## Azure Container Apps (Recommended MVP)

The primary compute platform for the validation engine.

**Advantages:**
- Serverless container hosting
- Automatic scaling based on validation workload
- Minimal operational overhead
- Cost-efficient consumption pricing
- Native Dapr support for future microservices
- Fast deployment from Docker images

**Migration path:** Azure Kubernetes Service (AKS) for enterprise-scale deployments.

## Azure API Management

Secure gateway for all API interactions.

**Responsibilities:**
- API gateway for REST endpoints
- Rate limiting and throttling
- API versioning
- Authentication enforcement (future: OAuth2 / Entra ID)
- Request validation
- Usage analytics
- Developer portal for integration documentation

## Microsoft Entra ID (Future Integration)

Identity and access management for enterprise deployments.

**Capabilities:**
- Single Sign-On (SSO)
- OAuth2 / OpenID Connect
- Role-Based Access Control (RBAC)
- Multi-Factor Authentication (MFA)
- Conditional Access policies
- Enterprise identity federation

## Azure SQL Database / PostgreSQL Flexible Server

Primary data store for the validation engine.

**Stores:**
- Migration batch records
- Control execution results
- Exception register
- Audit trail
- Configuration metadata
- Customer and project data (future)

**Benefits:**
- Managed service with automated backups
- High availability with zone redundancy
- Built-in threat detection (Defender for Cloud)
- Encryption at rest and in transit

## Azure Blob Storage

Secure storage for audit artifacts and exports.

**Stores:**
- Audit CSV exports
- Validation reports
- Uploaded schema definitions
- Log archives
- Backup snapshots

**Benefits:**
- Cost-effective tiered storage
- Lifecycle management policies
- Immutable storage for compliance
- Geo-redundant replication

## Azure Key Vault

Centralised secrets management.

**Stores:**
- Database connection strings
- API keys
- Certificates
- Encryption keys
- Environment credentials

**Security:**
- No secrets in source code or configuration files
- Managed identities for service-to-service authentication
- Access policies with least privilege
- Audit logging for all secret access

## Azure Monitor & Application Insights

Comprehensive observability.

**Captures:**
- Infrastructure metrics (CPU, memory, network)
- API response times and error rates
- Control execution duration
- Batch processing performance
- Exception tracking
- Distributed tracing across microservices
- Custom dashboards and alerts

## GitHub Actions / Azure DevOps

CI/CD pipeline automation.

**Pipeline stages:**
```
Commit → Build → Unit Tests → Security Scan → Container Build → Deploy to Test → Integration Tests → Deploy to Production
```

**Infrastructure as Code:**
- Bicep / ARM Templates for Azure resource provisioning
- Version-controlled infrastructure definitions
- Reproducible deployments across environments

---

# Networking Architecture

```text
Internet
    │
    ▼
Azure Front Door (Optional)
    │
    ▼
Azure API Management
    │
    ▼
Virtual Network
    │
    ├── Azure Container Apps (Private Endpoints)
    ├── Azure SQL Database (Private Endpoint)
    ├── Azure Key Vault (Private Endpoint)
    └── Azure Blob Storage (Private Endpoint)
```

**Security features:**
- Private networking for all data services
- Network Security Groups (NSGs)
- DDoS protection
- TLS 1.2+ for all communications
- Managed certificates via Azure Key Vault
- Service endpoints / Private Link for PaaS services

---

# Security Architecture

The platform follows a **Zero Trust** security model:

| Security Layer | Implementation |
|----------------|----------------|
| Identity | Microsoft Entra ID + RBAC (future) |
| Authentication | API keys → OAuth2 / Entra ID (migration path) |
| Secrets | Azure Key Vault, no secrets in code |
| Network | Private endpoints, TLS, NSGs |
| Data at rest | Azure SQL TDE, Blob encryption |
| Data in transit | TLS 1.2+ for all connections |
| Monitoring | Defender for Cloud, Sentinel (enterprise) |
| Auditing | Full audit trail for every execution |

---

# Deployment Environments

| Environment | Compute | Database | Purpose |
|-------------|---------|----------|---------|
| **Development** | Local Docker | Local PostgreSQL | Local development and testing |
| **Test/QA** | Azure Container Apps | Azure SQL (shared) | Automated testing, CI/CD |
| **Staging** | Azure Container Apps | Azure SQL (isolated) | Pre-production validation |
| **Production** | Azure Container Apps (MVP) → AKS (scale) | Azure SQL (HA) | Customer deployments |

---

# Scalability Strategy

Each engine scales independently based on workload:

| Engine | Scale Trigger |
|--------|--------------|
| API Layer | Concurrent API requests |
| Validation Engine | Number of controls × batch size |
| Scoring Engine | Post-validation scoring requests |
| Audit Export | Export request volume |

Autoscaling is managed by Azure Container Apps using:
- CPU utilisation thresholds
- Memory utilisation thresholds
- HTTP request queue depth
- Custom scaling rules (future)

---

# High Availability

Azure services provide enterprise-grade availability:

- Zone-redundant deployment (Azure Container Apps)
- Active geo-replication (Azure SQL Database)
- Automatic failover with managed services
- Automated backups with point-in-time restore
- Health probes for container instances
- Rolling updates for zero-downtime deployments

---

# Azure Well-Architected Framework Alignment

## Reliability
- Managed Azure services with built-in redundancy
- Automated health monitoring and recovery
- Fault-tolerant architecture (failure isolation per control)
- Automated backups and point-in-time restore

## Security
- Zero Trust architecture
- Microsoft Entra ID + Azure Key Vault
- Private endpoints for data services
- Defender for Cloud continuous assessment
- Full audit trail for compliance

## Cost Optimisation
- Consumption-based pricing (Azure Container Apps)
- Autoscaling to match workload demand
- Managed PaaS services reduce operational overhead
- Blob storage lifecycle policies for cost-effective archiving
- Right-sizing through Azure Advisor recommendations

## Operational Excellence
- CI/CD with GitHub Actions / Azure DevOps
- Infrastructure as Code (Bicep / ARM)
- Centralised monitoring (Azure Monitor)
- Automated deployments with quality gates
- Comprehensive audit logging

## Performance Efficiency
- Stateless API design for horizontal scaling
- Independent engine scaling
- Connection pooling for database efficiency
- Background processing for long-running validations
- Caching strategies for metadata (future)

---

# Azure Service Mapping

| Platform Capability | Azure Service |
|---------------------|---------------|
| Compute (MVP) | Azure Container Apps |
| Compute (Enterprise) | Azure Kubernetes Service (AKS) |
| API Gateway | Azure API Management |
| Global Routing | Azure Front Door |
| Identity | Microsoft Entra ID |
| Primary Database | Azure SQL Database / PostgreSQL Flexible Server |
| Secrets Management | Azure Key Vault |
| Object Storage | Azure Blob Storage |
| Monitoring | Azure Monitor |
| Application Telemetry | Application Insights |
| Security Posture | Microsoft Defender for Cloud |
| CI/CD | GitHub Actions / Azure DevOps |
| Infrastructure as Code | Bicep / ARM Templates |

---

# Future Azure Services

| Phase | Service | Purpose |
|-------|---------|---------|
| Phase 2 | Azure OpenAI Service | AI-assisted mapping recommendations |
| Phase 2 | Azure Service Bus | Async event processing for large batches |
| Phase 3 | Azure Cosmos DB | Global-scale metadata storage |
| Phase 3 | Azure Cognitive Search | Semantic search across mappings |
| Phase 3 | Power BI | Interactive dashboards and reporting |
| Phase 4 | Microsoft Fabric | Enterprise data integration |

---

# Cost Model (Projected)

| Service | Estimated Monthly Cost (MVP) |
|---------|------------------------------|
| Azure Container Apps | $200–500 |
| Azure SQL Database (Basic) | $150–300 |
| Azure Blob Storage | $50–100 |
| Azure API Management | $100–200 |
| Azure Key Vault | $10–20 |
| Azure Monitor | $50–100 |
| **Total (MVP)** | **$560–1,220/month** |

Costs scale linearly with customer adoption. Enterprise deployments with AKS and HA configurations range from $2,000–5,000/month.

---

# Conclusion

This Azure-native architecture provides a secure, scalable, and cost-effective foundation for the FS Migration Validation Engine. By combining a centralised Platform Core with independently deployable microservices and managed Azure services, the platform minimises operational overhead while maximising resilience, extensibility, and enterprise readiness for regulated Financial Services environments.

The design supports rapid MVP deployment through Azure Container Apps while providing a clear migration path to Azure Kubernetes Service for large-scale enterprise deployments. It establishes a robust foundation for future AI capabilities, multi-tenant SaaS operations, and a growing ecosystem of platform integrations.