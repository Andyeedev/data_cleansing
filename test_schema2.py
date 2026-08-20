import psycopg2
conn = psycopg2.connect(dbname="migration_engine", user="postgres", host="localhost", password="dev123456")
cur = conn.cursor()

print("=" * 70)
print("core.dataset_mappings source_schema investigation")
print("=" * 70)

# Check cert tenant project
print("\n1. Cert Tenant project (cd738f5f-2be0-4ca1-9762-32c0444c311c):")
cur.execute("""
    SELECT mapping_id, source_schema, source_table, target_schema, target_table
    FROM core.dataset_mappings
    WHERE project_id = %s
    ORDER BY source_schema, source_table
""", ("cd738f5f-2be0-4ca1-9762-32c0444c311c",))
rows = cur.fetchall()
for r in rows:
    print(f"   mapping_id={r[0]}: source_schema='{r[1]}', source_table='{r[2]}', target_schema='{r[3]}', target_table='{r[4]}'")

# Check default tenant project
print("\n2. Default Tenant project (ae40b96c-20da-4972-bb29-bff3c2451ae0):")
cur.execute("""
    SELECT mapping_id, source_schema, source_table, target_schema, target_table
    FROM core.dataset_mappings
    WHERE project_id = %s
    ORDER BY source_schema, source_table
""", ("ae40b96c-20da-4972-bb29-bff3c2451ae0",))
rows = cur.fetchall()
for r in rows:
    print(f"   mapping_id={r[0]}: source_schema='{r[1]}', source_table='{r[2]}', target_schema='{r[3]}', target_table='{r[4]}'")

# Check all dataset_mappings source_schema values
print("\n3. ALL dataset_mappings source_schema values (non-null):")
cur.execute("""
    SELECT DISTINCT source_schema 
    FROM core.dataset_mappings 
    WHERE source_schema IS NOT NULL
    ORDER BY source_schema
""")
rows = cur.fetchall()
for r in rows:
    print(f"   '{r[0]}'")

# Check all source_schema including nulls
print("\n4. ALL dataset_mappings source_schema (including null):")
cur.execute("""
    SELECT DISTINCT source_schema 
    FROM core.dataset_mappings
    ORDER BY source_schema
""")
rows = cur.fetchall()
for r in rows:
    print(f"   {'NULL' if r[0] is None else f'\"{r[0]}\"' }")

cur.close()
conn.close()