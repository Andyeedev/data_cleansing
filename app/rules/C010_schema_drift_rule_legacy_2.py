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

        if source_cols is None:
            return self._error("Source table not found", "SOURCE")

        if target_cols is None:
            return self._error("Target table not found", "TARGET")

        source_set = set(source_cols)
        target_set = set(target_cols)

        missing = source_set - target_set
        extra = target_set - source_set

        drift = len(missing) + len(extra)

        if drift == 0:
            return {
                "status": "PASS",
                "delta": 0
            }

        cause_msg = f"Missing columns in target: {list(missing)} | Extra columns in target: {list(extra)}"

        return {
            "status": "FAIL",
            "delta": drift,
            "missing_columns": list(missing),
            "extra_columns": list(extra),
            "cause": cause_msg,
            "failure_scope": "TARGET"
        }

    def _get_columns(self, db, schema, table):

        try:

            query = """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = %s
            AND table_name = %s
            """

            result = db.execute(query, (schema, table))

            if result is None:
                return None

            return [r[0] for r in result]

        except Exception as e:

            logger.warning(f"Schema lookup failed for {schema}.{table}: {e}")

            return None

    def _error(self, cause, scope):

        return {
            "status": "ERROR",
            "delta": 0,
            "cause": cause,
            "failure_scope": scope
        }