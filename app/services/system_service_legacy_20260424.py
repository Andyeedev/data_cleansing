import uuid
import json
import psycopg2
from app.db.repositories.system_repository import SystemRepository
from app.services.credential_service import CredentialService

class SystemService:

    def __init__(self, conn):
        self.conn = conn
        self.repo = SystemRepository(conn)

    # =========================
    # CREATE
    # =========================
    def create_system(self, system_name, system_type):

        system_id = str(uuid.uuid4())

        self.repo.insert(
            system_id=system_id,
            system_name=system_name,
            system_type=system_type
        )

        return {
            "message": "System created",
            "system_id": system_id
        }

    # =========================
    # UPDATE
    # =========================
    def update_system(self, system_id, system_name, system_type):

        self.repo.update(
            system_id=system_id,
            system_name=system_name,
            system_type=system_type
        )

        return {
            "message": "System updated",
            "system_id": system_id
        }

    # =========================
    # DELETE
    # =========================
    def delete_system(self, system_id):

        self.repo.delete(system_id)

        return {"deleted": system_id}

    # =========================
    # LIST
    # =========================
    def list_systems(self):

        rows = self.repo.get_all()

        return [
            {
                "system_id": r[0],
                "system_name": r[1],
                "system_type": r[2],
                "credential_id": r[3]
            }
            for r in rows
        ]

    # =========================
    # GET ONE
    # =========================
    def get_system(self, system_id):

        row = self.repo.get_by_id(system_id)

        if not row:
            raise Exception("System not found")

        return {
            "system_id": row[0],
            "system_name": row[1],
            "system_type": row[2],
            #"credential_id": row[3]
            "connection_config": row[3],   # ✅ fix
            "credential_id": row[4]
        }
    

    # =========================
    # SERVICE — TEST CONNECTION    
    # # =========================    


    def test_connection(self, system_id):

        # 1. GET SYSTEM
        row = self.repo.get_by_id(system_id)

        if not row:
            raise Exception("System not found")

        _, name, db_type, connection_config, credential_id = row

        if db_type != "POSTGRES":
            raise Exception(f"Unsupported DB type: {db_type}")

        # 2. PARSE CONFIG JSON
        config = connection_config

        if isinstance(config, str):
            config = json.loads(config)

        host = config.get("host")
        port = config.get("port")
        database = config.get("database")

        # 3. GET CREDENTIALS (DECRYPTED)
        cred_service = CredentialService(self.conn)

        creds = cred_service.get_decrypted_credentials(system_id)

        username = creds["username"]
        password = creds["password"]

        # 4. TEST CONNECTION
        try:
            conn = psycopg2.connect(
                host=host,
                port=port,
                database=database,
                user=username,
                password=password,
                connect_timeout=5
            )

            conn.close()

            return {
                "status": "success",
                "message": f"Connection successful to {name}"
            }

        except Exception as e:
            return {
                "status": "failed",
                "message": str(e)
            }