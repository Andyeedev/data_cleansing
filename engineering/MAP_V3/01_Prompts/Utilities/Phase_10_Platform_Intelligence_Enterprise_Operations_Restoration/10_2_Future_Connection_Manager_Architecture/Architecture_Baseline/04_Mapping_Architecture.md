# 04 — Mapping Architecture

**Phase:** 10.2 — Mapping  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Mapping Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Mapping Architecture                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Mapping Levels                          │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Level 1: Project Mapping                                 │   │
│  │  - Source System ──▶ Target System                         │   │
│  │                                                             │   │
│  │  Level 2: Dataset Mapping                                  │   │
│  │  - Source Table ──▶ Target Table                           │   │
│  │                                                             │   │
│  │  Level 3: Column Mapping                                   │   │
│  │  - Source Column ──▶ Target Column                         │   │
│  │  - Transformation Rules                                    │   │
│  │  - Validation Rules                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Mapping Rules                           │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  - Name Transform: strip_prefix, strip_suffix, camel_case │   │
│  │  - Type Mapping: int→bigint, varchar→text, etc.           │   │
│  │  - Nullable Mapping: source NOT NULL → target NOT NULL    │   │
│  │  - Default Mapping: source DEFAULT → target DEFAULT       │   │
│  │  - Custom Transform: SQL expressions, UDFs                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mapping Service

```python
class MappingService:
    """Manages source-to-target mappings at all levels."""

    async def auto_map(self, project_id: str) -> MappingResult:
        """Automatically create mappings based on discovery results."""

        discovery = await self.discovery_service.get_results(project_id)
        mappings = []

        for dataset in discovery.datasets:
            for match in dataset.matched_tables:
                # Create dataset mapping
                dataset_mapping = await self.create_dataset_mapping(
                    project_id=project_id,
                    source_system=dataset.source_system,
                    target_system=dataset.target_system,
                    source_table=match.source,
                    target_table=match.target
                )

                # Auto-map columns
                column_mappings = await self.auto_map_columns(
                    dataset_mapping.mapping_id,
                    match.source,
                    match.target
                )

                mappings.append(DatasetMappingWithColumns(
                    dataset_mapping=dataset_mapping,
                    column_mappings=column_mappings
                ))

        return MappingResult(
            project_id=project_id,
            mappings=mappings,
            total_mappings=len(mappings)
        )

    async def auto_map_columns(self, mapping_id: str, source_table: TableInfo, target_table: TableInfo) -> List[ColumnMapping]:
        """Automatically map columns based on name and type similarity."""

        source_columns = await self.get_source_columns(mapping_id)
        target_columns = await self.get_target_columns(mapping_id)

        column_mappings = []

        for source_col in source_columns:
            # Exact name match
            exact_match = next((t for t in target_columns if t.column_name == source_col.column_name), None)
            if exact_match:
                column_mappings.append(ColumnMapping(
                    source_column=source_col.column_name,
                    target_column=exact_match.column_name,
                    confidence=1.0,
                    match_type="exact"
                ))
                continue

            # Fuzzy name match
            fuzzy_match = self._fuzzy_match_column(source_col, target_columns)
            if fuzzy_match:
                column_mappings.append(ColumnMapping(
                    source_column=source_col.column_name,
                    target_column=fuzzy_match.column_name,
                    confidence=0.7,
                    match_type="fuzzy",
                    transformation=self._suggest_transformation(source_col, fuzzy_match)
                ))

        return column_mappings
```

---

## Mapping API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/mappings/{project_id}` | GET | Get all mappings for project |
| `/api/v1/mappings/{project_id}/auto` | POST | Auto-generate mappings |
| `/api/v1/mappings/{mapping_id}` | GET | Get dataset mapping detail |
| `/api/v1/mappings/{mapping_id}` | PUT | Update dataset mapping |
| `/api/v1/mappings/{mapping_id}/columns` | GET | Get column mappings |
| `/api/v1/mappings/{mapping_id}/columns` | POST | Create column mapping |
| `/api/v1/mappings/{mapping_id}/columns/{id}` | PUT | Update column mapping |
| `/api/v1/mappings/{mapping_id}/columns/{id}` | DELETE | Delete column mapping |
| `/api/v1/mappings/{mapping_id}/validate` | POST | Validate mapping |
