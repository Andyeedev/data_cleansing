# app/db/adapters/base_adapter.py

import logging

logger = logging.getLogger(__name__)


class BaseAdapter:
    def __init__(self, config: dict):
        self.config = config
        self.connection = None

    def connect(self):
        raise NotImplementedError

    def execute(self, query: str, params=None):
        raise NotImplementedError

    def close(self):
        if self.connection:
            try:
                self.connection.close()
                logger.info("Connection closed")
            except Exception as e:
                logger.warning(f"Error closing connection: {e}")