class AdaptiveScoringEngine:

    def __init__(self, engine_db, batch_id):
        self.db = engine_db
        self.batch_id = batch_id

    def compute_weights(self):

        
        profiling = self.db.execute("""
            SELECT AVG(null_pct), AVG(uniqueness)
            FROM engine.data_profiling_results
            WHERE batch_id = %s
        """, (self.batch_id,))[0]

        avg_nulls, avg_uniqueness = profiling

        weights = {
            "matching": 0.3,
            "fk": 0.3,
            "graph": 0.2,
            "profiling": 0.2
        }

        # 🔥 ADAPT
        if avg_nulls > 0.3:
            weights["profiling"] += 0.2
            weights["matching"] -= 0.1

        if avg_uniqueness > 0.8:
            weights["fk"] += 0.1

        return weights