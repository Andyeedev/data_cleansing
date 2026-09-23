import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
with conn.cursor() as cur:
    # Check email_verifications table exists
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_name = 'email_verifications' AND table_schema = 'platform'")
    print('Table exists:', cur.fetchone() is not None)
    
    # Check backfill
    cur.execute("SELECT id, email, email_verified, status FROM platform.users WHERE status = 'active'")
    rows = cur.fetchall()
    for r in rows:
        print(f'id={r[0]} email={r[1]} verified={r[2]} status={r[3]}')