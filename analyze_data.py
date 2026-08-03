import psycopg2
import json

conn = psycopg2.connect(
    host='localhost', port=5432, dbname='migration_engine',
    user='postgres', password='dev123456', connect_timeout=5
)
cur = conn.cursor()

def q(sql, label=""):
    cur.execute(sql)
    cols = [d[0] for d in cur.description] if cur.description else []
    rows = cur.fetchall()
    print(f"=== {label} ===")
    print(f"Columns: {cols}")
    print(f"Row count: {len(rows)}")
    for r in rows[:5]:
        print(f"  {list(r)}")
    print()
    return cols, rows

# --- Dashboard Sources ---
q("SELECT count(*) FROM engine.unified_scores;", "unified_scores total rows")
q("SELECT * FROM engine.unified_scores LIMIT 3;", "unified_scores sample")

q("SELECT execution_status, count(*) FROM engine.migration_control_execution GROUP BY execution_status ORDER BY execution_status;", "control_execution by status")
q("SELECT count(*) FROM engine.migration_control_execution;", "control_execution total")

q("SELECT count(*) FROM engine.migration_control_exceptions;", "exceptions total")
q("SELECT * FROM engine.migration_control_exceptions LIMIT 3;", "exceptions sample")

# --- Risk Score Sources ---
q("SELECT * FROM engine.v_migration_stability_score LIMIT 10;", "v_migration_stability_score (current repo source)")
q("SELECT * FROM engine.v_dataset_risk_index ORDER BY risk_index DESC;", "v_dataset_risk_index (per entity)")
q("SELECT * FROM engine.v_dataset_risk_heatmap;", "v_dataset_risk_heatmap")

q("SELECT count(*) FROM engine.batch_rule_scores;", "batch_rule_scores count")
q("SELECT * FROM engine.batch_rule_scores LIMIT 5;", "batch_rule_scores sample")

q("SELECT count(*) FROM engine.batch_anomaly_analysis;", "batch_anomaly_analysis count")
q("SELECT anomaly_classification, count(*) FROM engine.batch_anomaly_analysis GROUP BY anomaly_classification;", "anomaly by class")

q("SELECT count(*) FROM engine.migration_risk_scores;", "migration_risk_scores count (table)")

# --- Proposed new view: batch risk index ---
q("""
SELECT
    batch_id,
    count(*) AS total_rules,
    sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL::integer END) AS risk_points,
    round((sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL::integer END))::numeric / count(*), 2) AS risk_index,
    round((sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent
FROM engine.migration_control_execution
WHERE batch_id IS NOT NULL
GROUP BY batch_id
ORDER BY risk_index DESC
LIMIT 10;
""", "proposed v_batch_risk_index (per batch)")

# --- Proposed new view: batch risk score per entity ---
q("""
SELECT
    batch_id,
    entity_name,
    count(*) AS total_rules,
    sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL::integer END) AS risk_points,
    round((sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL::integer END))::numeric / count(*), 2) AS risk_index,
    round((sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent
FROM engine.migration_control_execution
WHERE batch_id IS NOT NULL
GROUP BY batch_id, entity_name
ORDER BY batch_id, risk_index DESC
LIMIT 15;
""", "proposed v_batch_entity_risk_index (per batch + entity)")

# --- Migration Score Sources ---
q("SELECT * FROM engine.migration_score_summary LIMIT 5;", "migration_score_summary")
q("SELECT score_type, count(*), round(avg(score), 2), min(score), max(score) FROM engine.migration_score_details GROUP BY score_type ORDER BY score_type;", "migration_score_details by type")
q("SELECT * FROM engine.migration_validation_batch LIMIT 5;", "migration_validation_batch")
q("SELECT * FROM engine.v_migration_score_trend LIMIT 10;", "v_migration_score_trend")
q("SELECT * FROM engine.v_migration_health_dashboard LIMIT 5;", "v_migration_health_dashboard")

# --- Governance Sources ---
q("SELECT * FROM engine.migration_control_summary LIMIT 5;", "migration_control_summary")
q("SELECT * FROM engine.v_batch_governance_summary LIMIT 5;", "v_batch_governance_summary")
q("SELECT count(*) FROM engine.migration_release_decision;", "migration_release_decision count")
q("SELECT * FROM engine.migration_release_decision LIMIT 5;", "migration_release_decision sample")

# --- Batch Registry ---
q("SELECT count(*) FROM engine.migration_batch_registry;", "migration_batch_registry count")
q("SELECT batch_status, count(*) FROM engine.migration_batch_registry GROUP BY batch_status ORDER BY batch_status;", "batch_registry by status")

# --- Cross-reference: which batch_ids exist in both control_execution and migration_validation_batch ---
q("""
SELECT mb.batch_id, mb.batch_status, COUNT(mce.rule_id) AS rule_count,
    SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END) AS pass_count,
    SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 ELSE 0 END) AS fail_count,
    SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END) AS error_count
FROM engine.migration_batch_registry mb
LEFT JOIN engine.migration_control_execution mce ON mb.batch_id = mce.batch_id
GROUP BY mb.batch_id, mb.batch_status
ORDER BY mb.batch_id DESC
LIMIT 10;
""", "batch_registry JOIN control_execution (cross-validation)")

cur.close()
conn.close()