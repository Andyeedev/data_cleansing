import requests
import os
import psycopg2

# Test with Tenant Admin (e2e-admin)
login_resp = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'username': 'e2e-admin@e2e-validation.com',
    'password': 'Admin123'
})
cookies = login_resp.cookies
print('E2E Admin Login:', login_resp.status_code)

# 1. Entitlement mismatch - test execution endpoint
resp = requests.post(
    'http://localhost:8000/api/v1/execution/run?project_id=819ee182-288f-4aff-a3bd-4b9459d4ba61&batch_name=Test&tenant_id=74dff1e4-7684-4fe7-8e38-915627120c8a',
    cookies=cookies
)
print('1. Entitlement mismatch (execution/run):', resp.status_code, resp.text[:200])

# 2. MetadataIntelligenceService - check if infer_column_roles is called
conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
cur = conn.cursor()

cur.execute("""
    SELECT column_name, inferred_role FROM core.dataset_columns 
    WHERE mapping_id IN (
        SELECT mapping_id FROM core.dataset_mappings 
        WHERE project_id = (SELECT project_id FROM core.projects WHERE tenant_id = %s)
    )
""", ('74dff1e4-7684-4fe7-8e38-915627120c8a',))
rows = cur.fetchall()
print('\n2. MetadataIntelligenceService - inferred_role status:')
for r in rows:
    print('  ' + r[0] + ': ' + str(r[1]))

# 3. Check core.leads.status column
cur.execute("""
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'core' AND table_name = 'leads' AND column_name = 'status'
""")
row = cur.fetchone()
print('\n3. core.leads.status column exists:', 'YES' if row else 'NO')

# 4. Super Admin project limit - check if default tenant has projects
cur.execute("SELECT COUNT(*) FROM core.projects WHERE tenant_id = %s", ('aaf73536-2fd0-461e-87be-aa980cc1a8f1',))
count = cur.fetchone()[0]
print('\n4. Super Admin (Default Tenant) project count:', count)

# 5. Stripe config check
print('\n5. Stripe env vars:')
for k in ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_PROFESSIONAL_MONTHLY', 'STRIPE_PRICE_PROFESSIONAL_ANNUAL', 'STRIPE_PRICE_ENTERPRISE_MONTHLY', 'STRIPE_PRICE_ENTERPRISE_ANNUAL', 'STRIPE_PRICE_ENTERPRISE_PLUS_MONTHLY', 'STRIPE_PRICE_ENTERPRISE_PLUS_ANNUAL']:
    val = os.environ.get(k)
    print('  ' + k + ': ' + ('SET' if val else 'NOT SET'))

# 6. Check reporting/reconciliation endpoints
login_resp = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'username': 'e2e-admin@e2e-validation.com',
    'password': 'Admin123'
})
cookies = login_resp.cookies

print('\n6. Reporting/Reconciliation endpoints:')
resp = requests.get('http://localhost:8000/api/v1/reports/suite?tenant_id=74dff1e4-7684-4fe7-8e38-915627120c8a', cookies=cookies)
print('Report Suite:', 'OK' if resp.status_code == 200 else ('FAIL (' + str(resp.status_code) + ')'))

resp = requests.get('http://localhost:8000/api/v1/execution/dashboard', cookies=cookies)
print('Execution Dashboard:', 'OK' if resp.status_code == 200 else ('FAIL (' + str(resp.status_code) + ')'))

# Check for reconciliation endpoints
resp = requests.get('http://localhost:8000/api/v1/reconciliation', cookies=cookies)
print('Reconciliation endpoint:', 'OK' if resp.status_code == 200 else ('NOT FOUND (' + str(resp.status_code) + ')'))

conn.close()