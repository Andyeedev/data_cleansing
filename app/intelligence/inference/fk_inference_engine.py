from app.utils.logger import get_logger
from typing import List, Tuple, Dict, Any, Optional


logger = get_logger(__name__)

class FKInferenceEngine:


    def __init__(self, source_adapter, target_adapter):
        self.source_adapter = source_adapter
        self.target_adapter = target_adapter

    def __init___current(self, source_db, target_db):
        """
        Accept DBConnector, extract adapters
        """
        self.source_adapter = source_db.adapter
        self.target_adapter = target_db.adapter

    # --------------------------------------------------
    # MAIN INFERENCE
    # --------------------------------------------------
    def infer(self, matches):

        inferred = []

        logger.info("FK Inference: Starting inference...")

        for source_table, target_table, match_score in matches:

            source_schema, source_name = source_table.split(".")
            target_schema, target_name = target_table.split(".")

            # ✅ USE ADAPTER (NOT SQL)
            source_columns = self.source_adapter.get_columns(source_schema, source_name)
            target_columns = self.target_adapter.get_columns(target_schema, target_name)

            source_set = set(source_columns)
            target_set = set(target_columns)

            common_cols = source_set.intersection(target_set)

            for col in common_cols:

                if col.endswith("_id"):
                    confidence = self._calculate_confidence(col, match_score)

                    inferred.append((
                        source_table,
                        col,
                        target_table,
                        col,
                        confidence
                    ))

        logger.info(f"FK Inference: Found {len(inferred)} relationships")

        return inferred

    # --------------------------------------------------
    # PERSISTENCE
    # --------------------------------------------------
    def persist_results(self, batch_id, inferred_fks, engine_db):

        if not inferred_fks:
            logger.warning("FK Inference: No results to persist")
            return

        for row in inferred_fks:
            engine_db.execute("""
                INSERT INTO engine.fk_inference_results
                (batch_id, source_table, source_column, target_table, target_column, confidence, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
            """, (
                batch_id,
                row[0],
                row[1],
                row[2],
                row[3],
                row[4]
            ))

    def persist_with_fallback(self, batch_id, inferred_fks, matches, engine_db):

        if inferred_fks:
            self.persist_results(batch_id, inferred_fks, engine_db)
        else:
            logger.warning("FK Inference: Using fallback relationships")

            for source_table, target_table, _ in matches:
                engine_db.execute("""
                    INSERT INTO engine.fk_inference_results
                    (batch_id, source_table, source_column, target_table, target_column, confidence, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, NOW())
                """, (
                    batch_id,
                    source_table,
                    "account_id",
                    target_table,
                    "account_id",
                    50
                ))

    # --------------------------------------------------
    # SCORING
    # --------------------------------------------------
    def _calculate_confidence(self, column_name, table_score):

        base = 60

        if column_name.endswith("_id"):
            base += 20

        return min(100, round((base + table_score) / 2, 2))