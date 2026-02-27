CREATE OR REPLACE VIEW engine.v_migration_delta_anomalies AS
--- 4) Intelligent Anomaly Detection View
SELECT e.*
FROM engine.migration_control_execution e
JOIN (
    SELECT
        rule_id,
        AVG(delta_value) AS avg_delta
    FROM engine.migration_control_execution
    GROUP BY rule_id
) baseline
ON e.rule_id = baseline.rule_id
WHERE e.delta_value > (baseline.avg_delta * 3)
AND e.delta_value > 0;