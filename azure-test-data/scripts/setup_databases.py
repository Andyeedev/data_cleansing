#!/usr/bin/env python3
"""
Phase 12: Azure Test Database Setup Script
Creates tables and seeds data in both Azure SQL and PostgreSQL
"""

import os
import subprocess
import sys

# Configuration
PG_HOST = "postgres-flexible-map-test.postgres.database.azure.com"
PG_USER = "mapadmin@postgres-flexible-map-test"
PG_DB = "postgres"
PG_PASS = "!!@@2016retsooR2016@!"

SQL_HOST = "azure-sql-map-test.database.windows.net"
SQL_USER = "mapadmin"
SQL_DB = "map_test_db"
SQL_PASS = "!!@@2016retsooR2016@!"

# Get the project root directory (two levels up from scripts/)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
SQL_DIR = os.path.join(PROJECT_ROOT, "azure-test-data", "sql", "baseline")
RESET_DIR = os.path.join(PROJECT_ROOT, "azure-test-data", "sql", "reset")


def run_sql_server():
    """Setup Azure SQL Server"""
    print("=" * 50)
    print("Setting up Azure SQL Server")
    print("=" * 50)

    # Create tables
    print("\n[1/3] Creating tables...")
    subprocess.run([
        "sqlcmd", "-S", SQL_HOST, "-U", SQL_USER, "-d", SQL_DB, "-P", SQL_PASS,
        "-i", os.path.join(SQL_DIR, "01_create_tables_azure.sql")
    ], check=True)

    # Insert data
    print("[2/3] Inserting data...")
    subprocess.run([
        "sqlcmd", "-S", SQL_HOST, "-U", SQL_USER, "-d", SQL_DB, "-P", SQL_PASS,
        "-i", os.path.join(SQL_DIR, "02_insert_data_azure.sql")
    ], check=True)

    # Verify
    print("[3/3] Verifying...")
    result = subprocess.run([
        "sqlcmd", "-S", SQL_HOST, "-U", SQL_USER, "-d", SQL_DB, "-P", SQL_PASS,
        "-Q", "SELECT 'SQL Customers: ' + CAST(COUNT(*) AS VARCHAR) FROM customers"
    ], capture_output=True, text=True, check=True)
    print(result.stdout)

    print("✓ Azure SQL Server setup complete\n")


def run_postgresql():
    """Setup PostgreSQL"""
    print("=" * 50)
    print("Setting up PostgreSQL")
    print("=" * 50)

    # Create tables
    print("\n[1/3] Creating tables...")
    env = {"PGPASSWORD": PG_PASS, **__import__("os").environ}
    subprocess.run([
        "psql", "-h", PG_HOST, "-U", PG_USER, "-d", PG_DB,
        "-f", os.path.join(SQL_DIR, "01_create_tables.sql")
    ], check=True, env=env)

    # Insert data
    print("[2/3] Inserting data...")
    subprocess.run([
        "psql", "-h", PG_HOST, "-U", PG_USER, "-d", PG_DB,
        "-f", os.path.join(SQL_DIR, "02_insert_data.sql")
    ], check=True, env=env)

    # Verify
    print("[3/3] Verifying...")
    result = subprocess.run([
        "psql", "-h", PG_HOST, "-U", PG_USER, "-d", PG_DB,
        "-c", "SELECT 'PG Customers: ' || count(*) FROM customers;"
    ], capture_output=True, text=True, check=True, env=env)
    print(result.stdout)

    print("✓ PostgreSQL setup complete\n")


def verify_both():
    """Verify both databases have matching data"""
    print("=" * 50)
    print("Final Verification")
    print("=" * 50)

    # SQL Server count
    sql_result = subprocess.run([
        "sqlcmd", "-S", SQL_HOST, "-U", SQL_USER, "-d", SQL_DB, "-P", SQL_PASS,
        "-Q", "SELECT COUNT(*) FROM customers"
    ], capture_output=True, text=True, check=True)

    # PostgreSQL count
    pg_result = subprocess.run([
        "psql", "-h", PG_HOST, "-U", PG_USER, "-d", PG_DB,
        "-c", "SELECT count(*) FROM customers;"
    ], capture_output=True, text=True, check=True, env={"PGPASSWORD": PG_PASS, **__import__("os").environ})

    print(f"\nAzure SQL customers: {sql_result.stdout.strip()}")
    print(f"PostgreSQL customers: {pg_result.stdout.strip()}")
    print("\n✓ All databases verified!")


if __name__ == "__main__":
    try:
        run_sql_server()
        run_postgresql()
        verify_both()
    except subprocess.CalledProcessError as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        sys.exit(1)
