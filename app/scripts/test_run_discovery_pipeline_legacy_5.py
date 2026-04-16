# app/scripts/run_discovery.py

import psycopg2
from app.services.connection_manager import ConnectionManager
from app.discovery.discovery_service import DiscoveryService
from app.db.repositories.system_repository import SystemRepository
from app.discovery.discovery_repository import DiscoveryRepository

def run_discovery(core_conn):
    """
    End-to-end discovery:
      - Fetch project_id from core.projects
      - List tables for each system
      - Describe columns and primary keys
      - Normalize and upsert datasets and columns
    """

    # System repository & connection manager
    system_repo = SystemRepository(core_conn)
    cm = ConnectionManager(core_conn, system_repo)
    discovery = DiscoveryService(cm)
    repo = DiscoveryRepository(core_conn)

    # Fetch SOURCE and TARGET systems
    source = system_repo.get_by_role("SOURCE")
    target = system_repo.get_by_role("TARGET")

    # Fetch project_id linked to source system
    #project_id = system_repo.get_project_id(source["system_id"])  # returns UUID

    # Fetch project_id linked to source system
    with core_conn.cursor() as cur:
        cur.execute("""
            SELECT project_id
            FROM core.system_registry
            WHERE system_id = %s
            """, (source["system_id"],))
        result = cur.fetchone()
        if result is None:
            raise ValueError(f"No project_id found for system_id {source['system_id']}")
        project_id = str(result[0])


    #print(project_id)
    #print(f"Project ID {project_id} Found")

    print("SOURCE:", source["system_name"])
    print("TARGET:", target["system_name"])
    print(f"Using project_id: {project_id}")

    # Run discovery on source system
    for system in [source, target]:
        print(f"\n🚀 Running discovery for system: {system['system_id']} ({system['system_name']})")

        # List tables
        tables = discovery.list_tables(system["system_id"])
        print(f"Found {len(tables)} tables")

        for idx, table in enumerate(tables, start=1):
            # If table is a string, convert to dict
            if isinstance(idx, str):
                table = {"table_name": table, "schema": "public"}

            schema = table.get("schema", "public")
            table_name = table["table_name"]

            # Upsert dataset to avoid duplicates
            dataset_id = repo.upsert_dataset(
                project_id=project_id,
                system_id=system["system_id"],
                schema=schema,
                table_name=table_name
            )

            # Describe columns and get PKs
            columns = discovery.describe_table(system["system_id"], table_name)
            pk_columns = discovery.get_primary_keys(system["system_id"], table_name)

            # Normalize columns
            normalized_columns = []
            for col_idx, col in enumerate(columns, start=1):
                column_name = col.get("column_name") or col.get("name")
                data_type = col.get("data_type") or col.get("type")
                is_nullable = col.get("is_nullable", True)

                normalized_columns.append({
                    "column_name": column_name,
                    "data_type": data_type,
                    "is_primary_key": column_name in pk_columns,
                    "ordinal_position": col_idx,
                    "is_nullable": is_nullable
                })

            # Upsert columns (avoid duplicates)
            repo.insert_columns(dataset_id, normalized_columns)

    print("✅ Discovery persisted successfully for all systems")
    

if __name__ == "__main__":
    # Connect to core DB
    core_conn = psycopg2.connect(
        host="localhost",
        dbname="migration_engine",
        user="postgres",
        password="dev123456"
    )

    run_discovery(core_conn)
    core_conn.close()