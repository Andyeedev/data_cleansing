import requests, json

r = requests.post('http://localhost:8000/api/v1/auth/login', json={'username': 'admin@mapnexus.com', 'password': 'admin123'})
token = r.json()['access_token']
h = {'Authorization': f'Bearer {token}'}

print("=== 1. COMPLIANCE ===")
r = requests.get('http://localhost:8000/api/v1/governance/compliance', headers=h)
print(f"Status: {r.status_code}")
print(f"Data: {json.dumps(r.json(), indent=2)}")

print("\n=== 2. EXCEPTIONS ===")
r = requests.get('http://localhost:8000/api/v1/governance/exceptions', headers=h)
print(f"Status: {r.status_code}")
print(f"Data: {json.dumps(r.json(), indent=2)}")

print("\n=== 3. APPROVALS ===")
r = requests.get('http://localhost:8000/api/v1/governance/approvals', headers=h)
print(f"Status: {r.status_code}")
print(f"Data: {json.dumps(r.json(), indent=2)}")

print("\n=== 4. AUDIT ===")
r = requests.get('http://localhost:8000/api/v1/governance/audit?limit=5', headers=h)
print(f"Status: {r.status_code}")
data = r.json()
print(f"Total entries: {len(data.get('data', {}).get('entries', []))}")
if data.get('data', {}).get('entries'):
    print(f"Sample: {json.dumps(data['data']['entries'][0], indent=2)}")

print("\n=== 5. DB TABLE ROW COUNTS ===")
import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
cur = conn.cursor()

tables = [
    ('engine', 'migration_control_execution'),
    ('engine', 'migration_control_exceptions'),
    ('engine', 'migration_control_summary'),
    ('engine', 'migration_release_decision'),
    ('platform', 'approval_requests'),
    ('platform', 'calendar_events'),
]
for schema, table in tables:
    cur.execute(f'SELECT COUNT(*) FROM {schema}.{table}')
    count = cur.fetchone()[0]
    print(f"  {schema}.{table}: {count} rows")

conn.close()
