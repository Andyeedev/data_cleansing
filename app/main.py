import argparse
import uuid
import yaml

from .execution_engine import ExecutionEngine
from .audit_export import AuditExporter


def load_config(path):
    
    with open(path, "r") as f:
        return yaml.safe_load(f)


def run_engine_OLD(config_path):
    config = load_config(config_path)
    batch_id = str(uuid.uuid4())

    print(f"Starting execution batch: {batch_id}")

    engine = ExecutionEngine(config, batch_id)
    engine.run()

    print("Execution completed successfully.")


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

    export_parser = subparsers.add_parser("export")
    export_parser.add_argument("--config", required=True)
    export_parser.add_argument("--batch-id", required=True)

    args = parser.parse_args()

    if args.command == "run":
        run_engine(args.config)

    elif args.command == "export":
        export_audit(args.config, args.batch_id)

    else:
        parser.print_help()
