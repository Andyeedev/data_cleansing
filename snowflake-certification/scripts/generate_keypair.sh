#!/bin/bash
# Generate RSA key pair for Snowflake JWT (snowflake_jwt) — OUTSIDE Terraform
# Private key stored in Key Vault via az keyvault secret set (never in state)
# Public key assigned to Snowflake user: ALTER USER MAP_CERT_ADMIN SET RSA_PUBLIC_KEY='MIIBIj...'

set -e

OUT_DIR="${1:-.}"
PRIVATE_KEY="$OUT_DIR/rsa_key.p8"
PUBLIC_KEY="$OUT_DIR/rsa_key.pub"

echo "Generating 2048-bit RSA key pair..."
openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out "$PRIVATE_KEY" -nocrypt
openssl rsa -in "$PRIVATE_KEY" -pubout -out "$PUBLIC_KEY"

# Extract public key without header/footer for Snowflake
PUB_TRIMMED=$(grep -v "^-" "$PUBLIC_KEY" | tr -d '\n')

echo "Private key: $PRIVATE_KEY (keep secure, never commit)"
echo "Public key: $PUBLIC_KEY"
echo ""
echo "Snowflake command (run as ACCOUNTADMIN):"
echo "ALTER USER MAP_CERT_ADMIN SET RSA_PUBLIC_KEY='$PUB_TRIMMED';"
echo ""
echo "Next: az keyvault secret set --vault-name kv-snowflake-cert --name snowflake-private-key --file $PRIVATE_KEY"
chmod 600 "$PRIVATE_KEY"
