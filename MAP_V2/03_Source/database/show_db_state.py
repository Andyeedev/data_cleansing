import psycopg2

def main():
    db_config = {
        'host': '127.0.0.1',
        'port': 5432,
        'database': 'migration_engine',
        'user': 'postgres'
    }
    
    print("=" * 70)
    print("MIGRATION_ENGINE DATABASE STATE")
    print("=" * 70)
    
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()
    
    # Show all schemas
    print("\n[SCHEMAS]")
    cur.execute("""
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        ORDER BY schema_name
    """)
    for row in cur.fetchall():
        print(f"  - {row[0]}")
    
    # Show tables per schema
    for schema in ['core', 'engine', 'reporting', 'platform', 'audit']:
        print(f"\n[{schema.upper()} SCHEMA]")
        cur.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = %s 
            ORDER BY tablename
        """, (schema,))
        tables = cur.fetchall()
        if tables:
            for row in tables:
                print(f"  - {row[0]}")
            print(f"  Total: {len(tables)} tables")
        else:
            print("  (empty)")
    
    # Show roles
    print("\n[PLATFORM ROLES]")
    cur.execute("SELECT name, type, is_system FROM platform.roles ORDER BY name")
    for row in cur.fetchall():
        print(f"  - {row[0]} (type={row[1]}, system={row[2]})")
    
    # Show permissions count by resource
    print("\n[PERMISSIONS BY RESOURCE]")
    cur.execute("""
        SELECT resource, COUNT(*) 
        FROM platform.permissions 
        GROUP BY resource 
        ORDER BY resource
    """)
    for row in cur.fetchall():
        print(f"  - {row[0]}: {row[1]} permissions")
    
    # Show settings by category
    print("\n[SETTINGS BY CATEGORY]")
    cur.execute("""
        SELECT category, COUNT(*) 
        FROM platform.system_settings 
        GROUP BY category 
        ORDER BY category
    """)
    for row in cur.fetchall():
        print(f"  - {row[0]}: {row[1]} settings")
    
    # Show feature flags
    print("\n[FEATURE FLAGS]")
    cur.execute("SELECT name, enabled, rollout_percentage FROM platform.feature_flags ORDER BY name")
    for row in cur.fetchall():
        print(f"  - {row[0]}: enabled={row[1]}, rollout={row[2]}%")
    
    conn.close()
    
    print("\n" + "=" * 70)
    print("[DONE]")
    print("=" * 70)

if __name__ == "__main__":
    main()
