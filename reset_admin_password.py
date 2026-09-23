import bcrypt
import psycopg2

conn = __import__('psycopg2').connect(
    dbname='migration_engine', 
    user='postgres', 
    password='dev123456', 
    host='localhost'
)
cur = conn.cursor()

# Generate new hash for "Admin123456"
new_hash = __import__('bcrypt').hashpw(b"Admin123456", __import__('bcrypt').gensalt()).decode()

# Update password and increment token_version (invalidates all sessions)
cur.execute("""
    UPDATE platform.users 
    SET password_hash = %s, 
        token_version = token_version + 1, 
        password_changed_at = NOW(),
        failed_login_attempts = 0,
        locked_until = NULL
    WHERE email = 'admin@mapnexus.com'
""", (bcrypt.hashpw(b"Admin123456", __import__('bcrypt').gensalt()).decode(),))

conn.commit()
print("Password reset to 'Admin123456', token_version incremented")

# Verify
cur.execute("SELECT email, token_version, failed_login_attempts, locked_until FROM platform.users WHERE email = 'admin@mapnexus.com'")
row = cur.fetchone()
print(f'User: {row}')
conn.close()