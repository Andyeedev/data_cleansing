import pyodbc
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class SQLServerAdapter(BaseAdapter):

    def __init__(self, config):
        super().__init__(config)
        self.connect()

    
    def connect_current(self):
        logger.info("Connecting to SQL Server...")

        conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={self.config.get('host')},{self.config.get('port', 1433)};"
            f"DATABASE={self.config.get('database')};"
            f"UID={self.config.get('user')};"
            f"PWD={self.config.get('password')}"
        )

        self.connection = pyodbc.connect(conn_str)

    def _connect_legacy(self):
        conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={self.config.get('host')},{self.config.get('port')};"
            f"DATABASE={self.config.get('database')};"
            f"UID={self.config.get('user')};"
            f"PWD={self.config.get('password')}"
        )

        self.connection = pyodbc.connect(conn_str)


    def _connect(self):
        import pyodbc

        driver = self.config.get("options", {}).get(
            "driver",
            "ODBC Driver 17 for SQL Server"
        )

        host = self.config["host"]
        port = self.config.get("port")

        instance = self.config.get("options", {}).get("instance")

        # =========================
        # BUILD SERVER CORRECTLY
        # =========================

        if "\\" in host:
            # already full instance format (DEVWORK2\SQLEXPRESS)
            server = host

        elif instance:
            server = f"{host}\\{instance}"

        elif port:
            server = f"{host},{port}"

        else:
            server = host

        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={self.config['database']};"
            f"UID={self.config['user']};"
            f"PWD={self.config['password']};"
            "TrustServerCertificate=yes;"
        )

        print("🔌 SQL SERVER CONNECTION STRING:")
        print(conn_str)

        self.connection = pyodbc.connect(conn_str)


    def execute(self, query, params=None):
        cur = self.connection.cursor()
        cur.execute(query, params or [])
        try:
            return cur.fetchall()
        except:
            return []
        
    def _validation_query(self):
        return "SELECT 1"
    

    def list_tables(self):

        query = """
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        """

        with self.conn.cursor() as cur:
            cur.execute(query)
            return [r[0] for r in cur.fetchall()]   