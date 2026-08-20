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
                            str(_e)
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
                        self._log_exception(rule_id, entity[1], result)

                        if severity_level and severity_level.upper() == "CRITICAL":
                            blocked = True

                    # Update counters
                    if execution_status == "PASS":
                        passed += 1
                    elif execution_status == "FAIL":
                        failed += 1
                    elif execution_status == "SKIPPED":
                        skipped += 1
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
        child_table, parent_table, fk_column = self._infer_fk_metadata(mapping_id)

        return {
            "engine_db": self.engine_db,     # 🔥 REQUIRED
            "mapping_id": mapping_id,
            "source_schema": source_schema,
            "source_table": source_table,
            "target_schema": target_schema,
            "target_table": target_table,
            "primary_key_column": primary_key,
            "numeric_column": numeric_column,
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
        # Build detail_json for ALL statuses
        # -----------------------------------------
        import json
        detail_json = None
        
        if result and isinstance(result, dict):
            reserved = {"status", "delta", "source_value", "target_value", "source_count", "target_count", "query", "error", "skip_reason"}
            extra = {k: v for k, v in result.items() if k not in reserved}
            
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
            }
            # Filter out None values
            core_fields = {k: v for k, v in core_fields.items() if v is not None}
            
            # Merge extra with core
            combined = {**core_fields, **extra}
            if combined:
                detail_json = json.dumps(combined, default=str)
        else:
            # No result dict, create minimal detail_json
            detail_json = json.dumps({"delta": delta}, default=str)

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

    def _log_exception(self, rule_id, entity_name, error):

        query = """
        INSERT INTO engine.migration_control_exceptions
        (batch_id, control_id, rule_id, entity_name,
         source_value, target_value, delta_value)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.control_id,
            rule_id,
            entity_name,
            "N/A",
            str(error),
            0
        ))

    # ---------------------------------------------------------
    # METADATA INFERENCE
    # ---------------------------------------------------------

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
