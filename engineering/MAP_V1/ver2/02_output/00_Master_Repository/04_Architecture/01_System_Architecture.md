# 07 — System Architecture

**Document:** MAP MVP System Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Web App    │  │  Mobile App  │  │   API Docs   │  │  Admin Portal│   │
│  │  (React/     │  │  (Future)    │  │  (Swagger)   │  │  (React)     │   │
│  │   Next.js)   │  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               API GATEWAY                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Azure API Management                              │  │
│  │         (Rate Limiting, Authentication, Routing)                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             APPLICATION LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Validation  │  │  Discovery   │  │  Reporting   │  │  Governance  │   │
│  │   Service    │  │   Service    │  │   Service    │  │   Service    │   │
│  │  (.NET 9)    │  │  (.NET 9)    │  │  (.NET 9)    │  │  (.NET 9)    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   AI Service │  │  Auth Service│  │  Notification│  │  Admin       │   │
│  │  (Python)    │  │  (.NET 9)    │  │  (.NET 9)    │  │  (.NET 9)    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Azure SQL   │  │    Redis     │  │   Blob       │  │  Key Vault   │   │
│  │  (Primary)   │  │   (Cache)    │  │  (Storage)   │  │  (Secrets)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INTEGRATION LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Azure      │  │  Microsoft   │  │  Power BI    │  │  OpenAI      │   │
│  │  Resources   │  │    365       │  │  (Future)    │  │  (AI)        │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Logical Architecture

| Layer | Components | Responsibility |
|-------|------------|----------------|
| Presentation | Web App, Admin Portal, API Docs | User interface, API documentation |
| API Gateway | Azure API Management | Routing, rate limiting, authentication |
| Application | Microservices (.NET 9, Python) | Business logic, validation, AI |
| Data | Azure SQL, Redis, Blob, Key Vault | Data persistence, caching, secrets |
| Integration | Azure, M365, Power BI, OpenAI | External system connectivity |

---

## 3. Physical Architecture

| Component | Deployment | SKU/Size |
|-----------|------------|----------|
| Web App | Azure Container Apps | Consumption plan |
| API Gateway | Azure API Management | Developer tier (MVP) |
| Validation Service | Azure Container Apps | Consumption plan |
| Discovery Service | Azure Container Apps | Consumption plan |
| AI Service | Azure Container Apps | Consumption plan |
| Azure SQL | Azure SQL Database | Basic tier (MVP) |
| Redis | Azure Cache for Redis | Basic tier (C1) |
| Blob Storage | Azure Blob Storage | Standard LRS |
| Key Vault | Azure Key Vault | Standard tier |

---

## 4. Runtime Architecture

| Component | Runtime | Version |
|-----------|---------|---------|
| Frontend | Node.js | 20 LTS |
| Backend Services | .NET | 9.0 |
| AI Service | Python | 3.11 |
| Database | Azure SQL | Latest |
| Cache | Redis | 7.x |

---

## 5. Data Flow

### Validation Flow
```
User → Web App → API Gateway → Validation Service → Azure SQL
                                    │
                                    ▼
                              Azure Resources
                                    │
                                    ▼
                              Validation Results → Reporting → Dashboard
```

### Discovery Flow
```
User → Web App → API Gateway → Discovery Service → Azure Resources
                                    │
                                    ▼
                              Resource Inventory → Azure SQL
```

---

## 6. Component Interactions

| Component | Communicates With | Protocol |
|-----------|-------------------|----------|
| Web App | API Gateway | HTTPS/REST |
| API Gateway | Application Services | gRPC/REST |
| Validation Service | Azure SQL, Azure Resources | HTTPS, ARM API |
| Discovery Service | Azure Resources | ARM API |
| AI Service | Azure OpenAI | HTTPS/REST |
| All Services | Key Vault | HTTPS |
| All Services | Redis | TCP |
| All Services | Azure SQL | TCP/TLS |

---

## 7. Deployment Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                    AZURE SUBSCRIPTION (PROD)                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              RESOURCE GROUP: map-prod-rg                   │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │ Container   │  │ API Mgmt    │  │ SQL Database│      │  │
│  │  │ Apps        │  │ Gateway     │  │             │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │ Redis       │  │ Blob Storage│  │ Key Vault   │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Architecture Rationale

| Decision | Rationale |
|----------|-----------|
| Microservices | Independent scaling, deployment, team ownership |
| Container Apps | Serverless containers, cost-effective for MVP |
| Azure SQL | Managed, enterprise-grade, minimal operational overhead |
| Redis | Performance caching, session management |
| API Management | Centralized gateway, security, rate limiting |
| .NET 9 | Microsoft ecosystem, performance, enterprise support |
| Python (AI) | AI/ML ecosystem, OpenAI SDK support |

---

*End of System Architecture*
