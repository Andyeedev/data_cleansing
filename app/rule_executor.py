

from ast import If
import time
#import logging
from app.rule_factory import RuleFactory

#logger = logging.getLogger(__name__)
from app.utils.logger import get_logger


MAX_RETRIES = 2


logger = get_logger(__name__)

class RuleExecutor:

    def __init__(self, engine_db, source_db, target_db, batch_id, project_id, control_id,
    config=None, source_connections=None, target_connections=None
    ):
        self.engine_db = engine_db
        self.source_db = source_db
        self.target_db = target_db
        self.batch_id = batch_id
        self.project_id = project_id
        self.control_id = control_id
        self.source_connections = source_connections or {}
        self.target_connections = target_connections or {}

    # -----------------------------------------
    # FIX: Profiling config (DEFAULT SAFE)
    # -----------------------------------------
        config = config or {}

        #self.profiling_enabled = config.get("profiling_enabled", True)
        #self.slow_threshold = config.get("slow_threshold", 5)
        #self.very_slow_threshold = config.get("very_slow_threshold", 10)

        self.profiling_enabled = config.get("profiling_enabled", True)
        self.slow_threshold = config.get("slow_threshold", .5)
        self.very_slow_threshold = config.get("very_slow_threshold", 2)


        #profiling_enabled: true
        #slow_threshold: 0.5
        #very_slow_threshold: 2

    def __init__legacy_1(self, engine_db, source_db, target_db, batch_id, project_id, control_id,
    config=None   # ← IMPORTANT ADD
    ):
        self.engine_db = engine_db
        self.source_db = source_db
        self.target_db = target_db
        self.batch_id = batch_id
        self.project_id = project_id
        self.control_id = control_id



    # ---------------------------------------------------------
    # PUBLIC ENTRY
    # ---------------------------------------------------------

    def execute_rules(self):

        rules = self._get_rules()

        total_rules = 0
        passed = 0
        failed = 0
        errors = 0
        blocked = False

        # Track which systems we've already printed a header for in this control
        logged_systems = set()

        for rule in rules:
            
            rule_id = rule[0]
            severity_level = rule[2]

            entities = self._get_rule_entities(rule_id)
            
            # Group entities by source_system_id for grouped logging
            from collections import defaultdict
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

                    parameters = self._build_parameters(entity)

                    # Look up correct source/target connection adapters
                    target_system_id = entity[7]
                    target_adapter = self.target_connections.get(target_system_id, self.target_db)

                    # -----------------------------------------
                    # RULE EXECUTION LOG
                    # -----------------------------------------
                    dataset_name = entity[1]
                    logger.info(f"            Running {rule_id} for {dataset_name} ... ✅")
                
                #logger.info(f"Starting batch {rule_id} for {dataset_name} [Source: {s_type} ({s_host}) -> Target: {t_type} ({t_host})]")
                #logger.info(
                #    f"    Control {self.control_id} running {rule_id} for {dataset_name} "
                #    f"[{s_type} ({s_host}) -> {t_type} ({t_host})]"
                #)

                rule_instance = RuleFactory.create(
                    rule_id,
                    source_adapter,
                    target_adapter,
                    parameters
                )

                #start_time = time.time()
                start_time_epoch = time.time()

                try:

                    # Execute rule with retry protection
                    result = self.execute_with_retry(rule_instance.execute)

                    execution_status = result.get("status", "ERROR")
                    delta = result.get("delta", 0)

                    if execution_status == "SKIPPED":
                        continue

                except Exception as e:

                    execution_status = "ERROR"
                    delta = 0

                    self._log_exception(
                        rule_id,
                        entity[1],
                        str(e)
                    )
                #execution_time = round(time.time() - start_time, 4)

                end_time_epoch = time.time()
                execution_time = round(end_time_epoch - start_time_epoch, 4)

                from datetime import datetime

                rule_start_time = datetime.fromtimestamp(start_time_epoch)
                rule_end_time = datetime.fromtimestamp(end_time_epoch)


                #self._log_rule_execution(
                #    rule_id,
                #    entity,
                #    execution_status,
                #    delta,
                #    execution_time,
                #    severity_level
                #)


                self._log_rule_execution(
                    rule_id,
                    entity,
                    execution_status,
                    delta,
                    execution_time,
                    severity_level,
                    rule_start_time,
                    rule_end_time
                )

                


                if execution_status == "FAIL":

                    self._log_exception(rule_id, entity[1], result)

                    if severity_level and severity_level.upper() == "CRITICAL":
                        blocked = True

                if execution_status == "PASS":
                    passed += 1
                elif execution_status == "FAIL":
                    failed += 1
                else:
                    errors += 1

        if blocked:
            overall_status = "BLOCKED"
        elif errors > 0:
            overall_status = "ERROR"
        elif failed > 0:
            overall_status = "FAIL"
        else:
            overall_status = "PASS"

        self._log_control_summary(
            overall_status,
            total_rules,
            passed,
            failed,
            errors
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

    def _build_parameters_legacy_1(self, entity):

        mapping_id = entity[0]

        primary_key = self._infer_primary_key(mapping_id)
        numeric_column = self._infer_numeric_column(mapping_id)

        return {
            "mapping_id": mapping_id,
            "source_schema": entity[2],
            "source_table": entity[3],
            "target_schema": entity[4],
            "target_table": entity[5],
            "primary_key_column": primary_key,
            "numeric_column": numeric_column
        }
    
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

        return {
            "engine_db": self.engine_db,     # 🔥 REQUIRED
            "mapping_id": mapping_id,
            "source_schema": source_schema,
            "source_table": source_table,
            "target_schema": target_schema,
            "target_table": target_table,
            "primary_key_column": primary_key,
            "numeric_column": numeric_column
        }


    # ---------------------------------------------------------
    # LOGGING
    # ---------------------------------------------------------

    def _log_control_summary(self, overall_status, total, passed, failed, errors):

        query = """
        INSERT INTO engine.migration_control_summary
        (batch_id, control_id, overall_status,
         total_rules, passed_rules, failed_rules, error_rules)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.control_id,
            overall_status,
            total,
            passed,
            failed,
            errors
        ))

    def _log_rule_execution_legacy(self, rule_id, entity, status, delta, execution_time, severity):

        query = """
        INSERT INTO engine.migration_control_execution
        (batch_id, control_id, rule_id, entity_name,
         execution_status, delta_value, execution_time_seconds,
         severity_level, mapping_id)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
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
            entity[0]
        ))


    
    def _log_rule_execution_legacy_2(self, rule_id, entity, status, delta, execution_time, severity, start_time, end_time):

        query = """
        INSERT INTO engine.migration_control_execution
        (batch_id, control_id, rule_id, entity_name,
        execution_status, delta_value, execution_time_seconds,
        severity_level, mapping_id,
        rule_start_time, rule_end_time)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
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
            end_time
        ))


    def _log_rule_execution(
        self, rule_id, entity, status, delta, execution_time, severity, start_time, end_time
    ):

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

        query = """
        INSERT INTO engine.migration_control_execution
        (batch_id, control_id, rule_id, entity_name,
        execution_status, delta_value, execution_time_seconds,
        severity_level, mapping_id,
        rule_start_time, rule_end_time,
        slow_flag)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
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
            slow_flag
        ))


    def _log_exception(self, rule_id, entity_name, error):

        query = """
        INSERT INTO engine.migration_control_exceptions
        (batch_id, control_id, rule_id, entity_name,
         source_value, target_value, delta_value)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        
        #cause = result.get("cause")
        #scope = result.get("failure_scope")

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
    





    def execute_with_retry(self, rule_function, *args):

        #Rule Retry Engine
        #If a rule fails due to transient issues (network, lock, temporary table), retry automatically.

        retries = 0

        while retries <= MAX_RETRIES:

            try:
                return rule_function(*args)

            except Exception as e:

                if retries == MAX_RETRIES:
                    raise

                retries += 1
                time.sleep(1)