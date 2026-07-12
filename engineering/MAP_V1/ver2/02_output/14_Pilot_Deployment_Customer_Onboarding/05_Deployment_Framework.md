# MAP Deployment Framework

| Field | Value |
|-------|-------|
| **Document Title** | Migration Assurance Platform (MAP) — Deployment Framework |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal / Customer Confidential |
| **Owner** | Platform Engineering & DevOps |
| **Author** | MAP Engineering Team |
| **Last Reviewed** | 2026-07-01 |
| **Next Review** | 2026-10-01 |

---

## Document Control

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-05-15 | MAP Engineering | Initial draft — deployment model overview |
| 0.5 | 2026-06-01 | MAP Engineering | Added customer-managed and hosted models |
| 0.8 | 2026-06-15 | MAP Engineering | Added rollback procedures and validation |
| 0.9 | 2026-06-25 | Platform Engineering | Added automation and best practices |
| 1.0 | 2026-07-01 | MAP Engineering | Finalised all sections — Official release |

### Approval

| Approver | Role | Date Approved |
|----------|------|---------------|
| VP of Engineering | Engineering Authority | 2026-07-01 |
| Head of Platform Engineering | Platform Authority | 2026-07-01 |
| Director of Cloud Operations | Operations Authority | 2026-07-01 |

### Distribution

