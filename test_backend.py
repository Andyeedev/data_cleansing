import json
import requests
import sys
import psycopg2

# Test if the backend API is running
base_url = "http://localhost:8000/api/v1"

# Try to test the auth endpoint first
print("Testing auth endpoints...")
response = requests.get(f"{base_url}/auth/login")
print(f"Auth endpoint status: {response.status_code}")

# Try the timeline endpoints
print("\nTesting timeline summary endpoint...")
try:
    response = requests.get(f"{base_url}/migration/timeline/summary")
    print(f"Timeline summary endpoint status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")

print("\nTesting timeline endpoint...")
try:
    response = requests.get(f"{base_url}/migration/timeline")
    print(f"Timeline endpoint status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response length: {len(response.json())}")
        print(f"Response: {response.json()[:2] if len(response.json()) > 0 else 'Empty'}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")

# Try to get the db tables
print("\nTesting database connection...")
try:
    conn = psycopg2.connect(
        host="localhost",
        database="appdb",
        user="postgres",
        password="postgres"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'engine' ORDER BY table_name;")
    tables = cursor.fetchall()
    print(f"Engine tables ({len(tables)}):")
    for table in tables:
        print(f"  - {table[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM engine.schedule_execution_log;")
    count = cursor.fetchone()
    print(f"schedule_execution_log count: {count[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM engine.migration_schedules;")
    count = cursor.fetchone()
    print(f"migration_schedules count: {count[0]}")
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Database connection error: {e}")