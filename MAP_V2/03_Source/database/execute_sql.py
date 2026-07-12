import psycopg2
import sys
import os

def execute_sql_file(conn, filepath):
    """Execute a SQL file against the database."""
    print(f"\nExecuting: {filepath}")
    try:
        with open(filepath, 'r') as f:
            sql = f.read()
        
        with conn.cursor() as cur:
            cur.execute(sql)
            conn.commit()
            print("  [OK] Success")
            return True
    except Exception as e:
        print(f"  [ERROR] {e}")
        conn.rollback()
        return False

def main():
    # Database connection
    db_config = {
        'host': '127.0.0.1',
        'port': 5432,
        'database': 'migration_engine',
        'user': 'postgres'
    }
    
    print("=" * 60)
    print("MAP Nexus Enterprise Platform - Database Setup")
    print("=" * 60)
    print(f"\nTarget: {db_config['database']} @ {db_config['host']}:{db_config['port']}")
    
    try:
        conn = psycopg2.connect(**db_config)
        conn.autocommit = True
        print("[OK] Connected to database")
    except Exception as e:
        print(f"[ERROR] Failed to connect: {e}")
        sys.exit(1)
    
    # SQL files to execute in order
    sql_files = [
        'create_platform_schema.sql',
        'create_audit_schema.sql',
        'seed_platform_data.sql'
    ]
    
    base_path = os.path.dirname(os.path.abspath(__file__))
    
    success_count = 0
    for sql_file in sql_files:
        filepath = os.path.join(base_path, sql_file)
        if os.path.exists(filepath):
            if execute_sql_file(conn, filepath):
                success_count += 1
        else:
            print(f"\n  [WARN] File not found: {filepath}")
    
    conn.close()
    
    print("\n" + "=" * 60)
    print(f"Completed: {success_count}/{len(sql_files)} scripts executed successfully")
    print("=" * 60)
    
    return 0 if success_count == len(sql_files) else 1

if __name__ == "__main__":
    sys.exit(main())
