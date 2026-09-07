from fastapi import Header, HTTPException, Depends, Request, Response
from jose import jwt, JWTError
from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM
from app.db.connection import get_db_connection

COOKIE_NAME = "access_token"


def _extract_token(request: Request, authorization: str = None):
    """Extract JWT from cookie first, then Authorization header."""
    token = request.cookies.get(COOKIE_NAME)
    if token:
        return token

    if authorization:
        if authorization.startswith("Bearer "):
            return authorization.split(" ")[1]
        return authorization

    return None


def _validate_token_version(payload: dict):
    """Check token_version against DB to support session invalidation."""
    user_id = payload.get("sub")
    token_version = payload.get("token_version")
    if user_id and token_version is not None:
        db = get_db_connection()
        with db.conn.cursor() as cur:
            cur.execute(
                "SELECT token_version FROM platform.users WHERE id = %s AND deleted_at IS NULL",
                (user_id,)
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=401, detail="User not found")
            db_version = row[0] or 0
            if token_version != db_version:
                raise HTTPException(status_code=401, detail="Session invalidated")


def get_current_user(request: Request, authorization: str = Header(None)):
    cached = getattr(request.state, 'user', None)
    if cached:
        return cached

    token = _extract_token(request, authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        _validate_token_version(payload)
        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user_with_tenant(request: Request, authorization: str = Header(None)):
    cached = getattr(request.state, 'user', None)
    if cached:
        if not cached.get("tenant_id"):
            raise HTTPException(status_code=403, detail="No tenant context")
        return cached

    token = _extract_token(request, authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if not payload.get("tenant_id"):
            raise HTTPException(status_code=403, detail="No tenant context")

        _validate_token_version(payload)
        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
