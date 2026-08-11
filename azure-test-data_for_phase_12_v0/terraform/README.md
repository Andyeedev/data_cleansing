# Azure Test Environment — Terraform

## Prerequisites

1. Install Terraform: https://developer.hashicorp.com/terraform/install
2. Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
3. Login to Azure:
   ```bash
   az login
   ```

## Resources Created

| Resource | Type | Name | Purpose |
|----------|------|------|---------|
| Resource Group | `azurerm_resource_group` | `rg-map-test-dev` | Container |
| PostgreSQL Flexible Server | `azurerm_postgresql_flexible_server` | `postgres-flexible` | Source DB |
| Azure SQL Server | `azurerm_sql_server` | `azure-sql` | Target DB Server |
| Azure SQL Database | `azurerm_sql_database` | `map_test_db` | Target DB |
| Firewall Rule | `azurerm_sql_firewall_rule` | `AllowAzureServices` | Allow Azure services |

## Commands

### 1. Initialize Terraform
```bash
cd azure-test-data/terraform
terraform init
```

### 2. Plan (preview changes)
```bash
terraform plan \
  -var="postgres_admin_password=<your-password>" \
  -var="sql_admin_password=<your-password>"
```

### 3. Apply (create resources)
```bash
terraform apply \
  -var="postgres_admin_password=<your-password>" \
  -var="sql_admin_password=<your-password>"
```

### 4. Verify outputs
```bash
terraform output
```

### 5. Destroy (when done)
```bash
terraform destroy \
  -var="postgres_admin_password=<your-password>" \
  -var="sql_admin_password=<your-password>"
```

## Connection Details

After `terraform apply`, note the outputs:

| Output | Use for MAP |
|--------|-------------|
| `postgres_host` | Host field |
| `postgres_admin_user` | Username field |
| `sql_server_fqdn` | Host field |
| `sql_admin_user` | Username field |
| `sql_database_name` | Database field |

## MAP Registration

Use these values when registering connections in MAP:
- **Source:** PostgreSQL, Host=`postgres_host`, Port=5432
- **Target:** SQL Server, Host=`sql_server_fqdn`, Port=1433

## Cost Estimate

| Resource | Tier | Est. Monthly Cost |
|----------|------|-------------------|
| PostgreSQL Flexible | Standard_B1ms | ~$15 |
| Azure SQL | Standard S0 | ~$5 |
| **Total** | | **~$20** |

**Remember to destroy when testing is complete!**
