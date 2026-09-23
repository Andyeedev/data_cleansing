import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

cur.execute('''
    SELECT * FROM engine.migration_control_exceptions 
    WHERE batch_id = %s 
    ORDER BY created_at DESC LIMIT 200
''', ('0e9e0197-3d54-4273-ad79-cec612318d2a',))
print('Exceptions for E2E batch:', cur.rowcount)
for r in cur.fetchall():
    print(f'  {r}')

cur.execute('''
    SELECT control_id, rule_id, entity_name, execution_status, detail_json
    FROM engine.migration_control_execution 
    WHERE batch_id = %s
    AND execution_status = 'SKIPPED'
    LIMIT 5
''', ('0e9e0197-3d54-4273-ad79-cec612318d2a',))
print('\nSkipped executions with detail_json:')
for r in cur.fetchall():
    print(f'  {r[0]} - {r[1]} - {r[2]} - {r[3]}')
    dj = r[4]
    if dj:
        print(f'    cause: {dj.get("cause")}')
        print(f'    message: {dj.get("message")}')

conn.close()