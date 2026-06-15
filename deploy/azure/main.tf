# Terraform template for Migration Validation Engine
# This demonstrates the target architecture for Azure (Microsoft Founders Hub)

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-migration-validation"
  location = "East US"
}

# 1. PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "engine_db" {
  name                   = "psql-migration-engine"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "15"
  administrator_login    = "psqladmin"
  administrator_password = "ChangeMe12345!" # Use a secret manager in real prod
  storage_mb             = 32768
  sku_name               = "GP_Standard_D2s_v3"
}

# 2. Azure Container App (The Engine)
resource "azurerm_container_app_environment" "env" {
  name                = "cae-migration-engine"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

resource "azurerm_container_app" "engine_api" {
  name                         = "ca-migration-engine-api"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "engine-api"
      image  = "migration-engine:latest" # Pull from ACR
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
      # Credentials should be pulled from Azure Key Vault
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
