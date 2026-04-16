from app.discovery.discovery_service import DiscoveryService
from app.matching.table_matching_engine import TableMatchingEngine
from app.matching.table_matching_service import TableMatchingService
from app.matching.table_match_repository import TableMatchRepository

from app.matching.column_matching_engine import ColumnMatchingEngine
from app.matching.column_matching_service import ColumnMatchingService
from app.matching.column_match_repository import ColumnMatchRepository

from app.matching.transformation_engine import TransformationEngine

from app.diff.schema_diff_service import SchemaDiffService
from app.diff.schema_diff_repository import SchemaDiffRepository

# 👉 loaders (you create these lightweight wrappers)
from app.loaders.dataset_column_loader import load_dataset_columns
from app.loaders.dataset_mapping_loader import create_mappings_from_matches


def run_mapping_pipeline(core_conn, source_id, target_id, project_id):

    print("\n🚀 RUNNING MAPPING PIPELINE")

    # 🔹 1. DISCOVERY
    discovery = DiscoveryService(core_conn)

    discovery.run_discovery(source_id)
    discovery.run_discovery(target_id)

    print("✅ Discovery completed")

    # 🔹 2. LOAD DATASET COLUMNS
    discovered_columns = discovery.get_all_discovered_columns()

    load_dataset_columns(discovered_columns, core_conn)

    print("✅ dataset_columns populated")

    # 🔹 3. TABLE MATCHING
    match_repo = TableMatchRepository(core_conn)
    engine = TableMatchingEngine(discovery)

    match_service = TableMatchingService(engine, match_repo)
    match_service.run_table_matching(source_id, target_id, project_id)

    print("✅ Table matching completed")

    # 🔹 4. CREATE DATASET MAPPINGS
    matches = match_repo.get_matches(project_id, source_id, target_id)

    create_mappings_from_matches(matches, core_conn, project_id)

    print("✅ dataset_mappings created")

    # 🔹 5. COLUMN MATCHING
    column_engine = ColumnMatchingEngine()
    column_repo = ColumnMatchRepository(core_conn)
    transform_engine = TransformationEngine()

    column_service = ColumnMatchingService(
        discovery,
        column_engine,
        column_repo,
        transform_engine
    )

    # 🔥 loop mappings
    for m in matches:
        mapping_id = m.get("mapping_id")  # ensure loader returns this

        column_service.run(
            mapping_id,
            source_id,
            target_id,
            m["source_table"],
            m["target_table"]
        )

    print("✅ Column mappings completed")

    # 🔹 6. SCHEMA DIFF
    diff_repo = SchemaDiffRepository(core_conn)
    diff_service = SchemaDiffService(discovery)

    diff_service.run_schema_diff_with_matches(
        source_id,
        target_id,
        project_id,
        diff_repo,
        match_repo
    )

    print("✅ Schema diff completed")

    print("\n🎉 MAPPING PIPELINE COMPLETE")