# app/scripts/test_discovery.py
import psycopg2
from app.services.connection_manager import ConnectionManager
from app.discovery.discovery_service import DiscoveryService
from app.db.repositories.system_repository import SystemRepository

def main():
    core_conn = psycopg2.connect(
        #host="localhost",
        #dbname="core_db",
        #user="postgres",
        #password="your_core_password"

        host="localhost",
        dbname="migration_engine",
        user="postgres",
        password="dev123456"
    )

    system_repo = SystemRepository(core_conn)
    cm = ConnectionManager(core_conn, system_repo)
    discovery = DiscoveryService(cm)

    # dynamically fetch systems
    source = system_repo.get_by_role("SOURCE")
    target = system_repo.get_by_role("TARGET")

    print("SOURCE:", source["system_name"])
    print("TARGET:", target["system_name"])

    print("\n=== SOURCE TABLES ===")
    print(discovery.list_tables(source["system_id"]))

    print("\n=== TARGET TABLES ===")
    print(discovery.list_tables(target["system_id"]))

if __name__ == "__main__":
    main()