import psycopg2

conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()

# Add list_price column
cur.execute('ALTER TABLE platform.plans ADD COLUMN IF NOT EXISTS list_price NUMERIC(10,2)')
conn.commit()

# Verify
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'plans' AND table_schema = 'platform'")
print(cur.fetchall())

conn.close()