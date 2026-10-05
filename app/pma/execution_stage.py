"""PMA execution stage (Phase 5B).

Selects the applicable controls for the assessment's project and executes them
for the assessed system through `PmaExecutionAdapter`, reusing the shared
engine's rule registry, retry, result logging and control summaries.

Security: the system is re-resolved with the assessment's tenant_id/project_id
before any adapter is opened (same tenant/project ownership gate as Phase 5A),
and the adapter connection is tenant-scoped via CredentialService inside
`_build_config`. The Phase 5A orchestrator closes its discovery adapter, so the
stage owns a fresh single connection for the whole control run.
"""

import logging

from app.adapters.registry import AdapterRegistry
from app.pma.control_selection import select_controls
from app.pma.execution_adapter import PmaExecutionAdapter
from app.pma.orchestrator import PmaAssessmentOrchestrator
from app.services.system_service import SystemService

logger = logging.getLogger(__name__)


def execute_controls(context, engine_db, config=None) -> dict:
    """Select and execute the applicable PMA controls for the assessed system.

    Results attach to the existing PMA batch_id (mapping_id stays NULL); no
    batch finalisation, governance or release semantics are invoked here.
    """

    orchestrator = PmaAssessmentOrchestrator(engine_db)
    system_service = SystemService(engine_db)
    adapter = None
    controls = []
    executed = []

    try:
        system = orchestrator._resolve_system(
            context, system_service, context.tenant_id, context.project_id
        )
        adapter_key = PmaAssessmentOrchestrator._adapter_key(system)
        adapter_config = orchestrator._build_config(
            system_service, adapter_key, system, context.tenant_id
        )
        adapter = AdapterRegistry.get(adapter_key)()
        PmaAssessmentOrchestrator._health_check(
            adapter, adapter_config, context.system_id
        )

        controls = select_controls(engine_db, context.project_id)
        context.applicable_controls = controls

        for control_id in controls:
            executor = PmaExecutionAdapter(
                engine_db=engine_db,
                adapter=adapter,
                context=context,
                control_id=control_id,
                config=config,
            )
            executor.execute_rules()
            executed.append(control_id)
            logger.info(
                "PMA control executed | control=%s | batch_id=%s | system=%s",
                control_id,
                context.batch_id,
                context.system_name,
            )
    finally:
        PmaAssessmentOrchestrator._close_adapter(adapter)

    logger.info(
        "PMA control execution completed | batch_id=%s | controls=%d | executed=%d",
        context.batch_id,
        len(controls),
        len(executed),
    )

    return {
        "batch_id": context.batch_id,
        "system_id": context.system_id,
        "controls": controls,
        "controls_executed": executed,
    }
