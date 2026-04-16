from .base_rule import BaseRule


class ColumnCountRule(BaseRule):

    RULE_ID = "C04_COLUMN_COUNT"

    def execute(self):

        p = self.parameters

        sc = self.source_db.adapter.get_column_count(
            p["source_schema"], p["source_table"]
        )

        tc = self.target_db.adapter.get_column_count(
            p["target_schema"], p["target_table"]
        )

        return {
            "source_value": sc,
            "target_value": tc,
            "status": "PASS" if sc == tc else "FAIL"
        }