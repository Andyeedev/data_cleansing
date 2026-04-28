import os
from cryptography.fernet import Fernet

class EncryptionManager:
    def __init__(self):
        key = os.getenv("FERNET_KEY")
        if not key:
            raise ValueError("FERNET_KEY not set in environment")
        self.cipher = Fernet(key)

    def encrypt(self, plaintext: str) -> bytes:
        return self.cipher.encrypt(plaintext.encode())
    



    #def decrypt(self, ciphertext: bytes) -> str:
    #    return self.cipher.decrypt(ciphertext).decode()

    def decrypt(self, ciphertext):
        if isinstance(ciphertext, memoryview):
            ciphertext = ciphertext.tobytes()
        elif isinstance(ciphertext, str):
            ciphertext = ciphertext.encode()

        return self.cipher.decrypt(ciphertext).decode() 