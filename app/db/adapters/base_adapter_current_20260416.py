from abc import ABC, abstractmethod


class BaseAdapter(ABC):

    def __init__(self, config):
        self.config = config
        self.connection = None

        self.schema = config.get("schema", "public")  # ✅ DEFAULT SCHEMA

        self.capabilities = {
            "supports_constraints": False,
            "supports_information_schema": True,
            "requires_inference": True
        }

    # ✅ CENTRALIZED SCHEMA RESOLUTION
        self.schemas = self._resolve_schemas()


    # -----------------------------
    # CONNECTION
    # -----------------------------
    @abstractmethod
    def connect(self):
        pass

    # -----------------------------
    # CORE EXECUTION
    # -----------------------------
    @abstractmethod
    def execute(self, query, params=None):
        pass

    # -----------------------------
    # METADATA
    # -----------------------------
    @abstractmethod
    def get_tables(self):
        pass

    @abstractmethod
    def get_columns(self,  table):
        pass

    @abstractmethod
    def get_column_count(self,  table):
        pass

    @abstractmethod
    def get_column_type(self,  table, column):
        
        pass

    # -----------------------------
    # DATA METRICS
    # -----------------------------
    @abstractmethod
    def get_row_count(self,  table):
        pass

    @abstractmethod
    def get_sum(self,  table, column):
        pass

    @abstractmethod
    def get_stats(self,  table, column):
        pass

    # -----------------------------
    # DATA QUALITY
    # -----------------------------
    @abstractmethod
    def count_nulls(self,  table, column):
        pass

    @abstractmethod
    def count_duplicates(self,  table, column):
        pass

    # -----------------------------
    # RELATIONSHIPS
    # -----------------------------
    @abstractmethod
    def count_missing_fk(self,  child_table, parent_table, column):
        pass

    # -----------------------------

    # -----------------------------
    # SCHEMA HANDLING (NEW)
    # -----------------------------
    def _resolve_schemas(self):
        # CASE 1 — multiple schemas
        if "schemas" in self.config:
            return self.config["schemas"]

        # CASE 2 — single schema
        if "schema" in self.config:
            return [self.config["schema"]]

        # CASE 3 — fallback to adapter default
        return [self.get_default_schema()]

    def get_default_schema(self):
        raise NotImplementedError("Each adapter must define its default schema")