from app.db.connection import get_db_connection


class GovernanceRepository:

    def __init__(self):
        self.db = get_db_connection()

    def get_audit_entries(self, limit: int = 50, entity_type: str = None, tenant_id: str = None):
        query = """
            SELECT
                mce.id,
                mce.execution_status AS action,
                mce.control_id AS entity_type,
                mce.rule_id AS entity_id,
                'SYSTEM' AS user_email,
                mce.created_at AS timestamp,
                mce.entity_name AS details
            FROM engine.migration_control_execution mce
            JOIN engine.migration_batch_registry mbr ON mce.batch_id = mbr.batch_id
            WHERE 1=1
        """
        params = []
        if tenant_id:
            query += " AND mbr.tenant_id = %s"
            params.append(tenant_id)
        if entity_type and entity_type != 'all':
            query += " AND mce.control_id = %s"
            params.append(entity_type)
        query += " ORDER BY mce.created_at DESC LIMIT %s"
        params.append(limit)
        return self.db.execute(query, tuple(params))

    def get_pending_approvals(self, tenant_id: str = None):
        query = """
            SELECT
                mrd.id,
                mrd.client_name AS entity_type,
                mrd.batch_id::text AS entity_id,
                mrd.gate_result AS status,
                mrd.approved_by AS requested_by,
                mrd.created_at
            FROM engine.migration_release_decision mrd
            JOIN core.projects p ON mrd.project_id = p.project_id
            WHERE p.tenant_id = %s
            ORDER BY mrd.created_at DESC
        """
        return self.db.execute(query, (tenant_id,))

    def get_exception_requests(self, tenant_id: str = None):
        query = """
            SELECT
                mce.id,
                mce.control_id AS entity_type,
                mce.rule_id AS entity_id,
                mce.cause AS reason,
                COALESCE(mce.failure_scope, 'OPEN') AS status,
                'SYSTEM' AS requested_by,
                mce.created_at
            FROM engine.migration_control_exceptions mce
            JOIN engine.migration_batch_registry mbr ON mce.batch_id = mbr.batch_id
            WHERE mbr.tenant_id = %s
            ORDER BY mce.created_at DESC
        """
        return self.db.execute(query, (tenant_id,))
