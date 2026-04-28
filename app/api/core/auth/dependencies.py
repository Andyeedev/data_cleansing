from fastapi import Header, HTTPException
from jose import jwt, JWTError

#from app.api.core.jwt_config import SECRET_KEY, ALGORITHM
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM


def get_current_user(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        # ✅ handle BOTH cases safely
        if authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
        else:
            token = authorization

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")