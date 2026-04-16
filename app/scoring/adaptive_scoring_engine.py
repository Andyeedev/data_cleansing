class AdaptiveScoringEngine:

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

    def compute_weights_legacy(self):

        row = self.engine_db.execute("""
            SELECT AVG(null_pct), AVG(uniqueness)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0]

        avg_nulls = row[0] or 0
        avg_uniqueness = row[1] or 0

        weights = {
            "matching": 0.3,
            "fk": 0.3,
            "graph": 0.2,
            "profiling": 0.2
        }

        # 🔥 Adaptive logic
        if avg_nulls > 0.3:
            weights["profiling"] += 0.2
            weights["matching"] -= 0.1

        if avg_uniqueness > 0.8:
            weights["fk"] += 0.1

        return weights

    def compute_weights(self):

        row = self.engine_db.execute("""
            SELECT AVG(null_count), AVG(row_count)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0]

        avg_nulls = row[0] or 0
        avg_rows = row[1] or 1



        weights = {
            "matching": 0.3,
            "fk": 0.3,
            "graph": 0.2,
            "profiling": 0.2
        }


        null_ratio = avg_nulls / avg_rows if avg_rows else 0

        if null_ratio > 0.3:
            weights["profiling"] += 0.2
            weights["matching"] -= 0.1
            

        # 🔥 Adaptive logic
        #if avg_nulls > 0.3:
        #    weights["profiling"] += 0.2
        #    weights["matching"] -= 0.1

        # we need to clarify why  avg_uniqueness  was used instead of avg_rows,
        # I have changed from  vg_uniqueness  to avg_rows.

        if avg_rows > 0.8:
            weights["fk"] += 0.1

        return weights