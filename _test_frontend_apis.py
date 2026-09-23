import requests

login_resp = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'username': 'e2e-admin@e2e-validation.com',
    'password': 'Admin123'
})
cookies = login_resp.cookies
print('Login:', login_resp.status_code)

# Test the actual endpoints the frontend uses
endpoints = [
    '/api/v1/execution/dashboard',
    '/api/v1/execution/history',
    '/api/v1/execution/history/status-breakdown',
    '/api/v1/report-suite',
    '/api/v1/migration/projects/overview',
]

print('--- Frontend-used endpoints ---')
for ep in endpoints:
    resp = requests.get('http://localhost:8000' + ep, cookies=cookies)
    print(f'{ep}: {resp.status_code} - {resp.text[:150]}')