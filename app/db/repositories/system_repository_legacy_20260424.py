class SystemRepository:

    def __init__(self, conn):
        self.conn = conn

    # =========================
    # CREATE
    # =========================
    def insert(self, system_id, system_name, system_type):

        query = """
        INSERT INTO core.system_registry (
            system_id,
            system_name,
            system_type
        )
        VALUES (%s, %s, %s)
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_id,
                system_name,
                system_type
            ))

        self.conn.commit()

    # =========================
    # UPDATE
    # =========================
    def update(self, system_id, system_name, system_type):

        query = """
        UPDATE core.system_registry
        SET system_name = %s,
            system_type = %s
        WHERE system_id = %s
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_name,
                system_type,
                system_id
            ))

        self.conn.commit()

    # =========================
    # DELETE
    # =========================
    def delete(self, system_id):

        query = "DELETE FROM core.system_registry WHERE system_id = %s"

        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))

        self.conn.commit()

    # =========================
    # GET ALL
    # =========================
    def get_all(self):

        query = """
        SELECT system_id, system_name, database_type, credential_id
        FROM core.system_registry
        """

        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    # =========================
    # GET ONE
    # =========================
    def get_by_id_legacy(self, system_id):

        query = """
        SELECT system_id, system_name, database_type, credential_id
        FROM core.system_registry
        WHERE system_id = %s
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))
            return cur.fetchone()



    def get_by_id(self, system_id):

        query = """
        SELECT 
            system_id,
            system_name,
            database_type,
            connection_config,
            credential_id
        FROM core.system_registry
        WHERE system_id = %s
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))
            return cur.fetchone()