from abc import ABC, abstractmethod

from app.execution.execution_result import ExecutionResult
from app.utils.logger import get_logger

logger = get_logger(__name__)


class BaseControl(ABC):

    control_id = None

    def __init__(self, context, control_id=None):
        self.context = context
        if control_id:
            self.control_id = control_id

    @abstractmethod
    def execute(self):
        pass

    # ---------------------------------------------------------
    # SAFE QUERY EXECUTION
    # ---------------------------------------------------------

    def safe_query(self, db, query, params=None):

        try:
            rows = db.execute(query, params)

            if rows is None:
                return []

            return rows

        except Exception as e:

            logger.error(
                f"{self.control_id} query failed: {str(e)}"
            )

            raise

    # ---------------------------------------------------------
    # SAFE UNPACK
    # ---------------------------------------------------------

    def safe_unpack(self, row, expected):

        if len(row) != expected:

            raise ValueError(
                f"{self.control_id} expected "
                f"{expected} columns "
                f"but got {len(row)} | row={row}"
            )

        return row

    # ---------------------------------------------------------
    # SUCCESS RESULT
    # ---------------------------------------------------------

    def success(self, msg="", records=0):

        return ExecutionResult(
            control_id=self.control_id,
            status="PASS",
            message=msg,
            records_processed=records
        )

    # ---------------------------------------------------------
    # FAILURE RESULT
    # ---------------------------------------------------------

    def fail(self, error):

        return ExecutionResult(
            control_id=self.control_id,
            status="FAIL",
            error=str(error)
        )