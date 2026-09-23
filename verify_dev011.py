import psycopg2
conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()

# Check token_version column
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'platform' AND column_name = 'token_version'")
print('token_version column:', cur.fetchone())

# Check password_changed_at column
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'platform' AND column_name = 'password_changed_at'")
print('password_changed_at column:', cur.fetchone())

# Check password hash
cur.execute("SELECT password_hash FROM platform.users LIMIT 1")
row = cur.fetchone()
print('Password hash sample:', row[0][:50] + '...')

# Check token_version in users
cur.execute("SELECT token_version FROM platform.users LIMIT 5")
print('Token versions:', cur.fetchall())

conn.close()