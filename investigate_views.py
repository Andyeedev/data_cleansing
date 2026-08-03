import psycopg2

conn = psycopg2.connect(
    host='localhost', port=5432, dbname='migration_engine',
    user='postgres', password='dev123456', connect_timeout=5
)
cur = conn.cursor()

# Get all views in engine schema using pg_views
cur.execute("SELECT viewname, definition FROM pg_views WHERE schemaname = 'engine' ORDER BY viewname;")
views = cur.fetchall()
print('=== All views in engine schema ===')
for name, definition in views:
    print(f'--- {name} ---')
    print(definition)
    print()

# Get columns for score/risk/stability/index/heatmap/trend/dashboard views
print()
print('=== Columns for score/risk/stability/index/heatmap/trend/dashboard views ===')
score_views = ['v_migration_stability_score', 'v_migration_score_trend', 'v_migration_health_dashboard',
               'v_dataset_risk_index', 'v_dataset_risk_heatmap', 'batch_rule_scores', 'batch_anomaly_analysis']
for name in score_views:
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'engine' AND table_name = %s ORDER BY ordinal_position;", (name,))
    cols = cur.fetchall()
    if cols:
        print(f'{name}: {[(c[0], c[1]) for c in cols]}')
    else:
        print(f'{name}: NOT FOUND')

# Check if migration_risk_scores table exists
print()
print('=== Checking engine.migration_risk_scores ===')
cur.execute("SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'engine' AND table_name = 'migration_risk_scores';")
result = cur.fetchone()
print(f'Result: {result}')

# Get columns of migration_score_details
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'engine' AND table_name = 'migration_score_details' ORDER BY ordinal_position;")
print(f'migration_score_details columns: {cur.fetchall()}')

# Get columns of migration_score_summary
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'engine' AND table_name = 'migration_score_summary' ORDER BY ordinal_position;")
print(f'migration_score_summary columns: {cur.fetchall()}')

# Query v_migration_stability_score with sample data
print()
print('=== v_migration_stability_score sample ===')
cur.execute("SELECT * FROM engine.v_migration_stability_score LIMIT 5;")
rows = cur.fetchall()
print(f'Row count: {len(rows)}')
if rows:
    desc = [d[0] for d in cur.description]
    print(f'Columns: {desc}')
    for row in rows:
        print(row)

# Query v_migration_health_dashboard
print()
print('=== v_migration_health_dashboard sample ===')
cur.execute("SELECT * FROM engine.v_migration_health_dashboard LIMIT 5;")
rows = cur.fetchall()
print(f'Row count: {len(rows)}')
if rows:
    desc = [d[0] for d in cur.description]
    print(f'Columns: {desc}')

# Query v_dataset_risk_index
print()
print('=== v_dataset_risk_index sample ===')
cur.execute("SELECT * FROM engine.v_dataset_risk_index LIMIT 5;")
rows = cur.fetchall()
print(f'Row count: {len(rows)}')
if rows:
    desc = [d[0] for d in cur.description]
    print(f'Columns: {desc}')
    for row in rows:
        print(row)

# Query v_dataset_risk_heatmap
print()
print('=== v_dataset_risk_heatmap sample ===')
cur.execute("SELECT * FROM engine.v_dataset_risk_heatmap LIMIT 5;")
rows = cur.fetchall()
print(f'Row count: {len(rows)}')
if rows:
    desc = [d[0] for d in cur.description]
    print(f'Columns: {desc}')

# Query batch_rule_scores
print()
print('=== batch_rule_scores sample ===')
cur.execute("SELECT * FROM engine.batch_rule_scores LIMIT 5;")
rows = cur.fetchall()
print(f'Row count: {len(rows)}')
if rows:
    desc = [d[0] for d in cur.description]
    print(f'Columns: {desc}')

# Query batch_anomaly_analysis
print()
print('=== batch_anomaly_analysis sample ===')
cur.execute("SELECT * FROM engine.batch_anomaly_analysis LIMIT 5;")
rows = cur.fetchall()
print(f'Row count: {len(rows)}')
if rows:
    desc = [d[0] for d in cur.description]
    print(f'Columns: {desc}')

# Query v_migration_score_trend
print()
print('=== v_migration_score_trend sample ===')
cur.execute("SELECT * FROM engine.v_migration_score_trend LIMIT 5;")
rows = cur.fetchall()
print(f'Row count: {len(rows)}')
if rows:
    desc = [d[0] for d in cur.description]
    print(f'Columns: {desc}')

# Check if engine.migration_risk_scores is referenced in ANY view
print()
print('=== Searching for migration_risk_scores in all view definitions ===')
for name, definition in views:
    if 'migration_risk_scores' in definition or 'unified_scores' in definition or 'risk_score' in definition.lower():
        print(f'View {name} references risk/unified data:')
        print(definition[:300])
        print()

cur.close()
conn.close()