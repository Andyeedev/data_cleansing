import psycopg2
from app.discovery.discovery_service import DiscoveryService
from app.services.connection_manager import ConnectionManager
from app.diff.schema_diff_service import SchemaDiffService

from app.db.connection import get_db_connection
from app.db.repositories.system_repository import SystemRepository


def main():
    #conn = get_db_connection()

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


    #system_repo = SystemRepository(conn)
    #cm = ConnectionManager(conn)

    system_repo = SystemRepository(core_conn)
    #cm = ConnectionManager(core_conn)
    cm = ConnectionManager(core_conn, system_repo)

    discovery = DiscoveryService(cm)
    diff = SchemaDiffService(discovery)

    source = system_repo.get_by_role("SOURCE")
    target = system_repo.get_by_role("TARGET")

    source_tables = discovery.list_tables(source["system_id"])
    target_tables = discovery.list_tables(target["system_id"])

    print("\n=== TABLE DIFF ===")
    table_diff = diff.compare_tables(source_tables, target_tables)
    print(table_diff)

    print("\n=== COLUMN DIFF ===")

    for table in table_diff["common"]:
        print(f"\nTable: {table}")
        result = diff.compare_columns(
            source["system_id"],
            target["system_id"],
            table
        )
        print(result)


if __name__ == "__main__":
    main()