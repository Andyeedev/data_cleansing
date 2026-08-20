import psycopg2
conn = psycopg2.connect(dbname="migration_engine", user="postgres", host="localhost", password="dev123456")
cur = conn.cursor()

# Cert tenant project
cert_project = "cd738f5f-2be0-4ca1-9762-32c0444c311c"
print(f"=== Cert Tenant Systems (project_id: {cert_project}) ===\n")

cur.execute("""
    SELECT system_id, system_name, system_role, credential_id, connection_config
    FROM core.system_registry
    WHERE project_id = %s
    ORDER BY system_role, system_name
""", (cert_project,))
systems = cur.fetchall()
for s in systems:
    print(f"  system_id: {s[0]}")
    print(f"  system_name: {s[1]}")
    print(f"  system_role: {s[2]}")
    print(f"  credential_id: {s[3]}")
    print(f"  connection_config: {s[4]}")
    print()

# Default tenant project
default_project = "ae40b96c-20da-4972-bb29-bff3c2451ae0"
print(f"=== Default Tenant Systems (project_id: {default_project}) ===\n")

cur.execute("""
    SELECT system_id, system_name, system_role, credential_id, connection_config
    FROM core.system_registry
    WHERE project_id = %s
    ORDER BY system_role, system_name
""", (default_project,))
systems = cur.fetchall()
for s in systems:
    print(f"  system_id: {s[0]}")
    print(f"  system_name: {s[1]}")
    print(f"  system_role: {s[2]}")
    print(f"  credential_id: {s[3]}")
    print(f"  connection_config: {s[4]}")
    print()

cur.close()
conn.close()