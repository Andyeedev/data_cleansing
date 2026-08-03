from fastapi import Header, HTTPException, Depends, Request
from jose import jwt, JWTError
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM


def get_current_user(request: Request, authorization: str = Header(None)):
    cached = getattr(request.state, 'user', None)
    if cached:
        return cached

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        if authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
        else:
            token = authorization

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user_with_tenant(request: Request, authorization: str = Header(None)):
    cached = getattr(request.state, 'user', None)
    if cached:
        if not cached.get("tenant_id"):
            raise HTTPException(status_code=403, detail="No tenant context")
        return cached

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        if authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
        else:
            token = authorization

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if not payload.get("tenant_id"):
            raise HTTPException(status_code=403, detail="No tenant context")

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
