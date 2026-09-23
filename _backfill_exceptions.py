import psycopg2
import json
from datetime import datetime

conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

batch_id = '0e9e0197-3d54-4273-ad79-cec612318d2a'

cur.execute('''
    SELECT control_id, rule_id, entity_name, execution_status, detail_json, created_at
    FROM engine.migration_control_execution 
    WHERE batch_id = %s
    AND execution_status IN ('SKIPPED', 'FAIL', 'ERROR')
''', (batch_id,))

rows = cur.fetchall()
print(f'Found {len(rows)} executions to convert to exceptions')

for row in rows:
    control_id, rule_id, entity_name, execution_status, detail_json, created_at = row
    
    cause = None
    message = None
    source_value = None
    target_value = None
    delta_value = None
    
    if detail_json and isinstance(detail_json, dict):
        cause = detail_json.get('cause')
        message = detail_json.get('message')
        source_value = detail_json.get('source_system')
        target_value = detail_json.get('target_system')
        delta_value = detail_json.get('delta')
    
    # Map to shorter failure_scope values (max 20 chars)
    if cause in ('NO_NUMERIC_COLUMN', 'NO_NUMERIC_COLUMNS'):
        failure_scope = 'metric_calc'
    elif cause in ('NO_PRIMARY_KEY',):
        failure_scope = 'pk_missing'
    elif cause in ('NO_FK_METADATA',):
        failure_scope = 'fk_missing'
    else:
        failure_scope = 'rule_skip'
    
    cur.execute('''
        INSERT INTO engine.migration_control_exceptions (
            batch_id, control_id, rule_id, entity_name,
            source_value, target_value, delta_value,
            cause, failure_scope, created_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
    ''', (
        batch_id, control_id, rule_id, entity_name,
        source_value or 'N/A', target_value or 'N/A', 
        str(delta_value) if delta_value is not None else '0',
        cause, failure_scope, created_at
    ))
    print(f'  Inserted: {control_id} / {rule_id} on {entity_name} - cause={cause}, scope={failure_scope}')

conn.commit()
print('\nDone! Verifying...')

cur.execute('SELECT control_id, rule_id, entity_name, cause, failure_scope FROM engine.migration_control_exceptions WHERE batch_id = %s', (batch_id,))
for r in cur.fetchall():
    print(f'  {r[0]} / {r[1]} on {r[2]} - cause={r[3]}, scope={r[4]}')

conn.close()