import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        dbname="migration_engine",
        user="postgres",
        password="dev123456"
    )