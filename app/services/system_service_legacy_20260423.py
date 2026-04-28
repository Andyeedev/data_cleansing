class SystemService:

    def __init__(self, conn):
        self.conn = conn

    def create(self, data):
        query = """
        INSERT INTO core.system_registry (system_id, system_name, system_role, database_type)
        VALUES (%s, %s, %s, %s)
        RETURNING system_id
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (
                data["system_id"],
                data["system_name"],
                data["system_role"],
                data["database_type"]
            ))
            system_id = cur.fetchone()[0]

        self.conn.commit()
        return {"system_id": system_id}

    def list(self):
        query = """
        SELECT system_id, system_name, system_role
        FROM core.system_registry
        """

        with self.conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()

        return [
            {
                "system_id": r[0],
                "system_name": r[1],
                "system_role": r[2]
            }
            for r in rows
        ]