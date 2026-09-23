import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

cur.execute('''
    SELECT mapping_id, source_table, target_table, created_at
    FROM core.dataset_mappings 
    WHERE project_id = '819ee182-288f-4aff-a3bd-4b9459d4ba61'
    ORDER BY created_at
''')
for r in cur.fetchall():
    print(f'mapping={r[0]}, table={r[1]}, created={r[3]}')

cur.execute("SELECT * FROM core.discovery_logs ORDER BY created_at DESC LIMIT 10")
print('\nDiscovery logs:')
for r in cur.fetchall():
    print(r)

conn.close()