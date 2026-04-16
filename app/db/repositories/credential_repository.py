class CredentialRepository:

    def __init__(self, conn):
        self.conn = conn

    def get_by_system_id(self, system_id):
        query = """
        SELECT credential_id, username, password_encrypted
        FROM core.system_credentials
        WHERE system_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))
            return cur.fetchone()

    def insert(self, credential_id, system_id, username, password_encrypted):
        query = """
        INSERT INTO core.system_credentials (
            credential_id,
            system_id,
            username,
            password_encrypted,
            encryption_key_id
        )
        VALUES (%s, %s, %s, %s, %s)
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                credential_id,
                system_id,
                username,
                password_encrypted,
                "env-key-1"
            ))
        self.conn.commit()

    def update(self, credential_id, username, password_encrypted):
        query = """
        UPDATE core.system_credentials
        SET username = %s,
            password_encrypted = %s
        WHERE credential_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                username,
                password_encrypted,
                credential_id
            ))
        self.conn.commit()