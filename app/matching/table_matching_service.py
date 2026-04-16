class TableMatchingService:

    def __init__(self, engine, repo):
        self.engine = engine
        self.repo = repo

    def run_table_matching(self, source_id, target_id, project_id):

        print("\n🚀 Running Table Matching...")

        matches = self.engine.match_tables(source_id, target_id)

        for m in matches:

            # 🚨 Ignore rejected
            if m["status"] == "REJECTED":
                continue

            match_id = self.repo.upsert_match(
                project_id,
                source_id,
                target_id,
                m
            )

            #self.repo.insert_match_details(match_id, m["metrics"])
            self.repo.upsert_match_details(match_id, m["metrics"])

            print(f"✔ {m['source_table']} → {m['target_table']} ({m['status']})")

        print("✅ Matching Complete")