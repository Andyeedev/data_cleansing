# Generate RSA key pair for Snowflake JWT — PowerShell version (OUTSIDE Terraform)
param([string]$OutDir = ".")

$privateKey = Join-Path $OutDir "rsa_key.p8"
$publicKey = Join-Path $OutDir "rsa_key.pub"

Write-Host "Generating 2048-bit RSA key pair..."
# Requires OpenSSL on PATH (Git Bash or https://slproweb.com/products/Win32OpenSSL.html)
openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out $privateKey -nocrypt
openssl rsa -in $privateKey -pubout -out $publicKey

$pubTrimmed = (Get-Content $publicKey | Where-Object { $_ -notmatch "^-" }) -join ""
Write-Host "Private key: $privateKey (keep secure, never commit)"
Write-Host "Public key: $publicKey"
Write-Host ""
Write-Host "Snowflake command (ACCOUNTADMIN):"
Write-Host "ALTER USER MAP_CERT_ADMIN SET RSA_PUBLIC_KEY='$pubTrimmed';"
Write-Host ""
Write-Host "Next: az keyvault secret set --vault-name kv-snowflake-cert --name snowflake-private-key --file $privateKey"

# Restrict ACL
icacls $privateKey /inheritance:r /grant:r "$env:USERNAME:(R)" | Out-Null
