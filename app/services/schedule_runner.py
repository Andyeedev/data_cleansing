import os
import subprocess
import sys
import time
import uuid
import logging
import copy
from datetime import datetime, timezone
from app.db.connection import get_db_connection

logger = logging.getLogger(__name__)


class ScheduleRunner:
    """
    Executes MAP CLI via subprocess and captures terminal output.
    Stores results in engine.schedule_execution_log.
    """

    def __init__(self):
        self.db = get_db_connection()
        self.project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    def _run_subprocess(self, schedule_id):
        env = copy.deepcopy(os.environ)
        env["PYTHONPATH"] = self.project_root + os.pathsep + env.get("PYTHONPATH", "")

        return subprocess.run(
            [sys.executable, "-m", "app.main", "run", "--config", "config.yaml"],
            capture_output=True,
            timeout=3600,
            cwd=self.project_root,
            env=env,
            encoding="utf-8",
            errors="replace",
        )

    def _update_schedule_status(self, schedule_id, status, last_status=None):
        query = """
            UPDATE engine.migration_schedules
            SET status = %s, last_status = COALESCE(%s, last_status),
                updated_at = NOW()
            WHERE schedule_id = %s
        """
        self.db.execute(query, (status, last_status, schedule_id))

    def _update_schedule_after_run(self, schedule_id, status):
        query = """
            UPDATE engine.migration_schedules
            SET last_run = NOW(), last_status = %s, status = %s,
                execution_count = execution_count + 1,
                failure_count = failure_count + CASE WHEN %s = 'failed' THEN 1 ELSE 0 END,
                updated_at = NOW()
            WHERE schedule_id = %s
        """
        self.db.execute(query, (status, status, status, schedule_id))

    def _create_execution_log(self, schedule_id, triggered_by="scheduled"):
        execution_id = str(uuid.uuid4())
        query = """
            INSERT INTO engine.schedule_execution_log
            (execution_id, schedule_id, status, triggered_by, started_at)
            VALUES (%s, %s, 'running', %s, NOW())
        """
        self.db.execute(query, (execution_id, schedule_id, triggered_by))
        return execution_id

    def _complete_execution_log(self, execution_id, status, terminal_output,
                                 error_message=None, exit_code=None, duration_seconds=None):
        query = """
            UPDATE engine.schedule_execution_log
            SET status = %s, terminal_output = %s, error_message = %s,
                exit_code = %s, duration_seconds = %s, completed_at = NOW()
            WHERE execution_id = %s
        """
        self.db.execute(query, (status, terminal_output, error_message, exit_code, duration_seconds, execution_id))

    def run_schedule(self, schedule_id, triggered_by="scheduled"):
        """
        Execute MAP CLI for a given schedule.
        Returns execution_id.
        """
        execution_id = None
        try:
            execution_id = self._create_execution_log(schedule_id, triggered_by)
            self._update_schedule_status(schedule_id, "running")

            start_time = time.time()

            result = self._run_subprocess(schedule_id)

            duration = int(time.time() - start_time)
            terminal_output = result.stdout
            if result.stderr:
                terminal_output = (terminal_output + "\n[STDERR]\n" + result.stderr).strip()
            if not terminal_output:
                terminal_output = "Command completed with no output."
            error_message = result.stderr if result.returncode != 0 else None
            status = "completed" if result.returncode == 0 else "failed"

            self._complete_execution_log(
                execution_id, status, terminal_output, error_message, result.returncode, duration
            )
            self._update_schedule_after_run(schedule_id, status)

            logger.info(f"Schedule {schedule_id} run completed: {status} ({duration}s)")
            return {"execution_id": execution_id, "status": status, "duration": duration}

        except subprocess.TimeoutExpired:
            duration = int(time.time() - start_time) if 'start_time' in dir() else 0
            if execution_id:
                self._complete_execution_log(
                    execution_id, "failed", "Execution timed out after 3600 seconds",
                    "TimeoutExpired", None, duration
                )
            self._update_schedule_after_run(schedule_id, "failed")
            return {"execution_id": execution_id, "status": "failed", "error": "Timeout"}

        except Exception as e:
            duration = int(time.time() - start_time) if 'start_time' in dir() else 0
            if execution_id:
                self._complete_execution_log(
                    execution_id, "failed", str(e), type(e).__name__, None, duration
                )
            self._update_schedule_after_run(schedule_id, "failed")
            logger.error(f"Schedule {schedule_id} run failed: {e}")
            return {"execution_id": execution_id, "status": "failed", "error": str(e)}