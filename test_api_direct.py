import urllib.request
import json

base_url = 'http://localhost:8000/api/v1'

try:
    print('Testing: /api/v1/migration/timeline/summary')
    req = urllib.request.Request(f'{base_url}/migration/timeline/summary')
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f'Status: {resp.status}')
        print(f'Response: {json.dumps(data, indent=2)}')
except Exception as e:
    print(f'Error: {e}')

try:
    print('\nTesting: /api/v1/migration/timeline')
    req = urllib.request.Request(f'{base_url}/migration/timeline')
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f'Status: {resp.status}')
        print(f'Response type: {type(data)}')
        if isinstance(data, dict):
            print(f'Keys: {list(data.keys())}')
            if 'data' in data:
                print(f'Data type: {type(data["data"])}')
                print(f'Data length: {len(data["data"]) if isinstance(data["data"], list) else "N/A"}')
                if isinstance(data["data"], list) and len(data["data"]) > 0:
                    print(f'First item: {json.dumps(data["data"][0], indent=2)}')
except Exception as e:
    print(f'Error: {e}')
