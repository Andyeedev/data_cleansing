from app.rules.base_rule import BaseRule


class SumCompareRule(BaseRule):

    """
    C02 Rule
    --------
    Compares SUM of numeric column between source and target tables.

    PASS  -> sums match
    FAIL  -> sums differ
    SKIPPED -> numeric column not defined
    ERROR -> SQL execution failure
    """

    def execute(self):

        try:

            source_schema = self.parameters["source_schema"]
            source_table = self.parameters["source_table"]

            target_schema = self.parameters["target_schema"]
            target_table = self.parameters["target_table"]

            numeric_column = self.parameters.get("numeric_column")

            # --------------------------------------------------
            # VALIDATION
            # --------------------------------------------------

            if not numeric_column:

                return {
                    "status": "SKIPPED",
                    "message": "No numeric column defined",
                    "delta": 0
                }

            # --------------------------------------------------
            # SOURCE SUM
            # --------------------------------------------------

            source_query = f"""
            SELECT COALESCE(SUM({numeric_column}),0)
            FROM {source_schema}.{source_table}
            """

            source_result = self.source_db.execute(source_query)

            source_sum = source_result[0][0] if source_result else 0

            # --------------------------------------------------
            # TARGET SUM
            # --------------------------------------------------

            target_query = f"""
            SELECT COALESCE(SUM({numeric_column}),0)
            FROM {target_schema}.{target_table}
            """

            target_result = self.target_db.execute(target_query)

            target_sum = target_result[0][0] if target_result else 0

            # --------------------------------------------------
            # CALCULATE DELTA
            # --------------------------------------------------

            delta = abs(float(source_sum) - float(target_sum))

            # --------------------------------------------------
            # RESULT
            # --------------------------------------------------

            if delta == 0:

                return {
                    "status": "PASS",
                    "source_value": float(source_sum),
                    "target_value": float(target_sum),
                    "delta": delta
                }

            else:

                return {
                    "status": "FAIL",
                    "source_value": float(source_sum),
                    "target_value": float(target_sum),
                    "delta": delta
                }

        except Exception as e:

            return {
                "status": "ERROR",
                "message": str(e),
                "delta": 0
            }