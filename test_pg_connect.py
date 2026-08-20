import psycopg2
import sys

print("=" * 60)
print("Testing PostgreSQL Connections")
print("=" * 60)

# Test 1: Source DB (migration_source)
print("\n1. Testing Source DB: migration_source")
try:
    conn = psycopg2.connect(
        dbname="migration_source",
        user="postgres",
        host="localhost",
        port=5432,
        password="dev123456"
    )
    cur = conn.cursor()
    cur.execute("SELECT current_database(), current_user")
    db_info = cur.fetchone()
    print(f"   Connected! Database: {db_info[0]}, User: {db_info[1]}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"   Failed: {e}")

# Test 2: Target DB (migration_target)
print("\n2. Testing Target DB: migration_target")
try:
    conn = psycopg2.connect(
        dbname="migration_target",
        user="postgres",
        host="localhost",
        port=5432,
        password="dev123456"
    )
    cur = conn.cursor()
    cur.execute("SELECT current_database(), current_user")
    db_info = cur.fetchone()
    print(f"   Connected! Database: {db_info[0]}, User: {db_info[1]}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"   Failed: {e}")

print("\n" + "=" * 60)
print("PostgreSQL tests complete")
print("=" * 60)