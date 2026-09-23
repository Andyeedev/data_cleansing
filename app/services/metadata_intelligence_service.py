class MetadataIntelligenceService:

    def __init__(self, engine_db):
        self.engine_db = engine_db

    def infer_column_roles(self, mapping_id):

        query = """
        SELECT column_id, column_name, data_type, column_side
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND inferred_role IS NULL
        """

        columns = self.engine_db.execute(query, (mapping_id,))

        for col_id, name, dtype, side in columns:

            role = None
            name_lower = name.lower() if name else ""
            dtype_lower = dtype.lower() if dtype else ""

            if name_lower.endswith("_id") or name_lower in ["id"]:
                role = "PRIMARY_KEY"

            elif dtype_lower in ["numeric", "decimal", "double precision", "float", "real"]:
                role = "NUMERIC_METRIC"

            elif "date" in name_lower or "timestamp" in name_lower:
                role = "AUDIT_COLUMN"

            if role:
                update = """
                UPDATE core.dataset_columns
                SET inferred_role = %s
                WHERE column_id = %s
                """

                self.engine_db.execute(update, (role, col_id))

    def infer_foreign_keys(self, mapping_id):
        """Infer FOREIGN_KEY roles by matching column names to PRIMARY_KEY columns in other mappings of the same project."""
        
        # Get project_id for this mapping
        query = """
        SELECT project_id, source_table, target_table
        FROM core.dataset_mappings
        WHERE mapping_id = %s
        """
        row = self.engine_db.execute(query, (mapping_id,))
        if not row:
            return
        project_id, source_table, target_table = row[0]

        # Get all PRIMARY_KEY columns in the project (both source and target)
        pk_query = """
        SELECT dm.source_table, dm.target_table, dc.column_name, dc.column_side
        FROM core.dataset_columns dc
        JOIN core.dataset_mappings dm ON dc.mapping_id = dm.mapping_id
        WHERE dm.project_id = %s
        AND dc.inferred_role = 'PRIMARY_KEY'
        """
        pk_rows = self.engine_db.execute(pk_query, (project_id,))
        
        # Build set of (table, column) pairs that are PKs
        pk_columns = set()
        for src_tbl, tgt_tbl, col_name, side in pk_rows:
            if side == 'SOURCE':
                pk_columns.add((src_tbl, col_name))
            else:
                pk_columns.add((tgt_tbl, col_name))

        # Now check columns in this mapping that end with _id but are NOT PK
        # (FK columns are typically _id columns that reference PKs in other tables)
        fk_query = """
        SELECT column_id, column_name, column_side
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND column_name ILIKE '%_id'
        AND inferred_role != 'PRIMARY_KEY'
        """
        fk_candidates = self.engine_db.execute(fk_query, (mapping_id,))

        for row in fk_candidates:
            col_id = row[0]
            col_name = row[1]
            side = row[2]
            
            # Check if this column name matches a PK in another table
            for pk_table, pk_col in pk_columns:
                if col_name.lower() == pk_col.lower():
                    # This is likely a FK (references PK in another table)
                    update = """
                    UPDATE core.dataset_columns
                    SET inferred_role = 'FOREIGN_KEY'
                    WHERE column_id = %s
                    """
                    self.engine_db.execute(update, (col_id,))
                    break