| Recipient | Purpose |
|-----------|---------|
| MAP Engineering Team | Development and maintenance |
| Customer Success | Pilot deployment coordination |
| Solutions Architects | Customer-facing deployment guidance |
| Support Engineering | Operational runbooks and escalation |

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Definitions & Acronyms](#2-definitions--acronyms)
3. [Dependencies](#3-dependencies)
4. [Deployment Model Overview](#4-deployment-model-overview)
5. [Cloud Deployment (SaaS)](#5-cloud-deployment-saas)
6. [Customer-Managed Deployment](#6-customer-managed-deployment)
7. [Hosted Deployment](#7-hosted-deployment)
8. [Infrastructure Provisioning](#8-infrastructure-provisioning)
9. [Configuration Process](#9-configuration-process)
10. [Rollback Procedures](#10-rollback-procedures)
11. [Post-Deployment Validation](#11-post-deployment-validation)
12. [Deployment Automation & CI/CD](#12-deployment-automation--cicd)
13. [Best Practices](#13-best-practices)
14. [References](#14-references)
15. [Appendices](#15-appendices)

---

## 1. Purpose & Scope

### 1.1 Purpose

This document defines the authoritative deployment framework for the Migration Assurance Platform (MAP). It establishes the models, processes, standards, automation patterns, and validation procedures required to deploy MAP safely and consistently across all customer engagement types: cloud SaaS, customer-managed, and hosted.

### 1.2 Scope

This framework covers:

- All MAP product components deployed to Azure and customer environments
- Pilot deployments for early-adopter customers during onboarding
- Production deployments following successful pilot validation
- Infrastructure provisioning, configuration, rollback, and post-deployment validation
- CI/CD pipeline design and deployment automation
- Blue-green, canary, and feature-flag deployment patterns

### 1.3 Out of Scope

- Customer internal IT infrastructure not related to MAP
- Non-Azure cloud providers (AWS, GCP) — future roadmap item
- On-premises deployments without Azure connectivity

### 1.4 Audience

| Role | Use This Document For |
|------|----------------------|
| DevOps Engineers | Implementing deployment pipelines and infrastructure |
| Solutions Architects | Designing customer deployment topologies |
| Customer Success Managers | Coordinating pilot deployment timelines |
| Support Engineers | Understanding deployment topology for troubleshooting |
| Product Managers | Understanding deployment model options |

---

## 2. Definitions & Acronyms

| Term | Definition |
|------|-----------|
| MAP | Migration Assurance Platform |
| SaaS | Software as a Service |
| VNet | Virtual Network (Azure) |
| ARM | Azure Resource Manager |
| Bicep | Azure Bicep — declarative IaC language for Azure |
| Terraform | Open-source IaC tool by HashiCorp |
| IaC | Infrastructure as Code |
| CI/CD | Continuous Integration / Continuous Deployment |
| CSE | Customer Success Engineer |
| SLA | Service Level Agreement |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
| WAF | Web Application Firewall |
| AKS | Azure Kubernetes Service |
| APIM | Azure API Management |
| App Config | Azure App Configuration |
| Key Vault | Azure Key Vault |
| ACR | Azure Container Registry |
| NSG | Network Security Group |
| UDR | User Defined Route |
| ASR | Azure Site Recovery |

---

## 3. Dependencies

### 3.1 Upstream Dependencies

| Dependency | Owner | Required Before |
|------------|-------|-----------------|
| MAP Application Code | MAP Engineering | Deployment pipeline trigger |
| Infrastructure Bicep/ARM Templates | Platform Engineering | Environment provisioning |
| Azure Subscription provisioning | Cloud Operations | Any deployment |
| DNS Zone configuration | Network Engineering | Customer-managed deployments |
| TLS Certificates | Security Engineering | All production deployments |
| Azure AD / Entra ID tenant | Identity Engineering | All deployments |
| Feature flag configuration | Product Engineering | Pilot deployments |

### 3.2 Downstream Dependencies

| Consumer | Depends On This Document |
|----------|--------------------------|
| Pilot Deployment Runbook | Deployment steps and validation |
| Customer Onboarding Guide | Deployment model selection |
| Incident Response Playbook | Deployment topology understanding |
| SLA Monitoring Configuration | Health check endpoints and intervals |
| Cost Management Reports | Resource tagging and naming conventions |

---

## 4. Deployment Model Overview

MAP supports three distinct deployment models to accommodate varying customer requirements around data residency, compliance, connectivity, and operational control.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MAP Deployment Models                        │
├──────────────────┬──────────────────┬───────────────────────────────┤
│   Cloud (SaaS)   │ Customer-Managed │         Hosted                │
│                   │                  │                               │
│  ┌─────────────┐  │  ┌─────────────┐ │  ┌─────────────────────────┐ │
│  │ MAP Control │  │  │ MAP Control │ │  │    MAP Control Plane    │ │
│  │   Plane     │  │  │   Plane     │ │  │  (Dedicated per Customer)│ │
│  │ (Shared)    │  │  │ (Dedicated) │ │  └─────────────────────────┘ │
│  └─────────────┘  │  └─────────────┘ │  ┌─────────────────────────┐ │
│  ┌─────────────┐  │  ┌─────────────┐ │  │   Customer Data Plane   │ │
│  │ Data Plane  │  │  │ Data Plane  │ │  │  (MAP-Managed Infra)    │ │
│  │ (Multi-Tnt) │  │  │(Customer VN)│ │  └─────────────────────────┘ │
│  └─────────────┘  │  └─────────────┘ │                               │
│                   │                  │                               │
│  Managed by MAP   │  Customer owns   │  MAP manages on behalf       │
│  fully            │  infra, MAP dep  │  of customer                  │
└──────────────────┴──────────────────┴───────────────────────────────┘
```

### Model Selection Matrix

| Criteria | Cloud (SaaS) | Customer-Managed | Hosted |
|----------|--------------|------------------|--------|
| **Data Residency** | MAP-controlled regions | Customer-specified region | Customer-specified region |
| **Network Isolation** | Shared VNet | Customer VNet peering | Dedicated VNet |
| **Multi-Tenancy** | Yes (logical isolation) | No (single-tenant) | No (single-tenant) |
| **Operational Control** | MAP-managed | Shared (customer + MAP) | MAP-managed |
| **Compliance** | SOC 2, ISO 27001 | Customer audit scope | SOC 2, ISO 27001 |
| **Minimum Commitment** | None | 12 months | 12 months |
| **Typical Customer** | SMB, mid-market | Enterprise, regulated | Enterprise, regulated |
| **Provisioning Time** | < 1 hour | 5-10 business days | 10-15 business days |
| **Pilot Eligibility** | Yes | Yes | Yes |
| **Cost Model** | Per-tenant subscription | Infrastructure + license | Managed service fee |

---

## 5. Cloud Deployment (SaaS)

### 5.1 Architecture Overview

The cloud SaaS deployment model provides MAP as a fully managed service hosted in the customer's designated Azure region. This model offers the fastest time-to-value and is the recommended starting point for most pilot deployments.

```
┌───────────────────────────────────────────────────────────────────┐
│                     MAP Cloud (SaaS) Architecture                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                   Azure Front Door / WAF                    │  │
│  │                   (Global Load Balancer)                    │  │
│  └──────────────────────────┬──────────────────────────────────┘  │
│                             │                                     │
│  ┌──────────────────────────▼──────────────────────────────────┐  │
│  │               MAP API Management (APIM)                    │  │
│  │              Rate Limiting / Auth / Routing                 │  │
│  └───────┬──────────────────┬──────────────────┬───────────────┘  │
│          │                  │                  │                   │
│  ┌───────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐          │
│  │ Migration API │  │  Validation  │  │  Reporting   │          │
│  │    Service    │  │   Service    │  │   Service    │          │
│  │  (AKS Pods)   │  │  (AKS Pods)  │  │ (AKS Pods)   │          │
│  └───────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│          │                  │                  │                   │
│  ┌───────▼──────────────────▼──────────────────▼───────────────┐  │
│  │              Azure SQL (Hyperscale)                         │  │
│  │         Per-Tenant Database  (Logical Isolation)            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐    │
│  │  Azure Redis Cache  │  │  Azure Blob Storage             │    │
│  │  (Session/State)    │  │  (Migration Artifacts)          │    │
│  └─────────────────────┘  └─────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Azure Monitor / Application Insights           │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### 5.2 Multi-Tenant Configuration

Multi-tenant isolation is achieved through logical separation at the database, configuration, and network layers.

#### 5.2.1 Tenant Isolation Model

| Layer | Isolation Mechanism | Standard |
|-------|---------------------|----------|
| **Database** | Per-tenant schema with row-level security | SQL RLS policies |
| **Application** | Tenant context propagated via JWT claim | Custom middleware |
| **Storage** | Blob container per tenant with SAS tokens | RBAC + container-level ACLs |
| **Cache** | Key prefix namespacing per tenant | Redis key convention |
| **Logs** | Tenant ID in all log entries | Structured logging |
| **Network** | Shared VNet with NSG segmentation | Platform-managed NSGs |

#### 5.2.2 Tenant Provisioning Flow

```
Customer Signs Contract
        │
        ▼
┌───────────────────┐
│ CSE Creates Tenant│
│ in Admin Portal   │
└───────┬───────────┘
        │
        ▼
┌───────────────────┐     ┌─────────────────────┐
│ Tenant Record     │────▶│ Azure SQL Database   │
│ Created           │     │ Schema Provisioned   │
└───────┬───────────┘     └─────────────────────┘
        │
        ▼
┌───────────────────┐     ┌─────────────────────┐
│ Blob Container    │────▶│ Storage Account      │
│ Provisioned       │     │ (Tenant Isolated)    │
└───────┬───────────┘     └─────────────────────┘
        │
        ▼
┌───────────────────┐     ┌─────────────────────┐
│ Feature Flags     │────▶│ Azure App Config     │
│ Configured        │     │ (Tenant Settings)    │
└───────┬───────────┘     └─────────────────────┘
        │
        ▼
┌───────────────────┐
│ Tenant Onboarded  │
│ Welcome Email Sent│
└───────────────────┘
```

### 5.3 Single-Tenant Configuration

Single-tenant deployments within the cloud model provide dedicated infrastructure per customer while remaining fully managed by MAP.

| Component | Single-Tenant Resource |
|-----------|----------------------|
| AKS Cluster | Dedicated node pool within shared cluster |
| SQL Database | Dedicated logical server |
| Storage Account | Dedicated storage account |
| Redis Cache | Dedicated cache instance |
| Key Vault | Dedicated Key Vault |
| App Configuration | Dedicated App Config instance |

### 5.4 Cloud Deployment Checklist

- [ ] Azure subscription provisioned in target region
- [ ] Azure AD tenant configured with MAP service principal
- [ ] Network peering established (if hybrid connectivity required)
- [ ] TLS certificates provisioned for custom domains
- [ ] DNS records configured for customer domain
- [ ] Tenant schema provisioned and migrated
- [ ] Storage containers created with appropriate RBAC
- [ ] Feature flags configured per customer tier
- [ ] Monitoring dashboards provisioned
- [ ] Alert rules configured for SLA thresholds
- [ ] Backup policies applied to SQL database
- [ ] Geo-replication configured (if applicable)

---

## 6. Customer-Managed Deployment

### 6.1 Architecture Overview

Customer-managed deployments provide MAP within the customer's own Azure subscription, giving them full control over networking, data residency, and compliance scope.

```
┌───────────────────────────────────────────────────────────────────┐
│               Customer-Managed Deployment Topology                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │               Customer Azure Subscription                   │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │              MAP Resource Group                     │   │  │
│  │  │                                                     │   │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │   │  │
│  │  │  │   AKS    │  │ SQL DB   │  │   Storage    │     │   │  │
│  │  │  │ Cluster  │  │(Dedicated)│  │   Account    │     │   │  │
│  │  │  └────┬─────┘  └──────────┘  └──────────────┘     │   │  │
│  │  │       │                                            │   │  │
│  │  │  ┌────▼──────────────────────────────────────┐     │   │  │
│  │  │  │         Customer VNet                     │     │   │  │
│  │  │  │    10.0.0.0/16 (or customer range)        │     │   │  │
│  │  │  │                                           │     │   │  │
│  │  │  │  ┌─────────────────────────────────────┐  │     │   │  │
│  │  │  │  │     MAP Subnet                      │  │     │   │  │
│  │  │  │  │     10.0.1.0/24                     │  │     │   │  │
│  │  │  │  └─────────────────────────────────────┘  │     │   │  │
│  │  │  └───────────────────────────────────────────┘     │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │         Customer On-Premises Network                │   │  │
│  │  │              (via VPN/ExpressRoute)                  │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │            MAP Management Plane (Shared)                    │  │
│  │       Control Plane APIs / Config Distribution              │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### 6.2 VNet Integration

| Integration Type | Use Case | Configuration |
|-----------------|----------|---------------|
| **VNet Peering** | Customer and MAP VNets in same region | Global VNet peering enabled |
| **VPN Gateway** | Customer on-premises connectivity | Point-to-site VPN to customer VNet |
| **ExpressRoute** | High-bandwidth, low-latency | Private peering via MAP ExpressRoute |
| **Private Link** | Private access to MAP APIs | Private endpoint in customer VNet |
| **Service Endpoint** | Access to Azure PaaS services | Service endpoints for SQL, Storage |

### 6.3 Customer Subscription Requirements

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| **AKS Nodes** | 3 × Standard_D4s_v3 | 3 × Standard_D8s_v3 | System + user node pools |
| **SQL Database** | GP_Gen5_4 | BC_Gen5_8 | Business Critical for HA |
| **Storage** | 100 GB LRS | 500 GB GRS | Tier depends on data volume |
| **Redis Cache** | C1 (1 GB) | C3 (6 GB) | For session and config cache |
| **App Configuration** | Free tier | Standard tier | Feature flags and settings |
| **Key Vault** | Standard | Premium (HSM-backed) | For secrets and certificates |
| **Virtual Network** | /24 CIDR | /16 CIDR | Must not overlap with MAP |

### 6.4 Deployment Steps

| Step | Action | Owner | Duration | Validation |
|------|--------|-------|----------|------------|
| 1 | Customer provides Azure subscription ID | Customer | N/A | Subscription active |
| 2 | MAP provisions resource group via Bicep | MAP Engineering | 15 min | RG created, resources healthy |
| 3 | VNet peering established | Network Engineering | 30 min | Peering connected |
| 4 | AKS cluster deployed and configured | MAP Engineering | 30 min | Nodes ready |
| 5 | SQL database provisioned and schema applied | MAP Engineering | 20 min | Schema version matches |
| 6 | Storage and Key Vault provisioned | MAP Engineering | 10 min | Access policies applied |
| 7 | Application deployed to AKS | MAP Engineering | 20 min | Pods running, health OK |
| 8 | DNS configured for customer domain | Network Engineering | 15 min | DNS resolves correctly |
| 9 | TLS certificate provisioned | Security Engineering | 15 min | Certificate valid, chain complete |
| 10 | Monitoring and alerts configured | MAP Engineering | 10 min | Dashboards accessible |
| 11 | End-to-end validation | QA Engineering | 30 min | All smoke tests pass |
| 12 | Customer sign-off | Customer Success | N/A | Customer confirms |

---

## 7. Hosted Deployment

### 7.1 Architecture Overview

Hosted deployments are fully managed by MAP on dedicated infrastructure provisioned per customer. This model combines the operational simplicity of SaaS with the isolation and compliance of customer-managed deployments.

```
┌───────────────────────────────────────────────────────────────────┐
│                   Hosted Deployment Architecture                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              MAP Dedicated Infrastructure                   │  │
│  │         (Isolated subscription per customer)                │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │        Customer-Dedicated VNet                      │   │  │
│  │  │        10.C.X.0/16 (per customer)                   │   │  │
│  │  │                                                     │   │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │   │  │
│  │  │  │   AKS    │  │ SQL DB   │  │   Storage    │     │   │  │
│  │  │  │ Cluster  │  │(Dedicated)│  │   Account    │     │   │  │
│  │  │  └──────────┘  └──────────┘  └──────────────┘     │   │  │
│  │  │                                                     │   │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │   │  │
│  │  │  │  Redis   │  │Key Vault │  │  App Config  │     │   │  │
│  │  │  │  Cache   │  │          │  │              │     │   │  │
│  │  │  └──────────┘  └──────────┘  └──────────────┘     │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │        MAP Connectivity Hub                          │   │  │
│  │  │    VPN Gateway / ExpressRoute Gateway                │   │  │
│  │  │    (Customer connectivity endpoint)                  │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │          MAP Management Plane (Shared)                      │  │
│  │    Centralised monitoring, config, and orchestration        │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### 7.2 Dedicated Infrastructure Specifications

| Component | Specification | SLA |
|-----------|---------------|-----|
| **AKS** | 3-5 nodes, dedicated node pool | 99.95% |
| **SQL Database** | Business Critical, zone-redundant | 99.995% |
| **Storage** | GRS, 500 GB+ | 99.9% |
| **Redis** | C4+ (12 GB), zone-redundant | 99.95% |
| **Key Vault** | Premium (HSM-backed) | 99.99% |
| **App Config** | Standard tier, geo-replicated | 99.99% |
| **Networking** | Dedicated VNet, VPN Gateway | 99.95% |

### 7.3 Hosted Deployment Process

| Phase | Activities | Duration |
|-------|-----------|----------|
| **Phase 1: Provisioning** | Create dedicated subscription, provision VNet, deploy base infrastructure | 5 days |
| **Phase 2: Configuration** | Configure AKS, SQL, storage, Key Vault, App Config | 3 days |
| **Phase 3: Application Deployment** | Deploy MAP application stack, configure services | 2 days |
| **Phase 4: Connectivity** | Establish customer connectivity (VPN/ExpressRoute), test | 3 days |
| **Phase 5: Validation** | End-to-end testing, security scan, compliance check | 2 days |
| **Phase 6: Handover** | Documentation, training, customer sign-off | 2 days |

---

## 8. Infrastructure Provisioning

### 8.1 Bicep Templates

MAP uses Azure Bicep as the primary IaC language for all infrastructure provisioning. Bicep provides a declarative, typed DSL for deploying Azure resources.

#### 8.1.1 Template Structure

```
infrastructure/
├── modules/
│   ├── networking.bicep          # VNet, NSGs, UDRs
│   ├── aks-cluster.bicep        # AKS cluster and node pools
│   ├── sql-database.bicep       # Azure SQL, failover groups
│   ├── storage-account.bicep    # Blob storage, containers
│   ├── redis-cache.bicep        # Azure Cache for Redis
│   ├── key-vault.bicep          # Key Vault, access policies
│   ├── app-configuration.bicep  # App Configuration store
│   ├── monitoring.bicep         # Log Analytics, dashboards
│   └── dns-records.bicep        # DNS zones and records
├── environments/
│   ├── dev.bicepparam            # Development parameters
│   ├── test.bicepparam           # Testing parameters
│   ├── pilot.bicepparam          # Pilot parameters
│   └── prod.bicepparam           # Production parameters
├── main.bicep                    # Main orchestration template
└── parameters.json               # Environment-specific overrides
```

#### 8.1.2 Template Conventions

| Convention | Standard |
|-----------|----------|
| **Naming** | `map-{env}-{component}-{instance}` (e.g., `map-prod-aks-001`) |
| **Resource Groups** | `rg-map-{env}-{region}-{instance}` |
| **Location** | Parameterised via `location` parameter, default `eastus2` |
| **Tags** | Mandatory: `environment`, `cost-center`, `managed-by`, `application` |
| **Modules** | Each component in its own module file under `/modules` |
| **Parameters** | Environment-specific values in `.bicepparam` files |
| **Outputs** | All resources expose connection strings and endpoints |

### 8.2 ARM Templates

ARM templates are maintained for backward compatibility and for customers who prefer ARM over Bicep.

| Aspect | ARM Template Standard |
|--------|----------------------|
| **Format** | JSON (2019-04-01 API version) |
| **Location** | `/infrastructure/arm/` directory |
| **Parameters** | JSON parameter files per environment |
| **Linked Templates** | Azure Blob storage for linked templates |
| **What-If** | Required before every deployment |

### 8.3 Terraform

Terraform configurations are provided as an alternative for customers who standardise on Terraform.

| Aspect | Terraform Standard |
|--------|-------------------|
| **Version** | Terraform >= 1.5, AzureRM provider >= 3.70 |
| **State** | Azure Storage backend for state management |
| **Modules** | Reusable modules in `/infrastructure/terraform/modules` |
| **Workspaces** | One workspace per environment |
| **Locking** | Azure Storage blob lease for state locking |
| **Providers** | AzureRM, AzureAD, Helm, Kubernetes |

### 8.4 Provisioning Automation

```yaml
# Example: Azure DevOps Pipeline for Infrastructure Provisioning
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - infrastructure/**

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: 'map-$(Environment)'
  - name: terraformVersion
    value: '1.5.0'

stages:
  - stage: Plan
    displayName: 'Infrastructure Plan'
    jobs:
      - job: TerraformPlan
        displayName: 'Terraform Plan'
        steps:
          - task: TerraformInstaller@0
            inputs:
              terraformVersion: $(terraformVersion)
          - task: TerraformCLI@0
            inputs:
              command: 'init'
              workingDirectory: '$(Pipeline.Workspace)/infrastructure/terraform'
          - task: TerraformCLI@0
            inputs:
              command: 'plan'
              workingDirectory: '$(Pipeline.Workspace)/infrastructure/terraform'
              environmentServiceName: 'map-azure-connection'

  - stage: Apply
    displayName: 'Infrastructure Apply'
    dependsOn: Plan
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: TerraformApply
        displayName: 'Terraform Apply'
        environment: 'map-$(Environment)'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: TerraformCLI@0
                  inputs:
                    command: 'apply'
                    workingDirectory: '$(Pipeline.Workspace)/infrastructure/terraform'
```

---

## 9. Configuration Process

### 9.1 Environment Variables

MAP uses a layered configuration model where environment-specific values are injected via environment variables at deployment time.

#### 9.1.1 Standard Environment Variables

| Variable | Description | Example | Source |
|----------|------------|---------|--------|
| `MAP_ENVIRONMENT` | Target environment | `pilot`, `production` | Deployment pipeline |
| `MAP_REGION` | Azure region | `eastus2`, `westeurope` | Deployment pipeline |
| `MAP_TENANT_ID` | Customer tenant identifier | `tenant-abc-123` | Customer provisioning |
| `MAP_DB_CONNECTION` | SQL connection string | `Server=...;Database=...` | Key Vault |
| `MAP_REDIS_CONNECTION` | Redis connection string | `...redis.cache.windows.net` | Key Vault |
| `MAP_STORAGE_CONNECTION` | Storage connection string | `DefaultEndpointsProtocol=...` | Key Vault |
| `MAP_KEY_VAULT_URI` | Key Vault endpoint | `https://map-prod-kv.vault.azure.net` | Bicep output |
| `MAP_APP_CONFIG_URI` | App Config endpoint | `https://map-prod-ac.azconfig.io` | Bicep output |
| `MAP_LOG_LEVEL` | Application log level | `Information`, `Debug` | App Config |
| `MAP_FEATURE_FLAGS` | Feature flag override | Comma-separated flags | App Config |

### 9.2 Feature Flags

Feature flags are managed through Azure App Configuration and allow runtime behaviour changes without redeployment.

| Feature Flag | Default | Description | Pilot Override |
|-------------|---------|-------------|----------------|
| `enable-advanced-validation` | `false` | Enables advanced data validation rules | `true` |
| `enable-bulk-migration` | `false` | Enables bulk migration workflows | `true` |
| `enable-custom-reports` | `false` | Enables custom report builder | `true` |
| `enable-api-v2` | `false` | Enables v2 API endpoints | `false` |
| `enable-real-time-sync` | `false` | Enables real-time data synchronisation | `false` |
| `enable-ml-recommendations` | `false` | Enables ML-powered recommendations | `false` |
| `maintenance-mode` | `false` | Puts platform in maintenance mode | `false` |

### 9.3 Configuration Settings

Azure App Configuration stores hierarchical settings organised by environment and component.

```
/map/{environment}/{component}/{setting-name}
```

| Setting Path | Type | Default | Description |
|-------------|------|---------|-------------|
| `/map/pilot/api/rate-limit` | int | `1000` | API rate limit per minute |
| `/map/pilot/api/timeout` | int | `30` | API request timeout (seconds) |
| `/map/pilot/migration/batch-size` | int | `500` | Records per migration batch |
| `/map/pilot/migration/max-concurrency` | int | `4` | Max concurrent migration jobs |
| `/map/pilot/validation/strict-mode` | bool | `false` | Strict validation mode |
| `/map/pilot/reporting/retention-days` | int | `90` | Data retention period |
| `/map/prod/api/rate-limit` | int | `5000` | Production rate limit |
| `/map/prod/migration/batch-size` | int | `1000` | Production batch size |

---

## 10. Rollback Procedures

### 10.1 Rollback Triggers

| Trigger | Severity | Response Time | Action |
|---------|----------|---------------|--------|
| **Health check failure** (≥2 min) | Critical | Immediate | Automatic rollback |
| **Error rate > 5%** | High | 5 minutes | Automatic rollback |
| **Latency p99 > 5 seconds** | High | 10 minutes | Manual review, then rollback |
| **Database migration failure** | Critical | Immediate | Rollback + alert DBA |
| **Customer-reported critical bug** | High | 15 minutes | Manual rollback |
| **Security vulnerability** | Critical | Immediate | Rollback + security review |
| **Deployment timeout** (>30 min) | High | Immediate | Automatic rollback |

### 10.2 Rollback Steps

#### 10.2.1 Application Rollback

```
Step 1: Identify Current Version
─────────────────────────────────
az aks show --name map-prod-aks --resource-group rg-map-prod
kubectl get deployment map-api -n map-prod -o jsonpath='{.spec.template.spec.containers[0].image}'

Step 2: Rollback AKS Deployment
─────────────────────────────────
kubectl rollout undo deployment/map-api -n map-prod
kubectl rollout undo deployment/map-validation -n map-prod
kubectl rollout undo deployment/map-reporting -n map-prod

Step 3: Verify Rollback Status
─────────────────────────────────
kubectl rollout status deployment/map-api -n map-prod --timeout=300s

Step 4: Validate Health
─────────────────────────────────
curl -s https://map-prod.example.com/health | jq .
```

#### 10.2.2 Database Rollback

| Step | Action | Validation |
|------|--------|------------|
| 1 | Stop all application traffic (scale AKS to 0) | No active connections |
| 2 | Restore SQL database from pre-deployment backup | Point-in-time recovery |
| 3 | Verify schema version matches expected rollback target | Schema version check query |
| 4 | Restart application pods | Pods running and healthy |
| 5 | Run smoke tests | All critical paths passing |

#### 10.2.3 Configuration Rollback

| Step | Action | Validation |
|------|--------|------------|
| 1 | Revert App Configuration to previous revision | Settings match pre-deployment |
| 2 | Update Key Vault secrets if rotated | Secrets match expected values |
| 3 | Restart affected pods to pick up configuration changes | Pod restart confirmed |
| 4 | Validate application behaviour | Functional tests pass |

### 10.3 Post-Rollback Validation

| Check | Method | Expected Result |
|-------|--------|-----------------|
| Application health | GET /health | 200 OK, all checks pass |
| Database connectivity | SQL query test | Connection successful |
| API response time | Load test (100 req/s) | p99 < 2 seconds |
| Error rate | Application Insights query | < 0.1% |
| Feature flags | App Config query | Correct values active |
| Logs | Log Analytics query | No error patterns |

---

## 11. Post-Deployment Validation

### 11.1 Post-Deployment Checks

| Check Category | Check | Method | Pass Criteria |
|---------------|-------|--------|---------------|
| **Infrastructure** | AKS node health | `kubectl get nodes` | All nodes `Ready` |
| **Infrastructure** | Pod health | `kubectl get pods -n map` | All pods `Running` |
| **Infrastructure** | Resource utilisation | Azure Monitor metrics | CPU < 70%, Memory < 80% |
| **Application** | Health endpoint | HTTP GET /health | 200 OK |
| **Application** | API availability | HTTP GET /api/v1/status | 200 OK |
| **Database** | Connectivity | SQL connection test | Successful |
| **Database** | Schema version | Query schema_migrations | Matches expected |
| **Storage** | Blob access | Upload/download test | Successful |
| **Redis** | Cache connectivity | PING command | PONG response |
| **Key Vault** | Secret access | GET secret operation | Successful |
| **DNS** | Name resolution | nslookup / dig | Correct IP returned |
| **TLS** | Certificate validity | SSL check | Valid, not expiring soon |
| **Monitoring** | Log ingestion | Log Analytics query | Recent entries present |
| **Alerts** | Alert rules active | Azure Monitor | All rules enabled |

### 11.2 Smoke Tests

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| ST-001 | Login | Authenticate user and obtain JWT token | Token received, valid claims |
| ST-002 | Create Project | Create a new migration project | Project created, ID returned |
| ST-003 | Upload Schema | Upload source database schema | Schema parsed, validation rules generated |
| ST-004 | Run Validation | Execute data validation job | Job completes, report available |
| ST-005 | Generate Report | Generate migration validation report | Report generated, downloadable |
| ST-006 | List Projects | List all projects for tenant | Projects returned, pagination works |
| ST-007 | API Rate Limit | Exceed API rate limit | 429 Too Many Requests returned |
| ST-008 | Error Handling | Submit invalid input | 400 Bad Request with error message |

### 11.3 Health Check Endpoints

| Endpoint | Method | Response | Description |
|----------|--------|----------|-------------|
| `/health` | GET | `200 OK` | Overall health status |
| `/health/ready` | GET | `200 OK` | Readiness probe (can accept traffic) |
| `/health/live` | GET | `200 OK` | Liveness probe (process is alive) |
| `/health/db` | GET | `200 OK` | Database connectivity check |
| `/health/redis` | GET | `200 OK` | Redis connectivity check |
| `/health/storage` | GET | `200 OK` | Storage connectivity check |
| `/metrics` | GET | `200 OK` | Prometheus metrics endpoint |

---

## 12. Deployment Automation & CI/CD

### 12.1 CI/CD Pipeline Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    MAP CI/CD Pipeline Architecture                  │
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  Source   │───▶│  Build   │───▶│  Test    │───▶│  Stage   │   │
│  │  Control  │    │          │    │          │    │          │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│       │                                               │           │
│       │           ┌──────────┐    ┌──────────┐       │           │
│       │           │  Deploy  │◀───│  Approve │◀──────┘           │
│       │           │  (Prod)  │    │  Gate    │                    │
│       │           └──────────┘    └──────────┘                    │
│       │                                               │           │
│       │           ┌──────────┐    ┌──────────┐       │           │
│       └──────────▶│  Deploy  │───▶│ Validate │───────┘           │
│                   │  (Dev)   │    │          │                    │
│                   └──────────┘    └──────────┘                    │
└───────────────────────────────────────────────────────────────────┘
```

### 12.2 Pipeline Stages

| Stage | Trigger | Environment | Duration | Approval |
|-------|---------|-------------|----------|----------|
| **Build** | PR merge to `develop` | Dev | 5-8 min | None |
| **Test** | Build success | Dev | 10-15 min | None |
| **Deploy (Dev)** | Test success | Dev | 5-10 min | None |
| **Deploy (Test)** | Dev validation pass | Test | 10-15 min | Auto-merge |
| **Deploy (Pilot)** | Test validation pass | Pilot | 15-20 min | Manual gate |
| **Deploy (Prod)** | Pilot validation pass | Production | 20-30 min | Manual gate + approval |

### 12.3 Approval Gates

| Gate | Environment | Approvers | Criteria |
|------|-------------|-----------|----------|
| **Gate 1** | Pilot | Engineering Lead, CSE | All tests pass, no P0 bugs |
| **Gate 2** | Production | VP Engineering, Head of Support | Pilot success confirmed, rollback tested |
| **Gate 3** | Emergency | On-call Engineering Lead | Incident declared, impact assessed |

### 12.4 Deployment Strategies

#### 12.4.1 Blue-Green Deployment

| Aspect | Blue (Current) | Green (New) |
|--------|----------------|-------------|
| **Traffic** | 100% production traffic | 0% (idle) |
| **Purpose** | Serve current version | Validate new version |
| **Validation** | N/A | Smoke tests, health checks |
| **Switch** | Traffic shifted via APIM/AKS | Becomes new blue |
| **Rollback** | Shift traffic back to blue | Discard green |

#### 12.4.2 Canary Deployment

| Phase | Duration | Traffic % (Current) | Traffic % (Canary) | Validation |
|-------|----------|---------------------|---------------------|------------|
| 1 | 15 min | 95% | 5% | Error rate, latency |
| 2 | 30 min | 80% | 20% | Performance metrics |
| 3 | 60 min | 50% | 50% | Full validation |
| 4 | 15 min | 0% | 100% | Health check confirmation |

#### 12.4.3 Feature Flags

| Phase | Flag State | Traffic | Validation |
|-------|-----------|---------|------------|
| 1 | Flag OFF (default) | 100% current behaviour | Baseline metrics |
| 2 | Flag ON (internal) | Internal users only | Internal testing |
| 3 | Flag ON (10% rollout) | 10% of tenants | Error rate monitoring |
| 4 | Flag ON (50% rollout) | 50% of tenants | Performance monitoring |
| 5 | Flag ON (100%) | All tenants | Full validation |

---

## 13. Best Practices

### 13.1 Blue-Green Deployment Best Practices

| Practice | Rationale |
|----------|-----------|
| Maintain identical infrastructure for blue and green | Ensures parity, eliminates drift |
| Use traffic splitting at load balancer layer | Zero-downtime switch |
| Monitor green before switching traffic | Catch issues early |
| Keep blue environment for rollback | Immediate recovery capability |
| Automate blue-green switch | Reduce human error |

### 13.2 Canary Deployment Best Practices

| Practice | Rationale |
|----------|-----------|
| Start with small traffic percentage | Minimise blast radius |
| Monitor error rate and latency continuously | Detect issues before full rollout |
| Use automated rollback on threshold breach | Fast recovery |
| Gradually increase traffic percentage | Controlled exposure |
| Maintain rollback capability throughout | Safety net |

### 13.3 Feature Flag Best Practices

| Practice | Rationale |
|----------|-----------|
| Keep flags small and focused | Reduce complexity |
| Document every flag with owner and expiry | Accountability |
| Clean up flags after full rollout | Reduce technical debt |
| Use flag-specific monitoring | Track flag impact |
| Never expose flag logic in customer-facing errors | Security and UX |

### 13.4 General Deployment Best Practices

| Practice | Rationale |
|----------|-----------|
| Deploy during low-traffic windows | Minimise customer impact |
| Use Infrastructure as Code exclusively | Consistency and repeatability |
| Run full test suite before production deploy | Quality gate |
| Maintain deployment runbooks | Operational consistency |
| Communicate deployment schedule to stakeholders | Coordination |
| Tag all resources for cost allocation | Financial accountability |
| Use immutable infrastructure | Eliminate configuration drift |
| Implement comprehensive logging | Debugging and audit |
| Use least-privilege service principals | Security |
| Rotate secrets regularly | Security compliance |

---

## 14. References

| Reference | Location | Description |
|-----------|----------|-------------|
| MAP Architecture Document | `03_Architecture_Document.md` | System architecture overview |
| MAP Operations Runbook | `07_Operations_Runbook.md` | Day-2 operations procedures |
| MAP Security Architecture | `10_Security_Architecture.md` | Security controls and compliance |
| Azure Well-Architected Framework | Microsoft Docs | Azure best practices |
| AKS Production Best Practices | Microsoft Docs | Kubernetes on Azure guidance |
| Azure Bicep Documentation | Microsoft Docs | IaC language reference |
| Terraform Azure Provider Docs | HashiCorp Docs | Terraform Azure provider |
| MAP CI/CD Pipeline Config | `/pipelines/` repository | Pipeline YAML definitions |

---

## 15. Appendices

### Appendix A: Deployment Model Comparison Matrix

| Feature | Cloud (SaaS) | Customer-Managed | Hosted |
|---------|--------------|------------------|--------|
| Provisioning time | < 1 hour | 5-10 days | 10-15 days |
| Customer manages infra | No | Yes | No |
| MAP manages infra | Yes | Shared | Yes |
| Data residency control | Limited | Full | Full |
| Network isolation | Logical | Physical VNet | Physical VNet |
| Compliance scope | MAP + Shared | Customer | MAP Dedicated |
| Minimum commitment | None | 12 months | 12 months |
| Cost model | Per-tenant | Infra + License | Managed fee |
| Rollback capability | MAP-managed | Shared | MAP-managed |
| Monitoring access | Shared dashboard | Full access | Shared dashboard |

### Appendix B: Environment-Specific Configuration

| Setting | Development | Testing | Pilot | Production |
|---------|-------------|---------|-------|------------|
| AKS node count | 2 | 3 | 3 | 5 |
| SQL tier | Basic | Standard | Premium | Business Critical |
| Redis tier | C0 | C1 | C2 | C4 |
| Log retention | 7 days | 30 days | 60 days | 365 days |
| Backup frequency | Weekly | Daily | Daily | Hourly |
| Geo-replication | No | No | No | Yes |
| WAF protection | No | Basic | Standard | Premium |
| DDoS protection | No | No | Standard | Standard |

### Appendix C: Rollback Decision Tree

```
Deployment Failure Detected
        │
        ▼
┌───────────────────────┐
│ Is it a DB issue?     │
└───────┬───────────────┘
        │
   ┌────┴────┐
   │         │
  Yes        No
   │         │
   ▼         ▼
┌──────────┐ ┌───────────────────────┐
│ DB       │ │ Is it an app issue?   │
│ Rollback │ └───────┬───────────────┘
│ (Step 2) │         │
└──────────┘    ┌────┴────┐
                │         │
               Yes        No
                │         │
                ▼         ▼
           ┌──────────┐ ┌──────────┐
           │ App      │ │ Config   │
           │ Rollback │ │ Rollback │
           │ (Step 1) │ │ (Step 3) │
           └──────────┘ └──────────┘
```

### Appendix D: Deployment Checklist Template

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | Pre-deployment backup created | DBA | [ ] | |
| 2 | Customer notified of deployment window | CSE | [ ] | |
| 3 | Monitoring dashboards open | DevOps | [ ] | |
| 4 | Rollback plan reviewed and ready | DevOps | [ ] | |
| 5 | Infrastructure changes applied | Platform Eng | [ ] | |
| 6 | Application deployed | DevOps | [ ] | |
| 7 | Post-deployment smoke tests pass | QA | [ ] | |
| 8 | Health checks returning healthy | DevOps | [ ] | |
| 9 | Error rate within threshold | DevOps | [ ] | |
| 10 | Customer notified of completion | CSE | [ ] | |

---

**End of Document — MAP Deployment Framework v1.0**
