"""
Migration script to hash admin password and insert into platform.users.
Run once: python -m app.scripts.migrate_admin_password
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

import bcrypt
from app.db.connection import get_db_connection


def migrate():
    admin_email = os.getenv("APP_ADMIN_USER", "admin@mapnexus.com")
    admin_pass = os.getenv("APP_ADMIN_PASS", "admin123")

    password_hash = bcrypt.hashpw(admin_pass.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    db = get_db_connection()

    with db.conn.cursor() as cur:
        cur.execute("SELECT id FROM platform.users WHERE email = %s", (admin_email,))
        existing = cur.fetchone()

        if existing:
            cur.execute(
                "UPDATE platform.users SET password_hash = %s, status = 'active' WHERE email = %s",
                (password_hash, admin_email)
            )
            print(f"Updated existing user: {admin_email}")
        else:
            cur.execute(
                """INSERT INTO platform.users (email, password_hash, first_name, last_name, status)
                   VALUES (%s, %s, 'Admin', 'User', 'active')
                   RETURNING id""",
                (admin_email, password_hash)
            )
            user_id = cur.fetchone()[0]
            print(f"Created new user: {admin_email} (id={user_id})")

        db.conn.commit()

    print("Migration complete.")


if __name__ == "__main__":
    migrate()
