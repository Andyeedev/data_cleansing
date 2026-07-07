# 09 — Component Architecture

**Document:** MAP MVP Component Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Frontend

| Attribute | Detail |
|-----------|--------|
| **Technology** | React 18, Next.js 14, TypeScript, Tailwind CSS |
| **Deployment** | Azure Container Apps (static export) |
| **Responsibility** | User interface, state management, API communication |
| **Dependencies** | API Gateway, Authentication Service |

---

## 2. Backend Services

| Service | Technology | Responsibility |
|---------|------------|----------------|
| Validation Service | .NET 9, ASP.NET Core | Migration validation logic |
| Discovery Service | .NET 9, ASP.NET Core | Azure resource scanning |
| Reporting Service | .NET 9, ASP.NET Core | Dashboard, reports, analytics |
| Governance Service | .NET 9, ASP.NET Core | Policies, workflows, compliance |
| Auth Service | .NET 9, ASP.NET Core | Authentication, authorization |
| Notification Service | .NET 9, ASP.NET Core | Email, in-app notifications |
| Admin Service | .NET 9, ASP.NET Core | Tenant, user, config management |

---

## 3. API Layer

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| API Gateway | Azure API Management | Routing, rate limiting, auth |
| REST APIs | ASP.NET Core Minimal APIs | CRUD operations |
| OpenAPI | Swashbuckle | API documentation |

---

## 4. Authentication

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Identity Provider | Microsoft Entra ID | SSO, MFA, user management |
| Auth Library | Microsoft.Identity.Web | Token acquisition, validation |
| RBAC | Custom + Entra ID roles | Role-based access control |

---

## 5. AI

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| AI Service | Python, FastAPI | AI processing, prompt orchestration |
| OpenAI Client | Azure OpenAI SDK | LLM communication |
| Prompt Engine | Custom | Prompt management, context injection |

---

## 6. Database

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Primary Database | Azure SQL Database | Transactional data |
| Cache | Azure Cache for Redis | Session, query caching |
| File Storage | Azure Blob Storage | Reports, logs, attachments |

---

## 7. Reporting

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Report Engine | .NET 9, QuestPDF/iTextSharp | PDF generation |
| Dashboard | React, Recharts/D3 | Visual dashboards |
| Export | CSV/Excel libraries | Data export |

---

## 8. Admin Portal

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Admin UI | React, Next.js | Administration interface |
| User Management | Entra ID + Custom | User CRUD, role assignment |
| Configuration | Custom | System settings management |

---

## 9. Notification Engine

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Email Service | Azure Communication Services | Email delivery |
| In-App Notifications | SignalR (Future) | Real-time notifications |
| Alert Engine | Custom | Alert rules, escalation |

---

## 10. Configuration

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| App Configuration | Azure App Configuration | Centralized settings |
| Feature Flags | Azure App Configuration | Feature toggles |
| Environment Config | Environment variables | Per-environment settings |

---

## 11. Monitoring

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Telemetry | Application Insights | Distributed tracing |
| Metrics | Azure Monitor | Performance metrics |
| Logging | Serilog + Application Insights | Structured logging |
| Alerting | Azure Monitor Alerts | Proactive alerting |

---

## 12. Audit

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Audit Logger | Custom + Azure SQL | Audit trail |
| Audit Viewer | Custom API/UI | Audit log access |
| Compliance | Custom | Compliance tracking |

---

## 13. Logging

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Log Sink | Application Insights | Centralized logging |
| Log Processor | Azure Functions (Future) | Log processing |
| Log Archive | Azure Blob Storage | Long-term retention |

---

*End of Component Architecture*
