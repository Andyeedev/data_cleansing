import argparse
import yaml

from .execution_engine import ExecutionEngine
from .audit_export import AuditExporter
from .db.db_connector import DBConnector

from app.utils.logger import get_logger




logger = get_logger(__name__)




def load_config(path):
    with open(path, "r") as f:
        return yaml.safe_load(f)


def run_engine_legacy(config_path, resume_batch=None):

    config = load_config(config_path)

    # pass batch_id if restarting
    engine = ExecutionEngine(config, batch_id=resume_batch)

    logger.info(f"Starting execution batch: {engine.batch_id}")

    engine.run()

    logger.info("Execution completed successfully.")


def run_engine(config_path, resume_batch=None, recovery=False):

    config = load_config(config_path)

    engine = ExecutionEngine(config, batch_id=resume_batch)

    # ✅ enable recovery mode
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

    parser = argparse.ArgumentParser(description="FS Migration Validation Engine")
    subparsers = parser.add_subparsers(dest="command")

    # --------------------------------------------------
    # RUN COMMAND
    # --------------------------------------------------

    run_parser = subparsers.add_parser("run")
    run_parser.add_argument("--config", required=True)

    # NEW ARGUMENT FOR CHECKPOINT RESUME
    run_parser.add_argument("--resume-batch", required=False)

    run_parser.add_argument(
    "--recovery",
    action="store_true",
    help="Run only failed controls from previous batch"
)
    

    # --------------------------------------------------
    # DISCOVER COMMAND
    # --------------------------------------------------

    discover_parser = subparsers.add_parser("discover")
    discover_parser.add_argument("--config", required=True)

    # --------------------------------------------------
    # EXPORT COMMAND
    # --------------------------------------------------

    export_parser = subparsers.add_parser("export")
    export_parser.add_argument("--config", required=True)
    export_parser.add_argument("--batch-id", required=True)

    args = parser.parse_args()

    #if args.command == "run":
        #run_engine(args.config, args.resume_batch)

    if args.command == "run":
        run_engine(
            args.config,
            args.resume_batch,
            args.recovery   # ✅ pass flag
        )

    elif args.command == "discover":

        config = load_config(args.config)

        engine_db = DBConnector(config["engine_db"])

        from .services.dataset_discovery_service_NOT_IN_USE import DatasetDiscoveryService

        service = DatasetDiscoveryService(
            engine_db,
            config["project_id"]
        )

        service.discover()

        logger.info("Dataset discovery completed successfully.")

    elif args.command == "export":

        export_audit(args.config, args.batch_id)

    else:

        parser.print_help()