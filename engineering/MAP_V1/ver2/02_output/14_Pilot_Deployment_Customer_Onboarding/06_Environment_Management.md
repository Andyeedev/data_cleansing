# MAP Environment Management

| Field | Value |
|-------|-------|
| **Document Title** | Migration Assurance Platform (MAP) — Environment Management |
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
| 0.1 | 2026-05-10 | MAP Engineering | Initial draft — environment types overview |
| 0.5 | 2026-06-01 | MAP Engineering | Added naming conventions and tagging |
| 0.8 | 2026-06-15 | MAP Engineering | Added promotion strategy and config management |
| 0.9 | 2026-06-25 | Platform Engineering | Added monitoring, cleanup, and best practices |
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
| MAP Engineering Team | Day-to-day environment operations |
| Customer Success | Environment provisioning coordination |
| Solutions Architects | Environment design and sizing |
| Support Engineering | Environment troubleshooting |
| Finance / FinOps | Cost tracking and allocation |

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Definitions & Acronyms](#2-definitions--acronyms)
3. [Dependencies](#3-dependencies)
4. [Environment Types](#4-environment-types)
5. [Environment Standards](#5-environment-standards)
6. [Promotion Strategy](#6-promotion-strategy)
7. [Configuration Management](#7-configuration-management)
8. [Data Management](#8-data-management)
9. [Monitoring](#9-monitoring)
10. [Cleanup & Teardown](#10-cleanup--teardown)
11. [Best Practices](#11-best-practices)
12. [References](#12-references)
13. [Appendices](#13-appendices)

---

## 1. Purpose & Scope

### 1.1 Purpose

This document defines the standards, processes, and operational procedures for managing MAP environments throughout their lifecycle — from development through pilot to production. It establishes consistent practices for environment provisioning, configuration, monitoring, promotion, and teardown.

### 1.2 Scope

This document covers:

- All MAP environments across development, testing, pilot, and production tiers
- Naming conventions, resource groups, and tagging standards
- Promotion strategy (Dev → Test → Pilot → Production)
- Configuration management including environment variables, secrets, and config files
- Data management for test, pilot, and production data
- Monitoring, health, and cost tracking
- Environment cleanup and resource deallocation
- Infrastructure as Code standards and consistency requirements

### 1.3 Out of Scope

- Customer-managed environment internals (covered in Deployment Framework)
- Application code repository management
- CI/CD pipeline implementation (covered in Deployment Framework)
- Individual cloud provider account management

### 1.4 Audience

| Role | Use This Document For |
|------|----------------------|
| DevOps Engineers | Environment provisioning and lifecycle management |
| Platform Engineers | Infrastructure standards and IaC maintenance |
| Customer Success Managers | Pilot environment coordination |
| Support Engineers | Environment troubleshooting and status checks |
| Product Managers | Understanding environment availability |
| Finance / FinOps | Cost tracking and budgeting per environment |

---

## 2. Definitions & Acronyms

| Term | Definition |
|------|-----------|
| MAP | Migration Assurance Platform |
| IaC | Infrastructure as Code |
| RG | Resource Group |
| VNet | Virtual Network |
| AKS | Azure Kubernetes Service |
| SLA | Service Level Agreement |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
| RBAC | Role-Based Access Control |
| CSE | Customer Success Engineer |
| FinOps | Financial Operations |
| CMDB | Configuration Management Database |
| DR | Disaster Recovery |
| HA | High Availability |
| PIR | Post-Incident Review |
| WBS | Work Breakdown Structure |

---

## 3. Dependencies

### 3.1 Upstream Dependencies

| Dependency | Owner | Required Before |
|------------|-------|-----------------|
| Azure Subscription provisioning | Cloud Operations | Any environment creation |
| Azure AD / Entra ID tenant | Identity Engineering | Environment access configuration |
| Network design document | Network Engineering | VNet and subnet provisioning |
| Bicep / Terraform templates | Platform Engineering | Environment provisioning |
| Secrets and certificates | Security Engineering | Production environment activation |
| Customer contract (pilot) | Sales / Legal | Pilot environment provisioning |
| Budget approval (production) | Finance | Production environment provisioning |

### 3.2 Downstream Dependencies

| Consumer | Depends On This Document |
|----------|--------------------------|
| Deployment Framework (05) | Environment types and standards |
| Pilot Deployment Runbook | Environment promotion steps |
| Cost Management Reports | Resource tagging and naming |
| SLA Monitoring | Environment health definitions |
| Incident Response Playbook | Environment topology |

---

## 4. Environment Types

MAP maintains four primary environment types, each serving a distinct purpose in the software delivery lifecycle.

```
┌───────────────────────────────────────────────────────────────────┐
│                    MAP Environment Lifecycle                       │
│                                                                   │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │   DEV    │──▶│   TEST   │──▶│  PILOT   │──▶│   PROD   │     │
│  │          │   │          │   │          │   │          │     │
│  │ Internal │   │ QA Team  │   │ Customer │   │ All      │     │
│  │ use only │   │ validation│   │ validation│   │ users    │     │
│  │          │   │          │   │          │   │          │     │
│  │ Fast     │   │ Stable   │   │ Realistic│   │ Highest  │     │
│  │ iteration│   │ builds   │   │ data     │   │ reliability│   │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘     │
│                                                                   │
│  Provisioning:    Provisioning:   Provisioning:   Provisioning:   │
│  On-demand,       Semi-auto,      Manual,         Full IaC,      │
│  ephemeral        IaC-based       CSE-managed     audited        │
└───────────────────────────────────────────────────────────────────┘
```

### 4.1 Development (Dev)

| Attribute | Specification |
|-----------|--------------|
| **Purpose** | Active feature development, integration testing |
| **Users** | MAP engineering team (internal) |
| **Provisioning** | On-demand, ephemeral, feature-branch based |
| **Data** | Synthetic / seed data only |
| **Uptime** | Business hours (auto-shutdown outside hours) |
| **SLA** | None (best-effort) |
| **Refresh cycle** | On-demand, typically daily |
| **Cost target** | < $500/month |
| **Access** | Engineering team only |

### 4.2 Testing (Test)

| Attribute | Specification |
|-----------|--------------|
| **Purpose** | QA validation, regression testing, performance testing |
| **Users** | QA engineers, engineering leads |
| **Provisioning** | Semi-automated via CI/CD pipeline |
| **Data** | Representative test datasets |
| **Uptime** | 24/7 during test cycles, auto-shutdown otherwise |
| **SLA** | None (best-effort) |
| **Refresh cycle** | Weekly (or per test cycle) |
| **Cost target** | < $1,500/month |
| **Access** | QA team + engineering leads |

### 4.3 Pilot

| Attribute | Specification |
|-----------|--------------|
| **Purpose** | Customer validation, early-adopter onboarding |
| **Users** | Customer users + MAP CSE + engineering support |
| **Provisioning** | Manual with IaC templates, CSE-managed |
| **Data** | Customer-provided data (anonymised where required) |
| **Uptime** | 99.5% during pilot period |
| **SLA** | 99.5% availability, 24-hour response |
| **Refresh cycle** | Per customer pilot timeline (typically 4-8 weeks) |
| **Cost target** | < $5,000/month per pilot customer |
| **Access** | Customer users + MAP CSE + engineering support |

### 4.4 Production (Prod)

| Attribute | Specification |
|-----------|--------------|
| **Purpose** | Live customer workloads, SLA-bound operations |
| **Users** | All MAP customers (multi-tenant or dedicated) |
| **Provisioning** | Fully automated via IaC and CI/CD |
| **Data** | Live customer data with full protection |
| **Uptime** | 99.95% availability |
| **SLA** | 99.95% availability, 1-hour response (P0), 4-hour (P1) |
| **Refresh cycle** | Continuous (automated deployments) |
| **Cost target** | Per customer contract and usage |
| **Access** | Full RBAC, audit logging enabled |

### 4.5 Environment Comparison Matrix

| Dimension | Dev | Test | Pilot | Production |
|-----------|-----|------|-------|------------|
| **Node count (AKS)** | 2 | 3 | 3 | 5+ |
| **SQL tier** | Basic | Standard | Premium | Business Critical |
| **Redis tier** | C0 | C1 | C2 | C4+ |
| **Storage** | 50 GB LRS | 100 GB LRS | 200 GB GRS | 500 GB+ GRS |
| **Backup** | None | Weekly | Daily | Hourly |
| **Geo-replication** | No | No | No | Yes |
| **WAF** | None | Basic | Standard | Premium |
| **DDoS** | None | None | Standard | Standard |
| **Log retention** | 7 days | 30 days | 60 days | 365 days |
| **Monitoring** | Basic | Standard | Enhanced | Full |
| **Alerting** | Email only | Email + Teams | Email + Teams + PagerDuty | Full on-call |
| **Access control** | Team-based | Team-based | Customer-scoped | Full RBAC |
| **Compliance** | None | Basic | SOC 2 scope | SOC 2, ISO 27001 |

---

## 5. Environment Standards

### 5.1 Naming Conventions

#### 5.1.1 Resource Naming Pattern

All MAP resources follow a consistent naming pattern:

```
map-{env}-{component}-{instance}
```

| Component | Pattern | Example |
|-----------|---------|---------|
| **Resource Group** | `rg-map-{env}-{region}` | `rg-map-prod-eastus2` |
| **AKS Cluster** | `map-{env}-aks-{instance}` | `map-prod-aks-001` |
| **SQL Server** | `map-{env}-sql-{instance}` | `map-pilot-sql-001` |
| **SQL Database** | `map-{env}-{tenant}-db` | `map-pilot-customer1-db` |
| **Storage Account** | `map{env}stor{instance}` | `mapprodstor001` |
| **Redis Cache** | `map-{env}-redis-{instance}` | `map-prod-redis-001` |
| **Key Vault** | `map-{env}-kv-{instance}` | `map-prod-kv-001` |
| **App Config** | `map-{env}-ac-{instance}` | `map-pilot-ac-001` |
| **Log Analytics** | `map-{env}-law-{instance}` | `map-prod-law-001` |
| **Container Registry** | `map{env}acr{instance}` | `mapprodacr001` |
| **Virtual Network** | `map-{env}-vnet-{instance}` | `map-pilot-vnet-001` |
| **NSG** | `map-{env}-nsg-{component}` | `map-prod-nsg-aks` |
| **Public IP** | `map-{env}-pip-{component}` | `map-prod-pip-apim` |
| **DNS Zone** | `map-{env}.{domain}` | `map-prod.mapplatform.com` |

#### 5.1.2 Environment Codes

| Environment | Code | Azure Region Suffix |
|-------------|------|---------------------|
| Development | `dev` | `eastus2` |
| Testing | `test` | `eastus2` |
| Pilot | `pilot` | Per customer requirement |
| Production | `prod` | `eastus2`, `westeurope` (multi-region) |

### 5.2 Resource Groups

| Environment | Resource Group Pattern | Contains |
|-------------|----------------------|----------|
| Dev | `rg-map-dev-eastus2` | All dev resources (ephemeral) |
| Test | `rg-map-test-eastus2` | All test resources |
| Pilot (shared) | `rg-map-pilot-eastus2` | Shared pilot infrastructure |
| Pilot (per-customer) | `rg-map-pilot-{customer}-eastus2` | Customer-specific pilot resources |
| Production | `rg-map-prod-eastus2` | Production resources (primary) |
| Production (DR) | `rg-map-prod-westeurope` | DR resources (secondary) |

#### 5.2.1 Resource Group Naming Rules

| Rule | Description | Example |
|------|-------------|---------|
| **Lowercase only** | All names in lowercase | `rg-map-prod-eastus2` |
| **Hyphens as separators** | Use hyphens, not underscores | `rg-map-prod-eastus2` |
| **No special characters** | Only alphanumeric and hyphens | `rg-map-pilot-customer1` |
| **Max 90 characters** | Azure resource group name limit | Check length |
| **Region suffix** | Always include region code | `eastus2`, `westeurope` |
| **Consistent prefix** | Always start with `rg-map-` | `rg-map-{env}` |

### 5.3 Tagging Standards

All MAP resources MUST include the following mandatory tags:

| Tag | Description | Allowed Values | Example |
|-----|------------|----------------|---------|
| `environment` | Environment type | `dev`, `test`, `pilot`, `prod` | `prod` |
| `cost-center` | Cost allocation code | Finance-assigned code | `CC-MAP-001` |
| `managed-by` | Team responsible | `map-engineering`, `platform-eng`, `map-support` | `map-engineering` |
| `application` | Application name | Always `map` | `map` |
| `customer` | Customer identifier (if applicable) | Customer code or `internal` | `customer1` |
| `pilot-id` | Pilot identifier (if applicable) | Pilot project code | `PILOT-2026-003` |
| `owner` | Individual responsible | Email or team alias | `engineering@map.com` |
| `expiry` | Resource expiry date | ISO 8601 date or `permanent` | `2026-09-30` |
| `data-classification` | Data sensitivity level | `internal`, `confidential`, `restricted` | `confidential` |
| `backup-policy` | Backup requirement | `none`, `daily`, `hourly` | `hourly` |

#### 5.3.1 Tagging Enforcement

| Mechanism | Description |
|-----------|------------|
| **Azure Policy** | Deny resource creation without mandatory tags |
| **Bicep/ARM** | Tags enforced in IaC templates |
| **Terraform** | Tag variables required in all resource definitions |
| **Cost Management** | Tags used for cost allocation and reporting |
| **Compliance Audit** | Tag compliance checked quarterly |

---

## 6. Promotion Strategy

### 6.1 Promotion Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                     MAP Promotion Strategy                         │
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │   DEV    │───▶│   TEST   │───▶│  PILOT   │───▶│   PROD   │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│       │               │               │               │           │
│       ▼               ▼               ▼               ▼           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ Feature  │    │ QA       │    │ Customer │    │ Full     │   │
│  │ complete │    │ sign-off │    │ sign-off │    │ release  │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│       │               │               │               │           │
│       ▼               ▼               ▼               ▼           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ Unit +   │    │ Regression│    │ Pilot    │    │ Full     │   │
│  │ Integr.  │    │ + Perf   │    │ validation│   │ validation│  │
│  │ tests    │    │ tests    │    │ tests    │    │ + SLA    │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

### 6.2 Dev → Test Promotion

| Gate | Criteria | Owner | Validation |
|------|----------|-------|------------|
| Code complete | All features for sprint merged | Engineering Lead | Code review approved |
| Unit tests pass | 100% unit test pass rate | CI/CD pipeline | Automated |
| Integration tests pass | All integration tests pass | CI/CD pipeline | Automated |
| No P0/P1 bugs | No open P0 or P1 bugs | QA Lead | Bug tracker check |
| Build artefacts | Docker images built and tagged | CI/CD pipeline | Automated |
| Infrastructure | Test environment provisioned / updated | Platform Engineering | IaC applied |

### 6.3 Test → Pilot Promotion

| Gate | Criteria | Owner | Validation |
|------|----------|-------|------------|
| QA sign-off | Full regression suite passes | QA Lead | Test report |
| Performance test | p99 latency < 2 seconds, error rate < 0.1% | QA Lead | Performance report |
| Security scan | No critical/high vulnerabilities | Security Engineering | Scan report |
| Documentation | Customer-facing docs updated | Technical Writing | Doc review |
| Pilot readiness | Pilot environment provisioned | CSE + Platform Eng | Environment check |
| CSE confirmation | CSE confirms pilot customer ready | Customer Success | Email confirmation |

### 6.4 Pilot → Production Promotion

| Gate | Criteria | Owner | Validation |
|------|----------|-------|------------|
| Pilot success | Pilot customer confirms satisfaction | CSE | Pilot feedback report |
| No critical issues | No unresolved P0/P1 issues during pilot | Support Engineering | Incident tracker |
| Rollback tested | Rollback procedure validated in pilot | DevOps | Rollback test report |
| Monitoring validated | All monitoring and alerting confirmed | Platform Engineering | Dashboard review |
| SLA readiness | SLA monitoring and reporting confirmed | Operations | SLA setup verified |
| VP approval | VP Engineering approves production release | VP Engineering | Approval email |
| Communication | Customer communication plan prepared | Marketing / CSE | Communication plan |

### 6.5 Promotion Checklist

| # | Dev → Test | Test → Pilot | Pilot → Prod |
|---|-----------|-------------|-------------|
| 1 | Code review approved | QA sign-off obtained | Pilot customer satisfied |
| 2 | Unit tests passing | Performance tests passing | No critical bugs open |
| 3 | Integration tests passing | Security scan clear | Rollback tested |
| 4 | No P0/P1 bugs | Documentation updated | Monitoring validated |
| 5 | Build artefacts created | Pilot environment ready | SLA monitoring active |
| 6 | Test environment updated | CSE confirmed ready | VP approval received |
| 7 | — | Pilot data prepared | Customer communication sent |
| 8 | — | — | Production environment ready |

---

## 7. Configuration Management

### 7.1 Environment Variables

Environment variables are the primary mechanism for injecting environment-specific configuration into MAP services.

#### 7.1.1 Environment Variable Categories

| Category | Prefix | Description | Example |
|----------|--------|-------------|---------|
| **Infrastructure** | `MAP_INFRA_` | Infrastructure endpoints | `MAP_INFRA_DB_SERVER` |
| **Application** | `MAP_APP_` | Application settings | `MAP_APP_LOG_LEVEL` |
| **Feature Flags** | `MAP_FF_` | Feature flag overrides | `MAP_FF_ENABLE_V2` |
| **Security** | `MAP_SEC_` | Security configuration | `MAP_SEC_TOKEN_EXPIRY` |
| **Integration** | `MAP_INT_` | External integration settings | `MAP_INT_STORAGE_ACCOUNT` |

#### 7.1.2 Environment Variable Matrix

| Variable | Dev | Test | Pilot | Production |
|----------|-----|------|-------|------------|
| `MAP_ENVIRONMENT` | `development` | `testing` | `pilot` | `production` |
| `MAP_LOG_LEVEL` | `Debug` | `Information` | `Information` | `Warning` |
| `MAP_DB_CONNECTION` | Dev DB string | Test DB string | Pilot DB string | Prod DB string |
| `MAP_REDIS_CONNECTION` | Dev Redis | Test Redis | Pilot Redis | Prod Redis |
| `MAP_STORAGE_CONNECTION` | Dev Storage | Test Storage | Pilot Storage | Prod Storage |
| `MAP_KEY_VAULT_URI` | Dev KV | Test KV | Pilot KV | Prod KV |
| `MAP_APP_CONFIG_URI` | Dev AC | Test AC | Pilot AC | Prod AC |
| `MAP_CORS_ORIGINS` | `localhost:*` | `test.*.map.com` | `pilot.*.map.com` | `app.map.com` |
| `MAP_RATE_LIMIT` | `100` | `500` | `1000` | `5000` |
| `MAP_BACKUP_ENABLED` | `false` | `false` | `true` | `true` |

### 7.2 Secrets Management

All secrets are stored in Azure Key Vault and injected into services at runtime.

#### 7.2.1 Secret Categories

| Secret Type | Key Vault Path | Rotation Policy | Access |
|-------------|---------------|-----------------|--------|
| **Database credentials** | `secrets/db-{env}-admin` | Every 90 days | Service principal only |
| **API keys** | `secrets/api-{service}-{env}` | Every 180 days | Service principal only |
| **TLS certificates** | `certs/{env}-{domain}` | Before expiry (auto-renew) | Service principal only |
| **Encryption keys** | `keys/{env}-{purpose}` | Every 365 days | Key Vault admin only |
| **Connection strings** | `conn/{env}-{service}` | Every 90 days | Service principal only |
| **Customer tokens** | `tokens/{env}-{customer}` | Per customer request | Customer + CSE only |

#### 7.2.2 Secret Access Pattern

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Application   │────▶│  Managed        │────▶│  Azure Key      │
│   Pod (AKS)     │     │  Identity       │     │  Vault          │
│                 │     │  (Workload ID)  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │            Secret Injection                   │
        ◀──────────────────────────────────────────────┘
        │
        ▼
┌─────────────────┐
│  Environment    │
│  Variables      │
│  Populated      │
└─────────────────┘
```

### 7.3 Configuration Files

| File Type | Location | Purpose | Refresh |
|-----------|----------|---------|---------|
| **App Configuration** | Azure App Config | Feature flags, settings | Real-time |
| **Config Maps** | Kubernetes ConfigMaps | Non-secret pod config | On pod restart |
| **Secrets** | Kubernetes Secrets | Non-sensitive runtime secrets | On pod restart |
| **Helm Values** | Helm chart values files | Deployment-time configuration | On deployment |
| **Bicep Parameters** | `.bicepparam` files | Infrastructure configuration | On IaC deployment |

### 7.4 Configuration Drift Detection

| Detection Method | Frequency | Response |
|-----------------|-----------|----------|
| Azure Policy compliance | Continuous | Auto-remediate or alert |
| IaC drift scan (Terraform plan) | Daily | Alert on drift detected |
| Kubernetes config audit | Weekly | Alert + remediation plan |
| Secret rotation audit | Monthly | Rotate overdue secrets |
| Tag compliance audit | Monthly | Re-tag non-compliant resources |

---

## 8. Data Management

### 8.1 Test Data

| Aspect | Standard |
|--------|----------|
| **Source** | Synthetic data generators, anonymised production copies |
| **Format** | Mirrors production schema exactly |
| **Volume** | 10-20% of production data volume |
| **Retention** | Refreshed with each test cycle |
| **Protection** | No real customer PII; synthetic only |
| **Generation** | Automated scripts in `/data/generators/` |
| **Storage** | Test environment blob storage (LRS) |

### 8.2 Pilot Data

| Aspect | Standard |
|--------|----------|
| **Source** | Customer-provided data (anonymised where required) |
| **Format** | Customer schema, mapped to MAP format |
| **Volume** | Representative of customer production (10-50%) |
| **Retention** | Duration of pilot period (4-8 weeks) |
| **Protection** | Anonymised PII; customer approval required |
| **Handling** | Isolated storage; customer-specific container |
| **Deletion** | Deleted within 30 days of pilot completion |
| **Storage** | Pilot environment blob storage (GRS) |

### 8.3 Production Data

| Aspect | Standard |
|--------|----------|
| **Source** | Customer live data via MAP migration tools |
| **Format** | Customer schema, validated by MAP |
| **Volume** | Full production volume |
| **Retention** | Per customer contract (typically 12-36 months) |
| **Protection** | Full encryption at rest and in transit; RBAC |
| **Backup** | Hourly snapshots, daily full backups |
| **Geo-replication** | GRS with automatic failover |
| **Disaster Recovery** | RPO < 1 hour, RTO < 4 hours |
| **Storage** | Production SQL + blob storage (GRS) |

### 8.4 Data Management Matrix

| Dimension | Test | Pilot | Production |
|-----------|------|-------|------------|
| **Data classification** | Internal | Confidential | Restricted |
| **Encryption at rest** | Optional | AES-256 | AES-256 + HSM |
| **Encryption in transit** | TLS 1.2 | TLS 1.3 | TLS 1.3 |
| **Access control** | Team-based | Customer-scoped | Full RBAC + MFA |
| **Audit logging** | Basic | Enhanced | Full (immutable) |
| **Backup frequency** | Weekly | Daily | Hourly |
| **Retention period** | 30 days | Pilot duration + 30 days | Per contract |
| **DR capability** | None | Manual restore | Auto-failover |
| **Data mask / anonymise** | N/A (synthetic) | Anonymise PII | Customer manages |
| **Deletion policy** | On env teardown | Within 30 days of pilot end | Per contract |

### 8.5 Data Backup and Recovery

#### 8.5.1 Backup Schedule

| Environment | Database Backup | Blob Backup | Config Backup | Retention |
|-------------|----------------|-------------|----------------|-----------|
| Dev | None | None | Git | N/A |
| Test | Weekly full | None | Git | 30 days |
| Pilot | Daily full, 6-hourly differential | Daily snapshot | Git + App Config | Pilot + 30 days |
| Production | Hourly full, 15-min transaction log | GRS (automatic) | Git + App Config | Per contract |

#### 8.5.2 Recovery Procedures

| Scenario | Procedure | RTO | RPO |
|----------|-----------|-----|-----|
| Accidental data deletion (Dev/Test) | Re-provision environment from IaC | 30 min | N/A |
| Accidental data deletion (Pilot) | Restore from daily backup | 2 hours | 24 hours |
| Accidental data deletion (Prod) | Point-in-time recovery | 1 hour | 1 hour |
| Database corruption (Prod) | Failover to geo-replica, then restore | 4 hours | 1 hour |
| Full environment loss | Re-provision from IaC, restore data from backup | 8 hours | 1 hour |

---

## 9. Monitoring

### 9.1 Environment Health Monitoring

#### 9.1.1 Health Metrics

| Metric | Source | Threshold (Dev/Test) | Threshold (Pilot) | Threshold (Prod) |
|--------|--------|---------------------|-------------------|------------------|
| **AKS node status** | Azure Monitor | All Ready | All Ready | All Ready |
| **Pod restart count** | Kubernetes API | < 5/hour | < 3/hour | < 1/hour |
| **CPU utilisation** | Azure Monitor | < 80% | < 70% | < 65% |
| **Memory utilisation** | Azure Monitor | < 85% | < 80% | < 75% |
| **Disk usage** | Azure Monitor | < 80% | < 75% | < 70% |
| **API response time (p95)** | Application Insights | < 3 seconds | < 2 seconds | < 1 second |
| **API error rate** | Application Insights | < 2% | < 1% | < 0.1% |
| **Database connections** | Azure SQL metrics | < 80% pool | < 70% pool | < 60% pool |
| **Redis memory** | Azure Redis metrics | < 80% | < 75% | < 70% |

#### 9.1.2 Health Dashboard Layout

```
┌───────────────────────────────────────────────────────────────────┐
│                    MAP Environment Health Dashboard                │
│                                                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │   Environment: PROD  │  │   Last Updated:      │               │
│  │   Status: HEALTHY    │  │   2026-07-01 14:30   │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Infrastructure Health                                      │ │
│  │  AKS Nodes: 5/5 Ready  ████░░░░░░ 100%                      │ │
│  │  Pods: 12/12 Running    ██████████ 100%                      │ │
│  │  CPU: 45%               ████░░░░░░ 45%                       │ │
│  │  Memory: 62%            ██████░░░░ 62%                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Application Health                                         │ │
│  │  API Status: 200 OK     ████░░░░░░ HEALTHY                  │ │
│  │  p95 Latency: 342ms     ████░░░░░░ GOOD                     │ │
│  │  Error Rate: 0.02%      ████░░░░░░ GOOD                     │ │
│  │  Request Rate: 1.2k/min ████░░░░░░ NORMAL                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Data Health                                                │ │
│  │  DB Connections: 45/200  ████░░░░░░ GOOD                    │ │
│  │  DB CPU: 23%            ████░░░░░░ GOOD                     │ │
│  │  Redis Memory: 38%      ████░░░░░░ GOOD                     │ │
│  │  Storage: 342 GB/500 GB ██████░░░░ 68%                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### 9.2 Resource Utilisation Monitoring

| Resource | Metric | Tool | Alert Threshold |
|----------|--------|------|-----------------|
| **AKS** | Node count, pod count, CPU, memory | Azure Monitor + Prometheus | Below/above thresholds |
| **SQL** | DTU/vCore usage, connections, deadlocks | Azure SQL Analytics | Above threshold |
| **Redis** | Memory, cache hit rate, connections | Azure Redis metrics | Below/above thresholds |
| **Storage** | Capacity, ingress/egress, latency | Azure Storage metrics | Above threshold |
| **Network** | Bandwidth, packet drops, latency | Azure Network Watcher | Above threshold |
| **Key Vault** | Throttling, latency | Azure Key Vault metrics | Above threshold |

### 9.3 Cost Tracking

#### 9.3.1 Cost Allocation Model

| Cost Category | Allocation Method | Tag |
|--------------|-------------------|-----|
| **Compute (AKS)** | Per environment | `environment` |
| **Database (SQL)** | Per environment + per tenant | `environment`, `customer` |
| **Storage (Blob)** | Per environment + per tenant | `environment`, `customer` |
| **Networking** | Per environment | `environment` |
| **Monitoring** | Per environment | `environment` |
| **Security (Key Vault)** | Per environment | `environment` |
| **Pilot infrastructure** | Per customer pilot | `pilot-id`, `customer` |

#### 9.3.2 Cost Budgets

| Environment | Monthly Budget | Alert Threshold | Escalation |
|-------------|---------------|-----------------|------------|
| Dev | $500 | 80% ($400) | Engineering Lead |
| Test | $1,500 | 80% ($1,200) | QA Lead |
| Pilot (shared) | $3,000 | 80% ($2,400) | CSE Manager |
| Pilot (per-customer) | $5,000 | 80% ($4,000) | CSE |
| Production | Per contract | 70% of budget | VP Engineering |

#### 9.3.3 Cost Reporting

| Report | Frequency | Audience | Content |
|--------|-----------|----------|---------|
| **Daily cost snapshot** | Daily | FinOps team | All environments, current spend |
| **Weekly cost summary** | Weekly | Engineering leads | Environment-level breakdown |
| **Monthly cost report** | Monthly | VP Engineering, Finance | Full cost analysis, trends |
| **Pilot cost report** | Per pilot completion | CSE, Sales | Pilot-specific cost breakdown |
| **Cost optimisation review** | Quarterly | FinOps, Platform Eng | Optimisation recommendations |

---

## 10. Cleanup & Teardown

### 10.1 Environment Teardown Triggers

| Trigger | Environment | Timeline | Owner |
|---------|-------------|----------|-------|
| **Feature branch merged** | Dev (ephemeral) | Immediate | Developer |
| **Sprint complete** | Dev (shared) | End of sprint | Engineering Lead |
| **Test cycle complete** | Test | 7 days after cycle | QA Lead |
| **Pilot completed** | Pilot | 30 days after completion | CSE |
| **Pilot cancelled** | Pilot | 7 days after cancellation | CSE |
| **Budget exceeded** | Any | Immediate escalation | FinOps |
| **Inactivity (>14 days)** | Dev/Test | Auto-shutdown after 14 days | Platform Engineering |

### 10.2 Teardown Process

#### 10.2.1 Pre-Teardown Checklist

| # | Task | Owner | Validation |
|---|------|-------|------------|
| 1 | Confirm teardown trigger is valid | Requestor | Trigger documented |
| 2 | Check for active workloads | Platform Engineering | No running jobs |
| 3 | Export any required data | Data Engineering | Data exported to archive |
| 4 | Notify affected users | Requestor | Notification sent |
| 5 | Create final backup (if required) | DBA | Backup completed |
| 6 | Verify no downstream dependencies | Platform Engineering | Dependencies removed |
| 7 | Obtain approval (Production only) | VP Engineering | Approval received |

#### 10.2.2 Teardown Steps

| Step | Action | Validation | Rollback |
|------|--------|------------|----------|
| 1 | Scale AKS to 0 | No pods running | Re-scale nodes |
| 2 | Stop SQL database | Database paused | Resume database |
| 3 | Remove VNet peering (if applicable) | Peering removed | Re-create peering |
| 4 | Delete AKS cluster | Cluster removed | Re-provision from IaC |
| 5 | Delete SQL server and database | Resources removed | Restore from backup |
| 6 | Delete storage accounts | Storage removed | Restore from backup |
| 7 | Delete Redis cache | Cache removed | Re-provision |
| 8 | Delete Key Vault | Vault removed | Re-provision |
| 9 | Delete App Configuration | Config removed | Re-provision from Git |
| 10 | Delete resource group | RG removed | Re-provision all from IaC |
| 11 | Remove DNS records | DNS cleaned | Re-add records |
| 12 | Remove monitoring resources | Dashboards removed | Re-provision from IaC |

### 10.3 Resource Deallocation

| Resource | Deallocation Method | Retention After |
|----------|-------------------|-----------------|
| **AKS Nodes** | Scale to 0 or delete cluster | Immediate deallocation |
| **SQL Database** | Pause (serverless) or delete | Pause: retained; Delete: 30 days (soft delete) |
| **Storage** | Delete container or account | Soft delete: 14 days; Permanent: immediate |
| **Redis** | Delete cache instance | Immediate deallocation |
| **Key Vault** | Purge protection: retain 90 days | 90 days (soft delete) |
| **Public IPs** | Release IP address | Immediate deallocation |
| **DNS Zones** | Delete zone | Immediate (records lost) |

### 10.4 Cleanup Automation

```yaml
# Example: Azure DevOps Pipeline for Environment Cleanup
trigger: none  # Manual trigger only

parameters:
  - name: environment
    displayName: 'Environment to clean up'
    type: string
    values:
      - dev
      - test
      - pilot
  - name: confirm
    displayName: 'Type environment name to confirm'
    type: string

variables:
  - group: 'map-$(environment)'

stages:
  - stage: Validate
    displayName: 'Validate Cleanup Request'
    jobs:
      - job: Validate
        steps:
          - script: |
              if [ "${{ parameters.confirm }}" != "${{ parameters.environment }}" ]; then
                echo "##vso[task.logissue type=error]Confirmation does not match environment name"
                exit 1
              fi
            displayName: 'Validate confirmation'

  - stage: Backup
    displayName: 'Final Backup'
    dependsOn: Validate
    jobs:
      - job: BackupData
        steps:
          - task: AzureCLI@2
            inputs:
              azureSubscription: 'map-azure-connection'
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                az sql db export --name "map-${{ parameters.environment }}" \
                  --resource-group "rg-map-${{ parameters.environment }}" \
                  --storage-key-type "StorageAccessKey" \
                  --storage-key $(backupStorageKey) \
                  --storage-uri "https://backupstorage.blob.core.windows.net/final/"

  - stage: Teardown
    displayName: 'Environment Teardown'
    dependsOn: Backup
    environment: 'map-cleanup-${{ parameters.environment }}'
    jobs:
      - deployment: Cleanup
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: 'map-azure-connection'
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      az group delete --name "rg-map-${{ parameters.environment }}" --yes --no-wait
```

---

## 11. Best Practices

### 11.1 Infrastructure as Code

| Practice | Rationale | Implementation |
|----------|-----------|----------------|
| **All infrastructure in IaC** | Consistency, repeatability, audit trail | Bicep/Terraform for all resources |
| **No manual changes** | Prevents drift | Azure Policy deny manual edits |
| **Version-controlled IaC** | Change tracking, rollback | Git for all infrastructure code |
| **Peer review for IaC changes** | Quality gate | PR reviews required |
| **Automated IaC testing** | Validate before deploy | `what-if` / `plan` before apply |
| **Module reuse** | Consistency across environments | Shared module library |
| **Parameterised templates** | Environment flexibility | Separate parameter files per env |

### 11.2 Consistency

| Practice | Rationale | Implementation |
|----------|-----------|----------------|
| **Same IaC templates across environments** | Eliminate configuration drift | Shared templates, different parameters |
| **Same monitoring stack everywhere** | Unified observability | Consistent dashboards and alerts |
| **Same access patterns** | Security and operational consistency | RBAC templates per environment |
| **Same deployment process** | Reduce operational risk | Single CI/CD pipeline with stages |
| **Same naming conventions** | Resource discoverability | Enforced via naming validator |

### 11.3 Isolation

| Practice | Rationale | Implementation |
|----------|-----------|----------------|
| **Separate Azure subscriptions per environment** | Blast radius isolation | Dedicated subs for prod/pilot |
| **Separate resource groups** | Logical isolation | RG per environment |
| **Separate VNets** | Network isolation | VNet per environment |
| **Separate service principals** | Access isolation | SP per environment |
| **Separate Key Vaults** | Secret isolation | KV per environment |
| **Separate monitoring workspaces** | Log isolation | Log Analytics per environment |

### 11.4 Lifecycle Management

| Practice | Rationale | Implementation |
|----------|-----------|----------------|
| **Automated shutdown for non-production** | Cost optimisation | Auto-shutdown Dev/Test outside hours |
| **Expiry tags on ephemeral resources** | Prevent resource accumulation | `expiry` tag enforced |
| **Regular environment audits** | Detect unused resources | Monthly audit pipeline |
| **Pilot expiry management** | Prevent orphaned pilot resources | CSE-managed lifecycle |
| **Cost alerts per environment** | Prevent budget overruns | Azure Budget alerts |

### 11.5 Security

| Practice | Rationale | Implementation |
|----------|-----------|----------------|
| **Least-privilege access** | Reduce attack surface | RBAC with minimum required roles |
| **Managed identities** | Eliminate credential exposure | Workload identity for AKS pods |
| **Private endpoints** | Network-level isolation | Private Link for all PaaS services |
| **Secret rotation** | Limit exposure window | Automated rotation policies |
| **Audit logging** | Compliance and forensics | Diagnostic logs to Log Analytics |
| **Encryption at rest and in transit** | Data protection | AES-256 + TLS 1.3 |

---

## 12. References

| Reference | Location | Description |
|-----------|----------|-------------|
| MAP Deployment Framework | `05_Deployment_Framework.md` | Deployment models and processes |
| MAP Architecture Document | `03_Architecture_Document.md` | System architecture overview |
| MAP Operations Runbook | `07_Operations_Runbook.md` | Day-2 operations procedures |
| MAP Security Architecture | `10_Security_Architecture.md` | Security controls and compliance |
| Azure Well-Architected Framework | Microsoft Docs | Azure best practices |
| Azure Landing Zones | Microsoft Docs | Enterprise-scale landing zones |
| FinOps Framework | FinOps Foundation | Cloud financial management |
| MAP IaC Repository | `/infrastructure/` | All infrastructure code |

---

## 13. Appendices

### Appendix A: Environment Provisioning Request Template

| Field | Required | Description |
|-------|----------|-------------|
| Environment Type | Yes | `dev`, `test`, `pilot`, `prod` |
| Environment Name | Yes | Per naming convention |
| Azure Region | Yes | Target deployment region |
| Requestor | Yes | Name and email |
| Cost Centre | Yes | Budget allocation code |
| Justification | Yes | Business justification |
| Data Classification | Yes | Data sensitivity level |
| Expected Users | No | List of users |
| Pilot Customer | If pilot | Customer name and ID |
| Expiry Date | If applicable | When environment should be decommissioned |
| Special Requirements | No | Any non-standard configuration |

### Appendix B: Environment Health Check Commands

| Check | Command | Expected Output |
|-------|---------|-----------------|
| AKS nodes | `kubectl get nodes` | All nodes `Ready` |
| AKS pods | `kubectl get pods -n map` | All pods `Running` |
| AKS services | `kubectl get svc -n map` | All services have `EXTERNAL-IP` or `CLUSTER-IP` |
| SQL connectivity | `az sql db show --name map-{env}-db` | `status: Online` |
| Storage access | `az storage container list --account-name map{env}stor` | Container list returned |
| Redis connectivity | `az redis show --name map-{env}-redis` | `provisioningState: Succeeded` |
| App health | `curl https://{env}.mapplatform.com/health` | `200 OK` |
| DNS resolution | `nslookup {env}.mapplatform.com` | Correct IP returned |
| TLS certificate | `openssl s_client -connect {env}.mapplatform.com:443` | Valid certificate chain |

### Appendix C: Cost Estimation per Environment

| Resource | Dev (Monthly) | Test (Monthly) | Pilot (Monthly) | Production (Monthly) |
|----------|---------------|----------------|-----------------|---------------------|
| AKS (3 nodes) | $150 | $300 | $450 | $750 |
| SQL Database | $50 | $150 | $500 | $2,000+ |
| Storage (Blob) | $10 | $25 | $50 | $200+ |
| Redis Cache | $30 | $80 | $150 | $400+ |
| App Config | $0 | $0 | $5 | $10 |
| Key Vault | $0 | $0 | $1 | $1 |
| Log Analytics | $20 | $50 | $100 | $300+ |
| Networking | $10 | $25 | $50 | $100+ |
| **Total (est.)** | **$270** | **$630** | **$1,306** | **$3,761+** |

### Appendix D: Environment Ownership Matrix

| Responsibility | Dev | Test | Pilot | Production |
|---------------|-----|------|-------|------------|
| Provisioning | Platform Eng | Platform Eng | CSE + Platform Eng | Platform Eng |
| Configuration | Engineering Lead | QA Lead | CSE + Engineering Lead | Platform Eng |
| Monitoring | Engineering Lead | QA Lead | CSE + Support Eng | Operations |
| Cost Management | Engineering Lead | QA Lead | CSE + FinOps | FinOps |
| Security | Platform Eng | Platform Eng | Security Eng | Security Eng |
| Cleanup | Developer (auto) | QA Lead | CSE | Platform Eng |
| Escalation | Engineering Lead | QA Lead | CSE Manager | VP Engineering |

### Appendix E: Emergency Environment Procedures

| Scenario | Procedure | Owner | SLA |
|----------|-----------|-------|-----|
| Production environment down | Follow incident response playbook | On-call Engineer | 15 min response |
| Pilot environment compromised | Isolate environment, notify customer, investigate | CSE + Security Eng | 1 hour response |
| Cost overrun detected | Scale down non-critical resources, investigate | FinOps | 4 hours |
| Data breach suspected | Isolate, preserve evidence, notify compliance | Security Eng | Immediate |
| Unauthorised access detected | Revoke access, audit logs, investigate | Security Eng | Immediate |

---

**End of Document — MAP Environment Management v1.0**
