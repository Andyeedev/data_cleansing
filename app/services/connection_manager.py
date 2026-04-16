# app/services/connection_manager.py
import psycopg2
import json
from app.services.credential_service import CredentialService

class ConnectionManager:
    def __init__(self, core_conn, system_repo):
        self.credential_service = CredentialService(core_conn)
        self.system_repo = system_repo
        self.connections = {}

    def get_connection(self, system_id):
        if system_id in self.connections:
            return self.connections[system_id]

        # 1. Get system config
        system = self.system_repo.get_by_id(system_id)
        config = system["connection_config"]

        if isinstance(config, str):
            config = json.loads(config)

        # 2. Get credentials
        creds = self.credential_service.get_decrypted_credentials(system_id)

        # 3. Merge safely
        conn = psycopg2.connect(
            host=config["host"],
            port=config.get("port", 5432),
            dbname=config["database"],
            user=creds["username"],
            password=creds["password"]
        )

        self.connections[system_id] = conn
        return conn