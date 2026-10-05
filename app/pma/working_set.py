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


def resolve_schema_scope(system=None, adapter_config=None, connection_config=None) -> str | None:
    """Phase 5B schema-filtering decision: resolve the schema scope for PMA discovery.

    First truthy candidate wins:
      1. connection_config["schema"] — explicit per-system schema declaration
         (e.g. Snowflake CERT_SCHEMA)
      2. system["schema_name"] — core.system_registry.schema_name when surfaced
         by the caller
      3. adapter_config.schema — adapter-class configured default
         (postgres "public", sqlserver "dbo")
      4. adapter_config.dataset — dataset-style schema attribute where a config
         exposes it
      5. None — no scope; adapter decides (pre-5B behaviour, unchanged)

    PMA-only: only the PMA working-set path consults this; MA discovery paths are untouched.
    """

    if connection_config is None and isinstance(system, dict):
        connection_config = system.get("connection_config")

    candidates = []
    if isinstance(connection_config, dict):
        candidates.append(connection_config.get("schema"))
    if isinstance(system, dict):
        candidates.append(system.get("schema_name"))
    candidates.append(getattr(adapter_config, "schema", None))
    candidates.append(getattr(adapter_config, "dataset", None))

    for candidate in candidates:
        if candidate:
            return str(candidate)
    return None


def build_working_set(adapter, system_id: str, schema_scope: str | None = None) -> PmaWorkingSet:
    """Build the working set from one adapter's list_tables/list_columns (no mapping writes).

    When schema_scope is truthy it is passed to list_tables and the returned tables are
    defensively filtered (case-insensitive) to that schema; otherwise discovery is
    unfiltered exactly as before Phase 5B.
    """

    working_set = PmaWorkingSet(system_id=system_id)
    if schema_scope:
        tables = adapter.list_tables(schema_scope) or []
    else:
        tables = adapter.list_tables() or []
    scope_folded = schema_scope.casefold() if schema_scope else None
    for table in tables:
        if not table.table_name:
            continue
        if scope_folded is not None and (table.schema_name or "").casefold() != scope_folded:
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
