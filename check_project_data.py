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

# Check migration_batch_registry structure
print('=== engine.migration_batch_registry columns ===')
cur.execute("""SELECT column_name, data_type, is_nullable 
               FROM information_schema.columns 
               WHERE table_schema = 'engine' AND table_name = 'migration_batch_registry' 
               ORDER BY ordinal_position""")
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]} (nullable: {r[2]})')

# Check if there's any owner/created_by column in projects
print('\n=== core.projects sample data ===')
cur.execute('SELECT * FROM core.projects LIMIT 5')
cols = [desc[0] for desc in cur.description]
print(f'  Columns: {cols}')
for r in cur.fetchall():
    print(f'  {r}')

# Check core.users table
print('\n=== core.users columns ===')
cur.execute("""SELECT column_name, data_type 
               FROM information_schema.columns 
               WHERE table_schema = 'core' AND table_name = 'users' 
               ORDER BY ordinal_position""")
for r in cur.fetchall():
    print(f'  {r[0]}: {r[1]}')

# Check if there are any other project-related columns in other tables
print('\n=== Other tables with project_id ===')
cur.execute("""SELECT table_name, column_name FROM information_schema.columns 
               WHERE column_name = 'project_id' AND table_schema IN ('core', 'engine') 
               ORDER BY table_name""")
for r in cur.fetchall():
    print(f'  {r[0]}.{r[1]}')

# Check engine.migration_batch_registry sample data
print('\n=== engine.migration_batch_registry sample ===')
cur.execute('SELECT batch_id, project_id, overall_status, created_at FROM engine.migration_batch_registry LIMIT 5')
cols = [desc[0] for desc in cur.description]
print(f'  Columns: {cols}')
for r in cur.fetchall():
    print(f'  {r}')

cur.close()
conn.close()
