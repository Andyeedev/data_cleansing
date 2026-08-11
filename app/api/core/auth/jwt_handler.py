from jose import jwt
import datetime
from .jwt_config import SECRET_KEY, ALGORITHM


def create_token(data: dict, expires_minutes: int = 60):
    payload = data.copy()
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes)

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
