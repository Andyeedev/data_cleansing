# Setup Key Vault secrets OUTSIDE Terraform — Phase 12 12_9 §5.3 correct flow
# Terraform creates kv-snowflake-cert EMPTY; this script inserts secrets so they never enter state
param(
  [string]$VaultName = "kv-snowflake-cert",
  [string]$PrivateKeyFile = "./rsa_key.p8",
  [string]$SnowflakeAccount = "",
  [string]$SnowflakeUser = "MAP_CERT_ADMIN"
)

if (-not (Test-Path $PrivateKeyFile)) {
  Write-Error "Private key file not found: $PrivateKeyFile — run generate_keypair.ps1 first"
  exit 1
}

Write-Host "Setting secrets in $VaultName (none stored in Terraform state)..."

# Private key PEM
az keyvault secret set --vault-name $VaultName --name snowflake-private-key --file $PrivateKeyFile --output none
Write-Host "  ✓ snowflake-private-key"

# Account identifier (non-secret but stored for reference)
if ($SnowflakeAccount) {
  az keyvault secret set --vault-name $VaultName --name snowflake-account --value $SnowflakeAccount --output none
  Write-Host "  ✓ snowflake-account"
}

# Example: password if using snowflake authenticator (alternative to JWT)
# az keyvault secret set --vault-name $VaultName --name snowflake-password --value "YourPassword" --output none

Write-Host "Done. Terraform references via data.azurerm_key_vault_secret (not resource)."

# Public key assignment reminder
$pubFile = $PrivateKeyFile -replace "\.p8$", ".pub"
if (Test-Path $pubFile) {
  $pubTrimmed = (Get-Content $pubFile | Where-Object { $_ -notmatch "^-" }) -join ""
  Write-Host ""
  Write-Host "Run in Snowflake (ACCOUNTADMIN):"
  Write-Host "ALTER USER $SnowflakeUser SET RSA_PUBLIC_KEY='$pubTrimmed';"
}
