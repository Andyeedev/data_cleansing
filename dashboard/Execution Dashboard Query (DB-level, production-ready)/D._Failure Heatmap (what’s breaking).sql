SELECT
    control_id,
    entity_name,
    execution_status,
    COUNT(*) AS count
FROM engine.migration_control_execution
WHERE batch_id = '<your_batch_id>'
AND execution_status IN ('FAIL', 'ERROR')
GROUP BY control_id, entity_name, execution_status
ORDER BY count DESC;