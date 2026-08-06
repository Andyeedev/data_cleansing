from typing import Optional, List
from app.repositories.rule_registry_repository import RuleRegistryRepository


class RuleRegistryService:

    def __init__(self):
        self.repository = RuleRegistryRepository()

    def get_all_rules(self) -> List[dict]:
        rules = self.repository.get_all_rules()
        return [self._rule_to_dict(r) for r in rules]

    def get_rule_by_id(self, rule_id: str) -> Optional[dict]:
        rule = self.repository.get_rule_by_id(rule_id)
        if not rule:
            return None
        return self._rule_to_dict(rule)

    def get_rules_by_control(self, control_id: str) -> List[dict]:
        rules = self.repository.get_rules_by_control(control_id)
        return [self._rule_to_dict(r) for r in rules]

    def create_rule(self, rule_data: dict) -> dict:
        rule = self.repository.create_rule(rule_data)
        if not rule:
            raise Exception("Failed to create rule")
        return self._rule_to_dict(rule)

    def update_rule(self, rule_id: str, rule_data: dict) -> Optional[dict]:
        rule = self.repository.update_rule(rule_id, rule_data)
        if not rule:
            return None
        return self._rule_to_dict(rule)

    def delete_rule(self, rule_id: str) -> bool:
        return self.repository.delete_rule(rule_id)

    def get_rule_count(self) -> int:
        return self.repository.get_rule_count()

    def get_rule_usage_stats(self) -> List[dict]:
        rows = self.repository.get_rule_usage_stats()
        return [self._rule_usage_to_dict(r) for r in rows]

    def _rule_to_dict(self, row) -> dict:
        return {
            "rule_id": row[0],
            "control_id": row[1],
            "rule_name": row[2],
            "sql_template_file": row[3],
            "severity_level": row[4],
            "enabled_flag": row[5],
            "created_at": str(row[6]) if row[6] else None
        }

    def _rule_usage_to_dict(self, row) -> dict:
        return {
            "rule_id": row[0],
            "control_id": row[1],
            "rule_name": row[2],
            "sql_template_file": row[3],
            "severity_level": row[4],
            "enabled_flag": row[5],
            "created_at": str(row[6]) if row[6] else None,
            "mapping_count": row[7],
            "last_execution": str(row[8]) if row[8] else None,
            "last_status": row[9],
            "total_executions": row[10]
        }
