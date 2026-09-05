Approved — proceed with Snowflake MAP integration.

Use the existing MAP Connection Management architecture. Do not redesign it and do not duplicate functionality unnecessarily.

Scope:

1. Integrate the certified Snowflake adapter into MAP.
2. Wire SnowflakeConfig/authentication correctly.
3. Use the existing unused tenant/project selected for certification, or create a dedicated unused one if required.
4. Register the Snowflake certification environment as SOURCE and TARGET.
5. Test connections through MAP CLI/UI.
6. Run discovery and confirm all 10 tables and columns are discovered.
7. Create/verify source → target dataset mappings.
8. Run automatic rule discovery.
9. Execute validation end-to-end.
10. Confirm results, failures/exceptions and reporting work through MAP.

Do NOT start PostgreSQL integration.
Do NOT redesign the discovery/mapping architecture.
Do NOT introduce hard-coded table-name matching such as `_source`/`_target`.
Reuse the existing certified Snowflake functionality and existing MAP architecture.

STOP after completing the Snowflake MAP end-to-end test and provide a concise certification result.

This is the final Snowflake validation gate before we move to PostgreSQL.
