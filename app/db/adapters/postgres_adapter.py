import psycopg2
from .base_adapter import BaseAdapter


class PostgresAdapter(BaseAdapter):

    # -----------------------------
    # INIT
    # -----------------------------
    def __init__(self, config):
        super().__init__(config)
        self.schema = config.get("schema", "public")

    # -----------------------------
    # CONNECTION
    # -----------------------------
    def connect(self):
        allowed = ["host", "port", "dbname", "user", "password"]
        clean_config = {k: v for k, v in self.config.items() if k in allowed}

        self.connection = psycopg2.connect(**clean_config)
        self.connection.autocommit = True

        self.capabilities.update({
            "supports_constraints": True,
            "supports_information_schema": True,
            "requires_inference": False
        })

    # -----------------------------
    # CORE EXECUTION
    # -----------------------------
    def execute(self, query, params=None):
        with self.connection.cursor() as cur:
            cur.execute(query, params or ())
            try:
                return cur.fetchall()
            except:
                return None

    # -----------------------------
    # INTERNAL HELPERS
    # -----------------------------
    def _resolve_table(self, *args):
        """
        Supports:
        (table)
        (schema, table)
        """
        if len(args) == 1:
            return self.schema, args[0]
        elif len(args) == 2:
            return args[0], args[1]
        else:
            raise Exception("Invalid arguments")

    # -----------------------------
    # METADATA
    # -----------------------------
    def get_tables_legacy(self):
        q = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = %s
        """
        rows = self.execute(q, (self.schema,))
        return [r[0] for r in rows] if rows else []
    

    def get_tables(self):
        tables = []

        for schema in self.schemas:
            q = """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = %s
            AND table_type = 'BASE TABLE'
            """
            rows = self.execute(q, (schema,))
            tables.extend([(schema, r[0]) for r in rows])

        return tables

    def get_columns_legacy(self, *args):
        schema, table = self._resolve_table(*args)

        q = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        """
        rows = self.execute(q, (schema, table))
        return [r[0] for r in rows] if rows else []
    
    def get_columns(self, schema, table=None):

        # ✅ SUPPORT OLD CALL STYLE: get_columns(table)
        if table is None:
            table = schema
            schema = self.schemas[0]

        q = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        """
        rows = self.execute(q, (schema, table))
        return [r[0] for r in rows]

    def get_column_count(self, *args):
        return len(self.get_columns(*args))

    def get_column_type(self, *args):
        schema, table, column = args

        q = """
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema=%s AND table_name=%s AND column_name=%s
        """
        r = self.execute(q, (schema, table, column))
        return r[0][0] if r else None

    # -----------------------------
    # DATA METRICS
    # -----------------------------
    def get_row_count(self, *args):
        schema, table = self._resolve_table(*args)

        q = f'SELECT COUNT(*) FROM "{schema}"."{table}"'
        r = self.execute(q)
        return r[0][0] if r else 0

    def get_sum(self, *args):
        schema, table, column = args

        q = f'SELECT COALESCE(SUM("{column}"),0) FROM "{schema}"."{table}"'
        r = self.execute(q)
        return r[0][0] if r else 0

    def get_stats(self, *args):
        schema, table, column = args

        q = f"""
        SELECT AVG("{column}"), MIN("{column}"), MAX("{column}"), STDDEV("{column}")
        FROM "{schema}"."{table}"
        """
        r = self.execute(q)
        if not r:
            return {"avg": None, "min": None, "max": None, "stddev": None}

        r = r[0]
        return {
            "avg": r[0],
            "min": r[1],
            "max": r[2],
            "stddev": r[3]
        }

    # -----------------------------
    # DATA QUALITY
    # -----------------------------
    def count_nulls(self, *args):
        schema, table, column = args

        q = f"""
        SELECT COUNT(*) FROM "{schema}"."{table}"
        WHERE "{column}" IS NULL
        """
        r = self.execute(q)
        return r[0][0] if r else 0

    def count_duplicates(self, *args):
        schema, table, column = args

        q = f"""
        SELECT COUNT(*) FROM (
            SELECT "{column}", COUNT(*)
            FROM "{schema}"."{table}"
            GROUP BY "{column}"
            HAVING COUNT(*) > 1
        ) t
        """
        r = self.execute(q)
        return r[0][0] if r else 0

    # -----------------------------
    # RELATIONSHIPS
    # -----------------------------
    def count_missing_fk(self, *args):
        schema, child, parent, column = args

        q = f"""
        SELECT COUNT(*)
        FROM "{schema}"."{child}" c
        LEFT JOIN "{schema}"."{parent}" p
        ON c."{column}" = p."{column}"
        WHERE p."{column}" IS NULL
        """
        r = self.execute(q)
        return r[0][0] if r else 0
    
    def get_default_schema(self):
        return "public"
    
    def get_foreign_keys(self):

        query = """
        SELECT
            tc.table_schema,
            tc.table_name,
            kcu.column_name,
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE constraint_type = 'FOREIGN KEY'
        """

        rows = self.execute(query)

        return [
            (
                r[0], r[1], r[2],
                r[3], r[4], r[5]
            )
            for r in rows
        ]