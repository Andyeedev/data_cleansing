import psycopg2
from .base_adapter import BaseAdapter


class PostgresAdapter(BaseAdapter):

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
    # METADATA
    # -----------------------------
    def get_tables(self):
        q = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = %s
        """
        rows = self.execute(q, (self.schema,))
        return [r[0] for r in rows] if rows else []

    def get_columns(self, table):
        q = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        """
        rows = self.execute(q, (self.schema, table))
        return [r[0] for r in rows] if rows else []

    def get_column_count(self, table):
        return len(self.get_columns(table))

    def get_column_type(self, table, column):
        q = """
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema=%s AND table_name=%s AND column_name=%s
        """
        result = self.execute(q, (self.schema, table, column))
        return result[0][0] if result else None

    # -----------------------------
    # DATA METRICS
    # -----------------------------
    def get_row_count(self, table):
        q = f'SELECT COUNT(*) FROM "{self.schema}"."{table}"'
        result = self.execute(q)
        return result[0][0] if result else 0

    def get_sum(self, table, column):
        q = f'SELECT COALESCE(SUM("{column}"),0) FROM "{self.schema}"."{table}"'
        result = self.execute(q)
        return result[0][0] if result else 0

    def get_stats(self, table, column):
        q = f"""
        SELECT AVG("{column}"), MIN("{column}"), MAX("{column}"), STDDEV("{column}")
        FROM "{self.schema}"."{table}"
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
    def count_nulls(self, table, column):
        q = f"""
        SELECT COUNT(*) FROM "{self.schema}"."{table}"
        WHERE "{column}" IS NULL
        """
        result = self.execute(q)
        return result[0][0] if result else 0

    def count_duplicates(self, table, column):
        q = f"""
        SELECT COUNT(*) FROM (
            SELECT "{column}", COUNT(*)
            FROM "{self.schema}"."{table}"
            GROUP BY "{column}"
            HAVING COUNT(*) > 1
        ) t
        """
        result = self.execute(q)
        return result[0][0] if result else 0

    # -----------------------------
    # RELATIONSHIPS
    # -----------------------------
    def count_missing_fk(self, child, parent, column):
        q = f"""
        SELECT COUNT(*)
        FROM "{self.schema}"."{child}" c
        LEFT JOIN "{self.schema}"."{parent}" p
        ON c."{column}" = p."{column}"
        WHERE p."{column}" IS NULL
        """
        result = self.execute(q)
        return result[0][0] if result else 0