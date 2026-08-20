"""Native diagnostic: runs the engine's REAL test_connection for every SQL Server system.

The engine runs natively (Docker is not involved), so run this from the project
root using the SAME Python/venv and environment the engine uses:

    python scripts/diag_test_connection.py

It prints:
  - whether DATABASE_URL / FERNET_KEY are set
  - the ODBC drivers installed on THIS host (proves driver presence)
  - the raw result or full exception for each SQL Server system
"""
import os
import sys
import json
import traceback


def main():
    print("DATABASE_URL set :", bool(os.environ.get("DATABASE_URL")))
    print("FERNET_KEY set   :", bool(os.environ.get("FERNET_KEY")))

    try:
        import pyodbc
        print("Host ODBC drivers:", pyodbc.drivers())
    except Exception as e:
        print("pyodbc import failed:", repr(e))
        return

    try:
        from app.db.connection import get_db_connection
        from app.services.system_service import SystemService
    except Exception as e:
        print("Failed to import engine modules:", repr(e))
        traceback.print_exc()
        return

    try:
        db = get_db_connection()
    except Exception as e:
        print("Metadata DB connection failed:", repr(e))
        traceback.print_exc()
        return

    svc = SystemService(db.conn)
    cur = db.conn.cursor()
    cur.execute(
        "SELECT system_id, system_name, database_type "
        "FROM core.system_registry WHERE LOWER(database_type)='sqlserver'"
    )
    rows = cur.fetchall()
    print("SQL Server systems:", rows)

    for system_id, name, dbtype in rows:
        print("\n=== Testing:", name, system_id, "===")
        try:
            res = svc.test_connection(system_id)
            print("RESULT:", json.dumps(res, default=str, indent=2))
        except Exception as e:
            print("EXCEPTION:", repr(e))
            traceback.print_exc()


if __name__ == "__main__":
    main()
