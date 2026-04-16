
from .base_rule import BaseRule
import logging

logger = logging.getLogger(__name__)


class SchemaDriftRule:

    RULE_ID = "C010_SCHEMA"

    def __init__(self, *args, **kwargs):
        pass
    
    def execute(self):

        p = self.parameters

        s_cols = set(self.source_db.adapter.get_columns(
            p["source_schema"], p["source_table"]
        ))

        t_cols = set(self.target_db.adapter.get_columns(
            p["target_schema"], p["target_table"]
        ))

        return {
            "missing_in_target": list(s_cols - t_cols),
            "extra_in_target": list(t_cols - s_cols),
            "status": "PASS" if s_cols == t_cols else "FAIL"
        }
