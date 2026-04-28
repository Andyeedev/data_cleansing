from fastapi import Header, HTTPException
from jose import jwt, JWTError

from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM


def get_current_user(authorization: str = Header(None)):

    print("🔐 HEADER:", authorization)

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = authorization.replace("Bearer ", "").strip()

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        print("✅ PAYLOAD:", payload)

        return payload

    except JWTError as e:
        print("❌ JWT ERROR:", str(e))
        raise HTTPException(status_code=401, detail="Invalid token")