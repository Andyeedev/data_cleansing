import time
from collections import defaultdict
from datetime import datetime
from app.rule_factory import RuleFactory
from app.utils.logger import get_logger


MAX_RETRIES = 2


logger = get_logger(__name__)


class RuleExecutor:

    def __init__(self, engine_db, source_db, target_db, batch_id, project_id, control_id,
                 config=None, source_connections=None, target_connections=None):
        self.engine_db = engine_db
        self.source_db = source_db
        self.target_db = target_db
        self.batch_id = batch_id
        self.project_id = project_id
        self.control_id = control_id
        self.source_connections = source_connections or {}
        self.target_connections = target_connections or {}

        config = config or {}

        self.profiling_enabled = config.get("profiling_enabled", True)
        self.slow_threshold = config.get("slow_threshold", .5)
        self.very_slow_threshold = config.get("very_slow_threshold", 2)

    # ---------------------------------------------------------
    # PUBLIC ENTRY
    # ---------------------------------------------------------

    def execute_rules(self):

        rules = self._get_rules()

        total_rules = 0
        passed = 0
        failed = 0
        errors = 0
        skipped = 0
        blocked = False

        # Track rule execution statuses for control status determination
        rule_execution_statuses = []

        # Track which systems we've already printed a header for in this control
        logged_systems = set()

        for rule in rules:

            rule_id = rule[0]
            severity_level = rule[2]

            entities = self._get_rule_entities(rule_id)

            # Group entities by source_system_id for grouped logging
            grouped_entities = defaultdict(list)
            for e in entities:
                grouped_entities[e[6]].append(e)

            for source_system_id, source_entities in grouped_entities.items():

                source_adapter = self.source_connections.get(source_system_id, self.source_db)
                s_type = source_adapter.config.get("type", "UNKNOWN").upper()

                if source_system_id not in logged_systems:
                    logger.info(f"        System: [ID: {source_system_id}] ({s_type})")
                    logged_systems.add(source_system_id)

                for entity in source_entities:

                    total_rules += 1

                    # -----------------------------------------
                    # WRAPPED IN TRY/EXCEPT — catch _build_parameters
                    # and RuleFactory.create failures too
                    # -----------------------------------------
                    start_time_epoch = time.time()
                    execution_status = "SKIPPED"
                    delta = 0
                    result = {"status": "SKIPPED"}
                    dataset_name = entity[1]

                    try:
                        parameters = self._build_parameters(entity)

                        target_system_id = entity[7]
                        target_adapter = self.target_connections.get(target_system_id, self.target_db)

                        logger.info(f"            Running {rule_id} for {dataset_name} ... ✅")

                        rule_instance = RuleFactory.create(
                            rule_id,
                            source_adapter,
                            target_adapter,
                            parameters
                        )

                        # Execute rule with retry protection
                        result = self.execute_with_retry(rule_instance.execute)

                        execution_status = result.get("status", "ERROR")
                        delta = result.get("delta", 0)

                    except Exception as _e:
                        execution_status = "ERROR"
                        delta = 0
                        result = {"status": "ERROR", "error": str(_e)}

                        self._log_exception(
                            rule_id,
                            entity[1],
                            str(_e),
                            cause="EXECUTION_ERROR",
                            failure_scope="rule_execution"
                        )

                    end_time_epoch = time.time()
                    execution_time = round(end_time_epoch - start_time_epoch, 4)

                    rule_start_time = datetime.fromtimestamp(start_time_epoch)
                    rule_end_time = datetime.fromtimestamp(end_time_epoch)

                    # Get system host for detail_json - handle adapter or config objects
                    def _get_host(adapter):
                        if hasattr(adapter, '_config'):
                            cfg = adapter._config
                            if isinstance(cfg, dict):
                                return cfg.get('host', 'unknown')
                            return getattr(cfg, 'host', 'unknown')
                        return getattr(adapter, 'host', 'unknown')

                    self._current_source_system = _get_host(source_adapter)
                    self._current_target_system = _get_host(target_adapter)

                    self._log_rule_execution(
                        rule_id,
                        entity,
                        execution_status,
                        delta,
                        execution_time,
                        severity_level,
                        rule_start_time,
                        rule_end_time,
                        result=result
                    )

                    # Track rule execution status for control-level summary
                    rule_execution_statuses.append(execution_status)

                    if execution_status == "FAIL":
                        self._log_exception(
                            rule_id,
                            entity[1],
                            result,
                            cause=result.get("cause", "VALIDATION_FAILURE"),
                            failure_scope=result.get("failure_scope", "rule_validation")
                        )

                        if severity_level and severity_level.upper() == "CRITICAL":
                            blocked = True

                    # Update counters
                    if execution_status == "PASS":
                        passed += 1
                    elif execution_status == "FAIL":
                        failed += 1
                    elif execution_status == "SKIPPED":
                        skipped += 1
                        self._log_exception(
                            rule_id,
                            entity[1],
                            result.get("message", "Skipped"),
                            cause=result.get("cause", "SKIPPED"),
                            failure_scope="rule_skip"
                        )
                    else:
                        errors += 1

        # Control status logic: 
        # - BLOCKED takes priority
        # - ERROR takes priority
        # - FAIL takes priority
        # - If all rules SKIPPED -> SKIPPED
        # - If any FAIL/ERROR -> FAILED
        # - Otherwise PASS
        if blocked:
            overall_status = "BLOCKED"
        elif errors > 0:
            overall_status = "ERROR"
        elif failed > 0:
            overall_status = "FAIL"
        elif rule_execution_statuses:
            if all(s == "SKIPPED" for s in rule_execution_statuses):
                overall_status = "SKIPPED"
            elif any(s in ("FAIL", "ERROR") for s in rule_execution_statuses):
                overall_status = "FAILED"
            else:
                overall_status = "PASS"
        else:
            overall_status = "SKIPPED"

        self._log_control_summary(
            overall_status,
            total_rules,
            passed,
            failed,
            errors,
            skipped
        )

    # ---------------------------------------------------------
    # RULE FETCH
    # ---------------------------------------------------------

    def _get_rules(self):

        query = """
        SELECT rule_id, rule_type, severity_level
        FROM engine.rule_registry
        WHERE control_id = %s
        AND enabled_flag = TRUE
        """

        return self.engine_db.execute(query, (self.control_id,))

    # ---------------------------------------------------------
    # ENTITY RESOLUTION
    # ---------------------------------------------------------

    def _get_rule_entities(self, rule_id):

        query = """
        SELECT
            m.mapping_id,
            m.source_schema,
            m.source_table,
            m.target_schema,
            m.target_table,
            m.source_system_id,
            m.target_system_id
        FROM core.dataset_mappings m
        JOIN core.rule_dataset_mapping rdm
            ON m.mapping_id = rdm.mapping_id
        WHERE rdm.rule_id = %s
        AND m.project_id = %s
        AND m.is_active = TRUE
        AND rdm.is_active = TRUE
        """

        rows = self.engine_db.execute(query, (rule_id, self.project_id))

        entities = []

        for row in rows:

            mapping_id = row[0]
            source_schema = row[1]
            source_table = row[2]
            target_schema = row[3]
            target_table = row[4]
            source_system_id = row[5]
            target_system_id = row[6]

            entity_name = f"{source_schema}.{source_table}"

            entities.append((
                mapping_id,
                entity_name,
                source_schema,
                source_table,
                target_schema,
                target_table,
                source_system_id,
                target_system_id
            ))

        return entities

    # ---------------------------------------------------------
    # PARAMETER BUILDER
    # ---------------------------------------------------------

    def _build_parameters(self, entity):

        mapping_id = entity[0]

        query = """
        SELECT
            source_schema,
            source_table,
            target_schema,
            target_table
        FROM core.dataset_mappings
        WHERE mapping_id = %s
        """

        row = self.engine_db.execute(query, (mapping_id,))[0]

        source_schema, source_table, target_schema, target_table = row

        primary_key = self._infer_primary_key(mapping_id)
        numeric_column = self._infer_numeric_column(mapping_id)
        all_numeric_columns = self._infer_all_numeric_columns(mapping_id)
        child_table, parent_table, fk_column = self._infer_fk_metadata(mapping_id)

        if not all_numeric_columns and numeric_column:
            all_numeric_columns = [numeric_column]

        return {
            "engine_db": self.engine_db,     # 🔥 REQUIRED
            "mapping_id": mapping_id,
            "source_schema": source_schema,
            "source_table": source_table,
            "target_schema": target_schema,
            "target_table": target_table,
            "primary_key_column": primary_key,
            "numeric_column": numeric_column,
            "numeric_columns": all_numeric_columns,
            "child_table": child_table,
            "parent_table": parent_table,
            "fk_column": fk_column
        }

    # ---------------------------------------------------------
    # LOGGING
    # ---------------------------------------------------------

    def _log_control_summary(self, overall_status, total, passed, failed, errors, skipped=0):

        query = """
        INSERT INTO engine.migration_control_summary
        (batch_id, control_id, overall_status,
         total_rules, passed_rules, failed_rules, error_rules, skipped_rules)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (batch_id, control_id) DO UPDATE SET
            overall_status = EXCLUDED.overall_status,
            total_rules = EXCLUDED.total_rules,
            passed_rules = EXCLUDED.passed_rules,
            failed_rules = EXCLUDED.failed_rules,
            error_rules = EXCLUDED.error_rules,
            skipped_rules = EXCLUDED.skipped_rules
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.control_id,
            overall_status,
            total,
            passed,
            failed,
            errors,
            skipped
        ))

    def _log_rule_execution(self, rule_id, entity, status, delta, execution_time,
                            severity, start_time, end_time, result=None):

        # -----------------------------------------
        # Slow classification
        # -----------------------------------------
        if self.profiling_enabled:

            if execution_time >= self.very_slow_threshold:
                slow_flag = "VERY_SLOW"

            elif execution_time >= self.slow_threshold:
                slow_flag = "SLOW"

            else:
                slow_flag = "NORMAL"

        else:
            slow_flag = None

        # -----------------------------------------
        # Build enriched detail_json with column context
        # -----------------------------------------
        import json
        detail_json = None
        
        if result and isinstance(result, dict):
            reserved = {"status", "delta", "source_value", "target_value", "source_count", "target_count", "query", "error", "skip_reason", "cause", "message", "column_results", "columns_checked", "failure_scope", "relevant_columns"}
            extra = {k: v for k, v in result.items() if k not in reserved}
            
            # Build rich column context based on control type
            relevant_columns = self._build_relevant_columns_context(entity, result)
            
            # Always include core fields if present
            core_fields = {
                "query": result.get("query"),
                "source_count": result.get("source_count"),
                "target_count": result.get("target_count"),
                "source_system": getattr(self, '_current_source_system', None),
                "target_system": getattr(self, '_current_target_system', None),
                "delta": result.get("delta"),
                "error": result.get("error"),
                "skip_reason": result.get("skip_reason"),
                "cause": result.get("cause"),
                "message": result.get("message"),
                "column_results": result.get("column_results"),
                "columns_checked": result.get("columns_checked"),
                "relevant_columns": relevant_columns,
            }
            # Filter out None values
            core_fields = {k: v for k, v in core_fields.items() if v is not None}
            
            # Merge extra with core
            combined = {**core_fields, **extra}
            if combined:
                detail_json = json.dumps(combined, default=str)
        else:
            # No result dict, create minimal detail_json with column context
            relevant_columns = self._build_relevant_columns_context(entity, result)
            detail_json = json.dumps({"delta": delta, "relevant_columns": relevant_columns}, default=str)

        query = """
        INSERT INTO engine.migration_control_execution
        (batch_id, control_id, rule_id, entity_name,
        execution_status, delta_value, execution_time_seconds,
        severity_level, mapping_id,
        rule_start_time, rule_end_time,
        slow_flag, detail_json)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s::jsonb)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.control_id,
            rule_id,
            entity[1],
            status,
            delta,
            execution_time,
            severity,
            entity[0],
            start_time,
            end_time,
            slow_flag,
            detail_json
        ))

    def _log_exception(self, rule_id, entity_name, error, cause=None, failure_scope=None):

        query = """
        INSERT INTO engine.migration_control_exceptions
        (batch_id, control_id, rule_id, entity_name,
         source_value, target_value, delta_value, cause, failure_scope)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.control_id,
            rule_id,
            entity_name,
            "N/A",
            str(error),
            0,
            cause,
            failure_scope
        ))

    # ---------------------------------------------------------
    # METADATA INFERENCE
    # ---------------------------------------------------------

    def _build_relevant_columns_context(self, entity, result):
        """
        Build rich column context for detail_json based on control type.
        entity tuple: (mapping_id, entity_name, source_schema, source_table, target_schema, target_table, source_system_id, target_system_id)
        """
        mapping_id = entity[0]
        control_id = self.control_id
        status = result.get("status") if isinstance(result, dict) else "UNKNOWN"
        
        if control_id == "C02":
            return self._build_c02_columns_context(mapping_id, status)
        elif control_id == "C01":
            return self._build_c01_columns_context(mapping_id, status)
        elif control_id in ("C08", "C010"):
            return self._build_c08_c10_columns_context(mapping_id, status)
        elif control_id in ("C03", "C09"):
            return self._build_c03_c09_columns_context(mapping_id, status)
        elif control_id == "C04":
            return self._build_c04_columns_context(mapping_id, status)
        else:
            return self._build_generic_columns_context(mapping_id, status, control_id)

    def _get_mapping_columns(self, mapping_id):
        """Get all columns for a mapping with full metadata."""
        query = """
        SELECT column_name, column_position, data_type, column_side, inferred_role, is_primary_key, is_foreign_key
        FROM core.dataset_columns
        WHERE mapping_id = %s
        ORDER BY column_side, column_position
        """
        rows = self.engine_db.execute(query, (mapping_id,))
        return [{
            "column": r[0], "position": r[1], "data_type": r[2], 
            "side": r[3], "inferred_role": r[4], "is_pk": r[5], "is_fk": r[6]
        } for r in rows]

    def _build_c02_columns_context(self, mapping_id, status):
        """C02_BALANCE_RECON - Financial Aggregate Reconciliation (SUM of numeric columns)"""
        cols = self._get_mapping_columns(mapping_id)
        source_cols = [c for c in cols if c["side"] == "SOURCE"]
        target_cols = [c for c in cols if c["side"] == "TARGET"]
        
        numeric_source = [c for c in source_cols if c["inferred_role"] == "NUMERIC_METRIC"]
        numeric_target = [c for c in target_cols if c["inferred_role"] == "NUMERIC_METRIC"]
        other_source = [c for c in source_cols if c["inferred_role"] != "NUMERIC_METRIC"]
        other_target = [c for c in target_cols if c["inferred_role"] != "NUMERIC_METRIC"]
        
        calc_parts = [f"SUM(source.{c['column']})" for c in numeric_source]
        calc_parts_t = [f"SUM(target.{c['column']})" for c in numeric_target]
        
        if numeric_source or numeric_target:
            calc_str = f"{' + '.join(calc_parts) if calc_parts else '0'} vs {' + '.join(calc_parts_t) if calc_parts_t else '0'}"
        else:
            # Build helpful message explaining WHY skipped
            table_name = self._get_table_name(mapping_id)
            skipped_reason = f"Table {table_name} has no numeric columns (decimal/numeric/float/real). Only columns with inferred_role='NUMERIC_METRIC' are used for balance reconciliation. Tables without financial/monetary columns (e.g., lookup tables, dimension tables) are correctly skipped."
            calc_str = f"SKIPPED: {skipped_reason}"
        
        return {
            "control_id": "C02_BALANCE_RECON",
            "entity": self._get_table_name(mapping_id),
            "status": status,
            "relevant_columns": {
                "source": [
                    {**c, "used_in_calculation": f"SUM({c['column']})"} for c in numeric_source
                ] + [
                    {**c, "note": "Excluded: int/bigint not in numeric whitelist (only decimal/numeric/float/real)"} for c in other_source if c["data_type"] in ("int", "bigint", "smallint")
                ] + [
                    {**c, "note": f"Excluded: {c['data_type']} not a numeric type"} for c in other_source if c["data_type"] not in ("int", "bigint", "smallint")
                ],
                "target": [
                    {**c, "used_in_calculation": f"SUM({c['column']})"} for c in numeric_target
                ] + [
                    {**c, "note": "Excluded: int/bigint not in numeric whitelist"} for c in other_target if c["data_type"] in ("int", "bigint", "smallint")
                ] + [
                    {**c, "note": f"Excluded: {c['data_type']} not a numeric type"} for c in other_target if c["data_type"] not in ("int", "bigint", "smallint")
                ],
                "calculation": calc_str
            }
        }

    def _build_c01_columns_context(self, mapping_id, status):
        """C01_ROWCOUNT - Row Count Match Validation (COUNT of PRIMARY_KEY)"""
        cols = self._get_mapping_columns(mapping_id)
        source_pk = [c for c in cols if c["side"] == "SOURCE" and c["inferred_role"] == "PRIMARY_KEY"]
        target_pk = [c for c in cols if c["side"] == "TARGET" and c["inferred_role"] == "PRIMARY_KEY"]
        source_cols = [c for c in cols if c["side"] == "SOURCE"]
        
        return {
            "control_id": "C01_ROWCOUNT",
            "entity": self._get_table_name(mapping_id),
            "status": status,
            "relevant_columns": {
                "source": [
                    {**c, "used_in_calculation": f"COUNT({c['column']})"} for c in source_pk
                ] + [
                    {**c, "note": "Should be PRIMARY_KEY but not tagged"} for c in source_cols if c["inferred_role"] is None and c["column"].lower().endswith("_id")
                ],
                "target": [
                    {**c, "used_in_calculation": f"COUNT({c['column']})"} for c in target_pk
                ],
                "calculation": f"COUNT(source.{source_pk[0]['column'] if source_pk else 'N/A'}) vs COUNT(target.{target_pk[0]['column'] if target_pk else 'N/A'})",
                "action_required": "Tag primary key column as PRIMARY_KEY in core.dataset_columns" if not source_pk else None
            }
        }

    def _build_c08_c10_columns_context(self, mapping_id, status):
        """C08_DATA_DRIFT / C10_SCHEMA_COMPARISON - Schema Drift Detection"""
        cols = self._get_mapping_columns(mapping_id)
        source_cols = {c["column"]: c for c in cols if c["side"] == "SOURCE"}
        target_cols = {c["column"]: c for c in cols if c["side"] == "TARGET"}
        
        all_cols = set(source_cols.keys()) | set(target_cols.keys())
        
        matched = []
        type_mismatch = []
        source_only = []
        target_only = []
        
        for col_name in sorted(all_cols):
            s = source_cols.get(col_name)
            t = target_cols.get(col_name)
            
            if s and t:
                if s["data_type"] == t["data_type"]:
                    matched.append({"column": col_name, "source_type": s["data_type"], "target_type": t["data_type"], "match": True})
                else:
                    type_mismatch.append({"column": col_name, "source_type": s["data_type"], "target_type": t["data_type"], "severity": "HIGH", "note": "Precision loss risk"})
            elif s:
                source_only.append({"column": col_name, "data_type": s["data_type"], "inferred_role": s["inferred_role"], "note": "Exists in source, missing in target"})
            elif t:
                target_only.append({"column": col_name, "data_type": t["data_type"], "inferred_role": t["inferred_role"], "note": "Exists in target, missing in source"})
        
        return {
            "control_id": self.control_id,
            "entity": self._get_table_name(mapping_id),
            "status": status,
            "relevant_columns": {
                "matched": matched,
                "type_mismatch": type_mismatch,
                "source_only": source_only,
                "target_only": target_only
            },
            "summary": {
                "source_cols": len(source_cols),
                "target_cols": len(target_cols),
                "matched": len(matched),
                "mismatched": len(type_mismatch),
                "source_only": len(source_only),
                "target_only": len(target_only)
            }
        }

    def _build_c03_c09_columns_context(self, mapping_id, status):
        """C03_REFERENTIAL / C09_REFERENTIAL_COVERAGE - Foreign Key Relationship"""
        cols = self._get_mapping_columns(mapping_id)
        source_fks = [c for c in cols if c["side"] == "SOURCE" and c["inferred_role"] == "FOREIGN_KEY"]
        target_fks = [c for c in cols if c["side"] == "TARGET" and c["inferred_role"] == "FOREIGN_KEY"]
        
        def enrich_fk(fk_cols, side):
            enriched = []
            for fk in fk_cols:
                ref_table = self._get_referenced_table(mapping_id, fk["column"], side)
                pk_tagged = self._is_pk_tagged(ref_table, fk["column"]) if ref_table else False
                enriched.append({
                    "column": fk["column"],
                    "data_type": fk["data_type"],
                    "inferred_role": fk["inferred_role"],
                    "references": f"{ref_table}.{fk['column']}" if ref_table else "unknown",
                    "referenced_pk_tagged": pk_tagged
                })
            return enriched
        
        return {
            "control_id": self.control_id,
            "entity": self._get_table_name(mapping_id),
            "status": status,
            "relevant_columns": {
                "source_fk_columns": enrich_fk(source_fks, "SOURCE"),
                "target_fk_columns": enrich_fk(target_fks, "TARGET"),
                "calculation": "COUNT(orphans) where FK NOT IN (SELECT PK FROM referenced_table)",
                "action_required": "Tag FK columns as FOREIGN_KEY and referenced PK as PRIMARY_KEY" if not source_fks else None
            }
        }

    def _build_c04_columns_context(self, mapping_id, status):
        """C04_COLUMN_COUNT - Column Count Match"""
        cols = self._get_mapping_columns(mapping_id)
        source_cols = [c for c in cols if c["side"] == "SOURCE"]
        target_cols = [c for c in cols if c["side"] == "TARGET"]
        
        source_names = {c["column"] for c in source_cols}
        target_names = {c["column"] for c in target_cols}
        missing_in_target = list(source_names - target_names)
        
        return {
            "control_id": "C04_COLUMN_COUNT",
            "entity": self._get_table_name(mapping_id),
            "status": status,
            "relevant_columns": {
                "source": [{"column": c["column"], "data_type": c["data_type"]} for c in source_cols],
                "target": [{"column": c["column"], "data_type": c["data_type"]} for c in target_cols],
                "calculation": "COUNT(source.columns) vs COUNT(target.columns)",
                "source_count": len(source_cols),
                "target_count": len(target_cols),
                "delta": len(source_cols) - len(target_cols),
                "missing_in_target": missing_in_target
            }
        }

    def _build_generic_columns_context(self, mapping_id, status, control_id):
        """Generic fallback for other controls."""
        cols = self._get_mapping_columns(mapping_id)
        source_cols = [c for c in cols if c["side"] == "SOURCE"]
        target_cols = [c for c in cols if c["side"] == "TARGET"]
        
        return {
            "control_id": control_id,
            "entity": self._get_table_name(mapping_id),
            "status": status,
            "relevant_columns": {
                "source": [{"column": c["column"], "data_type": c["data_type"], "inferred_role": c["inferred_role"]} for c in source_cols],
                "target": [{"column": c["column"], "data_type": c["data_type"], "inferred_role": c["inferred_role"]} for c in target_cols]
            }
        }

    def _infer_primary_key(self, mapping_id):

        query = """
        SELECT column_name
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND inferred_role = 'PRIMARY_KEY'
        LIMIT 1
        """

        row = self.engine_db.execute(query, (mapping_id,))

        return row[0][0] if row else None

    def _infer_numeric_column(self, mapping_id):

        query = """
        SELECT column_name
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND inferred_role = 'NUMERIC_METRIC'
        LIMIT 1
        """

        row = self.engine_db.execute(query, (mapping_id,))

        return row[0][0] if row else None

    def _get_table_name(self, mapping_id):
        """Get table name from mapping_id."""
        query = "SELECT source_schema, source_table FROM core.dataset_mappings WHERE mapping_id = %s"
        row = self.engine_db.execute(query, (mapping_id,))
        if row:
            return f"{row[0][0]}.{row[0][1]}"
        return "unknown"

    def _get_referenced_table(self, mapping_id, fk_column, side):
        """Get referenced table for a foreign key column."""
        query = """
        SELECT target_table FROM core.dataset_mappings 
        WHERE project_id = %s AND target_table IN (
            SELECT referenced_table FROM core.dataset_columns 
            WHERE mapping_id = %s AND column_name = %s AND column_side = %s AND is_foreign_key = TRUE
        )
        """
        # Simplified - would need proper FK metadata
        # For now, infer from common patterns
        if fk_column.lower().endswith("_id"):
            base = fk_column[:-3]
            # Check if there's a mapping for that table
            q = "SELECT target_table FROM core.dataset_mappings WHERE project_id = %s AND target_table = %s"
            row = self.engine_db.execute(q, (self.project_id, base))
            if row:
                return row[0][0]
        return None

    def _is_pk_tagged(self, table_name, column):
        """Check if a table's column is tagged as PRIMARY_KEY."""
        if not table_name:
            return False
        query = """
        SELECT 1 FROM core.dataset_columns dc
        JOIN core.dataset_mappings dm ON dc.mapping_id = dm.mapping_id
        WHERE dm.target_table = %s AND dc.column_name = %s AND dc.inferred_role = 'PRIMARY_KEY' AND dc.column_side = 'SOURCE'
        """
        row = self.engine_db.execute(query, (table_name, column))
        return bool(row)

        query = """
        SELECT column_name
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND inferred_role = 'PRIMARY_KEY'
        LIMIT 1
        """

        row = self.engine_db.execute(query, (mapping_id,))

        return row[0][0] if row else None

    def _infer_numeric_column(self, mapping_id):

        query = """
        SELECT column_name
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND inferred_role = 'NUMERIC_METRIC'
        LIMIT 1
        """

        row = self.engine_db.execute(query, (mapping_id,))

        return row[0][0] if row else None

    def _infer_all_numeric_columns(self, mapping_id):

        query = """
        SELECT column_name
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND inferred_role = 'NUMERIC_METRIC'
        ORDER BY column_position
        """

        rows = self.engine_db.execute(query, (mapping_id,))

        return [row[0] for row in rows]

    def _infer_fk_metadata(self, mapping_id):

        query = """
        SELECT column_name, referenced_table, referenced_column
        FROM core.dataset_columns
        WHERE mapping_id = %s
        AND is_foreign_key = TRUE
        LIMIT 1
        """

        row = self.engine_db.execute(query, (mapping_id,))

        if row:
            return row[0][0], row[0][1], row[0][2]
        return None, None, None

    def execute_with_retry(self, rule_function, *args):

        # Rule Retry Engine
        # If a rule fails due to transient issues (network, lock, temporary table),
        # retry automatically.

        retries = 0

        while retries <= MAX_RETRIES:

            try:
                return rule_function(*args)

            except Exception:

                if retries == MAX_RETRIES:
                    raise

                retries += 1
                time.sleep(1)
