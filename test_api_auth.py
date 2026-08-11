import urllib.request
import json

base_url = 'http://localhost:8000/api/v1'

# Get a token by logging in
login_data = json.dumps({"username": "admin@map.com", "password": "admin123"}).encode()
req = urllib.request.Request(f'{base_url}/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as resp:
        auth = json.loads(resp.read().decode())
        token = auth.get('access_token', '')
        print(f'Got token: {token[:20]}...')
except Exception as e:
    print(f'Login failed: {e}')
    token = None

if token:
    headers = {'Authorization': f'Bearer {token}'}

    try:
        print('\nTesting: /api/v1/migration/timeline/summary')
        req = urllib.request.Request(f'{base_url}/migration/timeline/summary', headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f'Status: {resp.status}')
            print(f'Response: {json.dumps(data, indent=2)}')
    except Exception as e:
        print(f'Error: {e}')

    try:
        print('\nTesting: /api/v1/migration/timeline')
        req = urllib.request.Request(f'{base_url}/migration/timeline', headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f'Status: {resp.status}')
            if isinstance(data, dict):
                print(f'Keys: {list(data.keys())}')
                if 'data' in data:
                    d = data['data']
                    print(f'Data type: {type(d).__name__}, length: {len(d) if isinstance(d, list) else "N/A"}')
                    if isinstance(d, list) and len(d) > 0:
                        print(f'First group: {json.dumps(d[0], indent=2)}')
    except Exception as e:
        print(f'Error: {e}')
