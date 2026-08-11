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

    def get_tenants(self):
        rows = self.repository.get_unique_tenants()
        return [{"tenant_id": str(r[0]), "tenant_name": r[1] or str(r[0])[:8]} for r in rows]

    def get_mappings_for_rule(self, rule_id: str) -> List[dict]:
        rows = self.repository.get_mappings_for_rule(rule_id)
        return [
            {
                "mapping_id": str(row[0]),
                "dataset_name": f"{row[2]}.{row[3]}" if row[2] else row[1],
                "is_active": row[4],
                "created_at": str(row[5]) if row[5] else None,
            }
            for row in rows
        ]

    def _rule_to_dict(self, row) -> dict:
        return {
            "rule_id": row[0],
            "control_id": row[1],
            "rule_name": row[2],
            "sql_template_file": row[3],
            "severity_level": row[4],
            "enabled_flag": row[5],
            "created_at": str(row[6]) if row[6] else None,
            "tenant_id": str(row[7]) if row[7] else None
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
            "total_executions": row[10],
            "tenant_id": str(row[11]) if row[11] else None,
        }
