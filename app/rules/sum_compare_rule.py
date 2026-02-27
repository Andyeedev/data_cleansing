from .base_rule import BaseRule


class SumCompareRule(BaseRule):

    def execute(self):

        # ------------------------------
        # 1️⃣ Required Parameter Validation
        # ------------------------------

        required_params = [
            "source_schema",
            "source_table",
            "target_schema",
            "target_table",
            "numeric_column"
        ]

        for param in required_params:
            if not self.parameters.get(param):
                raise ValueError(f"Missing required parameter '{param}' for SumCompareRule")

        # ------------------------------
        # 2️⃣ Extract Parameters
        # ------------------------------

        source_schema = self.parameters["source_schema"]
        source_table = self.parameters["source_table"]
        target_schema = self.parameters["target_schema"]
        target_table = self.parameters["target_table"]
        column = self.parameters["numeric_column"]

        tolerance = self.parameters.get("tolerance_value", 0)

        # ------------------------------
        # 3️⃣ Basic Identifier Safety Check
        # (Prevent obvious injection)
        # ------------------------------

        def validate_identifier(value):
            if not value.replace("_", "").isalnum():
                raise ValueError(f"Unsafe SQL identifier detected: {value}")

        for identifier in [
            source_schema,
            source_table,
            target_schema,
            target_table,
            column
        ]:
            validate_identifier(identifier)

        # ------------------------------
        # 4️⃣ Build Queries
        # ------------------------------

        source_query = f"""
            SELECT COALESCE(SUM({column}), 0)
            FROM {source_schema}.{source_table}
        """

        target_query = f"""
            SELECT COALESCE(SUM({column}), 0)
            FROM {target_schema}.{target_table}
        """

        # ------------------------------
        # 5️⃣ Execute Queries
        # ------------------------------

        source_result = self.source_db.execute(source_query)
        target_result = self.target_db.execute(target_query)

        source_sum = source_result[0][0] if source_result else 0
        target_sum = target_result[0][0] if target_result else 0

        # ------------------------------
        # 6️⃣ Compute Delta
        # ------------------------------

        delta = abs(source_sum - target_sum)

        status = "PASS" if delta <= tolerance else "FAIL"

        # ------------------------------
        # 7️⃣ Return Structured Result
        # ------------------------------

        return {
            "source_value": float(source_sum),
            "target_value": float(target_sum),
            "delta": float(delta),
            "status": status
        }
