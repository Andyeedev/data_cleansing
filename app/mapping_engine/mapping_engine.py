import uuid
from datetime import datetime
from app.mapping_engine.matching_strategies import table_score, column_score


class MappingEngine:

    def __init__(self, db):
        self.db = db

    def _get_tables(self, system_id):
        query = """
        SELECT table_name
        FROM core.discovered_datasets
        WHERE system_id = %s
        """
        return self.db.fetch_all(query, (system_id,))

    def _get_columns(self, table_name, system_id):
        query = """
        SELECT dc.*
        FROM core.discovered_columns dc
        JOIN core.discovered_datasets dd
          ON dc.discovered_dataset_id = dd.discovered_dataset_id
        WHERE dd.system_id = %s AND dd.table_name = %s
        """
        return self.db.fetch_all(query, (system_id, table_name))

    def generate(self, tenant_id, project_id, source_system_id, target_system_id):

        suggestions = []

        source_tables = self._get_tables(source_system_id)
        target_tables = self._get_tables(target_system_id)

        for s in source_tables:

            best_match = None
            best_score = 0

            for t in target_tables:
                score = table_score(s["table_name"], t["table_name"])

                if score > best_score:
                    best_score = score
                    best_match = t["table_name"]

            # TABLE LEVEL
            suggestions.append((
                uuid.uuid4(),
                tenant_id,
                project_id,
                source_system_id,
                target_system_id,
                s["table_name"],
                best_match,
                None,
                None,
                "TABLE",
                round(best_score, 2),
                "OK" if best_score > 0.8 else "WARNING",
                "auto matched table",
                "FUZZY",
                datetime.utcnow()
            ))

            # COLUMN LEVEL
            src_cols = self._get_columns(s["table_name"], source_system_id)
            tgt_cols = self._get_columns(best_match, target_system_id)

            for sc in src_cols:

                best_col = None
                best_col_score = 0

                for tc in tgt_cols:
                    score = column_score(sc, tc)

                    if score > best_col_score:
                        best_col_score = score
                        best_col = tc

                suggestions.append((
                    uuid.uuid4(),
                    tenant_id,
                    project_id,
                    source_system_id,
                    target_system_id,
                    s["table_name"],
                    best_match,
                    sc["column_name"],
                    best_col["column_name"] if best_col else None,
                    "COLUMN",
                    round(best_col_score, 2),
                    "OK" if best_col_score > 0.75 else "WARNING",
                    "auto matched column",
                    "FUZZY",
                    datetime.utcnow()
                ))

        return suggestions