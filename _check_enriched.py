import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

batch_id = '6eb3f1a5-5f13-44e8-9b6c-2e5674e76c09'

# Check C02 execution details with enriched logging
cur.execute('''
    SELECT control_id, rule_id, entity_name, execution_status, detail_json
    FROM engine.migration_control_execution
    WHERE batch_id = %s
    AND control_id = 'C02'
    ORDER BY rule_id
''', (batch_id,))
print('C02 Execution Details:')
for r in cur.fetchall():
    print(f'  {r[0]}/{r[1]} on {r[2]}: {r[3]}')
    if r[4]:
        dj = r[4]
        if isinstance(dj, dict):
            print('    cause:', dj.get('cause'))
            print('    message:', dj.get('message', '')[:150])
            print('    delta:', dj.get('delta'))
            rc = dj.get('relevant_columns')
            if rc:
                print('    RELEVANT COLUMNS:', rc)

# Also check C01, C08, C03, C04
for ctrl in ['C01', 'C08', 'C03', 'C04']:
    cur.execute('''
        SELECT control_id, rule_id, entity_name, execution_status, detail_json
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        AND control_id = %s
        ORDER BY rule_id
    ''', (batch_id, ctrl))
    print(f'\n{ctrl} Execution Details:')
    for r in cur.fetchall():
        print(f'  {r[0]}/{r[1]} on {r[2]}: {r[3]}')
        if r[4]:
            dj = r[4]
            if isinstance(dj, dict):
                rc = dj.get('relevant_columns')
                if rc:
                    print(f'    RELEVANT COLUMNS: {rc}')
                elif dj.get('cause'):
                    print(f'    cause: {dj.get("cause")}')

conn.close()