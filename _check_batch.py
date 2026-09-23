import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

batch_id = '78aeb4ad-750c-4366-b7d2-988db72e0334'

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
    AND control_id = 'C02'
    ORDER BY rule_id
''', (batch_id,))
print()
print('C02 Execution Details:')
for r in cur.fetchall():
    print(f'  {r[0]}/{r[1]} on {r[2]}: {r[3]}')
    if r[4]:
        dj = r[4]
        if isinstance(dj, dict):
            print('    cause:', dj.get('cause'))
            msg = dj.get('message', '')
            if len(msg) > 100:
                msg = msg[:100] + '...'
            print('    message:', msg)
            print('    delta:', dj.get('delta'))

cur.execute('''
    SELECT control_id, rule_id, entity_name, cause, failure_scope
    FROM engine.migration_control_exceptions
    WHERE batch_id = %s
''', (batch_id,))
print()
print('Exceptions:')
for r in cur.fetchall():
    print(f'  {r[0]}/{r[1]} on {r[2]}: cause={r[3]}, scope={r[4]}')

conn.close()