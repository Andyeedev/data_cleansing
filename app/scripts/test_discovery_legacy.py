# app/scripts/test_discovery.py
import psycopg2
from app.services.connection_manager import ConnectionManager
from app.services.discovery_service import DiscoveryService

def main():
    # Connect to core DB to read credentials
    core_conn = psycopg2.connect(
        #host="localhost",
        #dbname="core_db",
        #user="core_user",
        #password="CorePass123!"

        
        host="localhost",
        dbname="migration_engine",
        user="postgres",
        password="dev123456"
    )

    cm = ConnectionManager(core_conn)
    discovery = DiscoveryService(cm)

    # Example system_ids
    source_system_id = "99987703-20bf-4c48-a3c0-04e3f5be2d7d"
    target_system_id = "80f1c83c-56d7-47fc-9487-debfc30b9360"

    # List tables
    print("=== SOURCE TABLES ===")
    source_tables = discovery.list_tables(source_system_id)
    for t in source_tables:
        print(t)

    print("\n=== TARGET TABLES ===")
    target_tables = discovery.list_tables(target_system_id)
    for t in target_tables:
        print(t)

    # Describe first table in source
    if source_tables:
        print("\n=== SOURCE TABLE COLUMN DETAILS ===")
        columns = discovery.describe_table(source_system_id, source_tables[0])
        for col in columns:
            print(col)

if __name__ == "__main__":
    main()