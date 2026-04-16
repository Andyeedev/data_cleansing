class UnifiedScoringEngine:

    def __init__(self, engine_db, batch_id):
        self.db = engine_db
        self.batch_id = batch_id

    # ---------------------------------------------------------
    # MAIN
    # ---------------------------------------------------------
    def run(self):

        match_score = self._get_match_score()
        fk_score = self._get_fk_score()
        profiling_score = self._get_profiling_score()
        graph_score = self._get_graph_score()

        final_score = (
            0.3 * match_score +
            0.25 * fk_score +
            0.2 * profiling_score +
            0.25 * graph_score
        )

        self._persist(final_score)

        return final_score

    # ---------------------------------------------------------
    # COMPONENT SCORES
    # ---------------------------------------------------------
    def _get_match_score(self):

        rows = self.db.execute("""
            SELECT AVG(match_confidence)
            FROM engine.table_matching_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        return rows[0][0] or 0

    def _get_fk_score(self):

        rows = self.db.execute("""
            SELECT AVG(confidence)
            FROM engine.fk_inference_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        return rows[0][0] or 0

    def _get_profiling_score(self):

        rows = self.db.execute("""
            SELECT AVG(uniqueness)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        return (rows[0][0] or 0) * 100

    def _get_graph_score(self):

        rows = self.db.execute("""
            SELECT graph_score
            FROM engine.relationship_graph_results
            WHERE batch_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (self.batch_id,))

        return rows[0][0] if rows else 0

    # ---------------------------------------------------------
    # STORE FINAL SCORE
    # ---------------------------------------------------------
    def _persist(self, score):

        query = """
        INSERT INTO engine.unified_scores
        (batch_id, final_score)
        VALUES (%s,%s)
        """

        self.db.execute(query, (self.batch_id, score))