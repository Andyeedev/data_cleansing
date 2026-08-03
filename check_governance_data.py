import psycopg2

conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
cur = conn.cursor()

print("=== Exceptions: failure_scope values ===")
cur.execute("SELECT failure_scope, COUNT(*) FROM engine.migration_control_exceptions GROUP BY failure_scope ORDER BY COUNT(*) DESC")
for row in cur.fetchall():
    print(f"  {row[0]}: {row[1]} rows")

print("\n=== Release Decisions: gate_result values ===")
cur.execute("SELECT gate_result, COUNT(*) FROM engine.migration_release_decision GROUP BY gate_result ORDER BY COUNT(*) DESC")
for row in cur.fetchall():
    print(f"  {row[0]}: {row[1]} rows")

print("\n=== Control Execution: execution_status values ===")
cur.execute("SELECT execution_status, COUNT(*) FROM engine.migration_control_execution GROUP BY execution_status ORDER BY COUNT(*) DESC")
for row in cur.fetchall():
    print(f"  {row[0]}: {row[1]} rows")

print("\n=== Control Summary columns ===")
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_schema='engine' AND table_name='migration_control_summary' ORDER BY ordinal_position")
for row in cur.fetchall():
    print(f"  {row[0]}")

print("\n=== Control Summary sample ===")
cur.execute("SELECT * FROM engine.migration_control_summary LIMIT 3")
rows = cur.fetchall()
colnames = [desc[0] for desc in cur.description]
print(f"  Columns: {colnames}")
for row in rows:
    print(f"  {row}")

conn.close()
