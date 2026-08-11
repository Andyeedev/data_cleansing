# Azure Provider Configuration
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Variables
variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-map-test-dev"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "centralus"
}

variable "postgres_admin_user" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "mapadmin"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "sql_admin_user" {
  description = "Azure SQL administrator username"
  type        = string
  default     = "mapadmin"
}

variable "sql_admin_password" {
  description = "Azure SQL administrator password"
  type        = string
  sensitive   = true
}

# Resource Group
resource "azurerm_resource_group" "map_test" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    environment = "test"
    project     = "map-validation"
  }
}

# Azure Database for PostgreSQL - Flexible Server
resource "azurerm_postgresql_flexible_server" "map_test" {
  name                   = "postgres-flexible-map-test"
  resource_group_name    = azurerm_resource_group.map_test.name
  location               = var.location
  administrator_login    = var.postgres_admin_user
  administrator_password = var.postgres_admin_password
  sku_name               = "B_Standard_B1ms"
  version                = "14"
  storage_mb             = 32768

  tags = {
    environment = "test"
    project     = "map-validation"
    role        = "source"
  }
}

# Azure SQL Server
resource "azurerm_mssql_server" "map_test" {
  name                         = "azure-sql-map-test"
  resource_group_name          = azurerm_resource_group.map_test.name
  location                     = var.location
  administrator_login          = var.sql_admin_user
  administrator_login_password = var.sql_admin_password
  version                      = "12.0"

  tags = {
    environment = "test"
    project     = "map-validation"
    role        = "target"
  }
}

# Azure SQL Database
resource "azurerm_mssql_database" "map_test" {
  name      = "map_test_db"
  server_id = azurerm_mssql_server.map_test.id

  tags = {
    environment = "test"
    project     = "map-validation"
  }
}

# Firewall Rule - Allow Azure services
resource "azurerm_mssql_firewall_rule" "allow_azure" {
  name                = "AllowAzureServices"
  server_id           = azurerm_mssql_server.map_test.id
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

# Outputs
output "resource_group_name" {
  value = azurerm_resource_group.map_test.name
}

output "postgres_host" {
  value = azurerm_postgresql_flexible_server.map_test.fqdn
}

output "postgres_admin_user" {
  value = var.postgres_admin_user
}

output "sql_server_fqdn" {
  value = azurerm_mssql_server.map_test.fully_qualified_domain_name
}

output "sql_admin_user" {
  value = var.sql_admin_user
}

output "sql_database_name" {
  value = azurerm_mssql_database.map_test.name
}
