

import time
import logging
from app.rule_factory import RuleFactory

logger = logging.getLogger(__name__)

class RuleExecutor:

    def __init__(self, engine_db, source_db, target_db, batch_id, project_id, control_id):
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

        for rule in rules:
            
            
            rule_id = rule[0]
            severity_level = rule[2]

            entities = self._get_rule_entities(rule_id)

            for entity in entities:

                total_rules += 1

                parameters = self._build_parameters(entity)

                            # -----------------------------------------
                # RULE EXECUTION LOG
                # -----------------------------------------
                dataset_name = entity[1]
                logger.info(f"Running rule {rule_id} for {dataset_name}")

                rule_instance = RuleFactory.create(
                    rule_id,
                    self.source_db,
                    self.target_db,
                    parameters
                )

                rule_instance = RuleFactory.create(
                    rule_id,
                    self.source_db,
                    self.target_db,
                    parameters
                )

                start_time = time.time()

                try:

                    result = rule_instance.execute()

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

                execution_time = round(time.time() - start_time, 4)

                self._log_rule_execution(
                    rule_id,
                    entity,
                    execution_status,
                    delta,
                    execution_time,
                    severity_level
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
            m.target_table
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

            entity_name = f"{source_schema}.{source_table}"

            entities.append((
                mapping_id,
                entity_name,
                source_schema,
                source_table,
                target_schema,
                target_table
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

    def _log_rule_execution(self, rule_id, entity, status, delta, execution_time, severity):

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