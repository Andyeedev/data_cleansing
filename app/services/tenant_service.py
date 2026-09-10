import bcrypt
import uuid
from app.db.repositories.tenant_repository import TenantRepository


class TenantService:

    def __init__(self, conn):
        self.conn = conn
        self.repo = TenantRepository(conn)

    def create_tenant(self, tenant_name, admin_email, admin_password, billing_email=None, plan_tier="professional"):
        plan = self.repo.get_plan_by_tier(plan_tier)
        if not plan:
            return {"success": False, "error": f"Plan '{plan_tier}' not found"}

        tenant = self.repo.create_tenant(
            tenant_name=tenant_name,
            billing_email=billing_email,
            plan_id=plan["plan_id"]
        )

        # DEV-011: password policy enforced on tenant provisioning path.
        from app.services.auth_service import validate_password_policy
        validate_password_policy(admin_password)
        password_hash = bcrypt.hashpw(admin_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user_id = str(uuid.uuid4())

        query = """
            INSERT INTO platform.users (id, email, password_hash, first_name, last_name,
                                        display_name, tenant_id, status)
            VALUES (%s, %s, %s, 'Admin', 'User', 'Admin User', %s, 'active')
            RETURNING id, email
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, admin_email, password_hash, tenant["tenant_id"]))
            admin_user = dict(zip([desc[0] for desc in cur.description], cur.fetchone()))

        subscription = self.repo.create_trial_subscription(
            tenant_id=tenant["tenant_id"],
            plan_id=plan["plan_id"],
            trial_days=30,
            created_by=user_id
        )

        self.conn.commit()

        return {
            "success": True,
            "data": {
                "tenant": tenant,
                "admin_user": admin_user,
                "subscription": subscription,
                "plan": plan
            }
        }

    def get_tenant(self, tenant_id):
        tenant = self.repo.get_tenant(tenant_id)
        if not tenant:
            return {"success": False, "error": "Tenant not found"}

        subscription = self.repo.get_active_subscription(tenant_id)
        return {"success": True, "data": {**tenant, "subscription": subscription}}

    def list_tenants(self, page=1, page_size=50, status=None):
        result = self.repo.list_tenants(page=page, page_size=page_size, status=status)
        return {"success": True, "data": result}

    def update_tenant(self, tenant_id, **kwargs):
        result = self.repo.update_tenant(tenant_id, **kwargs)
        if not result:
            return {"success": False, "error": "Tenant not found or no changes"}
        return {"success": True, "data": result}

    def get_subscription(self, tenant_id):
        subscription = self.repo.get_active_subscription(tenant_id)
        if not subscription:
            return {"success": False, "error": "No active subscription found"}
        return {"success": True, "data": subscription}

    def change_subscription(self, tenant_id, plan_id, billing_cycle="annual"):
        plan = self.repo.get_plan(plan_id)
        if not plan:
            return {"success": False, "error": "Plan not found"}

        current = self.repo.get_active_subscription(tenant_id)
        if current and current.get("subscription_id"):
            self.repo.cancel_subscription(current["subscription_id"])

        subscription = self.repo.create_subscription(
            tenant_id=tenant_id,
            plan_id=plan_id,
            billing_cycle=billing_cycle
        )

        self.repo.update_tenant(tenant_id, plan_id=plan_id,
                                max_users=plan["max_users"],
                                max_projects=plan["max_projects"],
                                max_connections=plan["max_connections"])

        self.conn.commit()

        return {
            "success": True,
            "data": {
                "subscription": subscription,
                "plan": plan
            }
        }

    def list_plans(self):
        plans = self.repo.list_plans(status="active")
        return {"success": True, "data": plans}

    # DEV-009: plan-limit enforcement on creation paths.
    # Limits come from core.tenants.max_* (DDL defaults apply when NULL).
    # Kinds allowlisted — no invented limits. Raises ValueError (mapped to 403).
    LIMIT_COLUMNS = {
        "users": ("max_users", 5, "users"),
        "projects": ("max_projects", 3, "projects"),
        "connections": ("max_connections", 5, "systems"),
    }

    def check_limit(self, tenant_id, kind):
        column, default, label = self.LIMIT_COLUMNS[kind]
        with self.conn.cursor() as cur:
            cur.execute(
                f"SELECT COALESCE({column}, %s) FROM core.tenants WHERE tenant_id = %s",
                (default, tenant_id),
            )
            row = cur.fetchone()
            if not row:
                raise ValueError("Tenant not found")
            maximum = row[0]
            if kind == "users":
                cur.execute(
                    "SELECT COUNT(*) FROM platform.users "
                    "WHERE tenant_id = %s AND deleted_at IS NULL AND status = 'active'",
                    (tenant_id,),
                )
            elif kind == "projects":
                cur.execute(
                    "SELECT COUNT(*) FROM core.projects "
                    "WHERE tenant_id = %s AND status <> 'ARCHIVED'",
                    (tenant_id,),
                )
            else:
                cur.execute(
                    "SELECT COUNT(*) FROM core.system_registry sr "
                    "JOIN core.projects p ON p.project_id = sr.project_id "
                    "WHERE p.tenant_id = %s",
                    (tenant_id,),
                )
            current = cur.fetchone()[0]
            if current >= maximum:
                raise ValueError(
                    f"{label.capitalize()} limit reached ({current}/{maximum}). "
                    "Upgrade your plan to add more."
                )
            return {"current": current, "maximum": maximum}

    def get_tenant_context(self, tenant_id):
        tenant = self.repo.get_tenant(tenant_id)
        if not tenant:
            return None
        subscription = self.repo.get_active_subscription(tenant_id)
        return {
            "tenant_id": tenant["tenant_id"],
            "status": tenant["status"],
            "plan_id": tenant.get("plan_id"),
            "plan_tier": subscription.get("tier") if subscription else None,
            "entitlements": subscription.get("entitlements") if subscription else {},
            "max_users": tenant.get("max_users", 5),
            "max_projects": tenant.get("max_projects", 3),
            "max_connections": tenant.get("max_connections", 5),
        }
