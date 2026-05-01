#from asyncio.log import logger
import uuid
from .db_connector import DBConnector
from .rule_executor import RuleExecutor
from .scoring_engine import ScoringEngine
from app.discovery.auto_rule_discovery import AutoRuleDiscovery
from app.utils.logger import get_logger
import time


#logger = get_logger(__name__)



#logger = logging.getLogger(__name__)

from app.utils.logger import get_logger

logger = get_logger(__name__)


class ExecutionEngine:

    def __init__(self, config, batch_id=None):
        import uuid

        self.config = config

        # ✅ FIX: auto-generate batch_id if not provided
        self.batch_id = batch_id or str(uuid.uuid4())

        # ✅ project_id
        self.project_id = config.get("project_id")

        from app.db.connection_factory import connection_factory

        engine_db_config = config.get("engine_db", {}).copy()

        if not engine_db_config.get("type"):
            engine_db_config["type"] = "postgres"

        print("🔥 ENGINE_DB FINAL CONFIG:", engine_db_config)

        self.engine_db = connection_factory(engine_db_config)

        # ✅ configs
        self.rule_config = config.get("rules", {})
        self.control_dependencies = config.get("control_dependencies", {})
        self.control_timeout_seconds = config.get("engine", {}).get(
            "control_timeout_seconds", 300
        )

    # ---------------------------------------------------------
    # PUBLIC ENTRY
    # ---------------------------------------------------------

    
    def run(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed
        from collections import defaultdict, deque

        MAX_WORKERS = 4

        logger.info(f"Starting batch {self.batch_id} for project {self.project_id}")




        from app.db.connection_resolver import ConnectionResolver

        logger.info("Starting connection resolution...")

        resolver = ConnectionResolver(self.engine_db)
        connections = resolver.get_connections(self.config["project_id"])






        #valid_mappings = validator.validate_for_execution(...)




        #source_adapter = connections.get("SOURCE")
        #target_adapter = connections.get("TARGET")

        #if not source_adapter or not target_adapter:
        #    raise RuntimeError("Failed to resolve source/target connections")

        # ✅ override BEFORE execution starts
        #self.source_db = source_adapter
        #self.target_db = target_adapter


        #logger.info(f"SOURCE adapter loaded: {source_adapter is not None}")
        #logger.info(f"TARGET adapter loaded: {target_adapter is not None}")



        source_connections = connections.get("SOURCE", {})
        target_connections = connections.get("TARGET", {})

        if not source_connections or not target_connections:
            raise RuntimeError("No active SOURCE/TARGET systems found")

        # ✅ NEW: store all connections
        self.source_connections = source_connections
        self.target_connections = target_connections

        # ✅ BACKWARD COMPATIBILITY (primary connection)
        self.source_db = next(iter(source_connections.values()))
        self.target_db = next(iter(target_connections.values()))

        logger.info(f"SOURCE systems: {len(source_connections)}")
        logger.info(f"TARGET systems: {len(target_connections)}")


        # -----------------------------------------------------
        # Mapping Resolution Layer (CRITICAL GUARD)
        # -----------------------------------------------------
        from app.services.mapping_resolver import MappingResolver

        logger.info("Resolving dataset mappings...")

        resolver = MappingResolver(self.engine_db, self.project_id, logger)

        valid_pairs, skipped_pairs = resolver.resolve(
            self.source_connections.keys(),
            self.target_connections.keys()
        )

        if not valid_pairs:
            logger.warning(
                f"No executable mappings found for project {self.project_id}. "
                f"Execution will be skipped."
            )
            self._complete_batch("NO_EXECUTION_SCOPE")
            return

        if skipped_pairs:
            logger.info(f"Skipped system pairs (no mappings): {skipped_pairs}")

        # ✅ store for execution
        self.valid_pairs = valid_pairs





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
            # ✅ Recovery Mode (FAILED CONTROLS ONLY)
            # -----------------------------------------------------
            if getattr(self, "recovery_mode", False):

                failed_controls = self._get_failed_controls()

                if failed_controls:

                    logger.info(
                        f"Recovery mode ON — {len(failed_controls)} failed controls will be re-run"
                    )

                    controls = [c for c in controls if c[0] in failed_controls]

                else:

                    logger.info("Recovery mode ON — no failed controls found")
                    return
                


            # -----------------------------------------------------
            # Recovery Mode (FAILED CONTROLS ONLY)
            # -----------------------------------------------------
            if getattr(self, "recovery_mode", False):

                failed_controls = self._get_failed_controls()

                if failed_controls:

                    logger.info(f"Recovery mode ON — {len(failed_controls)} failed controls will be re-run")

                    controls = [c for c in controls if c[0] in failed_controls]

                else:

                    logger.info("Recovery mode ON — no failed controls found")
                    return
    



            # -----------------------------------------------------
            # Checkpoint Handling
            # -----------------------------------------------------
            last_control = self._load_checkpoint()

            if not last_control:

                self._register_batch(len(controls))
                logger.info(f"Batch {self.batch_id} registered")

            else:

                logger.info(f"Resuming existing batch {self.batch_id} — registration skipped")

            if last_control:

                logger.info(f"Checkpoint detected. Last completed control: {last_control}")

                control_ids = [c[0] for c in controls]

                if last_control in control_ids:

                    last_index = control_ids.index(last_control)
                    controls = controls[last_index + 1:]

                    logger.info(
                        f"Resuming batch after {last_control}. "
                        f"{len(controls)} controls remaining."
                    )

                else:

                    logger.warning(
                        f"Checkpoint control {last_control} not found. Running full batch."
                    )

            else:

                logger.info("No checkpoint found — starting batch from beginning")

            # -----------------------------------------------------
            # Nothing to run
            # -----------------------------------------------------
            if not controls:

                logger.info("All controls already completed according to checkpoint.")

                self._complete_batch("COMPLETED")
                self._evaluate_governance()

                return

            # -----------------------------------------------------
            # Build control lookup
            # -----------------------------------------------------
            control_map = {c[0]: c for c in controls}
            control_ids = set(control_map.keys())

            # -----------------------------------------------------
            # Build dependency graph
            # -----------------------------------------------------
            dependents = defaultdict(list)
            dependency_count = {}

            for cid in control_ids:

                deps = [
                    d for d in self.control_dependencies.get(cid, [])
                    if d in control_ids
                ]

                dependency_count[cid] = len(deps)

                for d in deps:
                    dependents[d].append(cid)

            # -----------------------------------------------------
            # Ready queue
            # -----------------------------------------------------
            ready_queue = deque(
                [cid for cid, count in dependency_count.items() if count == 0]
            )

            logger.info(f"Starting parallel execution with {MAX_WORKERS} workers")

            completed_controls = set()

            # -----------------------------------------------------
            # Execute DAG
            # -----------------------------------------------------
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

                futures = {}

                while ready_queue or futures:

                    # Schedule ready controls
                    while ready_queue:

                        cid = ready_queue.popleft()

                        logger.info(f"Scheduling control {cid}")

                        #future = executor.submit(
                        #    self._execute_control,
                        #    control_map[cid]
                        #)

                        future = executor.submit(
                            self._execute_control,
                            cid

                            
                        )
                        

                        futures[future] = cid

                    if not futures and ready_queue:
                        raise Exception("DAG deadlock detected")

                    # Wait for completion
                    for future in as_completed(futures):

                        cid = futures.pop(future)

                        try:

                            future.result(timeout=self.control_timeout_seconds)

                            logger.info(f"Control {cid} completed")

                            self._update_control_progress(True)
                            self._save_checkpoint(cid)

                        except Exception as e:

                            logger.error(f"Control {cid} failed: {str(e)}")

                            self._update_control_progress(False)

                        completed_controls.add(cid)

                        # Release dependent controls
                        for child in dependents[cid]:

                            dependency_count[child] -= 1

                            if dependency_count[child] == 0:
                                ready_queue.append(child)

                        break

            # -----------------------------------------------------
            # Mark batch completed
            # -----------------------------------------------------
            self._complete_batch("COMPLETED")

            # -----------------------------------------------------
            # Governance evaluation
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

    def _execute_control_legacy(self, control_id):
        executor = RuleExecutor(
            self.engine_db,
            self.source_db,
            self.target_db,
            self.batch_id,
            self.project_id,
            control_id,
            self.config   # <-- PASS CONFIG
        )
        logger.info(f"DEBUG: Executing control {control_id}")
        
        executor.execute_rules()

    def _execute_control_legacy_2(self, control_id):

        # ✅ iterate through all SOURCE systems
        for source_id, source_adapter in self.source_connections.items():

            for target_id, target_adapter in self.target_connections.items():

                executor = RuleExecutor(
                    self.engine_db,
                    source_adapter,
                    target_adapter,
                    self.batch_id,
                    self.project_id,
                    control_id,
                    self.config
                )

                logger.info(
                    f"Executing {control_id} | SOURCE={source_id} → TARGET={target_id}"
                )

                executor.execute_rules()

    def _execute_control_legacy_3(self, control_id):

        # ✅ iterate through all SOURCE systems
        for source_id, source_adapter in self.source_connections.items():

            for target_id, target_adapter in self.target_connections.items():

                executor = RuleExecutor(
                    self.engine_db,
                    source_adapter,
                    target_adapter,
                    self.batch_id,
                    self.project_id,
                    control_id,
                    self.config
                )

                logger.info(
                    f"Executing {control_id} | SOURCE={source_id} → TARGET={target_id}"
                )

                executor.execute_rules()
                

    def _execute_control_legacy(self, control_id):

        start = time.time()

        for source_id, source_adapter in self.source_connections.items():
            for target_id, target_adapter in self.target_connections.items():

                executor = RuleExecutor(
                    self.engine_db,
                    source_adapter,
                    target_adapter,
                    self.batch_id,
                    self.project_id,
                    control_id,
                    self.config
                )

                logger.info(
                    f"Executing {control_id} | SOURCE={source_id} → TARGET={target_id}"
                )

                executor.execute_rules()

        duration = round((time.time() - start), 2)

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )


    def _execute_control(self, control_id):

        start = time.time()

        for source_id, target_id, mappings in self.valid_pairs:

            source_adapter = self.source_connections[source_id]
            target_adapter = self.target_connections[target_id]

            executor = RuleExecutor(
                self.engine_db,
                source_adapter,
                target_adapter,
                self.batch_id,
                self.project_id,
                control_id,
                self.config,
                mappings   # ✅ PASS MAPPINGS
            )

            logger.info(
                f"Executing {control_id} | SOURCE={source_id} → TARGET={target_id}"
            )

            executor.execute_rules()

        duration = round((time.time() - start), 2)

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )




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

            #rule_status = self.rule_config.get(control_id, "enabled")
            #rule_status = getattr(self, "rule_config", {}).get(control_id, "enabled")
            

            #if rule_status.lower() == "disabled":
            #    logger.info(f"Skipping control {control_id} (disabled in config.yaml)")
            #    continue
            
            if not self._is_rule_enabled(control_id):
                logger.info(f"Skipping control {control_id} (disabled in config.yaml)")
                continue

            filtered_controls.append(row)




        #return rows
        return filtered_controls
    
    

    def _is_rule_enabled(self, control_id):
        return getattr(self, "rule_config", {}).get(control_id, "enabled") == "enabled"

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





    def _save_checkpoint(self, control_id):

        query = """
        INSERT INTO engine.batch_execution_checkpoint
        (batch_id, last_completed_control)
        VALUES (%s,%s)
        ON CONFLICT (batch_id)
        DO UPDATE SET
            last_completed_control = EXCLUDED.last_completed_control,
            updated_at = NOW()
        """

        self.engine_db.execute(query, (
            self.batch_id,
            control_id
        ))


    
    def _load_checkpoint(self):

        query = """
        SELECT last_completed_control
        FROM engine.batch_execution_checkpoint
        WHERE batch_id = %s
        """

        rows = self.engine_db.execute(query, (self.batch_id,))

        if rows:
            return rows[0][0]

        return None
    

    #------------------------------------------------------
    #Define dependency
    #C02 runs only after C01
    #C09 runs only after C03
    #If a control is not listed → no dependencies.
    #Step 5: Control Dependency Graph (DAG)
    #------------------------------------------------
    def _dependencies_satisfied(self, control_id, completed_controls):

        deps = self.control_dependencies.get(control_id, [])

        for dep in deps:
            if dep not in completed_controls:
                return False

        return True
    

    # ------------------------------------------------------
    # Get list of controls that have failed or errored in the current batch execution
    # This can be used for dynamic dependency handling, e.g. if a control fails, we can choose to block dependent controls or route them to a different execution path
    # PHASE 7 STEP 6 — BATCH RECOVERY MODE
    #------------------------------------------------------
    def _get_failed_controls(self):

        query = """
        SELECT DISTINCT control_id
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        AND execution_status IN ('FAIL', 'ERROR')
        """

        rows = self.engine_db.fetch_all(query, (self.batch_id,))

        return set(r[0] for r in rows)