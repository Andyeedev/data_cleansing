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

    # -----------------------------------------------------
    # GOVERNANCE DECISION
    # -----------------------------------------------------

    def export_governance(self, batch_id):

        query = """
        SELECT
            batch_id,
            project_id,
            migration_status,
            blocking_controls,
            total_failed_rules,
            decision_time
        FROM engine.migration_governance_status
        WHERE batch_id = %s
        """

        rows = self.engine_db.execute(query, (batch_id,))

        print("\n=== MIGRATION GOVERNANCE DECISION ===")

        for row in rows:
            print(f"Batch ID: {row[0]}")
            print(f"Project ID: {row[1]}")
            print(f"Migration Status: {row[2]}")
            print(f"Blocking Controls: {row[3]}")
            print(f"Total Failed Rules: {row[4]}")
            print(f"Decision Time: {row[5]}")

    # -----------------------------------------------------
    # BATCH SUMMARY
    # -----------------------------------------------------

    def export_summary(self, batch_id):

        query = """
        SELECT
            batch_id,
            batch_start_time,
            batch_end_time,
            total_controls,
            completed_controls,
            failed_controls,
            batch_status
        FROM engine.migration_batch_registry
        WHERE batch_id = %s
        """

        rows = self.engine_db.execute(query, (batch_id,))

        print("\n=== MIGRATION BATCH SUMMARY ===")

        for row in rows:

            print(f"Batch ID: {row[0]}")
            print(f"Start Time: {row[1]}")
            print(f"End Time: {row[2]}")
            print(f"Total Controls: {row[3]}")
            print(f"Completed Controls: {row[4]}")
            print(f"Failed Controls: {row[5]}")
            print(f"Batch Status: {row[6]}")

    # -----------------------------------------------------
    # CONTROL EXECUTION DETAILS
    # -----------------------------------------------------

    def export_control_details(self, batch_id):

        query = """
        SELECT
            rule_id,
            entity_name,
            execution_status,
            delta_value,
            execution_time_seconds
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        ORDER BY rule_id
        """

        rows = self.engine_db.execute(query, (batch_id,))

        print("\n=== CONTROL EXECUTION DETAILS ===")

        for row in rows:

            print(
                f"{row[0]} | {row[1]} | Status={row[2]} | "
                f"Delta={row[3]} | Time={row[4]}s"
            )

    # -----------------------------------------------------
    # EXCEPTION REPORT
    # -----------------------------------------------------

    def export_exceptions(self, batch_id):

        query = """
        SELECT
            rule_id,
            entity_name,
            source_value,
            target_value,
            delta_value
        FROM engine.migration_control_exceptions
        WHERE batch_id = %s
        """

        rows = self.engine_db.execute(query, (batch_id,))

        print("\n=== EXCEPTIONS ===")

        if not rows:
            print("No exceptions found.")
            return

        for row in rows:

            print(
                f"{row[0]} | {row[1]} | "
                f"Source={row[2]} | Target={row[3]} | Delta={row[4]}"
            )
