from ast import Add
from unittest import result
import uuid
from .db_connector import DBConnector
from .rule_executor import RuleExecutor
from .scoring_engine import ScoringEngine

class ExecutionEngine:

    def __init__legacy(self, config):
        self.batch_id = str(uuid.uuid4())
        self.config = config

        self.engine_db = DBConnector(config["engine_db"])
        self.source_db = DBConnector(config["source_db"])
        self.target_db = DBConnector(config["target_db"])

    def __init__(self, config):
        self.batch_id = str(uuid.uuid4())
        self.config = config    

        # NEW: project awareness (mandatory for SaaS)
        self.project_id = config["project_id"]

        self.engine_db = DBConnector(config["engine_db"])
        self.source_db = DBConnector(config["source_db"])
        self.target_db = DBConnector(config["target_db"])

    def run(self):
        self._create_batch()

        controls = self._get_enabled_controls()

        for control in controls:
            self._execute_control(control[0])

        self._finalise_batch()

    def _create_batch_legacy(self):
        query = """
        INSERT INTO engine.migration_validation_batch
        (batch_id, execution_start, overall_status)
        VALUES (%s, NOW(), 'RUNNING')
        """
        self.engine_db.execute(query, (self.batch_id,))

    def _create_batch(self):
        query = """
        INSERT INTO engine.migration_validation_batch
        (batch_id, project_id, execution_start, overall_status)
        VALUES (%s, %s, NOW(), 'RUNNING')
        """
        self.engine_db.execute(query, (self.batch_id, self.project_id))

    def _get_enabled_controls_legacy(self):
        query = """
        SELECT control_id
        FROM engine.control_registry
        WHERE enabled_flag = TRUE
        ORDER BY control_id
        """
        return self.engine_db.execute(query)

    def _get_enabled_controls(self):
        query = """
        SELECT control_id
        FROM engine.control_registry
        WHERE enabled_flag = TRUE
        AND project_id = %s
        ORDER BY control_id
        """
        return self.engine_db.execute(query, (self.project_id,))

    def _execute_control_legacy(self, control_id):
        executor = RuleExecutor(
            self.engine_db,
            self.source_db,
            self.target_db,
            self.batch_id,
            control_id
        )
        executor.execute_rules()

    def _execute_control(self, control_id):
        executor = RuleExecutor(
            self.engine_db,
            self.source_db,
            self.target_db,
            self.batch_id,
            self.project_id,   # NEW
            control_id
        )
        executor.execute_rules()

    #Add certification write
    #Add enforcement_mode logic
    #Properly call release gate
    #Preserve backward compatibility

    def _finalise_batch(self):

        # ------------------------------------------
        # Aggregate Control-Level Results
        # ------------------------------------------

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

        # ------------------------------------------
        # Determine Batch Status
        # Batch Execution Status Logic:
        # ------------------------------------------

        if blocked > 0:
            overall_status = "BLOCKED"
        elif errors > 0:
            overall_status = "ERROR"
        elif failed > 0:
            overall_status = "FAIL"
        else:
            overall_status = "PASS"

        # ------------------------------------------
        # Persist Batch Summary
        # → Control Aggregation
        # ------------------------------------------

        insert_query = """
        INSERT INTO engine.migration_batch_summary
        (batch_id, overall_status, total_controls,
        passed_controls, failed_controls, error_controls, blocked_controls)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(insert_query, (
            self.batch_id,
            overall_status,
            total_controls,
            passed,
            failed,
            errors,
            blocked
        ))

        # ------------------------------------------
        # Calculate Risk-Weighted Score
        # → Governance Score
        # ------------------------------------------

        scoring = ScoringEngine(self.engine_db, self.batch_id)
        score = scoring.calculate_overall()

        # ------------------------------------------
        # Close Batch
        # ------------------------------------------

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


        # ------------------------------------------
        #→ run_governance_intelligence(batch_id)
        # 1. Run governance intelligence first
        # ------------------------------------------
        result = self.engine_db.execute(
            "SELECT * FROM engine.run_governance_intelligence(%s)",
            (self.batch_id,)
        )

        #anomaly_score = result[0][0]
        #anomaly_flag = result[0][1]
        #auto_blocked = result[0][2]

        anomaly_score = result[0][0]
        anomaly_flag = result[0][1]
        auto_blocked = result[0][2]
        #-----------------------------------------------
        #→ Persist intelligence
        # 2. If intelligence auto-blocks, override status
        #-----------------------------------------------
        if auto_blocked:
            raise Exception(
                f"RELEASE BLOCKED: Governance anomaly threshold breached. Score={anomaly_score}"
            )

        #if auto_blocked:
        #    overall_status = "BLOCKED"


        # ------------------------------------------
        # Enforce Release Gate + Certification
        # ------------------------------------------

        self._enforce_release_gate(overall_status, score)


        # ------------------------------------------
        #This version:
        #Writes certification record
        #Supports STRICT and RECORD_ONLY
        #Defaults approved_by = SYSTEM
        #Uses config safely
        # ------------------------------------------

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

        # ------------------------------------------
        # Persist Certification Record
        # ------------------------------------------

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


        
        # ------------------------------------------
        # Enforcement Behavior
        # ------------------------------------------

        if gate_result == "REJECTED" and enforcement_mode == "STRICT":
            raise SystemExit(
                f"RELEASE BLOCKED: Batch {self.batch_id} - {decision_reason}"
            )

