from typing import Optional, List
from app.db.connection import get_db_connection


class ControlRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_all_controls(self, search: str = None, severity: str = None, status: str = None) -> List:
        query = """
            SELECT control_id, control_name, description, severity_level, enabled_flag, created_at, project_id
            FROM engine.control_registry
            WHERE 1=1
        """
        params = []

        if search:
            query += " AND (control_id ILIKE %s OR control_name ILIKE %s OR description ILIKE %s)"
            search_term = f"%{search}%"
            params.extend([search_term, search_term, search_term])

        if severity and severity != 'all':
            query += " AND severity_level = %s"
            params.append(severity)

        if status and status != 'all':
            if status == 'enabled':
                query += " AND enabled_flag = TRUE"
            elif status == 'disabled':
                query += " AND enabled_flag = FALSE"

        query += " ORDER BY control_id"
        return self.db.execute(query, tuple(params) if params else None)

    def get_control_by_id(self, control_id: str) -> Optional[tuple]:
        query = """
            SELECT control_id, control_name, description, severity_level, enabled_flag, created_at, project_id
            FROM engine.control_registry
            WHERE control_id = %s
        """
        rows = self.db.execute(query, (control_id,))
        return rows[0] if rows else None

    def update_control(self, control_id: str, updates: dict) -> bool:
        set_clauses = []
        params = []

        if 'control_name' in updates:
            set_clauses.append("control_name = %s")
            params.append(updates['control_name'])
        if 'description' in updates:
            set_clauses.append("description = %s")
            params.append(updates['description'])
        if 'severity_level' in updates:
            set_clauses.append("severity_level = %s")
            params.append(updates['severity_level'])
        if 'enabled_flag' in updates:
            set_clauses.append("enabled_flag = %s")
            params.append(updates['enabled_flag'])

        if not set_clauses:
            return False

        params.append(control_id)
        query = f"UPDATE engine.control_registry SET {', '.join(set_clauses)} WHERE control_id = %s"
        self.db.execute(query, tuple(params))
        return True

    def create_control(self, control_id: str, control_name: str, description: str,
                       severity_level: str, enabled_flag: bool = True) -> bool:
        query = """
            INSERT INTO engine.control_registry (control_id, control_name, description, severity_level, enabled_flag)
            VALUES (%s, %s, %s, %s, %s)
        """
        self.db.execute(query, (control_id, control_name, description, severity_level, enabled_flag))
        return True

    def delete_control(self, control_id: str) -> bool:
        query = "DELETE FROM engine.control_registry WHERE control_id = %s"
        self.db.execute(query, (control_id,))
        return True
