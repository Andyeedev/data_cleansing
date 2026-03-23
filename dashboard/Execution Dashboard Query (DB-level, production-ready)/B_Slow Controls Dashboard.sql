SELECT
    control_id,
    COUNT(*) AS executions,
    AVG(execution_time_seconds) AS avg_time,
    MAX(execution_time_seconds) AS max_time,
    slow_flag
FROM engine.migration_control_execution
WHERE batch_id = '<your_batch_id>'
GROUP BY control_id, slow_flag
ORDER BY max_time DESC;