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

    def __init___legacy_1(self, config):
        self.batch_id = str(uuid.uuid4())
        self.config = config

        # Mandatory for SaaS
        self.project_id = config["project_id"]

        # Load rule enablement configuration
        self.rule_config = config.get("rules", {})




        self.engine_db = DBConnector(config["engine_db"])
        self.source_db = DBConnector(config["source_db"])
        self.target_db = DBConnector(config["target_db"])


    def __init__(self, config, batch_id=None):

        # Configuration
        self.config = config

        # Mandatory for SaaS
        self.project_id = config["project_id"]

        # Batch ID handling (supports restart)
        if batch_id:
            self.batch_id = batch_id
        else:
            self.batch_id = str(uuid.uuid4())

        # Load rule enablement configuration
        self.rule_config = config.get("rules", {})

        # Database connections
        self.engine_db = DBConnector(config["engine_db"])
        self.source_db = DBConnector(config["source_db"])
        self.target_db = DBConnector(config["target_db"])


        self.control_timeout_seconds = config.get("engine", {}).get(
            "control_timeout_seconds",
            300
        )

        # ------------------------------------------------------
        # Load control dependencies configuration (for future use in execution orchestration)
        #----------------------------------------------------------
        self.control_dependencies = config.get("control_dependencies", {})

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




    def run_legacy_3_b(self):

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

    

    def run_legacy_4(self):

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

                    last_control = self._load_checkpoint()

                    resume = last_control is None

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




    
    def run_legacy_5(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed

        MAX_WORKERS = 4  # Can move to config.yaml later

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
            # Load checkpoint (if batch restarting)
            # -----------------------------------------------------
            last_control = self._load_checkpoint()

            if last_control:
                logger.info(f"Resuming batch from checkpoint after control {last_control}")
            else:
                logger.info("No checkpoint found — starting batch from beginning")

            resume = last_control is None

            # -----------------------------------------------------
            # Parallel Control Execution
            # -----------------------------------------------------
            logger.info(f"Starting parallel execution with {MAX_WORKERS} workers")

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

                futures = {}

                for control in controls:

                    control_id = control[0]

                    # ---------------------------------------------
                    # Resume Logic
                    # ---------------------------------------------
                    if not resume:

                        if control_id == last_control:
                            resume = True
                            continue
                        else:
                            logger.info(f"Skipping control {control_id} (already completed)")
                            continue

                    # ---------------------------------------------
                    # Schedule control execution
                    # ---------------------------------------------
                    logger.info(f"Scheduling control {control_id}")

                    future = executor.submit(self._execute_control, control_id)

                    futures[future] = control_id

                # -------------------------------------------------
                # Process completed tasks
                # -------------------------------------------------
                for future in as_completed(futures):

                    control_id = futures[future]

                    try:

                        future.result()

                        logger.info(f"Control {control_id} completed")

                        # Save checkpoint
                        self._save_checkpoint(control_id)

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

        
    


    def run_legacy_6(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed

        MAX_WORKERS = 4  # Can move to config.yaml later

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
            # Load checkpoint (if batch restarting)
            # -----------------------------------------------------
            last_control = self._load_checkpoint()

            if last_control:
                logger.info(f"Resuming batch from checkpoint after control {last_control}")
            else:
                logger.info("No checkpoint found — starting batch from beginning")

            resume = last_control is None

            # -----------------------------------------------------
            # Parallel Control Execution
            # -----------------------------------------------------
            logger.info(f"Starting parallel execution with {MAX_WORKERS} workers")

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

                futures = {}

                for control in controls:

                    control_id = control[0]

                    # ---------------------------------------------
                    # Resume Logic
                    # ---------------------------------------------
                    if not resume:

                        if control_id == last_control:
                            resume = True
                            continue
                        else:
                            logger.info(f"Skipping control {control_id} (already completed)")
                            continue

                    # ---------------------------------------------
                    # Schedule control execution
                    # ---------------------------------------------
                    logger.info(f"Scheduling control {control_id}")

                    future = executor.submit(self._execute_control, control_id)

                    futures[future] = control_id

                # -------------------------------------------------
                # Process completed tasks
                # -------------------------------------------------
                for future in as_completed(futures):

                    control_id = futures[future]

                    try:

                        future.result()

                        logger.info(f"Control {control_id} completed")

                        # Save checkpoint
                        self._save_checkpoint(control_id)

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




    def run_legacy_8(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed

        MAX_WORKERS = 4

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
            #self._register_batch(len(controls))

            #logger.info(f"Batch {self.batch_id} registered")

            # -----------------------------------------------------
            # Checkpoint Logic
            # It allows us to resume a batch from the last completed control in case of failure or 
            # #if we want to restart with new rules after discovery without re-running already completed controls
            #  python -m app.main run --config config.yaml --resume-batch e44b11b0-8132-404c-bc4d-e250c1f14dab
            # -----------------------------------------------------

            if not self._load_checkpoint():

                self._register_batch(len(controls))

                logger.info(f"Batch {self.batch_id} registered")

            else:

                logger.info(f"Resuming existing batch {self.batch_id} — registration skipped")



            # -----------------------------------------------------
            # Load checkpoint
            # -----------------------------------------------------
            last_control = self._load_checkpoint()

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
                        f"Checkpoint control {last_control} not found. "
                        f"Running full batch."
                    )

            else:

                logger.info("No checkpoint found — starting batch from beginning")

            # -----------------------------------------------------
            # If nothing left to run
            # -----------------------------------------------------
            if not controls:

                logger.info("All controls already completed according to checkpoint.")
                self._complete_batch("COMPLETED")
                self._evaluate_governance()
                return

            # -----------------------------------------------------
            # Parallel Execution
            # -----------------------------------------------------
            logger.info(f"Starting parallel execution with {MAX_WORKERS} workers")

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

                futures = {}

                for control in controls:

                    control_id = control[0]

                    logger.info(f"Scheduling control {control_id}")

                    future = executor.submit(self._execute_control, control_id)

                    futures[future] = control_id

                # -------------------------------------------------
                # Process completed tasks
                # -------------------------------------------------
                for future in as_completed(futures):

                    control_id = futures[future]

                    try:

                        #future.result()

                        #-----------------------------------------------------
                        # NEW: Add timeout handling for controls
                        #-----------------------------------------------------

                        future.result(timeout=self.control_timeout_seconds)

                        logger.info(f"Control {control_id} completed")

                        # Update progress
                        self._update_control_progress(True)

                        # Save checkpoint AFTER success
                        self._save_checkpoint(control_id)

                    except Exception as e:

                        logger.error(f"Control {control_id} failed: {str(e)}")

                        self._update_control_progress(False)

                        # Failure isolation: continue executing other controls
                        continue


        
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



    
    def run_legacy_9(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed

        MAX_WORKERS = 4

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
            #self._register_batch(len(controls))

            #logger.info(f"Batch {self.batch_id} registered")

            # -----------------------------------------------------
            # Checkpoint Logic
            # It allows us to resume a batch from the last completed control in case of failure or 
            # #if we want to restart with new rules after discovery without re-running already completed controls
            #  python -m app.main run --config config.yaml --resume-batch e44b11b0-8132-404c-bc4d-e250c1f14dab
            # -----------------------------------------------------

            #if not self._load_checkpoint():

            #    self._register_batch(len(controls))

            #    logger.info(f"Batch {self.batch_id} registered")

            #else:

            #    logger.info(f"Resuming existing batch {self.batch_id} — registration skipped")


            last_control = self._load_checkpoint()

            if not last_control:

                self._register_batch(len(controls))

                logger.info(f"Batch {self.batch_id} registered")

            else:

                logger.info(f"Resuming existing batch {self.batch_id} — registration skipped")



            # -----------------------------------------------------
            # Load checkpoint
            # -----------------------------------------------------
            #last_control = self._load_checkpoint()

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
                        f"Checkpoint control {last_control} not found. "
                        f"Running full batch."
                    )

            else:

                logger.info("No checkpoint found — starting batch from beginning")

            # -----------------------------------------------------
            # If nothing left to run
            # -----------------------------------------------------
            if not controls:

                logger.info("All controls already completed according to checkpoint.")
                self._complete_batch("COMPLETED")
                self._evaluate_governance()
                return


            # -----------------------------------------------------
            # Parallel Execution with Dependency DAG
            # -----------------------------------------------------
            logger.info(f"Starting parallel execution with {MAX_WORKERS} workers")

            completed_controls = set()
            remaining_controls = list(controls)

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

                while remaining_controls:

                    futures = {}
                    scheduled_this_round = []

                    # ---------------------------------------------
                    # Schedule controls whose dependencies are met
                    # ---------------------------------------------
                    for control in remaining_controls:

                        control_id = control[0]

                        dependencies = self.control_dependencies.get(control_id, [])

                        if any(dep not in completed_controls for dep in dependencies):
                            continue

                        logger.info(f"Scheduling control {control_id}")

                        future = executor.submit(self._execute_control, control_id)

                        futures[future] = control_id
                        scheduled_this_round.append(control)

                    # ---------------------------------------------
                    # Deadlock detection
                    # ---------------------------------------------
                    if not scheduled_this_round:
                        raise Exception("Dependency deadlock detected in control graph")

                    for c in scheduled_this_round:
                        remaining_controls.remove(c)

                    # ---------------------------------------------
                    # Process completed tasks
                    # ---------------------------------------------
                    for future in as_completed(futures):

                        control_id = futures[future]

                        try:

                            future.result(timeout=self.control_timeout_seconds)

                            logger.info(f"Control {control_id} completed")

                            completed_controls.add(control_id)

                            self._update_control_progress(True)

                            self._save_checkpoint(control_id)

                        except Exception as e:

                            logger.error(f"Control {control_id} failed: {str(e)}")

                            completed_controls.add(control_id)

                            self._update_control_progress(False)





                            self._save_checkpoint(control_id)

                        except Exception as e:

                            logger.error(f"Control {control_id} failed: {str(e)}")

                            completed_controls.add(control_id)

                            self._update_control_progress(False)

                            continue


        
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



    

    def run_legacy_10(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed

        MAX_WORKERS = 4

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
            #self._register_batch(len(controls))

            #logger.info(f"Batch {self.batch_id} registered")

            # -----------------------------------------------------
            # Checkpoint Logic
            # It allows us to resume a batch from the last completed control in case of failure or 
            # #if we want to restart with new rules after discovery without re-running already completed controls
            #  python -m app.main run --config config.yaml --resume-batch e44b11b0-8132-404c-bc4d-e250c1f14dab
            # -----------------------------------------------------

            #if not self._load_checkpoint():

            #    self._register_batch(len(controls))

            #    logger.info(f"Batch {self.batch_id} registered")

            #else:

            #    logger.info(f"Resuming existing batch {self.batch_id} — registration skipped")


            last_control = self._load_checkpoint()

            if not last_control:

                self._register_batch(len(controls))

                logger.info(f"Batch {self.batch_id} registered")

            else:

                logger.info(f"Resuming existing batch {self.batch_id} — registration skipped")



            # -----------------------------------------------------
            # Load checkpoint
            # -----------------------------------------------------
            #last_control = self._load_checkpoint()

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
                        f"Checkpoint control {last_control} not found. "
                        f"Running full batch."
                    )

            else:

                logger.info("No checkpoint found — starting batch from beginning")

            # -----------------------------------------------------
            # If nothing left to run
            # -----------------------------------------------------
            if not controls:

                logger.info("All controls already completed according to checkpoint.")
                self._complete_batch("COMPLETED")
                self._evaluate_governance()
                return


            # -----------------------------------------------------
            # Parallel Execution with Scalable DAG Scheduler
            # -----------------------------------------------------
            logger.info(f"Starting parallel execution with {MAX_WORKERS} workers")

            from collections import defaultdict, deque

            completed_controls = set()

            # Build dependency graph
            dependents = defaultdict(list)
            dependency_count = {}

            for control in controls:
                cid = control[0]
                deps = self.control_dependencies.get(cid, [])

                dependency_count[cid] = len(deps)

                for d in deps:
                    dependents[d].append(cid)

            # Controls ready to run
            ready_queue = deque(
                [cid for cid, count in dependency_count.items() if count == 0]
            )

            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:

                futures = {}

                while ready_queue or futures:

                    # -----------------------------------------
                    # Schedule ready controls
                    # -----------------------------------------
                    while ready_queue:

                        cid = ready_queue.popleft()

                        logger.info(f"Scheduling control {cid}")

                        future = executor.submit(self._execute_control, cid)

                        futures[future] = cid

                    # -----------------------------------------
                    # Process completed tasks
                    # -----------------------------------------
                    for future in as_completed(list(futures)):

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

                        # -------------------------------------
                        # Release dependent controls
                        # -------------------------------------
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



    def run(self):

        from concurrent.futures import ThreadPoolExecutor, as_completed
        from collections import defaultdict, deque

        MAX_WORKERS = 4

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

    def _execute_control(self, control_id):
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