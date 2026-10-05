"""PMA applicable-control selection (Phase 5B).

Reads the existing project-scoped control registry (same query shape as the MA
engine's enabled-control selection) and applies the accepted Phase 5B control
classification. No new tables, no registry writes, no control IDs invented.
"""

import logging

logger = logging.getLogger(__name__)

# Phase 5B accepted classification (per-control PMA execution semantics).
#   REUSABLE_MEASUREMENT — MA rule body runs through the single-connection adapter;
#                          its per-side measurement is re-interpreted as a
#                          single-system baseline/issue (never a comparison).
#   COLUMN_CAPABILITY    — PMA-specific column capability path (working-set driven;
#                          never uses the mapping-dependent rule bodies).
#   PROFILING            — actual single-system profiling evidence (stats),
#                          never a drift verdict.
#   FK_EVIDENCE          — runs only with genuinely available FK metadata; skipped
#                          honestly when none exists (no FK inference).
#   INFORMATIONAL        — informational inventory evidence only, no pass/fail verdict.
PMA_CONTROL_CLASSIFICATION = {
    "C01": "REUSABLE_MEASUREMENT",
    "C02": "REUSABLE_MEASUREMENT",
    "C04": "REUSABLE_MEASUREMENT",
    "C05": "COLUMN_CAPABILITY",
    "C06": "COLUMN_CAPABILITY",
    "C07": "REUSABLE_MEASUREMENT",
    "C08": "PROFILING",
    "C09": "FK_EVIDENCE",
    "C010": "INFORMATIONAL",
}

# C03 is pair reconciliation — inherently cross-system, never a PMA control.
NON_PMA_CONTROLS = frozenset({"C03"})


def select_controls(engine_db, project_id) -> list[str]:
    """Select the applicable PMA controls for one project.

    Same project-scoped, enabled-flag read as MA control discovery; then C03 and
    any control without accepted PMA semantics are excluded so PMA never executes
    a control whose single-system meaning is undefined.
    """

    query = """
        SELECT control_id
        FROM engine.control_registry
        WHERE enabled_flag = TRUE
        AND project_id = %s
        ORDER BY control_id
    """
    rows = engine_db.execute(query, (project_id,))

    selected = []
    for row in rows or []:
        control_id = row[0]
        if control_id in NON_PMA_CONTROLS:
            logger.info("PMA control selection: %s excluded (not a PMA control)", control_id)
            continue
        if control_id not in PMA_CONTROL_CLASSIFICATION:
            logger.info(
                "PMA control selection: %s excluded (no accepted PMA semantics)",
                control_id,
            )
            continue
        selected.append(control_id)
    return selected
