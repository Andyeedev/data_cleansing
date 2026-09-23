import psycopg2
import json

conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()

# Professional: Post-Migration only
prof_entitlements = {
    'discovery': True,
    'mapping': True,
    'validation': True,
    'basic_reporting': True,
    'single_project': True,
    'email_support': True,
    'post_migration_assurance': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        entitlements = %s
    WHERE tier = 'professional'
""", (round(25000 * 0.8 / 12, 2), json.dumps(prof_entitlements)))

# Enterprise: Pre + Post Migration Assurance
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
    'pre_post_migration_assurance': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        entitlements = %s
    WHERE tier = 'enterprise'
""", (round(75000 * 0.8 / 12, 2), json.dumps(ent_entitlements)))

# Enterprise Plus
ep_entitlements = {
    'discovery': True,
    'mapping': True,
    'validation': True,
    'advanced_reporting': True,
    'multi_project': True,
    'api_access': True,
    'audit_trail': True,
    'governance': True,
    'ai_insights': True,
    'custom_integrations': True,
    'dedicated_support': True,
    'multi_region': True,
    'sla': True,
    'pre_migration_assurance': True,
    'post_migration_assurance': True,
    'pre_post_migration_assurance': True
}
cur.execute("""
    UPDATE platform.plans SET
        monthly_price = %s,
        entitlements = %s
    WHERE tier = 'enterprise_plus'
""", (round(200000 * 0.8 / 12, 2), json.dumps(ep_entitlements)))

conn.commit()

# Verify
cur.execute('SELECT tier, monthly_price, entitlements FROM platform.plans ORDER BY annual_price')
for row in cur.fetchall():
    print(f'{row[0]}: monthly={row[1]}, entitlements={json.dumps(row[2], indent=2)}')

conn.close()