from typing import List, Optional


class MappingRepository:
    """Repository for mapping operations."""

    def __init__(self, db):
        self.db = db

    async def save_dataset_mapping(self, mapping: dict) -> str:
        """Save a dataset mapping."""
        query = """
            INSERT INTO core.dataset_mappings
            (project_id, source_system_id, target_system_id,
             source_table, target_table, source_schema, target_schema,
             confidence, match_type, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING mapping_id
        """
        result = self.db.execute(query, (
            mapping["project_id"],
            mapping["source_system_id"],
            mapping["target_system_id"],
            mapping["source_table"],
            mapping["target_table"],
            mapping["source_schema"],
            mapping["target_schema"],
            mapping["confidence"],
            mapping["match_type"],
        ))
        return result[0]["mapping_id"]

    async def get_dataset_mapping(self, mapping_id: str) -> Optional[dict]:
        """Get a dataset mapping by ID."""
        query = """
            SELECT * FROM core.dataset_mappings
            WHERE mapping_id = %s
        """
        result = self.db.execute(query, (mapping_id,))
        return result[0] if result else None

    async def get_column_mappings(
        self, mapping_id: str
    ) -> List[dict]:
        """Get column mappings for a dataset mapping."""
        query = """
            SELECT * FROM core.column_mappings
            WHERE mapping_id = %s
            ORDER BY ordinal_position
        """
        return self.db.execute(query, (mapping_id,))

    async def save_column_mapping(self, column_mapping: dict) -> str:
        """Save a column mapping."""
        query = """
            INSERT INTO core.column_mappings
            (mapping_id, source_column, target_column,
             source_data_type, target_data_type,
             confidence, match_type, transformation,
             ordinal_position, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING column_mapping_id
        """
        result = self.db.execute(query, (
            column_mapping["mapping_id"],
            column_mapping["source_column"],
            column_mapping["target_column"],
            column_mapping.get("source_data_type"),
            column_mapping.get("target_data_type"),
            column_mapping["confidence"],
            column_mapping["match_type"],
            column_mapping.get("transformation"),
            column_mapping.get("ordinal_position", 0),
        ))
        return result[0]["column_mapping_id"]

    async def update_column_mapping(
        self, column_mapping_id: str, updates: dict
    ) -> bool:
        """Update a column mapping."""
        set_clause = ", ".join(
            f"{k} = %s" for k in updates.keys()
        )
        values = list(updates.values()) + [column_mapping_id]
        query = f"""
            UPDATE core.column_mappings
            SET {set_clause}
            WHERE column_mapping_id = %s
        """
        self.db.execute(query, values)
        return True

    async def delete_column_mapping(
        self, column_mapping_id: str
    ) -> bool:
        """Delete a column mapping."""
        query = """
            DELETE FROM core.column_mappings
            WHERE column_mapping_id = %s
        """
        self.db.execute(query, (column_mapping_id,))
        return True