import pandas as pd

class AuditExporter:

    def __init__(self, engine_db):
        self.engine_db = engine_db

    def export_csv(self, batch_id, output_path):
        query = """
        SELECT *
        FROM migration_exception_register
        WHERE batch_id = %s
        """
        df = self.engine_db.fetch_dataframe(query, (batch_id,))
        df.to_csv(output_path, index=False)
