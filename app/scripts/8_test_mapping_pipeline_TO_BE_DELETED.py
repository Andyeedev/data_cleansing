from app.pipelines.run_mapping_pipeline import run_mapping_pipeline
from app.db.connection import get_connection



def main():
    conn = get_connection()

    run_mapping_pipeline(
        conn,
        source_id="SOURCE_ID",
        target_id="TARGET_ID",
        project_id="PROJECT_ID"
    )

if __name__ == "__main__":
    main()