import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

batch_id = '8408ae22-387f-46dc-a724-0804e32ccc56'

cur.execute('''
    SELECT control_id, rule_id, entity_name, execution_status, detail_json
    FROM engine.migration_control_execution
    WHERE batch_id = %s
    AND control_id IN ('C01', 'C02', 'C03', 'C04', 'C08', 'C09')
    ORDER BY control_id, rule_id
''', (batch_id,))
rows = cur.fetchall()
print(f'Total rows: {len(rows)}')
for r in rows:
    print(f'  {r[0]}/{r[1]} on {r[2]}: {r[3]}')
    if r[4]:
        dj = r[4]
        if isinstance(dj, dict):
            rc = dj.get('relevant_columns')
            if rc:
                print(f'  RELEVANT COLUMNS: {rc}')
            elif dj.get('cause'):
                print(f'  cause: {dj.get("cause")}')

# Check control summary
cur.execute('''
    SELECT control_id, overall_status, total_rules, passed_rules, failed_rules, skipped_rules
    FROM engine.migration_control_summary
    WHERE batch_id = %s
    ORDER BY control_id
''', (batch_id,))
print('\nControl Summary:')
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]} (total={r[2]}, passed={r[3]}, failed={r[4]}, skipped={r[5]})')

conn.close()