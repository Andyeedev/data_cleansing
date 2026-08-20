import psycopg2
conn = psycopg2.connect(dbname="migration_engine", user="postgres", host="localhost", password="dev123456")
cur = conn.cursor()

# Get projects
cur.execute("SELECT project_id, tenant_id FROM core.projects ORDER BY project_id")
rows = cur.fetchall()
print("Projects:")
for r in rows:
    print(f"  {r}")

# Get tenants
cur.execute("SELECT tenant_id, tenant_name FROM core.tenants ORDER BY tenant_id")
tenants = cur.fetchall()
print("\nTenants:")
for r in tenants:
    print(f"  {r}")

# Get dataset mappings for each project
for project_id, tenant_id in rows:
    cur.execute("SELECT mapping_id, source_system_id, source_schema, source_table, target_system_id FROM core.dataset_mappings WHERE project_id = %s AND is_active = TRUE", (project_id,))
    mappings = cur.fetchall()
    print(f"\nProject {project_id} (tenant {tenant_id}): {len(mappings)} active mappings")
    for m in mappings[:3]:  # Show first 3
        print(f"  {m}")

cur.close()
conn.close()