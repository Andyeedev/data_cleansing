import sys
sys.path.insert(0, '.')
from app.db.connection import get_db_connection

with get_db_connection() as db:
    with db.conn.cursor() as cur:
        cur.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'leads' AND table_schema = 'core'")
        print('core.leads columns:')
        for row in cur.fetchall():
            print(f'  {row[0]}: {row[1]} (nullable={row[2]})')
        print()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'core'")
        print('core tables:', [r[0] for r in cur.fetchall()])