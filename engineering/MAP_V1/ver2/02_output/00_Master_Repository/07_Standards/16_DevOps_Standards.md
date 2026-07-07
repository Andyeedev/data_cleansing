# MAP MVP DevOps Standards

| Field      | Value                          |
|------------|--------------------------------|
| Document   | MAP MVP DevOps Standards       |
| Version    | 1.0                            |
| Date       | July 2026                      |
| Status     | Official                       |

---

## 1. Infrastructure as Code

### Bicep for Azure

- All Azure resources defined in Bicep templates
- Templates stored in `infra/bicep/` directory
- Parameters files per environment: `dev.bicepparam`, `staging.bicepparam`, `prod.bicepparam`
- Modular design: separate files for networking, compute, data, monitoring

```
infra/
  bicep/
    main.bicep
    modules/
      networking.bicep
      container-app.bicep
      sql-mi.bicep
      key-vault.bicep
      monitoring.bicep
    parameters/
      dev.bicepparam
      staging.bicepparam
      prod.bicepparam
```

### Terraform (Multi-Cloud)

- Used only when targeting non-Azure providers
- State stored in Azure Storage Account with state locking
- Remote backend configuration per environment
- Workspace-based environment isolation

### Version Control

- All IaC changes go through PR review
- Plan output reviewed before apply
- No manual changes to production infrastructure
- Drift detection via scheduled scans

---

## 2. CI/CD

### GitHub Actions Pipeline

```yaml
name: MAP CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - name: Restore
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --collect:"XPlat Code Coverage"
      - name: Security Scan
        uses: snyk/actions/dotnet@master
      - name: Build Container
        run: docker build -t map-api:${{ github.sha }} .
      - name: Push to ACR
        run: docker push mapacr.azurecr.io/map-api:${{ github.sha }}
```

### Required Pipeline Stages

| Stage             | Required | Blocking | Notes                     |
|------------------|----------|----------|---------------------------|
| Build            | Yes      | Yes      | Compile and package       |
| Unit Tests       | Yes      | Yes      | 80% coverage gate         |
| Integration Tests| Yes      | Yes      | Testcontainer-based       |
| Security Scan    | Yes      | Yes      | Snyk, Trivy, SonarQube    |
| Lint/Format      | Yes      | Yes      | ESLint, dotnet format     |
| Artifact Publish | Yes      | No       | Container image, NuGet    |

---

## 3. Build Pipelines

### Build Steps

1. **Checkout** – Pull source code
2. **Restore** – Install dependencies (NuGet, npm)
3. **Compile** – Build solution and projects
4. **Unit Tests** – Run with code coverage
5. **Integration Tests** – Run with Testcontainers
6. **Security Scan** – Snyk, Trivy, SonarQube
7. **Package** – Build Docker container image
8. **Publish** – Push to Azure Container Registry
9. **Sign** – Sign container image (optional)

### Build Optimization

- Cache NuGet packages between runs
- Parallel project builds where possible
- Docker layer caching for container builds
- Incremental builds for changed projects only

### Artifact Retention

| Artifact Type      | Retention Period | Storage                  |
|-------------------|-----------------|--------------------------|
| Container images   | 30 days         | Azure Container Registry |
| Build logs         | 90 days         | GitHub Actions           |
| Test results       | 90 days         | GitHub Actions           |
| Code coverage      | 90 days         | GitHub Actions           |

---

## 4. Release Pipelines

### Deployment Flow

```
Dev → Staging → Manual Approval → Production
```

### Environment Promotion

| Stage      | Trigger       | Approval Required | Rollback Capability |
|-----------|---------------|-------------------|---------------------|
| Dev       | Push to main  | No                | Automatic           |
| Staging   | Dev successful| No                | Automatic           |
| Production| Staging pass  | Yes (2 approvers) | Blue-green swap     |

### Blue-Green Deployment

```bash
# Deploy to green slot
az containerapp deployment source config \
  --name map-api \
  --resource-group map-rg \
  --image mapacr.azurecr.io/map-api:$VERSION

# Verify health
az containerapp show \
  --name map-api \
  --resource-group map-rg \
  --query "properties.provisioningState"

# Swap slots
az containerapp revision traffic set \
  --name map-api \
  --resource-group map-rg \
  --revision-weight map-api--green=100
```

### Approval Gates

- **Staging → Production:** Requires 2 approvers from release team
- **Critical changes:** Requires tech lead + security review
- **Emergency hotfix:** Single approver with post-deployment review

---

## 5. Monitoring

### Application Insights

