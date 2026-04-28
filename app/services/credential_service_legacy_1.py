import uuid
from app.api.core.security.encryption import EncryptionManager
from app.db.repositories.credential_repository import CredentialRepository

class CredentialService:

    def __init__(self, conn):
        self.repo = CredentialRepository(conn)
        self.encryption = EncryptionManager()
        self.conn = conn

    def upsert_credentials(self, system_id, username, password):
        
        existing = self.repo.get_by_system_id(system_id)

        encrypted_password = self.encryption.encrypt(password)

        if existing:
            credential_id = existing[0]
            print(f"[INFO] Updating credentials for system {system_id}")
            self.repo.update(credential_id, username, encrypted_password)

        else:
            credential_id = str(uuid.uuid4())
            print(f"[INFO] Creating new credentials for system {system_id}")
            self.repo.insert(credential_id, system_id, username, encrypted_password)

            # Link to system_registry
            self._link_to_system(system_id, credential_id)

        return credential_id

    def _link_to_system(self, system_id, credential_id):
        query = """
        UPDATE core.system_registry
        SET credential_id = %s
        WHERE system_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (credential_id, system_id))
        self.conn.commit()

    def get_decrypted_credentials(self, system_id):
        row = self.repo.get_by_system_id(system_id)

        if not row:
            raise Exception("No credentials found")

        _, username, encrypted_password = row

        password = self.encryption.decrypt(encrypted_password)

        print("DEBUG USERNAME:", username)
        print("DEBUG PASSWORD:", password)
        return {
            "username": username,
            "password": password
        }