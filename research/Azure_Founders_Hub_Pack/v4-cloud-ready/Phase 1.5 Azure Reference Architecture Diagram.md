# Phase 1.5 — Azure Reference Architecture Diagram

**Version:** 2.0  
**Architecture Style:** Azure-Native • Microservices • Event-Driven • Financial Services Grade  
**Product:** FS Migration Validation Engine

---

# Azure Reference Architecture

```text
                                    ┌──────────────────────────────────┐
                                    │           USERS / CLI           │
                                    │  Developers • DevOps • Auditors  │
                                    └──────────────┬───────────────────┘
                                                   │
                                        HTTPS / REST API / OAuth2
                                                   │
                     ┌──────────────────────────────────────────────────────────┐
                     │                Azure Front Door (Optional)               │
                     │         Global Routing • WAF • DDoS • SSL Offload        │
                     └──────────────────────────┬───────────────────────────────┘
                                                │
                                   ┌──────────────────────────────┐
                                   │   Azure API Management       │
                                   │   API Gateway • Rate Limits   │
                                   │   Versioning • Policies       │
                                   └──────────────┬───────────────┘
                                                  │
                                   ┌──────────────────────────────┐
                                   │   Microsoft Entra ID         │
                                   │   OAuth2 • SSO • MFA • RBAC  │
                                   └──────────────┬───────────────┘
                                                  │
────────────────────────────────────────────────────────────────────────────────────
                         PLATFORM CORE (Azure Container Apps)
────────────────────────────────────────────────────────────────────────────────────

                          ┌─────────────────────────────────────┐
                          │       Platform Core API             │
                          │-------------------------------------│
                          │  Workflow Orchestration             │
                          │  Control Dependency (DAG) Manager   │
                          │  Configuration Service              │
                          │  Security Enforcement               │
                          │  State Management                   │
                          │  Audit Routing                      │
                          └──────────────┬──────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        │                                │                                │
┌──────────────────┐          ┌──────────────────┐              ┌──────────────────┐
│ Discovery Engine │          │ Validation Engine│              │  Scoring Engine  │
│ Schema Discovery │          │ C01 - C010       │              │ Pass/Fail Scoring│
│ Metadata Extract │          │ SQL Controls     │              │ Aggregate Metrics│
└─────────┬────────┘          └─────────┬────────┘              └─────────┬────────┘
          │                             │                                 │
          └────────────────────┬────────┴───────────┬─────────────────────┘
                               │                    │
                    ┌──────────────────┐   ┌──────────────────┐
                    │ Governance Engine│   │   Export Engine  │
                    │ Release Gates    │   │  Audit CSV       │
                    │ Exception Register│   │  Batch Reports   │
                    └────────┬─────────┘   └────────┬─────────┘
                             │                      │
                             └──────────┬───────────┘
                                        │
────────────────────────────────────────────────────────────────────────────────────
                           DATA & STORAGE LAYER
────────────────────────────────────────────────────────────────────────────────────

    ┌───────────────────┐      ┌────────────────────┐      ┌───────────────────┐
    │  Azure SQL /      │      │  Azure Blob        │      │  Azure Key Vault  │
    │  PostgreSQL       │      │  Storage           │      │                   │
    │───────────────────│      │────────────────────│      │───────────────────│
    │  Batch Records    │      │  Audit CSVs        │      │  DB Credentials   │
    │  Control Results  │      │  Reports           │      │  API Keys         │
    │  Exception Register│     │  Logs              │      │  Certificates     │
    │  Schema Metadata  │      │  Backups           │      │  Encryption Keys  │
    └───────────────────┘      └────────────────────┘      └───────────────────┘
                          │
────────────────────────────────────────────────────────────────────────────────────
                            MONITORING & OBSERVABILITY
────────────────────────────────────────────────────────────────────────────────────

                    ┌────────────────────────────────────┐
                    │  Azure Monitor + Application       │
                    │  Insights                          │
                    │────────────────────────────────────│
                    │  Infrastructure Metrics            │
                    │  API Performance                   │
                    │  Control Execution Duration        │
                    │  Exception Tracking                │
                    │  Distributed Tracing               │
                    │  Custom Dashboards                 │
                    └────────────────────────────────────┘

────────────────────────────────────────────────────────────────────────────────────
                               CI/CD & DEVOPS
────────────────────────────────────────────────────────────────────────────────────

                    ┌────────────────────────────────────┐
                    │  GitHub Actions / Azure DevOps     │
                    │────────────────────────────────────│
                    │  Build → Test → Security Scan      │
                    │  → Container Build → Deploy        │
                    │────────────────────────────────────│
                    │  Infrastructure as Code            │
                    │  (Bicep / ARM Templates)           │
                    └────────────────────────────────────┘
```

