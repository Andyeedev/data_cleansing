import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name LIKE '%doc%' OR table_name LIKE '%lifecycle%' OR table_name LIKE '%e2e%' OR table_name LIKE '%map%') ORDER BY table_name")
print('Tables:', cur.fetchall())

conn.close()