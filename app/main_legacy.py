import argparse
import yaml
import logging

from .execution_engine import ExecutionEngine
from .audit_export import AuditExporter
from .db.db_connector import DBConnector


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

def load_config(path):
    with open(path, "r") as f:
        return yaml.safe_load(f)


def run_engine(config_path):
    config = load_config(config_path)

    engine = ExecutionEngine(config)

    print(f"Starting execution batch: {engine.batch_id}")
    engine.run()
    print("Execution completed successfully.")


def export_audit(config_path, batch_id):
    config = load_config(config_path)

    exporter = AuditExporter(config)

    print(f"Exporting audit pack for batch: {batch_id}")

    exporter.export_summary(batch_id)
    exporter.export_control_details(batch_id)
    exporter.export_exceptions(batch_id)

    print("Audit export completed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FS Migration Validation Engine")
    subparsers = parser.add_subparsers(dest="command")

    run_parser = subparsers.add_parser("run")
    run_parser.add_argument("--config", required=True)

    discover_parser = subparsers.add_parser("discover")
    discover_parser.add_argument("--config", required=True)

    export_parser = subparsers.add_parser("export")
    export_parser.add_argument("--config", required=True)
    export_parser.add_argument("--batch-id", required=True)

    args = parser.parse_args()

    if args.command == "run":
        run_engine(args.config)

    elif args.command == "discover":
        config = load_config(args.config)

        engine_db = DBConnector(config["engine_db"])

        from .services.dataset_discovery_service_NOT_IN_USE import DatasetDiscoveryService

        service = DatasetDiscoveryService(
            engine_db,
            config["project_id"]
        )

        service.discover()
        print("Dataset discovery completed successfully.")

    elif args.command == "export":
        export_audit(args.config, args.batch_id)

    else:
        parser.print_help()