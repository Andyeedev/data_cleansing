#!/usr/bin/env python3
"""
Snowflake Certification — JWT Authentication + Discovery + Validation Tests
Mirrors azure-test-data/certification/tests/test_authentication.py but for Snowflake JWT
Least-privilege: MAP_CERT_ROLE, private_key_path outside Terraform
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))
from adapter import SnowflakeCertificationAdapter

ACCOUNT = "IVVRAYS-FS67669"
USER = "MAP_CERT_ADMIN"
ROLE = "MAP_CERT_ROLE"  # least-privilege for certification tests
WAREHOUSE = "MAP_CERT_WH"
SCHEMA = "CERT_SCHEMA"
PRIVATE_KEY_PATH = os.path.join(os.path.dirname(__file__), '..', 'keys', 'rsa_key.p8')
SOURCE_DB = "MAP_CERTIFICATION_SOURCE"
TARGET_DB = "MAP_CERTIFICATION_TARGET"

def test_jwt_source():
    a = SnowflakeCertificationAdapter()
    assert a.connect_jwt(ACCOUNT, USER, PRIVATE_KEY_PATH, ROLE, WAREHOUSE, SOURCE_DB, SCHEMA, "source")
    tables = a.discover_tables("source")
    assert len(tables) >= 10, f"Expected 10 tables, got {len(tables)}"
    print(f"[PASS] JWT source connect + discover {len(tables)} tables")
    a.close()

def test_jwt_target():
    a = SnowflakeCertificationAdapter()
    assert a.connect_jwt(ACCOUNT, USER, PRIVATE_KEY_PATH, ROLE, WAREHOUSE, TARGET_DB, SCHEMA, "target")
    tables = a.discover_tables("target")
    assert len(tables) >= 10
    print(f"[PASS] JWT target connect + discover {len(tables)} tables")
    a.close()

def test_dual_connection_and_validation():
    a = SnowflakeCertificationAdapter()
    assert a.connect_jwt(ACCOUNT, USER, PRIVATE_KEY_PATH, ROLE, WAREHOUSE, SOURCE_DB, SCHEMA, "source")
    assert a.connect_jwt(ACCOUNT, USER, PRIVATE_KEY_PATH, ROLE, WAREHOUSE, TARGET_DB, SCHEMA, "target")
    # Discover
    src_tables = {t.table_name for t in a.discover_tables("source")}
    tgt_tables = {t.table_name for t in a.discover_tables("target")}
    assert src_tables == tgt_tables, f"Table sets differ: {src_tables ^ tgt_tables}"
    print(f"[PASS] Dual discovery table sets match ({len(src_tables)} tables)")
    # Validate each table
    for tbl in sorted(src_tables):
        for rule in [a.validate_row_count, a.validate_column_count, a.validate_column_names, a.validate_data_types]:
            r = rule(SCHEMA, tbl)
            assert r.status == "PASS", f"{tbl} {r.rule_name} {r.status}: {r.details}"
        print(f"[PASS] {tbl} all validations PASS")
    a.close()
    print("[PASS] Dual connection + full validation PASS (exact match baseline)")

if __name__ == "__main__":
    test_jwt_source()
    test_jwt_target()
    test_dual_connection_and_validation()
    print("All Snowflake JWT certification tests PASSED with MAP_CERT_ROLE")
