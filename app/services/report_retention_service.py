"""
OC-REPORT-001 — soft-delete retention and permanent purge.

There is ONE user-facing delete action (it sets `deleted_at`, a soft delete).
A single automated job performs the permanent delete once the retention window
has passed. This is the agreed design: the 30 days are a *rollback safety net*,
not a user-visible "deleted" state, because every read path filters
`deleted_at IS NULL`, so a soft-deleted report is already invisible everywhere.

Why this module exists as a service rather than inline SQL in the startup hook:
the retention window is configurable, and the deletion order is subtle enough
to deserve an explanation next to it.

CONFIGURATION
    REPORT_RETENTION_DAYS   retention window in days (default 30)
    REPORT_RETENTION_ENABLED   set to "false"/"0" to disable the job entirely
"""
from __future__ import annotations

import logging
import os
from typing import Any, Dict, List, Optional

from app.db.connection import get_db_connection

logger = logging.getLogger(__name__)

DEFAULT_RETENTION_DAYS = 30


def retention_days() -> int:
    """Retention window in days. Configurable so it can be raised later without
    a code change (a compiled-down constant would force a redeploy)."""
    raw = os.environ.get("REPORT_RETENTION_DAYS", "").strip()
    if not raw:
        return DEFAULT_RETENTION_DAYS
    try:
        value = int(raw)
    except ValueError:
        logger.warning(
            "REPORT_RETENTION_DAYS=%r is not an integer; falling back to %s days",
            raw, DEFAULT_RETENTION_DAYS)
        return DEFAULT_RETENTION_DAYS
    if value < 1:
        logger.warning(
            "REPORT_RETENTION_DAYS=%s is below the minimum of 1 day; using 1", value)
        return 1
    return value


def retention_enabled() -> bool:
    return os.environ.get("REPORT_RETENTION_ENABLED", "true").strip().lower() \
        not in ("false", "0", "no", "off")


def purge_expired_reports(db: Any = None,
                          days: Optional[int] = None) -> Dict[str, Any]:
    """Permanently delete soft-deleted reports older than the retention window.

    Scoped globally across tenants on purpose (agreed design), but ALWAYS gated
    by age. An ungated "delete all soft-deleted" would run on the first startup
    and destroy the retention window entirely.

    DELETION ORDER MATTERS — read before changing this query:
    `reports.current_version_id` references `report_definitions.id`, so a report
    points at its own current version row. Deleting the child rows first fails
    with ForeignKeyViolation on `reports_current_version_fk`. Deleting the parent
    and letting `ON DELETE CASCADE` clear `report_definitions` and
    `report_access` is the only order that works. This was verified against the
    live schema, not assumed.
    """
    window = retention_days() if days is None else days
    owned_db = db is None
    conn = db or get_db_connection()
    try:
        # RETURNING id lets us count through the shared execute() helper, which
        # returns fetchall() rather than exposing cursor.rowcount.
        rows: List[Any] = conn.execute(
            """
            DELETE FROM platform.reports
            WHERE deleted_at IS NOT NULL
              AND deleted_at < now() - make_interval(days => %s)
            RETURNING id
            """,
            (window,),
        ) or []
        removed = len(rows)
        if removed:
            logger.info(
                "report retention purge: removed %d report(s) soft-deleted more "
                "than %d day(s) ago", removed, window)
        else:
            logger.info(
                "report retention purge: nothing older than %d day(s)", window)
        return {"removed": removed, "retention_days": window}
    except Exception:
        # A maintenance job must never take the application down.
        logger.exception("report retention purge failed; reports left untouched")
        return {"removed": 0, "retention_days": window, "error": True}
    finally:
        if owned_db and hasattr(conn, "close"):
            conn.close()


def retention_status() -> Dict[str, Any]:
    """Introspection for logging and the verification scripts."""
    return {
        "retention_days": retention_days(),
        "enabled": retention_enabled(),
    }
