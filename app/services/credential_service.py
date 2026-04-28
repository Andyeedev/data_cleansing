import uuid
import logging
from app.api.core.security.encryption import EncryptionManager
from app.db.repositories.credential_repository import CredentialRepository

logger = logging.getLogger(__name__)


class CredentialService:

    def __init__(self, conn):
        self.conn = conn
        self.repo = CredentialRepository(conn)
        self.encryption = EncryptionManager()

    # =========================
    # CREATE
    # =========================
    def create_credential(self, system_id, username, password):

        credential_id = str(uuid.uuid4())
        encrypted_password = self.encryption.encrypt(password)

        self.repo.insert(
            credential_id=credential_id,
            system_id=system_id,
            username=username,
            password_encrypted=encrypted_password
        )

        self._link_to_system(system_id, credential_id)

        return {
            "message": "Credential created",
            "credential_id": credential_id
        }

    # =========================
    # UPDATE
    # =========================
    def update_credential(self, credential_id, username, password):

        encrypted_password = self.encryption.encrypt(password)

        self.repo.update(
            credential_id=credential_id,
            username=username,
            password_encrypted=encrypted_password
        )

        return {
            "message": "Credential updated",
            "credential_id": credential_id
        }

    # =========================
    # UPSERT (optional advanced)
    # =========================
    def upsert_credentials(self, system_id, username, password):

        existing = self.repo.get_by_system_id(system_id)
        encrypted_password = self.encryption.encrypt(password)

        if existing:
            credential_id = existing[0]
            logger.info(f"Updating credentials for system {system_id}")
            self.repo.update(credential_id, username, encrypted_password)

        else:
            credential_id = str(uuid.uuid4())
            logger.info(f"Creating new credentials for system {system_id}")
            self.repo.insert(credential_id, system_id, username, encrypted_password)
            self._link_to_system(system_id, credential_id)

        return credential_id

    # =========================
    # LINK SYSTEM
    # =========================
    def _link_to_system(self, system_id, credential_id):

        query = """
        UPDATE core.system_registry
        SET credential_id = %s
        WHERE system_id = %s
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (credential_id, system_id))

        self.conn.commit()

    # =========================
    # FETCH + DECRYPT
    # =========================
    def get_decrypted_credentials(self, system_id):

        row = self.repo.get_by_system_id(system_id)

        if not row:
            raise Exception("No credentials found")

        _, username, encrypted_password = row
        password = self.encryption.decrypt(encrypted_password)

        return {
            "username": username,
            "password": password
        }

    # =========================
    # LIST
    # =========================
    def list_credentials(self):

        rows = self.repo.get_all()

        return [
            {
                "credential_id": r[0],
                "username": r[1]
            }
            for r in rows
        ]

    # =========================
    # DELETE
    # =========================
    def delete_credential(self, credential_id):

        self.repo.delete(credential_id)
        self.conn.commit()

        return {"deleted": credential_id}