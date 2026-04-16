import difflib


class TableMatchingEngine:

    def __init__(self, discovery_service, threshold=0.75):
        self.discovery = discovery_service
        self.threshold = threshold

    # 🔧 Normalize names (industry standard cleanup)
    def normalize(self, name):
        return (
            name.lower()
            .replace("_source", "")
            .replace("_target", "")
            .replace("_src", "")
            .replace("_tgt", "")
            .replace("_tbl", "")
        )

    def name_similarity(self, a, b):
        return difflib.SequenceMatcher(None, a, b).ratio()

    def column_overlap_score(self, src_cols, tgt_cols):
        src_set = set([c["column_name"] for c in src_cols])
        tgt_set = set([c["column_name"] for c in tgt_cols])

        if not src_set or not tgt_set:
            return 0

        overlap = len(src_set & tgt_set)
        total = len(src_set | tgt_set)

        return overlap / total

    def match_tables(self, source_id, target_id):

        source_tables = self.discovery.list_tables(source_id)
        target_tables = self.discovery.list_tables(target_id)

        results = []

        for s in source_tables:

            best_match = None
            best_score = 0
            best_metrics = {}

            for t in target_tables:

                # 🔹 Name similarity
                s_norm = self.normalize(s)
                t_norm = self.normalize(t)
                name_score = self.name_similarity(s_norm, t_norm)

                # 🔹 Column similarity
                src_cols = self.discovery.get_table_columns(source_id, s)
                tgt_cols = self.discovery.get_table_columns(target_id, t)
                col_score = self.column_overlap_score(src_cols, tgt_cols)

                # 🔹 Final score (weighted)
                final_score = (0.5 * name_score) + (0.5 * col_score)

                if final_score > best_score:
                    best_score = final_score
                    best_match = t
                    best_metrics = {
                        "NAME_SIMILARITY": round(name_score, 3),
                        "COLUMN_OVERLAP": round(col_score, 3)
                    }

            status = (
                "AUTO_MATCHED"
                if best_score >= self.threshold
                else "REVIEW_REQUIRED"
            )

            results.append({
                "source_table": s,
                "target_table": best_match,
                "confidence": round(best_score, 3),
                "status": status,
                "metrics": best_metrics
            })

        return results