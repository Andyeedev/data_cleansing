class TableMatchingService:

    def __init__(self, engine, repository):
        self.engine = engine
        self.repo = repository

    def run_table_matching(self, source_id, target_id, project_id):

        print("\n🔗 Running Table Matching Engine...")

        matches = self.engine.match_tables(source_id, target_id)

        for m in matches:

            match_id = self.repo.insert_match(
                project_id,
                source_id,
                target_id,
                m
            )

            self.repo.insert_match_details(match_id, m["metrics"])

            print(f"✔ {m['source_table']} → {m['target_table']} ({m['confidence']}) [{m['status']}]")

        print("✅ Table Matching Completed")