-- ============================================================
-- CONTROL LEVEL SUMMARY VIEW
-- ============================================================

CREATE OR REPLACE VIEW engine.v_migration_control_summary AS
SELECT
    execution_id,
    control_id,
    COUNT(*) AS total_rules,
    SUM(CASE WHEN status = 'FAIL' THEN 1 ELSE 0 END) AS failed_rules,
    ROUND(
        (COUNT(*) - SUM(CASE WHEN status = 'FAIL' THEN 1 ELSE 0 END))
        * 100.0 / NULLIF(COUNT(*),0),
        2
    ) AS score_percentage
FROM engine.migration_control_execution
GROUP BY execution_id, control_id;


-- ============================================================
-- EXECUTIVE SUMMARY VIEW
-- ============================================================

CREATE OR REPLACE VIEW engine.v_migration_executive_summary AS
SELECT
    b.execution_id,
    b.execution_start,
    b.execution_end,
    COUNT(e.rule_id) AS total_rules,
    SUM(CASE WHEN e.status = 'FAIL' THEN 1 ELSE 0 END) AS total_failures,
    ROUND(
        (COUNT(e.rule_id) - SUM(CASE WHEN e.status='FAIL' THEN 1 ELSE 0 END))
        * 100.0 / NULLIF(COUNT(e.rule_id),0),
        2
    ) AS overall_score
FROM engine.migration_validation_batch b
LEFT JOIN engine.migration_control_execution e
    ON b.execution_id = e.execution_id
GROUP BY b.execution_id, b.execution_start, b.execution_end;


-- ============================================================
-- EXCEPTION DRILL-DOWN VIEW
-- ============================================================

CREATE OR REPLACE VIEW engine.v_migration_exception_detail AS
SELECT
    execution_id,
    control_id,
    rule_id,
    entity_name,
    primary_key_value,
    failure_reason
FROM engine.migration_exception_register;
