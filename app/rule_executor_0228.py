import time
from app.rule_factory import RuleFactory


class RuleExecutor:


    def __init__(self, engine_db, source_db, target_db, batch_id, project_id, control_id):
        self.engine_db = engine_db
        self.source_db = source_db
        self.target_db = target_db
        self.batch_id = batch_id
        self.project_id = project_id   # NEW
        self.control_id = control_id

    # ---------------------------------------------------------
    # PUBLIC ENTRY (v1.2 - WITH SEVERITY MODEL)
    # ---------------------------------------------------------

    def execute_rules(self):

        rules = self._get_rules()

        # ------------------------------------------
        # Aggregation Counters
        # ------------------------------------------
        total_rules = 0
        passed = 0
        failed = 0
        errors = 0
        blocked = False   # NEW

        for rule in rules:

            rule_id = rule[0]
            rule_type = rule[1]
            severity_level = rule[2]  # NEW

            entities = self._get_rule_entities(rule_id)

            for entity in entities:

                total_rules += 1

                parameters = self._build_parameters(entity)

                rule_instance = RuleFactory.create(
                    rule_type,
                    self.source_db,
                    self.target_db,
                    parameters
                )

                start_time = time.time()

                try:
                    result = rule_instance.execute()
                    execution_status = result["status"]
                    delta = result.get("delta", 0)

                except Exception:
                    execution_status = "ERROR"
                    delta = 0

                    self._log_exception(
                        rule_id,
                        entity[1],
                        {
                            "source_value": "N/A",
                            "target_value": "N/A",
                            "delta": 0
                        }
                    )

                execution_time = round(time.time() - start_time, 4)

                # Log execution WITH severity
                self._log_rule_execution(
                    rule_id,
                    entity[1],
                    execution_status,
                    delta,
                    execution_time,
                    severity_level
                )

                if execution_status == "FAIL":
                    self._log_exception(rule_id, entity[1], result)

                    if severity_level and severity_level.upper() == "CRITICAL":
                        blocked = True

                # Update counters
                if execution_status == "PASS":
                    passed += 1
                elif execution_status == "FAIL":
                    failed += 1
                else:
                    errors += 1

        # ------------------------------------------
        # Determine Overall Control Status
        # ------------------------------------------

        if blocked:
            overall_status = "BLOCKED"
        elif errors > 0:
            overall_status = "ERROR"
        elif failed > 0:
            overall_status = "FAIL"
        else:
            overall_status = "PASS"

        # Persist control summary
        self._log_control_summary(
            overall_status,
            total_rules,
            passed,
            failed,
            errors
        )


    # ---------------------------------------------------------
    # CONTROL SUMMARY LOGGER
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

    # ---------------------------------------------------------
    # METADATA FETCH
    # ---------------------------------------------------------

    def _get_rules(self):
        query = """
        SELECT rule_id, rule_type, severity_level
        FROM engine.rule_registry
        WHERE control_id = %s
        AND enabled_flag = TRUE
        """
        return self.engine_db.execute(query, (self.control_id,))

    
    def _get_rule_entities(self, rule_id):

        query = """
        SELECT
            m.mapping_id,
            m.source_schema,
            m.source_table,
            m.target_schema,
            m.target_table,
            m.source_columns,
            m.target_columns
        FROM core.dataset_mappings m
        WHERE m.project_id = %s
        AND m.is_active = TRUE
        """

        rows = self.engine_db.execute(query, (self.project_id,))

        adapted = []

        for row in rows:

            mapping_id = row[0]
            source_schema = row[1]
            source_table = row[2]
            target_schema = row[3]
            target_table = row[4]
            source_columns = row[5]
            target_columns = row[6]

            # Backward compatibility adapter
            primary_key_column = source_columns[0] if source_columns else None
            numeric_column = source_columns[0] if source_columns else None

            adapted.append((
                mapping_id,
                f"{source_schema}.{source_table}",
                source_schema,
                source_table,
                target_schema,
                target_table,
                primary_key_column,
                None,  # filter_condition
                0,     # tolerance_value
                numeric_column
            ))

        return adapted



    # ---------------------------------------------------------
    # PARAM BUILD
    # ---------------------------------------------------------

    def _build_parameters(self, entity_row):

        return {
            "entity_name": entity_row[1],
            "source_schema": entity_row[2],
            "source_table": entity_row[3],
            "target_schema": entity_row[4],
            "target_table": entity_row[5],
            "primary_key_column": entity_row[6],
            "filter_condition": entity_row[7],
            "tolerance_value": entity_row[8] or 0,
            "numeric_column": entity_row[9]
        }

    # ---------------------------------------------------------
    # LOGGING - EXECUTION (NOW WITH SEVERITY)
    # ---------------------------------------------------------

    def _log_rule_execution(self, rule_id, entity_name, status, delta, execution_time, severity):

        
        query = """
        INSERT INTO engine.migration_control_execution
        (batch_id, control_id, rule_id, entity_name,
        execution_status, delta_value, execution_time_seconds, severity_level)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.control_id,
            rule_id,
            entity_name,
            status,
            delta,
            execution_time,
            severity
        ))


    # ---------------------------------------------------------
    # LOGGING - EXCEPTIONS (UNCHANGED)
    # ---------------------------------------------------------

    def _log_exception(self, rule_id, entity_name, result):

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
            str(result.get("source_value")),
            str(result.get("target_value")),
            result.get("delta", 0)
        ))
