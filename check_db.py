import psycopg2

conn = psycopg2.connect(
    host='localhost',
    port=5432,
    database='migration_engine',
    user='postgres',
    password='dev123456'
)
cur = conn.cursor()

cur.execute("""
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'engine' 
    AND table_name IN ('schedule_execution_log', 'migration_schedules')
""")
tables = cur.fetchall()
print('Engine tables found:', tables)

for t in tables:
    cur.execute('SELECT COUNT(*) FROM engine.{}'.format(t[0]))
    count = cur.fetchone()
    print('  {} rows: {}'.format(t[0], count[0]))

if any(t[0] == 'schedule_execution_log' for t in tables):
    cur.execute('SELECT execution_id, schedule_id, batch_id, status, started_at, triggered_by FROM engine.schedule_execution_log LIMIT 5')
    rows = cur.fetchall()
    print('\nSample schedule_execution_log:')
    for r in rows:
        print('  id={}, schedule={}, batch={}, status={}, started={}, triggered={}'.format(r[0], r[1], r[2], r[3], r[4], r[5]))

if any(t[0] == 'migration_schedules' for t in tables):
    cur.execute('SELECT schedule_id, project_id, tenant_id, name, status FROM engine.migration_schedules LIMIT 5')
    rows = cur.fetchall()
    print('\nSample migration_schedules:')
    for r in rows:
        print('  id={}, project={}, tenant={}, name={}, status={}'.format(r[0], r[1], r[2], r[3], r[4]))

cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'core' AND table_name = 'projects'")
if cur.fetchone():
    cur.execute('SELECT COUNT(*) FROM core.projects')
    count = cur.fetchone()
    print('\ncore.projects rows: {}'.format(count[0]))
else:
    print('\ncore.projects table NOT FOUND')

conn.close()
