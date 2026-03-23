SELECT
    batch_id,
    COUNT(*) AS total_executions,
    SUM(CASE WHEN execution_status = 'PASS' THEN 1 ELSE 0 END) AS passed,
    SUM(CASE WHEN execution_status = 'FAIL' THEN 1 ELSE 0 END) AS failed,
    SUM(CASE WHEN execution_status = 'ERROR' THEN 1 ELSE 0 END) AS errors,
    ROUND(AVG(execution_time_seconds), 3) AS avg_time,
    MAX(execution_time_seconds) AS max_time
FROM engine.migration_control_execution
WHERE batch_id = '<your_batch_id>'
GROUP BY batch_id;