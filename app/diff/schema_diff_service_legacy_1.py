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
    
    