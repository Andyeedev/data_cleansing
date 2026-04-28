class SystemRepository:

    def __init__(self, conn):
        self.conn = conn

    def insert(self, system_id, system_name, system_role, database_type):
        query = """
        INSERT INTO core.system_registry 
        (system_id, system_name, system_role, database_type)
        VALUES (%s, %s, %s, %s)
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                system_id,
                system_name,
                system_role,
                database_type
            ))

        self.conn.commit()

    def get_all(self):
        query = """
        SELECT system_id, system_name, system_role
        FROM core.system_registry
        """

        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()