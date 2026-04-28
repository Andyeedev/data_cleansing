import jwt
import datetime

SECRET_KEY = "my_super_secret_key_1234567890_very_secure"
ALGORITHM = "HS256"


def create_token(data: dict, expires_minutes: int = 60):
    payload = data.copy()
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes)

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])