---

# Architectural Layers

## 1. Presentation Layer
- **CLI Interface** — `python app/main.py run --config config.yaml`
- **REST API** — FastAPI endpoints for programmatic access
- **Future Web Portal** — Interactive dashboard and management UI

## 2. API Layer
- Azure API Management — Gateway, rate limiting, versioning
- Microsoft Entra ID — Authentication and authorisation (future)
- Azure Front Door — Global routing and WAF (optional)

## 3. Platform Core
- Workflow orchestration — Coordinates engine execution sequence
- Control dependency management — DAG-based execution ordering
- Configuration management — Centralised via `config.yaml`
- Security enforcement — Authentication, audit, secrets isolation
- State management — Batch tracking, checkpointing, recovery
- Error handling — Failure isolation, retry, graceful degradation

## 4. Domain Engines
Each engine is independently deployable and scalable:

| Engine | Function | Status |
|--------|----------|--------|
| Discovery Engine | Schema discovery, metadata extraction | ✅ Built |
| Validation Engine | 10 structured controls (C01-C010) | ✅ Built |
| Scoring Engine | Pass/fail, aggregate scoring | ✅ Built |
| Governance Engine | Release gates, exception register | ✅ Built |
| Export Engine | CSV audit export | ✅ Built |

## 5. Data Layer
- **Azure SQL / PostgreSQL** — Primary operational database
- **Azure Blob Storage** — Audit artifacts and report storage
- **Azure Key Vault** — Secrets and credentials management

## 6. Observability Layer
- Azure Monitor — Infrastructure and platform metrics
- Application Insights — Application performance monitoring
- Custom dashboards — Migration quality visualisation

## 7. DevOps Layer
- GitHub Actions / Azure DevOps — CI/CD pipeline automation
- Bicep / ARM Templates — Infrastructure as Code
- Automated testing — Unit tests, integration tests, security scans

---

# Deployment Model

| Environment | Compute | Database | Storage | Configuration |
|-------------|---------|----------|---------|---------------|
| **Development** | Local Docker | Local PostgreSQL | Local filesystem | `config.yaml` + `.env` |
| **Test** | Azure Container Apps | Azure SQL (DTU) | Blob Storage (Cool) | Key Vault + Config |
| **Staging** | Azure Container Apps | Azure SQL (vCore) | Blob Storage (Cool) | Key Vault + Config |
| **Production** | AKS (future) | Azure SQL (HA) | Blob Storage (Hot) | Key Vault + Config |

---

# Security Boundaries

| Boundary | Control |
|----------|---------|
| Network | Private endpoints for all data services |
| Identity | Environment-based → Microsoft Entra ID (future) |
| Authentication | API keys → OAuth2 (migration path) |
| Secrets | Azure Key Vault — no secrets in code |
| Data at rest | Azure SQL TDE, Blob encryption |
| Data in transit | TLS 1.2+ for all communications |
| Audit | Every execution logged with batch ID and timestamp |

---

# Scalability Model

| Component | Scale Strategy | Metric |
|-----------|---------------|--------|
| API Layer | Horizontal (Container Apps) | Requests/second |
| Validation Engine | Horizontal | Controls × batch size |
| Scoring Engine | Vertical | Result volume |
| governance Engine | Singleton | Batch completion events |
| Database | Vertical → Read replicas | Connection pool depth |

---

# Future Expansion

The architecture is designed to support:

- **Phase 2:** AI-assisted mapping (Azure OpenAI), async processing (Service Bus)
- **Phase 3:** Web dashboard (React + Azure Static Web Apps), multi-tenant SaaS
- **Phase 4:** Marketplace, partner integrations, Microsoft Fabric connectivity