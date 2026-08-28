# Snowflake Certification — Variables
# Follows Phase 12 12_9 principle: sensitive = true, no secret values in state

variable "location" {
  description = "Azure region for Key Vault / RG (Snowflake itself is SaaS on Azure)"
  type        = string
  default     = "centralus"
}

variable "resource_group_name" {
  description = "Isolated RG for Snowflake certification secrets"
  type        = string
  default     = "rg-snowflake-certification"
}

variable "key_vault_name" {
  description = "Key Vault for Snowflake secrets (must be globally unique, 3-24 chars)"
  type        = string
  default     = "kv-snowflake-cert"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    environment = "certification"
    project     = "map-snowflake"
    phase       = "12-snowflake"
  }
}

# ---- Snowflake Provider Variables (snowflakedb/snowflake current syntax) ----
# Provide organization_name + account_name (preferred) — host derived as <org>-<account>.<region>.azure.snowflakecomputing.com
# Legacy snowflake_account (ab12345.central-us.azure) is kept only for reference — DO NOT USE for provider (deprecated)
variable "snowflake_organization_name" {
  description = "Snowflake organization name (e.g., MYORG) — from Snowflake UI Account identifier MYORG-MYACCOUNT"
  type        = string
}

variable "snowflake_account_name" {
  description = "Snowflake account name (e.g., MYACCOUNT) — second part of identifier"
  type        = string
}

variable "snowflake_host" {
  description = "Optional full Snowflake host (e.g., myorg-myaccount.central-us.azure.snowflakecomputing.com). If empty, derived from organization/account + region."
  type        = string
  default     = ""
}

# Legacy deprecated — kept to avoid breaking old tfvars, but not used in provider
variable "snowflake_account" {
  description = "DEPRECATED — use organization_name + account_name. Kept only for reference."
  type        = string
  default     = null
}

variable "snowflake_user" {
  description = "Snowflake admin user for Terraform (e.g., MAP_CERT_ADMIN)"
  type        = string
  default     = "MAP_CERT_ADMIN"
}

variable "snowflake_role" {
  description = "Snowflake role for Terraform"
  type        = string
  default     = "ACCOUNTADMIN"
}

variable "snowflake_authenticator" {
  description = "Authenticator: snowflake (password) or snowflake_jwt (key-pair)"
  type        = string
  default     = "snowflake_jwt"
}

# Private key handling — VERIFIED PROVIDER BEHAVIOUR 2026-08-27:
# provider "snowflake" supports `private_key` (PEM contents, sensitive) AND `private_key_path` (file path).
# `private_key` value IS stored in Terraform state as part of provider config (sensitive, but still in state file) — AVOID per 12_9 §5.2.
# Correct pattern (like azurerm_key_vault_secret avoidance): use `private_key_path` or env var SNOWFLAKE_PRIVATE_KEY outside Terraform.
# Terraform creates Key Vault EMPTY; private key inserted via `az keyvault secret set --file rsa_key.p8` — never via -var="snowflake_private_key=$(cat ...)"
variable "snowflake_private_key" {
  description = "DEPRECATED — DO NOT USE. Use snowflake_private_key_path or env SNOWFLAKE_PRIVATE_KEY to avoid state storage."
  type        = string
  sensitive   = true
  default     = null
}

variable "snowflake_private_key_path" {
  description = "Path to RSA private key PEM file (e.g., ../keys/rsa_key.p8) — PREFERRED, only path stored in state, not key contents"
  type        = string
  default     = null
}

variable "snowflake_private_key_passphrase" {
  description = "Passphrase for encrypted private key"
  type        = string
  sensitive   = true
  default     = null
}

# Used only if authenticator = snowflake (password) — also sensitive
variable "snowflake_password" {
  description = "Snowflake password if using snowflake authenticator"
  type        = string
  sensitive   = true
  default     = null
}

# ---- Snowflake Resource Variables ----
variable "warehouse_name" {
  description = "Snowflake warehouse for certification"
  type        = string
  default     = "MAP_CERT_WH"
}

variable "warehouse_size" {
  description = "Warehouse size (XSMALL cheapest for cert)"
  type        = string
  default     = "XSMALL"
}

variable "source_db_name" {
  description = "Source certification database"
  type        = string
  default     = "MAP_CERTIFICATION_SOURCE"
}

variable "target_db_name" {
  description = "Target certification database"
  type        = string
  default     = "MAP_CERTIFICATION_TARGET"
}

variable "schema_name" {
  description = "Schema inside both databases (single schema for 10 tables)"
  type        = string
  default     = "CERT_SCHEMA"
}
