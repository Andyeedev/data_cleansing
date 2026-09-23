import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

# Check ALL data_type values from SOURCE columns in both mappings
cur.execute('''
    SELECT mapping_id, column_name, column_side, data_type, inferred_role
    FROM core.dataset_columns 
    WHERE mapping_id IN ('942d130a-bc03-4706-9ccd-cc81e66a6303', 'e972a56d-3b1f-4178-ae9c-3b245a11214d')
    AND column_side = 'SOURCE'
    ORDER BY mapping_id, column_name
''')
for r in cur.fetchall():
    print(f'mapping={r[0]}, col={r[1]}, side={r[2]}, data_type="{r[3]}", role={r[4]}')

conn.close()