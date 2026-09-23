import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

cur.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'users'")
print('users table:', cur.fetchall())

conn.close()