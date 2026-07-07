from cryptography.fernet import Fernet


class EncryptionUtils:

    @staticmethod
    def generate_key():
        key = Fernet.generate_key()
        print("\n🔑 NEW FERNET KEY (STORE THIS SAFELY):\n")
        print(key.decode())
        return key

    @staticmethod
    def encrypt(password: str, key: str) -> bytes:
        cipher = Fernet(key.encode() if isinstance(key, str) else key)
        return cipher.encrypt(password.encode())

    @staticmethod
    def decrypt(token: bytes, key: str) -> str:
        cipher = Fernet(key.encode() if isinstance(key, str) else key)
        return cipher.decrypt(token).decode()
