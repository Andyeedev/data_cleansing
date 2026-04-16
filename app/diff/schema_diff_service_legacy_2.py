class SchemaDiffService:
    def __init__(self, discovery_service):
        self.discovery = discovery_service

    def compare_tables(self, source_tables, target_tables):
        source_set = set(source_tables)
        target_set = set(target_tables)

        return {
            "missing_in_target": list(source_set - target_set),
            "missing_in_source": list(target_set - source_set),
            "common": list(source_set & target_set)
        }

    def compare_columns(self, source_id, target_id, table_name):
        
        source_cols = self.discovery.get_table_columns(source_id, table_name)
        target_cols = self.discovery.get_table_columns(target_id, table_name)

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
    
    def run_schema_diff(self, source_id, target_id, project_id, repository):

        print("\n🔍 Running Schema Diff...")

        source_tables = self.discovery.list_tables(source_id)
        target_tables = self.discovery.list_tables(target_id)

        table_diff = self.compare_tables(source_tables, target_tables)

        # 🔥 TABLE LEVEL DIFFS
        for table in table_diff["missing_in_target"]:
            repository.insert_table_diff(project_id, source_id, target_id, table, "TABLE_MISSING_IN_TARGET")

        for table in table_diff["missing_in_source"]:
            repository.insert_table_diff(project_id, source_id, target_id, table, "TABLE_MISSING_IN_SOURCE")

        # 🔥 COLUMN LEVEL DIFFS
        for table in table_diff["common"]:

            schema_diff_id = repository.insert_table_diff(
                project_id,
                source_id,
                target_id,
                table,
                "COLUMN_DIFF"
            )

            column_diff = self.compare_columns(source_id, target_id, table)

            # Missing in target
            for col in column_diff["missing_in_target"]:
                repository.insert_column_diff(schema_diff_id, col, None, None, "MISSING_IN_TARGET")

            # Missing in source
            for col in column_diff["missing_in_source"]:
                repository.insert_column_diff(schema_diff_id, col, None, None, "MISSING_IN_SOURCE")

            # Type mismatches
            for mismatch in column_diff["type_mismatches"]:
                repository.insert_column_diff(
                    schema_diff_id,
                    mismatch["column"],
                    mismatch["source_type"],
                    mismatch["target_type"],
                    "TYPE_MISMATCH"
                )

            print(f"✔ Compared table: {table}")

        print("✅ Schema Diff Completed")