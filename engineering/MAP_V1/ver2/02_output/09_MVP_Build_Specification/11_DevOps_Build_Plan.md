# DevOps Build Plan

**Document:** MAP MVP DevOps Build Plan
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

MAP follows a monorepo strategy with .NET 8 backend and React 18 frontend, deployed to Azure Container Apps via CI/CD pipelines. Infrastructure is managed as code using Bicep templates with environment-specific parameter files.

---

## Repository Strategy

### Monorepo Structure

```
fs-migration-validation-engine/
├── src/
│   ├── backend/
│   │   ├── MAP.Api/                    # ASP.NET Core Web API
│   │   ├── MAP.Core/                   # Domain models, interfaces
│   │   ├── MAP.Application/            # Business logic, services
│   │   ├── MAP.Infrastructure/         # Data access, external services
│   │   ├── MAP.AI/                     # AI service abstractions
│   │   └── MAP.Shared/                 # Cross-cutting concerns
│   ├── frontend/
│   │   ├── map-ui/                     # React 18 + TypeScript SPA
│   │   └── map-components/             # Shared component library
│   └── shared/
│       └── contracts/                  # API contracts, DTOs
├── infra/
│   ├── modules/                        # Reusable Bicep modules
│   ├── environments/
│   │   ├── dev.bicepparam
│   │   ├── staging.bicepparam
│   │   └── prod.bicepparam
│   └── main.bicep                      # Root infrastructure template
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── performance/
├── pipelines/
│   ├── ci.yml
│   ├── cd.yml
│   └── release.yml
├── docs/
└── scripts/
```

### Solution Layout
- **Single .sln file** at repo root for backend projects.
- **Separate package.json** for frontend with workspace support.
- **Shared API contracts** ensure frontend/backend type safety.
- **Test projects** mirror source project structure.

### Project Organization
- Backend projects follow Clean Architecture (Core → Application → Infrastructure → API).
- Frontend follows feature-based folder structure.
- Shared contracts are generated from OpenAPI specifications.
- Infrastructure code is versioned alongside application code.

---

## Git Branching

### Branch Types

| Branch | Purpose | Lifetime | Merges Into |
|--------|---------|----------|-------------|
| `main` | Production-ready code | Permanent | — |
| `develop` | Integration branch | Permanent | `main` |
| `feature/*` | New features | Temporary | `develop` |
| `hotfix/*` | Urgent production fixes | Temporary | `main` + `develop` |
| `release/*` | Release stabilization | Temporary | `main` + `develop` |

### Branch Naming Conventions
```
feature/MAP-123-add-validation-checks
feature/MAP-456-ai-risk-scoring
hotfix/MAP-789-fix-auth-timeout
release/v1.0.0
release/v1.1.0
```

### Branch Rules
- **main:** Protected, requires PR review + CI pass + approval.
- **develop:** Protected, requires PR review + CI pass.
- **feature/*:** Branch from develop, merge back via PR.
- **hotfix/*:** Branch from main, merge to main + develop.
- **release/*:** Branch from develop, stabilize, merge to main + develop.
- **Squash merges** for feature branches to maintain clean history.
- **Merge commits** for release and hotfix branches to preserve traceability.

---

## CI/CD Pipeline

### Build Stage
```yaml
trigger:
  - main
  - develop
  - feature/*

steps:
  - task: DotNetCoreCLI@2
    displayName: 'Restore & Build'
    inputs:
      command: build
      projects: '**/*.sln'
      arguments: '--configuration Release'

  - task: DotNetCoreCLI@2
    displayName: 'Unit Tests'
    inputs:
      command: test
      projects: '**/*Tests.csproj'
      arguments: '--configuration Release --collect:"XPlat Code Coverage"'

  - task: PublishCodeCoverageResults@1
    inputs:
      codeCoverageTool: Cobertura
      summaryFileLocation: '**/coverage.cobertura.xml'
```

### Security Stage
```yaml
steps:
  - task: SonarQubePrepare@5
    displayName: 'SAST - SonarQube Analysis'
    inputs:
      SonarQube: 'MAP-SonarQube'
      projectKey: 'map-validation'

  - task: SnykSecurityScan@1
    displayName: 'Dependency Scan - Snyk'
    inputs:
      serviceConnectionEndpoint: 'MAP-Snyk'

  - task: Cache@2
    displayName: 'Trivy Container Scan'
    inputs:
      targetFiles: '**/Dockerfile'

  - script: |
      gitleaks detect --source . --report-format sarif --report-path gitleaks.sarif
    displayName: 'Secret Scan - GitLeaks'
```

### Package Stage
```yaml
steps:
  - task: Docker@2
    displayName: 'Build Backend Image'
    inputs:
      containerRegistry: 'MAP-ACR'
      repository: 'map-api'
      command: buildAndPush
      Dockerfile: 'src/backend/Dockerfile'
      tags: '$(Build.BuildId)'

  - task: Docker@2
    displayName: 'Build Frontend Image'
    inputs:
      containerRegistry: 'MAP-ACR'
      repository: 'map-ui'
      command: buildAndPush
      Dockerfile: 'src/frontend/Dockerfile'
      tags: '$(Build.BuildId)'
```

### Deploy Stage

#### Staging Deployment
```yaml
stages:
  - stage: DeployStaging
    jobs:
      - deployment: DeployToStaging
        environment: 'staging'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureContainerApps@1
                  displayName: 'Deploy API to Staging'
                  inputs:
                    azureSubscription: 'MAP-Staging'
                    containerAppName: 'map-api-staging'
                    resourceGroup: 'rg-map-staging'
                    imageToDeploy: 'mapacr.azurecr.io/map-api:$(Build.BuildId)'

                - task: AzureContainerApps@1
                  displayName: 'Deploy UI to Staging'
                  inputs:
                    azureSubscription: 'MAP-Staging'
                    containerAppName: 'map-ui-staging'
                    resourceGroup: 'rg-map-staging'
                    imageToDeploy: 'mapacr.azurecr.io/map-ui:$(Build.BuildId)'
