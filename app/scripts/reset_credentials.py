import psycopg2
from app.utils.encryption_utils import EncryptionUtils

# How to run this utility from terminal: python -m app.scripts.reset_credentials

# 🔴 UPDATE THESE
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "migration_engine",
    "user": "postgres",
    "password": "dev123456"
}

SCHEMA = "core"  # correct schema


def reset_credentials():
    print("🔄 Starting credential reset...\n")

    # Step 1 — generate key
    key = EncryptionUtils.generate_key()

    print("\n⚠️ SAVE THIS KEY IN .env AS FERNET_KEY BEFORE CONTINUING\n")
    input("Press ENTER after saving key...")

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Step 2 — fetch all credentials
    cur.execute(f"""
        SELECT credential_id, username
        FROM {SCHEMA}.system_credentials
    """)
    rows = cur.fetchall()

    print(f"\nFound {len(rows)} credentials\n")

    for cred_id, username in rows:
        print(f"\n--- Updating {username} ---")

        # Step 3 — ask for NEW password
        new_password = input(f"Enter NEW password for {username}: ")

        encrypted = EncryptionUtils.encrypt(new_password, key)

        cur.execute(f"""
            UPDATE {SCHEMA}.system_credentials
            SET password_encrypted = %s
            WHERE credential_id = %s
        """, (encrypted, cred_id))

        print("✅ Updated")

    conn.commit()
    cur.close()
    conn.close()

    print("\n🎉 ALL CREDENTIALS RESET SUCCESSFULLY\n")


if __name__ == "__main__":
    reset_credentials()