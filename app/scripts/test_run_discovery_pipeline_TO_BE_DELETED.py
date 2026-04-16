from app.discovery.discovery_service import DiscoveryService
from app.discovery.discovery_repository import DiscoveryRepository


def run():
    print("🚀 Running discovery pipeline...")

    # TODO: replace with your actual DB connection
    db = None  

    project_id = "project_1"
    system_id = "system_1"

    service = DiscoveryService()
    repo = DiscoveryRepository(db)

    tables = service.list_tables(system_id)

    for table in tables:
        print(f"Processing {table}")

    print("✅ Done")


if __name__ == "__main__":
    run()