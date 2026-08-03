import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv('ENGINE_DB_HOST'),
    port=os.getenv('ENGINE_DB_PORT'),
    database=os.getenv('ENGINE_DB_NAME'),
    user=os.getenv('ENGINE_DB_USER'),
    password=os.getenv('ENGINE_DB_PASS')
)

cur = conn.cursor()

# Search for project, dataset, schedule related tables
queries = [
    """SELECT table_schema, table_name FROM information_schema.tables 
       WHERE table_schema IN ('core', 'engine', 'platform') 
       AND (table_name ILIKE '%project%' OR table_name ILIKE '%dataset%' OR table_name ILIKE '%schedule%') 
       ORDER BY table_schema, table_name""",
    """SELECT table_schema, table_name FROM information_schema.tables 
       WHERE table_schema IN ('core', 'engine', 'platform') 
       AND table_name ILIKE '%migration%' 
       ORDER BY table_schema, table_name""",
    """SELECT table_schema, view_name FROM information_schema.views 
       WHERE table_schema IN ('core', 'engine', 'platform') 
       AND (view_name ILIKE '%project%' OR view_name ILIKE '%dataset%' OR view_name ILIKE '%schedule%') 
       ORDER BY table_schema, view_name""",
    """SELECT table_schema, view_name FROM information_schema.views 
       WHERE table_schema IN ('core', 'engine', 'platform') 
       AND view_name ILIKE '%migration%' 
       ORDER BY table_schema, view_name""",
]

for q in queries:
    cur.execute(q)
    rows = cur.fetchall()
    if rows:
        print(f'Results:')
        for r in rows:
            print(f'  {r[0]}.{r[1]}')
        print()

# Also check all tables in engine schema
cur.execute("""SELECT table_name FROM information_schema.tables 
               WHERE table_schema = 'engine' ORDER BY table_name""")
rows = cur.fetchall()
print('All tables in engine schema:')
for r in rows:
    print(f'  engine.{r[0]}')

# Check all views in engine schema
cur.execute("""SELECT view_name FROM information_schema.views 
               WHERE table_schema = 'engine' ORDER BY view_name""")
rows = cur.fetchall()
print('\nAll views in engine schema:')
for r in rows:
    print(f'  engine.{r[0]}')

cur.close()
conn.close()
