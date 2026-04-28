class SystemRepository:

    def __init__(self, conn):
        self.conn = conn

    # =========================
    # CREATE
    # =========================
    def insert_legacy(self, system_id, system_name, system_role, database_type, connection_config):

        query = """
        INSERT INTO core.system_registry (
            system_id,
            system_name,
            system_role,
            database_type,
            connection_config
        )
        VALUES (%s, %s, %s, %s, %s)
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_id,
                system_name,
                system_role,
                database_type,
                connection_config
            ))

        self.conn.commit()

    def insert_legacy_2(self, system_id, project_id, system_name, system_role, database_type, connection_config):

        query = """
        INSERT INTO core.system_registry (
            system_id,
            project_id,
            system_name,
            system_role,
            database_type,
            connection_config
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_id,
                project_id,
                system_name,
                system_role,
                database_type,
                connection_config
            ))

        self.conn.commit()

    def insert(
        self,
        system_id,
        project_id,
        system_name,
        system_role,
        database_type,
        connection_config
    ):
        query = """
        INSERT INTO core.system_registry (
            system_id,
            project_id,
            system_name,
            system_role,
            database_type,
            connection_config
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_id,
                project_id,
                system_name,
                system_role,
                database_type,
                connection_config
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
    # GET ALL
    # =========================
    def get_all(self):

        query = """
        SELECT system_id, system_name, system_role, database_type, credential_id
        FROM core.system_registry
        """

        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    # =========================
    # GET ONE
    # =========================
    def get_by_id(self, system_id):

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

        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))
            return cur.fetchone()