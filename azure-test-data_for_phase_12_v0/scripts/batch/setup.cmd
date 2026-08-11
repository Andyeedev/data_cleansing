@echo off
REM Phase 12: Azure Test Database Setup (Batch)
REM Run: setup.cmd

echo ==========================================
echo   Phase 12: Database Setup (Batch)
echo ==========================================

REM Azure SQL
echo.
echo --- Azure SQL Server ---
echo [1/3] Creating tables...
sqlcmd -S azure-sql-map-test.database.windows.net -U mapadmin -d map_test_db -P "!!@@2016retsooR2016@!" -i ..\sql\baseline\01_create_tables_azure.sql

echo [2/3] Inserting data...
sqlcmd -S azure-sql-map-test.database.windows.net -U mapadmin -d map_test_db -P "!!@@2016retsooR2016@!" -i ..\sql\baseline\02_insert_data_azure.sql

echo [3/3] Verifying...
sqlcmd -S azure-sql-map-test.database.windows.net -U mapadmin -d map_test_db -P "!!@@2016retsooR2016@!" -Q "SELECT 'SQL Customers: ' + CAST(COUNT(*) AS VARCHAR) FROM customers"

REM PostgreSQL
echo.
echo --- PostgreSQL ---
echo [1/3] Creating tables...
set PGPASSWORD=!!@@2016retsooR2016@!
psql -h postgres-flexible-map-test.postgres.database.azure.com -U mapadmin@postgres-flexible-map-test -d postgres -f ..\sql\baseline\01_create_tables.sql

echo [2/3] Inserting data...
psql -h postgres-flexible-map-test.postgres.database.azure.com -U mapadmin@postgres-flexible-map-test -d postgres -f ..\sql\baseline\02_insert_data.sql

echo [3/3] Verifying...
psql -h postgres-flexible-map-test.postgres.database.azure.com -U mapadmin@postgres-flexible-map-test -d postgres -c "SELECT 'PG Customers: ' || count(*) FROM customers;"

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
pause
