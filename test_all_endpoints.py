import requests, json, base64

# Step 1: Login
r = requests.post('http://localhost:8000/api/v1/auth/login', json={'username': 'admin@mapnexus.com', 'password': 'admin123'})
token = r.json()['access_token']
h = {'Authorization': f'Bearer {token}'}

# Decode JWT payload to verify roles are included
payload_str = token.split('.')[1]
# Add padding if needed
padding = '=' * (4 - len(payload_str) % 4)
payload_str += padding
decoded = json.loads(base64.urlsafe_b64decode(payload_str))
print('JWT Payload:')
print(json.dumps(decoded, indent=2))

# Step 2: Test dashboard endpoints
print('\n=== Dashboard API Tests ===')
endpoints = [
    ('/api/v1/dashboard/portfolio', 'Portfolio'),
    ('/api/v1/dashboard/kpis', 'KPIs'),
    ('/api/v1/dashboard/activity?limit=3', 'Activity'),
]

for ep, name in endpoints:
    resp = requests.get(f'http://localhost:8000{ep}', headers=h)
    print(f'{name}: {resp.status_code}')
    print(f'  Body: {resp.text[:200]}')

# Step 3: Test systems (migrations > connections)
print('\n=== Systems API Tests ===')
resp = requests.get('http://localhost:8000/api/v1/systems', headers=h)
print(f'Systems: {resp.status_code}')
print(f'  Body: {resp.text[:200]}')

# Step 4: Test workflows (validation)
print('\n=== Workflows API Tests ===')
resp = requests.get('http://localhost:8000/api/v1/workflows', headers=h)
print(f'Workflows: {resp.status_code}')
print(f'  Body: {resp.text[:200]}')

# Step 5: Test execution endpoints (that will be used by useExecution hooks)
print('\n=== Execution API Tests ===')
exec_resp = requests.post('http://localhost:8000/api/v1/execution/run', json={'project_id': 'test'}, headers=h)
print(f'Run execution: {exec_resp.status_code}')
print(f'  Body: {exec_resp.text[:200]}')

# Step 6: Test monitoring endpoints
print('\n=== Monitoring API Tests ===')
resp = requests.get('http://localhost:8000/api/v1/monitoring/health', headers=h)
print(f'Monitoring health: {resp.status_code}')
print(f'  Body: {resp.text[:200]}')
