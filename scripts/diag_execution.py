"""Reproduce a Migration -> Run execution synchronously and print the real error.

The UI's Run button fires ExecutionEngine.run() as a FastAPI BackgroundTask, so
the actual exception never reaches the browser — it only lands in the backend log.
This script runs the SAME code path in the foreground and prints the full traceback.

Run from the project root with the engine's environment (native, not Docker):

    python scripts/diag_execution.py
    python scripts/diag_execution.py <project_id>   # optional explicit project id
"""
import os
import sys
import uuid
import traceback


def main():
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    from app.db.connection import get_db_connection
    from app.services.execution_service import ExecutionService

    db = get_db_connection()

    project_id = None
    if len(sys.argv) > 1:
        project_id = sys.argv[1]
    else:
        rows = db.execute(
            "SELECT project_id, project_name FROM core.projects WHERE project_name ILIKE %s",
            ("%Legacy Migration Program%",),
        )
        if rows:
            project_id = rows[0][0]
            print("Resolved project:", rows[0][1], "->", project_id)
        else:
            print("Project 'Legacy Migration Program' not found; pass project_id as argument.")
            return

    batch_id = str(uuid.uuid4())
    print(f"Running ExecutionEngine for project {project_id} (batch {batch_id}) ...\n")
    try:
        ExecutionService().run(project_id, batch_id=batch_id, batch_name="DIAGNOSTIC")
        print("\nRUN COMPLETED without raising.")
    except Exception as e:
        print("\n=== EXECUTION FAILED ===")
        traceback.print_exc()


if __name__ == "__main__":
    main()
