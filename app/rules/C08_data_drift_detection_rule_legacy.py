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

            column = self.params.get("numeric_column")

            # If no numeric column provided the rule cannot run
            if not column:
                return {
                    "status": "SKIPPED",
                    "delta": 0,
                    "cause": "No numeric column provided for drift analysis",
                    "failure_scope": "ENGINE"
                }

            source_stats = self._get_stats(
                self.source_db,
                source_schema,
                source_table,
                column
            )

            target_stats = self._get_stats(
                self.target_db,
                target_schema,
                target_table,
                column
            )

            if source_stats is None:
                return self._error(
                    "Source table or column not found",
                    "SOURCE"
                )

            if target_stats is None:
                return self._error(
                    "Target table or column not found",
                    "TARGET"
                )

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
                "target_value": target_stats["avg"],
                "cause": "Data drift detected" if status == "FAIL" else None,
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

        except Exception as e:

            logger.warning(
                f"Stats query failed for {schema}.{table}.{column}: {e}"
            )

            return None

    def _error(self, cause, scope):

        return {
            "status": "ERROR",
            "delta": 0,
            "cause": cause,
            "failure_scope": scope
        }