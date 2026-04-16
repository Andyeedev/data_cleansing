class MappingService:

    def __init__(self, engine, repo, discovery, match_repo):
        self.engine = engine
        self.repo = repo
        self.discovery = discovery
        self.match_repo = match_repo

    def run_mapping(self, project_id, source_id, target_id):

        print("\n🚀 Running Mapping Engine...")

        table_matches = self.match_repo.get_matches(
            project_id, source_id, target_id
        )

        for tm in table_matches:

            # -----------------------------------------
            # 1. Create dataset mapping
            # -----------------------------------------
            mapping_id = self.repo.upsert_dataset_mapping(
                project_id, source_id, target_id, tm
            )

            # -----------------------------------------
            # 2. Load columns
            # -----------------------------------------
            source_cols = self.discovery.get_table_columns(
                source_id, tm["source_table"]
            )

            target_cols = self.discovery.get_table_columns(
                target_id, tm["target_table"]
            )

            src_ids = {}
            tgt_ids = {}

            for c in source_cols:
                src_ids[c["column_name"]] = self.repo.upsert_dataset_column(
                    mapping_id, c, "SOURCE"
                )

            for c in target_cols:
                tgt_ids[c["column_name"]] = self.repo.upsert_dataset_column(
                    mapping_id, c, "TARGET"
                )

            # -----------------------------------------
            # 3. Column matching
            # -----------------------------------------
            matches = self.engine.generate_mappings(
                source_id, target_id, tm
            )

            for m in matches:

                src_id = src_ids[m["source"]["column_name"]]
                tgt_id = tgt_ids[m["target"]["column_name"]]

                self.repo.upsert_column_mapping(
                    mapping_id, src_id, tgt_id, m
                )

            print(f"✔ Mapping created: {tm['source_table']} → {tm['target_table']}")

        print("✅ Mapping Complete")