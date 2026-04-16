import psycopg2
import uuid   # ✅ ADD THIS
#import normalized_columns
from app.services.connection_manager import ConnectionManager
from app.discovery.discovery_service import DiscoveryService
from app.discovery.discovery_repository import DiscoveryRepository
from app.db.repositories.system_repository import SystemRepository


def run_discovery(project_id, system_id, discovery, repo):

    
    print(f"\n🚀 Running discovery for system: {system_id}")

    tables = discovery.list_tables(system_id)

    print("✅ Starting Discovery Process")

    for table in tables:

        # your service returns list of strings, not dicts
        table_name = table
        schema = "public"

        dataset_id = repo.upsert_dataset(
            project_id,
            system_id,
            schema,
            table_name
        )

        columns = discovery.describe_table(system_id, table_name)
        pk_columns = discovery.get_primary_keys(system_id, table_name)

        normalized_columns = []
        for idx, col in enumerate(columns, start=1):
            print("DEBUG COLUMN:", col)

            if isinstance(col, dict):
                column_name = col.get("column_name") or col.get("name")
                data_type = col.get("data_type") or col.get("type")
                is_nullable = col.get("is_nullable", "YES")  # default to "YES" if not provided
            
            elif isinstance(col, tuple):
                column_name = col[0]
                data_type = col[1] if len(col) > 1 else None
            else:
                raise ValueError(f"Unknown column format: {col}")

            normalized_columns.append({
                "column_name": column_name,
                "data_type": data_type,
                "is_primary_key": column_name in pk_columns,
                "ordinal_position": idx  # ✅ Add this
                ,
                "is_nullable": is_nullable  # ✅ Add this
            })

        # ✅ USE AFTER LOOP
        repo.insert_columns(dataset_id, normalized_columns)



        print(f"   ✔ Processed table: {table_name}")

    print("✅ Discovery persisted successfully\n")


def main_legacy_1():

    # ✅ SAME AS YOUR WORKING SCRIPT
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

    # ✅ dynamic systems (same as test_discovery.py)
    source = system_repo.get_by_role("SOURCE")
    target = system_repo.get_by_role("TARGET")

    project_id = "project_1"   # ⚠️ replace with real UUID later
    

    print("SOURCE:", source["system_name"])
    print("TARGET:", target["system_name"])

    # 🔥 RUN FOR BOTH SYSTEMS
    run_discovery(project_id, source["system_id"], discovery, repo)
    run_discovery(project_id, target["system_id"], discovery, repo)

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

    # ✅ FIX HERE
    project_id = str(uuid.uuid4())

    print("SOURCE:", source["system_name"])
    print("TARGET:", target["system_name"])

    run_discovery(project_id, source["system_id"], discovery, repo)
    run_discovery(project_id, target["system_id"], discovery, repo)

    #run_discovery(str(source["project_id"]), source["system_id"], discovery, repo)
    #run_discovery(str(target["project_id"]), target["system_id"], discovery, repo)

if __name__ == "__main__":
    main()