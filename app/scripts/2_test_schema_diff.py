import psycopg2

from app.services.connection_manager import ConnectionManager
from app.discovery.discovery_service import DiscoveryService
from app.diff.schema_diff_service import SchemaDiffService
from app.diff.schema_diff_repository import SchemaDiffRepository
from app.db.repositories.system_repository import SystemRepository
from app.matching.table_match_repository import TableMatchRepository


def main():

    core_conn = psycopg2.connect(
        host="localhost",
        dbname="migration_engine",
        user="postgres",
        password="dev123456"
    )

    system_repo = SystemRepository(core_conn)
    cm = ConnectionManager(core_conn, system_repo)

    discovery = DiscoveryService(cm)
    diff_service = SchemaDiffService(discovery)
    repo = SchemaDiffRepository(core_conn)

    source = system_repo.get_by_role("SOURCE")
    target = system_repo.get_by_role("TARGET")

    # Get project_id
    with core_conn.cursor() as cur:
        cur.execute("""
            SELECT project_id
            FROM core.system_registry
            WHERE system_id = %s
        """, (source["system_id"],))
        project_id = cur.fetchone()[0]

    print("Running Schema Diff...")

    #diff_service.run_schema_diff(
    #    source["system_id"],
    #    target["system_id"],
    #    project_id,
    #    repo
    #)

    match_repo = TableMatchRepository(core_conn)

    diff_service.run_schema_diff_with_matches(
        source["system_id"],
        target["system_id"],
        project_id,
        repo,
        match_repo
    )

    core_conn.close()


if __name__ == "__main__":
    main()