import psycopg2

try:
    conn = psycopg2.connect(host='127.0.0.1', port=5432, user='postgres', dbname='migration_engine')
    cur = conn.cursor()
    cur.execute("SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('core','engine','platform','administration','configuration','governance','operational','reporting','audit','analytics') ORDER BY schemaname, tablename;")
    for row in cur.fetchall():
        print(f"  {row[0]}.{row[1]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
