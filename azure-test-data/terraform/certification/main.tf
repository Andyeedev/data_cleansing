# Phase 12: SQL Server Certification Environment
# Isolated Azure environment for authentication certification
# No secrets in Terraform state

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "azuread" {}

# Variables
variable "location" {
  description = "Azure region"
  type        = string
  default     = "centralus"
}

variable "admin_username" {
  description = "SQL Server admin username"
  type        = string
  default     = "certadmin"
}

variable "admin_password" {
  description = "SQL Server admin password"
  type        = string
  sensitive   = true
}

variable "entra_user_password" {
  description = "Entra test user password"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    environment = "certification"
    project     = "map-sql-server"
  }
}

# Resource Group
resource "azurerm_resource_group" "certification" {
  name     = "rg-sql-certification"
  location = var.location
  tags     = var.tags
}

# Azure SQL Server
resource "azurerm_mssql_server" "certification" {
  name                         = "sql-certification-test"
  resource_group_name          = azurerm_resource_group.certification.name
  location                     = var.location
  administrator_login          = var.admin_username
  administrator_login_password = var.admin_password
  version                      = "12.0"
  minimum_tls_version          = "1.2"

  tags = var.tags
}

# Azure SQL Database
resource "azurerm_mssql_database" "certification" {
  name                = "certification_db"
  server_id           = azurerm_mssql_server.certification.id
  sku_name            = "S0"
  collation           = "SQL_Latin1_General_CP1_CI_AS"

  tags = var.tags
}

# Firewall - Allow Azure services
resource "azurerm_mssql_firewall_rule" "allow_azure" {
  name                = "AllowAzureServices"
  server_id           = azurerm_mssql_server.certification.id
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

# Key Vault
resource "azurerm_key_vault" "certification" {
  name                = "kv-sql-certification"
  resource_group_name = azurerm_resource_group.certification.name
  location            = var.location
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  tags = var.tags
}

# Current client config for Key Vault access
data "azurerm_client_config" "current" {}

# Key Vault access policy for current user
resource "azurerm_key_vault_access_policy" "current_user" {
  key_vault_id = azurerm_key_vault.certification.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = ["Get", "List", "Set", "Delete"]
}

# Entra ID Application for Service Principal
resource "azuread_application" "certification" {
  display_name = "map-sql-certification-sp"
}

resource "azuread_service_principal" "certification" {
  application_id = azuread_application.certification.application_id
}

# Managed Identity
resource "azurerm_user_assigned_identity" "certification" {
  name                = "id-map-certification"
  resource_group_name = azurerm_resource_group.certification.name
  location            = var.location
  tags                = var.tags
}

# Outputs (no secrets)
output "resource_group_name" {
  value = azurerm_resource_group.certification.name
}

output "sql_server_fqdn" {
  value = azurerm_mssql_server.certification.fully_qualified_domain_name
}

output "sql_database_name" {
  value = azurerm_mssql_database.certification.name
}

output "key_vault_name" {
  value = azurerm_key_vault.certification.name
}

output "key_vault_uri" {
  value = azurerm_key_vault.certification.vault_uri
}

output "service_principal_application_id" {
  value = azuread_application.certification.application_id
}

output "managed_identity_client_id" {
  value = azurerm_user_assigned_identity.certification.client_id
}

output "managed_identity_principal_id" {
  value = azurerm_user_assigned_identity.certification.principal_id
}
