#from asyncio.log import logger
import uuid
from .db_connector import DBConnector
from .rule_executor import RuleExecutor
from .scoring_engine import ScoringEngine
from app.discovery.auto_rule_discovery import AutoRuleDiscovery
from app.utils.logger import get_logger
import time
from app.orchestration.retry.rule_retry_manager import RuleRetryManager


#logger = get_logger(__name__)



#logger = logging.getLogger(__name__)

from app.utils.logger import get_logger, get_audit_logger

logger = get_logger(__name__)
audit_logger = get_audit_logger()


class ExecutionEngine:

    def __init___legacy(self, config, batch_id=None):
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

        # print("🔥 ENGINE_DB FINAL CONFIG:", engine_db_config)

        self.engine_db = connection_factory(engine_db_config)

        # ✅ configs
        self.rule_config = config.get("rules", {})
        self.control_dependencies = config.get("control_dependencies", {})
        self.control_timeout_seconds = config.get("engine", {}).get(
            "control_timeout_seconds", 300 
        )
    


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

        # print("🔥 ENGINE_DB FINAL CONFIG:", engine_db_config)

        self.engine_db = connection_factory(engine_db_config)

        # ✅ configs
        self.rule_config = config.get("rules", {})
        self.control_dependencies = config.get("control_dependencies", {})
        self.control_timeout_seconds = config.get("engine", {}).get(
            "control_timeout_seconds", 300
        )

        # -----------------------------------------------------
        # ✅ OBSERVABILITY LAYER (v3.2) — CORRECT PLACEMENT
        # -----------------------------------------------------
        self.execution_trace = []
        self.control_trace_map = {}


        # -----------------------------------------------------
        # RETRY CONFIG (v3.2)
        # -----------------------------------------------------
        retry_config = self.config.get("retry_policy", {})

        self.max_retries = retry_config.get("max_retries", 0)
        self.retry_delay_seconds = retry_config.get("delay_seconds", 0)

    # ---------------------------------------------------------
    # PUBLIC ENTRY
    # ---------------------------------------------------------

    
    def run(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed
        from collections import defaultdict, deque
        from app.utils.logger import IndentContext

        MAX_WORKERS = 4

        logger.info(f"Starting batch {self.batch_id} for project {self.project_id}")
        audit_logger.audit(f"BATCH_STARTED | Batch ID: {self.batch_id} | Project ID: {self.project_id} | Status: IN_PROGRESS")

        # -----------------------------------------------------
        # [STEP 01/06] CONNECTION RESOLUTION
        # -----------------------------------------------------
        start_step1 = time.time()
        logger.info("[STEP 01/06] CONNECTION RESOLUTION STARTED")
        IndentContext.set_indent(1)

        from app.db.connection_resolver import ConnectionResolver

        resolver = ConnectionResolver(self.engine_db)
        connections = resolver.get_connections(self.config["project_id"])

        source_connections = connections.get("SOURCE", {})
        target_connections = connections.get("TARGET", {})

        if not source_connections or not target_connections:
            IndentContext.set_indent(0)
            logger.info("[STEP 01/06] CONNECTION RESOLUTION FAILED")
            raise RuntimeError("No active SOURCE/TARGET systems found")

        # ✅ NEW: store all connections
        self.source_connections = source_connections
        self.target_connections = target_connections

        # ✅ BACKWARD COMPATIBILITY (primary connection)
        self.source_db = next(iter(source_connections.values()))
        self.target_db = next(iter(target_connections.values()))

        logger.debug(f"SOURCE systems: {len(source_connections)}")
        logger.debug(f"TARGET systems: {len(target_connections)}")

        IndentContext.set_indent(0)
        duration_step1 = int((time.time() - start_step1) * 1000)
        logger.info(f"[STEP 01/06] CONNECTION RESOLUTION COMPLETED ({duration_step1}ms)")
        logger.info("")

        # -----------------------------------------------------
        # [STEP 02/06] DATASET MAPPING
        # -----------------------------------------------------
        start_step2 = time.time()
        logger.info("[STEP 02/06] DATASET MAPPING STARTED")
        IndentContext.set_indent(1)

        from app.services.mapping_resolver import MappingResolver

        resolver = MappingResolver(self.engine_db, self.project_id, logger)

        valid_pairs, skipped_pairs = resolver.resolve(
            self.source_connections.keys(),
            self.target_connections.keys()
        )

        for s_id in self.source_connections.keys():
            s_adapter = self.source_connections[s_id]
            s_type = s_adapter.config.get("type", "UNKNOWN").upper()
            
            # Check if this source has ANY mapping to ANY target
            has_any_mapping = any(src == s_id for src, tgt, m in valid_pairs)
            
            if has_any_mapping:
                for t_id in self.target_connections.keys():
                    t_adapter = self.target_connections[t_id]
                    t_type = t_adapter.config.get("type", "UNKNOWN").upper()
                    
                    mappings = next((m for src, tgt, m in valid_pairs if src == s_id and tgt == t_id), None)
                    if mappings:
                        logger.info(f"    Connection: [ID: {s_id}] ({s_type}) -> [ID: {t_id}] ({t_type}) ... ✅ (Mapping resolved)")
                        audit_logger.audit(f"MAPPING_RESOLVED | Source ID: {s_id} | Target ID: {t_id} | Outcome: SUCCESS")
            else:
                logger.info(f"    Connection: [ID: {s_id}] ({s_type}) ... ❌ (Skipped: No mapping defined)")
                audit_logger.audit(f"MAPPING_RESOLVED | Source ID: {s_id} | Target ID: N/A | Outcome: SKIPPED | Reason: No mapping defined")

        if skipped_pairs and valid_pairs:
            logger.warning(f"    Notice: {len(skipped_pairs)} connection pair(s) skipped due to missing mappings.")

        if not valid_pairs:
            logger.warning(
                f"No executable mappings found for project {self.project_id}. "
                f"Execution will be skipped."
            )
            IndentContext.set_indent(0)
            logger.info("[STEP 02/06] DATASET MAPPING COMPLETED (0ms)")
            logger.info("")
            self._complete_batch("NO_EXECUTION_SCOPE")
            return

        # ✅ store for execution
        self.valid_pairs = valid_pairs
        self.active_source_ids = sorted(list(set(src for src, tgt, m in valid_pairs)))

        IndentContext.set_indent(0)
        duration_step2 = int((time.time() - start_step2) * 1000)
        logger.info(f"[STEP 02/06] DATASET MAPPING COMPLETED ({duration_step2}ms)")
        logger.info("")

        try:

            # -----------------------------------------------------
            # [STEP 03/06] RULE DISCOVERY
            # -----------------------------------------------------
            start_step3 = time.time()
            logger.info("[STEP 03/06] RULE DISCOVERY STARTED")
            IndentContext.set_indent(1)
            logger.info(f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

            from app.discovery.auto_rule_discovery import AutoRuleDiscovery

            discovery = AutoRuleDiscovery(
                self.engine_db,
                self.source_db,
                self.project_id,
                source_connections=self.source_connections
            )

            discovery.generate_rules()

            IndentContext.set_indent(0)
            duration_step3 = int((time.time() - start_step3) * 1000)
            logger.info(f"[STEP 03/06] RULE DISCOVERY COMPLETED ({duration_step3}ms)")
            logger.info("")

            # -----------------------------------------------------
            # [STEP 04/06] CONTROL DISCOVERY
            # -----------------------------------------------------
            start_step4 = time.time()
            logger.info("[STEP 04/06] CONTROL DISCOVERY STARTED")
            IndentContext.set_indent(1)
            logger.info(f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

            controls = self._get_controls()

            logger.debug(f"{len(controls)} controls discovered")



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

                    logger.debug("Recovery mode ON — no failed controls found")
                    return
            

            


            # -----------------------------------------------------
            # Checkpoint Handling
            # -----------------------------------------------------
            last_control = self._load_checkpoint()

            if not last_control:

                #self._register_batch(len(controls))
                #logger.info(f"Batch {self.batch_id} registered")

                # -----------------------------------------------------
                # Batch Registration (IDEMPOTENCY GUARD FIRST)
                # -----------------------------------------------------
                should_run = self._register_batch(len(controls))

                if should_run is False:
                    logger.debug(f"Skipping execution for batch {self.batch_id}")
                    return

                logger.debug(f"Batch {self.batch_id} registered or resumed")


            else:

                logger.debug(f"Resuming existing batch {self.batch_id} — registration skipped")

            if last_control:

                logger.debug(f"Checkpoint detected. Last completed control: {last_control}")

                control_ids = [c[0] for c in controls]

                if last_control in control_ids:

                    last_index = control_ids.index(last_control)
                    controls = controls[last_index + 1:]

                    logger.debug(
                        f"Resuming batch after {last_control}. "
                        f"{len(controls)} controls remaining."
                    )

                else:

                    logger.warning(
                        f"Checkpoint control {last_control} not found. Running full batch."
                    )

            else:

                logger.debug("No checkpoint found — starting batch from beginning")

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
            # DAG VALIDATION (v3.2 HARDENING)
            # -----------------------------------------------------

            self._trace_dag_event("Validating control dependencies")

            self._validate_dependencies(control_ids)

            self._trace_dag_event("Checking for DAG cycles")

            self._detect_cycles(control_ids)

            self._trace_dag_event("DAG validation completed successfully")

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

            IndentContext.set_indent(0)
            duration_step4 = int((time.time() - start_step4) * 1000)
            logger.info(f"[STEP 04/06] CONTROL DISCOVERY COMPLETED ({duration_step4}ms)")
            logger.info("")

            # -----------------------------------------------------
            # [STEP 05/06] CONTROL EXECUTION
            # -----------------------------------------------------
            start_step5 = time.time()
            logger.info("[STEP 05/06] CONTROL EXECUTION STARTED")
            IndentContext.set_indent(1)
            logger.info(f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

            logger.debug(f"Starting parallel execution with {MAX_WORKERS} workers")

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

                        logger.debug(f"Scheduling control {cid}")

                        self._trace_dag_event("CONTROL_SCHEDULED", {"control_id": cid})
                        
                        future = executor.submit(
                            self._execute_control_with_retry,
                            cid
                        )

                        futures[future] = cid

                    if not futures and not ready_queue and len(completed_controls) < len(control_ids):

                        remaining = control_ids - completed_controls

                        logger.error(f"DAG DEADLOCK DETECTED. Remaining controls: {remaining}")

                        raise RuntimeError(
                            f"DAG deadlock detected. Unresolved controls: {remaining}"
                        )

                    # Wait for completion
                    for future in as_completed(futures):

                        cid = futures.pop(future)

                        try:

                            result = future.result(timeout=self.control_timeout_seconds)

                            if result:
                                logger.debug(f"Control {cid} completed")

                                self._update_control_progress(True)
                                self._save_checkpoint(cid)

                            else:
                                logger.error(f"Control {cid} failed after retries")

                                self._update_control_progress(False)

                        except Exception as e:

                            logger.error(f"Control {cid} execution error: {str(e)}")

                            self._update_control_progress(False)

                            self._trace_control_end(
                                cid,
                                status="FAILED",
                                duration=0,
                                error=str(e)
                            )

                        completed_controls.add(cid)

                        self._trace_dag_event("CONTROL_COMPLETED", {"control_id": cid})

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

            IndentContext.set_indent(0)
            duration_step5 = int((time.time() - start_step5) * 1000)
            logger.info(f"[STEP 05/06] CONTROL EXECUTION COMPLETED ({duration_step5}ms)")
            logger.info("")

            # -----------------------------------------------------
            # [STEP 06/06] GOVERNANCE DECISION
            # -----------------------------------------------------
            start_step6 = time.time()
            logger.info("[STEP 06/06] GOVERNANCE DECISION STARTED")
            IndentContext.set_indent(1)
            logger.info(f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

            # -----------------------------------------------------
            # Governance evaluation
            # -----------------------------------------------------
            self._evaluate_governance()

            IndentContext.set_indent(0)
            duration_step6 = int((time.time() - start_step6) * 1000)
            logger.info(f"[STEP 06/06] GOVERNANCE DECISION COMPLETED ({duration_step6}ms)")
            logger.info("")

            logger.debug(f"Batch {self.batch_id} completed")

        except Exception as e:
            IndentContext.set_indent(0)
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



    def _execute_control_legacy_20260501(self, control_id):

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




    def _execute_control_legacy_20260501_1(self, control_id):

        #start = time.time()

        self._trace_control_start(control_id)

        # -----------------------------------------------------
        # SAFE FILTER: only mappings relevant to this control
        # -----------------------------------------------------

        relevant_pairs = []

        for source_id, target_id, mappings in self.valid_pairs:

            # STRICT CONTRACT CHECK (prevents cross-control execution bleed)
            if control_id in mappings.get("control_ids", [control_id]):

                relevant_pairs.append((source_id, target_id, mappings))

        if not relevant_pairs:

            logger.warning(
                f"No mappings found for control {control_id}. Skipping execution."
            )
            return

        # -----------------------------------------------------
        # EXECUTION LOOP (SAFE SCOPED)
        # -----------------------------------------------------

        for source_id, target_id, mappings in relevant_pairs:

            if source_id not in self.source_connections:
                logger.error(f"Missing SOURCE connection: {source_id}")
                continue

            if target_id not in self.target_connections:
                logger.error(f"Missing TARGET connection: {target_id}")
                continue

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
                mappings
            )

            logger.info(
                f"Executing CONTROL={control_id} | SOURCE={source_id} → TARGET={target_id}"
            )

            executor.execute_rules()

        #duration = round((time.time() - start), 2)

        #logger.info(
        #    f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        #)


        duration = round((time.time() - start), 2)

        self._trace_control_end(
            control_id,
            status="SUCCESS",
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )


    def _execute_control_legacy_20260501_2(self, control_id):

        import time

        start = time.time()

        self._trace_control_start(control_id)

        # -----------------------------------------------------
        # SAFE FILTER: only mappings relevant to this control
        # CONTRACT HARDENING (v3.2)
        # -----------------------------------------------------

        relevant_pairs = []

        for pair in self.valid_pairs:

            # -------------------------------------------------
            # CONTRACT HARDENING
            # Supports:
            # (source, target)
            # (source, target, mappings)
            # -------------------------------------------------
            if len(pair) == 3:
                source_id, target_id, mappings = pair
            elif len(pair) == 2:
                source_id, target_id = pair
                mappings = {}   # SAFE DEFAULT (dict for .get usage)
            else:
                logger.error(f"Invalid mapping pair format: {pair}")
                continue

            # -------------------------------------------------
            # SAFE CONTROL FILTERING
            # mappings may be dict OR list OR empty
            # -------------------------------------------------
            if isinstance(mappings, dict):
                control_ids = mappings.get("control_ids", [control_id])
            else:
                control_ids = [control_id]

            if control_id in control_ids:
                relevant_pairs.append((source_id, target_id, mappings))

        # -----------------------------------------------------
        # NO VALID PAIRS → SKIP
        # -----------------------------------------------------
        if not relevant_pairs:
            logger.warning(
                f"No mappings found for control {control_id}. Skipping execution."
            )

            self._trace_control_end(
                control_id,
                status="SKIPPED",
                duration=0
            )
            return

        # -----------------------------------------------------
        # EXECUTION LOOP
        # -----------------------------------------------------
        for source_id, target_id, mappings in relevant_pairs:

            if source_id not in self.source_connections:
                logger.error(f"Missing SOURCE connection: {source_id}")
                continue

            if target_id not in self.target_connections:
                logger.error(f"Missing TARGET connection: {target_id}")
                continue

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
                mappings
            )

            logger.info(
                f"Executing CONTROL={control_id} | SOURCE={source_id} → TARGET={target_id}"
            )

            executor.execute_rules()

        # -----------------------------------------------------
        # TRACE + COMPLETE
        # -----------------------------------------------------
        duration = round((time.time() - start), 2)

        self._trace_control_end(
            control_id,
            status="SUCCESS",
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )



    def _execute_control_legacy_20260504_1(self, control_id):

        import time

        start = time.time()

        self._trace_control_start(control_id)

        # -----------------------------------------------------
        # SAFE FILTER: only mappings relevant to this control
        # CONTRACT HARDENING (v3.2)
        # -----------------------------------------------------

        relevant_pairs = []

        for pair in self.valid_pairs:

            # -------------------------------------------------
            # CONTRACT HARDENING
            # Supports:
            # (source, target)
            # (source, target, mappings)
            # -------------------------------------------------
            if len(pair) == 3:
                source_id, target_id, mappings = pair
            elif len(pair) == 2:
                source_id, target_id = pair
                mappings = {}   # SAFE DEFAULT (dict for .get usage)
            else:
                logger.error(f"Invalid mapping pair format: {pair}")
                continue

            # -------------------------------------------------
            # SAFE CONTROL FILTERING
            # mappings may be dict OR list OR empty
            # -------------------------------------------------
            #if isinstance(mappings, dict):
            #    control_ids = mappings.get("control_ids", [control_id])
            #else:
            #    control_ids = [control_id]

            #if control_id in control_ids:
            #    relevant_pairs.append((source_id, target_id, mappings))



        # -------------------------------------------------
        # SAFE CONTROL FILTERING (HARDENED)
        # mappings may be dict OR list OR empty
        # -------------------------------------------------
        control_ids = []

        if isinstance(mappings, dict):
            control_ids = mappings.get("control_ids", [control_id])

        elif isinstance(mappings, list):
            # Extract control_ids from DB rows if present
            for m in mappings:
                if isinstance(m, dict) and m.get("control_id"):
                    control_ids.append(m["control_id"])

            # Fallback → allow execution if no explicit control binding
            if not control_ids:
                control_ids = [control_id]

        else:
            control_ids = [control_id]

        # FINAL FILTER CHECK
        if control_id in control_ids:
            relevant_pairs.append((source_id, target_id, mappings))



        # -----------------------------------------------------
        # NO VALID PAIRS → SKIP
        # -----------------------------------------------------
        if not relevant_pairs:
            logger.warning(
                f"No mappings found for control {control_id}. Skipping execution."
            )

            self._trace_control_end(
                control_id,
                status="SKIPPED",
                duration=0
            )
            return


    def _execute_control_legacy_20260504_1(self, control_id):

        import time

        start = time.time()

        self._trace_control_start(control_id)

        # -----------------------------------------------------
        # SAFE FILTER: only mappings relevant to this control
        # CONTRACT HARDENING (v3.2)
        # -----------------------------------------------------




        relevant_pairs = []

        for pair in self.valid_pairs:

            # -------------------------------------------------
            # CONTRACT HARDENING
            # Supports:
            # (source, target)
            # (source, target, mappings)
            # -------------------------------------------------
            if len(pair) == 3:
                source_id, target_id, mappings = pair
            elif len(pair) == 2:
                source_id, target_id = pair
                mappings = {}
            else:
                logger.error(f"Invalid mapping pair format: {pair}")
                continue

            # -------------------------------------------------
            # SAFE CONTROL FILTERING (FIXED - INSIDE LOOP)
            # -------------------------------------------------
            control_ids = []

            if isinstance(mappings, dict):
                control_ids = mappings.get("control_ids", [])

                # empty means applies to all controls
                if not control_ids:
                    control_ids = [control_id]

            elif isinstance(mappings, list):
                for m in mappings:
                    # your DB returns tuples, NOT dicts
                    # so this condition will FAIL → fallback needed
                    if isinstance(m, dict) and m.get("control_id"):
                        control_ids.append(m["control_id"])

                if not control_ids:
                    control_ids = [control_id]

            else:
                control_ids = [control_id]

            # -------------------------------------------------
            # FINAL FILTER CHECK (PER PAIR)
            # -------------------------------------------------
            if control_id in control_ids:
                relevant_pairs.append((source_id, target_id, mappings))



        # -----------------------------------------------------
        # NO VALID PAIRS → SKIP
        # -----------------------------------------------------
        if not relevant_pairs:
            logger.warning(
                f"No mappings found for control {control_id}. Skipping execution."
            )

            self._trace_control_end(
                control_id,
                status="SKIPPED",
                duration=0
            )
            return

        



    def _execute_control_legacy_20260504_1_TO_BE_REMOV(self, control_id):

        import time

        start = time.time()

        self._trace_control_start(control_id)

        # -----------------------------------------------------
        # SAFE FILTER: only mappings relevant to this control
        # CONTRACT HARDENING (v3.2)
        # -----------------------------------------------------

        relevant_pairs = []

        for pair in self.valid_pairs:

            # -------------------------------------------------
            # CONTRACT HARDENING
            # Supports:
            # (source, target)
            # (source, target, mappings)
            # -------------------------------------------------
            if len(pair) == 3:
                source_id, target_id, mappings = pair
            elif len(pair) == 2:
                source_id, target_id = pair
                mappings = []
            else:
                logger.error(f"Invalid mapping pair format: {pair}")
                continue

            # -------------------------------------------------
            # 🔥 FIX: HANDLE REAL DB MAPPINGS (LIST OF TUPLES)
            # -------------------------------------------------

            # CASE 1: mappings from DB (list of tuples)
            if isinstance(mappings, list):

                # If mappings exist → ALWAYS VALID
                if len(mappings) > 0:
                    relevant_pairs.append((source_id, target_id, mappings))

                # If empty → skip (no mapping defined)
                continue

            # CASE 2: structured contract (dict - future ready)
            if isinstance(mappings, dict):
                control_ids = mappings.get("control_ids", [])

                # Empty = applies to all controls
                if not control_ids or control_id in control_ids:
                    relevant_pairs.append((source_id, target_id, mappings))

                continue

            # CASE 3: fallback safety (should not normally hit)
            relevant_pairs.append((source_id, target_id, mappings))

        # -----------------------------------------------------
        # NO VALID PAIRS → SKIP
        # -----------------------------------------------------
        if not relevant_pairs:
            logger.warning(
                f"No mappings found for control {control_id}. Skipping execution."
            )

            self._trace_control_end(
                control_id,
                status="SKIPPED",
                duration=0
            )
            return

        # -----------------------------------------------------
        # EXECUTION LOOP
        # -----------------------------------------------------
        for source_id, target_id, mappings in relevant_pairs:

            if source_id not in self.source_connections:
                logger.error(f"Missing SOURCE connection: {source_id}")
                continue

            if target_id not in self.target_connections:
                logger.error(f"Missing TARGET connection: {target_id}")
                continue

            source_adapter = self.source_connections[source_id]
            target_adapter = self.target_connections[target_id]

            # -------------------------------------------------
            # RULE ISOLATION EXECUTION
            # -------------------------------------------------
            from app.orchestration.execution.rule_isolation import RuleIsolationExecutor
            from app.execution.rule_executor import RuleExecutor

            def executor_factory(**kwargs):
                return RuleExecutor(**kwargs)

            isolated_executor = RuleIsolationExecutor(executor_factory)

            results = isolated_executor.execute(
                source_adapter=source_adapter,
                target_adapter=target_adapter,
                engine_db=self.engine_db,
                batch_id=self.batch_id,
                project_id=self.project_id,
                control_id=control_id,
                config=self.config,
                mappings=mappings
            )

            logger.info(
                f"[RULE_ISOLATION_COMPLETE] control={control_id} "
                f"total_rules={len(results)}"
            )

        # -----------------------------------------------------
        # CONTROL COMPLETE
        # -----------------------------------------------------
        duration = round((time.time() - start), 2)

        self._trace_control_end(
            control_id,
            status="SUCCESS",
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )

        

    

    def _execute_control_legacy_20260504_3(self, control_id):

        import time
        start = time.time()

        self._trace_control_start(control_id)

        # -----------------------------------------------------
        # SAFE FILTER: only mappings relevant to this control
        # CONTRACT HARDENING (v3.2)
        # -----------------------------------------------------

        relevant_pairs = []

        for pair in self.valid_pairs:

            # -------------------------------------------------
            # CONTRACT HARDENING
            # Supports:
            # (source, target)
            # (source, target, mappings)
            # -------------------------------------------------
            if len(pair) == 3:
                source_id, target_id, mappings = pair
            elif len(pair) == 2:
                source_id, target_id = pair
                mappings = {}
            else:
                logger.error(f"Invalid mapping pair format: {pair}")
                continue

            # -------------------------------------------------
            # CONTROL FILTERING
            # -------------------------------------------------
            control_ids = []

            if isinstance(mappings, dict):
                control_ids = mappings.get("control_ids", [])

                # empty = applies to all controls
                if not control_ids:
                    control_ids = [control_id]

            elif isinstance(mappings, list):
                for m in mappings:
                    if isinstance(m, dict) and m.get("control_id"):
                        control_ids.append(m["control_id"])

                if not control_ids:
                    control_ids = [control_id]

            else:
                control_ids = [control_id]

            # -------------------------------------------------
            # FINAL FILTER CHECK
            # -------------------------------------------------
            if control_id in control_ids:
                relevant_pairs.append((source_id, target_id, mappings))

        # -----------------------------------------------------
        # NO VALID PAIRS → SKIP
        # -----------------------------------------------------
        if not relevant_pairs:
            logger.warning(
                f"No mappings found for control {control_id}. Skipping execution."
            )

            self._trace_control_end(
                control_id,
                status="SKIPPED",
                duration=0
            )
            return

        # -----------------------------------------------------
        # EXECUTION LOOP (RESTORED + FIXED)
        # -----------------------------------------------------
        for source_id, target_id, mappings in relevant_pairs:

            if source_id not in self.source_connections:
                logger.error(f"Missing SOURCE connection: {source_id}")
                continue

            if target_id not in self.target_connections:
                logger.error(f"Missing TARGET connection: {target_id}")
                continue

            source_adapter = self.source_connections[source_id]
            target_adapter = self.target_connections[target_id]

            logger.info(
                f"Executing CONTROL={control_id} | SOURCE={source_id} → TARGET={target_id}"
            )

            # -------------------------------------------------
            # RULE EXECUTOR (PRIMARY FIX)
            # -------------------------------------------------
            from app.execution.rule_executor import RuleExecutor

            executor = RuleExecutor(
                engine_db=self.engine_db,
                source_db=source_adapter,
                target_db=target_adapter,
                batch_id=self.batch_id,
                project_id=self.project_id,
                control_id=control_id,
                config=self.config
            )

            try:
                executor.execute_rules()

            except Exception as e:
                logger.error(
                    f"[CONTROL_EXECUTION_ERROR] control={control_id} "
                    f"source={source_id} target={target_id} error={str(e)}"
                )

        # -----------------------------------------------------
        # CONTROL COMPLETE
        # -----------------------------------------------------
        duration = round((time.time() - start), 2)

        self._trace_control_end(
            control_id,
            status="SUCCESS",
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )



    def _execute_control_legacy_20260505_4(self, control_id):

        import time
        start = time.time()

        self._trace_control_start(control_id)

        # -----------------------------------------------------
        # SAFE FILTER
        # -----------------------------------------------------
        relevant_pairs = []

        for pair in self.valid_pairs:

            if len(pair) == 3:
                source_id, target_id, mappings = pair
            elif len(pair) == 2:
                source_id, target_id = pair
                mappings = []
            else:
                logger.error(f"Invalid mapping pair format: {pair}")
                continue

            # -------------------------------------------------
            # 🔥 CRITICAL FIX: HANDLE DB MAPPINGS (LIST OF TUPLES)
            # -------------------------------------------------
            if isinstance(mappings, list):

                # DB mappings exist → ALWAYS EXECUTE
                if len(mappings) > 0:
                    relevant_pairs.append((source_id, target_id, mappings))

                continue

            # -------------------------------------------------
            # STRUCTURED CONTRACT (DICT - FUTURE)
            # -------------------------------------------------
            if isinstance(mappings, dict):
                control_ids = mappings.get("control_ids", [])

                if not control_ids or control_id in control_ids:
                    relevant_pairs.append((source_id, target_id, mappings))

                continue

            # -------------------------------------------------
            # FALLBACK SAFETY
            # -------------------------------------------------
            relevant_pairs.append((source_id, target_id, mappings))

        # -----------------------------------------------------
        # NO VALID PAIRS → SKIP
        # -----------------------------------------------------
        if not relevant_pairs:
            logger.warning(
                f"No mappings found for control {control_id}. Skipping execution."
            )

            self._trace_control_end(
                control_id,
                status="SKIPPED",
                duration=0
            )
            return

        # -----------------------------------------------------
        # EXECUTION LOOP
        # -----------------------------------------------------
        for source_id, target_id, mappings in relevant_pairs:

            if source_id not in self.source_connections:
                logger.error(f"Missing SOURCE connection: {source_id}")
                continue

            if target_id not in self.target_connections:
                logger.error(f"Missing TARGET connection: {target_id}")
                continue

            source_adapter = self.source_connections[source_id]
            target_adapter = self.target_connections[target_id]

            logger.info(
                f"Executing CONTROL={control_id} | SOURCE={source_id} → TARGET={target_id}"
            )

            #from app.execution.rule_executor import RuleExecutor
            from app.rule_executor import RuleExecutor

            executor = RuleExecutor(
                engine_db=self.engine_db,
                source_db=source_adapter,
                target_db=target_adapter,
                batch_id=self.batch_id,
                project_id=self.project_id,
                control_id=control_id,
                config=self.config
            )

            try:
                executor.execute_rules()

            except Exception as e:
                logger.error(
                    f"[CONTROL_EXECUTION_ERROR] control={control_id} "
                    f"source={source_id} target={target_id} error={str(e)}"
                )

        # -----------------------------------------------------
        # COMPLETE
        # -----------------------------------------------------
        duration = round((time.time() - start), 2)

        self._trace_control_end(
            control_id,
            status="SUCCESS",
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )

        

        # -----------------------------------------------------
        # RULE-LEVEL ISOLATION (v3.2)
        # -----------------------------------------------------
        from app.orchestration.execution.rule_isolation import RuleIsolationExecutor
        from app.execution.rule_executor import RuleExecutor

        def executor_factory(**kwargs):
            return RuleExecutor(**kwargs)

        isolated_executor = RuleIsolationExecutor(executor_factory)

        # -----------------------------------------------------
        # EXECUTION LOOP (SAFE + ISOLATED)
        # -----------------------------------------------------
        for source_id, target_id, mappings in relevant_pairs:

            if source_id not in self.source_connections:
                logger.error(f"Missing SOURCE connection: {source_id}")
                continue

            if target_id not in self.target_connections:
                logger.error(f"Missing TARGET connection: {target_id}")
                continue

            source_adapter = self.source_connections[source_id]
            target_adapter = self.target_connections[target_id]

            logger.info(
                f"Executing CONTROL={control_id} | SOURCE={source_id} → TARGET={target_id}"
            )

            try:
                #results = isolated_executor.execute(
                #    source_adapter=source_adapter,
                #    target_adapter=target_adapter,
                #    engine_db=self.engine_db,
                #    batch_id=self.batch_id,
                #    project_id=self.project_id,
                #    control_id=control_id,
                #    config=self.config,
                #    mappings=mappings if isinstance(mappings, dict) else {}
                #)


                
                #logger.info(
                #    f"[RULE_ISOLATION_COMPLETE] control={control_id} "
                #    f"source={source_id} target={target_id} "
                #    f"total_rules={len(results)}"
                #)


                context = {
                    "source_adapter": source_adapter,
                    "target_adapter": target_adapter,
                    "engine_db": self.engine_db,
                    "batch_id": self.batch_id,
                    "project_id": self.project_id,
                    "control_id": control_id,
                    "config": self.config,
                    "mappings": mappings if isinstance(mappings, dict) else {}
                }

                results = isolated_executor.execute(**context)

                # -----------------------------------------------------
                # SELECTIVE RULE RETRY (v3.3)
                # -----------------------------------------------------
                retry_manager = RuleRetryManager(max_retries=1)

                final_results = retry_manager.retry(
                    isolated_executor=isolated_executor,
                    context=context,
                    results=results
                )     

                logger.info(
                    f"[RETRY_COMPLETE] control={control_id} "
                    f"initial_rules={len(results)} final_rules={len(final_results)}"
                )

            except Exception as e:
                logger.error(
                    f"[CONTROL_EXECUTION_ERROR] control={control_id} "
                    f"source={source_id} target={target_id} error={str(e)}"
                )

        # -----------------------------------------------------
        # TRACE COMPLETE
        # -----------------------------------------------------
        duration = round((time.time() - start), 2)

        self._trace_control_end(
            control_id,
            status="SUCCESS",
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | duration={duration}s"
        )

    
    def _execute_control(self, control_id):

        import time
        from app.rule_executor import RuleExecutor  # ✅ move import to top of method

        start = time.time()
        self._trace_control_start(control_id)

        relevant_pairs = []

        # -----------------------------------------------------
        # SAFE FILTER
        # -----------------------------------------------------
        for pair in self.valid_pairs:

            if len(pair) == 3:
                source_id, target_id, mappings = pair
            elif len(pair) == 2:
                source_id, target_id = pair
                mappings = []
            else:
                logger.error(f"Invalid mapping pair format: {pair}")
                continue

            # DB mappings (list)
            if isinstance(mappings, list):
                if len(mappings) > 0:
                    relevant_pairs.append((source_id, target_id, mappings))
                continue

            # Dict mappings (future contract)
            if isinstance(mappings, dict):
                control_ids = mappings.get("control_ids", [])
                if not control_ids or control_id in control_ids:
                    relevant_pairs.append((source_id, target_id, mappings))
                continue

            # fallback
            relevant_pairs.append((source_id, target_id, mappings))

        # -----------------------------------------------------
        # NO VALID PAIRS → SKIP
        # -----------------------------------------------------
        if not relevant_pairs:
            logger.warning(f"No mappings found for control {control_id}. Skipping execution.")
            self._trace_control_end(control_id, status="SKIPPED", duration=0)
            return

        # -----------------------------------------------------
        # EXECUTION LOOP
        # -----------------------------------------------------
        control_failed = False

        for source_id, target_id, mappings in relevant_pairs:

            if source_id not in self.source_connections:
                logger.error(f"Missing SOURCE connection: {source_id}")
                control_failed = True
                continue

            if target_id not in self.target_connections:
                logger.error(f"Missing TARGET connection: {target_id}")
                control_failed = True
                continue

            source_adapter = self.source_connections[source_id]
            target_adapter = self.target_connections[target_id]

            logger.info(
                f"Executing CONTROL={control_id} | SOURCE={source_id} → TARGET={target_id}"
            )

            executor = RuleExecutor(
                engine_db=self.engine_db,
                source_db=source_adapter,
                target_db=target_adapter,
                batch_id=self.batch_id,
                project_id=self.project_id,
                control_id=control_id,
                config=self.config
            )

            try:
                executor.execute_rules()

            except Exception as e:
                logger.error(
                    f"[CONTROL_EXECUTION_ERROR] control={control_id} "
                    f"source={source_id} target={target_id} error={str(e)}"
                )
                control_failed = True

        # -----------------------------------------------------
        # FINAL STATUS
        # -----------------------------------------------------
        duration = round((time.time() - start), 2)

        final_status = "FAILED" if control_failed else "SUCCESS"

        self._trace_control_end(
            control_id,
            status=final_status,
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | status={final_status} | duration={duration}s"
        )


    def _execute_control_legacy_202600_(self, control_id):
        from app.rule_executor import RuleExecutor  # ✅ move import to top of method
        executor = RuleExecutor(
            engine_db=self.engine_db,
            source_db=self.source_connections,
            target_db=self.target_connections,
            batch_id=self.batch_id,
            project_id=self.project_id,
            control_id=control_id,
            config=self.config
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
        


    def _register_batch_legacy_20260605_1(self, total_controls):

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
        audit_logger.audit(f"GOVERNANCE_DECISION | Batch ID: {self.batch_id} | Decision: {migration_status} | Outcome: FINALIZED")





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

    
    def _trace(self, event_type, payload):
        """
        Central execution trace logger (in-memory + structured logs)
        """
        event = {
            "batch_id": self.batch_id,
            "project_id": self.project_id,
            "event_type": event_type,
            "timestamp": time.time(),
            "payload": payload
        }

        # in-memory trace (for debugging / export later)
        self.execution_trace.append(event)

        # structured logging (safe for production observability tools)
        logger.info(f"[TRACE] {event_type} | {payload}")


    def _trace_control_start(self, control_id):
        self.control_trace_map[control_id] = {
            "start_time": time.time(),
            "status": "RUNNING"
        }

        self._trace("CONTROL_START", {
            "control_id": control_id
        })


    def _trace_control_end(self, control_id, status, duration):
        if control_id in self.control_trace_map:
            self.control_trace_map[control_id].update({
                "end_time": time.time(),
                "status": status,
                "duration": duration
            })

        self._trace("CONTROL_END", {
            "control_id": control_id,
            "status": status,
            "duration": duration
        })

    def export_execution_trace(self):
        """
        Returns full execution trace for debugging / audit export
        """
        return {
            "batch_id": self.batch_id,
            "project_id": self.project_id,
            "trace": self.execution_trace,
            "control_map": self.control_trace_map
        }

    #-------------------------------------------------------
    # 🔥 METHOD 1 — VALIDATE DEPENDENCIES
    # Control execution with dependency checks
    # Validate control dependencies before execution starts 
    # This is a safety check to ensure that the control dependency graph is well-formed and there are no missing references that could cause execution errors
    # This can be called after loading controls and before starting execution
    def _validate_dependencies(self, control_ids):

        invalid_refs = []

        for cid in control_ids:
            deps = self.control_dependencies.get(cid, [])

            for dep in deps:
                if dep not in control_ids:
                    invalid_refs.append((cid, dep))

        if invalid_refs:
            for cid, dep in invalid_refs:
                logger.error(f"Invalid dependency: {cid} depends on missing {dep}")

            raise ValueError("Invalid control dependencies detected")
        

    #-------------------------------------------------------------------------------------------
    # 🔥 METHOD 2 — CYCLE DETECTION
    # Implement cycle detection in the control dependency graph
    # This is critical to prevent infinite loops and ensure that the execution flow is acyclic,
    # which is a fundamental requirement for a DAG-based execution engine. This can be implemented 
    # using depth-first search (DFS) or Kahn's algorithm to detect cycles before execution begins.
    #----------------------------------------------------------------------------------------------
    def _detect_cycles(self, control_ids):

        visited = set()
        rec_stack = set()

        def dfs(node):

            visited.add(node)
            rec_stack.add(node)

            for dep in self.control_dependencies.get(node, []):
                if dep not in control_ids:
                    continue

                if dep not in visited:
                    if dfs(dep):
                        return True
                elif dep in rec_stack:
                    return True

            rec_stack.remove(node)
            return False

        for cid in control_ids:
            if cid not in visited:
                if dfs(cid):
                    raise ValueError(f"DAG cycle detected involving control {cid}")
                

    #------------------------------------------------------------------------------------
    # 🔥 METHOD 3 — DAG TRACE (OPTIONAL BUT IMPORTANT)
    # Implement detailed DAG execution tracing for debugging and observability
    # This can log the execution order of controls, timing, and any issues with dependencies in
    # real-time, which is crucial for diagnosing issues in complex DAGs and ensuring that the execution flow is as expected.
    #-------------------------------------------------------------------------------------

    def _trace_dag_event(self, message, payload=None):

        log_msg = f"[DAG] {message}"

        if payload:
            log_msg += f" | {payload}"

        logger.debug(log_msg)


    def _execute_control_with_retry(self, control_id):

        attempt = 0

        while attempt <= self.max_retries:

            try:
                if attempt > 0:
                    logger.warning(
                        f"[RETRY] Control {control_id} attempt {attempt}/{self.max_retries}"
                    )

                #self._execute_control(control_id)


                from app.execution.control_executor import ControlExecutor
                from app.execution.execution_context import ExecutionContext

                context = ExecutionContext(
                    batch_id=self.batch_id,
                    project_id=self.project_id,
                    engine_db=self.engine_db,
                    source_db=self.source_db,
                    target_db=self.target_db,
                    config=self.config,
                    source_connections=self.source_connections,
                    target_connections=self.target_connections
                )

                executor = ControlExecutor(context)

                result = executor.execute(control_id)




                return True  # SUCCESS

            except Exception as e:

                attempt += 1

                logger.error(
                    f"[RETRY] Control {control_id} failed on attempt {attempt}: {str(e)}"
                )

                if attempt > self.max_retries:

                    logger.error(
                        f"[RETRY] Control {control_id} exhausted all retries"
                    )
                    return False

                if self.retry_delay_seconds > 0:
                    import time
                    time.sleep(self.retry_delay_seconds)
                

    def _register_batch(self, total_controls):

        existing = self.engine_db.fetch_all("""
            SELECT batch_status
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """, (self.batch_id,))

        if existing:
            status = existing["batch_status"]

            if status == "RUNNING":
                raise RuntimeError(f"Batch {self.batch_id} is already running")

            if status == "COMPLETED":
                logger.warning(f"Batch {self.batch_id} already completed — skipping execution")
                return False

        # Insert new batch as RUNNING
        self.engine_db.execute("""
            INSERT INTO engine.migration_batch_registry (
                batch_id,
                project_id,
                batch_start_time,
                batch_status,
                total_controls,
                completed_controls,
                failed_controls
            )
            VALUES (%s, %s, NOW(), 'RUNNING', %s, 0, 0)
        """, (self.batch_id, self.project_id, total_controls))

        return True    