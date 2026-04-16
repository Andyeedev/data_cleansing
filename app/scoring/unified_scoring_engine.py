class UnifiedScoringEngine:

    def __init___legacy(self, engine_db, batch_id):
        self.db = engine_db
        self.batch_id = batch_id

    def __init___current_1(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id

    def __init__(self, source_adapter, target_adapter, engine_db, batch_id):
        self.source_adapter = source_adapter
        self.target_adapter = target_adapter
        self.engine_db = engine_db
        self.batch_id = batch_id


    def run_current(self):

        match_score = self._safe(self._get_match_score())
        fk_score = self._safe(self._get_fk_score())
        profiling_score = self._safe(self._get_profiling_score())
        graph_score = self._safe(self._get_graph_score())

        final_score = (
            0.3 * match_score +
            0.25 * fk_score +
            0.2 * profiling_score +
            0.25 * graph_score
        )

        self._persist(final_score)
        return final_score

    def run_new_2(self):

        self.matching_score = self._get_matching_score()
        self.fk_score = self._get_fk_score()
        self.profiling_score = self._get_profiling_score()
        self.graph_score = self._get_graph_score()

        final_score = (
            self.matching_score * 0.3 +
            self.fk_score * 0.3 +
            self.profiling_score * 0.2 +
            self.graph_score * 0.2
        )

        self.final_score = final_score

        self._persist(final_score)

        return final_score

    def run_new_3(self):

        self.matching_score = self._get_matching_score()
        self.fk_score = self._get_fk_score()
        self.profiling_score = self._get_profiling_score()
        self.graph_score = self._get_graph_score()

        final_score = (
            (self.matching_score or 0) * 0.3 +
            (self.fk_score or 0) * 0.3 +
            (self.profiling_score or 0) * 0.2 +
            (self.graph_score or 0) * 0.2
        )

        self.final_score = final_score

        self._persist(final_score)

        return final_score


    def run(self):

        self.matching_score = self._safe(self._get_match_score())
        self.fk_score = self._safe(self._get_fk_score())
        self.profiling_score = self._safe(self._get_profiling_score())
        self.graph_score = self._safe(self._get_graph_score())

        final_score = (
            0.3 * self.matching_score +
            0.3 * self.fk_score +
            0.2 * self.profiling_score +
            0.2 * self.graph_score
        )

        self.final_score = final_score

        self._persist(final_score)

        return final_score
    def _safe_legacy(self, val):
        
        return val if val is not None else 0
    
    def _safe(self, val):
        try:
            if val is None:
                return 0.0
            return float(val)   # ✅ FORCE FLOAT
        except:
            return 0.0
    

    def _get_match_score_legacy(self):
        return self.engine_db.execute("""
            SELECT AVG(match_confidence)
            FROM engine.table_matching_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0][0]
    
    def _get_match_score(self):
        val = self.engine_db.execute("""
            SELECT AVG(match_confidence)
            FROM engine.table_matching_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0][0]

        return float(val or 0)

    def _get_fk_score_legacy(self):
        return self.engine_db.execute("""
            SELECT AVG(confidence)
            FROM engine.fk_inference_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0][0]

    def _get_fk_score(self):
        val = self.engine_db.execute("""
            SELECT AVG(confidence)
            FROM engine.fk_inference_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0][0]

        return float(val or 0)
    

    def _get_profiling_score_legacy(self):
        val = self.engine_db.execute("""
            SELECT AVG(uniqueness)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0][0]
        return (val or 0) * 100
    

    def _get_profiling_score_new_1(self):

        rows = self.engine_db.execute("""
            SELECT COALESCE(SUM(null_count),0), COALESCE(SUM(row_count),0)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        if not rows:
            return 0

        total_nulls, total_rows = rows[0]

        if not total_rows or total_rows == 0:
            return 0

        null_ratio = total_nulls / total_rows

        return max(0, (1 - null_ratio) * 100)



    def _get_profiling_score_new_2(self):

        rows = self.engine_db.execute("""
            SELECT SUM(null_count), SUM(row_count)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        if not rows or not rows[0]:
            return 0

        total_nulls, total_rows = rows[0]

        if not total_rows:
            return 0

        null_ratio = total_nulls / total_rows

        return (1 - null_ratio) * 100
    

    def _get_profiling_score(self):

        rows = self.engine_db.execute("""
            SELECT COALESCE(SUM(null_count),0), COALESCE(SUM(row_count),0)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        if not rows or not rows[0]:
            return 0.0

        total_nulls, total_rows = rows[0]

        # ✅ FORCE FLOAT CONVERSION
        total_nulls = float(total_nulls or 0)
        total_rows = float(total_rows or 0)

        if total_rows == 0:
            return 0.0

        null_ratio = total_nulls / total_rows

        score = (1 - null_ratio) * 100

        return float(max(0, score))



    def _get_graph_score_legacy(self):
        rows = self.engine_db.execute("""
            SELECT graph_score
            FROM engine.relationship_graph_results
            WHERE batch_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (self.batch_id,))
        return rows[0][0] if rows else 0
    
    def _get_graph_score(self):
        rows = self.engine_db.execute("""
            SELECT graph_score
            FROM engine.relationship_graph_results
            WHERE batch_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (self.batch_id,))

        if not rows:
            return 0.0

        return float(rows[0][0] or 0)

    def _persist_legacy(self, score):

        self.engine_db.execute("""
        INSERT INTO engine.unified_scores
        (batch_id, final_score)
        VALUES (%s,%s)
        """, (self.batch_id, score))


    def _persist_new(self, score):

        self.engine_db.execute("""
        INSERT INTO engine.unified_scores (
            batch_id,
            matching_score,
            fk_score,
            profiling_score,
            graph_score,
            final_score
        )
        VALUES (%s,%s,%s,%s,%s,%s)
        """, (
            self.batch_id,
            self.matching_score,
            self.fk_score,
            self.profiling_score,
            self.graph_score,
            self.final_score
        ))

    def _persist_new_2(self, score):

        query = """
        INSERT INTO engine.unified_scores
        (batch_id, matching_score, fk_score, profiling_score, graph_score, final_score)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.matching_score,
            self.fk_score,
            self.profiling_score,
            self.graph_score,
            self.final_score
        ))

    def _persist(self, final_score):

        query = """
        INSERT INTO engine.unified_scores
        (batch_id, matching_score, fk_score, profiling_score, graph_score, final_score)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            getattr(self, "matching_score", None),
            getattr(self, "fk_score", None),
            getattr(self, "profiling_score", None),
            getattr(self, "graph_score", None),
            final_score
        ))

    

    def _persist_new_3(self, final_score):

        query = """
        INSERT INTO engine.unified_scores
        (batch_id, matching_score, fk_score, profiling_score, graph_score, final_score)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            getattr(self, "matching_score", None),
            getattr(self, "fk_score", None),
            getattr(self, "profiling_score", None),
            getattr(self, "graph_score", None),
            final_score
    ))
    
                
    def persist_weights(self, weights):

        query = """
        INSERT INTO engine.adaptive_weights
        (batch_id, matching_weight, fk_weight, graph_weight, profiling_weight)
        VALUES (%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            weights["matching"],
            weights["fk"],
            weights["graph"],
            weights["profiling"]
        ))