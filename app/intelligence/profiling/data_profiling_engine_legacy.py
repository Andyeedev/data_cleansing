import re


class DataProfilingEngine:

    def __init___legacy(self, db, batch_id):
        self.db = db
        self.batch_id = batch_id

    def __init__(self, source_db, engine_db, batch_id):
        self.source_db = source_db
        self.engine_db = engine_db
        self.batch_id = batch_id

    # ---------------------------------------------------------
    # MAIN ENTRY
    # ---------------------------------------------------------
    def run(self):

        #tables = self.db.execute("""
        #    SELECT table_name
        #    FROM information_schema.tables
        #    WHERE table_schema = 'public'
        #""")

        tables = self.source_db.adapter.get_tables()

        results = []

        for (table,) in tables:

            columns = self._get_columns(table)

            for col in columns:

                profile = self._profile_column(table, col)

                results.append(profile)

        self._persist(results)

        return results

    # ---------------------------------------------------------
    # GET COLUMNS
    # ---------------------------------------------------------
    def _get_columns(self, table):

        rows = self.db.execute(f"""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = %s
        """, (table,))

        return [r[0] for r in rows]

    # ---------------------------------------------------------
    # PROFILE COLUMN
    # ---------------------------------------------------------
    def _profile_column(self, table, column):

        total = self._scalar(f"SELECT COUNT(*) FROM {table}")
        nulls = self._scalar(f"SELECT COUNT(*) FROM {table} WHERE {column} IS NULL")

        distinct = self._scalar(f"""
            SELECT COUNT(DISTINCT {column}) FROM {table}
        """)

        sample = self.db.execute(f"""
            SELECT {column}
            FROM {table}
            WHERE {column} IS NOT NULL
            LIMIT 100
        """)

        pattern = self._detect_pattern(sample)

        return {
            "table": table,
            "column": column,
            "null_pct": nulls / total if total else 0,
            "uniqueness": distinct / total if total else 0,
            "pattern": pattern
        }

    # ---------------------------------------------------------
    # HELPER
    # ---------------------------------------------------------
    def _scalar(self, query):

        result = self.db.execute(query)
        return result[0][0] if result else 0

    # ---------------------------------------------------------
    # PATTERN DETECTION
    # ---------------------------------------------------------
    def _detect_pattern(self, sample):

        values = [str(v[0]) for v in sample if v[0]]

        if not values:
            return "unknown"

        if all(v.isdigit() for v in values):
            return "numeric"

        if all(re.match(r"[^@]+@[^@]+\.[^@]+", v) for v in values):
            return "email"

        if all(re.match(r"\d{4}-\d{2}-\d{2}", v) for v in values):
            return "date"

        return "mixed"

    # ---------------------------------------------------------
    # STORE RESULTS
    # ---------------------------------------------------------
    def _persist_legacy(self, results):

        query = """
        INSERT INTO engine.data_profiling_results
        (batch_id, table_name, column_name, null_pct, uniqueness, pattern)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        for r in results:
            self.db.execute(query, (
                self.batch_id,
                r["table"],
                r["column"],
                r["null_pct"],
                r["uniqueness"],
                r["pattern"]
            ))

    def _persist(self, results):

        query = """
        INSERT INTO engine.data_profiling_results
        (batch_id, table_name, column_name, null_pct, uniqueness, pattern)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        for r in results:
            self.engine_db.execute(query, (
                self.batch_id,
                r["table"],
                r["column"],
                r["null_pct"],
                r["uniqueness"],
                r["pattern"]
            ))