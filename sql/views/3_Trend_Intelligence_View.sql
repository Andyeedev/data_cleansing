CREATE OR REPLACE VIEW engine.v_migration_score_trend AS
--- 3) Trend Intelligence View
SELECT
    batch_id,
    execution_start,
    overall_status,
    overall_score,
    AVG(overall_score) OVER (
        ORDER BY execution_start
        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
    ) AS rolling_5_batch_avg
FROM engine.migration_validation_batch
WHERE overall_score IS NOT NULL
ORDER BY execution_start DESC;
