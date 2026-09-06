"""
OC-SEC-001 — Website Security Assessment Implementation Tests

Tests for:
1. Tailwind CSS self-hosting (no CDN reference)
2. Chart.js SRI integrity hash
3. CSP report-only header present
4. Security headers present
5. work_email_hash removed from lead service
6. robots.txt present and correctly configured
"""
import pytest
import json
import os
from pathlib import Path


# Root of the project (fs-migration-validation-engine)
ROOT = Path(__file__).parent.parent
WEBSITE_DIR = ROOT / "engineering" / "MAP_V2" / "02_Output" / "08_Soft_Launch" / "Website_Prepared"


class TestTailwindSelfHosting:
    """Verify Tailwind CSS is self-hosted, not from CDN."""

    def test_no_cdn_reference_in_index(self):
        content = (WEBSITE_DIR / "index.html").read_text(encoding="utf-8")
        assert "cdn.tailwindcss.com" not in content, "CDN Tailwind reference still present in index.html"

    def test_local_css_reference_in_index(self):
        content = (WEBSITE_DIR / "index.html").read_text(encoding="utf-8")
        assert 'href="css/tailwind.min.css"' in content, "Local CSS reference not found in index.html"

    def test_tailwind_css_file_exists(self):
        css_path = WEBSITE_DIR / "css" / "tailwind.min.css"
        assert css_path.exists(), "tailwind.min.css not found"
        assert css_path.stat().st_size > 1000, f"tailwind.min.css too small ({css_path.stat().st_size} bytes)"


class TestChartJSIntegrity:
    """Verify Chart.js has SRI integrity hash."""

    def test_chartjs_has_integrity(self):
        content = (WEBSITE_DIR / "index.html").read_text(encoding="utf-8")
        assert 'integrity="sha384-' in content, "Chart.js missing SRI integrity hash"

    def test_chartjs_has_crossorigin(self):
        content = (WEBSITE_DIR / "index.html").read_text(encoding="utf-8")
        assert 'crossorigin="anonymous"' in content, "Chart.js missing crossorigin attribute"

    def test_no_cdn_tailwind_in_any_file(self):
        for html_file in WEBSITE_DIR.glob("*.html"):
            content = html_file.read_text(encoding="utf-8")
            assert "cdn.tailwindcss.com" not in content, f"CDN reference found in {html_file.name}"


class TestSecurityHeaders:
    """Verify security headers are configured in staticwebapp.config.json."""

    def test_config_exists(self):
        assert (WEBSITE_DIR / "staticwebapp.config.json").exists(), "staticwebapp.config.json not found"

    def test_csp_header_present(self):
        with open(WEBSITE_DIR / "staticwebapp.config.json") as f:
            config = json.load(f)
        assert "headers" in config or "globalHeaders" in config, "No headers section in config"

    def test_csp_report_only_present(self):
        with open(WEBSITE_DIR / "staticwebapp.config.json") as f:
            config = json.load(f)
        headers = config.get("headers", {})
        assert "Content-Security-Policy-Report-Only" in headers, "CSP Report-Only header missing"

    def test_x_content_type_options(self):
        with open(WEBSITE_DIR / "staticwebapp.config.json") as f:
            config = json.load(f)
        headers = config.get("globalHeaders", config.get("headers", {}))
        assert "X-Content-Type-Options" in headers, "X-Content-Type-Options header missing"

    def test_x_frame_options(self):
        with open(WEBSITE_DIR / "staticwebapp.config.json") as f:
            config = json.load(f)
        headers = config.get("globalHeaders", config.get("headers", {}))
        assert "X-Frame-Options" in headers, "X-Frame-Options header missing"

    def test_hsts_header(self):
        with open(WEBSITE_DIR / "staticwebapp.config.json") as f:
            config = json.load(f)
        headers = config.get("globalHeaders", config.get("headers", {}))
        assert "Strict-Transport-Security" in headers, "HSTS header missing"

    def test_permissions_policy(self):
        with open(WEBSITE_DIR / "staticwebapp.config.json") as f:
            config = json.load(f)
        headers = config.get("globalHeaders", config.get("headers", {}))
        assert "Permissions-Policy" in headers, "Permissions-Policy header missing"


class TestWorkEmailHashRemoved:
    """Verify work_email_hash is no longer sent to database."""

    def test_no_work_email_hash_in_insert(self):
        content = (ROOT / "app" / "services" / "lead_service.py").read_text(encoding="utf-8")
        assert "work_email_hash" not in content, "work_email_hash still referenced in lead_service.py"

    def test_insert_query_no_hash_column(self):
        content = (ROOT / "app" / "services" / "lead_service.py").read_text(encoding="utf-8")
        if "INSERT" in content:
            insert_section = content.split("INSERT")[1]
            assert "work_email_hash" not in insert_section, "work_email_hash still in INSERT query"


class TestRobotsTxt:
    """Verify robots.txt exists and blocks sensitive paths."""

    def test_robots_txt_exists(self):
        assert (WEBSITE_DIR / "robots.txt").exists(), "robots.txt not found"

    def test_blocks_admin_path(self):
        content = (WEBSITE_DIR / "robots.txt").read_text(encoding="utf-8")
        assert "Disallow: /admin/" in content, "robots.txt does not block /admin/"

    def test_blocks_api_path(self):
        content = (WEBSITE_DIR / "robots.txt").read_text(encoding="utf-8")
        assert "Disallow: /api/" in content, "robots.txt does not block /api/"

    def test_has_sitemap(self):
        content = (WEBSITE_DIR / "robots.txt").read_text(encoding="utf-8")
        assert "Sitemap:" in content, "robots.txt missing sitemap reference"
