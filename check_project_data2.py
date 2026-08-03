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

# Check migration_batch_registry sample data with correct column name
print('=== engine.migration_batch_registry sample ===')
cur.execute('SELECT batch_id, project_id, batch_status, total_controls, completed_controls, failed_controls, created_at FROM engine.migration_batch_registry LIMIT 5')
cols = [desc[0] for desc in cur.description]
print(f'  Columns: {cols}')
for r in cur.fetchall():
    print(f'  {r}')

# Count batches per project
print('\n=== Batches per project ===')
cur.execute('SELECT project_id, COUNT(*) as batch_count, batch_status FROM engine.migration_batch_registry GROUP BY project_id, batch_status ORDER BY project_id')
for r in cur.fetchall():
    print(f'  Project {r[0]}: {r[1]} batches ({r[2]})')

# Check discovered_datasets sample
print('\n=== core.discovered_datasets sample ===')
cur.execute('SELECT * FROM core.discovered_datasets LIMIT 3')
cols = [desc[0] for desc in cur.description]
print(f'  Columns: {cols}')
for r in cur.fetchall():
    print(f'  {r}')

# Check control_registry for project_id
print('\n=== core.control_registry columns ===')
cur.execute("""SELECT column_name, data_type 
               FROM information_schema.columns 
               WHERE table_schema = 'core' AND table_name = 'control_registry' 
               ORDER BY ordinal_position""")
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]}')

cur.close()
conn.close()
