import psycopg2

from app.services.connection_manager import ConnectionManager
from app.mapping.mapping_engine import MappingEngine
from app.mapping.mapping_repository import MappingRepository
from app.mapping.mapping_service import MappingService
from app.matching.table_match_repository import TableMatchRepository
from app.discovery.discovery_service import DiscoveryService
from app.db.repositories.system_repository import SystemRepository


def run_mapping_pipeline(conn, discovery, project_id, source_id, target_id):

    engine = MappingEngine(discovery)
    repo = MappingRepository(conn)
    match_repo = TableMatchRepository(conn)

    service = MappingService(
        engine,
        repo,
        discovery,
        match_repo
    )

    service.run_mapping(project_id, source_id, target_id)


if __name__ == "__main__":

    from app.db.connection_factory import connection_factory

    #core_conn = connection_factory("engine_db")
    #discovery = DiscoveryService(connection_factory)

    core_conn = psycopg2.connect(
        host="localhost",
        dbname="migration_engine",
        user="postgres",
        password="dev123456"
    )

    system_repo = SystemRepository(core_conn)
    cm = ConnectionManager(core_conn, system_repo)

    discovery = DiscoveryService(cm)
    
    
    

    project_id = "ae40b96c-20da-4972-bb29-bff3c2451ae0"
    source_id = "99987703-20bf-4c48-a3c0-04e3f5be2d7d"
    target_id = "80f1c83c-56d7-47fc-9487-debfc30b9360"

    run_mapping_pipeline(core_conn, discovery, project_id, source_id, target_id)