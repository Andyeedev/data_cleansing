import psycopg2
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)
class PostgresAdapter(BaseAdapter):
    
    def __init__(self, config):
        self.config = config
        self.connection = None
        self.connect()

    def connect_legacy(self):
        print("🔌 Connecting to Postgres...")
        print(f"HOST: {self.config.get('host')}")
        print(f"DB: {self.config.get('database')}")
        print(f"USER: {self.config.get('user')}")
        print(f"PASSWORD: {self.config.get('password')}")
        #from app.services.credential_service import CredentialService
        #print(f"CONNECTED PASSWORD: {CredentialService().decrypt_password(self.config.get('password'))}")

        pwd = self.config.get("password")
        print("PASSWORD RAW:", pwd)

        # TEMP isolate decrypt
        try:
            from app.services.credential_service import CredentialService
            decrypted = CredentialService().decrypt_password(pwd)
            print("DECRYPTED PASSWORD:", decrypted)
        except Exception as e:
            print("DECRYPT ERROR:", e)


        self.connection = psycopg2.connect(
            host=self.config.get("host"),
            port=self.config.get("port"),
            database=self.config.get("database"),
            user=self.config.get("user"),
            password=self.config.get("password")
        )

    def connect(self):
        try:
            self.connection = psycopg2.connect(
                host=self.config.get("host"),
                port=self.config.get("port"),
                database=self.config.get("database"),
                user=self.config.get("user"),
                password=self.config.get("password")
            )
        except Exception as e:
            raise RuntimeError(
                f"❌ Failed to connect to Postgres "
                f"{self.config.get('host')}:{self.config.get('port')} "
                f"DB={self.config.get('database')} USER={self.config.get('user')}"
            ) from e

    def get_tables(self):
        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        """

        with self.connection.cursor() as cursor:
            cursor.execute(query)
            return [row[0] for row in cursor.fetchall()]

    def execute_current_1(self, query, params=None):
        """
        Compatible with legacy DBConnector.execute
        """
        with self.connection.cursor() as cursor:
            cursor.execute(query, params)
            try:
                return cursor.fetchall()
            except Exception:
                return None

    def execute(self, query, params=None):
        """
        Compatible with v2.0 DBConnector interface
        """
        with self.connection.cursor() as cursor:
            cursor.execute(query, params or ())

            # SELECT queries
            if cursor.description:
                return cursor.fetchall()

            # INSERT/UPDATE/DELETE
            self.connection.commit()
            return None
        
    def execute_query(self, query):
        with self.connection.cursor() as cursor:
            cursor.execute(query)
            return cursor.fetchall()

    def execute_scalar(self, query):
        with self.connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()
            return result[0] if result else None