```

#### Production Deployment
```yaml
  - stage: DeployProduction
    dependsOn: DeployStaging
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployToProduction
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureContainerApps@1
                  displayName: 'Deploy API to Production (Blue)'
                  inputs:
                    azureSubscription: 'MAP-Production'
                    containerAppName: 'map-api-blue'
                    resourceGroup: 'rg-map-production'
                    imageToDeploy: 'mapacr.azurecr.io/map-api:$(Build.BuildId)'
```

### Post-Deploy
```yaml
steps:
  - script: |
      curl -f https://api-staging.map.internal/health || exit 1
    displayName: 'Health Check - API'

  - script: |
      curl -f https://staging.map.internal/health || exit 1
    displayName: 'Health Check - UI'

  - task: DotNetCoreCLI@2
    displayName: 'Smoke Tests'
    inputs:
      command: test
      projects: '**/*SmokeTests.csproj'
      arguments: '--configuration Release --filter Category=Smoke'
```

---

## Environments

### Development
- **Infrastructure:** Shared Azure subscription.
- **Deploy Trigger:** Automatic on merge to `develop`.
- **Data:** Synthetic test data, refreshed weekly.
- **Access:** All developers, open access.
- **Purpose:** Feature validation, integration testing, shared development.

### Staging
- **Infrastructure:** Separate Azure subscription, production mirror.
- **Deploy Trigger:** Manual approval after staging CI passes.
- **Data:** Anonymized production-like data set.
- **Access:** QA team, product owners, designated stakeholders.
- **Purpose:** Pre-production validation, UAT, performance testing.

### Production
- **Infrastructure:** Dedicated Azure subscription, geo-redundant.
- **Deploy Trigger:** Manual approval after staging validation.
- **Data:** Real customer data, encrypted at rest and in transit.
- **Access:** End users, operations team.
- **Purpose:** Live customer-facing environment.
- **Deployment Model:** Blue-green with slot swapping.

---

## Release Flow

### Semantic Versioning
```
MAJOR.MINOR.PATCH
  │       │     └── Bug fixes, security patches
  │       └──────── New features, backward compatible
  └──────────────── Breaking changes, major milestones
```

**Examples:**
- `1.0.0-alpha.1` — Alpha release
- `1.0.0-preview.1` — Internal preview
- `1.0.0-rc.1` — Release candidate
- `1.0.0` — General availability

### Release Notes Generation
- Automated from commit messages and PR descriptions.
- Categorized: Features, Bug Fixes, Breaking Changes, Deprecations.
- Generated via `release-please` or `conventional-changelog`.
- Published to GitHub Releases and internal documentation.

### Changelog Automation
- CHANGELOG.md maintained automatically on merge to main.
- Conventional commit format enforced via commitlint.
- PR template includes change type and impact fields.
- Release branch creates changelog entry on merge.

---

## Infrastructure Deployment

### Bicep Templates
```
infra/
├── main.bicep                    # Root orchestrator
├── modules/
│   ├── container-app.bicep       # Container Apps environment & apps
│   ├── sql-mi.bicep              # Azure SQL Managed Instance
│   ├── key-vault.bicep           # Key Vault
│   ├── managed-identity.bicep    # User-assigned managed identities
│   ├── redis.bicep               # Azure Cache for Redis
│   ├── openai.bicep              # Azure OpenAI resource
│   ├── log-analytics.bicep       # Log Analytics workspace
│   └── monitoring.bicep          # Application Insights, alerts
├── environments/
│   ├── dev.bicepparam
│   ├── staging.bicepparam
│   └── prod.bicepparam
└── scripts/
    ├── deploy.sh                 # Deployment wrapper
    └── teardown.sh               # Environment cleanup
```

### ARM Deployments
- Bicep compiles to ARM for deployment via Azure CLI or pipelines.
- Incremental deployment mode to avoid unintended resource deletion.
- What-if operations run before every deployment.
- Deployment history retained for 90 days.

### Parameter Files Per Environment
```bicep
// dev.bicepparam
param environmentName = 'dev'
param location = 'eastus'
param sqlMiSku = 'GP_Gen5_2'
param containerAppMinReplicas = 1
param containerAppMaxReplicas = 3
param openAiModelDeployment = 'gpt-4o-mini'
```

### State Management
- Azure deployment state managed by ARM, not Terraform.
- Resource IDs tracked in pipeline variables for lifecycle management.
- Drift detection via scheduled what-if operations.
- State snapshots before major changes.

---

## Rollback Strategy

### Blue-Green Swap
```
1. Deploy new version to inactive slot (green).
2. Run smoke tests against green slot.
3. Swap traffic from blue to green.
4. Monitor for 15 minutes.
5. If issues detected, swap back to blue.
6. If stable, decommission blue slot after 24 hours.
```

### Database Rollback Procedures
- **Schema Changes:** Forward-only with backward compatibility. Never drop columns in place.
- **Data Migrations:** Idempotent scripts with down-migration support.
- **Emergency Rollback:** Point-in-time restore from Azure SQL automated backups.
- **RPO:** 5 minutes (transaction log backups every 5 minutes).

### Feature Flag Toggles
- Azure App Configuration as feature flag store.
- Features toggled off instantly without deployment.
- Gradual rollout: 10% → 50% → 100% of users.
- Kill switch for AI features independent of core validation.
- Flag state tracked in audit log for compliance.
