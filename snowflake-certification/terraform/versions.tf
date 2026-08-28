# Snowflake Certification Environment — Terraform Version Constraints
# Phase 12 Pattern Reuse: Isolated environment, no secrets in state
# Snowflake account: Free/Trial on Azure (e.g., ab12345.central-us.azure)

terraform {
  required_version = ">= 1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.117"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.53"
    }
    snowflake = {
      source  = "snowflakedb/snowflake"
      version = "~> 0.90"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.9"
    }
  }
}
