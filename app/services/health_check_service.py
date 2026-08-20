"""
Health Check Service

Provides connection validation with audit trail logging.
Used by execution engine, discovery, and manual admin triggers.
"""

import time
from typing import Dict
from app.adapters.base_adapter import ConnectionAdapter
from app.utils.logger import get_logger

logger = get_logger(__name__)


class HealthCheckService:

    def __init__(self, engine_db):
        self.engine_db = engine_db

    def check_all(self, source_connections: Dict, target_connections: Dict,
                  initiated_by: str = "SYSTEM", user_id: str = "ENGINE") -> Dict:
        """Validate all connections and log results to audit table."""
        results = {}

        for label, connections in [("SOURCE", source_connections), ("TARGET", target_connections)]:
            for sys_id, adapter in connections.items():
                result = self._check_one(
                    sys_id=sys_id,
                    adapter=adapter,
                    label=label,
                    initiated_by=initiated_by,
                    user_id=user_id
                )
                results[sys_id] = result

                if result["status"] == "FAIL":
                    raise ConnectionError(
                        f"[{label}] Health check failed for system {sys_id}: {result['error_message']}"
                    )

        return results

    def check_single(self, system_id: str, adapter, label: str = "MANUAL",
                     initiated_by: str = "ADMIN", user_id: str = None) -> Dict:
        """Check a single system and log result."""
        result = self._check_one(
            sys_id=system_id,
            adapter=adapter,
            label=label,
            initiated_by=initiated_by,
            user_id=user_id
        )
        return result

    def get_history(self, system_id: str = None, limit: int = 50) -> list:
        """Get recent health check history."""
        if system_id:
            query = """
            SELECT h.check_id, h.system_id, s.system_name, h.check_time,
                   h.status, h.initiated_by, h.error_message, h.latency_ms,
                   h.checked_by_user
            FROM engine.connection_health_checks h
            LEFT JOIN core.system_registry s ON h.system_id = s.system_id
            WHERE h.system_id = %s
            ORDER BY h.check_time DESC
            LIMIT %s
            """
            rows = self.engine_db.execute(query, (system_id, limit))
        else:
            query = """
            SELECT h.check_id, h.system_id, s.system_name, h.check_time,
                   h.status, h.initiated_by, h.error_message, h.latency_ms,
                   h.checked_by_user
            FROM engine.connection_health_checks h
            LEFT JOIN core.system_registry s ON h.system_id = s.system_id
            ORDER BY h.check_time DESC
            LIMIT %s
            """
            rows = self.engine_db.execute(query, (limit,))

        return [self._row_to_dict(r) for r in rows]

    def _check_one(self, sys_id, adapter, label, initiated_by, user_id):
        """Run SELECT 1 on one adapter, measure latency, log to DB."""
        start = time.time()
        status = "PASS"
        error_message = None

        try:
            result = adapter.execute("SELECT 1")
            if result is None:
                status = "FAIL"
                error_message = f"Adapter returned None for SELECT 1"
        except Exception as e:
            status = "FAIL"
            error_message = str(e)

        latency_ms = int((time.time() - start) * 1000)

        self._log_result(
            system_id=sys_id,
            status=status,
            initiated_by=initiated_by,
            error_message=error_message,
            latency_ms=latency_ms,
            user_id=user_id
        )

        logger.info(
            f"Health check [{label}] system={sys_id} "
            f"status={status} latency={latency_ms}ms"
            + (f" error={error_message}" if error_message else "")
        )

        return {
            "system_id": str(sys_id),
            "status": status,
            "latency_ms": latency_ms,
            "error_message": error_message
        }

    def _log_result(self, system_id, status, initiated_by, error_message, latency_ms, user_id):
        """Insert health check result into audit table."""
        query = """
        INSERT INTO engine.connection_health_checks
        (system_id, status, initiated_by, error_message, latency_ms, checked_by_user)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.engine_db.execute(query, (
            system_id, status, initiated_by, error_message, latency_ms, user_id
        ))

    def _row_to_dict(self, row):
        return {
            "check_id": str(row[0]),
            "system_id": str(row[1]),
            "system_name": row[2],
            "check_time": str(row[3]),
            "status": row[4],
            "initiated_by": row[5],
            "error_message": row[6],
            "latency_ms": row[7],
            "checked_by_user": row[8]
        }
