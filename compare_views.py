import psycopg2

conn = psycopg2.connect(
    host='localhost', port=5432, dbname='migration_engine',
    user='postgres', password='dev123456', connect_timeout=5
)
cur = conn.cursor()

print('=== Comparison of candidate views for Risk Score source ===')
print()

# Test v_dataset_risk_index
cur.execute('SELECT count(*) FROM engine.v_dataset_risk_index;')
print(f'v_dataset_risk_index rows: {cur.fetchone()[0]}')
cur.execute('SELECT * FROM engine.v_dataset_risk_index;')
rows = cur.fetchall()
desc = [d[0] for d in cur.description]
print(f'  Columns: {desc}')
for r in rows:
    print(f'  {r}')
print()

# Test v_dataset_risk_heatmap
cur.execute('SELECT count(*) FROM engine.v_dataset_risk_heatmap;')
print(f'v_dataset_risk_heatmap rows: {cur.fetchone()[0]}')
print()

# Test v_batch_risk_index (proposed new view)
cur.execute("SELECT viewname FROM pg_views WHERE schemaname = 'engine' AND viewname = 'v_batch_risk_index';")
exists = cur.fetchone()
print(f'v_batch_risk_index exists: {exists is not None}')
if not exists:
    print('  (view not yet created, testing equivalent query directly)')
    cur.execute('''
        SELECT batch_id, count(*) AS total_rules,
            sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL END) AS risk_points,
            round((sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL END))::numeric / count(*), 2) AS risk_index,
            round((sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent
        FROM engine.migration_control_execution
        WHERE batch_id IS NOT NULL
        GROUP BY batch_id
        ORDER BY risk_index DESC
        LIMIT 20;
    ''')
    rows = cur.fetchall()
    desc = [d[0] for d in cur.description]
    print(f'  Sample columns: {desc}')
    print(f'  Sample rows ({len(rows)} shown):')
    for r in rows:
        print(f'    {r}')
print()

# Test v_migration_stability_score (current source)
cur.execute('SELECT count(*) FROM engine.v_migration_stability_score;')
print(f'v_migration_stability_score rows: {cur.fetchone()[0]}')
cur.execute('SELECT * FROM engine.v_migration_stability_score LIMIT 10;')
rows = cur.fetchall()
desc = [d[0] for d in cur.description]
print(f'  Columns: {desc}')
for r in rows:
    print(f'  {r}')
print()

# Test v_migration_score_trend
cur.execute('SELECT count(*) FROM engine.v_migration_score_trend;')
print(f'v_migration_score_trend rows: {cur.fetchone()[0]}')
cur.execute('SELECT * FROM engine.v_migration_score_trend LIMIT 10;')
rows = cur.fetchall()
desc = [d[0] for d in cur.description]
print(f'  Columns: {desc}')
for r in rows:
    print(f'  {r}')
print()

# Check total distinct batches
cur.execute('SELECT count(DISTINCT batch_id) FROM engine.migration_control_execution;')
print(f'Total distinct batch_ids in migration_control_execution: {cur.fetchone()[0]}')
print()

# Check if there are risk-related columns in migration_validation_batch
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_schema = 'engine' AND table_name = 'migration_validation_batch' ORDER BY ordinal_position;")
cols = [r[0] for r in cur.fetchall()]
print(f'migration_validation_batch columns: {cols}')
print()

# Check batch counts per source
cur.execute('SELECT count(DISTINCT batch_id) FROM engine.migration_control_execution;')
print(f'Batches in execution table: {cur.fetchone()[0]}')
cur.execute('SELECT count(DISTINCT batch_id) FROM engine.migration_validation_batch;')
print(f'Batches in validation table: {cur.fetchone()[0]}')
print()

# Compare v_dataset_risk_index vs proposed v_batch_risk_index
# v_dataset_risk_index groups by entity_name (dataset) -> 3 rows
# v_batch_risk_index groups by batch_id -> N rows per batch
# For Risk Score API which takes batch_id, we need per-batch output
print('=== Key comparison ===')
print('v_dataset_risk_index: groups by entity_name (3 datasets)')
print('  - Per-dataset risk_index (0.00 to 0.73)')
print('  - Risk points: cumulative across batches per dataset')
print('  - Does NOT support batch_id parameter')
print()
print('v_migration_stability_score: groups by batch_id')
print('  - Per-batch stability_score (pass rate %)')
print('  - Already used by repository get_risk_score()')
print('  - But stability is inverse of risk (higher = better)')
print()
print('v_migration_score_trend: from migration_validation_batch')
print('  - Per-batch overall_score (from validation)')
print('  - Has rolling 5-batch average')
print('  - Overall score is validation pass rate, not risk score')
print()
print('Proposed v_batch_risk_index: groups by batch_id')
print('  - Per-batch risk_index (0.00 = all PASS, 2.00 = all ERROR)')
print('  - Per-batch failure_rate_percent')
print('  - Has risk_points, total_rules for drill-down')
print('  - Supports batch_id parameter for Risk Score API')
print('  - Uses same scoring methodology as v_dataset_risk_index')

cur.close()
conn.close()