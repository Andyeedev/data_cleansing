from fastapi import Depends, HTTPException
from typing import List, Optional
from app.api.core.auth.dependencies import get_current_user
from app.db.connection import get_db_connection


def require_permissions(*required: str):
    def dependency(current_user=Depends(get_current_user)):
        user_id = current_user.get("sub")
        tenant_id = current_user.get("tenant_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        db = get_db_connection()
        with db.conn.cursor() as cur:
            query = """
                SELECT p.resource, p.action
                FROM platform.user_roles ur
                JOIN platform.roles r ON ur.role_id = r.id
                JOIN platform.role_permissions rp ON r.id = rp.role_id
                JOIN platform.permissions p ON rp.permission_id = p.id
                WHERE ur.user_id = %s
                AND r.status = 'active'
                AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
            """
            params = [user_id]

            if tenant_id:
                query += " AND (r.tenant_id = %s OR r.tenant_id IS NULL)"
                params.append(tenant_id)

            cur.execute(query, params)
            user_permissions = [(row[0], row[1]) for row in cur.fetchall()]

        for perm in required:
            parts = perm.split(":")
            if len(parts) == 2:
                resource, action = parts
                if (resource, action) not in user_permissions and ("*", "*") not in user_permissions:
                    raise HTTPException(status_code=403, detail=f"Missing permission: {perm}")
            else:
                raise HTTPException(status_code=403, detail=f"Invalid permission format: {perm}")

        return current_user

    return dependency


def require_role(*role_names: str):
    def dependency(current_user=Depends(get_current_user)):
        user_id = current_user.get("sub")
        tenant_id = current_user.get("tenant_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        db = get_db_connection()
        with db.conn.cursor() as cur:
            query = """
                SELECT r.name
                FROM platform.user_roles ur
                JOIN platform.roles r ON ur.role_id = r.id
                WHERE ur.user_id = %s
                AND r.status = 'active'
                AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
            """
            params = [user_id]

            if tenant_id:
                query += " AND (r.tenant_id = %s OR r.tenant_id IS NULL)"
                params.append(tenant_id)

            cur.execute(query, params)
            user_roles = [row[0] for row in cur.fetchall()]

        if not any(role_name in user_roles for role_name in role_names):
            raise HTTPException(status_code=403, detail=f"Required role: {', '.join(role_names)}")

        return current_user

    return dependency


def require_admin(current_user=Depends(get_current_user)):
    """Shortcut: require Super Admin role within tenant scope."""
    roles = current_user.get("roles", [])
    tenant_id = current_user.get("tenant_id")
    if "Super Admin" not in roles:
        raise HTTPException(status_code=403, detail="Admin access required")

    db = get_db_connection()
    with db.conn.cursor() as cur:
        cur.execute("""
            SELECT r.id FROM platform.user_roles ur
            JOIN platform.roles r ON ur.role_id = r.id
            JOIN platform.users u ON ur.user_id = u.id
            WHERE u.id = %s AND r.name = 'Super Admin' AND r.status = 'active'
            AND (r.tenant_id = %s OR r.tenant_id IS NULL)
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        """, (current_user.get("sub"), tenant_id))
        if not cur.fetchone():
            raise HTTPException(status_code=403, detail="Admin access required for this tenant")

    return current_user
