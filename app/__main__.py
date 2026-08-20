from app.main import run_engine, export_audit
from app.config_loader import load_config
from app.db_connector import DBConnector
from app.services.dataset_discovery_service import DatasetDiscoveryService
from app.utils.logger import get_logger
import argparse

logger = get_logger(__name__)


def main():
    parser = argparse.ArgumentParser(description="FS Migration Validation Engine")
    subparsers = parser.add_subparsers(dest="command")

    run_parser = subparsers.add_parser("run")
    run_parser.add_argument("--config", required=True)
    run_parser.add_argument("--resume-batch", required=False)
    run_parser.add_argument("--batch-name", required=False, help="Optional batch name (auto-generated if not provided)")
    run_parser.add_argument("--recovery", action="store_true")
    run_parser.add_argument("--project-id", required=False, help="Override project_id from config.yaml")
    run_parser.add_argument("--tenant-id", required=False, help="Tenant ID for tenant isolation")

    discover_parser = subparsers.add_parser("discover")
    discover_parser.add_argument("--config", required=True)

    export_parser = subparsers.add_parser("export")
    export_parser.add_argument("--config", required=True)
    export_parser.add_argument("--batch-id", required=True)

    args = parser.parse_args()

    if args.command == "run":
        run_engine(args.config, args.resume_batch, args.recovery, args.batch_name,
                   project_id_override=args.project_id, tenant_id=args.tenant_id)
    elif args.command == "discover":
        config = load_config(args.config)
        engine_db = DBConnector(config["engine_db"])
        service = DatasetDiscoveryService(engine_db, config["project_id"])
        service.discover()
    elif args.command == "export":
        export_audit(args.config, args.batch_id)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
