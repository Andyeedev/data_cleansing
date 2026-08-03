import psycopg2
import json
import os
from datetime import datetime

conn = psycopg2.connect(
    host='localhost', port=5432, dbname='migration_engine',
    user='postgres', password='dev123456', connect_timeout=5
)
cur = conn.cursor()

def q(sql, label=""):
    try:
        cur.execute(sql)
        cols = [d[0] for d in cur.description] if cur.description else []
        rows = cur.fetchall()
        return cols, rows
    except Exception as e:
        return [], [str(e)]

def safe_count(sql):
    try:
        cur.execute(sql)
        return cur.fetchone()[0]
    except:
        return None

def safe_query(sql):
    try:
        cur.execute(sql)
        cols = [d[0] for d in cur.description] if cur.description else []
        rows = cur.fetchall()
        return cols, rows
    except Exception as e:
        return [], [f"ERROR: {e}"]

results = {}

# === DASHBOARD SOURCES ===
results['core.system_registry'] = safe_query("SELECT * FROM core.system_registry LIMIT 3")
results['engine.control_registry'] = safe_query("SELECT * FROM engine.control_registry LIMIT 3")
results['engine.migration_batch_registry_count'] = safe_count("SELECT count(*) FROM engine.migration_batch_registry")
results['engine.migration_batch_registry_status'] = safe_query("SELECT batch_status, count(*) FROM engine.migration_batch_registry GROUP BY batch_status ORDER BY batch_status")

# Dashboard: Migration Score (engine.unified_scores)
cols, rows = safe_query("SELECT * FROM engine.unified_scores LIMIT 5")
results['engine.unified_scores'] = (cols, rows)
results['unified_scores_count'] = safe_count("SELECT count(*) FROM engine.unified_scores")

# Dashboard: Pass Rate
cols, rows = safe_query("SELECT execution_status, count(*) FROM engine.migration_control_execution GROUP BY execution_status ORDER BY execution_status")
results['control_execution_by_status'] = (cols, rows)
results['control_execution_count'] = safe_count("SELECT count(*) FROM engine.migration_control_execution")
results['control_execution_distinct_batches'] = safe_count("SELECT count(DISTINCT batch_id) FROM engine.migration_control_execution")

# Dashboard: Exception Count
results['exceptions_count'] = safe_count("SELECT count(*) FROM engine.migration_control_exceptions")
results['exceptions_by_entity'] = safe_query("SELECT entity_name, count(*) FROM engine.migration_control_exceptions GROUP BY entity_name ORDER BY count(*) DESC LIMIT 5")

# Dashboard: Activity Feed
results['activity_feed_sample'] = safe_query("SELECT batch_id, execution_status, entity_name, created_at FROM engine.migration_control_execution ORDER BY created_at DESC LIMIT 10")

# Dashboard: Executive role-differentiated content
results['governance_summary'] = safe_query("SELECT * FROM engine.v_batch_governance_summary LIMIT 5")
results['migration_control_summary_count'] = safe_count("SELECT count(*) FROM engine.migration_control_summary")
results['migration_control_summary_sample'] = safe_query("SELECT * FROM engine.migration_control_summary LIMIT 5")

# === RISK SCORE SOURCES ===
results['v_migration_stability_score'] = safe_query("SELECT * FROM engine.v_migration_stability_score LIMIT 10")
results['v_dataset_risk_index'] = safe_query("SELECT * FROM engine.v_dataset_risk_index ORDER BY risk_index DESC")
results['v_dataset_risk_heatmap'] = safe_query("SELECT * FROM engine.v_dataset_risk_heatmap")
results['v_batch_risk_index_proposed'] = safe_query("""
    SELECT batch_id, count(*) AS total_rules,
        sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL::integer END) AS risk_points,
        round((sum(CASE WHEN execution_status = 'PASS' THEN 0 WHEN execution_status = 'FAIL' THEN 1 WHEN execution_status = 'ERROR' THEN 2 ELSE NULL::integer END))::numeric / count(*), 2) AS risk_index,
        round((sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent
    FROM engine.migration_control_execution
    WHERE batch_id IS NOT NULL
    GROUP BY batch_id
    ORDER BY risk_index DESC
    LIMIT 10
""")

