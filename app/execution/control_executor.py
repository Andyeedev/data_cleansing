import time
import traceback

from app.execution.execution_result import ExecutionResult
from app.execution.control_registry import CONTROL_REGISTRY
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ControlExecutor:

    def __init__(self, context):
        self.context = context

    # ---------------------------------------------------------
    # EXECUTE CONTROL SAFELY
    # ---------------------------------------------------------

    def execute(self, control_id):

        start = time.time()
        logger.info(f"    [CONTROL {control_id}] STARTED")

        try:

            control_class = CONTROL_REGISTRY.get(control_id)

            if not control_class:
                from app.controls.rule_adapter_control import RuleAdapterControl
                control_class = RuleAdapterControl

            control = control_class(self.context, control_id=control_id)

            result = control.execute()

            result.execution_time_ms = round(
                (time.time() - start) * 1000,
                2
            )

            status_verb = "PASSED" if result.status == "PASS" else "FAILED"
            logger.info(
                f"    [CONTROL {control_id}] {status_verb} ({int(result.execution_time_ms)}ms)"
            )

            from app.utils.logger import get_audit_logger
            audit_logger = get_audit_logger()
            audit_logger.audit(
                f"CONTROL_EXECUTED | Control ID: {control_id} | "
                f"Status: {result.status} | Outcome: COMPLETED"
            )

            return result

        except Exception as e:

            duration_ms = round((time.time() - start) * 1000, 2)
            logger.info(
                f"    [CONTROL {control_id}] FAILED ({int(duration_ms)}ms)"
            )

            logger.error(
                f"{control_id} execution failed\n"
                f"{traceback.format_exc()}"
            )

            return ExecutionResult(
                control_id=control_id,
                status="ERROR",
                error=str(e),
                execution_time_ms=duration_ms
            )
