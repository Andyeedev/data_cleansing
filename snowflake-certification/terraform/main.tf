# Snowflake Certification Environment — Main Terraform
# Reuses Phase 12 12_9 pattern: isolated environment, Key Vault created empty, secrets outside Terraform
# Snowflake on Azure (Trial/Free) — Databases: MAP_CERTIFICATION_SOURCE / MAP_CERTIFICATION_TARGET

# ---- Providers ----
provider "azurerm" {
  features {}
}

provider "azuread" {}

provider "snowflake" {
  organization_name = var.snowflake_organization_name
  account_name      = var.snowflake_account_name
  host              = var.snowflake_host != "" ? var.snowflake_host : null
  user              = var.snowflake_user
  role              = var.snowflake_role
  # VERIFIED: private_key_path (or env SNOWFLAKE_PRIVATE_KEY) avoids storing PEM in state; private_key (contents) WOULD be stored (sensitive but still in tfstate) — DO NOT USE
  authenticator          = var.snowflake_authenticator
  private_key            = var.snowflake_private_key
  private_key_path       = var.snowflake_private_key_path
  private_key_passphrase = var.snowflake_private_key_passphrase
  password               = var.snowflake_password
}

# ---- Azure: Isolated Resource Group ----
resource "azurerm_resource_group" "certification" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# ---- Azure: Key Vault (EMPTY — secrets injected outside Terraform) ----
data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "certification" {
  name                       = var.key_vault_name
  resource_group_name        = azurerm_resource_group.certification.name
  location                   = var.location
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  purge_protection_enabled   = false

  tags = var.tags
}

resource "azurerm_key_vault_access_policy" "current_user" {
  key_vault_id = azurerm_key_vault.certification.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = ["Get", "List", "Set", "Delete", "Purge"]
}

# NOTE: NO azurerm_key_vault_secret resources here — intentional.
# Secrets (private_key PEM, password, account) are inserted via:
#   az keyvault secret set --vault-name kv-snowflake-cert --name snowflake-private-key --file rsa_key.p8
#   az keyvault secret set --vault-name kv-snowflake-cert --name snowflake-password --value "..."
# This prevents secret values in terraform.tfstate (see 12_9 §5.2).

# ---- Snowflake: Warehouse (XSMALL, auto_suspend 60s — minimal cost) ----
resource "snowflake_warehouse" "cert" {
  name                = var.warehouse_name
  warehouse_size      = var.warehouse_size
  auto_suspend        = 60
  auto_resume         = true
  initially_suspended = true
  comment             = "Isolated warehouse for MAP Snowflake certification — Phase 12 pattern"
}

# ---- Snowflake: Databases ----
resource "snowflake_database" "source" {
  name    = var.source_db_name
  comment = "Certification SOURCE — 10 tables x 5 rows baseline"
}

resource "snowflake_database" "target" {
  name    = var.target_db_name
  comment = "Certification TARGET — 10 tables x 5 rows baseline (mirrors SOURCE)"
}

# ---- Snowflake: Schemas (one per DB, same name for mapping) ----
resource "snowflake_schema" "source" {
  database = snowflake_database.source.name
  name     = var.schema_name
  comment  = "Certification schema for 10 validation tables"
}

resource "snowflake_schema" "target" {
  database = snowflake_database.target.name
  name     = var.schema_name
  comment  = "Certification schema for 10 validation tables"
}

# ---- Snowflake: Certification Role (optional least-privilege) ----
resource "snowflake_account_role" "cert_role" {
  name    = "MAP_CERT_ROLE"
  comment = "Least-privilege role for certification tests"
}

resource "snowflake_grant_privileges_to_account_role" "warehouse_usage" {
  privileges        = ["USAGE"]
  account_role_name = snowflake_account_role.cert_role.name
  on_account_object {
    object_type = "WAREHOUSE"
    object_name = snowflake_warehouse.cert.name
  }
}

resource "snowflake_grant_privileges_to_account_role" "source_db_usage" {
  privileges        = ["USAGE"]
  account_role_name = snowflake_account_role.cert_role.name
  on_account_object {
    object_type = "DATABASE"
    object_name = snowflake_database.source.name
  }
}

resource "snowflake_grant_privileges_to_account_role" "target_db_usage" {
  privileges        = ["USAGE"]
  account_role_name = snowflake_account_role.cert_role.name
  on_account_object {
    object_type = "DATABASE"
    object_name = snowflake_database.target.name
  }
}

resource "snowflake_grant_privileges_to_account_role" "source_schema_usage" {
  privileges        = ["USAGE"]
  account_role_name = snowflake_account_role.cert_role.name
  on_schema {
    schema_name = "\"${snowflake_database.source.name}\".\"${var.schema_name}\""
  }
}

resource "snowflake_grant_privileges_to_account_role" "target_schema_usage" {
  privileges        = ["USAGE"]
  account_role_name = snowflake_account_role.cert_role.name
  on_schema {
    schema_name = "\"${snowflake_database.target.name}\".\"${var.schema_name}\""
  }
}

# Grant CREATE TABLE + SELECT/INSERT/UPDATE/DELETE on future tables
resource "snowflake_grant_privileges_to_account_role" "source_future_tables" {
  privileges        = ["SELECT", "INSERT", "UPDATE", "DELETE"]
  account_role_name = snowflake_account_role.cert_role.name
  on_schema_object {
    future {
      object_type_plural = "TABLES"
      in_schema          = "\"${snowflake_database.source.name}\".\"${var.schema_name}\""
    }
  }
}

resource "snowflake_grant_privileges_to_account_role" "target_future_tables" {
  privileges        = ["SELECT", "INSERT", "UPDATE", "DELETE"]
  account_role_name = snowflake_account_role.cert_role.name
  on_schema_object {
    future {
      object_type_plural = "TABLES"
      in_schema          = "\"${snowflake_database.target.name}\".\"${var.schema_name}\""
    }
  }
}
