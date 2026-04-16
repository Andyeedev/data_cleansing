from app.discovery.discovery_service import DiscoveryService
from app.discovery.discovery_repository import DiscoveryRepository


def run_discovery(project_id, system_id, db):

    service = DiscoveryService()
    repo = DiscoveryRepository(db)

    tables = service.list_tables(system_id)

    print("✅ Starting Discovery Process")
    for table in tables:
        schema = table.get("schema", "public")
        table_name = table["table_name"]

        dataset_id = repo.upsert_dataset(
            project_id,
            system_id,
            schema,
            table_name
        )

        columns = service.describe_table(system_id, table_name)
        pk_columns = service.get_primary_keys(system_id, table_name)

        for col in columns:
            col["is_primary_key"] = col["column_name"] in pk_columns

        repo.insert_columns(dataset_id, columns)

    print("✅ Discovery persisted successfully")