import psycopg2, os, uuid
from dotenv import load_dotenv
load_dotenv()
conn = psycopg2.connect(host=os.getenv('ENGINE_DB_HOST'), port=os.getenv('ENGINE_DB_PORT'), database=os.getenv('ENGINE_DB_NAME'), user=os.getenv('ENGINE_DB_USER'), password=os.getenv('ENGINE_DB_PASS'))
conn.autocommit = True
cur = conn.cursor()

cur.execute("SELECT * FROM core.tenants LIMIT 5")
cols = [d[0] for d in cur.description]
print(f"Columns: {cols}")
for r in cur.fetchall():
    print(f"  {r}")

# Create 2 new tenants
tenant2_id = uuid.uuid4()
tenant3_id = uuid.uuid4()

cur.execute("INSERT INTO core.tenants (tenant_id, tenant_name, status, created_at) VALUES (%s::uuid, %s, 'ACTIVE', NOW())", (str(tenant2_id), "Client One"))
print(f"\nCreated tenant: Client One ({tenant2_id})")

cur.execute("INSERT INTO core.tenants (tenant_id, tenant_name, status, created_at) VALUES (%s::uuid, %s, 'ACTIVE', NOW())", (str(tenant3_id), "Client Two"))
print(f"Created tenant: Client Two ({tenant3_id})")

# Create users for new tenants
pw_hash = "$2b$12$mSsJShywM9uld/Kv4Nw.JeHOICvfmZGbxlofIfFHGYCx7Jj1Txpau"

for email, first, last, tenant_id in [
    ("client1@mapnexus.com", "Client", "One", tenant2_id),
    ("client2@mapnexus.com", "Client", "Two", tenant3_id),
]:
    user_id = uuid.uuid4()
    cur.execute("""
        INSERT INTO platform.users (id, email, email_verified, password_hash, first_name, last_name, display_name, status, tenant_id, created_at, updated_at)
        VALUES (%s::uuid, %s, false, %s, %s, %s, %s, 'active', %s::uuid, NOW(), NOW())
    """, (str(user_id), email, pw_hash, first, last, f"{first} {last}", str(tenant_id)))
    print(f"  Created user: {email}")

# Create projects for new tenants
for proj_name, status, tenant_id in [
    ("Client1 Migration Alpha", "ACTIVE", tenant2_id),
    ("Client1 Migration Beta", "COMPLETED", tenant2_id),
    ("Client2 Data Transfer", "ACTIVE", tenant3_id),
    ("Client2 Legacy Sync", "PAUSED", tenant3_id),
]:
    proj_id = uuid.uuid4()
    cur.execute("""
        INSERT INTO core.projects (project_id, tenant_id, project_name, project_type, status, created_at)
        VALUES (%s::uuid, %s::uuid, %s, 'MIGRATION', %s, NOW())
    """, (str(proj_id), str(tenant_id), proj_name, status))
    print(f"  Created project: {proj_name}")

# Verify
print("\n=== All tenants in core.tenants ===")
cur.execute("SELECT tenant_id, tenant_name, status FROM core.tenants")
for r in cur.fetchall():
    print(f"  {r[1]} | {r[0]} | {r[2]}")

print("\n=== All projects ===")
cur.execute("SELECT project_name, status FROM core.projects WHERE project_type='MIGRATION' ORDER BY project_name")
for r in cur.fetchall():
    print(f"  {r[0]} | {r[1]}")

cur.close()
conn.close()
