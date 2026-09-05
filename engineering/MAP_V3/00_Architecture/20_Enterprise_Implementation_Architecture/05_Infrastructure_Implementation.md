# 05 — Infrastructure Implementation

## Terraform Configuration

File: `deploy/azure/main.tf`

This Terraform template provisions the target Azure architecture for the Migration Validation Engine on Microsoft Founders Hub.

## Provider

```hcl
provider "azurerm" {
  features {}
}
```

## Azure Resources

### Resource Group

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "rg-migration-validation"
  location = "East US"
}
```

| Property | Value |
|----------|-------|
| Name | `rg-migration-validation` |
| Location | `East US` |

### PostgreSQL Flexible Server

```hcl
resource "azurerm_postgresql_flexible_server" "engine_db" {
  name                   = "psql-migration-engine"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "15"
  administrator_login    = "psqladmin"
  administrator_password = "ChangeMe12345!"
  storage_mb             = 32768
  sku_name               = "GP_Standard_D2s_v3"
}
```

| Property | Value |
|----------|-------|
| Name | `psql-migration-engine` |
| PostgreSQL Version | 15 |
| Storage | 32768 MB (32 GB) |
| SKU | `GP_Standard_D2s_v3` |

### Container App Environment

```hcl
resource "azurerm_container_app_environment" "env" {
  name                = "cae-migration-engine"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}
```

| Property | Value |
|----------|-------|
| Name | `cae-migration-engine` |

### Container App (Engine API)

```hcl
resource "azurerm_container_app" "engine_api" {
  name                         = "ca-migration-engine-api"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "engine-api"
      image  = "migration-engine:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "ENGINE_DB_HOST"
        value = azurerm_postgresql_flexible_server.engine_db.fqdn
      }
      env {
        name  = "ENGINE_DB_NAME"
        value = "migration_engine"
      }
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 8000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
```

| Property | Value |
|----------|-------|
| Name | `ca-migration-engine-api` |
| Container Name | `engine-api` |
| Image | `migration-engine:latest` |
| CPU | 0.5 vCPU |
| Memory | 1 Gi |
| Target Port | 8000 |
| Traffic | 100% to latest revision |
| Ingress | External enabled, TLS enforced |

## Resource Summary

| Resource | Terraform Type | Name |
|----------|---------------|------|
| Resource Group | `azurerm_resource_group` | `rg-migration-validation` |
| PostgreSQL Flexible Server | `azurerm_postgresql_flexible_server` | `psql-migration-engine` |
| Container App Environment | `azurerm_container_app_environment` | `cae-migration-engine` |
| Container App | `azurerm_container_app` | `ca-migration-engine-api` |

## Networking

- Container App ingress is enabled with `external_enabled = true`
- TLS is enforced (`allow_insecure_connections = false`)
- PostgreSQL Flexible Server is accessible via its FQDN injected as `ENGINE_DB_HOST` environment variable
- Traffic weight routes 100% to the latest revision

## Storage

- PostgreSQL data is stored in Azure-managed storage (32 GB allocated via `storage_mb = 32768`)
- No separate storage account is provisioned in this template

## Compute

- Container App runs with 0.5 vCPU and 1 Gi memory
- Image `migration-engine:latest` is expected to be pulled from Azure Container Registry (comment in Terraform: `# Pull from ACR`)

## Environment Variables Injected

| Variable | Value | Source |
|----------|-------|--------|
| `ENGINE_DB_HOST` | `azurerm_postgresql_flexible_server.engine_db.fqdn` | Terraform output |
| `ENGINE_DB_NAME` | `migration_engine` | Hardcoded |

Note: Database credentials (`ENGINE_DB_USER`, `ENGINE_DB_PASS`) should be pulled from Azure Key Vault as noted in the Terraform comments (`deploy/azure/main.tf:53`).
