# Azure Test Data — Directory Structure

```
azure-test-data/
├── terraform/
│   ├── main.tf                  # Azure resource definitions
│   └── README.md                # Instructions
├── sql/
│   ├── baseline/
│   │   ├── 01_create_tables.sql  # 10 tables
│   │   └── 02_insert_data.sql   # 5 rows per table
│   ├── scenarios/
│   │   └── all_scenarios.sql    # 10 migration scenarios
│   └── reset/
│       └── reset_to_baseline.sql # Reset scripts
└── scripts/
    ├── provision.sh             # CLI provisioning (backup)
    ├── destroy.sh               # CLI destruction
    ├── seed.sh                  # Seed data
    └── reset.sh                 # Reset data
```

## Usage

### 1. Provision Infrastructure
```bash
cd terraform
terraform init
terraform apply -var="postgres_admin_password=<pw>" -var="sql_admin_password=<pw>"
```

### 2. Seed Data
```bash
# PostgreSQL
psql -h <postgres-host> -U mapadmin -d map_test_db -f sql/baseline/01_create_tables.sql
psql -h <postgres-host> -U mapadmin -d map_test_db -f sql/baseline/02_insert_data.sql

# Azure SQL
sqlcmd -S <sql-server>.database.windows.net -U mapadmin -d map_test_db -i sql/baseline/01_create_tables.sql
sqlcmd -S <sql-server>.database.windows.net -U mapadmin -d map_test_db -i sql/baseline/02_insert_data.sql
```

### 3. Register in MAP
Use Terraform outputs to register connections in MAP UI

### 4. Run Validation
Execute validation against Azure databases

### 5. Test Scenarios
Apply scenario scripts and verify MAP detects differences

### 6. Reset
```bash
psql/sqlcmd -f sql/reset/reset_to_baseline.sql
```

### 7. Destroy (when done)
```bash
cd terraform
terraform destroy -var="postgres_admin_password=<pw>" -var="sql_admin_password=<pw>"
```
