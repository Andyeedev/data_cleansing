from app.api.core.app_config import CONFIG
from app.services.mapping_resolver import MappingResolver
from app.db.connection_resolver import ConnectionResolver
from app.db.connection import get_db_connection
import sys
import os
import logging

# Ensure absolute imports work
sys.path.append(os.getcwd())


# Configure logging to stdout
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(name)s | %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger("SimulateRun")


def simulate():
    project_id = CONFIG.get("project_id")
    logger.info(f"🚀 Starting simulation for Project: {project_id}")

    try:
        # 1. Connect to Engine DB
        logger.info("Connecting to Engine DB...")
        engine_db = get_db_connection()
        logger.info("✅ Connected to Engine DB")

        # 2. Resolve Connections
        logger.info("Resolving all system connections...")
        resolver = ConnectionResolver(engine_db)

        # We try to load systems.
        # Note: If core.system_registry is missing 'is_active' or 'schema_name',
        # this will fail here.
        try:
            connections = resolver.get_connections(project_id)
            source_conns = connections.get("SOURCE", {})
            target_conns = connections.get("TARGET", {})

            logger.info(
                f"📊 Found {len(source_conns)} Source(s) and {len(target_conns)} Target(s)"
            )

            for sid, adapter in source_conns.items():
                logger.info(
                    f"🔍 Source System ID: {sid} | "
                    f"Type: {getattr(adapter, 'config', {}).get('type')}"
                )

        except Exception as e:
            logger.error(f"❌ Connection Resolution Failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return

        # 3. Resolve Mappings
        logger.info("Resolving dataset mappings...")
        mapping_resolver = MappingResolver(engine_db, project_id, logger)

        valid_pairs, skipped_pairs = mapping_resolver.resolve(
            source_conns.keys(),
            target_conns.keys()
        )

        logger.info(f"✅ Valid Pairs: {valid_pairs}")
        logger.info(f"⚠️ Skipped Pairs: {skipped_pairs}")

        if not valid_pairs:
            logger.warning(
                "‼️ No executable mappings found. SQL Server will NOT be called for data."
            )
        else:
            for source_id, target_id, mappings in valid_pairs:
                logger.info(
                    f"🏃 Ready to execute: Source {source_id} -> Target {target_id} "
                    f"with {len(mappings)} mappings"
                )

    except Exception as e:
        logger.error(f"💥 Simulation crashed: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    simulate()
