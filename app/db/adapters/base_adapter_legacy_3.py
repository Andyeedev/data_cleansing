from abc import ABC, abstractmethod


class BaseAdapter(ABC):

    def __init__(self, config):
        self.config = config
        self.connection = None

        self.capabilities = {
            "supports_constraints": False,
            "supports_information_schema": True,
            "requires_inference": True
        }

    # -----------------------------
    # CONNECTION
    # -----------------------------
    @abstractmethod
    def connect(self):
        pass

    # -----------------------------
    # CORE EXECUTION (fallback)
    # -----------------------------
    @abstractmethod
    def execute(self, query, params=None):
        pass

    # -----------------------------
    # DATA METRICS
    # -----------------------------
    @abstractmethod
    def get_row_count(self, schema, table):
        pass

    @abstractmethod
    def get_sum(self, schema, table, column):
        pass

    @abstractmethod
    def get_stats(self, schema, table, column):
        pass

    # -----------------------------
    # METADATA
    # -----------------------------
    @abstractmethod
    def get_columns(self, schema, table):
        pass

    @abstractmethod
    def get_column_count(self, schema, table):
        pass

    @abstractmethod
    def get_column_type(self, schema, table, column):
        pass

    # -----------------------------
    # DATA QUALITY
    # -----------------------------
    @abstractmethod
    def count_nulls(self, schema, table, column):
        pass

    @abstractmethod
    def count_duplicates(self, schema, table, column):
        pass

    # -----------------------------
    # RELATIONSHIPS
    # -----------------------------
    @abstractmethod
    def count_missing_fk(self, schema, child_table, parent_table, column):
        pass