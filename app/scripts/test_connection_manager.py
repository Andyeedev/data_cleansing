# app/scripts/test_connection_manager.py
import psycopg2
from app.services.connection_manager import ConnectionManager

def main():
    # Core DB connection (to access credentials)
    core_conn = psycopg2.connect(
        host="localhost",
        dbname="core_db",
        user="core_user",
        password="CorePass123!"
    )

    cm = ConnectionManager(core_conn)

    # Get connection to source system
    source_system_id = "80f1c83c-56d7-47fc-9487-debfc30b9360"
    source_conn = cm.get_connection(source_system_id)
    print("Source connected:", source_conn)

    # Get connection to target system
    target_system_id = "91ab-target-id"
    target_conn = cm.get_connection(target_system_id)
    print("Target connected:", target_conn)

if __name__ == "__main__":
    main()