import psycopg2
import json

conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()

# Professional: monthly = annual/12 (full price), annual with 20% discount
prof_entitlements = {
    'discovery': True,
    'mapping': True,
    'validation': True,
    'basic_reporting': True,
    'single_project': True,
    'email_support': True,
    'post_migration_assurance': True,
    'core_governance': True,
    'multi_project': True,
    'api_access': True,
    'priority_support': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        annual_price = %s,
        entitlements = %s
    WHERE tier = 'professional'
""", (round(25000 / 12, 2), 25000.00, json.dumps(prof_entitlements)))

# Enterprise
ent_entitlements = {
    'discovery': True,
    'mapping': True,
    'validation': True,
    'advanced_reporting': True,
    'multi_project': True,
    'api_access': True,
    'audit_trail': True,
    'governance': True,
    'priority_support': True,
    'pre_migration_assurance': True,
    'post_migration_assurance': True,
    'pre_post_migration_assurance': True,
    'advanced_governance': True,
    'reconciliation': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        annual_price = %s,
        entitlements = %s
    WHERE tier = 'enterprise'
""", (round(75000 / 12, 2), 75000.00, json.dumps(ent_entitlements)))

# Enterprise Plus: "from £200,000/year starting price"
ep_entitlements = {
    'discovery': True,
    'mapping': True,
    'validation': True,
    'advanced_reporting': True,
    'enterprise_reporting': True,
    'multi_project': True,
    'api_access': True,
    'audit_trail': True,
    'governance': True,
    'advanced_governance': True,
    'enterprise_governance': True,
    'ai_insights': True,
    'custom_integrations': True,
    'dedicated_support': True,
    'multi_region': True,
    'sla': True,
    'pre_migration_assurance': True,
    'post_migration_assurance': True,
    'pre_post_migration_assurance': True,
    'reconciliation': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        annual_price = %s,
        entitlements = %s
    WHERE tier = 'enterprise_plus'
""", (round(200000 / 12, 2), 200000.00, json.dumps(ep_entitlements)))

conn.commit()

# Verify
cur.execute('SELECT tier, monthly_price, annual_price, entitlements FROM platform.plans ORDER BY annual_price')
for row in cur.fetchall():
    print(f'{row[0]}: monthly={row[1]}, annual={row[2]}, entitlements={json.dumps(row[3], indent=2)}')

conn.close()