class FKInferenceEngine:

    def __init__(self, source_adapter, engine_db, batch_id):
        self.source = source_adapter
        self.engine_db = engine_db
        self.batch_id = batch_id

    def infer(self):

        columns = self.source.get_columns()

        results = []

        for c1 in columns:
            for c2 in columns:

                if c1 == c2:
                    continue

                score = self._calculate_fk_score(c1, c2)

                if score > 70:
                    results.append((c1, c2, score))

        self._persist(results)
        return results

    def _calculate_fk_score(self, col1, col2):

        score = 0

        # Name pattern
        if col1[1].endswith("_id") and col1[1].replace("_id", "") in col2[0]:
            score += 40

        # Type match
        if col1[2] == col2[2]:
            score += 20

        # Placeholder for data overlap
        score += 30

        return score
    
    def _persist(self, results):

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_column, target_column, confidence)
        VALUES (%s,%s,%s,%s)
        """

        for r in results:
            self.engine_db.execute(query, (
                self.batch_id,
                str(r[0]),
                str(r[1]),
                r[2]
            ))