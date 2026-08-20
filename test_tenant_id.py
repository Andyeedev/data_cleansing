import psycopg2
conn = psycopg2.connect(dbname="migration_engine", user="postgres", host="localhost", password="dev123456")
cur = conn.cursor()

# Check cert tenant's systems with their tenant_id
cert_project = "cd738f5f-2be0-4ca1-9762-32c0444c311c"
print(f"=== Cert Tenant Systems ===")
cur.execute("""
    SELECT system_id, system_name, tenant_id
    FROM core.system_registry
    WHERE project_id = %s
    ORDER BY system_name
""", (cert_project,))
systems = cur.fetchall()
for s in systems:
    print(f"  {s[1]}: system_id={s[0]}, tenant_id={s[2]}")

# Check default tenant's systems with their tenant_id
default_project = "ae40b96c-20da-4972-bb29-bff3c2451ae0"
print(f"\n=== Default Tenant Systems ===")
cur.execute("""
    SELECT system_id, system_name, tenant_id
    FROM core.system_registry
    WHERE project_id = %s
    ORDER BY system_name
""", (default_project,))
systems = cur.fetchall()
for s in systems:
    print(f"  {s[1]}: system_id={s[0]}, tenant_id={s[2]}")

# Check all tenants to see the mapping
print(f"\n=== All Tenants ===")
cur.execute("""
    SELECT tenant_id, tenant_name FROM core.tenants ORDER BY tenant_id
""")
tenants = cur.fetchall()
for t in tenants:
    print(f"  {t[0]}: {t[1]}")

# Check projects with tenant_id
print(f"\n=== Projects ===")
cur.execute("""
    SELECT project_id, tenant_id, project_name FROM core.projects ORDER BY project_id
""")
projects = cur.fetchall()
for p in projects:
    print(f"  {p[1]}: project={p[2]}, tenant_id={p[0]}")

cur.close()
conn.close()