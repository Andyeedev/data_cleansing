import base64
from cryptography.fernet import Fernet


class CryptoManager:
    def __init__(self, key: str):
        """
        key must be a valid Fernet key (base64 encoded)
        """
        self.fernet = Fernet(key.encode())

    def decrypt(self, encrypted_value):
        """
        Accepts:
        - bytes (BYTEA from Postgres)
        - memoryview
        - str (base64 fallback)
        """

        if encrypted_value is None:
            return None

        # Convert Postgres BYTEA → bytes
        if isinstance(encrypted_value, memoryview):
            encrypted_value = encrypted_value.tobytes()

        if isinstance(encrypted_value, str):
            encrypted_value = base64.b64decode(encrypted_value)

        # Fernet decrypt
        decrypted = self.fernet.decrypt(encrypted_value)

        return decrypted.decode("utf-8")


# Convenience function (used by resolver)
def decrypt_password(encrypted_value, key: str):
    return CryptoManager(key).decrypt(encrypted_value)