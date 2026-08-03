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

# Check core.projects structure
print('=== core.projects columns ===')
cur.execute("""SELECT column_name, data_type, is_nullable 
               FROM information_schema.columns 
               WHERE table_schema = 'core' AND table_name = 'projects' 
               ORDER BY ordinal_position""")
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]} (nullable: {r[2]})')

# Check core.datasets structure
print('\n=== core.datasets columns ===')
cur.execute("""SELECT column_name, data_type, is_nullable 
               FROM information_schema.columns 
               WHERE table_schema = 'core' AND table_name = 'datasets' 
               ORDER BY ordinal_position""")
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]} (nullable: {r[2]})')

# Check core.discovered_datasets structure
print('\n=== core.discovered_datasets columns ===')
cur.execute("""SELECT column_name, data_type, is_nullable 
               FROM information_schema.columns 
               WHERE table_schema = 'core' AND table_name = 'discovered_datasets' 
               ORDER BY ordinal_position""")
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]} (nullable: {r[2]})')

# Sample data from core.projects
print('\n=== Sample core.projects data ===')
cur.execute('SELECT * FROM core.projects LIMIT 3')
cols = [desc[0] for desc in cur.description]
print(f'  Columns: {cols}')
for r in cur.fetchall():
    print(f'  {r}')

# Sample data from core.datasets
print('\n=== Sample core.datasets data ===')
cur.execute('SELECT * FROM core.datasets LIMIT 3')
cols = [desc[0] for desc in cur.description]
print(f'  Columns: {cols}')
for r in cur.fetchall():
    print(f'  {r}')

cur.close()
conn.close()
