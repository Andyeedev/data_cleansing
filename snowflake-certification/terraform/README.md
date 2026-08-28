# Snowflake Certification Environment — Terraform

Isolated environment following Phase 12 `12_9_SQL_Server_Connector_Certification.md` pattern.
**Snowflake Trial on Azure** — Databases `MAP_CERTIFICATION_SOURCE` / `MAP_CERTIFICATION_TARGET`.
**No MAP code modified — this is standalone certification infra.**

## Architecture

| Layer | Resource | Name | Provider |
|-------|----------|------|----------|
| Azure | Resource Group | `rg-snowflake-certification` | azurerm |
| Azure | Key Vault | `kv-snowflake-cert` (empty) | azurerm |
| Snowflake | Warehouse | `MAP_CERT_WH` (XSMALL, auto_suspend 60) | snowflake |
| Snowflake | Database | `MAP_CERTIFICATION_SOURCE` | snowflake |
| Snowflake | Database | `MAP_CERTIFICATION_TARGET` | snowflake |
| Snowflake | Schema | `CERT_SCHEMA` in both DBs | snowflake |
| Snowflake | Role | `MAP_CERT_ROLE` (USAGE + future TABLES) | snowflake |

## Prerequisites

1. **Snowflake Trial on Azure**: https://signup.snowflake.com/ → Choose **Azure** + `Central US` (or your region). Note `account identifier` like `ab12345.central-us.azure`.
2. Terraform >=1.0, Azure CLI `az login`, Snowflake CLI optional.
3. Create admin user `MAP_CERT_ADMIN` in Snowflake with `ACCOUNTADMIN` (or bootstrap via first login).

## State Security (CRITICAL — Same as Azure SQL 12_9 §5.2)

| Practice | Implementation |
|----------|----------------|
| Private key in Terraform state | **NEVER** — no `azurerm_key_vault_secret` resource |
| Terraform creates vault | YES (empty) |
| Secrets inserted outside Terraform | YES — `az keyvault secret set` after `terraform apply` |
| Terraform references secrets | Via `data.azurerm_key_vault_secret` in standalone adapter (not here) |
| Sensitive vars | `sensitive = true`, passed at runtime, not committed |

## Commands

### 1. Init

```bash
cd snowflake-certification/terraform
terraform init
```

### 2. Plan

```bash
terraform plan \
  -var="snowflake_account=ab12345.central-us.azure" \
  -var="snowflake_user=MAP_CERT_ADMIN" \
  -var="snowflake_role=ACCOUNTADMIN" \
  -var="snowflake_authenticator=snowflake_jwt" \
  -var="snowflake_private_key=$(cat rsa_key.p8)" \
  -var="snowflake_private_key_passphrase=your-passphrase"
```

Or use env vars: `SNOWFLAKE_ACCOUNT`, `SNOWFLAKE_USER`, `SNOWFLAKE_PRIVATE_KEY`.

### 3. Apply (creates Azure RG + vault empty + Snowflake warehouse/DBs/schemas/role)

```bash
terraform apply \
  -var="snowflake_account=ab12345.central-us.azure" \
  -var="snowflake_user=MAP_CERT_ADMIN" \
  -var="snowflake_private_key=$(cat rsa_key.p8)"
```

### 4. Verify

```bash
terraform output
# → snowflake_source_db = MAP_CERTIFICATION_SOURCE
# → snowflake_target_db = MAP_CERTIFICATION_TARGET
# → key_vault_name = kv-snowflake-cert
```

### 5. Inject Secrets OUTSIDE Terraform (after apply)

See `../scripts/setup_key_vault.ps1` — uses `az keyvault secret set` so secrets never enter state.

### 6. Destroy

```bash
terraform destroy \
  -var="snowflake_account=ab12345.central-us.azure" \
  -var="snowflake_user=MAP_CERT_ADMIN" \
  -var="snowflake_private_key=$(cat rsa_key.p8)"
# Vault soft-deletes; purge if needed: az keyvault purge --name kv-snowflake-cert
```

## Cost

| Resource | Tier | Cost |
|----------|------|------|
| Azure RG + Key Vault | Standard | ~$0 |
| Snowflake Warehouse MAP_CERT_WH | XSMALL, auto_suspend 60, initially_suspended | Credits only when running (~$1-2 for cert) |
| Snowflake Databases | Storage ~50 rows | Negligible |
| **Total** | | **~$2 for certification** |

**Destroy warehouse/databases when done — `terraform destroy`.**

## Snowflake-Specific Notes (vs Azure SQL)

- No `azurerm_mssql_server` — Snowflake account is SaaS, not Azure resource.
- Auth is `snowflake` (password) or `snowflake_jwt` (RSA key pair) — not Entra SP/Managed Identity.
- Warehouse must be `RESUME` before queries: `ALTER WAREHOUSE MAP_CERT_WH RESUME`.
- Queries use `"DB"."SCHEMA"."TABLE"` 3-part naming.
