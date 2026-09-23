import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

# Clear checkpoint for E2E project to force full re-run
cur.execute('''
    DELETE FROM engine.batch_execution_checkpoint 
    WHERE batch_id IN (
        SELECT batch_id FROM engine.migration_batch_registry 
        WHERE project_id = %s
    )
''', ('819ee182-288f-4aff-a3bd-4b9459d4ba61',))
print('Cleared checkpoints:', cur.rowcount)
conn.commit()

conn.close()