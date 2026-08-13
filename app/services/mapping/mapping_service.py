from typing import List, Optional

from app.adapters.models import ColumnInfo
from app.services.mapping.mapping_repository import MappingRepository


class MappingService:
    """Manages source-to-target mappings at all levels."""

    def __init__(self, db):
        self.db = db
        self.mapping_repo = MappingRepository(db)

    async def auto_map(self, project_id: str = None, tenant_id: str = None) -> dict:
        """Automatically create column_mappings from existing dataset_mappings and dataset_columns."""
        query = """
            SELECT dm.mapping_id, dm.source_table, dm.target_table
            FROM core.dataset_mappings dm
        """
        params = []

        if project_id:
            query += " WHERE dm.project_id = %s AND dm.is_active = true"
            params.append(project_id)
        elif tenant_id:
            query += """
                JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
                WHERE sr.tenant_id = %s AND dm.is_active = true
            """
            params.append(tenant_id)
        else:
            query += " WHERE dm.is_active = true"

        with self.db.conn.cursor() as cur:
            cur.execute(query, tuple(params))
            dataset_mappings = cur.fetchall()

        total_created = 0
        results = []

        for mapping_id, source_table, target_table in dataset_mappings:
            column_mappings = await self.auto_map_columns(mapping_id)

            for cm in column_mappings:
                source_col_id = self._get_column_id(mapping_id, cm["source_column"], "SOURCE")
                target_col_id = self._get_column_id(mapping_id, cm["target_column"], "TARGET")

                if source_col_id and target_col_id:
                    self.mapping_repo.save_column_mapping({
                        "mapping_id": mapping_id,
                        "source_column_id": source_col_id,
                        "target_column_id": target_col_id,
                        "confidence_score": cm.get("confidence", 1.0),
                        "match_status": "AUTO_MATCHED",
                        "match_reason": f"Name match: {cm['source_column']} -> {cm['target_column']} ({cm.get('match_type', 'exact')})",
                    })
                    total_created += 1

            results.append({
                "mapping_id": str(mapping_id),
                "source_table": source_table,
                "target_table": target_table,
                "columns_mapped": len(column_mappings),
            })

        return {
            "total_mappings": len(dataset_mappings),
            "total_columns_mapped": total_created,
            "details": results,
        }

    def _get_column_id(self, mapping_id: str, column_name: str, side: str) -> Optional[str]:
        """Get column_id from dataset_columns."""
        query = """
            SELECT column_id FROM core.dataset_columns
            WHERE mapping_id = %s AND column_name = %s AND column_side = %s
        """
        with self.db.conn.cursor() as cur:
            cur.execute(query, (mapping_id, column_name, side))
            row = cur.fetchone()
        return str(row[0]) if row else None

    async def auto_map_columns(
        self,
        mapping_id: str,
    ) -> List[dict]:
        """Automatically map columns based on name and type similarity."""
        source_columns = await self._get_source_columns(mapping_id)
        target_columns = await self._get_target_columns(mapping_id)

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
        self, mapping_id: str
    ) -> List[ColumnInfo]:
        """Get source columns for a mapping from dataset_columns."""
        query = """
            SELECT column_name, data_type, is_nullable, is_primary_key
            FROM core.dataset_columns
            WHERE mapping_id = %s AND column_side = 'SOURCE'
            ORDER BY column_position
        """
        with self.db.conn.cursor() as cur:
            cur.execute(query, (mapping_id,))
            rows = cur.fetchall()
        return [
            ColumnInfo(
                column_name=r[0],
                data_type=r[1] or "text",
                is_nullable=r[2] if r[2] is not None else True,
                is_primary_key=r[3] or False,
            )
            for r in rows
        ]

    async def _get_target_columns(
        self, mapping_id: str
    ) -> List[ColumnInfo]:
        """Get target columns for a mapping from dataset_columns."""
        query = """
            SELECT column_name, data_type, is_nullable, is_primary_key
            FROM core.dataset_columns
            WHERE mapping_id = %s AND column_side = 'TARGET'
            ORDER BY column_position
        """
        with self.db.conn.cursor() as cur:
            cur.execute(query, (mapping_id,))
            rows = cur.fetchall()
        return [
            ColumnInfo(
                column_name=r[0],
                data_type=r[1] or "text",
                is_nullable=r[2] if r[2] is not None else True,
                is_primary_key=r[3] or False,
            )
            for r in rows
        ]

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