import psycopg2
import os

conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

cur.execute("SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%valid%'")
print('Tables:', cur.fetchall())

routes_dir = 'C:/Users/devwork/Desktop/projects/Financial_services_Migration_product/ver1.4/fs-migration-validation-engine/app/api/routes'
for f in os.listdir(routes_dir):
    if 'valid' in f.lower():
        print('Route file:', f)

conn.close()