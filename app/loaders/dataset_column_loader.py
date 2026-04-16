def load_dataset_columns(discovered_columns, conn):

    with conn.cursor() as cur:
        for col in discovered_columns:
            cur.execute("""
                INSERT INTO core.dataset_columns (
                    column_id,
                    system_id,
                    table_name,
                    column_name,
                    data_type
                )
                VALUES (gen_random_uuid(), %s,%s,%s,%s)

                ON CONFLICT (system_id, table_name, column_name)
                DO UPDATE SET data_type = EXCLUDED.data_type
            """, (
                col["system_id"],
                col["table_name"],
                col["column_name"],
                col["data_type"]
            ))

        conn.commit()