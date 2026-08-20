import time
import uuid
from collections import defaultdict, deque
from concurrent.futures import ThreadPoolExecutor, as_completed

from app.utils.logger import get_logger, get_audit_logger, IndentContext
from app.orchestration.retry.rule_retry_manager import RuleRetryManager
from app.db.connection_factory import connection_factory
from app.db.connection_resolver import ConnectionResolver
from app.services.mapping_resolver import MappingResolver
from app.discovery.auto_rule_discovery import AutoRuleDiscovery
from app.orchestration.execution.rule_isolation import RuleIsolationExecutor
from app.rule_executor import RuleExecutor as RuleExecutorNew
from app.execution.control_executor import ControlExecutor
from app.execution.execution_context import ExecutionContext
from app.rule_executor import RuleExecutor
from .scoring_engine import ScoringEngine


logger = get_logger(__name__)
audit_logger = get_audit_logger()


class ExecutionEngine:

    def __init__(self, config, batch_id=None, batch_name=None, tenant_id=None):

        self.config = config

        # ✅ FIX: auto-generate batch_id if not provided
        self.batch_id = batch_id or str(uuid.uuid4())

        # ✅ batch_name (auto-generated if not provided)
        self.batch_name = batch_name

        # ✅ project_id
        self.project_id = config.get("project_id")

        # ✅ tenant_id
        self.tenant_id = tenant_id or config.get("tenant_id")

        engine_db_input = config.get("engine_db", {})

        # Support both pre-built connection objects and dict configs
        if isinstance(engine_db_input, dict):
            engine_db_config = engine_db_input.copy()
            if not engine_db_config.get("type"):
                engine_db_config["type"] = "postgres"
            self.engine_db = connection_factory(engine_db_config)
        else:
            # Already a PooledDBConnector or similar connection object
            self.engine_db = engine_db_input

        # ✅ configs
        self.rule_config = config.get("rules", {})
        self.control_dependencies = {}
        self._load_control_dependencies_from_db()
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

        MAX_WORKERS = 4

        logger.info(f"Starting batch {self.batch_id} for project {self.project_id}")
        audit_logger.audit(
            f"BATCH_STARTED | Batch ID: {self.batch_id} | "
            f"Project ID: {self.project_id} | Status: IN_PROGRESS"
        )

        # -----------------------------------------------------
        # [STEP 01/06] CONNECTION RESOLUTION
        # -----------------------------------------------------
        start_step1 = time.time()
        logger.info("[STEP 01/06] CONNECTION RESOLUTION STARTED")
        IndentContext.set_indent(1)

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
        # [STEP 01b] CONNECTION HEALTH CHECK
        # -----------------------------------------------------
        from app.services.health_check_service import HealthCheckService
        hc = HealthCheckService(self.engine_db)
        logger.info("[STEP 01b] VALIDATING ALL CONNECTIONS ...")
        try:
            hc.check_all(source_connections, target_connections,
                         initiated_by="SYSTEM", user_id="ENGINE")
        except ConnectionError as e:
            logger.error(f"[STEP 01b] HEALTH CHECK FAILED: {e}")
            self._complete_batch("FAILED")
            raise
        logger.info("[STEP 01b] ALL CONNECTIONS HEALTHY")
        logger.info("")

        # -----------------------------------------------------
        # [STEP 02/06] DATASET MAPPING
        # -----------------------------------------------------
        start_step2 = time.time()
        logger.info("[STEP 02/06] DATASET MAPPING STARTED")
        IndentContext.set_indent(1)

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

                    mappings = next((m for src, tgt, m in valid_pairs if src ==
                                    s_id and tgt == t_id), None)
                    if mappings:
                        logger.info(
                            f"    Connection: [ID: {s_id}] ({s_type}) -> "
                            f"[ID: {t_id}] ({t_type}) ... ✅ (Mapping resolved)"
                        )
                        audit_logger.audit(
                            f"MAPPING_RESOLVED | Source ID: {s_id} | "
                            f"Target ID: {t_id} | Outcome: SUCCESS"
                        )
            else:
                logger.info(
                    f"    Connection: [ID: {s_id}] ({s_type}) ... "
                    f"❌ (Skipped: No mapping defined)"
                )
                audit_logger.audit(
                    f"MAPPING_RESOLVED | Source ID: {s_id} | Target ID: N/A | "
                    f"Outcome: SKIPPED | Reason: No mapping defined"
                )

        if skipped_pairs and valid_pairs:
            logger.warning(
                f"    Notice: {len(skipped_pairs)} connection pair(s) "
                f"skipped due to missing mappings."
            )

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
            logger.info(
                f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

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
            logger.info(
                f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

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

                # -----------------------------------------------------
                # Batch Registration (IDEMPOTENCY GUARD FIRST)
                # -----------------------------------------------------
                should_run = self._register_batch(len(controls), self.batch_name)

                if should_run is False:
                    logger.debug(f"Skipping execution for batch {self.batch_id}")
                    return

                logger.debug(f"Batch {self.batch_id} registered or resumed")

            else:

                logger.debug(f"Resuming existing batch {self.batch_id} — registration skipped")

            if last_control:

                logger.debug(f"Checkpoint detected. Last completed control: {last_control}")

                control_ids_list = [c[0] for c in controls]

                if last_control in control_ids_list:

                    last_index = control_ids_list.index(last_control)
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
            control_ids = set(c[0] for c in controls)

            # -----------------------------------------------------
            # DAG VALIDATION (v3.2 HARDENING)
            # -----------------------------------------------------

            self._trace_dag_event("Validating control dependencies")

            valid_control_ids = self._validate_dependencies(control_ids)

            # Filter out controls with unsatisfied dependencies
            control_ids = valid_control_ids
            controls = [c for c in controls if c[0] in valid_control_ids]

            self._trace_dag_event(f"Controls after dependency check: {len(controls)}")

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
            logger.info(
                f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

            logger.debug(f"Starting parallel execution with {MAX_WORKERS} workers")

            completed_controls = set()

            # -----------------------------------------------------
            # Execute DAG
            # -----------------------------------------------------
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor_pool:

                futures = {}

                while ready_queue or futures:

                    # Schedule ready controls
                    while ready_queue:

                        cid = ready_queue.popleft()

                        logger.debug(f"Scheduling control {cid}")

                        self._trace_dag_event("CONTROL_SCHEDULED", {"control_id": cid})

                        future = executor_pool.submit(
                            self._execute_control_with_retry,
                            cid
                        )

                        futures[future] = cid

                    if (not futures and not ready_queue and
                            len(completed_controls) < len(control_ids)):

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
            logger.info(
                f"    Active Systems: {', '.join(f'[ID: {i}]' for i in self.active_source_ids)}")

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

    def _execute_control(self, control_id):

        start_time = time.time()
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
        duration = round((time.time() - start_time), 2)

        final_status = "FAILED" if control_failed else "SUCCESS"

        self._trace_control_end(
            control_id,
            status=final_status,
            duration=duration
        )

        logger.info(
            f"⏱ CONTROL COMPLETE | {control_id} | status={final_status} | duration={duration}s"
        )

    def _finalise_batch(self):

        query = """
        SELECT overall_status, COUNT(*)
        FROM engine.migration_control_summary
        WHERE batch_id = %s
        GROUP BY overall_status
        """

        results_db = self.engine_db.execute(query, (self.batch_id,))

        total_controls = 0
        passed = 0
        failed = 0
        errors = 0
        blocked = 0

        for status, count in results_db:
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
        result_gov = self.engine_db.execute(
            "SELECT * FROM engine.run_governance_intelligence(%s)",
            (self.batch_id,)
        )

        anomaly_score = result_gov[0][0]
        auto_blocked = result_gov[0][2]

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

    def _load_control_dependencies_from_db(self):
        """Load control dependencies from DB instead of config.yaml."""
        try:
            query = """
                SELECT control_id, depends_on_control_id
                FROM engine.control_dependencies
                WHERE project_id IS NULL OR project_id = %s
                ORDER BY project_id NULLS LAST, control_id
            """
            rows = self.engine_db.execute(query, (self.project_id,))

            for row in rows:
                control_id = row[0]
                dep = row[1]
                self.control_dependencies.setdefault(control_id, []).append(dep)

            if self.control_dependencies:
                logger.debug(f"Loaded control dependencies from DB: {self.control_dependencies}")
        except Exception as e:
            logger.warning(f"Could not load control dependencies from DB: {e}. Falling back to empty dependencies.")
            self.control_dependencies = {}

        # Fall back to config.yaml if DB had no dependencies
        if not self.control_dependencies:
            config_deps = self.config.get("control_dependencies", {})
            if config_deps:
                self.control_dependencies = config_deps
                logger.debug(f"Loaded control dependencies from config.yaml: {self.control_dependencies}")

    def _get_controls(self):

        query = """
        SELECT
        control_id
        FROM engine.control_registry
        WHERE enabled_flag = TRUE
        ORDER BY severity_level DESC, control_id
        """

        rows = self.engine_db.execute(query)

        filtered_controls = []

        for row in rows:

            control_id = row[0]

            if not self._is_rule_enabled(control_id):
                logger.info(f"Skipping control {control_id} (disabled in config.yaml)")
                continue

            filtered_controls.append(row)

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

        result_gov = self.engine_db.execute(query, (self.batch_id,))[0]

        blocking_rules = result_gov[0]
        failed_rules = result_gov[1]

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
        audit_logger.audit(
            f"GOVERNANCE_DECISION | Batch ID: {self.batch_id} | "
            f"Decision: {migration_status} | Outcome: FINALIZED"
        )

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

    def _dependencies_satisfied(self, control_id, completed_controls):

        deps = self.control_dependencies.get(control_id, [])

        for dep in deps:
            if dep not in completed_controls:
                return False

        return True

    def _get_failed_controls(self):

        query = """
        SELECT DISTINCT control_id
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        AND execution_status IN ('FAIL', 'ERROR')
        """

        rows_failed = self.engine_db.fetch_all(query, (self.batch_id,))

        return set(r[0] for r in rows_failed)

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

    def _validate_dependencies(self, control_ids):

        invalid_refs = []

        for cid in control_ids:
            deps = self.control_dependencies.get(cid, [])

            for dep in deps:
                if dep not in control_ids:
                    invalid_refs.append((cid, dep))

        if invalid_refs:
            for cid, dep in invalid_refs:
                logger.warning(f"Control {cid} depends on {dep} which is not enabled or available — skipping {cid}")

            # Return controls with valid dependencies only
            return [cid for cid in control_ids if not any(
                dep not in control_ids for dep in self.control_dependencies.get(cid, [])
            )]

        return list(control_ids)

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

                executor_ctrl = ControlExecutor(context)

                executor_ctrl.execute(control_id)

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
                    time.sleep(self.retry_delay_seconds)

    def _register_batch(self, total_controls, batch_name=None):

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

        # Auto-generate batch_name if not provided
        if not batch_name:
            project_row = self.engine_db.fetch_all("""
                SELECT project_name FROM core.projects WHERE project_id::text = %s
            """, (self.project_id,))
            project_name = project_row[0]["project_name"] if project_row else "Batch"
            from datetime import datetime
            batch_name = f"{project_name} - {datetime.now().strftime('%Y-%m-%d %H:%M')}"

        # Insert new batch as RUNNING
        self.engine_db.execute("""
            INSERT INTO engine.migration_batch_registry (
                batch_id,
                project_id,
                tenant_id,
                batch_name,
                batch_start_time,
                batch_status,
                total_controls,
                completed_controls,
                failed_controls
            )
            VALUES (%s, %s, %s, %s, NOW(), 'RUNNING', %s, 0, 0)
        """, (self.batch_id, self.project_id, self.tenant_id, batch_name, total_controls))

        return True
