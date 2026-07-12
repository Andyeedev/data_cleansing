import json
from typing import Optional, Any


class SettingsService:
    def __init__(self, conn):
        self.conn = conn

    def list_settings(self, category: Optional[str] = None):
        query = """
            SELECT id, category, key, value, description, data_type, 
                   is_readonly, tenant_scoped, updated_at
            FROM platform.system_settings
        """
        params = []

        if category:
            query += " WHERE category = %s"
            params.append(category)

        query += " ORDER BY category, key"

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            settings = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": settings}

    def get_category_settings(self, category: str):
        query = """
            SELECT key, value, description, data_type, is_readonly, updated_at
            FROM platform.system_settings
            WHERE category = %s
            ORDER BY key
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (category,))
            columns = [desc[0] for desc in cur.description]
            settings = {row[0]: row[1] for row in cur.fetchall()}

        return {"success": True, "data": settings}

    def get_setting(self, category: str, key: str):
        query = """
            SELECT id, category, key, value, description, data_type, 
                   is_readonly, tenant_scoped, updated_at
            FROM platform.system_settings
            WHERE category = %s AND key = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (category, key))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            setting = dict(zip(columns, row)) if row else None

        if not setting:
            return {"success": False, "error": "Setting not found"}

        return {"success": True, "data": setting}

    def update_setting(self, category: str, key: str, value: Any, user_id: str = None):
        # Check if readonly
        check_query = """
            SELECT is_readonly FROM platform.system_settings
            WHERE category = %s AND key = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(check_query, (category, key))
            row = cur.fetchone()
            if row and row[0]:
                return {"success": False, "error": "Setting is read-only"}

        query = """
            UPDATE platform.system_settings
            SET value = %s, updated_by = %s
            WHERE category = %s AND key = %s
            RETURNING id, category, key, value
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (json.dumps(value), user_id, category, key))
            columns = [desc[0] for desc in cur.description]
            setting = dict(zip(columns, cur.fetchone()))

        if not setting:
            return {"success": False, "error": "Setting not found"}

        return {"success": True, "data": setting}

    def list_feature_flags(self):
        query = """
            SELECT id, name, description, key, enabled, 
                   rollout_percentage, status, created_at
            FROM platform.feature_flags
            ORDER BY name
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            columns = [desc[0] for desc in cur.description]
            flags = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": flags}

    def get_feature_flag(self, key: str):
        query = """
            SELECT id, name, description, key, enabled, 
                   rollout_percentage, status, created_at
            FROM platform.feature_flags
            WHERE key = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (key,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            flag = dict(zip(columns, row)) if row else None

        if not flag:
            return {"success": False, "error": "Feature flag not found"}

        return {"success": True, "data": flag}

    def update_feature_flag(self, key: str, payload):
        updates = []
        params = []

        if payload.enabled is not None:
            updates.append("enabled = %s")
            params.append(payload.enabled)
        if payload.rollout_percentage is not None:
            updates.append("rollout_percentage = %s")
            params.append(payload.rollout_percentage)

        if not updates:
            return {"success": False, "error": "No fields to update"}

        params.append(key)
        query = f"""
            UPDATE platform.feature_flags
            SET {', '.join(updates)}
            WHERE key = %s
            RETURNING id, name, key, enabled, rollout_percentage
        """
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            flag = dict(zip(columns, cur.fetchone()))

        if not flag:
            return {"success": False, "error": "Feature flag not found"}

        return {"success": True, "data": flag}
