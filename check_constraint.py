import psycopg2
conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()
cur.execute("""
    SELECT conname, pg_get_constraintdef(oid) 
    FROM pg_constraint 
    WHERE conname = 'subscriptions_status_check'
""")
row = cur.fetchone()
print(f'Constraint: {row[0]}')
print(f'Definition: {row[1]}')
conn.close()