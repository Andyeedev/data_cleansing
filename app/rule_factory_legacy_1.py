from app.rules.base_rule import BaseRule

# Force rule loading (important for self-registration)
from app.rules import *


class RuleFactory:

    @staticmethod
    def create(rule_id, source_db, target_db, parameters):

        rule_class = BaseRule.REGISTRY.get(rule_id)

        if not rule_class:
            raise ValueError(
                f"No rule class registered for rule_id: {rule_id}. "
                f"Registered rules: {list(BaseRule.REGISTRY.keys())}"
            )

        return rule_class(source_db, target_db, parameters)