from app.api.core.encryption_manager import EncryptionManager


class CredentialAdminService:

    def __init__(self, engine_db):
        self.engine_db = engine_db
        self.encryption = EncryptionManager()

    def update_password(self, username: str, new_password: str):

        # 🔐 encrypt password
        encrypted_password = self.encryption.encrypt(new_password)

        # 🔍 check user exists
        check_query = """
        SELECT credential_id 
        FROM core.system_credentials
        WHERE username = %s
        """

        result = self.engine_db.execute(check_query, (username,))

        if not result:
            raise ValueError(f"❌ Username not found: {username}")

        # ✅ update password
        update_query = """
        UPDATE core.system_credentials
        SET password_encrypted = %s
        WHERE username = %s
        """

        self.engine_db.execute(update_query, (encrypted_password, username))

        return {
            "status": "success",
            "username": username
        }