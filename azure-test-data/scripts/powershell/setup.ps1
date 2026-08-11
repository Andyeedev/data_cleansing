# Phase 12: Azure Test Database Setup (PowerShell)
# Run: .\setup.ps1

# Configuration
$PG_HOST = "postgres-flexible-map-test.postgres.database.azure.com"
$PG_USER = "mapadmin@postgres-flexible-map-test"
$PG_DB = "postgres"
$PG_PASS = "!!@@2016retsooR2016@!"

$SQL_HOST = "azure-sql-map-test.database.windows.net"
$SQL_USER = "mapadmin"
$SQL_DB = "map_test_db"
$SQL_PASS = "!!@@2016retsooR2016@!"

$SQL_DIR = "..\sql\baseline"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Phase 12: Database Setup (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Azure SQL
Write-Host ""
Write-Host "--- Azure SQL Server ---" -ForegroundColor Yellow
Write-Host "[1/3] Creating tables..."
sqlcmd -S $SQL_HOST -U $SQL_USER -d $SQL_DB -P $SQL_PASS -i "$SQL_DIR\01_create_tables_azure.sql"

Write-Host "[2/3] Inserting data..."
sqlcmd -S $SQL_HOST -U $SQL_USER -d $SQL_DB -P $SQL_PASS -i "$SQL_DIR\02_insert_data_azure.sql"

Write-Host "[3/3] Verifying..."
sqlcmd -S $SQL_HOST -U $SQL_USER -d $SQL_DB -P $SQL_PASS -Q "SELECT 'SQL Customers: ' + CAST(COUNT(*) AS VARCHAR) FROM customers"

# PostgreSQL
Write-Host ""
Write-Host "--- PostgreSQL ---" -ForegroundColor Yellow
Write-Host "[1/3] Creating tables..."
$env:PGPASSWORD = $PG_PASS
psql -h $PG_HOST -U $PG_USER -d $PG_DB -f "$SQL_DIR\01_create_tables.sql"

Write-Host "[2/3] Inserting data..."
psql -h $PG_HOST -U $PG_USER -d $PG_DB -f "$SQL_DIR\02_insert_data.sql"

Write-Host "[3/3] Verifying..."
psql -h $PG_HOST -U $PG_USER -d $PG_DB -c "SELECT 'PG Customers: ' || count(*) FROM customers;"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
