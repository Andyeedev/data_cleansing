import time
from collections import defaultdict
from fastapi import HTTPException, Request

# In-memory rate limiter: IP -> list of timestamps
_rate_limits_public: dict[str, list[float]] = defaultdict(list)

# In-memory rate limiter for plans endpoint (read-only, higher limit)
_rate_limits_plans: dict[str, list[float]] = defaultdict(list)


def rate_limit_public_endpoint(ip: str, max_requests: int = 5, window_seconds: int = 3600):
    """
    Rate limiter for Phase 1 public state-changing endpoints.
    Allows max_requests per window_seconds per IP.
    Default: 5 requests per hour per IP.
    """
    now = time.time()
    window_start = now - window_seconds
    # Remove timestamps outside the window
    _rate_limits_public[ip] = [t for t in _rate_limits_public[ip] if t > window_start]
    if len(_rate_limits_public[ip]) >= max_requests:
        retry_after = int(_rate_limits_public[ip][0] - window_start) + 1
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(retry_after)}
        )
    _rate_limits_public[ip].append(now)


def rate_limit_plans_endpoint(ip: str, max_requests: int = 30, window_seconds: int = 60):
    """
    Rate limiter for GET /api/v1/public/plans (read-only, higher limit).
    Default: 30 requests per minute per IP.
    """
    now = time.time()
    window_start = now - window_seconds
    _rate_limits_plans[ip] = [t for t in _rate_limits_plans[ip] if t > window_start]
    if len(_rate_limits_plans[ip]) >= max_requests:
        retry_after = int(_rate_limits_plans[ip][0] - window_start) + 1
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(retry_after)}
        )
    _rate_limits_plans[ip].append(now)


def rate_limit_authenticated_admin(ip: str, max_requests: int = 60, window_seconds: int = 60):
    """
    Rate limiter for authenticated admin endpoints.
    Allows max_requests per window_seconds per IP.
    Default: 60 requests per minute per IP.
    """
    now = time.time()
    window_start = now - window_seconds
    _rate_limits_authenticated_admin[ip] = [t for t in _rate_limits_authenticated_admin[ip] if t > window_start]
    if len(_rate_limits_authenticated_admin[ip]) >= max_requests:
        retry_after = int(_rate_limits_authenticated_admin[ip][0] - window_start) + 1
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(retry_after)}
        )
    _rate_limits_authenticated_admin[ip].append(now)


_rate_limits_authenticated_admin: dict[str, list[float]] = defaultdict(list)

def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"