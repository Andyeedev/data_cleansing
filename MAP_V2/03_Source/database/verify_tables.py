import psycopg2

def main():
    db_config = {
        'host': '127.0.0.1',
        'port': 5432,
        'database': 'migration_engine',
        'user': 'postgres'
    }
    
    print("=" * 60)
    print("Verifying Database Tables")
    print("=" * 60)
    
    try:
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()
        
        # Check platform schema tables
        print("\n[PLATFORM SCHEMA]")
        cur.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'platform' 
            ORDER BY tablename
        """)
        tables = [row[0] for row in cur.fetchall()]
        for t in tables:
            print(f"  - {t}")
        print(f"  Total: {len(tables)} tables")
        
        # Check audit schema tables
        print("\n[AUDIT SCHEMA]")
        cur.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'audit' 
            ORDER BY tablename
        """)
        tables = [row[0] for row in cur.fetchall()]
        for t in tables:
            print(f"  - {t}")
        print(f"  Total: {len(tables)} tables")
        
        # Check roles
        print("\n[SEEDED ROLES]")
        cur.execute("SELECT name, type, is_system FROM platform.roles ORDER BY name")
        for row in cur.fetchall():
            print(f"  - {row[0]} ({row[1]}, system={row[2]})")
        
        # Check permissions count
        cur.execute("SELECT COUNT(*) FROM platform.permissions")
        print(f"\n[PERMISSIONS] Total: {cur.fetchone()[0]}")
        
        # Check settings count
        cur.execute("SELECT COUNT(*) FROM platform.system_settings")
        print(f"[SETTINGS] Total: {cur.fetchone()[0]}")
        
        # Check feature flags count
        cur.execute("SELECT COUNT(*) FROM platform.feature_flags")
        print(f"[FEATURE FLAGS] Total: {cur.fetchone()[0]}")
        
        conn.close()
        print("\n" + "=" * 60)
        print("[OK] Verification complete")
        
    except Exception as e:
        print(f"[ERROR] {e}")

if __name__ == "__main__":
    main()
