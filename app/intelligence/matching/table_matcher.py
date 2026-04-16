from difflib import SequenceMatcher
class TableMatcher:

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

    

    def match_tables_legacy(self):

        source_tables = self.source_db.adapter.get_tables()
        target_tables = self.target_db.adapter.get_tables()

        results = []
        THRESHOLD = 70

        for s in source_tables:
            for t in target_tables:

                s_name = s if isinstance(s, str) else s[1]
                t_name = t if isinstance(t, str) else t[1]

                name_score = self._name_similarity(s_name, t_name)

                schema_score = 50
                data_score = 50

                final_score = (
                    0.3 * name_score +
                    0.3 * schema_score +
                    0.4 * data_score
                )

                if final_score >= THRESHOLD:
                    results.append((s_name, t_name, final_score))

        self._persist(results)
        return results
    

    
    def match_tables_current_1(self):

        source_tables = self.source_db.adapter.get_tables()
        target_tables = self.target_db.adapter.get_tables()

        results = []
        THRESHOLD = 70

        for s_schema, s_table in source_tables:
            for t_schema, t_table in target_tables:

                name_score = self._name_similarity(s_table, t_table)

                schema_score = 100 if s_schema == t_schema else 50
                data_score = 50

                final_score = (
                    0.3 * name_score +
                    0.3 * schema_score +
                    0.4 * data_score
                )

                if final_score >= THRESHOLD:
                    results.append((
                        f"{s_schema}.{s_table}",
                        f"{t_schema}.{t_table}",
                        final_score
                    ))

        self._persist(results)
        return results
    
    def match_tables(self):

        source_tables = self.source_adapter.get_tables()
        target_tables = self.target_adapter.get_tables()

        results = []
        THRESHOLD = 70

        for s_schema, s_table in source_tables:
            for t_schema, t_table in target_tables:

                name_score = self._name_similarity(s_table, t_table)

                schema_score = 100 if s_schema == t_schema else 50
                data_score = 50

                final_score = (
                    0.3 * name_score +
                    0.3 * schema_score +
                    0.4 * data_score
                )

                if final_score >= THRESHOLD:
                    results.append((
                        f"{s_schema}.{s_table}",
                        f"{t_schema}.{t_table}",
                        final_score
                    ))

        self._persist(results)
        return results





       




    def _name_similarity(self, a, b):
        return int(SequenceMatcher(None, a.lower(), b.lower()).ratio() * 100)

    def _persist_legacy(self, results):

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


    def _persist(self, results):

        query = """
        INSERT INTO engine.table_matching_results
        (batch_id, source_table, target_table, match_confidence)
        VALUES (%s,%s,%s,%s)
        """

        for r in results:
            try:
                self.engine_db.execute(query, (
                    self.batch_id,
                    r[0],
                    r[1],
                    r[2]
                ))
            except Exception as e:
                print(f"[TableMatch ERROR] {r} → {e}")