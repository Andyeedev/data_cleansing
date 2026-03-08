import logging

logger = logging.getLogger(__name__)


class C010SchemaDriftRule:

    def __init__(self, source_db, target_db, parameters):

        self.source_db = source_db
        self.target_db = target_db
        self.params = parameters

    def execute(self):

        schema = self.params["source_schema"]
        table = self.params["source_table"]

        source_cols = self._get_columns(self.source_db, schema, table)
        target_cols = self._get_columns(self.target_db, schema, table)

        source_set = set(source_cols)
        target_set = set(target_cols)

        missing = source_set - target_set
        extra = target_set - source_set

        drift = len(missing) + len(extra)

        status = "PASS"

        if drift > 0:
            status = "FAIL"

        return {
            "status": status,
            "delta": drift,
            "missing_columns": list(missing),
            "extra_columns": list(extra)
        }

    def _get_columns(self, db, schema, table):

        query = f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = '{schema}'
        AND table_name = '{table}'
        """

        result = db.execute(query)

        return [r[0] for r in result]