class SchemaDiffService:

    def __init__(self, discovery_service):
        self.discovery = discovery_service

    def run_schema_diff_with_matches(
        self,
        source_id,
        target_id,
        project_id,
        diff_repo,
        match_repo
    ):

        print("\n🔍 Running Schema Diff (MATCH-DRIVEN)...")

        # 🔥 1. Get matched tables
        matches = match_repo.get_matches(
            project_id,
            source_id,
            target_id,
            status="AUTO_MATCHED"
        )

        print(f"Using {len(matches)} matched tables")

        # 🔥 2. Compare only matched pairs
        for m in matches:

            source_table = m["source_table"]
            target_table = m["target_table"]

            schema_diff_id = diff_repo.insert_table_diff(
                project_id,
                source_id,
                target_id,
                f"{source_table} → {target_table}",
                "COLUMN_DIFF"
            )

            column_diff = self.compare_columns_pair(
                source_id,
                target_id,
                source_table,
                target_table
            )

            # Missing in target
            for col in column_diff["missing_in_target"]:
                diff_repo.insert_column_diff(
                    schema_diff_id,
                    col,
                    None,
                    None,
                    "MISSING_IN_TARGET"
                )

            # Missing in source
            for col in column_diff["missing_in_source"]:
                diff_repo.insert_column_diff(
                    schema_diff_id,
                    col,
                    None,
                    None,
                    "MISSING_IN_SOURCE"
                )

            # Type mismatches
            for mismatch in column_diff["type_mismatches"]:
                diff_repo.insert_column_diff(
                    schema_diff_id,
                    mismatch["column"],
                    mismatch["source_type"],
                    mismatch["target_type"],
                    "TYPE_MISMATCH"
                )

            print(f"✔ {source_table} → {target_table}")

        print("✅ Schema Diff (Match-Based) Completed")

    def compare_columns_pair(self, source_id, target_id, source_table, target_table):

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