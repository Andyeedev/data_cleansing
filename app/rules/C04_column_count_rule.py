from .base_rule import BaseRule


class ColumnCountRule(BaseRule):

    RULE_ID = "C04_COLUMN_COUNT"

    def execute(self):

        source_schema = self.parameters["source_schema"]
        source_table = self.parameters["source_table"]
        target_schema = self.parameters["target_schema"]
        target_table = self.parameters["target_table"]

        p = self.source_db.paramstyle
        source_query = f"""
            SELECT COUNT(*)
            FROM information_schema.columns
            WHERE table_schema = {p}
            AND table_name = {p}
        """

        p = self.target_db.paramstyle
        target_query = f"""
            SELECT COUNT(*)
            FROM information_schema.columns
            WHERE table_schema = {p}
            AND table_name = {p}
        """

        source_count = self.source_db.execute(
            source_query, (source_schema, source_table)
        )[0][0]

        target_count = self.target_db.execute(
            target_query, (target_schema, target_table)
        )[0][0]

        delta = abs(source_count - target_count)

        status = "PASS" if delta == 0 else "FAIL"

        return {
            "source_value": source_count,
            "target_value": target_count,
            "delta": delta,
            "status": status
        }
