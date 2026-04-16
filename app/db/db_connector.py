import psycopg2
from app.db.connection_factory import connection_factory


class DBConnector:

    def __init___legacy(self, db_config):

        self.config = db_config
        self.is_engine_db = db_config.get("role") == "engine"

        self.use_adapter = (
            db_config.get("use_adapter", False)
            and not self.is_engine_db
        )

        if self.use_adapter:
            self.adapter = connection_factory(db_config)
            self.adapter.connect()
        else:
            self.conn = psycopg2.connect(
                host=db_config["host"],
                port=db_config["port"],
                database=db_config["database"],
                user=db_config["user"],
                password=db_config["password"]
            )
            self.conn.autocommit = True


    def __init___legacy_4(self, db_config):

        self.config = db_config
        self.is_engine_db = db_config.get("role") == "engine"

        self.use_adapter = (
            db_config.get("use_adapter", False)
            and not self.is_engine_db
        )

        if self.use_adapter:
            self.adapter = connection_factory(db_config)
            self.adapter.connect()
        else:
            self.config = {
                "host": db_config.get("host"),
                "port": db_config.get("port"),
                "dbname": db_config.get("dbname") or db_config.get("database"),
                "user": db_config.get("user"),
                "password": db_config.get("password"),
            }
            self.conn.autocommit = True

    def __init___legacy_5(self, db_config):

        import psycopg2

        # --------------------------------------------------
        # NORMALIZE CONFIG (ENTERPRISE SAFE)
        # --------------------------------------------------
        db_config = self._normalize_config(db_config)

        self.config = db_config
        self.is_engine_db = db_config.get("type") == "engine"

        self.use_adapter = (
            db_config.get("use_adapter", False)
            and not self.is_engine_db
        )

        # --------------------------------------------------
        # ADAPTER MODE (SOURCE / TARGET)
        # --------------------------------------------------
        if self.use_adapter:
            self.adapter = connection_factory(db_config)
            self.adapter.connect()
            self.conn = None
            

        # --------------------------------------------------
        # DIRECT MODE (ENGINE DB)
        # --------------------------------------------------
        else:
            self.conn = psycopg2.connect(
                host=db_config.get("host"),
                port=db_config.get("port"),
                dbname=db_config.get("dbname"),
                user=db_config.get("user"),
                password=db_config.get("password"),
            )
            self.conn.autocommit = True
            self.adapter = None

    


    def __init___legacy_6(self, db_config):

        db_config = self._normalize_config(db_config)

        self.adapter = None
        self.conn = None

        if db_config.get("use_adapter", False):
            self.adapter = connection_factory(db_config)
            self.adapter.connect()

        else:
            import psycopg2

            self.conn = psycopg2.connect(
                host=db_config.get("host"),
                port=db_config.get("port"),
                dbname=db_config.get("dbname"),
                user=db_config.get("user"),
                password=db_config.get("password"),
            )
            self.conn.autocommit = True

    def __init__(self, db_config):

        import psycopg2

        db_config = self._normalize_config(db_config)

        self.config = db_config
        self.is_engine_db = db_config.get("type") == "engine"

        
        self.use_adapter = (
            db_config.get("use_adapter", False)
            and not self.is_engine_db
        )

        # ✅ IMPORTANT: use _adapter (private)
        self._adapter = None
        self.conn = None

        # -------------------------------
        # ADAPTER MODE
        # -------------------------------
        if self.use_adapter:
            self._adapter = connection_factory(db_config)
            self._adapter.connect()

        # -------------------------------
        # DIRECT MODE
        # -------------------------------
        else:
            self.conn = psycopg2.connect(
                host=db_config.get("host"),
                port=db_config.get("port"),
                dbname=db_config.get("dbname"),
                user=db_config.get("user"),
                password=db_config.get("password"),
            )
            self.conn.autocommit = True
    
    @property
    def adapter(self):
        if not self.use_adapter or self._adapter is None:
            raise Exception("Adapter not enabled for this DB")
        return self._adapter

    def execute_legacy(self, query, params=None):

        if self.use_adapter:
            return self.adapter.execute(query, params)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            try:
                return cur.fetchall()
            except:
                return None


    def execute_legacy_1(self, query, params=None):

        # -------------------------------
        # ADAPTER MODE
        # -------------------------------
        if self.use_adapter:
            return self.adapter.execute(query, params)

        # -------------------------------
        # DIRECT MODE
        # -------------------------------
        cursor = self.conn.cursor()

        cursor.execute(query, params or ())

        try:
            result = cursor.fetchall()
        except:
            result = None

        cursor.close()
        return result

    
    def execute(self, query, params=None):

        # ✅ SAFE: check flag, NOT property
        if self.use_adapter:
            return self._adapter.execute(query, params)

        # ✅ DIRECT MODE (engine DB)
        cursor = self.conn.cursor()
        cursor.execute(query, params or ())

        try:
            result = cursor.fetchall()
        except:
            result = None

        cursor.close()
        return result


    def close(self):
        if not self.use_adapter:
            self.conn.close()

    def _normalize_config(self, config):

        return {
            "type": config.get("type"),
            "host": config.get("host"),
            "port": config.get("port"),
            "dbname": config.get("dbname") or config.get("database"),
            "user": config.get("user"),
            "password": config.get("password"),
            "use_adapter": config.get("use_adapter", False),
        }