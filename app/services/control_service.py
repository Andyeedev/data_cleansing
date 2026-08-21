from typing import Optional
from app.repositories.control_repository import ControlRepository


class ControlService:

    def __init__(self):
        self.repository = ControlRepository()

    def get_all_controls(self, search: str = None, severity: str = None, status: str = None, tenant_id: str = None) -> dict:
        rows = self.repository.get_all_controls(search, severity, status, tenant_id)
        controls = [
            {
                "control_id": row[0],
                "control_name": row[1],
                "description": row[2],
                "severity_level": row[3],
                "enabled_flag": row[4],
                "created_at": str(row[5]) if row[5] else None,
                "project_id": str(row[6]) if row[6] else None,
            }
            for row in rows
        ]
        return {
            "controls": controls,
            "total": len(controls),
        }

    def get_control_by_id(self, control_id: str) -> Optional[dict]:
        row = self.repository.get_control_by_id(control_id)
        if not row:
            return None
        return {
            "control_id": row[0],
            "control_name": row[1],
            "description": row[2],
            "severity_level": row[3],
            "enabled_flag": row[4],
            "created_at": str(row[5]) if row[5] else None,
            "project_id": str(row[6]) if row[6] else None,
        }

    def update_control(self, control_id: str, updates: dict) -> bool:
        return self.repository.update_control(control_id, updates)

    def create_control(self, control_id: str, control_name: str, description: str,
                       severity_level: str, enabled_flag: bool = True) -> bool:
        return self.repository.create_control(control_id, control_name, description, severity_level, enabled_flag)

    def delete_control(self, control_id: str) -> bool:
        return self.repository.delete_control(control_id)

    def get_execution_outcomes(self, tenant_id: str = None) -> dict:
        return self.repository.get_execution_outcomes(tenant_id)

    def get_per_control_outcomes(self, tenant_id: str = None) -> list:
        rows = self.repository.get_per_control_outcomes(tenant_id)
        return [
            {
                "control_id": row[0],
                "overall_status": row[1],
                "total_rules": row[2],
                "passed_rules": row[3],
                "failed_rules": row[4],
                "error_rules": row[5],
                "skipped_rules": row[6],
            }
            for row in rows
        ]
