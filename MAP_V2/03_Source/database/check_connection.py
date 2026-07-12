import psycopg2

def main():
    print("=" * 70)
    print("CHECKING DATABASE CONNECTION AND SCHEMAS")
    print("=" * 70)
    
    # Check what database we're connected to
    db_config = {
        'host': '127.0.0.1',
        'port': 5432,
        'database': 'migration_engine',
        'user': 'postgres'
    }
    
    print(f"\nConnecting to: {db_config['database']} @ {db_config['host']}:{db_config['port']}")
    
    try:
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()
        
        # Check current database
        cur.execute("SELECT current_database(), current_user, version()")
        row = cur.fetchone()
        print(f"Current database: {row[0]}")
        print(f"Current user: {row[1]}")
        print(f"PostgreSQL version: {row[2][:50]}...")
        
        # Check schemas
        print("\n[SCHEMAS IN THIS DATABASE]")
        cur.execute("""
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
            ORDER BY schema_name
        """)
        schemas = cur.fetchall()
        for row in schemas:
            print(f"  - {row[0]}")
        
        # Check if platform schema exists
        print("\n[PLATFORM SCHEMA CHECK]")
        cur.execute("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.schemata 
                WHERE schema_name = 'platform'
            )
        """)
        exists = cur.fetchone()[0]
        print(f"  Platform schema exists: {exists}")
        
        if exists:
            cur.execute("SELECT COUNT(*) FROM platform.tables")
            count = cur.fetchone()[0]
            print(f"  Tables in platform schema: {count}")
        
        # Check all databases
        print("\n[ALL DATABASES ON THIS SERVER]")
        conn2 = psycopg2.connect(host='127.0.0.1', port=5432, user='postgres', dbname='postgres')
        cur2 = conn2.cursor()
        cur2.execute("SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname")
        for row in cur2.fetchall():
            print(f"  - {row[0]}")
        conn2.close()
        
        conn.close()
        
    except Exception as e:
        print(f"[ERROR] {e}")
    
    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()
