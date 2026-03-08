import logging

logger = logging.getLogger(__name__)


class C08DataDriftDetectionRule:

    def __init__(self, source_db, target_db, parameters):

        self.source_db = source_db
        self.target_db = target_db
        self.params = parameters

    def execute(self):

        schema = self.params["source_schema"]
        table = self.params["source_table"]

        column = self.params.get("numeric_column")

        if not column:
            return {"status": "SKIPPED", "delta": 0}

        source_stats = self._get_stats(self.source_db, schema, table, column)
        target_stats = self._get_stats(self.target_db, schema, table, column)

        drift = abs(source_stats["avg"] - target_stats["avg"])

        drift_pct = 0

        if source_stats["avg"] != 0:
            drift_pct = (drift / source_stats["avg"]) * 100

        status = "PASS"

        if drift_pct > 10:
            status = "FAIL"

        return {
            "status": status,
            "delta": drift_pct,
            "source_value": source_stats["avg"],
            "target_value": target_stats["avg"]
        }

    def _get_stats(self, db, schema, table, column):

        query = f"""
        SELECT
            AVG({column}),
            MIN({column}),
            MAX({column}),
            STDDEV({column})
        FROM {schema}.{table}
        """

        result = db.execute(query)[0]

        return {
            "avg": result[0] or 0,
            "min": result[1] or 0,
            "max": result[2] or 0,
            "stddev": result[3] or 0
        }