class FKConstraintValidator:

    def __init___legacy(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id

    def __init___current_1(
        self,
        source_db,
        engine_db,
        batch_id,
        inferred_fks=None,
        real_fks=None
    ):
        self.source_db = source_db
        self.engine_db = engine_db
        self.batch_id = batch_id

        # ✅ CRITICAL FIX
        self.inferred_fks = inferred_fks or []
        self.real_fks = real_fks or []

    def __init__(
        self,
        source_adapter,
        engine_db,
        batch_id,
        inferred_fks=None,
        real_fks=None
    ):
        self.source_adapter = source_adapter
        self.engine_db = engine_db
        self.batch_id = batch_id
        self.inferred_fks = inferred_fks or []
        self.real_fks = real_fks or []
        

    def run_legacy(self):

        from app.intelligence.constraints.constraint_loader import ConstraintLoader

        loader = ConstraintLoader(self.source_db, self.target_db)
        real = loader.load()

        inferred = self._get_inferred()

        results = self._compare(real, inferred)

        print(f"[DEBUG] FK Validation Results: {"TESTING :::",results}")

        self._persist(results)

        return results
    
    def run(self):

        validation_summary = self._validate_constraints()

        print(f"[DEBUG] FK Validation Summary: {validation_summary}")

        # ✅ Convert summary → flat rows
        results = self._transform_to_rows(validation_summary)

        print(f"[DEBUG] FK Rows for Persist: {results}")

        self._persist(results)

        return validation_summary

    # -----------------------------------------
    # FETCH INFERRED
    # -----------------------------------------
    def _get_inferred(self):

        rows = self.engine_db.execute("""
            SELECT source_column, target_column
            FROM engine.fk_inference_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        return set((r[0], r[1]) for r in rows)

    # -----------------------------------------
    # COMPARE
    # -----------------------------------------
    def _compare(self, real, inferred):

        real_all = real["source"].union(real["target"])

        matched = inferred.intersection(real_all)
        missing = inferred - real_all
        undocumented = real_all - inferred

        return {
            "matched": list(matched),
            "missing_in_db": list(missing),
            "not_inferred": list(undocumented),
            "coverage_pct": self._coverage(matched, real_all)
        }

    def _coverage(self, matched, real_all):

        if not real_all:
            return 100

        return round((len(matched) / len(real_all)) * 100, 2)

    # -----------------------------------------
    # PERSIST
    # -----------------------------------------
    def _persist_legacy(self, results):

        import json

        self.engine_db.execute("""
        INSERT INTO engine.fk_constraint_validation
        (batch_id, result_json)
        VALUES (%s,%s)
        """, (self.batch_id, json.dumps(results)))

    def _persist(self, results):

        query = """
        INSERT INTO engine.fk_constraint_validation (
            batch_id,
            source_schema,
            source_table,
            source_column,
            target_schema,
            target_table,
            target_column,
            is_valid,
            validation_type,
            confidence_score
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """

        for r in results:

            try:
                self.engine_db.execute(query, (
                    self.batch_id,
                    r.get("source_schema"),
                    r.get("source_table"),
                    r.get("source_column"),
                    r.get("target_schema"),
                    r.get("target_table"),
                    r.get("target_column"),
                    r.get("is_valid"),
                    r.get("validation_type"),
                    r.get("confidence_score", None)  # optional
                ))

            except Exception as e:
                print(f"[FK Persist ERROR] {r} → {e}")


    def _transform_to_rows_legacy(self, summary):

        rows = []

        # ✅ Missing in DB → inferred but not real FK
        for src, tgt in summary.get("missing_in_db", []):

            src_schema, src_table, src_col = src.split(".")
            tgt_schema, tgt_table, tgt_col = tgt.split(".")

            rows.append({
                "source_schema": src_schema,
                "source_table": src_table,
                "source_column": src_col,
                "target_schema": tgt_schema,
                "target_table": tgt_table,
                "target_column": tgt_col,
                "is_valid": False,
                "validation_type": "inferred",
                "confidence_score": 0.5  # optional default
            })

        # ✅ Matched → valid FK
        for src, tgt in summary.get("matched", []):

            src_schema, src_table, src_col = src.split(".")
            tgt_schema, tgt_table, tgt_col = tgt.split(".")

            rows.append({
                "source_schema": src_schema,
                "source_table": src_table,
                "source_column": src_col,
                "target_schema": tgt_schema,
                "target_table": tgt_table,
                "target_column": tgt_col,
                "is_valid": True,
                "validation_type": "real",
                "confidence_score": 1.0
            })

        return rows



    def _transform_to_rows_legacy_2(self, summary):

        rows = []

        # -----------------------------
        # Helper: safe split
        # -----------------------------
        def split_fk(fk_string):
            parts = fk_string.split(".")
            if len(parts) != 3:
                return None, None, None
            return parts

        # -----------------------------
        # Missing (invalid inferred)
        # -----------------------------
        for item in summary.get("missing_in_db", []):

            src, tgt = item

            src_schema, src_table, src_col = split_fk(src)
            tgt_schema, tgt_table, tgt_col = split_fk(tgt)

            rows.append({
                "source_schema": src_schema,
                "source_table": src_table,
                "source_column": src_col,
                "target_schema": tgt_schema,
                "target_table": tgt_table,
                "target_column": tgt_col,
                "is_valid": False,
                "validation_type": "inferred",
                "confidence_score": 0.5
            })

        # -----------------------------
        # Matched (valid)
        # -----------------------------
        for item in summary.get("matched", []):

            src, tgt = item

            src_schema, src_table, src_col = split_fk(src)
            tgt_schema, tgt_table, tgt_col = split_fk(tgt)

            rows.append({
                "source_schema": src_schema,
                "source_table": src_table,
                "source_column": src_col,
                "target_schema": tgt_schema,
                "target_table": tgt_table,
                "target_column": tgt_col,
                "is_valid": True,
                "validation_type": "real",
                "confidence_score": 1.0
            })

        return rows



    def _transform_to_rows(self, summary):

        rows = []

        # 🔴 inferred but NOT real
        for src, tgt, score in summary.get("missing_in_db", []):

            src_schema, src_table, src_col = src.split(".")
            tgt_schema, tgt_table, tgt_col = tgt.split(".")

            rows.append({
                "source_schema": src_schema,
                "source_table": src_table,
                "source_column": src_col,
                "target_schema": tgt_schema,
                "target_table": tgt_table,
                "target_column": tgt_col,
                "is_valid": False,
                "validation_type": "inferred",
                "confidence_score": score
            })

        # 🟢 matched
        for src, tgt, score in summary.get("matched", []):

            src_schema, src_table, src_col = src.split(".")
            tgt_schema, tgt_table, tgt_col = tgt.split(".")

            rows.append({
                "source_schema": src_schema,
                "source_table": src_table,
                "source_column": src_col,
                "target_schema": tgt_schema,
                "target_table": tgt_table,
                "target_column": tgt_col,
                "is_valid": True,
                "validation_type": "real",
                "confidence_score": score
            })

        return rows


    def _validate_constraints_legacy(self):

        matched = []
        missing_in_db = []
        not_inferred = []

        # Normalize inputs
        inferred = self.inferred_fks or []
        real = self.real_fks or []

        # Convert to comparable sets
        inferred_set = set([
            (f["source"], f["target"]) for f in inferred
        ]) if inferred and isinstance(inferred[0], dict) else set(inferred)

        real_set = set(real)

        # Compare
        for fk in inferred_set:
            if fk in real_set:
                matched.append(fk)
            else:
                missing_in_db.append(fk)

        for fk in real_set:
            if fk not in inferred_set:
                not_inferred.append(fk)

        coverage = 0
        if real_set:
            coverage = round((len(matched) / len(real_set)) * 100, 2)

        return {
            "matched": matched,
            "missing_in_db": missing_in_db,
            "not_inferred": not_inferred,
            "coverage_pct": coverage
        }
    

    
    def _validate_constraints_legacy_2(self):

        matched = []
        missing_in_db = []
        not_inferred = []

        # -----------------------------
        # NORMALISE INFERRED FKs
        # -----------------------------
        inferred_set = set()

        for fk in self.inferred_fks or []:
            if isinstance(fk, tuple):
                # (src, tgt, confidence) OR (src, tgt)
                src = fk[0]
                tgt = fk[1]
                inferred_set.add((src, tgt))

            elif isinstance(fk, dict):
                inferred_set.add((fk["source"], fk["target"]))

        # -----------------------------
        # NORMALISE REAL FKs
        # -----------------------------
        real_set = set(self.real_fks or [])

        # -----------------------------
        # COMPARE
        # -----------------------------
        for fk in inferred_set:
            if fk in real_set:
                matched.append(fk)
            else:
                missing_in_db.append(fk)

        for fk in real_set:
            if fk not in inferred_set:
                not_inferred.append(fk)

        coverage = 0
        if real_set:
            coverage = round((len(matched) / len(real_set)) * 100, 2)

        return {
            "matched": matched,
            "missing_in_db": missing_in_db,
            "not_inferred": not_inferred,
            "coverage_pct": coverage
        }
    
    def _validate_constraints(self):

        matched = []
        missing_in_db = []
        not_inferred = []

        inferred = self.inferred_fks or []
        real = self.real_fks or []

        # ✅ Normalize inferred WITH score
        inferred_map = {}

        for fk in inferred:
            if isinstance(fk, tuple) and len(fk) == 3:
                src, tgt, score = fk
                inferred_map[(src, tgt)] = score
            elif isinstance(fk, dict):
                inferred_map[(fk["source"], fk["target"])] = fk.get("confidence", 0.5)

        inferred_set = set(inferred_map.keys())
        real_set = set(real)

        # Compare
        for fk in inferred_set:
            if fk in real_set:
                matched.append((fk[0], fk[1], inferred_map[fk]))
            else:
                missing_in_db.append((fk[0], fk[1], inferred_map[fk]))

        for fk in real_set:
            if fk not in inferred_set:
                not_inferred.append(fk)

        coverage = 0
        if real_set:
            coverage = round((len(matched) / len(real_set)) * 100, 2)

        return {
            "matched": matched,
            "missing_in_db": missing_in_db,
            "not_inferred": not_inferred,
            "coverage_pct": coverage
        }