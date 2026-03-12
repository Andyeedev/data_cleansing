#from asyncio.log import logger
import uuid
from .db_connector import DBConnector
from .rule_executor import RuleExecutor
from .scoring_engine import ScoringEngine
from app.discovery.auto_rule_discovery import AutoRuleDiscovery
from app.utils.logger import get_logger

#logger = get_logger(__name__)




#logger = logging.getLogger(__name__)

from app.utils.logger import get_logger

logger = get_logger(__name__)


class ExecutionEngine:

    def __init__(self, config):
        self.batch_id = str(uuid.uuid4())
        self.config = config

        # Mandatory for SaaS
        self.project_id = config["project_id"]

        # Load rule enablement configuration
        self.rule_config = config.get("rules", {})




        self.engine_db = DBConnector(config["engine_db"])
        self.source_db = DBConnector(config["source_db"])
        self.target_db = DBConnector(config["target_db"])

    # ---------------------------------------------------------
    # PUBLIC ENTRY
    # ---------------------------------------------------------

    def run_legacy(self):
        self._create_batch()

        # ---------------------------------------------------------
        # AUTO RULE DISCOVERY (v1.7)
        # ---------------------------------------------------------
        #discovery = AutoRuleDiscovery(self.engine_db, self.project_id)
        discovery = AutoRuleDiscovery(self.engine_db, self.source_db, self.project_id)
        discovery.generate_rules()

        # ---------------------------------------------------------
        # END OF: AUTO RULE DISCOVERY (v1.7)
        # ---------------------------------------------------------


        self._register_batch(len(controls))

        logger.info(f"Registered batch {self.batch_id} with {len(controls)} controls")




        controls = self._get_enabled_controls()

        for control in controls:
            self._update_control_progress(False)
            logger.info(f"Executing {len(controls)} controls")
            self._execute_control(control[0])

        self._finalise_batch()

        self._complete_batch("COMPLETED")

        logger.info(f"Batch {self.batch_id} completed")



    

    def run_legacy_2(self):

        logger.info(f"Starting batch {self.batch_id} for project {self.project_id}")

        # -----------------------------------------------------
        # Auto rule discovery (existing behaviour)
        # -----------------------------------------------------
        from app.discovery.auto_rule_discovery import AutoRuleDiscovery

        discovery = AutoRuleDiscovery(
            self.engine_db,
            self.source_db,
            self.project_id
        )

        discovery.generate_rules()

        # -----------------------------------------------------
        # Fetch controls
        # -----------------------------------------------------
        controls = self._get_controls()

        logger.info(f"{len(controls)} controls discovered")

        # -----------------------------------------------------
        # Register batch
        # -----------------------------------------------------
        self._register_batch(len(controls))

        logger.info(f"Batch {self.batch_id} registered")

        # -----------------------------------------------------
        # Execute controls
        # -----------------------------------------------------
        for control in controls:

            control_id = control[0]

            logger.info(f"Executing control {control_id}")

            try:

                self._execute_control(control_id)

                self._update_control_progress(True)

            except Exception as e:

                logger.error(f"Control {control_id} failed: {str(e)}")

                self._update_control_progress(False)

        # -----------------------------------------------------
        # Complete batch
        # -----------------------------------------------------
        self._complete_batch("COMPLETED")

        logger.info(f"Batch {self.batch_id} completed")




    def run_legacy_3(self):

        logger.info(f"Starting batch {self.batch_id} for project {self.project_id}")

        try:

            # -----------------------------------------------------
            # Auto rule discovery
            # -----------------------------------------------------
            from app.discovery.auto_rule_discovery import AutoRuleDiscovery

            discovery = AutoRuleDiscovery(
                self.engine_db,
                self.source_db,
                self.project_id
            )

            discovery.generate_rules()

            # -----------------------------------------------------
            # Fetch controls
            # -----------------------------------------------------
            controls = self._get_controls()

            logger.info(f"{len(controls)} controls discovered")

            # -----------------------------------------------------
            # Register batch
            # -----------------------------------------------------
            self._register_batch(len(controls))

            logger.info(f"Batch {self.batch_id} registered")

            # -----------------------------------------------------
            # Execute controls
            # -----------------------------------------------------
            for control in controls:

                control_id = control[0]

                logger.info(f"Executing control {control_id}")

                try:

                    self._execute_control(control_id)

                    self._update_control_progress(True)

                except Exception as e:

                    logger.error(f"Control {control_id} failed: {str(e)}")

                    self._update_control_progress(False)

            # -----------------------------------------------------
            # Mark batch completed
            # -----------------------------------------------------

            ## -----------------------------------------------------
            # Finalise batch (calculate summary and score)
            self._complete_batch("COMPLETED")

            ## -----------------------------------------------------
            # Evaluate governance and enforce release gate if configured
            self._evaluate_governance()

            logger.info(f"Batch {self.batch_id} completed")

        except Exception as e:

            logger.error(f"Batch {self.batch_id} failed: {str(e)}")

            try:
                self._complete_batch("FAILED")
            except Exception:
                pass

            raise




    def run(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed

        MAX_WORKERS = 4  # You can later move this to config.yaml

        logger.info(f"Starting batch {self.batch_id} for project {self.project_id}")

        try:

            # -----------------------------------------------------
            # Auto rule discovery
            # -----------------------------------------------------
            from app.discovery.auto_rule_discovery import AutoRuleDiscovery

            discovery = AutoRuleDiscovery(
                self.engine_db,
                self.source_db,
                self.project_id
            )

            discovery.generate_rules()

            # -----------------------------------------------------
            # Fetch controls
            # -----------------------------------------------------
            controls = self._get_controls()

            logger.info(f"{len(controls)} controls discovered")

            # -----------------------------------------------------
            # Register batch
            # -----------------------------------------------------
            self._register_batch(len(controls))

            logger.info(f"Batch {self.batch_id} registered")

            # -----------------------------------------------------
            # Parallel Control Execution
            # -----------------------------------------------------
            logger.info(f"Starting parallel execution with {MAX_WORKERS} workers")

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

                futures = {}

                for control in controls:

                    control_id = control[0]

                    logger.info(f"Scheduling control {control_id}")

                    future = executor.submit(self._execute_control, control_id)

                    futures[future] = control_id

                for future in as_completed(futures):

                    control_id = futures[future]

                    try:

                        future.result()

                        logger.info(f"Control {control_id} completed")

                        self._update_control_progress(True)

                    except Exception as e:

                        logger.error(f"Control {control_id} failed: {str(e)}")

                        self._update_control_progress(False)

            # -----------------------------------------------------
            # Mark batch completed
            # -----------------------------------------------------
            self._complete_batch("COMPLETED")

            # -----------------------------------------------------
            # Evaluate governance
            # -----------------------------------------------------
            self._evaluate_governance()

            logger.info(f"Batch {self.batch_id} completed")

        except Exception as e:

            logger.error(f"Batch {self.batch_id} failed: {str(e)}")

            try:
                self._complete_batch("FAILED")
            except Exception:
                pass

            raise


    # ---------------------------------------------------------
    # BATCH CREATION (PROJECT AWARE)
    # ---------------------------------------------------------

    def _create_batch(self):
        query = """
        INSERT INTO engine.migration_validation_batch
        (batch_id, project_id, execution_start, overall_status)
        VALUES (%s, %s, NOW(), 'RUNNING')
        """
        self.engine_db.execute(query, (self.batch_id, self.project_id))

    # ---------------------------------------------------------
    # PROJECT-SCOPED CONTROLS
    # ---------------------------------------------------------

    def _get_enabled_controls(self):
        query = """
        SELECT control_id
        FROM engine.control_registry
        WHERE enabled_flag = TRUE
        AND project_id = %s
        ORDER BY control_id
        """
        return self.engine_db.execute(query, (self.project_id,))

    # ---------------------------------------------------------
    # CONTROL EXECUTION
    # ---------------------------------------------------------

    def _execute_control(self, control_id):
        executor = RuleExecutor(
            self.engine_db,
            self.source_db,
            self.target_db,
            self.batch_id,
            self.project_id,
            control_id
        )
        executor.execute_rules()

    # ---------------------------------------------------------
    # FINALISATION
    # ---------------------------------------------------------

    def _finalise_batch(self):

        query = """
        SELECT overall_status, COUNT(*)
        FROM engine.migration_control_summary
        WHERE batch_id = %s
        GROUP BY overall_status
        """

        results = self.engine_db.execute(query, (self.batch_id,))

        total_controls = 0
        passed = 0
        failed = 0
        errors = 0
        blocked = 0

        for status, count in results:
            total_controls += count

            if status == "PASS":
                passed = count
            elif status == "FAIL":
                failed = count
            elif status == "ERROR":
                errors = count
            elif status == "BLOCKED":
                blocked = count

        if blocked > 0:
            overall_status = "BLOCKED"
        elif errors > 0:
            overall_status = "ERROR"
        elif failed > 0:
            overall_status = "FAIL"
        else:
            overall_status = "PASS"

        insert_query = """
        INSERT INTO engine.migration_batch_summary
        (batch_id, project_id, overall_status, total_controls,
        passed_controls, failed_controls, error_controls, blocked_controls)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(insert_query, (
            self.batch_id,
            self.project_id,
            overall_status,
            total_controls,
            passed,
            failed,
            errors,
            blocked
        ))

        scoring = ScoringEngine(self.engine_db, self.batch_id)
        score = scoring.calculate_overall()

        update_query = """
        UPDATE engine.migration_validation_batch
        SET execution_end = NOW(),
            overall_status = %s,
            overall_score = %s
        WHERE batch_id = %s
        """

        self.engine_db.execute(update_query, (
            overall_status,
            score,
            self.batch_id
        ))

        # Governance Intelligence
        result = self.engine_db.execute(
            "SELECT * FROM engine.run_governance_intelligence(%s)",
            (self.batch_id,)
        )

        anomaly_score = result[0][0]
        auto_blocked = result[0][2]

        #if auto_blocked:
        #    raise Exception(
        #        f"RELEASE BLOCKED: Governance anomaly threshold breached. Score={anomaly_score}"
        #    )
            
        if auto_blocked:
            logger.error(
            f"RELEASE BLOCKED: Governance anomaly threshold breached. Score={anomaly_score}"
            )

        self._enforce_release_gate(overall_status, score)

    # ---------------------------------------------------------
    # RELEASE GATE
    # ---------------------------------------------------------

    def _enforce_release_gate(self, overall_status, score):

        gate_config = self.config.get("release_gate", {})

        if not gate_config.get("enabled", False):
            return

        block_statuses = gate_config.get("block_on_status", [])
        min_score = gate_config.get("minimum_score", 0)
        enforcement_mode = gate_config.get("enforcement_mode", "STRICT")

        gate_result = "APPROVED"
        decision_reason = "All release criteria satisfied."

        if overall_status in block_statuses:
            gate_result = "REJECTED"
            decision_reason = f"Blocked due to batch status: {overall_status}"

        if score < min_score:
            gate_result = "REJECTED"
            decision_reason = f"Score {score} below threshold {min_score}"

        insert_query = """
        INSERT INTO engine.migration_release_decision
        (batch_id, environment, client_name,
         overall_status, overall_score,
         gate_result, decision_reason, approved_by)
        VALUES (%s,%s,%s,%s,%s,%s,%s,'SYSTEM')
        """

        self.engine_db.execute(insert_query, (
            self.batch_id,
            self.config.get("environment", "UNKNOWN"),
            self.config.get("client_name", "UNSPECIFIED"),
            overall_status,
            score,
            gate_result,
            decision_reason
        ))

        if gate_result == "REJECTED" and enforcement_mode == "STRICT":
            raise SystemExit(
                f"RELEASE BLOCKED: Batch {self.batch_id} - {decision_reason}"
            )
        


    def _register_batch(self, total_controls):

        query = """
        INSERT INTO engine.migration_batch_registry
        (batch_id, project_id, batch_status, total_controls)
        VALUES (%s,%s,'RUNNING',%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            self.project_id,
            total_controls
    ))
        

    def _complete_batch(self, status):

        query = """
        UPDATE engine.migration_batch_registry
        SET batch_status = %s,
            batch_end_time = CURRENT_TIMESTAMP
        WHERE batch_id = %s
        """

        self.engine_db.execute(query, (status, self.batch_id))


    def _update_control_progress(self, success=True):

        if success:

            query = """
            UPDATE engine.migration_batch_registry
            SET completed_controls = completed_controls + 1
            WHERE batch_id = %s
            """

        else:

            query = """
            UPDATE engine.migration_batch_registry
            SET failed_controls = failed_controls + 1
            WHERE batch_id = %s
            """

        self.engine_db.execute(query, (self.batch_id,))

    def _get_controls(self):

        #query = """
        #SELECT control_id
        #FROM engine.control_registry
        #WHERE enabled_flag = TRUE
        #ORDER BY control_id
        #"""

        query = """
        SELECT
    ---Intelligent Rule Prioritisation	run critical rules first
        control_id
        FROM engine.control_registry
        WHERE enabled_flag = TRUE
        ORDER BY severity_level DESC, control_id
        """


        rows = self.engine_db.execute(query)

        filtered_controls = []

        for row in rows:

            control_id = row[0]

            rule_status = self.rule_config.get(control_id, "enabled")
            

            if rule_status.lower() == "disabled":
               
                logger.info(f"Skipping control {control_id} (disabled in config.yaml)")

                continue

            filtered_controls.append(row)




        #return rows
        return filtered_controls
    
    



    def _evaluate_governance(self):

        query = """
        SELECT
            COUNT(*) FILTER (WHERE severity_level = 'CRITICAL'
                            AND execution_status = 'FAIL') AS blocking_rules,
            COUNT(*) FILTER (WHERE execution_status = 'FAIL') AS failed_rules
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        """

        result = self.engine_db.execute(query, (self.batch_id,))[0]

        blocking_rules = result[0]
        failed_rules = result[1]

        if blocking_rules > 0:
            migration_status = "BLOCKED"
        elif failed_rules > 0:
            migration_status = "FAIL"
        else:
            migration_status = "PASS"

        insert_query = """
        INSERT INTO engine.migration_governance_status
        (batch_id, project_id, migration_status, blocking_controls, total_failed_rules)
        VALUES (%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(insert_query, (
            self.batch_id,
            self.project_id,
            migration_status,
            blocking_rules,
            failed_rules
        ))

        logger.info(f"Migration governance decision: {migration_status}")