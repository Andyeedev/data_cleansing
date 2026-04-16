from app.pipelines.run_execution_pipeline import run_execution_pipeline
from app.db.connection import get_db_connection

def main():
    conn = get_db_connection()


    run_execution_pipeline(
        conn,
        source_db="SourceDB",   # 👈 REQUIRED
        project_id="ae40b96c-20da-4972-bb29-bff3c2451ae0"
    )

if __name__ == "__main__":
    main()
