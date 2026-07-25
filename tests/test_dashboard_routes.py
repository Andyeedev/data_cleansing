from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user


def _mock_admin():
    return {"sub": "test@test.com", "role": "admin", "email": "test@test.com"}


def _mock_viewer():
    return {"sub": "viewer@test.com", "role": "viewer", "email": "viewer@test.com"}


def _get_client(user_override):
    app.dependency_overrides[get_current_user] = user_override
    return TestClient(app)


class TestDashboardPortfolioEndpoint:

    def test_get_portfolio_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/dashboard/portfolio")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_portfolio_has_required_fields(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/dashboard/portfolio")
        data = response.json()
        assert "total_systems" in data["data"]
        assert "total_batches" in data["data"]
        assert "total_controls" in data["data"]
        assert "active_batches" in data["data"]

    def test_get_portfolio_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/dashboard/portfolio")
        assert response.status_code == 403


class TestDashboardKPIsEndpoint:

    def test_get_kpis_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/dashboard/kpis")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_kpis_has_kpis_array(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/dashboard/kpis")
        data = response.json()
        assert "kpis" in data["data"]
        assert isinstance(data["data"]["kpis"], list)

    def test_get_kpis_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/dashboard/kpis")
        assert response.status_code == 403


class TestDashboardActivityEndpoint:

    def test_get_activity_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/dashboard/activity")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_activity_has_entries(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/dashboard/activity")
        data = response.json()
        assert "entries" in data["data"]
        assert isinstance(data["data"]["entries"], list)

    def test_get_activity_limit_parameter(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/dashboard/activity?limit=5")
        assert response.status_code == 200

    def test_get_activity_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/dashboard/activity")
        assert response.status_code == 403