# === MIGRATION SCORE SOURCES ===
results['migration_score_summary_count'] = safe_count("SELECT count(*) FROM engine.migration_score_summary")
results['migration_score_summary'] = safe_query("SELECT * FROM engine.migration_score_summary LIMIT 5")
results['migration_score_details_by_type'] = safe_query("SELECT score_type, count(*), round(avg(score), 2), min(score), max(score) FROM engine.migration_score_details GROUP BY score_type ORDER BY score_type")
results['migration_validation_batch'] = safe_query("SELECT * FROM engine.migration_validation_batch LIMIT 5")
results['v_migration_score_trend'] = safe_query("SELECT * FROM engine.v_migration_score_trend LIMIT 10")
results['v_m_migration_score_summary_proposed'] = safe_query("""
    SELECT msb.batch_id, msb.execution_start, msb.execution_end, msb.overall_status, msb.overall_score, msb.project_id,
        COUNT(mce.rule_id) AS total_rules,
        SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END) AS passed_rules,
        SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 ELSE 0 END) AS failed_rules,
        SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END) AS error_rules,
        ROUND((SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 WHEN mce.execution_status = 'ERROR' THEN 2 ELSE 0 END))::numeric / NULLIF(COUNT(*), 0), 2) AS risk_index,
        ROUND((SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS pass_rate_percent
    FROM engine.migration_validation_batch msb
    LEFT JOIN engine.migration_control_execution mce ON msb.batch_id = mce.batch_id
    WHERE msb.batch_id IS NOT NULL
    GROUP BY msb.batch_id, msb.execution_start, msb.execution_end, msb.overall_status, msb.overall_score, msb.project_id
    ORDER BY msb.execution_start DESC
    LIMIT 10
""")

# === GOVERNANCE SOURCES ===
results['migration_release_decision_count'] = safe_count("SELECT count(*) FROM engine.migration_release_decision")
results['migration_release_decision'] = safe_query("SELECT id, batch_id, gate_result, overall_score, decision_reason FROM engine.migration_release_decision LIMIT 5")
results['migration_control_exceptions_count'] = safe_count("SELECT count(*) FROM engine.migration_control_exceptions")
results['migration_control_exceptions_sample'] = safe_query("SELECT * FROM engine.migration_control_exceptions LIMIT 5")
results['migration_batch_registry_sample'] = safe_query("SELECT batch_id, batch_status, project_id FROM engine.migration_batch_registry ORDER BY batch_id DESC LIMIT 5")
results['v_migration_health_dashboard'] = safe_query("SELECT * FROM engine.v_migration_health_dashboard LIMIT 5")

# === EXECUTION CONTROL SOURCES ===
results['batch_execution_checkpoint_count'] = safe_count("SELECT count(*) FROM engine.batch_execution_checkpoint")
results['batch_execution_checkpoint'] = safe_query("SELECT * FROM engine.batch_execution_checkpoint LIMIT 5")

# === EXECUTION HISTORY SOURCES ===
results['v_migration_score_trend_full'] = safe_query("SELECT * FROM engine.v_migration_score_trend LIMIT 10")

# === RULE EXECUTION SOURCES ===
results['rules_by_batch_sample'] = safe_query("SELECT batch_id, rule_id, execution_status, entity_name FROM engine.migration_control_execution ORDER BY batch_id DESC LIMIT 10")
results['control_registry_count'] = safe_count("SELECT count(*) FROM engine.control_registry")
results['control_registry'] = safe_query("SELECT * FROM engine.control_registry LIMIT 5")

# === VALIDATION REPORT SOURCES ===
results['validation_batch_count'] = safe_count("SELECT count(*) FROM engine.migration_validation_batch")
results['validation_batch_sample'] = safe_query("SELECT * FROM engine.migration_validation_batch LIMIT 5")

# === MONITORING SOURCES ===
results['monitoring_sources'] = ("N/A (runtime)", "N/A")

# === DISCOVERY SOURCES ===
results['dataset_mappings_count'] = safe_count("SELECT count(*) FROM core.dataset_mappings")
results['dataset_mappings'] = safe_query("SELECT * FROM core.dataset_mappings LIMIT 3")

# === AUTH SOURCES ===
results['platform_user_roles_count'] = safe_count("SELECT count(*) FROM platform.user_roles")
results['platform_roles_count'] = safe_count("SELECT count(*) FROM platform.roles")
results['platform_roles'] = safe_query("SELECT * FROM platform.roles LIMIT 10")

# === DEFERRED SOURCES ===
results['platform_users_count'] = safe_count("SELECT count(*) FROM platform.users")
results['platform_users_sample'] = safe_query("SELECT * FROM platform.users LIMIT 3")
results['platform_roles_detail'] = safe_query("SELECT count(*) FROM platform.role_permissions")
results['platform_system_settings_count'] = safe_count("SELECT count(*) FROM platform.system_settings")
results['platform_feature_flags_count'] = safe_count("SELECT count(*) FROM platform.feature_flags")
results['platform_tasks_count'] = safe_count("SELECT count(*) FROM platform.tasks")
results['platform_notifications_count'] = safe_count("SELECT count(*) FROM platform.notifications")
results['platform_calendar_events_count'] = safe_count("SELECT count(*) FROM platform.calendar_events")
results['platform_approval_requests_count'] = safe_count("SELECT count(*) FROM platform.approval_requests")
results['platform_workflow_definitions_count'] = safe_count("SELECT count(*) FROM platform.workflow_definitions")
results['platform_workflow_instances_count'] = safe_count("SELECT count(*) FROM platform.workflow_instances")

conn.close()

# Output results as JSON for the report generator
print(json.dumps(results, default=str, indent=2))