# Snowflake Certification — Outputs (NO secrets)
# Mirrors 12_9 §5: outputs never expose private_key, password

output "resource_group_name" {
  value       = azurerm_resource_group.certification.name
  description = "Azure RG for Key Vault"
}

output "key_vault_name" {
  value       = azurerm_key_vault.certification.name
  description = "Key Vault for Snowflake secrets (empty — secrets injected outside Terraform)"
}

output "key_vault_uri" {
  value       = azurerm_key_vault.certification.vault_uri
  description = "Vault URI for CLI secret insertion"
}

output "snowflake_warehouse" {
  value       = snowflake_warehouse.cert.name
  description = "Snowflake warehouse"
}

output "snowflake_source_db" {
  value       = snowflake_database.source.name
  description = "Source certification database"
}

output "snowflake_target_db" {
  value       = snowflake_database.target.name
  description = "Target certification database"
}

output "snowflake_schema" {
  value       = var.schema_name
  description = "Schema in both databases"
}

output "snowflake_role" {
  value       = snowflake_account_role.cert_role.name
  description = "Certification role"
}

output "snowflake_organization_name" {
  value       = var.snowflake_organization_name
  description = "Snowflake organization name"
}

output "snowflake_account_name" {
  value       = var.snowflake_account_name
  description = "Snowflake account name"
}

output "snowflake_host" {
  value       = var.snowflake_host != "" ? var.snowflake_host : "${lower(var.snowflake_organization_name)}-${lower(var.snowflake_account_name)}.central-us.azure.snowflakecomputing.com"
  description = "Snowflake host (derived if not set)"
}

# NO private_key / password outputs
