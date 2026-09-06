"""
OC-SEC-001 — POST /leads Rate Limiting Tests

Tests for:
1. Rate limiter allows requests within limit
2. Rate limiter blocks requests over limit (429)
3. Rate limiter resets after window expires
4. Rate limiter is per-IP (different IPs don't affect each other)
"""
import time
import pytest
from unittest.mock import patch, MagicMock
from app.api.routes.rate_limit import rate_limit_leads, _rate_limits


class TestRateLimiter:
    """Test the in-memory rate limiter."""

    def setup_method(self):
        """Clear rate limits before each test."""
        _rate_limits.clear()

    def test_allows_requests_within_limit(self):
        """10 requests from same IP should all succeed."""
        for _ in range(10):
            rate_limit_leads("192.168.1.1", max_requests=10, window_seconds=60)

    def test_blocks_request_over_limit(self):
        """11th request should raise 429."""
        from fastapi import HTTPException
        for _ in range(10):
            rate_limit_leads("192.168.1.2", max_requests=10, window_seconds=60)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_leads("192.168.1.2", max_requests=10, window_seconds=60)
        assert exc_info.value.status_code == 429

    def test_rate_limit_resets_after_window(self):
        """After window expires, requests should be allowed again."""
        for _ in range(10):
            rate_limit_leads("192.168.1.3", max_requests=10, window_seconds=1)
        from fastapi import HTTPException
        with pytest.raises(HTTPException):
            rate_limit_leads("192.168.1.3", max_requests=10, window_seconds=1)
        # Wait for window to expire
        time.sleep(1.1)
        rate_limit_leads("192.168.1.3", max_requests=10, window_seconds=1)

    def test_different_ips_are_independent(self):
        """Different IPs should have independent rate limits."""
        for _ in range(10):
            rate_limit_leads("192.168.1.4", max_requests=10, window_seconds=60)
        # Different IP should still be allowed
        rate_limit_leads("192.168.1.5", max_requests=10, window_seconds=60)

    def test_rate_limit_returns_retry_after_header(self):
        """429 response should include Retry-After header."""
        from fastapi import HTTPException
        for _ in range(10):
            rate_limit_leads("192.168.1.6", max_requests=10, window_seconds=60)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_leads("192.168.1.6", max_requests=10, window_seconds=60)
        assert "Retry-After" in exc_info.value.headers

    def test_custom_max_requests(self):
        """Rate limiter should respect custom max_requests."""
        from fastapi import HTTPException
        for _ in range(3):
            rate_limit_leads("192.168.1.7", max_requests=3, window_seconds=60)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_leads("192.168.1.7", max_requests=3, window_seconds=60)
        assert exc_info.value.status_code == 429
