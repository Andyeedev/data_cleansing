import argparse
from dotenv import load_dotenv
load_dotenv()

from app.config_loader import load_config
from .execution_engine import ExecutionEngine
from .audit_export import AuditExporter
from .db_connector import DBConnector
from .services.dataset_discovery_service import DatasetDiscoveryService
from app.utils.logger import get_logger

logger = get_logger(__name__)


def run_engine(config_path, resume_batch=None, recovery=False, batch_name=None):
    config = load_config(config_path)
    engine = ExecutionEngine(config=config, batch_id=resume_batch, batch_name=batch_name)
    engine.recovery_mode = recovery
    logger.info(f"Starting execution batch: {engine.batch_id}")
    engine.run()
    logger.info("Execution completed successfully.")


def export_audit(config_path, batch_id):
    config = load_config(config_path)
    engine_db = DBConnector(config["engine_db"])
    exporter = AuditExporter(engine_db)
    logger.info(f"Exporting audit pack for batch: {batch_id}")
    exporter.export_governance(batch_id)
    exporter.export_summary(batch_id)
    exporter.export_control_details(batch_id)
    exporter.export_exceptions(batch_id)
    logger.info("Audit export completed.")


if __name__ == "__main__":
    from app.__main__ import main
    main()
