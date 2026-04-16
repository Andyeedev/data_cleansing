from abc import ABC, abstractmethod


class BaseAdapter(ABC):

    def __init__(self, config):
        self.config = config
        self.connection = None

        # ✅ DEFAULT CAPABILITIES (fallback)
        self.capabilities = {
            "supports_constraints": False,
            "supports_information_schema": True,
            "requires_inference": True
        }

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def execute(self, query, params=None):
        pass

    @abstractmethod
    def get_tables(self):
        pass

    @abstractmethod
    def get_columns(self):
        pass

    @abstractmethod
    def get_constraints(self):
        pass

    def filter_config(self, allowed_keys):
        return {
            k: v for k, v in self.config.items()
            if k in allowed_keys
        }

    @abstractmethod
    def get_row_count(self, schema, table):
        pass