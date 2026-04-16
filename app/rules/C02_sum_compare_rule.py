from .base_rule import BaseRule


class SumCompareRule(BaseRule):

    RULE_ID = "C02_SUM"

    def execute(self):

        p = self.parameters

        s_sum = self.source_db.adapter.get_sum(
            p["source_schema"], p["source_table"], p["column"]
        )

        t_sum = self.target_db.adapter.get_sum(
            p["target_schema"], p["target_table"], p["column"]
        )

        delta = abs(s_sum - t_sum)

        return {
            "source_value": s_sum,
            "target_value": t_sum,
            "delta": delta,
            "status": "PASS" if delta == 0 else "FAIL"
        }