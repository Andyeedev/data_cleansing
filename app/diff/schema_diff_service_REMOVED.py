class SchemaDiffService:
    def __init__(self, discovery_service, repo):
        self.discovery = discovery_service
        self.repo = repo

    def compare_and_persist(self, project_id, source_id, target_id, match):
        table_name = f"{match['source_table']} → {match['target_table']}"

        diffs = self.compare_columns(
            source_id,
            target_id,
            match["source_table"],
            match["target_table"]
        )

        # 🔥 Only persist REAL diffs
        if not diffs["missing_in_target"] and not diffs["missing_in_source"] and not diffs["type_mismatches"]:
            return

        diff_id = self.repo.upsert_schema_diff(
            project_id,
            source_id,
            target_id,
            table_name,
            "COLUMN_DIFF"
        )

        self.repo.insert_diff_details(diff_id, diffs)

    def compare_columns(self, source_id, target_id, source_table, target_table):
        source_cols = self.discovery.get_table_columns(source_id, source_table)
        target_cols = self.discovery.get_table_columns(target_id, target_table)

        src_map = {c["column_name"]: c for c in source_cols}
        tgt_map = {c["column_name"]: c for c in target_cols}

        missing_in_target = []
        missing_in_source = []
        mismatches = []

        for col in src_map:
            if col not in tgt_map:
                missing_in_target.append(col)
            else:
                if src_map[col]["data_type"] != tgt_map[col]["data_type"]:
                    mismatches.append({
                        "column": col,
                        "source_type": src_map[col]["data_type"],
                        "target_type": tgt_map[col]["data_type"]
                    })

        for col in tgt_map:
            if col not in src_map:
                missing_in_source.append(col)

        return {
            "missing_in_target": missing_in_target,
            "missing_in_source": missing_in_source,
            "type_mismatches": mismatches
        }