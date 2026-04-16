from collections import defaultdict


class TableMatchingEngine:
    def __init__(self, discovery_service):
        
        self.discovery = discovery_service

    def compute_match_score(self, source_table, target_table, source_id, target_id):
        name_score = self._name_similarity(source_table, target_table)
        column_score = self._column_overlap(source_id, target_id, source_table, target_table)

        final_score = (0.4 * name_score) + (0.6 * column_score)

        return {
            "source_table": source_table,
            "target_table": target_table,
            "confidence_score": round(final_score, 3),
            "details": {
                "NAME_SIMILARITY": round(name_score, 3),
                "COLUMN_OVERLAP": round(column_score, 3)
            }
        }

    def find_best_matches(self, source_tables, target_tables, source_id, target_id):
        all_matches = []

        for s in source_tables:
            for t in target_tables:
                match = self.compute_match_score(s, t, source_id, target_id)
                all_matches.append(match)

        # 🔥 Enforce ONE best match per source
        grouped = defaultdict(list)
        for m in all_matches:
            grouped[m["source_table"]].append(m)

        best_matches = []
        for source, candidates in grouped.items():
            best = max(candidates, key=lambda x: x["confidence_score"])
            best_matches.append(best)

        return best_matches

    def _name_similarity(self, s, t):
        return 1.0 if s.replace("_source", "") == t.replace("_target", "") else 0.5

    def _column_overlap(self, source_id, target_id, s, t):
        src_cols = self.discovery.get_table_columns(source_id, s)
        tgt_cols = self.discovery.get_table_columns(target_id, t)

        src_set = {c["column_name"] for c in src_cols}
        tgt_set = {c["column_name"] for c in tgt_cols}

        if not src_set:
            return 0

        return len(src_set & tgt_set) / len(src_set)