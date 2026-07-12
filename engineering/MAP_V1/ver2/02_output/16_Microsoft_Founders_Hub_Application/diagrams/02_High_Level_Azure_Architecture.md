# Diagram 2 — High-Level Azure Architecture

```mermaid
graph TB
    subgraph "Users"
        U1["Executive Sponsor"]
        U2["Migration Lead"]
        U3["Technical Architect"]
    end

    subgraph "MAP Portal"
        W["Web Application"]
        API["API Gateway"]
    end

    subgraph "Business Services"
        V["Validation Engine"]
        G["Governance Service"]
        R["Reporting Service"]
        AI["AI Insights (Future)"]
    end

    subgraph "Azure Platform"
        ID["Microsoft Entra ID<br/>Identity & Access"]
        SQL["Azure SQL<br/>Data Store"]
        ST["Azure Blob Storage<br/>Files & Logs"]
        MON["Azure Monitor<br/>Observability"]
        OAI["Azure OpenAI<br/>Intelligence"]
    end

    U1 --> W
    U2 --> W
    U3 --> W
    W --> API
    API --> V
    API --> G
    API --> R
    API --> AI
    V --> ID
    V --> SQL
    G --> SQL
    R --> ST
    R --> MON
    AI --> OAI

    style U1 fill:#667eea,stroke:#764ba2,color:#fff
    style U2 fill:#667eea,stroke:#764ba2,color:#fff
    style U3 fill:#667eea,stroke:#764ba2,color:#fff
    style W fill:#667eea,stroke:#764ba2,color:#fff
    style API fill:#667eea,stroke:#764ba2,color:#fff
    style V fill:#764ba2,stroke:#667eea,color:#fff
    style G fill:#764ba2,stroke:#667eea,color:#fff
    style R fill:#764ba2,stroke:#667eea,color:#fff
    style AI fill:#764ba2,stroke:#667eea,color:#fff
    style ID fill:#0078d4,stroke:#005a9e,color:#fff
    style SQL fill:#0078d4,stroke:#005a9e,color:#fff
    style ST fill:#0078d4,stroke:#005a9e,color:#fff
    style MON fill:#0078d4,stroke:#005a9e,color:#fff
    style OAI fill:#0078d4,stroke:#005a9e,color:#fff
```

**Architecture Overview:**

MAP is built natively on Microsoft Azure. Users access the MAP Portal through a secure web application, which communicates with business services via an API gateway. The platform leverages core Azure services:

| Layer | Azure Service | Purpose |
|-------|--------------|---------|
| Identity | Microsoft Entra ID | Enterprise SSO and access control |
| Data | Azure SQL | Managed relational data store |
| Storage | Azure Blob Storage | Reports, audit logs, file attachments |
| Observability | Azure Monitor | Platform health and performance |
| Intelligence | Azure OpenAI (Future) | AI-powered migration insights |

All services are Azure-native, managed, and scalable — ensuring enterprise-grade reliability with minimal operational overhead.
