# app/core/encryption_manager.py

from cryptography.fernet import Fernet
from app.api.core.config import get_env


class EncryptionManager:
    def __init__(self):
        key = get_env("FERNET_KEY")
        self.cipher = Fernet(key.encode())

    def decrypt(self, encrypted: bytes) -> str:
        if isinstance(encrypted, memoryview):
            encrypted = encrypted.tobytes()

        decrypted = self.cipher.decrypt(encrypted)
        return decrypted.decode()

    def encrypt(self, plaintext: str) -> bytes:
        return self.cipher.encrypt(plaintext.encode())