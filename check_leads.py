import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
with conn.cursor() as cur:
    cur.execute('SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = \'core\' AND table_name = \'leads\' ORDER BY ordinal_position')
    for row in cur.fetchall():
        print(row)