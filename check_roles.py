import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
with conn.cursor() as cur:
    # Check user roles
    cur.execute("""
        SELECT u.email, r.name 
        FROM platform.users u 
        LEFT JOIN platform.user_roles ur ON ur.user_id = u.id 
        LEFT JOIN platform.roles r ON r.id = ur.role_id 
        WHERE u.email = %s
    """, ('admin@mapnexus.com',))
    rows = cur.fetchall()
    print("User roles for admin@mapnexus.com:", rows)
    
    # Also check all users with their roles
    cur.execute("""
        SELECT u.email, array_agg(r.name) as roles
        FROM platform.users u 
        LEFT JOIN platform.user_roles ur ON ur.user_id = u.id 
        LEFT JOIN platform.roles r ON r.id = ur.role_id 
        GROUP BY u.email
    """)
    all_users = cur.fetchall()
    print("All users with roles:", all_users)