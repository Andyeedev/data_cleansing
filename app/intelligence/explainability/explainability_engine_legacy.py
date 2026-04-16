class ExplainabilityEngine:

    def __init__(self, engine_db, batch_id):
        self.db = engine_db
        self.batch_id = batch_id

    # ---------------------------------------------------------
    # MAIN
    # ---------------------------------------------------------
    def generate(self):

        breakdown = {
            "matching": self._matching_breakdown(),
            "fk": self._fk_breakdown(),
            "profiling": self._profiling_breakdown(),
            "graph": self._graph_breakdown()
        }

        self._persist(breakdown)

        return breakdown

    # ---------------------------------------------------------
    # MATCHING
    # ---------------------------------------------------------
    def _matching_breakdown(self):

        rows = self.db.execute("""
            SELECT source_table, target_table, match_confidence
            FROM engine.table_matching_results
            WHERE batch_id = %s
            ORDER BY match_confidence DESC
            LIMIT 5
        """, (self.batch_id,))

        return [
            {
                "source": r[0],
                "target": r[1],
                "score": r[2]
            } for r in rows
        ]

    # ---------------------------------------------------------
    # FK
    # ---------------------------------------------------------
    def _fk_breakdown(self):

        rows = self.db.execute("""
            SELECT source_column, target_column, confidence
            FROM engine.fk_inference_results
            WHERE batch_id = %s
            ORDER BY confidence DESC
            LIMIT 5
        """, (self.batch_id,))

        return [
            {
                "source": r[0],
                "target": r[1],
                "score": r[2]
            } for r in rows
        ]

    # ---------------------------------------------------------
    # PROFILING
    # ---------------------------------------------------------
    def _profiling_breakdown(self):

        rows = self.db.execute("""
            SELECT table_name, column_name, null_pct, uniqueness
            FROM engine.data_profiling_results
            WHERE batch_id = %s
            ORDER BY null_pct DESC
            LIMIT 5
        """, (self.batch_id,))

        return [
            {
                "table": r[0],
                "column": r[1],
                "null_pct": r[2],
                "uniqueness": r[3]
            } for r in rows
        ]

    # ---------------------------------------------------------
    # GRAPH
    # ---------------------------------------------------------
    def _graph_breakdown(self):

        rows = self.db.execute("""
            SELECT graph_score
            FROM engine.relationship_graph_results
            WHERE batch_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (self.batch_id,))

        return {"graph_score": rows[0][0]} if rows else {}

    # ---------------------------------------------------------
    # STORE
    # ---------------------------------------------------------
    def _persist(self, breakdown):

        import json

        query = """
        INSERT INTO engine.explainability_results
        (batch_id, breakdown_json)
        VALUES (%s,%s)
        """

        self.db.execute(query, (
            self.batch_id,
            json.dumps(breakdown)
        ))