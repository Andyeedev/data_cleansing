# app/services/connection_manager.py
import psycopg2
from psycopg2 import OperationalError
from app.services.credential_service import CredentialService

class ConnectionManager:
    def __init__(self, core_conn):
        """
        Initialize with a connection to core database (for credential access).
        """
        self.credential_service = CredentialService(core_conn)
        self.connections = {}  # cache for system connections

    def get_connection(self, system_id):
        """
        Return a psycopg2 connection for a given system_id.
        """
        if system_id in self.connections:
            return self.connections[system_id]

        creds = self.credential_service.get_decrypted_credentials(system_id)
        if not creds:
            raise ValueError(f"No credentials found for system_id {system_id}")

        try:
            conn = psycopg2.connect(
                host=creds.get("host"),
                dbname=creds.get("dbname"),
                user=creds.get("username"),
                password=creds.get("password"),
                port=creds.get("port", 5432)
            )
            self.connections[system_id] = conn
            return conn
        except OperationalError as e:
            raise ConnectionError(f"Cannot connect to system {system_id}: {str(e)}")