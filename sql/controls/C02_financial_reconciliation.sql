WITH source_sum AS (
    SELECT SUM({{amount_column}}) AS total_amount
    FROM {{source_schema}}.{{source_table}}
),

target_sum AS (
    SELECT SUM({{amount_column}}) AS total_amount
    FROM {{target_schema}}.{{target_table}}
)

SELECT
    'C02_FIN_RECON' AS rule_id,
    CASE
        WHEN ABS(source_sum.total_amount - target_sum.total_amount) <= {{tolerance_value}}
        THEN 'PASS'
        ELSE 'FAIL'
    END AS status,
    source_sum.total_amount AS source_value,
    target_sum.total_amount AS target_value,
    ABS(source_sum.total_amount - target_sum.total_amount) AS difference
FROM source_sum, target_sum;