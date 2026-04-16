from abc import ABC, abstractmethod
from app.db.sql.sql_compiler import SQLCompiler


class BaseAdapter(ABC):

    def __init__(self, config):
        self.config = config
        self.connection = None

        self.schema = config.get("schema", "public")

        self.capabilities = {
            "supports_constraints": False,
            "supports_information_schema": True,
            "requires_inference": True
        }

        # ✅ SQL Compiler (NEW - cross DB)
        self.sql = SQLCompiler(self)

        # ✅ Multi-schema support
        self.schemas = self._resolve_schemas()

    # -----------------------------
    # CONNECTION
    # -----------------------------
    @abstractmethod
    def connect(self):
        pass

    # -----------------------------
    # EXECUTION
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
    def get_columns(self, schema, table):
        pass

    @abstractmethod
    def get_column_type(self, schema, table, column):
        pass

    # -----------------------------
    # DATA METRICS
    # -----------------------------
    @abstractmethod
    def get_row_count(self, schema, table):
        pass

    @abstractmethod
    def count_nulls(self, schema, table, column):
        pass

    # -----------------------------
    # RELATIONSHIPS
    # -----------------------------
    def get_foreign_keys(self):
        return []

    # -----------------------------
    # SCHEMA HANDLING
    # -----------------------------
    def _resolve_schemas(self):
        if "schemas" in self.config:
            return self.config["schemas"]

        if "schema" in self.config:
            return [self.config["schema"]]

        return [self.get_default_schema()]

    def get_default_schema(self):
        raise NotImplementedError