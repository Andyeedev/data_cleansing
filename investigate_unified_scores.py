import psycopg2
import sys

try:
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        dbname='migration_engine',
        user='postgres',
        password='dev123456',
        connect_timeout=5
    )
    cur = conn.cursor()

    # Option 1: Query engine.unified_scores
    print('=== Option 1: Querying engine.unified_scores ===')
    try:
        cur.execute('SELECT * FROM engine.unified_scores LIMIT 5;')
        rows = cur.fetchall()
        desc = [d[0] for d in cur.description]
        print('Columns:', desc)
        for row in rows:
            print(row)
        print(f'Queried {len(rows)} rows (LIMIT 5)')

        cur.execute('SELECT COUNT(*) FROM engine.unified_scores;')
        count = cur.fetchone()[0]
        print(f'Total rows in engine.unified_scores: {count}')
    except Exception as e:
        print(f'Error querying table: {e}')

    # List all views/tables in engine schema
    print()
    print('=== All relations in engine schema ===')
    cur.execute(
        "SELECT table_name, table_type "
        "FROM information_schema.tables "
        "WHERE table_schema = 'engine' "
        "ORDER BY table_name;"
    )
    for row in cur.fetchall():
        print(row)

    # Look for views related to risk, score, unified
    print()
    print('=== Relations with score/risk/unified in name ===')
    cur.execute(
        "SELECT table_name, table_type "
        "FROM information_schema.tables "
        "WHERE table_schema = 'engine' "
        "AND (table_name LIKE '%score%' OR table_name LIKE '%risk%' OR table_name LIKE '%unified%') "
        "ORDER BY table_name;"
    )
    for row in cur.fetchall():
        print(row)

    # If engine.unified_scores exists, get its definition (view or table)
    print()
    print('=== Checking if engine.unified_scores is a view ===')
    cur.execute(
        "SELECT table_type, definition "
        "FROM information_schema.views "
        "WHERE table_schema = 'engine' AND table_name = 'unified_scores';"
    )
    view_rows = cur.fetchall()
    if view_rows:
        for row in view_rows:
            print('View definition type:', row[0])
            print('Definition:', row[1])
    else:
        print('engine.unified_scores is NOT a view in information_schema.views')
        # Check if it is a table
        cur.execute(
            "SELECT table_type FROM information_schema.tables "
            "WHERE table_schema = 'engine' AND table_name = 'unified_scores';"
        )
        tbl = cur.fetchone()
        if tbl:
            print('It is a table:', tbl[0])
        else:
            print('Not found in information_schema.tables either')

    # List all views in engine schema with their definitions
    print()
    print('=== All views in engine schema ===')
    cur.execute(
        "SELECT table_name, definition "
        "FROM information_schema.views "
        "WHERE table_schema = 'engine' "
        "ORDER BY table_name;"
    )
    for row in cur.fetchall():
        print(f'View: {row[0]}')
        print(f'Definition: {row[1][:200]}')
        print()

    cur.close()
    conn.close()

except psycopg2.OperationalError as e:
    print(f'Cannot connect to database: {e}')
    print('PostgreSQL may not be running or credentials may be incorrect')
    sys.exit(1)
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()