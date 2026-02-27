SELECT
    '{{rule_id}}' AS rule_id,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    COUNT(*) AS orphan_count
FROM {{target_schema}}.{{child_table}} c
LEFT JOIN {{target_schema}}.{{parent_table}} p
ON c.{{fk_column}} = p.{{pk_column}}
WHERE p.{{pk_column}} IS NULL;