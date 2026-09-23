import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
with conn.cursor() as cur:
    cur.execute("SELECT email, status FROM platform.users WHERE email = %s", ('admin@mapnexus.com',))
    row = cur.fetchone()
    print("User found:", row)
    
    # Check tenants
    cur.execute("SELECT tenant_id, status FROM core.tenants")
    rows = cur.fetchall()
    print("Tenants:", rows)