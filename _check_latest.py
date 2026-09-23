import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

batch_id = '9e141d41-a8ad-4afc-8537-3976f8462124'

cur.execute('''
    SELECT control_id, overall_status, total_rules, passed_rules, failed_rules, skipped_rules
    FROM engine.migration_control_summary
    WHERE batch_id = %s
    ORDER BY control_id
''', (batch_id,))
print('Control Summary:')
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]} (total={r[2]}, passed={r[3]}, failed={r[4]}, skipped={r[5]})')

cur.execute('''
    SELECT control_id, rule_id, entity_name, execution_status, detail_json
    FROM engine.migration_control_execution
    WHERE batch_id = %s
    AND control_id = 'C01'
    ORDER BY rule_id
''', (batch_id,))
print('\nC01 Execution:')
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

cur.execute('''
    SELECT control_id, rule_id, entity_name, execution_status, detail_json
    FROM engine.migration_control_execution
    WHERE batch_id = %s
    AND control_id = 'C02'
    ORDER BY rule_id
''', (batch_id,))
print('\nC02 Execution (first 3):')
for r in cur.fetchall()[:3]:
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