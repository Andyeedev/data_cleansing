import psycopg2

from app.services.connection_manager import ConnectionManager
from app.discovery.discovery_service import DiscoveryService
from app.matching.table_matching_engine import TableMatchingEngine
from app.matching.table_match_repository import TableMatchRepository
from app.matching.table_matching_service import TableMatchingService
from app.db.repositories.system_repository import SystemRepository


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

    #engine = TableMatchingEngine(discovery, threshold=0.75)
    engine = TableMatchingEngine(discovery)
    
    repo = TableMatchRepository(core_conn)
    service = TableMatchingService(engine, repo)

    source = system_repo.get_by_role("SOURCE")
    target = system_repo.get_by_role("TARGET")

    with core_conn.cursor() as cur:
        cur.execute("""
            SELECT project_id
            FROM core.system_registry
            WHERE system_id = %s
        """, (source["system_id"],))
        project_id = cur.fetchone()[0]

    service.run_table_matching(
        source["system_id"],
        target["system_id"],
        project_id
    )

    core_conn.close()


if __name__ == "__main__":
    main()