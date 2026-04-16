# app/services/connection_manager.py
import psycopg2
from psycopg2 import OperationalError
from app.services.credential_service import CredentialService

class ConnectionManager:
    def __init__(self, conn):
        """
        Initialize with a live db connection to core for credentials.
        """
        self.credential_service = CredentialService(conn)
        self.connections = {}  # optional cache: {system_id: conn}

    def get_connection(self, system_id):
        """
        Return a psycopg2 connection for the given system_id.
        """
        # Return cached connection if available
        if system_id in self.connections:
            return self.connections[system_id]

        # Fetch credentials from service
        creds = self.credential_service.get_decrypted_credentials(system_id)
        if not creds:
            raise ValueError(f"No credentials found for system_id {system_id}")

        try:
            conn = psycopg2.connect(
                host=creds["host"],
                dbname=creds["dbname"],
                user=creds["username"],
                password=creds["password"],
                port=creds.get("port", 5432),
            )
            self.connections[system_id] = conn
            return conn
        except OperationalError as e:
            raise ConnectionError(f"Failed to connect to system {system_id}: {str(e)}")