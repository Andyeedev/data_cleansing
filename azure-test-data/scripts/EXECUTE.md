# Phase 12: Database Setup — Execution Guide

## Quick Commands

### Python

```bash
# Navigate to scripts folder
cd azure-test-data/scripts/python

# Run the script
python setup_databases.py
```

**What it does:**
1. Creates tables in Azure SQL
2. Inserts data in Azure SQL
3. Creates tables in PostgreSQL
4. Inserts data in PostgreSQL
5. Verifies both databases

---

### Shell (Bash)

```bash
# Navigate to scripts folder
cd azure-test-data/scripts/shell

# Make executable
chmod +x setup.sh

# Run the script
./setup.sh
```

**Or in Azure Cloud Shell:**
```bash
cd azure-test-data/scripts/shell
bash setup.sh
```

---

### PowerShell

```powershell
# Navigate to scripts folder
cd azure-test-data\scripts\powershell

# Run the script
.\setup.ps1
```

**If execution policy error:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
.\setup.ps1
```

---

### Batch (Windows CMD)

```cmd
:: Navigate to scripts folder
cd azure-test-data\scripts\batch

:: Run the script
setup.cmd
```

---

### Terminal (Manual)

**Azure SQL:**
```bash
sqlcmd -S azure-sql-map-test.database.windows.net -U mapadmin -d map_test_db -P "!!@@2016retsooR2016@!" -i ../../sql/reset/reset_azure.sql
```

**PostgreSQL:**
```bash
psql -h postgres-flexible-map-test.postgres.database.azure.com -U mapadmin@postgres-flexible-map-test -d postgres -f ../../sql/reset/reset_postgresql.sql
```

---

## Reset Databases (Clean Start)

**Azure SQL:**
```bash
sqlcmd -S azure-sql-map-test.database.windows.net -U mapadmin -d map_test_db -P "!!@@2016retsooR2016@!" -i azure-test-data/sql/reset/reset_azure.sql
```

**PostgreSQL:**
```bash
psql -h postgres-flexible-map-test.postgres.database.azure.com -U mapadmin@postgres-flexible-map-test -d postgres -f azure-test-data/sql/reset/reset_postgresql.sql
```

---

## Verify Data

**Azure SQL:**
```bash
sqlcmd -S azure-sql-map-test.database.windows.net -U mapadmin -d map_test_db -P "!!@@2016retsooR2016@!" -Q "SELECT count(*) FROM customers"
```
**Expected: 5**

**PostgreSQL:**
```bash
psql -h postgres-flexible-map-test.postgres.database.azure.com -U mapadmin@postgres-flexible-map-test -d postgres -c "SELECT count(*) FROM customers;"
```
**Expected: 5**

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection timeout | Add firewall rule (see below) |
| Table already exists | Use reset script instead |
| Login failed | Check username/password |
| sqlcmd not found | Install or use Azure Cloud Shell |

---

## Firewall Rules

**Azure SQL:**
```bash
az sql server firewall-rule create --resource-group rg-map-test-dev --server azure-sql-map-test --name AllowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

**PostgreSQL:**
```bash
az postgres flexible-server firewall-rule create --resource-group rg-map-test-dev --name postgres-flexible-map-test --rule-name AllowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

---

## Delete Everything

```bash
cd azure-test-data/terraform
terraform destroy -var="postgres_admin_password=!!@@2016retsooR2016@!" -var="sql_admin_password=!!@@2016retsooR2016@!"
```
