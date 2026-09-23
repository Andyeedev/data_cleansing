import requests

login_resp = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'username': 'e2e-admin@e2e-validation.com',
    'password': 'Admin123'
})
cookies = login_resp.cookies
print('Login:', login_resp.status_code)

nav_resp = requests.get('http://localhost:8000/api/v1/navigation', cookies=cookies)
print('Navigation API:', nav_resp.status_code)
if nav_resp.status_code == 200:
    nav = nav_resp.json()
    print('Response type:', type(nav))
    if isinstance(nav, list):
        for item in nav:
            if isinstance(item, dict) and item.get('label') in ['Migration', 'Validation', 'Reports']:
                print('Section:', item['label'])
                for child in item.get('children', []):
                    roles = child.get('requiredRoles', [])
                    print('  - ' + child['label'] + ': ' + child['path'] + ' (roles: ' + str(roles) + ')')
    else:
        print('Response:', nav)