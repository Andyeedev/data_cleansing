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

            numeric_columns = self.parameters.get("numeric_columns", [])
            single_column = self.parameters.get("numeric_column")

            if single_column and single_column not in numeric_columns:
                numeric_columns = [single_column]

            # --------------------------------------------------
            # VALIDATION
            # --------------------------------------------------

            if not numeric_columns:

                source_schema = self.parameters.get("source_schema", "unknown")
                source_table = self.parameters.get("source_table", "unknown")
                return {
                    "status": "SKIPPED",
                    "message": f"No numeric columns found for {source_schema}.{source_table}. Tag decimal/numeric columns with inferred_role='NUMERIC_METRIC' in core.dataset_columns to enable balance reconciliation.",
                    "cause": "NO_NUMERIC_COLUMN",
                    "delta": 0
                }

            # --------------------------------------------------
            # SINGLE COLUMN MODE (backward compatible)
            # --------------------------------------------------

            if len(numeric_columns) == 1:

                return self._compare_column(
                    source_schema, source_table,
                    target_schema, target_table,
                    numeric_columns[0]
                )

            # --------------------------------------------------
            # MULTI-COLUMN MODE
            # --------------------------------------------------

            results = []
            worst_status = "PASS"
            total_delta = 0

            for col in numeric_columns:

                result = self._compare_column(
                    source_schema, source_table,
                    target_schema, target_table,
                    col
                )

                results.append({
                    "column": col,
                    "status": result["status"],
                    "source_value": result.get("source_value", 0),
                    "target_value": result.get("target_value", 0),
                    "delta": result.get("delta", 0)
                })

                total_delta += result.get("delta", 0)

                if result["status"] == "FAIL":
                    worst_status = "FAIL"
                elif result["status"] == "ERROR" and worst_status != "FAIL":
                    worst_status = "ERROR"

            return {
                "status": worst_status,
                "delta": total_delta,
                "column_results": results,
                "columns_checked": len(numeric_columns)
            }

        except Exception as e:

            return {
                "status": "ERROR",
                "message": str(e),
                "delta": 0
            }

    def _compare_column(self, source_schema, source_table, target_schema, target_table, column):

        source_query = f"""
        SELECT COALESCE(SUM({column}),0)
        FROM {source_schema}.{source_table}
        """

        source_result = self.source_db.execute(source_query)
        source_sum = source_result[0][0] if source_result else 0

        target_query = f"""
        SELECT COALESCE(SUM({column}),0)
        FROM {target_schema}.{target_table}
        """

        target_result = self.target_db.execute(target_query)
        target_sum = target_result[0][0] if target_result else 0

        delta = abs(float(source_sum) - float(target_sum))

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
