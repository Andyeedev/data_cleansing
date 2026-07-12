from app.rules.C01_row_count_rule import RowCountRule
from app.rules.C02_sum_compare_rule import SumCompareRule
from app.rules.C03_referential_rule import ReferentialIntegrityRule
from app.rules.C04_column_count_rule import ColumnCountRule
from app.rules.C05_column_null_compare_rule import ColumnNullCompareRule
from app.rules.C06_data_type_match_rule import DataTypeMatchRule
from app.rules.C07_duplicate_detection_rule import C07DuplicateDetectionRule
from app.rules.C08_data_drift_detection_rule import C08DataDriftDetectionRule
from app.rules.C09_referential_coverage_rule import C09ReferentialCoverageRule
from app.rules.C010_schema_drift_rule import C010SchemaDriftRule


class RuleFactory:

    RULE_REGISTRY = {
        "C01_ROWCOUNT": RowCountRule,
        "C02_BALANCE_RECON": SumCompareRule,
        "C03_REFERENTIAL": ReferentialIntegrityRule,
        "C04_COLUMN_COUNT": ColumnCountRule,
        "C05_NULL_CHECK": ColumnNullCompareRule,
        "C06_DATA_TYPE_MATCH": DataTypeMatchRule,
        "C07_DUPLICATE_DETECTION": C07DuplicateDetectionRule,
        "C08_DATA_DRIFT": C08DataDriftDetectionRule,
        "C09_REFERENTIAL_COVERAGE": C09ReferentialCoverageRule,
        "C010_SCHEMA_DRIFT": C010SchemaDriftRule


    }

    @staticmethod
    def create(rule_id, source_db, target_db, parameters):

        rule_class = RuleFactory.RULE_REGISTRY.get(rule_id)

        if not rule_class:
            raise ValueError(
                f"No rule class registered for rule_id: {rule_id}. "
                f"Registered rules: {list(RuleFactory.RULE_REGISTRY.keys())}"
            )

        return rule_class(source_db, target_db, parameters)
