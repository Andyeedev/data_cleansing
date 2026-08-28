# Snowflake Connector Certification — Isolated Environment

**Phase 12 pattern reuse from `12_9_SQL_Server_Connector_Certification.md`.**
**No MAP integration yet — standalone certification only. STOP before adapter.**

## Overview

Isolated Snowflake Trial on Azure with `MAP_CERTIFICATION_SOURCE` / `MAP_CERTIFICATION_TARGET` databases, mirroring Azure SQL certification structure.

```
snowflake-certification/
├── terraform/
│   ├── versions.tf      # azurerm 3.117, snowflake 0.90
│   ├── variables.tf     # sensitive = true, no secrets in state
│   ├── main.tf          # RG + Key Vault (empty) + warehouse/DBs/schemas/role
│   ├── outputs.tf       # no secrets
│   └── README.md
├── sql/
│   ├── baseline/
│   │   ├── 01_create_tables.sql      # Snowflake DDL (AUTOINCREMENT, NUMBER, VARCHAR, TIMESTAMP_NTZ, BOOLEAN)
│   │   └── 02_seed_data.sql          # 10 tables x 5 rows (same financial data as Azure SQL)
│   ├── scenarios/README.md
│   └── reset/reset_to_baseline.sql
├── scripts/
│   ├── generate_keypair.sh/.ps1      # RSA 2048 outside Terraform
│   └── setup_key_vault.sh/.ps1       # az keyvault secret set outside Terraform
└── README.md
```

## How It Reuses Azure SQL Proven Pattern

| Azure SQL (12_9) | Snowflake Reuse | Change |
|------------------|-----------------|--------|
| `rg-sql-certification` + `kv-sql-certification` | `rg-snowflake-certification` + `kv-snowflake-cert` (empty) | Name only |
| `azurerm_mssql_server` + `certification_db` | `snowflake_database` `MAP_CERTIFICATION_SOURCE`/`TARGET` | Provider: snowflake, not azurerm |
| `AllowAzureServices` firewall | Snowflake Network Policy (optional `CREATE NETWORK POLICY` with Azure egress IP) | Different resource |
| `azuread_application` + `Managed Identity` | **RSA key-pair JWT** — `openssl genrsa 2048` outside Terraform, public key via `ALTER USER SET RSA_PUBLIC_KEY` | Auth model: JWT, not Entra |
| `pyodbc` + `ENCRYPT=yes` | `snowflake-connector-python` + `authenticator=snowflake_jwt` | Driver |
| `INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'` | `INFORMATION_SCHEMA.TABLES` with 3-part `DB.SCHEMA` + `USE WAREHOUSE MAP_CERT_WH` | Hierarchy |
| 10 tables x5 rows, FK, validation scenarios | **Identical** tables/data/scenarios (customers, accounts, transactions, products, orders, order_items, employee_records, branches, account_snapshots, customer_risk) | No change |

## Snowflake Account

- **Trial on Azure**: signup.snowflake.com → Azure + Central US → identifier `ab12345.central-us.azure` (example)
- **Free tier**: XSMALL warehouse auto_suspend 60s, storage <1GB → ~$1-2 for cert
- **Terraform auth**: `account`, `user=MAP_CERT_ADMIN`, `role=ACCOUNTADMIN`, `authenticator=snowflake_jwt`, `private_key` (sensitive, from file)

## Secure Credential Handling (Same as 12_9 §5.2)

1. Terraform creates Key Vault **empty** (no `azurerm_key_vault_secret` resource).
2. Generate key pair: `./scripts/generate_keypair.ps1` → `rsa_key.p8` (600 perms) + `rsa_key.pub`.
3. Assign public key: `ALTER USER MAP_CERT_ADMIN SET RSA_PUBLIC_KEY='MIIBIj...';` in Snowflake.
4. Insert private key: `az keyvault secret set --vault-name kv-snowflake-cert --name snowflake-private-key --file rsa_key.p8` — value never enters `terraform.tfstate`.
5. Adapter (next phase) reads via `data.azurerm_key_vault_secret` or env var `SNOWFLAKE_PRIVATE_KEY`.

**Never commit `rsa_key.p8` or `terraform.tfstate`.**

## Provisioning Steps

```bash
# 1. Generate key pair
./scripts/generate_keypair.sh ./

# 2. Terraform init/apply
cd terraform
terraform init
terraform plan -var="snowflake_account=ab12345.central-us.azure" -var="snowflake_private_key=$(cat ../rsa_key.p8)"
terraform apply -var="snowflake_account=ab12345.central-us.azure" -var="snowflake_private_key=$(cat ../rsa_key.p8)"

# 3. Inject secrets outside Terraform
../scripts/setup_key_vault.sh kv-snowflake-cert ../rsa_key.p8 ab12345.central-us.azure

# 4. Create tables + seed (run in Snowflake Worksheet or snowflake CLI)
USE WAREHOUSE MAP_CERT_WH;
USE DATABASE MAP_CERTIFICATION_SOURCE; USE SCHEMA CERT_SCHEMA;  -- run 01_create_tables.sql then 02_seed_data.sql
USE DATABASE MAP_CERTIFICATION_TARGET; USE SCHEMA CERT_SCHEMA;  -- run same
```

## Testing (After Env Ready — Before Adapter)

Manual verification (no adapter yet):
```sql
ALTER WAREHOUSE MAP_CERT_WH RESUME;
USE WAREHOUSE MAP_CERT_WH;
SELECT COUNT(*) FROM MAP_CERTIFICATION_SOURCE.CERT_SCHEMA.customers; -- should be 5
SELECT COUNT(*) FROM MAP_CERTIFICATION_TARGET.CERT_SCHEMA.customers; -- should be 5
SHOW TABLES IN SCHEMA MAP_CERTIFICATION_SOURCE.CERT_SCHEMA; -- 10 tables
SHOW TABLES IN SCHEMA MAP_CERTIFICATION_TARGET.CERT_SCHEMA; -- 10 tables
```

## What Is NOT Done (Awaiting Approval)

- No `app/adapters/snowflake.py` changes
- No standalone Python adapter (`src/adapter.py` with `connect_password`/`connect_key_pair`/`connect_oauth`)
- No tests (`test_key_pair`, `test_password`, `test_oauth`, `test_schema_discovery`)
- No MAP registration (`POST /api/v1/systems` with `database_type SNOWFLAKE`)

**Next Phase After Approval**: Build `snowflake-certification/src/adapter.py` + `tests/` mirroring `azure-test-data/certification/src/adapter.py` but using `snowflake-connector-python` and JWT.
