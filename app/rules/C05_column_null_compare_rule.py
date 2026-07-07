from .base_rule import BaseRule


class ColumnNullCompareRule(BaseRule):

    RULE_ID = "C05_NULL_CHECK"

    REQUIRED_PARAMETERS = [
        "mapping_id",
        "source_table",
        "target_table"
    ]

    def execute(self):

        source_schema = self.parameters["source_schema"]
        source_table = self.parameters["source_table"]
        target_schema = self.parameters["target_schema"]
        target_table = self.parameters["target_table"]

        # -----------------------------------------
        # 1️⃣ Fetch mapped columns for this table
        # -----------------------------------------

        column_query = """
        SELECT dc.column_name
        FROM core.column_mappings cm
        JOIN core.dataset_columns dc
            ON cm.source_column_id = dc.column_id
        WHERE cm.mapping_id = %s
        """

        columns = self.engine_db.execute(
            column_query,
            (self.parameters["mapping_id"],)
        )

        total_delta = 0
        failing_columns = []

        # -----------------------------------------
        # 2️⃣ Compare null counts column by column
        # -----------------------------------------

        for row in columns:

            column = row[0]

            # Basic safety check
            if not column.replace("_", "").isalnum():
                raise ValueError(f"Unsafe column identifier: {column}")

            source_query = f"""
                SELECT COUNT(*)
                FROM {source_schema}.{source_table}
                WHERE "{column}" IS NULL
            """

            target_query = f"""
                SELECT COUNT(*)
                FROM {target_schema}.{target_table}
                WHERE "{column}" IS NULL
            """

            source_nulls = self.source_db.execute(source_query)[0][0]
            target_nulls = self.target_db.execute(target_query)[0][0]

            delta = abs(source_nulls - target_nulls)

            if delta > 0:
                failing_columns.append(column)

            total_delta += delta

        # -----------------------------------------
        # 3️⃣ Final Status
        # -----------------------------------------

        status = "PASS" if total_delta == 0 else "FAIL"

        return {
            "source_value": "COLUMN_NULL_COMPARE",
            "target_value": "COLUMN_NULL_COMPARE",
            "delta": total_delta,
            "status": status
        }
