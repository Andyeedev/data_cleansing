import psycopg2
import json

conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()
cur.execute("SELECT tier, list_price, annual_price, monthly_price, entitlements FROM platform.plans WHERE tier = 'professional'")
row = cur.fetchone()
print(f'tier={row[0]}, list={row[1]}, annual={row[2]}, monthly={row[3]}')
ent = row[4]
for k, v in ent.items():
    print(f'  {k}: {v}')
conn.close()