import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()
cur.execute("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_schema='engine' AND table_name='migration_control_exceptions'")
for r in cur.fetchall():
    print(r)
conn.close()