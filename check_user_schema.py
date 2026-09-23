import psycopg2
conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()
cur.execute("""
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_name = 'users' AND table_schema = 'platform'
    ORDER BY ordinal_position
""")
for row in cur.fetchall():
    print(row)
conn.close()