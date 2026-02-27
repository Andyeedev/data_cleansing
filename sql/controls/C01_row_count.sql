SELECT
    COUNT(*) as source_count
FROM {{source_schema}}.{{source_table}}
WHERE 1=1 {{filter_condition}}
