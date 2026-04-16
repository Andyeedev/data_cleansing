from .base_rule import BaseRule
import logging

logger = logging.getLogger(__name__)


class ReferentialIntegrityRule(BaseRule):

    RULE_ID = "C09_FK"

    def execute(self):

        p = self.parameters

        missing = self.target_db.adapter.count_missing_fk(
            p["schema"],
            p["child_table"],
            p["parent_table"],
            p["column"]
        )

        return {
            "missing_fk": missing,
            "status": "PASS" if missing == 0 else "FAIL"
        }