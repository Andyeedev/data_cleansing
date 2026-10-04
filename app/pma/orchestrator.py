import logging
import uuid
from datetime import datetime

from app.adapters.base_adapter import ConnectionAdapter
from app.adapters.registry import AdapterRegistry
from app.execution_engine import ExecutionEngine
from app.pma.assessment_context import PmaAssessmentContext
from app.pma.errors import PmaAssessmentError, PmaHealthCheckError
from app.pma.working_set import build_working_set
from app.services.credential_service import CredentialService
from app.services.system_service import DB_TYPE_MAP, SystemService

logger = logging.getLogger(__name__)

PMA_BATCH_PREFIX = "PMA"


def build_batch_name(system_name: str, when: datetime | None = None) -> str:
    """C1 batch identity: PMA-{system_name} - {YYYY-MM-DD HH:MM}."""

    when = when or datetime.now()  # noqa: DTZ005
    return f"{PMA_BATCH_PREFIX}-{system_name} - {when.strftime('%Y-%m-%d %H:%M')}"


class PmaAssessmentOrchestrator:
    """PMA orchestrator (C1): context, system selection, health, discovery,
    working set, and PMA batch identity — no control execution."""

    def __init__(self, engine_db):
        self.engine_db = engine_db

    def run(self, tenant_id, project_id, system_id, now=None) -> PmaAssessmentContext:
        clock = now or datetime.now()  # noqa: DTZ005
        context = PmaAssessmentContext(
            tenant_id=str(tenant_id),
            project_id=str(project_id),
            system_id=str(system_id),
            system_name="",
            batch_id=str(uuid.uuid4()),
            started_at=clock,
        )
        adapter = None
        try:
            system_service = SystemService(self.engine_db)
            system = self._resolve_system(context, system_service, tenant_id, project_id)
            context.system_name = system["system_name"]

            adapter_key = self._adapter_key(system)
            adapter_config = self._build_config(system_service, adapter_key, system, tenant_id)
            adapter = AdapterRegistry.get(adapter_key)()
            context.adapter = adapter
            context.health_check = self._health_check(adapter, adapter_config, context.system_id)

            context.working_set = build_working_set(adapter, context.system_id)
            context.batch_name = build_batch_name(context.system_name, when=clock)
            self._register_batch(context, tenant_id)

            logger.info(
                "PMA assessment completed | batch_id=%s | system=%s | tables=%d | columns=%d",
                context.batch_id,
                context.system_name,
                context.working_set.table_count,
                context.working_set.column_count,
            )
            return context
        finally:
            self._close_adapter(adapter)

    def _resolve_system(self, context, system_service, tenant_id, project_id):
        """Tenant→project→system ownership is enforced by SystemRepository.get_by_id join."""

        try:
            return system_service.get_system(
                context.system_id, tenant_id=tenant_id, project_id=project_id
            )
        except Exception as exc:
            if "not found" in str(exc).lower():
                raise PmaAssessmentError(
                    f"System not found or access denied: {context.system_id}"
                ) from exc
            raise

    @staticmethod
    def _adapter_key(system):
        adapter_key = DB_TYPE_MAP.get(str(system["database_type"]).upper())
        if not adapter_key:
            raise PmaAssessmentError(
                f"Unsupported database type: {system['database_type']}"
            )
        return adapter_key

    def _build_config(self, system_service, adapter_key, system, tenant_id):
        credentials = CredentialService(self.engine_db).get_decrypted_credentials(
            system["system_id"], tenant_id=tenant_id
        )
        return system_service._build_adapter_config(
            adapter_key, system["connection_config"], credentials
        )

    @staticmethod
    def _health_check(adapter, adapter_config, system_id):
        """test_connection is a probe that closes its session (postgres.py:152-154);
        the session is re-established via connect() and gated by SELECT 1
        before any discovery runs."""

        try:
            result = adapter.test_connection(adapter_config)
        except Exception as exc:
            raise PmaHealthCheckError(
                f"Health check failed for system {system_id}: {exc}"
            ) from exc
        if not getattr(result, "success", False):
            message = getattr(result, "message", "unknown error")
            raise PmaHealthCheckError(f"Health check failed for system {system_id}: {message}")
        try:
            adapter.connect(adapter_config)
            ConnectionAdapter.validate_connections(
                {system_id: adapter}, label="PMA_ASSESSMENT"
            )
        except Exception as exc:
            raise PmaHealthCheckError(
                f"Health check failed for system {system_id}: {exc}"
            ) from exc
        return result

    def _register_batch(self, context, tenant_id):
        """Registers the PMA batch through the existing registration path;
        governance/release semantics are deliberately not invoked."""

        config = {"project_id": context.project_id, "engine_db": self.engine_db}
        engine = ExecutionEngine(
            config=config,
            batch_id=context.batch_id,
            batch_name=context.batch_name,
            tenant_id=str(tenant_id),
        )
        registered = engine._register_batch(0, context.batch_name)
        if registered is False:
            raise PmaAssessmentError(f"Batch {context.batch_id} already registered")
        engine._complete_batch("COMPLETED")

    @staticmethod
    def _close_adapter(adapter):
        if adapter is None:
            return
        try:
            adapter.close()
        except Exception:
            logger.warning("PMA adapter close failed", exc_info=True)
