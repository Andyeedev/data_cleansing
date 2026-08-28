#!/bin/bash
# Setup Key Vault secrets OUTSIDE Terraform — bash version
set -e
VAULT_NAME="${1:-kv-snowflake-cert}"
PRIVATE_KEY_FILE="${2:-./rsa_key.p8}"
SNOWFLAKE_ACCOUNT="${3:-}"

if [ ! -f "$PRIVATE_KEY_FILE" ]; then
  echo "Private key not found: $PRIVATE_KEY_FILE — run generate_keypair.sh first" >&2
  exit 1
fi

echo "Setting secrets in $VAULT_NAME..."
az keyvault secret set --vault-name "$VAULT_NAME" --name snowflake-private-key --file "$PRIVATE_KEY_FILE" --output none
echo "  ✓ snowflake-private-key"

if [ -n "$SNOWFLAKE_ACCOUNT" ]; then
  az keyvault secret set --vault-name "$VAULT_NAME" --name snowflake-account --value "$SNOWFLAKE_ACCOUNT" --output none
  echo "  ✓ snowflake-account"
fi

echo "Done. No secrets in Terraform state."
