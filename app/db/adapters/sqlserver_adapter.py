# app/db/adapters/sqlserver_adapter.py

import pyodbc
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class SQLServerAdapter(BaseAdapter):

    def __init__(self, config):
        super().__init__(config)

    # ✅ THIS MUST OVERRIDE BASE
    def _connect(self):
        driver = self.config.get("options", {}).get(
            "driver",
            "ODBC Driver 17 for SQL Server"
        )

        host = self.config["host"]
        port = self.config.get("port")
        instance = self.config.get("options", {}).get("instance")

        # Build server string
        if "\\" in host:
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

        logger.info(f"🔌 SQLServer connecting to {server}")

        self.connection = pyodbc.connect(conn_str)

    def list_tables(self):
        query = """
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        """
        return [r[0] for r in self.execute(query)]