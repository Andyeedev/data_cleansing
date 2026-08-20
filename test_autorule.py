import sys
sys.path.insert(0, '.')

from app.db.connection import get_db_connection
import psycopg2

# Connect to engine_db for rule registry and migration_engine for data
engine_db = get_db_connection()

project_id = "cd738f5f-2be0-4ca1-9762-32c0444c311c"

print(f"=== Auto Discovery Rule Inference for project: {project_id} ===\n")

# Step 1: Get dataset mappings for this project (from engine_db)
# engine_db.execute returns a list of tuples
query = """
SELECT mapping_id, source_schema, source_table, source_system_id, target_system_id
FROM core.dataset_mappings
WHERE project_id = %s
AND is_active = TRUE
"""
mappings = engine_db.execute(query, (project_id,))
print(f"Found {len(mappings)} active dataset mappings")

# Step 2: Get enabled rules from rule_registry
rule_query = """
SELECT rule_id, rule_name, enabled_flag
FROM engine.rule_registry
WHERE enabled_flag = TRUE
"""
enabled_rules = engine_db.execute(rule_query)
rule_ids = [r[0] for r in enabled_rules]
print(f"Found {len(rule_ids)} enabled rules: {rule_ids}")

# Step 3: For each mapping, get columns and infer rules
# We need to query dataset_columns from engine_db
all_inserted = 0

for mapping in mappings:
    mapping_id = mapping[0]  # tuple index
    source_system_id = mapping[3]
    source_schema = mapping[1]
    source_table = mapping[2]
    
    print(f"\n--- Processing mapping: {mapping_id} (table: {source_table}) ---")
    
    # Get columns from dataset_columns
    col_query = """
    SELECT column_name, inferred_role, data_type
    FROM core.dataset_columns
    WHERE mapping_id = %s
    """
    columns = engine_db.execute(col_query, (mapping_id,))
    print(f"  Columns: {len(columns)}")
    
    # Infer rules based on column roles and data types (same logic as _infer_rules)
    rules = set()
    
    for column in columns:
        inferred_role = column[1]
        data_type = column[2]
        
        if inferred_role == "PRIMARY_KEY":
            rules.add("C01_ROWCOUNT")
            rules.add("C03_REFERENTIAL")
            rules.add("C07_DUPLICATE_DETECTION")
        
        if inferred_role == "NUMERIC_METRIC":
            rules.add("C02_BALANCE_RECON")
            rules.add("C08_DATA_DRIFT")
        
        if inferred_role == "FOREIGN_KEY":
            rules.add("C09_REFERENTIAL_COVERAGE")
        
        if data_type and isinstance(data_type, str) and "date" in data_type.lower():
            rules.add("C05_NULL_CHECK")
    
    # Structural checks always run
    rules.add("C04_COLUMN_COUNT")
    rules.add("C06_DATA_TYPE_MATCH")
    rules.add("C010_SCHEMA_DRIFT")
    
    print(f"  Inferred rules: {sorted(rules)}")
    
    # Step 5: Register each rule (same logic as _register_rule)
    for rule_id in rules:
        # Ensure rule exists and is enabled
        rule_check = """
        SELECT 1
        FROM engine.rule_registry
        WHERE rule_id = %s
        AND enabled_flag = TRUE
        """
        rule_exists = engine_db.execute(rule_check, (rule_id,))
        
        if not rule_exists:
            print(f"    Skipping {rule_id} - not enabled in rule_registry")
            continue
        
        # Prevent duplicate mapping
        check_query = """
        SELECT 1
        FROM core.rule_dataset_mapping
        WHERE rule_id = %s
        AND mapping_id = %s
        """
        exists = engine_db.execute(check_query, (rule_id, mapping_id))
        
        if exists:
            print(f"    Skipping {rule_id} - already mapped to {mapping_id}")
            continue
        
        # Insert the mapping
        insert_query = """
        INSERT INTO core.rule_dataset_mapping
        (rule_id, mapping_id, is_active)
        VALUES (%s, %s, TRUE)
        """
        engine_db.execute(insert_query, (rule_id, mapping_id))
        print(f"    ✅ Inserted {rule_id} -> {mapping_id}")
        all_inserted += 1

# Commit all changes
engine_db.commit()

print(f"\n=== Summary ===")
print(f"Total new rule_dataset_mapping entries inserted: {all_inserted}")

# Verify the results using psycopg2
conn = psycopg2.connect(dbname="migration_engine", user="postgres", host="localhost", password="dev123456")
cur = conn.cursor()

cur.execute("""
    SELECT COUNT(*) as total_mappings
    FROM core.rule_dataset_mapping rdm
    JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
    WHERE dm.project_id = %s AND rdm.is_active = TRUE
""", (project_id,))
count = cur.fetchone()[0]
print(f"Total active rule_dataset_mappings for project {project_id}: {count}")

# Show all rule IDs inserted
cur.execute("""
    SELECT rdm.rule_id, dm.source_table, COUNT(*) as cnt
    FROM core.rule_dataset_mapping rdm
    JOIN core.dataset_mappings dm ON rdm.mapping_id = dm.mapping_id
    WHERE dm.project_id = %s AND rdm.is_active = TRUE
    GROUP BY rdm.rule_id, dm.source_table
    ORDER BY rdm.rule_id
""", (project_id,))
mappings = cur.fetchall()
print(f"\nRule mappings detail for project {project_id}:")
for m in mappings:
    print(f"  {m[0]} -> {m[1]}: {m[2]} mappings")

cur.close()
conn.close()

engine_db.close()
print("\n✅ Process completed successfully")