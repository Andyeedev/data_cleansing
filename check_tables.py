import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
with conn.cursor() as cur:
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema IN ('platform', 'core') ORDER BY table_schema, table_name")
    for row in cur.fetchall():
        print(row[0])