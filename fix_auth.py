import psycopg2

conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
cur = conn.cursor()

# Check user_roles schema
cur.execute("""
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_schema='platform' AND table_name='user_roles' ORDER BY ordinal_position
""")
print("user_roles columns:", cur.fetchall())

# Step 1: Assign Super Admin role to admin user
cur.execute("""
    INSERT INTO platform.user_roles (user_id, role_id)
    VALUES ('00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001')
    ON CONFLICT DO NOTHING
""")
conn.commit()
print("Step 1: Assigned Super Admin role")

# Step 2: Verify
cur.execute("""
    SELECT r.name FROM platform.user_roles ur
    JOIN platform.roles r ON ur.role_id = r.id
    WHERE ur.user_id = '00000000-0000-0000-0000-000000000001'
""")
print("Roles:", cur.fetchall())

conn.close()
