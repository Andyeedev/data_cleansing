import psycopg2
import requests

# Check database
conn = __import__('psycopg2').connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()
cur.execute("""
    SELECT id, email, password_hash, status, tenant_id, failed_login_attempts, locked_until, token_version 
    FROM platform.users WHERE email = 'admin@mapnexus.com'
""")
row = cur.fetchone()
if row:
    print('User found:', dict(zip([desc[0] for desc in cur.description], row)))
else:
    print('User NOT FOUND')

# Test login
import requests
r = requests.post('http://localhost:8000/api/v1/auth/login', json={'username': 'admin@mapnexus.com', 'password': 'Admin123456'})
print('Login Status:', r.status_code)
print('Response:', r.text)
conn.close()