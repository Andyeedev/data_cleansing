import psycopg2
from datetime import datetime

conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
with conn.cursor() as cur:
    cur.execute("""
        SELECT invitation_id, email, status, expires_at, accepted_at, created_at
        FROM platform.invitations 
        WHERE token = '2e1ef409eb0d4731befe132da8ee1894'
    """)
    row = cur.fetchone()
    if row:
        print(f'invitation_id: {row[0]}')
        print(f'email: {row[1]}')
        print(f'status: {row[2]}')
        print(f'expires_at: {row[3]}')
        print(f'accepted_at: {row[4]}')
        print(f'created_at: {row[5]}')
        print(f'Now: {datetime.utcnow()}')
        print(f'Expired: {row[3] < datetime.utcnow()}')
    else:
        print('Token NOT FOUND in database')