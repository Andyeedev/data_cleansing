from difflib import SequenceMatcher


class TableMatcher:

    def __init__(self, source_adapter, target_adapter, engine_db, batch_id):
        self.source = source_adapter
        self.target = target_adapter
        self.engine_db = engine_db
        self.batch_id = batch_id

    def match_tables(self):

        source_tables = self.source.get_tables()
        target_tables = self.target.get_tables()

        results = []

        THRESHOLD = 70

        for s in source_tables:
            for t in target_tables:

                name_score = self._name_similarity(s[1], t[1])
                schema_score = self._schema_similarity(s[1], t[1])
                data_score = self._data_similarity(s[1], t[1])

                final_score = (
                    0.3 * name_score +
                    0.3 * schema_score +
                    0.4 * data_score
                )

                # ✅ FILTER HERE
                if final_score >= THRESHOLD:
                    results.append((s[1], t[1], final_score))


                results.append((s[1], t[1], final_score))


        # ----------------------------------------
        # STEP 2: Deduplicate (BEST MATCH ONLY)
        # ----------------------------------------
        best_matches = {}

        for s, t, score in results:
            if s not in best_matches or best_matches[s][1] < score:
                best_matches[s] = (t, score)

        final_results = [(s, v[0], v[1]) for s, v in best_matches.items()]

        # ----------------------------------------
        # STEP 3: Persist
        # ----------------------------------------



        self._persist(results)

        return results
    
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
        