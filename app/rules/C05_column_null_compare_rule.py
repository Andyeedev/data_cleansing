from .base_rule import BaseRule

class ColumnNullCompareRule(BaseRule):

    RULE_ID = "C05_NULLS"
def execute(self):

        p = self.parameters

        s_nulls = self.source_db.adapter.count_nulls(
            p["source_schema"], p["source_table"], p["column"]
        )

        t_nulls = self.target_db.adapter.count_nulls(
            p["target_schema"], p["target_table"], p["column"]
        )

        return {
            "source_value": s_nulls,
            "target_value": t_nulls,
            "status": "PASS" if s_nulls == t_nulls else "FAIL"
        }