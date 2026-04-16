import logging

logger = logging.getLogger(__name__)


class C08DataDriftDetectionRule:

    def __init__(self, source_db, target_db, parameters):

        self.source_db = source_db
        self.target_db = target_db
        self.params = parameters

    def execute(self):

        try:

            source_schema = self.params["source_schema"]
            source_table = self.params["source_table"]

            target_schema = self.params.get("target_schema", source_schema)
            target_table = self.params.get("target_table", source_table)

            numeric_columns = self.params.get("numeric_columns")

            if not numeric_columns:

                return {
                    "status": "SKIPPED",
                    "delta": 0,
                    "cause": "No numeric columns detected for drift analysis",
                    "failure_scope": "ENGINE"
                }

            max_drift = 0
            worst_column = None

            for column in numeric_columns:

                source_stats = self._get_stats(self.source_db, source_schema, source_table, column)
                target_stats = self._get_stats(self.target_db, target_schema, target_table, column)

                if source_stats is None or target_stats is None:
                    continue

                drift = abs(source_stats["avg"] - target_stats["avg"])

                drift_pct = 0

                if source_stats["avg"] != 0:
                    drift_pct = (drift / source_stats["avg"]) * 100

                if drift_pct > max_drift:
                    max_drift = drift_pct
                    worst_column = column

            status = "PASS"

            if max_drift > 10:
                status = "FAIL"

            return {
                "status": status,
                "delta": max_drift,
                "cause": f"High drift detected on column {worst_column}" if status == "FAIL" else None,
                "failure_scope": "BOTH"
            }

        except Exception as e:

            logger.exception("C08_DATA_DRIFT execution failed")

            return {
                "status": "ERROR",
                "delta": 0,
                "cause": str(e),
                "failure_scope": "ENGINE"
            }

    def _get_stats(self, db, schema, table, column):

        try:

            query = f"""
            SELECT
                AVG({column}),
                MIN({column}),
                MAX({column}),
                STDDEV({column})
            FROM {schema}.{table}
            """

            result = db.execute(query)

            if not result:
                return None

            row = result[0]

            return {
                "avg": row[0] or 0,
                "min": row[1] or 0,
                "max": row[2] or 0,
                "stddev": row[3] or 0
            }

        except Exception:

            return None