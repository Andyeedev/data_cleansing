import logging

logger = logging.getLogger(__name__)


class C010SchemaDriftRule:

    def __init__(self, source_db, target_db, parameters):

        self.source_db = source_db
        self.target_db = target_db
        self.params = parameters

    def execute(self):

        source_schema = self.params["source_schema"]
        source_table = self.params["source_table"]

        target_schema = self.params["target_schema"]
        target_table = self.params["target_table"]

        source_cols = self._get_columns(self.source_db, source_schema, source_table)
        target_cols = self._get_columns(self.target_db, target_schema, target_table)

        if not source_cols:
            return self._error("Source table not found", "SOURCE")

        if not target_cols:
            return self._error("Target table not found", "TARGET")

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
            "extra_columns": list(extra),
            "cause": "Schema drift detected" if drift > 0 else None,
            "failure_scope": "BOTH"
        }

    def _get_columns(self, db, schema, table):

        query = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = %s
        AND table_name = %s
        """

        result = db.execute(query, (schema, table))

        return [r[0] for r in result]

    def _error(self, cause, scope):

        return {
            "status": "ERROR",
            "delta": 0,
            "cause": cause,
            "failure_scope": scope
        }