CREATE OR REPLACE VIEW engine.v_migration_executive_summary AS
---2) Executive Dashboard View
SELECT
    b.batch_id,
    b.overall_status,
    b.overall_score,
    s.total_controls,
    s.passed_controls,
    s.failed_controls,
    s.error_controls,
    s.blocked_controls,
    COUNT(CASE WHEN e.severity_level='CRITICAL'
               AND e.execution_status='FAIL' THEN 1 END) AS critical_failures,
    COUNT(CASE WHEN e.severity_level='HIGH'
               AND e.execution_status='FAIL' THEN 1 END) AS high_failures,
    SUM(e.delta_value) AS total_delta_exposure,
    b.execution_start,
    b.execution_end
FROM engine.migration_validation_batch b
LEFT JOIN engine.migration_batch_summary s
    ON b.batch_id = s.batch_id
LEFT JOIN engine.migration_control_execution e
    ON b.batch_id = e.batch_id
GROUP BY
    b.batch_id,
    b.overall_status,
    b.overall_score,
    s.total_controls,
    s.passed_controls,
    s.failed_controls,
    s.error_controls,
    s.blocked_controls,
    b.execution_start,
    b.execution_end;
