import requests
import time

login_resp = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'username': 'e2e-admin@e2e-validation.com',
    'password': 'Admin123'
})
cookies = login_resp.cookies

batch_id = '78aeb4ad-750c-4366-b7d2-988db72e0334'

for i in range(60):
    status_resp = requests.get('http://localhost:8000/api/v1/execution/status/' + batch_id, cookies=cookies)
    if status_resp.status_code == 200:
        data = status_resp.json()
        status = data.get('status')
        print('Status:', status)
        if status in ['COMPLETED', 'FAILED']:
            print('Completed with status:', status)
            completed = data.get('completed_controls', 0)
            total = data.get('total_controls', 0)
            print('Controls:', completed, '/', total)
            break
    else:
        print('Error:', status_resp.status_code)
    time.sleep(5)