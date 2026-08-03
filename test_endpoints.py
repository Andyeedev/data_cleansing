import requests

r = requests.post('http://localhost:8000/api/v1/auth/login', json={'username': 'admin@mapnexus.com', 'password': 'admin123'})
token = r.json()['access_token']
h = {'Authorization': f'Bearer {token}'}

endpoints = [
    '/api/v1/systems',
    '/api/v1/workflows',
    '/api/v1/governance/audit',
    '/api/v1/governance/compliance',
    '/api/v1/governance/exceptions',
    '/api/v1/governance/approvals',
    '/api/v1/validation/rules',
]

for ep in endpoints:
    resp = requests.get(f'http://localhost:8000{ep}', headers=h)
    print(f'{ep}: {resp.status_code} {resp.text[:120]}')
