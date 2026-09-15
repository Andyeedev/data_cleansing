"""
Tests for Phase 1 rate limiting (public endpoints).
"""
import time
import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from fastapi.testclient import TestClient

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.api.routes.rate_limit_phase1 import (
    rate_limit_public_endpoint,
    rate_limit_plans_endpoint,
    get_client_ip,
    _rate_limits_public,
    _rate_limits_plans,
)
from app.api.routes.rate_limit import rate_limit_leads, _rate_limits


class TestRateLimitPublicEndpoints:
    """Test the Phase 1 public endpoint rate limiter (5/hr)."""

    def setup_method(self):
        _rate_limits_public.clear()

    def test_allows_requests_within_limit(self):
        """5 requests from same IP should all succeed."""
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.10", max_requests=5, window_seconds=3600)

    def test_blocks_request_over_limit(self):
        """6th request should raise 429."""
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.11", max_requests=5, window_seconds=3600)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_public_endpoint("192.168.1.11", max_requests=5, window_seconds=3600)
        assert exc_info.value.status_code == 429
        assert "Retry-After" in exc_info.value.headers

    def test_rate_limit_resets_after_window(self):
        """After window expires, requests should be allowed again."""
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.12", max_requests=5, window_seconds=1)
        with pytest.raises(HTTPException):
            rate_limit_public_endpoint("192.168.1.12", max_requests=5, window_seconds=1)
        time.sleep(1.1)
        rate_limit_public_endpoint("192.168.1.12", max_requests=5, window_seconds=1)

    def test_different_ips_are_independent(self):
        """Different IPs should have independent rate limits."""
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.13", max_requests=5, window_seconds=3600)
        rate_limit_public_endpoint("192.168.1.14", max_requests=5, window_seconds=3600)

    def test_rate_limit_returns_retry_after_header(self):
        """429 response should include Retry-After header."""
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.15", max_requests=5, window_seconds=3600)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_public_endpoint("192.168.1.15", max_requests=5, window_seconds=3600)
        assert "Retry-After" in exc_info.value.headers
        retry_after = int(exc_info.value.headers["Retry-After"])
        assert 1 <= retry_after <= 3600

    def test_custom_max_requests(self):
        """Rate limiter should respect custom max_requests."""
        for _ in range(3):
            rate_limit_public_endpoint("192.168.1.16", max_requests=3, window_seconds=3600)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_public_endpoint("192.168.1.16", max_requests=3, window_seconds=3600)
        assert exc_info.value.status_code == 429


class TestRateLimitPlansEndpoint:
    """Test the plans endpoint rate limiter (30/min)."""

    def setup_method(self):
        _rate_limits_plans.clear()

    def test_allows_requests_within_limit(self):
        for _ in range(30):
            rate_limit_plans_endpoint("192.168.1.20", max_requests=30, window_seconds=60)

    def test_blocks_over_limit(self):
        for _ in range(30):
            rate_limit_plans_endpoint("192.168.1.21", max_requests=30, window_seconds=60)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_plans_endpoint("192.168.1.21", max_requests=30, window_seconds=60)
        assert exc_info.value.status_code == 429


class TestGetClientIP:
    """Test client IP extraction."""

    def test_direct_client_ip(self):
        request = MagicMock()
        request.headers.get.return_value = None
        request.client.host = "10.0.0.1"
        assert get_client_ip(request) == "10.0.0.1"

    def test_x_forwarded_for_single(self):
        request = MagicMock()
        request.headers.get.return_value = "203.0.113.195"
        request.client.host = "10.0.0.1"
        assert get_client_ip(request) == "203.0.113.195"

    def test_x_forwarded_for_multiple(self):
        request = MagicMock()
        request.headers.get.return_value = "203.0.113.195, 70.41.3.18, 150.172.238.178"
        request.client.host = "10.0.0.1"
        assert get_client_ip(request) == "203.0.113.195"

    def test_no_client_fallback(self):
        request = MagicMock()
        request.headers.get.return_value = None
        request.client = None
        assert get_client_ip(request) == "unknown"


class TestExistingLeadsRateLimitUnaffected:
    """Verify existing /leads rate limiting still works."""

    def setup_method(self):
        _rate_limits.clear()

    def test_leads_limit_still_10_per_minute(self):
        """Leads endpoint should still allow 10/min."""
        for _ in range(10):
            rate_limit_leads("192.168.1.30", max_requests=10, window_seconds=60)
        with pytest.raises(HTTPException) as exc_info:
            rate_limit_leads("192.168.1.30", max_requests=10, window_seconds=60)
        assert exc_info.value.status_code == 429

    def test_leads_and_public_independent(self):
        """Leads and public rate limiters should not interfere."""
        for _ in range(10):
            rate_limit_leads("192.168.1.31", max_requests=10, window_seconds=60)
        # Public should still allow 5
        for _ in range(5):
            rate_limit_public_endpoint("192.168.1.31", max_requests=5, window_seconds=3600)
        with pytest.raises(HTTPException):
            rate_limit_public_endpoint("192.168.1.31", max_requests=5, window_seconds=3600)


class TestRateLimitIntegration:
    """Integration-style tests using TestClient."""

    def test_leads_endpoint_rate_limit_integration(self):
        """Test that /api/v1/leads POST still rate limits."""
        from app.api.main import app
        client = TestClient(app)

        # First 10 should succeed
        for i in range(10):
            response = client.post("/api/v1/leads", json={
                "full_name": f"Test User {i}",
                "work_email": f"test{i}@example.com",
                "company": "Test Corp",
                "industry": "Technology"
            })
            assert response.status_code == 200, f"Request {i+1} failed: {response.text}"

        # 11th should be 429
        response = client.post("/api/v1/leads", json={
            "full_name": "Test User 11",
            "work_email": "test11@example.com",
            "company": "Test Corp",
            "industry": "Technology"
        })
        assert response.status_code == 429
        assert "Retry-After" in response.headers