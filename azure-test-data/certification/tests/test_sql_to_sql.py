#!/usr/bin/env python3
"""
Phase 12: SQL Server → SQL Server Source/Target Testing
Tests the standalone adapter with source and target databases.
"""

import os
#from src.adapter import SQLServerCertificationAdapter

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.adapter import SQLServerCertificationAdapter



def main():
    """Run SQL Server → SQL Server certification tests."""
    
    # Configuration from environment
    source_config = {
        "host": os.getenv("SOURCE_HOST", "sql-certification-test.database.windows.net"),
        "database": os.getenv("SOURCE_DB", "certification_db"),
        "username": os.getenv("SQL_ADMIN_USER", "certadmin"),
        "password": os.getenv("SQL_ADMIN_PASSWORD"),
    }
    
    target_config = {
        "host": os.getenv("TARGET_HOST", "sql-certification-test.database.windows.net"),
        "database": os.getenv("TARGET_DB", "target_db"),
        "username": os.getenv("SQL_ADMIN_USER", "certadmin"),
        "password": os.getenv("SQL_ADMIN_PASSWORD"),
    }

    print("=" * 60)
    print("Phase 12: SQL Server → SQL Server Certification")
    print("=" * 60)

    with SQLServerCertificationAdapter() as adapter:
        # Step 1: Connect to source
        print("\n[1/6] Connecting to source database...")
        if not adapter.connect_sql_login(
            source_config["host"],
            source_config["database"],
            source_config["username"],
            source_config["password"],
            "source"
        ):
            print("FAILED: Could not connect to source")
            return
        print("SUCCESS: Connected to source")

        # Step 2: Connect to target
        print("\n[2/6] Connecting to target database...")
        if not adapter.connect_sql_login(
            target_config["host"],
            target_config["database"],
            target_config["username"],
            target_config["password"],
            "target"
        ):
            print("FAILED: Could not connect to target")
            return
        print("SUCCESS: Connected to target")

        # Step 3: Discover source schema
        print("\n[3/6] Discovering source schema...")
        source_tables = adapter.discover_tables("source")
        print(f"Found {len(source_tables)} tables in source:")
        for table in source_tables:
            print(f"  - {table.schema_name}.{table.table_name} ({len(table.columns)} columns)")

        # Step 4: Discover target schema
        print("\n[4/6] Discovering target schema...")
        target_tables = adapter.discover_tables("target")
        print(f"Found {len(target_tables)} tables in target:")
        for table in target_tables:
            print(f"  - {table.schema_name}.{table.table_name} ({len(table.columns)} columns)")

        # Step 5: Run validation
        print("\n[5/6] Running validation rules...")
        results = []
        
        # Test each source table
        for table in source_tables:
            results.append(adapter.validate_row_count(table.schema_name, table.table_name))
            results.append(adapter.validate_column_count(table.schema_name, table.table_name))
            results.append(adapter.validate_column_names(table.schema_name, table.table_name))
            results.append(adapter.validate_data_types(table.schema_name, table.table_name))

        # Print results
        pass_count = sum(1 for r in results if r.status == "PASS")
        fail_count = sum(1 for r in results if r.status == "FAIL")
        error_count = sum(1 for r in results if r.status == "ERROR")

        print(f"\nValidation Results:")
        print(f"  PASS: {pass_count}")
        print(f"  FAIL: {fail_count}")
        print(f"  ERROR: {error_count}")

        for result in results:
            symbol = "✓" if result.status == "PASS" else "✗" if result.status == "FAIL" else "!"
            print(f"  [{symbol}] {result.rule_name}: {result.details}")

        # Step 6: Summary
        print("\n[6/6] Certification Summary")
        if fail_count == 0 and error_count == 0:
            print("✓ SQL Server → SQL Server flow CERTIFIED")
        else:
            print("✗ Certification incomplete - review failures")


if __name__ == "__main__":
    main()
