import secrets
from typing import Optional


class RoleService:
    def __init__(self, conn):
        self.conn = conn

    def list_roles(self, page: int = 1, page_size: int = 50, status: Optional[str] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, name, description, type, is_system, is_default, 
                   status, created_at
            FROM platform.roles
            WHERE deleted_at IS NULL
        """
        params = []

        if status:
            query += " AND status = %s"
            params.append(status)

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            roles = [dict(zip(columns, row)) for row in cur.fetchall()]

            count_query = "SELECT COUNT(*) FROM platform.roles WHERE deleted_at IS NULL"
            cur.execute(count_query)
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "roles": roles,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def get_role(self, role_id: str):
        query = """
            SELECT id, name, description, type, is_system, is_default, 
                   status, metadata, created_at
            FROM platform.roles
            WHERE id = %s AND deleted_at IS NULL
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (role_id,))
            columns = [desc[0] for desc in cur.description]
            role = dict(zip(columns, cur.fetchone()))

        if not role:
            return {"success": False, "error": "Role not found"}

        return {"success": True, "data": role}

    def create_role(self, payload):
        role_id = secrets.token_uuid()

        query = """
            INSERT INTO platform.roles (id, name, description, type, parent_id, status)
            VALUES (%s, %s, %s, %s, %s, 'active')
            RETURNING id, name, description, type, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                role_id, payload.name, payload.description,
                payload.type, payload.parent_id
            ))
            columns = [desc[0] for desc in cur.description]
            role = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": role}

    def update_role(self, role_id: str, payload):
        updates = []
        params = []

        if payload.name is not None:
            updates.append("name = %s")
            params.append(payload.name)
        if payload.description is not None:
            updates.append("description = %s")
            params.append(payload.description)
        if payload.status is not None:
            updates.append("status = %s")
            params.append(payload.status)

        if not updates:
            return {"success": False, "error": "No fields to update"}

        params.append(role_id)
        query = f"""
            UPDATE platform.roles
            SET {', '.join(updates)}
            WHERE id = %s AND deleted_at IS NULL
            RETURNING id, name, description, type, status
        """
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            role = dict(zip(columns, cur.fetchone()))

        if not role:
            return {"success": False, "error": "Role not found"}

        return {"success": True, "data": role}

    def delete_role(self, role_id: str):
        query = """
            UPDATE platform.roles
            SET deleted_at = NOW()
            WHERE id = %s AND deleted_at IS NULL AND is_system = FALSE
            RETURNING id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (role_id,))
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Role not found or is a system role"}

        return {"success": True, "message": "Role deleted"}

    def assign_permission(self, role_id: str, payload):
        query = """
            INSERT INTO platform.role_permissions (role_id, permission_id, granted)
            VALUES (%s, %s, %s)
            ON CONFLICT (role_id, permission_id) DO UPDATE SET granted = EXCLUDED.granted
            RETURNING role_id, permission_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (role_id, payload.permission_id, payload.granted))
            columns = [desc[0] for desc in cur.description]
            result = cur.fetchone()

        return {"success": True, "message": "Permission assigned"}

    def remove_permission(self, role_id: str, permission_id: str):
        query = """
            DELETE FROM platform.role_permissions
            WHERE role_id = %s AND permission_id = %s
            RETURNING role_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (role_id, permission_id))
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Permission assignment not found"}

        return {"success": True, "message": "Permission removed"}

    def get_role_permissions(self, role_id: str):
        query = """
            SELECT p.id, p.name, p.resource, p.action, p.category, rp.granted
            FROM platform.role_permissions rp
            JOIN platform.permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (role_id,))
            columns = [desc[0] for desc in cur.description]
            permissions = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": permissions}

    def list_all_permissions(self):
        query = """
            SELECT id, name, description, resource, action, category
            FROM platform.permissions
            ORDER BY resource, action
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            columns = [desc[0] for desc in cur.description]
            permissions = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": permissions}
