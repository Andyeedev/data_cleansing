def _persist(self, results):

    query = """
    INSERT INTO engine.table_matching_results
    (batch_id, source_table, target_table, match_confidence)
    VALUES (%s,%s,%s,%s)
    """

    for r in results:
        self.engine_db.execute(query, (
            self.batch_id,
            r[0],
            r[1],
            r[2]
        ))