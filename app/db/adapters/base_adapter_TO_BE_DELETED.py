from abc import ABC, abstractmethod


class BaseAdapter(ABC):

    @abstractmethod
    def get_tables(self, schema: str):
        pass

    @abstractmethod
    def get_columns(self, schema: str, table: str):
        pass

    @abstractmethod
    def get_row_count(self, schema: str, table: str):
        pass

    @abstractmethod
    def get_column_count(self, schema: str, table: str):
        pass

    @abstractmethod
    def get_primary_keys(self, schema: str, table: str):
        pass

    @abstractmethod
    def get_foreign_keys(self, schema: str, table: str):
        pass