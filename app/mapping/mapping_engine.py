class MappingEngine:

    def __init__(self, discovery_service):
        self.discovery = discovery_service

    def generate_mappings(self, source_id, target_id, table_match):

        source_table = table_match["source_table"]
        target_table = table_match["target_table"]

        source_cols = self.discovery.get_table_columns(source_id, source_table)
        target_cols = self.discovery.get_table_columns(target_id, target_table)

        matches = []

        tgt_map = {c["column_name"].lower(): c for c in target_cols}

        for src in source_cols:

            src_name = src["column_name"].lower()

            # 🔹 Exact match
            if src_name in tgt_map:
                matches.append({
                    "source": src,
                    "target": tgt_map[src_name],
                    "confidence": 1.0,
                    "status": "AUTO_MATCHED",
                    "reason": "EXACT_MATCH"
                })
                continue

            # 🔹 Fuzzy (simple heuristic)
            for tgt_name, tgt_col in tgt_map.items():

                if src_name.replace("_source", "") == tgt_name.replace("_target", ""):
                    matches.append({
                        "source": src,
                        "target": tgt_col,
                        "confidence": 0.8,
                        "status": "AUTO_MATCHED",
                        "reason": "NORMALIZED_NAME_MATCH"
                    })
                    break

        return matches