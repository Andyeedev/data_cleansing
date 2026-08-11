import psycopg2

conn = psycopg2.connect(
    host='localhost', port=5432,
    database='migration_engine', user='postgres', password='dev123456'
)
cur = conn.cursor()

# Query 1: Summary (no tenant filter)
print('=== QUERY 1: Timeline Summary (no tenant) ===')
cur.execute("""
    SELECT
        COUNT(CASE WHEN status = 'running' THEN 1 END) as running,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled
    FROM engine.schedule_execution_log
""")
row = cur.fetchone()
print(f'  running={row[0]}, completed={row[1]}, failed={row[2]}, scheduled={row[3]}')

# Query 2: Timeline data (no tenant filter)
print('\n=== QUERY 2: Timeline Data (no tenant, limit=5) ===')
cur.execute("""
    SELECT
        sel.execution_id,
        sel.schedule_id,
        sel.batch_id,
        sel.status,
        sel.started_at,
        sel.completed_at,
        sel.duration_seconds,
        sel.terminal_output,
        sel.error_message,
        sel.exit_code,
        sel.triggered_by,
        sel.created_at,
        p.project_name
    FROM engine.schedule_execution_log sel
    LEFT JOIN engine.migration_schedules s ON sel.schedule_id::text = s.schedule_id::text
    LEFT JOIN core.projects p ON s.project_id::text = p.project_id::text
    ORDER BY sel.started_at DESC
    LIMIT 5
""")
rows = cur.fetchall()
print(f'  Returned {len(rows)} rows')
for r in rows:
    print(f'  id={r[0]}, batch={r[2]}, status={r[3]}, project={r[12]}')

conn.close()
print('\nDone - queries work correctly.')
