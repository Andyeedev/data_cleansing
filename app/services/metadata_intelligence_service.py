class MetadataIntelligenceService:

    def __init__(self, engine_db):
        self.engine_db = engine_db

    def infer_column_roles(self, mapping_id):

        query = """
        SELECT column_id, column_name, data_type
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND column_side = 'SOURCE'
        """

        columns = self.engine_db.execute(query, (mapping_id,))

        for col_id, name, dtype in columns:

            role = None

            if name.lower() in ["id", "account_id", "customer_id"]:
                role = "PRIMARY_KEY"

            elif dtype.lower() in ["numeric", "decimal", "double precision"]:
                role = "NUMERIC_METRIC"

            elif "date" in name.lower():
                role = "AUDIT_COLUMN"

            update = """
            UPDATE core.dataset_columns
            SET inferred_role = %s
            WHERE column_id = %s
            """

            self.engine_db.execute(update, (role, col_id))