| Configuration           | Value                              |
|------------------------|------------------------------------|
| Sampling percentage     | 20% (adjustable per environment)   |
| Live metrics           | Enabled in production              |
| Dependency tracking     | Enabled for SQL, HTTP, Azure SDK   |
| Exception tracking      | Auto-capture unhandled exceptions  |
| Request tracking        | Auto-capture HTTP requests         |

### Azure Monitor Alerts

| Alert                          | Threshold        | Action                    |
|-------------------------------|------------------|---------------------------|
| High response time            | p95 > 1s         | Notify on-call            |
| Error rate                    | > 1%             | Notify on-call            |
| CPU utilization               | > 80% for 5 min  | Notify + auto-scale       |
| Memory utilization            | > 85% for 5 min  | Notify + auto-scale       |
| SQL connection failures       | > 3 in 1 min     | Page on-call              |
| Container health check fail   | > 2 consecutive  | Restart + notify          |

### Dashboards

- **Operations Dashboard:** Request rate, latency, errors, dependencies
- **Migration Dashboard:** Job success rate, average duration, queue depth
- **Security Dashboard:** Auth failures, suspicious activity, scan results
- **Cost Dashboard:** Resource utilization, spend tracking, budget alerts

### Log Analytics

```kusto
// Failed requests in last hour
requests
| where timestamp > ago(1h)
| where success == false
| summarize count() by resultCode, operation_Name
| order by count_ desc
```

---

## 6. Rollback Strategies

### Blue-Green Swap

```bash
# Instant rollback: swap traffic back to previous revision
az containerapp revision traffic set \
  --name map-api \
  --resource-group map-rg \
  --revision-weight map-api--blue=100
```

### Database Rollback

- Maintain backward-compatible schema changes
- Use expand/contract pattern for migrations
- Keep rollback scripts ready for every migration
- Test rollback procedures in staging

### Feature Flags

```csharp
// LaunchDarkly or Azure App Configuration
if (_featureFlag.IsEnabled("new-migration-engine"))
{
    return await NewMigrationEngine.ProcessAsync(job);
}
else
{
    return await LegacyMigrationEngine.ProcessAsync(job);
}
```

### Rollback Decision Tree

```
Issue detected
  ├── Code bug → Feature flag disable or blue-green swap
  ├── Database issue → Rollback migration, restore from backup
  ├── Infrastructure → Revert IaC, redeploy previous version
  └── Security incident → Immediate rollback + incident response
```

---

## 7. Environment Management

### Environment Specifications

| Environment | Purpose          | Infrastructure     | Data            |
|------------|------------------|-------------------|-----------------|
| Dev        | Active development| Shared, scaled down| Synthetic/test  |
| Staging    | Pre-production   | Production-like    | Production-like |
| Production | Live traffic     | Full production    | Real customer   |

### Environment Parity

- Staging must be architecturally identical to production
- Same Azure services, same configuration patterns
- Data masked from production for staging
- Infrastructure templates parameterized per environment

### Infrastructure per Environment

- Separate Azure subscriptions per environment
- Separate resource groups per environment
- Network isolation between environments
- Separate Key Vault instances per environment

---

## 8. Secrets Management

### Pipeline Secrets

| Secret Type            | Storage Method                     | Access                |
|-----------------------|------------------------------------|-----------------------|
| Azure credentials     | GitHub Actions OIDC                | Federated identity    |
| API keys              | GitHub Actions secrets             | Per-environment       |
| Connection strings    | Azure Key Vault                    | Managed identity      |
| Certificates          | Azure Key Vault                    | Managed identity      |

### Managed Identities

```yaml
# GitHub Actions with OIDC
- uses: azure/login@v2
  with:
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

### Rules

- No secrets in source code or configuration files
- No secrets in CI/CD pipeline logs
- Rotate secrets every 90 days minimum
- Use managed identities where possible
- Audit secret access regularly

---

## 9. Containerisation

### Docker Best Practices

```dockerfile
# Multi-stage build
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Map.Api.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Map.Api.dll"]
```

### Container Requirements

| Requirement                | Standard                              |
|--------------------------|---------------------------------------|
| Base image               | Microsoft official images only        |
| Non-root user            | Required for all containers           |
| Health checks            | Liveness and readiness probes         |
| Resource limits          | CPU and memory limits defined         |
| Logging                  | stdout/stderr to container runtime    |
| Security scanning        | Trivy scan on every build             |

### Azure Container Registry

- ACR Premium tier for production
- Geo-replication for DR
- Content trust enabled (image signing)
- Vulnerability scanning enabled
- Retention policy: 30 days for untagged images

### Health Checks

```csharp
// .NET health check
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    Predicate = check => check.Tags.Contains("ready")
});

// Kubernetes-style probes
// Liveness: /health/live
// Readiness: /health/ready
```
