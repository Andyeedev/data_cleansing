# 03 — Discovery Architecture

**Phase:** 10.2 — Discovery  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Discovery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Discovery Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Source System                    Target System                   │
│  ┌──────────┐                    ┌──────────┐                   │
│  │ Adapter   │                    │ Adapter   │                   │
│  │ .list_    │                    │ .list_    │                   │
│  │ tables()  │                    │ tables()  │                   │
│  └────┬─────┘                    └────┬─────┘                   │
│       │                               │                          │
│       ▼                               ▼                          │
│  ┌──────────┐                    ┌──────────┐                   │
│  │ Source    │                    │ Target    │                   │
│  │ Schema    │                    │ Schema    │                   │
│  │ Metadata  │                    │ Metadata  │                   │
│  └────┬─────┘                    └────┬─────┘                   │
│       │                               │                          │
│       └───────────┬───────────────────┘                          │
│                   │                                              │
│                   ▼                                              │
│            ┌──────────┐                                         │
│            │  Schema   │                                         │
│            │  Matcher  │                                         │
│            └────┬─────┘                                         │
│                 │                                                │
│                 ▼                                                │
│            ┌──────────┐                                         │
│            │  Matched  │                                         │
│            │  Pairs    │                                         │
│            └──────────┘                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Discovery Service

```python
class DiscoveryService:
    """Discovers schema metadata from source and target systems."""

    def __init__(self):
        self.connection_manager = ConnectionManager()

    async def discover(self, project_id: str) -> DiscoveryResult:
        """Discover schema for all systems in a project."""

        systems = await self.get_project_systems(project_id)
        source_systems = [s for s in systems if s.system_role == "SOURCE"]
        target_systems = [s for s in systems if s.system_role == "TARGET"]

        discovered_datasets = []

        for source in source_systems:
            for target in target_systems:
                # Discover source schema
                source_schema = await self._discover_schema(source)

                # Discover target schema
                target_schema = await self._discover_schema(target)

                # Match tables
                matched_tables = self._match_tables(source_schema, target_schema)

                discovered_datasets.append(DiscoveredDataset(
                    source_system=source,
                    target_system=target,
                    source_tables=source_schema.tables,
                    target_tables=target_schema.tables,
                    matched_tables=matched_tables
                ))

        return DiscoveryResult(
            project_id=project_id,
            datasets=discovered_datasets,
            timestamp=datetime.utcnow()
        )

    async def _discover_schema(self, system) -> SchemaMetadata:
        """Discover schema for a single system."""
        adapter = self.connection_manager.get_adapter(system)

        tables = adapter.list_tables()
        columns = {}
        for table in tables:
            columns[f"{table.schema_name}.{table.table_name}"] = adapter.list_columns(
                table.schema_name, table.table_name
            )

        return SchemaMetadata(
            system=system,
            tables=tables,
            columns=columns
        )

    def _match_tables(self, source: SchemaMetadata, target: SchemaMetadata) -> List[TableMatch]:
        """Match source tables to target tables using naming conventions."""
        matches = []

        for source_table in source.tables:
            # Exact match
            for target_table in target.tables:
                if self._tables_match(source_table, target_table):
                    matches.append(TableMatch(
                        source=source_table,
                        target=target_table,
                        confidence=1.0,
                        match_type="exact"
                    ))

            # Fuzzy match (strip prefixes/suffixes)
            if not any(m.source == source_table for m in matches):
                best_match = self._fuzzy_match(source_table, target.tables)
                if best_match:
                    matches.append(TableMatch(
                        source=source_table,
                        target=best_match,
                        confidence=0.8,
                        match_type="fuzzy"
                    ))

        return matches
```

---

## Discovery API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/discovery/{project_id}` | GET | Get discovery results |
| `/api/v1/discovery/{project_id}/start` | POST | Start discovery |
| `/api/v1/discovery/{project_id}/status` | GET | Get discovery status |
| `/api/v1/discovery/{project_id}/tables` | GET | Get discovered tables |
| `/api/v1/discovery/{project_id}/columns/{table}` | GET | Get discovered columns |
| `/api/v1/discovery/{project_id}/matches` | GET | Get table matches |
