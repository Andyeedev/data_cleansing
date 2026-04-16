import psycopg2

from app.services.connection_manager import ConnectionManager
from app.discovery.discovery_service import DiscoveryService
from app.discovery.discovery_repository import DiscoveryRepository
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
    repo = DiscoveryRepository(core_conn)

    source = system_repo.get_by_role("SOURCE")
    target = system_repo.get_by_role("TARGET")

    # ✅ Get project_id correctly
    with core_conn.cursor() as cur:
        cur.execute("""
            SELECT project_id
            FROM core.system_registry
            WHERE system_id = %s
        """, (source["system_id"],))
        project_id = cur.fetchone()[0]

    print("SOURCE:", source["system_name"])
    print("TARGET:", target["system_name"])
    print("PROJECT:", project_id)

    # 🔥 ONLY THESE TWO CALLS
    discovery.run_auto_discovery(source["system_id"], project_id, repo)
    discovery.run_auto_discovery(target["system_id"], project_id, repo)

    core_conn.close()


if __name__ == "__main__":
    main()