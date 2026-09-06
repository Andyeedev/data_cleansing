import time
from collections import defaultdict
from fastapi import HTTPException

# In-memory rate limiter: IP -> list of timestamps
_rate_limits: dict[str, list[float]] = defaultdict(list)

def rate_limit_leads(ip: str, max_requests: int = 10, window_seconds: int = 60):
    """
    Simple sliding window rate limiter for POST /leads.
    Allows max_requests per window_seconds per IP.
    """
    now = time.time()
    window_start = now - window_seconds
    # Remove timestamps outside the window
    _rate_limits[ip] = [t for t in _rate_limits[ip] if t > window_start]
    if len(_rate_limits[ip]) >= max_requests:
        retry_after = int(_rate_limits[ip][0] - window_start) + 1
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(retry_after)}
        )
    _rate_limits[ip].append(now)
