# app/db/repositories/system_repository.py

class SystemRepository:
    def __init__(self, conn):
        self.conn = conn

    def get_by_id(self, system_id):
        query = """
            SELECT system_id, system_name, system_role, connection_config
            FROM core.system_registry
            WHERE system_id = %s;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))
            row = cur.fetchone()

            if not row:
                return None

            return {
                "system_id": row[0],
                "system_name": row[1],
                "system_role": row[2],
                "connection_config": row[3],
            }

    def get_by_role(self, role):
        query = """
            SELECT system_id, system_name, system_role, connection_config
            FROM core.system_registry
            WHERE system_role = %s
            LIMIT 1;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (role,))
            row = cur.fetchone()

            if not row:
                raise ValueError(f"No system found with role {role}")

            return {
                "system_id": row[0],
                "system_name": row[1],
                "system_role": row[2],
                "connection_config": row[3],
            }