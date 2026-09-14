import uuid
from datetime import datetime


class TenantRepository:

    def __init__(self, conn):
        self.conn = conn

    # =========================
    # TENANT CRUD
    # =========================

    def create_tenant(self, tenant_name, billing_email=None, plan_id=None):
        tenant_id = str(uuid.uuid4())
        query = """
            INSERT INTO core.tenants (tenant_id, tenant_name, billing_email, plan_id, status)
            VALUES (%s, %s, %s, %s, 'ACTIVE')
            RETURNING tenant_id, tenant_name, status, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (tenant_id, tenant_name, billing_email, plan_id))
            columns = [desc[0] for desc in cur.description]
            result = dict(zip(columns, cur.fetchone()))
        self.conn.commit()
        return result

    def get_tenant(self, tenant_id):
        query = """
            SELECT tenant_id, tenant_name, status, plan_id, billing_email,
                   max_users, max_projects, max_connections, metadata,
                   created_at, updated_at
            FROM core.tenants
            WHERE tenant_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (tenant_id,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def list_tenants(self, page=1, page_size=50, status=None):
        offset = (page - 1) * page_size
        query = """
            SELECT tenant_id, tenant_name, status, plan_id, billing_email,
                   max_users, max_projects, max_connections, created_at
            FROM core.tenants
            WHERE 1=1
        """
        params = []

        if status:
            query += " AND status = %s"
            params.append(status)

        count_query = "SELECT COUNT(*) FROM core.tenants WHERE 1=1"
        count_params = list(params)

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            tenants = [dict(zip(columns, row)) for row in cur.fetchall()]

            cur.execute(count_query, count_params)
            total = cur.fetchone()[0]

        return {"tenants": tenants, "total": total, "page": page, "page_size": page_size}

    def update_tenant(self, tenant_id, **kwargs):
        allowed = {"tenant_name", "billing_email", "plan_id", "status", "max_users", "max_projects", "max_connections", "metadata"}
        updates = []
        params = []

        for key, value in kwargs.items():
            if key in allowed and value is not None:
                updates.append(f"{key} = %s")
                params.append(value)

        if not updates:
            return None

        updates.append("updated_at = NOW()")
        params.append(tenant_id)

        query = f"""
            UPDATE core.tenants
            SET {', '.join(updates)}
            WHERE tenant_id = %s
            RETURNING tenant_id, tenant_name, status, plan_id, billing_email, updated_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            result = dict(zip(columns, row)) if row else None
        self.conn.commit()
        return result

    # =========================
    # PLANS
    # =========================

    def get_plan(self, plan_id):
        query = """
            SELECT plan_id, name, tier, monthly_price, annual_price,
                   entitlements, max_users, max_projects, max_connections,
                   status, description
            FROM platform.plans
            WHERE plan_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (plan_id,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def get_plan_by_tier(self, tier):
        query = """
            SELECT plan_id, name, tier, monthly_price, annual_price,
                   entitlements, max_users, max_projects, max_connections,
                   status, description
            FROM platform.plans
            WHERE tier = %s AND status = 'active'
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (tier,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def list_plans(self, status=None):
        query = """
            SELECT plan_id, name, tier, monthly_price, annual_price, list_price,
                   entitlements, max_users, max_projects, max_connections,
                   status, description
            FROM platform.plans
            WHERE 1=1
        """
        params = []
        if status:
            query += " AND status = %s"
            params.append(status)
        query += " ORDER BY annual_price ASC"

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]

    # =========================
    # SUBSCRIPTIONS
    # =========================

    def create_subscription(self, tenant_id, plan_id, billing_cycle="annual", created_by=None):
        sub_id = str(uuid.uuid4())
        query = """
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, start_date, created_by)
            VALUES (%s, %s, %s, 'active', %s, CURRENT_DATE, %s)
            RETURNING subscription_id, tenant_id, plan_id, status, billing_cycle, start_date, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (sub_id, tenant_id, plan_id, billing_cycle, created_by))
            columns = [desc[0] for desc in cur.description]
            result = dict(zip(columns, cur.fetchone()))
        self.conn.commit()
        return result

    def create_trial_subscription(self, tenant_id, plan_id, trial_days=30, created_by=None):
        sub_id = str(uuid.uuid4())
        query = """
            INSERT INTO platform.subscriptions (subscription_id, tenant_id, plan_id, status, billing_cycle, trial_end_date, created_by)
            VALUES (%s, %s, %s, 'trialing', 'monthly', CURRENT_DATE + INTERVAL '%s days', %s)
            RETURNING subscription_id, tenant_id, plan_id, status, trial_end_date, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (sub_id, tenant_id, plan_id, trial_days, created_by))
            columns = [desc[0] for desc in cur.description]
            result = dict(zip(columns, cur.fetchone()))
        self.conn.commit()
        return result

    def get_active_subscription(self, tenant_id):
        query = """
            SELECT s.subscription_id, s.tenant_id, s.plan_id, s.status,
                   s.billing_cycle, s.start_date, s.end_date, s.trial_end_date,
                   s.created_at,
                   p.name AS plan_name, p.tier, p.annual_price, p.entitlements,
                   p.max_users, p.max_projects, p.max_connections
            FROM platform.subscriptions s
            JOIN platform.plans p ON s.plan_id = p.plan_id
            WHERE s.tenant_id = %s AND s.status IN ('active', 'trialing', 'pending_cancellation')
            ORDER BY s.created_at DESC
            LIMIT 1
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (tenant_id,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None

    def list_subscriptions(self, tenant_id):
        query = """
            SELECT s.subscription_id, s.status, s.billing_cycle,
                   s.start_date, s.end_date, s.trial_end_date, s.created_at,
                   p.name AS plan_name, p.tier, p.annual_price
            FROM platform.subscriptions s
            JOIN platform.plans p ON s.plan_id = p.plan_id
            WHERE s.tenant_id = %s
            ORDER BY s.created_at DESC
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (tenant_id,))
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]

    def cancel_subscription(self, subscription_id):
        query = """
            UPDATE platform.subscriptions
            SET status = 'cancelled', end_date = CURRENT_DATE, updated_at = NOW()
            WHERE subscription_id = %s AND status IN ('active', 'trialing')
            RETURNING subscription_id, status, end_date
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (subscription_id,))
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            result = dict(zip(columns, row)) if row else None
        self.conn.commit()
        return result
