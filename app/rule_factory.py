from app.rules.row_count_rule import RowCountRule
from app.rules.sum_compare_rule import SumCompareRule
from app.rules.referential_rule import ReferentialIntegrityRule


class RuleFactory:

    @staticmethod
    def create(rule_type, source_db, target_db, parameters):

        if rule_type == "ROW_COUNT":
            return RowCountRule(source_db, target_db, parameters)

        elif rule_type == "SUM_COMPARE":
            return SumCompareRule(source_db, target_db, parameters)

        elif rule_type == "REFERENTIAL_CHECK":
            return ReferentialIntegrityRule(source_db, target_db, parameters)

        else:
            raise ValueError(f"Unknown rule type: {rule_type}")
