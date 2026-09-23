import psycopg2
import json

conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()

# List prices (undiscounted)
prof_list = 31250
ent_list = 93750
ep_list = 250000

# Professional: Post-Migration only
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
        list_price = %s,
        entitlements = %s
    WHERE tier = 'professional'
""", (round(prof_list / 12, 2), 25000.00, prof_list, json.dumps({
    'discovery': True, 'mapping': True, 'validation': True,
    'basic_reporting': True, 'single_project': True,
    'email_support': True, 'post_migration_assurance': True,
    'core_governance': True, 'multi_project': True,
    'api_access': True, 'priority_support': True
})))

# Enterprise
ent_entitlements = {
    'discovery': True, 'mapping': True, 'validation': True,
    'advanced_reporting': True, 'multi_project': True,
    'api_access': True, 'audit_trail': True, 'governance': True,
    'priority_support': True, 'pre_migration_assurance': True,
    'post_migration_assurance': True, 'pre_post_migration_assurance': True,
    'advanced_governance': True, 'reconciliation': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        annual_price = %s,
        list_price = %s,
        entitlements = %s
    WHERE tier = 'enterprise'
""", (round(93750 / 12, 2), 75000.00, 93750, json.dumps({
    'discovery': True, 'mapping': True, 'validation': True,
    'advanced_reporting': True, 'multi_project': True,
    'api_access': True, 'audit_trail': True, 'governance': True,
    'priority_support': True, 'pre_migration_assurance': True,
    'post_migration_assurance': True, 'pre_post_migration_assurance': True,
    'advanced_governance': True, 'reconciliation': True
})))

# Enterprise Plus
ep_entitlements = {
    'discovery': True, 'mapping': True, 'validation': True,
    'advanced_reporting': True, 'enterprise_reporting': True,
    'multi_project': True, 'api_access': True, 'audit_trail': True,
    'governance': True, 'advanced_governance': True,
    'enterprise_governance': True, 'ai_insights': True,
    'custom_integrations': True, 'dedicated_support': True,
    'multi_region': True, 'sla': True,
    'pre_migration_assurance': True, 'post_migration_assurance': True,
    'pre_post_migration_assurance': True, 'reconciliation': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        annual_price = %s,
        list_price = %s,
        entitlements = %s
    WHERE tier = 'enterprise_plus'
""", (round(250000 / 12, 2), 200000.00, 250000, json.dumps({
    'discovery': True, 'mapping': True, 'validation': True,
    'advanced_reporting': True, 'enterprise_reporting': True,
    'multi_project': True, 'api_access': True, 'audit_trail': True,
    'governance': True, 'advanced_governance': True,
    'enterprise_governance': True, 'ai_insights': True,
    'custom_integrations': True, 'dedicated_support': True,
    'multi_region': True, 'sla': True,
    'pre_migration_assurance': True, 'post_migration_assurance': True,
    'pre_post_migration_assurance': True, 'reconciliation': True
})))

conn.commit()

# Verify
cur.execute('SELECT tier, list_price, annual_price, monthly_price, entitlements FROM platform.plans ORDER BY annual_price')
for row in cur.fetchall():
    print(f'{row[0]}: list={row[1]}, annual={row[2]}, monthly={row[3]}')
    ent = row[4]
    for k, v in ent.items():
        print(f'  {k}: {v}')
    print()

conn.close()