import requests

login_resp = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'username': 'e2e-admin@e2e-validation.com',
    'password': 'Admin123'
})
cookies = login_resp.cookies
print('Login:', login_resp.status_code)

endpoints = {
    'Migration': [
        '/api/v1/migration/projects',
        '/api/v1/migration/datasets',
        '/api/v1/migration/schedules',
        '/api/v1/systems',
        '/api/v1/migration/mappings/summary',
        '/api/v1/migration/discovery/summary',
        '/api/v1/migration/mappings/schema',
        '/api/v1/migration/discovery/tree',
        '/api/v1/migration/timeline/summary',
        '/api/v1/migration/timeline',
    ],
    'Validation': [
        '/api/v1/execution/dashboard',
        '/api/v1/rules',
        '/api/v1/rules/discovery/819ee182-288f-4aff-a3bd-4b9459d4ba61',
    ],
    'Governance': [
        '/api/v1/governance/overview',
        '/api/v1/governance/compliance',
        '/api/v1/governance/exceptions',
        '/api/v1/governance/audit',
    ],
    'Reports': [
        '/api/v1/reports/suite?tenant_id=74dff1e4-7684-4fe7-8e38-915627120c8a',
    ],
}

for category, eps in endpoints.items():
    print('\n=== ' + category + ' ===')
    for ep in eps:
        resp = requests.get('http://localhost:8000' + ep, cookies=cookies)
        if resp.status_code == 200:
            status = 'OK'
        elif resp.status_code == 404:
            status = '404'
        else:
            status = str(resp.status_code)
        print('  ' + ep + ': ' + status)