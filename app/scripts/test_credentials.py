import psycopg2
from app.services.credential_service import CredentialService

def main():
    conn = psycopg2.connect(
        host="localhost",
        dbname="migration_engine",
        user="postgres",
        password="dev123456"
    )

    #system_id = "a1b2c3d4-..."  # existing system
    

    #system_id = "99987703-20bf-4c48-a3c0-04e3f5be2d7d"  # system id for source db

    system_id = "80f1c83c-56d7-47fc-9487-debfc30b9360" # system id for target db

    service = CredentialService(conn)

    # 🔐 Insert or update
    credential_id = service.upsert_credentials(
        system_id=system_id,
        #username="migration_user_source",
        username="migration_user_target",
        #password="SuperSecureSource123!"  # password for source db
        password="SuperSecureTarget123!"  #password for target db
    )

    print("Credential ID:", credential_id)

    # 🔓 Fetch + decrypt
    creds = service.get_decrypted_credentials(system_id)

    print("Decrypted credentials:")
    print(creds)


if __name__ == "__main__":
    main()