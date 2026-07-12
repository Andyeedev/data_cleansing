import argparse
from app.db.connection import get_db_connection
from app.services.credential_admin_service import CredentialAdminService


def main():
    parser = argparse.ArgumentParser(description="Update credential password")

    parser.add_argument("--username", required=True, help="Username to update")
    parser.add_argument("--password", required=True, help="New password")

    args = parser.parse_args()

    # ✅ connect to system DB
    engine_db = get_db_connection()

    service = CredentialAdminService(engine_db)

    try:
        result = service.update_password(
            username=args.username,
            new_password=args.password
        )

        print("✅ Password updated successfully")
        print(result)

    except Exception as e:
        print("❌ Error:", str(e))


if __name__ == "__main__":
    main()
