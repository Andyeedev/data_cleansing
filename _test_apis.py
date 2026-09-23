import requests

login_resp = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'username': 'e2e-admin@e2e-validation.com',
    'password': 'Admin123'
})
cookies = login_resp.cookies
print('Login:', login_resp.status_code)

# Test Migration page APIs
endpoints = [
    '/api/v1/migration/projects',
    '/api/v1/migration/datasets',
    '/api/v1/migration/schedules',
    '/api/v1/migration/projects/overview',
    '/api/v1/migration/projects/tenants',
    '/api/v1/migration/schedules',
    '/api/v1/migration/datasets',
]

for ep in endpoints:
    resp = requests.get('http://localhost:8000' + ep, cookies=cookies)
    print(f'{ep}: {resp.status_code} - {resp.text[:100]}')

# Test Validation page APIs
val_endpoints = [
    '/api/v1/validation-centre',
    '/api/v1/validation/rules',
    '/api/v1/validation/rule-discovery',
]

print('\n--- Validation APIs ---')
for ep in val_endpoints:
    resp = requests.get('http://localhost:8000' + ep, cookies=cookies)
    print(f'{ep}: {resp.status_code} - {resp.text[:100]}')