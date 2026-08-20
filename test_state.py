import psycopg2
conn = psycopg2.connect(dbname="migration_engine", user="postgres", host="localhost", password="dev123456")
cur = conn.cursor()

project_id = "cd738f5f-2be0-4ca1-9762-32c0444c311c"

# Check current rule_dataset_mapping count
cur.execute("""
    SELECT COUNT(*) as total_mappings
    FROM core.rule_dataset_mapping rdm
    JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
    WHERE dm.project_id = %s AND rdm.is_active = TRUE
""", (project_id,))
count = cur.fetchone()[0]
print(f"Total active rule_dataset_mappings for project {project_id}: {count}")

# Show all rule IDs and their source tables
cur.execute("""
    SELECT rdm.rule_id, dm.source_table, rdm.is_active
    FROM core.rule_dataset_mapping rdm
    JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
    WHERE dm.project_id = %s AND rdm.is_active = TRUE
    ORDER BY rdm.rule_id, dm.source_table
""", (project_id,))
mappings = cur.fetchall()
print(f"\nRule mappings detail for project {project_id}:")
for m in mappings:
    print(f"  {m[0]} -> {m[1]} (active: {m[2]})")

# Check which rules are missing (which enabled rules are NOT mapped)
cur.execute("""
    SELECT r.rule_id, r.rule_name
    FROM engine.rule_registry r
    WHERE r.enabled_flag = TRUE
    ORDER BY r.rule_id
""")
enabled_rules = cur.fetchall()
print(f"\nEnabled rules in registry ({len(enabled_rules)}):")
for r in enabled_rules:
    print(f"  {r[0]} - {r[1]}")

# Check which enabled rules are NOT mapped for this project
cur.execute("""
    SELECT r.rule_id
    FROM engine.rule_registry r
    WHERE r.enabled_flag = TRUE
    AND NOT EXISTS (
        SELECT 1 FROM core.rule_dataset_mapping rdm
        JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
        WHERE rdm.rule_id = r.rule_id
        AND dm.project_id = %s AND rdm.is_active = TRUE
    )
""", (project_id,))
missing_rules = cur.fetchall()
print(f"\nEnabled rules NOT mapped for project {project_id} ({len(missing_rules)}):")
for r in missing_rules:
    print(f"  {r[0]}")

cur.close()
conn.close()