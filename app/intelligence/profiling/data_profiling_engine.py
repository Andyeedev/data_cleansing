import re


class DataProfilingEngine:

    def __init___legacy(self, source_db, engine_db, batch_id):
        self.source_db = source_db
        self.engine_db = engine_db
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

    # ---------------------------------------------------------
    # MAIN ENTRY
    # ---------------------------------------------------------
    def run_legacy(self):

        # ✅ Adapter-driven (multi-DB safe)
        tables = self.source_db.adapter.get_tables()

        results = []

        for table in tables:

            columns = self.source_db.adapter.get_columns(table)

            for col in columns:

                profile = self._profile_column(table, col)
                results.append(profile)

        self._persist(results)

        return results

    
    def run_current_1(self):

        # ✅ Adapter-driven (multi-schema safe)
        tables = self.source_db.adapter.get_tables()

        results = []

        for schema, table in tables:

            print(f"[Profiling] {schema}.{table}")

            columns = self.source_db.adapter.get_columns(schema, table)

            # ✅ Compute ONCE per table
            row_count = self.source_db.adapter.get_row_count(schema, table)

            for col in columns:
                # ✅ Pass schema everywhere
                profile = self._profile_column(schema, table, col, row_count)
                results.append(profile)


        self._persist(results)

        return results
    

    def run_current_2(self):

        tables = self.source_adapter.get_tables()

        results = []

        for schema, table in tables:

            print(f"[Profiling] {schema}.{table}")

            columns = self.source_adapter.get_columns(schema, table)

            row_count = self.source_adapter.get_row_count(schema, table)

            for col in columns:
                profile = self._profile_column(schema, table, col, row_count)
                results.append(profile)

        self._persist(results)

        return results
            
    def run(self):

        tables = self.source_adapter.get_tables()

        results = []

        for schema, table in tables:

            print(f"[Profiling] {schema}.{table}")

            columns = self.source_adapter.get_columns(schema, table)
            row_count = self.source_adapter.get_row_count(schema, table)

            for col in columns:
                profile = self._profile_column(schema, table, col, row_count)
                results.append(profile)

        self._persist(results)

        return results


    def load(self):

        if self.source_adapter.capabilities.get("supports_constraints"):
            return self._load_from_adapter(self.source_adapter)

        # ❗ fallback → no real FK → inference only
        return set()
            
        
    # ---------------------------------------------------------
    # PROFILE COLUMN
    # ---------------------------------------------------------
    def _profile_column_legacy(self, table, column):

        total = self._scalar(f"SELECT COUNT(*) FROM {table}")
        nulls = self._scalar(f"SELECT COUNT(*) FROM {table} WHERE {column} IS NULL")

        distinct = self._scalar(f"""
            SELECT COUNT(DISTINCT {column}) FROM {table}
        """)

        sample = self.source_db.execute(f"""
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
    

    def _profile_column_current_1(self, schema, table, column, row_count_cache=None):

        adapter = self.source_db.adapter

        try:
            # ✅ Use cached row count if available
            if row_count_cache is not None:
                row_count = row_count_cache
            else:
                row_count = adapter.get_row_count(schema, table)

            return {
                "schema": schema,
                "table": table,
                "column": column,
                "null_count": adapter.count_nulls(schema, table, column),
                "row_count": row_count,
                "data_type": adapter.get_column_type(schema, table, column),
            }

        except Exception as e:
            print(f"[Profiling ERROR] {schema}.{table}.{column} → {e}")

            return {
                "schema": schema,
                "table": table,
                "column": column,
                "error": str(e)
            }
    

    def _profile_column(self, schema, table, column, row_count_cache=None):

        adapter = self.source_adapter   # ✅ FIXED

        try:
            row_count = row_count_cache or adapter.get_row_count(schema, table)

            return {
                "schema": schema,
                "table": table,
                "column": column,
                "null_count": adapter.count_nulls(schema, table, column),
                "row_count": row_count,
                "data_type": adapter.get_column_type(schema, table, column),
            }

        except Exception as e:
            print(f"[Profiling ERROR] {schema}.{table}.{column} → {e}")

            return {
                "schema": schema,
                "table": table,
                "column": column,
                "error": str(e)
            }
        

    # ---------------------------------------------------------
    # HELPER
    # ---------------------------------------------------------
    def _scalar(self, query):

        result = self.source_db.execute(query)
        return result[0][0] if result else 0

    # ---------------------------------------------------------
    # PATTERN DETECTION
    # ---------------------------------------------------------
    def _detect_pattern(self, sample):

        values = [str(v[0]) for v in sample if v and v[0] is not None]

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
    # STORE RESULTS (ENGINE DB ONLY)
    # ---------------------------------------------------------
    def _persist_legacy(self, results):

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

    
    def _persist_legacy_1(self, results):

        query = """
        INSERT INTO engine.data_profiling_results
        (batch_id, schema_name, table_name, column_name, null_count, row_count, data_type)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        for r in results:

            # ✅ skip failed profiles safely
            if "error" in r:
                continue

            self.engine_db.execute(query, (
                self.batch_id,
                r["schema"],
                r["table"],
                r["column"],
                r["null_count"],
                r["row_count"],
                r["data_type"]
            ))

    def _persist(self, results):

        query = """
        INSERT INTO engine.data_profiling_results
        (
            batch_id,
            schema_name,
            table_name,
            column_name,
            null_count,
            row_count,
            null_pct,
            uniqueness,
            data_type
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """

        for r in results:

            try:
                null_pct = (r["null_count"] / r["row_count"]) if r["row_count"] else 0

                # ⚠️ TEMP SAFE uniqueness until you compute it properly
                uniqueness = 1 if r["row_count"] > 0 else 0

                self.engine_db.execute(query, (
                    self.batch_id,
                    r["schema"],
                    r["table"],
                    r["column"],
                    r["null_count"],
                    r["row_count"],
                    null_pct,
                    uniqueness,
                    r.get("data_type")
                ))

            except Exception as e:
                print(f"[Profiling Persist ERROR] {r} → {e}")