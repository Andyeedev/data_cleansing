import sys
sys.path.insert(0, r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine')
from app.services.execution_history_service import ExecutionHistoryService
import json

svc = ExecutionHistoryService()

print("=== No filter - first 10 ===")
r = svc.get_execution_history(1, 10)
print(f"total={r['total']}, items={len(r['items'])}")
ids = []
for i in r['items']:
    bid = i['batch_id']
    dup = "DUPE" if bid in ids else ""
    ids.append(bid)
    print(f"  {bid[:8]}... name={i['batch_name'][:40]} project={i['project_id'][:8]}... {dup}")

print("\n=== Tenant filter - first 10 ===")
r = svc.get_execution_history(1, 10, tenant_id='aaf73536-2fd0-461e-87be-aa980cc1a8f1')
print(f"total={r['total']}, items={len(r['items'])}")
ids = []
for i in r['items']:
    bid = i['batch_id']
    dup = "DUPE" if bid in ids else ""
    ids.append(bid)
    print(f"  {bid[:8]}... name={i['batch_name'][:40]} project={i['project_id'][:8]}... {dup}")
