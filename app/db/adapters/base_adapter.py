# app/db/adapters/base_adapter.py

import time
import logging

logger = logging.getLogger(__name__)


class BaseAdapter:
    def __init__(self, config):
        self.config = config
        self.connection = None

    # =========================
    # 🔌 CONNECT WITH RETRIES
    # =========================
    def connect(self):
        retries = self.config.get("retries", 3)
        delay = self.config.get("retry_delay", 2)

        for attempt in range(1, retries + 1):
            try:
                logger.info(f"🔌 Attempt {attempt} connecting to {self.config.get('type')}")

                self._connect()  # must be implemented in child
                self.validate_connection()

                logger.info("✅ Connection successful")
                return self

            except Exception as e:
                logger.warning(f"⚠️ Connection attempt {attempt} failed: {str(e)}")

                if attempt == retries:
                    logger.error("❌ All connection attempts failed")
                    raise

                time.sleep(delay)

    # =========================
    # 🔒 MUST BE IMPLEMENTED
    # =========================
    def _connect(self):
        raise NotImplementedError("Subclasses must implement _connect()")

    # =========================
    # 🧪 VALIDATION
    # =========================
    def validate_connection(self):
        cursor = self.connection.cursor()
        cursor.execute(self._validation_query())
        cursor.fetchone()
        cursor.close()

    def _validation_query(self):
        return "SELECT 1"

    # =========================
    # 🔄 EXECUTE
    # =========================
    def execute(self, query, params=None):
        cursor = self.connection.cursor()
        cursor.execute(query, params or ())
        try:
            return cursor.fetchall()
        except Exception:
            return []
        finally:
            cursor.close()

    # =========================
    def close(self):
        if self.connection:
            self.connection.close()
            logger.info("🔌 Connection closed")

    def list_tables(self):
        raise NotImplementedError

    def fetch_all(self, query, params=None):
        return self.execute(query, params)
