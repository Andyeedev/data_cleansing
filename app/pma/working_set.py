from dataclasses import dataclass, field

NUMERIC_DATA_TYPES = frozenset({
    "smallint", "integer", "bigint", "decimal", "numeric", "real", "double precision",
    "money", "smallserial", "serial", "bigserial", "int", "int2", "int4", "int8",
    "float", "float4", "float8", "number", "double", "binary_float", "binary_double",
})


@dataclass
class PmaColumn:
    """Single column of one assessed table, in adapter-reported order."""

    column_name: str
    data_type: str
    is_nullable: bool
    column_position: int
    is_primary_key: bool = False
    is_numeric: bool = False


@dataclass
class PmaTable:
    """Single assessed table; entity_name is the shared schema.table identity."""

    schema_name: str
    table_name: str
    table_type: str
    entity_name: str
    columns: list[PmaColumn] = field(default_factory=list)


@dataclass
class PmaWorkingSet:
    """In-memory discovery working set for one PMA assessment (B1)."""

    system_id: str
    tables: list[PmaTable] = field(default_factory=list)

    @property
    def table_count(self) -> int:
        return len(self.tables)

    @property
    def column_count(self) -> int:
        return sum(len(t.columns) for t in self.tables)


def build_working_set(adapter, system_id: str) -> PmaWorkingSet:
    """Build the working set from one adapter's list_tables/list_columns (no mapping writes)."""

    working_set = PmaWorkingSet(system_id=system_id)
    tables = adapter.list_tables() or []
    for table in tables:
        if not table.table_name:
            continue
        raw_columns = adapter.list_columns(table.schema_name, table.table_name) or []
        columns = []
        for position, column in enumerate(raw_columns, start=1):
            data_type = (column.data_type or "").lower()
            columns.append(PmaColumn(
                column_name=column.column_name,
                data_type=column.data_type,
                is_nullable=bool(column.is_nullable),
                column_position=position,
                is_primary_key=bool(getattr(column, "is_primary_key", False)),
                is_numeric=data_type in NUMERIC_DATA_TYPES,
            ))
        working_set.tables.append(PmaTable(
            schema_name=table.schema_name,
            table_name=table.table_name,
            table_type=table.table_type,
            entity_name=f"{table.schema_name}.{table.table_name}",
            columns=columns,
        ))
    return working_set
