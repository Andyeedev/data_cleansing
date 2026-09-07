import bcrypt
import secrets
import uuid
from datetime import datetime
from typing import Optional
import json


class UserService:
    def __init__(self, conn):
        self.conn = conn

    def list_users(self, tenant_id=None, page: int = 1, page_size: int = 50, status: Optional[str] = None, search: Optional[str] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, email, first_name, last_name, display_name, phone, 
                   status, department, last_login_at, created_at
            FROM platform.users
            WHERE deleted_at IS NULL
        """
        params = []

        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        if status:
            query += " AND status = %s"
            params.append(status)

        if search:
            query += " AND (first_name ILIKE %s OR last_name ILIKE %s OR email ILIKE %s)"
            search_pattern = f"%{search}%"
            params.extend([search_pattern, search_pattern, search_pattern])

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            users = [dict(zip(columns, row)) for row in cur.fetchall()]

            count_query = "SELECT COUNT(*) FROM platform.users WHERE deleted_at IS NULL"
            count_params = []
            if tenant_id:
                count_query += " AND tenant_id = %s"
                count_params.append(tenant_id)
            cur.execute(count_query, count_params)
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "users": users,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def get_user(self, user_id: str, tenant_id=None):
        query = """
            SELECT id, email, first_name, last_name, display_name, phone, 
                   status, department, last_login_at, created_at, metadata
            FROM platform.users
            WHERE id = %s AND deleted_at IS NULL
        """
        params = [user_id]

        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            user = dict(zip(columns, row)) if row else None

        if not user:
            return {"success": False, "error": "User not found"}

        return {"success": True, "data": user}

    def create_user(self, payload, tenant_id=None):
        password_hash = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user_id = str(uuid.uuid4())
        effective_tenant = tenant_id or getattr(payload, 'tenant_id', None)

        query = """
            INSERT INTO platform.users (id, email, password_hash, first_name, last_name, 
                                        display_name, phone, department, tenant_id, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'active')
            RETURNING id, email, first_name, last_name, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                user_id, payload.email, password_hash,
                payload.first_name, payload.last_name,
                payload.display_name, payload.phone,
                payload.department, effective_tenant
            ))
            columns = [desc[0] for desc in cur.description]
            user = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": user}

    def update_user(self, user_id: str, payload, tenant_id=None):
        updates = []
        params = []

        if payload.first_name is not None:
            updates.append("first_name = %s")
            params.append(payload.first_name)
        if payload.last_name is not None:
            updates.append("last_name = %s")
            params.append(payload.last_name)
        if payload.display_name is not None:
            updates.append("display_name = %s")
            params.append(payload.display_name)
        if payload.phone is not None:
            updates.append("phone = %s")
            params.append(payload.phone)
        if payload.department is not None:
            updates.append("department = %s")
            params.append(payload.department)
        if payload.status is not None:
            updates.append("status = %s")
            params.append(payload.status)

        if not updates:
            return {"success": False, "error": "No fields to update"}

        params.append(user_id)
        query = f"""
            UPDATE platform.users
            SET {', '.join(updates)}
            WHERE id = %s AND deleted_at IS NULL
        """
        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        query += " RETURNING id, email, first_name, last_name, status"

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            user = dict(zip(columns, row)) if row else None

        if not user:
            return {"success": False, "error": "User not found or access denied"}

        return {"success": True, "data": user}

    def delete_user(self, user_id: str, tenant_id=None):
        query = """
            UPDATE platform.users
            SET deleted_at = NOW()
            WHERE id = %s AND deleted_at IS NULL
        """
        params = [user_id]

        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        query += " RETURNING id"

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "User not found or access denied"}

        return {"success": True, "message": "User deleted"}

    def assign_role(self, user_id: str, payload, tenant_id=None):
        if tenant_id:
            check_query = """
                SELECT id FROM platform.users
                WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL
            """
            with self.conn.cursor() as cur:
                cur.execute(check_query, (user_id, tenant_id))
                if not cur.fetchone():
                    return {"success": False, "error": "User not found or access denied"}

            role_check_query = """
                SELECT id FROM platform.roles
                WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL
            """
            with self.conn.cursor() as cur:
                cur.execute(role_check_query, (payload.role_id, tenant_id))
                if not cur.fetchone():
                    return {"success": False, "error": "Role not found or access denied"}

        query = """
            INSERT INTO platform.user_roles (user_id, role_id, expires_at, is_temporary)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, role_id) DO NOTHING
            RETURNING user_id, role_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                user_id, payload.role_id,
                payload.expires_at, payload.is_temporary
            ))
            columns = [desc[0] for desc in cur.description]
            result = cur.fetchone()

        return {"success": True, "message": "Role assigned"}

    def remove_role(self, user_id: str, role_id: str, tenant_id=None):
        if tenant_id:
            check_query = """
                SELECT ur.user_id FROM platform.user_roles ur
                JOIN platform.users u ON ur.user_id = u.id
                WHERE ur.user_id = %s AND ur.role_id = %s AND u.tenant_id = %s
            """
            with self.conn.cursor() as cur:
                cur.execute(check_query, (user_id, role_id, tenant_id))
                if not cur.fetchone():
                    return {"success": False, "error": "Role assignment not found or access denied"}

        query = """
            DELETE FROM platform.user_roles
            WHERE user_id = %s AND role_id = %s
            RETURNING user_id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, role_id))
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Role assignment not found"}

        return {"success": True, "message": "Role removed"}

    def get_user_roles(self, user_id: str, tenant_id=None):
        query = """
            SELECT r.id, r.name, r.description, r.type, ur.assigned_at, ur.expires_at
            FROM platform.user_roles ur
            JOIN platform.roles r ON ur.role_id = r.id
            WHERE ur.user_id = %s AND r.deleted_at IS NULL
        """
        params = [user_id]

        if tenant_id:
            query += " AND r.tenant_id = %s"
            params.append(tenant_id)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            roles = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": roles}
