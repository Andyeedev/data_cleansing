class CredentialRepository:

    def __init__(self, conn):
        self.conn = conn

    def get_by_system_id(self, system_id, tenant_id=None):
        if tenant_id:
            query = """
            SELECT sc.credential_id, sc.username, sc.password_encrypted
            FROM core.system_credentials sc
            JOIN core.system_registry sr ON sc.system_id = sr.system_id
            WHERE sc.system_id = %s AND sr.tenant_id = %s
            """
            params = (system_id, tenant_id)
        else:
            query = """
            SELECT credential_id, username, password_encrypted
            FROM core.system_credentials
            WHERE system_id = %s
            """
            params = (system_id,)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchone()

    def get_by_credential_id(self, credential_id, tenant_id=None):
        if tenant_id:
            query = """
            SELECT sc.credential_id, sc.username, sc.password_encrypted, sc.system_id
            FROM core.system_credentials sc
            JOIN core.system_registry sr ON sc.system_id = sr.system_id
            WHERE sc.credential_id = %s AND sr.tenant_id = %s
            """
            params = (credential_id, tenant_id)
        else:
            query = """
            SELECT credential_id, username, password_encrypted, system_id
            FROM core.system_credentials
            WHERE credential_id = %s
            """
            params = (credential_id,)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchone()

    def insert(self, credential_id, system_id, username, password_encrypted, tenant_id=None):
        if tenant_id:
            query = """
            INSERT INTO core.system_credentials (
                credential_id,
                system_id,
                username,
                password_encrypted,
                encryption_key_id
            )
            SELECT %s, %s, %s, %s, 'env-key-1'
            WHERE EXISTS (
                SELECT 1 FROM core.system_registry
                WHERE system_id = %s AND tenant_id = %s
            )
            """
            params = (credential_id, system_id, username, password_encrypted, system_id, tenant_id)
        else:
            query = """
            INSERT INTO core.system_credentials (
                credential_id,
                system_id,
                username,
                password_encrypted,
                encryption_key_id
            )
            VALUES (%s, %s, %s, %s, 'env-key-1')
            """
            params = (credential_id, system_id, username, password_encrypted)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            rows_affected = cur.rowcount
        self.conn.commit()
        return rows_affected > 0

    def update(self, credential_id, username, password_encrypted, tenant_id=None):
        if tenant_id:
            query = """
            UPDATE core.system_credentials
            SET username = %s,
                password_encrypted = %s
            WHERE credential_id = %s
            AND system_id IN (
                SELECT system_id FROM core.system_registry
                WHERE tenant_id = %s
            )
            """
            params = (username, password_encrypted, credential_id, tenant_id)
        else:
            query = """
            UPDATE core.system_credentials
            SET username = %s,
                password_encrypted = %s
            WHERE credential_id = %s
            """
            params = (username, password_encrypted, credential_id)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            rows_affected = cur.rowcount
        self.conn.commit()
        return rows_affected > 0

    def delete(self, credential_id, tenant_id=None):
        if tenant_id:
            query = """
            DELETE FROM core.system_credentials
            WHERE credential_id = %s
            AND system_id IN (
                SELECT system_id FROM core.system_registry
                WHERE tenant_id = %s
            )
            """
            params = (credential_id, tenant_id)
        else:
            query = "DELETE FROM core.system_credentials WHERE credential_id = %s"
            params = (credential_id,)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            rows_affected = cur.rowcount
        self.conn.commit()
        return rows_affected > 0

    def get_all(self, tenant_id=None):
        if tenant_id:
            query = """
            SELECT sc.credential_id, sc.username
            FROM core.system_credentials sc
            JOIN core.system_registry sr ON sc.system_id = sr.system_id
            WHERE sr.tenant_id = %s
            """
            params = (tenant_id,)
        else:
            query = "SELECT credential_id, username FROM core.system_credentials"
            params = None
        with self.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            return cur.fetchall()
