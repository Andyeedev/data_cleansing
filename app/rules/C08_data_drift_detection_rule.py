from .base_rule import BaseRule
import logging

logger = logging.getLogger(__name__)


class ColumnStatsCompareRule(BaseRule):

    RULE_ID = "C08_STATS"

    def execute(self):

        p = self.parameters

        s_stats = self.source_db.adapter.get_stats(
            p["source_schema"], p["source_table"], p["column"]
        )

        t_stats = self.target_db.adapter.get_stats(
            p["target_schema"], p["target_table"], p["column"]
        )

        return {
            "source_value": s_stats,
            "target_value": t_stats,
            "status": "PASS" if s_stats == t_stats else "FAIL"
        }