from app.utils.logger import get_logger
from typing import List, Tuple, Dict, Any, Optional


logger = get_logger(__name__)

class FKInferenceEngine:

    def __init___legacy(self, source_db, engine_db, batch_id):
        self.source_db = source_db
        self.engine_db = engine_db
        self.batch_id = batch_id

    def __init___current_1_2_3_4_5(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id
        
    def __init___current_6(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id

        # Thresholds
        self.min_score_threshold = 60
        self.sample_limit = 1000

    def __init___current_8(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id

        self.min_score_threshold = 70
        self.sample_limit = 1000
    # ---------------------------------------------------------
    def infer_legacy_1(self):

        tables = self.source_db.adapter.get_tables()
        results = []

        for table in tables:

            columns = self.source_db.adapter.get_columns(table)

            for col1 in columns:
                for col2 in columns:

                    if col1 == col2:
                        continue

                    score = self._calculate_fk_score(table, col1, col2)

                    if score > 70:
                        results.append((f"{table}.{col1}", f"{table}.{col2}", score))

        self._persist(results)
        return results
    
    def infer_legacy_2(self):

        tables = self.source_db.adapter.get_tables()

        results = []

        for schema, table in tables:

            print(f"[FK] {schema}.{table}")

            columns = self.source_db.adapter.get_columns(schema, table)

            for col1 in columns:
                for col2 in columns:

                    if col1 == col2:
                        continue

                    score = self._calculate_fk_score(schema, table, col1, col2)

                    if score > 70:
                        results.append((
                            f"{schema}.{table}.{col1}",
                            f"{schema}.{table}.{col2}",
                            score
                        ))

        self._persist(results)
        return results


    def infer_legacy_3(self):

        tables = self.source_db.adapter.get_tables()

        results = []

        for schema, table in tables:

            print(f"[FK] {schema}.{table}")

            columns = self.source_db.adapter.get_columns(schema, table)

            for col1 in columns:
                for col2 in columns:

                    if col1 == col2:
                        continue

                    score = self._calculate_fk_score(schema, table, col1, col2)

                    if score > 70:
                        results.append((
                            f"{schema}.{table}.{col1}",
                            f"{schema}.{table}.{col2}",
                            score
                        ))

        # -------------------------------------------------
        # FILTER BAD FK CANDIDATES (same-table relationships)
        # -------------------------------------------------
        filtered = []

        for src, tgt, score in results:

            src_schema, src_table, _ = src.split(".")
            tgt_schema, tgt_table, _ = tgt.split(".")

            # ❌ Skip same-table relationships
            if src_table == tgt_table:
                continue

            filtered.append((src, tgt, score))

        # -------------------------------------------------
        # Persist filtered results
        # -------------------------------------------------
        self._persist(filtered)

        return filtered



    def infer_current_1(self):

        tables = self.source_db.adapter.get_tables()
        results = []

        for src_schema, src_table in tables:

            src_columns = self.source_db.adapter.get_columns(src_schema, src_table)

            for tgt_schema, tgt_table in tables:

                # ❌ skip same table
                if src_table == tgt_table:
                    continue

                tgt_columns = self.source_db.adapter.get_columns(tgt_schema, tgt_table)

                for col1 in src_columns:
                    for col2 in tgt_columns:

                        score = self._calculate_fk_score(src_schema, src_table, col1, col2)

                        if score > 70:
                            results.append((
                                f"{src_schema}.{src_table}.{col1}",
                                f"{tgt_schema}.{tgt_table}.{col2}",
                                score
                            ))

        # persist
        self._persist(results)
            

    def infer_new(self):

        tables = self.source_db.adapter.get_tables()
        results = []

        for src_schema, src_table in tables:

            print(f"[FK] SOURCE {src_schema}.{src_table}")

            src_columns = self.source_db.adapter.get_columns(src_schema, src_table)

            for tgt_schema, tgt_table in tables:

                # ❌ skip same table
                if src_table == tgt_table:
                    continue

                tgt_columns = self.source_db.adapter.get_columns(tgt_schema, tgt_table)

                for src_col, src_type in src_columns:
                    for tgt_col, tgt_type in tgt_columns:

                        # ✅ NEW VALIDATION
                        if not self._is_valid_fk_pair(src_col, tgt_col, src_type, tgt_type):
                            continue

                        score = self._calculate_fk_score(src_schema, src_table, src_col, tgt_col)

                        if score > 50:  # slightly relaxed threshold
                            results.append((
                                f"{src_schema}.{src_table}.{src_col}",
                                f"{tgt_schema}.{tgt_table}.{tgt_col}",
                                score
                            ))

        print(f"[FK] FINAL RESULTS: {results}")

        # ✅ persist
        self._persist(results)

        # ✅ CRITICAL FIX
        return results

    def infer_not_mapped(self):

        tables = self.source_db.adapter.get_tables()
        results = []

        for src_schema, src_table in tables:

            print(f"[FK] SOURCE {src_schema}.{src_table}")

            src_columns = self.source_db.adapter.get_columns(src_schema, src_table)

            for tgt_schema, tgt_table in tables:

                # ❌ skip same table
                if src_table == tgt_table:
                    continue

                tgt_columns = self.source_db.adapter.get_columns(tgt_schema, tgt_table)

                for src_col, src_type in src_columns:
                    for tgt_col, tgt_type in tgt_columns:

                        # ✅ NEW VALIDATION
                        if not self._is_valid_fk_pair(src_col, tgt_col, src_type, tgt_type):
                            continue

                        score = self._calculate_fk_score(src_schema, src_table, src_col, tgt_col)

                        if score > 50:  # slightly relaxed threshold
                            results.append((
                                f"{src_schema}.{src_table}.{src_col}",
                                f"{tgt_schema}.{tgt_table}.{tgt_col}",
                                score
                            ))

        print(f"[FK] FINAL RESULTS: {results}")

        # ✅ persist
        self._persist(results)

        # ✅ CRITICAL FIX
        return results


    def infer_current_2(self):

        tables = self.source_db.adapter.get_tables()
        results = []

        for src_schema, src_table in tables:

            print(f"[FK] SOURCE {src_schema}.{src_table}")

            src_columns = self.source_db.adapter.get_columns(src_schema, src_table)

            for tgt_schema, tgt_table in tables:

                # ❌ skip same table
                if src_table == tgt_table:
                    continue

                tgt_columns = self.source_db.adapter.get_columns(tgt_schema, tgt_table)

                for src_col in src_columns:
                    for tgt_col in tgt_columns:

                        # 🔥 SAFE TYPE HANDLING
                        src_col_name = src_col[0] if isinstance(src_col, (list, tuple)) else src_col
                        tgt_col_name = tgt_col[0] if isinstance(tgt_col, (list, tuple)) else tgt_col

                        # Optional: type if exists
                        src_type = src_col[1] if isinstance(src_col, (list, tuple)) and len(src_col) > 1 else None
                        tgt_type = tgt_col[1] if isinstance(tgt_col, (list, tuple)) and len(tgt_col) > 1 else None

                        # ✅ VALIDATION
                        if not self._is_valid_fk_pair(src_col_name, tgt_col_name, src_type, tgt_type):
                            continue
                        

                        score = self._calculate_fk_score(src_schema, src_table, src_col_name, tgt_col_name)

                        if score > 50:
                            results.append((
                                f"{src_schema}.{src_table}.{src_col_name}",
                                f"{tgt_schema}.{tgt_table}.{tgt_col_name}",
                                score
                            ))

        print(f"[FK] FINAL RESULTS: {results}")

        self._persist(results)

        return results

    def infer_current_3(self):

        tables = self.source_db.adapter.get_tables()
        results = []

        for src_schema, src_table in tables:

            print(f"[FK] SOURCE {src_schema}.{src_table}")

            src_columns = self.source_db.adapter.get_columns(src_schema, src_table)

            for tgt_schema, tgt_table in tables:

                # ❌ skip same table
                if src_table == tgt_table:
                    continue

                tgt_columns = self.source_db.adapter.get_columns(tgt_schema, tgt_table)

                for src_col in src_columns:
                    for tgt_col in tgt_columns:

                        # 🔥 SAFE TYPE HANDLING
                        src_col_name = src_col[0] if isinstance(src_col, (list, tuple)) else src_col
                        tgt_col_name = tgt_col[0] if isinstance(tgt_col, (list, tuple)) else tgt_col

                        # Optional: type if exists
                        src_type = src_col[1] if isinstance(src_col, (list, tuple)) and len(src_col) > 1 else None
                        tgt_type = tgt_col[1] if isinstance(tgt_col, (list, tuple)) and len(tgt_col) > 1 else None

                        # ✅ VALIDATION
                        
                        if not self._is_valid_fk_pair(
                            src_col_name,
                            tgt_col_name,
                            src_type,
                            tgt_type,
                            src_table,
                            tgt_table
                        ):
                            continue

                        score = self._calculate_fk_score(src_schema, src_table, src_col_name, tgt_col_name)

                        if score > 50:
                            results.append((
                                f"{src_schema}.{src_table}.{src_col_name}",
                                f"{tgt_schema}.{tgt_table}.{tgt_col_name}",
                                score
                            ))

        print(f"[FK] FINAL RESULTS: {results}")

        self._persist(results)

        return results

    def infer_current_4(self, table_matches):

        results = []

        for src_full, tgt_full, _ in table_matches:

            src_schema, src_table = src_full.split(".")
            tgt_schema, tgt_table = tgt_full.split(".")

            src_columns = self.source_db.adapter.get_columns(src_schema, src_table)
            tgt_columns = self.target_db.adapter.get_columns(tgt_schema, tgt_table)

            for src_col in src_columns:
                for tgt_col in tgt_columns:

                    src_col_name = src_col if isinstance(src_col, str) else src_col[0]
                    tgt_col_name = tgt_col if isinstance(tgt_col, str) else tgt_col[0]

                    if not self._is_valid_fk_pair(src_col_name, tgt_col_name):
                        continue

                    score = self._calculate_fk_score(
                        src_schema,
                        src_table,
                        src_col_name,
                        tgt_col_name
                    )

                    if score > 50:
                        results.append((
                            f"{src_schema}.{src_table}.{src_col_name}",
                            f"{tgt_schema}.{tgt_table}.{tgt_col_name}",
                            score
                        ))

        self._persist(results)

        return results

    def infer_current_5(self, table_matches):

        results = []

        for src_full, tgt_full, _ in table_matches:

            src_schema, src_table = src_full.split(".")
            tgt_schema, tgt_table = tgt_full.split(".")

            src_columns = self.source_db.adapter.get_columns(src_schema, src_table)
            tgt_columns = self.target_db.adapter.get_columns(tgt_schema, tgt_table)

            # 🔴 STEP 1: Identify PK candidates in target
            target_pks = self._get_primary_keys(tgt_schema, tgt_table)

            for src_col in src_columns:
                src_col = self._normalize_col(src_col)

                # Only FK-like columns
                if not src_col.endswith("_id"):
                    continue

                for tgt_col in tgt_columns:
                    tgt_col = self._normalize_col(tgt_col)

                    # Must match PK column
                    if tgt_col not in target_pks:
                        continue

                    if src_col != tgt_col:
                        continue

                    score, breakdown = self._calculate_fk_score(
                        src_schema, src_table, src_col,
                        tgt_schema, tgt_table, tgt_col
                    )

                    if score >= 60:
                        results.append({
                            "source": f"{src_schema}.{src_table}.{src_col}",
                            "target": f"{tgt_schema}.{tgt_table}.{tgt_col}",
                            "confidence": score,
                            "breakdown": breakdown
                        })

        self._persist(results)
        return results
    
    def infer_current_6(self, table_matches):

        #logger.info("FK Inference started")

        # 🔥 CRITICAL: use ALL tables, not just matches
        source_tables = self._get_all_tables(self.source_db)
        target_tables = self._get_all_tables(self.target_db)

        logger.info(f"Source tables: {len(source_tables)}")
        logger.info(f"Target tables: {len(target_tables)}")

        results = []

        for s_schema, s_table in source_tables:
            for t_schema, t_table in target_tables:

                # Skip same table comparison
                if (s_schema, s_table) == (t_schema, t_table):
                    continue

                src_columns = self.source_db.adapter.get_columns(s_schema, s_table)
                tgt_columns = self.target_db.adapter.get_columns(t_schema, t_table)

                for src_col in src_columns:
                    for tgt_col in tgt_columns:

                        src_col_name = self._normalize_col(src_col)
                        tgt_col_name = self._normalize_col(tgt_col)

                        if not self._is_candidate(src_col_name, tgt_col_name):
                            continue

                        score = self._score_fk(
                            s_schema, s_table, src_col_name,
                            t_schema, t_table, tgt_col_name
                        )

                        if score >= self.min_score_threshold:
                            results.append((
                                f"{s_schema}.{s_table}.{src_col_name}",
                                f"{t_schema}.{t_table}.{tgt_col_name}",
                                score
                            ))

        logger.info(f"FK candidates found: {len(results)}")

        if not results:
            logger.warning("No FK relationships inferred")

        self._persist(results)

        return results
    
    def infer_current_7(self, table_matches):

        logger.info("FK Inference started")

        # ✅ ONLY USE MATCHED TABLES (CRITICAL FIX)
        candidate_pairs = [
            (src, tgt) for src, tgt, score in table_matches if score > 60
        ]

        results = []

        for src_full, tgt_full in candidate_pairs:

            s_schema, s_table = src_full.split(".")
            t_schema, t_table = tgt_full.split(".")

            if self._is_system_schema(s_schema) or self._is_system_schema(t_schema):
                continue

            src_cols = self.source_db.adapter.get_columns(s_schema, s_table)
            tgt_cols = self.target_db.adapter.get_columns(t_schema, t_table)

            for s_col in src_cols:
                for t_col in tgt_cols:

                    s_col = self._norm(s_col)
                    t_col = self._norm(t_col)

                    if not self._is_fk_candidate(s_col, t_col):
                        continue

                    score = self._score_fk(
                        s_schema, s_table, s_col,
                        t_schema, t_table, t_col
                    )

                    if score >= self.min_score_threshold:
                        results.append((
                            f"{s_schema}.{s_table}.{s_col}",
                            f"{t_schema}.{t_table}.{t_col}",
                            score
                        ))

        logger.info(f"FK relationships found: {len(results)}")

        self._persist(results)
        return results
    
    def infer_current_8(self, table_matches):

        logger.info("FK Inference started")

        results = []

        # ---------------------------------------------
        # 1. STRICT MATCHED TABLE FKs (KEEP)
        # ---------------------------------------------
        matched_pairs = [
            (src, tgt) for src, tgt, score in table_matches if score > 60
        ]

        for src_full, tgt_full in matched_pairs:
            results.extend(self._infer_between_tables(src_full, tgt_full))

        # ---------------------------------------------
        # 2. CROSS-TABLE FK DISCOVERY (NEW — CRITICAL)
        # ---------------------------------------------
        logger.info("Running cross-table FK discovery")

        source_tables = self.source_db.adapter.get_tables()
        target_tables = self.target_db.adapter.get_tables()

        for s_schema, s_table in source_tables:
            for t_schema, t_table in target_tables:

                if self._is_system_schema(s_schema) or self._is_system_schema(t_schema):
                    continue

                # 🚫 SKIP already matched pairs (avoid duplication)
                if any(s_table in p[0] and t_table in p[1] for p in matched_pairs):
                    continue

                results.extend(
                    self._infer_between_tables(
                        f"{s_schema}.{s_table}",
                        f"{t_schema}.{t_table}",
                        cross_mode=True
                    )
                )

        # ---------------------------------------------
        # 3. DEDUPLICATE (CRITICAL)
        # ---------------------------------------------
        unique = {}
        for src, tgt, score in results:
            key = (src, tgt)
            if key not in unique or score > unique[key]:
                unique[key] = score

        final_results = [(k[0], k[1], v) for k, v in unique.items()]

        logger.info(f"Final FK count: {len(final_results)}")

        self._persist(final_results)
        return final_results


    # ---------------------------------------------------------
    def _calculate_fk_score_legacy(self, table, col1, col2):

        score = 0

        if str(col1).endswith("_id") and str(col1).replace("_id", "") in table:
            score += 40

        score += 30  # placeholder
        score += 20  # placeholder

        return score
    
    def _calculate_fk_score_current_4(self, schema, table, col1, col2):

        score = 0

        if str(col1).endswith("_id") and str(col1).replace("_id", "") in table:
            score += 40

        score += 30  # placeholder
        score += 20  # placeholder

        return score

    
    # =========================================================
    # STEP 2: SCORE CALCULATION
    # =========================================================
    def _calculate_fk_score_current_6(
        self,
        src_schema, src_table, src_col,
        tgt_schema, tgt_table, tgt_col
    ):

        score = 0
        breakdown = {}

        # ---------------------------
        # 1. Name match (strong signal)
        # ---------------------------
        if src_col == tgt_col:
            score += 25
            breakdown["name_match"] = 25
        else:
            breakdown["name_match"] = 0

        # ---------------------------
        # 2. Data type match
        # ---------------------------
        if self._data_type_match(
            src_schema, src_table, src_col,
            tgt_schema, tgt_table, tgt_col
        ):
            score += 15
            breakdown["type_match"] = 15
        else:
            breakdown["type_match"] = 0

        # ---------------------------
        # 3. Data overlap (CRITICAL)
        # ---------------------------
        overlap_pct = self._calculate_overlap(
            src_schema, src_table, src_col,
            tgt_schema, tgt_table, tgt_col
        )

        overlap_score = min(overlap_pct, 100) * 0.4
        score += overlap_score
        breakdown["overlap"] = round(overlap_score, 2)

        # ---------------------------
        # 4. Uniqueness (target should be unique)
        # ---------------------------
        tgt_unique = self._get_uniqueness(tgt_schema, tgt_table, tgt_col)

        if tgt_unique >= 0.95:
            score += 10
            breakdown["target_uniqueness"] = 10
        else:
            breakdown["target_uniqueness"] = 0

        # ---------------------------
        # 5. Null check (FK should not be mostly null)
        # ---------------------------
        null_pct = self._get_null_pct(src_schema, src_table, src_col)

        if null_pct < 0.2:
            score += 10
            breakdown["null_score"] = 10
        else:
            breakdown["null_score"] = 0

        return round(score, 2), breakdown
    
    # ---------------------------------------------------------
    def _persist_current_1(self, results):

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_column, target_column, confidence)
        VALUES (%s,%s,%s,%s)
        """

        for r in results:
            self.engine_db.execute(query, (
                self.batch_id,
                r[0],
                r[1],
                r[2]
            ))

    def _persist_current_2(self, results):

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_column, target_column, confidence)
        VALUES (%s,%s,%s,%s)
        """

        for r in results:
            try:
                self.engine_db.execute(query, (
                    self.batch_id,
                    r[0],
                    r[1],
                    r[2]
                ))
            except Exception as e:
                print(f"[FK Persist ERROR] {r} → {e}")

    
    def _persist_current_3(self, results):

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_table, source_column, target_table, target_column, confidence)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        for src, tgt, score in results:

            try:
                src_schema, src_table, src_col = src.split(".")
                tgt_schema, tgt_table, tgt_col = tgt.split(".")

                self.engine_db.execute(query, (
                    self.batch_id,
                    f"{src_schema}.{src_table}",
                    src_col,
                    f"{tgt_schema}.{tgt_table}",
                    tgt_col,
                    score
                ))


            except Exception as e:
                print(f"[FK Persist ERROR] {(src, tgt, score)} → {e}")


    
    def _persist_current_6(self, results):

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_table, source_column, target_table, target_column, confidence)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        for src, tgt, score in results:

            src_schema, src_table, src_col = src.split(".")
            tgt_schema, tgt_table, tgt_col = tgt.split(".")

            self.engine_db.execute(query, (
                self.batch_id,
                f"{src_schema}.{src_table}",
                src_col,
                f"{tgt_schema}.{tgt_table}",
                tgt_col,
                score
            ))



    def _is_valid_fk_pair_current_2(self, src_col, tgt_col, src_type, tgt_type):

        # 1. Must end with _id
        
        if not str(src_col).endswith("_id") or not str(tgt_col).endswith("_id"):
            return False

        # 2. Must match datatype
        if src_type != tgt_type:
            return False

        # 3. Name similarity (strict for now)
        if src_col != tgt_col:
            return False

        return True
    
    def _is_valid_fk_pair_current_1(self, src_col, tgt_col, src_type, tgt_type, src_table, tgt_table):
        

        # 1. Must end with _id
        if not str(src_col).endswith("_id") or not str(tgt_col).endswith("_id"):
            return False

        # 2. Type check (if available)
        if src_type and tgt_type and src_type != tgt_type:
            return False

        # 3. Column names must match
        if src_col != tgt_col:
            return False

        # 🔥 4. NEW: TABLE RELATIONSHIP RULE
        # Example: account_id → accounts
        base = src_col.replace("_id", "")

        if base not in tgt_table:
            return False

        # ❌ prevent reverse FK
        if base in src_table:
            return False

        return True
    

    def _is_valid_fk_pair_current_3(self, src_col, tgt_col, src_type, tgt_type, src_table, tgt_table):

        # 1. Must end with _id
        if not str(src_col).endswith("_id") or not str(tgt_col).endswith("_id"):
            return False

        # 2. Type check (if available)
        if src_type and tgt_type and src_type != tgt_type:
            return False

        # 3. Column names must match
        if src_col != tgt_col:
            return False

        # 🔥 4. RELAXED TABLE MATCHING
        base = src_col.replace("_id", "")

        # normalize table names
        src_table_clean = src_table.replace("_source", "").replace("_target", "")
        tgt_table_clean = tgt_table.replace("_source", "").replace("_target", "").replace("_duplicate_test", "")

        # allow plural match (account ↔ accounts)
        if base not in tgt_table_clean and base + "s" not in tgt_table_clean:
            return False

        # ❌ prevent reverse FK
        if base in src_table_clean or base + "s" in src_table_clean:
            return False

        return True
    


    def _is_valid_fk_pair_current_5(self, src_col, tgt_col):

        if not str(src_col).endswith("_id"):
            return False

        if src_col != tgt_col:
            return False

        return True
    

    def _is_valid_fk_pair_old(self, src_col, tgt_col):

        src = str(src_col).lower()
        tgt = str(tgt_col).lower()

        # Rule 1: FK naming pattern
        if not src.endswith("_id"):
            return False

        # Rule 2: exact match
        if src == tgt:
            return True

        # Rule 3: semantic match (customer_id → id)
        if src.replace("_id", "") in tgt or tgt.replace("_id", "") in src:
            return True

        return False

     # =========================================================
    # STEP 1: PRIMARY KEY DETECTION
    # =========================================================
    def _get_primary_keys_current_5(self, schema, table):

        query = """
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = %s
        AND tc.table_name = %s
        """

        try:
            rows = self.target_db.execute(query, (schema, table))
            return set(r[0] for r in rows)
        except:
            return set()

    # =========================================================
    # STEP 3: DATA OVERLAP CHECK (JOIN VALIDATION)
    # =========================================================
    def _calculate_overlap_current_5(
        self,
        src_schema, src_table, src_col,
        tgt_schema, tgt_table, tgt_col
    ):

        query = f"""
        SELECT COUNT(*) * 100.0 / NULLIF(src.total,0)
        FROM (
            SELECT COUNT(*) AS total FROM {src_schema}.{src_table}
            WHERE {src_col} IS NOT NULL
        ) src,
        (
            SELECT COUNT(*) AS matched
            FROM {src_schema}.{src_table} s
            JOIN {tgt_schema}.{tgt_table} t
              ON s.{src_col} = t.{tgt_col}
        ) m
        """

        try:
            result = self.source_db.execute(query)
            return result[0][0] if result else 0
        except:
            return 0
        

        # =========================================================
    # STEP 4: DATA TYPE CHECK
    # =========================================================
    def _data_type_match_current_5(
        self,
        src_schema, src_table, src_col,
        tgt_schema, tgt_table, tgt_col
    ):

        query = """
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s AND column_name = %s
        """

        try:
            src_type = self.source_db.execute(query, (src_schema, src_table, src_col))[0][0]
            tgt_type = self.target_db.execute(query, (tgt_schema, tgt_table, tgt_col))[0][0]
            return src_type == tgt_type
        except:
            return False

    # =========================================================
    # STEP 5: PROFILING SIGNALS
    # =========================================================
    def _get_uniqueness_current_5(self, schema, table, column):

        query = """
        SELECT uniqueness
        FROM engine.data_profiling_results
        WHERE batch_id = %s
        AND schema_name = %s
        AND table_name = %s
        AND column_name = %s
        ORDER BY created_at DESC
        LIMIT 1
        """

        rows = self.engine_db.execute(query, (
            self.batch_id, schema, table, column
        ))

        return rows[0][0] if rows else 0

    def _get_null_pct_current_5(self, schema, table, column):

        query = """
        SELECT null_pct
        FROM engine.data_profiling_results
        WHERE batch_id = %s
        AND schema_name = %s
        AND table_name = %s
        AND column_name = %s
        ORDER BY created_at DESC
        LIMIT 1
        """

        rows = self.engine_db.execute(query, (
            self.batch_id, schema, table, column
        ))

        return rows[0][0] if rows else 1

    # =========================================================
    # UTIL
    # =========================================================
    def _normalize_col_current_5(self, col):
        return col if isinstance(col, str) else col[0]

    # =========================================================
    # PERSIST
    # =========================================================
    def _persist_current_5(self, results):

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_table, source_column, target_table, target_column, confidence)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        for r in results:

            src_schema, src_table, src_col = r["source"].split(".")
            tgt_schema, tgt_table, tgt_col = r["target"].split(".")

            self.engine_db.execute(query, (
                self.batch_id,
                f"{src_schema}.{src_table}",
                src_col,
                f"{tgt_schema}.{tgt_table}",
                tgt_col,
                r["confidence"]
            ))

    # =====================================================
    # PERSIST
    # =====================================================
    def _persist_current_6(self, results):

        if not results:
            logger.warning("No FK results to persist")
            return

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_table, source_column,
         target_table, target_column, confidence)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        for src, tgt, score in results:

            s_schema, s_table, s_col = src.split(".")
            t_schema, t_table, t_col = tgt.split(".")

            self.engine_db.execute(query, (
                self.batch_id,
                f"{s_schema}.{s_table}",
                s_col,
                f"{t_schema}.{t_table}",
                t_col,
                score
            ))



















    # =====================================================
    # TABLE DISCOVERY
    # =====================================================
    def _get_all_tables_current_6(self, db):

        rows = db.execute("""
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_type = 'BASE TABLE'
        """)

        return [(r[0], r[1]) for r in rows]

    # =====================================================
    # COLUMN NORMALIZATION
    # =====================================================
    def _normalize_col_current_6(self, col):

        if isinstance(col, tuple):
            col = col[0]

        return col.lower()

    # =====================================================
    # CANDIDATE FILTER
    # =====================================================
    def _is_candidate_current_6(self, src_col, tgt_col):

        # Must look like FK
        if not src_col.endswith("_id"):
            return False

        # Compare base names (account_id → account)
        src_base = src_col.replace("_id", "")
        tgt_base = tgt_col.replace("_id", "")

        return src_base == tgt_base

    # =====================================================
    # SCORING MODEL
    # =====================================================
    def _score_fk_current_6(self, s_schema, s_table, s_col,
                        t_schema, t_table, t_col):

        score = 0

        # -------------------------------
        # 1. Name similarity (30)
        # -------------------------------
        if s_col == t_col:
            score += 30
        elif s_col.replace("_id", "") == t_col.replace("_id", ""):
            score += 20

        # -------------------------------
        # 2. Data type match (20)
        # -------------------------------
        if self._same_datatype(s_schema, s_table, s_col,
                               t_schema, t_table, t_col):
            score += 20

        # -------------------------------
        # 3. Value overlap (40)
        # -------------------------------
        overlap = self._value_overlap(
            s_schema, s_table, s_col,
            t_schema, t_table, t_col
        )

        score += int(overlap * 40)

        # -------------------------------
        # 4. Uniqueness bonus (10)
        # -------------------------------
        if self._is_unique(t_schema, t_table, t_col):
            score += 10

        return score

    # =====================================================
    # DATA TYPE CHECK
    # =====================================================
    def _same_datatype_current_6(self, s_schema, s_table, s_col,
                             t_schema, t_table, t_col):

        query = """
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema = %s
        AND table_name = %s
        AND column_name = %s
        """

        s_type = self.source_db.execute(query, (s_schema, s_table, s_col))
        t_type = self.target_db.execute(query, (t_schema, t_table, t_col))

        if not s_type or not t_type:
            return False

        return s_type[0][0] == t_type[0][0]

    # =====================================================
    # VALUE OVERLAP (KEY SIGNAL)
    # =====================================================
    def _value_overlap_current_6(self, s_schema, s_table, s_col,
                             t_schema, t_table, t_col):

        try:
            src_values = self.source_db.adapter.get_distinct_values(
                s_schema, s_table, s_col, limit=self.sample_limit
            )

            tgt_values = self.target_db.adapter.get_distinct_values(
                t_schema, t_table, t_col, limit=self.sample_limit
            )

            if not src_values or not tgt_values:
                return 0

            src_set = set(src_values)
            tgt_set = set(tgt_values)

            intersection = src_set.intersection(tgt_set)

            return len(intersection) / max(len(src_set), 1)

        except Exception as e:
            logger.warning(f"Value overlap failed: {e}")
            return 0

    # =====================================================
    # UNIQUENESS CHECK (PK SIGNAL)
    # =====================================================
    def _is_unique_current_6(self, schema, table, column):

        query = f"""
        SELECT COUNT(*) = COUNT(DISTINCT {column})
        FROM {schema}.{table}
        """

        try:
            result = self.target_db.execute(query)
            return result[0][0]
        except:
            return False

    










    # =====================================================
    # FILTER SYSTEM TABLES
    # =====================================================
    def _is_system_schema_current_8(self, schema):
        return schema in ("information_schema", "pg_catalog")

    # =====================================================
    # NORMALISE
    # =====================================================
    def _norm_c(self, col):
        return col[0].lower() if isinstance(col, tuple) else col.lower()

    # =====================================================
    # FK CANDIDATE
    # =====================================================
    def _is_fk_candidate_current_8(self, s_col, t_col):

        if not s_col.endswith("_id"):
            return False

        base_s = s_col.replace("_id", "")
        base_t = t_col.replace("_id", "")

        return base_s == base_t

    # =====================================================
    # SCORING
    # =====================================================
    def _score_fk_current_8(self, s_schema, s_table, s_col,
                        t_schema, t_table, t_col):

        score = 0

        # 1. Column match
        if s_col == t_col:
            score += 30

        # 2. Data type
        if self._same_type(s_schema, s_table, s_col,
                           t_schema, t_table, t_col):
            score += 20

        # 3. VALUE OVERLAP (CRITICAL)
        overlap = self._overlap(
            s_schema, s_table, s_col,
            t_schema, t_table, t_col
        )
        score += int(overlap * 40)

        # 4. TARGET UNIQUENESS (PARENT TABLE SIGNAL)
        if self._is_unique(t_schema, t_table, t_col):
            score += 20

        return score

    # =====================================================
    # DATA TYPE
    # =====================================================
    def _same_type_current_8(self, s_schema, s_table, s_col,
                         t_schema, t_table, t_col):

        q = """
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema=%s AND table_name=%s AND column_name=%s
        """

        s = self.source_db.execute(q, (s_schema, s_table, s_col))
        t = self.target_db.execute(q, (t_schema, t_table, t_col))

        if not s or not t:
            return False

        return s[0][0] == t[0][0]

    # =====================================================
    # VALUE OVERLAP
    # =====================================================
    def _overlap_current_8(self, s_schema, s_table, s_col,
                      t_schema, t_table, t_col):

        try:
            src_vals = self.source_db.adapter.get_distinct_values(
                s_schema, s_table, s_col, limit=self.sample_limit
            )
            tgt_vals = self.target_db.adapter.get_distinct_values(
                t_schema, t_table, t_col, limit=self.sample_limit
            )

            if not src_vals or not tgt_vals:
                return 0

            s_set = set(src_vals)
            t_set = set(tgt_vals)

            inter = s_set.intersection(t_set)

            return len(inter) / max(len(s_set), 1)

        except Exception as e:
            logger.warning(f"Overlap failed: {e}")
            return 0

    # =====================================================
    # UNIQUENESS
    # =====================================================
    def _is_unique_current_8(self, schema, table, col):

        try:
            q = f"""
            SELECT COUNT(*) = COUNT(DISTINCT {col})
            FROM {schema}.{table}
            """
            res = self.target_db.execute(q)
            return res[0][0]
        except:
            return False

    # =====================================================
    # PERSIST
    # =====================================================
    def _persist_current_8(self, results):

        if not results:
            logger.warning("No FK results to persist")
            return

        query = """
        INSERT INTO engine.fk_inference_results
        (batch_id, source_table, source_column,
         target_table, target_column, confidence)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        for src, tgt, score in results:

            s_schema, s_table, s_col = src.split(".")
            t_schema, t_table, t_col = tgt.split(".")

            self.engine_db.execute(query, (
                self.batch_id,
                f"{s_schema}.{s_table}",
                s_col,
                f"{t_schema}.{t_table}",
                t_col,
                score
            ))

    def _infer_between_tables_current_7(self, src_full, tgt_full, cross_mode=False):

        results = []

        s_schema, s_table = src_full.split(".")
        t_schema, t_table = tgt_full.split(".")

        src_cols = self.source_db.adapter.get_columns(s_schema, s_table)
        tgt_cols = self.target_db.adapter.get_columns(t_schema, t_table)

        for s_col in src_cols:
            for t_col in tgt_cols:

                s_col = self._norm(s_col)
                t_col = self._norm(t_col)

                if not self._is_fk_candidate(s_col, t_col):
                    continue

                score = self._score_fk(
                    s_schema, s_table, s_col,
                    t_schema, t_table, t_col
                )

                # 🚨 STRICTER threshold for cross-table
                threshold = 80 if cross_mode else self.min_score_threshold

                if score >= threshold:
                    results.append((
                        f"{s_schema}.{s_table}.{s_col}",
                        f"{t_schema}.{t_table}.{t_col}",
                        score
                    ))

        return results
    

    def _infer_between_tables_current_8(self, src_full, tgt_full, cross_mode=False):

        results = []

        s_schema, s_table = src_full.split(".")
        t_schema, t_table = tgt_full.split(".")

        # 🚨 DO NOT LINK SAME TABLES (prevents fake FK)
        if s_table == t_table:
            return []

        src_cols = self.source_db.adapter.get_columns(s_schema, s_table)
        tgt_cols = self.target_db.adapter.get_columns(t_schema, t_table)

        for s_col in src_cols:
            for t_col in tgt_cols:

                s_col = self._norm(s_col)
                t_col = self._norm(t_col)

                if not self._is_fk_candidate(s_col, t_col):
                    continue

                score = self._score_fk(
                    s_schema, s_table, s_col,
                    t_schema, t_table, t_col
                )

                # ✅ BOOST parent table likelihood
                if t_table.endswith("_target") or t_table in ("accounts",):
                    score += 10

                # ✅ LOWER threshold for cross-table discovery
                threshold = 65 if cross_mode else self.min_score_threshold

                if score >= threshold:
                    results.append((
                        f"{s_schema}.{s_table}.{s_col}",
                        f"{t_schema}.{t_table}.{t_col}",
                        score
                    ))

        return results
    


    




    def __init___current_9(self, source_db=None, target_db=None, engine_db=None, batch_id=None, **kwargs):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id

    # --------------------------------------------------
    # MAIN ENTRYPOINT
    # --------------------------------------------------
    def infer_current_9(self, table_matches: List[Tuple[str, str, float]]) -> List[Tuple]:
        results = []

        for source_table, target_table, match_score in table_matches:

            if self._is_system_table(source_table) or self._is_system_table(target_table):
                continue

            source_columns = self._get_columns(source_table, self.source_db)
            target_columns = self._get_columns(target_table, self.target_db)

            for s_col in source_columns:
                for t_col in target_columns:

                    score = self._score_fk(s_col, t_col, match_score)

                    if score >= 70:
                        results.append((
                            self.batch_id,
                            source_table,
                            s_col,
                            target_table,
                            t_col,
                            score
                        ))

        return self._deduplicate(results)

    # --------------------------------------------------
    # COLUMN FETCH (FINAL FIX)
    # --------------------------------------------------
    def _get_columns_current_9a(self, table: str, conn) -> List[str]:
        if conn is None:
            return []

        schema, table_name = table.split(".")

        query = f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = '{schema}'
        AND table_name = '{table_name}'
        """

        try:
            # ✅ YOUR PLATFORM STYLE
            result = conn.execute(query)

            # handle different return formats safely
            if isinstance(result, list):
                return [row[0] for row in result]

            if hasattr(result, "fetchall"):
                return [row[0] for row in result.fetchall()]

            return []

        except Exception:
            return []
        
    def _get_columns_current_9(self, table: str, conn) -> List[str]:
        if conn is None:
            return []

        schema, table_name = table.split(".")

        query = f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = '{schema}'
        AND table_name = '{table_name}'
        """

        try:
            result = conn.execute(query)

            # Case 1: list of tuples
            if isinstance(result, list):
                if len(result) == 0:
                    return []
                if isinstance(result[0], tuple):
                    return [row[0] for row in result]

                # Case 2: list of dicts
                if isinstance(result[0], dict):
                    return [row.get("column_name") for row in result]

            # Case 3: cursor-like
            if hasattr(result, "fetchall"):
                rows = result.fetchall()
                return [row[0] for row in rows]

            # Case 4: iterable fallback
            try:
                return [row[0] for row in list(result)]
            except Exception:
                return []

        except Exception as e:
            print(f"[FK DEBUG] Column fetch failed for {table}: {e}")
            return []

    # --------------------------------------------------
    # SCORING
    # --------------------------------------------------
    def _score_fk_current_9(self, source_col: str, target_col: str, table_score: float) -> float:
        score = 0

        if source_col == target_col:
            score += 40

        if source_col.endswith("_id") and target_col.endswith("_id"):
            score += 25

        if source_col.replace("_id", "") == target_col.replace("_id", ""):
            score += 20

        score += table_score * 0.2

        return round(min(score, 100), 2)

    # --------------------------------------------------
    # FILTERS
    # --------------------------------------------------
    def _is_system_table_current_9(self, table: str) -> bool:
        return (
            table.startswith("information_schema")
            or table.startswith("pg_")
        )

    # --------------------------------------------------
    # DEDUPLICATION
    # --------------------------------------------------
    def _deduplicate_current_9(self, rows: List[Tuple]) -> List[Tuple]:
        seen = set()
        result = []

        for r in rows:
            key = (r[1], r[2], r[3], r[4])

            if key not in seen:
                seen.add(key)
                result.append(r)

        return result
    








    def __init___OLD(self, db):
        self.db = db


    def __init__(self, source_db, target_db):
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