from .base_rule import BaseRule
import logging

logger = logging.getLogger(__name__)


class DuplicateCheckRule(BaseRule):

    RULE_ID = "C07_DUPLICATES"

    def execute(self):

        p = self.parameters

        s_dup = self.source_db.adapter.count_duplicates(
            p["source_schema"], p["source_table"], p["column"]
        )

        t_dup = self.target_db.adapter.count_duplicates(
            p["target_schema"], p["target_table"], p["column"]
        )

        return {
            "source_value": s_dup,
            "target_value": t_dup,
            "status": "PASS" if s_dup == t_dup else "FAIL"
        }