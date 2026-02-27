CREATE OR REPLACE VIEW engine.v_migration_governance_report AS
--- 1) Migration Governance Report View
SELECT
    b.batch_id,
    cs.control_id,
    cs.overall_status AS control_status,
    r.rule_id,
    e.entity_name,
    e.execution_status,
    e.severity_level,
    e.delta_value,
    e.execution_time_seconds,
    e.created_at
FROM engine.migration_batch_summary b
JOIN engine.migration_control_summary cs
    ON b.batch_id = cs.batch_id
JOIN engine.migration_control_execution e
    ON cs.batch_id = e.batch_id
   AND cs.control_id = e.control_id
JOIN engine.rule_registry r
    ON r.rule_id = e.rule_id
ORDER BY b.batch_id, cs.control_id, r.rule_id;