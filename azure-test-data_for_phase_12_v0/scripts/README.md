# Phase 12: Database Setup Scripts

## Quick Reference

| Method | File | Run Command |
|--------|------|-------------|
| **Python** | `scripts/python/setup_databases.py` | `python setup_databases.py` |
| **Shell** | `scripts/shell/setup.sh` | `./setup.sh` |
| **PowerShell** | `scripts/powershell/setup.ps1` | `.\setup.ps1` |
| **Batch** | `scripts/batch/setup.cmd` | `setup.cmd` |
| **Terminal** | `scripts/terminal/commands.txt` | Copy-paste commands |

---

## Folder Structure

```
azure-test-data/
├── scripts/
│   ├── python/
│   │   └── setup_databases.py      ← Python option
│   ├── shell/
│   │   └── setup.sh                ← Bash/Shell option
│   ├── powershell/
│   │   └── setup.ps1               ← PowerShell option
│   ├── batch/
│   │   └── setup.cmd               ← Windows Batch option
│   └── terminal/
│       └── commands.txt            ← Manual commands
├── sql/
│   └── baseline/
│       ├── 01_create_tables.sql         ← PostgreSQL
│       ├── 02_insert_data.sql          ← PostgreSQL
│       ├── 01_create_tables_azure.sql   ← Azure SQL
│       └── 02_insert_data_azure.sql    ← Azure SQL
└── terraform/
    └── main.tf                   ← Infrastructure
```

---

## How to Run

### Option 1: Python (Recommended)
```bash
cd azure-test-data/scripts/python
python setup_databases.py
```

### Option 2: Shell (Linux/Mac/Cloud Shell)
```bash
cd azure-test-data/scripts/shell
chmod +x setup.sh
./setup.sh
```

### Option 3: PowerShell (Windows)
```powershell
cd azure-test-data/scripts/powershell
.\setup.ps1
```

### Option 4: Batch (Windows)
```cmd
cd azure-test-data/scripts\batch
setup.cmd
```

### Option 5: Terminal (Manual)
Copy commands from `scripts/terminal/commands.txt` and run one by one.

---

## Prerequisites

| Tool | Install |
|------|---------|
| sqlcmd | https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-tools |
| psql | https://www.postgresql.org/download/ |
| Azure CLI | https://docs.microsoft.com/en-us/cli/azure/install-azure-cli |

---

## What Each Script Does

1. Creates firewall rules (if included)
2. Creates 10 tables in Azure SQL
3. Inserts 5 rows per table in Azure SQL
4. Creates 10 tables in PostgreSQL
5. Inserts 5 rows per table in PostgreSQL
6. Verifies row counts match

---

## Reset/Delete Everything

```bash
cd azure-test-data/terraform
terraform destroy -var="postgres_admin_password=!!@@2016retsooR2016@!" -var="sql_admin_password=!!@@2016retsooR2016@!"
```
