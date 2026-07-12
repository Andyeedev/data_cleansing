import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint."""
    print("[TEST] Health Check")
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"  Status: {resp.status_code}")
        print(f"  Response: {resp.json()}")
        return resp.status_code == 200
    except Exception as e:
        print(f"  [ERROR] {e}")
        return False

def test_login():
    """Test login endpoint."""
    print("\n[TEST] Login")
    try:
        resp = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
            "username": "admin",
            "password": "password"
        }, timeout=5)
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            print(f"  Token received: {bool(data.get('access_token'))}")
            return data.get('access_token')
        else:
            print(f"  Response: {resp.text[:200]}")
            return None
    except Exception as e:
        print(f"  [ERROR] {e}")
        return None

def test_endpoints(token=None):
    """Test various API endpoints."""
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    endpoints = [
        ("GET", "/api/v1/users"),
        ("GET", "/api/v1/roles"),
        ("GET", "/api/v1/workflows"),
        ("GET", "/api/v1/tasks"),
        ("GET", "/api/v1/calendar/events"),
        ("GET", "/api/v1/notifications"),
        ("GET", "/api/v1/settings"),
        ("GET", "/api/v1/settings/flags/list"),
    ]
    
    print("\n[TEST] API Endpoints")
    results = []
    
    for method, path in endpoints:
        try:
            resp = requests.get(f"{BASE_URL}{path}", headers=headers, timeout=5)
            status = "[OK]" if resp.status_code in [200, 401] else "[FAIL]"
            print(f"  {status} {method} {path} -> {resp.status_code}")
            results.append(resp.status_code in [200, 401])
        except Exception as e:
            print(f"  [ERROR] {method} {path} -> {e}")
            results.append(False)
    
    return all(results)

def main():
    print("=" * 60)
    print("MAP Nexus API Test Suite")
    print("=" * 60)
    
    # Test health
    if not test_health():
        print("\n[FAIL] Health check failed. Is the server running?")
        print("  Start server: python -m app.api.main")
        sys.exit(1)
    
    # Test login
    token = test_login()
    
    # Test endpoints
    test_endpoints(token)
    
    print("\n" + "=" * 60)
    print("[DONE] Test complete")
    print("=" * 60)

if __name__ == "__main__":
    main()
