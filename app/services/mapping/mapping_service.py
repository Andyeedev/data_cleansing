from typing import List, Optional
from datetime import datetime

from app.adapters.registry import AdapterRegistry
from app.adapters.models import TableInfo, ColumnInfo
from app.services.discovery.discovery_service import DiscoveryService
from app.services.mapping.mapping_repository import MappingRepository


class MappingService:
    """Manages source-to-target mappings at all levels."""

    def __init__(self, db):
        self.db = db
        self.discovery_service = DiscoveryService(db)
        self.mapping_repo = MappingRepository(db)

    async def auto_map(self, project_id: str) -> dict:
        """Automatically create mappings based on discovery results."""
        discovery = await self.discovery_service.discover(project_id)
        mappings = []

        for dataset in discovery.get("datasets", []):
            for match in dataset.get("matched_tables", []):
                dataset_mapping = await self.create_dataset_mapping(
                    project_id=project_id,
                    source_system=dataset["source_system"],
                    target_system=dataset["target_system"],
                    source_table=match["source"],
                    target_table=match["target"],
                )

                column_mappings = await self.auto_map_columns(
                    dataset_mapping["mapping_id"],
                    match["source"],
                    match["target"],
                )

                mappings.append({
                    "dataset_mapping": dataset_mapping,
                    "column_mappings": column_mappings,
                })

        return {
            "project_id": project_id,
            "mappings": mappings,
            "total_mappings": len(mappings),
        }

    async def create_dataset_mapping(
        self,
        project_id: str,
        source_system: dict,
        target_system: dict,
        source_table: TableInfo,
        target_table: TableInfo,
    ) -> dict:
        """Create a dataset-level mapping."""
        mapping = {
            "project_id": project_id,
            "source_system_id": source_system.get("system_id"),
            "target_system_id": target_system.get("system_id"),
            "source_table": source_table.table_name,
            "target_table": target_table.table_name,
            "source_schema": source_table.schema_name,
            "target_schema": target_table.schema_name,
            "confidence": 1.0,
            "match_type": "exact",
            "created_at": datetime.utcnow().isoformat(),
        }

        mapping_id = await self.mapping_repo.save_dataset_mapping(mapping)
        return {**mapping, "mapping_id": mapping_id}

    async def auto_map_columns(
        self,
        mapping_id: str,
        source_table: TableInfo,
        target_table: TableInfo,
    ) -> List[dict]:
        """Automatically map columns based on name and type similarity."""
        source_columns = await self._get_source_columns(mapping_id, source_table)
        target_columns = await self._get_target_columns(mapping_id, target_table)

        column_mappings = []

        for source_col in source_columns:
            exact_match = next(
                (t for t in target_columns if t.column_name.lower() == source_col.column_name.lower()),
                None,
            )
            if exact_match:
                column_mappings.append({
                    "mapping_id": mapping_id,
                    "source_column": source_col.column_name,
                    "target_column": exact_match.column_name,
                    "confidence": 1.0,
                    "match_type": "exact",
                    "source_data_type": source_col.data_type,
                    "target_data_type": exact_match.data_type,
                })
                continue

            fuzzy_match = self._fuzzy_match_column(source_col, target_columns)
            if fuzzy_match:
                transformation = self._suggest_transformation(
                    source_col, fuzzy_match
                )
                column_mappings.append({
                    "mapping_id": mapping_id,
                    "source_column": source_col.column_name,
                    "target_column": fuzzy_match.column_name,
                    "confidence": 0.7,
                    "match_type": "fuzzy",
                    "source_data_type": source_col.data_type,
                    "target_data_type": fuzzy_match.data_type,
                    "transformation": transformation,
                })

        return column_mappings

    async def _get_source_columns(
        self, mapping_id: str, source_table: TableInfo
    ) -> List[ColumnInfo]:
        """Get source columns for a mapping."""
        return []

    async def _get_target_columns(
        self, mapping_id: str, target_table: TableInfo
    ) -> List[ColumnInfo]:
        """Get target columns for a mapping."""
        return []

    def _fuzzy_match_column(
        self, source_col: ColumnInfo, target_columns: List[ColumnInfo]
    ) -> Optional[ColumnInfo]:
        """Fuzzy match source column to target columns."""
        source_name = source_col.column_name.lower()

        for target_col in target_columns:
            target_name = target_col.column_name.lower()

            if source_name == target_name:
                return target_col

            if source_name.startswith(target_name) or target_name.startswith(source_name):
                return target_col

            if source_name.replace("_", "") == target_name.replace("_", ""):
                return target_col

            if source_name.replace("_", "").startswith(target_name.replace("_", "")):
                return target_col

        return None

    def _suggest_transformation(
        self, source_col: ColumnInfo, target_col: ColumnInfo
    ) -> Optional[str]:
        """Suggest a transformation rule for column mapping."""
        source_type = source_col.data_type.lower()
        target_type = target_col.data_type.lower()

        if source_type == target_type:
            return None

        type_mappings = {
            "varchar": "text",
            "text": "varchar",
            "int": "bigint",
            "integer": "bigint",
            "bigint": "int",
            "float": "double",
            "double": "float",
            "boolean": "int",
            "date": "timestamp",
            "timestamp": "date",
        }

        return type_mappings.get(source_type, f"CAST({source_col.column_name} AS {target_type})")

    async def validate_mapping(self, mapping_id: str) -> dict:
        """Validate a mapping for correctness."""
        mapping = await self.mapping_repo.get_dataset_mapping(mapping_id)
        column_mappings = await self.mapping_repo.get_column_mappings(mapping_id)

        issues = []
        for col_map in column_mappings:
            if col_map.get("source_data_type") != col_map.get("target_data_type"):
                issues.append({
                    "type": "type_mismatch",
                    "source_column": col_map["source_column"],
                    "target_column": col_map["target_column"],
                    "source_type": col_map["source_data_type"],
                    "target_type": col_map["target_data_type"],
                })

        return {
            "mapping_id": mapping_id,
            "valid": len(issues) == 0,
            "issues": issues,
            "total_columns": len(column_mappings),
            "type_mismatches": len([i for i in issues if i["type"] == "type_mismatch"]),
        }