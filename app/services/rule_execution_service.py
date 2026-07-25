from app.repositories.rule_execution_repository import RuleExecutionRepository


class RuleExecutionService:

    def __init__(self):
        self.repository = RuleExecutionRepository()

    def get_rules_by_batch(self, batch_id: str):
        rules = self.repository.get_rules_by_batch(batch_id)
        return [self._rule_to_dict(r) for r in rules]

    def get_rule_detail(self, batch_id: str, rule_id: str):
        rule = self.repository.get_rule_by_id(batch_id, rule_id)
        if not rule:
            return None
        return self._rule_detail_to_dict(rule)

    def get_rules_by_control(self, batch_id: str, control_id: str):
        rules = self.repository.get_rules_by_control(batch_id, control_id)
        return [self._rule_to_dict(r) for r in rules]

    def get_execution_results(self, batch_id: str):
        batch_status = self.repository.get_batch_status(batch_id)
        control_summaries = self.repository.get_execution_summary(batch_id)
        rules = self.repository.get_rules_by_batch(batch_id)

        total_rules = sum(r[3] or 0 for r in control_summaries)
        passed_rules = sum(r[4] or 0 for r in control_summaries)
        failed_rules = sum(r[5] or 0 for r in control_summaries)
        error_rules = sum(r[6] or 0 for r in control_summaries)

        controls = []
        for cs in control_summaries:
            controls.append({
                "control_id": cs[1],
                "overall_status": cs[2],
                "total_rules": cs[3],
                "passed_rules": cs[4],
                "failed_rules": cs[5],
                "error_rules": cs[6]
            })

        return {
            "batch_id": batch_id,
            "total_rules": total_rules,
            "passed_rules": passed_rules,
            "failed_rules": failed_rules,
            "error_rules": error_rules,
            "overall_status": batch_status[2] if batch_status else "UNKNOWN",
            "controls": controls
        }

    def _rule_to_dict(self, row):
        return {
            "id": row[0],
            "batch_id": str(row[1]),
            "control_id": row[2],
            "rule_id": row[3],
            "entity_name": row[4],
            "execution_status": row[5],
            "delta_value": float(row[6]) if row[6] is not None else None,
            "execution_time_seconds": float(row[7]) if row[7] is not None else None,
            "severity_level": row[8],
            "created_at": str(row[9]) if row[9] else None
        }

    def _rule_detail_to_dict(self, row):
        return {
            "id": row[0],
            "batch_id": str(row[1]),
            "control_id": row[2],
            "rule_id": row[3],
            "entity_name": row[4],
            "execution_status": row[5],
            "delta_value": float(row[6]) if row[6] is not None else None,
            "execution_time_seconds": float(row[7]) if row[7] is not None else None,
            "severity_level": row[8],
            "mapping_id": str(row[9]) if row[9] else None,
            "created_at": str(row[10]) if row[10] else None
        }
