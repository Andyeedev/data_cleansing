def create_mappings_from_matches(matches, conn, project_id):

    with conn.cursor() as cur:

        for m in matches:
            cur.execute("""
                INSERT INTO core.dataset_mappings (
                    mapping_id,
                    project_id,
                    source_table,
                    target_table
                )
                VALUES (gen_random_uuid(), %s,%s,%s)

                ON CONFLICT (project_id, source_table)
                DO UPDATE SET target_table = EXCLUDED.target_table
                RETURNING mapping_id
            """, (
                project_id,
                m["source_table"],
                m["target_table"]
            ))

            m["mapping_id"] = cur.fetchone()[0]

        conn.commit()

    return matches