import logging
from logging import config
from platform import system
from app.services.credential_service import CredentialService
from app.security.crypto import decrypt_password

logger = logging.getLogger(__name__)


class ConnectionResolver:
    def __init__(self, engine_db, schema="core"):
        self.engine_db = engine_db
        self.schema = schema   # ✅ THIS IS THE FIX

    def get_connections(self, project_id: str):
        """
        Returns:
            {
                "SOURCE": adapter,
                "TARGET": adapter
            }
        """

        systems = self._load_systems(project_id)

        connections = {}

        for system in systems:
            role = system["system_role"]
            adapter = self._build_adapter(system)

            if adapter is None:
                raise RuntimeError(f"Failed to build adapter for {role}")

            connections[role] = adapter

        return connections

    def _load_systems_curent_1(self, project_id):
        query = """
        SELECT 
            system_id,
            system_role,
            database_type,
            connection_config,
            credential_id
        FROM engine.system_registry
        WHERE project_id = %s
        """

        rows = self.engine_db.execute(query, (project_id,))

        systems = []
        for r in rows:
            systems.append({
                "system_id": r[0],
                "system_role": r[1],
                "database_type": r[2],
                "connection_config": r[3],
                "credential_id": r[4]
            })

        return systems
    

    def _load_systems(self, project_id):
        #query = """
        #    SELECT system_id, system_role, database_type, connection_config, credential_id
        #    FROM engine.system_registry
        #    WHERE project_id = %s
        #"""
        query = f"""
            SELECT system_id, system_role, database_type, connection_config, credential_id
            FROM {self.schema}.system_registry
            WHERE project_id = %s
        """
        rows = self.engine_db.execute(query, (project_id,))

        systems = []
        for r in rows:
            systems.append({
                "system_id": r[0],
                "system_role": r[1],
                "database_type": r[2],
                "connection_config": r[3],
                "credential_id": r[4]
            })
        return systems


    def _get_credentials_curent_1(self, credential_id):
        query = """
        SELECT username, password
        FROM engine.system_credentials
        WHERE credential_id = %s
        """

        rows = self.engine_db.execute(query, (credential_id,))

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        row = rows[0]

        return {
            "username": row[0],
            "password": row[1]   # ⚠️ plain for now
        }


    def _get_credentials_current_2(self, credential_id):
        #query = """
        #    SELECT username, password
        #    FROM engine.system_credentialsinse
        #    WHERE credential_id = %s
        #"""

        query = f"""
            SELECT username, password
            FROM {self.schema}.system_credentials
            WHERE credential_id = %s
        """
        rows = self.engine_db.execute(query, (credential_id,))

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        row = rows[0]

        return {
            "username": row[0],
            "password": row[1]
        }

    def _get_credentials_current_3(self, credential_id):
        query = f"""
            SELECT username, password_encrypted, encryption_key_id
            FROM {self.schema}.system_credentials
            WHERE credential_id = %s
        """

        rows = self.engine_db.execute(query, (credential_id,))

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        username, encrypted_password, key_id = rows[0]

        # IMPORTANT: decrypt step (must exist in your crypto module)
        from app.security.crypto import decrypt_password

        password = decrypt_password(encrypted_password, key_id)

        return {
            "username": username,
            "password": password
        }
    
    def _get_credentials_current_4(self, system_id):
        service = CredentialService(self.engine_db.connection)

        creds = service.get_decrypted_credentials(system_id)

        return creds
    def _build_adapter(self, system):
        from app.db.connection_factory import connection_factory

        config = system["connection_config"].copy()
        config["database_type"] = system["database_type"]

        creds = self._get_credentials(system["credential_id"])

        # 🔥 IMPORTANT: override config user/password
        config["user"] = creds["username"]
        config["password"] = creds["password"]


        logger.info(f"Building adapter for {system['system_role']}")

        return connection_factory(config)
    

    def _get_credentials_current_5(self, credential_id):
        query = f"""
            SELECT username, password_encrypted
            FROM {self.schema}.system_credentials
            WHERE credential_id = %s
        """
        rows = self.engine_db.execute(query, (credential_id,))

        

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        username, password = rows[0]

        return {
            "username": username,
            "password": password
        }
    

    def _get_credentials_current_6(self, credential_id):
        query = f"""
            SELECT username, password_encrypted
            FROM {self.schema}.system_credentials
            WHERE credential_id = %s
        """

        rows = self.engine_db.execute(query, (credential_id,))

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        username, password = rows[0]

        # ----------------------------
        # DEBUG: show raw type/value
        # ----------------------------
        print("🔐 RAW PASSWORD TYPE:", type(password))
        print("🔐 RAW PASSWORD VALUE:", password)

        # ----------------------------
        # NORMALISE PASSWORD FORMAT
        # (handles memoryview / bytes / str)
        # ----------------------------
        if isinstance(password, memoryview):
            password = password.tobytes().decode("utf-8")

        elif isinstance(password, bytes):
            password = password.decode("utf-8")

        # ----------------------------
        # FINAL OUTPUT DEBUG
        # ----------------------------
        print("🔓 DECODED PASSWORD:", password)

        return {
            "username": username,
            "password": password
        }
        

    def _get_credentials_current_7(self, credential_id):
        query = f"""
            SELECT username, password_encrypted, encryption_key_id
            FROM {self.schema}.system_credentials
            WHERE credential_id = %s
        """

        rows = self.engine_db.execute(query, (credential_id,))

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        username, encrypted_password, key_id = rows[0]

        # STEP: fetch encryption key (you likely already store this in env/config)
        encryption_key = self._get_encryption_key(key_id)

        # 🔐 DECRYPT HERE (THIS IS THE CORRECT LAYER)
        password = decrypt_password(encrypted_password, encryption_key)

        print("🔓 DECRYPTED PASSWORD:", password)

        return {
            "username": username,
            "password": password
        }


    def _get_credentials(self, credential_id):
        from cryptography.fernet import Fernet

        query = f"""
            SELECT username, password_encrypted, encryption_key_id
            FROM {self.schema}.system_credentials
            WHERE credential_id = %s
        """

        rows = self.engine_db.execute(query, (credential_id,))

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        username, encrypted_password, key_id = rows[0]

        print("\n🔐 RAW PASSWORD TYPE:", type(encrypted_password))
        print("🔐 RAW PASSWORD VALUE:", encrypted_password)

        # Convert memoryview → bytes
        if isinstance(encrypted_password, memoryview):
            encrypted_password = encrypted_password.tobytes()

        print("🔐 BYTES PASSWORD:", encrypted_password)

        # 🔑 get key
        key = self._get_encryption_key(key_id)

        cipher = Fernet(key.encode())

        # 🔓 decrypt
        decrypted_password = cipher.decrypt(encrypted_password).decode()

        print("🔓 DECRYPTED PASSWORD:", decrypted_password)

        return {
            "username": username,
            "password": decrypted_password
        }
    def _get_encryption_key_current_1(self, key_id):
        """
        In most systems this comes from:
        - environment variables
        - vault
        - config table
        """

        # SIMPLE DEV IMPLEMENTATION (adjust later)
        from app.config import config

        return config["encryption_keys"][key_id]



    def _get_encryption_key_current_2(self, key_id):
        import os

        print(f"🔑 Resolving encryption key for: {key_id}")

        key = os.getenv("FERNET_KEY")

        if not key:
            raise RuntimeError("❌ FERNET_KEY not set in environment")

        print(f"✅ Encryption key loaded (length={len(key)})")

        return key

    def _get_encryption_key(self, key_id):
        import os

        print("🔍 DEBUG ENV FERNET_KEY:", os.getenv("FERNET_KEY"))

        key = os.getenv("FERNET_KEY")

        if not key:
            raise RuntimeError("❌ FERNET_KEY not set in environment")

        return key


    

    