import secrets
import uuid
from typing import Optional

from app.api.core.auth.rbac import (
    PLATFORM_SCOPED_RESOURCES,
    PERMISSION_ENTITLEMENT,
    is_super_admin,
)
from app.middleware.entitlement_middleware import check_entitlement


class RoleService:
    def __init__(self, conn):
        self.conn = conn

    def _get_role(self, role_id: str, tenant_id=None):
        query = """
            SELECT id, name, description, type, is_system, is_default,
                   status, metadata, tenant_id, created_at
            FROM platform.roles
            WHERE id = %s AND deleted_at IS NULL
        """
        params = [role_id]

        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def _get_permission(self, permission_id: str):
        query = """
            SELECT id, name, resource, action
            FROM platform.permissions
            WHERE id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (permission_id,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def _caller_grants(self, caller) -> set:
        """Effective (resource, action) grants of the caller, honoring granted=TRUE."""
        user_id = caller.get("sub")
        if not user_id:
            return set()
        tenant_id = caller.get("tenant_id")
        query = """
            SELECT p.resource, p.action
            FROM platform.user_roles ur
            JOIN platform.roles r ON ur.role_id = r.id
            JOIN platform.role_permissions rp ON r.id = rp.role_id
            JOIN platform.permissions p ON rp.permission_id = p.id
            WHERE ur.user_id = %s
            AND r.status = 'active'
            AND rp.granted = TRUE
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        """
        params = [user_id]
        if tenant_id:
            query += " AND (r.tenant_id = %s OR r.tenant_id IS NULL)"
            params.append(tenant_id)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return {(r[0], r[1]) for r in cur.fetchall()}

    def _guard_custom_role(self, role: dict, caller):
        """Tenant Admins may only mutate custom, tenant-scoped roles."""
        if caller is not None and not is_super_admin(caller):
            if not role or role["is_system"] or role["type"] != "custom":
                return "Only custom tenant-scoped roles can be modified"
        return None

    def list_roles(self, tenant_id=None, page: int = 1, page_size: int = 50, status: Optional[str] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, name, description, type, is_system, is_default, 
                   status, created_at
            FROM platform.roles
            WHERE deleted_at IS NULL
        """
        params = []

        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

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
            count_params = []
            if tenant_id:
                count_query += " AND tenant_id = %s"
                count_params.append(tenant_id)
            cur.execute(count_query, count_params)
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

    def get_role(self, role_id: str, tenant_id=None):
        query = """
            SELECT id, name, description, type, is_system, is_default, 
                   status, metadata, created_at
            FROM platform.roles
            WHERE id = %s AND deleted_at IS NULL
        """
        params = [role_id]

        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            role = dict(zip(columns, row)) if row else None

        if not role:
            return {"success": False, "error": "Role not found"}

        return {"success": True, "data": role}

    def create_role(self, payload, tenant_id=None, caller=None):
        role_type = payload.type
        if caller is not None and not is_super_admin(caller):
            if payload.type and payload.type != "custom":
                return {"success": False, "error": "Only Super Admin can create system or template roles"}

        role_id = str(uuid.uuid4())

        query = """
            INSERT INTO platform.roles (id, name, description, type, parent_id, tenant_id, status)
            VALUES (%s, %s, %s, %s, %s, %s, 'active')
            RETURNING id, name, description, type, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                role_id, payload.name, payload.description,
                role_type, payload.parent_id, tenant_id
            ))
            columns = [desc[0] for desc in cur.description]
            role = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": role}

    def update_role(self, role_id: str, payload, tenant_id=None, caller=None):
        if caller is not None and not is_super_admin(caller):
            role = self._get_role(role_id, tenant_id=tenant_id)
            if not role:
                return {"success": False, "error": "Role not found or access denied"}
            if role["is_system"]:
                return {"success": False, "error": "System roles are protected"}

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
        """
        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        query += " RETURNING id, name, description, type, status"

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            role = dict(zip(columns, row)) if row else None

        if not role:
            return {"success": False, "error": "Role not found or access denied"}

        return {"success": True, "data": role}

    def delete_role(self, role_id: str, tenant_id=None, caller=None):
        if caller is not None and not is_super_admin(caller):
            role = self._get_role(role_id, tenant_id=tenant_id)
            if not role:
                return {"success": False, "error": "Role not found or access denied"}
            if role["is_system"]:
                return {"success": False, "error": "System roles are protected"}

        query = """
            UPDATE platform.roles
            SET deleted_at = NOW()
            WHERE id = %s AND deleted_at IS NULL AND is_system = FALSE
        """
        params = [role_id]

        if tenant_id:
            query += " AND tenant_id = %s"
            params.append(tenant_id)

        query += " RETURNING id"

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Role not found, is a system role, or access denied"}

        return {"success": True, "message": "Role deleted"}

    def assign_permission(self, role_id: str, payload, tenant_id=None, caller=None):
        role = self._get_role(role_id, tenant_id=tenant_id)
        if not role:
            return {"success": False, "error": "Role not found or access denied"}

        permission = self._get_permission(payload.permission_id)
        if not permission:
            return {"success": False, "error": "Permission not found"}

        if caller is not None and not is_super_admin(caller):
            guard = self._guard_custom_role(role, caller)
            if guard:
                return {"success": False, "error": guard}

            if permission["resource"] in PLATFORM_SCOPED_RESOURCES:
                return {
                    "success": False,
                    "error": f"Permission '{permission['resource']}:{permission['action']}' "
                             "is platform-scoped and cannot be assigned by tenant admins",
                }

            grants = self._caller_grants(caller)
            if (permission["resource"], permission["action"]) not in grants and ("*", "*") not in grants:
                return {"success": False, "error": "Cannot grant a permission you do not hold"}

            feature = PERMISSION_ENTITLEMENT.get(f"{permission['resource']}.{permission['action']}")
            caller_tenant = caller.get("tenant_id")
            if feature and caller_tenant and not check_entitlement(caller_tenant, feature):
                return {
                    "success": False,
                    "error": f"Permission '{permission['resource']}:{permission['action']}' "
                             f"requires entitlement '{feature}' which is not on the tenant plan",
                }

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

    def remove_permission(self, role_id: str, permission_id: str, tenant_id=None, caller=None):
        role = self._get_role(role_id, tenant_id=tenant_id)
        if not role:
            return {"success": False, "error": "Role not found or access denied"}

        guard = self._guard_custom_role(role, caller)
        if guard:
            return {"success": False, "error": guard}

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

    def get_role_permissions(self, role_id: str, tenant_id=None):
        if tenant_id:
            role_check_query = """
                SELECT id FROM platform.roles
                WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL
            """
            with self.conn.cursor() as cur:
                cur.execute(role_check_query, (role_id, tenant_id))
                if not cur.fetchone():
                    return {"success": False, "error": "Role not found or access denied"}

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
