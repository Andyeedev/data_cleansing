# High-Level Architecture — Migration Assurance Platform

## Overview

MAP follows a clean, service-oriented architecture designed for enterprise security, scalability, and simplicity. The diagram below illustrates the high-level flow from customer interaction to Azure platform services.

## Architecture Diagram

```mermaid
graph LR
    A[Customer] -->|Secure Access| B[MAP Portal]
    B -->|Identity Verification| C[Microsoft Entra ID]
    B -->|API Requests| D[Business Services]
    D -->|Data Operations| E[Azure SQL]
    D -->|File Processing| F[Azure Blob Storage]
    D -->|Caching| G[Azure Cache for Redis]
    D -->|Secrets Management| H[Azure Key Vault]
    D -->|Audit & Monitoring| I[Azure Monitor]
    D -.->|Future: AI Insights| J[Azure OpenAI]

    style A fill:#667eea,stroke:#667eea,color:#fff
    style B fill:#764ba2,stroke:#764ba2,color:#fff
    style C fill:#667eea,stroke:#667eea,color:#fff
    style D fill:#764ba2,stroke:#764ba2,color:#fff
    style E fill:#667eea,stroke:#667eea,color:#fff
    style F fill:#667eea,stroke:#667eea,color:#fff
    style G fill:#667eea,stroke:#667eea,color:#fff
    style H fill:#667eea,stroke:#667eea,color:#fff
    style I fill:#667eea,stroke:#667eea,color:#fff
    style J fill:#999,stroke:#999,color:#fff,stroke-dasharray: 5 5
```

## Flow Description

1. **Customer** accesses MAP through a secure web portal with identity verified via **Microsoft Entra ID**.
2. **MAP Portal** routes requests to the **Business Services** layer, which orchestrates all platform capabilities.
3. **Business Services** interact with Azure data, storage, and caching services to process migration validation workflows.
4. **Azure Key Vault** manages secrets and credentials securely across all services.
5. All operations are logged and monitored through **Azure Monitor** for observability and compliance.
6. Future **Azure OpenAI** integration (dashed line) will provide AI-powered validation insights within the same secure boundary.

## Design Principles

- **Security by Default**: All traffic is authenticated and encrypted end-to-end.
- **Azure-Native**: Leverages managed Azure services to minimise operational overhead.
- **Compliance-Ready**: Architecture supports UK data residency and financial services regulatory requirements.
- **Modular**: Services are decoupled to enable independent scaling and future capability additions.
