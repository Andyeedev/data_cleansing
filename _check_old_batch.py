import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

cur.execute('''
    SELECT control_id, rule_id, entity_name, execution_status, detail_json
    FROM engine.migration_control_execution
    WHERE batch_id = '78aeb4ad-750c-4366-b7d2-988db72e0334'
    AND control_id = 'C02'
    ORDER BY rule_id
''')
print('Previous batch (78aeb4ad) C02:')
for r in cur.fetchall():
    print(f'  {r[0]}/{r[1]} on {r[2]}: {r[3]}')
    if r[4]:
        dj = r[4]
        if isinstance(dj, dict):
            rc = dj.get('relevant_columns')
            if rc:
                print('  RELEVANT COLUMNS:', rc)
            elif dj.get('cause'):
                print('  cause:', dj.get('cause'))

conn.close()