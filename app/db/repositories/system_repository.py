class SystemRepository:

    def __init__(self, conn):
        self.conn = conn

    # =========================
    # CREATE
    # =========================
    def insert(
        self,
        system_id,
        project_id,
        system_name,
        system_role,
        database_type,
        connection_config,
        tenant_id=None
    ):
        query = """
        INSERT INTO core.system_registry (
            system_id,
            project_id,
            system_name,
            system_role,
            database_type,
            connection_config,
            tenant_id
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_id,
                project_id,
                system_name,
                system_role,
                database_type,
                connection_config,
                tenant_id
            ))

        self.conn.commit()

    # =========================
    # UPDATE
    # =========================

    def update(self, system_id, system_name, system_role, database_type, connection_config):

        query = """
        UPDATE core.system_registry
        SET system_name = %s,
            system_role = %s,
            database_type = %s,
            connection_config = %s
        WHERE system_id = %s
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_name,
                system_role,
                database_type,
                connection_config,
                system_id
            ))

        self.conn.commit()

    # =========================
    # GET ALL — DEV-001: tenancy derived ONLY via project join.
    # sr.tenant_id is transient (rollback aid) and MUST NOT be used as authority.
    # Unscoped (tenant_id=None AND project_id=None) is for explicit Super Admin
    # paths only; tenant routes always pass the JWT tenant.
    # =========================
    def get_all(self, tenant_id=None, project_id=None):

        query = """
        SELECT sr.system_id, sr.system_name, sr.system_role, sr.database_type,
               sr.credential_id, sr.project_id
        FROM core.system_registry sr
        JOIN core.projects p ON p.project_id = sr.project_id
        """
        conditions = []
        params = []
        if tenant_id:
            conditions.append("p.tenant_id = %s")
            params.append(tenant_id)
        if project_id:
            conditions.append("sr.project_id = %s")
            params.append(project_id)
        if conditions:
            query += "WHERE " + " AND ".join(conditions)

        with self.conn.cursor() as cur:
            cur.execute(query, tuple(params) if params else None)
            return cur.fetchall()

    # =========================
    # GET ONE — DEV-001: scoped via project ancestry (system → project → tenant)
    # =========================
    def get_by_id(self, system_id, tenant_id=None, project_id=None):

        query = """
        SELECT
            sr.system_id,
            sr.system_name,
            sr.system_role,
            sr.database_type,
            sr.connection_config,
            sr.credential_id,
            sr.project_id
        FROM core.system_registry sr
        JOIN core.projects p ON p.project_id = sr.project_id
        WHERE sr.system_id = %s
        """
        params = [system_id]
        if tenant_id:
            query += " AND p.tenant_id = %s"
            params.append(tenant_id)
        if project_id:
            query += " AND sr.project_id = %s"
            params.append(project_id)

        with self.conn.cursor() as cur:
            cur.execute(query, tuple(params))
            return cur.fetchone()

    # =========================
    # PROJECT OWNERSHIP CHECK — DEV-001/DEV-005 helper.
    # Returns the owning tenant_id for a project, or None if unknown.
    # =========================
    def get_project_tenant(self, project_id):

        query = "SELECT tenant_id FROM core.projects WHERE project_id = %s"

        with self.conn.cursor() as cur:
            cur.execute(query, (project_id,))
            row = cur.fetchone()
            return row[0] if row else None

    # =========================
    # DELETE
    # =========================
    def delete(self, system_id):

        query = "DELETE FROM core.system_registry WHERE system_id = %s"

        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))

        self.conn.commit()
