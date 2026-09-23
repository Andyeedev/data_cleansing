import requests

r = requests.post('http://localhost:8000/api/v1/auth/login', json={'username': 'admin@mapnexus.com', 'password': 'Admin123456'})
cookies = r.cookies
r2 = requests.get('http://localhost:8000/api/v1/tenants/plans', cookies=cookies)
data = r2.json()
for p in data['data']:
    print(f'{p["tier"]}: monthly={p.get("monthly_price")}, annual={p.get("annual_price")}, list={p.get("list_price")}')