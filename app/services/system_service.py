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
    def create_system(self, payload):

        system_id = str(uuid.uuid4())

        config_json = json.dumps(payload.connection_config.dict())

        self.repo.insert(
            system_id=system_id,
            project_id=payload.project_id,
            system_name=payload.system_name,
            system_role=payload.system_role,
            database_type=payload.database_type,
            connection_config=config_json
        )

        return {
            "message": "System created",
            "system_id": system_id
        }

    # =========================
    # LIST
    # =========================
    def list_systems(self):

        rows = self.repo.get_all()

        return [
            {
                "system_id": r[0],
                "system_name": r[1],
                "system_role": r[2],
                "database_type": r[3],
                "credential_id": r[4]
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

        config = row[4]
        if isinstance(config, str):
            config = json.loads(config)

        return {
            "system_id": row[0],
            "system_name": row[1],
            "system_role": row[2],
            "database_type": row[3],
            "connection_config": config,
            "credential_id": row[5]
        }

    # =========================
    # TEST CONNECTION
    # =========================
    def test_connection(self, system_id):

        row = self.repo.get_by_id(system_id)

        if not row:
            raise Exception("System not found")

        _, name, _, db_type, config, _ = row

        if isinstance(config, str):
            config = json.loads(config)

        host = config.get("host")
        port = config.get("port")
        database = config.get("database")

        cred_service = CredentialService(self.conn)
        creds = cred_service.get_decrypted_credentials(system_id)

        try:
            conn = psycopg2.connect(
                host=host,
                port=port,
                database=database,
                user=creds["username"],
                password=creds["password"],
                connect_timeout=5
            )
            conn.close()

            return {"status": "success", "message": f"{name} connected"}

        except Exception as e:
            return {"status": "failed", "message": str(e)}

    def list_tables(self, system_id):

        row = self.repo.get_by_id(system_id)

        if not row:
            raise Exception("System not found")

        _, name, db_type, connection_config, credential_id = row

        import json
        config = json.loads(connection_config)

        from app.services.credential_service import CredentialService
        creds = CredentialService(self.conn).get_decrypted_credentials(system_id)

        conn = psycopg2.connect(
            host=config["host"],
            port=config["port"],
            database=config["database"],
            user=creds["username"],
            password=creds["password"]
        )
        from app.adapters.registry import AdapterRegistry
        adapter_class = AdapterRegistry.get(db_type)
        adapter = adapter_class()
        adapter.connect(config)

        tables = adapter.list_tables()

        conn.close()

        return {
            "system": name,
            "tables": tables
        }
