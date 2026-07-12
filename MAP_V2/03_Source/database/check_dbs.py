import psycopg2

# Try 127.0.0.1 (trust auth) vs localhost (::1, requires password)
try:
    conn = psycopg2.connect(host='127.0.0.1', port=5432, user='postgres', dbname='postgres')
    cur = conn.cursor()
    cur.execute("SELECT datname FROM pg_database ORDER BY datname;")
    dbs = [r[0] for r in cur.fetchall()]
    print("Existing databases:")
    for db in dbs:
        print(f"  - {db}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
