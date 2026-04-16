from app.mapping_engine.mapping_engine import MappingEngine
from app.mapping_engine.mapping_repository import MappingRepository


def test_mapping_engine(db):

    engine = MappingEngine(db)
    repo = MappingRepository(db)

    tenant_id = "tenant_1"
    project_id = "project_1"
    source_system = "source_sys"
    target_system = "target_sys"

    suggestions = engine.generate(
        tenant_id,
        project_id,
        source_system,
        target_system
    )

    repo.insert_suggestions(suggestions)

    print(f"✅ Inserted {len(suggestions)} mapping suggestions")