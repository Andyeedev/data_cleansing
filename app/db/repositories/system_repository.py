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
    # GET ALL (filtered by tenant)
    # =========================
    def get_all(self, tenant_id=None):

        if tenant_id:
            query = """
            SELECT system_id, system_name, system_role, database_type, credential_id
            FROM core.system_registry
            WHERE tenant_id = %s
            """
            params = (tenant_id,)
        else:
            query = """
            SELECT system_id, system_name, system_role, database_type, credential_id
            FROM core.system_registry
            """
            params = None

        with self.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            return cur.fetchall()

    # =========================
    # GET ONE (with optional tenant filter)
    # =========================
    def get_by_id(self, system_id, tenant_id=None):

        if tenant_id:
            query = """
            SELECT
                system_id,
                system_name,
                system_role,
                database_type,
                connection_config,
                credential_id
            FROM core.system_registry
            WHERE system_id = %s AND tenant_id = %s
            """
            params = (system_id, tenant_id)
        else:
            query = """
            SELECT
                system_id,
                system_name,
                system_role,
                database_type,
                connection_config,
                credential_id
            FROM core.system_registry
            WHERE system_id = %s
            """
            params = (system_id,)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchone()

    # =========================
    # DELETE
    # =========================
    def delete(self, system_id):

        query = "DELETE FROM core.system_registry WHERE system_id = %s"

        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))

        self.conn.commit()
