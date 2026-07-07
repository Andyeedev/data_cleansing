# Phase 1.5 – Azure Reference Architecture Diagram

**Version:** 1.0
**Architecture Style:** Azure-Native • Event-Driven • AI-Enabled • Microservices

---

# Azure Reference Architecture

```text
                                        ┌─────────────────────────────┐
                                        │           USERS             │
                                        │ Web • API • Admin • Clients │
                                        └──────────────┬──────────────┘
                                                       │
                                            HTTPS / REST / OAuth2
                                                       │
                     ┌──────────────────────────────────────────────────────────┐
                     │                 Azure Front Door (Optional)              │
                     │ Global Routing • WAF • DDoS • SSL Offload               │
                     └──────────────────────────┬───────────────────────────────┘
                                                │
                                  ┌──────────────────────────────┐
                                  │ Azure API Management (APIM)  │
                                  │ API Gateway • Rate Limits    │
                                  │ Versioning • Policies        │
                                  └──────────────┬───────────────┘
                                                 │
                                  ┌──────────────────────────────┐
                                  │ Microsoft Entra ID           │
                                  │ OAuth2 • SSO • MFA • RBAC    │
                                  └──────────────┬───────────────┘
                                                 │
────────────────────────────────────────────────────────────────────────────────────
                              PLATFORM CORE (Azure Container Apps)
────────────────────────────────────────────────────────────────────────────────────

                           ┌─────────────────────────────────────┐
                           │        Platform Core API            │
                           │-------------------------------------│
                           │ Workflow Orchestration              │
                           │ Plugin Management                   │
                           │ Configuration                       │
                           │ Security                            │
                           │ Event Routing                       │
                           │ AI Orchestration                    │
                           │ Monitoring                          │
                           │ Audit                               │
                           └──────────────┬──────────────────────┘
                                          │
         ┌────────────────────────────────┼─────────────────────────────────┐
         │                                │                                 │
         │                                │                                 │
┌──────────────────┐          ┌──────────────────┐              ┌──────────────────┐
│ Discovery Engine │          │ Mapping Engine   │              │ Validation Engine│
│ Legacy Analysis  │          │ Schema Mapping   │              │ Rule Validation  │
└─────────┬────────┘          └─────────┬────────┘              └─────────┬────────┘
          │                             │                                 │
          └────────────────────┬────────┴───────────┬─────────────────────┘
                               │                    │
                    ┌──────────────────┐   ┌──────────────────┐
                    │ Rules Engine     │   │ Analytics Engine │
                    │ Business Rules   │   │ Reports • KPIs   │
                    └────────┬─────────┘   └────────┬─────────┘
                             │                      │
                             └──────────┬───────────┘
                                        │
────────────────────────────────────────────────────────────────────────────────────
                         Azure Service Bus / Event Grid
────────────────────────────────────────────────────────────────────────────────────
                                        │
                     Event-Driven Messaging • Decoupling • Retries
                                        │
────────────────────────────────────────────────────────────────────────────────────
                                   DATA LAYER
────────────────────────────────────────────────────────────────────────────────────

     ┌───────────────────┐      ┌────────────────────┐      ┌───────────────────┐
     │ Azure Cosmos DB   │      │ Azure SQL Database │      │ Azure Blob Storage│
     │ Metadata          │      │ Business Data      │      │ Files             │
     │ Workflow State    │      │ Customers          │      │ Reports           │
     │ Configurations    │      │ Projects           │      │ Documents         │
     └───────────────────┘      └────────────────────┘      └───────────────────┘

────────────────────────────────────────────────────────────────────────────────────
                                 AI SERVICES
────────────────────────────────────────────────────────────────────────────────────

                    ┌────────────────────────────────────┐
                    │ Azure OpenAI Service               │
                    │------------------------------------│
                    │ Intelligent Mapping                │
                    │ Code Understanding                 │
                    │ AI Copilot                         │
                    │ Documentation                      │
                    │ Semantic Search                    │
                    └────────────────────────────────────┘

────────────────────────────────────────────────────────────────────────────────────
                              SECURITY & OPERATIONS
────────────────────────────────────────────────────────────────────────────────────

     Azure Key Vault
           │
     Secrets • Certificates • API Keys

     Microsoft Defender for Cloud
           │
     Security Posture • Threat Detection

     Azure Monitor
           │
     Infrastructure Monitoring

     Application Insights
           │
     Telemetry • Tracing • Performance

     Microsoft Sentinel (Optional)
           │
     SIEM • Security Analytics

────────────────────────────────────────────────────────────────────────────────────
                                 DEVOPS
────────────────────────────────────────────────────────────────────────────────────

     GitHub Actions / Azure DevOps
               │
        Build → Test → Scan → Deploy

               │

     Infrastructure as Code
        Bicep • ARM • Terraform
```

---

# Architectural Layers

## Presentation Layer

* Web Portal
* REST APIs
* Administration Console
* Client Integrations

## API Layer

* Azure Front Door (optional)
* Azure API Management
* Microsoft Entra ID authentication

## Platform Core

* Workflow orchestration
* Security
* Plugin registry
* Configuration
* AI orchestration
* Event routing

## Domain Engines

* Discovery
* Mapping
* Validation
* Rules
* Analytics

Each engine is independently deployable and scalable.

## Integration Layer

* Azure Service Bus
* Azure Event Grid
* External APIs
* Future partner integrations

## Data Layer

* Cosmos DB
* Azure SQL Database
* Blob Storage

## AI Layer

* Azure OpenAI Service
* Prompt orchestration
* Semantic search
* AI copilots

## Operations Layer

* Azure Monitor
* Application Insights
* Defender for Cloud
* Sentinel
* Key Vault

---

# Deployment Model

### Development

* Azure Container Apps
* Shared Azure SQL
* Shared Cosmos DB

### Test

* Dedicated Container Apps environment
* Isolated databases
* Automated CI/CD deployment

### Production

* Azure Container Apps (MVP)
* Azure Kubernetes Service (future enterprise scale)
* Private networking
* High availability
* Geo-redundant storage

---

# Scalability Strategy

Each engine scales independently:

| Engine        | Scale Trigger                    |
| ------------- | -------------------------------- |
| Discovery     | Number of uploaded systems       |
| Mapping       | Concurrent mapping jobs          |
| Validation    | Active validation workflows      |
| Rules         | Business rule execution volume   |
| Analytics     | Reporting requests               |
| Platform Core | Concurrent users and API traffic |

Autoscaling is managed by Azure Container Apps using CPU, memory, and queue depth metrics.

---

# Security Boundaries

* Microsoft Entra ID for identity and access management
* Azure API Management for request governance
* Managed Identities for service authentication
* Azure Key Vault for secret management
* Private Endpoints for data services
* Encryption in transit (TLS 1.2+)
* Encryption at rest using Azure-managed keys (customer-managed keys optional)

---

# Future Expansion

The architecture is designed to support:

* Multi-tenant SaaS
* Customer-specific plugins
* AI Agents
* Azure AI Search
* Microsoft Fabric integration
* Dynamics 365 integration
* Power Platform connectors
* Azure Marketplace publishing
* Cross-region disaster recovery
* Cross-cloud deployment (AWS/GCP) where required
