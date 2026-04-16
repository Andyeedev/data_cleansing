import psycopg2
from app.db.connection_factory import connection_factory


class DBConnector:

    def __init__(self, db_config):

        # ---------------------------------------
        # NORMALIZE CONFIG
        # ---------------------------------------
        db_config = self._normalize_config(db_config)

        self.config = db_config

        # ---------------------------------------
        # ENGINE DB DETECTION (FIXED)
        # ---------------------------------------
        self.is_engine_db = db_config.get("role") == "engine"

        # ---------------------------------------
        # ADAPTER FLAG (FIXED)
        # ---------------------------------------
        self.use_adapter = (
            db_config.get("use_adapter", False)
            and not self.is_engine_db
        )

        # ---------------------------------------
        # INTERNAL STATE
        # ---------------------------------------
        self._adapter = None
        self.conn = None

        # ---------------------------------------
        # DEBUG (REMOVE LATER)
        # ---------------------------------------
        print(f"[DBConnector] INIT → type={db_config.get('type')} | use_adapter={self.use_adapter}")

        # ---------------------------------------
        # ADAPTER MODE (SOURCE / TARGET)
        # ---------------------------------------
        if self.use_adapter:
            self._adapter = connection_factory(db_config)
            self._adapter.connect()

        # ---------------------------------------
        # DIRECT MODE (ENGINE DB)
        # ---------------------------------------
        else:
            self.conn = psycopg2.connect(
                host=db_config.get("host"),
                port=db_config.get("port"),
                dbname=db_config.get("dbname"),
                user=db_config.get("user"),
                password=db_config.get("password"),
            )
            self.conn.autocommit = True

    # ---------------------------------------
    # ADAPTER ACCESS (SAFE)
    # ---------------------------------------
    @property
    def adapter(self):
        if not self.use_adapter or self._adapter is None:
            raise Exception("Adapter not enabled for this DB")
        return self._adapter
    

    # ---------------------------------------
    # EXECUTION (SAFE)
    # ---------------------------------------
    def execute(self, query, params=None):

        # ✅ IMPORTANT FIX: DO NOT CALL self.adapter blindly
        if self.use_adapter:
            return self._adapter.execute(query, params)

        cursor = self.conn.cursor()
        cursor.execute(query, params or ())

        try:
            result = cursor.fetchall()
        except:
            result = None

        cursor.close()
        return result

    # ---------------------------------------
    # CLOSE CONNECTION
    # ---------------------------------------
    def close(self):
        if self.conn:
            self.conn.close()

    # ---------------------------------------
    # NORMALIZATION (SAFE)
    # ---------------------------------------
    def _normalize_config(self, config):

        return {
            "type": config.get("type"),
            "role": config.get("role"),  # ✅ IMPORTANT
            "host": config.get("host"),
            "port": config.get("port"),
            "dbname": config.get("dbname") or config.get("database"),
            "user": config.get("user"),
            "password": config.get("password"),
            "use_adapter": config.get("use_adapter", False),
        }