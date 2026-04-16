
from .base_rule import BaseRule


class RowCountRule(BaseRule):

    RULE_ID = "C01_ROWCOUNT"

    def execute(self):

        s = self.parameters["source_schema"]
        t = self.parameters["source_table"]

        ts = self.parameters["target_schema"]
        tt = self.parameters["target_table"]

        source_count = self.source_db.adapter.get_row_count(s, t)
        target_count = self.target_db.adapter.get_row_count(ts, tt)

        delta = abs(source_count - target_count)
        tolerance = self.parameters.get("tolerance_value", 0)

        status = "PASS" if delta <= tolerance else "FAIL"

        return {
            "source_value": source_count,
            "target_value": target_count,
            "delta": delta,
            "status": status
        }