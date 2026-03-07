import csv

class AuditPackService:

    def generate(self, engine_db, batch_id):

        query = """
        SELECT *
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        """

        rows = engine_db.execute(query,(batch_id,))

        with open(f"audit_pack_{batch_id}.csv","w",newline="") as f:

            writer = csv.writer(f)

            writer.writerow([
                "control_id",
                "rule_id",
                "entity",
                "status",
                "delta"
            ])

            for r in rows:
                writer.writerow([
                    r[2],
                    r[3],
                    r[4],
                    r[5],
                    r[6]
                ])