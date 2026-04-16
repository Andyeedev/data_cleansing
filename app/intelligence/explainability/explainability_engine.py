class ExplainabilityEngine:

    def __init___legacy(self, engine_db, batch_id):
        self.db = engine_db
        self.batch_id = batch_id

    def __init___current_1(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id


    def __init___current_1(self, engine_db, batch_id, source_db=None, target_db=None):
        self.engine_db = engine_db
        self.batch_id = batch_id

        # Optional (future use)
        self.source_db = source_db
        self.target_db = target_db

    def __init___current_2(self, engine_db, batch_id):
        self.engine_db = engine_db
        self.batch_id = batch_id


    def __init___current_3(self, engine_db, batch_id, source_adapter=None, target_adapter=None):
        self.engine_db = engine_db
        self.batch_id = batch_id
        self.source_adapter = source_adapter
        self.target_adapter = target_adapter


    def __init__(self, source_adapter, target_adapter, engine_db, batch_id):
        self.source_adapter = source_adapter
        self.target_adapter = target_adapter
        self.engine_db = engine_db
        self.batch_id = batch_id


    def generate(self):

        breakdown = {
            "matching": self._matching(),
            "fk": self._fk(),
            "profiling": self._profiling(),
            "graph": self._graph()
        }

        self._persist(breakdown)
        return breakdown

    def _matching(self):
        return self.engine_db.execute("""
            SELECT source_table, target_table, match_confidence
            FROM engine.table_matching_results
            WHERE batch_id = %s
            ORDER BY match_confidence DESC
            LIMIT 5
        """, (self.batch_id,))

    def _fk(self):
        return self.engine_db.execute("""
            SELECT source_column, target_column, confidence
            FROM engine.fk_inference_results
            WHERE batch_id = %s
            LIMIT 5
        """, (self.batch_id,))

    def _profiling_legacy(self):
        return self.engine_db.execute("""
            SELECT table_name, column_name, null_pct, uniqueness
            FROM engine.data_profiling_results
            WHERE batch_id = %s
            LIMIT 5
        """, (self.batch_id,))

    def _profiling(self):
        return self.engine_db.execute("""
            SELECT schema_name, table_name, column_name, null_count, row_count, data_type
            FROM engine.data_profiling_results
            WHERE batch_id = %s
            LIMIT 5
        """, (self.batch_id,))

    def _graph(self):
        rows = self.engine_db.execute("""
            SELECT graph_score
            FROM engine.relationship_graph_results
            WHERE batch_id = %s
            LIMIT 1
        """, (self.batch_id,))
        return rows[0][0] if rows else 0

    def _persist_legacy(self, breakdown):

        import json

        self.engine_db.execute("""
        INSERT INTO engine.explainability_results
        (batch_id, breakdown_json)
        VALUES (%s,%s)
        """, (self.batch_id, json.dumps(breakdown)))

    def _persist(self, breakdown):

        import json

        try:
            self.engine_db.execute("""
            INSERT INTO engine.explainability_results
            (batch_id, breakdown_json)
            VALUES (%s,%s)
            """, (self.batch_id, json.dumps(breakdown, default=str)))
        except Exception as e:
            print(f"[Explainability ERROR] → {e}")