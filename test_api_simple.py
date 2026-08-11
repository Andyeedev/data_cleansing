#!/usr/bin/env python3
import requests

base_url = "http://localhost:8000/api/v1"

print("Testing timeline summary endpoint...")
response = requests.get(f"{base_url}/migration/timeline/summary")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"Response: {response.json()}")
else:
    print(f"Error: {response.text}")

print("\nTesting timeline endpoint...")
response = requests.get(f"{base_url}/migration/timeline")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Response length: {len(data)}")
    if len(data) > 0:
        print(f"First item keys: {list(data[0].keys())}")
else:
    print(f"Error: {response.text}")