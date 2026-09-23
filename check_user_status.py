import psycopg2

conn = __import__('psycopg2').connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()

# Check user status
cur.execute("""
    SELECT email, token_version, failed_login_attempts, locked_until 
    FROM platform.users 
    WHERE email = 'admin@mapnexus.com'
""")
row = cur.fetchone()
if row:
    print(f'User: {row[0]}, token_version={row[1]}, failed_attempts={row[2]}, locked_until={row[3]}')
else:
    print('User NOT FOUND')

# Check all users
cur.execute('SELECT email, token_version FROM platform.users')
for row in cur.fetchall():
    print(f'User: {row[0]}, token_version: {row[1]}')

conn.close()