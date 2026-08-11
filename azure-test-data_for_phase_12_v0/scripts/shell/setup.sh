#!/bin/bash
# Phase 12: Azure Test Database Setup (Shell Script)
# Run: ./setup.sh

set -e

# Configuration
PG_HOST="postgres-flexible-map-test.postgres.database.azure.com"
PG_USER="mapadmin@postgres-flexible-map-test"
PG_DB="postgres"
PG_PASS="!!@@2016retsooR2016@!"

SQL_HOST="azure-sql-map-test.database.windows.net"
SQL_USER="mapadmin"
SQL_DB="map_test_db"
SQL_PASS="!!@@2016retsooR2016@!"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SQL_DIR="$SCRIPT_DIR/../sql/baseline"

echo "=========================================="
echo "  Phase 12: Database Setup (Shell)"
echo "=========================================="

# Azure SQL
echo ""
echo "--- Azure SQL Server ---"
echo "[1/3] Creating tables..."
sqlcmd -S $SQL_HOST -U $SQL_USER -d $SQL_DB -P $SQL_PASS -i "$SQL_DIR/01_create_tables_azure.sql"

echo "[2/3] Inserting data..."
sqlcmd -S $SQL_HOST -U $SQL_USER -d $SQL_DB -P $SQL_PASS -i "$SQL_DIR/02_insert_data_azure.sql"

echo "[3/3] Verifying..."
sqlcmd -S $SQL_HOST -U $SQL_USER -d $SQL_DB -P $SQL_PASS -Q "SELECT 'SQL Customers: ' + CAST(COUNT(*) AS VARCHAR) FROM customers"

echo ""
echo "--- PostgreSQL ---"
echo "[1/3] Creating tables..."
PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d $PG_DB -f "$SQL_DIR/01_create_tables.sql"

echo "[2/3] Inserting data..."
PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d $PG_DB -f "$SQL_DIR/02_insert_data.sql"

echo "[3/3] Verifying..."
PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d $PG_DB -c "SELECT 'PG Customers: ' || count(*) FROM customers;"

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
