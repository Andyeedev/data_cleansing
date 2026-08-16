from .base_rule import BaseRule


class DataTypeMatchRule(BaseRule):

    RULE_ID = "C06_DATA_TYPE_MATCH"

    REQUIRED_PARAMETERS = [
        "mapping_id",
        "source_table",
        "target_table"
    ]

    def execute(self):

        mapping_id = self.parameters["mapping_id"]

        source_schema = self.parameters["source_schema"]
        source_table = self.parameters["source_table"]
        target_schema = self.parameters["target_schema"]
        target_table = self.parameters["target_table"]

        # -----------------------------------------
        # 1️⃣ Fetch mapped column names
        # -----------------------------------------

        column_query = """
        SELECT
            src.column_name AS source_column,
            tgt.column_name AS target_column
        FROM core.column_mappings cm
        JOIN core.dataset_columns src
            ON cm.source_column_id = src.column_id
        JOIN core.dataset_columns tgt
            ON cm.target_column_id = tgt.column_id
        WHERE cm.mapping_id = %s
        """

        columns = self.engine_db.execute(column_query, (mapping_id,))

        total_mismatch = 0
        mismatched_columns = []

        # -----------------------------------------
        # 2️⃣ Compare data types
        # -----------------------------------------

        for source_col, target_col in columns:

            p = self.source_db.paramstyle
            source_type_query = f"""
                SELECT data_type
                FROM information_schema.columns
                WHERE table_schema = {p}
                AND table_name = {p}
                AND column_name = {p}
            """

            p = self.target_db.paramstyle
            target_type_query = f"""
                SELECT data_type
                FROM information_schema.columns
                WHERE table_schema = {p}
                AND table_name = {p}
                AND column_name = {p}
            """

            source_type = self.source_db.execute(
                source_type_query,
                (source_schema, source_table, source_col)
            )[0][0]

            target_type = self.target_db.execute(
                target_type_query,
                (target_schema, target_table, target_col)
            )[0][0]

            if source_type != target_type:
                total_mismatch += 1
                mismatched_columns.append(
                    f"{source_col}({source_type}) != {target_col}({target_type})"
                )

        status = "PASS" if total_mismatch == 0 else "FAIL"

        return {
            "source_value": "DATA_TYPE_COMPARE",
            "target_value": "DATA_TYPE_COMPARE",
            "delta": total_mismatch,
            "status": status
        }
